#!/usr/bin/env node
'use strict';
/*
 * 中国大陆市场 SEO / AEO / GEO 适配注入（幂等后处理）。
 *
 * 为什么是后处理脚本而不是改生成器：
 *   63 个页面里既有生成器产出，也有手写页（knowledge/*、contact、about 等）。
 *   改 site-lib.js 只能覆盖生成器那一半，且重跑生成器会覆盖手工修订。
 *   这里的注入按 <!-- cn-seo:start --> 标记判重，可反复执行。
 *
 * 处理内容：
 *   1) 百度/国产浏览器适配 meta —— 防转码、防轻应用改写、声明响应式、强制极速内核
 *   2) Organization 结构化数据增强 —— 补 entity 信号（别名/领域/覆盖区域/资质/营业时间）
 *   3) 页脚 ICP 备案位 —— 号码由 SITE_CONFIG.icp 提供，为空则不渲染（不编造备案号）
 *   4) 速答块补齐 —— 仅对「有 FAQ 正文但缺速答」的页面，用首条问答生成，不新造事实
 *
 * 用法: node scripts/inject-cn-seo.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

/* ---------------- 站点配置（备案号等由运维填写） ---------------- */
const SITE_CONFIG = {
  // ICP 备案号：在工信部备案系统取得后填入，例如 '粤ICP备2024xxxxxx号-1'
  // 大陆市场必备 —— 百度对未备案站点的抓取配额与信任度明显更低，且属《互联网信息服务管理办法》要求。
  icp: '',
  // 公安联网备案号（可选），例如 '粤公网安备 4403xxxxxxxxxxx号'
  police: '',
};

/* ---------------- 1. 大陆浏览器/搜索引擎适配 meta ---------------- */
const CN_META = [
  '<!-- cn-seo:start —— 中国大陆市场适配（由 scripts/inject-cn-seo.js 生成，勿手改） -->',
  '<meta http-equiv="Cache-Control" content="no-transform">',
  '<meta http-equiv="Cache-Control" content="no-siteapp">',
  '<meta name="applicable-device" content="pc,mobile">',
  '<meta name="renderer" content="webkit">',
  '<meta name="force-rendering" content="webkit">',
  '<!-- cn-seo:end -->',
].join('\n');

/* ---------------- 2. Organization 增强 ---------------- */
// 只补充可由站点既有事实推导出的字段；不写入未经核实的资质编号、社交账号或地理坐标。
const ORG_ENHANCE = {
  '@type': ['Organization', 'ProfessionalService'],
  description:
    '华企环球（深圳）国际咨询有限公司，马来西亚 SSM 持牌公司秘书机构，为企业出海提供海外公司注册、银行开户、年审审计、税务规划、VAT/EPR 合规、国际商标专利、ODI 备案与 VIE/红筹架构等一站式服务，覆盖全球 60 多个国家/地区。',
  slogan: '企业出海一站式服务平台',
  knowsLanguage: ['zh-CN', 'en'],
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 300 },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '09:00',
      closes: '21:00',
    },
  ],
  areaServed: [
    'SG', 'HK', 'US', 'MY', 'TH', 'UK', 'JP', 'KR', 'AE', 'VN', 'ID',
  ].map((c) => ({ '@type': 'Country', name: c })),
  knowsAbout: [
    '海外公司注册',
    '离岸公司架构',
    '香港公司审计与报税',
    '新加坡 ACRA 年审',
    '马来西亚 SSM 公司秘书',
    '跨境银行开户',
    'VAT 与 EPR 合规',
    '国际商标注册',
    'PCT 国际专利',
    'ODI 境外投资备案',
    'VIE 与红筹架构',
    '37 号文外汇登记',
  ],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'license',
    name: '马来西亚公司委员会（SSM）持牌公司秘书机构',
  },
  parentOrganization: undefined,
};

function enhanceOrg(org) {
  const out = Object.assign({}, org);
  for (const [k, v] of Object.entries(ORG_ENHANCE)) {
    if (v === undefined) continue;
    if (k === '@type' || out[k] === undefined) out[k] = v;
  }
  // 顺序：把增强字段排在 contactPoint 之后，读起来更自然
  return out;
}

function deepReplaceOrg(html) {
  // 全站 Organization @type 唯一（单个变体），直接按 @id 定位并替换 JSON 体
  let changed = 0;
  html = html.replace(
    /<script type="application\/ld\+json">\s*(\{[\s\S]*?"@id":\s*"https:\/\/hq10000\.com\/#organization"[\s\S]*?\})\s*<\/script>/g,
    (m, body) => {
      let obj;
      try {
        obj = JSON.parse(body);
      } catch (e) {
        return m;
      }
      if (!obj || obj['@type'] !== 'Organization') return m;
      const next = enhanceOrg(obj);
      changed++;
      return '<script type="application/ld+json">\n' + JSON.stringify(next, null, 2) + '\n</script>';
    },
  );
  return { html, changed };
}

/* ---------------- 3. 页脚备案位 ---------------- */
function injectFiling(html) {
  const parts = [];
  if (SITE_CONFIG.icp) {
    parts.push(
      `<a href="https://beian.miit.gov.cn/" target="_blank" rel="nofollow noopener">${SITE_CONFIG.icp}</a>`,
    );
  }
  if (SITE_CONFIG.police) {
    parts.push(
      `<a href="https://beian.mps.gov.cn/" target="_blank" rel="nofollow noopener">${SITE_CONFIG.police}</a>`,
    );
  }
  if (!parts.length) return { html, changed: 0 };
  const block =
    '<!-- cn-seo:filing:start --><div class="footer-filing" style="margin-top:6px;font-size:12px;opacity:.75;display:flex;gap:14px;flex-wrap:wrap;justify-content:center;">' +
    parts.join('') +
    '</div><!-- cn-seo:filing:end -->';
  if (html.includes('cn-seo:filing:start')) return { html, changed: 0 };
  const MARK = '<div class="footer-disclaimer">';
  if (!html.includes(MARK)) return { html, changed: 0 };
  return { html: html.replace(MARK, block + MARK), changed: 1 };
}

/* ---------------- 4. 速答块补齐 ---------------- */
// 「速答」是页面顶部一段可被 AI 引擎整段摘录的直答。
// 生成器产出的页面（country/*、部分 services/*）已有该块；手写页缺。
// 这里的补法：取本页 FAQ 中与页面主题最相关的一条问答，原样前置到 H1 之后 —— 不新增事实。
const ANSWER_START = '<!-- cn-seo:answer:start -->';
const ANSWER_END = '<!-- cn-seo:answer:end -->';

function stripInjectedAnswer(html) {
  const i = html.indexOf(ANSWER_START);
  if (i < 0) return { html, removed: 0 };
  const j = html.indexOf(ANSWER_END);
  if (j < 0) return { html, removed: 0 };
  return { html: html.slice(0, i) + html.slice(j + ANSWER_END.length), removed: 1 };
}

const STOP = new Set(['怎么', '如何', '什么', '哪些', '多少', '需要', '可以', '是否', '指南', '全攻', '攻略', '对比', '区别', '一个', '我们', '华企', '环球']);

function bigrams(s) {
  const out = new Set();
  for (const seg of String(s).match(/[\u4e00-\u9fa5]{2,}/g) || []) {
    for (let i = 0; i < seg.length - 1; i++) {
      const bg = seg.slice(i, i + 2);
      if (!STOP.has(bg)) out.add(bg);
    }
  }
  return out;
}

function faqList(html) {
  const re = /<div class="faq-item">\s*<div class="faq-q">([\s\S]*?)<\/div>\s*<div class="faq-a">([\s\S]*?)<\/div>/g;
  const clean = (s) =>
    String(s)
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&middot;/g, '·')
      .replace(/^\s*[QA]\s*[:：]\s*/, '')
      .replace(/\s+/g, ' ')
      .trim();
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const q = clean(m[1]);
    const a = clean(m[2]);
    if (q && a) out.push({ q, a });
  }
  return out;
}

// 选与本页主题最贴合的问答：与 <h1> 共享 2-gram 最多者；并列取靠前的
function pickFaq(html) {
  const list = faqList(html);
  if (!list.length) return null;
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1].replace(/<[^>]*>/g, '');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
  const target = bigrams(h1 + ' ' + title);
  let best = list[0];
  let bestScore = -1;
  for (const f of list) {
    const qb = bigrams(f.q);
    let score = 0;
    for (const b of qb) if (target.has(b)) score++;
    if (score > bestScore) {
      bestScore = score;
      best = f;
    }
  }
  return bestScore > 0 ? best : list[0];
}

function injectAnswer(html) {
  // 重跑友好：先摘掉上次注入的块，再按当前位置重建
  const stripped = stripInjectedAnswer(html);
  html = stripped.html;

  // 生成器已产出的速答（无我们的标记）→ 不重复
  if (html.includes('>速答<')) return { html, changed: stripped.removed === 0 ? 0 : -1 };

  const faq = pickFaq(html);
  if (!faq) return { html, changed: 0 };

  // 过长则截到句子边界
  let a = faq.a;
  if (a.length > 220) {
    const cut = a.slice(0, 220);
    const stop = Math.max(cut.lastIndexOf('。'), cut.lastIndexOf('；'), cut.lastIndexOf('. '));
    a = (stop > 80 ? cut.slice(0, stop + 1) : cut) + '……';
  }
  const block =
    ANSWER_START + '\n' +
    '<section class="section" style="padding-top:0;"><div class="container container-sm">' +
    '<div class="info-card" style="text-align:left;padding:16px 20px;">' +
    '<div class="info-label">速答</div>' +
    `<p style="margin:8px 0 6px;font-size:15px;line-height:1.8;color:var(--c-text);"><strong>${faq.q}</strong></p>` +
    `<p style="margin:0;font-size:15px;line-height:1.8;color:var(--c-text);">${a}</p>` +
    '</div></div></section>\n' +
    ANSWER_END;

  const MAIN = '<main id="main-content">';
  const mi = html.indexOf(MAIN);
  if (mi < 0) return { html, changed: 0 };

  // 放在首个 </section>（页面 hero）之后 —— 保证 H1 仍是正文第一个标题
  const secEnd = html.indexOf('</section>', mi);
  let at;
  if (secEnd >= 0 && secEnd - mi < 4000) {
    at = secEnd + '</section>'.length;
  } else {
    at = mi + MAIN.length;
  }
  html = html.slice(0, at) + '\n' + block + html.slice(at);
  return { html, changed: 1 };
}

/* ---------------- 主流程 ---------------- */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name.startsWith('.')) continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.endsWith('.html')) out.push(abs);
  }
  return out;
}

const files = walk(ROOT);
let stat = { meta: 0, org: 0, filing: 0, answer: 0, skipMeta: 0, fail: [] };

for (const abs of files) {
  const rel = path.relative(ROOT, abs);
  let html = fs.readFileSync(abs, 'utf8');
  const before = html;

  // 1) meta —— 插在 charset 之后
  if (html.includes('<!-- cn-seo:start')) {
    stat.skipMeta++;
  } else if (html.includes('<meta charset="UTF-8">')) {
    html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n' + CN_META);
    stat.meta++;
  } else {
    stat.fail.push(rel + ' (无 charset)');
  }

  // 2) Organization 增强
  const r1 = deepReplaceOrg(html);
  html = r1.html;
  if (r1.changed) stat.org++;

  // 3) 备案位
  const r2 = injectFiling(html);
  html = r2.html;
  if (r2.changed) stat.filing++;

  // 4) 速答
  const r3 = injectAnswer(html);
  html = r3.html;
  if (r3.changed > 0) stat.answer++;

  if (html !== before) {
    if (DRY) {
      console.log('  ~ ' + rel);
    } else {
      // 写入前做一次 JSON-LD 全量校验，避免把坏结构落盘
      const bad = [];
      for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        try {
          JSON.parse(m[1]);
        } catch (e) {
          bad.push(String(e).slice(0, 60));
        }
      }
      if (bad.length) {
        stat.fail.push(rel + ' (JSON-LD 校验失败: ' + bad[0] + ')');
        continue;
      }
      fs.writeFileSync(abs, html);
    }
  }
}

console.log(
  `\n${DRY ? '[DRY RUN] ' : ''}页面 ${files.length} 个 —— meta ${stat.meta} / org ${stat.org} / 备案位 ${stat.filing} / 速答 ${stat.answer} / 已存在 ${stat.skipMeta}`,
);
if (stat.fail.length) {
  console.log('失败:');
  stat.fail.forEach((f) => console.log('  ✗ ' + f));
  process.exitCode = 1;
}

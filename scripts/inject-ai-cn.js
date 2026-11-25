#!/usr/bin/env node
'use strict';
/*
 * 中国大陆 AI / GEO 友好层（幂等后处理）
 *
 * 解决的问题：
 *   1) 全站没有 hreflang，中文站点未向检索系统显式声明 zh-CN / x-default
 *   2) Article 的 author 是只有 name/url 的孤立 Organization，未挂到 #organization 实体
 *   3) 知识页与部分国家页没有「官方来源」，AI 回答引擎缺少可核验的引用锚点
 *   4) 文章页缺少 article:published_time / article:modified_time 可见元数据
 *   5) 部分 WebPage 缺 inLanguage / isPartOf
 *
 * 约束：
 *   - 只改可索引页面，404 跳过
 *   - 不新增未核实的事实；官方来源只列监管机构官网
 *   - 每个页面用 ai-cn:source 标记判重；重复运行必须 0 变更
 *
 * 用法: node scripts/inject-ai-cn.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');
const SITE = 'https://hq10000.com';
const AUTHOR = '华企环球（深圳）国际咨询有限公司';
const SOURCE_DATE = '2026-11-25';

const SOURCE_START = '<!-- ai-cn:source:start -->';
const SOURCE_END = '<!-- ai-cn:source:end -->';

/* —— 官方来源：只使用监管机构/政府官网首页；不臆造具体条款 URL —— */
const ACRA = { name: 'ACRA（新加坡会计与企业管制局）', url: 'https://www.acra.gov.sg/' };
const IRAS = { name: 'IRAS（新加坡税务局）', url: 'https://www.iras.gov.sg/' };
const SSM = { name: 'SSM（马来西亚公司委员会）', url: 'https://www.ssm.com.my/' };
const DBD = { name: 'DBD（泰国商业发展厅）', url: 'https://www.dbd.go.th/' };
const CR = { name: '香港公司注册处', url: 'https://www.cr.gov.hk/' };
const IRD = { name: '香港税务局', url: 'https://www.ird.gov.hk/' };
const HKMA = { name: '香港金融管理局', url: 'https://www.hkma.gov.hk/' };
const CUSTOMS = { name: '香港海关', url: 'https://www.customs.gov.hk/' };
const HKICPA = { name: '香港会计师公会', url: 'https://www.hkicpa.org.hk/' };
const COMPANIES_HOUSE = { name: '英国 Companies House', url: 'https://www.gov.uk/government/organisations/companies-house' };
const IRS = { name: '美国国税局（IRS）', url: 'https://www.irs.gov/' };
const FINCEN = { name: '美国 FinCEN', url: 'https://www.fincen.gov/' };
const AICPA = { name: '美国注册会计师协会（AICPA）', url: 'https://www.aicpa-cima.com/' };
const SAFE = { name: '国家外汇管理局', url: 'https://www.safe.gov.cn/' };
const NDRC = { name: '国家发展改革委', url: 'https://www.ndrc.gov.cn/' };
const MOFCOM = { name: '商务部', url: 'http://www.mofcom.gov.cn/' };
const CSRC = { name: '中国证监会', url: 'http://www.csrc.gov.cn/' };
const OECD = { name: 'OECD', url: 'https://www.oecd.org/' };
const CIREG = { name: '开曼群岛公司注册处', url: 'https://www.ciregistry.ky/' };
const BVIFSC = { name: 'BVI 金融服务委员会', url: 'https://www.bvifsc.vg/' };
const EU_TAX = { name: '欧盟委员会税务与海关总署', url: 'https://taxation-customs.ec.europa.eu/' };
const HMRC = { name: '英国税务海关总署（HMRC）', url: 'https://www.gov.uk/government/organisations/hm-revenue-customs' };
const WIPO = { name: '世界知识产权组织（WIPO）', url: 'https://www.wipo.int/' };
const EUIPO = { name: '欧盟知识产权局（EUIPO）', url: 'https://euipo.europa.eu/' };
const CNIPA = { name: '中国国家知识产权局', url: 'https://www.cnipa.gov.cn/' };
const MAS = { name: '新加坡金融管理局（MAS）', url: 'https://www.mas.gov.sg/' };
const MOJ_JP = { name: '日本法务省', url: 'https://www.moj.go.jp/' };
const SC_KOREA = { name: '韩国大法院登记所', url: 'https://www.scourt.go.kr/' };
const DED = { name: '迪拜经济局（DED）', url: 'https://www.ded.ae/' };
const MPI_VN = { name: '越南计划投资部', url: 'https://www.mpi.gov.vn/' };
const OSS_ID = { name: '印尼 OSS 投资许可系统', url: 'https://oss.go.id/' };
const USA_GOV = { name: '美国小企业管理局（SBA）', url: 'https://www.sba.gov/business-guide' };
const ISCA = { name: '新加坡特许会计师协会（ISCA）', url: 'https://isca.org.sg/' };

const SOURCES = {
  'knowledge/cayman-vs-bvi': [CIREG, BVIFSC],
  'knowledge/china-37-document': [SAFE],
  'knowledge/cross-border-compliance': [EU_TAX, HMRC],
  'knowledge/hk-annual-review-overdue': [CR, IRD],
  'knowledge/hk-audit-guide': [CR, HKICPA],
  'knowledge/hk-bank-account-rejected': [HKMA],
  'knowledge/hk-company-deregistration': [CR, IRD],
  'knowledge/hk-cross-border-trade-compliance': [CUSTOMS, IRD],
  'knowledge/hk-profits-tax-return': [IRD],
  'knowledge/hk-share-transfer': [CR, IRD],
  'knowledge/hk-vs-sg-company': [IRD, ACRA],
  'knowledge/hk-zero-declaration-fix': [IRD],
  'knowledge/my-annual-review-audit': [SSM],
  'knowledge/odi-vie-guide': [NDRC, MOFCOM, SAFE, CSRC],
  'knowledge/offshore-economic-substance': [OECD, CIREG, BVIFSC],
  'knowledge/overseas-bank-account-guide': [HKMA, MAS],
  'knowledge/sg-annual-return-audit-exemption': [ACRA, IRAS],
  'knowledge/sg-gst-registration': [IRAS],
  'knowledge/singapore-registration-guide': [ACRA],
  'knowledge/trademark-rejection-response': [WIPO, EUIPO, CNIPA],
  'knowledge/us-company-tax-policy': [IRS, FINCEN],
  'knowledge/us-ein-application': [IRS],
  'country/sg': [ACRA],
  'country/hk': [CR],
  'country/my': [SSM],
  'country/th': [DBD],
  'country/uk': [COMPANIES_HOUSE],
  'country/us': [USA_GOV],
  'country/jp': [MOJ_JP],
  'country/kr': [SC_KOREA],
  'country/ae': [DED],
  'country/vn': [MPI_VN],
  'country/id': [OSS_ID],
  'country/cayman': [CIREG],
  'country/bvi': [BVIFSC],
  'country/hk/annual-review': [CR, IRD],
  'country/us/annual-review': [IRS],
  'country/us/audit': [AICPA],
  'country/us/tax': [IRS],
  'country/sg/audit': [ACRA, ISCA]
};

const PAGE_TYPES = ['WebPage', 'CollectionPage', 'AboutPage', 'ContactPage', 'ProfilePage'];
const ARTICLE_TYPES = ['Article', 'NewsArticle', 'BlogPosting', 'TechArticle', 'Report'];

function walk(dir, out) {
  out = out || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === '.vercel' || e.name === 'seo' || e.name === 'scripts') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function relOf(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function hasType(node, types) {
  const t = node && node['@type'];
  const arr = Array.isArray(t) ? t : [t];
  return arr.some(function (x) { return types.indexOf(x) !== -1; });
}

function nodesOf(obj) {
  if (Array.isArray(obj)) return obj;
  if (obj && Array.isArray(obj['@graph'])) return obj['@graph'];
  return [obj];
}

function canonicalOf(html) {
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!tag) return null;
  const href = tag[0].match(/href=["']([^"']+)["']/i);
  return href ? href[1] : null;
}

function ensureHreflang(html, canonical) {
  if (!canonical || html.indexOf('hreflang="zh-CN"') !== -1) return { html: html, changed: false };
  const tag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (!tag) return { html: html, changed: false };
  const add = '\n<link rel="alternate" hreflang="zh-CN" href="' + canonical + '">' +
    '\n<link rel="alternate" hreflang="x-default" href="' + canonical + '">';
  return { html: html.replace(tag[0], tag[0] + add), changed: true };
}

function ensureAuthorMeta(html) {
  if (/<meta\s+name=["']author["']/i.test(html)) return { html: html, changed: false };
  const tag = '<meta name="author" content="' + AUTHOR + '">';
  const d = html.match(/<meta\s+name=["']description["'][^>]*>/i);
  if (d) return { html: html.replace(d[0], d[0] + '\n' + tag), changed: true };
  if (html.indexOf('</head>') !== -1) return { html: html.replace('</head>', tag + '\n</head>'), changed: true };
  return { html: html, changed: false };
}

function ensureArticleMeta(html, article) {
  if (!article || !article.datePublished || !article.dateModified) return { html: html, changed: false };
  const add = [];
  if (!/article:published_time/.test(html)) add.push('<meta property="article:published_time" content="' + article.datePublished + '">');
  if (!/article:modified_time/.test(html)) add.push('<meta property="article:modified_time" content="' + article.dateModified + '">');
  if (!add.length || html.indexOf('</head>') === -1) return { html: html, changed: false };
  return { html: html.replace('</head>', add.join('\n') + '\n</head>'), changed: true };
}

function pageHasArticle(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let obj;
    try { obj = JSON.parse(m[1]); } catch (e) { continue; }
    for (const n of nodesOf(obj)) if (n && hasType(n, ARTICLE_TYPES)) return true;
  }
  return false;
}

function citationList(rel) {
  const srcs = SOURCES[rel];
  if (!srcs) return null;
  return srcs.map(function (s) {
    return { '@type': 'CreativeWork', name: s.name, url: s.url };
  });
}

function enrichLd(html, rel) {
  const key = rel.replace(/\.html$/, '');
  const citations = citationList(key);
  const hasArticle = pageHasArticle(html);
  const blocks = [];
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  let changed = false;
  while ((m = re.exec(html)) !== null) blocks.push({ full: m[0], body: m[1], index: m.index });

  for (const b of blocks) {
    let obj;
    try { obj = JSON.parse(b.body); } catch (e) { continue; }
    let touched = false;
    for (const node of nodesOf(obj)) {
      if (!node || typeof node !== 'object' || Array.isArray(node)) continue;
      if (hasType(node, ARTICLE_TYPES)) {
        if (node.author && hasType(node.author, ['Organization']) && !node.author['@id']) {
          node.author = { '@id': SITE + '/#organization' };
          touched = true;
        }
        if (node.publisher === undefined) {
          node.publisher = { '@id': SITE + '/#organization' };
          touched = true;
        }
        if (node.inLanguage === undefined) {
          node.inLanguage = 'zh-CN';
          touched = true;
        }
        if (citations && node.citation === undefined) {
          node.citation = citations;
          touched = true;
        }
      }
      if (hasType(node, PAGE_TYPES)) {
        if (node.inLanguage === undefined) {
          node.inLanguage = 'zh-CN';
          touched = true;
        }
        if (node.isPartOf === undefined) {
          node.isPartOf = { '@id': SITE + '/#website' };
          touched = true;
        }
        if (citations && !hasArticle && node.citation === undefined) {
          node.citation = citations;
          touched = true;
        }
        if (citations && hasArticle && node.citation !== undefined) {
          delete node.citation;
          touched = true;
        }
      }
    }
    if (touched) {
      html = html.replace(b.full, '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2) + '\n</script>');
      changed = true;
    }
  }
  return { html: html, changed: changed };
}

function sourceBlock(rel) {
  const srcs = SOURCES[rel];
  if (!srcs) return '';
  const links = srcs.map(function (s) {
    return '<a href="' + s.url + '" rel="nofollow noopener" target="_blank">' + s.name + '</a>';
  }).join('、');
  return SOURCE_START + '\n' +
    '<section class="section" style="padding-top:0;">\n' +
    '  <div class="container container-sm">\n' +
    '    <div class="info-card" style="text-align:left;">\n' +
    '      <div class="info-label">官方来源</div>\n' +
    '      <p style="margin:8px 0 6px;font-size:14px;line-height:1.8;color:var(--c-text);">本文涉及的政策、门槛、周期与费用口径，以监管机构公布为准：' + links + '。</p>\n' +
    '      <p class="fs-12 c-text-light" style="margin:0;">内容维护：' + AUTHOR + ' · 来源链接更新：' + SOURCE_DATE + '</p>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</section>\n' + SOURCE_END;
}

function ensureSource(html, rel) {
  const block = sourceBlock(rel.replace(/\.html$/, ''));
  if (!block) return { html: html, changed: false };
  if (html.indexOf(SOURCE_START) !== -1) {
    const re = new RegExp(SOURCE_START + '[\\s\\S]*?' + SOURCE_END);
    if (!re.test(html)) return { html: html, changed: false };
    const out = html.replace(re, block);
    return { html: out, changed: out !== html };
  }
  const faq = html.indexOf('<!-- FAQ -->');
  if (faq !== -1) return { html: html.slice(0, faq) + block + '\n\n' + html.slice(faq), changed: true };
  const mainEnd = html.lastIndexOf('</main>');
  if (mainEnd !== -1) return { html: html.slice(0, mainEnd) + block + '\n' + html.slice(mainEnd), changed: true };
  return { html: html, changed: false };
}

function firstArticle(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let obj;
    try { obj = JSON.parse(m[1]); } catch (e) { continue; }
    for (const n of nodesOf(obj)) if (n && hasType(n, ARTICLE_TYPES)) return n;
  }
  return null;
}

function validate(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    try { JSON.parse(m[1]); } catch (e) { return e.message; }
  }
  return null;
}

const files = walk(ROOT);
const stat = { pages: files.length, hreflang: 0, author: 0, articleMeta: 0, ld: 0, source: 0, fail: [] };

for (const file of files) {
  const rel = relOf(file);
  if (rel === '404.html') continue;
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  const canonical = canonicalOf(html);
  let r = ensureHreflang(html, canonical); html = r.html; if (r.changed) stat.hreflang++;
  r = ensureAuthorMeta(html); html = r.html; if (r.changed) stat.author++;
  r = ensureArticleMeta(html, firstArticle(html)); html = r.html; if (r.changed) stat.articleMeta++;
  r = enrichLd(html, rel); html = r.html; if (r.changed) stat.ld++;
  r = ensureSource(html, rel); html = r.html; if (r.changed) stat.source++;

  if (html !== before) {
    const err = validate(html);
    if (err) { stat.fail.push(rel + ' (JSON-LD: ' + err.slice(0, 80) + ')'); continue; }
    if (!DRY) fs.writeFileSync(file, html, 'utf8');
  }
}

console.log(
  (DRY ? '[DRY RUN] ' : '') + '页面 ' + stat.pages + ' —— hreflang ' + stat.hreflang +
  ' / author ' + stat.author + ' / article meta ' + stat.articleMeta +
  ' / schema ' + stat.ld + ' / 官方来源 ' + stat.source
);
if (stat.fail.length) {
  console.log('失败:');
  stat.fail.forEach(function (f) { console.log('  ✗ ' + f); });
  process.exitCode = 1;
}

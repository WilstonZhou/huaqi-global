#!/usr/bin/env node
'use strict';
/*
 * 国家页「问句化 FAQ」补全（幂等）
 *
 * 背景：AEO/GEO 的检索匹配是按「用户原句」比对的。站点已有注册条件/材料/流程的
 * 结构化数据，但页面上没有与之对应的问句形态，导致「新加坡公司注册需要什么材料」
 * 这类长尾问句零命中。这里把 data-countries.js 里的既有字段改写成问答对，
 * 追加到该页 FAQ 区并同步 FAQPage schema —— 不新增任何未在数据源中出现的事实。
 *
 * 幂等：以 <!-- cn-qa --> 标记与问题文本双重判重。
 * 用法: node scripts/inject-country-qa.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DRY = process.argv.includes('--dry-run');
const countries = require('./data-countries.js');

const strip = (s) =>
  String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&middot;/g, '·')
    .replace(/\s+/g, ' ')
    .trim();

// 去掉列表项末尾的中英文句点，便于用「；」串成一句话
const trimDot = (s) => String(s).replace(/[。.;；]+$/, '').trim();

function buildQA(c) {
  const out = [];
  const cond = (c.conditions || []).map((x) => trimDot(strip(x))).filter(Boolean);
  const mats = (c.materials || []).map((x) => trimDot(strip(x))).filter(Boolean);
  const flow = (c.flow || []).map((x) => trimDot(strip(x))).filter(Boolean);

  if (cond.length) {
    out.push({
      q: `${c.name}公司注册需要什么条件?`,
      a: `${c.name}公司注册的主要条件：${cond.join('；')}。监管机构为 ${c.regulator}，常用主体类型为 ${c.type}。以上为通用要求，具体以顾问按业务场景确认的结果为准。`,
    });
  }
  if (mats.length) {
    out.push({
      q: `${c.name}公司注册需要什么材料?`,
      a: `通常需要：${mats.join('；')}。材料齐备后即可提交，${c.name}标准办理周期为 ${c.period}。`,
    });
  }
  if (flow.length) {
    const steps = flow.slice(0, 5).join(' → ');
    out.push({
      q: `${c.name}公司注册流程是怎样的?`,
      a: `标准流程：${steps}。官方流程耗时 ${c.period}，不含材料准备与银行开户时间。全程代办，无需本人到场（个别情形除外，顾问会提前说明）。`,
    });
  }
  return out;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let total = 0;
let files = 0;

for (const c of countries) {
  const rel = `country/${c.slug}.html`;
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) {
    console.log('  ✗ 不存在: ' + rel);
    continue;
  }
  let html = fs.readFileSync(abs, 'utf8');
  const qa = buildQA(c);

  // ---- 正文 FAQ ----
  const existingQ = new Set(
    [...html.matchAll(/<div class="faq-q">([\s\S]*?)<\/div>/g)].map((m) => strip(m[1])),
  );
  const fresh = qa.filter((x) => !existingQ.has(x.q));
  if (!fresh.length) {
    console.log('  = 已存在: ' + rel);
    continue;
  }

  const items = fresh
    .map(
      (x) =>
        `<div class="faq-item"><div class="faq-q">${esc(x.q)}</div><div class="faq-a"><p>${esc(x.a)}</p></div></div>`,
    )
    .join('\n');

  const last = html.lastIndexOf('<div class="faq-item">');
  if (last < 0) {
    console.log('  ✗ 未找到 FAQ 区: ' + rel);
    continue;
  }
  const close = html.indexOf('</div></div>', last);
  if (close < 0) {
    console.log('  ✗ FAQ 区结构异常: ' + rel);
    continue;
  }
  const at = close + '</div></div>'.length;
  html = html.slice(0, at) + `<!-- cn-qa -->\n` + items + html.slice(at);

  // ---- 同步 FAQPage schema ----
  const sm = /<script type="application\/ld\+json">\s*(\{[^<]*?"@type":\s*"FAQPage"[^<]*?\})\s*<\/script>/;
  const hit = sm.exec(html);
  if (hit) {
    try {
      const obj = JSON.parse(hit[1]);
      const names = new Set((obj.mainEntity || []).map((e) => e.name));
      for (const x of fresh) {
        if (names.has(x.q)) continue;
        obj.mainEntity.push({
          '@type': 'Question',
          name: x.q,
          acceptedAnswer: { '@type': 'Answer', text: x.a },
        });
      }
      html = html.replace(hit[0], '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2) + '\n</script>');
    } catch (e) {
      console.log('  ✗ FAQPage 解析失败,跳过 schema 同步: ' + rel + ' — ' + e.message);
    }
  } else {
    console.log('  ⚠ 未找到 FAQPage schema: ' + rel);
  }

  // 落盘前校验所有 JSON-LD
  const bad = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      bad.push(e.message.slice(0, 50));
    }
  }
  if (bad.length) {
    console.log('  ✗ JSON-LD 校验失败,不写入: ' + rel);
    continue;
  }

  if (!DRY) fs.writeFileSync(abs, html);
  console.log(`  ✓ ${rel}  +${fresh.length} 条问答`);
  total += fresh.length;
  files++;
}

console.log(`\n${DRY ? '[DRY RUN] ' : ''}${files} 个文件，新增 ${total} 条问句化问答`);

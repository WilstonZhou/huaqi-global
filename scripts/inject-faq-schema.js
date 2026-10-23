#!/usr/bin/env node
'use strict';
/* 给「手写页面」注入 FAQPage JSON-LD。
   这些页面不由生成器产出(所以 generator 侧的修复覆盖不到),
   但它们的 HTML 里已有 <div class="faq-item"> 区块 —— 直接解析并补 schema。
   幂等:已含 FAQPage 的文件跳过;写入前校验 JSON。 */
const fs = require('fs');
const path = require('path');
const ROOT = '/home/hq10000/projects/huaqi-global';

const FILES = [
  'services/company-registration.html',
  'knowledge/cross-border-compliance.html',
  'knowledge/singapore-registration-guide.html',
  'knowledge/us-company-tax-policy.html',
  'services/annual-review.html',
  'services/audit.html',
  'services/bank-account.html',
  'services/company-deregistration.html',
  'services/fund-planning.html',
  'services/other-services.html',
  'services/tax-planning.html',
];

function stripTags(s) {
  return String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&rsquo;/g, '\u2019').replace(/&lsquo;/g, '\u2018')
    .replace(/&ldquo;/g, '\u201c').replace(/&rdquo;/g, '\u201d')
    .replace(/&mdash;/g, '\u2014').replace(/&middot;/g, '\u00b7')
    .replace(/\s+/g, ' ')
    .trim();
}

// --force:先摘掉已有 FAQPage 再按当前可见问答重建(问答条数变化时用它)
const FORCE = process.argv.includes('--force');

function stripFaqPage(html) {
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { continue; }
    if (data && data['@type'] === 'FAQPage') {
      return html.slice(0, m.index) + html.slice(m.index + m[0].length);
    }
  }
  return html;
}

let done = 0, skip = 0, fail = 0;
for (const rel of FILES) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { console.log('  ✗ 不存在: ' + rel); fail++; continue; }
  let html = fs.readFileSync(abs, 'utf8');

  if (/"@type"\s*:\s*"FAQPage"/.test(html)) {
    if (!FORCE) { console.log('  = 已有 FAQPage,跳过: ' + rel); skip++; continue; }
    html = stripFaqPage(html);
  }

  const pairs = [];
  const re = /<div class="faq-item">\s*<div class="faq-q">([\s\S]*?)<\/div>\s*<div class="faq-a">([\s\S]*?)<\/div>\s*<\/div>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const q = stripTags(m[1]);
    const a = stripTags(m[2]);
    if (q && a) pairs.push({ q, a });
  }
  if (!pairs.length) { console.log('  ✗ 未解析到问答对: ' + rel); fail++; continue; }

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  };
  const json = JSON.stringify(schema, null, 0);
  try { JSON.parse(json); } catch (e) { console.log('  ✗ JSON 构造失败: ' + rel); fail++; continue; }

  const tag = '<script type="application/ld+json">' + json + '</script>\n</head>';
  if (!html.includes('</head>')) { console.log('  ✗ 无 </head>: ' + rel); fail++; continue; }
  html = html.replace('</head>', tag);
  fs.writeFileSync(abs, html);
  console.log('  ✓ ' + rel + '  → ' + pairs.length + ' 个问答对');
  done++;
}
console.log(`\nDONE: 注入 ${done} 个文件,跳过 ${skip},失败 ${fail}`);

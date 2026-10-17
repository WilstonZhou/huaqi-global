#!/usr/bin/env node
'use strict';
/*
 * 中国大陆关键词覆盖率分析：关键词库 × 全站 63 页正文。
 *
 * 判定口径：
 *   head —— 该词出现在某页 <title> 或 <h1>（= 有专门落地页）
 *   body —— 出现在正文纯文本（含 FAQ）但无专页
 *   miss —— 全站未出现
 *
 * 用法:
 *   node scripts/seo-cn-coverage.js [--keywords <path>] [--out <csv>] [--type <类型>]
 * 默认关键词库取自 Obsidian: ~/文档/HQ10000/obsidian-vault/05-关键词库/keywords.json
 */
const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const argv = process.argv.slice(2);
const val = (f, d) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : d;
};

const KWFILE = val(
  '--keywords',
  path.join(os.homedir(), '文档/HQ10000/obsidian-vault/05-关键词库/keywords.json'),
);
const OUT = val('--out', path.join(os.homedir(), '.hermes/cache/scratch/hq10000-cn-seo/coverage.csv'));
const ONLY_TYPE = val('--type', null);

// 参与匹配的词类型（排除「竞对标题词/竞对问法词」这类竞品原文，不是我们的目标词）
const TYPES = [
  '核心词', '服务主词', '服务次词',
  '地域-注册词', '地域-年审词', '地域-税务词', '地域-开户词', '地域-审计词',
  '场景核心词', '长尾词', '长尾种子', 'GEO问句', '平台高价值词', '竞品截流词',
];

const norm = (s) => String(s || '').replace(/\s+/g, '').toLowerCase();
const stripTags = (s) =>
  String(s)
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&middot;/g, '·');

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name === 'node_modules') continue;
    const abs = path.join(dir, e.name);
    if (e.isDirectory()) walk(abs, out);
    else if (e.name.endsWith('.html')) out.push(abs);
  }
  return out;
}

const pages = [];
for (const abs of walk(ROOT)) {
  const html = fs.readFileSync(abs, 'utf8');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [, ''])[1];
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ''])[1];
  pages.push({
    rel: path.relative(ROOT, abs),
    head: norm(stripTags(title + ' ' + h1)),
    body: norm(stripTags(html)),
  });
}

if (!fs.existsSync(KWFILE)) {
  console.error('✗ 关键词库不存在: ' + KWFILE);
  console.error('  用 --keywords <path> 指定');
  process.exit(1);
}
const kw = JSON.parse(fs.readFileSync(KWFILE, 'utf8'));
const entries = kw.entries || [];

const seen = new Set();
const rows = [];
for (const e of entries) {
  if (!TYPES.includes(e.type)) continue;
  if (ONLY_TYPE && e.type !== ONLY_TYPE) continue;
  const k = norm(e.keyword);
  if (!k || k.length < 3 || seen.has(k)) continue;
  seen.add(k);
  const headPages = pages.filter((p) => p.head.includes(k)).map((p) => p.rel);
  const bodyPages = pages.filter((p) => p.body.includes(k)).map((p) => p.rel);
  rows.push({
    keyword: e.keyword,
    type: e.type,
    head_hits: headPages.length,
    body_hits: bodyPages.length,
    head_pages: headPages.slice(0, 3).join(';'),
  });
}

const csv = ['keyword,type,head_hits,body_hits,head_pages']
  .concat(
    rows.map(
      (r) =>
        `"${String(r.keyword).replace(/"/g, '""')}",${r.type},${r.head_hits},${r.body_hits},"${r.head_pages}"`,
    ),
  )
  .join('\n');
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, csv + '\n');

const n = rows.length;
const h = rows.filter((r) => r.head_hits).length;
const b = rows.filter((r) => r.body_hits).length;
const z = rows.filter((r) => !r.body_hits).length;
console.log(`页面 ${pages.length} 个 / 目标词 ${n} 个`);
console.log(`  有专页(title|h1) ${h}  (${pct(h, n)})`);
console.log(`  正文覆盖        ${b}  (${pct(b, n)})`);
console.log(`  完全未覆盖      ${z}  (${pct(z, n)})`);
console.log('CSV: ' + OUT);

const miss = rows.filter((r) => !r.body_hits);
if (miss.length) {
  console.log('\n完全未覆盖(按类型聚合):');
  const byType = {};
  for (const r of miss) (byType[r.type] = byType[r.type] || []).push(r.keyword);
  for (const [t, list] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
    console.log(`  [${t}] ${list.length} 条: ${list.slice(0, 8).join('、')}${list.length > 8 ? ' …' : ''}`);
  }
}

function pct(a, b) {
  return ((a / b) * 100).toFixed(0) + '%';
}

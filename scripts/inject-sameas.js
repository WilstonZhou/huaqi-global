#!/usr/bin/env node
'use strict';
/*
 * Organization.sameAs 注入(幂等)
 *
 * 为什么单独一段:全站 87 页的 Organization 都没有 sameAs —— AI 引擎与搜索引擎
 * 无法把「网站上的华企环球」与外部权威档案对齐,实体消歧缺一个锚点。
 *
 * 为什么用注入器而不是改生成器重跑:重跑生成器会抹掉 inject-datemodified 写入的
 * WebPage 节点,再重跑它又会把全站 dateModified 刷成同一天(#20 的提交触碰了全部文件),
 * 造成与本 issue 无关的大面积日期 diff。注入器只改 Organization 块,不触碰其它节点。
 *
 * 行为:
 * - 找到页面里 @type 含 Organization 的 JSON-LD 块,在 "url" 之后插入/更新 sameAs。
 * - 已有 sameAs 且内容一致的页面跳过;内容不一致则原地更新。
 * - URL 清单集中在 SAME_AS 数组,由人工确认后填入,不得自动生成或猜测。
 *
 * 用法: node scripts/inject-sameas.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

/* —— 权威档案地址:必须人工核实后填入,禁止猜测 —— */
const SAME_AS = [
  'https://www.qcc.com/firm/95df37261237d7349c1220650e4a6e79.html'
];

function walk(dir, acc) {
  acc = acc || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.git' || e.name === 'node_modules' || e.name === '.vercel' || e.name === 'seo') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

function processFile(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (rel === '404.html') return null;

  let html = fs.readFileSync(file, 'utf8');
  const re = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m, patched = null;

  while ((m = re.exec(html)) !== null) {
    let obj;
    try { obj = JSON.parse(m[1]); } catch (e) { continue; }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) continue;
    const types = Array.isArray(obj['@type']) ? obj['@type'] : [obj['@type']];
    if (types.indexOf('Organization') === -1) continue;

    const cur = [].concat(obj.sameAs || []);
    const same = cur.length === SAME_AS.length && SAME_AS.every(function (u) { return cur.indexOf(u) !== -1; });
    if (same) return null; // 已一致,不动

    // 只做文本层面的插入,避免整块重排造成大面积 diff
    const block = m[1];
    const lines = block.split('\n');
    let idx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (/^(\s*)"sameAs":\s*\[/.test(lines[i])) { idx = i; break; }
      if (/^(\s*)"url":\s*"https:\/\/hq10000\.com\/?",?\s*$/.test(lines[i]) && idx === -1) { idx = i; }
    }
    if (idx === -1) return null;
    const isSameAsLine = /^(\s*)"sameAs":\s*\[/.test(lines[idx]);
    const indent = lines[idx].match(/^(\s*)/)[1];

    // 清掉已有的 sameAs 块(整体替换)
    if (isSameAsLine) {
      let end = idx;
      while (end < lines.length && !/^\s*\],?\s*$/.test(lines[end])) end++;
      lines.splice(idx, end - idx + 1);
    } else {
      if (!/,\s*$/.test(lines[idx])) lines[idx] = lines[idx].replace(/\s*$/, ',');
      idx = idx + 1;
    }
    const insert = [indent + '"sameAs": [']
      .concat(SAME_AS.map(function (u, i) { return indent + '  "' + u + '"' + (i === SAME_AS.length - 1 ? '' : ','); }))
      .concat([indent + '],']);
    lines.splice(idx, 0, insert.join('\n'));
    const nb = lines.join('\n');
    patched = { from: m[0], to: '<script type="application/ld+json">' + nb + '</script>' };
    break;
  }

  if (!patched) return null;
  html = html.replace(patched.from, patched.to);
  if (!DRY) fs.writeFileSync(file, html);
  return rel;
}

const results = walk(ROOT).map(processFile).filter(Boolean);
console.log('sameAs injected: ' + results.length + ' pages' + (DRY ? ' [dry-run]' : ''));


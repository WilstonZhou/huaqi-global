#!/usr/bin/env node
'use strict';
// Rewrites <lastmod> in sitemap.xml from each URL's source file's last content commit date.
// Preserves <loc>/<changefreq>/<priority> exactly as authored.
// Run after any content change:  node scripts/update-sitemap-lastmod.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const SM = path.join(ROOT, 'sitemap.xml');

function filesFor(loc) {
  const pn = loc.replace(/^https?:\/\/[^/]+/, '').replace(/^\//, '');
  const abs = path.join(ROOT, pn || 'index.html');
  const cands = [abs, abs + '.html', path.join(abs, 'index.html')];
  for (const c of cands) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c;
  }
  return null;
}

let sm = fs.readFileSync(SM, 'utf8');
let updated = 0, missing = [];

// [2026-10-15] lastmod 改为「该文件最后一次内容提交日期」,而不是文件 mtime。
// 原因:checkout / 构建产生的 mtime 会让全站 lastmod 变成同一天(此前 65 条全是同一日期),
//       Google 会因此忽略 lastmod;有未提交改动(本次部署要发布的改动)时才回退到 mtime。
function lastmodFor(file) {
  try {
    const dirty = execFileSync('git', ['status', '--porcelain', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (dirty) return isoDate(fs.statSync(file).mtime);
  } catch (e) { /* git 不可用时走 mtime */ }
  try {
    const d = execFileSync('git', ['log', '-1', '--format=%ad', '--date=short', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  } catch (e) { /* ignore */ }
  return isoDate(fs.statSync(file).mtime);
}
function isoDate(dt) {
  const d = new Date(dt);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

sm = sm.replace(/<url>([\s\S]*?)<\/url>/g, (block) => {
  const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  if (!loc) return block;
  const f = filesFor(loc);
  if (!f) { missing.push(loc); return block; }
  const iso = lastmodFor(f);
  if (/<lastmod>/.test(block)) {
    const before = block;
    block = block.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${iso}</lastmod>`);
    if (before !== block) updated++;
    return block;
  }
  return block.replace(/(<loc>[^<]+<\/loc>)/, `$1<lastmod>${iso}</lastmod>`);
});

fs.writeFileSync(SM, sm);
console.log(`sitemap lastmod updated: ${updated} entries`);
if (missing.length) console.log('  WARN no source file for: ' + missing.join(', '));

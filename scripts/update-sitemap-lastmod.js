#!/usr/bin/env node
'use strict';
// Rewrites <lastmod> in sitemap.xml from each URL's source file mtime.
// Preserves <loc>/<changefreq>/<priority> exactly as authored.
// Run after any content change:  node scripts/update-sitemap-lastmod.js
const fs = require('fs');
const path = require('path');
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

sm = sm.replace(/<url>([\s\S]*?)<\/url>/g, (block) => {
  const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
  if (!loc) return block;
  const f = filesFor(loc);
  if (!f) { missing.push(loc); return block; }
  const d = new Date(fs.statSync(f).mtime);
  const iso = d.toISOString().slice(0, 10);
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

#!/usr/bin/env node
'use strict';
/*
 * WebPage datePublished / dateModified 注入(幂等)
 *
 * 为什么单独一段:全站 87 页里只有 8 篇 knowledge 旧稿带 dateModified。
 * 生成器输出的页面级节点是 Service / FAQPage / HowTo / BreadcrumbList —— Service 属
 * Intangible(非 CreativeWork),dateModified 在其上语义不成立,所以生成器从未输出过
 * 该字段。生成式引擎与 Google 都把「无日期」当作低可信来源。
 *
 * 做法:给每个页面补 WebPage 节点(@id 与 canonical 同址,便于与 Article 的
 * mainEntityOfPage 合并为同一节点);已有 WebPage/CollectionPage 的页面原地补字段,
 * 不重复插入。
 *
 * 日期口径与 scripts/update-sitemap-lastmod.js 一致:该文件最后一次内容提交日期;
 * datePublished 取首次提交日期。文件无提交历史时回退到 HEAD 提交日期(保证确定性,
 * 干净树重跑 git diff 必须为空)。
 *
 * 执行位置(顺序敏感):必须在 prerender-home.js 之后、update-sitemap-lastmod.js 之前。
 *
 * 用法: node scripts/inject-datemodified.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

const START = '<!-- schema:start -->';
const END = '<!-- schema:end -->';
const WEBSITE_ID = 'https://hq10000.com/#website';
const ORG_ID = 'https://hq10000.com/#organization';
const PAGE_TYPES = ['WebPage', 'CollectionPage', 'AboutPage', 'ContactPage', 'QAPage', 'ProfilePage'];

/* ---------- 提交日期表:一次 git log 全量取回,避免 87 x 2 次子进程 ---------- */
function gitDateMap() {
  const head = (function () {
    try {
      const d = execFileSync('git', ['log', '-1', '--date=short', '--pretty=format:%ad'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).trim();
      return /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : '';
    } catch (e) { return ''; }
  })();
  const first = Object.create(null); // 最早(日志自新到旧,最后一次出现即最早)
  const last = Object.create(null);  // 最新
  try {
    const raw = execFileSync('git', ['log', '--date=short', '--pretty=format:%ad', '--name-only'], { cwd: ROOT, encoding: 'utf8', maxBuffer: 128 * 1024 * 1024 });
    let cur = '';
    for (const line of raw.split('\n')) {
      const s = line.trim();
      if (!s) continue;
      if (/^\d{4}-\d{2}-\d{2}$/.test(s)) { cur = s; continue; }
      if (!cur) continue;
      if (last[s] === undefined) last[s] = cur;
      first[s] = cur;
    }
  } catch (e) { /* git 不可用时全部回退到 head */ }
  return { first: first, last: last, head: head };
}

/* ---------- 遍历 ---------- */
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

function canonicalOf(html, relPosix) {
  const m = html.match(/<link rel="canonical" href="([^"]+)"/);
  if (m) return m[1];
  let u = '/' + relPosix.replace(/\/index\.html$/, '').replace(/\.html$/, '');
  return 'https://hq10000.com' + (u === '/index' ? '/' : u);
}

function pageNameOf(html) {
  const t = html.match(/<title>([\s\S]*?)<\/title>/);
  if (!t) return '';
  const raw = t[1].replace(/\s+/g, ' ').trim();
  const seg = raw.split('|')[0].trim();
  return seg || raw;
}

function isPageType(v) {
  const arr = Array.isArray(v) ? v : [v];
  return arr.some(function (x) { return PAGE_TYPES.indexOf(x) !== -1; });
}

function processFile(file, dm) {
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  if (rel === '404.html') return null;

  let html = fs.readFileSync(file, 'utf8');
  const si = html.indexOf(START);
  const ei = html.indexOf(END);
  if (si === -1 || ei === -1) return null;

  const relPosix = path.relative(ROOT, file).split(path.sep).join('/');
  const pub = dm.first[relPosix] || dm.head;
  const mod = dm.last[relPosix] || dm.head;
  if (!pub || !mod) return null;

  const region = html.slice(si + START.length, ei);
  const blockRe = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let m;
  let patched = null;

  while ((m = blockRe.exec(region)) !== null) {
    let obj;
    try { obj = JSON.parse(m[1]); } catch (e) { continue; }
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) continue;
    if (!isPageType(obj['@type'])) continue;
    if (obj.datePublished && obj.dateModified) return null; // 已完整,不动
    const next = Object.assign({}, obj);
    if (!next.datePublished) next.datePublished = pub;
    if (!next.dateModified) next.dateModified = mod;
    patched = { from: m[0], to: '<script type="application/ld+json">\n' + JSON.stringify(next, null, 2) + '\n</script>' };
    break;
  }

  if (patched) {
    const newRegion = region.replace(patched.from, patched.to);
    html = html.slice(0, si + START.length) + newRegion + html.slice(ei);
  } else {
    const node = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': canonicalOf(html, relPosix),
      'url': canonicalOf(html, relPosix),
      'name': pageNameOf(html),
      'inLanguage': 'zh-CN',
      'isPartOf': { '@id': WEBSITE_ID },
      'about': { '@id': ORG_ID },
      'datePublished': pub,
      'dateModified': mod
    };
    const block = '\n<!-- datemodified:start -->\n' +
      '<script type="application/ld+json">\n' + JSON.stringify(node, null, 2) + '\n</script>\n' +
      '<!-- datemodified:end -->\n';
    html = html.slice(0, ei) + block + html.slice(ei);
  }

  if (!DRY) fs.writeFileSync(file, html);
  return { rel: rel, pub: pub, mod: mod, mode: patched ? 'patch' : 'append' };
}

const dm = gitDateMap();
const results = walk(ROOT).map(function (f) { return processFile(f, dm); }).filter(Boolean);
const add = results.filter(function (r) { return r.mode === 'append'; }).length;
const pat = results.filter(function (r) { return r.mode === 'patch'; }).length;
console.log('dateModified injected: ' + results.length + ' pages (append ' + add + ' / patch ' + pat + ')' + (DRY ? ' [dry-run]' : ''));

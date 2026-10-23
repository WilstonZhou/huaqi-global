#!/usr/bin/env node
'use strict';
/*
 * 可见「更新时间」注入(幂等)
 *
 * 为什么单独一段:全站 87 页的 JSON-LD 已有 WebPage dateModified(见
 * inject-datemodified.js),但页面上没有任何可见日期。用户与 AI 引擎在正文中
 * 抽取不到时间锚点 —— 结构化数据里的新鲜度信号对读者不可见,对只抓可见文本的
 * 抽取器也不可见。YMYL 类内容(境外注册/税务合规)缺可见日期会直接影响可信判断。
 *
 * 口径:不另发明日期,直接取该页 WebPage 节点的 dateModified,保证可见层与
 * schema 层严格一致,绝不出现两处日期打架。
 *
 * 位置:页脚 footer-bottom 内、版权行之上。不进首屏,不影响 LCP 与 CLS。
 * 日期用 <time datetime="YYYY-MM-DD"> 承载,而不是纯文本。
 *
 * 执行位置(顺序敏感):必须在 inject-datemodified.js 之后(要读它写的值)、
 * prerender-home.js 之后(否则首页预渲染片段会覆盖改动)。
 *
 * 用法: node scripts/inject-visible-date.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

const MARK_START = '<!-- page-updated:start -->';
const MARK_END = '<!-- page-updated:end -->';
const ANCHOR = '<div class="footer-bottom">';
const PAGE_TYPES = ['WebPage', 'CollectionPage', 'AboutPage', 'ContactPage', 'QAPage', 'ProfilePage'];
/* 内容级节点优先:知识/案例页同时有 Article 与 WebPage 两个节点时,
   可见日期应对齐「内容真正被修改的时间」,而不是页面文件最后一次被脚本触碰的时间 */
const CONTENT_TYPES = ['Article', 'BlogPosting', 'NewsArticle', 'TechArticle', 'Report'];
const SKIP_FILES = new Set(['404.html']);
const SKIP_DIRS = new Set(['.vercel', 'node_modules', '.git', 'scripts', 'seo', 'assets']);

function walk(dir, out) {
  out = out || [];
  for (const name of fs.readdirSync(dir)) {
    if (SKIP_DIRS.has(name)) continue;
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.html') && !SKIP_FILES.has(name)) out.push(p);
  }
  return out;
}

/* 取该页日期:先找内容级节点(Article 等),再回退页面级节点(WebPage 等);
   都找不到返回空串(该页跳过,绝不猜日期) */
function readDateModified(html) {
  const re = /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g;
  const found = Object.create(null);
  let m;
  while ((m = re.exec(html))) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { continue; }
    const nodes = Array.isArray(data) ? data : (data && data['@graph']) || [data];
    for (const n of nodes) {
      if (!n || typeof n !== 'object' || typeof n.dateModified !== 'string') continue;
      const d = n.dateModified.slice(0, 10);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) continue;
      if (CONTENT_TYPES.indexOf(n['@type']) !== -1 && found.content === undefined) found.content = d;
      if (PAGE_TYPES.indexOf(n['@type']) !== -1 && found.page === undefined) found.page = d;
    }
  }
  return found.content || found.page || '';
}

/* 日期用 <time datetime> 承载:纯文本日期机器可读性弱,抽取器要靠正则猜格式;
   <time datetime> 是 HTML 标准的时间语义载体,也是新鲜度的显式信号 */
function inner(date) {
  return '<div class="page-updated">本页面更新于 <time datetime="' + date + '">' + date + '</time></div>';
}

function build(date) {
  return '\n    ' + MARK_START + inner(date) + MARK_END;
}

const files = walk(ROOT).sort();
let added = 0, updated = 0, skipped = 0;
const missing = [];

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');
  const date = readDateModified(html);
  if (!date) { skipped++; missing.push(rel); continue; }

  const block = build(date);
  const hasMark = html.indexOf(MARK_START) !== -1;
  let out;

  if (hasMark) {
    const re = new RegExp(MARK_START + '[\\s\\S]*?' + MARK_END);
    const cur = html.match(re);
    // 比对整段标记块,格式升级(纯文本 → <time>)时才能被识别为「需要更新」
    if (cur && cur[0] === MARK_START + inner(date) + MARK_END) continue; // 已是最新
    out = html.replace(re, MARK_START + inner(date) + MARK_END);
    updated++;
  } else {
    const at = html.indexOf(ANCHOR);
    if (at === -1) { skipped++; missing.push(rel + ' (无 footer-bottom)'); continue; }
    out = html.slice(0, at + ANCHOR.length) + block + html.slice(at + ANCHOR.length);
    added++;
  }

  if (!DRY) fs.writeFileSync(file, out);
}

const label = DRY ? '[DRY RUN] ' : '';
console.log(label + '新增 ' + added + ' 页,更新 ' + updated + ' 页,跳过 ' + skipped + ' 页');
if (missing.length) console.log('跳过明细: ' + missing.join(', '));

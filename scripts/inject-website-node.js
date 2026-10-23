#!/usr/bin/env node
'use strict';
/*
 * WebSite 节点注入(幂等)
 *
 * 为什么单独一段:全站 86 个页面的 JSON-LD 用 isPartOf / publisher 引用了
 * https://hq10000.com/#website,但只有 /index.html 与 /credentials/index.html 两页
 * 真正定义了这个节点 —— 其余 84 页是**悬空引用**:AI 引擎沿 @id 找不到对应实体,
 * 站点级实体与「页面 → 站点 → 组织」的链路在这些页面上断掉。
 *
 * 为什么不顺带加 SearchAction:站内没有可用的搜索页/接口,schema.org 要求
 * SearchAction 的 target 指向真实可用的搜索 URL。虚构属 CHANGE_POLICY.md C 类禁止项,
 * 且会被判无效。故本脚本只补 WebSite 节点本身,不加 potentialAction。
 *
 * 为什么用注入器:同 inject-sameas —— 重跑生成器会抹掉 inject-datemodified 写入的
 * WebPage 节点,并触发全站日期刷新。注入器只新增一个节点,不触碰其它 JSON-LD。
 *
 * 用法: node scripts/inject-website-node.js [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DRY = process.argv.includes('--dry-run');

const WEBSITE_ID = 'https://hq10000.com/#website';
const ORG_ID = 'https://hq10000.com/#organization';
const SKIP_DIRS = new Set(['.git', 'node_modules', '.vercel', 'seo', 'scripts', 'assets']);
const SKIP_FILES = new Set(['404.html']);

/* 与 /index.html 现有 WebSite 节点保持逐字段一致,避免同一实体两个口径 */
const NODE = [
  '{',
  '  "@context": "https://schema.org",',
  '  "@type": "WebSite",',
  '  "@id": "' + WEBSITE_ID + '",',
  '  "url": "https://hq10000.com/",',
  '  "name": "华企环球",',
  '  "alternateName": [',
  '    "华企环球国际咨询",',
  '    "Huaqi Global",',
  '    "hq10000.com"',
  '  ],',
  '  "description": "华企环球国际咨询,2018年成立(前身为会计事务所),总部深圳,业务覆盖全球60多个国家及地区。提供海外公司注册、银行开户、年审审计、税务规划等一站式出海服务。",',
  '  "inLanguage": "zh-CN",',
  '  "publisher": { "@id": "' + ORG_ID + '" }',
  '}'
].join('\n');

const BLOCK = '<script type="application/ld+json">\n' + NODE + '\n</script>\n';

function walk(dir, acc) {
  acc = acc || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html') && !SKIP_FILES.has(e.name)) acc.push(p);
  }
  return acc;
}

function hasWebsiteNode(html) {
  const re = /<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    let data;
    try { data = JSON.parse(m[1]); } catch (e) { continue; }
    const nodes = Array.isArray(data) ? data : (data && data['@graph']) || [data];
    for (const n of nodes) {
      if (n && n['@type'] === 'WebSite') return true;
    }
  }
  return false;
}

const files = walk(ROOT).sort();
let added = 0;
const skipped = [];

for (const file of files) {
  const html = fs.readFileSync(file, 'utf8');
  if (hasWebsiteNode(html)) continue;
  const at = html.indexOf('<script type="application/ld+json">');
  if (at === -1) { skipped.push(path.relative(ROOT, file)); continue; }
  if (!DRY) fs.writeFileSync(file, html.slice(0, at) + BLOCK + html.slice(at));
  added++;
}

console.log((DRY ? '[DRY RUN] ' : '') + '新增 WebSite 节点 ' + added + ' 页,跳过 ' + skipped.length + ' 页');
if (skipped.length) console.log('跳过明细: ' + skipped.join(', '));

#!/usr/bin/env node
'use strict';
/*
 * 注入 Vercel Web Analytics / Speed Insights 脚本(幂等)。
 *
 * 为什么用注入器:站点是纯静态 HTML,没有构建步骤自动注入;手写页与生成页
 * 两套来源,直接改模板会漏掉手写页。
 *
 * 前提:Web Analytics 需在 Vercel 项目 Settings → Analytics 里启用,
 * 否则 /_vercel/insights/script.js 会返回 404(脚本标签本身无害,但不会统计)。
 *
 * 用法:
 *   node scripts/inject-analytics.js            # 写入
 *   node scripts/inject-analytics.js --check    # 只检查
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

const WEB_ANALYTICS = '<script defer src="/_vercel/insights/script.js"></script>';
const SPEED_INSIGHTS = '<script defer src="/_vercel/speed-insights/script.js"></script>';

function walk(dir, acc) {
  acc = acc || [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', '.vercel', 'scripts', 'seo', 'assets'].includes(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name.endsWith('.html')) acc.push(p);
  }
  return acc;
}

let changed = 0, missing = 0;
for (const file of walk(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  if (!html.includes('/_vercel/insights/script.js')) {
    html = html.replace('</head>', WEB_ANALYTICS + '\n</head>');
  }
  if (!html.includes('/_vercel/speed-insights/script.js')) {
    html = html.replace('</head>', SPEED_INSIGHTS + '\n</head>');
  }

  if (html !== before) {
    changed++;
    if (CHECK) console.log('✗ ' + path.relative(ROOT, file));
    else fs.writeFileSync(file, html, 'utf8');
  }
}

if (CHECK) {
  console.log(changed ? `${changed} 个页面缺少统计脚本` : '全部已就绪');
  process.exit(changed ? 1 : 0);
}
console.log(`注入统计脚本: ${changed} 页`);

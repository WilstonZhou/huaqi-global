#!/usr/bin/env node
'use strict';
/*
 * 标准后处理链：所有幂等后处理器按依赖顺序一次跑完。
 *
 * 顺序来源：seo/GENERATOR-MAP.md 第三节「大陆市场适配层」，关键约束：
 *   - prerender-home.js 必须在 inject-datemodified.js 之前（否则覆盖首页注入）
 *   - inject-visible-date.js 必须在 inject-datemodified.js 与 prerender-home.js 之后
 *   - inject-ai-cn.js 必须跑两遍：国家页的 WebPage 节点由 inject-datemodified.js
 *     在链路末尾补出，第一遍跑时节点还不存在，citation 会静默丢失；第二遍补挂。
 *
 * 用法: node scripts/postprocess-all.js
 * 全链跑完后 git diff 应为 0（确定性 canary，见 GENERATOR-MAP.md 第六节）。
 */
const { execFileSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const STEPS = [
  'scripts/inject-cn-seo.js',
  'scripts/inject-ai-cn.js',          // 第一遍：hreflang / author / 已有节点的 citation
  'scripts/inject-country-qa.js',
  'scripts/inject-llms-facts.js',
  'scripts/prerender-faq.js',
  'scripts/prerender-home.js',        // 必须在 inject-datemodified.js 之前
  'scripts/inject-datemodified.js',   // 补出 WebPage 节点
  'scripts/inject-visible-date.js',   // 必须在 datemodified 与 prerender-home 之后
  'scripts/inject-ai-cn.js',          // 第二遍：WebPage 已存在，citation 落位
  'scripts/inject-website-node.js',
  'scripts/inject-sameas.js',
  'scripts/update-sitemap-lastmod.js'
];

for (const step of STEPS) {
  console.log('\n→ ' + step);
  execFileSync(process.execPath, [path.join(ROOT, step)], { cwd: ROOT, stdio: 'inherit' });
}
console.log('\n后处理链完成：' + STEPS.length + ' 步');

#!/usr/bin/env node
'use strict';
/*
 * 推送 URL 给百度「普通收录」接口(data.zz.baidu.com/urls)。
 *
 * 凭据处理:token 一律从环境变量 BAIDU_PUSH_TOKEN 读取,
 * 绝不写入本仓库(仓库是公开的)。
 *
 * 用法:
 *   BAIDU_PUSH_TOKEN=<token> node scripts/baidu-push.js [选项]
 *
 * 选项:
 *   --dry-run        只打印将要推送的 URL,不发起请求
 *   --limit N        最多推送 N 条(默认 2000,百度单次上限)
 *   --only-changed   只推 sitemap 中 lastmod 为今天的 URL(日常增量推送用)
 *   --file <path>    改为从文本文件读取 URL(每行一条)
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SITE = 'https://hq10000.com';
const ENDPOINT = 'http://data.zz.baidu.com/urls';
const MAX_PER_CALL = 2000;

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

const DRY = has('--dry-run');
const ONLY_CHANGED = has('--only-changed');
const LIMIT = Math.min(parseInt(val('--limit') || String(MAX_PER_CALL), 10) || MAX_PER_CALL, MAX_PER_CALL);
const FILE = val('--file');

function collectUrls() {
  if (FILE) {
    return fs.readFileSync(path.resolve(ROOT, FILE), 'utf8')
      .split('\n').map((s) => s.trim()).filter(Boolean);
  }
  const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const today = new Date().toISOString().slice(0, 10);
  const urls = [];
  for (const m of sm.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = m[1];
    const loc = (block.match(/<loc>([^<]+)<\/loc>/) || [])[1];
    if (!loc) continue;
    if (ONLY_CHANGED) {
      const lm = (block.match(/<lastmod>([^<]+)<\/lastmod>/) || [])[1] || '';
      if (!lm.startsWith(today)) continue;
    }
    urls.push(loc.trim());
  }
  return urls;
}

(async function main() {
  const token = process.env.BAIDU_PUSH_TOKEN;
  if (!token && !DRY) {
    console.error('✗ 缺少 BAIDU_PUSH_TOKEN 环境变量(不要把它写进仓库,用 secrets 注入)');
    process.exit(1);
  }

  let urls = collectUrls();
  if (!urls.length) { console.log('没有需要推送的 URL。'); return; }
  const total = urls.length;
  if (urls.length > LIMIT) urls = urls.slice(0, LIMIT);

  console.log(`站点: ${SITE}`);
  console.log(`待推送: ${urls.length} 条${total > urls.length ? `(总 ${total} 条,本次截取前 ${urls.length} 条)` : ''}`);
  if (ONLY_CHANGED) console.log('模式: 仅推送 lastmod 为今天的 URL');

  if (DRY) {
    urls.forEach((u) => console.log('  DRY  ' + u));
    console.log(`\n(--dry-run,未发起请求。共 ${urls.length} 条)`);
    return;
  }

  const body = urls.join('\n');
  const url = `${ENDPOINT}?site=${encodeURIComponent(SITE)}&token=${encodeURIComponent(token)}`;

  let res, text;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body
    });
    text = await res.text();
  } catch (e) {
    console.error('✗ 请求失败: ' + e.message);
    console.error('  提示: 百度推送接口是 http://,若本机网络受限可考虑走代理。');
    process.exit(1);
  }

  let json = null;
  try { json = JSON.parse(text); } catch (_) { /* 非 JSON 响应 */ }

  console.log(`\nHTTP ${res.status}`);
  console.log('响应: ' + text.trim().slice(0, 500));

  if (json) {
    if (typeof json.remain !== 'undefined') console.log(`  今日剩余额度 remain: ${json.remain}`);
    if (typeof json.success !== 'undefined') console.log(`  成功推送 success: ${json.success}`);
    if (json.not_same_site) console.log(`  ⚠ 域名不匹配 not_same_site: ${json.not_same_site}`);
    if (json.not_valid) console.log(`  ⚠ 无效 URL not_valid: ${json.not_valid}`);
    if (json.error) console.log(`  ✗ error: ${json.error}${json.message ? ' — ' + json.message : ''}`);
  }
})().catch((e) => { console.error('✗ ' + e.message); process.exit(1); });

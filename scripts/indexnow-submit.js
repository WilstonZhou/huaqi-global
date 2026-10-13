#!/usr/bin/env node
'use strict';
/*
 * IndexNow 提交 —— 一次提交同时通知 Bing / Yandex / Seznam / Naver。
 *
 * 与百度推送的关键区别:
 *   - 无需账号、无需 token。key 是公开值,规范要求它可从站点根访问
 *     (https://<host>/<key>.txt),所以它**随仓库提交没有问题**。
 *   - 配额比百度宽松得多,单次上限 10000 条,适合下线/改版后成批通知。
 *
 * 用法:
 *   node scripts/indexnow-submit.js                  # 推 sitemap 里的全部 URL
 *   node scripts/indexnow-submit.js --only-changed   # 只推 lastmod 为今天的 URL
 *   node scripts/indexnow-submit.js --file urls.txt  # 从文件读(每行一条;可传绝对路径)
 *   node scripts/indexnow-submit.js --deleted        # 通知已删除的 URL,让引擎尽快弃索引
 *   node scripts/indexnow-submit.js --dry-run        # 只打印,不发请求
 *   node scripts/indexnow-submit.js --endpoint bing  # 单一引擎:all(=indexnow+bing) | indexnow | bing | yandex
 *
 * 网络:api.indexnow.org / yandex.com 在墙内需走本机代理,用
 *   NODE_USE_ENV_PROXY=1 http_proxy=http://127.0.0.1:1081 https_proxy=http://127.0.0.1:1081 \
 *     node scripts/indexnow-submit.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const HOST = 'hq10000.com';
const ENDPOINTS = {
  /* 主端点:会把提交转发给所有参与引擎(含 Yandex、Seznam、Naver) */
  indexnow: 'https://api.indexnow.org/indexnow',
  /* 备用:直接提交给 Bing */
  bing: 'https://www.bing.com/indexnow',
  /* 墙内实测不可达(直连与代理均 000);仅在代理线路能通时用 */
  yandex: 'https://yandex.com/indexnow'
};
const DEFAULT_ENDPOINTS = [ENDPOINTS.indexnow, ENDPOINTS.bing];
const MAX_PER_CALL = 10000;

/* 已下线页面:提交给引擎,让它们尽快重抓并放弃索引(线上为 308 → /about)。
   新增删除项时补在这里,然后 `node scripts/indexnow-submit.js --deleted`。 */
const DELETED = [
  'https://' + HOST + '/compare/vanzbon',
  'https://' + HOST + '/compare/tenace',
  'https://' + HOST + '/compare/xiaoniu',
  'https://' + HOST + '/compare/simengqifu'
];

const argv = process.argv.slice(2);
const has = (f) => argv.includes(f);
const val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };

const DRY = has('--dry-run');
const ONLY_CHANGED = has('--only-changed');
const DELETED_ONLY = has('--deleted');
const FILE = val('--file');
const EP = val('--endpoint') || 'all';
const LIMIT = Math.min(parseInt(val('--limit') || String(MAX_PER_CALL), 10) || MAX_PER_CALL, MAX_PER_CALL);

/* key 自动发现:仓库根存在 <32位hex>.txt 且内容含该 key —— 换 key 只需换文件 */
function discoverKey() {
  const cands = fs.readdirSync(ROOT).filter((f) => /^[0-9a-f]{32}\.txt$/i.test(f));
  for (const f of cands) {
    const k = f.replace(/\.txt$/i, '');
    const body = fs.readFileSync(path.join(ROOT, f), 'utf8').trim();
    if (body.includes(k)) return { key: k, file: f };
  }
  return null;
}

function collectUrls() {
  if (DELETED_ONLY) return DELETED.slice();
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
  const found = discoverKey();
  if (!found) {
    console.error('✗ 未找到 IndexNow key:仓库根应存在 <32位hex>.txt,内容为该 key。');
    console.error('  生成:开新 key 见站点文档;或 openssl rand -hex 16 > <key>.txt');
    process.exit(1);
  }
  const keyLocation = 'https://' + HOST + '/' + found.file;
  const endpoints = EP === 'all' ? DEFAULT_ENDPOINTS : [ENDPOINTS[EP]];
  if (!endpoints[0]) {
    console.error('✗ 未知 endpoint: ' + EP + '(可选 all | bing | yandex)');
    process.exit(1);
  }

  let urls = collectUrls();
  if (!urls.length) { console.log('没有需要提交的 URL。'); return; }
  const total = urls.length;
  if (urls.length > LIMIT) urls = urls.slice(0, LIMIT);

  console.log('host        : ' + HOST);
  console.log('key         : ' + found.key);
  console.log('keyLocation : ' + keyLocation);
  console.log('待提交      : ' + urls.length + ' 条' + (total > urls.length ? ' (总 ' + total + ' 条,本次截取 ' + urls.length + ')' : '') + (DELETED_ONLY ? ' [已删除 URL]' : ''));
  console.log('目标引擎    : ' + endpoints.join(', '));

  if (DRY) {
    urls.forEach((u) => console.log('  DRY  ' + u));
    console.log('\n(--dry-run,未发起请求。共 ' + urls.length + ' 条)');
    return;
  }

  const payload = {
    host: HOST,
    key: found.key,
    keyLocation,
    urlList: urls
  };

  let bad = 0;
  for (const ep of endpoints) {
    let res, text;
    try {
      res = await fetch(ep, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
      });
      text = (await res.text()).trim();
    } catch (e) {
      bad++;
      console.error('✗ ' + ep + ' 请求失败: ' + e.message);
      console.error('  提示:墙内请用 NODE_USE_ENV_PROXY=1 http_proxy=http://127.0.0.1:1081 运行。');
      continue;
    }
    const ok = res.status === 200 || res.status === 202;
    console.log((ok ? '✓ ' : '✗ ') + ep + ' → HTTP ' + res.status + ' ' + (res.statusText || '') + (text ? ' | ' + text.slice(0, 200) : ''));
    if (!ok) {
      bad++;
      if (res.status === 403) console.error('  403 = key 文件无法访问或内容不匹配:' + keyLocation);
      if (res.status === 422) console.error('  422 = URL 与 host 不匹配,或 key 与 key 文件不一致');
      if (res.status === 429) console.error('  429 = 提交过于频繁,稍后重试');
    }
  }
  console.log(bad ? '\n部分引擎提交失败。' : '\n全部引擎已接受。');
  if (bad) process.exit(1);
})();

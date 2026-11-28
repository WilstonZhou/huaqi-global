#!/usr/bin/env node
'use strict';
/*
 * 页脚唯一官网声明：在 footer-bottom 顶部插入一条可核验的官方域名提示。
 *
 * 目的：让每个页面都能明确看到「hq10000.com 是华企环球唯一官方网站」，
 * 并通过 /official 进入身份核验页，降低仿冒域名/冒名顾问风险。
 *
 * 幂等：以 official-domain:start/end 标记，重复运行不重复插入。
 * 用法：
 *   node scripts/inject-official-domain.js          # 写入
 *   node scripts/inject-official-domain.js --check  # 只检查，有待更新时退出码 1
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const START = '<!-- official-domain:start -->';
const END = '<!-- official-domain:end -->';
const BLOCK = START +
  '<div class="footer-official">华企环球唯一官方网站：<a href="/official">hq10000.com</a> · 谨防仿冒域名与冒名顾问</div>' +
  END;

function htmlFiles() {
  const tracked = execFileSync('git', ['ls-files', '*.html'], { cwd: ROOT, encoding: 'utf8' });
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '*.html'], { cwd: ROOT, encoding: 'utf8' });
  return Array.from(new Set((tracked + '\n' + untracked).split('\n').filter(Boolean)));
}

let changed = 0;
let skipped = 0;

htmlFiles().forEach(function (file) {
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  if (before.indexOf('footer-bottom') === -1) {
    skipped += 1;
    return;
  }
  if (before.indexOf(START) !== -1) {
    const existing = new RegExp(START + '[\\s\\S]*?' + END);
    const after = before.replace(existing, BLOCK);
    if (after === before) {
      skipped += 1;
      return;
    }
    changed += 1;
    if (CHECK) console.log('待更新: ' + file);
    else fs.writeFileSync(full, after, 'utf8');
    return;
  }
  const after = before.replace(/(<div class="footer-bottom">)/, '$1\n    ' + BLOCK);
  if (after === before) {
    skipped += 1;
    return;
  }
  changed += 1;
  if (CHECK) {
    console.log('待更新: ' + file);
  } else {
    fs.writeFileSync(full, after, 'utf8');
  }
});

console.log('唯一官网页脚声明: ' + (CHECK ? '待更新 ' : '更新 ') + changed + ' 个页面，跳过 ' + skipped + ' 个');
if (CHECK && changed > 0) process.exit(1);

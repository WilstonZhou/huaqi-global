#!/usr/bin/env node
'use strict';
/*
 * 静态联系方式兜底：页脚手机号包成 tel: 链接，并补企业微信客服入口。
 *
 * 为什么需要：咨询入口里的浮动栏、移动端底部 CTA 由 assets/js/main.js 动态渲染。
 * JS 加载失败、被拦截或慢半拍时，页面上没有可拨号的电话，也没有企业微信入口。
 * 页脚本身是静态 HTML，写入 tel: 与企微链接后不依赖 JS 也能发起咨询。
 *
 * 幂等：电话以 class="footer-tel"、企微以 class="footer-wecom" 为标记；
 * 页面已有其他静态企微入口（如 contact.html 的二维码卡片）时不重复添加。
 * 用法：
 *   node scripts/inject-static-contact.js          # 写入
 *   node scripts/inject-static-contact.js --check  # 只检查，有待更新时退出码 1
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');
const TEL = 'tel:+8618610902181';
const DISPLAY = '186-1090-2181';
const LINK = '<a class="footer-tel" href="' + TEL + '">' + DISPLAY + '</a>';
const WECOM = 'https://work.weixin.qq.com/kfid/kfcccf23b17172fd661';
const WECOM_LINK = '<a class="footer-wecom" href="' + WECOM + '" target="_blank" rel="noopener">企微客服</a>';

function htmlFiles() {
  // 同时纳入已跟踪页面和新增但尚未 git add 的页面；--exclude-standard 会排除
  // .vercel/、node_modules/ 等被忽略目录，避免改动构建产物。
  const tracked = execFileSync('git', ['ls-files', '*.html'], { cwd: ROOT, encoding: 'utf8' });
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '*.html'], { cwd: ROOT, encoding: 'utf8' });
  return Array.from(new Set((tracked + '\n' + untracked).split('\n').filter(Boolean)));
}

// 统一历史 tel 链接格式，兼容 tel:186-1090-2181 / tel:18610902181 / 已规范格式。
function normalizeTel(html) {
  return html.replace(/href="tel:(?:\+?86)?186[-\s]?1090[-\s]?2181"/g, 'href="' + TEL + '"');
}

function footerRange(html) {
  const start = html.lastIndexOf('<footer');
  const end = html.lastIndexOf('</footer>');
  if (start === -1 || end <= start) return null;
  return { start: start, end: end };
}

function wrapFooterPhone(html) {
  const range = footerRange(html);
  if (!range) return { html: html, wrapped: 0 };
  const footer = html.slice(range.start, range.end);
  if (footer.indexOf('class="footer-tel"') !== -1) return { html: html, wrapped: 0 };

  let wrapped = 0;
  const next = footer
    .replace(/📞 186-1090-2181\(微信同号\)/g, function () {
      wrapped += 1;
      return '📞 ' + LINK + '(微信同号)';
    })
    .replace(/<\/svg> 186-1090-2181\(微信同号\)/g, function () {
      wrapped += 1;
      return '</svg> ' + LINK + '(微信同号)';
    });
  if (wrapped === 0) return { html: html, wrapped: 0 };
  return { html: html.slice(0, range.start) + next + html.slice(range.end), wrapped: wrapped };
}

function ensureWecom(html) {
  // 页面已有静态企微入口（如 contact.html 的二维码卡片）时不重复添加。
  if (html.indexOf('work.weixin.qq.com') !== -1) return html;

  const range = footerRange(html);
  if (!range) return html;
  const footer = html.slice(range.start, range.end);

  // 标准页脚：紧跟手机号链接追加，保持同一行，避免额外占高。
  let added = false;
  let next = footer.replace(
    /(<a class="footer-tel" href="tel:\+8618610902181">186-1090-2181<\/a>\(微信同号\))/,
    function (match) {
      added = true;
      return match + ' · ' + WECOM_LINK;
    }
  );

  // 自定义页脚（linyi）：在咨询热线段后新增一行。
  if (!added) {
    next = footer.replace(
      /(<p>咨询热线（微信同号）：<a href="tel:\+8618610902181">186-1090-2181<\/a><\/p>)/,
      function (match) {
        added = true;
        return match + '\n        <p>' + WECOM_LINK + '</p>';
      }
    );
  }

  if (!added) return html;
  return html.slice(0, range.start) + next + html.slice(range.end);
}

const files = htmlFiles();
let changed = 0;
let skipped = 0;
const warnings = [];

files.forEach(function (file) {
  const full = path.join(ROOT, file);
  const before = fs.readFileSync(full, 'utf8');
  let html = normalizeTel(before);

  const phone = wrapFooterPhone(html);
  html = phone.html;
  if (phone.wrapped === 0 && html.indexOf('class="footer-tel"') === -1) {
    const range = footerRange(html);
    if (range) {
      const footer = html.slice(range.start, range.end);
      if (footer.indexOf(DISPLAY) !== -1 && footer.indexOf('<a ') === -1) {
        warnings.push(file + ': 页脚含手机号，但标记不符合已知模式，未包裹');
      }
    }
  }

  const hadWecom = html.indexOf('work.weixin.qq.com') !== -1;
  html = ensureWecom(html);
  if (!hadWecom && html.indexOf('work.weixin.qq.com') === -1) {
    warnings.push(file + ': 未找到可插入企业微信入口的页脚模式');
  }

  if (html === before) {
    skipped += 1;
    return;
  }
  changed += 1;
  if (CHECK) {
    console.log('待更新: ' + file);
  } else {
    fs.writeFileSync(full, html, 'utf8');
  }
});

warnings.forEach(function (warning) {
  console.warn('警告: ' + warning);
});
console.log('静态联系方式: ' + (CHECK ? '待更新 ' : '更新 ') + changed + ' 个页面，跳过 ' + skipped + ' 个，警告 ' + warnings.length + ' 个');

if (CHECK && changed > 0) process.exit(1);

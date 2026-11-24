#!/usr/bin/env node
'use strict';
/*
 * 把 JS 渲染的 FAQ 预渲染进静态 HTML(幂等)。
 *
 * 为什么:contact / ai-match / delivery-tracking 三页的 FAQ 挂在空容器
 * <div id="faqList"></div> 上,由 main.js 运行时填充。百度和中文 AI 检索端
 * 基本不执行 JS —— 这些页面在它们眼里「没有 FAQ」,而这几页恰好是
 * 「华企环球怎么联系/靠不靠谱」这类品牌问句的落点。
 *
 * 同时补 FAQPage 结构化数据(可见问答与 schema 一一对应)。
 *
 * 用法:
 *   node scripts/prerender-faq.js            # 写入
 *   node scripts/prerender-faq.js --check    # 只检查,缺失即退出码 1
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

global.window = {};
require(path.join(ROOT, 'assets/js/data.js'));
const D = global.window.HQ_DATA;
const FAQ = (D && D.faq) || [];
if (!FAQ.length) {
  console.error('data.js 里没有 faq 数据');
  process.exit(2);
}

const itemHtml = (f) =>
  '<div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">' +
  f.q +
  '</div><div class="faq-a"><p>' +
  f.a +
  '</p></div></div>';

const RENDERED = FAQ.map(itemHtml).join('');
const EMPTY_RE = /(<div id="faqList">)([\s\S]*?)(<\/div>\s*<div class="text-center)/;
const EMPTY_SIMPLE = /<div id="faqList"><\/div>/;

function withSchema(html) {
  if (html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"')) return html;
  const node = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.slice(0, 8).map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const block = '<script type="application/ld+json">\n' + JSON.stringify(node, null, 2) + '\n</script>\n';
  const i = html.indexOf('</head>');
  return i === -1 ? html : html.slice(0, i) + block + html.slice(i);
}

let changed = 0;
const targets = ['contact.html', 'ai-match.html', 'delivery-tracking.html'];

for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  if (EMPTY_SIMPLE.test(html)) {
    html = html.replace(EMPTY_SIMPLE, '<div id="faqList">' + RENDERED + '</div>');
  } else if (html.includes('faq-item')) {
    // 已渲染过:整段重渲染,保证与数据源一致(幂等)
    html = html.replace(EMPTY_RE, '$1' + RENDERED + '$3');
  }

  html = withSchema(html);

  if (html !== before) {
    changed++;
    if (CHECK) console.log('✗ 未预渲染: ' + rel);
    else fs.writeFileSync(file, html);
  } else if (CHECK) {
    console.log('✓ ' + rel);
  }
}

if (CHECK) {
  console.log(changed ? `\n${changed} 个页面需要预渲染(运行 node scripts/prerender-faq.js)` : '\n全部已就绪');
  process.exit(changed ? 1 : 0);
}
console.log(`预渲染 FAQ 页面 ${changed} 个`);

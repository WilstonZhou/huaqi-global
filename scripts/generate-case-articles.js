// 生成 6 篇「案例型专题文章」:从案例库里抽出高频场景,写成可独立承接搜索的长文
// 文章结构固定:速答 → 判断标准 → 处理步骤 → 案例 → 预防清单 → FAQ
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

function sectionHtml(s) {
  var html = '<h2 id="' + s.id + '">' + s.h2 + '</h2>\n';
  (s.blocks || []).forEach(function (b) {
    if (b.type === 'p') html += '<p>' + b.html + '</p>\n';
    else if (b.type === 'h3') html += '<h3>' + b.text + '</h3>\n';
    else if (b.type === 'ul') html += '<ul>\n' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('\n') + '\n</ul>\n';
    else if (b.type === 'ol') html += '<ol>\n' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('\n') + '\n</ol>\n';
    else if (b.type === 'table') {
      html += '<table>\n<thead><tr>' + b.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>\n<tbody>\n';
      b.rows.forEach(function (r) { html += '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>\n'; });
      html += '</tbody>\n</table>\n';
    } else if (b.type === 'note') html += '<p class="note-soft"><strong>' + b.head + '</strong>' + b.text + '</p>\n';
    else if (b.type === 'case') {
      html += '<div class="case-card" style="margin:18px 0;"><div style="margin-bottom:8px;"><span class="case-tag">' + b.tag + '</span></div>' +
        '<div class="card-title">' + b.title + '</div>' +
        '<div class="card-text mb-8"><strong class="c-primary">情形:</strong>' + b.pain + '</div>' +
        '<div class="card-text mb-8"><strong class="c-primary">处理:</strong>' + b.action + '</div>' +
        '<div class="card-text mb-8"><strong class="c-primary">结果:</strong>' + b.result + '</div>' +
        '<div class="fs-13" style="border-top:1px dashed var(--c-border);padding-top:10px;color:var(--c-text-light);"><strong>提示:</strong>' + b.tip + '</div></div>\n';
    }
  });
  return html;
}

function articlePage(opt) {
  var p = '../';
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="/knowledge">知识中心</a> / ' + opt.shortTitle,
    title: opt.title,
    subtitle: opt.subtitle
  });
  body += '\n\n<section class="section">\n  <div class="container">\n    <div class="article-layout">\n      <article class="article-body">\n' +
    lib.answerBlock(opt.answer) +
    opt.sections.map(sectionHtml).join('\n') +
    '\n        <h2 id="faq">常见问题</h2>\n        <div>' + lib.faqItems(opt.faqs) + '</div>\n' +
    '\n      </article>\n\n      <aside class="article-sidebar">\n' +
    '        <div class="sidebar-card article-toc">\n          <h3>📖 本文目录</h3>\n' +
    opt.toc.map(function (t) { return '<a href="#' + t.id + '">' + t.name + '</a>'; }).join('\n') +
    '          <a href="#faq">常见问题</a>\n        </div>\n' +
    '        <div class="sidebar-card">\n          <h3>📚 相关文章</h3>\n' +
    opt.related.map(function (r) { return '<a href="' + r.l + '">' + r.t + '</a>'; }).join('\n') +
    '        </div>\n' +
    '        <div class="sidebar-card">\n          <h3>🤖 AI 智能匹配</h3>\n          <p class="fs-14 c-text-light mb-12 lh-16">不确定怎么处理?AI 3 分钟根据情况给出路径参考。</p>\n          <a class="btn btn-gold btn-sm" href="../ai-match">立即匹配</a>\n        </div>\n' +
    '        <div class="sidebar-card">\n          <h3>📞 咨询顾问</h3>\n          <p class="fs-14 c-text-light mb-12 lh-16">电话/微信 186-1090-2181,顾问将在 1 个工作日内回复。</p>\n          <a class="btn btn-outline btn-sm" href="../contact">联系顾问</a>\n        </div>\n' +
    '      </aside>\n    </div>\n  </div>\n</section>\n\n' +
    lib.ctaBanner('看完还有疑问?', '把您的具体情况告诉 AI,3 分钟生成处理路径参考', p);
  write('knowledge/' + opt.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/knowledge/' + opt.slug,
    ogType: 'article',
    relatedModules: 'knowledge',
    title: opt.metaTitle,
    desc: opt.metaDesc,
    keywords: opt.keywords,
    schemas: [lib.faqSchema(opt.faqs),
      lib.breadcrumbSchema([
        { name: '首页', url: 'https://hq10000.com' },
        { name: '知识中心', url: 'https://hq10000.com/knowledge' },
        { name: opt.shortTitle, url: 'https://hq10000.com/knowledge/' + opt.slug }
      ])],
    body: body
  }));
}

var ARTICLES = require('./data-case-articles');
ARTICLES.forEach(articlePage);
console.log('case articles done: ' + ARTICLES.length);
module.exports = ARTICLES;

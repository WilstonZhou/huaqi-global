// 生成政策栏目单篇文章:/news/<slug>
// 用法: node scripts/generate-news.js
// 结构固定五段:速答 → 事实卡 → 影响分析 → 行动清单 → FAQ,末尾附来源与核验日期。
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var articles = require('./data-news');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

articles.forEach(function (a) {
  var p = '../';
  var url = 'https://hq10000.com/news/' + a.slug;

  var schemas = [
    lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '政策动态', url: 'https://hq10000.com/news' },
      { name: a.title, url: url }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.metaDesc,
      inLanguage: 'zh-CN',
      datePublished: a.published,
      dateModified: a.modified,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      author: { '@id': 'https://hq10000.com/#organization' },
      publisher: { '@id': 'https://hq10000.com/#organization' },
      about: a.section,
      citation: { '@type': 'CreativeWork', name: a.source.name, url: a.source.url }
    },
    lib.faqSchema(a.faqs)
  ];

  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="' + p + 'news">政策动态</a> / ' + a.section,
    title: a.title,
    subtitle: '政策解读 · 核验于 ' + a.reviewedAt + ' · 以官方最新公布为准'
  });

  body += lib.answerBlock(a.quick);

  // 事实卡
  body += '\n\n<!-- 事实卡 -->\n<section class="section section-soft">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">FACT CARD</span><h2 class="section-title">一、变了什么</h2></div>\n' +
    '    <div class="hub-table-wrap"><table class="pricing-table facts-table">\n      <thead><tr><th>项目</th><th>口径</th></tr></thead>\n      <tbody>\n' +
    a.facts.map(function (f) {
      return '        <tr><td data-label="项目">' + f.k + '</td><td>' + f.v + '</td></tr>';
    }).join('\n') +
    '\n      </tbody>\n    </table></div>\n' +
    '    <p class="fs-12 c-text-light mt-16">来源:' + a.source.name + '(官方页面)· 核验日期 ' + a.reviewedAt +
    ' · 具体税率、门槛与罚则以官方最新公布为准。</p>\n  </div>\n</section>';

  // 影响分析
  body += '\n\n<!-- 影响分析 -->\n<section class="section">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">IMPACT</span><h2 class="section-title">二、影响谁</h2></div>\n' +
    a.impact.paras.map(function (t) { return '<p class="mb-16">' + t + '</p>'; }).join('\n') +
    lib.contentBlock('判定要点', null, a.impact.list) +
    '\n  </div>\n</section>';

  // 行动清单
  body += '\n\n<!-- 行动清单 -->\n<section class="section section-soft">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">ACTION LIST</span><h2 class="section-title">三、现在该做什么</h2></div>\n' +
    lib.contentBlock('按顺序执行', null, a.actions, true) +
    '\n  </div>\n</section>';

  // 官方来源
  body += '\n\n<!-- 官方来源 -->\n<section class="section">\n  <div class="container container-sm">\n' +
    '    <div class="info-card"><div class="info-label">官方来源</div>\n' +
    '      <p class="mb-8">本文事实以官方公布为准,原文入口:' +
    '<a href="' + a.source.url + '" rel="nofollow noopener" target="_blank">' + a.source.name + '</a></p>\n' +
    '      <p class="fs-12 c-text-light">核验日期:' + a.reviewedAt + ' · 更新时间:' + a.modified +
    ' · 政策口径变化时本文会同步修订并在文末记录。</p>\n    </div>\n  </div>\n</section>';

  // FAQ
  body += '\n\n<!-- FAQ -->\n<section class="section section-soft">\n  <div class="container container-sm">\n' +
    '    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">四、常见问题</h2></div>\n' +
    '    <div>' + lib.faqItems(a.faqs) + '</div>\n  </div>\n</section>';

  // 关联服务
  body += '\n\n<!-- 关联服务 -->\n<section class="section">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">RELATED</span><h2 class="section-title">相关服务</h2></div>\n' +
    '    <div class="features-grid">' + a.related.map(function (r) {
      return '<a class="feature-card" href="' + r.l + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r.t + '</div><div class="feature-desc">' + r.d + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('这类政策变化影响到您的业务了吗?', '把适用主体与时间点讲清楚,再决定要不要调整架构', p);

  write('news/' + a.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: url,
    title: a.metaTitle,
    desc: a.metaDesc,
    keywords: a.title + ',政策解读,' + a.section + ',华企环球',
    ogType: 'article',
    schemas: schemas,
    body: body
  }));
});

console.log('news articles done: ' + articles.length);

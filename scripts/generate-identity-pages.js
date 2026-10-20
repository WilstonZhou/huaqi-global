// 生成身份规划 · 国别子页:/solutions/identity-planning/{hk|sg|ae}
// 数据源:scripts/data-identity-pages.js
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var pages = require('./data-identity-pages');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

pages.forEach(function (pg) {
  var p = '../../';
  var url = 'https://hq10000.com/solutions/identity-planning/' + pg.slug;
  var hubUrl = 'https://hq10000.com/solutions/identity-planning';

  var schemas = [
    lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '身份与资产规划', url: hubUrl },
      { name: pg.pageName, url: url }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: pg.pageName + '咨询与办理',
      serviceType: pg.pageName,
      description: pg.metaDesc,
      provider: { '@id': 'https://hq10000.com/#organization' },
      url: url,
      areaServed: [pg.name],
      inLanguage: 'zh-CN'
    }
  ];

  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="/solutions/identity-planning">身份与资产规划</a> / ' + pg.pageName,
    title: pg.h1,
    subtitle: pg.intro
  });

  body += lib.answerBlock(pg.quick);

  body += '\n\n<!-- 关键口径 -->\n<section class="section section-soft">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">' + pg.en + '</span>' +
    '<h2 class="section-title">' + pg.pageName + '关键口径</h2>' +
    '<p class="section-desc">先看门槛与期限,再判断是否适合;政策会调整,办理前请与顾问确认当期口径。</p></div>\n' +
    '    <div class="hub-table-wrap"><table class="pricing-table facts-table">\n' +
    '      <thead><tr><th>项目</th><th>' + pg.name + '口径</th></tr></thead>\n      <tbody>\n' +
    pg.facts.map(function (f) {
      return '        <tr><td data-label="项目">' + f.k + '</td><td>' + f.v + '</td></tr>';
    }).join('\n') +
    '\n      </tbody>\n    </table></div>\n' +
    '    <p class="fs-12 c-text-light mt-16">门槛、期限与随行范围以当地官方最新公布为准;华企环球按季度复核上述口径。</p>\n' +
    '  </div>\n</section>';

  body += '\n\n<!-- 正文 -->\n<section class="section">\n  <div class="container">\n' +
    pg.sections.map(function (s) {
      return lib.contentBlock(s.h, s.paras, s.list);
    }).join('\n') +
    '\n  </div>\n</section>';

  body += '\n\n<!-- 办理步骤 -->\n<section class="section section-soft">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">PROCESS</span><h2 class="section-title">' + pg.pageName + '办理步骤</h2></div>\n' +
    lib.contentBlock('标准流程', null, pg.steps, true) +
    '\n  </div>\n</section>';

  body += '\n\n<!-- 关联 -->\n<section class="section">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">RELATED</span><h2 class="section-title">相关页面</h2></div>\n' +
    '    <div class="features-grid">' +
    pg.related.map(function (r) {
      return '<a class="feature-card" href="' + r.l + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r.t + '</div><div class="feature-desc">' + r.d + '</div></a>';
    }).join('\n') +
    '</div>\n  </div>\n</section>';

  body += '\n\n<!-- FAQ -->\n<section class="section section-soft">\n  <div class="container container-sm">\n' +
    '    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">' + pg.pageName + '常见问题</h2></div>\n' +
    '    <div>' + lib.faqItems(pg.faqs) + '</div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('不确定哪条身份路径适合您?', 'AI 智能匹配 3 分钟出初步方向,或由顾问结合家庭与业务情况一对一评估', p);

  write('solutions/identity-planning/' + pg.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: url,
    alternates: null,
    title: pg.metaTitle,
    desc: pg.metaDesc,
    keywords: pg.pageName + ',' + pg.name + '身份,' + pg.en + ',华企环球',
    schemas: schemas.concat([lib.faqSchema(pg.faqs), lib.howToSchema(pg.pageName + '办理流程', pg.steps)]),
    body: body
  }));
});

console.log('identity pages done');

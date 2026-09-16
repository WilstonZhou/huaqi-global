// 生成新增服务页:海牙认证 / 海外商标 / VAT·EPR / 离岸公司
// 用法: node scripts/generate-service-pages.js
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var services = require('./data-services');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

services.forEach(function (s) {
  var p = '../';
  var url = 'https://hq10000.com/services/' + s.slug;
  var schemas = [
    lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '服务', url: 'https://hq10000.com/services/company-registration' },
      { name: s.name, url: url }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": s.name,
      "provider": { "@id": "https://hq10000.com/#organization" },
      "url": url,
      "areaServed": ["CN", "HK", "SG", "MY", "TH", "US", "GB", "AE", "VN", "ID"],
      "inLanguage": "zh-CN"
    }
  ];

  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="' + p + 'services/company-registration">服务</a> / ' + s.name,
    title: s.icon + ' ' + s.title,
    subtitle: s.intro
  });

  body += '\n\n<!-- 核心信息 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">' + s.en + '</span><h2 class="section-title">' + s.name + '核心信息</h2></div>\n    ' + lib.statCards(s.stats) + '\n  </div>\n</section>';

  body += '\n\n<!-- 正文区块 -->\n<section class="section">\n  <div class="container">\n    ' + s.blocks.map(function (b) {
    return lib.contentBlock(b.h, b.paras || null, b.list || null, !!b.ordered);
  }).join('\n') + '\n  </div>\n</section>';

  body += '\n\n<!-- 关联服务 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">RELATED SERVICES</span><h2 class="section-title">相关服务</h2><p class="section-desc">出海是一个组合动作,注册、开户、合规与税务规划配套完成,落地才顺。</p></div>\n    <div class="features-grid">' + s.related.map(function (r) {
    return '<a class="feature-card" href="' + r.l + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r.t + '</div><div class="feature-desc">' + r.d + '</div></a>';
  }).join('\n') + '</div>\n  </div>\n</section>';

  body += '\n\n<!-- FAQ -->\n<section class="section">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">' + s.name + '常见问题</h2></div>\n    <div>' + lib.faqItems(s.faqs) + '</div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('不确定 ' + s.name + ' 是否适用于您?', 'AI 智能匹配 3 分钟出初步方案,或由顾问一对一确认材料与周期', p);

  write('services/' + s.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: url,
    title: s.metaTitle,
    desc: s.metaDesc,
    keywords: s.name + ',' + s.en + ',华企环球',
    schemas: schemas.concat([lib.faqSchema(s.faqs)]),
    body: body
  }));
});

console.log('service pages done');

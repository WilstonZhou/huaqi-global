// 生成 8 个热门国家独立页 + country/index.html
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var countries = require('./data-countries');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

countries.forEach(function (c) {
  var p = '../';
  var schemas = [
    lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '热门国家注册', url: 'https://hq10000.com/country' },
      { name: c.name + '公司注册', url: 'https://hq10000.com/country/' + c.slug }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": c.name + "公司注册",
      "provider": { "@id": "https://hq10000.com/#organization" },
      "url": "https://hq10000.com/country/" + c.slug,
      "areaServed": [c.name],
      "inLanguage": "zh-CN"
    }
  ];
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="index">热门国家注册</a> / ' + c.name + '公司注册',
    title: c.flag + ' ' + c.name + '公司注册',
    subtitle: c.intro
  });
  body += '\n\n<!-- 核心数据 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">' + c.en.toUpperCase() + '</span><h2 class="section-title">' + c.name + '公司注册核心信息</h2></div>\n    ' + lib.statCards([
      { label: '监管机构', value: c.regulator },
      { label: '公司类型', value: c.type },
      { label: '办理周期', value: c.period },
      { label: '服务模式', value: c.mode }
    ]) + '\n  </div>\n</section>';
  body += '\n\n<!-- 条件/材料/流程 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">REGISTRATION GUIDE</span><h2 class="section-title">' + c.name + '公司注册指南</h2></div>\n    ' + lib.contentBlock(c.name + '注册核心条件', null, c.conditions) +
    lib.contentBlock('所需材料清单', null, c.materials) +
    lib.contentBlock(c.name + '注册办理流程', null, c.flow, true) + '\n  </div>\n</section>';
  body += '\n\n<!-- 关联服务 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">RELATED SERVICES</span><h2 class="section-title">' + c.name + '公司相关服务</h2><p class="section-desc">注册只是开始,开户、年审、审计与税务规划配套完成,出海才能顺利落地。</p></div>\n    <div class="features-grid">' + c.related.map(function (r) {
      return '<a class="feature-card" href="' + r.l + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r.t + '</div><div class="feature-desc">' + r.d + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  if (c.article) {
    body += '\n\n<!-- 深度指南 -->\n<section class="section">\n  <div class="container">\n    <div class="info-card p-24"><h3>深度阅读</h3><p class="mb-8">' + c.article.title + '</p><a class="btn btn-outline btn-sm" href="' + c.article.link + '">阅读全文 →</a></div>\n  </div>\n</section>';
  }
  body += '\n\n<!-- FAQ -->\n<section class="section section-soft">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">' + c.name + '公司注册常见问题</h2></div>\n    <div>' + lib.faqItems(c.faqs) + '</div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('3 分钟生成您的' + c.name + '出海方案', 'AI 智能匹配 + 定制报价 + 交付追踪,全流程透明可控', p);
  write('country/' + c.slug + '.html', lib.buildPage({
    prefix: p,
    title: c.metaTitle,
    desc: c.metaDesc,
    keywords: c.name + '公司注册,' + c.name + '公司注册流程,' + c.name + '公司注册费用,华企环球',
    schemas: schemas,
    body: body
  }));
});

// country/index.html
(function () {
  var p = '../';
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / 热门国家注册',
    title: '热门国家公司注册',
    subtitle: '覆盖全球 126 个国家及地区,核心 60+ 国家/地区可直办。下方为 8 大热门市场独立指南,包含监管机构、公司类型、注册条件、材料、流程与常见问题。'
  });
  body += '\n\n<!-- 国家卡片 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">POPULAR COUNTRIES</span><h2 class="section-title">8 大热门市场,一点直达</h2></div>\n    <div class="features-grid">' + countries.map(function (c) {
      return '<a class="feature-card" href="' + c.slug + '" style="text-decoration:none;"><div class="feature-icon">' + c.flag + '</div><div class="feature-title">' + c.name + '公司注册</div><div class="feature-desc">' + c.regulator + ' · ' + c.period + '<br>' + c.type + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 更多国家 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">MORE COUNTRIES</span><h2 class="section-title">更多国家与地区</h2><p class="section-desc">越南、柬埔寨、菲律宾、印尼、印度、阿联酋、沙特、迪拜自由区、澳大利亚、加拿大、德国、法国、荷兰、爱尔兰、卢森堡、塞浦路斯、马耳他、开曼群岛、BVI 等 100+ 国家/地区均可定制办理,具体方案请咨询顾问。</p></div>\n    <div class="text-center"><a href="' + p + 'global-network" class="btn btn-outline">查看全球 126 国覆盖网络 →</a></div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('不确定选哪个国家?', 'AI 智能匹配引擎,3 分钟根据您的业务推荐最优注册方案', p);
  write('country/index.html', lib.buildPage({
    prefix: p,
    title: '热门国家公司注册 | 新加坡/美国/香港/马来西亚/泰国 | 华企环球',
    desc: '华企环球热门国家公司注册指南:新加坡、美国、香港、马来西亚、泰国、英国、日本、韩国八大市场,监管机构、注册条件、流程与费用参考一页直达,全程代办。',
    keywords: '海外公司注册,新加坡公司注册,美国公司注册,香港公司注册,马来西亚公司注册,泰国公司注册',
    schemas: [lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '热门国家注册', url: 'https://hq10000.com/country' }
    ])],
    body: body
  }));
})();

console.log('country pages done');

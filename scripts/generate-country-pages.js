// 生成 8 个热门国家独立页 + country/index.html
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var countries = require('./data-countries');
var compliance = require('./data-country-compliance');
var hubs = require('./data-hubs');

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
      "name": c.name + "公司注册代办服务",
      "serviceType": c.name + "公司注册",
      "description": c.intro,
      "provider": { "@id": "https://hq10000.com/#organization" },
      "url": "https://hq10000.com/country/" + c.slug,
      "areaServed": [c.name],
      "inLanguage": "zh-CN"
    }
  ];
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="/country">热门国家注册</a> / ' + c.name + '公司注册',
    title: c.flag + ' ' + c.name + '公司注册',
    subtitle: c.intro
  });
  body += lib.answerBlock(c.name + '公司注册由 <strong>' + c.regulator + '</strong> 监管,常用主体类型为 ' + c.type + ',标准办理周期 ' + c.period + '。具体条件、材料与费用以顾问确认为准。');
  body += '\n\n<!-- 核心数据 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">' + c.en.toUpperCase() + '</span><h2 class="section-title">' + c.name + '公司注册核心信息</h2></div>\n    ' + lib.statCards([
      { label: '监管机构', value: c.regulator },
      { label: '公司类型', value: c.type },
      { label: '办理周期', value: c.period },
      { label: '服务模式', value: c.mode }
    ]) + (c.facts && c.facts.length ? '\n    <div class="hub-table-wrap mt-24"><table class="pricing-table facts-table">\n      <thead><tr><th>项目</th><th>' + c.name + '市场口径</th></tr></thead>\n      <tbody>\n' + c.facts.map(function (f) {
      return '        <tr><td data-label="项目">' + f.k + '</td><td>' + f.v + '</td></tr>';
    }).join('\n') + '\n      </tbody>\n    </table></div>\n    <p class="fs-12 c-text-light mt-16">注册资本、税率、时限与豁免标准均以当地监管机构最新公布为准;华企环球按季度复核上述口径,具体适用请联系顾问确认。</p>' : '') + '\n  </div>\n</section>';
  body += '\n\n<!-- 条件/材料/流程 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">REGISTRATION GUIDE</span><h2 class="section-title">' + c.name + '公司注册指南</h2></div>\n    ' + lib.contentBlock(c.name + '注册核心条件', null, c.conditions) +
    lib.contentBlock('所需材料清单', null, c.materials) +
    lib.contentBlock(c.name + '注册办理流程', null, c.flow, true) + '\n  </div>\n</section>';
  body += '\n\n<!-- 关联服务 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">RELATED SERVICES</span><h2 class="section-title">' + c.name + '公司相关服务</h2><p class="section-desc">注册只是开始,开户、年审、审计与税务规划配套完成,出海才能顺利落地。</p></div>\n    <div class="features-grid">' + c.related.map(function (r) {
      return '<a class="feature-card" href="' + r.l + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r.t + '</div><div class="feature-desc">' + r.d + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  // 本地年审 / 审计 / 税务 / 开户矩阵(大陆「地域 × 服务」词的正文本体)
  var comp = compliance[c.slug];
  if (comp) {
    body += '\n\n<!-- 本地合规与开户 -->\n<section class="section">\n  <div class="container">\n' +
      '    <div class="section-header"><span class="section-eyebrow">LOCAL COMPLIANCE</span>' +
      '<h2 class="section-title">' + c.name + '公司年审、审计、税务与开户</h2>' +
      '<p class="section-desc">' + comp.lead + '</p></div>\n' +
      comp.items.map(function (it) {
        return '<div class="content-block"><h3>' + it.title + '</h3><p>' + it.body + '</p>' +
          '<p><a class="feature-link" href="' + it.link + '">' + it.title + '服务详情 →</a></p></div>';
      }).join('\n') + '\n  </div>\n</section>';
  }

  if (c.article) {
    body += '\n\n<!-- 深度指南 -->\n<section class="section">\n  <div class="container">\n    <div class="info-card p-24"><h3>深度阅读</h3><p class="mb-8">' + c.article.title + '</p><a class="btn btn-outline btn-sm" href="' + c.article.link + '">' + c.article.title + ' →</a></div>\n  </div>\n</section>';
  }
  body += '\n\n<!-- FAQ -->\n<section class="section section-soft">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">' + c.name + '公司注册常见问题</h2></div>\n    <div>' + lib.faqItems(c.faqs) + '</div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('3 分钟生成您的' + c.name + '出海方案', 'AI 智能匹配 + 定制报价 + 交付追踪,全流程透明可控', p);
  write('country/' + c.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/country/' + c.slug,
    alternates: null,
    title: c.metaTitle,
    desc: c.metaDesc,
    keywords: c.name + '公司注册,' + c.name + '注册公司,' + c.name + '公司注册费用,' + c.name + '公司注册代办,华企环球',
    schemas: schemas.concat([lib.faqSchema(c.faqs), lib.howToSchema(c.name + '公司注册流程', c.flow)]),
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
    subtitle: '覆盖全球 60 多个国家/地区,均可办理。下方为 ' + countries.length + ' 大热门市场独立指南,包含监管机构、公司类型、注册条件、材料、流程与常见问题。'
  });
  body += '\n\n<!-- 国家卡片 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">POPULAR COUNTRIES</span><h2 class="section-title">' + countries.length + ' 大热门市场,一点直达</h2></div>\n    <div class="features-grid">' + countries.map(function (c) {
      return '<a class="feature-card" href="' + p + 'country/' + c.slug + '" style="text-decoration:none;"><div class="feature-icon">' + c.flag + '</div><div class="feature-title">' + c.name + '公司注册</div><div class="feature-desc">' + c.regulator + ' · ' + c.period + '<br>' + c.type + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<section class="section" style="padding:22px 0 0;"><div class="container"><p class="section-sub" style="margin:0;">已办结的注册证书长什么样?<a href="' + p + 'credentials" style="font-weight:700;">查看各国下证样本 →</a></p></div></section>';
  body += lib.hubSections(hubs.country.sections);
  body += '\n\n<!-- FAQ -->\n<section class="section section-soft">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">选择注册地常见问题</h2></div>\n    <div>' + lib.faqItems(hubs.country.faqs) + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 更多国家 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">MORE COUNTRIES</span><h2 class="section-title">更多国家与地区</h2><p class="section-desc">越南、柬埔寨、菲律宾、印尼、印度、阿联酋、沙特、迪拜自由区、澳大利亚、加拿大、德国、法国、荷兰、爱尔兰、卢森堡、塞浦路斯、马耳他、开曼群岛、BVI 等 60 多个国家/地区均可办理,具体方案请咨询顾问。</p></div>\n    <div class="text-center"><a href="' + p + 'global-network" class="btn btn-outline">查看全球 60+ 国家/地区网络 →</a></div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('不确定选哪个国家?', 'AI 智能匹配引擎,3 分钟根据您的业务推荐最优注册方案', p);
  write('country/index.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/country',
    title: '热门国家公司注册 | 新加坡/美国/香港/马来西亚 | 华企环球',
    desc: '华企环球热门国家公司注册指南:新加坡、美国、香港、马来西亚、泰国、迪拜、开曼、BVI 等 13 个市场,含税率、年审窗口与选注册地判断方法,全程代办。',
    keywords: '海外公司注册,新加坡公司注册,美国公司注册,香港公司注册,马来西亚公司注册,泰国公司注册',
    schemas: [lib.faqSchema(hubs.country.faqs), lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '热门国家注册', url: 'https://hq10000.com/country' }
    ])],
    body: body
  }));
})();

console.log('country pages done');

// 生成新增服务页:海牙认证 / 海外商标 / VAT·EPR / 离岸公司
// 用法: node scripts/generate-service-pages.js
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var services = require('./data-services');
var deepen = require('./data-services-deepen');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

// 同链路相关服务(静态内链:补齐「已发现-尚未编入索引」页面的站点内引用密度)
// 说明:只列与当前服务处在同一业务链路、且客户会在同一阶段同时需要的页面;
//       目标是让每个服务页都有 4 条以上来自正文的内链,而不是只靠页脚一条。
var SIBLINGS = {
  'hk-bank-account': [
    ['bank-account', '公司开户(全地区)', '多地区账户方案对比与选择路径'],
    ['sg-bank-account', '新加坡银行开户', 'DBS / OCBC / UOB 远程开户'],
    ['us-bank-account', '美国银行开户', 'EIN + 美元收付账户'],
    ['hk-tax-filing', '香港公司报税', '利得税申报与离岸豁免']
  ],
  'sg-bank-account': [
    ['bank-account', '公司开户(全地区)', '多地区账户方案对比与选择路径'],
    ['hk-bank-account', '香港银行开户', '汇丰 / 恒生 / 中银香港账户'],
    ['us-bank-account', '美国银行开户', 'EIN + 美元收付账户'],
    ['tax-planning', '税务规划', 'GST 与跨境税务架构']
  ],
  'us-bank-account': [
    ['bank-account', '公司开户(全地区)', '多地区账户方案对比与选择路径'],
    ['us-llc', '美国 LLC 注册', '有限责任公司设立与维护'],
    ['us-inc', '美国 INC 注册', '股份公司与融资上市架构'],
    ['annual-review', '公司年审', '州年报与特许经营税']
  ],
  'offshore': [
    ['fund-planning', '资金规划', 'VIE / 红筹架构与 ODI 备案'],
    ['company-registration', '海外公司注册', '19 国主体设立与路径选择'],
    ['trademark', '海外商标注册', '离岸主体的品牌持有安排'],
    ['annual-review', '公司年审', '离岸主体的年度续牌义务']
  ],
  'vat': [
    ['tax-planning', '税务规划', '跨境税务与合规架构'],
    ['trademark', '海外商标注册', '跨境电商品牌与商标布局'],
    ['bank-account', '公司开户(全地区)', '跨境收款账户与资金通道'],
    ['other-services', '跨境合规矩阵', 'VAT / EPR / 认证 一站式合规']
  ],
  'apostille': [
    ['company-registration', '海外公司注册', '注册文件与公证认证衔接'],
    ['trademark', '海外商标注册', '商标权属文件的域外使用'],
    ['other-services', '跨境合规矩阵', '跨境文书与产品合规配套'],
    ['tax-planning', '税务规划', 'ODI 备案中的文件认证要求']
  ],
  'trademark': [
    ['eu-trademark', '欧盟商标注册', 'EUTM 一次覆盖 27 国'],
    ['trademark-transfer', '海外商标转让', '品牌收购与过户登记'],
    ['trademark-renewal', '海外商标续展', '到期监控与宽展期处理'],
    ['patent', '海外专利申请', '技术与品牌的组合保护']
  ],
  'hk-tax-filing': [
    ['hk-audit', '香港公司审计', '法定审计报告与账目整理'],
    ['audit', '公司审计', '多地区审计与财报口径'],
    ['hk-bank-account', '香港银行开户', '开户与账户维护'],
    ['annual-review', '公司年审', '年度申报与合规维护']
  ]
};

services.forEach(function (s) {
  // 内容加深层:把 data-services-deepen.js 里的补充区块 / FAQ / 事实表合并进来。
  // 只在数据层叠加,不改渲染逻辑 —— 未配置的页面输出完全不变。
  var extra = deepen[s.slug];
  if (extra) {
    s = Object.assign({}, s, {
      blocks: (s.blocks || []).concat(extra.blocks || []),
      faqs: (s.faqs || []).concat(extra.faqs || []),
      facts: (s.facts || []).concat(extra.facts || [])
    });
  }
  var p = '../';
  var url = 'https://hq10000.com/services/' + s.slug;
  var schemas = [
    lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '服务', url: 'https://hq10000.com/services' },
      { name: s.name, url: url }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": s.name + "代办服务",
      "serviceType": s.name,
      "description": s.metaDesc,
      "provider": { "@id": "https://hq10000.com/#organization" },
      "url": url,
      "areaServed": ["CN", "HK", "SG", "MY", "TH", "US", "GB", "AE", "VN", "ID"],
      "inLanguage": "zh-CN"
    }
  ];

  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="' + p + 'services">服务</a> / ' + s.name,
    title: s.icon + ' ' + s.title,
    subtitle: s.intro
  });

  body += lib.answerBlock(s.name + '关键参数：' + s.stats.slice(0, 3).map(function (x) { return x.label + ' ' + x.value; }).join('；') + '。具体适用范围与报价请咨询顾问确认。');

  body += '\n\n<!-- 核心信息 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">' + s.en + '</span><h2 class="section-title">' + s.name + '核心信息</h2></div>\n    ' + lib.statCards(s.stats) + (s.facts && s.facts.length ? '\n    <div class="hub-table-wrap mt-24"><table class="pricing-table facts-table">\n      <thead><tr><th>项目</th><th>口径</th></tr></thead>\n      <tbody>\n' + s.facts.map(function (f) {
      return '        <tr><td data-label="项目">' + f.k + '</td><td>' + f.v + '</td></tr>';
    }).join('\n') + '\n      </tbody>\n    </table></div>\n    <p class="fs-12 c-text-light mt-16">时限、门槛与审核口径以银行及监管机构最新要求为准;华企环球按季度复核,个案以顾问确认为准。</p>' : '') + '\n  </div>\n</section>';

  body += '\n\n<!-- 正文区块 -->\n<section class="section">\n  <div class="container">\n    ' + s.blocks.map(function (b) {
    return lib.contentBlock(b.h, b.paras || null, b.list || null, !!b.ordered);
  }).join('\n') + '\n  </div>\n</section>';

  body += '\n\n<!-- 关联服务 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">RELATED SERVICES</span><h2 class="section-title">相关服务</h2><p class="section-desc">出海是一个组合动作,注册、开户、合规与税务规划配套完成,落地才顺。</p></div>\n    <div class="features-grid">' + s.related.map(function (r) {
    return '<a class="feature-card" href="' + r.l + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r.t + '</div><div class="feature-desc">' + r.d + '</div></a>';
  }).join('\n') + '</div>\n  </div>\n</section>';

  // 同链路相关服务(仅对配置了 SIBLINGS 的页面输出,静态内链)
  var sib = SIBLINGS[s.slug];
  if (sib && sib.length) {
    body += '\n\n<!-- 同链路服务 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">SAME WORKFLOW</span><h2 class="section-title">同一链路上的相关服务</h2><p class="section-desc">这些服务通常与' + s.name + '在同一阶段一起决定,提前对齐可以少走弯路。</p></div>\n    <div class="features-grid">' + sib.map(function (r) {
      return '<a class="feature-card" href="' + p + 'services/' + r[0] + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r[1] + '</div><div class="feature-desc">' + r[2] + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  }

  body += '\n\n<!-- FAQ -->\n<section class="section">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">' + s.name + '常见问题</h2></div>\n    <div>' + lib.faqItems(s.faqs) + '</div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('不确定 ' + s.name + ' 是否适用于您?', 'AI 智能匹配 3 分钟出初步方案,或由顾问一对一确认材料与周期', p);

  write('services/' + s.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: url,
    title: s.metaTitle,
    desc: s.metaDesc,
    keywords: s.name + ',' + s.en + ',华企环球',
    schemas: schemas.concat([lib.faqSchema(s.faqs), lib.howToSchema(s.name, (s.blocks.filter(function (b) { return b.ordered; })[0] || {}).list)]),
    body: body
  }));
});

console.log('service pages done');

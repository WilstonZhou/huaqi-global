// 生成服务聚合页 services/index.html(SEO:承接"企业出海服务/海外公司注册服务"类聚合词,并提供静态内链枢纽)
// 用法: node scripts/generate-services-hub.js
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');

var ROOT = path.join(__dirname, '..');
var P = '../';
var CANONICAL = 'https://hq10000.com/services';

/* ---------- 板块与条目(desc 为列表页用的一句话说明) ---------- */
var GROUPS = [
  {
    key: 'registration',
    title: '注册与架构',
    en: 'INCORPORATION & STRUCTURE',
    desc: '从主体设立到股权架构、退出清算,决定出海的第一颗扣子怎么扣。',
    items: [
      { slug: 'company-registration', name: '海外公司注册', desc: '新加坡、香港、马来西亚、美国、英国等 19 国主体设立,SSM 持牌机构直连官方。' },
      { slug: 'us-llc', name: '美国 LLC 注册', desc: '有限责任公司,默认穿透征税、结构灵活、维护成本低,适合跨境电商与中小主体。' },
      { slug: 'us-inc', name: '美国 INC 注册', desc: 'C-Corp 股份公司,适合引入投资、股权激励与未来上市。' },
      { slug: 'offshore', name: '离岸公司注册(开曼 / BVI)', desc: '注册代理与地址、KYC、经济实质申报与年审代缴,配合 VIE / 红筹架构。' },
      { slug: 'company-deregistration', name: '公司注销 / 转让', desc: '注销与转让方案选择、税务债务清算、法定流程代办。' },
      { slug: 'company-liquidation', name: '公司清算与合规退出', desc: '成员自愿清算与债权人自愿清算,境外主体合规退出与资产债务安排。' }
    ]
  },
  {
    key: 'finance',
    title: '开户与财税',
    en: 'BANKING & TAX',
    desc: '开户、年审、审计、报税与资金架构,决定出海之后能不能稳。',
    items: [
      { slug: 'bank-account', name: '公司开户', desc: '汇丰、DBS、OCBC、Maybank、华美等合作银行,按业务实质匹配账户类型。' },
      { slug: 'hk-bank-account', name: '香港银行开户', desc: '汇丰、恒生、中银香港、渣打公司账户,材料准备到面签陪同。' },
      { slug: 'sg-bank-account', name: '新加坡银行开户', desc: 'DBS、OCBC、UOB 公司账户,多币种收付与跨境资金通道。' },
      { slug: 'us-bank-account', name: '美国银行开户', desc: 'EIN 办理 + Mercury / 华美等账户,支持亚马逊平台回款。' },
      { slug: 'annual-review', name: '公司年审', desc: '新加坡 ACRA、马来西亚 SSM、泰国 DBD、美国州 Franchise Tax 等年度申报。' },
      { slug: 'audit', name: '公司审计', desc: '注册会计师按 IFRS / GAAP 出具法定审计报告,衔接税务申报与上市合规。' },
      { slug: 'hk-audit', name: '香港公司审计', desc: '香港执业会计师出具法定审计报告,衔接利得税报税表提交。' },
      { slug: 'hk-tax-filing', name: '香港公司报税', desc: '利得税报税表提交、离岸利润豁免申请与税务代表服务。' },
      { slug: 'tax-planning', name: '税务规划', desc: 'VAT/EPR、ODI 备案、GST 与所得税规划、转让定价与 37 号文。' },
      { slug: 'vat', name: 'VAT 注册与 EPR 合规', desc: '欧盟 27 国与英国 VAT 注册申报、OSS/IOSS,包装法/电池法/WEEE。' },
      { slug: 'fund-planning', name: '资金规划', desc: 'VIE / 红筹架构、37 号文登记、ODI/QDII 通道与顶层股权设计。' }
    ]
  },
  {
    key: 'ip',
    title: '知识产权',
    en: 'TRADEMARK & PATENT',
    desc: '品牌与技术在海外能不能被保护,取决于布局是否提前。',
    items: [
      { slug: 'trademark', name: '海外商标注册', desc: '马德里国际注册与单一国家申请双路径,含检索、类别规划与审查应对。' },
      { slug: 'eu-trademark', name: '欧盟商标注册(EUTM)', desc: '通过 EUIPO 一次注册覆盖 27 个成员国,含注册后维护。' },
      { slug: 'trademark-transfer', name: '海外商标转让', desc: '转让协议起草、主体文件准备与登记,处理店铺转让与品牌收购。' },
      { slug: 'trademark-renewal', name: '海外商标续展', desc: '到期监控、续展窗口提交、宽展期与逾期处理,避免商标失效。' },
      { slug: 'patent', name: '海外专利申请', desc: '单一国家、PCT 与欧洲专利三条路径,覆盖发明、实用新型与外观设计。' },
      { slug: 'pct-patent', name: 'PCT 国际专利申请', desc: '一份申请在 150+ 缔约国产生效力,30 个月决策期。' },
      { slug: 'patent-search', name: '专利检索与风险评估', desc: '可专利性检索、FTO 自由实施分析与无效检索,输出报告与风险提示。' }
    ]
  },
  {
    key: 'compliance',
    title: '认证与合规',
    en: 'CERTIFICATION & COMPLIANCE',
    desc: '跨境文书与产品合规,决定订单能不能顺利交付。',
    items: [
      { slug: 'apostille', name: '海牙认证(Apostille)', desc: '公文书加签附加证明书,替代传统领事认证,5-15 个工作日。' },
      { slug: 'other-services', name: '跨境合规全矩阵服务', desc: '13 国 VAT/JCT/RFC、欧盟 EPR 22 项、CE/FDA 等 8 项产品认证。' },
      { slug: 'fees', name: '费用与周期说明', desc: '定制报价模式、费用构成透明、合同锁定不加价,附公开规费参考表。' }
    ]
  }
];

var FAQS = [
  { q: '华企环球提供哪些出海服务?', a: '覆盖四大板块共 ' + '{N}' + ' 项服务:注册与架构(海外公司注册、离岸架构、注销清算)、开户与财税(银行开户、年审、审计、报税、税务与资金规划)、知识产权(商标与专利注册、转让、续展、检索)、认证与合规(海牙认证、VAT/EPR、产品认证)。从主体设立到长期合规陪跑在同一团队内完成,避免多头对接。' },
  { q: '服务覆盖哪些国家/地区?', a: '业务覆盖全球 60 多个国家/地区,其中新加坡、香港、美国、马来西亚、泰国、英国、日本、韩国、迪拜、越南、印尼等 11 个热门市场提供独立的注册与合规指南页;马来西亚为公司 SSM 持牌公司秘书机构。' },
  { q: '费用和周期怎么确定?', a: '采用定制报价模式:先确认注册地、主体类型、是否需要开户与年审等组合,再由顾问出具含政府规费与服务费的书面报价,合同锁定后不加价。热门市场的公开政府规费与参考周期可查看费用与周期说明页。' },
  { q: '不确定该选哪个国家或哪种架构怎么办?', a: '可用 AI 智能匹配 3 分钟生成初步方案:说明业务模式、目标市场与人员安排,系统会给出注册地、主体类型、税务与开户路径的建议;复杂架构(VIE/红筹、ODI、跨境资金通道)会转由顾问人工确认。' },
  { q: '办理进度能看到吗?', a: '付费后即开通专属订单追踪页,时间线视图展示受理、审批、下证等节点,并在关键节点推送通知;材料归档与超时预警同时在交付追踪系统内可见。' }
];

/* ---------- 完整性校验:确保所有服务页都被收录 ---------- */
function auditCoverage() {
  var files = fs.readdirSync(path.join(ROOT, 'services'))
    .filter(function (f) { return f.slice(-5) === '.html' && f !== 'index.html'; })
    .map(function (f) { return f.slice(0, -5); });
  var listed = {};
  GROUPS.forEach(function (g) { g.items.forEach(function (it) { listed[it.slug] = 1; }); });
  var missing = files.filter(function (f) { return !listed[f]; });
  var extra = Object.keys(listed).filter(function (s) { return files.indexOf(s) === -1; });
  if (missing.length) console.warn('⚠ 未收录的服务页: ' + missing.join(', '));
  if (extra.length) console.warn('⚠ 列表中存在但文件缺失: ' + extra.join(', '));
  return { files: files, listed: Object.keys(listed) };
}

/* ---------- 构建页面 ---------- */
function buildHub() {
  var cov = auditCoverage();
  var total = cov.listed.length;
  var url = function (slug) { return P + 'services/' + slug; };

  var body = lib.hero({
    prefix: P,
    breadcrumb: '<a href="/">首页</a> / 服务',
    title: '企业出海服务总览',
    subtitle: '海外公司注册、银行开户、年审审计、税务与资金规划、商标专利、认证合规——四大板块 ' + total + ' 项服务,由同一支 300+ 团队从主体设立一路陪跑到长期合规。'
  });

  // 数据条
  body += '\n\n<!-- 数据速览 -->\n<section class="section pt-0">\n  <div class="container">\n    ' + lib.statCards([
    { label: '服务项', value: total + ' 项' },
    { label: '覆盖国家/地区', value: '60+ 国' },
    { label: '专业团队', value: '300+ 人' },
    { label: '持牌资质', value: '马来西亚 SSM' }
  ]) + '\n  </div>\n</section>';

  // 板块导航
  body += '\n\n<!-- 板块导航 -->\n<section class="section section-soft" style="padding:28px 0;">\n  <div class="container">\n    <div class="text-center" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;">' +
    GROUPS.map(function (g) {
      return '<a class="industry-pill" href="#group-' + g.key + '">' + g.title + '(' + g.items.length + ')</a>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  // 四个板块
  GROUPS.forEach(function (g, gi) {
    body += '\n\n<!-- 板块:' + g.title + ' -->\n<section class="section' + (gi % 2 === 1 ? ' section-soft' : '') + '" id="group-' + g.key + '">\n' +
      '  <div class="container">\n' +
      '    <div class="section-header"><span class="section-eyebrow">' + g.en + '</span>' +
      '<h2 class="section-title">' + g.title + '</h2><p class="section-desc">' + g.desc + '</p></div>\n' +
      '    <div class="features-grid grid-3">' +
      g.items.map(function (it) {
        return '<a class="case-card" href="' + url(it.slug) + '" style="text-decoration:none;display:block;">' +
          '<div class="card-title">' + it.name + '</div>' +
          '<div class="card-text">' + it.desc + '</div>' +
          '<div class="feature-link" style="margin-top:12px;">查看服务详情 →</div>' +
          '</a>';
      }).join('\n') + '</div>\n' +
      '  </div>\n</section>';
  });

  // 热门市场
  var countries = [
    { slug: 'sg', name: '新加坡' }, { slug: 'hk', name: '香港' }, { slug: 'us', name: '美国' },
    { slug: 'my', name: '马来西亚' }, { slug: 'th', name: '泰国' }, { slug: 'uk', name: '英国' },
    { slug: 'jp', name: '日本' }, { slug: 'kr', name: '韩国' }, { slug: 'ae', name: '迪拜' },
    { slug: 'vn', name: '越南' }, { slug: 'id', name: '印尼' }
  ];
  body += '\n\n<!-- 热门市场 -->\n<section class="section">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">MARKETS</span>' +
    '<h2 class="section-title">按注册地查看</h2><p class="section-desc">每个市场一页看清监管机构、主体类型、注册条件、流程与费用参考。</p></div>\n' +
    '    <div class="text-center" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">' +
    countries.map(function (c) {
      return '<a class="industry-pill" href="' + P + 'country/' + c.slug + '">' + c.name + '公司注册</a>';
    }).join('\n') +
    '\n      <a class="industry-pill" href="' + P + 'country">全部国家 →</a></div>\n' +
    '  </div>\n</section>';

  // FAQ
  body += '\n\n<!-- 常见问题 -->\n<section class="section section-soft">\n  <div class="container container-sm">\n' +
    '    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">常见问题</h2></div>\n' +
    '    <div>\n' + lib.faqItems(FAQS) + '\n    </div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('不确定该从哪项服务开始?', '告诉 AI 您的业务与目标市场,3 分钟生成方案参考,复杂架构转顾问人工确认', P);

  var listItems = [];
  var pos = 1;
  GROUPS.forEach(function (g) {
    g.items.forEach(function (it) {
      listItems.push({ '@type': 'ListItem', position: pos++, name: it.name, url: 'https://hq10000.com/services/' + it.slug });
    });
  });

  return lib.buildPage({
    prefix: P,
    canonical: CANONICAL,
    title: '企业出海服务总览 | 注册·开户·财税·知产全链路 | 华企环球',
    desc: '华企环球企业出海服务总览:海外公司注册、银行开户、年审审计、税务规划、VAT/EPR、商标专利、海牙认证等 ' + total + ' 项服务,马来西亚 SSM 持牌机构直连官方,覆盖 60+ 国家/地区。',
    keywords: '企业出海服务,海外公司注册服务,出海一站式服务,跨境合规服务,华企环球服务',
    schemas: [
      lib.breadcrumbSchema([
        { name: '首页', url: 'https://hq10000.com' },
        { name: '服务', url: CANONICAL }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": CANONICAL + "#collection",
        "name": "华企环球企业出海服务总览",
        "url": CANONICAL,
        "description": "海外公司注册、银行开户、年审审计、税务与资金规划、商标专利、认证合规等 " + total + " 项出海服务。",
        "inLanguage": "zh-CN",
        "isPartOf": { "@id": "https://hq10000.com/#website" },
        "about": { "@id": "https://hq10000.com/#organization" },
        "mainEntity": {
          "@type": "ItemList",
          "numberOfItems": total,
          "itemListElement": listItems
        }
      },
      lib.faqSchema(FAQS)
    ],
    body: body
  });
}

var html = buildHub().replace(/\{N\}/g, String(GROUPS.reduce(function (n, g) { return n + g.items.length; }, 0)));
var out = path.join(ROOT, 'services/index.html');
fs.writeFileSync(out, html, 'utf8');
console.log('generated: services/index.html (' + Buffer.byteLength(html) + ' bytes, ' +
  GROUPS.reduce(function (n, g) { return n + g.items.length; }, 0) + ' services listed)');

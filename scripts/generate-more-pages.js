// 生成 cases.html / news/index.html / knowledge/index.html / services/fees.html
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

// ---------------- cases.html ----------------
(function () {
  var p = './';
  var cases = [
    {
      industry: '跨境电商', title: '某亚马逊头部卖家新加坡架构搭建',
      pain: '业务覆盖欧/美/亚三大市场,收款分散、税负偏高,需要合规收款主体与统一税务架构。',
      solution: '新加坡 Pte Ltd 注册 + DBS 账户 + VAT 注册,完成三大市场合规收款闭环。',
      result: '税务成本下降 23%,收款周期缩短,后续年审审计由同一团队持续服务。',
      tags: ['新加坡注册', '银行开户', 'VAT']
    },
    {
      industry: '高科技', title: '某 AI 企业 VIE 红筹架构',
      pain: '计划赴美上市,需要搭建跨境股权架构并完成境内合规登记。',
      solution: '开曼-香港-境内 VIE 架构搭建,同步完成 ODI 备案与 37 号文登记。',
      result: '架构周期 90 天,顺利衔接后续 Pre-A 融资与上市筹备。',
      tags: ['VIE', 'ODI', '开曼']
    },
    {
      industry: '制造业', title: '某制造企业泰国建厂合规',
      pain: '在泰设立工厂面临外资持股限制与工厂许可、环评等合规门槛。',
      solution: '泰国公司注册 + BOI 申请 + 工厂许可 + 增值税登记全程代办。',
      result: '全程无需赴泰,按计划取得执照并投产,后续审计年审持续陪跑。',
      tags: ['泰国注册', 'BOI', '审计']
    }
  ];
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / 客户案例',
    title: '客户案例',
    subtitle: '从跨境电商到高科技、制造业,助力不同行业客户成功出海。以下案例均为脱敏示例,展示典型服务路径与交付成果。'
  });
  body += '\n\n<!-- 行业墙 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">INDUSTRIES</span><h2 class="section-title">服务行业</h2></div>\n    <div class="text-center" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;">' +
    ['跨境电商', '制造业', '高科技与互联网', '金融服务', '国际贸易', '文旅与文化创意', '能源与基建', '身份规划'].map(function (i) {
      return '<span class="industry-pill">' + i + '</span>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 案例卡 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">CLIENT STORIES</span><h2 class="section-title">典型服务案例</h2><p class="section-desc">以下案例信息已脱敏处理,仅展示服务类型与交付成果。</p></div>\n    <div class="features-grid">' + cases.map(function (c) {
      return '<div class="case-card"><div style="margin-bottom:10px;">' + c.tags.map(function (t) { return '<span class="case-tag">' + t + '</span>'; }).join('') + '</div>' +
        '<div class="card-title-lg">' + c.title + '</div>' +
        '<div class="mb-10"><strong class="c-primary">客户痛点:</strong><div class="card-text">' + c.pain + '</div></div>' +
        '<div class="mb-10"><strong class="c-primary">解决方案:</strong><div class="card-text">' + c.solution + '</div></div>' +
        '<div><strong class="c-primary">案例成果:</strong><div class="card-text">' + c.result + '</div></div></div>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 数据 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="info-grid">' + [
    { label: '核心国家/地区直办', value: '60+' },
    { label: '服务网络覆盖', value: '126 国' },
    { label: '专业团队', value: '300+' },
    { label: '成功案例累计交付', value: '30 万+' }
  ].map(function (s) {
    return '<div class="info-card"><div class="info-label">' + s.label + '</div><div class="info-value">' + s.value + '</div></div>';
  }).join('\n') + '\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('想了解同类客户怎么做的?', '联系顾问获取与您行业相近的案例参考与出海方案', p);
  write('cases.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/cases',
    title: '客户案例 | 跨境电商/高科技/制造业出海 | 华企环球',
    desc: '华企环球客户案例:跨境电商新加坡架构、AI 企业 VIE 红筹、制造业泰国建厂等典型出海项目,展示痛点、方案与交付成果(已脱敏)。',
    keywords: '华企环球案例,出海案例,海外公司注册案例,VIE架构案例',
    schemas: [lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '客户案例', url: 'https://hq10000.com/cases' }
    ])],
    body: body
  }));
})();

// ---------------- news/index.html(政策动态) ----------------
(function () {
  var p = '../';
  var items = [
    { flag: '🇸🇬', title: '新加坡 SUTE 初创企业免税计划要点', date: '政策信息更新于 2026 年', desc: '新成立公司前 3 年首 20 万新元应税利润可享受减免:首 10 万新元豁免 75%,次 10 万新元豁免 50%。具体以 IRAS 最新公告为准。', link: '../knowledge/singapore-registration-guide' },
    { flag: '🇺🇸', title: '美国 FinCEN BOI 受益所有人申报持续收紧', date: '政策信息更新于 2026 年', desc: '美国公司须向 FinCEN 申报受益所有人信息,逾期面临每日罚款(标准随年度调整,以 FinCEN 最新公告为准)。注册美国公司的企业务必同步完成申报。', link: '../knowledge/us-company-tax-policy' },
    { flag: '🇹🇭', title: '泰国 BOI 投资促进优惠持续加码', date: '政策信息更新于 2026 年', desc: '制造业与高附加值产业可申请 BOI 优惠:100% 外资持股、企业所得税减免、进口设备关税豁免等。建厂企业建议注册前完成评估。', link: '../solutions/manufacturing' },
    { flag: '🇲🇾', title: '马来西亚 SSM 年度申报要求提示', date: '政策信息更新于 2026 年', desc: '马来西亚公司须按时完成 SSM 年度申报与财务报表备案,逾期将产生罚款。华企环球 SSM 持牌秘书团队提供申报与提醒服务。', link: '../services/annual-review' },
    { flag: '🇯🇵', title: '日本 JCT 发票制度:跨境电商合规关键', date: '政策信息更新于 2026 年', desc: '2023 年 10 月起日本实施 JCT 发票制度,面向 B 端客户的卖家须持有合规 JCT 注册号才能开具有效发票。日本仓发货商家建议尽快办理。', link: '../knowledge/cross-border-compliance' },
    { flag: '🇪🇺', title: '欧盟 VAT / EPR 合规:13 国 VAT + 22 项 EPR', date: '政策信息更新于 2026 年', desc: '跨境电商欧盟站需关注 13 国 VAT 注册与包装法、电池法、WEEE、欧代英代等 22 项 EPR 义务,合规前置成本远低于违规成本。', link: '../knowledge/cross-border-compliance' }
  ];
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / 政策动态',
    title: '政策动态',
    subtitle: '出海政策变化快,错过节点就是成本。我们定期整理各国注册、税务与合规政策要点,供出海企业参考。信息更新于 2026 年,具体以各官方机构最新公告为准。'
  });
  body += '\n\n<!-- 政策列表 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">POLICY UPDATES</span><h2 class="section-title">近期政策速览</h2></div>\n    <div class="features-grid" style="grid-template-columns:repeat(3,1fr);">' + items.map(function (it) {
      return '<div class="case-card"><div style="font-size:26px;margin-bottom:8px;">' + it.flag + '</div><div class="card-title">' + it.title + '</div><div class="fs-12 c-text-light mb-8">' + it.date + '</div><div class="card-text mb-16">' + it.desc + '</div><a class="btn btn-outline btn-sm" href="' + it.link + '">查看详情 →</a></div>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 订阅 -->\n<section class="section">\n  <div class="container container-sm">\n    <div class="info-card p-24"><h3>想第一时间获取政策更新?</h3><p class="mb-12">添加企业微信 186-1090-2181(微信同号),顾问将为您推送与业务相关的政策变化提醒。</p><a class="btn btn-gold" href="' + p + 'contact">联系顾问</a></div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('政策看不懂?让顾问帮您判断影响', 'AI 匹配 + 顾问解读,把政策变化翻译成您的行动清单', p);
  write('news/index.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/news',
    title: '政策动态 | 各国注册税务合规速览 | 华企环球',
    desc: '华企环球政策动态:新加坡 SUTE、美国 BOI、泰国 BOI、马来西亚 SSM 年申报、日本 JCT、欧盟 VAT/EPR 等出海政策要点速览。',
    keywords: '出海政策,海外公司注册政策,VAT,EPR,BOI,ODI',
    schemas: [lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '政策动态', url: 'https://hq10000.com/news' }
    ])],
    body: body
  }));
})();

// ---------------- knowledge/index.html ----------------
(function () {
  var p = '../';
  var articles = [
    { t: '2026 新加坡公司注册完全指南', d: 'ACRA 全流程、SUTE 免税、费用明细与开户联动', l: 'singapore-registration-guide', tag: '国家指南' },
    { t: '美国公司税收政策解读:LLC 与 INC 怎么选?', d: '税务差异、特拉华优势、EIN 与 BOI 申报', l: 'us-company-tax-policy', tag: '政策解读' },
    { t: '跨境电商出海合规全方案:VAT/EPR/商标/银行', d: '欧洲 VAT、EPR 包装法、商标与收款账户全链路', l: 'cross-border-compliance', tag: '行业方案' },
    { t: '香港公司 vs 新加坡公司:怎么选?', d: '税制、开户、融资、合规成本四维对比', l: 'hk-vs-sg-company', tag: '对比指南' },
    { t: '开曼 vs BVI:离岸公司怎么选?', d: '税务、上市、经济实质与年费成本对比', l: 'cayman-vs-bvi', tag: '对比指南' },
    { t: '各国公司注册周期与费用对比(2026)', d: '八大热门市场注册周期与公开规费对照', l: 'registration-cost-comparison', tag: '费用参考' },
    { t: '海外银行开户指南:材料、周期与银行怎么选', d: '新加坡/香港/美国/马来开户材料与面签要点', l: 'overseas-bank-account-guide', tag: '操作指南' },
    { t: 'ODI 备案与 VIE 架构:跨境融资必读', d: 'ODI 流程、VIE/红筹区别、37 号文要点', l: 'odi-vie-guide', tag: '资本架构' }
  ];
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / 知识中心',
    title: '知识中心',
    subtitle: '系统化的国家指南、政策解读与行业方案,每篇内容都围绕一个具体的出海问题展开,专业、可读、可落地。'
  });
  body += '\n\n<!-- 文章列表 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">KNOWLEDGE HUB</span><h2 class="section-title">全部文章</h2></div>\n    <div class="features-grid" style="grid-template-columns:repeat(3,1fr);">' + articles.map(function (a) {
      return '<a class="case-card" href="' + a.l + '" style="text-decoration:none;"><div style="margin-bottom:8px;"><span class="case-tag">' + a.tag + '</span></div><div class="card-title">' + a.t + '</div><div class="card-text">' + a.d + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('没找到您关心的问题?', '告诉 AI 您的出海需求,3 分钟生成方案参考', p);
  write('knowledge/index.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/knowledge',
    relatedModules: 'knowledge',
    title: '知识中心 | 海外公司注册指南与政策解读 | 华企环球',
    desc: '华企环球知识中心:新加坡注册指南、美国税收政策、香港新加坡对比、开曼BVI对比、注册费用对比、海外开户指南、ODI/VIE 架构等专业内容。',
    keywords: '海外公司注册指南,新加坡公司注册,美国公司注册,ODI备案,VIE架构',
    schemas: [lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '知识中心', url: 'https://hq10000.com/knowledge' }
    ])],
    body: body
  }));
})();

// ---------------- services/fees.html(费用与周期说明) ----------------
(function () {
  var p = '../';
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="../services/company-registration">服务范围</a> / 费用与周期说明',
    title: '费用与周期说明',
    subtitle: '华企环球采用定制报价模式:费用由政府规费、服务费与第三方费用构成,签约前全部写入合同,办理过程中绝不加价。以下为公开规费与周期参考,帮您建立预算预期。'
  });
  body += '\n\n<!-- 定价模式 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">PRICING MODEL</span><h2 class="section-title">为什么采用定制报价?</h2></div>\n    <div class="features-grid">' + [
    { t: '需求定制', d: '国家、业务类型、架构与股东结构各不相同,方案按实际需求出具,不套用固定模板。' },
    { t: '费用构成透明', d: '报价单列明政府规费、服务费与第三方费用,签约前即可获取书面方案。' },
    { t: '合同锁定不加价', d: '所有费用与周期写入合同,办理过程中绝不加价。' },
    { t: '未完成可退', d: '因我方原因未完成的服务,按合同约定退款,售后无忧。' }
  ].map(function (f) {
    return '<div class="feature-card"><div class="feature-icon">✓</div><div class="feature-title">' + f.t + '</div><div class="feature-desc">' + f.d + '</div></div>';
  }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 周期参考 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">TIMELINE</span><h2 class="section-title">热门国家注册周期参考</h2><p class="section-desc">以下为常规注册周期,特殊行业或架构另计,以顾问方案为准。</p></div>\n    <table>\n      <thead><tr><th>国家/地区</th><th>公司类型</th><th>常规周期</th><th>是否需本人到场</th></tr></thead>\n      <tbody>' + [
      ['美国', 'LLC / INC', '1-3 工作日', '否(开户部分银行视频面签)'],
      ['英国', 'Ltd', '1-3 工作日', '否'],
      ['香港', '有限公司', '3-7 工作日', '否(部分银行需过港)'],
      ['新加坡', 'Pte Ltd', '5-7 工作日', '否(开户视频面签)'],
      ['马来西亚', 'Sdn Bhd', '7-10 工作日', '否'],
      ['韩国', '株式会社', '7-12 工作日', '否(部分银行需面签)'],
      ['日本', '株式会社 KK', '10-15 工作日', '否(部分银行需面签)'],
      ['泰国', 'Co., Ltd', '15-20 工作日', '否'],
      ['越南', '有限公司 LLC', '15-25 工作日', '否'],
      ['开曼 / BVI', '离岸公司', '5-15 工作日', '否']
    ].map(function (r) {
      return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td><td>' + r[3] + '</td></tr>';
    }).join('\n') + '</tbody></table>\n  </div>\n</section>';
  body += '\n\n<!-- 规费参考 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">GOVERNMENT FEES</span><h2 class="section-title">公开政府规费参考</h2><p class="section-desc">以下为公开可查的政府规费(非服务费),以各官方机构最新收费标准为准。</p></div>\n    <table>\n      <thead><tr><th>国家/地区</th><th>政府规费参考</th><th>说明</th></tr></thead>\n      <tbody>' + [
      ['新加坡', '核名 S$15 + 注册 S$300(S$315 起)', 'ACRA 官方收费,电子证书'],
      ['香港', '注册费约 HKD 1,720 + 商业登记费', '以公司註冊處与税局最新收费为准'],
      ['英国', 'Companies House 注册费约 £50', '线上注册标准收费'],
      ['马来西亚', 'SSM 规费按注册资本档位', '以 SSM 最新收费表为准'],
      ['泰国', 'DBD 注册费按注册资本比例', '以 DBD 最新收费表为准'],
      ['美国', '各州州务卿申请费不同', '特拉华/加州/怀俄明等按州计']
    ].map(function (r) {
      return '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>';
    }).join('\n') + '</tbody></table>\n    <p class="fs-12 c-text-light mt-16">注:以上仅为政府规费参考,完整方案(服务费 + 第三方费用)以顾问书面报价为准。华企环球不设"超低价引流再增收"套路,所有费用合同列明。</p>\n  </div>\n</section>';
  body += '\n\n<!-- FAQ -->\n<section class="section">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">费用常见问题</h2></div>\n    <div>' + lib.faqItems([
    { q: '为什么不直接标价?', a: '注册费用受国家、公司类型、注册资本、挂名董事/地址/秘书配套等因素影响,标准化标价无法覆盖真实需求。华企环球采用定制报价,签约前即可获取书面费用明细,反而更透明。' },
    { q: '如何获取报价?', a: '通过 AI 智能匹配提交需求(3 分钟生成方案参考)或联系顾问,顾问将在 1 个工作日内出具书面报价单,列明政府规费、服务费与第三方费用。' },
    { q: '报价后还会不会加价?', a: '不会。所有费用与周期写入合同,办理过程中绝不加价;因我方原因未完成的服务按合同约定退款。' },
    { q: '政府规费是代缴吗?票据齐全吗?', a: '是。政府规费由我们代缴并保留官方收据/电子凭证,随交付文件一并归档至您的交付追踪页。' }
  ]) + '</div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('获取您的专属报价方案', 'AI 匹配 + 顾问报价,费用周期一目了然', p);
  write('services/fees.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/services/fees',
    relatedModules: 'services',
    title: '费用与周期说明 | 定制报价 · 无隐形消费 | 华企环球',
    desc: '华企环球费用与周期说明:定制报价模式、费用构成透明、合同锁定不加价。附热门国家注册周期与公开政府规费参考表,费用结构一目了然。',
    keywords: '海外公司注册费用,公司注册周期,海外公司注册多少钱,定制报价',
    schemas: [lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '服务', url: 'https://hq10000.com/services/company-registration' },
      { name: '费用与周期说明', url: 'https://hq10000.com/services/fees' }
    ])],
    body: body
  }));
})();

console.log('more pages done');

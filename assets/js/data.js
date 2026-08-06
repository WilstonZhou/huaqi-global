/**
 * 华企环球国际咨询 — 全站数据配置
 * 统一数据源,所有页面共享
 * 数据口径统一决策(2026-08-04):
 *   - 国家覆盖:126 国(取鑫荣昇旧站实际数据)
 *   - 客户数:数万家(取品牌md保守值,避免虚高)
 *   - 愿景:"走向全球"(修正旧站"走向全国"笔误)
 */
window.HQ_DATA = {
  // ============ 公司基本信息 ============
  company: {
    name: '华企环球国际咨询',
    shortName: '华企环球',
    fullName: '华企环球（深圳）国际咨询有限公司',
    domain: 'hq10000.com',
    formerName: '鑫荣昇集团', // 历史品牌
    foundedYear: 2012,
    globalBusinessYear: 2013,
    headquarters: ['香港', '深圳'],
    domesticBranches: ['北京', '上海', '广州', '武汉', '东莞', '佛山', '中山', '海南'],
    countriesCovered: 126,
    clientsServed: '数万家',
    experienceYears: 10,
    phone: '186-1090-2181',
    email: 'contact@hq10000.com',
    address: '深圳市龙华区龙胜路融创智汇大厦14层1421',
    workday: '周一至周日 9:00-21:00',
    vision: '成为中国企业走向全球的首选品牌',
    mission: '让出海生意更简单,让身份规划无难事',
    values: '成就客户,共创共赢',
    slogan: '连接全球机遇,成就商业新高度',
    copyright: 'Copyright © 2023-2026 华企环球（深圳）国际咨询有限公司 All Rights Reserved'
  },

  // ============ 4 大差异化功能 ============
  features: [
    {
      id: 'ai-match',
      icon: '🤖',
      title: 'AI 智能企服匹配引擎',
      tagline: '3 分钟出方案',
      desc: '对话式交互引导需求,AI 自动识别服务组合,生成个性化方案(含服务清单、办理周期、材料明细)。',
      link: 'ai-match',
      highlight: true
    },
    {
      id: 'pricing',
      icon: '💰',
      title: '定制化方案配置器',
      tagline: '专属方案 无隐形消费',
      desc: '勾选服务需求,AI 自动生成个性化方案书(含服务清单、办理周期、材料明细),顾问精准报价,承诺全流程无隐形消费。',
      link: 'ai-match',
      highlight: false
    },
    {
      id: 'tracking',
      icon: '📡',
      title: '实时交付追踪系统',
      tagline: '全流程可视 进度秒达',
      desc: '下单即获专属订单追踪页,时间线视图展示办理节点,关键步骤推送通知,文件归档随时下载。',
      link: 'delivery-tracking',
      highlight: false
    },
    {
      id: 'knowledge',
      icon: '📚',
      title: '专业知识中心',
      tagline: '专业但不装 透明且有用',
      desc: '系统化国家指南、政策解读、行业方案与常见问题,以 SEO 为核心驱动有机流量。',
      link: 'knowledge/singapore-registration-guide',
      highlight: false
    }
  ],

  // ============ 8 大服务 ============
  services: [
    {
      id: 'company-registration',
      name: '海外公司注册',
      icon: '🌍',
      tagline: '126 国一站式注册,无需本人到场',
      desc: '深耕全球 126 个国家及地区企业注册法规,提供公司设立、EIN 税号、注册证书等全链条服务。',
      link: 'services/company-registration',
      countries: [
        { code: 'SG', name: '新加坡', regulator: 'ACRA', entity: 'Pte Ltd', timeline: '5-7 工作日', priceFrom: 8800 },
        { code: 'US', name: '美国', regulator: '州务卿办公室', entity: 'LLC / INC', timeline: '1-3 工作日', priceFrom: 6800 },
        { code: 'MY', name: '马来西亚', regulator: 'SSM', entity: 'Sdn Bhd', timeline: '7-10 工作日', priceFrom: 7500 },
        { code: 'TH', name: '泰国', regulator: 'DBD', entity: 'Co., Ltd', timeline: '15-20 工作日', priceFrom: 9800 }
      ]
    },
    {
      id: 'bank-account',
      name: '公司开户',
      icon: '🏦',
      tagline: '银行绿色通道,合规审核无忧',
      desc: '与全球主流银行建立绿色通道合作,本地/离岸账户开立,严守 AML/KYC 合规底线。',
      link: 'services/bank-account',
      countries: [
        { code: 'SG', name: '新加坡', regulator: 'MAS', entity: 'DBS/OCBC/UOB', timeline: '4-6 周', priceFrom: 5800 },
        { code: 'US', name: '美国', regulator: 'FinCEN', entity: 'Mercury/BoA', timeline: '2-4 周', priceFrom: 4800 },
        { code: 'MY', name: '马来西亚', regulator: 'BNM', entity: 'Maybank/CIMB', timeline: '3-5 周', priceFrom: 5200 }
      ]
    },
    {
      id: 'annual-review',
      name: '公司年审',
      icon: '📅',
      tagline: '按时申报,规避除名风险',
      desc: '各国法定年审代办,向注册机关提交年报、续期资质,保障企业合法存续。',
      link: 'services/annual-review',
      countries: [
        { code: 'SG', name: '新加坡', regulator: 'ACRA', entity: 'Annual Return', timeline: '5 工作日', priceFrom: 2800 },
        { code: 'MY', name: '马来西亚', regulator: 'SSM', entity: 'Annual Return', timeline: '7 工作日', priceFrom: 2600 },
        { code: 'TH', name: '泰国', regulator: 'DBD', entity: '财务报表申报', timeline: '10 工作日', priceFrom: 3200 },
        { code: 'US', name: '美国', regulator: '州务卿', entity: 'Franchise Tax', timeline: '3 工作日', priceFrom: 2200 }
      ]
    },
    {
      id: 'audit',
      name: '公司审计',
      icon: '📊',
      tagline: 'GAAP/IFRS 合规审计报告',
      desc: '由注册会计师出具法定审计报告,符合当地会计准则,满足税务申报与商业拓展需求。',
      link: 'services/audit',
      countries: [
        { code: 'ID', name: '印尼', regulator: 'OJK', entity: 'IFRS', timeline: '15-30 工作日', priceFrom: 8500 },
        { code: 'US', name: '美国', regulator: 'AICPA', entity: 'GAAP', timeline: '20-30 工作日', priceFrom: 9800 }
      ]
    },
    {
      id: 'company-deregistration',
      name: '公司注销/转让',
      icon: '🔄',
      tagline: '合法有序退出,产权平稳交接',
      desc: '注销与股权转让法定流程代办,规避税务、债务及法律风险,保障股东与相关方权益。',
      link: 'services/company-deregistration',
      countries: [
        { code: 'TH', name: '泰国', regulator: 'DBD', entity: '注销/转让', timeline: '60-90 工作日', priceFrom: 12000 },
        { code: 'SG', name: '新加坡', regulator: 'ACRA', entity: '注销/转让', timeline: '30-45 工作日', priceFrom: 9800 },
        { code: 'US', name: '美国', regulator: '州务卿', entity: '注销/转让', timeline: '20-30 工作日', priceFrom: 7800 }
      ]
    },
    {
      id: 'tax-planning',
      name: '税务规划',
      icon: '⚖️',
      tagline: '跨境合规,降本增效',
      desc: 'VAT/EPR、ODI 备案、跨境税务架构、转让定价合规,覆盖中企出海全周期税务需求。',
      link: 'services/tax-planning',
      countries: [
        { code: 'EU', name: '欧盟 VAT', regulator: '各国税局', entity: 'VAT/EPR', timeline: '15-30 工作日', priceFrom: 3800 },
        { code: 'CN', name: 'ODI 备案', regulator: '商务部', entity: '境外投资备案', timeline: '45-60 工作日', priceFrom: 18000 },
        { code: 'SG', name: '新加坡税务', regulator: 'IRAS', entity: 'GST/所得税', timeline: '10 工作日', priceFrom: 4500 }
      ]
    },
    {
      id: 'fund-planning',
      name: '资金规划',
      icon: '💹',
      tagline: 'VIE 架构 / 跨境结算 / 海外资产配置',
      desc: '顶层股权架构设计、VIE 搭建、跨境资金通道、海外资产配置,合规前提下优化资金效率。',
      link: 'services/fund-planning',
      countries: [
        { code: 'VIE', name: 'VIE 架构', regulator: '证监会', entity: '红筹/VIE', timeline: '60-90 工作日', priceFrom: 38000 },
        { code: 'CAY', name: '开曼/BVI', regulator: 'CIMA', entity: '离岸公司', timeline: '7-10 工作日', priceFrom: 12800 },
        { code: 'HK', name: '香港资金', regulator: 'SFC', entity: 'ODI/QDII', timeline: '30-45 工作日', priceFrom: 22000 }
      ]
    },
    {
      id: 'other-services',
      name: '其他业务',
      icon: '🎯',
      tagline: '海牙认证 / 香港公证 / 商标专利',
      desc: '海牙认证、香港公证、国际商标专利、海外身份规划等一站式出海衍生服务。',
      link: 'services/other-services',
      countries: [
        { code: 'APOSTILLE', name: '海牙认证', regulator: '外交部', entity: 'Apostille', timeline: '5-10 工作日', priceFrom: 1500 },
        { code: 'HK-NOTARY', name: '香港公证', regulator: '高等法院', entity: 'CPA公证', timeline: '3-5 工作日', priceFrom: 2200 },
        { code: 'TM', name: '商标专利', regulator: 'WIPO', entity: '马德里体系', timeline: '12-18 月', priceFrom: 5800 }
      ]
    }
  ],

  // ============ 全球网络(热门 20 国,总 126 国) ============
  globalNetwork: {
    totalCountries: 126,
    regions: [
      { region: '港澳', countries: ['香港', '澳门'] },
      { region: '东南亚', countries: ['新加坡', '马来西亚', '泰国', '印尼', '越南', '菲律宾', '柬埔寨'] },
      { region: '东亚', countries: ['日本', '韩国'] },
      { region: '北美', countries: ['美国', '加拿大'] },
      { region: '欧洲', countries: ['英国', '德国', '法国', '荷兰', '爱尔兰'] },
      { region: '中东', countries: ['阿联酋', '沙特', '以色列'] },
      { region: '离岸群岛', countries: ['开曼群岛', 'BVI', '百慕大'] }
    ]
  },

  // ============ 知识中心文章(3 篇) ============
  knowledge: [
    {
      id: 'singapore-registration-guide',
      title: '2026 新加坡公司注册完全指南',
      category: '国家指南',
      tag: 'SEO 高价值',
      excerpt: '从公司类型、注册条件、办理流程到费用明细,一文讲清新加坡公司注册全部要点。涵盖 ACRA 最新政策、UEN 申请、私人有限公司(Pte Ltd)全流程。',
      readTime: '8 分钟',
      publishDate: '2026-07-25',
      link: 'knowledge/singapore-registration-guide',
      keywords: ['新加坡公司注册', 'ACRA', 'UEN', 'Pte Ltd']
    },
    {
      id: 'us-company-tax-policy',
      title: '美国公司税收政策解读:LLC 与 INC 怎么选?',
      category: '政策解读',
      tag: '热门',
      excerpt: 'LLC 与 INC 的税务差异、特拉华州为何成首选、EIN 申请流程、州税与联邦税计算,以及跨境电商最关心的 1099-K 新规。',
      readTime: '10 分钟',
      publishDate: '2026-07-18',
      link: 'knowledge/us-company-tax-policy',
      keywords: ['美国公司注册', 'LLC', 'INC', 'EIN', '特拉华']
    },
    {
      id: 'cross-border-compliance',
      title: '跨境电商出海合规全方案:VAT/EPR/商标/银行',
      category: '行业方案',
      tag: '实战',
      excerpt: '从亚马逊、Shopify 到独立站,梳理欧洲 VAT、EPR 包装法、海外商标布局、收款账户搭建全链路合规要点,附 2026 最新政策更新。',
      readTime: '12 分钟',
      publishDate: '2026-07-10',
      link: 'knowledge/cross-border-compliance',
      keywords: ['跨境电商', 'VAT', 'EPR', '商标注册', '银行开户']
    }
  ],

  // ============ 透明定价表(标准化服务,基础引流) ============
  pricing: {
    transparent: [
      { service: '新加坡公司注册', type: '固定价', price: 8800, period: '5-7 工作日', materials: '董事/股东身份证明、地址证明、公司章程' },
      { service: '美国公司注册(LLC)', type: '固定价', price: 6800, period: '1-3 工作日', materials: '成员身份证明、注册地址、运营协议' },
      { service: '马来西亚公司注册', type: '固定价', price: 7500, period: '7-10 工作日', materials: '股东/董事身份证明、公司章程、注册地址' },
      { service: '泰国公司注册', type: '固定价', price: 9800, period: '15-20 工作日', materials: '股东/董事身份证明、公司章程、注册地址' },
      { service: '新加坡公司年审', type: '固定价', price: 2800, period: '5 工作日', materials: '注册证书、上一年度财务报表' },
      { service: '美国公司年审', type: '固定价', price: 2200, period: '3 工作日', materials: '注册证书、EIN、注册代理续期' },
      { service: '海牙认证', type: '固定价', price: 1500, period: '5-10 工作日', materials: '待认证原件、申请表' },
      { service: '香港公证', type: '固定价', price: 2200, period: '3-5 工作日', materials: '待公证文件、身份证明' }
    ],
    range: [
      { service: 'VIE 架构搭建', type: '区间价', priceFrom: 38000, priceTo: 120000, factors: '架构复杂度、是否需红筹回归、所在行业' },
      { service: 'ODI 备案', type: '区间价', priceFrom: 18000, priceTo: 45000, factors: '投资规模、目标国家、行业敏感度' },
      { service: '印尼公司审计', type: '区间价', priceFrom: 8500, priceTo: 28000, factors: '企业规模、营收、是否上市' },
      { service: '海外商标注册', type: '区间价', priceFrom: 5800, priceTo: 15000, factors: '注册国家数量、马德里体系或单一国' }
    ],
    custom: ['市场调研与选址', '复杂股权架构设计', '海外身份规划', '跨境法律诉讼']
  },

  // ============ AI 匹配引擎示例场景 ============
  aiMatch: {
    sampleDialog: [
      { role: 'ai', text: '您好!我是华企环球 AI 企服顾问。请问您计划在哪个国家开展业务?' },
      { role: 'user', text: '我想在新加坡注册一家做跨境电商的公司' },
      { role: 'ai', text: '了解。请问:1) 您的公司已有海外实体吗?2) 主要销售平台是亚马逊还是独立站?3) 预算大致范围?' },
      { role: 'user', text: '没有海外实体,主要做亚马逊,预算 5 万以内' },
      { role: 'ai', text: '基于您的需求,我推荐以下方案(周期 6-8 周):\n1) 新加坡 Pte Ltd 注册\n2) 新加坡 DBS 银行开户\n3) 欧盟 VAT 注册(若销欧)\n4) 商标注册(新加坡+马德里)\n\n详细报价请转人工顾问,30 秒内响应。是否需要加急?' }
    ],
    scenarios: [
      '跨境电商出海(亚马逊/Shopify/独立站)',
      '海外品牌布局(商标+公司+公证)',
      'VIE 红筹架构(美股/港股上市前)',
      'ODI 对外投资备案(合规资金出境)',
      '海外身份规划(投资移民/数字游民)',
      '复杂股权架构设计(多层级控股)',
      '海外资产配置(家族信托/离岸公司)',
      '跨境法律合规(VAT/EPR/数据保护)'
    ]
  },

  // ============ 交付追踪示例流程(以新加坡公司注册为例) ============
  deliveryFlow: {
    service: '新加坡公司注册',
    steps: [
      { step: 1, name: '核名', duration: '1 工作日', status: 'done', desc: 'ACRA 名称预审通过,客户确认公司名称' },
      { step: 2, name: '签署文件', duration: '1 工作日', status: 'done', desc: '公司章程、股东协议电子签署' },
      { step: 3, name: '提交政府', duration: '1-2 工作日', status: 'done', desc: '向 ACRA 提交注册申请,获 BizFile 与 UEN' },
      { step: 4, name: '领取证书', duration: '1 工作日', status: 'current', desc: '注册证书已上传,等待客户确认' },
      { step: 5, name: '银行开户预约', duration: '3-5 工作日', status: 'pending', desc: '将预约 DBS 视频面签,需客户选择银行' },
      { step: 6, name: '银行面签', duration: '1 工作日', status: 'pending', desc: '视频面签 KYC 审核' },
      { step: 7, name: '账户激活', duration: '3-5 工作日', status: 'pending', desc: '账户激活,网银开通,流程完成' }
    ]
  },

  // ============ 客户案例与数据 ============
  stats: [
    { value: '126', unit: '个国家', label: '业务覆盖' },
    { value: '数万', unit: '家', label: '企业客户' },
    { value: '10', unit: '年+', label: '出海服务经验' },
    { value: '8', unit: '城', label: '国内分公司' }
  ],

  // ============ 客户案例 ============
  cases: [
    { industry: '跨境电商', title: '某亚马逊头部卖家新加坡架构搭建', desc: '通过新加坡公司 + DBS 账户 + VAT 注册,实现欧/美/亚三大市场合规收款,税务成本下降 23%。', tags: ['新加坡注册', '银行开户', 'VAT'] },
    { industry: '高科技', title: '某 AI 企业 VIE 红筹架构', desc: '为赴美上市搭建开曼-香港-境内 VIE 架构,ODI 备案 + 37 号文登记,周期 90 天。', tags: ['VIE', 'ODI', '开曼'] },
    { industry: '制造业', title: '某制造企业泰国建厂合规', desc: '泰国公司注册 + BOI 申请 + 工厂许可 + 增值税登记,全程无需赴泰。', tags: ['泰国注册', 'BOI', '审计'] }
  ],

  // ============ 常见问题(首页/服务页通用) ============
  faq: [
    { q: '注册海外公司是否需要本人到场?', a: '新加坡、美国、马来西亚、泰国等主流国家均支持代办,无需本人到场。银行开户部分银行需视频面签或本人到场,具体视银行政策而定。' },
    { q: '办理周期一般多久?', a: '美国公司注册最快 1-3 工作日下证;新加坡 5-7 工作日;马来西亚 7-10 工作日;泰国 15-20 工作日。年审通常 3-10 工作日。复杂架构如 VIE/ODI 需 60-90 天。' },
    { q: '费用如何?有无隐形消费?', a: '华企环球采用定制报价模式,根据国家、业务类型、架构复杂度精准定价,不做一刀切标价。所有费用在合同中明确列出,办理过程中绝不加价,承诺全流程无隐形消费。' },
    { q: '下单后如何查看办理进度?', a: '下单即获专属订单追踪页面,实时查看每个服务项办理节点、当前状态、预计完成时间。关键步骤(如需签字、提交材料)会通过微信/短信/邮件主动推送提醒。' },
    { q: 'AI 智能匹配是否准确?出错怎么办?', a: 'AI 匹配基于本地规则引擎,自动识别目标国家、服务板块与业务场景,为您生成服务组合参考。若未识别到匹配项,会引导您补充信息或转人工顾问,30 秒内响应,保证方案专业度。' },
    { q: '是否提供后续维护服务?', a: '是的。我们提供年审、做账报税、银行账户维护、商标续展、合规咨询等全生命周期服务,客户可自主在追踪页面查看续期提醒。' }
  ],

  // ============ 一级导航 ============
  nav: [
    { name: '首页', link: '/' },
    { name: '服务', link: 'services/company-registration', dropdown: [
      { name: '海外公司注册', link: 'services/company-registration' },
      { name: '公司开户', link: 'services/bank-account' },
      { name: '公司年审', link: 'services/annual-review' },
      { name: '公司审计', link: 'services/audit' },
      { name: '公司注销/转让', link: 'services/company-deregistration' },
      { name: '税务规划', link: 'services/tax-planning' },
      { name: '资金规划', link: 'services/fund-planning' },
      { name: '其他业务', link: 'services/other-services' }
    ]},
    { name: '全球网络', link: 'global-network' },
    { name: 'AI 智能匹配', link: 'ai-match', badge: 'NEW' },
    { name: '交付追踪', link: 'delivery-tracking' },
    { name: '知识中心', link: 'knowledge/singapore-registration-guide', dropdown: [
      { name: '新加坡注册指南', link: 'knowledge/singapore-registration-guide' },
      { name: '美国税收政策', link: 'knowledge/us-company-tax-policy' },
      { name: '跨境电商合规', link: 'knowledge/cross-border-compliance' }
    ]},
    { name: '关于我们', link: 'about' },
    { name: '联系我们', link: 'contact' }
  ]
};

// 辅助:根据服务 id 查找
window.HQ_DATA.getService = function(id) {
  return this.services.find(function(s){ return s.id === id; });
};

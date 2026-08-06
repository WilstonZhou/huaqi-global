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
    origin: '前身为会计事务所',
    foundedYear: 2012, // 鑫荣昇创始年
    hqFoundedYear: 2018, // 华企环球独立品牌年
    globalBusinessYear: 2013,
    headquarters: ['香港', '深圳'],
    domesticBranches: ['北京', '上海', '广州', '武汉', '东莞', '佛山', '中山', '海南'],
    overseasBranchesCount: 6, // 全球海外分支机构
    countriesCovered: 126,
    coreCountries: '60+', // 核心可办理国家
    clientsServed: '数万家',
    casesCount: '300,000+', // 累计成功案例
    experienceYears: 10, // 鑫荣昇品牌时期总经验
    coreFocusYears: 8, // 8 年出海落地合规服务精研(2018-2026)
    // 团队规模
    team: {
      totalSize: '300+',
      partners: '20+',      // 合伙人
      accountManagers: '100+', // 客户经理
      researchers: '30+',   // 研究员
      lawyersAccountants: '100+' // 联动专业律师与会计师
    },
    // 核心资质
    license: {
      malaysiaGovernmentSecretary: true, // 马来西亚政府持牌秘书机构
      description: '马来西亚政府SSM持牌商务秘书机构,非中间商转包'
    },
    phone: '186-1090-2181',
    email: 'contact@hq10000.com',
    address: '深圳市龙华区龙胜路融创智汇大厦A座14层21',
    workday: '周一至周日 9:00-21:00',
    vision: '7年内成为全球领先的企业服务集团',
    // 双版本使命并存
    mission1: '让企业无难事,让创业更简单',
    mission2: '让出海生意更简单,让身份规划无难事', // 鑫荣昇/出海版使命
    mission: '让出海生意更简单,让身份规划无难事 · 让企业无难事,让创业更简单',
    values: '成就客户,共创共赢',
    slogan: '连接全球机遇,成就商业新高度',
    copyright: 'Copyright © 2023-2026 华企环球（深圳）国际咨询有限公司 All Rights Reserved'
  },

  // ============ 全球海外分支机构(含深圳总部) ============
  overseasOffices: [
    {
      city: '深圳',
      country: '中国',
      flag: '🇨🇳',
      address: '深圳市龙华区龙胜路与景龙建设路交汇处融创智汇大厦A座14层21',
      note: '中国总部 · 港深双总部之一'
    },
    {
      city: '马来西亚',
      country: '马来西亚',
      flag: '🇲🇾',
      address: 'SOHO SUITES KLCC, 20 JALAN PERAK, 50450 KUALA LUMPUR W.P. KUALA LUMPUR MALAYSIA',
      note: '马来西亚政府持牌秘书机构 · 下证快时效保障'
    },
    {
      city: '新加坡',
      country: '新加坡',
      flag: '🇸🇬',
      address: '60 Paya Lebar Road #04 Paya Lebar Square, Singapore 409051',
      note: '东南亚金融与控股中心'
    },
    {
      city: '泰国',
      country: '泰国',
      flag: '🇹🇭',
      address: '泰国曼谷邦卡皮区华马县兰甘亨76巷50号79单元',
      note: '承接泰国注册、BOI、工厂许可业务'
    },
    {
      city: '越南',
      country: '越南',
      flag: '🇻🇳',
      address: '越南胡志明市Go Vap区Cityland12号街7号',
      note: '覆盖越南投资、工厂出海、贸易公司注册'
    }
  ],

  // ============ 6 大服务亮点 ============
  highlights: [
    {
      icon: '🌍',
      title: '业务范围广、全球 60 多个国家或地区均可办理',
      desc: '热门国家自有团队,冷门国家合作覆盖,全球 60 多个核心国家或地区均可办理,实际网络延伸超 126 国。以马来西亚为核心,辐射欧美日、东南亚、南美等区域。'
    },
    {
      icon: '🤵',
      title: '专属资深顾问一对一服务,全程指导',
      desc: '每位客户配备专属资深客户经理,全程指导,避免信息断层。从咨询到交付,同一个人跟进到底,服务体验不打折扣。300 多人专业团队为后盾,确保项目质量。'
    },
    {
      icon: '📜',
      title: '自有海外公司持牌秘书机构,下证快,时效保障',
      desc: '马来西亚政府 SSM 持牌商务秘书机构,自有团队直连官方,非中间商转包,下证快、时效有保障。公司注册、年审、审计全流程直连,价格更优、进度可控。'
    },
    {
      icon: '🎯',
      title: '企业定制化方案赋能陪跑',
      desc: '不做一刀切的标准化套餐,根据企业行业、目标国家、预算出具定制化方案,并提供后续合规陪跑,真正助力全球化落地。懂中国企业出海的需要——不仅要实在的价格和专业落地的交付,更需要贴合企业的方案。'
    },
    {
      icon: '🛡️',
      title: '诚信服务、专业高效、价格透明、退款承诺、售后无忧',
      desc: '诚信服务、专业高效、价格透明、退款承诺、售后无忧,五重保障。合同明确所有费用与周期,办理过程绝不加价,未服务项目可退,让每一位客户安心。'
    },
    {
      icon: '🏆',
      title: '累计服务客户成功案例超 300000+',
      desc: '前身为会计事务所,2018 年华企环球品牌独立发展至今,鑫荣昇 + 华企环球双品牌时期累计服务客户成功案例超 300,000+,涵盖传统行业、跨境电商、服务行业、高科技、金融等多个领域。'
    }
  ],

  // ============ 4 大出海服务类型 ============
  serviceTypes: [
    {
      icon: '🌐',
      name: '国际贸易',
      items: ['市场调研与定位', '贸易政策与法规', '物流与供应链', '支付与结算', '品牌与营销']
    },
    {
      icon: '🛒',
      name: '跨境电商',
      items: ['平台选择与入驻', '商品选品与定价', '跨境支付与结算', '物流与配送', '营销与推广']
    },
    {
      icon: '🏭',
      name: '实体投资',
      items: ['投资环境评估', '项目选址与规划', '法规与外资政策', '融资与资本运作', '运营与人力资源']
    },
    {
      icon: '💡',
      name: '出海咨询',
      items: ['战略规划咨询', '市场准入咨询', '品牌国际化咨询', '风险评估与应对', '本地化运营咨询']
    }
  ],

  // ============ 4 大合规体系 × 3 子要点 ============
  complianceSystems: [
    {
      icon: '🧾',
      category: '税务合规',
      points: [
        { title: '明晰法规', desc: '深入了解境内外税收法规差异与动态(如各国税率),关注国际税收政策走向' },
        { title: '准确申报', desc: '掌握申报流程期限,依业务确定应税行为,精准计算并按时申报缴税' },
        { title: '管理体系', desc: '借助技术建税务数据管理系统,构建风险评估机制,自查自纠防风险' }
      ]
    },
    {
      icon: '™️',
      category: '品牌合规',
      points: [
        { title: '产权保护', desc: '全面检索避免侵权,及时注册自有知识产权,多地区布局保护品牌' },
        { title: '规范使用', desc: '依法正确使用品牌标识,宣传推广遵守法规,杜绝不正当竞争' },
        { title: '监控维权', desc: '建立监测机制,定期搜索侵权行为,发现后及时通过法律措施维权' }
      ]
    },
    {
      icon: '✅',
      category: '产品合规',
      points: [
        { title: '遵循法规标准', desc: '严格遵守目标市场产品相关法规与标准(如欧盟 CE、美国 FDA)' },
        { title: '认证标识合规', desc: '完成所需认证流程,保证产品资质合法,标签标识信息准确清晰' },
        { title: '管控供应链与应急', desc: '确保产品质量,制定召回与应急预案,保障企业与消费者利益' }
      ]
    },
    {
      icon: '⚙️',
      category: '运营合规',
      points: [
        { title: '遵守规则', desc: '严格遵循跨境电商平台规则,确保信息真实、竞争公平,不绕过平台交易' },
        { title: '诚信交易', desc: '杜绝虚假交易,保证商品服务质量,符合平台发货要求,避免违规处罚' },
        { title: '适应变化', desc: '关注目标市场政策法规变动(如消保、隐私法规),调整运营策略合规运营' }
      ]
    }
  ],

  // ============ 6 步服务流程 ============
  serviceProcess: [
    { step: '01', icon: '🔍', title: '需求阶段', desc: '了解客户出海目的,理解客户业务模式,明确客户业务发展所需的相关服务' },
    { step: '02', icon: '📝', title: '方案制作', desc: '撰写详细服务方案,和客户讲解服务方案,按客户意见修改方案' },
    { step: '03', icon: '🤝', title: '确认方案', desc: '确认服务项目,确认报价,确认服务交付标准' },
    { step: '04', icon: '📋', title: '签订合同', desc: '拟制服务合同,签订服务合同,启动服务项目' },
    { step: '05', icon: '🚀', title: '方案交付', desc: '办理资料收集,办理进度及时反馈,办结资料讲解、交付' },
    { step: '06', icon: '🛠️', title: '售后陪跑', desc: '后续年审审计提醒,合规政策更新通知,持续赋能陪跑企业长期经营' }
  ],

  // ============ 全球国家覆盖详细分布(7 大区 50+ 国) ============
  globalCountriesByRegion: [
    {
      region: '亚洲 ASIA',
      count: 17,
      countries: [
        '新加坡', '马来西亚', '泰国', '越南', '香港', '日本', '韩国', '印度', '印度尼西亚',
        '菲律宾', '柬埔寨', '老挝', '缅甸', '文莱', '阿联酋', '土耳其', '巴基斯坦',
        '尼泊尔', '哈萨克斯坦'
      ]
    },
    {
      region: '美洲 AMERICA',
      count: 20,
      countries: [
        '美国', '加拿大', '巴西', '墨西哥', '阿根廷', '巴拿马', '智利', '秘鲁', '哥伦比亚',
        '厄瓜多尔', '乌拉圭', '巴哈马', '牙买加', '巴巴多斯', '圣卢西亚', '巴拉圭', '圭亚那',
        '苏里南', '萨尔瓦多', '尼加拉瓜'
      ]
    },
    {
      region: '欧洲 EUROPE',
      count: 20,
      countries: [
        '英国', '法国', '德国', '瑞士', '荷兰', '爱尔兰', '西班牙', '意大利', '葡萄牙',
        '比利时', '卢森堡', '瑞典', '芬兰', '波兰', '捷克', '匈牙利', '立陶宛', '希腊',
        '俄罗斯', '塞浦路斯'
      ]
    },
    {
      region: '离岸群岛 OFFSHORE',
      count: 4,
      countries: ['BVI(英属维尔京)', '开曼群岛', '塞舌尔', '马绍尔', '萨摩亚']
    },
    {
      region: '大洋洲 OCEANIA',
      count: 7,
      countries: ['澳大利亚', '新西兰', '瓦努阿图', '基里巴斯', '帕劳', '瑙鲁', '图瓦卢']
    },
    {
      region: '非洲 AFRICA',
      count: 8,
      countries: ['肯尼亚', '尼日利亚', '毛里求斯', '埃及', '南非', '赞比亚', '刚果(金)', '摩洛哥']
    }
  ],

  // ============ VAT / EPR / 产品认证 全矩阵 ============
  vatEprCertification: {
    vat: [
      { name: '英国 VAT', country: '🇬🇧', timeline: '2-4 周', priceFrom: 3800 },
      { name: '德国 VAT', country: '🇩🇪', timeline: '4-8 周', priceFrom: 4200 },
      { name: '法国 VAT', country: '🇫🇷', timeline: '3-6 周', priceFrom: 3900 },
      { name: '意大利 VAT', country: '🇮🇹', timeline: '2-4 周', priceFrom: 3600 },
      { name: '西班牙 VAT', country: '🇪🇸', timeline: '3-5 周', priceFrom: 3700 },
      { name: '波兰 VAT', country: '🇵🇱', timeline: '2-4 周', priceFrom: 3400 },
      { name: '捷克 VAT', country: '🇨🇿', timeline: '3-5 周', priceFrom: 3500 },
      { name: '奥地利 VAT', country: '🇦🇹', timeline: '2-4 周', priceFrom: 3500 },
      { name: '瑞典 VAT', country: '🇸🇪', timeline: '2-4 周', priceFrom: 3600 },
      { name: '荷兰 VAT', country: '🇳🇱', timeline: '2-4 周', priceFrom: 3600 },
      { name: '阿联酋 VAT', country: '🇦🇪', timeline: '2-3 周', priceFrom: 4500 },
      { name: '日本 JCT', country: '🇯🇵', timeline: '2-4 周', priceFrom: 4200 },
      { name: '墨西哥 RFC', country: '🇲🇽', timeline: '3-5 周', priceFrom: 4800 }
    ],
    epr: [
      // 德国 EPR
      { area: '德国', category: '包装法', country: '🇩🇪', priceFrom: 680 },
      { area: '德国', category: '电池法(BattG)', country: '🇩🇪', priceFrom: 880 },
      { area: '德国', category: 'WEEE(电子废弃物)', country: '🇩🇪', priceFrom: 1280 },
      // 法国 EPR
      { area: '法国', category: '包装法', country: '🇫🇷', priceFrom: 780 },
      { area: '法国', category: '电池法', country: '🇫🇷', priceFrom: 980 },
      { area: '法国', category: 'WEEE', country: '🇫🇷', priceFrom: 1380 },
      { area: '法国', category: '纺织法(AGEC)', country: '🇫🇷', priceFrom: 1080 },
      { area: '法国', category: '家具法', country: '🇫🇷', priceFrom: 1080 },
      { area: '法国', category: '轮胎法', country: '🇫🇷', priceFrom: 1280 },
      { area: '法国', category: '纸品法(图形印刷)', country: '🇫🇷', priceFrom: 980 },
      { area: '法国', category: '玩具法', country: '🇫🇷', priceFrom: 1180 },
      // 意西奥 EPR
      { area: '意大利', category: '包装法', country: '🇮🇹', priceFrom: 680 },
      { area: '意大利', category: '电池法', country: '🇮🇹', priceFrom: 880 },
      { area: '意大利', category: 'WEEE', country: '🇮🇹', priceFrom: 1280 },
      { area: '西班牙', category: '包装法', country: '🇪🇸', priceFrom: 720 },
      { area: '西班牙', category: '电池法', country: '🇪🇸', priceFrom: 920 },
      { area: '西班牙', category: 'WEEE', country: '🇪🇸', priceFrom: 1320 },
      { area: '奥地利', category: '包装法', country: '🇦🇹', priceFrom: 750 },
      { area: '奥地利', category: '电池法', country: '🇦🇹', priceFrom: 950 },
      { area: '奥地利', category: 'WEEE', country: '🇦🇹', priceFrom: 1350 },
      // 合规代表
      { area: '欧盟合规代表', category: '欧代(EC REP)', country: '🇪🇺', priceFrom: 1500 },
      { area: '英国合规代表', category: '英代(UK REP)', country: '🇬🇧', priceFrom: 1500 }
    ],
    certification: [
      { name: 'CE 认证', scope: '欧盟产品安全合规', priceFrom: 3500 },
      { name: 'FDA 认证', scope: '美国食品药品接触材料/医疗', priceFrom: 4500 },
      { name: 'FCC 认证', scope: '美国电子电磁兼容', priceFrom: 3200 },
      { name: 'ROHS 认证', scope: '欧盟电子有害物质限制', priceFrom: 2800 },
      { name: 'CPC 认证', scope: '美国儿童产品安全证书', priceFrom: 3800 },
      { name: '气候友好承诺认证', scope: '亚马逊 Climate Pledge Friendly', priceFrom: 2800 },
      { name: '欧盟能效 ERP', scope: '欧盟能效标签注册', priceFrom: 2500 },
      { name: '海外仓售后服务', scope: '退换货/贴标/质检/一件代发', priceFrom: '按项目报价' }
    ],
    trademarkCopyright: [
      // 商标
      { type: '商标', area: '美国', country: '🇺🇸', priceFrom: 5800 },
      { type: '商标', area: '欧盟', country: '🇪🇺', priceFrom: 6800 },
      { type: '商标', area: '英国', country: '🇬🇧', priceFrom: 4800 },
      { type: '商标', area: '德国', country: '🇩🇪', priceFrom: 4500 },
      { type: '商标', area: '法国', country: '🇫🇷', priceFrom: 4500 },
      { type: '商标', area: '日本', country: '🇯🇵', priceFrom: 5200 },
      { type: '商标', area: '韩国', country: '🇰🇷', priceFrom: 4800 },
      { type: '商标', area: '俄罗斯', country: '🇷🇺', priceFrom: 5000 },
      { type: '商标', area: '加拿大', country: '🇨🇦', priceFrom: 5200 },
      { type: '商标', area: '墨西哥', country: '🇲🇽', priceFrom: 4800 },
      { type: '商标', area: '越南', country: '🇻🇳', priceFrom: 4200 },
      { type: '商标', area: '泰国', country: '🇹🇭', priceFrom: 4200 },
      { type: '商标', area: '马来西亚', country: '🇲🇾', priceFrom: 4000 },
      { type: '商标', area: '新加坡', country: '🇸🇬', priceFrom: 4200 },
      { type: '商标', area: '菲律宾', country: '🇵🇭', priceFrom: 4500 },
      { type: '商标', area: '印度', country: '🇮🇳', priceFrom: 4500 },
      { type: '商标', area: '瑞士', country: '🇨🇭', priceFrom: 5500 },
      { type: '商标', area: '西班牙', country: '🇪🇸', priceFrom: 4500 },
      { type: '商标', area: '阿联酋', country: '🇦🇪', priceFrom: 5500 },
      { type: '商标', area: '沙特', country: '🇸🇦', priceFrom: 5800 },
      { type: '商标', area: '中国', country: '🇨🇳', priceFrom: 1200 },
      // 版权
      { type: '版权', area: '美国', country: '🇺🇸', priceFrom: 2800 },
      { type: '版权', area: '加拿大', country: '🇨🇦', priceFrom: 2800 },
      { type: '版权', area: '日本', country: '🇯🇵', priceFrom: 2500 },
      { type: '版权', area: '韩国', country: '🇰🇷', priceFrom: 2200 }
    ]
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
      tagline: '海牙认证 / 商标专利 / 马来第二家园 / 留学移民 / 资产配置',
      desc: '海牙认证、香港公证、国际商标专利、马来西亚第二家园与永居、ODI备案、留学移民、海外资产配置等一站式出海衍生服务。',
      link: 'services/other-services',
      countries: [
        { code: 'MM2H', name: '马来西亚第二家园', regulator: '旅游部', entity: 'MM2H签证', timeline: '3-6 月', priceFrom: 38000 },
        { code: 'MY-PR', name: '马来西亚永居(PR)', regulator: '移民局', entity: 'Red Identity Card', timeline: '6-12 月', priceFrom: 180000 },
        { code: 'ODI', name: 'ODI境外投资备案', regulator: '商务部/发改委', entity: '境外投资证书', timeline: '45-60 工作日', priceFrom: 18000 },
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
    { value: '60+', unit: '核心国家', label: '均可办理' },
    { value: '30万+', unit: '成功案例', label: '累计服务' },
    { value: '8', unit: '年+', label: '合规服务精研' },
    { value: '6', unit: '家', label: '全球分支机构' },
    { value: '300+', unit: '人', label: '专业团队规模' },
    { value: '20+', unit: '位', label: '资深合伙人' },
    { value: '100+', unit: '名', label: '客户经理' },
    { value: '30+', unit: '名', label: '资深研究员' }
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

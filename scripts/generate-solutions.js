// 生成 4 个行业解决方案页(solutions/)
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

var solutions = [
  {
    slug: 'ecommerce',
    title: '跨境电商出海解决方案',
    eyebrow: 'E-COMMERCE',
    metaTitle: '跨境电商出海方案 | 公司注册/VAT/EPR/商标 | 华企环球',
    metaDesc: '华企环球跨境电商出海方案:海外公司注册、13 国 VAT、22 项 EPR、商标布局、收款账户与税务合规一站式落地,覆盖亚马逊、Shopify、独立站全场景。',
    heroSub: '从主体搭建、税务合规到收款与品牌保护,为跨境电商卖家提供"注册 + 合规 + 运营"一站式方案,避免因合规问题被平台封店或税局罚款。',
    pains: [
      { t: '主体缺失', d: '用个人身份开店,收款受限、税务不合规,平台风控一触即发。' },
      { t: 'VAT/EPR 复杂', d: '欧盟各国 VAT 门槛、EPR 包装法/电池法/WEEE 义务繁多,漏办即罚。' },
      { t: '收款与资金', d: '多平台多站点回款分散,缺乏合规收款主体与资金归集方案。' },
      { t: '品牌保护缺位', d: '商标被抢注、跟卖泛滥,品牌资产流失后才追悔莫及。' }
    ],
    services: [
      { t: '海外主体搭建', d: '美国/英国/香港/新加坡公司注册 + EIN/UTR + 银行开户' },
      { t: '税务合规', d: '13 国 VAT 注册申报 + EPR(包装法/电池法/WEEE/欧代英代)' },
      { t: '知识产权', d: '22 国商标布局 + 版权登记 + 亚马逊品牌备案辅导' },
      { t: '收款与架构', d: '跨境收款账户 + 资金归集 + 平台回款合规' },
      { t: '平台合规', d: '亚马逊/Shopify/独立站入驻合规 + 欧洲站 CE/UKCA 认证' },
      { t: '长期陪跑', d: '年审审计 + 政策更新提醒 + 交付追踪全程可视' }
    ],
    flow: [
      '需求诊断:确定目标站点、平台与销售模式,出具合规缺口清单',
      '主体搭建:注册海外公司 + 银行账户 + EIN/UTR 税号',
      '税务落地:VAT/EPR 注册与申报,确保开售前合规',
      '品牌保护:商标注册 + 品牌备案 + 跟卖监控',
      '运营陪跑:年审、报税、政策更新与平台风控预警'
    ],
    faqs: [
      { q: '跨境电商一定需要海外公司吗?', a: '视模式而定。做欧洲站、日本站或需要合规收款主体的卖家,海外公司 + VAT 是合规基础;纯贸易模式可先评估,由顾问给出最低成本的合规路径。' },
      { q: 'VAT 和 EPR 有什么区别?都要办吗?', a: 'VAT 是增值税申报义务,EPR 是生产者责任延伸(包装法、电池法、WEEE 等),两者是独立的欧盟合规义务。是否需要办理取决于发货模式、品类与销售额,建议按站点逐项评估。' },
      { q: '商标注册多久?被抢注怎么办?', a: '美国商标约 6-12 个月,欧盟商标约 4-6 个月,快则 3 个月可下证。若已被抢注,可评估异议、无效宣告或协商转让,华企环球提供海外商标布局与维权支持。' }
    ],
    related: [
      { t: '海外公司注册', l: '../services/company-registration' },
      { t: '银行开户', l: '../services/bank-account' },
      { t: '税务规划', l: '../services/tax-planning' },
      { t: '商标知识产权', l: '../services/other-services' }
    ]
  },
  {
    slug: 'manufacturing',
    title: '制造业出海建厂解决方案',
    eyebrow: 'MANUFACTURING',
    metaTitle: '制造业出海建厂解决方案 | 泰国/越南/印尼建厂合规 | 华企环球',
    metaDesc: '华企环球制造业出海建厂方案:泰国 BOI、越南 IRC/ERC、印尼 PT PMA,外资准入评估、工厂许可、环评、税务与审计一站式落地。',
    heroSub: '从选址评估、外资准入到工厂许可与投产合规,为制造企业提供"建厂 + 许可 + 财税"全案,让产线按计划落地、合规投产。',
    pains: [
      { t: '外资准入不清', d: '目标国外资股比限制、行业准入清单不明确,投资结构选错返工成本高。' },
      { t: '许可环评复杂', d: '工厂许可、环评、消防、劳工合规多线并行,周期不可控。' },
      { t: '税务优惠没吃到', d: 'BOI/投资促进优惠不会申请,白白错过多年免税与关税豁免。' },
      { t: '落地后合规断层', d: '审计、年审、报税无人接续,投产后的合规风险持续累积。' }
    ],
    services: [
      { t: '选址与投资评估', d: '泰国/越南/印尼/马来投资环境与成本对比' },
      { t: '外资主体设立', d: 'BOI 项目公司、PT PMA、IRC/ERC 全套注册' },
      { t: '投资优惠申请', d: 'BOI/FBL/投资促进优惠申请与落地对接' },
      { t: '建厂合规', d: '工厂许可、环评、消防、劳工与社保合规' },
      { t: '财税与审计', d: '本地记账报税、法定审计、转让定价规划' },
      { t: '长期运营陪跑', d: '年审、政策更新、增资扩产与股权变更' }
    ],
    flow: [
      '投资评估:目标国政策、成本、供应链与市场对比,出具选址建议',
      '架构设计:确定投资主体与持股架构,完成境外投资(ODI)合规',
      '主体注册:设立当地公司 + 银行开户 + 投资款落地',
      '优惠申请:BOI/投资促进优惠与工厂许可、环评并行推进',
      '投产陪跑:审计年审、税务申报与后续扩产支持'
    ],
    faqs: [
      { q: '制造业出海首选哪些国家?', a: '东南亚仍是主流:泰国(汽车/电子/食品,BOI 优惠成熟)、越南(制造转移热点,IRC/ERC 流程清晰)、印尼(内需最大,PT PMA 外资友好)。具体取决于目标市场、供应链与关税安排,建议先做投资评估。' },
      { q: 'BOI 优惠能带来什么?', a: '泰国 BOI 可提供 100% 外资持股、3-8 年企业所得税减免、进口设备关税豁免、土地所有权等;越南、印尼也有类似投资优惠。申请需在注册前规划,华企环球提供评估与办理。' },
      { q: '建厂周期一般多久?', a: '主体注册约 2-4 周,工厂许可与环评视行业与地区约 1-6 个月,BOI 申请约 1-2 个月。全程节点在交付追踪页可见,关键步骤主动提醒。' }
    ],
    related: [
      { t: '泰国公司注册', l: '../country/th' },
      { t: '越南公司注册', l: '../services/company-registration' },
      { t: 'ODI 备案', l: '../knowledge/odi-vie-guide' },
      { t: '公司审计', l: '../services/audit' }
    ]
  },
  {
    slug: 'vie-red-chip',
    title: 'VIE / 红筹架构解决方案',
    eyebrow: 'CAPITAL STRUCTURE',
    metaTitle: 'VIE红筹架构解决方案 | ODI备案/37号文 | 华企环球',
    metaDesc: '华企环球 VIE/红筹架构方案:开曼/BVI/香港主体搭建、ODI 备案、37 号文登记、税务架构规划,为境外融资与上市铺路。',
    heroSub: '为计划境外融资、股权激励或上市的科技企业,搭建合规跨境架构:开曼/BVI/香港多层主体 + ODI 备案 + 37 号文登记,一步到位。',
    pains: [
      { t: '架构选型难', d: 'VIE 与红筹怎么选?各层主体放哪里?牵一发动全身。' },
      { t: '登记合规慢', d: 'ODI 备案、37 号文登记流程长,时间窗口被白白浪费。' },
      { t: '税务成本高', d: '股息汇回、股权退出税负没有提前规划,融资后才发现成本。' },
      { t: '后期调整贵', d: '架构搭错,后期股权重组成本高、周期长,甚至影响上市时间表。' }
    ],
    services: [
      { t: '架构设计', d: 'VIE/红筹架构设计 + 开曼/BVI/香港主体搭建' },
      { t: 'ODI 备案', d: '发改/商务备案 + 外汇登记,合规出海投资' },
      { t: '37 号文登记', d: '境内个人境外持股外汇登记(创始人/高管)' },
      { t: '税务规划', d: '转让定价、股息汇回与退出税负前瞻设计' },
      { t: '文件与秘书', d: '离岸公司注册代理、秘书、年审与经济实质' },
      { t: '融资配合', d: '配合律所尽调、券商与投资人文件要求' }
    ],
    flow: [
      '现状诊断:股东结构、业务资质与融资目标梳理',
      '架构设计:确定开曼/BVI/香港/境内层级与持股路径',
      '主体落地:离岸主体注册 + 银行开户 + 秘书配套',
      '登记备案:ODI 备案 + 37 号文登记同步推进',
      '合规维护:年审、经济实质、税务申报与政策跟踪'
    ],
    faqs: [
      { q: 'VIE 和红筹架构有什么区别?', a: '红筹架构指境内公司股权通过境外主体直接/间接持有(股权控制);VIE 架构适用于外资受限行业(如增值电信、教育),境外主体通过协议控制境内运营实体。两者适用场景不同,涉及 ODI 与外汇登记要求也不同。' },
      { q: 'ODI 备案多久能下来?', a: '发改与商务备案合计通常 1-3 个月,视投资额与行业而定;37 号文登记在银行办理,约 1-2 周。建议在架构搭建前 3 个月启动,避免影响融资时间表。' },
      { q: '没有海外架构可以直接融资吗?', a: '境内人民币基金可在境内直接投资,但美元基金与境外上市通常需要境外架构。具体路径取决于融资币种、业务资质与退出规划,建议先做架构诊断。' }
    ],
    related: [
      { t: '开曼/BVI 注册', l: '../services/company-registration' },
      { t: '香港公司注册', l: '../country/hk' },
      { t: '资金规划', l: '../services/fund-planning' },
      { t: '税务规划', l: '../services/tax-planning' }
    ]
  },
  {
    slug: 'identity-planning',
    title: '身份与资产规划解决方案',
    eyebrow: 'IDENTITY & ASSET',
    metaTitle: '身份与资产规划 | 马来西亚第二家园/留学移民 | 华企环球',
    metaDesc: '华企环球身份与资产规划方案:马来西亚第二家园、留学移民、海外资产配置与身份税务联动,为企业主与高净值家庭提供一站式规划。',
    heroSub: '身份规划不是"买护照",而是家庭未来与资产配置的底层设计。从马来西亚第二家园到留学移民与海外资产配置,提供一站式规划与落地陪跑。',
    pains: [
      { t: '身份与税务脱节', d: '移民决策没考虑 CRS 与税务居民身份,海外资产反而成为负担。' },
      { t: '政策信息滞后', d: '各国移民政策频繁调整,信息滞后容易错过窗口期。' },
      { t: '教育与身份错配', d: '孩子留学规划与身份办理时间线没对齐,错过升学红利。' },
      { t: '资产配置零散', d: '房产、保险、信托与身份没有整体设计,传承成本高。' }
    ],
    services: [
      { t: '马来西亚第二家园', d: 'MM2H 申请、存款方案、续签与随行家属' },
      { t: '留学移民规划', d: '国际学校/本科申请 + 身份路径联合规划' },
      { t: '海外资产配置', d: '海外置业、保险与家族资产结构设计' },
      { t: '身份税务联动', d: 'CRS 申报、税务居民身份与离境税评估' },
      { t: '企业出海联动', d: '公司注册 + 身份规划一体化,商务身份两不误' },
      { t: '长期陪跑', d: '签证续期、政策更新与家庭需求动态调整' }
    ],
    flow: [
      '需求诊断:家庭结构、资产规模、教育目标与移居意向评估',
      '方案设计:身份路径 + 税务 + 资产配置联动方案',
      '材料与申请:文件准备、官方递交与进度追踪',
      '获批落地:登陆安排、开户置业与生活配套',
      '长期维护:签证续期、CRS 申报与政策更新提醒'
    ],
    faqs: [
      { q: '马来西亚第二家园适合什么人?', a: '适合追求低门槛长期居留、子女国际教育、退休养老与东南亚资产布局的家庭。MM2H 对收入与存款有要求,具体以马来西亚移民局最新政策为准。' },
      { q: '身份规划什么时候开始最合适?', a: '越早越好。身份办理周期(数月到数年)与税务身份切换、子女升学时间线需要提前对齐,建议至少提前 1-2 年启动规划。' },
      { q: '移民会影响国内公司吗?', a: '税务居民身份变化可能影响个人全球收入申报,但企业架构、ODI 与上市安排可以提前设计,避免身份变化带来的合规冲击。华企环球提供身份与商务一体规划。' }
    ],
    related: [
      { t: '其他业务(第二家园/移民)', l: '../services/other-services' },
      { t: '马来西亚公司注册', l: '../country/my' },
      { t: '资金规划', l: '../services/fund-planning' },
      { t: '税务规划', l: '../services/tax-planning' }
    ]
  }
];

solutions.forEach(function (s) {
  var p = '../';
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / 行业解决方案 / ' + s.title,
    title: s.title,
    subtitle: s.heroSub
  });
  body += '\n\n<!-- 痛点 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">PAIN POINTS</span><h2 class="section-title">这些场景,您是否正在经历?</h2></div>\n    <div class="features-grid">' + s.pains.map(function (f) {
      return '<div class="feature-card"><div class="feature-icon">!</div><div class="feature-title">' + f.t + '</div><div class="feature-desc">' + f.d + '</div></div>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 服务组合 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">SOLUTION</span><h2 class="section-title">我们的解决方案</h2></div>\n    <div class="features-grid">' + s.services.map(function (f) {
      return '<div class="feature-card"><div class="feature-icon">✓</div><div class="feature-title">' + f.t + '</div><div class="feature-desc">' + f.d + '</div></div>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 流程 -->\n<section class="section section-soft">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">PROCESS</span><h2 class="section-title">落地流程</h2></div>\n    <div class="tracking-timeline">' + s.flow.map(function (f, i) {
      var cls = i === 0 ? 'done' : (i === 1 ? 'current' : '');
      return '<div class="tracking-step ' + cls + '"><div class="tracking-dot">' + (i + 1) + '</div><div class="tracking-content"><div class="tracking-step-name">' + f.split(':')[0] + '</div><div class="tracking-step-desc">' + f.split(':')[1] + '</div></div></div>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- 关联 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">RELATED</span><h2 class="section-title">关联服务</h2></div>\n    <div class="features-grid">' + s.related.map(function (r) {
      return '<a class="feature-card" href="' + r.l + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + r.t + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';
  body += '\n\n<!-- FAQ -->\n<section class="section section-soft">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">常见问题</h2></div>\n    <div>' + lib.faqItems(s.faqs) + '</div>\n  </div>\n</section>';
  body += '\n\n' + lib.ctaBanner('聊聊您的具体场景', 'AI 匹配 + 顾问解读,把需求变成可执行的出海方案', p);
  write('solutions/' + s.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/solutions/' + s.slug,
    title: s.metaTitle,
    desc: s.metaDesc,
    keywords: s.title + ',出海方案,华企环球',
    schemas: [lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: s.title, url: 'https://hq10000.com/solutions/' + s.slug }
    ])],
    body: body
  }));
});

console.log('solutions done');

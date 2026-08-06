// 生成 5 篇新增知识文章(knowledge/)
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

function sectionHtml(s) {
  var html = '<h2 id="' + s.id + '">' + s.h2 + '</h2>\n';
  (s.blocks || []).forEach(function (b) {
    if (b.type === 'p') html += '<p>' + b.html + '</p>\n';
    else if (b.type === 'h3') html += '<h3>' + b.text + '</h3>\n';
    else if (b.type === 'ul') html += '<ul>\n' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('\n') + '\n</ul>\n';
    else if (b.type === 'ol') html += '<ol>\n' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('\n') + '\n</ol>\n';
    else if (b.type === 'table') {
      html += '<table>\n<thead><tr>' + b.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead>\n<tbody>\n';
      b.rows.forEach(function (r) { html += '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>\n'; });
      html += '</tbody>\n</table>\n';
    } else if (b.type === 'blockquote') html += '<blockquote>' + b.text + '</blockquote>\n';
    else if (b.type === 'note') html += '<p class="note-soft"><strong>' + b.head + '</strong>' + b.text + '</p>\n';
  });
  return html;
}

function articlePage(opt) {
  var p = '../';
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="index">知识中心</a> / ' + opt.shortTitle,
    title: opt.title,
    subtitle: opt.subtitle
  });
  body += '\n\n<!-- 文章主体 -->\n<section class="section">\n  <div class="container">\n    <div class="article-layout">\n      <article class="article-body">\n' +
    opt.sections.map(sectionHtml).join('\n') +
    '\n        <h2 id="faq">常见问题</h2>\n        <div>' + lib.faqItems(opt.faqs) + '</div>\n' +
    '\n      </article>\n\n      <aside class="article-sidebar">\n' +
    '        <div class="sidebar-card article-toc">\n          <h4>📖 本文目录</h4>\n' +
    opt.toc.map(function (t) { return '<a href="#' + t.id + '">' + t.name + '</a>'; }).join('\n') +
    '          <a href="#faq">常见问题</a>\n        </div>\n' +
    '        <div class="sidebar-card">\n          <h4>📚 相关文章</h4>\n' +
    opt.related.map(function (r) { return '<a href="' + r.l + '">' + r.t + '</a>'; }).join('\n') +
    '        </div>\n' +
    '        <div class="sidebar-card">\n          <h4>🤖 AI 智能匹配</h4>\n          <p class="fs-14 c-text-light mb-12 lh-16">不确定哪种方案适合您?AI 3 分钟根据业务推荐最优方案。</p>\n          <a class="btn btn-gold btn-sm" href="../ai-match">立即匹配</a>\n        </div>\n' +
    '        <div class="sidebar-card">\n          <h4>📞 咨询顾问</h4>\n          <p class="fs-14 c-text-light mb-12 lh-16">电话/微信 186-1090-2181,顾问将在 1 个工作日内回复。</p>\n          <a class="btn btn-outline btn-sm" href="../contact">联系顾问</a>\n        </div>\n' +
    '      </aside>\n    </div>\n  </div>\n</section>\n\n' +
    lib.ctaBanner('看完还有疑问?', '把您的具体情况告诉 AI,3 分钟生成定制方案参考', p);
  write('knowledge/' + opt.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/knowledge/' + opt.slug,
    relatedModules: opt.relatedModules || 'knowledge',
    title: opt.metaTitle,
    desc: opt.metaDesc,
    keywords: opt.keywords,
    schemas: [
      lib.breadcrumbSchema([
        { name: '首页', url: 'https://hq10000.com' },
        { name: '知识中心', url: 'https://hq10000.com/knowledge' },
        { name: opt.shortTitle, url: 'https://hq10000.com/knowledge/' + opt.slug }
      ]),
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": opt.title,
        "author": { "@id": "https://hq10000.com/#organization" },
        "publisher": { "@id": "https://hq10000.com/#organization" },
        "inLanguage": "zh-CN",
        "datePublished": opt.publishDate
      }
    ],
    body: body
  }));
}

// 1) 香港 vs 新加坡
articlePage({
  slug: 'hk-vs-sg-company',
  shortTitle: '香港公司 vs 新加坡公司',
  title: '香港公司 vs 新加坡公司:怎么选?',
  subtitle: '香港与新加坡都是中国企业出海的"首选双城",但税制、开户、融资与合规成本差异显著。本文从四个维度对比,帮您按业务场景做选择。',
  metaTitle: '香港vs新加坡公司怎么选？税制/开户/融资对比',
  metaDesc: '香港公司与新加坡公司四维对比:税制、银行开户、融资能力、合规成本,结合业务场景给出2026选择建议,帮企业选对出海注册地。华企环球两地均可代办。',
  keywords: '香港公司注册,新加坡公司注册,香港新加坡公司对比,出海注册地选择',
  publishDate: '2026-08-05',
  toc: [
    { id: 'cmp-tax', name: '税制对比' },
    { id: 'cmp-bank', name: '银行开户' },
    { id: 'cmp-finance', name: '融资与资本' },
    { id: 'cmp-cost', name: '合规成本' },
    { id: 'cmp-scene', name: '按场景选择' }
  ],
  sections: [
    {
      id: 'cmp-tax', h2: '税制对比:谁更省?',
      blocks: [
        { type: 'p', html: '香港与新加坡都实行属地征税,仅对源自本地的利润征税,无资本利得税与股息预扣税,但对利润汇回的免税规则与优惠税率细节不同。' },
        {
          type: 'table', head: ['维度', '香港', '新加坡'],
          rows: [
            ['利得税/所得税', '16.5%(首 200 万港元利润 8.25%)', '17%(新公司可享 SUTE 减免)'],
            ['增值税/消费税', '无', 'GST 9%(年营业额超 100 万新元强制注册)'],
            ['境外利润', '符合条件可申请离岸免税', '未汇入新加坡的境外所得一般免税'],
            ['股息/资本利得', '不征税', '不征税'],
            ['税收协定', '与内地有税收安排', '全球 90+ 税收协定']
          ]
        },
        { type: 'blockquote', text: '一句话:做传统贸易与内地关联业务,香港的离岸免税与内地安排更顺手;做区域总部与科技/金融业务,新加坡的协定网络与免税政策更友好。' }
      ]
    },
    {
      id: 'cmp-bank', h2: '银行开户:谁更容易?',
      blocks: [
        { type: 'p', html: '两地开户都需要真实业务背景与资金来源证明,但体验差异明显:' },
        {
          type: 'ul', items: [
            '<strong>香港</strong>:汇丰、中银香港、星展、招商永隆等可选,部分银行支持视频面签,部分需过港;对贸易类业务友好。',
            '<strong>新加坡</strong>:DBS、OCBC、UOB 主流,普遍支持视频面签,无需赴新;对科技/跨境业务与资金归集更友好,但最低存款要求较高。',
            '<strong>共同点</strong>:开户前建议完成业务材料与资金来源说明的预审,避免盲目申请留下拒签记录。'
          ]
        }
      ]
    },
    {
      id: 'cmp-finance', h2: '融资与资本运作',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>香港</strong>:港股上市路径成熟,红筹/VIE 架构常用香港作为中间层,与内地 ODI 衔接顺畅。',
            '<strong>新加坡</strong>:东南亚融资生态活跃,适合区域总部、家族办公室与中新两地架构。',
            '<strong>提示</strong>:无论选哪边,跨境架构(开曼 + 香港/新加坡 + 境内)建议先做 ODI 备案与 37 号文规划。'
          ]
        }
      ]
    },
    {
      id: 'cmp-cost', h2: '合规成本:谁更省心?',
      blocks: [
        {
          type: 'table', head: ['项目', '香港', '新加坡'],
          rows: [
            ['公司秘书', '必须(持牌秘书)', '6 个月内必须任命本地秘书'],
            ['年报/年审', '周年申报 + 审计(小规模可豁免审计)', 'Annual Return + 审计(小规模可豁免)'],
            ['注册地址', '必须本地地址', '必须本地地址'],
            ['政府规费(首年)', '注册费约 HKD 1,720 + 商业登记费', '核名 + 注册约 S$315'],
            ['整体复杂度', '中等,与内地衔接成熟', '中等,流程电子化程度高']
          ]
        },
        { type: 'note', head: '说明:', text: '政府规费为公开参考,以两地官方最新收费为准;服务费均为定制报价。' }
      ]
    },
    {
      id: 'cmp-scene', h2: '按场景选择',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>做内地贸易、港股上市、VIE 中间层</strong>:优先香港。',
            '<strong>做东南亚市场、科技/金融业务、家族办公室</strong>:优先新加坡。',
            '<strong>跨境电商收款与资金归集</strong>:两地都可,结合目标市场银行通道选择。',
            '<strong>预算敏感型初创</strong>:香港注册周期更短(3-7 工作日),新加坡需搭配本地董事(有年费)。'
          ]
        }
      ]
    }
  ],
  related: [
    { t: '2026 新加坡公司注册完全指南', l: 'singapore-registration-guide' },
    { t: '各国公司注册周期与费用对比(2026)', l: 'registration-cost-comparison' },
    { t: 'ODI 备案与 VIE 架构:跨境融资必读', l: 'odi-vie-guide' }
  ],
  faqs: [
    { q: '香港和新加坡能同时注册吗?', a: '可以,很多企业采用"香港 + 新加坡"双主体:香港承接内地贸易与资金通道,新加坡承接东南亚业务与区域总部,再通过开曼/BVI 做顶层架构。建议先做整体架构设计再落子。' },
    { q: '两地公司哪个更适合跨境电商?', a: '做欧美站收款,美国/英国主体更直接;做东南亚站,新加坡主体与本地银行通道更顺;做香港仓与贸易转口,香港公司配合离岸免税更省税。核心看资金流向与平台要求。' },
    { q: '注册香港或新加坡公司需要本人到场吗?', a: '注册全程可远程办理,无需到场。银行开户:新加坡主流银行视频面签即可,香港部分银行视频、部分需过港,华企环球会结合您的情况推荐方案。' }
  ]
});

// 2) 开曼 vs BVI
articlePage({
  slug: 'cayman-vs-bvi',
  shortTitle: '开曼 vs BVI',
  title: '开曼 vs BVI:离岸公司怎么选?',
  subtitle: '开曼群岛与 BVI 是离岸架构的两大基石,也是 VIE/红筹顶层最常见的注册地。两者税务政策相近,但在上市认可、经济实质与成本上差异明显。',
  metaTitle: '开曼vs BVI怎么选？上市/经济实质/费用对比',
  metaDesc: '开曼群岛与BVI离岸公司怎么选?对比上市认可度、经济实质要求、年费成本、隐私与董事要求,讲清VIE/红筹架构中的取舍。华企环球提供开曼/BVI注册代办。',
  keywords: '开曼公司注册,BVI公司注册,离岸公司对比,VIE架构,红筹架构',
  publishDate: '2026-08-04',
  toc: [
    { id: 'off-role', name: '两者在架构中的角色' },
    { id: 'off-tax', name: '税务与合规' },
    { id: 'off-listing', name: '上市认可度' },
    { id: 'off-cost', name: '成本与维护' },
    { id: 'off-pick', name: '怎么选' }
  ],
  sections: [
    {
      id: 'off-role', h2: '两者在架构中的角色',
      blocks: [
        { type: 'p', html: '典型的红筹/VIE 架构是:开曼(BVI)顶层 → 香港中间层 → 境内运营公司。开曼与 BVI 都是英属离岸地,无企业所得税,常用于控股层;香港作为中间层利用税收协定与资金通道。' },
        {
          type: 'ul', items: [
            '<strong>开曼</strong>:资本市场认可度最高,美股/港股上市主体常用开曼公司(如大量中概股)。',
            '<strong>BVI</strong>:股权架构灵活(无股东名册公开),常用于开曼上层或 SPV 层,隐私性更好。'
          ]
        }
      ]
    },
    {
      id: 'off-tax', h2: '税务与合规',
      blocks: [
        {
          type: 'table', head: ['维度', '开曼', 'BVI'],
          rows: [
            ['企业所得税', '无', '无'],
            ['资本利得/股息/利息', '不征税', '不征税'],
            ['经济实质要求', '纯控股可豁免(满足申报)', '纯控股可豁免(满足申报)'],
            ['财务申报', '需提交简易申报/审计(视情况)', '需提交财务申报(小规模可豁免)']
          ]
        },
        { type: 'note', head: '提示:', text: '两地都已引入经济实质法,纯控股公司通常只需合规申报即可豁免实质要求,但若实际开展受管制业务,需满足当地实质标准。' }
      ]
    },
    {
      id: 'off-listing', h2: '上市认可度',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>美股/港股</strong>:开曼公司是被交易所与投资者最广泛接受的上市主体。',
            '<strong>BVI 公司</strong>:可作为上市主体的上层股东持股平台(隐私保护),直接作为上市主体相对少见。',
            '<strong>实操惯例</strong>:常见组合为"BVI(股东层)→ 开曼(上市主体)→ 香港(中间层)→ 境内"。'
          ]
        }
      ]
    },
    {
      id: 'off-cost', h2: '成本与维护',
      blocks: [
        {
          type: 'ul', items: [
            '两地注册周期相近(约 5-15 工作日),均可远程办理,无需本人到场。',
            '年度维护均含政府年费 + 注册代理/秘书费用,金额随注册资本档位变化,具体以代理报价为准。',
            '开曼因上市配套服务多,整体持有成本通常略高于 BVI。'
          ]
        }
      ]
    },
    {
      id: 'off-pick', h2: '怎么选',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>准备美股/港股上市</strong>:顶层用开曼公司。',
            '<strong>只做资产隔离/股权代持/SPV</strong>:用 BVI 更省、更私密。',
            '<strong>两层都要</strong>:BVI 在上(股东)、开曼在中(上市主体),这是中概股最常见的组合。',
            '<strong>始终配合</strong>:无论选哪边,都要同步完成 ODI 备案/37 号文与香港中间层设计。'
          ]
        }
      ]
    }
  ],
  related: [
    { t: 'ODI 备案与 VIE 架构:跨境融资必读', l: 'odi-vie-guide' },
    { t: '香港公司 vs 新加坡公司:怎么选?', l: 'hk-vs-sg-company' }
  ],
  faqs: [
    { q: '开曼和 BVI 注册需要本人到场吗?', a: '不需要。两地注册均可远程办理,提供董事/股东证件扫描件即可,通常 5-15 个工作日完成,注册后由注册代理维护。' },
    { q: '经济实质法对我有影响吗?', a: '纯控股(Passive Holding)公司通常只需完成合规申报即可豁免实质测试;若开展贸易、金融等实际业务,需满足当地实质要求。华企环球会按您的业务模式评估申报义务。' },
    { q: '离岸公司能开银行账户吗?', a: '可以,但审核严格。主流做法是开曼/BVI 公司 + 香港或新加坡银行账户,需提供完整 KYC 材料与业务证明。开户前建议先做银行预审。' }
  ]
});

// 3) 各国注册周期与费用对比
articlePage({
  slug: 'registration-cost-comparison',
  shortTitle: '各国注册周期与费用对比',
  title: '各国公司注册周期与费用对比(2026)',
  subtitle: '新加坡、美国、香港、马来西亚、泰国、英国、日本、韩国八大热门市场的注册周期、政府规费与到场要求一表对比,帮你建立预算预期。',
  metaTitle: '各国公司注册费用与周期对比(2026)| 八大市场',
  metaDesc: '八大热门市场公司注册周期与费用对比表:监管机构、注册周期、是否到场、政府规费参考,附避坑建议与定制报价说明。华企环球提供全程代办服务。',
  keywords: '公司注册费用,注册周期对比,海外公司注册多少钱,新加坡美国香港注册对比',
  publishDate: '2026-08-03',
  toc: [
    { id: 'cost-table', name: '八大市场速览表' },
    { id: 'cost-read', name: '怎么读这张表' },
    { id: 'cost-avoid', name: '避坑指南' },
    { id: 'cost-extra', name: '除了注册费还有哪些成本' }
  ],
  sections: [
    {
      id: 'cost-table', h2: '八大热门市场速览',
      blocks: [
        {
          type: 'table', head: ['国家/地区', '监管机构', '公司类型', '常规周期', '是否到场', '政府规费参考'],
          rows: [
            ['美国', '州务卿办公室', 'LLC / INC', '1-3 工作日', '否', '各州不同(特拉华/加州等)'],
            ['英国', 'Companies House', 'Ltd', '1-3 工作日', '否', '约 £50'],
            ['香港', '公司註冊處 CR', '有限公司', '3-7 工作日', '否', '约 HKD 1,720 + 商业登记费'],
            ['新加坡', 'ACRA', 'Pte Ltd', '5-7 工作日', '否', '核名 S$15 + 注册 S$300'],
            ['马来西亚', 'SSM', 'Sdn Bhd', '7-10 工作日', '否', '按注册资本档位'],
            ['韩国', '法院登记所', '株式会社', '7-12 工作日', '否', '登记税按资本金'],
            ['日本', '法務局', '株式会社 KK', '10-15 工作日', '否', '登记许可税按资本金'],
            ['泰国', 'DBD', 'Co., Ltd', '15-20 工作日', '否', '按注册资本比例']
          ]
        }
      ]
    },
    {
      id: 'cost-read', h2: '怎么读这张表',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>周期</strong>:指常规注册流程,特殊行业、前置审批或复杂架构另计。',
            '<strong>到场</strong>:注册全程可远程代办;"否"不代表开户也能远程,部分银行仍需视频面签或本人到场。',
            '<strong>规费</strong>:仅政府收费参考,不含服务费、注册代理、秘书、地址等第三方费用。'
          ]
        }
      ]
    },
    {
      id: 'cost-avoid', h2: '避坑指南',
      blocks: [
        {
          type: 'ul', items: [
            '警惕"超低价注册":低价通常不含本地董事、秘书、地址年费,后期隐形收费更贵。',
            '先算年度成本:注册是一次性投入,秘书 + 地址 + 年审 + 报税才是持续支出。',
            '先规划再注册:涉及架构(VIE/红筹)、ODI 备案或行业准入的,务必先做方案再落子,返工成本远高于前期规划。'
          ]
        },
        { type: 'blockquote', text: '华企环球采用定制报价:签约前书面列明政府规费、服务费与第三方费用,合同锁定不加价。' }
      ]
    },
    {
      id: 'cost-extra', h2: '除了注册费还有哪些成本',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>年度维持</strong>:公司秘书、注册地址、年审/年报、税务申报。',
            '<strong>银行账户</strong>:部分银行有最低存款要求与账户管理费。',
            '<strong>合规配套</strong>:挂名董事(新加坡/马来西亚)、BOI 申报(美国)、经济实质申报(开曼/BVI)。',
            '<strong>增值服务</strong>:商标、VAT/EPR、审计、架构设计等按需计费。'
          ]
        }
      ]
    }
  ],
  related: [
    { t: '2026 新加坡公司注册完全指南', l: 'singapore-registration-guide' },
    { t: '海外银行开户指南:材料、周期与银行怎么选', l: 'overseas-bank-account-guide' },
    { t: '费用与周期说明', l: '../services/fees' }
  ],
  faqs: [
    { q: '为什么各家报价差那么多?', a: '差异主要来自:是否含政府规费、本地董事/秘书/地址是否内置、是否含银行开户辅导。比价时建议要求对方出具书面费用清单,逐项对比"含什么、不含什么"。' },
    { q: '注册周期能加急吗?', a: '部分国家支持加急(如美国各州、英国、新加坡),加急通常有额外规费;涉及前置审批(泰国 BOI、日本定款公证)则难以压缩。' },
    { q: '政府规费会变吗?', a: '会。各国每年可能调整收费标准,本文为公开参考,签约时以官方最新收费与书面报价为准。' }
  ]
});

// 4) 海外银行开户指南
articlePage({
  slug: 'overseas-bank-account-guide',
  shortTitle: '海外银行开户指南',
  title: '海外银行开户指南:材料、周期与银行怎么选',
  subtitle: '公司注册好了却开不了户,是出海最常见的"卡点"。本文梳理新加坡、香港、美国、马来西亚开户的材料、面签方式与周期,帮你一次通过。',
  metaTitle: '海外银行开户指南:材料、周期与银行怎么选 | 华企环球',
  metaDesc: '新加坡、香港、美国、马来西亚银行开户指南:材料清单、视频面签要点、银行选择与提高通过率技巧,避免有公司无账户。华企环球远程开户+陪同面签代办。',
  keywords: '海外银行开户,新加坡开户,香港开户,美国开户,银行开户材料',
  publishDate: '2026-08-02',
  toc: [
    { id: 'ba-why', name: '为什么开户越来越难' },
    { id: 'ba-sg', name: '新加坡开户' },
    { id: 'ba-hk', name: '香港开户' },
    { id: 'ba-us', name: '美国开户' },
    { id: 'ba-tips', name: '提高通过率的 5 个技巧' }
  ],
  sections: [
    {
      id: 'ba-why', h2: '为什么开户越来越难',
      blocks: [
        { type: 'p', html: '全球反洗钱(AML)与 KYC 审核趋严,银行对跨境公司的股东背景、业务模式、资金来源审查更细。开户被拒的常见原因:业务模式说不清、资金来源不明、材料不完整、股东背景复杂。' },
        { type: 'blockquote', text: '结论先行:开户不是提交材料就完事,而是"公司故事"的合规陈述。提前预审能显著提高通过率。' }
      ]
    },
    {
      id: 'ba-sg', h2: '新加坡开户',
      blocks: [
        {
          type: 'table', head: ['银行', '开户周期', '最低存款参考', '特点'],
          rows: [
            ['DBS 星展', '4-6 周', 'S$50,000', '东南亚最大银行,跨境结算强'],
            ['OCBC 华侨', '4-6 周', 'S$30,000', '对华人客户友好,审批相对宽松'],
            ['UOB 大华', '4-6 周', 'S$50,000', '财富管理与外汇服务突出']
          ]
        },
        { type: 'ul', items: ['材料:公司注册证书、BizFile、章程、董事股东证件、业务证明、资金来源说明。', '方式:视频面签(KYC Interview)为主,无需赴新。'] }
      ]
    },
    {
      id: 'ba-hk', h2: '香港开户',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>主流银行</strong>:汇丰、中银香港、星展、招商永隆、东亚。',
            '<strong>面签方式</strong>:部分银行支持视频面签,部分要求过港(新公司或敏感行业更严)。',
            '<strong>材料</strong>:CI 注册证书、BR 商业登记证、法团成立表格、董事股东证件、业务合同/发票、审计或财务报表(如有)。',
            '<strong>提示</strong>:贸易类公司准备好购销合同与物流单据,通过率更高。'
          ]
        }
      ]
    },
    {
      id: 'ba-us', h2: '美国开户',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>可选</strong>:Mercury、Brex 等数字银行(远程、快),BoA、Wells Fargo、Chase 等传统银行。',
            '<strong>关键前提</strong>:公司注册完成 + EIN 税号(部分银行还要求 BOI 申报完成)。',
            '<strong>材料</strong>:州注册证书、EIN 确认函、运营协议、董事成员证件、美国地址(部分银行要求)。',
            '<strong>周期</strong>:数字银行 1-2 周,传统银行 2-4 周。'
          ]
        }
      ]
    },
    {
      id: 'ba-tips', h2: '提高通过率的 5 个技巧',
      blocks: [
        {
          type: 'ol', items: [
            '先注册再做开户预审:让顾问按目标银行标准检查材料,避免硬伤。',
            '业务模式讲清楚:准备一页业务说明(模式、上下游、资金流向),面签时逻辑自洽。',
            '资金来源可追溯:大额初始存款提前准备来源证明(工资流水、公司利润、投资收益)。',
            '一个银行被拒别硬冲:换银行前先优化材料,避免留拒签记录。',
            '账户落地后保持活跃:及时年审、按时申报,避免账户被冻结或关停。'
          ]
        }
      ]
    }
  ],
  related: [
    { t: '2026 新加坡公司注册完全指南', l: 'singapore-registration-guide' },
    { t: '各国公司注册周期与费用对比(2026)', l: 'registration-cost-comparison' },
    { t: '公司开户服务', l: '../services/bank-account' }
  ],
  faqs: [
    { q: '注册完公司一定能开到户吗?', a: '不能保证。银行有独立审核权,但通过预审、材料完整与业务说明清晰可以显著提高成功率。华企环球提供开户预审与多家银行通道,被拒后协助二次申请。' },
    { q: '视频面签要注意什么?', a: '本人出镜、环境安静、如实回答业务与资金来源问题,不要出现代答或照念材料的情况。建议面签前做一次模拟。' },
    { q: '开户周期一般多久?', a: '视频/远程开户通常 2-6 周(数字银行更快);传统银行或敏感行业可能 1-3 个月。建议注册启动时就同步预约开户。' }
  ]
});

// 5) ODI 备案与 VIE 架构
articlePage({
  slug: 'odi-vie-guide',
  shortTitle: 'ODI 备案与 VIE 架构',
  title: 'ODI 备案与 VIE 架构:跨境融资必读',
  subtitle: '境外融资、架构搭建绕不开 ODI 备案与 37 号文。本文讲清 ODI 是什么、VIE 与红筹的区别、备案流程与常见合规坑。',
  metaTitle: 'ODI备案与VIE架构:跨境融资必读 | 37号文 | 华企环球',
  metaDesc: 'ODI备案适用场景与流程、VIE与红筹架构区别、37号文登记要点、常见合规坑,为境外融资与上市企业准备的架构必读。华企环球提供ODI/VIE一站式服务。',
  keywords: 'ODI备案,VIE架构,红筹架构,37号文,境外投资备案',
  publishDate: '2026-08-01',
  toc: [
    { id: 'odi-what', name: 'ODI 备案是什么' },
    { id: 'odi-flow', name: '备案流程' },
    { id: 'vie-vs-red', name: 'VIE 与红筹的区别' },
    { id: 'wenshu-37', name: '37 号文登记' },
    { id: 'odi-pit', name: '常见合规坑' }
  ],
  sections: [
    {
      id: 'odi-what', h2: 'ODI 备案是什么',
      blocks: [
        { type: 'p', html: 'ODI(Outbound Direct Investment,境外直接投资)备案,指境内企业通过新设、并购等方式在境外设立或取得企业权益前,向发改、商务部门履行备案/核准手续,并完成外汇登记。' },
        {
          type: 'ul', items: [
            '<strong>适用</strong>:境内公司作为股东投资设立境外子公司/SPV、红筹架构中境内主体对境外持股。',
            '<strong>不办后果</strong>:资金无法合规出境,返程投资(境内再投资)时银行会要求提供 ODI 文件,上市尽调也会核查。',
            '<strong>两大备案</strong>:发改(项目备案)+ 商务(企业备案),敏感行业/大额投资走核准。'
          ]
        }
      ]
    },
    {
      id: 'odi-flow', h2: '备案流程',
      blocks: [
        {
          type: 'ol', items: [
            '内部决策:董事会/股东会决议,明确投资主体、路径与金额。',
            '材料准备:可研报告、投资架构图、资金来源证明、境外公司注册文件(如已注册)。',
            '发改备案:通过全国境外投资项目备案系统提交。',
            '商务备案:通过商务部业务系统提交,获取《企业境外投资证书》。',
            '外汇登记:凭证书在银行办理 ODI 外汇登记,资金汇出。'
          ]
        },
        { type: 'p', html: '整体周期通常 1-3 个月,视投资额与行业而定;建议在架构搭建前 3 个月启动。' }
      ]
    },
    {
      id: 'vie-vs-red', h2: 'VIE 与红筹的区别',
      blocks: [
        {
          type: 'table', head: ['维度', '红筹架构', 'VIE 架构'],
          rows: [
            ['控制方式', '股权控制(境外主体持股境内)', '协议控制(VIE 协议)'],
            ['适用行业', '外资准入无限制行业', '外资受限行业(增值电信、教育、媒体等)'],
            ['常见组合', 'BVI → 开曼 → 香港 → 境内', 'BVI → 开曼 → 香港 → WFOE → VIE 实体'],
            ['合规重点', 'ODI 备案 + 外汇登记', 'ODI + 37 号文 + VIE 协议效力评估']
          ]
        }
      ]
    },
    {
      id: 'wenshu-37', h2: '37 号文登记',
      blocks: [
        { type: 'p', html: '37 号文(国家外汇管理局 2014 年 37 号文)要求:境内居民个人以境外投融资为目的,在境外设立特殊目的公司(SPV),须在银行办理外汇登记。' },
        {
          type: 'ul', items: [
            '<strong>谁要办</strong>:创始人、高管等境内个人股东在架构中直接持有开曼/BVI 股份的。',
            '<strong>何时办</strong>:境外架构搭建前或增资前,错过窗口补登记难度大。',
            '<strong>不办后果</strong>:资金无法回流、后续融资/上市合规受阻、个人外汇处罚风险。'
          ]
        }
      ]
    },
    {
      id: 'odi-pit', h2: '常见合规坑',
      blocks: [
        {
          type: 'ul', items: [
            '<strong>先搭架构后补备案</strong>:境外主体已设立才想起 ODI,补办难度与时间成本大增。',
            '<strong>37 号文遗漏</strong>:只做公司 ODI 不做个人登记,融资款无法合规回流。',
            '<strong>架构层级乱</strong>:多层 SPV 无业务实质,经济实质与税务申报风险叠加。',
            '<strong>税务没规划</strong>:股息汇回、股权退出税负未设计,上市后成本高企。'
          ]
        },
        { type: 'blockquote', text: '建议:架构设计、ODI 备案、37 号文与税务规划四件事同步启动,由同一团队统筹,避免各环节脱节。' }
      ]
    }
  ],
  related: [
    { t: '开曼 vs BVI:离岸公司怎么选?', l: 'cayman-vs-bvi' },
    { t: '香港公司 vs 新加坡公司:怎么选?', l: 'hk-vs-sg-company' },
    { t: '资金规划服务', l: '../services/fund-planning' }
  ],
  faqs: [
    { q: 'ODI 备案多久能办下来?', a: '发改与商务备案合计通常 1-3 个月,视投资额、行业与材料完整度而定;敏感行业或大额投资走核准程序,周期更长。' },
    { q: '个人境外持股一定要办 37 号文吗?', a: '境内居民个人直接在境外 SPV 持股用于投融资目的的,原则上必须办理 37 号文登记,否则后续资金回流与上市合规会受阻。' },
    { q: '已搭好架构还能补备案吗?', a: '可以补,但难度和成本显著增加,且部分情形需先行整改架构。建议尽早启动合规补救,华企环球可协助评估补办路径。' }
  ]
});

console.log('knowledge articles done');

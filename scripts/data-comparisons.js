// 竞品公开信息对比页数据
// 合规边界:仅呈现双方官网公开自述信息,不做优劣评价、不做负面定性。
// 华企环球自身数据来自官网;竞品数据来自其官网自述(检索日期见 data.checked)。
'use strict';

const CHECKED = '2026-09-16';

const US = {
  start: '前身 2012 年创立,2018 年品牌独立',
  hq: '香港 + 深圳双总部,海外 5 处分支(马来西亚 / 新加坡 / 泰国 / 越南等)',
  coverage: '126 个国家及地区(核心 60+ 国家/地区直办)',
  team: '300+ 专业团队',
  services: '海外公司注册、银行开户、年审与审计、税务规划(VAT/EPR)、VIE/ODI 资金架构、离岸公司(开曼/BVI)、海牙认证、海外商标、身份与资产规划',
  credentials: '马来西亚 SSM 持牌公司秘书机构',
  mode: 'AI 智能企服匹配引擎、实时交付追踪、明码方案与顾问一对一确认'
};

function rows(theirs) {
  return [
    { dim: '起步与品牌', us: US.start, them: theirs.start },
    { dim: '总部与网点', us: US.hq, them: theirs.hq },
    { dim: '覆盖国家/地区', us: US.coverage, them: theirs.coverage },
    { dim: '团队规模', us: US.team, them: theirs.team },
    { dim: '服务范围', us: US.services, them: theirs.services },
    { dim: '资质与背书', us: US.credentials, them: theirs.credentials },
    { dim: '服务模式与工具', us: US.mode, them: theirs.mode }
  ];
}

module.exports = [
  {
    slug: 'vanzbon', name: '万企帮', domain: 'vanzbon.cn', site: 'https://www.vanzbon.cn/',
    positioning: '全球商业生态共建者',
    metaTitle: '华企环球 vs 万企帮 | 服务范围与覆盖对比(公开信息)',
    metaDesc: '华企环球与万企帮的公开信息对比:起步与布局、覆盖国家、服务范围、资质与服务模式。信息取自双方官网自述,仅作客观罗列,不构成优劣评价。',
    intro: '万企帮(vanzbon.cn)官网定位为“全球商业生态共建者”,服务线偏“全球市场进入”的完整链条,除公司注册与财税外,还覆盖市场调研、资质准入、法律与人力资源、知识产权与海外选址等板块。以下为双方官网公开信息的并列呈现,便于按自身场景逐项对照。',
    theirs: {
      start: '官网未明确标注成立年份',
      hq: '官网自述设有 30+ 市场办事处',
      coverage: '官网自述覆盖 150+ 国家',
      team: '官网自述 600+ 本地专家',
      services: '全球公司注册、海外市场考察与调研、全球市场准入与资质办理、海外财税合规与会计、全球法律与人力资源、全球知识产权、海外选址与商业地产',
      credentials: '官网未突出标注特定持牌资质',
      mode: '以“市场进入”全链条咨询为主,官网设行业解决方案与热门国家页'
    }
  },
  {
    slug: 'tenace', name: '唐诚控股', domain: 'tenace.cn', site: 'https://www.tenace.cn/',
    positioning: '全球财税综合服务商',
    metaTitle: '华企环球 vs 唐诚控股 | 服务范围与覆盖对比(公开信息)',
    metaDesc: '华企环球与唐诚控股的公开信息对比:双总部布局、覆盖国家、服务范围、资质与服务模式。信息取自双方官网自述,仅作客观罗列,不构成优劣评价。',
    intro: '唐诚控股(tenace.cn)官网自述成立于 2021 年,设北京与新加坡双总部,服务线同时覆盖境内工商财税与境外服务(海外银行开户、VIE 搭建、VAT/EPR、ODI 备案等)。以下为双方官网公开信息的并列呈现。',
    theirs: {
      start: '官网自述 2021 年成立',
      hq: '官网自述北京 + 新加坡双总部,服务网络覆盖国内 15 城及海外 9 国',
      coverage: '官网自述覆盖 24+ 国家/地区',
      team: '官网自述 1521 名员工',
      services: '工商会计服务、综合服务(许可/知识产权/园区)、建筑资质服务、海外服务(海外银行开户、VIE 搭建、VAT&EPR、ODI 备案、股权顶层架构)、企业贷款服务',
      credentials: '官网提及亚马逊 / 速卖通 SPN 等平台合作背书',
      mode: '境内境外一体化代理,官网含明码标价与商城形态内容'
    }
  },
  {
    slug: 'xiaoniu', name: '小牛国际', domain: 'xiaoniucw.com', site: 'https://www.xiaoniucw.com',
    positioning: '全球商务服务品牌',
    metaTitle: '华企环球 vs 小牛国际 | 服务范围与覆盖对比(公开信息)',
    metaDesc: '华企环球与小牛国际的公开信息对比:起步年份、覆盖国家、服务范围、持牌资质与服务模式。信息取自双方官网自述,仅作客观罗列,不构成优劣评价。',
    intro: '小牛国际(xiaoniucw.com)官网自述自 2010 年从业,服务涵盖香港公司注册、新加坡银行开户、美国公司审计与税务申报等,并对外展示 TCSP 牌照编号与免费核名工具。以下为双方官网公开信息的并列呈现。',
    theirs: {
      start: '官网自述自 2010 年从业',
      hq: '官网自述 13 国 9 城布局',
      coverage: '官网自述覆盖 13 国 / 9 城',
      team: '官网未明确标注团队规模,自述服务 12 万+ 客户',
      services: '香港公司注册、美国公司审计、新加坡银行开户、公司税务申报等海外商务服务',
      credentials: '官网展示 TCSP 牌照编号 TC009551',
      mode: '提供免费核名工具等自助入口,以港新美等成熟市场服务为主'
    }
  },
  {
    slug: 'simengqifu', name: '中港星 / 司盟企服', domain: 'simengqifu.com', site: 'https://www.simengqifu.com',
    positioning: '科技驱动企服平台',
    metaTitle: '华企环球 vs 中港星(司盟企服) | 服务范围对比(公开信息)',
    metaDesc: '华企环球与中港星/司盟企服的公开信息对比:起步年份、覆盖国家、服务范围、持牌资质与平台化模式。信息取自双方官网自述,仅作客观罗列,不构成优劣评价。',
    intro: '中港星 / 司盟企服(simengqifu.com)官网定位为科技驱动的企服平台,自述 21 年企业服务经验,强调明码标价、商城化产品与 AI 客服,并对外展示 TCSP 资质。以下为双方官网公开信息的并列呈现。',
    theirs: {
      start: '官网自述 21 年企业服务经验(2005 年前后起步)',
      hq: '官网以深圳为基点,自述与集团站/商城站并存的多站布局',
      coverage: '官网自述覆盖 160+ 国家',
      team: '官网自述 2000+ 团队',
      services: '国内外公司注册、记账报税、知识产权、资质代办、企业认证等一站式企业服务',
      credentials: '官网展示双 TCSP 资质',
      mode: '平台化:APP / 小程序 + AI 客服 + 商城 + 明码标价,自述 4000+ 服务产品'
    }
  }
];

module.exports.CHECKED = CHECKED;
module.exports.US = US;
module.exports.rows = rows;
module.exports.checked = CHECKED;

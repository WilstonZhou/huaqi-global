// 国家页「相关知识」上下文内链表(批次:索引覆盖率修复)
//
// 为什么单独一个数据文件:国家页原先只链「相关服务」,知识中心 14 篇文章与 4 篇政策解读
// 的正文入链只有 1-4 条(scripts/body_inlinks.py 实测),GSC 侧这些 URL 长期停在
// 「已发现 - 尚未编入索引」。本表按国家给 3-5 条**主题相关**的深度阅读入口,
// 既补正文入链,也让国家页多一块可被引擎摘录的内容锚点。
//
// 字段:id 对应 scripts/data-countries.js 的 slug;items 的 l/t/d 分别是路径、标题、一句话说明。
// 未配置的国家输出不变(零 diff),新增国家只需追加一条。
'use strict';

module.exports = {
  sg: {
    lead: '新加坡注册前后的关键判断,这几篇讲得更细。',
    items: [
      { l: '/knowledge/singapore-registration-guide', t: '2026 新加坡公司注册指南', d: 'Pte Ltd 与独资企业怎么选、注册资本与本地董事的实操口径。' },
      { l: '/knowledge/sg-annual-return-audit-exemption', t: '新加坡公司年审与审计豁免', d: '三项指标怎么算、豁免后仍需履行的申报义务。' },
      { l: '/knowledge/hk-vs-sg-company', t: '香港 vs 新加坡公司对比', d: '税制、开户难度与融资场景的横向对照。' },
      { l: '/knowledge/overseas-bank-account-guide', t: '海外银行开户指南', d: '开户材料、周期与银行选择的判断顺序。' }
    ]
  },
  hk: {
    lead: '香港公司的年审、报税与开户,是注册之后最容易踩坑的三块。',
    items: [
      { l: '/knowledge/hk-vs-sg-company', t: '香港 vs 新加坡公司对比', d: '两地税制、开户与融资场景的差异。' },
      { l: '/news/hk-offshore-claim-2026', t: '香港离岸豁免怎么申请', d: '利得税地域来源原则与申请材料的准备顺序。' },
      { l: '/knowledge/hk-annual-review-overdue', t: '香港公司年审逾期怎么办', d: '罚款档次与补救流程。' },
      { l: '/knowledge/hk-bank-account-rejected', t: '香港公司开户被拒怎么办', d: '6 个常见原因与补救顺序。' },
      { l: '/knowledge/hk-zero-declaration-fix', t: '香港公司零申报被查怎么办', d: '补账补税与罚款处理的先后关系。' }
    ]
  },
  us: {
    lead: '美国公司的税、年审与州选择,决定了长期持有成本。',
    items: [
      { l: '/knowledge/us-company-tax-policy', t: '美国公司税收政策解读', d: 'LLC 穿透课税与 INC 双重征税的对比与州税口径。' },
      { l: '/knowledge/us-company-annual-filing', t: '美国公司年审与信息申报', d: '州年报、联邦税表与 BOI 信息申报的截止节点。' },
      { l: '/country/us/tax', t: '美国公司税务申报', d: '联邦 21% 与州税、5472/1120 表的适用场景。' },
      { l: '/knowledge/overseas-bank-account-guide', t: '海外银行开户指南', d: '美国账户的材料准备与银行选择。' }
    ]
  },
  th: {
    lead: '泰国的外资持股限制与 BOI 优惠,是决定架构的第一道关。',
    items: [
      { l: '/news/th-boi-foreign-ownership-2026', t: '泰国 BOI 申请与外资持股', d: '哪些行业可 100% 控股、BOI 与 FBL 的区别。' },
      { l: '/solutions/manufacturing', t: '制造业出海建厂方案', d: '泰国建厂的准入、工厂许可与环评顺序。' },
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '东盟主要市场的时间与成本基线。' },
      { l: '/knowledge/overseas-bank-account-guide', t: '海外银行开户指南', d: '泰国账户与跨境收付的材料口径。' }
    ]
  },
  ae: {
    lead: '自由区还是大陆公司,先看业务场景再看税率。',
    items: [
      { l: '/news/uae-corporate-tax-freezone-2026', t: '阿联酋企业税与自由区优惠', d: '合格自由区人判定与 9% 企业税的适用边界。' },
      { l: '/solutions/identity-planning/ae', t: '迪拜身份规划', d: '黄金签证与公司居留的搭配方式。' },
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '中东与东盟市场的成本基线。' }
    ]
  },
  my: {
    lead: '马来西亚的 SSM 监管与本地董事要求,决定了落地节奏。',
    items: [
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '马来与其他东盟市场的成本与周期对照。' },
      { l: '/knowledge/cross-border-compliance', t: '跨境电商合规全方案', d: 'VAT、EPR、认证与商标的组合顺序。' },
      { l: '/knowledge/overseas-bank-account-guide', t: '海外银行开户指南', d: '马来账户的开户材料与银行选择。' }
    ]
  },
  uk: {
    lead: '英国公司的年审、VAT 与 EPR,是持续的合规成本。',
    items: [
      { l: '/services/vat', t: 'VAT 注册与申报', d: '英国 VAT 与欧盟 EPR 的注册门槛。' },
      { l: '/news/eu-epr-compliance-2026', t: '欧盟 EPR 注册与申报', d: '包装、电子电器与电池品类的合规要求。' },
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '英国与欧洲市场的成本基线。' }
    ]
  },
  jp: {
    lead: '日本公司的设立与后续申报,细节多、周期长。',
    items: [
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '日本与东亚市场的成本与周期对照。' },
      { l: '/knowledge/cross-border-compliance', t: '跨境电商合规全方案', d: '日本市场的认证与税务合规顺序。' },
      { l: '/knowledge/overseas-bank-account-guide', t: '海外银行开户指南', d: '日本法人账户的开户要点。' }
    ]
  },
  kr: {
    lead: '韩国开公司除了注册,还涉及签证与本地税务申报。',
    items: [
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '韩国与东亚市场的成本与周期对照。' },
      { l: '/knowledge/cross-border-compliance', t: '跨境电商合规全方案', d: '韩国市场的认证与税务合规顺序。' },
      { l: '/knowledge/overseas-bank-account-guide', t: '海外银行开户指南', d: '韩国法人账户的开户要点。' }
    ]
  },
  vn: {
    lead: '越南的 IRC/ERC 双证与外资准入,需要提前排期。',
    items: [
      { l: '/solutions/manufacturing', t: '制造业出海建厂方案', d: '越南建厂的土地、环评与工厂许可顺序。' },
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '越南与东盟市场的成本基线。' },
      { l: '/knowledge/cross-border-compliance', t: '跨境电商合规全方案', d: '越南市场的合规组合。' }
    ]
  },
  id: {
    lead: '印尼的 PT PMA 与 OSS 许可,决定了外资能做什么。',
    items: [
      { l: '/solutions/manufacturing', t: '制造业出海建厂方案', d: '印尼建厂的准入、土地与环评顺序。' },
      { l: '/knowledge/registration-cost-comparison', t: '各国注册费用与周期对比', d: '印尼与东盟市场的成本基线。' },
      { l: '/knowledge/overseas-bank-account-guide', t: '海外银行开户指南', d: '印尼账户与跨境收付的材料口径。' }
    ]
  },
  cayman: {
    lead: '离岸主体的经济实质与上市用途,是关键判断点。',
    items: [
      { l: '/knowledge/cayman-vs-bvi', t: '开曼 vs BVI 怎么选', d: '上市、经济实质与费用的横向对比。' },
      { l: '/knowledge/odi-vie-guide', t: 'ODI 备案与 VIE 架构指南', d: '红筹架构下离岸主体的搭建顺序。' },
      { l: '/services/offshore', t: '离岸公司注册服务', d: '开曼/BVI 的经济实质合规要求。' }
    ]
  },
  bvi: {
    lead: 'BVI 的合规重点是经济实质与年度费用。',
    items: [
      { l: '/knowledge/cayman-vs-bvi', t: '开曼 vs BVI 怎么选', d: '上市、经济实质与费用的横向对比。' },
      { l: '/knowledge/odi-vie-guide', t: 'ODI 备案与 VIE 架构指南', d: '红筹架构下离岸主体的搭建顺序。' },
      { l: '/services/offshore', t: '离岸公司注册服务', d: 'BVI 的经济实质申报与年费口径。' }
    ]
  }
};

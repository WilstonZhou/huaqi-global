// 华企环球全站页面生成公共库(模板 + Schema)
// 用法: const lib = require('./site-lib'); lib.buildPage({...})
'use strict';

var ORG = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://hq10000.com/#organization",
  "name": "华企环球（深圳）国际咨询有限公司",
  "alternateName": "华企环球国际咨询",
  "url": "https://hq10000.com/",
  "logo": "https://hq10000.com/favicon.svg",
  "foundingDate": "2012",
  "telephone": "+86-186-1090-2181",
  "email": "contact@hq10000.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "深圳市龙华区龙胜路与景龙建设路交汇处融创智汇大厦A座14层21",
    "addressLocality": "深圳",
    "addressRegion": "广东",
    "addressCountry": "CN"
  }
};

function schemaScript(obj) {
  return '<script type="application/ld+json">\n' + JSON.stringify(obj, null, 2) + '\n</script>';
}

function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map(function (it, i) {
      return { "@type": "ListItem", "position": i + 1, "name": it.name, "item": it.url };
    })
  };
}

function headerHtml(p) {
  return '<header class="site-header" id="site-header">\n' +
    '<div class="container">\n' +
    '  <a href="/" class="brand"><div class="brand-logo">华</div><div class="brand-text">华企环球<small>HUAQI GLOBAL</small></div></a>\n' +
    '  <nav class="nav-menu" id="navMenu">\n' +
    '    <div class="nav-item"><a class="nav-link" href="/">首页</a></div>\n' +
    '    <div class="nav-item"><a class="nav-link" href="' + p + 'services/company-registration">服务</a><div class="nav-dropdown">\n' +
    '      <a href="' + p + 'services/company-registration">海外公司注册</a><a href="' + p + 'country">热门国家注册</a><a href="' + p + 'services/bank-account">公司开户</a><a href="' + p + 'services/annual-review">公司年审</a><a href="' + p + 'services/audit">公司审计</a><a href="' + p + 'services/company-deregistration">公司注销/转让</a><a href="' + p + 'services/tax-planning">税务规划</a><a href="' + p + 'services/fund-planning">资金规划</a><a href="' + p + 'services/other-services">其他业务</a>\n' +
    '    </div></div>\n' +
    '    <div class="nav-item"><a class="nav-link" href="' + p + 'global-network">全球网络</a></div>\n' +
    '    <div class="nav-item"><a class="nav-link" href="' + p + 'ai-match">AI 智能匹配<span class="badge-new">NEW</span></a></div>\n' +
    '    <div class="nav-item"><a class="nav-link" href="' + p + 'delivery-tracking">交付追踪</a></div>\n' +
    '    <div class="nav-item"><a class="nav-link" href="' + p + 'knowledge/index">知识中心</a><div class="nav-dropdown">\n' +
    '      <a href="' + p + 'knowledge/singapore-registration-guide">新加坡注册指南</a><a href="' + p + 'knowledge/us-company-tax-policy">美国税收政策</a><a href="' + p + 'knowledge/cross-border-compliance">跨境电商合规</a><a href="' + p + 'news/index">政策动态</a>\n' +
    '    </div></div>\n' +
    '    <div class="nav-item"><a class="nav-link" href="' + p + 'about">关于我们</a></div>\n' +
    '    <div class="nav-item"><a class="nav-link" href="' + p + 'contact">联系我们</a></div>\n' +
    '  </nav>\n' +
    '  <div class="nav-cta">\n' +
    '    <div class="nav-phone">咨询热线<br><strong>186-1090-2181</strong></div>\n' +
    '    <a href="' + p + 'ai-match" class="btn btn-gold btn-sm">立即匹配</a>\n' +
    '  </div>\n' +
    '  <button class="nav-toggle" id="navToggle" aria-label="打开菜单" aria-expanded="false" aria-controls="navMenu"><span></span><span></span><span></span></button>\n' +
    '</div></header>';
}

function footerHtml(p) {
  return '<footer class="site-footer" id="site-footer">\n' +
    '<div class="container">\n' +
    '  <div class="footer-grid">\n' +
    '    <div class="footer-brand">\n' +
    '      <a href="/" class="brand"><div class="brand-logo">华</div><div class="brand-text c-white">华企环球<small class="c-white-50">HUAQI GLOBAL</small></div></a>\n' +
    '      <p>华企环球（深圳）国际咨询有限公司<br>前身鑫荣昇集团 2012 年创立,2018 年华企环球品牌独立。港深双总部 + 5 处海外分支,<strong class="c-gold">300+ 专业团队</strong>,马来西亚 SSM 持牌公司秘书机构。核心 60+ 国家/地区直办,服务网络覆盖 126 国,累计服务数万家客户企业。</p>\n' +
    '      <p>📞 186-1090-2181(微信同号)<br>✉️ contact@hq10000.com<br>📍 深圳市龙华区龙胜路与景龙建设路交汇处融创智汇大厦A座14层21</p>\n' +
    '      <div class="footer-divider">\n' +
    '        <div class="footer-label">🌐 全球办公地址</div>\n' +
    '        <div class="footer-addresses">\n' +
    '          🇨🇳 深圳:深圳市龙华区龙胜路与景龙建设路交汇处融创智汇大厦A座14层21<br>\n' +
    '          🇲🇾 马来西亚:SOHO Suites KLCC, 20 Jalan Perak, 50450 Kuala Lumpur, Malaysia<br>\n' +
    '          🇸🇬 新加坡:60 Paya Lebar Road #04 Paya Lebar Square, Singapore 409051<br>\n' +
    '          🇹🇭 泰国:泰国曼谷邦卡皮区华马县兰甘亨76巷50号79单元<br>\n' +
    '          🇻🇳 越南:越南胡志明市Go Vap区Cityland12号街7号\n' +
    '        </div>\n' +
    '      </div>\n' +
    '    </div>\n' +
    '    <div class="footer-col"><h4>服务范围</h4>\n' +
    '      <a href="' + p + 'services/company-registration">海外公司注册</a><a href="' + p + 'country">热门国家注册</a><a href="' + p + 'services/bank-account">公司开户</a><a href="' + p + 'services/annual-review">公司年审</a><a href="' + p + 'services/audit">公司审计</a><a href="' + p + 'services/company-deregistration">公司注销/转让</a><a href="' + p + 'services/tax-planning">税务规划</a><a href="' + p + 'services/fund-planning">资金规划</a><a href="' + p + 'services/other-services">其他业务</a>\n' +
    '    </div>\n' +
    '    <div class="footer-col"><h4>知识中心</h4>\n' +
    '      <a href="' + p + 'knowledge/singapore-registration-guide">2026 新加坡公司注册完全指南</a><a href="' + p + 'knowledge/us-company-tax-policy">美国公司税收政策解读</a><a href="' + p + 'knowledge/cross-border-compliance">跨境电商出海合规全方案</a><a href="' + p + 'knowledge/registration-cost-comparison">各国注册周期与费用对比</a><a href="' + p + 'news/index">政策动态</a>\n' +
    '    </div>\n' +
    '    <div class="footer-col"><h4>关于</h4>\n' +
    '      <a href="' + p + 'about">公司简介</a><a href="' + p + 'global-network">全球网络</a><a href="' + p + 'ai-match">AI 智能匹配</a><a href="' + p + 'delivery-tracking">交付追踪</a><a href="' + p + 'cases">客户案例</a><a href="' + p + 'contact">联系我们</a>\n' +
    '    </div>\n' +
    '  </div>\n' +
    '  <div class="footer-bottom">\n' +
    '    <div>Copyright © 2023-2026 华企环球（深圳）国际咨询有限公司 All Rights Reserved</div>\n' +
    '    <div class="footer-disclaimer">免责声明:本网站内容仅供参考,各国政策、办理周期与费用以最新官方信息及双方合同约定为准。如需专业意见,请联系我们的顾问团队。</div>\n' +
    '  </div>\n' +
    '</div></footer>';
}

function buildPage(opt) {
  var p = opt.prefix || '';
  var schemas = [ORG].concat(opt.schemas || []);
  var head = '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n' +
    '<meta charset="UTF-8">\n' +
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">\n' +
    '<title>' + opt.title + '</title>\n' +
    '<meta name="description" content="' + opt.desc + '">\n' +
    (opt.keywords ? '<meta name="keywords" content="' + opt.keywords + '">\n' : '') +
    '<link rel="icon" type="image/svg+xml" href="/favicon.svg">\n' +
    '<link rel="stylesheet" href="' + p + 'assets/css/main.css">\n\n' +
    '<!-- schema:start -->\n' + schemas.map(schemaScript).join('\n') + '\n<!-- schema:end -->\n' +
    '</head>\n<body>\n\n' +
    headerHtml(p) + '\n\n' +
    opt.body +
    '\n\n' + footerHtml(p) + '\n\n' +
    '<script src="' + p + 'assets/js/data.js"></script>\n' +
    '<script src="' + p + 'assets/js/icons.js"></script>\n' +
    '<script src="' + p + 'assets/js/main.js"></script>\n' +
    '</body>\n</html>\n';
  return head;
}

function hero(opt) {
  return '<section class="page-hero">\n  <div class="container">\n' +
    '    <div class="breadcrumb">' + opt.breadcrumb + '</div>\n' +
    '    <h1 class="page-title">' + opt.title + '</h1>\n' +
    '    <p class="page-subtitle">' + opt.subtitle + '</p>\n' +
    '    <div class="page-actions">\n' +
    '      <a href="' + opt.prefix + 'ai-match" class="btn btn-gold btn-lg">🤖 AI 智能匹配方案</a>\n' +
    '      <a class="btn btn-outline btn-lg btn-outline-light" href="' + opt.prefix + 'contact">联系出海顾问</a>\n' +
    '    </div>\n' +
    '  </div>\n</section>';
}

function statCards(items) {
  return '<div class="info-grid">' + items.map(function (it) {
    return '<div class="info-card"><div class="info-label">' + it.label + '</div><div class="info-value">' + it.value + '</div></div>';
  }).join('\n') + '</div>';
}

function contentBlock(h, paras, lists, ordered) {
  var html = '<div class="content-block">\n<h3>' + h + '</h3>\n';
  (paras || []).forEach(function (p) { html += '<p>' + p + '</p>\n'; });
  if (lists && lists.length) {
    html += '<' + (ordered ? 'ol' : 'ul') + '>\n' + lists.map(function (li) { return '<li>' + li + '</li>'; }).join('\n') + '\n</' + (ordered ? 'ol' : 'ul') + '>\n';
  }
  return html + '</div>';
}

function faqItems(faqs) {
  return faqs.map(function (f) {
    return '<div class="faq-item"><div class="faq-q">' + f.q + '</div><div class="faq-a"><p>' + f.a + '</p></div></div>';
  }).join('\n');
}

function ctaBanner(title, sub, prefix) {
  return '<section class="section pt-0">\n  <div class="container">\n    <div class="cta-banner">\n' +
    '      <h2>' + title + '</h2>\n      <p>' + sub + '</p>\n' +
    '      <div class="hero-actions">\n' +
    '        <a href="' + prefix + 'ai-match" class="btn btn-gold btn-lg">🤖 立即 AI 匹配</a>\n' +
    '        <a class="btn btn-outline btn-lg btn-outline-light" href="' + prefix + 'contact">转人工顾问</a>\n' +
    '      </div>\n    </div>\n  </div>\n</section>';
}

module.exports = {
  buildPage: buildPage,
  hero: hero,
  statCards: statCards,
  contentBlock: contentBlock,
  faqItems: faqItems,
  ctaBanner: ctaBanner,
  breadcrumbSchema: breadcrumbSchema,
  schemaScript: schemaScript
};

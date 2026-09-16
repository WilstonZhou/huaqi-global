// 生成竞品公开信息对比页:/compare/<slug>.html
// 合规边界:仅并列双方官网公开自述信息,不做优劣评价、不做负面定性。
// 用法: node scripts/generate-comparison-pages.js
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var data = require('./data-comparisons');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

var DISCLAIMER =
  '<div class="info-card" style="text-align:left;max-width:880px;margin:0 auto;">' +
  '<div class="info-label">信息来源与免责说明</div>' +
  '<p style="font-size:13px;color:var(--c-text-light);line-height:1.8;margin:8px 0 0;">' +
  '本页所载双方信息均来自各自官网公开自述,检索日期 ' + data.checked + ',<strong>未经第三方独立核验</strong>。' +
  '本页仅作客观信息并列,<strong>不对任何一方作优劣评价</strong>,亦不构成合作建议或服务承诺。' +
  '各公司业务范围、资质与服务口径可能随时调整,请以对方官网最新公示及其书面确认为准。' +
  '如本页信息与实际情况存在出入,欢迎指正,我们将及时更正。' +
  '</p></div>';

data.forEach(function (c) {
  var p = '../';
  var url = 'https://hq10000.com/compare/' + c.slug;

  var table = '<div style="overflow-x:auto;"><table class="pricing-table">' +
    '<thead><tr><th style="width:16%;">对比维度</th><th style="width:42%;">华企环球</th><th style="width:42%;">' + c.name + '</th></tr></thead><tbody>' +
    data.rows(c.theirs).map(function (r) {
      return '<tr><td><strong>' + r.dim + '</strong></td><td>' + r.us + '</td><td>' + r.them + '</td></tr>';
    }).join('') +
    '</tbody></table></div>';

  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / 公开信息对比 / 华企环球 vs ' + c.name,
    title: '华企环球 vs ' + c.name,
    subtitle: '双方官网公开信息并列呈现。' + c.name + '官网定位:' + c.positioning + '(' + c.domain + ')。'
  });

  body += '\n\n<!-- 免责说明 -->\n<section class="section section-soft">\n  <div class="container">\n    ' + DISCLAIMER + '\n  </div>\n</section>';

  body += '\n\n<!-- 背景 -->\n<section class="section">\n  <div class="container container-sm">\n    ' + lib.contentBlock('关于本次对比', [c.intro]) + '\n  </div>\n</section>';

  body += '\n\n<!-- 对比表 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">SIDE BY SIDE</span><h2 class="section-title">公开信息并列对比</h2><p class="section-desc">下表两侧信息分别来自华企环球官网与 ' + c.name + ' 官网自述,仅作事实罗列。</p></div>\n    ' + table + '\n  </div>\n</section>';

  var criteria = [
    { h: '先看覆盖区域是否匹配', p: '如果目标市场集中在少数国家,重点看该国的直办能力、本地团队与后续年审审计的持续性;如果需要在多国同步铺开,则更看重网络覆盖与协同效率。' },
    { h: '再看服务深度是否覆盖你的链路', p: '注册只是起点。开户、年审、审计、税务(VAT/EPR)、ODI/VIE 架构是否能在同一家完成,直接决定后续的沟通成本与责任边界。' },
    { h: '确认资质与交付方式', p: '涉及持牌业务的(如公司秘书、税务代表),核验其牌照类型与编号;并确认交付方式、进度可见性与材料交接流程是否清晰。' },
    { h: '以自己的场景为准', p: '不同服务商的服务重心不同,没有普适的最优解。建议把上述维度按你自己的业务优先级排序,再逐项对照上方表格判断。' }
  ];
  body += '\n\n<!-- 选择建议 -->\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">HOW TO CHOOSE</span><h2 class="section-title">选择出海服务商时可以看这几点</h2><p class="section-desc">以下为通用判断维度,不针对任何特定服务商。</p></div>\n    ' +
    '<div class="features-grid">' + criteria.map(function (x) {
      return '<div class="feature-card"><div class="feature-icon">✓</div><div class="feature-title">' + x.h + '</div><div class="feature-desc">' + x.p + '</div></div>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  var others = data.filter(function (o) { return o.slug !== c.slug; });
  body += '\n\n<!-- 其他对比 -->\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">MORE COMPARISONS</span><h2 class="section-title">其他公开信息对比</h2></div>\n    <div class="features-grid">' +
    others.map(function (o) {
      return '<a class="feature-card" href="' + o.slug + '" style="text-decoration:none;"><div class="feature-icon">⚖️</div><div class="feature-title">华企环球 vs ' + o.name + '</div><div class="feature-desc">' + o.positioning + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('想按自己的场景做一次对照?', 'AI 智能匹配 3 分钟生成初步方案,或由顾问逐项说明我们的服务范围与边界', p);

  write('compare/' + c.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: url,
    title: c.metaTitle,
    desc: c.metaDesc,
    keywords: '华企环球,' + c.name + ',' + c.domain + ',出海服务商对比,海外公司注册服务商',
    schemas: [
      lib.breadcrumbSchema([
        { name: '首页', url: 'https://hq10000.com' },
        { name: '公开信息对比', url: 'https://hq10000.com/about' },
        { name: '华企环球 vs ' + c.name, url: url }
      ])
    ],
    body: body
  }));
});

console.log('comparison pages done');

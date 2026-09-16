// Generate the cost & timeline lookup tool: /tools/cost-calculator
// Honesty constraint: figures come ONLY from what the site already publishes
// (knowledge/registration-cost-comparison.html government-fee column, and
// regulator/type/period from data-countries.js). Service fees are shown as
// "custom quote" — no invented pricing.
// 用法: node scripts/generate-tools.js
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var countries = require('./data-countries');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

// 站上已公布的政府规费参考(未公布的用中性措辞,不臆造)
var GOV_FEE = {
  sg: '核名 S$15 + 注册 S$300',
  us: '各州不同(特拉华 / 加州等)',
  my: '按注册资本档位',
  th: '按注册资本比例',
  uk: '约 £50',
  hk: '约 HKD 1,720 + 商业登记费',
  jp: '登记许可税按资本金',
  kr: '登记税按资本金',
  ae: '以官方最新规定为准',
  vn: '以官方最新规定为准',
  id: '以官方最新规定为准'
};

var p = '../';
var rows = countries.map(function (c) {
  return {
    slug: c.slug, name: c.name, flag: c.flag, regulator: c.regulator,
    type: c.type, period: c.period, fee: GOV_FEE[c.slug] || '以官方最新规定为准'
  };
});

/* ---------- interactive tool ---------- */
var options = rows.map(function (r) {
  return '<option value="' + r.slug + '">' + r.flag + ' ' + r.name + '</option>';
}).join('');

var tool =
  '<div class="container container-sm">\n' +
  '  <div class="info-card p-24" style="text-align:left;">\n' +
  '    <label for="cc-country" style="display:block;font-size:14px;font-weight:700;color:var(--c-primary);margin-bottom:10px;">选择注册地</label>\n' +
  '    <select id="cc-country" style="width:100%;padding:12px 14px;border:1px solid var(--c-border);border-radius:10px;font-size:15px;background:#fff;">' + options + '</select>\n' +
  '    <div id="cc-result" style="margin-top:20px;"></div>\n' +
  '  </div>\n' +
  '</div>';

var script =
  '<script>\n' +
  '(function () {\n' +
  '  var DATA = ' + JSON.stringify(rows.map(function (r) { return { slug: r.slug, name: r.name, flag: r.flag, regulator: r.regulator, type: r.type, period: r.period, fee: r.fee }; })) + ';\n' +
  '  var sel = document.getElementById("cc-country");\n' +
  '  var out = document.getElementById("cc-result");\n' +
  '  if (!sel || !out) return;\n' +
  '  function row(label, value) {\n' +
  '    return \'<div style="display:flex;gap:12px;padding:9px 0;border-bottom:1px solid var(--c-border);"><div style="flex:0 0 96px;font-size:13px;color:var(--c-text-light);">\' + label + \'</div><div style="flex:1;font-size:14px;color:var(--c-primary);font-weight:600;">\' + value + \'</div></div>\';\n' +
  '  }\n' +
  '  function render(slug) {\n' +
  '    var d = null;\n' +
  '    for (var i = 0; i < DATA.length; i++) if (DATA[i].slug === slug) d = DATA[i];\n' +
  '    if (!d) { out.innerHTML = ""; return; }\n' +
  '    out.innerHTML =\n' +
  '      \'<div style="font-size:16px;font-weight:700;color:var(--c-primary);margin-bottom:10px;">\' + d.flag + " " + d.name + \'公司注册</div>\' +\n' +
  '      row("监管机构", d.regulator) +\n' +
  '      row("公司类型", d.type) +\n' +
  '      row("参考周期", d.period) +\n' +
  '      row("政府规费参考", d.fee) +\n' +
  '      row("服务费", "定制报价") +\n' +
  '      \'<div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;"><a class="btn btn-gold btn-sm" href="\' + \'../country/\' + d.slug + \'">查看该国家完整指南 →</a><a class="btn btn-outline btn-sm" href="../contact">获取定制报价</a></div>\';\n' +
  '  }\n' +
  '  sel.addEventListener("change", function () { render(sel.value); });\n' +
  '  render(sel.value);\n' +
  '})();\n' +
  '</script>';

/* ---------- full table ---------- */
var table = '<div style="overflow-x:auto;"><table class="pricing-table"><thead><tr>' +
  '<th>注册地</th><th>监管机构</th><th>公司类型</th><th>参考周期</th><th>政府规费参考</th><th>服务费</th></tr></thead><tbody>' +
  rows.map(function (r) {
    return '<tr><td><strong>' + r.flag + ' ' + r.name + '</strong></td><td>' + r.regulator + '</td><td>' + r.type + '</td><td>' + r.period + '</td><td>' + r.fee + '</td><td>定制报价</td></tr>';
  }).join('') + '</tbody></table></div>';

var body = lib.hero({
  prefix: p,
  breadcrumb: '<a href="/">首页</a> / <a href="' + p + 'services/fees">费用与周期</a> / 成本速查',
  title: '🧮 出海成本与周期速查',
  subtitle: '选一个注册地,立刻看到监管机构、公司类型、参考周期与政府规费参考。政府规费为官方公布口径的参考值;服务费因业务复杂度而异,统一采用定制报价。'
});

body += '\n\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">QUICK LOOKUP</span><h2 class="section-title">按注册地速查</h2></div>\n    ' + tool + '\n  </div>\n</section>';

body += '\n\n<section class="section">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">FULL TABLE</span><h2 class="section-title">全部注册地对照表</h2><p class="section-desc">下表为各注册地的监管机构、公司类型、参考周期与政府规费参考,服务费统一为定制报价。</p></div>\n    ' + table + '\n  </div>\n</section>';

body += '\n\n<section class="section section-soft">\n  <div class="container container-sm">\n    ' + lib.contentBlock('为什么服务费不做固定标价', [
      '公司注册的实际工作量取决于股权结构、是否涉及多层持股、经营范围是否需要额外牌照、是否需要配套开户与年审等,差异很大。把服务费做成一个固定数字,通常意味着要么低估了复杂度、要么把成本转嫁到后续环节。',
      '所以本站对服务费一律采用<strong>定制报价</strong>:先把你的业务场景、目标市场与配套需求确认清楚,再给出确定性报价,并在交付前把包含项与不包含项写清楚。'
    ]) + '\n  </div>\n</section>';

body += '\n\n<section class="section">\n  <div class="container container-sm">\n    <div class="info-card p-24" style="text-align:left;">\n      <div class="info-label">数据口径与免责说明</div>\n      <p style="font-size:13px;color:var(--c-text-light);line-height:1.8;margin:8px 0 0;">政府规费参考值来自各国官方公布口径与本站既有整理,**可能随官方调整而变化**;部分注册地(如按注册资本计费的地区)无法给出单一数字,已标注计费口径。服务费不在此页定价。所有数字仅供参考,<strong>以最新官方信息与双方合同约定为准</strong>。</p>\n    </div>\n  </div>\n</section>';

body += '\n\n' + lib.ctaBanner('想知道你这个场景的实际报价?', '把目标市场、业务类型与配套需求告诉我们,顾问会给出含项明确的定制报价', p);

body += '\n\n' + script;

write('tools/cost-calculator.html', lib.buildPage({
  prefix: p,
  canonical: 'https://hq10000.com/tools/cost-calculator',
  title: '出海成本与周期速查工具 | 各国注册规费参考 | 华企环球',
  desc: '选择注册地即可查看监管机构、公司类型、参考周期与政府规费参考。覆盖新加坡、香港、美国、英国、日本、韩国、马来西亚、泰国、迪拜、越南、印尼等市场。服务费采用定制报价。',
  keywords: '海外公司注册费用,公司注册周期,注册规费,出海成本,华企环球',
  schemas: [
    lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '费用与周期', url: 'https://hq10000.com/services/fees' },
      { name: '成本速查', url: 'https://hq10000.com/tools/cost-calculator' }
    ])
  ],
  body: body
}));

console.log('tools done');

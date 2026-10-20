// 生成 8 个案例分页:/cases/{slug}.html —— 每页 10 个脱敏案例 + 检查清单 + FAQ
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var data = require('./case-data');

var ROOT = path.join(__dirname, '..');
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

var CN = { '开户': '银行开户', '年审': '年审', '审计报税': '审计与报税', '商标': '商标',
           '注册': '公司注册', '架构': '架构与资金', '注销': '公司注销', '账户维护': '账户维护' };

data.groups.forEach(function (g, gi) {
  var p = '../';
  var body = lib.hero({
    prefix: p,
    breadcrumb: '<a href="/">首页</a> / <a href="/cases">客户案例</a> / ' + CN[g.key] + '案例',
    title: CN[g.key] + '案例:' + g.items.length + ' 个脱敏实例',
    subtitle: g.desc
  });
  body += lib.answerBlock(g.answer);

  body += '\n\n<!-- 案例列表 -->\n<section class="section">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">' + (g.en || 'CASES') + '</span><h2 class="section-title">' + CN[g.key] + ':' + g.items.length + ' 个脱敏案例</h2>' +
    '<p class="section-desc">每条包含情形、处理、结果与提示;信息已脱敏,不构成对办理结果的承诺。</p></div>\n' +
    '    <div class="features-grid grid-2">' +
    g.items.map(function (c) {
      return '<div class="case-card">' +
        '<div style="margin-bottom:8px;"><span class="case-tag">' + c.tag + '</span></div>' +
        '<div class="card-title">' + c.title + '</div>' +
        '<div class="card-text mb-8"><strong class="c-primary">情形:</strong>' + c.pain + '</div>' +
        '<div class="card-text mb-8"><strong class="c-primary">处理:</strong>' + c.action + '</div>' +
        '<div class="card-text mb-8"><strong class="c-primary">结果:</strong>' + c.result + '</div>' +
        '<div class="fs-13" style="border-top:1px dashed var(--c-border);padding-top:10px;color:var(--c-text-light);"><strong>提示:</strong>' + c.tip + '</div>' +
        '</div>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  body += lib.hubSections([{
    eyebrow: 'CHECKLIST',
    title: CN[g.key] + '前要确认的事',
    desc: '把上面案例里反复出现的失败点,压缩成一份可以逐项打勾的清单。',
    list: g.checklist
  }]);

  body += '\n\n<!-- FAQ -->\n<section class="section section-soft">\n  <div class="container container-sm">\n' +
    '    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">' + CN[g.key] + '常见问题</h2></div>\n' +
    '    <div>' + lib.faqItems(g.faqs) + '</div>\n  </div>\n</section>';

  // 其他分页导航
  body += '\n\n<!-- 其他分类 -->\n<section class="section">\n  <div class="container">\n' +
    '    <div class="section-header"><span class="section-eyebrow">MORE CASES</span><h2 class="section-title">其他场景的案例</h2></div>\n' +
    '    <div class="features-grid">' +
    data.groups.filter(function (x) { return x.key !== g.key; }).map(function (x) {
      return '<a class="feature-card" href="' + p + 'cases/' + x.slug + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + CN[x.key] + '案例</div><div class="feature-desc">' + x.items.length + ' 个脱敏案例 · ' + x.title + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('有类似情况?让顾问对照案例给判断', '把您的情况告诉 AI 或顾问,3 分钟得到路径参考', p);

  write('cases/' + g.slug + '.html', lib.buildPage({
    prefix: p,
    canonical: 'https://hq10000.com/cases/' + g.slug,
    title: CN[g.key] + '案例:' + g.items.length + ' 个脱敏实例与处理路径 | 华企环球',
    desc: '华企环球' + CN[g.key] + '案例库:' + g.items.length + ' 个脱敏实例,每条写明情形、处理、结果与提示,并附' + CN[g.key] + '前的检查清单与常见问题。',
    keywords: CN[g.key] + '案例,出海案例,华企环球案例,' + g.key,
    schemas: [lib.faqSchema(g.faqs),
      lib.breadcrumbSchema([
        { name: '首页', url: 'https://hq10000.com' },
        { name: '客户案例', url: 'https://hq10000.com/cases' },
        { name: CN[g.key] + '案例', url: 'https://hq10000.com/cases/' + g.slug }
      ])],
    body: body
  }));
});

console.log('case pages done: ' + data.groups.length);

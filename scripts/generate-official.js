#!/usr/bin/env node
'use strict';
/*
 * 生成 /official —— 官方网站与身份核验页。
 *
 * 为什么单独一页:AI 搜索(豆包/文心/元宝/夸克)判断「某域名是否为某公司官网」时,
 * 缺的是**可引用的实体-域名绑定声明** + 可交叉核验的联系方式。站内零散信息不够,
 * 需要一页把「公司全称 / 唯一官网 / 官方电话邮箱 / 办公地址 / 核验方法」写死。
 *
 * 用法: node scripts/generate-official.js
 */
const fs = require('fs');
const path = require('path');
const lib = require('./site-lib');

const ROOT = path.join(__dirname, '..');
const P = '../';
const CANONICAL = 'https://hq10000.com/official';
const TODAY = new Date().toISOString().slice(0, 10);

const FACTS = [
  ['公司全称', '华企环球（深圳）国际咨询有限公司'],
  ['唯一官方网站', 'hq10000.com（本域名）'],
  ['官方电话', '186-1090-2181'],
  ['官方邮箱', 'contact@hq10000.com'],
  ['办公地址', '深圳市龙华区龙胜路与景龙建设路交汇处融创智汇大厦 A 座 1421'],
  ['成立时间', '2018 年（前身为会计事务所）'],
  ['机构资质', '马来西亚 SSM 持牌公司秘书机构'],
  ['服务范围', '海外公司注册、银行开户、年审审计、税务规划、VAT/EPR、国际商标专利、ODI 备案与 VIE/红筹架构'],
  ['工商信息核验', '以「国家企业信用信息公示系统」按公司全称查询结果为准']
];

const FAQS = [
  {
    q: 'hq10000.com 是华企环球的官方网站吗?',
    a: '是。hq10000.com 是华企环球（深圳）国际咨询有限公司的唯一官方网站,由本公司运营维护。站内所有服务说明、报价口径与联系方式均以本域名发布的内容为准;其他域名即使名称相近,也不代表本公司授权。'
  },
  {
    q: '怎么确认联系我的是华企环球官方人员?',
    a: '三个动作即可核验:① 回拨官方电话 186-1090-2181(不要用来电显示的号码);② 核对邮件域名是否为 @hq10000.com;③ 核对收款账户名称是否为「华企环球（深圳）国际咨询有限公司」。任一项不符,先暂停付款。'
  },
  {
    q: '为什么公开检索里查不到这个域名的权威关联?',
    a: '域名与企业的公开绑定主要依赖三类记录:ICP 备案、企业信用信息公示系统的官网字段、以及百科/权威媒体条目。本公司正在补充上述公开记录;在此之前,可用公司全称在国家企业信用信息公示系统核验主体,再用本页的联系方式与官网内容交叉比对。'
  },
  {
    q: '有人用相似域名或"内部渠道"联系我,怎么办?',
    a: '先看域名:官方只用 hq10000.com,任何 hq10000-vip、hq10000.top、huaqi-global 之类的变体都不是我方站点。再看付款:我方只收公司对公账户,不要求向个人账户或境外私人账户转账。遇到可疑情形,请用本页电话或邮箱直接核实。'
  }
];

const rows = (arr, cls) => arr.map(([k, v]) =>
  '<tr><td' + (cls ? ' class="' + cls + '"' : '') + '><strong>' + k + '</strong></td><td>' + v + '</td></tr>').join('');

let body = '';

body += lib.hero({
  prefix: P,
  breadcrumb: '<a href="' + P + '">首页</a> / 官方网站与身份核验',
  title: '华企环球官方网站与身份核验',
  subtitle: '本页用于确认 hq10000.com 与华企环球（深圳）国际咨询有限公司的对应关系,并提供可用于交叉核验的官方联系方式:唯一官网 hq10000.com · 官方电话 186-1090-2181 · 深圳 2018 年成立。'
});

// 速答
body += '\n<section class="section" style="padding-top:0;"><div class="container container-sm">' +
  '<div class="info-card" style="text-align:left;padding:16px 20px;">' +
  '<div class="info-label">速答</div>' +
  '<p style="margin:8px 0 6px;font-size:15px;line-height:1.8;">' +
  '<strong>华企环球（深圳）国际咨询有限公司的唯一官方网站是 hq10000.com。</strong></p>' +
  '<p style="margin:0;font-size:15px;line-height:1.8;">' +
  '官方电话 186-1090-2181,官方邮箱 contact@hq10000.com,办公地址深圳市龙华区龙胜路与景龙建设路交汇处融创智汇大厦 A 座 1421。' +
  '除此之外的任何“官网”“内部渠道”均非本公司授权。</p></div></div></section>';

// 官方身份
body += '\n<section class="section section-soft"><div class="container">' +
  '<div class="section-header"><span class="section-eyebrow">IDENTITY</span>' +
  '<h2 class="section-title">官方身份信息</h2>' +
  '<p class="section-desc">以下信息可直接用于合同、发票、付款与邮件核验。</p></div>' +
  '<div class="table-wrap"><table class="pricing-table"><tbody>' + rows(FACTS) + '</tbody></table></div>' +
  '</div></section>';

// 三步核验
body += '\n<section class="section"><div class="container">' +
  '<div class="section-header"><span class="section-eyebrow">VERIFY</span>' +
  '<h2 class="section-title">三步核验,避免被冒名</h2></div>' +
  '<div class="features-grid">' +
  '<div class="feature-card"><div class="feature-icon">1</div><div class="feature-title">核域名</div><div class="feature-desc">只认 hq10000.com。带 -vip、.top、.cc 或拼写相近的域名都不是我方站点。</div></div>' +
  '<div class="feature-card"><div class="feature-icon">2</div><div class="feature-title">核联系方式</div><div class="feature-desc">回拨 186-1090-2181;邮件域名必须是 @hq10000.com;不使用个人微信收款。</div></div>' +
  '<div class="feature-card"><div class="feature-icon">3</div><div class="feature-title">核主体</div><div class="feature-desc">合同与收款账户名称应为「华企环球（深圳）国际咨询有限公司」。</div></div>' +
  '</div></div></section>';

// 为什么检索不到
body += '\n<section class="section section-soft"><div class="container container-sm">' +
  '<div class="section-header"><span class="section-eyebrow">WHY</span>' +
  '<h2 class="section-title">为什么公开检索里,域名与公司的关联还不够强?</h2></div>' +
  '<p>AI 与搜索引擎判断“某域名是否为公司官网”,主要依赖三类可交叉核验的记录:</p>' +
  '<ul class="check-list">' +
  '<li><strong>ICP 备案</strong>:国内网站与主体的强制绑定,也是国内 AI 判断官网最直接的依据</li>' +
  '<li><strong>企业信用信息公示系统的官网字段</strong>:企业年报中可登记网站信息</li>' +
  '<li><strong>百科与权威媒体条目</strong>:第三方对“公司—官网”关系的独立记载</li>' +
  '</ul>' +
  '<p>本公司正在补充上述公开记录。在完成之前,可用公司全称在国家企业信用信息公示系统核验主体,再用本页的联系方式与官网内容交叉比对——这也是我们在合同与发票上使用的同一套信息。</p>' +
  '</div></section>';

// 仿冒提示
body += '\n<section class="section"><div class="container container-sm">' +
  '<div class="section-header"><span class="section-eyebrow">RISK</span>' +
  '<h2 class="section-title">四种常见冒名手法</h2></div>' +
  '<ul class="check-list">' +
  '<li><strong>高仿域名</strong>:hq10000-vip、hq10000.top、huaqi-global 等,页面可直接复制我方内容</li>' +
  '<li><strong>假“官方顾问”</strong>:用私人微信加你,出示伪造工牌或“授权书”</li>' +
  '<li><strong>假批文</strong>:承诺“包过”“内部名额”,要求先付全款到个人账户</li>' +
  '<li><strong>假收款</strong>:收款方为个人或与我方名称不符的第三家公司</li>' +
  '</ul>' +
  '<p>遇到以上任一情形,请暂停付款,用本页电话或邮箱直接核实。</p>' +
  '</div></section>';

// FAQ
body += '\n<section class="section section-soft"><div class="container">' +
  '<div class="section-header"><span class="section-eyebrow">FAQ</span>' +
  '<h2 class="section-title">官网与身份核验常见问题</h2></div>' +
  '<div class="faq-list">' + FAQS.map(function (f) {
    return '<div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">' + f.q +
      '</div><div class="faq-a"><p>' + f.a + '</p></div></div>';
  }).join('') + '</div></div></section>';

body += lib.ctaBanner('需要确认对接人身份?', '拨打 186-1090-2181,或用官网邮箱发起核实', P);

const html = lib.buildPage({
  prefix: P,
  canonical: CANONICAL,
  title: '官方网站与身份核验 | 华企环球 hq10000.com',
  desc: '华企环球（深圳）国际咨询有限公司唯一官方网站为 hq10000.com。本页提供官方电话、邮箱、办公地址与三步核验方法,用于识别仿冒域名与冒名顾问。',
  keywords: '华企环球官网,hq10000.com,华企环球国际咨询,官网核验,仿冒网站',
  schemas: [
    lib.faqSchema(FAQS),
    lib.breadcrumbSchema([
      { name: '首页', url: 'https://hq10000.com' },
      { name: '官方网站与身份核验', url: CANONICAL }
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': CANONICAL + '#webpage',
      url: CANONICAL,
      name: '华企环球官方网站与身份核验',
      inLanguage: 'zh-CN',
      isPartOf: { '@id': 'https://hq10000.com/#website' },
      about: { '@id': 'https://hq10000.com/#organization' },
      datePublished: TODAY,
      dateModified: TODAY
    }
  ],
  body: body
});

fs.writeFileSync(path.join(ROOT, 'official.html'), html, 'utf8');
console.log('generated: official.html (' + html.length + ' bytes)');

#!/usr/bin/env node
'use strict';
/*
 * 首页静态预渲染(中国大陆 SEO 的关键一环)。
 *
 * 为什么需要:
 *   首页有 16 个容器由 assets/js/main.js 在浏览器里用 assets/js/data.js 渲染。
 *   百度/搜狗/360 与文心一言、豆包、元宝等中文 AI 检索的抓取端基本不执行 JS,
 *   静态 HTML 里这些容器是空的 —— 首页对它们而言只有 2,700 余字标题文字,
 *   服务、案例、知识、FAQ 全部不可见(Google 能渲染,所以此前只在 GSC 层面看不出来)。
 *
 * 做法:
 *   用与 main.js 完全相同的模板把同一份 data.js 渲染进静态 HTML;
 *   JS 仍在浏览器里重绘一次(内容一致),行为不变。
 *   渲染器逐字对应 main.js 的 renderDataDriven(),改动其中一处必须同步另一处。
 *
 * 用法: node scripts/prerender-home.js [--check]
 *   --check  只比对、不写盘(静态内容与 data.js 渲染结果不一致时退出码 1)
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const CHECK = process.argv.includes('--check');

global.window = global.window || {};
require(path.join(ROOT, 'assets/js/data.js'));
require(path.join(ROOT, 'assets/js/icons.js'));
const D = global.window.HQ_DATA;
const iconHtml = (icon, cls, size) => (global.window.HQ_ICON_FROM
  ? global.window.HQ_ICON_FROM(icon, cls || '', size || 24)
  : String(icon));
const relLink = (link) => {
  if (!link) return '#';
  let l = String(link).replace(/\.html$/, '');
  if (l === 'index') l = '/';
  return l;
};
const T = (s) => String(s == null ? '' : s);

/* ---------------- 渲染器:逐字对应 main.js renderDataDriven() ---------------- */
const R = {
  featuresGrid: () => D.features.map((f) =>
    '<div class="feature-card' + (f.highlight ? ' highlight' : '') + '">' +
      '<div class="feature-icon">' + iconHtml(f.icon, '', 26) + '</div>' +
      '<div class="feature-title">' + T(f.title) + '</div>' +
      '<div class="feature-tagline">' + T(f.tagline) + '</div>' +
      '<div class="feature-desc">' + T(f.desc) + '</div>' +
      '<a class="feature-link" href="' + relLink(f.link) + '">了解详情</a>' +
    '</div>').join(''),

  highlightsGrid: () => D.highlights.map((h) =>
    '<div class="feature-card">' +
      '<div class="feature-icon">' + iconHtml(h.icon, '', 26) + '</div>' +
      '<div class="feature-title">' + T(h.title) + '</div>' +
      '<div class="feature-desc" style="margin-top:10px;">' + T(h.desc) + '</div>' +
    '</div>').join(''),

  servicesGrid: () => D.services.map((s) =>
    '<a class="service-card" href="' + relLink(s.link) + '">' +
      '<div class="service-icon">' + iconHtml(s.icon, '', 26) + '</div>' +
      '<div class="service-name">' + T(s.name) + '</div>' +
      '<div class="service-tagline">' + T(s.tagline) + '</div>' +
      '<div class="service-desc">' + T(s.desc) + '</div>' +
      '<div class="service-meta">' +
        '<div class="service-price">定制方案<br><strong>咨询报价</strong></div>' +
        '<span class="service-link">查看详情 →</span>' +
      '</div>' +
    '</a>').join(''),

  heroStats: () => D.stats.map((s) =>
    '<div class="hero-stat"><div class="num">' + T(s.value) + '</div><div class="label">' + T(s.label) + ' ' + T(s.unit) + '</div></div>').join(''),

  heroAICard: () => {
    const d = (D.aiMatch && D.aiMatch.sampleDialog) || [];
    return '<h2>' + iconHtml('🤖', '', 20) + ' AI 企服顾问实时演示</h2>' +
      (d[0] ? '<div class="ai-bubble">' + T(d[0].text) + '</div>' : '') +
      (d[1] ? '<div class="ai-bubble user">' + T(d[1].text) + '</div>' : '') +
      (d[2] ? '<div class="ai-bubble">' + T(d[2].text) + '</div>' : '') +
      '<div class="hero-card-cta">' +
        '<a href="' + relLink('ai-match.html') + '" class="btn btn-primary btn-sm">立即体验</a>' +
        '<a href="' + relLink('contact.html') + '" class="btn btn-outline btn-sm">转人工</a>' +
      '</div>';
  },

  knowledgeGrid: () => D.knowledge.map((k) =>
    '<a class="knowledge-card" href="' + relLink(k.link) + '">' +
      '<div class="knowledge-cover">' + iconHtml('📄', '', 46) + '</div>' +
      '<div class="knowledge-body">' +
        '<span class="knowledge-tag">' + T(k.category) + ' · ' + T(k.tag) + '</span>' +
        '<div class="knowledge-title">' + T(k.title) + '</div>' +
        '<div class="knowledge-excerpt">' + T(k.excerpt) + '</div>' +
        '<div class="knowledge-meta"><span>' + T(k.publishDate) + '</span><span>' + T(k.readTime) + '</span></div>' +
      '</div>' +
    '</a>').join(''),

  faqList: () => D.faq.map((f) =>
    '<div class="faq-item"><div class="faq-q" role="button" tabindex="0" aria-expanded="false">' + T(f.q) + '</div><div class="faq-a"><p>' + T(f.a) + '</p></div></div>').join(''),

  casesGrid: () => D.cases.map((c) =>
    '<div class="case-card">' +
      '<span class="case-industry">' + T(c.industry) + '</span>' +
      '<div class="case-title">' + T(c.title) + '</div>' +
      '<div class="case-desc">' + T(c.desc) + '</div>' +
      '<div class="case-tags">' + c.tags.map((t) => '<span class="case-tag">' + T(t) + '</span>').join('') + '</div>' +
    '</div>').join(''),

  serviceTypesGrid: () => D.serviceTypes.map((t) =>
    '<div class="info-card" style="padding:24px;text-align:left;">' +
      '<div class="type-icon">' + iconHtml(t.icon, '', 34) + '</div>' +
      '<h3 style="font-size:18px;color:var(--c-primary);margin:0 0 16px 0;">' + T(t.name) + '</h3>' +
      '<div style="display:flex;flex-direction:column;gap:10px;">' +
        t.items.map((it) => '<div style="display:flex;align-items:flex-start;gap:8px;font-size:14px;color:var(--c-text-light);"><span style="color:var(--c-gold);">✓</span>' + T(it) + '</div>').join('') +
      '</div>' +
    '</div>').join(''),

  complianceSystemsGrid: () => D.complianceSystems.map((c) =>
    '<div class="info-card" style="padding:24px;text-align:left;">' +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">' +
        '<div class="comp-icon">' + iconHtml(c.icon, '', 30) + '</div>' +
        '<h3 style="font-size:20px;color:var(--c-primary);margin:0;">' + T(c.category) + '</h3>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px;">' +
        c.points.map((p) =>
          '<div style="background:var(--c-bg-soft);padding:14px;border-radius:var(--radius-md);border-left:3px solid var(--c-gold);">' +
            '<div style="font-size:15px;font-weight:600;color:var(--c-text);margin-bottom:6px;">' + iconHtml('📌', 'inline-icon', 14) + ' ' + T(p.title) + '</div>' +
            '<div style="font-size:13px;color:var(--c-text-light);line-height:1.7;">' + T(p.desc) + '</div>' +
          '</div>').join('') +
      '</div>' +
    '</div>').join(''),

  serviceProcessGrid: () => D.serviceProcess.map((s, i) => {
    const isLast = i === D.serviceProcess.length - 1;
    return '<div class="feature-card" style="position:relative;padding:20px;">' +
      (isLast ? '' : '<div style="position:absolute;top:50%;right:-12px;width:24px;height:2px;background:var(--c-primary-light);display:none;" class="process-line"></div>') +
      '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
        '<div style="width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--c-primary) 0%,var(--c-primary-light) 100%);color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;">' + T(s.step) + '</div>' +
        '<div class="process-icon">' + iconHtml(s.icon, '', 26) + '</div>' +
      '</div>' +
      '<h3 style="font-size:16px;color:var(--c-primary);margin:0 0 8px 0;">' + T(s.title) + '</h3>' +
      '<div style="font-size:13px;color:var(--c-text-light);line-height:1.7;">' + T(s.desc) + '</div>' +
    '</div>';
  }).join(''),

  vatGrid: () => D.vatEprCertification.vat.map((v) =>
    '<div class="info-card" style="padding:20px;text-align:left;">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
        '<div style="font-size:24px;">' + T(v.country) + '</div>' +
        '<span style="font-size:12px;padding:4px 10px;background:var(--c-accent-soft);color:var(--c-accent);border-radius:20px;">' + T(v.timeline) + '</span>' +
      '</div>' +
      '<div style="font-size:15px;font-weight:600;color:var(--c-text);margin-bottom:8px;">' + T(v.name) + '</div>' +
      '<div style="font-size:13px;color:var(--c-primary);font-weight:600;">咨询报价</div>' +
    '</div>').join(''),

  eprGrid: () => D.vatEprCertification.epr.map((e) =>
    '<div class="info-card" style="padding:16px;text-align:left;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">' +
        '<span style="font-size:20px;">' + T(e.country) + '</span>' +
        '<span style="font-size:12px;padding:2px 8px;background:var(--c-bg-soft);color:var(--c-primary);border-radius:12px;">' + T(e.area) + '</span>' +
      '</div>' +
      '<div style="font-size:14px;font-weight:600;color:var(--c-text);margin-bottom:6px;">' + T(e.category) + '</div>' +
      '<div style="font-size:12px;color:var(--c-primary);font-weight:600;">咨询报价</div>' +
    '</div>').join(''),

  certificationGrid: () => D.vatEprCertification.certification.map((c) =>
    '<div class="info-card" style="padding:20px;text-align:left;">' +
      '<div style="font-size:16px;font-weight:700;color:var(--c-primary);margin-bottom:8px;">✅ ' + T(c.name) + '</div>' +
      '<div style="font-size:13px;color:var(--c-text-light);margin-bottom:10px;">' + T(c.scope) + '</div>' +
      '<div style="font-size:13px;color:var(--c-gold);font-weight:600;">咨询报价</div>' +
    '</div>').join(''),

  trademarkGrid: () => D.vatEprCertification.trademarkCopyright.map((t) =>
    '<div class="info-card" style="padding:14px;text-align:left;">' +
      '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">' +
        '<span style="font-size:18px;">' + T(t.country) + '</span>' +
        '<span style="font-size:11px;padding:1px 6px;background:var(--c-gold-soft);color:var(--c-gold-deep);border-radius:10px;">' + T(t.type) + '</span>' +
      '</div>' +
      '<div style="font-size:13px;font-weight:500;color:var(--c-text);margin-bottom:4px;">' + T(t.area) + ' ' + T(t.type) + '</div>' +
      '<div style="font-size:11px;color:var(--c-primary);font-weight:600;">咨询报价</div>' +
    '</div>').join(''),

  trackingTimeline: () => D.deliveryFlow.steps.map((s) =>
    '<div class="tracking-step ' + T(s.status) + '">' +
      '<div class="tracking-dot">' + T(s.step) + '</div>' +
      '<div class="tracking-content">' +
        '<div class="tracking-step-name">' + T(s.name) + ' <span class="tracking-step-status status-' + T(s.status) + '">' +
          (s.status === 'done' ? '✓ 已完成' : s.status === 'current' ? '● 进行中' : '○ 待办理') + '</span></div>' +
        '<div class="tracking-step-meta">预计耗时:' + T(s.duration) + '</div>' +
        '<div class="tracking-step-desc">' + T(s.desc) + '</div>' +
      '</div>' +
    '</div>').join('')
};

/* ---------------- 注入 ---------------- */
const FILE = path.join(ROOT, 'index.html');
let html = fs.readFileSync(FILE, 'utf8');
const before = html;
let filled = 0, missing = [];

const rendered = {};
Object.keys(R).forEach((id) => { rendered[id] = R[id](); });

Object.keys(R).forEach((id) => {
  const re = new RegExp('(<[a-zA-Z0-9]+[^>]*\\bid="' + id + '"[^>]*>)([\\s\\S]*?)(</[a-zA-Z0-9]+>)');
  const m = re.exec(html);
  if (!m) { missing.push(id); return; }
  html = html.slice(0, m.index) + m[1] + rendered[id] + m[3] + html.slice(m.index + m[0].length);
  filled++;
});

/* FAQPage:首页 FAQ 已静态可见,schema 与之一一对应(中文 AI 检索与 Google 都可直接摘录) */
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: D.faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
};
const faqBlock = '<!-- prerender:faq-schema:start -->\n<script type="application/ld+json">\n' +
  JSON.stringify(faqLd, null, 2) + '\n</script>\n<!-- prerender:faq-schema:end -->';
if (/<!-- prerender:faq-schema:start -->[\s\S]*?<!-- prerender:faq-schema:end -->/.test(html)) {
  html = html.replace(/<!-- prerender:faq-schema:start -->[\s\S]*?<!-- prerender:faq-schema:end -->/, faqBlock);
} else if (/<!-- schema:end -->/.test(html)) {
  html = html.replace('<!-- schema:end -->', faqBlock + '\n<!-- schema:end -->');
} else {
  html = html.replace('</head>', faqBlock + '\n</head>');
}

if (CHECK) {
  // 只比对「渲染结果是否已原样存在」—— 页面还有其它注入块(速答等),
  // 整文件比对会把它们误判为不一致。
  const stale = Object.keys(R).filter((id) => !before.includes(rendered[id]));
  const faqOk = before.includes(faqBlock);
  console.log('容器已是最新: ' + (Object.keys(R).length - stale.length) + '/' + Object.keys(R).length +
    (stale.length ? ' | 需重跑: ' + stale.join(',') : '') +
    ' | FAQ schema: ' + (faqOk ? '一致' : '需更新'));
  process.exit(stale.length === 0 && faqOk ? 0 : 1);
}
fs.writeFileSync(FILE, html, 'utf8');
console.log('prerender: ' + filled + ' containers in index.html (' +
  (Buffer.byteLength(html) - Buffer.byteLength(before)) + ' bytes added)' +
  (missing.length ? ' | 未找到容器: ' + missing.join(',') : ''));

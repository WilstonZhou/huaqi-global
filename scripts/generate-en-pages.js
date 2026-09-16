// Generate the English country pages (/en/...) + the English hub.
// Mirrors the structure of generate-country-pages.js but uses the EN layout,
// and cross-links each EN page with its Chinese counterpart via hreflang.
// 用法: node scripts/generate-en-pages.js
'use strict';
var fs = require('fs');
var path = require('path');
var lib = require('./site-lib');
var countries = require('./data-en-countries');

var ROOT = path.join(__dirname, '..');
var BASE = 'https://hq10000.com';
function write(file, content) {
  var full = path.join(ROOT, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('generated: ' + file);
}

/* hreflang set shared by both sides of a pair */
function alternates(enPath, zhPath) {
  return [
    { hreflang: 'en', href: BASE + enPath },
    { hreflang: 'zh-CN', href: BASE + zhPath },
    { hreflang: 'x-default', href: BASE + zhPath }
  ];
}

countries.forEach(function (c) {
  var enPath = '/en/' + c.slug;
  var alts = alternates(enPath, c.zhPath);

  var schemas = [
    lib.breadcrumbSchema([
      { name: 'Home', url: BASE + '/en' },
      { name: c.country + ' Company Registration', url: BASE + enPath }
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": c.country + " company registration",
      "provider": { "@id": BASE + "/#organization" },
      "url": BASE + enPath,
      "areaServed": [c.country],
      "availableLanguage": ["en", "zh-CN"]
    }
  ];

  var body = lib.hero({
    prefix: '/',
    breadcrumb: '<a href="/en">Home</a> / ' + c.country,
    title: c.flag + ' ' + c.title,
    subtitle: c.intro
  });

  body += '\n\n<section class="section section-soft">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">AT A GLANCE</span><h2 class="section-title">' + c.country + ' at a glance</h2></div>\n    ' + lib.statCards(c.stats) + '\n  </div>\n</section>';

  body += '\n\n<section class="section">\n  <div class="container">\n    ' + c.blocks.map(function (b) {
    return lib.contentBlock(b.h, b.paras || null, b.list || null, !!b.ordered);
  }).join('\n') + '\n  </div>\n</section>';

  body += '\n\n<section class="section section-soft">\n  <div class="container container-sm">\n    <div class="section-header"><span class="section-eyebrow">FAQ</span><h2 class="section-title">Frequently asked questions</h2></div>\n    <div>' + lib.faqItems(c.faqs) + '\n    </div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('Not sure which jurisdiction fits your business?', 'Tell us your target market, activity and timeline — we will map the options and the requirements.', '/');

  write('en/' + c.slug + '.html', lib.buildPageEn({
    canonical: BASE + enPath,
    alternates: alts,
    title: c.metaTitle,
    desc: c.metaDesc,
    schemas: schemas.concat([lib.faqSchema(c.faqs)]),
    body: body
  }));
});

/* ---------- English hub ---------- */
(function () {
  var hubPath = '/en';
  var body = lib.hero({
    prefix: '/',
    breadcrumb: '<a href="/en">Home</a>',
    title: '🌏 Company Registration for Global Business',
    subtitle: 'Huaqi Global is a corporate services firm headquartered in Hong Kong and Shenzhen, with a licensed corporate secretarial presence in Malaysia. We help founders and cross-border businesses incorporate, bank and stay compliant across 126 countries and regions.'
  });

  body += '\n\n<section class="section section-soft" id="countries">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">JURISDICTIONS</span><h2 class="section-title">Where we incorporate</h2><p class="section-desc">Regulator, entity type, timeline and requirements for each market.</p></div>\n    <div class="features-grid">' +
    countries.map(function (c) {
      return '<a class="feature-card" href="' + c.slug + '" style="text-decoration:none;"><div class="feature-icon">' + c.flag + '</div><div class="feature-title">' + c.title + '</div><div class="feature-desc">' + c.stats[0].value + ' · ' + c.stats[2].value + '</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  var svc = [
    ['Company registration', '/services/company-registration'],
    ['Corporate bank account', '/services/bank-account'],
    ['Annual review & audit', '/services/annual-review'],
    ['VAT / EPR compliance', '/services/vat'],
    ['Trademark', '/services/trademark'],
    ['Offshore (Cayman / BVI)', '/services/offshore']
  ];
  body += '\n\n<section class="section" id="services">\n  <div class="container">\n    <div class="section-header"><span class="section-eyebrow">SERVICES</span><h2 class="section-title">What we do</h2><p class="section-desc">Advisory and filing support across the full setup and compliance lifecycle.</p></div>\n    <div class="features-grid">' +
    svc.map(function (s) {
      return '<a class="feature-card" href="' + s[1] + '" style="text-decoration:none;"><div class="feature-icon">↗</div><div class="feature-title">' + s[0] + '</div><div class="feature-desc">Handled end to end by our advisors.</div></a>';
    }).join('\n') + '</div>\n  </div>\n</section>';

  body += '\n\n' + lib.ctaBanner('Talk to an advisor', 'Send us your target market and business model — we will come back with the options and a quote.', '/');

  write('en/index.html', lib.buildPageEn({
    canonical: BASE + hubPath,
    alternates: [
      { hreflang: 'en', href: BASE + hubPath },
      { hreflang: 'zh-CN', href: BASE + '/' },
      { hreflang: 'x-default', href: BASE + '/' }
    ],
    title: 'Company Registration & Corporate Services | Huaqi Global',
    desc: 'Incorporate and bank in Singapore, Hong Kong, the United States and Dubai. Huaqi Global provides company registration, corporate banking, annual compliance and trademark services across 126 countries.',
    schemas: [
      lib.breadcrumbSchema([{ name: 'Home', url: BASE + '/en' }])
    ],
    body: body
  }));
})();

console.log('english pages done');

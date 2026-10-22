#!/usr/bin/env node
/**
 * 生成 /credentials 下证样本页。
 * 数据源:scripts/data-credentials.js(由素材处理脚本产出)
 * 图片:assets/images/credentials/{slug}-360.webp / -1100.webp
 */
const fs = require('fs');
const path = require('path');
const lib = require('./site-lib');
const { GROUPS, ITEMS } = require('./data-credentials');

const P = '../';
const GROUP_ORDER = ['asia', 'offshore', 'west', 'license', 'ep'];
const GROUP_DESC = {
  asia: '亚洲主要注册地的公司注册证书与登记文件,均为 2026 年办结。',
  offshore: '开曼、BVI、塞舌尔等离岸地的注册证书,常用于架构搭建与跨境持股。',
  west: '美国特拉华与科罗拉多州的注册文件,含州务卿签发页与备案编号页。',
  license: '行业准入资质,与公司注册证书不同,由行业主管机构单独签发。',
  ep: '新加坡就业准证(EP)原则批准信,属个人准证文件,非公司注册文件。'
};

const count = ITEMS.length;
const markets = new Set(ITEMS.map(i => i.country.replace(/ · .*/, ''))).size;

function card(it) {
  const cap = `${it.country} · ${it.type} · ${it.year}`;
  return `        <a class="cred-card" href="${P}assets/images/credentials/${it.slug}-1100.webp" data-lightbox data-caption="${cap}">
          <span class="cred-shot"><img src="${P}assets/images/credentials/${it.slug}-360.webp" width="${it.w}" height="${it.h}" loading="lazy" decoding="async" alt="${it.alt}"></span>
          <span class="cred-meta"><strong>${it.country}</strong><span>${it.type}</span><em>${it.year}</em></span>
        </a>`;
}

function section(key) {
  const items = ITEMS.filter(i => i.group === key);
  if (!items.length) return '';
  return `
  <section class="section" id="${key}">
    <div class="container">
      <h2 class="section-title">${GROUPS[key]}</h2>
      <p class="section-sub">${GROUP_DESC[key]}</p>
      <div class="cred-grid">
${items.map(card).join('\n')}
      </div>
    </div>
  </section>`;
}

const faqs = [
  { q: '这些证书是真实办结的吗?', a: '是。页面展示的是 2026 年实际办结并取得的文件,已隐去客户主体信息。证书的签发机构、版式、编号规则均与官方原件一致,可对照各国主管机关公开的证书样式核验。' },
  { q: '为什么公司名、注册编号要打码?', a: '证书含客户主体信息,公开前必须脱敏。我们保留签发机关、文件类型、签发日期与版式,隐去公司名称、注册编号、地址与个人姓名,既证明办理结果,也不泄露客户身份。' },
  { q: '各国注册证书长得不一样,正常吗?', a: '正常。公司注册证书没有国际统一格式:香港是公司注册处的一页式证书,新加坡 ACRA 为电子证书,美国由州务卿签发,日本是履历事项全部证明书,韩国是事业者登录证。判断真伪看签发机关与编号,而不是看外观。' },
  { q: '拿到注册证书之后还要办什么?', a: '注册证书只是主体成立证明。实际经营通常还需要:税务登记、银行开户、年审与年报、审计(如适用)、行业许可(如建筑、金融)。不同国家的顺序与时限差异较大,建议按落地国清单逐项推进。' },
  { q: '这些样本能直接用于尽调或投标吗?', a: '不能。样本已脱敏,不构成任何主体的权属证明。尽调、投标、开户需要提供原件或经核证的副本,并由出具机构或律师核验。我们可以按具体用途协助准备对应文件。' }
];

const body = `
${lib.hero({
    breadcrumb: '<a href="/">首页</a> / 下证样本',
    title: '下证样本:各国公司注册证书实拍',
    subtitle: `23 份 2026 年办结文件,覆盖 11 个市场。全部已脱敏,只展示签发机构、文件版式与签发时间。`,
    prefix: P
  })}

  <section class="section">
    <div class="container">
      ${lib.statCards([
        { label: '样本数量', value: count + ' 份' },
        { label: '覆盖市场', value: markets + ' 个' },
        { label: '下证年份', value: '2026' },
        { label: '文件类型', value: '5 类' }
      ])}
      <div class="content-block">
        <h2>为什么公开下证样本</h2>
        <p>企业服务最容易含糊的地方,是"能不能办成"。合同可以写得很漂亮,但客户真正想确认的是:你确实拿得到这张纸,而且知道它长什么样、由谁签发、什么时候能下来。</p>
        <p>这里公开的是 2026 年实际办结的文件。全部做过脱敏处理:隐去公司名称、注册编号、地址与个人姓名,保留签发机关、证书版式、签发日期与文件类型。看得到的是"结果长什么样",看不到的是"这是谁的"。</p>
        <p>需要提醒的是:注册证书只是主体成立的证明。后续的税务登记、银行开户、年审、审计与行业许可,才是决定这家公司能不能正常运转的部分,各国差异很大。</p>
      </div>
    </div>
  </section>
${GROUP_ORDER.map(section).join('')}

  <section class="section section-soft">
    <div class="container">
      <h2 class="section-title">常见问题</h2>
      <div class="faq-list">
${lib.faqItems(faqs)}
      </div>
    </div>
  </section>

${lib.ctaBanner('想看某个国家的下证样本?', '告诉我们目标市场与主体类型,我们按最近办结的案例给你对应文件与时间线。', P)}
`;

const schemas = [
  lib.breadcrumbSchema([
    { name: '首页', url: 'https://hq10000.com/' },
    { name: '下证样本', url: 'https://hq10000.com/credentials' }
  ]),
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: '下证样本:各国公司注册证书实拍',
    description: '23 份 2026 年办结的海外公司注册证书与资质文件样本,覆盖 11 个市场,全部已脱敏。',
    url: 'https://hq10000.com/credentials',
    isPartOf: { '@type': 'WebSite', name: '华企环球', url: 'https://hq10000.com/' }
  },
  {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: ITEMS.length,
    itemListElement: ITEMS.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${it.country}${it.type}样本`,
      url: `https://hq10000.com/assets/images/credentials/${it.slug}-1100.webp`
    }))
  },
  lib.faqSchema(faqs)
];

const html = lib.buildPage({
  prefix: P,
  title: '下证样本 | 海外公司注册证书实拍 · 11 个市场 23 份 · 华企环球',
  desc: '23 份 2026 年办结的海外公司注册证书与资质样本:香港、新加坡、美国、日本、韩国、马来西亚、泰国、印尼、开曼、BVI、塞舌尔等 11 个市场,全部脱敏,可查看文件版式与签发机构。',
  keywords: '下证样本,公司注册证书,香港公司注册证书,新加坡ACRA证书,美国注册证书,开曼注册证书,BVI注册证书,营业执照样本',
  canonical: 'https://hq10000.com/credentials',
  body,
  schemas,
  relatedModules: 'both'
});

const out = path.join(__dirname, '..', 'credentials', 'index.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
const htmlWithLightbox = html.replace('</body>', '<script src="' + P + 'assets/js/lightbox.js" defer></script>\n</body>');
fs.writeFileSync(out, htmlWithLightbox, 'utf8');
console.log('generated: credentials/index.html (' + ITEMS.length + ' items)');
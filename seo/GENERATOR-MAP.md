# GENERATOR-MAP — hq10000.com 页面来源映射

> 用途:SEO 修复 / 内容改动前,**先查本表判断页面来源**,再决定改哪里。
> 依据:2026-09-17 对仓库实测(生成器 write 目标 + 目录差集),同日由 bootstrap 审计验证。
> 全站规模:73 个 HTML 页面(2026-10-20 新增开曼/BVI 2 个国家页、5 个国家×服务子页、3 个身份规划子页;此前 63,原 66,2026-10-14 删除竞对对比页 `compare/` 4 页)。

## 一、生成页(改生成器源码 → 重跑生成器,改 HTML 无效)

| 生成器 | 产出 | 备注 |
|---|---|---|
| `scripts/generate-country-pages.js` | `country/*.html`(12,含 index) | 数据源 `scripts/data-countries.js` |
| `scripts/generate-knowledge.js` | `knowledge/` 5 篇 | cayman-vs-bvi / hk-vs-sg-company / odi-vie-guide / overseas-bank-account-guide / registration-cost-comparison |
| `scripts/generate-solutions.js` | `solutions/*.html`(4) | |
| `scripts/generate-service-pages.js` | `services/` 18 页 | 数据源 `scripts/data-services.js`(apostille、company-liquidation、eu-trademark、hk-audit、hk-bank-account、hk-tax-filing、offshore、patent、patent-search、pct-patent、sg-bank-account、trademark、trademark-renewal、trademark-transfer、us-bank-account、us-inc、us-llc、vat) |
| `scripts/generate-more-pages.js` | `cases.html`、`knowledge/index.html`、`news/index.html`、`services/fees.html` | |
| `scripts/generate-tools.js` | `tools/cost-calculator.html` | |
| `scripts/generate-country-service-pages.js` | `country/{cc}/{service}.html`(5:us/tax、us/annual-review、us/audit、sg/audit、hk/annual-review) | 数据源 `scripts/data-country-services.js`;按「关键词需求 × 情报存量 × 硬事实数量」门槛开页,不铺量 |
| `scripts/generate-identity-pages.js` | `solutions/identity-planning/{hk,sg,ae}.html`(3) | 数据源 `scripts/data-identity-pages.js`;Hub 仍由 `generate-solutions.js` 产出 |
| `scripts/generate-news.js` | `news/<slug>.html`(4 篇政策解读) | 数据源 `scripts/data-news.js`;可选 `questionSection` / `pathComparison` 段落,手工加表格必须回填数据源 |

> ⚠️ **英文站已物理删除**(2026-09-17):`en/` 目录与生成器 `generate-en-pages.js` / 数据源 `data-en-countries.js` 已移除;`vercel.json` 已加 `/en`、`/en/*` 的 301 跳转(分别指向对应国家页或首页)。如将来要恢复英文站,可从 git 历史取回。

## 二、手写页(直接改 HTML)

- 根目录 7 个:`index.html`、`about.html`、`ai-match.html`、`contact.html`、`delivery-tracking.html`、`global-network.html`、`404.html`
- `services/` 8 个:`company-registration`、`bank-account`、`annual-review`、`audit`、`company-deregistration`、`fund-planning`、`tax-planning`、`other-services`
- `knowledge/` 3 篇旧稿(静态快照,无生成器):`singapore-registration-guide`、`us-company-tax-policy`、`cross-border-compliance`

## 三、共享 / 数据源(改动影响面最大 → 高风险)

- `scripts/site-lib.js` — 布局:buildPage / header / footer / 面包屑 / FAQ / JSON-LD 辅助
- 数据:`scripts/data-services.js`、`data-countries.js`、`data-country-services.js`(国家×服务子页)
- 前端:`assets/js/data.js`(**stats / nav / FAQ 由 JS 渲染**)、`assets/js/main.js`
- 辅助脚本:`scripts/baidu-push.js`、`inject-faq-schema.js`、`update-sitemap-lastmod.js`
- 大陆市场适配层(2026-10-17 新增,均为幂等后处理,**改完页面必须重跑**):
  - `scripts/inject-cn-seo.js` — 百度/国产浏览器适配 meta、Organization 实体增强、速答块补齐
  - `scripts/inject-ai-cn.js` — 面向大陆 AI 检索的语义层:hreflang(zh-CN/x-default)、author meta、Article 作者挂到 `#organization` 实体、`article:published_time`/`article:modified_time`、`WebPage.inLanguage`/`isPartOf`、知识页与国家页的「官方来源」块及 `citation`。官方来源只列监管机构官网首页,不臆造条款 URL。**顺序:在 `inject-cn-seo.js` 之后、`inject-visible-date.js` 之前运行**;幂等标记为 `ai-cn:source:start/end`。
  - ⚠️ **`inject-ai-cn.js` 在重跑生成器后必须跑两遍**:它把 `citation` 挂在 `WebPage` 节点上,
    而国家页的 `WebPage` 是由链路末尾的 `inject-datemodified.js` 才补出来的 → 第一遍只能加
    hreflang/author,第二遍才把 citation 落上去。实测:重跑 `generate-country-pages.js` 后
    `country/cayman.html` 的 citation 1 → 0,单跑一次 ai-cn 仍为 0,第二遍才回到 1。
    **已固化到 `scripts/postprocess-all.js`**:直接跑该入口,它会按依赖顺序跑完全链,并在
    `inject-visible-date.js` 之后自动补跑第二遍 ai-cn;不要再手写零散命令。
  - `scripts/inject-country-qa.js` — 国家页问句化问答(条件/材料/流程),数据源 `data-countries.js`
  - `scripts/inject-llms-facts.js` — llms.txt 事实层(实体事实卡/周期表/高频问答)
  - `scripts/inject-datemodified.js` — 全页补 `WebPage` 节点的 `datePublished`/`dateModified`(日期取自该文件 git 提交日期)。**顺序敏感:必须在 `prerender-home.js` 之后、`update-sitemap-lastmod.js` 之前运行**,否则 `prerender-home` 会覆盖首页的注入结果。
  - `scripts/inject-sameas.js` — 全页 `Organization` 补 `sameAs`(外部权威档案地址)。清单在 `scripts/same-as.json` 的 `profiles`,每条必须带 `verified` 日期(人工核实),**禁止猜测或填入未认领页面**;与生成器解耦,不触发 dateModified 刷新。加一条只需往 JSON 追加 `{label,url,verified}` 再跑脚本。
  - `scripts/inject-visible-date.js` — 页脚可见「本页面更新于 YYYY-MM-DD」,日期由 `<time datetime>` 承载而非纯文本。日期**不另发明**,取该页 JSON-LD 的内容级节点(`Article` 等)`dateModified`,无则回退 `WebPage`,保证可见层与 schema 完全一致;跳过 404 页。**顺序敏感:必须在 `inject-datemodified.js` 与 `prerender-home.js` 之后运行**(要先读到 dateModified,且不能被首页预渲染覆盖)。
  - `scripts/prerender-faq.js` — 把 JS 渲染的 FAQ(`#faqList` 空容器)预渲染进静态 HTML,并补 `FAQPage`;`--check` 可挂提交前检查。不执行 JS 的百度/中文 AI 爬虫看不到运行时填充的问答
  - `scripts/inject-website-node.js` — 为未定义站点的页面补 `WebSite` 节点(`@id` 为 `https://hq10000.com/#website`,publisher 指向 Organization),消除 `isPartOf` 的悬空引用。**不输出 `potentialAction` / `SearchAction`** —— 站内无真实搜索页或接口,虚构搜索入口属禁止项。已有该节点的页面跳过(幂等)。
  - `scripts/seo-cn-coverage.js` — 关键词覆盖率分析(只读,产出 CSV)
  - 执行顺序与背景见 `seo/CONTENT-PLAN-CN.md`
- ⚠️ `sitemap.xml` **手工维护**(仅 lastmod 由脚本更新);新增/删除页面必须手动同步

## 四、例外与陷阱

1. `assets/js/data.js` 渲染出来的内容(stats/nav/FAQ)在静态 HTML 里看不到 → 静态审计"缺失/不一致"类 finding 先核实是否此原因,再动手。
2. 已删除的 `en/` 目录:URL 现由 `vercel.json` 的 301 接管(→ 对应 `/country/xx` 或首页),不再是 404;审计无需再排除。
3. `knowledge/` 混装:5 篇生成 + 1 个 index(生成) + 3 篇旧静态快照(手写)。

## 五、已删除模块

- `compare/`(4 页,生成器 `generate-comparison-pages.js` + 数据源 `data-comparisons.js`)已于 2026-10-14 整套移除;footer 链接、`sitemap.xml`、`llms.txt` 同步清理。**如需恢复,从 git 历史取回生成器与数据源后重跑生成器。**
- 旧 URL 由 `vercel.json` 的 301 接管:`/compare/{vanzbon,tenace,xiaoniu,simengqifu}` 与 `/compare/:path*` → `/about`(不再 404,保留已收录权重)。

## 六、标准作业流程(已固化)

1. **Canary**:干净树重跑全部 8 个生成器,`git diff` 必须为 0(确认生成器确定性)
2. 按本表定位改哪里(生成器源码 vs 手写 HTML)
3. 生成页改完 → 重跑对应生成器(必要时全量重跑)→ `git diff` 核对差异范围
4. **一类问题一个 commit**(便于单独 revert)
5. push 用 `git -c http.version=HTTP/1.1`(防 GitHub HTTP2 抖动)

## 服务页延伸阅读(服务页 → 知识文章)

服务页的「延伸阅读」区块不要手改 HTML:生成页(20 个)在 `scripts/generate-service-pages.js` 顶部的 `READING` 表里按 slug 配置;手写页(company-registration / bank-account / annual-review / fees)直接改 HTML,插在 `<!-- FAQ -->` 之前。新增知识文章后,同步补到对应服务的 `READING` 并重跑生成器,再走完整注入链。

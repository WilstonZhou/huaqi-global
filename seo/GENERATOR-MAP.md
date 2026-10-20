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
  - `scripts/inject-country-qa.js` — 国家页问句化问答(条件/材料/流程),数据源 `data-countries.js`
  - `scripts/inject-llms-facts.js` — llms.txt 事实层(实体事实卡/周期表/高频问答)
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

# GENERATOR-MAP — hq10000.com 页面来源映射

> 用途:SEO 修复 / 内容改动前,**先查本表判断页面来源**,再决定改哪里。
> 依据:2026-09-17 对仓库实测(生成器 write 目标 + 目录差集),同日由 bootstrap 审计验证。
> 全站规模:71 个 HTML 页面。

## 一、生成页(改生成器源码 → 重跑生成器,改 HTML 无效)

| 生成器 | 产出 | 备注 |
|---|---|---|
| `scripts/generate-country-pages.js` | `country/*.html`(12,含 index) | 数据源 `scripts/data-countries.js` |
| `scripts/generate-knowledge.js` | `knowledge/` 5 篇 | cayman-vs-bvi / hk-vs-sg-company / odi-vie-guide / overseas-bank-account-guide / registration-cost-comparison |
| `scripts/generate-solutions.js` | `solutions/*.html`(4) | |
| `scripts/generate-comparison-pages.js` | `compare/*.html`(4) | 数据源 `scripts/data-comparisons.js` |
| `scripts/generate-service-pages.js` | `services/` 18 页 | 数据源 `scripts/data-services.js`(apostille、company-liquidation、eu-trademark、hk-audit、hk-bank-account、hk-tax-filing、offshore、patent、patent-search、pct-patent、sg-bank-account、trademark、trademark-renewal、trademark-transfer、us-bank-account、us-inc、us-llc、vat) |
| `scripts/generate-more-pages.js` | `cases.html`、`knowledge/index.html`、`news/index.html`、`services/fees.html` | |
| `scripts/generate-tools.js` | `tools/cost-calculator.html` | |
| `scripts/generate-en-pages.js` | `en/*.html`(5) | ⚠️ 入口已下线,sitemap 已移除;**审计时用 `--exclude "**/en/**"` 排除** |

## 二、手写页(直接改 HTML)

- 根目录 7 个:`index.html`、`about.html`、`ai-match.html`、`contact.html`、`delivery-tracking.html`、`global-network.html`、`404.html`
- `services/` 8 个:`company-registration`、`bank-account`、`annual-review`、`audit`、`company-deregistration`、`fund-planning`、`tax-planning`、`other-services`
- `knowledge/` 3 篇旧稿(静态快照,无生成器):`singapore-registration-guide`、`us-company-tax-policy`、`cross-border-compliance`

## 三、共享 / 数据源(改动影响面最大 → 高风险)

- `scripts/site-lib.js` — 布局:buildPage / header / footer / 面包屑 / FAQ / JSON-LD 辅助
- 数据:`scripts/data-services.js`、`data-countries.js`、`data-en-countries.js`、`data-comparisons.js`
- 前端:`assets/js/data.js`(**stats / nav / FAQ 由 JS 渲染**)、`assets/js/main.js`
- 辅助脚本:`scripts/baidu-push.js`、`inject-faq-schema.js`、`update-sitemap-lastmod.js`
- ⚠️ `sitemap.xml` **手工维护**(仅 lastmod 由脚本更新);新增/删除页面必须手动同步

## 四、例外与陷阱

1. `assets/js/data.js` 渲染出来的内容(stats/nav/FAQ)在静态 HTML 里看不到 → 静态审计"缺失/不一致"类 finding 先核实是否此原因,再动手。
2. `en/` 目录文件仍在(200 可达),但入口/sitemap 已摘 → 审计排除;彻底处理需三选一(noindex / 301 / 删除)。
3. `knowledge/` 混装:5 篇生成 + 1 个 index(生成) + 3 篇旧静态快照(手写)。

## 五、标准作业流程(已固化)

1. **Canary**:干净树重跑全部 8 个生成器,`git diff` 必须为 0(确认生成器确定性)
2. 按本表定位改哪里(生成器源码 vs 手写 HTML)
3. 生成页改完 → 重跑对应生成器(必要时全量重跑)→ `git diff` 核对差异范围
4. **一类问题一个 commit**(便于单独 revert)
5. push 用 `git -c http.version=HTTP/1.1`(防 GitHub HTTP2 抖动)

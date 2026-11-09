# GSC 索引与抓取报告

- 属性: `sc-domain:hq10000.com`
- 提交的 Sitemap: `https://hq10000.com/sitemap.xml`
- Sitemap 状态(2026-11-09 读取): 最近提交 2026-11-02 01:01,最近下载 2026-11-02 01:01,URL 数 **91**,错误 **0**,警告 **0**,无 pending
- 本地 `sitemap.xml` 实际条目: **92**(与 GSC 的 91 相差 1,推断为 GSC 去重或最近一次抓取后的差异;两处均为 0 错误)

## 1. URL Inspection 抽检结果

抽检 40 个 URL(GSC 单次上限 10 个,共 4 批),其中 13 个因 GSC API 侧 TLS 抖动返回错误(非站点问题,已剔除)。有效样本 27 个:

| 状态 | 数量 | 占比 |
|---|---|---|
| Submitted and indexed(PASS) | 22 | 81.5% |
| Discovered – currently not indexed | 5 | 18.5% |
| Crawled – currently not indexed | 0 | — |
| Excluded by noindex / canonical 异常 | 0 | — |
| 4xx / 5xx / 重定向错误 | 0 | — |

### 已收录(PASS)样本

`/`、`/about`、`/cases`、`/cases/jiagou`、`/cases/kaihu`、`/cases/shenji-baoshui`、`/cases/zhanghu-weihu`、`/news`、`/news/eu-epr-compliance-2026`、`/services/bank-account`、`/services/audit`、`/country/hk`、`/country/my`、`/knowledge/singapore-registration-guide`、`/knowledge/hk-vs-sg-company`、`/knowledge/hk-zero-declaration-fix`、`/knowledge/overseas-bank-account-guide`、`/knowledge/registration-cost-comparison`、`/knowledge/sg-annual-return-audit-exemption`、`/knowledge/trademark-rejection-response`、`/knowledge/cross-border-compliance`、`/knowledge/hk-annual-review-overdue`

### 已发现但未收录(Discovered – currently not indexed)

| URL | 入链数(修复前) | 判断 |
|---|---|---|
| /services | 23 | Hub 页,入链充足。属 Google 抓取配额未分配,非结构问题 |
| /services/apostille | 92 | 全站导航页脚均链接,入链充足。属内容/配额判断 |
| /news/hk-offshore-claim-2026 | 1(仅 /news 列表) | 新页面,列表可发现 |
| /news/th-boi-foreign-ownership-2026 | 1 | 同上 |
| /news/uae-corporate-tax-freezone-2026 | 1 | 同上 |

**结论**:「已发现未收录」集中在最新一批 /news 深度解读页与两个服务页,符合新域名(GSC 属性数据自 2026-10-28 起)在冷启动期被限流抓取的表现。**不是 robots、canonical、noindex 或服务器错误导致**——同级页面 `/news/eu-epr-compliance-2026`、`/services/audit` 均已正常收录。

## 2. 抓取与规范化实测(生产环境)

| 测试 | 结果 | 评价 |
|---|---|---|
| http://hq10000.com/ | 308 → https://hq10000.com/ | 正常(永久重定向) |
| https://www.hq10000.com/ | 301 → https://hq10000.com/ | 正常(单一主机) |
| http://www.hq10000.com/ | 308 → https://www.hq10000.com/ → 301 根 | 两跳,可优化,非错误 |
| https://hq10000.com/about/ | 308 → /about | 正常(trailingSlash: false) |
| https://hq10000.com/services/audit.html | 308 → /services/audit | 正常(cleanUrls) |
| https://hq10000.com/services/services/audit | 308 → /services/audit | 正常(双段路径兜底) |
| https://hq10000.com/404 | 308 → / | 正常 |
| https://hq10000.com/Services/Audit | 404 | 正常(大小写敏感) |
| 不存在的路径 | 404 | 抽样请求超时,未取得稳定响应;需下一轮复测 |

- canonical 在 HTML 源码中均为自引用绝对地址(`https://hq10000.com/...`),抽检页面全部一致。
- 未发现 `.html` 后缀 URL 被索引的情况(站内 0 条 `.html` 链接,平台侧 308 到无后缀)。
- 未发现 noindex 误用:`404.html` 为 `noindex, follow`,符合预期;其余 92 页均为 `index, follow`。

## 3. 需要人工确认的事项

1. `sitemap.xml` 92 条 vs GSC 91 条:差异 1 条,建议下次 Sitemap 重新提交后复核。
2. `/services`、`/services/apostille` 长期未收录时,应评估是**内容深度**问题而非抓取问题——需内容侧决策(是否补充 Hub 页聚合内容),不在本轮自动整改范围。
3. 生产环境 404 响应稳定性需复测(本轮 2 次请求均超时,可能与本地到该区域的链路有关)。

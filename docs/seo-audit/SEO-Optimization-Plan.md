# SEO 整改计划

优先级口径:P0 严重技术故障 / P1 直接影响索引与排名 / P2 搜索流量提升 / P3 长期增长。

## P0 — 无

本轮未发现全站 noindex、robots 阻断、canonical 指向错误、重要页面 5xx、抓取被阻塞等严重问题。
证据见 `Technical-SEO-Audit.md` 第 1、5 节与 `GSC-Indexing-Report.md` 第 2 节。

## P1 — 直接影响

### P1-1 `/linyi` 为完全孤立页(0 入链)

- 证据:GSC 抽检返回超时未取得状态;全站入链统计 0;页面仅在 sitemap.xml 中。
- 原因:该页(#44,2026-11-03 上线)为线下讲座配套页,独立模板,未挂入任何导航或页脚。
- 处置:**已修复**——首页与 `/news` 页脚「知识中心」列新增静态链接(见 `SEO-Changes-Report.md`)。
- 验证方式:上线后 7–14 天内用 GSC URL Inspection 复查收录状态;观察 `/linyi` 是否出现展示。

### P1-2 `/services`、`/services/apostille` 未收录

- 证据:URL Inspection 返回 `Discovered – currently not indexed`;`/services` 入链 23、`/apostille` 入链 92,均充足。
- 原因:新域名抓取配额限制,非结构缺陷(同级 `/services/audit` 已收录)。
- 处置:**本轮不改代码**。建议内容侧评估 `/services` Hub 页是否需要「服务矩阵 + 选择路径」聚合内容,提升被收录价值。需业务拍板。
- 验证方式:通过 GSC 重新提交 sitemap 后,2–4 周观察状态是否变为 `Crawled – currently not indexed` 或 `Submitted and indexed`。

### P1-3 3 篇 /news 深度解读未收录

- 证据:`/news/hk-offshore-claim-2026`、`/news/th-boi-foreign-ownership-2026`、`/news/uae-corporate-tax-freezone-2026` 均为 `Discovered – currently not indexed`;发布时间 2026-10-31,同批的 `/news/eu-epr-compliance-2026` 已收录。
- 原因:同 P1-2,抓取配额。
- 处置:本轮不改内容;建议下一轮为每篇补充 1–2 条来自相关服务页/国家页的静态内链(当前仅列表页 1 条入链)。

## P2 — 流量提升

| 编号 | 问题 | 证据 | 建议 | 状态 |
|---|---|---|---|---|
| P2-1 | 11 页 description 偏短(39–58 字符) | 全量扫描 | 补到 70–120 字符,含具体数字与适用地区 | 未执行(案例页文案需业务确认) |
| P2-2 | `/services/audit` 38 展示 / 0 点击 / 位置 11.1 | GSC page 维度 | 第 2 页边缘页,建议补「交付物清单 + 各国准则对照表」 | 未执行 |
| P2-3 | 核心词几乎无可见度(`海外公司注册` 位置 131) | GSC query 维度 | 属权重问题,靠内容集群与外链累积,非单页可解 | 转入 P3 |
| P2-4 | `/contact` 53 展示 / 0 点击 / 位置 5.8 | GSC page 维度 | 品牌与联系方式意图,点击发生在电话/企微,不作 CTR 优化 | 观察 |

## P3 — 长期

1. 内容集群:围绕「海外公司注册 / 海外银行开户 / VAT·EPR / 国际税务」四组主题建立 Hub-Spoke 结构,每簇 5–8 篇,互相静态内链。
2. 国家页纵深:`/country/bvi`、`/country/cayman` 入链仅 3,建议在 `/knowledge/cayman-vs-bvi` 与 `/services/offshore` 正文内嵌链接。
3. E-E-A-T:补充持牌资质页(`/credentials`)与真实交付样本的互链,避免孤证。
4. 观测机制:每月固定拉取 GSC 28 天/90 天数据,按 query 增量判断新内容是否命中意图。

## 本轮执行边界

- 执行:仅 P1-1(消除孤立页)与 sitemap lastmod 更新。
- 不执行:内容扩写、Hub 页重构、description 批量改写——均需业务决策,且不属于「有数据证据的技术缺陷」。
- 生产发布:未执行,等待人工审批。

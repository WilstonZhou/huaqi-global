# 技术 SEO 审计

- 仓库: WilstonZhou/huaqi-global(分支 master,审计基线 `2f59cdc`)
- 架构: 纯静态 HTML(无构建框架),Vercel 托管,`cleanUrls: true`、`trailingSlash: false`
- 审计对象: 站点内 93 个 HTML 文件(含 404),对外可索引 92 个 URL
- 审计方式: 本地源码静态解析 + 生产环境 HTTP 实测 + GSC 数据交叉验证

## 1. 元数据完整性(93 页全量扫描)

| 项目 | 结果 |
|---|---|
| title 缺失 | 0 |
| title 重复 | 0(92/92 唯一) |
| title 长度 <15 或 >65 | 0 |
| description 缺失 | 0 |
| description 长度 <60 字符 | 11 页(内容偏短,非缺失) |
| canonical 缺失 | 1(404.html,预期) |
| canonical 非自引用 | 0 |
| H1 缺失 / 重复 | 0(92/92 恰好 1 个 H1) |
| 图片缺 alt | 0 |
| robots meta 误设 noindex | 0(仅 404.html 为 noindex) |

### description 偏短的 11 页

`knowledge/sg-annual-return-audit-exemption`(58)、`services/hk-tax-filing`(57)、`cases/jiagou`(57)、`cases/kaihu`(55)、`cases/zhanghu-weihu`(55)、`cases/zhuce`(55)、`cases/zhuxiao`(55)、`cases/shangbiao`(51)、`cases/shenji-baoshui`(57)、`cases/nianshen`(51)、`linyi/index`(39)

> 判定为 P2:不影响索引,只影响 SERP 摘要丰富度。案例页文案需业务确认,本轮未改。

## 2. 结构化数据

全站 JSON-LD 覆盖(按类型计数,单位:页面数):

| 类型 | 覆盖 |
|---|---|
| Organization(+ProfessionalService) | 92 |
| WebSite | 91 |
| BreadcrumbList | 90 |
| WebPage | 88 |
| FAQPage | 85 |
| Service | 47 |
| HowTo | 38 |
| Article | 12 |
| CollectionPage / ContactPage / ItemList | 2 / 1 / 1 |

- GSC 富结果检测:抽检页面均返回 `PASS`,检测到的类型为 **Breadcrumbs**。
- FAQPage / HowTo 未在 GSC 富结果中出现,与 Google 收紧 FAQ/HowTo 富结果展示一致,**属预期,不是标记错误**。
- 未发现虚构评分、评价、资质;Organization 信息(地址、电话、SSM 持牌)与页脚一致。

## 3. 内链结构

- 每页固定出链约 58 条(顶部导航 + 页脚六列),全站模板一致。
- 入链分布(修复前):
  - `/services` 23、`/services/apostille` 92(导航页脚)
  - `/country/bvi` 3、`/country/cayman` 3
  - 4 篇 /news 详情页各 **1**(仅 /news 列表页)
  - **`/linyi` 0 入链 → 唯一完全孤立页**(只靠 sitemap 发现)
- 站内 0 条 `.html` 后缀链接,0 条绝对外部域内链,未发现死链(链接目标均在仓库存在)。

## 4. 内容规模

正文中文字数(剔除脚本/样式):最小值 1,079(404.html),业务页最小 1,894(`/tools/cost-calculator`),中位数 2,903,最大值 7,688。

- 无低于 1,500 汉字的业务页面(除 404)。
- 早期用「英文分词」统计出的「39 页内容过薄」为口径错误(中文整段被计为 1 词),**已废弃该结论**。

## 5. URL 与重定向

`vercel.json` 现有 26 条重定向,含双段路径兜底(上一轮 #43 修复)、`/en/*` 清理、`/compare/*` 归一。生产实测:
- 双段路径 308 回跳正常
- `.html` 308 到 clean URL 正常
- 尾斜杠 308 正常
- www / http 归一正常

未发现重定向链 >2 跳的情况(仅 `http://www` → 根为两跳)。

## 6. 性能与 Core Web Vitals

- 本轮未取得 CrUX 字段数据(GSC API 不提供 CWV 明细,站点流量过低不满足 CrUX 阈值)。
- 静态站 + Vercel CDN,HTML 单页 40KB 量级(实测 `/about` 为 39,673 字节),CSS 单文件,JS 三个小文件。
- **不给出 LCP/INP/CLS 数字**,无数据不编造。待接入 Lighthouse CI 或 Search Console CWV 报表后再评。

## 7. 结论

技术层没有 P0 问题。可执行的真实缺陷只有 1 项:**`/linyi` 零入链**。其余为「新站抓取配额」与「内容深度」问题,前者不可用代码修复,后者需业务决策。

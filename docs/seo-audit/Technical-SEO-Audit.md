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

### 6.1 资源与实现(2026-11-09 静态审计)

| 项目 | 实测 |
|---|---|
| 图片 | 28 张,`width`+`height` 覆盖 28/28,`loading` 覆盖 28/28,`decoding` 覆盖 28/28(第二轮补齐 1 张) |
| JS | 3 个外链全部 `defer`(data.js 49 KB、main.js 45 KB、icons.js 20 KB) |
| CSS | 单文件 70 KB(未手写压缩,由 Vercel 传输层 brotli/gzip 压缩) |
| 字体 | 无 `@font-face`,全部系统字体栈,无字体加载阻塞 |
| LCP 资源 | 首页 `preload` hero-banner.webp(`fetchpriority="high"`),webp 64 KB |
| 首页体量 | 6 个请求、约 118 KB 传输(实验室,经代理链路) |

### 6.2 实验室测量(经代理,非真实用户)

| 页面 | TTFB | FCP | LCP | CLS |
|---|---|---|---|---|
| / | 301 ms | 2,444 ms | 2,444 ms | 0 |

- 测试链路为中国大陆 → 代理 → 站点,TTFB 与 LCP 含代理往返,**不能作为真实用户指标**,也不能用于判断是否满足 Core Web Vitals 阈值。
- CLS 为 0,与「图片全部声明尺寸」的实现一致。

### 6.3 第三方数据可得性(失败记录)

| 数据源 | 结果 |
|---|---|
| PageSpeed Insights API | HTTP 429,当日配额耗尽(共享项目限额),未取得数据 |
| CrUX 字段数据 | 站点流量低于 CrUX 收录阈值,Google 不提供 |
| 本地 Lighthouse(12.8.2 / 13.6.0) | Chrome headless 在「大陆 → 代理 → 站点」链路下 9 分钟未完成采集,进程已终止,无结果 |

- **因此本文不给出「移动端 LCP 是否 ≤2.5s」的结论**,避免用代理链路数值冒充真实用户指标。
- 上述失败均为**测量环境限制**,不构成站点性能问题;如需权威数据,建议接入 Vercel Speed Insights 或自建 Lighthouse CI(在境外节点跑)。

### 6.4 结论

性能侧无阻塞项:无阻塞脚本、无网络字体、LCP 图片已预加载且为 webp、图片尺寸齐备、CLS 为 0。可优化空间在代码分割(data.js 49 KB 全站加载),属 P3,当前不改。

## 7. 结论

技术层没有 P0 问题。可执行的真实缺陷只有 1 项:**`/linyi` 零入链**。其余为「新站抓取配额」与「内容深度」问题,前者不可用代码修复,后者需业务决策。

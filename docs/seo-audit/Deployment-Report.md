# 部署报告

## 1. 环境确认

| 项目 | 值 |
|---|---|
| Vercel 项目 | `huaqi-global`(`prj_e6oJWDmI7ayuXUO63fOxtezS5jyv`) |
| Git 仓库 | `WilstonZhou/huaqi-global` |
| 生产分支 | `master` |
| 生产最新部署 | `dpl_Fc3QxeGap1B3JdDL4bjWNBycsiBg`,commit `2f59cdc`,state **READY** |
| 组件 | 纯静态 HTML,`cleanUrls: true`,`trailingSlash: false` |
| 环境变量依赖 | 无(静态站,无服务端运行时) |

## 2. Preview 部署

整改分支 `seo/hq10000-gsc-optimization` push 后由 Vercel Git 集成自动触发构建。

| 项目 | 值 |
|---|---|
| Deployment ID | `dpl_E1gMz25sNGGE9vA29Qw7HQ4wRngx` |
| Commit | `3e6a1801d090db29939d5d144f66ed050f1a0056` |
| 分支 | `seo/hq10000-gsc-optimization` |
| state | **READY** |
| target | preview(`target: null`) |
| Preview URL | https://huaqi-global-jckeh1j7t-wilstonzhou-2644s-projects.vercel.app |

## 3. Preview 访问限制(重要)

该项目的 Preview 部署启用了 Vercel 平台级 SSO 保护。匿名请求返回:

```
302 -> https://vercel.com/sso-api?url=...&nonce=...
```

因此本轮**无法用 curl 匿名验证 Preview 页面**。为避免把「SSO 拦截」误判为「页面异常」,改用等价验证:

1. 以该分支的工作区内容,用本地静态服务器模拟 Vercel 的 `cleanUrls` + `trailingSlash: false` 规则;
2. 逐页验证状态码、title、description、canonical、内链、sitemap;
3. Vercel 构建状态以 API 返回的 `READY` 为准(静态站构建无失败路径)。

> 结论口径:Preview **构建成功**已由 Vercel API 证实;Preview 页面内容验证为「等价环境验证」,非匿名访问 Preview 域名。此差别已明示,不作混淆。

## 4. 等价环境验证结果

| 路径 | 状态码 | canonical | description | title |
|---|---|---|---|---|
| / | 200 | https://hq10000.com/ | ✓ | 华企环球 \| 企业出海一站式服务平台 · 60+国家覆盖 · SSM持牌秘书 |
| /linyi | 200 | https://hq10000.com/linyi | ✓ | 临沂企业出海需求与合规诊断手册 · 在线填写 \| 华企环球 |
| /news | 200 | https://hq10000.com/news | ✓ | 政策动态 \| 各国注册税务合规速览 \| 华企环球 |
| /services | 200 | https://hq10000.com/services | ✓ | 企业出海服务总览 \| 注册·开户·财税·知产全链路 \| 华企环球 |
| /services/audit | 200 | https://hq10000.com/services/audit | ✓ | 公司审计 \| 印尼 OJK/IFRS · 美国 AICPA/GAAP \| 华企环球 |
| /country/sg | 200 | https://hq10000.com/country/sg | ✓ | 新加坡公司注册 \| ACRA Pte Ltd · 5-7工作日 \| 华企环球 |
| /country/bvi | 200 | https://hq10000.com/country/bvi | ✓ | BVI 公司注册 \| Business Company · 无最低资本 \| 华企环球 |
| /about | 200 | https://hq10000.com/about | ✓ | 关于华企环球 \| SSM持牌秘书机构·300+团队·60+国家覆盖 |
| /knowledge/us-company-tax-policy | 200 | https://hq10000.com/knowledge/us-company-tax-policy | ✓ | 美国公司税收政策 \| LLC/INC对比·EIN·BOI申报 |

### 内链与 sitemap

- 首页 `href="linyi"`:1 处 ✓
- `/news` `href="../linyi"`:1 处 ✓
- sitemap `/` 与 `/news` 的 `lastmod`:2026-11-09 ✓
- sitemap 条目数:92,XML 解析通过 ✓

### URL 规范化

| 请求 | 结果 |
|---|---|
| /services/audit.html | 308 → /services/audit |
| /linyi/ | 308 → /linyi |
| /about/ | 308 → /about |

无 404、无 500、无重定向循环。

## 5. 生产环境影响

- 整改分支未合并,`master` 未变动,生产部署仍为 `dpl_Fc3QxeGap1B3JdDL4bjWNBycsiBg`(`2f59cdc`)。
- Vercel 项目配置的 Git 触发规则仅对 `master` 产生生产部署;本次分支 push 只产生 preview 部署(已用 API 确认 `target: null`)。
- 未修改 DNS、域名、环境变量或任何生产数据。

## 6. 待人工执行

1. 审阅 PR #45 并决定是否合并。
2. 合并后如需立即推动抓取,可在 GSC 重新提交 `https://hq10000.com/sitemap.xml`。
3. 合并后 7–14 天复查 `/linyi` 收录状态与 `/services`、3 篇 news 的收录变化。

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

## 7. PR #45 合并后的生产上线(已实测验证)

| 项目 | 值 |
|---|---|
| PR | #45(squash merge) |
| 生产 commit | `d7bbe1ccf8f707ff9850520c7ef690bb58df7ba6` |
| 生产部署 | `dpl_7cUhGn7DNBpuRKq1VMkqh72Hz6a3`,state **READY**,`target: production` |
| 上线时间 | 2026-11-09 |

线上验证(经代理直接请求生产域名):

| 检查项 | 结果 |
|---|---|
| `https://hq10000.com/` 页脚 | `href="linyi">临沂出海诊断手册` 命中 ✓ |
| `https://hq10000.com/news` 页脚 | `href="../linyi">临沂出海诊断手册` 命中 ✓ |
| `https://hq10000.com/sitemap.xml` | `/` 与 `/news` 的 lastmod = `2026-11-09` ✓ |
| `https://hq10000.com/linyi` | HTTP 200 ✓ |

## 8. 第二轮(PR #46)Preview

| 项目 | 值 |
|---|---|
| 分支 | `feat/seo-content-depth` |
| Commit | `d71570b61df5b61f21471e673abd84b6656a3a0d` |
| Deployment | `dpl_CrD3GvsBKe5AEcCeRoqPVSgB5CCK` |
| state | **READY**,`target: null`(未触发生产) |
| Preview URL | https://huaqi-global-l5bznyco2-wilstonzhou-2644s-projects.vercel.app |

该 Preview 同样启用 Vercel SSO,匿名访问被重定向到 `vercel.com/sso-api`,因此第二轮改动采用相同的等价环境验证(本地复刻 `cleanUrls` / `trailingSlash: false`):

| 路径 | 状态 | 校验点 |
|---|---|---|
| /services | 200 | 新增「按企业所处阶段选服务」矩阵,4 行 × 3 列 |
| /news/hk-offshore-claim-2026 | 200 | 新增「四、按业务类型准备的举证材料」,H2 编号连续 |
| /news/th-boi-foreign-ownership-2026 | 200 | 新增「四、BOI、FBL 与泰籍股东」对比表 |
| /news/uae-corporate-tax-freezone-2026 | 200 | 新增「四、合格收入与不合格收入怎么分」 |
| 11 个 description 改动页 | 200 | description 长度 72–83 字符 |

**PR #46 已合并**(2026-11-09,详见第 10 节)。

## 10. PR #46 合并后的生产上线(已实测验证)

| 项目 | 值 |
|---|---|
| PR | #46(squash merge) |
| 生产 commit | `a38b53f34aa6a50d5c704fc9d53c791c68db9c53` |
| 生产部署 | `dpl_8a3EwvcAaQgmKBZH6bQ1w8vBqeVX`,state **READY**,`target: production` |

线上验证(经代理直接请求生产域名,2026-11-09):

| 路径 | 状态 | 校验点 |
|---|---|---|
| /services | 200 | 「按企业所处阶段选服务」矩阵命中;description 92 字符 |
| /news/hk-offshore-claim-2026 | 200 | 「按业务类型准备的举证材料」命中 |
| /news/th-boi-foreign-ownership-2026 | 200 | 「三条路径怎么选」命中 |
| /news/uae-corporate-tax-freezone-2026 | 200 | 「合格收入与不合格收入」命中 |
| / 与 /news | 200 | `/linyi` 页脚链接仍在,title 正常 |
| /cases/jiagou | 200 | description 83 字符 |
| /knowledge/sg-annual-return-audit-exemption | 200 | description 81 字符 |
| /services/hk-tax-filing | 200 | description 72 字符 |
| sitemap.xml | 200 | 92 条;17 条 `lastmod=2026-11-09` |

> 首轮请求中 `/`、`/news` 出现两次链路超时,重试后均返回 200;属本地到该区域的网络抖动,非站点错误。

## 9. 待人工执行
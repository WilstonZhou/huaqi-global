# 整改变更报告

- 分支: `seo/hq10000-gsc-optimization`
- 基线: `master` @ `2f59cdc5065a2b692870d082a1e5b28055d93fa1`
- 变更性质: 结构性内链修复 + sitemap 时间戳更新。无模板重写、无文案改写、无路由变更。

## 变更清单

| 文件 | 变更 | 原因 |
|---|---|---|
| `index.html` | 页脚「知识中心」列新增 `<a href="linyi">临沂出海诊断手册</a>` | `/linyi` 修复前 0 入链,是全站唯一孤立页 |
| `news/index.html` | 页脚「知识中心」列新增 `<a href="../linyi">临沂出海诊断手册</a>` | 同上,增加来自政策动态 Hub 的第二条静态入链 |
| `sitemap.xml` | `/` 与 `/news` 的 `<lastmod>` 更新为 `2026-11-09` | 两页内容确有变更(新增内链),按实际修改时间更新 |

## 修改前后差异

```diff
# index.html(页脚「知识中心」列,单行)
-  ...<a href="news">政策动态</a>
+  ...<a href="news">政策动态</a><a href="linyi">临沂出海诊断手册</a>

# news/index.html(页脚「知识中心」列,单行)
-  ...<a href="../news">政策动态</a>
+  ...<a href="../news">政策动态</a><a href="../linyi">临沂出海诊断手册</a>

# sitemap.xml
-  <loc>https://hq10000.com/</loc><lastmod>2026-11-01</lastmod>
+  <loc>https://hq10000.com/</loc><lastmod>2026-11-09</lastmod>
-  <loc>https://hq10000.com/news</loc><lastmod>...</lastmod>
+  <loc>https://hq10000.com/news</loc><lastmod>2026-11-09</lastmod>
```

## 影响面评估

- `/linyi` 入链:0 → 2(首页 + /news),均来自高权重模板页,且为静态 HTML(不依赖 JS 渲染)。
- 首页与 /news 页出链各 +1,不改变导航结构、不影响其他页面 canonical 与 title。
- 未触碰:robots.txt、vercel.json、任何页面 title/description/H1、JSON-LD、CSS/JS。

## 验证

- `linyi/index.html` 存在,链接目标有效。
- 首页 `href="linyi"` 1 处、`news/index.html` `href="../linyi"` 1 处,无重复插入。
- sitemap 可解析,条目数仍为 92,`/` 与 `/news` 的 lastmod 已更新。
- 未修改任何生产环境配置;Preview 部署验证结果见 `Deployment-Report.md`。

## 已知风险

1. 内链修复对「抓取配额」类问题的即时效果有限,收录状态改善需 7–30 天观察。
2. 若后续 `/linyi` 页面下线,需同步移除这两条链接,否则产生死链。

## 第二轮变更(内容纵深 + 元描述 + 性能微调)

分支 `feat/seo-content-depth`,基线 `master` @ `d7bbe1c`(PR #45 已合并)。

| 文件 | 变更 | 说明 |
|---|---|---|
| `services/index.html` | 新增「按企业所处阶段选服务」矩阵(准备期 / 落地期 / 运营期 / 扩张与退出) | 27 项服务按阶段归档,降低"该买哪几个"的判断成本 |
| `news/hk-offshore-claim-2026.html` | 新增「四、按业务类型准备的举证材料」表(贸易 / 服务 / 佣金代理 / 控股股息) | 原文有要点无对照,补成可执行材料清单;FAQ 顺延为「五」 |
| `news/th-boi-foreign-ownership-2026.html` | 新增「四、BOI、FBL 与泰籍股东:三条路径怎么选」对比表 | 三条路径的适用情形、持股、时间材料与风险并列 |
| `news/uae-corporate-tax-freezone-2026.html` | 新增「四、合格收入与不合格收入怎么分」分类表 | 把散落在正文的判定要点固化为分类矩阵 |
| 11 个页面 | meta description 由 39–58 字符扩充到 72–83 字符 | 内容取自页面既有事实,未新增未核验数字 |
| `contact.html` | 企业微信二维码 `<img>` 补 `decoding="async"` | 该页唯一缺失的图片解码提示 |
| `sitemap.xml` | 15 个受影响 URL 的 `<lastmod>` 更新为 `2026-11-09` | 与实际修改时间一致 |

### 内容口径约束

- 新增内容只描述**判定要素、材料、流程与路径差异**,不引入未经核验的税率、门槛或金额。
- 三篇 news 顶部「更新时间」改为 `2026-11-09(新增业务类型举证表/路径对比表,原有结论未变)`,保留原「核验日期 2026-10-31」。
- 案例页 description 只概括页面既有的「10 个脱敏实例 + 清单 + FAQ」结构,不新增成功数字或客户信息。

### 字数变化(正文汉字)

| 页面 | 变更后 |
|---|---|
| news/hk-offshore-claim-2026 | 2,699 |
| news/th-boi-foreign-ownership-2026 | 2,358 |
| news/uae-corporate-tax-freezone-2026 | 2,412 |
| services/index | 2,975 |

### 结构校验

- 4 个改动页:H1 各 1 个,标签配对错误 0
- news 页 H2 顺序:一 → 二 → 三 → 四(新增)→ 五、常见问题
- services 页 H2:四大板块 → 按注册地查看 → 按企业所处阶段选服务 → 常见问题 → CTA

## 未包含在本次变更中的建议
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

## 未包含在本次变更中的建议

见 `SEO-Optimization-Plan.md` P1-2 / P1-3 / P2 / P3。这些需要内容与业务决策,不宜在自动化流程中直接改动。

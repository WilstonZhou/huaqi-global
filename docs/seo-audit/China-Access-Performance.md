# 中国大陆访问性能实测与线路方案

测试时间：2026-11-09
测试点：本机（中国大陆），直连与代理双通道对照
测试对象：https://hq10000.com/

## 结论摘要

站点本身没有性能问题：静态资源 brotli 后首屏 119.0 KB，Vercel 边缘 `x-vercel-cache: HIT`，
服务端首字节在链路正常时低于 1 秒。**瓶颈完全在中国大陆到境外的跨境链路**，
任何境外 CDN（含 Cloudflare 免费版）都无法解决。唯一有效方案是 ICP 备案 + 国内 CDN。

## 一、服务端表现（正常）

| 项 | 值 |
|---|---|
| HTML（原始 / brotli） | 131,555 B / 22,045 B |
| CSS | 17,322 B |
| hero-banner.avif | 43,784 B |
| JS 合计（3 个，均 defer） | 35,865 B |
| 首屏传输合计 | 119,016 B |
| 图片 | 零 `<img>`，68 个内联 SVG |
| 边缘缓存 | `x-vercel-cache: HIT`，POP `sfo1` |
| 压缩 | brotli 生效，HTML 压缩比 6:1 |

安全头齐全：HSTS 2 年、CSP、X-Content-Type-Options、Referrer-Policy。

## 二、大陆直连实测（严重劣化）

两个 Vercel anycast IP（`216.198.79.65`、`64.29.17.65`）交替采样：

| 指标 | 实测区间 | 正常值 | 倍数 |
|---|---|---|---|
| TLS 握手 | 1.2 – 15.4 s | < 0.3 s | 最多 50× |
| TTFB | 1.9 – 19.8 s | < 0.3 s | 最多 66× |
| 吞吐 | 1.1 – 10.7 KB/s | 1 – 5 MB/s | 最多 4500× |
| 请求失败率 | 25%（20 次中 5 次超时） | ≈ 0 | — |

按实测吞吐推算，119 KB 首屏需要 **7 – 68 秒**。

### 根因定位（三条独立证据）

1. **同链路对照**：同一时刻 `www.vercel.com` 仅 1 B/s，比本站更差；`www.cloudflare.com` 22.3 KB/s。
   整条跨境链路都在退化，不是本站配置问题。
2. **协议层降级**：HTTP/2 需要 14.7 s / 1.5 KB/s，HTTP/1.1 只要 2.75 s / 8 KB/s，差 5 倍。
   中间设备对 h2 流量做了 QoS 降级。
3. **采样离散度**：同一 URL 重复请求，最好 1.58 s 命中、最差 60 s 超时，相差 40 倍。
   属于链路抖动，非源站波动。

## 三、Cloudflare 橙云 A/B 实测（无改善，不应切主站）

测试子域 `speedtest.hq10000.com`，CNAME 至 Vercel，开橙云代理，
SSL 模式 `Full (strict)`，最低 TLS 1.2，0-RTT 与 Early Hints 均开启。

同时间段交替采样 6 轮（每轮先 Vercel 直连、后 CF 橙云）：

| 轮次 | Vercel 直连 TTFB | CF 橙云 TTFB |
|---|---|---|
| 1 | 超时 | 6.26 s |
| 2 | 19.40 s | 超时 |
| 3 | 3.20 s | 10.87 s |
| 4 | 超时 | 1.77 s |
| 5 | 5.20 s | 5.25 s |
| 6 | 4.74 s | 超时 |
| **中位数** | **4.95 s**（n=4） | **5.76 s**（n=4） |
| **成功率** | 4/6 | 4/6 |

TLS 握手中位数：Vercel 4.41 s，CF 3.91 s。

**统计上无显著差异，橙云不改善大陆到达速率。**

### 原因

所有响应的 `cf-ray` 均为 `...-LAX`：Cloudflare 免费版在中国大陆没有就近节点，
anycast 把大陆用户送到洛杉矶边缘，再回源到旧金山（`sfo1`）的 Vercel。
等于在同一片美西区域多了一跳，跨境距离没有任何缩短。

`cf-cache-status: DYNAMIC` 也说明 HTML 未被边缘缓存（Vercel 返回的 `s-maxage`
不会自动让 CF 缓存 HTML，需要额外 Cache Rule）。

## 四、当前已实施的缓解（A 档）

见 PR #47（commit `d764b1a`）：

- HTML 缓存 `max-age=0, must-revalidate` → `max-age=60, s-maxage=3600, stale-while-revalidate=86400`
  —— 原每次站内导航都要跨境回源验证一次，单次 2–15 s。
- `/assets/*` 缓存 1 小时 → 24 小时浏览器 / 1 年边缘，过期后 `stale-while-revalidate` 后台更新。
- hero 图 65.6 KB WebP → 43.8 KB AVIF（由 jpg 原图直接编码，PSNR 37.9 dB），
  WebP 同步重编码至 60.4 KB，jpg 保留作兜底与 `og:image`。
- 首屏合计 140.8 KB → 119.0 KB（-15.5%）。

Cloudflare 区域设置已调整（对灰云主站不生效，为将来橙云预留）：
SSL 加密模式 `Full (strict)`、最低 TLS 1.2、Always Use HTTPS、0-RTT、Early Hints 全部开启。

## 五、根治方案（B 档，需备案）

1. 完成 ICP 备案（深圳主体：华企环球国际咨询（深圳）有限公司）。
2. 静态站同步至阿里云 OSS / 腾讯云 COS，前置国内 CDN。项目为纯静态站
   （156 个 HTML、47 MB），GitHub Actions 增加一步双写即可。
3. DNS 分流：大陆解析至国内 CDN 的 CNAME，海外继续指向 Vercel。
   Cloudflare 免费版不支持按国家分流，需切换至阿里云 DNS 或 DNSPod（均支持线路解析）。

预期：大陆首屏从 7–68 秒降至 1 秒内，吞吐提升 2 个数量级。成本为 CDN 流量按量计费，数十元/月起。

## 六、不建议的选项

| 方案 | 结论 |
|---|---|
| Cloudflare 橙云（免费版） | 实测无改善，成功率持平，不切主站 |
| Cloudflare 中国网络 | 仅 Enterprise + 必须备案，万元级/年 |
| Cloudflare Argo Smart Routing | 只优化 CF 回源段，用户到 CF 这段仍是跨境 |
| Vercel 更换 Region | 静态资源由 anycast 边缘服务，无法指定 POP |
| 第三方"CF 优选 IP" | IP 会漂移，不适合生产站点 |

## 附：测试子域处置

`speedtest.hq10000.com` 保留作为长期链路观测点，已通过 `vercel.json` 的 host 条件
下发 `X-Robots-Tag: noindex, nofollow`，避免与主站产生重复内容。
链路状况变化时可随时复测；若不再需要，删除 CF DNS 记录与 Vercel 域名即可。

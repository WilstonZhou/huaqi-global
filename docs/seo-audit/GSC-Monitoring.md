# GSC 周度监测

## 目的

GSC 数据窗口是滚动的 28 天,单看一次快照无法判断涨跌。本监测每周取同一口径(28 天)与上周快照对比,只在**超过阈值**时告警,避免每周噪音。

## 运行方式

| 项目 | 值 |
|---|---|
| 调度 | 每周一 09:00(Hermes cron,`no_agent` 脚本模式) |
| 脚本 | `~/.hermes/scripts/gsc_weekly_digest.py` |
| 解释器 | `~/website-ops/.venv/bin/python`(复用 website-ops 的 GSC 只读凭据) |
| 属性 | `sc-domain:hq10000.com` |
| 窗口 | 本期 `T-29 ~ T-2`;上期 `T-57 ~ T-30`(T-2 规避数据延迟) |
| 基线 | `~/.hermes/state/gsc-weekly/baseline.json` |
| 历史 | `~/.hermes/state/gsc-weekly/history.jsonl`(每次追加完整快照) |
| 投递 | Telegram 群 `-5162561475` |

手动运行:

```bash
/home/hq10000/website-ops/.venv/bin/python ~/.hermes/scripts/gsc_weekly_digest.py --force
```

`--force` 无论是否命中阈值都输出报告。

## 阈值

| 指标 | 触发条件 |
|---|---|
| 曝光 | 相对变化 ≥30% **且** 绝对变化 ≥30 |
| 点击 | 绝对变化 ≥2 |
| 平均排名 | 变化 ≥3.0 |
| Top10 页面 | 有页面新进或掉出曝光 Top10 |
| Top10 查询 | 有新查询进入曝光 Top10 |
| 收录状态 | 监控 URL 的 `coverageState` 发生变化 |

监控 URL(每周做 URL Inspection,各 1 次调用):

- `/services`
- `/services/apostille`
- `/linyi`
- `/news/hk-offshore-claim-2026`

## 静默规则

- **命中任一阈值**:输出完整报告(指标表 + Top 页面 / Top 查询 + 变化项),投递到 Telegram。
- **未命中**:脚本不输出,不发消息。运行记录仍写入 `history.jsonl`,可随时回看。
- **首周**:无历史基线,输出一次基线快照。

## 已知限制

- GSC 数据有 1–3 天延迟,窗口末端留 2 天缓冲。
- URL Inspection 有配额(每次 1 条),本监测每周约 4 条,远低于上限。
- 每次 API 调用在「大陆 → 代理」链路上约 25–60 秒,整轮约 4–6 分钟;cron 在后台执行,不影响调度。
- 若某个 URL 检查失败,报告会标注「URL 检查失败」而不是把失败当成「未收录」。

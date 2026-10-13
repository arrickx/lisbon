# 葡萄牙慢调之旅 · 里斯本 & 阿尔加维

2027-05-04 → 05-12，9 天 8 晚，4 大 1 小家庭。纯手机（iPhone 16 Pro 402×874）随身手册。

🔗 https://arrickx.github.io/lisbon/

## v2.1 特性

- **自动定位今天**：按里斯本时间（Europe/Lisbon）而非手机时区；每次打开/切回前台都重新定位，不依赖"记忆上次位置"。手动翻看后 5 分钟内保持，之后回到今天。
- **现在 / 下一站**：首屏即显示当前一站、下一站、导航与 Uber 按钮、当日车程合计。
- **三个 Tab**：今天 · 全程 · 随身（点菜大字卡、避坑、地址一键复制）。
- **离线可用**：PWA（`sw.js` + `manifest.webmanifest`），可添加到主屏幕。

## 核心方案文档（三册互联）

| 文档 | 作用与定位 |
|---|---|
| [`DAILY_ITINERARY.md`](file:///Users/R/Documents/antigravity/lisbon/DAILY_ITINERARY.md) | **每日慢游度假方案**（上午/下午双段式结构 · 景点玩法 · 美食与随身包清单） |
| [`TRIP_PROFILE_4A1C.md`](file:///Users/R/Documents/antigravity/lisbon/TRIP_PROFILE_4A1C.md) | **4大1小总概览档案**（Upon & Belmar 两卧房型 · Uber/Bolt XL · 自驾 · TAP 乘机） |
| [`TICKETS_AND_HOURS.md`](file:///Users/R/Documents/antigravity/lisbon/TICKETS_AND_HOURS.md) | **门票预订与营业核查手册**（逐日歇业/营业排查 · 仅2项抢票 · 官方渠道避坑） |

## 手机端 PWA 代码文件

| 文件 | 作用 |
|---|---|
| `data.js` | 唯一数据源（城市配色、住宿、9 天行程、车程、随身口袋卡） |
| `app.js` | 时间逻辑、渲染、导航/Uber/复制 |
| `style.css` | 移动端样式 |
| `index.html` | 骨架 |
| `DESIGN.md` | v2 设计稿 |

## 测试参数

- `?now=2027-05-06T15:00` 模拟里斯本当前时间
- `?day=3` 指定第几天
- `?tab=trip|pocket` 指定 Tab

## 注意

车程分钟与价格为估算；Upon / Hyatt / Belmar 地址待订单确认后补入 `data.js`。

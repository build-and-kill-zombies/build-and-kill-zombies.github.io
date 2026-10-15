# Build and Kill Zombies SEO 扩页交付报告

核查日期：2026-10-15。基线：`main` / `c242ea027ee7f9bfcb9f66b7c225b721fb379ecb`，开工时工作区干净。修改保留在本地可 review 的 diff，未提交、推送或部署。

## 1. 五个新页面

五页均已启用，并生成 `out/<slug>/index.html`，进入 Sitemap、全局 Header 和 Footer。每页一个 H1、唯一 canonical、index/follow、OG/Twitter、面包屑及与可见答案一致的 FAQ Schema。

| URL | 状态 | Title | H1 |
| --- | --- | --- | --- |
| `/car-ideas/` | 完成 | Build and Kill Zombies Car Ideas & Vehicle Designs | Build and Kill Zombies Car Ideas |
| `/halloween-event/` | 完成，限定已确认公告范围 | Build and Kill Zombies Halloween Event 2026 Guide | Build and Kill Zombies Halloween Event |
| `/weapons/` | 完成 | Build and Kill Zombies Weapons & Supports Guide | Build and Kill Zombies Weapons |
| `/skills/` | 完成 | Build and Kill Zombies Skills & Upgrade Guide | Build and Kill Zombies Skills Guide |
| `/how-to-get-cash-fast/` | 完成 | Build and Kill Zombies Cash Farming Guide | How to Get Cash Fast in Build and Kill Zombies |

Title 长度依次为 50 / 49 / 47 / 45 / 41；Description 为 150 / 146 / 150 / 142 / 144，均在限制内。可见文章约 1,008 / 694 / 1,141 / 1,165 / 1,099 词（含表格、FAQ 和相关链接）。活动页因官方玩法信息有限，主动低于目标词数，不编造完整副本攻略。

车型页提供四组 HTML/CSS 布局示意，明确标注 “Illustrative layout / not an in-game screenshot”；武器页提供真实名称、装备与摆放排查；技能页按场景解释升级选择；Cash 页提供可手工复用的 Run 记录表，不承诺收益或虚构游戏公式。

## 2. 文件及实现

| 文件 | 改动 |
| --- | --- |
| `content/generated/pages.json` | 仅追加五页，保留原五页对象及其原始文本；新页包含内链、FAQ、sourceNotes、来源链接 |
| `config/types.ts` | 增加可选的布局示意和来源字段，兼容现有数据 |
| `components/templates/fixed-template-inner.tsx` | 服务端输出新页可选示意图和来源；正文保持可抓取 |
| `components/templates/fixed-template-home.tsx` | 首页卡片与导航增长解耦，保留原五张卡片、顺序和文案 |
| `components/templates/fixed-template-header.tsx` | 为注入 HTML 的真实菜单绑定 Escape、外部点击关闭及焦点恢复；保留浮动外观 |
| `lib/fixed-template/render.ts` | 统一 More/Menu 导航、active、焦点样式和响应式；修复带属性的 chrome 拆分；增加一条文章 `min-width:0`，让原表格在自身区域滚动 |
| `components/templates/fixed-template-ads.tsx` | 仅将初始 anchor 状态设为空，修复原有 SSR/client hydration 不一致；原 effect 和 Portal 返回逻辑完全不变 |
| `scripts/qa-seo-expansion.mjs` | 可重复运行的冻结、静态导出、SEO、导航及广告回归检查 |
| `docs/qa/*`、`output/playwright/*` | 官方活动响应、结构化测试记录、桌面/手机前后截图 |

没有依赖升级、lockfile 变动、首页重写、模板替换或广告 ID 更换。Footer 原有 Explore 栅格自动包含十页。

## 3. 旧流量页冻结

**PASS。** `home.json`、`site.json` 和原五页数据对象完全不变。首页及 Codes、Tier List、Best Build、Beginner Guide、Bosses 的导出 `<main>` 与改动前保存的实际导出 HTML **逐字节相同**。

原 Title、Description、H1、hero、正文、FAQ、slug、关键词及相关数据均未改。SEO/Schema 生成器、robots、Sitemap 生成器和 URL 规则未改。没有向旧正文追加导流链接。视觉变化限于全局导航和必要的窄屏容器防溢出，不重排内容或广告。

## 4. Codes 受控维护

**未修改：Codes refresh blocked by verification。** 保留原 September 标题、表格及核查日期，没有强制更新月份。

2026-10-15 的核查中，三个 Crypt 代码在 [GamesRadar](https://www.gamesradar.com/games/simulation/build-and-kill-zombies-codes/) 与 [SuperCheats](https://www.supercheats.com/build-and-kill-zombies-codes) 报道一致；但 ZEUS 的当前状态存在冲突（GamesRadar 列过期，Roblox Den 较新搜索快照列活跃），IAMPRO 门槛也出现 1,000 / 1,500 Studs 差异。[Roblox Den](https://robloxden.com/game-codes/build-and-kill-zombies) 实际读取页与其较新搜索快照也不完全一致。未进行游戏内兑换，无法消除冲突，按提示词保护整个旧 Codes 页。

活动新页只将三条 Crypt 奖励标记为 publisher-reported；没有冒称亲测可用。旧 Codes 中保留下来的陈述属于冻结基线，不代表本次重新验证通过。

## 5. 真实性审核

所有条目核查日期均为 **2026-10-15**；逐页事实映射、取证方式和置信度另保存在新页 `sourceNotes`，不展示内部审核注释。

| 页面 | 事实 → 来源/取证 | 置信度及边界 |
| --- | --- | --- |
| 全站 | 游戏实体及 build/weapons/Cash 循环 → [官方 Roblox 页](https://www.roblox.com/games/105011592530400/Build-and-Kill-Zombies)；place→universe API 返回 10741654282 | 高；确认为 place 105011592530400 / Zombie Car Crusher |
| Car Ideas | 现有冻结攻略的稳定机制；预设名称和 Build mode 由 [Bloxodes](https://bloxodes.com/wiki/build-and-kill-zombies) 与 [AllThingsHow](https://allthings.how/build-and-kill-zombies-best-car-build-and-skill-priority-roblox/) 交叉支持 | 核心机制高；四组方案属于明确标记的编辑建议，不是精确配方 |
| Halloween | 活动名称、日期、portal 主题 → [官方事件 API](https://apis.roblox.com/virtual-events/v1/universes/10741654282/virtual-events)，直接 HTTPS 读取并保存 [响应](qa/roblox-events-2026-10-15.json) | 高；Hollow Dungeon 为 10/10–10/17，Part II 为 10/17–10/24，均约 14:00 UTC；不推断商店截止时间、Boss、坐标、入口费用或兑换比例 |
| Halloween | 三条 Crypt 奖励 → GamesRadar 10/12 与 SuperCheats 10/11 报道交叉核对 | 对报道一致性中高；不代表游戏内兑换验证 |
| Weapons | SUPPORTS 获取及装备 → 现有机制、Bloxodes；Shredder / Double Barrel / Green Smasher / Crossbow 名称 → [录像引用及标签记录](https://buildandkillzombies.live/weapons)、[武器参考](https://build-and-kill-zombies-roblox.wiki/weapons/weapons-list) 等交叉支持 | 名称/角色中高；不写未经支持的 DPS、价格、掉率、稀有度或完整 Index |
| Skills | Luck / More Support / Gold Roll 及连接分支 → 现有攻略、[技能参考及录像记录](https://buildandkillzombiescodes.wiki/skills/)、Bloxodes 等交叉支持 | 核心机制中高；成本及高等级效果存在冲突，因此不列固定数值；不保证未来不重置 |
| Cash | 距离和击杀带来 Cash → 现有冻结攻略、[Cash 参考](https://buildandkillzombies.live/cash) 等 | 中高；Cash÷实际分钟数仅为个人记录方法，不是官方收益公式或收益保证 |

摆放、购买顺序和对比流程属于基于已知机制的建议，不伪装成实测数据或官方推荐。

## 6. 导航、广告和 QA

桌面 ≥1024：Codes / Tier List / Best Build / Car Ideas / Event / Weapons / Skills / Earn Cash；More 仅保留 Beginner Guide / Bosses；768–1023：三个主入口 + More；小屏：一个可见 Menu，展开十个入口。原生 details 支持 Enter/Space，另支持 Escape、外部点击关闭与清晰焦点；手机展开时菜单占据正常文档空间。

| 检查 | 结果 |
| --- | --- |
| 范围内 diff / `git diff --check` / 无依赖更新 | PASS |
| 首页及旧页核心内容冻结 | PASS |
| Codes 白名单 | PASS：未修改；保鲜核验阻塞 |
| 五个唯一 URL / TD 长度 / 唯一 H1 / canonical | PASS |
| 内容独立、实用、有来源 | PASS；活动页按事实量缩短 |
| 静态 HTML / 表格 / FAQ Schema / 直接访问 | PASS |
| Sitemap / robots / index-follow | PASS |
| 十页均由 Header、Footer 到达 | PASS |
| 320 / 375 / 390 / 768 / 1024 / 1280 / 1440 | PASS：共 77 个页面/视口组合全部 200，无文档横向溢出、重复 ID 或重复导航 landmark |
| 键盘、菜单开关、滚动、active、外部关闭 | PASS；实际完成桌面/手机 20 次导航点击 |
| 触控 | PASS；375px、hasTouch 移动端上下文实际完成 10 次 tap 导航及开关 |
| 200% 等效可用空间 | PASS：640×450 CSS px，无横向溢出，菜单可滚动 |
| 广告 ID、脚本逻辑、anchor、GA 保留 | PASS |
| Banner / Native / SocialBar 初始化 | PASS：每文档各一次、共三个不同广告脚本请求；缩放不重复初始化，Banner 断点 key 正确 |
| 浏览器运行时报错 | PASS：修复原有 Portal hydration 问题后为 0 |
| `npm ci` / `npm run lint` / `npm run typecheck` / `npm run build` | PASS；现有 Node 23 与 eslint 传递依赖有 engine 提示，不影响上述成功 |
| 1280 / 375 首页和新旧页面截图 | PASS |

广告脚本在重复性浏览器测试中使用空响应隔离，**真实第三方素材、填充率、网络可用性与 GA 数据入库未验证**。测试验证的是挂载、配置、调用次数及保留的容器行为。

结构化证据：[导航](qa/navigation-2026-10-15.json)、[77 组合矩阵](qa/page-matrix-2026-10-15.json)、[触屏](qa/touch-2026-10-15.json)。截图位于 `output/playwright/`，含改动前后首页/旧页、新页、打开菜单及缩放等效空间。

## 7. 最后检查

上线前重新核对 Roblox 活动时间，消除 Codes 冲突后再单独维护 Codes，并在目标托管环境检查真实广告和 GA。没有验证游戏内兑换，也未承诺上线后的 GSC 排名/流量结果。本次没有推送或部署。

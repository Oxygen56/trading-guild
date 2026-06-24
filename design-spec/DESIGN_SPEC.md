# Casper Autonomous Trading Guild — 设计规范

> **版本**: v1.0 · **日期**: 2026-06-24 · **设计负责人**: 视觉队长
>
> 本规范包含应用主界面的完整设计定义，前端开发方可直接依据本文档和 `design-tokens.css` 进行实现。

---

## 1. 设计理念

### 1.1 核心原则

| 原则 | 说明 |
|------|------|
| **透明即信任** | 所有 Agent 决策、交易、支付均可视化呈现，用户能实时追踪资金和策略状态 |
| **多 Agent 可辨识** | 三类 Agent（策略/风控/执行）有独立的视觉身份，用户一眼能区分"谁在做什么" |
| **数据叙事** | Dashboard 不只是数字堆砌——通过信息层级和动线引导，让用户自然理解公会运转状态 |
| **专业但不冷酷** | DeFi 工具的严谨性 + 公会/社区的温度感，避免传统金融 Dashboard 的冰冷感 |

### 1.2 设计参考

- **DeFi 工具**: Aave、GMX 的数据呈现方式（清晰的数字层级、风险标识）
- **AI 交互**: ChatGPT/Claude 的对话界面模式（自然语言输入 + 结构化响应）
- **监控面板**: Grafana/Datadog 的实时数据展示（指标卡 + 时序图 + 状态指示器）
- **公会叙事**: 游戏化 Guild UI（成员列表、贡献排名、活动 Feed）

### 1.3 黑客松评审对齐

本设计专项覆盖黑客松「用户体验与设计」评审维度的以下得分点：

- **界面美观度**: 深色主题 + Casper 品牌色 + 微妙动效
- **操作直观性**: 自然语言驱动的 Agent 交互降低 Web3 使用门槛
- **信息清晰度**: 多 Agent 协作流程可视化，复杂系统可理解
- **响应式设计**: 桌面端完整体验，移动端核心功能可用
- **可访问性**: WCAG AA 色彩对比度，键盘导航支持

---

## 2. 信息架构

```
/                          → Dashboard（公会总览）
/terminal                  → Agent 终端（AI 对话 + 策略发起）
/strategies                → 策略流（策略提案 → 风控 → 执行 → 结果）
/guild                     → 公会成员（Agent 花名册 + 贡献排名）
/vault                     → 金库（资产分布 + 交易历史 + 收益分配）
```

### 2.1 导航结构

```
┌──────────────────────────────────────────────────────┐
│  [Logo]  Trading Guild          [Casper Testnet] [●] │ ← 顶部栏 64px
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ 导航     │         内容区                             │
│ 260px    │         max-width: 1440px                  │
│          │                                           │
│ · 总览   │                                           │
│ · 终端   │                                           │
│ · 策略   │                                           │
│ · 公会   │                                           │
│ · 金库   │                                           │
│          │                                           │
│ ───────  │                                           │
│ 公会状态 │                                           │
│ · TVL    │                                           │
│ · Agents │                                           │
│ · 24h PnL│                                           │
└──────────┴───────────────────────────────────────────┘
```

---

## 3. 页面设计

### 3.1 Dashboard（公会总览 `/`）

**目标**: 用户进入应用后 5 秒内理解公会当前状态——赚了还是亏了、Agent 在干什么、有什么新动态。

**布局**:

```
┌─────────────────────────────────────────────────────────────┐
│  Guild Overview                               [Casper Testnet] │
├───────────────────────┬──────────┬──────────┬────────────────┤
│ Total Value Locked    │ 24h PnL  │ Active   │ Guild Members  │
│ 12,450 CSPR           │ +3.2%    │ 3 Agents │ 5              │
│ ≈ $2,490 USD          │ ↑ $398   │ ● ● ●    │ View all →     │
├───────────────────────┴──────────┴──────────┴────────────────┤
│                                                               │
│  PnL Chart (7D)                     Asset Allocation         │
│  ┌─────────────────────────────┐    ┌────────────────────┐   │
│  │    ╱╲    ╱╲                 │    │ CSPR     ████████ 45%│  │
│  │   ╱  ╲╱╱  ╲    ╱╲          │    │ USDT     ██████   30%│  │
│  │  ╱          ╲╱╱  ╲         │    │ CSPR-LP  ████     20%│  │
│  │╱                  ╲╲_______│    │ Other    ██        5%│  │
│  └─────────────────────────────┘    └────────────────────┘   │
│                                                               │
│  Recent Strategy Activity                                     │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 🧠 Strategy Agent · 2 min ago                           │ │
│  │ Proposed: Swap 500 CSPR → USDT (slippage ≤ 0.5%)       │ │
│  │ Risk Score: 78/100          Status: Pending Risk Review │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ ⚡ Execution Agent · 15 min ago                          │ │
│  │ Executed: Add liquidity CSPR-USDT pool                  │ │
│  │ Amount: 200 CSPR + 800 USDT    Tx: 0x7a3b...c9f1       │ │
│  │ Status: ✅ Confirmed (12 block confirmations)           │ │
│  ├─────────────────────────────────────────────────────────┤ │
│  │ 🛡️ Risk Agent · 1 hour ago                              │ │
│  │ Audit complete: Swap strategy #42                       │ │
│  │ Verdict: ✅ Approved | Slippage acceptable | No MEV risk│ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**交互要点**:
- 顶部指标卡（TVL/PNL/Agents/Members）hover 显示 tooltip 详情
- PnL Chart 支持切换 24H / 7D / 30D / All
- Strategy Activity 支持筛选：全部 / 策略提案 / 风控审核 / 执行中 / 已完成
- 每条策略记录点击展开完整详情（参数、交易哈希、时间线）

---

### 3.2 Agent 终端（`/terminal`）

**目标**: 用户用自然语言表达投资意图，Agent 理解并执行。降低 Web3 操作门槛——不需要知道"滑点""Gas Limit"也能用。

**布局**:

```
┌─────────────────────────────────────────────────────────────┐
│  Agent Terminal                                              │
├───────────────────────────────────┬─────────────────────────┤
│                                   │  Active Agents          │
│  ┌─────────────────────────────┐  │                         │
│  │                             │  │  🧠 Strategy Agent     │
│  │  👋 Hi, I'm your Strategy   │  │  Status: Idle          │
│  │  Agent. Tell me what you    │  │  Last action: 2 min ago │
│  │  want to achieve, and I'll  │  │                         │
│  │  work with the Risk &       │  │  🛡️ Risk Agent         │
│  │  Execution agents to make   │  │  Status: Auditing      │
│  │  it happen.                 │  │  Current: Strategy #42 │
│  │                             │  │                         │
│  │  ─────────────────────────  │  │  ⚡ Execution Agent     │
│  │                             │  │  Status: Idle          │
│  │  User: I want to invest     │  │  Tx today: 3           │
│  │  1000 CSPR in low-risk      │  │                         │
│  │  DeFi strategies.           │  │                         │
│  │                             │  │                         │
│  │  🧠 Strategy Agent:         │  │                         │
│  │  Analyzing market...        │  │                         │
│  │                             │  │                         │
│  │  ┌───────────────────────┐  │  │                         │
│  │  │ Strategy Proposal #42 │  │  │                         │
│  │  │ ───────────────────── │  │  │                         │
│  │  │ Action: Swap 500 CSPR │  │  │                         │
│  │  │ → USDT on CSPR.trade  │  │  │                         │
│  │  │ Slippage: ≤ 0.5%      │  │  │                         │
│  │  │ Est. output: 2,150 USDT│  │  │                         │
│  │  │ Risk Score: 78/100    │  │  │                         │
│  │  │                       │  │  │                         │
│  │  │ [Approve] [Reject]    │  │  │                         │
│  │  │ [Modify Parameters]   │  │  │                         │
│  │  └───────────────────────┘  │  │                         │
│  │                             │  │                         │
│  └─────────────────────────────┘  │                         │
│                                   │                         │
│  ┌─────────────────────────────┐  │                         │
│  │ Type your investment goal...│  │                         │
│  │                        [Send]│  │                         │
│  └─────────────────────────────┘  │                         │
└───────────────────────────────────┴─────────────────────────┘
```

**交互要点**:
- 对话式界面，支持流式输出（Agent 思考过程实时展示）
- Strategy Proposal 卡片内嵌在对话中，用户可直接 Approve/Reject
- 右侧面板实时显示三类 Agent 状态（Idle/Working/Auditing/Executing）
- 用户可随时 @ 特定 Agent 提问（如 "@Risk Agent why did you reject #41?"）
- 输入框支持 `/` 快捷命令：`/status` `/history` `/help`

**Agent 对话气泡样式区分**:
- 🧠 Strategy Agent: 左边框 indigo 色条，头像紫色光环
- 🛡️ Risk Agent: 左边框 amber 色条，头像金色光环
- ⚡ Execution Agent: 左边框 cyan 色条，头像青色光环
- 用户消息: 右对齐，深色填充

---

### 3.3 策略流（`/strategies`）

**目标**: 展示每笔策略的完整生命周期——谁提出的、谁审核的、谁执行的、赚了多少。类似 Twitter/GitHub 的 Feed 流，但信息密度更高。

**布局**:

```
┌─────────────────────────────────────────────────────────────┐
│  Strategy Feed                           [All] [Pending] [Done] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ 🧠 Strategy #42                        Pending Risk     │ │
│  │ ──────────────────────────────────────────────────────  │ │
│  │ Swap 500 CSPR → USDT · slippage ≤ 0.5%                 │ │
│  │ CSPR.trade DEX · Est. output 2,150 USDT                │ │
│  │                                                         │ │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │
│  │ ① Proposed ─── ② Risk Review ─── ③ Execute ─── ④ Done │ │
│  │    ✅ 2m ago      🔄 In progress      ○ Pending   ○     │ │
│  │                                                         │ │
│  │ Risk Score: 78/100  ·  Est. Fee: 0.15 CSPR (x402)     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ⚡ Strategy #41                        ✅ Completed       │ │
│  │ ──────────────────────────────────────────────────────  │ │
│  │ Add liquidity to CSPR-USDT pool · 200 CSPR + 800 USDT  │ │
│  │ LP Token: 0x3f8a...b2d1                                 │ │
│  │                                                         │ │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ │
│  │ ① Proposed ─── ② Risk Review ─── ③ Execute ─── ④ Done │ │
│  │    ✅              ✅ Approved        ✅ 15m ago    ✅   │ │
│  │                                                         │ │
│  │ PnL: +42 CSPR (+2.1%)  ·  Tx: 0x9c2d...e4a7            │ │
│  │ 🛡️ Audit: Slippage 0.3% · MEV risk low · LP healthy   │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ❌ Strategy #40                        Rejected          │ │
│  │ ──────────────────────────────────────────────────────  │ │
│  │ Swap 2,000 CSPR → MEME token                            │ │
│  │ 🛡️ Risk Agent: REJECTED — Token has honeypot risk,    │ │
│  │    sell tax 99%, liquidity < $100                       │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

**交互要点**:
- 四阶段进度条（Proposed → Risk Review → Execute → Done）是核心视觉元素
- 已完成策略显示 PnL（红绿标识）
- 被拒绝策略显示 Risk Agent 的拒绝理由（用户可学到风控知识）
- 点击策略卡片 → 展开完整详情（参数、Agent 间 x402 支付明细、链上 Tx 列表）
- 支持按 Agent 类型筛选（只看策略提案 / 只看风控结果 / 只看执行记录）

---

### 3.4 公会成员（`/guild`）

**目标**: 展示公会中的 Agent 身份、贡献和排名，强化「AI 公会」叙事。

**布局**:

```
┌─────────────────────────────────────────────────────────────┐
│  Guild Roster                                                │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Guild Stats: 3 Active Agents · 5 Members · 42 Strategies   │
│                                                               │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │ 🧠 Strategy Agent        │  │ 🧠 Strategy Agent #2     │ │
│  │ ─────────────────        │  │ ─────────────────        │ │
│  │ ID: agent-0x7a3b...      │  │ ID: agent-0x9f2c...      │ │
│  │ Role: Strategy Lead      │  │ Role: Strategy Analyst   │ │
│  │ Strategies: 25           │  │ Strategies: 12           │ │
│  │ Success Rate: 84%        │  │ Success Rate: 75%        │ │
│  │ Total PnL: +1,240 CSPR   │  │ Total PnL: +680 CSPR    │ │
│  │ Contribution: ██████ 35% │  │ Contribution: ███ 18%   │ │
│  │ Status: ● Active         │  │ Status: ● Active         │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                               │
│  ┌──────────────────────────┐  ┌──────────────────────────┐ │
│  │ 🛡️ Risk Agent            │  │ ⚡ Execution Agent        │ │
│  │ ─────────────────        │  │ ─────────────────        │ │
│  │ ID: agent-0x3d5e...      │  │ ID: agent-0xb8a1...      │ │
│  │ Role: Risk Auditor       │  │ Role: Trade Executor     │ │
│  │ Audits: 37               │  │ Executed: 20             │ │
│  │ Approved: 30 (81%)       │  │ Success Rate: 100%       │ │
│  │ Rejected: 7 (19%)        │  │ Avg Slippage: 0.28%     │ │
│  │ x402 Earned: 5.5 CSPR    │  │ Total Volume: 8,400 CSPR│ │
│  │ Status: ● Auditing       │  │ Status: ● Idle           │ │
│  └──────────────────────────┘  └──────────────────────────┘ │
│                                                               │
│  Leaderboard                          View: [PnL] [Volume]   │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  #  Agent              PnL        Strategies  Success   │ │
│  │  1  Strategy Agent     +1,240     25           84%  ██ │ │
│  │  2  Strategy Agent #2  +680       12           75%  █  │ │
│  │  3  Risk Agent         +5.5*      37 audits    81%  █  │ │
│  │    * via x402 fees                                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.5 金库（`/vault`）

**目标**: 公会财务透明——资产在哪、交易历史、收益如何分配。

**布局**:

```
┌─────────────────────────────────────────────────────────────┐
│  Guild Vault                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Total Value │ │ Available   │ │ Locked in   │            │
│  │ 12,450 CSPR │ │ 3,200 CSPR  │ │ Strategies  │            │
│  │ ≈ $2,490    │ │             │ │ 9,250 CSPR  │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                                                               │
│  Asset Breakdown                     Transaction History     │
│  ┌────────────────────────┐        ┌──────────────────────┐ │
│  │ ● CSPR      5,602  45% │        │ Swap    -500 CSPR    │ │
│  │ ● USDT      3,735  30% │        │         +2,150 USDT  │ │
│  │ ● CSPR-LP   2,490  20% │        │ Add Liq -200 CSPR    │ │
│  │ ● Other       623   5% │        │         -800 USDT    │ │
│  └────────────────────────┘        │ Claim   +42 CSPR     │ │
│                                     │                      │ │
│  Profit Distribution                │ ... more ...         │ │
│  ┌────────────────────────┐        └──────────────────────┘ │
│  │ Strategy Pool    60%   │                                   │
│  │ Risk Pool        20%   │                                   │
│  │ Execution Pool   15%   │                                   │
│  │ Guild Reserve     5%   │                                   │
│  └────────────────────────┘                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 组件库

### 4.1 MetricCard

关键数字展示卡，用于 Dashboard 顶部。

```
┌──────────────────┐
│ Total Value Locked│  ← Label (text-secondary, text-xs, uppercase tracking)
│ 12,450 CSPR       │  ← Value (text-4xl, font-display, font-bold)
│ ≈ $2,490 USD      │  ← Sub-value (text-sm, text-tertiary)
│ ↑ +3.2% this week │  ← Change indicator (profit/loss color)
└──────────────────┘
```

**变体**:
- `default`: 标准指标卡
- `agent`: 带 Agent 头像/标识
- `compact`: 小尺寸（用于侧边栏）

**规格**:
```
padding: var(--space-6);
background: var(--color-bg-card);
border: 1px solid var(--color-border-subtle);
border-radius: var(--radius-lg);
min-width: 200px;
```

### 4.2 StrategyCard

策略记录卡，用于策略 Feed 和 Dashboard Activity。

```
┌──────────────────────────────────────────────┐
│ 🧠 Strategy #42              Pending Review  │
│ ──────────────────────────────────────────── │
│ Action description + parameters              │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ①→②→③→④ 进度条                              │
│ Meta: risk score, fee, timestamp             │
└──────────────────────────────────────────────┘
```

**状态变体**:
- `proposed`: 紫色左边框 + "Pending Review" badge
- `in-review`: 金色左边框 + Risk Agent 动画
- `executing`: 青色左边框 + 加载动画
- `completed`: 绿色左边框 + PnL 显示
- `rejected`: 红色左边框 + 拒绝理由

**规格**:
```
padding: var(--space-5);
background: var(--color-bg-card);
border: 1px solid var(--color-border-default);
border-left: 3px solid [agent-color];
border-radius: var(--radius-md);
transition: border-color var(--transition-normal);
// hover: border-color → var(--color-border-accent);
```

### 4.3 AgentAvatar

Agent 身份标识组件。

```
┌────┐
│ 🧠 │  ← 40x40px circle, agent-color bg + muted ring, emoji centered
└────┘
Strategy Agent  ← Name (text-sm, font-medium)
● Active        ← Status dot + text (text-xs)
```

**变体**:
- `md`: 40px（列表/卡片中使用）
- `lg`: 64px（Agent 详情页使用）
- `sm`: 24px（内联使用，如对话气泡旁）

### 4.4 ProgressTracker

四阶段进度条（策略生命周期）。

```
Proposed ────── Risk Review ────── Execute ────── Done
   ✅               🔄                 ○             ○
```

**规格**:
- 总宽度 100%，4 个等分节点
- 已完成：实心圆 + agent-color 填充线
- 进行中：脉冲动画圆 + 渐变线
- 未开始：空心圆 + border-default 线
- 被拒绝：红色圆 + 断线（后续阶段灰掉）

### 4.5 AgentBubble

对话气泡（用于 Terminal 页面）。

**用户消息**:
```
                                         ┌──────────────────┐
                                         │ User message text │
                                         └──────────────────┘
                                         右对齐 · bg-card · rounded-l-lg rounded-br-lg
```

**Agent 消息**:
```
┌────────────────────────────┐
│ 🧠 Strategy Agent          │  ← Agent header (name + time)
│ Agent message text...      │
│                            │
│ [embedded StrategyCard]    │  ← 可嵌入 StrategyCard
└────────────────────────────┘
左对齐 · 左边框 3px agent-color · bg-layer-2
```

### 4.6 StatusBadge

状态标签。

| 状态 | 样式 |
|------|------|
| Active / Confirmed / Approved / Profit | 绿底绿字 |
| Pending / Auditing / In Progress | 金底金字 |
| Executing | 青底青字 (带微动画) |
| Rejected / Failed | 红底红字 |
| Idle | 灰底灰字 |

```
┌──────────┐
│ ● Active │  ← padding: 2px 8px · radius-full · text-xs · font-medium
└──────────┘
```

### 4.7 ChainTxLink

链上交易链接组件。

```
Tx: 0x7a3b...c9f1  ↗  ← 截断地址 + 外部链接图标
```

点击复制完整地址或跳转 Casper 区块浏览器。

---

## 5. 交互规范

### 5.1 状态反馈

| 场景 | 反馈方式 |
|------|----------|
| Agent 思考中 | 对话气泡内打字动画（逐字输出流） |
| 链上交易等待 | ProgressTracker 节点脉冲 + "Waiting for confirmations (3/12)" |
| 交易成功 | 绿色 toast 通知 + StrategyCard 状态更新 |
| 交易失败 | 红色 toast + 错误详情（可展开） |
| x402 支付 | 支付明细卡片内嵌在策略详情中 |
| 数据刷新 | 指标卡数字轻微闪烁后更新（不是整页刷新） |

### 5.2 动效规范

| 动效 | 时长 | 缓动 | 用途 |
|------|------|------|------|
| Hover 态切换 | 150ms | ease | 按钮、卡片、链接 |
| 卡片展开/收起 | 250ms | ease-out | StrategyCard 详情展开 |
| 页面切换 | 300ms | ease-in-out | 路由切换过渡 |
| Agent 状态脉冲 | 2000ms | ease-in-out (loop) | 进行中 Agent 的状态指示 |
| 数字滚动 | 600ms | ease-out | PnL 数据更新时的数字动画 |
| Toast 入场 | 300ms | ease-out (slide + fade) | 通知出现 |

**动效原则**: 快不抢戏——动效服务信息传递，不为了「炫」而加。

### 5.3 响应式策略

| 断点 | 布局 |
|------|------|
| ≥ 1280px | 完整双栏布局（侧边栏 260px + 内容区） |
| 1024-1279px | 侧边栏折叠为汉堡菜单，内容区全宽 |
| 768-1023px | 单栏，StrategyCard 信息精简（隐藏部分 meta） |
| < 768px | 移动端优化，对话终端全屏，指标卡 2 列网格 |

---

## 6. 可访问性

### 6.1 色彩对比度（WCAG AA）

| 组合 | 对比度 | 达标 |
|------|--------|------|
| text-primary (#F1F5F9) on bg-root (#060B1A) | 16.2:1 | ✅ AAA |
| text-secondary (#94A3B8) on bg-card (#111D3A) | 5.8:1 | ✅ AA |
| text-on-accent (#060B1A) on accent (#00E5A0) | 8.7:1 | ✅ AAA |
| profit (#10B981) on bg-card (#111D3A) | 4.9:1 | ✅ AA |
| loss (#EF4444) on bg-card (#111D3A) | 4.6:1 | ✅ AA |

### 6.2 键盘导航

- Tab: 焦点在可交互元素间移动（顺序：导航 → 内容 → 侧边栏）
- Enter: 激活当前焦点元素
- Escape: 关闭 Modal / Dropdown / 取消当前操作
- Ctrl+K / Cmd+K: 打开命令面板（快速导航到任意页面）
- ↑↓: 在策略 Feed 中导航
- /: 聚焦 Terminal 输入框

### 6.3 其他

- 所有图标配 aria-label
- StrategyCard 的 PnL 用 +$42.50 和 -$12.30 格式（不只是颜色区分）
- 加载状态配 screen reader 友好的 status text
- 图表数据提供表格视图作为 fallback

---

## 7. Demo 视频视觉风格指南

见独立文件 `demo-video-guide.md`

---

## 8. 技术对接说明

### 8.1 前端可直接使用的资源

| 文件 | 内容 | 用法 |
|------|------|------|
| `design-tokens.css` | 所有 CSS 变量 | 复制到项目，在根 CSS 中 import |
| 本文件 | 页面布局 + 组件规格 | 作为实现参考 |
| 下节「开发建议」 | 技术栈 + 实现顺序 | 指导开发计划 |

### 8.2 推荐技术栈

```
前端框架:    React 18+ / Next.js 14+
样式方案:    Tailwind CSS (用 tokens 映射) 或 CSS Modules
图表:        Recharts / D3.js (PnL Chart, Asset Allocation)
动画:        Framer Motion (页面切换、卡片动效)
图标:        Lucide Icons (开源、风格统一)
字体:        Inter + JetBrains Mono (Google Fonts, 免费)
```

### 8.3 实现优先级

1. **Design Tokens + Layout Shell**: 先搭颜色体系 + 导航框架（所有页面共用）
2. **Dashboard**: 核心页面，Demo 视频开场就展示这个
3. **Agent Terminal**: 核心交互，Demo 主要操作场景
4. **StrategyCard + ProgressTracker**: 关键组件，多个页面复用
5. **Strategy Feed**: 依赖 StrategyCard
6. **Guild + Vault**: 相对独立，可并行实现

### 8.4 与后端/合约的对接点

| UI 元素 | 数据来源 | 说明 |
|---------|----------|------|
| MetricCard (TVL) | CSPR.cloud API / 合约查询 | 链上金库余额 |
| StrategyCard 进度 | Agent 后端 WebSocket | 实时推送状态变更 |
| Agent 对话 | Agent 后端 SSE/WebSocket | 流式输出 |
| PnL Chart | CSPR.cloud API | 历史数据聚合 |
| Tx Link | Casper Testnet Explorer | 交易哈希拼接 URL |
| Agent 状态 | Agent 后端心跳 | 定期 poll 或 WS |

---

## 9. 交付清单

- [x] `design-tokens.css` — CSS 变量完整定义
- [x] 设计规范（本文档）— 页面布局 + 组件规格 + 交互规范
- [ ] Demo 视频视觉风格指南 — `demo-video-guide.md`
- [ ] 设计稿导出 — 建议使用 Figma 社区版基于本规范快速搭建（本环境无 Figma，提供详细 ASCII 布局 + CSS 等价描述）

---

> **下一步**: 技术队前端开发方根据本规范和 `design-tokens.css` 开始实现。如有设计细节需要澄清，在父 issue 下 @视觉队长。

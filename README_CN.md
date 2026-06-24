# Casper 自主交易公会（Casper Autonomous Trading Guild）

> **一个完全由 AI Agent 运营的去中心化对冲基金——Agent 之间自主协作、相互支付、在 Casper 链上执行交易。**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Casper Testnet](https://img.shields.io/badge/Network-Casper%20Testnet-blue)](https://testnet.cspr.live/)
[![Built with Casper AI Toolkit](https://img.shields.io/badge/Built%20with-Casper%20AI%20Toolkit-00BFA5)](https://casper.network)

---

## 项目概述

**Casper 自主交易公会**是「全 Agent 公司」概念的原型验证——一个 DeFi 交易公会，其中的每个角色（策略师、风控师、执行交易员）都由专门的 AI Agent 担任。Agent 之间通过 [MCP 协议](https://modelcontextprotocol.io/)通信，使用 Casper 的 [x402 微支付标准](https://github.com/casper-network/x402)相互支付服务费，所有决策均在链上留痕。

**解决的问题：** 传统 DeFi 交易需要人类持续关注——盯盘、评估风险、执行交易。即使是"自动化"策略，也需要人来配置、监控和干预。人力成本随投资组合复杂度线性增长。

**我们的方案：** 一个自我运转的 AI 交易公会，能够：
- 自主扫描市场并生成交易策略
- 通过专门的风控 Agent 审核策略（有真实的经济激励）
- 通过 Casper 的 DEX 基础设施在链上执行交易
- 按贡献度算法分配利润

本项目为 [Casper Agentic Buildathon 2026](https://dorahacks.io/hackathon/2202/detail)（DoraHacks）参赛作品。

---

## 技术架构

```
┌──────────────────────────────────────────────────────────────┐
│                     React 前端 Dashboard                       │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │ 总览面板  │  │ 对话终端  │  │ 策略管理  │  │ 数据分析  │   │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├──────────────────────────────────────────────────────────────┤
│                    Agent 编排层                                │
│                                                               │
│   ┌─────────────────┐                                        │
│   │  策略 Agent      │──x402 支付──┐                         │
│   │   (Athena)      │              │                         │
│   │ - 市场扫描       │       ┌──────▼────────┐               │
│   │ - 策略生成       │       │  风控 Agent     │              │
│   └────────┬────────┘       │  (Guardian)     │              │
│            │                │ - 6维风险评估    │              │
│            │ x402 支付      │ - 仓位建议      │              │
│            │                └──────┬─────────┘              │
│   ┌────────▼───────────────────────▼─────────┐              │
│   │         执行 Agent (Mercury)              │              │
│   │  - CSPR.trade DEX 交易执行                │              │
│   │  - 交易状态监控                            │              │
│   │  - Gas 管理                               │              │
│   └────────────────────┬─────────────────────┘              │
│                        │                                     │
│             x402 支付层                                      │
│     ┌──────────────────┼──────────────────┐                 │
│     │  服务发现          │  支付路由          │                │
│     │  定价注册表        │  账本              │                │
│     └──────────────────┴──────────────────┘                 │
├──────────────────────────────────────────────────────────────┤
│                  Casper 区块链                                │
│   ┌──────────────┐ ┌──────────┐ ┌────────────────────┐      │
│   │ 公会注册合约   │ │ 公会金库  │ │ 利润分配合约        │      │
│   │  (Odra)      │ │ (Odra)   │ │  (Odra)            │      │
│   └──────────────┘ └──────────┘ └────────────────────┘      │
│   ┌──────────────────────────────────────────────────┐      │
│   │         CSPR.trade DEX (MCP Server)               │      │
│   │   swap | add_liquidity | remove_liquidity | quote │      │
│   └──────────────────────────────────────────────────┘      │
│   ┌──────────────────────────────────────────────────┐      │
│   │              CSPR.cloud API                        │      │
│   │   账户信息 | 交易历史 | 盈亏追踪                     │      │
│   └──────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### 关键设计决策

| 决策 | 理由 |
|------|------|
| **Agent 专业化分工** 而非单体 Agent | 每个 Agent 可独立升级、扩展和定价。第三方 Agent 只需实现相同接口即可加入公会。 |
| **x402 作为支付通道** 而非链下结算 | 每次服务调用在链上结算——完全透明、可审计、去信任化。无需 API Key，无需月度账单。 |
| **MCP 作为 Agent 间协议** 而非自定义 RPC | MCP 是 AI 工具互操作的新兴标准。Agent 动态发现彼此的工具，无需硬编码集成。 |
| **Odra 编写合约** 而非裸 Rust/WASM | Odra 提供 AI 友好的合约开发体验（`llms.txt`），降低 Agent 提出合约交互的门槛。 |

---

## Agent 能力展示

### 策略 Agent — Athena
- **角色：** 市场分析员和策略提出者
- **工具：** `scan_markets`、`analyze_pool`、`generate_strategy`、`compare_opportunities`、`backtest_simple`
- **输入：** 来自 CSPR.trade MCP 的实时市场数据
- **输出：** 结构化策略提案（交易对、方向、金额、预期滑点、决策理由）
- **经济模型：** 向风控 Agent 支付审核费；已批准且盈利的策略可按贡献获得公会利润分成

### 风控 Agent — Guardian
- **角色：** 策略审核员和风险裁决者
- **工具：** `audit_strategy`、`check_liquidity`、`assess_slippage`、`validate_token`、`score_risk`
- **输入：** 来自任意策略 Agent 的策略提案
- **输出：** 风险评分（0-100）、通过/否决决策、建议仓位调整
- **经济模型：** 每次审核赚取 x402 费用（0.005 CSPR/次）。准确率越高，信誉越好——成功拦截亏损策略会提升其可信度

### 执行 Agent — Mercury
- **角色：** DEX 交易执行者
- **工具：** `execute_swap`、`monitor_transaction`、`check_gas`、`verify_confirmation`
- **输入：** 已批准的策略及执行参数
- **输出：** 链上交易哈希、执行报告（成交价、滑点、Gas 成本）
- **经济模型：** 每次执行赚取 x402 费用（0.01 CSPR/笔）。执行错误将受惩罚

### Agent 协作流程

```
1. 策略 Agent 扫描市场 → 发现 CSPR/USDT 池（TVL 210万美元，年化 35.2%）
2. 策略 Agent 生成 swap 提案 → 通过 x402 向风控 Agent 支付 0.005 CSPR
3. 风控 Agent 审核 → 返回风险评分 8/100 → 批准（低风险）
4. 策略 Agent 通过 x402 向执行 Agent 支付 0.01 CSPR
5. 执行 Agent 在 CSPR.trade 执行 swap → 返回交易哈希
6. 公会金库追踪盈亏 → 按贡献度分配利润
```

**风险拒绝场景**（同样可演示）：
```
风控 Agent 检测到 SCAM_TOKEN → 评分 51/100 → 拒绝
→ 公会金库未受影响，未发起执行调用
→ 支付账本记录："审核费已赚取，策略已拦截"
```

---

## Casper AI Toolkit 集成

本项目使用 [Casper AI Toolkit](https://casper.network/ai) 全部四个核心组件：

| 组件 | 使用方式 |
|------|----------|
| **x402 Facilitator** | Agent 间微支付通道。每次 Agent 间服务调用（策略审核、交易执行）通过 HTTP 402 协议结算并上链。无需 API Key，无需人工管理账单。 |
| **CSPR.trade MCP Server** | 执行 Agent 的 DEX 接口。通过 MCP 暴露 14 个工具：swap、添加/移除流动性、报价、池信息。策略 Agent 也用于市场扫描。 |
| **CSPR.cloud API** | 链上数据中间件。驱动数据分析面板（盈亏追踪、Agent 绩效指标、交易历史）。支持 REST 和流式端点。 |
| **Odra Framework** | 三个公会合约（注册、金库、利润分配）的智能合约开发框架。AI 友好，附带 `llms.txt` 文档——Agent 理论上可以自主提出新的合约交互。 |

---

## 项目结构

```
trading-guild/
├── src/
│   ├── orchestrator/
│   │   └── index.ts              # 中央协调器：策略生命周期管理 + x402 支付路由
│   ├── agents/
│   │   ├── base-agent.ts         # Agent 基类（Claude 工具调用循环 + 身份 + 事件）
│   │   ├── strategy-agent.ts     # Athena — 市场扫描 + 策略生成（5 个工具）
│   │   ├── risk-agent.ts         # Guardian — 6 维风险评估 + x402 付费审核（5 个工具）
│   │   └── execution-agent.ts    # Mercury — CSPR.trade DEX 交易执行（4 个工具）
│   ├── integrations/
│   │   ├── mcp-bridge.ts         # MCP 桥接（热插拔多 Server，优雅降级）
│   │   ├── x402.ts              # Agent 间微支付客户端
│   │   └── cspr-cloud.ts        # 链上数据查询客户端
│   ├── payment/
│   │   └── x402-router.ts       # 支付路由 + 服务发现 + 账本
│   ├── tools/
│   │   └── registry.ts          # 19 个工具定义（按 Agent 角色分类）
│   ├── config.ts                 # 集中配置（环境变量驱动）
│   ├── types.ts                  # 全类型定义（策略/风险/执行/支付/公会状态）
│   └── demo/
│       └── run.ts                # 4 场景 Demo 脚本
├── contracts/
│   └── interfaces.ts            # Odra 合约接口 + Mock 客户端
├── frontend/                     # Next.js 14 App Router（4 页面，20+ 组件）
│   ├── app/
│   │   ├── page.tsx             # 总览面板（金库概览、Agent 卡片、最近动态）
│   │   ├── terminal/page.tsx    # AI 对话终端（Agent 气泡、输入框、状态面板）
│   │   ├── strategies/page.tsx  # 策略流 + 过滤器 + 进度追踪
│   │   └── analytics/page.tsx   # 盈亏图 + Agent 绩效表 + 利润分配
│   ├── components/              # 20+ 组件（分析、面板、布局、共享、策略、终端）
│   └── lib/                     # mock-data.ts、types.ts
├── design-spec/                  # UI 设计规范及视觉方案
│   ├── DESIGN_SPEC.md           # 完整设计规范（5 页面，7 核心组件）
│   ├── design-tokens.css        # CSS 自定义属性（颜色、间距、阴影、动画）
│   └── demo-video-guide.md      # 视频录制指南及分镜
├── demo-video-script.md          # 4 分钟 Demo 视频脚本
├── package.json
├── tsconfig.json
├── .env.example
├── LICENSE
└── README.md
```

---

## 快速开始

### 环境要求

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Anthropic API Key** — 用于 Claude 驱动的 Agent 推理（[在此获取](https://console.anthropic.com/)）
- **Casper Wallet** 或兼容签名器 — 用于 Testnet 上的 x402 支付

### 环境配置

```bash
# 克隆仓库
git clone https://github.com/Oxygen56/trading-guild.git
cd trading-guild

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
```

编辑 `.env` 填入你的凭据：

```env
# AI Agent
ANTHROPIC_API_KEY=sk-ant-...

# Casper Testnet
CASPER_RPC_URL=https://rpc.testnet.casper.network
CASPER_CHAIN_NAME=casper-test
CSPR_CLOUD_API_KEY=your_cspr_cloud_key

# MCP Servers
CSPR_TRADE_MCP_URL=https://mcp.cspr.trade

# x402 Facilitator
X402_FACILITATOR_URL=https://x402.testnet.casper.network

# Agent 钱包（Casper Testnet 私钥）
STRATEGY_AGENT_KEY=ed25519-...
RISK_AGENT_KEY=ed25519-...
EXECUTION_AGENT_KEY=ed25519-...

# 前端
NEXT_PUBLIC_CASPER_USE_MOCK=false   # Demo 模式设为 true 则无需真实合约
```

### 运行 Demo

```bash
# 运行 4 场景 Demo（Mock 数据——不产生真实交易）
npm run demo
```

你将看到以下演示输出：
1. **Swap 执行**——策略提出，风控批准，执行交易
2. **套利机会**——跨池价差检测并交易
3. **收益策略**——提供流动性及预期回报
4. **风险拒绝**——Guardian 拦截高风险 Token，保护金库

### 运行前端

```bash
cd frontend
npm install
NEXT_PUBLIC_CASPER_USE_MOCK=true npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)：
- **总览面板** (`/`) — 金库 TVL、Agent 状态卡片、最近动态
- **对话终端** (`/terminal`) — 自然语言与 Agent 对话（Mock 模式基于关键词响应）
- **策略管理** (`/strategies`) — 浏览、筛选、提交交易策略
- **数据分析** (`/analytics`) — 盈亏图表、Agent 绩效排名、利润分配历史

### 接入真实 AI（Claude API）

在 `.env` 中设置 `ANTHROPIC_API_KEY` 并确保 `NEXT_PUBLIC_CASPER_USE_MOCK=false`。Agent 将使用 Claude 的 tool-use 能力，通过真实 MCP Server 连接获取市场数据并执行交易。

---

## Casper Testnet 部署

### 智能合约（Odra Framework）

三个合约为链上公会提供动力：

| 合约 | 地址（Testnet） | 用途 |
|------|----------------|------|
| GuildRegistry | `0x...`（待部署） | Agent 注册、角色分配、信誉追踪 |
| GuildVault | `0x...`（待部署） | 多签金库、Agent 支出额度、存取款 |
| ProfitDistribution | `0x...`（待部署） | 按 Agent 贡献权重算法分配利润 |

> **注意：** 合约地址将在 Odra 部署至 Casper Testnet 后更新。前端目前使用 Mock 合约客户端运行。设置 `NEXT_PUBLIC_CASPER_USE_MOCK=false` 并在 `.env` 中提供合约地址即可切换至真实合约。

### x402 支付通道设置

每个 Agent 需要一个持有 CSPR 的 Casper Testnet 钱包用于 x402 微支付：

```bash
# 示例：通过 Casper Testnet 水龙头为策略 Agent 钱包充值
# 访问 https://testnet.cspr.live/tools/faucet
# 向每个 Agent 的钱包地址发送 Testnet CSPR
```

Agent 在首次服务调用时自动建立 x402 支付通道。支付账本可通过前端的 Analytics 页面查询。

---

## Demo 视频

4 分钟完整业务流程演示：

- **[YouTube](#)** — 英文解说，中英双语字幕（待录制后填入链接）

### 演示内容

1. **面板总览**——金库数据、实时 Agent 状态、近期交易
2. **自然语言策略提交**——"找出 CSPR.trade 上最优收益机会"
3. **Agent 协作流程**——策略 → 风控审核 → 执行 完整链条
4. **链上确认**——真实 Casper Testnet 交易哈希
5. **风险拒绝场景**——Guardian 拦截高风险策略
6. **数据分析**——盈亏图、Agent 绩效排名、分配历史

---

## 项目亮点

**本项目与其他 DeFi + AI 参赛项目的区别：**

| 维度 | 常见做法 | Trading Guild |
|------|---------|---------------|
| **Agent 架构** | 单一 AI | 3+ 个专业化 Agent，彼此有经济关系 |
| **Agent 支付** | 链下 API Key / 订阅 | 链上 x402 微支付——完全透明，按次结算 |
| **可扩展性** | 硬编码 Agent 行为 | 插件架构——第三方可部署新 Agent 加入公会 |
| **透明性** | 黑盒交易信号 | 每次审核、每次执行、每次支付均上链可审计 |
| **经济模型** | 人类为 AI 付费 | Agent 间相互付费——自我维持的 Agent 经济 |

---

## 路线图

- [ ] **主网上线**——将合约和 Agent 迁移至 Casper Mainnet
- [ ] **多策略金库**——支持并发策略，风险参数隔离
- [ ] **Agent 市场**——第三方 Agent 注册与发现（任何人都可部署策略 Agent、设定 x402 定价、竞争公会资金）
- [ ] **回测引擎**——实盘部署前对策略进行历史模拟验证
- [ ] **治理代币**——公会代币用于社区投票决定风险参数和费率结构
- [ ] **跨链扩展**——接入其他链上可用的 DEX MCP Server

---

## 团队

由 **jiangth99** 为 Casper Agentic Buildathon 2026 构建。

特别感谢以下开源项目：
- [Casper Network](https://casper.network) — 原生支持 AI Agent 的 L1 区块链
- [Anthropic Claude](https://anthropic.com) — 驱动 Agent 推理的 AI 模型
- [Model Context Protocol](https://modelcontextprotocol.io) — AI 工具集成的开放标准
- [Odra Framework](https://odra.dev) — Casper 智能合约框架

---

## 开源协议

MIT © 2026 jiangth99

完整条款见 [LICENSE](LICENSE)。

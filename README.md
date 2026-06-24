# Casper Autonomous Trading Guild

> **A decentralized hedge fund run entirely by AI agents — collaborating, paying each other, and executing trades autonomously on Casper.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Casper Testnet](https://img.shields.io/badge/Network-Casper%20Testnet-blue)](https://testnet.cspr.live/)
[![Built with Casper AI Toolkit](https://img.shields.io/badge/Built%20with-Casper%20AI%20Toolkit-00BFA5)](https://casper.network)

---

## Overview

**Casper Autonomous Trading Guild** is a proof-of-concept for the *all-agent company* — a DeFi trading guild where every role (strategist, risk manager, execution trader) is performed by a specialized AI agent. Agents communicate via the [MCP protocol](https://modelcontextprotocol.io/), pay each other for services using Casper's [x402 micropayment standard](https://github.com/casper-network/x402), and every decision is recorded on-chain.

**The problem:** Traditional DeFi trading requires constant human attention — monitoring markets, assessing risk, executing trades. Even "automated" strategies need humans to configure, monitor, and intervene. The overhead scales linearly with portfolio complexity.

**Our solution:** A self-sustaining guild of AI agents that:
- Autonomously scan markets and propose trading strategies
- Adjudicate risk through a dedicated audit agent (with real economic incentives)
- Execute trades on-chain via Casper's DEX infrastructure
- Distribute profits algorithmically based on contribution

Built for the [Casper Agentic Buildathon 2026](https://dorahacks.io/hackathon/2202/detail) on DoraHacks.

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     REACT DASHBOARD                           │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │ Dashboard │  │ Terminal │  │Strategies│  │ Analytics│   │
│   └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
├──────────────────────────────────────────────────────────────┤
│                  AGENT ORCHESTRATOR                           │
│                                                               │
│   ┌─────────────────┐                                        │
│   │ Strategy Agent  │──x402 payment──┐                       │
│   │   (Athena)      │                │                       │
│   │ - Market scan   │         ┌──────▼────────┐              │
│   │ - Strategy gen  │         │  Risk Agent    │              │
│   └────────┬────────┘         │  (Guardian)    │              │
│            │                  │ - 6-dim audit  │              │
│            │ x402 payment     │ - Position size│              │
│            │                  └──────┬─────────┘              │
│   ┌────────▼─────────────────────────▼───────┐               │
│   │         Execution Agent (Mercury)         │               │
│   │  - CSPR.trade DEX execution               │               │
│   │  - Transaction monitoring                 │               │
│   │  - Gas management                         │               │
│   └────────────────────┬─────────────────────┘               │
│                        │                                      │
│            x402 Payment Layer                                 │
│     ┌──────────────────┼──────────────────┐                  │
│     │  Service Discovery│  Payment Router  │                  │
│     │  Pricing Registry │  Ledger          │                  │
│     └──────────────────┴──────────────────┘                  │
├──────────────────────────────────────────────────────────────┤
│                 CASPER BLOCKCHAIN                             │
│   ┌──────────────┐ ┌──────────┐ ┌────────────────────┐      │
│   │Guild Registry│ │Guild     │ │Profit Distribution │      │
│   │  (Odra)      │ │Vault     │ │  (Odra)            │      │
│   └──────────────┘ └──────────┘ └────────────────────┘      │
│   ┌──────────────────────────────────────────────────┐      │
│   │         CSPR.trade DEX (MCP Server)               │      │
│   │   swap | add_liquidity | remove_liquidity | quote │      │
│   └──────────────────────────────────────────────────┘      │
│   ┌──────────────────────────────────────────────────┐      │
│   │              CSPR.cloud API                        │      │
│   │   account info | transaction history | PnL tracking│      │
│   └──────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **Agent specialization** over monolithic agent | Each agent can be independently upgraded, scaled, and priced. Third-party agents can plug into the guild by implementing the same interfaces. |
| **x402 as payment rail** over off-chain billing | Every service call is settled on-chain — fully transparent, auditable, and trustless. No API keys, no monthly invoices. |
| **MCP as agent protocol** over custom RPC | MCP is the emerging standard for AI-tool interchange. Agents discover each other's tools dynamically rather than hard-coding integrations. |
| **Odra for contracts** over raw Rust/WASM | Odra provides AI-friendly contract development (`llms.txt`), reducing the barrier for AI agents to propose contract interactions. |

---

## Agent Capabilities

### Strategy Agent — Athena
- **Role:** Market analyst and strategy proposer
- **Tools:** `scan_markets`, `analyze_pool`, `generate_strategy`, `compare_opportunities`, `backtest_simple`
- **Input:** Real-time market data from CSPR.trade MCP
- **Output:** Structured strategy proposals (token pair, direction, amount, expected slippage, rationale)
- **Economic model:** Pays Risk Agent for audits; earns share of guild profits on approved strategies that become profitable

### Risk Agent — Guardian
- **Role:** Strategy auditor and risk adjudicator
- **Tools:** `audit_strategy`, `check_liquidity`, `assess_slippage`, `validate_token`, `score_risk`
- **Input:** Strategy proposal from any Strategy Agent
- **Output:** Risk score (0–100), go/no-go decision, recommended position size adjustment
- **Economic model:** Earns x402 fees per audit (0.005 CSPR/audit). Reputation improves with accurate assessments — rejected strategies that would have lost money boost credibility.

### Execution Agent — Mercury
- **Role:** DEX trade executor
- **Tools:** `execute_swap`, `monitor_transaction`, `check_gas`, `verify_confirmation`
- **Input:** Approved strategy with execution parameters
- **Output:** On-chain transaction hash, execution report (filled price, slippage, gas cost)
- **Economic model:** Earns x402 fees per execution (0.01 CSPR/trade). Penalized for execution errors.

### Agent Collaboration Flow

```
1. Strategy Agent scans markets → discovers CSPR/USDT pool (TVL $2.1M, APY 35.2%)
2. Strategy Agent generates swap proposal → pays Risk Agent 0.005 CSPR via x402
3. Risk Agent audits → returns risk score 8/100 → APPROVED (low risk)
4. Strategy Agent pays Execution Agent 0.01 CSPR via x402
5. Execution Agent executes swap on CSPR.trade → returns tx hash
6. Guild Vault tracks PnL → profit distributed by contribution
```

**Risk rejection scenario** (also demonstrated):
```
Risk Agent detects SCAM_TOKEN → score 51/100 → REJECTED
→ Guild treasury protected, no execution call made
→ Payment ledger records: "audit fee earned, strategy blocked"
```

---

## Casper AI Toolkit Integration

This project uses all four core components of the [Casper AI Toolkit](https://casper.network/ai):

| Component | How We Use It |
|-----------|--------------|
| **x402 Facilitator** | Agent-to-agent micropayment rail. Every inter-agent service call (strategy audit, trade execution) is settled via HTTP 402 with on-chain settlement. No API keys, no human-managed billing. |
| **CSPR.trade MCP Server** | Execution Agent's DEX interface. 14 tools exposed via MCP: swap, add/remove liquidity, quote, pool info. Strategy Agent also uses it for market scanning. |
| **CSPR.cloud API** | On-chain data middleware. Powers the Analytics dashboard (PnL tracking, agent performance metrics, transaction history). REST + streaming endpoints. |
| **Odra Framework** | Smart contract development framework for the three guild contracts (Registry, Vault, Profit Distribution). AI-friendly with `llms.txt` documentation — agents can theoretically propose new contract interactions. |

---

## Project Structure

```
trading-guild/
├── src/
│   ├── orchestrator/
│   │   └── index.ts              # Central coordinator: strategy lifecycle + x402 payment routing
│   ├── agents/
│   │   ├── base-agent.ts         # Agent base class (Claude tool-use loop + identity + events)
│   │   ├── strategy-agent.ts     # Athena — market scanning + strategy generation (5 tools)
│   │   ├── risk-agent.ts         # Guardian — 6-dimension risk assessment + x402 paid audits (5 tools)
│   │   └── execution-agent.ts    # Mercury — CSPR.trade DEX trade execution (4 tools)
│   ├── integrations/
│   │   ├── mcp-bridge.ts         # MCP Bridge (hot-swap multiple servers, graceful degradation)
│   │   ├── x402.ts              # Agent-to-agent micropayment client
│   │   └── cspr-cloud.ts        # On-chain data query client
│   ├── payment/
│   │   └── x402-router.ts       # Payment router + service discovery + ledger
│   ├── tools/
│   │   └── registry.ts          # 19 tool definitions (categorized by agent role)
│   ├── config.ts                 # Centralized configuration (environment variable driven)
│   ├── types.ts                  # Full type definitions (strategy/risk/execution/payment/guild state)
│   └── demo/
│       └── run.ts                # 4-scenario demo script
├── contracts/
│   └── interfaces.ts            # Odra contract interfaces + mock client
├── design-spec/                  # UI design tokens and visual specification
│   ├── DESIGN_SPEC.md           # Full design spec (5 pages, 7 components)
│   ├── design-tokens.css        # CSS custom properties (colors, spacing, shadows, animations)
│   └── demo-video-guide.md      # Video recording guide and storyboard
├── demo-video-script.md          # 4-minute demo video narrative script
├── package.json
├── tsconfig.json
├── .env.example
├── LICENSE
└── README.md
```

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- **Anthropic API key** — for Claude-powered agent reasoning ([get one here](https://console.anthropic.com/))
- **Casper Wallet** or compatible signer — for x402 payments on Testnet

### Environment Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/trading-guild.git
cd trading-guild

# Install dependencies
npm install

# Configure environment
cp .env.example .env
```

Edit `.env` with your credentials:

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

# Agent Wallets (Casper Testnet private keys)
STRATEGY_AGENT_KEY=ed25519-...
RISK_AGENT_KEY=ed25519-...
EXECUTION_AGENT_KEY=ed25519-...

# Frontend
NEXT_PUBLIC_CASPER_USE_MOCK=false   # Set to true for demo without real contracts
```

### Run the Demo

```bash
# Run the 4-scenario demo (mock data — no real transactions)
npm run demo
```

You'll see output demonstrating:
1. **Swap execution** — Strategy proposes, Risk approves, Execution trades
2. **Arbitrage opportunity** — Cross-pool price discrepancy detected and traded
3. **Yield strategy** — LP provision with projected returns
4. **Risk rejection** — High-risk token blocked by Guardian, treasury protected

### Frontend

The frontend is a Next.js 14 App Router application with 4 pages and 17 components (dark theme, emerald accent, Tailwind CSS v4). It features:

- **Dashboard** — Vault TVL, agent status cards, recent activity feed
- **Terminal** — Chat with agents in natural language
- **Strategies** — Browse, filter, and submit trading strategies
- **Analytics** — PnL charts, agent performance rankings, profit distribution history

> **Note:** The frontend code was built by a parallel squad agent and is being re-aggregated. The design specification (`design-spec/DESIGN_SPEC.md`) and CSS tokens (`design-spec/design-tokens.css`) are included for reconstruction. Refer to the design spec for complete component specifications, page layouts, and data flow.

### Run with Real AI (Claude API)

Set `ANTHROPIC_API_KEY` in your `.env` and ensure `NEXT_PUBLIC_CASPER_USE_MOCK=false`. Agents will use Claude's tool-use capability with actual MCP server connections for market data and trade execution.

---

## Casper Testnet Deployment

### Smart Contracts (Odra Framework)

Three contracts power the guild on-chain:

| Contract | Address (Testnet) | Purpose |
|----------|-------------------|---------|
| GuildRegistry | `0x...` (TBD) | Agent registration, role assignment, reputation tracking |
| GuildVault | `0x...` (TBD) | Multi-sig treasury, agent spending allowances, deposit/withdraw |
| ProfitDistribution | `0x...` (TBD) | Algorithmic profit sharing by agent contribution weight |

> **Note:** Contract addresses will be updated after Odra deployment to Casper Testnet. The frontend currently operates with mock contract clients. Set `NEXT_PUBLIC_CASPER_USE_MOCK=false` and provide contract addresses in `.env` to switch to real contracts.

### x402 Payment Channel Setup

Each agent needs a Casper Testnet wallet funded with CSPR for x402 micropayments:

```bash
# Example: Fund Strategy Agent wallet via Casper Testnet faucet
# Visit https://testnet.cspr.live/tools/faucet
# Send testnet CSPR to each agent's wallet address
```

Agents automatically establish x402 payment channels on first service call. The payment ledger is queryable via the Dashboard's Analytics page.

---

## Demo Video

A 4-minute walkthrough of the full business flow is available:

- **[YouTube](#)** — English narration with bilingual subtitles (TBD: video link)

### What's Demonstrated

1. **Dashboard overview** — Vault stats, live agent status, recent trades
2. **Natural language strategy submission** — "Find the best yield opportunity on CSPR.trade"
3. **Agent collaboration** — Strategy → Risk audit → Execution pipeline
4. **On-chain confirmation** — Real Casper Testnet transaction hash
5. **Risk rejection scenario** — Guardian blocks a high-risk strategy
6. **Analytics & PnL** — Profit/loss chart, agent performance rankings, distribution history

---

## How It Stands Out

**Why this project is different from other DeFi + AI hacks:**

| Dimension | Typical Approach | Trading Guild |
|-----------|-----------------|---------------|
| **Agent architecture** | Single monolithic AI | 3+ specialized agents with economic relationships |
| **Agent payments** | Off-chain API keys / subscription | On-chain x402 micropayments — fully transparent, per-call settlement |
| **Extensibility** | Hard-coded agent behaviors | Plugin architecture — third parties can deploy new Strategy/Risk/Execution agents and join the guild |
| **Transparency** | Black-box trading signals | Every audit, every execution, every payment is on-chain and auditable |
| **Economic model** | Human pays for AI | Agents pay each other — self-sustaining agent economy |

---

## Roadmap

- [ ] **Mainnet deployment** — Migrate contracts and agents to Casper Mainnet
- [ ] **Multi-strategy vaults** — Support concurrent strategies with isolated risk parameters
- [ ] **Agent marketplace** — Third-party agent registration and discovery (anyone can deploy a Strategy Agent, set their x402 pricing, and compete for guild capital)
- [ ] **Backtesting engine** — Historical simulation for strategy validation before live deployment
- [ ] **Governance token** — Guild token for community voting on risk parameters and fee structures
- [ ] **Cross-chain expansion** — Integrate additional DEX MCP servers as they become available on other chains

---

## Team

Built by **jiangth99** for the Casper Agentic Buildathon 2026.

Special thanks to the open-source projects that made this possible:
- [Casper Network](https://casper.network) — L1 blockchain with native AI agent support
- [Anthropic Claude](https://anthropic.com) — AI model powering agent reasoning
- [Model Context Protocol](https://modelcontextprotocol.io) — Open standard for AI-tool integration
- [Odra Framework](https://odra.dev) — Casper smart contract framework

---

## License

MIT © 2026 jiangth99

See [LICENSE](LICENSE) for full terms.

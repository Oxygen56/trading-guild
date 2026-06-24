import {
  AgentInfo,
  Strategy,
  VaultMetrics,
  AssetAllocation,
  ChatMessage,
  Transaction,
  DistributionRecord,
  PnLDataPoint,
  AgentPerformance,
  StrategyStep,
} from "./types";

// ─── Vault Metrics ───────────────────────────────────────────

export const mockVaultMetrics: VaultMetrics = {
  tvl: 12450,
  tvlUsd: 2490,
  pnl24h: 398,
  pnl24hPercent: 3.2,
  activeAgents: 3,
  guildMembers: 5,
};

// ─── Agents ──────────────────────────────────────────────────

export const mockAgents: AgentInfo[] = [
  {
    id: "agent-0x7a3b",
    name: "Athena",
    role: "strategy",
    status: "idle",
    lastAction: "2 min ago",
    strategiesCount: 25,
    successRate: 84,
    totalPnl: 1240,
    avatar: "🧠",
    color: "agent-strategy",
  },
  {
    id: "agent-0x3d5e",
    name: "Guardian",
    role: "risk",
    status: "auditing",
    lastAction: "5 min ago",
    strategiesCount: 37,
    successRate: 81,
    totalPnl: 5.5,
    avatar: "🛡️",
    color: "agent-risk",
  },
  {
    id: "agent-0xb8a1",
    name: "Mercury",
    role: "execution",
    status: "idle",
    lastAction: "15 min ago",
    strategiesCount: 20,
    successRate: 100,
    totalPnl: 0,
    avatar: "⚡",
    color: "agent-execution",
  },
];

// ─── Asset Allocation ────────────────────────────────────────

export const mockAssetAllocation: AssetAllocation[] = [
  { name: "Casper", symbol: "CSPR", amount: 5602, percentage: 45, color: "#00E5A0" },
  { name: "Tether", symbol: "USDT", amount: 3735, percentage: 30, color: "#3B82F6" },
  { name: "CSPR-LP", symbol: "CSPR-LP", amount: 2490, percentage: 20, color: "#6366F1" },
  { name: "Other", symbol: "OTHER", amount: 623, percentage: 5, color: "#64748B" },
];

// ─── PnL Data ────────────────────────────────────────────────

export const mockPnlData: PnLDataPoint[] = [
  { date: "Jun 18", value: 11800 },
  { date: "Jun 19", value: 12050 },
  { date: "Jun 20", value: 11920 },
  { date: "Jun 21", value: 12200 },
  { date: "Jun 22", value: 12480 },
  { date: "Jun 23", value: 12100 },
  { date: "Jun 24", value: 12450 },
];

// ─── Strategies ──────────────────────────────────────────────

const baseSteps = (
  proposedTime: string,
  reviewTime?: string,
  executeTime?: string
): StrategyStep[] => [
  { label: "Proposed", status: "done", time: proposedTime },
  {
    label: "Risk Review",
    status: reviewTime ? "done" : "active",
    time: reviewTime,
  },
  {
    label: "Execute",
    status: executeTime ? "done" : reviewTime ? "pending" : "pending",
    time: executeTime,
  },
  { label: "Done", status: executeTime ? "done" : "pending" },
];

export const mockStrategies: Strategy[] = [
  {
    id: "strat-42",
    number: 42,
    agent: "strategy",
    agentName: "Athena",
    title: "Swap 500 CSPR → USDT",
    description: "Swap 500 CSPR to USDT on CSPR.trade DEX with slippage ≤ 0.5%",
    status: "in_review",
    riskScore: 78,
    fee: "0.15 CSPR",
    createdAt: new Date(Date.now() - 120000).toISOString(),
    timeAgo: "2 min ago",
    steps: baseSteps("2m ago"),
    params: {
      tokenIn: "CSPR",
      tokenOut: "USDT",
      amountIn: "500 CSPR",
      slippage: 0.5,
      dex: "CSPR.trade",
      estOutput: "2,150 USDT",
    },
  },
  {
    id: "strat-41",
    number: 41,
    agent: "execution",
    agentName: "Mercury",
    title: "Add liquidity CSPR-USDT pool",
    description: "Add liquidity to CSPR-USDT pool — 200 CSPR + 800 USDT",
    status: "completed",
    riskScore: 85,
    pnl: 42,
    pnlPercent: 2.1,
    txHash: "0x9c2d...e4a7",
    createdAt: new Date(Date.now() - 900000).toISOString(),
    timeAgo: "15 min ago",
    steps: baseSteps("20m ago", "18m ago (Approved)", "15m ago"),
  },
  {
    id: "strat-40",
    number: 40,
    agent: "risk",
    agentName: "Guardian",
    title: "Swap 2,000 CSPR → MEME token",
    description: "Swap 2,000 CSPR to MEME token on unknown DEX",
    status: "rejected",
    riskScore: 5,
    rejectionReason:
      "Token has honeypot risk — sell tax 99%, liquidity < $100. This token cannot be sold after purchase.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    timeAgo: "1 hour ago",
    steps: [
      { label: "Proposed", status: "done", time: "1h ago" },
      { label: "Risk Review", status: "rejected", time: "1h ago" },
      { label: "Execute", status: "pending" },
      { label: "Done", status: "pending" },
    ],
  },
  {
    id: "strat-39",
    number: 39,
    agent: "strategy",
    agentName: "Athena",
    title: "Yield farming CSPR-USDT LP",
    description: "Deposit CSPR-USDT LP tokens into yield farm for 18% APY",
    status: "completed",
    riskScore: 82,
    pnl: 120,
    pnlPercent: 3.8,
    txHash: "0x7a3b...c9f1",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    timeAgo: "1 day ago",
    steps: baseSteps("1d ago", "1d ago (Approved)", "1d ago"),
  },
  {
    id: "strat-38",
    number: 38,
    agent: "strategy",
    agentName: "Athena",
    title: "Arbitrage CSPR between DEXs",
    description: "Buy CSPR on CSPR.trade, sell on CSPR.swap — estimated 1.2% profit",
    status: "executing",
    riskScore: 72,
    createdAt: new Date(Date.now() - 300000).toISOString(),
    timeAgo: "5 min ago",
    steps: baseSteps("8m ago", "6m ago (Approved)"),
  },
];

// ─── Chat Messages ───────────────────────────────────────────

export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "strategy",
    senderName: "Athena",
    content:
      "👋 Hi, I'm your Strategy Agent. Tell me what you want to achieve, and I'll work with the Risk & Execution agents to make it happen.",
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "msg-2",
    sender: "user",
    senderName: "You",
    content: "I want to invest 1000 CSPR in low-risk DeFi strategies.",
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: "msg-3",
    sender: "strategy",
    senderName: "Athena",
    content:
      "Analyzing market data from CSPR.trade MCP...\n\nI found a good opportunity: swap 500 CSPR to USDT on CSPR.trade. The market depth is sufficient, and current prices are favorable. Here's the proposal:",
    timestamp: new Date(Date.now() - 180000).toISOString(),
    embeddedCard: {
      id: "strat-42",
      number: 42,
      agent: "strategy",
      agentName: "Athena",
      title: "Swap 500 CSPR → USDT",
      description: "Swap 500 CSPR to USDT on CSPR.trade DEX",
      status: "proposed",
      riskScore: 78,
      createdAt: new Date(Date.now() - 120000).toISOString(),
      timeAgo: "2 min ago",
      steps: [],
      params: {
        tokenIn: "CSPR",
        tokenOut: "USDT",
        amountIn: "500 CSPR",
        slippage: 0.5,
        dex: "CSPR.trade",
        estOutput: "2,150 USDT",
      },
    },
  },
];

// ─── Transactions ────────────────────────────────────────────

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "swap",
    description: "Swap CSPR → USDT",
    amount: "-500 CSPR / +2,150 USDT",
    token: "CSPR",
    timeAgo: "15 min ago",
    txHash: "0x7a3b...c9f1",
  },
  {
    id: "tx-2",
    type: "add_liquidity",
    description: "Add liquidity CSPR-USDT",
    amount: "-200 CSPR / -800 USDT",
    token: "LP",
    timeAgo: "1 hour ago",
    txHash: "0x9c2d...e4a7",
  },
  {
    id: "tx-3",
    type: "claim",
    description: "Claim yield rewards",
    amount: "+42 CSPR",
    token: "CSPR",
    timeAgo: "3 hours ago",
  },
  {
    id: "tx-4",
    type: "distribute",
    description: "Profit distribution #41",
    amount: "+42 CSPR",
    token: "CSPR",
    timeAgo: "3 hours ago",
  },
  {
    id: "tx-5",
    type: "swap",
    description: "Swap USDT → CSPR",
    amount: "+800 CSPR / -1,720 USDT",
    token: "CSPR",
    timeAgo: "1 day ago",
    txHash: "0x3f8a...b2d1",
  },
];

// ─── Profit Distribution ─────────────────────────────────────

export const mockDistributions: DistributionRecord[] = [
  { id: "dist-1", pool: "Strategy Pool", percentage: 60, amount: 25.2, color: "#6366F1" },
  { id: "dist-2", pool: "Risk Pool", percentage: 20, amount: 8.4, color: "#F59E0B" },
  { id: "dist-3", pool: "Execution Pool", percentage: 15, amount: 6.3, color: "#06B6D4" },
  { id: "dist-4", pool: "Guild Reserve", percentage: 5, amount: 2.1, color: "#64748B" },
];

// ─── Agent Performance ───────────────────────────────────────

export const mockAgentPerformance: AgentPerformance[] = [
  {
    rank: 1,
    name: "Athena",
    role: "strategy",
    pnl: 1240,
    strategies: 25,
    successRate: 84,
    color: "agent-strategy",
  },
  {
    rank: 2,
    name: "Athena #2",
    role: "strategy",
    pnl: 680,
    strategies: 12,
    successRate: 75,
    color: "agent-strategy",
  },
  {
    rank: 3,
    name: "Guardian",
    role: "risk",
    pnl: 5.5,
    strategies: 37,
    successRate: 81,
    color: "agent-risk",
  },
  {
    rank: 4,
    name: "Mercury",
    role: "execution",
    pnl: 0,
    strategies: 20,
    successRate: 100,
    color: "agent-execution",
  },
];

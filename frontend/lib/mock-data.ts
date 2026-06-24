import {
  Agent,
  AgentPerformance,
  AssetItem,
  ChatMessage,
  MetricData,
  Strategy,
  Transaction,
} from "./types";

export const mockMetrics: MetricData[] = [
  {
    label: "Total Value Locked",
    value: "12,450 CSPR",
    subValue: "≈ $2,490 USD",
    change: "+3.2%",
    changePositive: true,
  },
  {
    label: "24h PnL",
    value: "+398 CSPR",
    subValue: "+3.2%",
    change: "↑ $79.60",
    changePositive: true,
  },
  {
    label: "Active Agents",
    value: "3",
    subValue: "All systems operational",
  },
  {
    label: "Guild Members",
    value: "5",
    subValue: "View all →",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "agent-0x7a3b",
    name: "Athena",
    type: "strategy",
    status: "idle",
    lastAction: "2 min ago",
    txToday: 0,
    strategies: 25,
    successRate: 84,
    totalPnL: 1240,
  },
  {
    id: "agent-0x3d5e",
    name: "Guardian",
    type: "risk",
    status: "auditing",
    lastAction: "just now",
    txToday: 0,
    strategies: 37,
    successRate: 81,
    totalPnL: 5.5,
  },
  {
    id: "agent-0xb8a1",
    name: "Mercury",
    type: "execution",
    status: "idle",
    lastAction: "15 min ago",
    txToday: 3,
    strategies: 20,
    successRate: 100,
    totalPnL: 0,
  },
];

export const mockStrategies: Strategy[] = [
  {
    id: 42,
    agentType: "strategy",
    title: "Swap 500 CSPR → USDT",
    description: "Swap on CSPR.trade DEX, slippage ≤ 0.5%",
    status: "in-review",
    riskScore: 78,
    estimatedFee: 0.15,
    timestamp: "2 min ago",
    details: {
      action: "Swap 500 CSPR → USDT",
      amount: "500 CSPR",
      slippage: "≤ 0.5%",
      estimatedOutput: "2,150 USDT",
      dex: "CSPR.trade",
    },
  },
  {
    id: 41,
    agentType: "execution",
    title: "Add liquidity CSPR-USDT pool",
    description: "200 CSPR + 800 USDT → LP Token",
    status: "completed",
    riskScore: 85,
    estimatedFee: 0.12,
    txHash: "0x9c2d...e4a7",
    pnl: 42,
    pnlPercent: 2.1,
    timestamp: "15 min ago",
  },
  {
    id: 40,
    agentType: "risk",
    title: "Swap 2,000 CSPR → MEME token",
    description: "Proposed swap to meme token — REJECTED",
    status: "rejected",
    riskScore: 15,
    estimatedFee: 0,
    timestamp: "1 hour ago",
    rejectReason:
      "Token has honeypot risk, sell tax 99%, liquidity < $100",
  },
  {
    id: 39,
    agentType: "strategy",
    title: "Stake 1,000 CSPR in Earn pool",
    description: "12% APY, 30-day lock",
    status: "completed",
    riskScore: 92,
    estimatedFee: 0.08,
    txHash: "0x7f1a...c3d2",
    pnl: 28,
    pnlPercent: 2.8,
    timestamp: "3 hours ago",
  },
  {
    id: 38,
    agentType: "execution",
    title: "Claim staking rewards",
    description: "Harvest 28 CSPR from Earn pool",
    status: "completed",
    riskScore: 95,
    estimatedFee: 0.05,
    txHash: "0x1e4b...a9f8",
    pnl: 28,
    pnlPercent: 100,
    timestamp: "3 hours ago",
  },
];

export const mockAgentPerformance: AgentPerformance[] = [
  { rank: 1, agent: "Athena", agentType: "strategy", pnl: 1240, strategies: 25, successRate: 84 },
  { rank: 2, agent: "Mercury", agentType: "execution", pnl: 680, strategies: 20, successRate: 100 },
  { rank: 3, agent: "Guardian", agentType: "risk", pnl: 5.5, strategies: 37, successRate: 81 },
];

export const mockTransactions: Transaction[] = [
  {
    type: "swap",
    description: "Swap CSPR → USDT",
    amount: "-500 CSPR / +2,150 USDT",
    timestamp: "15 min ago",
    txHash: "0x7a3b...c9f1",
  },
  {
    type: "add_liquidity",
    description: "Add liquidity CSPR-USDT",
    amount: "-200 CSPR / -800 USDT",
    timestamp: "15 min ago",
    txHash: "0x9c2d...e4a7",
  },
  {
    type: "claim",
    description: "Claim staking rewards",
    amount: "+42 CSPR",
    timestamp: "3 hours ago",
    txHash: "0x1e4b...a9f8",
  },
  {
    type: "add_liquidity",
    description: "Add liquidity CSPR-USDT",
    amount: "-500 CSPR / -2,000 USDT",
    timestamp: "1 day ago",
    txHash: "0x3f8a...b2d1",
  },
  {
    type: "swap",
    description: "Swap USDT → CSPR",
    amount: "+800 CSPR / -1,800 USDT",
    timestamp: "2 days ago",
    txHash: "0x5d2c...f7e3",
  },
];

export const mockAssets: AssetItem[] = [
  { name: "CSPR", percentage: 45, color: "#00E5A0" },
  { name: "USDT", percentage: 30, color: "#6366F1" },
  { name: "CSPR-LP", percentage: 20, color: "#06B6D4" },
  { name: "Other", percentage: 5, color: "#94A3B8" },
];

export const pnlChartData = [
  { date: "Jun 17", pnl: 0 },
  { date: "Jun 18", pnl: 120 },
  { date: "Jun 19", pnl: -45 },
  { date: "Jun 20", pnl: 280 },
  { date: "Jun 21", pnl: 350 },
  { date: "Jun 22", pnl: 310 },
  { date: "Jun 23", pnl: 398 },
];

export const profitDistribution = [
  { pool: "Strategy Pool", percentage: 60, color: "#6366F1" },
  { pool: "Risk Pool", percentage: 20, color: "#F59E0B" },
  { pool: "Execution Pool", percentage: 15, color: "#06B6D4" },
  { pool: "Guild Reserve", percentage: 5, color: "#94A3B8" },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    sender: "strategy",
    senderName: "Athena",
    content:
      "Hi, I'm your Strategy Agent. Tell me what you want to achieve, and I'll work with the Risk & Execution agents to make it happen.",
    timestamp: "just now",
  },
  {
    id: "2",
    sender: "user",
    senderName: "You",
    content: "I want to invest 1000 CSPR in low-risk DeFi strategies.",
    timestamp: "just now",
  },
  {
    id: "3",
    sender: "strategy",
    senderName: "Athena",
    content: "Analyzing market conditions and evaluating low-risk opportunities...",
    timestamp: "just now",
  },
  {
    id: "4",
    sender: "strategy",
    senderName: "Athena",
    content: "I've prepared a strategy proposal for your review:",
    timestamp: "just now",
    proposal: {
      id: 42,
      action: "Swap 500 CSPR → USDT on CSPR.trade",
      slippage: "≤ 0.5%",
      estimatedOutput: "2,150 USDT",
      riskScore: 78,
    },
  },
];

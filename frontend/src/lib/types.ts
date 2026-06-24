// ─── Agent Types ─────────────────────────────────────────────

export type AgentRole = "strategy" | "risk" | "execution";

export interface AgentInfo {
  id: string;
  name: string;
  role: AgentRole;
  status: "idle" | "working" | "auditing" | "executing";
  lastAction: string;
  strategiesCount?: number;
  successRate?: number;
  totalPnl?: number;
  avatar: string; // emoji
  color: string;
}

// ─── Strategy Types ──────────────────────────────────────────

export type StrategyStatus =
  | "proposed"
  | "in_review"
  | "executing"
  | "completed"
  | "rejected";

export interface Strategy {
  id: string;
  number: number;
  agent: AgentRole;
  agentName: string;
  title: string;
  description: string;
  status: StrategyStatus;
  riskScore?: number;
  pnl?: number;
  pnlPercent?: number;
  fee?: string;
  txHash?: string;
  rejectionReason?: string;
  createdAt: string; // ISO string
  timeAgo: string;
  steps: StrategyStep[];
  params?: StrategyParams;
}

export interface StrategyStep {
  label: string;
  status: "done" | "active" | "pending" | "rejected";
  time?: string;
}

export interface StrategyParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippage: number;
  dex: string;
  estOutput: string;
}

// ─── Vault Types ─────────────────────────────────────────────

export interface VaultMetrics {
  tvl: number;
  tvlUsd: number;
  pnl24h: number;
  pnl24hPercent: number;
  activeAgents: number;
  guildMembers: number;
}

export interface AssetAllocation {
  name: string;
  symbol: string;
  amount: number;
  percentage: number;
  color: string;
}

// ─── Chat Types ──────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  sender: "user" | AgentRole;
  senderName: string;
  content: string;
  timestamp: string;
  embeddedCard?: Strategy;
}

// ─── Transaction Types ───────────────────────────────────────

export interface Transaction {
  id: string;
  type: "swap" | "add_liquidity" | "claim" | "distribute";
  description: string;
  amount: string;
  token: string;
  timeAgo: string;
  txHash?: string;
}

// ─── Profit Distribution Types ───────────────────────────────

export interface DistributionRecord {
  id: string;
  pool: string;
  percentage: number;
  amount: number;
  color: string;
}

// ─── PnL Data Types ──────────────────────────────────────────

export interface PnLDataPoint {
  date: string;
  value: number;
}

// ─── Agent Performance Types ─────────────────────────────────

export interface AgentPerformance {
  rank: number;
  name: string;
  role: AgentRole;
  pnl: number;
  strategies: number;
  successRate: number;
  color: string;
}

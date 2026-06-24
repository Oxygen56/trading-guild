// Agent types
export type AgentType = "strategy" | "risk" | "execution";
export type AgentStatus = "idle" | "working" | "auditing" | "executing";
export type StrategyStatus = "proposed" | "in-review" | "executing" | "completed" | "rejected";

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  lastAction: string;
  txToday: number;
  strategies: number;
  successRate: number;
  totalPnL: number;
}

export interface Strategy {
  id: number;
  agentType: AgentType;
  title: string;
  description: string;
  status: StrategyStatus;
  riskScore: number;
  estimatedFee: number;
  txHash?: string;
  pnl?: number;
  pnlPercent?: number;
  timestamp: string;
  details?: StrategyDetail;
  rejectReason?: string;
}

export interface StrategyDetail {
  action: string;
  amount: string;
  slippage: string;
  estimatedOutput: string;
  dex: string;
}

export interface MetricData {
  label: string;
  value: string;
  subValue?: string;
  change?: string;
  changePositive?: boolean;
}

export interface Transaction {
  type: "swap" | "add_liquidity" | "claim" | "remove_liquidity";
  description: string;
  amount: string;
  timestamp: string;
  txHash: string;
}

export interface AgentPerformance {
  rank: number;
  agent: string;
  agentType: AgentType;
  pnl: number;
  strategies: number;
  successRate: number;
}

export interface ChatMessage {
  id: string;
  sender: "user" | AgentType;
  senderName: string;
  content: string;
  timestamp: string;
  proposal?: StrategyProposal;
}

export interface StrategyProposal {
  id: number;
  action: string;
  slippage: string;
  estimatedOutput: string;
  riskScore: number;
}

export interface AssetItem {
  name: string;
  percentage: number;
  color: string;
}

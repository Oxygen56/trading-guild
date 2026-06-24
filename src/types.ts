/**
 * Trading Guild — Core Type Definitions
 *
 * All shared types for the multi-agent trading system.
 * Organized by domain: strategy, risk, execution, payment, guild.
 */

// ─── Agent Identity ─────────────────────────────────────────────

export type AgentRole = "strategy" | "risk" | "execution";

export interface AgentIdentity {
  id: string;
  role: AgentRole;
  name: string;
  description: string;
  /** Casper public key for x402 payments */
  casperAddress: string;
  /** MCP server endpoint this agent exposes (if any) */
  mcpEndpoint?: string;
  /** x402 pricing for services this agent sells */
  pricing?: AgentPricing[];
}

export interface AgentPricing {
  serviceName: string;
  description: string;
  amountMotes: string; // 1 CSPR = 10^9 motes
  currency: string;
}

// ─── Trading Strategy ────────────────────────────────────────────

export interface TradingStrategy {
  id: string;
  createdAt: number;
  creatorId: string; // Agent ID
  status: StrategyStatus;
  type: StrategyType;
  /** Human-readable description of the strategy */
  description: string;
  /** The actual trade parameters */
  trade: TradeParams;
  /** Market analysis that generated this strategy */
  analysis: MarketAnalysis;
  /** Risk assessment results (populated after review) */
  riskAssessment?: RiskAssessment;
  /** Execution result (populated after execution) */
  executionResult?: ExecutionResult;
}

export type StrategyStatus =
  | "draft"
  | "pending_risk_review"
  | "risk_approved"
  | "risk_rejected"
  | "pending_execution"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";

export type StrategyType =
  | "swap"
  | "arbitrage"
  | "yield_farming"
  | "liquidity_provision"
  | "limit_order";

export interface TradeParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string; // in smallest unit
  minAmountOut: string;
  slippageBps: number;
  dex: string; // e.g. "cspr-trade"
  route?: string[]; // multi-hop route
  deadline: number; // unix timestamp
}

export interface MarketAnalysis {
  timestamp: number;
  pools: PoolSnapshot[];
  priceFeeds: PriceFeed[];
  recommendation: string;
  confidence: number; // 0-1
  dataSources: string[];
}

export interface PoolSnapshot {
  pair: string;
  dex: string;
  tvlUsd: number;
  volume24hUsd: number;
  apy: number;
  token0Reserve: string;
  token1Reserve: string;
  fee: number;
}

export interface PriceFeed {
  token: string;
  priceUsd: number;
  change24h: number;
  source: string;
}

// ─── Risk Assessment ────────────────────────────────────────────

export interface RiskAssessment {
  id: string;
  strategyId: string;
  assessedBy: string; // Risk Agent ID
  timestamp: number;
  overallScore: number; // 0-100, higher = safer
  components: RiskComponents;
  recommendation: RiskRecommendation;
  maxPositionSize: string; // in motes
  reasoning: string;
}

export interface RiskComponents {
  slippageRisk: number; // 0-100
  liquidityRisk: number;
  securityRisk: number; // token safety (honeypot, sell tax, etc.)
  volatilityRisk: number;
  protocolRisk: number; // DEX/protocol safety
  concentrationRisk: number; // position concentration
}

export type RiskRecommendation =
  | "approve"
  | "approve_with_caution"
  | "reduce_position"
  | "reject";

// ─── Execution ──────────────────────────────────────────────────

export interface ExecutionResult {
  id: string;
  strategyId: string;
  executedBy: string; // Execution Agent ID
  timestamp: number;
  status: ExecutionStatus;
  deployHash?: string; // Casper transaction hash
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  effectivePrice: number;
  slippage: number; // actual slippage in bps
  fee: string; // gas fee in motes
  blockHeight?: number;
  errorMessage?: string;
}

export type ExecutionStatus =
  | "pending"
  | "submitted"
  | "confirmed"
  | "failed";

// ─── x402 Payments ──────────────────────────────────────────────

export interface AgentPayment {
  id: string;
  from: string; // Agent ID
  to: string; // Agent ID
  service: string;
  amount: string; // motes
  currency: string;
  status: PaymentStatus;
  deployHash?: string;
  strategyId?: string; // linked strategy
  timestamp: number;
  metadata?: Record<string, string>;
}

export type PaymentStatus = "pending" | "confirmed" | "failed";

export interface PaymentLedgerEntry {
  agentId: string;
  totalEarned: string; // motes
  totalSpent: string; // motes
  netPosition: string; // motes
  paymentCount: number;
  lastPaymentAt: number;
}

// ─── Guild State ────────────────────────────────────────────────

export interface GuildState {
  id: string;
  name: string;
  members: AgentIdentity[];
  treasury: TreasurySnapshot;
  activeStrategies: TradingStrategy[];
  totalPnl: string; // motes
  createdAt: number;
  updatedAt: number;
}

export interface TreasurySnapshot {
  vaultAddress: string;
  totalAssets: string; // motes
  availableForTrading: string;
  lockedInStrategies: string;
  pendingDistributions: string;
}

// ─── API / Frontend Alignment ───────────────────────────────────

/** Event emitted for frontend real-time dashboard (aligns with OXY-372 UI) */
export interface GuildEvent {
  type: GuildEventType;
  timestamp: number;
  data: unknown;
}

export type GuildEventType =
  | "strategy_created"
  | "risk_assessment_completed"
  | "strategy_approved"
  | "strategy_rejected"
  | "execution_started"
  | "execution_completed"
  | "payment_sent"
  | "payment_received"
  | "profit_distributed"
  | "agent_registered"
  | "agent_deregistered";

// ─── Contract Interfaces (alignment with OXY-372 Odra contracts) ──

/** Guild Registry contract interface */
export interface GuildRegistryContract {
  registerAgent(agent: AgentIdentity): Promise<string>; // returns deploy hash
  deregisterAgent(agentId: string): Promise<string>;
  getAgent(agentId: string): Promise<AgentIdentity | null>;
  listAgents(): Promise<AgentIdentity[]>;
}

/** Guild Vault contract interface */
export interface GuildVaultContract {
  deposit(amount: string): Promise<string>;
  withdraw(amount: string, recipient: string): Promise<string>;
  getBalance(): Promise<string>;
  allocateForStrategy(strategyId: string, amount: string): Promise<string>;
  releaseFromStrategy(strategyId: string): Promise<string>;
}

/** Profit Distribution contract interface */
export interface ProfitDistributionContract {
  distribute(strategyId: string): Promise<string>;
  getPendingDistribution(agentId: string): Promise<string>;
  claimDistribution(agentId: string): Promise<string>;
  getDistributionHistory(): Promise<DistributionRecord[]>;
}

export interface DistributionRecord {
  strategyId: string;
  agentId: string;
  role: AgentRole;
  amount: string;
  timestamp: number;
  deployHash: string;
}

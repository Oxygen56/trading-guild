/**
 * Contract Interfaces — Alignment with OXY-372 Odra smart contracts.
 *
 * These interfaces define how the Agent layer interacts with the
 * on-chain Guild contracts deployed on Casper Testnet.
 *
 * Contracts (developed by tech team OXY-372):
 * - GuildRegistry: Agent registration, discovery, and reputation
 * - GuildVault: Treasury management, trade allocation, profit holding
 * - ProfitDistribution: Automated profit sharing based on contribution
 *
 * The Agent layer calls these contracts through Odra's JSON-RPC entry points
 * or via Casper SDK typed calls.
 */

import type {
  AgentIdentity, AgentRole, DistributionRecord,
} from "../src/types.js";

// ─── Guild Registry ────────────────────────────────────────────

export interface IGuildRegistry {
  /**
   * Register a new agent in the guild.
   * Stores agent DID, role, capabilities, and x402 pricing on-chain.
   */
  register_agent(args: {
    agent_id: string;
    role: AgentRole;
    name: string;
    casper_address: string;
    mcp_endpoint?: string;
    pricing_json: string; // JSON-serialized pricing array
  }): Promise<{ deploy_hash: string }>;

  /** Remove an agent from the guild */
  deregister_agent(args: {
    agent_id: string;
  }): Promise<{ deploy_hash: string }>;

  /** Query agent by ID */
  get_agent(args: {
    agent_id: string;
  }): Promise<AgentIdentity | null>;

  /** List all registered agents */
  list_agents(): Promise<AgentIdentity[]>;

  /** Update agent reputation score (called after each strategy execution) */
  update_reputation(args: {
    agent_id: string;
    score_delta: number;
  }): Promise<{ deploy_hash: string }>;
}

// ─── Guild Vault ───────────────────────────────────────────────

export interface IGuildVault {
  /** Deposit CSPR/tokens into the guild vault */
  deposit(args: {
    amount: string; // motes
    token?: string; // token contract address (default: native CSPR)
  }): Promise<{ deploy_hash: string }>;

  /** Withdraw from vault (multi-sig or governance required) */
  withdraw(args: {
    amount: string;
    recipient: string; // Casper address
  }): Promise<{ deploy_hash: string }>;

  /** Get vault balance */
  get_balance(): Promise<{ balance: string }>;

  /** Allocate funds for a strategy (locked until execution completes) */
  allocate_for_strategy(args: {
    strategy_id: string;
    amount: string;
    execution_agent: string;
  }): Promise<{ deploy_hash: string }>;

  /** Release allocated funds after strategy completes */
  release_from_strategy(args: {
    strategy_id: string;
  }): Promise<{ deploy_hash: string }>;
}

// ─── Profit Distribution ───────────────────────────────────────

export interface IProfitDistribution {
  /** Distribute profits from a completed strategy */
  distribute(args: {
    strategy_id: string;
    profit_amount: string;
    distribution_json: string; // { agent_id: amount } map
  }): Promise<{ deploy_hash: string }>;

  /** Get pending distribution for an agent */
  get_pending_distribution(args: {
    agent_id: string;
  }): Promise<{ amount: string }>;

  /** Agent claims their earned profits */
  claim_distribution(args: {
    agent_id: string;
  }): Promise<{ deploy_hash: string; amount: string }>;

  /** Get distribution history for the guild */
  get_distribution_history(args: {
    limit?: number;
  }): Promise<DistributionRecord[]>;
}

// ─── Agent-side Contract Client (simulated for demo) ───────────

/**
 * Simulated contract client for demo mode.
 * In production, these calls go through casper-js-sdk + Odra JSON-RPC.
 */
export class SimulatedContractClient implements
  IGuildRegistry, IGuildVault, IProfitDistribution {

  private agents: Map<string, AgentIdentity> = new Map();
  private vaultBalance = "10000000000000"; // 10,000 CSPR
  private allocated: Map<string, string> = new Map();
  private pendingDistributions: Map<string, string> = new Map();

  // GuildRegistry
  async register_agent(args: {
    agent_id: string; role: AgentRole; name: string;
    casper_address: string; mcp_endpoint?: string; pricing_json: string;
  }): Promise<{ deploy_hash: string }> {
    this.agents.set(args.agent_id, {
      id: args.agent_id,
      role: args.role,
      name: args.name,
      casperAddress: args.casper_address,
      description: "",
      mcpEndpoint: args.mcp_endpoint,
      pricing: JSON.parse(args.pricing_json),
    });
    return { deploy_hash: `deploy_registry_${Date.now()}` };
  }

  async deregister_agent(args: { agent_id: string }): Promise<{ deploy_hash: string }> {
    this.agents.delete(args.agent_id);
    return { deploy_hash: `deploy_deregister_${Date.now()}` };
  }

  async get_agent(args: { agent_id: string }): Promise<AgentIdentity | null> {
    return this.agents.get(args.agent_id) || null;
  }

  async list_agents(): Promise<AgentIdentity[]> {
    return Array.from(this.agents.values());
  }

  async update_reputation(_args: {
    agent_id: string; score_delta: number;
  }): Promise<{ deploy_hash: string }> {
    return { deploy_hash: `deploy_reputation_${Date.now()}` };
  }

  // GuildVault
  async deposit(args: { amount: string }): Promise<{ deploy_hash: string }> {
    this.vaultBalance = (BigInt(this.vaultBalance) + BigInt(args.amount)).toString();
    return { deploy_hash: `deploy_deposit_${Date.now()}` };
  }

  async withdraw(args: { amount: string; recipient: string }): Promise<{ deploy_hash: string }> {
    this.vaultBalance = (BigInt(this.vaultBalance) - BigInt(args.amount)).toString();
    return { deploy_hash: `deploy_withdraw_${Date.now()}` };
  }

  async get_balance(): Promise<{ balance: string }> {
    return { balance: this.vaultBalance };
  }

  async allocate_for_strategy(args: {
    strategy_id: string; amount: string;
  }): Promise<{ deploy_hash: string }> {
    this.allocated.set(args.strategy_id, args.amount);
    return { deploy_hash: `deploy_allocate_${Date.now()}` };
  }

  async release_from_strategy(args: {
    strategy_id: string;
  }): Promise<{ deploy_hash: string }> {
    this.allocated.delete(args.strategy_id);
    return { deploy_hash: `deploy_release_${Date.now()}` };
  }

  // ProfitDistribution
  async distribute(args: {
    strategy_id: string; profit_amount: string; distribution_json: string;
  }): Promise<{ deploy_hash: string }> {
    const dist: Record<string, string> = JSON.parse(args.distribution_json);
    for (const [agentId, amount] of Object.entries(dist)) {
      const existing = this.pendingDistributions.get(agentId) || "0";
      this.pendingDistributions.set(
        agentId,
        (BigInt(existing) + BigInt(amount)).toString()
      );
    }
    return { deploy_hash: `deploy_distribute_${Date.now()}` };
  }

  async get_pending_distribution(args: {
    agent_id: string;
  }): Promise<{ amount: string }> {
    return { amount: this.pendingDistributions.get(args.agent_id) || "0" };
  }

  async claim_distribution(args: {
    agent_id: string;
  }): Promise<{ deploy_hash: string; amount: string }> {
    const amount = this.pendingDistributions.get(args.agent_id) || "0";
    this.pendingDistributions.delete(args.agent_id);
    return { deploy_hash: `deploy_claim_${Date.now()}`, amount };
  }

  async get_distribution_history(_args: {
    limit?: number;
  }): Promise<DistributionRecord[]> {
    return [];
  }
}

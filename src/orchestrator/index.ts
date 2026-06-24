/**
 * Agent Orchestrator — Central coordinator for the Trading Guild.
 *
 * Responsibilities:
 * - Initialize all agents (Strategy, Risk, Execution)
 * - Route strategies through the lifecycle: generate → review → execute
 * - Manage x402 payments between agents
 * - Emit guild events for frontend real-time dashboard
 * - Track guild state (treasury, active strategies, PnL)
 *
 * This is the entry point for the entire Trading Guild system.
 * All external interactions go through the orchestrator.
 *
 * Extension points:
 * - registerAgent(): Add new agent types (Research, Liquidity, etc.)
 * - Third-party agents can join via Guild Registry contract
 * - New strategy types can be added without changing the core pipeline
 */

import type {
  TradingStrategy, RiskAssessment, ExecutionResult,
  AgentIdentity, AgentPayment, GuildState, GuildEvent,
  TreasurySnapshot,
} from "../types.js";
import type { AppConfig } from "../config.js";
import { StrategyAgent } from "../agents/strategy-agent.js";
import { RiskAgent } from "../agents/risk-agent.js";
import { ExecutionAgent } from "../agents/execution-agent.js";
import { X402PaymentRouter } from "../payment/x402-router.js";
import { X402Client } from "../integrations/x402.js";
import type { McpServerConfig } from "../integrations/mcp-bridge.js";
import type { RegisteredService } from "../payment/x402-router.js";

export class AgentOrchestrator {
  private config: AppConfig;
  private strategyAgent: StrategyAgent;
  private riskAgent: RiskAgent;
  private executionAgent: ExecutionAgent;
  private paymentRouter: X402PaymentRouter;
  private x402Client: X402Client;
  private mcpServers: McpServerConfig[];

  private guildState: GuildState;
  private eventLog: GuildEvent[] = [];
  private externalServices: Map<string, RegisteredService[]> = new Map();

  constructor(config: AppConfig) {
    this.config = config;

    // Initialize x402 payment layer
    this.x402Client = new X402Client(
      config.x402.facilitatorUrl,
      config.casper.network,
      config.casper.chainId
    );
    this.paymentRouter = new X402PaymentRouter(this.x402Client);

    // MCP server configurations
    this.mcpServers = [
      {
        name: "cspr-trade",
        transport: "stdio",
        command: "npx",
        args: ["-y", "@cspr-trade/mcp-server"],
      },
    ];

    // Initialize agents
    this.strategyAgent = new StrategyAgent(config, this.mcpServers);
    this.riskAgent = new RiskAgent(config, this.mcpServers);
    this.executionAgent = new ExecutionAgent(config, this.mcpServers);

    // Register agent x402 services
    this.registerAgentServices(this.strategyAgent.identity);
    this.registerAgentServices(this.riskAgent.identity);
    this.registerAgentServices(this.executionAgent.identity);

    // Wire up event listeners for frontend
    this.wireEventListeners();

    // Initialize guild state
    this.guildState = {
      id: "guild-001",
      name: "Casper Autonomous Trading Guild",
      members: [
        this.strategyAgent.identity,
        this.riskAgent.identity,
        this.executionAgent.identity,
      ],
      treasury: {
        vaultAddress: config.guild.vaultAddress,
        totalAssets: "10000000000000", // 10,000 CSPR
        availableForTrading: "5000000000000", // 5,000 CSPR
        lockedInStrategies: "0",
        pendingDistributions: "0",
      },
      activeStrategies: [],
      totalPnl: "0",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  /** Initialize all agents and their MCP connections */
  async initialize(): Promise<void> {
    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║   Trading Guild Orchestrator — Init      ║`);
    console.log(`╚══════════════════════════════════════════╝\n`);

    await this.strategyAgent.initialize();
    await this.riskAgent.initialize();
    await this.executionAgent.initialize();

    console.log(`\n[Orchestrator] All agents initialized.`);
    console.log(`[Orchestrator] Guild members: ${this.guildState.members.length}`);
    console.log(`[Orchestrator] Treasury: ${this.guildState.treasury.totalAssets} motes`);
    console.log(`[Orchestrator] Payment router: ${this.paymentRouter.listAllServices().length} services registered`);
  }

  /**
   * MAIN PIPELINE: Complete trade lifecycle.
   *
   * 1. Strategy Agent scans markets → generates strategy
   * 2. Strategy Agent pays Risk Agent via x402 → requests review
   * 3. Risk Agent assesses strategy → returns risk score + recommendation
   * 4. If approved: Strategy Agent pays Execution Agent via x402 → requests execution
   * 5. Execution Agent executes on CSPR.trade → returns result
   * 6. Profit distribution (future: automated via Guild Vault contract)
   */
  async runTradePipeline(scenario?: string): Promise<{
    strategy: TradingStrategy;
    riskAssessment: RiskAssessment;
    strategyPayment: AgentPayment;
    executionPayment: AgentPayment;
    executionResult: ExecutionResult;
  } | null> {
    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║   Trading Guild — Trade Pipeline Start   ║`);
    console.log(`╚══════════════════════════════════════════╝`);

    // Phase 1: Strategy Generation
    console.log(`\n── Phase 1: Strategy Generation ──`);
    const strategy = await this.strategyAgent.run({ scenario });
    if (!strategy) {
      console.log(`[Orchestrator] No viable strategy. Pipeline aborted.`);
      return null;
    }
    this.guildState.activeStrategies.push(strategy);

    // Phase 2: Risk Review (with x402 payment)
    console.log(`\n── Phase 2: Risk Review ──`);
    console.log(`[Orchestrator] Strategy Agent paying Risk Agent for review...`);

    const strategyPayment = await this.paymentRouter.executePayment(
      this.strategyAgent.identity,
      this.riskAgent.identity,
      "strategy_risk_review",
      strategy.id
    );

    const riskAssessment = await this.riskAgent.run({
      strategy,
      paymentVerified: strategyPayment.status === "confirmed",
    });
    strategy.riskAssessment = riskAssessment;

    if (riskAssessment.recommendation === "reject") {
      strategy.status = "risk_rejected";
      console.log(`[Orchestrator] Strategy rejected by Risk Agent. Pipeline ended.`);
      this.emitEvent("strategy_rejected", { strategyId: strategy.id, riskAssessment });
      return null;
    }

    strategy.status = "risk_approved";
    this.emitEvent("strategy_approved", { strategyId: strategy.id, riskAssessment });

    // Phase 3: Execution (with x402 payment)
    console.log(`\n── Phase 3: Trade Execution ──`);
    console.log(`[Orchestrator] Strategy Agent paying Execution Agent for execution...`);

    const executionPayment = await this.paymentRouter.executePayment(
      this.strategyAgent.identity,
      this.executionAgent.identity,
      "trade_execution",
      strategy.id
    );

    strategy.status = "pending_execution";
    const executionResult = await this.executionAgent.run({
      strategy,
      riskAssessment,
    });
    strategy.executionResult = executionResult;
    strategy.status = executionResult.status === "confirmed" ? "completed" : "failed";

    // Phase 4: Guild state update
    this.updateGuildState(executionResult);

    console.log(`\n── Pipeline Complete ──`);
    console.log(`  Strategy: ${strategy.id}`);
    console.log(`  Risk Score: ${riskAssessment.overallScore}/100 — ${riskAssessment.recommendation}`);
    console.log(`  Execution: ${executionResult.status}`);
    console.log(`  x402 Payments: 2 (Risk: ${strategyPayment.amount} motes, Exec: ${executionPayment.amount} motes)`);

    return { strategy, riskAssessment, strategyPayment, executionPayment, executionResult };
  }

  /** Get full guild state (for frontend dashboard) */
  getGuildState(): GuildState {
    return { ...this.guildState, updatedAt: Date.now() };
  }

  /** Get payment ledger for all agents */
  getPaymentLedgers() {
    return this.paymentRouter.getAllLedgers();
  }

  /** Get event log for real-time dashboard */
  getEventLog(limit = 20): GuildEvent[] {
    return this.eventLog.slice(-limit);
  }

  /** Register a third-party agent (extension point) */
  registerExternalAgent(agent: AgentIdentity, services: RegisteredService[]): void {
    this.guildState.members.push(agent);
    for (const svc of services) {
      this.paymentRouter.registerService(agent, svc);
    }
    const existing = this.externalServices.get(agent.id) || [];
    this.externalServices.set(agent.id, [...existing, ...services]);
    this.emitEvent("agent_registered", { agent });
    console.log(`[Orchestrator] External agent registered: ${agent.name} (${services.length} services)`);
  }

  /** Shutdown all agents */
  async shutdown(): Promise<void> {
    console.log(`\n[Orchestrator] Shutting down all agents...`);
    await this.strategyAgent.shutdown();
    await this.riskAgent.shutdown();
    await this.executionAgent.shutdown();
    console.log(`[Orchestrator] Guild shut down.`);
  }

  // ─── Internal ────────────────────────────────────────────────

  private registerAgentServices(identity: AgentIdentity): void {
    if (!identity.pricing) return;
    for (const p of identity.pricing) {
      this.paymentRouter.registerService(identity, {
        agentId: identity.id,
        serviceName: p.serviceName,
        description: p.description,
        priceMotes: p.amountMotes,
        currency: p.currency,
        casperAddress: identity.casperAddress,
      });
    }
  }

  private wireEventListeners(): void {
    const handleEvent = (event: GuildEvent) => {
      this.eventLog.push(event);
    };

    this.strategyAgent.on("strategy_created", handleEvent);
    this.riskAgent.on("risk_assessment_completed", handleEvent);
    this.executionAgent.on("execution_started", handleEvent);
    this.executionAgent.on("execution_completed", handleEvent);
  }

  private emitEvent(type: GuildEvent["type"], data: unknown): void {
    const event: GuildEvent = { type, timestamp: Date.now(), data };
    this.eventLog.push(event);
  }

  private updateGuildState(result: ExecutionResult): void {
    if (result.status === "confirmed") {
      // Update treasury
      this.guildState.treasury.availableForTrading = (
        BigInt(this.guildState.treasury.availableForTrading) -
        BigInt(result.amountIn)
      ).toString();
      this.guildState.treasury.totalAssets = (
        BigInt(this.guildState.treasury.totalAssets) + BigInt(result.amountOut)
      ).toString();

      // Update PnL (simplified)
      const profit = BigInt(result.amountOut) - BigInt(result.amountIn);
      this.guildState.totalPnl = (
        BigInt(this.guildState.totalPnl) + profit
      ).toString();
    }
  }
}

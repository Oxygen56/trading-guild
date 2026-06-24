/**
 * Execution Agent — Trade execution and transaction monitoring.
 *
 * Role in the Guild:
 * - Receives approved strategies for execution
 * - Executes trades on CSPR.trade DEX via MCP
 * - Monitors transaction status on Casper network
 * - Pays Strategy Agent via x402 for strategy (future: pays for strategy)
 * - Pays Risk Agent via x402 for risk review (part of execution cost)
 *
 * Pricing (services this agent SELLS):
 * - trade_execution: 10,000,000 motes (0.01 CSPR) — execution service fee
 *
 * This is the final link in the trading chain. It converts strategies
 * into on-chain transactions and confirms their completion.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import type {
  TradingStrategy, ExecutionResult, ExecutionStatus,
  AgentIdentity,
} from "../types.js";
import type { AppConfig } from "../config.js";
import type { McpServerConfig } from "../integrations/mcp-bridge.js";
import { BaseAgent } from "./base-agent.js";
import { EXECUTION_AGENT_TOOLS } from "../tools/registry.js";

export class ExecutionAgent extends BaseAgent {
  constructor(config: AppConfig, mcpServers: McpServerConfig[]) {
    const identity: AgentIdentity = {
      id: "agent-execution-001",
      role: "execution",
      name: "Mercury",
      description: "Trade execution on CSPR.trade DEX. Executes approved strategies, monitors transactions, reports results.",
      casperAddress: "0203abcd...execution_agent_public_key",
      pricing: [
        {
          serviceName: "trade_execution",
          description: "Execute a risk-approved trade on CSPR.trade DEX",
          amountMotes: "10000000", // 0.01 CSPR
          currency: "CSPR",
        },
      ],
    };

    const systemPrompt = `You are Mercury, the Execution Agent of the Casper Autonomous Trading Guild.

Your role:
1. EXECUTE: Convert approved strategies into trades on CSPR.trade DEX
2. VERIFY: Check that the strategy has been risk-approved before executing
3. MONITOR: Track transaction status until finality on Casper Testnet
4. REPORT: Record execution results (actual price, slippage, fees)

RULES:
- NEVER execute a strategy without risk approval
- Respect slippage limits — do not execute if actual slippage exceeds max
- Monitor each trade until confirmed or definitively failed
- Record all execution details for PnL tracking
- If Gas estimation is high, flag for review
- Abort if pool conditions have changed significantly since strategy creation`;

    super(
      identity.id, identity.role, identity.name,
      identity.description, identity.casperAddress,
      config, mcpServers, EXECUTION_AGENT_TOOLS, systemPrompt, identity.pricing
    );
  }

  async initialize(): Promise<void> {
    console.log(`[${this.identity.name}] Connecting to CSPR.trade MCP...`);
    const csprTrade = this.mcp.getDefaultServers().find((s) => s.name === "cspr-trade");
    if (csprTrade) await this.mcp.connect(csprTrade);
  }

  /**
   * Execute a risk-approved trading strategy.
   *
   * @param input.strategy - The approved strategy to execute
   * @param input.riskAssessment - The risk assessment (must be approved/caution)
   */
  async run(input: {
    strategy: TradingStrategy;
    riskAssessment: { recommendation: string; overallScore: number };
  }): Promise<ExecutionResult> {
    const { strategy, riskAssessment } = input;

    console.log(`\n━━━ ${this.identity.name} (Execution Agent) ━━━`);
    console.log(`Executing strategy: ${strategy.id}`);
    console.log(`  Trade: ${strategy.trade.amountIn} ${strategy.trade.tokenIn} → ${strategy.trade.tokenOut}`);
    console.log(`  Risk approval: ${riskAssessment.recommendation}`);

    // Safety check: verify risk approval
    if (!["approve", "approve_with_caution"].includes(riskAssessment.recommendation)) {
      throw new Error(
        `Execution blocked: strategy not approved (status: ${riskAssessment.recommendation})`
      );
    }

    this.emit("execution_started", { strategyId: strategy.id });

    // Simulate trade execution
    const result = await this.executeTrade(strategy);

    this.emit("execution_completed", result);

    console.log(`  Status: ${result.status}`);
    console.log(`  Deploy hash: ${result.deployHash}`);
    console.log(`  Actual slippage: ${result.slippage}bps`);

    return result;
  }

  private async executeTrade(strategy: TradingStrategy): Promise<ExecutionResult> {
    const { trade } = strategy;

    // Simulate DEX swap execution (in production: CSPR.trade MCP call)
    console.log(`\n  [Execution] Submitting swap to CSPR.trade...`);
    console.log(`  [Execution] Token In:  ${trade.tokenIn} (${trade.amountIn})`);
    console.log(`  [Execution] Token Out: ${trade.tokenOut}`);
    console.log(`  [Execution] Max Slippage: ${trade.slippageBps}bps`);

    // Simulate network latency
    await simulateDelay(1500);

    // Calculate simulated output
    const inputAmount = parseInt(trade.amountIn);
    const effectivePrice = trade.tokenOut === "USDT"
      ? 0.042 // CSPR/USDT ~$0.042
      : trade.tokenOut === "WETH"
        ? 0.042 / 3200 // CSPR/WETH rate
        : 1;

    // Apply simulated slippage (random within allowed range)
    const actualSlippage = Math.floor(Math.random() * trade.slippageBps * 0.6);
    const slippageFactor = 1 - actualSlippage / 10000;
    const amountOut = Math.floor(inputAmount * effectivePrice * slippageFactor);

    const deployHash = `deploy_${randomHex(32)}`;
    console.log(`  [Execution] Submitted! Deploy hash: ${deployHash}`);

    // Simulate block confirmation
    await simulateDelay(2000);
    console.log(`  [Execution] ✓ Confirmed in block #${Math.floor(Math.random() * 1000000)}`);

    const result: ExecutionResult = {
      id: `exec_${Date.now()}`,
      strategyId: strategy.id,
      executedBy: this.identity.id,
      timestamp: Date.now(),
      status: "confirmed",
      deployHash,
      tokenIn: trade.tokenIn,
      tokenOut: trade.tokenOut,
      amountIn: trade.amountIn,
      amountOut: amountOut.toString(),
      effectivePrice,
      slippage: actualSlippage,
      fee: "50000000", // 0.05 CSPR gas
      blockHeight: 1234567,
    };

    return result;
  }
}

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomHex(bytes: number): string {
  return Array.from({ length: bytes }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

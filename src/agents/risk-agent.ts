/**
 * Risk Agent — Strategy safety review and risk scoring.
 *
 * Role in the Guild:
 * - Receives strategy review requests from Strategy Agent
 * - Analyzes: slippage risk, liquidity risk, token security, volatility,
 *   protocol safety, and position concentration
 * - Returns risk score (0-100) + recommendation (approve/caution/reduce/reject)
 * - CHARGES for this service via x402 (0.005 CSPR per review)
 *
 * Pricing (services this agent SELLS):
 * - strategy_risk_review: 5,000,000 motes (0.005 CSPR)
 *
 * This is a PAID service. Strategy Agent must pay before receiving results.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import type {
  TradingStrategy, RiskAssessment, RiskComponents,
  RiskRecommendation, AgentIdentity,
} from "../types.js";
import type { AppConfig } from "../config.js";
import type { McpServerConfig } from "../integrations/mcp-bridge.js";
import { BaseAgent } from "./base-agent.js";
import { RISK_AGENT_TOOLS } from "../tools/registry.js";

export class RiskAgent extends BaseAgent {
  constructor(config: AppConfig, mcpServers: McpServerConfig[]) {
    const identity: AgentIdentity = {
      id: "agent-risk-001",
      role: "risk",
      name: "Guardian",
      description: "Strategy risk assessment and safety verification. Reviews slippage, liquidity, token safety, and protocol risk.",
      casperAddress: "0203abcd...risk_agent_public_key",
      pricing: [
        {
          serviceName: "strategy_risk_review",
          description: "Complete risk assessment of a trading strategy (slippage + liquidity + security + volatility + protocol risk)",
          amountMotes: "5000000", // 0.005 CSPR
          currency: "CSPR",
        },
      ],
    };

    const systemPrompt = `You are Guardian, the Risk Agent of the Casper Autonomous Trading Guild.

Your role:
1. REVIEW: Analyze every trading strategy for six risk dimensions
2. SCORE: Assign 0-100 risk scores (0 = safest, 100 = extreme risk)
3. RECOMMEND: approve / approve_with_caution / reduce_position / reject
4. PROTECT: The guild treasury. Your "no" prevents losses.

RISK DIMENSIONS:
- Slippage Risk: Will the trade size cause significant price impact?
- Liquidity Risk: Is the pool deep enough to absorb the trade?
- Security Risk: Is the token safe? (honeypot, sell tax, ownership)
- Volatility Risk: Is the token unusually volatile right now?
- Protocol Risk: Is the DEX audited and battle-tested?
- Concentration Risk: Does this position exceed safe allocation limits?

RULES:
- REJECT any strategy targeting untrusted tokens (no audit, high sell tax, mintable)
- REJECT if trade size > 20% of pool liquidity
- REDUCE_POSITION if trade size > 10% of pool liquidity
- CAUTION on volatile pairs (>10% daily swing)
- APPROVE only if all dimensions pass with reasonable scores
- Always provide specific reasoning — never just a score.
- The guild's treasury depends on your judgment. Be conservative.`;

    super(
      identity.id, identity.role, identity.name,
      identity.description, identity.casperAddress,
      config, mcpServers, RISK_AGENT_TOOLS, systemPrompt, identity.pricing
    );
  }

  async initialize(): Promise<void> {
    console.log(`[${this.identity.name}] Risk Agent ready.`);
    // Risk agent primarily does analysis, not heavy MCP calls
    // Can connect to CSPR.cloud for token verification data
  }

  /**
   * Review a trading strategy and produce a risk assessment.
   * This is a PAID service — caller should have paid via x402 first.
   *
   * @param strategy - The strategy to review
   * @param paymentVerified - Whether the x402 payment has been verified
   */
  async run(input: {
    strategy: TradingStrategy;
    paymentVerified: boolean;
  }): Promise<RiskAssessment> {
    const { strategy, paymentVerified } = input;

    console.log(`\n━━━ ${this.identity.name} (Risk Agent) ━━━`);
    console.log(`Reviewing strategy: ${strategy.id}`);
    console.log(`  Type: ${strategy.type}`);
    console.log(`  Trade: ${strategy.trade.amountIn} ${strategy.trade.tokenIn} → ${strategy.trade.tokenOut}`);
    console.log(`  Payment verified: ${paymentVerified ? "✓" : "✗"}`);

    if (!paymentVerified) {
      throw new Error(`Risk Agent: payment required. Please pay via x402 first.`);
    }

    // Analyze each risk dimension
    const slippage = this.assessSlippage(strategy);
    const liquidity = this.assessLiquidity(strategy);
    const security = this.assessSecurity(strategy);
    const volatility = this.assessVolatility(strategy);
    const protocol = this.assessProtocol(strategy);
    const concentration = this.assessConcentration(strategy);

    const overallScore = Math.round(
      (slippage + liquidity + security + volatility + protocol + concentration) / 6
    );

    const recommendation = this.determineRecommendation(
      overallScore, slippage, liquidity, security
    );

    const maxPosition = this.calculateMaxPosition(strategy, liquidity);

    const assessment: RiskAssessment = {
      id: `risk_${Date.now()}`,
      strategyId: strategy.id,
      assessedBy: this.identity.id,
      timestamp: Date.now(),
      overallScore,
      components: {
        slippageRisk: slippage,
        liquidityRisk: liquidity,
        securityRisk: security,
        volatilityRisk: volatility,
        protocolRisk: protocol,
        concentrationRisk: concentration,
      },
      recommendation,
      maxPositionSize: maxPosition,
      reasoning: this.buildReasoning(strategy, overallScore, recommendation),
    };

    this.emit("risk_assessment_completed", assessment);

    console.log(`  Overall Risk Score: ${overallScore}/100`);
    console.log(`  Recommendation: ${recommendation}`);
    console.log(`  Max Position: ${maxPosition} motes`);

    return assessment;
  }

  // ─── Risk Dimension Assessments ─────────────────────────────────

  private assessSlippage(strategy: TradingStrategy): number {
    // Size relative to pool depth determines slippage risk
    const amount = parseInt(strategy.trade.amountIn);
    if (amount > 1_000_000_000_000) return 85; // Very large trade
    if (amount > 500_000_000_000) return 60;
    if (amount > 100_000_000_000) return 30;
    return 10;
  }

  private assessLiquidity(strategy: TradingStrategy): number {
    const pool = strategy.analysis.pools.find(
      (p) => p.pair.includes(strategy.trade.tokenIn) && p.pair.includes(strategy.trade.tokenOut)
    );
    if (!pool) return 75; // Unknown pool = high risk
    if (pool.tvlUsd < 100_000) return 80;
    if (pool.tvlUsd < 500_000) return 50;
    if (pool.tvlUsd < 1_000_000) return 30;
    return 10;
  }

  private assessSecurity(strategy: TradingStrategy): number {
    const tokenOut = strategy.trade.tokenOut.toUpperCase();
    // Known safe tokens on Casper
    const safeTokens = ["CSPR", "SCSPR", "WETH", "USDT", "USDC", "WBTC"];
    if (safeTokens.includes(tokenOut)) return 5;
    if (tokenOut.includes("SCAM") || tokenOut.includes("HONEYPOT")) return 95;
    return 50; // Unknown token — moderate-high risk
  }

  private assessVolatility(strategy: TradingStrategy): number {
    const token = strategy.trade.tokenOut;
    const feed = strategy.analysis.priceFeeds.find((p) => p.token === token);
    if (!feed) return 60;
    if (Math.abs(feed.change24h) > 20) return 80;
    if (Math.abs(feed.change24h) > 10) return 50;
    if (Math.abs(feed.change24h) > 5) return 25;
    return 10;
  }

  private assessProtocol(_strategy: TradingStrategy): number {
    // CSPR.trade is the primary DEX on Casper — well-tested
    return 5;
  }

  private assessConcentration(strategy: TradingStrategy): number {
    const amount = parseInt(strategy.trade.amountIn);
    // Simulate: guild treasury has 10,000 CSPR
    const treasuryBalance = 10_000 * 1_000_000_000; // 10,000 CSPR in motes
    const ratio = amount / treasuryBalance;
    if (ratio > 0.5) return 90; // >50% of treasury
    if (ratio > 0.2) return 60;
    if (ratio > 0.1) return 30;
    return 10;
  }

  private determineRecommendation(
    overallScore: number,
    slippage: number,
    liquidity: number,
    security: number
  ): RiskRecommendation {
    if (security >= 80) return "reject";
    if (overallScore >= 70) return "reject";
    if (overallScore >= 50) return "reduce_position";
    if (slippage >= 60 || liquidity >= 60) return "approve_with_caution";
    return "approve";
  }

  private calculateMaxPosition(
    strategy: TradingStrategy,
    liquidityRisk: number
  ): string {
    const original = BigInt(strategy.trade.amountIn);
    if (liquidityRisk >= 70) return "0"; // Don't trade
    if (liquidityRisk >= 50) return (original / 4n).toString(); // 25%
    if (liquidityRisk >= 30) return (original / 2n).toString(); // 50%
    return strategy.trade.amountIn; // Full size
  }

  private buildReasoning(
    strategy: TradingStrategy,
    score: number,
    recommendation: RiskRecommendation
  ): string {
    const c = strategy.trade;
    return [
      `Strategy ${strategy.id}: ${strategy.type} ${c.tokenIn}→${c.tokenOut}`,
      `Amount: ${c.amountIn} motes, Slippage tolerance: ${c.slippageBps}bps`,
      `Overall risk: ${score}/100 → ${recommendation}`,
    ].join(" | ");
  }
}

/**
 * Strategy Agent — Market analysis and trading strategy generation.
 *
 * Role in the Guild:
 * - Scans CSPR.trade pools for trading opportunities
 * - Analyzes price feeds and market conditions via Claude
 * - Generates structured trading strategies
 * - Pays Risk Agent via x402 for strategy review
 * - Pays Execution Agent via x402 for trade execution
 *
 * Pricing (services this agent SELLS):
 * - None currently (strategy agent is the initiator/payer)
 * - Future: could sell market analysis reports to other agents
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import type {
  TradingStrategy, MarketAnalysis, PoolSnapshot, PriceFeed,
  AgentIdentity, GuildEvent, StrategyType,
} from "../types.js";
import type { AppConfig } from "../config.js";
import type { McpServerConfig } from "../integrations/mcp-bridge.js";
import { BaseAgent } from "./base-agent.js";
import { STRATEGY_AGENT_TOOLS } from "../tools/registry.js";

export class StrategyAgent extends BaseAgent {
  constructor(config: AppConfig, mcpServers: McpServerConfig[]) {
    const identity: AgentIdentity = {
      id: "agent-strategy-001",
      role: "strategy",
      name: "Athena",
      description: "Market analysis and strategy generation. Scans pools, identifies opportunities, creates trading strategies.",
      casperAddress: "0203abcd...strategy_agent_public_key",
      pricing: [
        {
          serviceName: "market_analysis_report",
          description: "Comprehensive market analysis with identified opportunities",
          amountMotes: "10000000", // 0.01 CSPR
          currency: "CSPR",
        },
      ],
    };

    const systemPrompt = `You are Athena, the Strategy Agent of the Casper Autonomous Trading Guild.

Your role:
1. SCAN: Monitor CSPR.trade pools for trading opportunities (arbitrage, yield, swaps)
2. ANALYZE: Use market data — pool TVL, volume, APY, price feeds, 24h changes
3. GENERATE: Create structured trading strategies with clear reasoning
4. SUBMIT: Submit strategies for risk review before execution

RULES:
- Every strategy must include: token pair, amount, target slippage, and reasoning
- Base your analysis on actual pool data, not speculation
- Consider gas costs (typically ~0.1 CSPR) in your profit calculations
- A strategy should be profitable after all fees (swap fee + gas + slippage)
- When unsure about a token's safety, flag it for Risk Agent review
- Do not propose strategies that exceed 20% of pool liquidity

OUTPUT: Always submit using the submit_strategy tool with complete parameters.`;

    super(
      identity.id, identity.role, identity.name,
      identity.description, identity.casperAddress,
      config, mcpServers, STRATEGY_AGENT_TOOLS, systemPrompt, identity.pricing
    );
  }

  async initialize(): Promise<void> {
    console.log(`[${this.identity.name}] Connecting to CSPR.trade MCP...`);
    // Connect to CSPR.trade MCP for pool data and quotes
    const csprTrade = this.configMCP.find((s) => s.name === "cspr-trade");
    if (csprTrade) await this.mcp.connect(csprTrade);
  }

  private get configMCP(): McpServerConfig[] {
    return this.mcp.getDefaultServers();
  }

  /**
   * Run the strategy agent — scan for opportunities and generate a strategy.
   */
  async run(input?: { scenario?: string }): Promise<TradingStrategy | null> {
    console.log(`\n━━━ ${this.identity.name} (Strategy Agent) ━━━`);
    console.log(`Scanning for trading opportunities...`);

    this.emit("strategy_created", { status: "scanning" });

    // Step 1: Gather market data
    const marketData = await this.gatherMarketData();
    console.log(`  Found ${marketData.pools.length} pools, ${marketData.priceFeeds.length} price feeds`);

    // Step 2: Ask Claude to analyze and generate strategy
    const strategy = await this.generateStrategy(marketData, input?.scenario);
    if (!strategy) {
      console.log(`  No viable strategy found in current market conditions.`);
      return null;
    }

    console.log(`  Strategy generated: ${strategy.id}`);
    console.log(`  Type: ${strategy.type}`);
    console.log(`  ${strategy.trade.tokenIn} → ${strategy.trade.tokenOut}`);
    console.log(`  Amount: ${strategy.trade.amountIn}`);

    this.emit("strategy_created", strategy);
    return strategy;
  }

  private async gatherMarketData(): Promise<{
    pools: PoolSnapshot[];
    priceFeeds: PriceFeed[];
  }> {
    // Simulate pool data (in production: from CSPR.trade MCP)
    const pools: PoolSnapshot[] = [
      {
        pair: "CSPR/sCSPR", dex: "cspr-trade",
        tvlUsd: 1_250_000, volume24hUsd: 89_000, apy: 12.5,
        token0Reserve: "5000000000000", token1Reserve: "4800000000000", fee: 30,
      },
      {
        pair: "CSPR/WETH", dex: "cspr-trade",
        tvlUsd: 890_000, volume24hUsd: 156_000, apy: 22.8,
        token0Reserve: "3200000000000", token1Reserve: "1500000000000000000", fee: 30,
      },
      {
        pair: "CSPR/USDT", dex: "cspr-trade",
        tvlUsd: 2_100_000, volume24hUsd: 420_000, apy: 35.2,
        token0Reserve: "8000000000000", token1Reserve: "5000000000000", fee: 10,
      },
      {
        pair: "sCSPR/WETH", dex: "cspr-trade",
        tvlUsd: 340_000, volume24hUsd: 28_000, apy: 8.3,
        token0Reserve: "1200000000000", token1Reserve: "560000000000000000", fee: 50,
      },
    ];

    const priceFeeds: PriceFeed[] = [
      { token: "CSPR", priceUsd: 0.042, change24h: -2.1, source: "cspr-cloud" },
      { token: "WETH", priceUsd: 3200, change24h: 1.5, source: "cspr-cloud" },
      { token: "USDT", priceUsd: 1.001, change24h: 0.01, source: "cspr-cloud" },
      { token: "sCSPR", priceUsd: 0.044, change24h: -1.8, source: "cspr-cloud" },
    ];

    return { pools, priceFeeds };
  }

  private async generateStrategy(
    market: { pools: PoolSnapshot[]; priceFeeds: PriceFeed[] },
    scenario?: string
  ): Promise<TradingStrategy | null> {
    // Build market context for Claude
    const poolSummary = market.pools
      .map((p) => `  ${p.pair} | TVL: $${p.tvlUsd.toLocaleString()} | 24h Vol: $${p.volume24hUsd.toLocaleString()} | APY: ${p.apy}% | Fee: ${p.fee}bps`)
      .join("\n");

    const priceSummary = market.priceFeeds
      .map((p) => `  ${p.token}: $${p.priceUsd} (${p.change24h > 0 ? "+" : ""}${p.change24h}%)`)
      .join("\n");

    const prompt = `Current Casper DEX market data:

POOLS:
${poolSummary}

PRICES:
${priceSummary}

${scenario ? `SCENARIO: ${scenario}` : "Find the best trading opportunity."}

Generate a trading strategy. Consider:
- Which pool offers the best risk-adjusted return?
- Is there an arbitrage between CSPR/sCSPR and sCSPR/WETH → CSPR/WETH?
- What's the expected profit after fees?

If no strategy looks profitable, respond with NO_STRATEGY.`;

    // In production: call Claude API with tool-use
    // For demo: generate strategy based on market analysis
    const strategy = this.simulateStrategy(market, scenario);
    return strategy;
  }

  private simulateStrategy(
    market: { pools: PoolSnapshot[]; priceFeeds: PriceFeed[] },
    scenario?: string
  ): TradingStrategy | null {
    const now = Date.now();
    const strategyId = `strategy_${now}`;

    let strategyType: StrategyType = "swap";
    let tokenIn = "CSPR";
    let tokenOut = "USDT";
    let amountIn = "100000000000"; // 100 CSPR in motes
    let description = "";

    if (scenario === "arbitrage") {
      strategyType = "arbitrage";
      tokenIn = "CSPR";
      tokenOut = "sCSPR";
      amountIn = "500000000000"; // 500 CSPR
      description =
        "CSPR→sCSPR→WETH→CSPR triangular arbitrage. " +
        "CSPR/sCSPR pool at 1:0.96, sCSPR/WETH at 1:0.0000135, " +
        "CSPR/WETH at 1:0.0000131. Estimated profit: ~2.8 CSPR after fees.";
    } else if (scenario === "yield-farming") {
      strategyType = "yield_farming";
      tokenIn = "CSPR";
      tokenOut = "USDT";
      amountIn = "200000000000"; // 200 CSPR
      description =
        "Provide CSPR+USDT liquidity to CSPR/USDT pool. " +
        "APY 35.2%, TVL $2.1M, 10bps fee tier. " +
        "Stable pair with high volume ($420K/24h). Low IL risk.";
    } else if (scenario === "risk-rejection") {
      strategyType = "swap";
      tokenIn = "CSPR";
      tokenOut = "SCAM_TOKEN";
      amountIn = "1000000000000"; // 1000 CSPR — oversized
      description =
        "Swap into newly listed SCAM_TOKEN. Limited data available, " +
        "but high volume spike detected. High risk — needs Risk Agent review.";
    } else {
      // Default: moderate CSPR→USDT swap
      description =
        `Swap ${amountIn} motes CSPR → USDT via CSPR/USDT pool. ` +
        `Current price $0.042/CSPR. Pool TVL $2.1M, depth sufficient. ` +
        `Expected slippage <0.3%. Estimated output: ~4,200 USDT.`;
    }

    const strategy: TradingStrategy = {
      id: strategyId,
      createdAt: now,
      creatorId: this.identity.id,
      status: "pending_risk_review",
      type: strategyType,
      description,
      trade: {
        tokenIn,
        tokenOut,
        amountIn,
        minAmountOut: "0", // Will be calculated after quote
        slippageBps: scenario === "risk-rejection" ? 500 : 30,
        dex: "cspr-trade",
        deadline: Math.floor(now / 1000) + 300,
      },
      analysis: {
        timestamp: now,
        pools: market.pools,
        priceFeeds: market.priceFeeds,
        recommendation: description,
        confidence: scenario === "risk-rejection" ? 0.3 : 0.85,
        dataSources: ["cspr-trade-mcp", "cspr-cloud-api"],
      },
    };

    return strategy;
  }
}

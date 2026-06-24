/**
 * Trading Guild — Entry Point
 *
 * Start the multi-agent trading system.
 *
 * Usage:
 *   npx tsx src/index.ts
 *   npx tsx src/index.ts --scenario arbitrage
 *
 * The system initializes all three agents and runs the complete
 * trade pipeline: strategy generation → risk review → execution.
 */

import { config } from "dotenv";
import { loadConfig } from "./config.js";
import { AgentOrchestrator } from "./orchestrator/index.js";

config();

async function main() {
  console.log(`\n    🏛️  Casper Autonomous Trading Guild`);
  console.log(`    ─────────────────────────────────`);
  console.log(`    Strategy Agent  •  Risk Agent  •  Execution Agent`);
  console.log(`    Powered by x402 micropayments on Casper Network\n`);

  const appConfig = loadConfig();

  if (!appConfig.claude.apiKey) {
    console.warn(`⚠️  ANTHROPIC_API_KEY not set.`);
    console.warn(`   Demo mode: agents use simulated market data.`);
    console.warn(`   Set ANTHROPIC_API_KEY in .env for Claude-powered analysis.\n`);
  }

  const orchestrator = new AgentOrchestrator(appConfig);
  await orchestrator.initialize();

  // Parse CLI args for scenario
  const scenarioArg = process.argv.find((a) => a.startsWith("--scenario="));
  const scenario = scenarioArg?.split("=")[1];

  // Run the trading pipeline
  const result = await orchestrator.runTradePipeline(scenario);

  if (!result) {
    console.log(`\n📊 Pipeline ended without executing a trade.`);
    console.log(`   This is normal when: no opportunity found, or strategy rejected by Risk Agent.\n`);
  } else {
    console.log(`\n📊 Trade Pipeline Summary:`);
    console.log(`   Strategy:   ${result.strategy.type} (${result.strategy.trade.tokenIn} → ${result.strategy.trade.tokenOut})`);
    console.log(`   Risk Score: ${result.riskAssessment.overallScore}/100 (${result.riskAssessment.recommendation})`);
    console.log(`   Execution:  ${result.executionResult.status}`);
    console.log(`   Deploy:     ${result.executionResult.deployHash}`);
    console.log(`   Amount In:  ${result.executionResult.amountIn} motes`);
    console.log(`   Amount Out: ${result.executionResult.amountOut} motes`);
    console.log(`   Slippage:   ${result.executionResult.slippage}bps\n`);

    console.log(`💰 x402 Payments:`);
    console.log(`   Risk Review:   ${result.strategyPayment.amount} motes (Strategy → Risk)`);
    console.log(`   Execution Fee: ${result.executionPayment.amount} motes (Strategy → Execution)\n`);

    // Print agent earnings
    console.log(`📈 Agent Net Positions:`);
    const ledgers = orchestrator.getPaymentLedgers();
    for (const l of ledgers) {
      const name = {
        "agent-strategy-001": "Athena (Strategy)",
        "agent-risk-001": "Guardian (Risk)",
        "agent-execution-001": "Mercury (Execution)",
      }[l.agentId] || l.agentId;
      console.log(`   ${name}: earned ${l.totalEarned} / spent ${l.totalSpent} / net ${l.netPosition} motes`);
    }
    console.log();
  }

  // Print guild state
  const state = orchestrator.getGuildState();
  console.log(`🏦 Guild Treasury:`);
  console.log(`   Total:  ${state.treasury.totalAssets} motes`);
  console.log(`   Avail:  ${state.treasury.availableForTrading} motes`);
  console.log(`   PnL:    ${state.totalPnl} motes`);
  console.log(`   Members: ${state.members.length} agents\n`);

  await orchestrator.shutdown();
  console.log(`✅ Trading Guild session complete.\n`);
}

main().catch((err) => {
  console.error(`Fatal error:`, err);
  process.exit(1);
});

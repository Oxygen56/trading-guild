#!/usr/bin/env tsx
/**
 * Trading Guild — Demo Script
 *
 * Demonstrates the complete multi-agent trading lifecycle:
 * Strategy → Risk Review → Execution, powered by x402 micropayments.
 *
 * Scenarios:
 *   --scenario default    = swap CSPR→USDT through full pipeline
 *   --scenario arbitrage  = triangular arbitrage attempt
 *   --scenario yield      = yield farming liquidity provision
 *   --scenario rejection  = risky strategy that gets rejected by Risk Agent
 *
 * Usage:
 *   npm run demo
 *   npm run demo:scenario1   (arbitrage)
 *   npm run demo:scenario2   (yield-farming)
 *   npm run demo:scenario3   (risk-rejection)
 */

import { config } from "dotenv";
import { loadConfig } from "../config.js";
import { AgentOrchestrator } from "../orchestrator/index.js";

config();

const BANNER = `
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🏛️  CASPER AUTONOMOUS TRADING GUILD — DEMO                  ║
║                                                               ║
║   Multi-Agent DeFi Hedge Fund on Casper Network               ║
║   Powered by: x402 • CSPR.trade MCP • Claude AI • Odra       ║
║                                                               ║
║   Agents:                                                     ║
║     🧠 Athena  (Strategy)  — Market analysis & strategies     ║
║     🛡️  Guardian (Risk)     — Security review & scoring       ║
║     ⚡ Mercury  (Execution) — DEX trade execution              ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`;

async function demo() {
  console.log(BANNER);

  const appConfig = loadConfig();

  if (!appConfig.claude.apiKey) {
    console.log(`⚠️  Demo running with simulated market data (no ANTHROPIC_API_KEY set).`);
    console.log(`   For Claude-powered analysis, set ANTHROPIC_API_KEY in .env\n`);
  }

  // Parse scenario — handles both --scenario=X and --scenario X
  const scenarioIdx = process.argv.findIndex((a) => a.startsWith("--scenario"));
  const rawScenario =
    process.argv[scenarioIdx]?.split("=")[1] ||
    process.argv[scenarioIdx + 1] ||
    "default";
  const scenarioMap: Record<string, string> = {
    "arbitrage": "arbitrage",
    "scenario1": "arbitrage",
    "yield": "yield-farming",
    "yield-farming": "yield-farming",
    "scenario2": "yield-farming",
    "rejection": "risk-rejection",
    "risk-rejection": "risk-rejection",
    "scenario3": "risk-rejection",
  };
  const scenario = scenarioMap[rawScenario] || "default";

  const scenarioNames: Record<string, string> = {
    default: "Standard CSPR→USDT Swap",
    arbitrage: "Triangular Arbitrage (CSPR→sCSPR→WETH→CSPR)",
    "yield-farming": "Yield Farming (CSPR+USDT LP)",
    "risk-rejection": "Risky Strategy (SCAM_TOKEN — should be rejected)",
  };
  const scenarioName = scenarioNames[scenario] || scenario;

  // ─── Init ────────────────────────────────────────────────────
  console.log(`\n─── INIT ───`);
  console.log(`Network: Casper ${appConfig.casper.network} (chain ${appConfig.casper.chainId})`);
  console.log(`x402 Facilitator: ${appConfig.x402.facilitatorUrl}`);
  console.log(`Guild Vault: ${appConfig.guild.vaultAddress.slice(0, 16)}...`);
  console.log(`Scenario: ${scenarioName}`);

  const orchestrator = new AgentOrchestrator(appConfig);
  await orchestrator.initialize();

  // ─── Pipeline ────────────────────────────────────────────────
  const result = await orchestrator.runTradePipeline(scenario);

  // ─── Results ─────────────────────────────────────────────────
  if (!result) {
    console.log(`\n╔══════════════════════════════════════════╗`);
    if (scenario === "risk-rejection") {
      console.log(`║  ✅ Demo success: Risk Agent correctly     ║`);
      console.log(`║     rejected the dangerous strategy!       ║`);
      console.log(`║     Guild treasury protected.              ║`);
    } else {
      console.log(`║  ℹ️  No trade executed.                     ║`);
      console.log(`║     No viable opportunity found.           ║`);
    }
    console.log(`╚══════════════════════════════════════════╝\n`);
  } else {
    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║  🎯 TRADE PIPELINE COMPLETE               ║`);
    console.log(`╚══════════════════════════════════════════╝`);
    console.log(`\n📊 TRADE DETAILS:`);
    console.log(`   Strategy ID:   ${result.strategy.id}`);
    console.log(`   Type:          ${result.strategy.type}`);
    console.log(`   Description:   ${result.strategy.description}`);
    console.log(`   Trade:         ${result.strategy.trade.amountIn} ${result.strategy.trade.tokenIn} → ${result.strategy.trade.tokenOut}`);
    console.log(`   Target Slip:   ${result.strategy.trade.slippageBps}bps`);

    console.log(`\n🛡️  RISK ASSESSMENT:`);
    console.log(`   Overall Score: ${result.riskAssessment.overallScore}/100`);
    console.log(`   Recommendation: ${result.riskAssessment.recommendation}`);
    console.log(`   Slippage:  ${result.riskAssessment.components.slippageRisk} | Liquidity: ${result.riskAssessment.components.liquidityRisk} | Security: ${result.riskAssessment.components.securityRisk}`);
    console.log(`   Volatility: ${result.riskAssessment.components.volatilityRisk} | Protocol: ${result.riskAssessment.components.protocolRisk} | Concentration: ${result.riskAssessment.components.concentrationRisk}`);

    console.log(`\n⚡ EXECUTION:`);
    console.log(`   Status:      ${result.executionResult.status}`);
    console.log(`   Deploy Hash: ${result.executionResult.deployHash}`);
    console.log(`   Amount In:   ${result.executionResult.amountIn} motes`);
    console.log(`   Amount Out:  ${result.executionResult.amountOut} motes`);
    console.log(`   Eff. Price:  ${result.executionResult.effectivePrice}`);
    console.log(`   Act. Slip:   ${result.executionResult.slippage}bps`);
    console.log(`   Gas Fee:     ${result.executionResult.fee} motes`);

    console.log(`\n💰 x402 AGENT PAYMENTS:`);
    console.log(`   ┌─────────────────────────────────────────────────┐`);
    console.log(`   │ Strategy → Risk (review):  ${result.strategyPayment.amount.padStart(12)} motes │`);
    console.log(`   │ Strategy → Exec (execute): ${result.executionPayment.amount.padStart(12)} motes │`);
    console.log(`   └─────────────────────────────────────────────────┘`);
    console.log(`   Payment 1: ${result.strategyPayment.id} (${result.strategyPayment.status})`);
    console.log(`   Payment 2: ${result.executionPayment.id} (${result.executionPayment.status})`);

    console.log(`\n📈 AGENT NET POSITIONS:`);
    const ledgers = orchestrator.getPaymentLedgers();
    const nameMap: Record<string, string> = {
      "agent-strategy-001": "Athena (Strategy)",
      "agent-risk-001": "Guardian (Risk)",
      "agent-execution-001": "Mercury (Execution)",
    };
    for (const l of ledgers) {
      const name = nameMap[l.agentId] || l.agentId;
      console.log(`   ${name.padEnd(20)} Earned: ${l.totalEarned.padStart(10)}  Spent: ${l.totalSpent.padStart(10)}  Net: ${l.netPosition.padStart(10)} motes`);
    }
  }

  // ─── Guild State ─────────────────────────────────────────────
  console.log(`\n🏦 GUILD TREASURY:`);
  const state = orchestrator.getGuildState();
  console.log(`   Total Assets:  ${state.treasury.totalAssets} motes`);
  console.log(`   Available:     ${state.treasury.availableForTrading} motes`);
  console.log(`   Locked:        ${state.treasury.lockedInStrategies} motes`);
  console.log(`   Total PnL:     ${state.totalPnl} motes`);
  console.log(`   Members:       ${state.members.length}`);
  console.log(`   Strategies:    ${state.activeStrategies.length} (${state.activeStrategies.filter((s) => s.status === "completed").length} completed)`);

  console.log(`\n📋 EVENT LOG (last 5):`);
  const events = orchestrator.getEventLog(5);
  for (const e of events) {
    console.log(`   [${new Date(e.timestamp).toISOString()}] ${e.type}`);
  }

  // ─── Extension Points ────────────────────────────────────────
  console.log(`\n🔌 EXTENSION POINTS (for third-party agents):`);
  console.log(`   1. Guild Registry: register agent via Odra contract`);
  console.log(`   2. Service Discovery: expose MCP endpoint + x402 pricing`);
  console.log(`   3. Payment Router: pay/receive agent fees automatically`);
  console.log(`   4. Profit Distribution: claim earnings from Guild Vault`);
  console.log(`   5. New Agent Types: extend BaseAgent, implement run()`);

  await orchestrator.shutdown();
  console.log(`\n✅ Demo complete.\n`);
}

demo().catch((err) => {
  console.error(`\n❌ Demo failed:`, err);
  process.exit(1);
});

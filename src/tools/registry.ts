/**
 * Tool Registry — Trading Guild Agent tools.
 *
 * Defines all tools available to each agent type.
 * Tools map to integrations (CSPR.trade MCP, CSPR.cloud API, x402).
 *
 * The registry is extensible: add new tools here, implement handlers
 * in the agent classes, and the Claude tool-use loop picks them up.
 */

import type { Tool } from "@anthropic-ai/sdk/resources/messages/messages.mjs";

// ─── Strategy Agent Tools ──────────────────────────────────────

export const STRATEGY_AGENT_TOOLS: Tool[] = [
  {
    name: "cspr_trade_get_pools",
    description:
      "List all liquidity pools on CSPR.trade with TVL, 24h volume, APY, and fee tier data. Use this to identify yield opportunities.",
    input_schema: {
      type: "object",
      properties: {
        tokenFilter: {
          type: "string",
          description: "Optional token symbol to filter pools",
        },
        minTVL: {
          type: "number",
          description: "Minimum TVL in USD to filter by",
        },
      },
      required: [],
    },
  },
  {
    name: "cspr_trade_get_quote",
    description:
      "Get a price quote for swapping tokens on CSPR.trade without executing the trade.",
    input_schema: {
      type: "object",
      properties: {
        tokenIn: { type: "string", description: "Input token symbol or address" },
        tokenOut: { type: "string", description: "Output token symbol or address" },
        amountIn: { type: "string", description: "Input amount in smallest unit" },
      },
      required: ["tokenIn", "tokenOut", "amountIn"],
    },
  },
  {
    name: "cspr_cloud_get_token_prices",
    description:
      "Get current token prices and 24h changes from CSPR.cloud price feeds.",
    input_schema: {
      type: "object",
      properties: {
        tokens: {
          type: "array",
          items: { type: "string" },
          description: "Array of token symbols",
        },
      },
      required: ["tokens"],
    },
  },
  {
    name: "analyze_arbitrage_opportunity",
    description:
      "Analyze potential arbitrage across CSPR.trade pools. Returns profit estimate after fees and slippage.",
    input_schema: {
      type: "object",
      properties: {
        tokenIn: { type: "string", description: "Starting token" },
        tokenOut: { type: "string", description: "Target token" },
        amountIn: { type: "string", description: "Amount to trade" },
      },
      required: ["tokenIn", "tokenOut", "amountIn"],
    },
  },
  {
    name: "submit_strategy",
    description:
      "Submit a trading strategy draft to the guild for risk review. The strategy will be automatically routed to the Risk Agent.",
    input_schema: {
      type: "object",
      properties: {
        strategyType: {
          type: "string",
          enum: ["swap", "arbitrage", "yield_farming", "liquidity_provision"],
          description: "Type of strategy",
        },
        tokenIn: { type: "string" },
        tokenOut: { type: "string" },
        amountIn: { type: "string" },
        targetSlippage: { type: "number", description: "Max slippage in bps" },
        reasoning: { type: "string", description: "Why this trade" },
      },
      required: ["strategyType", "tokenIn", "tokenOut", "amountIn", "reasoning"],
    },
  },
];

// ─── Risk Agent Tools ──────────────────────────────────────────

export const RISK_AGENT_TOOLS: Tool[] = [
  {
    name: "analyze_token_safety",
    description:
      "Check a token for security risks: honeypot detection, sell tax analysis, liquidity lock, ownership renounce.",
    input_schema: {
      type: "object",
      properties: {
        tokenAddress: { type: "string", description: "Token contract address" },
      },
      required: ["tokenAddress"],
    },
  },
  {
    name: "analyze_slippage_risk",
    description:
      "Calculate expected slippage for a trade given the pool depth and trade size.",
    input_schema: {
      type: "object",
      properties: {
        tokenIn: { type: "string" },
        tokenOut: { type: "string" },
        amountIn: { type: "string" },
        poolAddress: { type: "string", description: "Pool address on CSPR.trade" },
      },
      required: ["tokenIn", "tokenOut", "amountIn"],
    },
  },
  {
    name: "analyze_liquidity_risk",
    description:
      "Assess pool liquidity depth. Low liquidity = higher price impact on larger trades.",
    input_schema: {
      type: "object",
      properties: {
        poolAddress: { type: "string" },
        tradeSize: { type: "string", description: "Planned trade size in motes" },
      },
      required: ["poolAddress", "tradeSize"],
    },
  },
  {
    name: "assess_protocol_risk",
    description:
      "Evaluate the safety of the DEX/protocol: audit status, TVL history, incident record.",
    input_schema: {
      type: "object",
      properties: {
        protocolName: { type: "string", description: "e.g. 'cspr-trade'" },
      },
      required: ["protocolName"],
    },
  },
  {
    name: "submit_risk_assessment",
    description:
      "Submit the complete risk assessment for a strategy, including all risk scores and final recommendation.",
    input_schema: {
      type: "object",
      properties: {
        strategyId: { type: "string" },
        slippageRisk: { type: "number", description: "0-100 score" },
        liquidityRisk: { type: "number", description: "0-100 score" },
        securityRisk: { type: "number", description: "0-100 score" },
        volatilityRisk: { type: "number", description: "0-100 score" },
        protocolRisk: { type: "number", description: "0-100 score" },
        concentrationRisk: { type: "number", description: "0-100 score" },
        recommendation: {
          type: "string",
          enum: ["approve", "approve_with_caution", "reduce_position", "reject"],
        },
        maxPositionSize: { type: "string", description: "In motes" },
        reasoning: { type: "string" },
      },
      required: [
        "strategyId", "slippageRisk", "liquidityRisk", "securityRisk",
        "volatilityRisk", "protocolRisk", "concentrationRisk",
        "recommendation", "reasoning",
      ],
    },
  },
];

// ─── Execution Agent Tools ────────────────────────────────────

export const EXECUTION_AGENT_TOOLS: Tool[] = [
  {
    name: "cspr_trade_swap",
    description:
      "Execute a token swap on CSPR.trade DEX. Returns the transaction deploy hash.",
    input_schema: {
      type: "object",
      properties: {
        tokenIn: { type: "string" },
        tokenOut: { type: "string" },
        amountIn: { type: "string" },
        minAmountOut: { type: "string", description: "Minimum output to accept" },
        slippageBps: { type: "number" },
        deadline: { type: "number", description: "Unix timestamp deadline" },
      },
      required: ["tokenIn", "tokenOut", "amountIn", "minAmountOut"],
    },
  },
  {
    name: "cspr_trade_add_liquidity",
    description: "Add liquidity to a CSPR.trade pool.",
    input_schema: {
      type: "object",
      properties: {
        tokenA: { type: "string" },
        tokenB: { type: "string" },
        amountA: { type: "string" },
        amountB: { type: "string" },
      },
      required: ["tokenA", "tokenB", "amountA", "amountB"],
    },
  },
  {
    name: "cspr_cloud_get_deploy",
    description: "Check the status of a submitted transaction by deploy hash.",
    input_schema: {
      type: "object",
      properties: {
        deployHash: { type: "string" },
      },
      required: ["deployHash"],
    },
  },
  {
    name: "monitor_execution",
    description:
      "Monitor an in-flight trade execution. Polls Casper network for confirmation.",
    input_schema: {
      type: "object",
      properties: {
        strategyId: { type: "string" },
        deployHash: { type: "string" },
      },
      required: ["strategyId", "deployHash"],
    },
  },
];

// ─── Aggregate ─────────────────────────────────────────────────

export const ALL_GUILD_TOOLS: Tool[] = [
  ...STRATEGY_AGENT_TOOLS,
  ...RISK_AGENT_TOOLS,
  ...EXECUTION_AGENT_TOOLS,
];

export const TOOL_CATEGORY: Record<string, string> = {};
for (const t of STRATEGY_AGENT_TOOLS)
  TOOL_CATEGORY[t.name] = "strategy";
for (const t of RISK_AGENT_TOOLS)
  TOOL_CATEGORY[t.name] = "risk";
for (const t of EXECUTION_AGENT_TOOLS)
  TOOL_CATEGORY[t.name] = "execution";

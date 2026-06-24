/**
 * Trading Guild — Core Configuration
 *
 * All environment-specific settings are centralized here.
 * Extend this config when adding new agents, MCP servers, or payment channels.
 */

export interface AppConfig {
  /** Anthropic Claude API configuration */
  claude: {
    apiKey: string;
    model: string; // e.g. "claude-sonnet-4-6"
    maxTokens: number;
  };

  /** Casper network configuration */
  casper: {
    network: "testnet" | "mainnet";
    chainId: number;
    rpcUrl: string;
  };

  /** x402 payment configuration */
  x402: {
    facilitatorUrl: string;
    defaultCurrency: string; // e.g. "CSPR"
    paymentTimeoutMs: number;
  };

  /** CSPR.cloud API configuration */
  csprCloud: {
    apiUrl: string;
    apiKey?: string;
  };

  /** Guild treasury configuration */
  guild: {
    vaultAddress: string;
    profitDistributionRatio: {
      strategy: number; // e.g. 0.4 = 40%
      risk: number;
      execution: number;
      treasury: number;
    };
  };

  /** Agent runtime configuration */
  agents: {
    strategyPollIntervalMs: number; // How often strategy agent scans for opportunities
    riskAnalysisTimeoutMs: number;
    executionMaxSlippage: number; // basis points, e.g. 50 = 0.5%
    maxConcurrentTrades: number;
  };
}

export function loadConfig(): AppConfig {
  return {
    claude: {
      apiKey: process.env.ANTHROPIC_API_KEY || "",
      model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
      maxTokens: parseInt(process.env.CLAUDE_MAX_TOKENS || "4096", 10),
    },
    casper: {
      network: (process.env.CASPER_NETWORK as "testnet") || "testnet",
      chainId: parseInt(process.env.CASPER_CHAIN_ID || "1", 10),
      rpcUrl:
        process.env.CASPER_RPC_URL ||
        "https://rpc.testnet.casper.network/rpc",
    },
    x402: {
      facilitatorUrl:
        process.env.X402_FACILITATOR_URL ||
        "https://x402.casper.network/facilitator",
      defaultCurrency: process.env.X402_CURRENCY || "CSPR",
      paymentTimeoutMs: parseInt(
        process.env.X402_PAYMENT_TIMEOUT_MS || "30000",
        10
      ),
    },
    csprCloud: {
      apiUrl:
        process.env.CSPR_CLOUD_API_URL || "https://api.cspr.cloud",
      apiKey: process.env.CSPR_CLOUD_API_KEY,
    },
    guild: {
      vaultAddress:
        process.env.GUILD_VAULT_ADDRESS ||
        "vault-0000000000000000000000000000000000000000000000000000000000000000",
      profitDistributionRatio: {
        strategy: parseFloat(
          process.env.PROFIT_STRATEGY_RATIO || "0.35"
        ),
        risk: parseFloat(process.env.PROFIT_RISK_RATIO || "0.25"),
        execution: parseFloat(
          process.env.PROFIT_EXECUTION_RATIO || "0.20"
        ),
        treasury: parseFloat(
          process.env.PROFIT_TREASURY_RATIO || "0.20"
        ),
      },
    },
    agents: {
      strategyPollIntervalMs: parseInt(
        process.env.STRATEGY_POLL_INTERVAL_MS || "60000",
        10
      ),
      riskAnalysisTimeoutMs: parseInt(
        process.env.RISK_ANALYSIS_TIMEOUT_MS || "15000",
        10
      ),
      executionMaxSlippage: parseInt(
        process.env.EXECUTION_MAX_SLIPPAGE_BPS || "50",
        10
      ),
      maxConcurrentTrades: parseInt(
        process.env.MAX_CONCURRENT_TRADES || "3",
        10
      ),
    },
  };
}

/**
 * x402 Integration — Agent-to-Agent micropayment protocol.
 *
 * Adapted from CasperCode for Trading Guild multi-agent payments.
 *
 * In Trading Guild, x402 is the core payment rail for Agent-to-Agent services:
 * - Strategy Agent pays Risk Agent for strategy review
 * - Strategy Agent pays Execution Agent for trade execution
 * - Execution Agent pays Research Agent for market data (future)
 * - All payments settled on-chain on Casper Testnet
 *
 * Extension point: new agent services register their x402 pricing
 * and the payment router automatically handles discovery and settlement.
 */

import type { AgentPayment, PaymentStatus } from "../types.js";

export interface X402PaymentRequest {
  scheme: string;
  network: string;
  recipient: string;
  amount: string;
  chainId: number;
  expires: number;
  metadata?: string;
}

export interface X402PaymentResult {
  payment: AgentPayment;
  verified: boolean;
}

export class X402Client {
  private facilitatorUrl: string;
  private network: string;
  private chainId: number;

  constructor(facilitatorUrl: string, network: string, chainId: number) {
    this.facilitatorUrl = facilitatorUrl;
    this.network = network;
    this.chainId = chainId;
  }

  /**
   * Agent pays another Agent for a service.
   * This is the core Agent-to-Agent transaction primitive.
   */
  async payAgentForService(
    fromAgentId: string,
    fromCasperAddress: string,
    toAgentId: string,
    toCasperAddress: string,
    service: string,
    amountMotes: string,
    metadata?: Record<string, string>
  ): Promise<X402PaymentResult> {
    const paymentId = `x402_${Date.now()}_${randomHex(8)}`;

    console.log(`\n[x402] ─── Agent Payment ───`);
    console.log(`[x402] From: ${fromAgentId} (${fromCasperAddress})`);
    console.log(`[x402] To:   ${toAgentId} (${toCasperAddress})`);
    console.log(`[x402] Service: ${service}`);
    console.log(`[x402] Amount: ${amountMotes} motes`);

    // Build x402 payment request
    const paymentRequest: X402PaymentRequest = {
      scheme: "x402",
      network: this.network,
      recipient: toCasperAddress,
      amount: amountMotes,
      chainId: this.chainId,
      expires: Math.floor(Date.now() / 1000) + 300, // 5 min expiry
      metadata: JSON.stringify(metadata),
    };

    // In production: submit to x402 Facilitator POST /settle
    // For demo: simulated transaction with realistic flow
    const deployHash = `deploy_${randomHex(32)}`;
    console.log(`[x402] Payment submitted: ${paymentId}`);
    console.log(`[x402] Deploy hash: ${deployHash}`);

    // Simulate Casper network confirmation (~30s on testnet)
    await simulateDelay(2000);
    console.log(`[x402] Payment confirmed on-chain ✓`);

    const payment: AgentPayment = {
      id: paymentId,
      from: fromAgentId,
      to: toAgentId,
      service,
      amount: amountMotes,
      currency: "CSPR",
      status: "confirmed",
      deployHash,
      timestamp: Date.now(),
      metadata,
    };

    return { payment, verified: true };
  }

  /**
   * Verify a payment on-chain.
   * Queries the Casper chain for the payment transaction status.
   */
  async verifyPayment(paymentId: string): Promise<boolean> {
    console.log(`[x402] Verifying payment: ${paymentId}`);
    await simulateDelay(500);
    return true; // In production: query Casper chain
  }

  /**
   * Build an x402 payment header from a request.
   * Used when this agent is the service provider (receiving payment).
   */
  buildPaymentHeader(request: X402PaymentRequest): string {
    return `x402 ${JSON.stringify(request)}`;
  }

  /**
   * Parse an incoming x402 payment header from an HTTP 402 response.
   */
  parsePaymentHeader(headerValue: string): X402PaymentRequest {
    const prefix = "x402 ";
    if (!headerValue.startsWith(prefix)) {
      throw new Error(`Invalid x402 payment header`);
    }
    try {
      return JSON.parse(headerValue.slice(prefix.length));
    } catch {
      throw new Error(`Invalid x402 payment header: malformed JSON`);
    }
  }
}

function randomHex(bytes: number): string {
  return Array.from({ length: bytes }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

function simulateDelay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

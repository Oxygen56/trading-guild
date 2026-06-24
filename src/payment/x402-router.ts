/**
 * x402 Payment Router — Agent-to-Agent micropayment orchestration.
 *
 * Central payment hub for the Trading Guild. Every inter-agent
 * service call routes through here:
 *
 *   Strategy Agent ──pay──▶ Risk Agent (strategy review)
 *   Strategy Agent ──pay──▶ Execution Agent (trade execution)
 *   Execution Agent ──pay──▶ Research Agent (market data, future)
 *
 * The router handles:
 * - Service discovery (which agent provides what, at what x402 price)
 * - Payment execution (delegate to X402Client)
 * - Payment verification (on-chain confirmation)
 * - Payment ledger (track all agent earnings/spending)
 *
 * Extension point: third-party agents register services + pricing
 * via registerService(), and the router auto-discovers them.
 */

import type { AgentPayment, AgentIdentity, PaymentLedgerEntry } from "../types.js";
import { X402Client } from "../integrations/x402.js";

export interface RegisteredService {
  agentId: string;
  serviceName: string;
  description: string;
  priceMotes: string;
  currency: string;
  casperAddress: string;
}

export class X402PaymentRouter {
  private x402: X402Client;
  private services: Map<string, RegisteredService[]> = new Map(); // agentId -> services
  private ledger: Map<string, PaymentLedgerEntry> = new Map(); // agentId -> ledger
  private paymentHistory: AgentPayment[] = [];

  constructor(x402Client: X402Client) {
    this.x402 = x402Client;
  }

  /** Register an agent's x402-paid services */
  registerService(agent: AgentIdentity, service: RegisteredService): void {
    const existing = this.services.get(agent.id) || [];
    existing.push(service);
    this.services.set(agent.id, existing);

    if (!this.ledger.has(agent.id)) {
      this.ledger.set(agent.id, {
        agentId: agent.id,
        totalEarned: "0",
        totalSpent: "0",
        netPosition: "0",
        paymentCount: 0,
        lastPaymentAt: 0,
      });
    }

    console.log(
      `[PaymentRouter] Registered: ${agent.name} / ${service.serviceName} @ ${service.priceMotes} motes`
    );
  }

  /** Discover available services by name */
  discoverService(serviceName: string): RegisteredService[] {
    const results: RegisteredService[] = [];
    for (const [, svcs] of this.services) {
      for (const s of svcs) {
        if (s.serviceName === serviceName) {
          results.push(s);
        }
      }
    }
    return results;
  }

  /** List all registered services (for frontend dashboard) */
  listAllServices(): RegisteredService[] {
    const all: RegisteredService[] = [];
    for (const [, svcs] of this.services) {
      all.push(...svcs);
    }
    return all;
  }

  /**
   * Execute an Agent-to-Agent payment.
   * Returns the confirmed payment record.
   */
  async executePayment(
    fromAgent: AgentIdentity,
    toAgent: AgentIdentity,
    serviceName: string,
    strategyId?: string
  ): Promise<AgentPayment> {
    // Find the service and its price
    const services = this.discoverService(serviceName);
    const match = services.find((s) => s.agentId === toAgent.id);

    if (!match) {
      throw new Error(
        `Service '${serviceName}' not found for agent ${toAgent.id}. ` +
        `Available from this agent: ${services.filter(s => s.agentId === toAgent.id).map(s => s.serviceName).join(", ") || "none"}`
      );
    }

    console.log(`\n[PaymentRouter] ${fromAgent.name} → ${toAgent.name}: ${serviceName}`);
    console.log(`[PaymentRouter] Price: ${match.priceMotes} motes`);

    // Execute the x402 payment
    const result = await this.x402.payAgentForService(
      fromAgent.id,
      fromAgent.casperAddress,
      toAgent.id,
      toAgent.casperAddress,
      serviceName,
      match.priceMotes,
      strategyId ? { strategyId } : undefined
    );

    // Update ledger
    this.recordPayment(result.payment);
    this.paymentHistory.push(result.payment);

    return result.payment;
  }

  /** Get an agent's payment ledger */
  getLedger(agentId: string): PaymentLedgerEntry | undefined {
    return this.ledger.get(agentId);
  }

  /** Get all ledgers (for frontend agent performance table) */
  getAllLedgers(): PaymentLedgerEntry[] {
    return Array.from(this.ledger.values());
  }

  /** Get payment history */
  getPaymentHistory(limit = 20): AgentPayment[] {
    return this.paymentHistory.slice(-limit).reverse();
  }

  /** Verify a payment on-chain */
  async verifyPayment(paymentId: string): Promise<boolean> {
    return this.x402.verifyPayment(paymentId);
  }

  private recordPayment(payment: AgentPayment): void {
    // Update sender ledger
    const senderLedger = this.ledger.get(payment.from);
    if (senderLedger) {
      senderLedger.totalSpent = addMotes(senderLedger.totalSpent, payment.amount);
      senderLedger.netPosition = subMotes(senderLedger.totalEarned, senderLedger.totalSpent);
      senderLedger.paymentCount++;
      senderLedger.lastPaymentAt = Date.now();
    }

    // Update receiver ledger
    const receiverLedger = this.ledger.get(payment.to);
    if (receiverLedger) {
      receiverLedger.totalEarned = addMotes(receiverLedger.totalEarned, payment.amount);
      receiverLedger.netPosition = subMotes(receiverLedger.totalEarned, receiverLedger.totalSpent);
      receiverLedger.paymentCount++;
      receiverLedger.lastPaymentAt = Date.now();
    }
  }
}

// Simple mote arithmetic (string-based to avoid precision loss)
function addMotes(a: string, b: string): string {
  return (BigInt(a) + BigInt(b)).toString();
}

function subMotes(a: string, b: string): string {
  const result = BigInt(a) - BigInt(b);
  return result < 0n ? "0" : result.toString();
}

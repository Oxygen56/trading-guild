/**
 * Base Agent — Shared agent lifecycle, Claude tool-use loop, and identity.
 *
 * All Trading Guild agents (Strategy, Risk, Execution) extend this base.
 * Each specialized agent:
 * - Has its own identity (role, casper address, pricing)
 * - Has its own tool set (defined in tools/registry.ts)
 * - Has its own system prompt
 * - Participates in the x402 payment economy
 *
 * Extension point: new agent types (Research, Liquidity, Arbitrage...)
 * extend BaseAgent, implement run(), and register services via x402.
 */

import Anthropic from "@anthropic-ai/sdk";
import type { Tool } from "@anthropic-ai/sdk/resources/messages/messages.mjs";
import type {
  AgentIdentity, AgentRole, GuildEvent,
} from "../types.js";
import type { AppConfig } from "../config.js";
import { McpBridge } from "../integrations/mcp-bridge.js";
import type { McpServerConfig } from "../integrations/mcp-bridge.js";

export abstract class BaseAgent {
  readonly identity: AgentIdentity;
  protected config: AppConfig;
  protected claude: Anthropic;
  protected mcp: McpBridge;
  protected tools: Tool[];
  protected systemPrompt: string;
  private eventHandlers: Map<string, Array<(event: GuildEvent) => void>> = new Map();

  constructor(
    id: string,
    role: AgentRole,
    name: string,
    description: string,
    casperAddress: string,
    config: AppConfig,
    mcpServers: McpServerConfig[],
    tools: Tool[],
    systemPrompt: string,
    pricing?: AgentIdentity["pricing"]
  ) {
    this.identity = { id, role, name, description, casperAddress, pricing };
    this.config = config;
    this.claude = new Anthropic({ apiKey: config.claude.apiKey });
    this.mcp = new McpBridge();
    this.tools = tools;
    this.systemPrompt = systemPrompt;
  }

  /** Connect to MCP servers needed by this agent */
  async initialize(): Promise<void> {
    console.log(`\n[${this.identity.name}] Initializing...`);
    // Subclass defines which MCP servers to connect to
  }

  /** Emit a guild event for the frontend dashboard */
  emit(type: GuildEvent["type"], data: unknown): void {
    const event: GuildEvent = { type, timestamp: Date.now(), data };
    const handlers = this.eventHandlers.get(type) || [];
    for (const handler of handlers) {
      handler(event);
    }
  }

  /** Subscribe to guild events */
  on(type: GuildEvent["type"], handler: (event: GuildEvent) => void): void {
    const handlers = this.eventHandlers.get(type) || [];
    handlers.push(handler);
    this.eventHandlers.set(type, handlers);
  }

  /** Main agent logic — must be implemented by subclasses */
  abstract run(input?: unknown): Promise<unknown>;

  /** Shutdown the agent */
  async shutdown(): Promise<void> {
    console.log(`[${this.identity.name}] Shutting down...`);
    await this.mcp.disconnectAll();
  }
}

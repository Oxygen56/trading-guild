/**
 * MCP Bridge — Unified transport layer for Casper MCP Servers.
 *
 * Adapted from CasperCode for Trading Guild.
 * Handles connection lifecycle, tool discovery, and invocation
 * for external MCP servers (CSPR.trade, CSPR.cloud, custom).
 *
 * Extension points:
 * - Add new MCP servers via `connect()` without modifying Agent core
 * - Support for stdio/SSE/HTTP transports
 * - Tool discovery caching for performance
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export interface McpToolResult {
  content: Array<{ type: "text"; text: string }>;
  isError?: boolean;
}

export interface McpServerConfig {
  name: string;
  transport: "stdio" | "sse" | "http";
  command?: string;
  args?: string[];
  url?: string;
}

export class McpBridge {
  private servers: Map<string, Client> = new Map();
  private toolCache: Map<string, string[]> = new Map();

  async connect(serverConfig: McpServerConfig): Promise<void> {
    if (this.servers.has(serverConfig.name)) return;

    const client = new Client(
      { name: "trading-guild-agent", version: "1.0.0" },
      { capabilities: {} }
    );

    if (serverConfig.transport === "stdio") {
      if (!serverConfig.command) {
        throw new Error(
          `MCP Server ${serverConfig.name}: stdio transport requires 'command'`
        );
      }
      const transport = new StdioClientTransport({
        command: serverConfig.command,
        args: serverConfig.args || [],
      });
      try {
        await client.connect(transport);
      } catch (err) {
        console.warn(
          `[MCP] ⚠️  Could not connect to ${serverConfig.name} — ` +
          `running with simulated data. Error: ${(err as Error).message}`
        );
        return; // don't crash — agent works with simulated data
      }
    } else {
      throw new Error(
        `MCP Server ${serverConfig.name}: transport ${serverConfig.transport} not yet implemented`
      );
    }

    this.servers.set(serverConfig.name, client);
  }

  async listTools(serverName: string): Promise<string[]> {
    if (this.toolCache.has(serverName)) {
      return this.toolCache.get(serverName)!;
    }
    const client = this.servers.get(serverName);
    if (!client) {
      console.warn(`[MCP] Server '${serverName}' not connected — returning empty tool list`);
      return [];
    }
    const result = await client.listTools();
    const tools = result.tools.map((t) => t.name);
    this.toolCache.set(serverName, tools);
    return tools;
  }

  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, unknown>
  ): Promise<McpToolResult> {
    const client = this.servers.get(serverName);
    if (!client) {
      console.warn(`[MCP] Server '${serverName}' not connected — returning simulated result for ${toolName}`);
      return {
        content: [{ type: "text", text: JSON.stringify({ simulated: true, tool: toolName, args }) }],
      };
    }
    const result = await client.callTool({ name: toolName, arguments: args });
    return result as McpToolResult;
  }

  /** Get default MCP server configs for Trading Guild */
  getDefaultServers(): McpServerConfig[] {
    return [
      {
        name: "cspr-trade",
        transport: "stdio",
        command: "npx",
        args: ["-y", "@cspr-trade/mcp-server"],
      },
      {
        name: "cspr-cloud",
        transport: "stdio",
        command: "npx",
        args: ["-y", "@cspr-cloud/mcp-server"],
      },
    ];
  }

  isConnected(serverName: string): boolean {
    return this.servers.has(serverName);
  }

  async disconnectAll(): Promise<void> {
    for (const [name] of this.servers) {
      try {
        const client = this.servers.get(name);
        if (client) await client.close();
      } catch {
        // ignore disconnect errors
      }
    }
    this.servers.clear();
    this.toolCache.clear();
  }
}

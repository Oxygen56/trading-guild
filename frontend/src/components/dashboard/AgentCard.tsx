"use client";

import { AgentInfo } from "@/lib/types";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface AgentCardProps {
  agent: AgentInfo;
}

export function AgentCard({ agent }: AgentCardProps) {
  return (
    <div className="p-5 bg-bg-card border border-border-subtle rounded-xl transition-colors duration-150 hover:border-border-default hover:bg-bg-card-hover">
      <div className="flex items-center gap-4 mb-4">
        <AgentAvatar role={agent.role} emoji={agent.avatar} size="md" showPulse={agent.status !== "idle"} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
          <p className="text-xs text-text-tertiary capitalize">{agent.role} Agent</p>
        </div>
        <StatusBadge status={agent.status} />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        {agent.strategiesCount !== undefined && (
          <div>
            <span className="text-text-tertiary">Strategies</span>
            <p className="font-semibold text-text-primary">{agent.strategiesCount}</p>
          </div>
        )}
        {agent.successRate !== undefined && (
          <div>
            <span className="text-text-tertiary">Success Rate</span>
            <p className="font-semibold text-profit">{agent.successRate}%</p>
          </div>
        )}
        {agent.totalPnl !== undefined && (
          <div>
            <span className="text-text-tertiary">Total PnL</span>
            <p className={`font-semibold ${agent.totalPnl >= 0 ? "text-profit" : "text-loss"}`}>
              {agent.totalPnl > 0 ? "+" : ""}{agent.totalPnl} CSPR
            </p>
          </div>
        )}
        <div>
          <span className="text-text-tertiary">Last Action</span>
          <p className="font-medium text-text-secondary">{agent.lastAction}</p>
        </div>
      </div>
    </div>
  );
}

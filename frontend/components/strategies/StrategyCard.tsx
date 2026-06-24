"use client";

import { Strategy } from "@/lib/types";
import { clsx } from "clsx";
import AgentAvatar from "@/components/shared/AgentAvatar";
import StatusBadge from "@/components/shared/StatusBadge";
import ChainTxLink from "@/components/shared/ChainTxLink";
import ProgressTracker from "@/components/strategies/ProgressTracker";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface StrategyCardProps {
  strategy: Strategy;
  compact?: boolean;
}

export default function StrategyCard({
  strategy,
  compact = false,
}: StrategyCardProps) {
  const [expanded, setExpanded] = useState(false);

  const statusVariant = {
    proposed: "pending" as const,
    "in-review": "auditing" as const,
    executing: "executing" as const,
    completed: "completed" as const,
    rejected: "rejected" as const,
  };

  const borderColor = {
    strategy: "var(--color-agent-strategy)",
    risk: "var(--color-agent-risk)",
    execution: "var(--color-agent-execution)",
  };

  const agentName = {
    strategy: "Athena",
    risk: "Guardian",
    execution: "Mercury",
  };

  return (
    <div
      className={clsx(
        "bg-bg-card border border-border-subtle rounded-lg transition-colors duration-fast hover:border-border-default cursor-pointer",
        !compact && "border-l-[3px]"
      )}
      style={
        !compact
          ? { borderLeftColor: borderColor[strategy.agentType] }
          : undefined
      }
      onClick={() => setExpanded(!expanded)}
    >
      <div className={clsx(compact ? "p-4" : "p-5")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AgentAvatar type={strategy.agentType} size="sm" showRing={false} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">
                  {agentName[strategy.agentType]}
                </span>
                <span className="text-xs text-text-tertiary">
                  #{strategy.id}
                </span>
                <span className="text-xs text-text-tertiary">
                  · {strategy.timestamp}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-0.5 line-clamp-1">
                {strategy.title}
              </p>
            </div>
          </div>
          <StatusBadge
            status={statusVariant[strategy.status]}
            pulse={strategy.status === "in-review" || strategy.status === "executing"}
          />
        </div>

        {!compact && (
          <>
            <div className="mt-3">
              <ProgressTracker status={strategy.status} />
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 mt-3 text-xs text-text-tertiary">
              <span>
                Risk Score:{" "}
                <span
                  className={clsx(
                    "font-medium",
                    strategy.riskScore >= 70
                      ? "text-profit"
                      : strategy.riskScore >= 40
                      ? "text-warning"
                      : "text-loss"
                  )}
                >
                  {strategy.riskScore}/100
                </span>
              </span>
              {strategy.estimatedFee > 0 && (
                <span>Est. Fee: {strategy.estimatedFee} CSPR (x402)</span>
              )}
              {strategy.pnl !== undefined && (
                <span
                  className={clsx(
                    "font-medium",
                    strategy.pnl >= 0 ? "text-profit" : "text-loss"
                  )}
                >
                  PnL: {strategy.pnl >= 0 ? "+" : ""}
                  {strategy.pnl} CSPR
                  {strategy.pnlPercent && ` (${strategy.pnlPercent >= 0 ? "+" : ""}${strategy.pnlPercent}%)`}
                </span>
              )}
            </div>

            {strategy.txHash && (
              <div className="mt-2">
                <ChainTxLink txHash={strategy.txHash} />
              </div>
            )}

            {strategy.rejectReason && (
              <div className="mt-3 p-3 bg-loss/5 border border-loss/20 rounded-md text-sm text-loss">
                🛡️ Risk Agent: {strategy.rejectReason}
              </div>
            )}
          </>
        )}

        {/* Expanded details */}
        {expanded && strategy.details && (
          <div className="mt-4 pt-4 border-t border-border-subtle space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-text-tertiary">Action: </span>
                <span className="text-text-primary">
                  {strategy.details.action}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">Amount: </span>
                <span className="text-text-primary">
                  {strategy.details.amount}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">Slippage: </span>
                <span className="text-text-primary">
                  {strategy.details.slippage}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">Est. Output: </span>
                <span className="text-text-primary">
                  {strategy.details.estimatedOutput}
                </span>
              </div>
              <div>
                <span className="text-text-tertiary">DEX: </span>
                <span className="text-text-primary">
                  {strategy.details.dex}
                </span>
              </div>
            </div>
          </div>
        )}

        {compact && (
          <button className="mt-2 text-xs text-text-tertiary hover:text-text-secondary transition-colors flex items-center gap-1">
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> Details
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

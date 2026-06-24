"use client";

import { Strategy } from "@/lib/types";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ChainTxLink } from "@/components/shared/ChainTxLink";
import { ProgressTracker } from "./ProgressTracker";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface StrategyCardProps {
  strategy: Strategy;
  compact?: boolean;
}

const borderColors: Record<string, string> = {
  proposed: "border-l-agent-strategy",
  in_review: "border-l-agent-risk",
  executing: "border-l-agent-execution",
  completed: "border-l-profit",
  rejected: "border-l-loss",
};

export function StrategyCard({ strategy, compact = false }: StrategyCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`bg-bg-card border border-border-default rounded-xl transition-all duration-150 hover:border-border-accent overflow-hidden ${
        borderColors[strategy.status] || ""
      } border-l-[3px]`}
    >
      <div
        className={`p-4 ${!compact ? "cursor-pointer" : ""}`}
        onClick={() => !compact && setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <AgentAvatar role={strategy.agent} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text-primary">
                {strategy.agentName}
              </span>
              <span className="text-xs text-text-tertiary font-mono">
                #{strategy.number}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">{strategy.timeAgo}</span>
            <StatusBadge status={strategy.status} />
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary mb-3 ml-[42px]">
          {strategy.description}
        </p>

        {/* Progress tracker */}
        {strategy.steps.length > 0 && (
          <div className="mb-3 ml-[42px]">
            <ProgressTracker
              steps={strategy.steps}
              rejected={strategy.status === "rejected"}
            />
          </div>
        )}

        {/* Footer meta */}
        <div className="flex items-center gap-4 ml-[42px] text-xs text-text-tertiary flex-wrap">
          {strategy.riskScore !== undefined && (
            <span>
              Risk Score:{" "}
              <span
                className={
                  strategy.riskScore >= 80
                    ? "text-profit"
                    : strategy.riskScore >= 60
                    ? "text-warning"
                    : "text-loss"
                }
              >
                {strategy.riskScore}/100
              </span>
            </span>
          )}
          {strategy.fee && <span>Fee: {strategy.fee}</span>}
          {strategy.pnl !== undefined && (
            <span
              className={`font-medium ${
                strategy.pnl >= 0 ? "text-profit" : "text-loss"
              }`}
            >
              PnL: {strategy.pnl > 0 ? "+" : ""}
              {strategy.pnl} CSPR
              {strategy.pnlPercent !== undefined &&
                ` (${strategy.pnlPercent > 0 ? "+" : ""}${strategy.pnlPercent}%)`}
            </span>
          )}
          {strategy.txHash && <ChainTxLink txHash={strategy.txHash} />}
        </div>

        {/* Rejection reason */}
        {strategy.rejectionReason && (
          <div className="mt-3 ml-[42px] p-3 bg-loss/5 border border-loss/20 rounded-lg">
            <p className="text-xs text-loss flex items-start gap-1.5">
              <span>🛡️</span>
              <span>{strategy.rejectionReason}</span>
            </p>
          </div>
        )}

        {/* Expand indicator */}
        {!compact && (
          <div className="mt-3 ml-[42px] flex items-center gap-1 text-xs text-text-tertiary">
            {expanded ? (
              <>
                <ChevronUp className="w-3 h-3" /> Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-3 h-3" /> Details
              </>
            )}
          </div>
        )}
      </div>

      {/* Expanded details */}
      {expanded && !compact && strategy.params && (
        <div className="border-t border-border-subtle px-4 py-3 bg-bg-layer-2 animate-slide-up">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs ml-[42px]">
            <DetailItem label="Token In" value={strategy.params.tokenIn} />
            <DetailItem label="Token Out" value={strategy.params.tokenOut} />
            <DetailItem label="Amount" value={strategy.params.amountIn} />
            <DetailItem label="Slippage" value={`≤ ${strategy.params.slippage}%`} />
            <DetailItem label="DEX" value={strategy.params.dex} />
            <DetailItem label="Est. Output" value={strategy.params.estOutput} />
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-text-tertiary">{label}</span>
      <p className="font-medium text-text-primary">{value}</p>
    </div>
  );
}

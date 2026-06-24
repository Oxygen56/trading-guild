"use client";

import { Strategy } from "@/lib/types";

interface StrategyProposalCardProps {
  strategy: Strategy;
  onApprove?: () => void;
  onReject?: () => void;
}

export function StrategyProposalCard({
  strategy,
  onApprove,
  onReject,
}: StrategyProposalCardProps) {
  return (
    <div className="p-4 bg-bg-card border border-border-default rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-text-primary">
          Strategy Proposal #{strategy.number}
        </h4>
        <span className="text-xs text-text-tertiary">{strategy.timeAgo}</span>
      </div>

      {strategy.params && (
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div>
            <span className="text-text-tertiary">Action</span>
            <p className="font-medium text-text-primary">
              Swap {strategy.params.amountIn} → {strategy.params.tokenOut}
            </p>
          </div>
          <div>
            <span className="text-text-tertiary">DEX</span>
            <p className="font-medium text-text-primary">{strategy.params.dex}</p>
          </div>
          <div>
            <span className="text-text-tertiary">Slippage</span>
            <p className="font-medium text-text-primary">
              ≤ {strategy.params.slippage}%
            </p>
          </div>
          <div>
            <span className="text-text-tertiary">Est. Output</span>
            <p className="font-medium text-text-primary">
              {strategy.params.estOutput}
            </p>
          </div>
        </div>
      )}

      {strategy.riskScore !== undefined && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-text-tertiary">Risk Score</span>
            <span
              className={`font-medium ${
                strategy.riskScore >= 80
                  ? "text-profit"
                  : strategy.riskScore >= 60
                  ? "text-warning"
                  : "text-loss"
              }`}
            >
              {strategy.riskScore}/100
            </span>
          </div>
          <div className="h-1.5 bg-bg-layer-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                strategy.riskScore >= 80
                  ? "bg-profit"
                  : strategy.riskScore >= 60
                  ? "bg-warning"
                  : "bg-loss"
              }`}
              style={{ width: `${strategy.riskScore}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onApprove}
          className="flex-1 px-4 py-2 bg-accent text-text-on-accent text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 px-4 py-2 bg-loss/10 text-loss text-sm font-medium rounded-lg hover:bg-loss/20 transition-colors border border-loss/20"
        >
          Reject
        </button>
        <button className="px-4 py-2 bg-bg-layer-2 text-text-secondary text-sm font-medium rounded-lg hover:text-text-primary transition-colors border border-border-default">
          Modify
        </button>
      </div>
    </div>
  );
}

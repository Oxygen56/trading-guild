"use client";

import { StrategyProposal } from "@/lib/types";
import { Check, X, Settings } from "lucide-react";
import { useState } from "react";

interface StrategyProposalCardProps {
  proposal: StrategyProposal;
}

export default function StrategyProposalCard({
  proposal,
}: StrategyProposalCardProps) {
  const [action, setAction] = useState<"approved" | "rejected" | null>(null);

  if (action === "approved") {
    return (
      <div className="bg-profit/10 border border-profit/20 rounded-lg p-4 text-sm">
        <p className="text-profit font-medium">✅ Strategy Approved</p>
        <p className="text-text-tertiary text-xs mt-1">
          Forwarding to Risk Agent for audit...
        </p>
      </div>
    );
  }

  if (action === "rejected") {
    return (
      <div className="bg-loss/10 border border-loss/20 rounded-lg p-4 text-sm">
        <p className="text-loss font-medium">❌ Strategy Rejected</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card border border-border-default rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
          Strategy Proposal #{proposal.id}
        </span>
        <span
          className={`text-xs font-medium ${
            proposal.riskScore >= 70
              ? "text-profit"
              : proposal.riskScore >= 40
              ? "text-warning"
              : "text-loss"
          }`}
        >
          Risk: {proposal.riskScore}/100
        </span>
      </div>
      <div className="space-y-1.5 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-text-tertiary">Action</span>
          <span className="text-text-primary">{proposal.action}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-tertiary">Slippage</span>
          <span className="text-text-primary">{proposal.slippage}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-text-tertiary">Est. Output</span>
          <span className="text-text-primary">
            {proposal.estimatedOutput}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setAction("approved")}
          className="flex items-center gap-1.5 px-4 py-2 bg-accent text-bg-root text-sm font-medium rounded-md hover:bg-accent-hover transition-colors duration-fast"
        >
          <Check className="w-4 h-4" />
          Approve
        </button>
        <button
          onClick={() => setAction("rejected")}
          className="flex items-center gap-1.5 px-4 py-2 bg-loss/10 text-loss text-sm font-medium rounded-md hover:bg-loss/20 transition-colors duration-fast"
        >
          <X className="w-4 h-4" />
          Reject
        </button>
        <button className="flex items-center gap-1.5 px-3 py-2 text-text-tertiary text-sm font-medium rounded-md hover:text-text-secondary hover:bg-bg-layer-2 transition-colors duration-fast">
          <Settings className="w-4 h-4" />
          Modify
        </button>
      </div>
    </div>
  );
}

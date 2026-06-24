"use client";

import { ChatMessage } from "@/lib/types";
import AgentAvatar from "@/components/shared/AgentAvatar";
import StrategyProposalCard from "@/components/terminal/StrategyProposalCard";
import { clsx } from "clsx";

interface AgentBubbleProps {
  message: ChatMessage;
}

const agentNameMap: Record<string, string> = {
  strategy: "Athena",
  risk: "Guardian",
  execution: "Mercury",
};

export default function AgentBubble({ message }: AgentBubbleProps) {
  if (message.sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] bg-bg-card border border-border-subtle rounded-l-lg rounded-br-lg px-4 py-3">
          <p className="text-sm text-text-primary">{message.content}</p>
        </div>
      </div>
    );
  }

  const borderColor = {
    strategy: "var(--color-agent-strategy)",
    risk: "var(--color-agent-risk)",
    execution: "var(--color-agent-execution)",
  };

  return (
    <div
      className="flex gap-3 border-l-[3px] bg-bg-layer-2 rounded-r-lg px-4 py-3"
      style={{ borderLeftColor: borderColor[message.sender as keyof typeof borderColor] }}
    >
      <AgentAvatar type={message.sender as "strategy" | "risk" | "execution"} size="md" className="mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-text-primary">
            {agentNameMap[message.sender]}
          </span>
          <span className="text-xs text-text-tertiary">
            {message.timestamp}
          </span>
        </div>
        <p className="text-sm text-text-secondary whitespace-pre-wrap">
          {message.content}
        </p>
        {message.proposal && (
          <div className="mt-3">
            <StrategyProposalCard proposal={message.proposal} />
          </div>
        )}
      </div>
    </div>
  );
}

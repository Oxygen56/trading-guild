"use client";

import { ChatMessage } from "@/lib/types";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { StrategyProposalCard } from "./StrategyProposalCard";

interface AgentBubbleProps {
  message: ChatMessage;
}

const borderColors = {
  strategy: "border-l-agent-strategy",
  risk: "border-l-agent-risk",
  execution: "border-l-agent-execution",
};

export function AgentBubble({ message }: AgentBubbleProps) {
  // User message
  if (message.sender === "user") {
    return (
      <div className="flex justify-end mb-4">
        <div className="max-w-[80%] px-4 py-3 bg-bg-card rounded-l-xl rounded-br-xl">
          <p className="text-sm text-text-primary whitespace-pre-wrap">
            {message.content}
          </p>
          <p className="text-[10px] text-text-tertiary mt-1 text-right">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    );
  }

  // Agent message
  const borderColor = borderColors[message.sender] || "border-l-border-default";

  return (
    <div className={`mb-4 border-l-[3px] ${borderColor} pl-3`}>
      <div className="flex items-center gap-2 mb-1.5">
        <AgentAvatar role={message.sender} size="sm" />
        <span className="text-xs font-medium text-text-primary">
          {message.senderName}
        </span>
        <span className="text-[10px] text-text-tertiary">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <div className="bg-bg-layer-2 rounded-lg p-3">
        <p className="text-sm text-text-secondary whitespace-pre-wrap">
          {message.content}
        </p>
        {message.embeddedCard && (
          <div className="mt-3">
            <StrategyProposalCard strategy={message.embeddedCard} />
          </div>
        )}
      </div>
    </div>
  );
}

import { AgentType } from "@/lib/types";

const agentConfig: Record<
  AgentType,
  { emoji: string; color: string; mutedColor: string }
> = {
  strategy: {
    emoji: "🧠",
    color: "var(--color-agent-strategy)",
    mutedColor: "var(--color-agent-strategy-muted)",
  },
  risk: {
    emoji: "🛡️",
    color: "var(--color-agent-risk)",
    mutedColor: "var(--color-agent-risk-muted)",
  },
  execution: {
    emoji: "⚡",
    color: "var(--color-agent-execution)",
    mutedColor: "var(--color-agent-execution-muted)",
  },
};

const sizeClasses: Record<string, string> = {
  sm: "w-6 h-6 text-xs",
  md: "w-10 h-10 text-lg",
  lg: "w-16 h-16 text-2xl",
};

interface AgentAvatarProps {
  type: AgentType;
  size?: "sm" | "md" | "lg";
  showRing?: boolean;
  className?: string;
}

export default function AgentAvatar({
  type,
  size = "md",
  showRing = true,
  className = "",
}: AgentAvatarProps) {
  const config = agentConfig[type];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        backgroundColor: config.mutedColor,
        ...(showRing
          ? { boxShadow: `0 0 0 2px ${config.color}40` }
          : {}),
      }}
      title={`${type} Agent`}
    >
      <span className="leading-none">{config.emoji}</span>
    </div>
  );
}

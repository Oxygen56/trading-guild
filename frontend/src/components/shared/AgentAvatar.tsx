import { AgentRole } from "@/lib/types";

interface AgentAvatarProps {
  role: AgentRole;
  emoji?: string;
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
}

const roleDefaults: Record<AgentRole, { emoji: string; color: string; ring: string }> = {
  strategy: { emoji: "🧠", color: "bg-agent-strategy/20", ring: "ring-agent-strategy/30" },
  risk: { emoji: "🛡️", color: "bg-agent-risk/20", ring: "ring-agent-risk/30" },
  execution: { emoji: "⚡", color: "bg-agent-execution/20", ring: "ring-agent-execution/30" },
};

const sizeClasses = {
  sm: "w-6 h-6 text-xs",
  md: "w-10 h-10 text-lg",
  lg: "w-16 h-16 text-2xl",
};

export function AgentAvatar({ role, emoji, size = "md", showPulse = false }: AgentAvatarProps) {
  const defaults = roleDefaults[role];
  const displayEmoji = emoji || defaults.emoji;

  return (
    <div className={`relative inline-flex items-center justify-center rounded-full ${sizeClasses[size]} ${defaults.color} ring-1 ${defaults.ring}`}>
      <span className="leading-none">{displayEmoji}</span>
      {showPulse && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-bg-card animate-pulse-glow" />
      )}
    </div>
  );
}

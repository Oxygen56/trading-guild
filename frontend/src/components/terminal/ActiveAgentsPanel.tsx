import { AgentInfo } from "@/lib/types";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface ActiveAgentsPanelProps {
  agents: AgentInfo[];
}

export function ActiveAgentsPanel({ agents }: ActiveAgentsPanelProps) {
  return (
    <div className="p-5 bg-bg-card border border-border-subtle rounded-xl">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Active Agents</h3>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div key={agent.id} className="flex items-center gap-3">
            <AgentAvatar role={agent.role} emoji={agent.avatar} size="md" showPulse={agent.status !== "idle"} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-text-primary">{agent.name}</span>
                <StatusBadge status={agent.status} />
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                {agent.status === "idle"
                  ? `Last action: ${agent.lastAction}`
                  : agent.status === "auditing"
                  ? `Current: Strategy #42`
                  : agent.status === "executing"
                  ? `Tx today: 3`
                  : `Last action: ${agent.lastAction}`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Agent } from "@/lib/types";
import AgentAvatar from "@/components/shared/AgentAvatar";
import StatusBadge from "@/components/shared/StatusBadge";

interface AgentStatusPanelProps {
  agents: Agent[];
}

const agentNameMap: Record<string, string> = {
  strategy: "Athena",
  risk: "Guardian",
  execution: "Mercury",
};

const roleMap: Record<string, string> = {
  strategy: "Strategy Lead",
  risk: "Risk Auditor",
  execution: "Trade Executor",
};

export default function AgentStatusPanel({ agents }: AgentStatusPanelProps) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg p-5">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Active Agents
      </h3>
      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex items-start gap-3 p-3 rounded-lg bg-bg-layer-2 border border-border-subtle"
          >
            <AgentAvatar type={agent.type} size="md" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-text-primary truncate">
                  {agentNameMap[agent.type]}
                </p>
                <StatusBadge
                  status={
                    agent.status === "auditing"
                      ? "auditing"
                      : agent.status === "executing"
                      ? "executing"
                      : "idle"
                  }
                  pulse={agent.status !== "idle"}
                />
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">
                {roleMap[agent.type]}
              </p>
              <div className="mt-2 space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Last action:</span>
                  <span className="text-text-secondary">
                    {agent.lastAction}
                  </span>
                </div>
                {agent.txToday > 0 && (
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">Tx today:</span>
                    <span className="text-text-secondary">
                      {agent.txToday}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

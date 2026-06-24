import { mockAgents } from "@/lib/mock-data";
import AgentAvatar from "@/components/shared/AgentAvatar";
import StatusBadge from "@/components/shared/StatusBadge";

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

export default function AgentStatusCards() {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">
        Active Agents
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {mockAgents.map((agent) => (
          <div
            key={agent.id}
            className="bg-bg-card border border-border-subtle rounded-lg p-4 hover:border-border-default transition-colors duration-fast"
          >
            <div className="flex items-center gap-3 mb-3">
              <AgentAvatar type={agent.type} size="md" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {agentNameMap[agent.type] || agent.name}
                </p>
                <p className="text-xs text-text-tertiary">
                  {roleMap[agent.type]}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Status</span>
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
              <div className="flex justify-between">
                <span className="text-text-tertiary">Strategies</span>
                <span className="text-text-secondary">
                  {agent.strategies}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Success Rate</span>
                <span className="text-profit font-medium">
                  {agent.successRate}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

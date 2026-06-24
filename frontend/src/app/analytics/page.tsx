import { AppShell } from "@/components/layout/AppShell";
import { PnLChart } from "@/components/dashboard/PnLChart";
import { AgentPerformanceTable } from "@/components/analytics/AgentPerformanceTable";
import { ProfitDistribution } from "@/components/analytics/ProfitDistribution";
import { MetricCard } from "@/components/dashboard/MetricCard";
import {
  mockPnlData,
  mockAgentPerformance,
  mockDistributions,
  mockAgents,
} from "@/lib/mock-data";

export default function AnalyticsPage() {
  const totalPnL = mockAgentPerformance.reduce((sum, a) => sum + a.pnl, 0);
  const totalStrategies = mockAgentPerformance.reduce((sum, a) => sum + a.strategies, 0);
  const avgSuccessRate = Math.round(
    mockAgentPerformance.reduce((sum, a) => sum + a.successRate, 0) /
      mockAgentPerformance.length
  );

  return (
    <AppShell>
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">Analytics</h1>
          <p className="text-sm text-text-tertiary mt-1">
            Performance metrics, agent rankings, and profit distribution
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            label="Total PnL"
            value={`${totalPnL > 0 ? "+" : ""}${totalPnL.toLocaleString()} CSPR`}
            change={`+${totalPnL}`}
            changePositive={totalPnL > 0}
          />
          <MetricCard
            label="Total Strategies"
            value={`${totalStrategies}`}
            subValue={`${mockAgents.length} agents active`}
          />
          <MetricCard
            label="Avg Success Rate"
            value={`${avgSuccessRate}%`}
            subValue="Across all agents"
          />
        </div>

        {/* PnL Chart */}
        <PnLChart data={mockPnlData} />

        {/* Agent Performance + Profit Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          <AgentPerformanceTable data={mockAgentPerformance} />
          <ProfitDistribution data={mockDistributions} />
        </div>
      </div>
    </AppShell>
  );
}

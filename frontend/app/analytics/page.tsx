import {
  pnlChartData,
  mockAgentPerformance,
  profitDistribution,
  mockTransactions,
} from "@/lib/mock-data";
import PnLTimeline from "@/components/analytics/PnLTimeline";
import AgentPerformanceTable from "@/components/analytics/AgentPerformanceTable";
import ProfitDistribution from "@/components/analytics/ProfitDistribution";
import TransactionHistory from "@/components/analytics/TransactionHistory";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">
          Analytics
        </h2>
        <p className="text-sm text-text-tertiary mt-1">
          Performance metrics, agent rankings, and profit attribution
        </p>
      </div>

      {/* PnL Timeline */}
      <PnLTimeline data={pnlChartData} />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AgentPerformanceTable data={mockAgentPerformance} />
        <div className="space-y-4">
          <ProfitDistribution data={profitDistribution} />
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory transactions={mockTransactions} />
    </div>
  );
}

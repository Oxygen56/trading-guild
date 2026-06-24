import MetricCardGrid from "@/components/dashboard/MetricCardGrid";
import PnLChart from "@/components/dashboard/PnLChart";
import AssetAllocation from "@/components/dashboard/AssetAllocation";
import AgentStatusCards from "@/components/dashboard/AgentStatusCards";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page title */}
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">
          Guild Overview
        </h2>
        <p className="text-sm text-text-tertiary mt-1">
          Real-time status of the Autonomous Trading Guild
        </p>
      </div>

      {/* Metrics */}
      <MetricCardGrid />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <PnLChart />
        </div>
        <AssetAllocation />
      </div>

      {/* Agent status cards */}
      <AgentStatusCards />

      {/* Recent activity */}
      <RecentActivityFeed />
    </div>
  );
}

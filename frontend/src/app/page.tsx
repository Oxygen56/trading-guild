import { AppShell } from "@/components/layout/AppShell";
import { VaultOverview } from "@/components/dashboard/VaultOverview";
import { AgentCard } from "@/components/dashboard/AgentCard";
import { PnLChart } from "@/components/dashboard/PnLChart";
import { AssetAllocation } from "@/components/dashboard/AssetAllocation";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import {
  mockAgents,
  mockPnlData,
  mockAssetAllocation,
  mockStrategies,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const recentStrategies = mockStrategies.slice(0, 3);

  return (
    <AppShell>
      <div className="space-y-6 animate-slide-up">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">
            Guild Overview
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Real-time status of the autonomous trading guild
          </p>
        </div>

        {/* Vault Overview */}
        <VaultOverview />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PnLChart data={mockPnlData} />
          <AssetAllocation data={mockAssetAllocation} />
        </div>

        {/* Agent Cards */}
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">Active Agents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivityFeed strategies={recentStrategies} />
      </div>
    </AppShell>
  );
}

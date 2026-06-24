"use client";

import { MetricCard } from "./MetricCard";
import { mockVaultMetrics } from "@/lib/mock-data";

export function VaultOverview() {
  const m = mockVaultMetrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Total Value Locked"
        value={`${m.tvl.toLocaleString()} CSPR`}
        subValue={`≈ $${m.tvlUsd.toLocaleString()} USD`}
      />
      <MetricCard
        label="24h PnL"
        value={`${m.pnl24hPercent > 0 ? "+" : ""}${m.pnl24hPercent}%`}
        subValue={`↑ $${m.pnl24h} USD`}
        change={`+$${m.pnl24h}`}
        changePositive={true}
      />
      <MetricCard
        label="Active Agents"
        value={`${m.activeAgents}`}
        subValue="● ● ●"
      />
      <MetricCard
        label="Guild Members"
        value={`${m.guildMembers}`}
        subValue="View all →"
      />
    </div>
  );
}

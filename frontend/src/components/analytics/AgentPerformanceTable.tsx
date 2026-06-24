"use client";

import { AgentPerformance } from "@/lib/types";
import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { useState } from "react";

interface AgentPerformanceTableProps {
  data: AgentPerformance[];
}

type SortKey = "rank" | "pnl" | "strategies" | "successRate";

export function AgentPerformanceTable({ data }: AgentPerformanceTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = [...data].sort((a, b) => {
    const aVal = a[sortKey];
    const bVal = b[sortKey];
    return sortAsc ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(key === "rank");
    }
  };

  const SortHeader = ({ label, sortKey: k }: { label: string; sortKey: SortKey }) => (
    <button
      onClick={() => handleSort(k)}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-text-tertiary hover:text-text-secondary transition-colors"
    >
      {label}
      {sortKey === k && (
        <span className="text-[10px]">{sortAsc ? "↑" : "↓"}</span>
      )}
    </button>
  );

  return (
    <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden">
      <div className="p-5 border-b border-border-subtle">
        <h3 className="text-sm font-semibold text-text-primary">Agent Performance</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-subtle">
              <th className="px-5 py-3 text-left"><SortHeader label="#" sortKey="rank" /></th>
              <th className="px-5 py-3 text-left"><span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Agent</span></th>
              <th className="px-5 py-3 text-right"><SortHeader label="PnL" sortKey="pnl" /></th>
              <th className="px-5 py-3 text-right"><SortHeader label="Strategies" sortKey="strategies" /></th>
              <th className="px-5 py-3 text-right"><SortHeader label="Success" sortKey="successRate" /></th>
              <th className="px-5 py-3 text-right"><span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">Performance</span></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((agent) => (
              <tr
                key={agent.rank}
                className="border-b border-border-subtle last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-3 text-sm font-mono text-text-tertiary">
                  {agent.rank}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <AgentAvatar role={agent.role} size="sm" />
                    <span className="text-sm font-medium text-text-primary">{agent.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <span className={`text-sm font-medium ${agent.pnl >= 0 ? "text-profit" : "text-loss"}`}>
                    {agent.pnl > 0 ? "+" : ""}{agent.pnl} CSPR
                  </span>
                </td>
                <td className="px-5 py-3 text-right text-sm text-text-secondary">
                  {agent.strategies}
                </td>
                <td className="px-5 py-3 text-right text-sm text-text-secondary">
                  {agent.successRate}%
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-bg-layer-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${agent.successRate}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

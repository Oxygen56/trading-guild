"use client";

import { Strategy } from "@/lib/types";
import { StrategyCard } from "@/components/strategies/StrategyCard";
import { useState } from "react";

interface RecentActivityFeedProps {
  strategies: Strategy[];
}

type FilterStatus = "all" | "proposed" | "in_review" | "executing" | "completed";

export function RecentActivityFeed({ strategies }: RecentActivityFeedProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");

  const filtered =
    filter === "all"
      ? strategies
      : strategies.filter((s) => s.status === filter);

  return (
    <div className="p-5 bg-bg-card border border-border-subtle rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          Recent Strategy Activity
        </h3>
        <div className="flex gap-1 flex-wrap">
          {(
            [
              { key: "all", label: "All" },
              { key: "proposed", label: "Proposed" },
              { key: "in_review", label: "In Review" },
              { key: "executing", label: "Executing" },
              { key: "completed", label: "Completed" },
            ] as { key: FilterStatus; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                filter === key
                  ? "bg-accent/15 text-accent"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} compact />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-8">
          No strategies match this filter.
        </p>
      )}
    </div>
  );
}

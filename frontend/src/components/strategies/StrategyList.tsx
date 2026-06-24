"use client";

import { Strategy } from "@/lib/types";
import { StrategyCard } from "./StrategyCard";
import { useState } from "react";

interface StrategyListProps {
  strategies: Strategy[];
}

type StatusFilter = "all" | "pending" | "done";

export function StrategyList({ strategies }: StrategyListProps) {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<"newest" | "pnl">("newest");

  const filtered = strategies.filter((s) => {
    if (filter === "all") return true;
    if (filter === "pending") return s.status === "proposed" || s.status === "in_review" || s.status === "executing";
    if (filter === "done") return s.status === "completed" || s.status === "rejected";
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return (b.pnl || 0) - (a.pnl || 0);
  });

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {(
            [
              { key: "all", label: "All" },
              { key: "pending", label: "Pending" },
              { key: "done", label: "Done" },
            ] as { key: StatusFilter; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-accent/15 text-accent"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSort(sort === "newest" ? "pnl" : "newest")}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-tertiary hover:text-text-secondary transition-colors border border-border-subtle"
        >
          Sort: {sort === "newest" ? "Newest" : "PnL"}
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {sorted.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
      </div>

      {sorted.length === 0 && (
        <p className="text-sm text-text-tertiary text-center py-12">
          No strategies match the current filter.
        </p>
      )}
    </div>
  );
}

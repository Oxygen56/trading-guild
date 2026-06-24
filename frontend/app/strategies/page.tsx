"use client";

import { useState } from "react";
import { mockStrategies } from "@/lib/mock-data";
import StrategyCard from "@/components/strategies/StrategyCard";
import StrategyFilter from "@/components/strategies/StrategyFilter";
import { StrategyStatus } from "@/lib/types";

export default function StrategiesPage() {
  const [filter, setFilter] = useState<StrategyStatus | "all">("all");

  const filtered =
    filter === "all"
      ? mockStrategies
      : mockStrategies.filter((s) => s.status === filter);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">
          Strategy Feed
        </h2>
        <p className="text-sm text-text-tertiary mt-1">
          Full lifecycle tracking — from proposal to on-chain execution
        </p>
      </div>

      <StrategyFilter active={filter} onChange={setFilter} />

      <div className="space-y-3">
        {filtered.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-text-tertiary">
            No strategies match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}

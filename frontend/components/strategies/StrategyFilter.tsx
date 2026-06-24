"use client";

import { clsx } from "clsx";
import { StrategyStatus } from "@/lib/types";

const filters: { label: string; value: StrategyStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "proposed" },
  { label: "In Review", value: "in-review" },
  { label: "Executing", value: "executing" },
  { label: "Completed", value: "completed" },
  { label: "Rejected", value: "rejected" },
];

interface StrategyFilterProps {
  active: StrategyStatus | "all";
  onChange: (value: StrategyStatus | "all") => void;
}

export default function StrategyFilter({
  active,
  onChange,
}: StrategyFilterProps) {
  return (
    <div className="flex gap-1 bg-bg-card border border-border-subtle rounded-lg p-1 overflow-x-auto">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          className={clsx(
            "px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors duration-fast",
            active === f.value
              ? "bg-accent-muted text-accent"
              : "text-text-tertiary hover:text-text-secondary hover:bg-bg-layer-2"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}

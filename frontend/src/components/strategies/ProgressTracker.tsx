"use client";

import { StrategyStep } from "@/lib/types";

interface ProgressTrackerProps {
  steps: StrategyStep[];
  rejected?: boolean;
}

const stepColors = {
  done: { dot: "bg-accent", line: "bg-accent" },
  active: { dot: "bg-warning", line: "bg-gradient-to-r from-accent to-border-default" },
  pending: { dot: "bg-border-strong", line: "bg-border-default" },
  rejected: { dot: "bg-loss", line: "bg-loss/30" },
};

export function ProgressTracker({ steps, rejected }: ProgressTrackerProps) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => {
        const color = stepColors[step.status];

        return (
          <div key={step.label} className="flex items-center flex-1 last:flex-none">
            {/* Dot + Label */}
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  color.dot
                } ${
                  step.status === "active"
                    ? "animate-pulse-glow ring-2 ring-warning/30"
                    : ""
                } ${
                  step.status === "rejected"
                    ? "ring-2 ring-loss/30"
                    : ""
                }`}
              />
              <span className="text-[10px] text-text-tertiary whitespace-nowrap">
                {step.label}
              </span>
              {step.time && (
                <span
                  className={`text-[9px] ${
                    step.status === "rejected"
                      ? "text-loss"
                      : step.status === "done"
                      ? "text-profit"
                      : "text-text-tertiary"
                  }`}
                >
                  {step.status === "done" ? "✅" : step.status === "rejected" ? "❌" : ""}{" "}
                  {step.time}
                </span>
              )}
            </div>

            {/* Connecting line */}
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1">
                <div
                  className={`h-full rounded-full transition-colors duration-300 ${
                    rejected && (step.status === "rejected" || steps[i + 1].status === "pending")
                      ? "bg-border-default opacity-30"
                      : color.line
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

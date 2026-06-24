import { clsx } from "clsx";
import { StrategyStatus } from "@/lib/types";

const stages = [
  { key: "proposed" as const, label: "Proposed" },
  { key: "in-review" as const, label: "Risk Review" },
  { key: "executing" as const, label: "Execute" },
  { key: "completed" as const, label: "Done" },
];

const stageIndexMap: Record<StrategyStatus, number> = {
  proposed: 0,
  "in-review": 1,
  executing: 2,
  completed: 3,
  rejected: -1,
};

interface ProgressTrackerProps {
  status: StrategyStatus;
}

export default function ProgressTracker({ status }: ProgressTrackerProps) {
  const currentIndex = stageIndexMap[status];
  const isRejected = status === "rejected";

  return (
    <div className="flex items-center w-full">
      {stages.map((stage, index) => {
        let dotState: "done" | "active" | "pending" | "rejected";

        if (isRejected && index === 0) {
          dotState = "rejected";
        } else if (isRejected) {
          dotState = "pending";
        } else if (index < currentIndex) {
          dotState = "done";
        } else if (index === currentIndex) {
          dotState = "active";
        } else {
          dotState = "pending";
        }

        return (
          <div key={stage.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-1.5">
              {/* Dot */}
              <div
                className={clsx(
                  "w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0",
                  dotState === "done" && "bg-accent",
                  dotState === "active" && "bg-warning animate-pulse",
                  dotState === "pending" && "bg-border-default",
                  dotState === "rejected" && "bg-loss"
                )}
              >
                {dotState === "done" && (
                  <svg
                    className="w-2 h-2 text-bg-root"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              {/* Label */}
              <span
                className={clsx(
                  "text-xs whitespace-nowrap",
                  dotState === "done" && "text-accent",
                  dotState === "active" && "text-warning font-medium",
                  dotState === "pending" && "text-text-tertiary",
                  dotState === "rejected" && "text-loss"
                )}
              >
                {stage.label}
              </span>
            </div>
            {/* Connector line */}
            {index < stages.length - 1 && (
              <div
                className={clsx(
                  "flex-1 h-px mx-2",
                  index < currentIndex
                    ? "bg-accent"
                    : index === currentIndex && !isRejected
                    ? "bg-gradient-to-r from-warning to-border-default"
                    : isRejected
                    ? "bg-border-subtle"
                    : "bg-border-subtle"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

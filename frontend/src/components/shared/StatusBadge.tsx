interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles: Record<
  string,
  { bg: string; text: string; dot?: string }
> = {
  active: { bg: "bg-profit/15", text: "text-profit", dot: "bg-profit" },
  confirmed: { bg: "bg-profit/15", text: "text-profit", dot: "bg-profit" },
  approved: { bg: "bg-profit/15", text: "text-profit", dot: "bg-profit" },
  profit: { bg: "bg-profit/15", text: "text-profit", dot: "bg-profit" },
  completed: { bg: "bg-profit/15", text: "text-profit", dot: "bg-profit" },
  done: { bg: "bg-profit/15", text: "text-profit", dot: "bg-profit" },
  success: { bg: "bg-profit/15", text: "text-profit", dot: "bg-profit" },

  pending: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  auditing: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  in_review: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  in_progress: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  proposed: { bg: "bg-agent-strategy-muted", text: "text-agent-strategy", dot: "bg-agent-strategy" },

  executing: {
    bg: "bg-agent-execution-muted",
    text: "text-agent-execution",
    dot: "bg-agent-execution",
  },

  rejected: { bg: "bg-loss/15", text: "text-loss", dot: "bg-loss" },
  failed: { bg: "bg-loss/15", text: "text-loss", dot: "bg-loss" },

  idle: { bg: "bg-white/5", text: "text-text-tertiary", dot: "bg-text-tertiary" },
  working: { bg: "bg-agent-strategy-muted", text: "text-agent-strategy", dot: "bg-agent-strategy" },
};

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.idle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text} ${className}`}
    >
      {style.dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${style.dot} ${
            status === "executing" || status === "auditing" || status === "in_progress"
              ? "animate-pulse-glow"
              : ""
          }`}
        />
      )}
      {formatStatus(status)}
    </span>
  );
}

function formatStatus(status: string): string {
  const map: Record<string, string> = {
    active: "Active",
    confirmed: "Confirmed",
    approved: "Approved",
    profit: "Profit",
    completed: "Completed",
    done: "Done",
    success: "Success",
    pending: "Pending",
    auditing: "Auditing",
    in_review: "In Review",
    in_progress: "In Progress",
    proposed: "Pending Review",
    executing: "Executing",
    rejected: "Rejected",
    failed: "Failed",
    idle: "Idle",
    working: "Working",
  };
  return map[status] || status;
}

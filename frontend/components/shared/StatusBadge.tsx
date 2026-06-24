import { clsx } from "clsx";

type StatusVariant =
  | "active"
  | "confirmed"
  | "approved"
  | "profit"
  | "pending"
  | "auditing"
  | "in-progress"
  | "executing"
  | "rejected"
  | "failed"
  | "idle"
  | "completed";

const variantStyles: Record<StatusVariant, string> = {
  active: "bg-profit/20 text-profit",
  confirmed: "bg-profit/20 text-profit",
  approved: "bg-profit/20 text-profit",
  profit: "bg-profit/20 text-profit",
  pending: "bg-warning/20 text-warning",
  auditing: "bg-warning/20 text-warning",
  "in-progress": "bg-warning/20 text-warning",
  executing: "bg-agent-execution-muted text-agent-execution",
  rejected: "bg-loss/20 text-loss",
  failed: "bg-loss/20 text-loss",
  idle: "bg-text-tertiary/20 text-text-tertiary",
  completed: "bg-profit/20 text-profit",
};

interface StatusBadgeProps {
  status: StatusVariant;
  pulse?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  pulse = false,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        variantStyles[status] || variantStyles.idle,
        pulse && "animate-pulse",
        className
      )}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  subValue?: string;
  change?: string;
  changePositive?: boolean;
  variant?: "default" | "agent" | "compact";
}

export function MetricCard({
  label,
  value,
  subValue,
  change,
  changePositive,
  variant = "default",
}: MetricCardProps) {
  if (variant === "compact") {
    return (
      <div className="px-3 py-2">
        <p className="text-xs text-text-tertiary">{label}</p>
        <p className="text-sm font-semibold text-text-primary font-display">{value}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-bg-card border border-border-subtle rounded-xl min-w-[200px] transition-colors duration-150 hover:border-border-default">
      <p className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-2">
        {label}
      </p>
      <p className="text-4xl font-bold text-text-primary font-display mb-1">{value}</p>
      {subValue && (
        <p className="text-sm text-text-tertiary mb-2">{subValue}</p>
      )}
      {change && (
        <span
          className={`inline-flex items-center gap-1 text-xs font-medium ${
            changePositive ? "text-profit" : "text-loss"
          }`}
        >
          <span>{changePositive ? "↑" : "↓"}</span>
          {change}
        </span>
      )}
    </div>
  );
}

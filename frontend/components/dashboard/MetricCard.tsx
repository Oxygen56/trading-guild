import { MetricData } from "@/lib/types";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MetricCardProps {
  data: MetricData;
}

export default function MetricCard({ data }: MetricCardProps) {
  const changeColor =
    data.changePositive === undefined
      ? "text-text-tertiary"
      : data.changePositive
      ? "text-profit"
      : "text-loss";

  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg p-6 hover:border-border-default transition-colors duration-fast">
      <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
        {data.label}
      </p>
      <p className="font-display text-3xl font-bold text-text-primary mb-1">
        {data.value}
      </p>
      {data.subValue && (
        <p className="text-sm text-text-tertiary">{data.subValue}</p>
      )}
      {data.change && (
        <div
          className={`flex items-center gap-1 mt-3 text-sm font-medium ${changeColor}`}
        >
          {data.changePositive === true && (
            <TrendingUp className="w-4 h-4" />
          )}
          {data.changePositive === false && (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{data.change}</span>
        </div>
      )}
    </div>
  );
}

import { mockMetrics } from "@/lib/mock-data";
import MetricCard from "@/components/dashboard/MetricCard";

export default function MetricCardGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockMetrics.map((metric) => (
        <MetricCard key={metric.label} data={metric} />
      ))}
    </div>
  );
}

import { mockStrategies } from "@/lib/mock-data";
import StrategyCard from "@/components/strategies/StrategyCard";

export default function RecentActivityFeed() {
  const recentStrategies = mockStrategies.slice(0, 3);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">
        Recent Strategy Activity
      </h3>
      <div className="space-y-2">
        {recentStrategies.map((strategy) => (
          <StrategyCard key={strategy.id} strategy={strategy} compact />
        ))}
      </div>
    </div>
  );
}

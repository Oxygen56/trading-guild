import { AppShell } from "@/components/layout/AppShell";
import { StrategyList } from "@/components/strategies/StrategyList";
import { mockStrategies } from "@/lib/mock-data";

export default function StrategiesPage() {
  const allStrategies = [...mockStrategies].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <AppShell>
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-2xl font-bold text-text-primary font-display">
            Strategy Feed
          </h1>
          <p className="text-sm text-text-tertiary mt-1">
            Complete lifecycle of every strategy — from proposal to execution
          </p>
        </div>

        <StrategyList strategies={allStrategies} />
      </div>
    </AppShell>
  );
}

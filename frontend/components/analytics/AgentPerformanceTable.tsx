import { AgentPerformance } from "@/lib/types";
import AgentAvatar from "@/components/shared/AgentAvatar";
import { clsx } from "clsx";

interface AgentPerformanceTableProps {
  data: AgentPerformance[];
  sortBy?: "pnl" | "volume";
}

export default function AgentPerformanceTable({
  data,
  sortBy = "pnl",
}: AgentPerformanceTableProps) {
  const sorted = [...data].sort((a, b) => {
    if (sortBy === "pnl") return b.pnl - a.pnl;
    return b.strategies - a.strategies;
  });

  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg overflow-hidden">
      <div className="p-5 pb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Agent Performance Ranking
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-y border-border-subtle">
              <th className="text-left py-3 px-5 text-xs font-medium text-text-tertiary uppercase tracking-wider w-12">
                #
              </th>
              <th className="text-left py-3 px-5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Agent
              </th>
              <th className="text-right py-3 px-5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                PnL
              </th>
              <th className="text-right py-3 px-5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Strategies
              </th>
              <th className="text-right py-3 px-5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Success
              </th>
              <th className="hidden sm:table-cell text-right py-3 px-5 text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Performance
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, idx) => (
              <tr
                key={row.agent}
                className="border-b border-border-subtle hover:bg-bg-card-hover transition-colors duration-fast"
              >
                <td className="py-3 px-5">
                  <span
                    className={clsx(
                      "text-xs font-bold",
                      idx === 0
                        ? "text-accent"
                        : idx === 1
                        ? "text-text-secondary"
                        : "text-text-tertiary"
                    )}
                  >
                    {idx + 1}
                  </span>
                </td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <AgentAvatar type={row.agentType} size="sm" showRing={false} />
                    <span className="text-text-primary font-medium">
                      {row.agent}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-5 text-right">
                  <span
                    className={clsx(
                      "font-mono font-medium",
                      row.pnl >= 0 ? "text-profit" : "text-loss"
                    )}
                  >
                    {row.pnl >= 0 ? "+" : ""}
                    {row.pnl} CSPR
                  </span>
                </td>
                <td className="py-3 px-5 text-right text-text-secondary">
                  {row.strategies}
                </td>
                <td className="py-3 px-5 text-right">
                  <span
                    className={clsx(
                      "font-medium",
                      row.successRate >= 80
                        ? "text-profit"
                        : row.successRate >= 60
                        ? "text-warning"
                        : "text-loss"
                    )}
                  >
                    {row.successRate}%
                  </span>
                </td>
                <td className="hidden sm:table-cell py-3 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-16 h-1.5 bg-bg-layer-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{
                          width: `${Math.min(row.successRate, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

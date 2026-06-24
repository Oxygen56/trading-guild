"use client";

import { DistributionRecord } from "@/lib/types";

interface ProfitDistributionProps {
  data: DistributionRecord[];
}

export function ProfitDistribution({ data }: ProfitDistributionProps) {
  const totalPercent = data.reduce((sum, d) => sum + d.percentage, 0);

  return (
    <div className="p-5 bg-bg-card border border-border-subtle rounded-xl">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Profit Distribution
      </h3>

      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-text-secondary">{item.pool}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium text-text-primary">
                  {item.percentage}%
                </span>
                <span className="text-xs text-text-tertiary ml-1.5">
                  {item.amount} CSPR
                </span>
              </div>
            </div>

            <div className="h-2 bg-bg-layer-2 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(item.percentage / totalPercent) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-bg-layer-2 rounded-lg">
        <p className="text-xs text-text-tertiary">
          Profits are automatically distributed via smart contract on Casper Testnet.
          Each strategy completion triggers the distribution based on agent contributions.
        </p>
      </div>
    </div>
  );
}

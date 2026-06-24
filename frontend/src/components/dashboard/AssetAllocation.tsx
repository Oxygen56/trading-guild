import { AssetAllocation as AssetAllocationType } from "@/lib/types";

interface AssetAllocationProps {
  data: AssetAllocationType[];
}

export function AssetAllocation({ data }: AssetAllocationProps) {
  return (
    <div className="p-5 bg-bg-card border border-border-subtle rounded-xl">
      <h3 className="text-sm font-semibold text-text-primary mb-4">Asset Allocation</h3>

      {/* Donut representation — visual bars */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.map((item, i) => {
              const offset = data.slice(0, i).reduce((sum, d) => sum + d.percentage, 0);
              const dashArray = `${item.percentage} ${100 - item.percentage}`;
              return (
                <circle
                  key={item.symbol}
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="3.5"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.symbol} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-text-secondary flex-1">
                {item.symbol}
              </span>
              <span className="text-xs font-medium text-text-primary">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bar representation */}
      <div className="flex h-2 rounded-full overflow-hidden bg-bg-layer-2">
        {data.map((item) => (
          <div
            key={item.symbol}
            className="h-full transition-all duration-500"
            style={{
              width: `${item.percentage}%`,
              backgroundColor: item.color,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-3">
        {data.map((item) => (
          <div key={item.symbol} className="text-xs">
            <span className="text-text-tertiary">{item.name}</span>
            <span className="text-text-secondary ml-1">
              {item.amount.toLocaleString()} {item.symbol !== "OTHER" ? item.symbol : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

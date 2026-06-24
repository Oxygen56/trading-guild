"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface DistributionItem {
  pool: string;
  percentage: number;
  color: string;
}

interface ProfitDistributionProps {
  data: DistributionItem[];
}

export default function ProfitDistribution({ data }: ProfitDistributionProps) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Profit Distribution
      </h3>
      <div className="flex items-center gap-6">
        <div className="w-[160px] h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={3}
                dataKey="percentage"
              >
                {data.map((entry) => (
                  <Cell key={entry.pool} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111D3A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`, ""]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-3">
          {data.map((item) => (
            <div key={item.pool} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-text-secondary">
                    {item.pool}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-bg-layer-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

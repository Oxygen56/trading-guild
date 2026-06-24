"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { mockAssets } from "@/lib/mock-data";

export default function AssetAllocation() {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg p-6">
      <h3 className="text-sm font-semibold text-text-primary mb-4">
        Asset Allocation
      </h3>
      <div className="flex items-center gap-6">
        <div className="w-[140px] h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockAssets}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={65}
                paddingAngle={2}
                dataKey="percentage"
              >
                {mockAssets.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111D3A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {mockAssets.map((asset) => (
            <div key={asset.name} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: asset.color }}
              />
              <span className="text-sm text-text-secondary flex-1">
                {asset.name}
              </span>
              <span className="text-sm font-medium text-text-primary tabular-nums">
                {asset.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

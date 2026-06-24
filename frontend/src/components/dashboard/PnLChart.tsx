"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { PnLDataPoint } from "@/lib/types";

interface PnLChartProps {
  data: PnLDataPoint[];
}

type TimeRange = "24H" | "7D" | "30D" | "ALL";

export function PnLChart({ data }: PnLChartProps) {
  const [range, setRange] = useState<TimeRange>("7D");

  return (
    <div className="p-5 bg-bg-card border border-border-subtle rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">PnL Chart</h3>
        <div className="flex gap-1">
          {(["24H", "7D", "30D", "ALL"] as TimeRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                range === r
                  ? "bg-accent/15 text-accent"
                  : "text-text-tertiary hover:text-text-secondary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="pnlGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5A0" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#00E5A0" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 11 }}
              dx={-4}
              domain={["dataMin - 500", "dataMax + 500"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111D3A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#F1F5F9",
              }}
              formatter={(value: unknown) => [`${(value as number)?.toLocaleString() ?? ""} CSPR`, "TVL"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00E5A0"
              strokeWidth={2}
              fill="url(#pnlGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

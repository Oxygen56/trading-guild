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
import { pnlChartData } from "@/lib/mock-data";
import { clsx } from "clsx";

const timeRanges = ["24H", "7D", "30D", "All"] as const;
type TimeRange = (typeof timeRanges)[number];

export default function PnLChart() {
  const [range, setRange] = useState<TimeRange>("7D");

  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          PnL Chart
        </h3>
        <div className="flex gap-1 bg-bg-layer-2 rounded-md p-0.5">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={clsx(
                "px-3 py-1 text-xs font-medium rounded transition-colors duration-fast",
                range === r
                  ? "bg-accent-muted text-accent"
                  : "text-text-tertiary hover:text-text-secondary"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={pnlChartData}>
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
              tick={{ fill: "#64748B", fontSize: 12 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748B", fontSize: 12 }}
              dx={-4}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#111D3A",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              labelStyle={{ color: "#94A3B8", marginBottom: "4px" }}
              itemStyle={{ color: "#F1F5F9" }}
              formatter={(value: number) => [
                `${value > 0 ? "+" : ""}${value} CSPR`,
                "PnL",
              ]}
            />
            <Area
              type="monotone"
              dataKey="pnl"
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

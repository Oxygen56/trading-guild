"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import { clsx } from "clsx";

const timeRanges = ["24H", "7D", "30D", "All"] as const;
type TimeRange = (typeof timeRanges)[number];

interface PnLTimelineProps {
  data: { date: string; pnl: number }[];
}

export default function PnLTimeline({ data }: PnLTimelineProps) {
  const [range, setRange] = useState<TimeRange>("7D");

  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          PnL Timeline
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
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 3"
            />
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
              }}
              labelStyle={{ color: "#94A3B8" }}
              formatter={(value: number) => [
                `${value > 0 ? "+" : ""}${value} CSPR`,
                "PnL",
              ]}
            />
            <Line
              type="monotone"
              dataKey="pnl"
              stroke="#00E5A0"
              strokeWidth={2}
              dot={{ fill: "#00E5A0", strokeWidth: 0, r: 3 }}
              activeDot={{
                fill: "#00E5A0",
                strokeWidth: 0,
                r: 5,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

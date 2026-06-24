"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Terminal,
  ListOrdered,
  BarChart3,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/terminal", label: "Terminal", icon: Terminal },
  { href: "/strategies", label: "Strategies", icon: ListOrdered },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-30 h-screen w-[260px] border-r border-border-subtle bg-bg-layer-1 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-border-subtle">
        <div className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
          <span className="text-accent font-bold text-sm">TG</span>
        </div>
        <span className="font-display font-semibold text-text-primary text-sm tracking-wide">
          Trading Guild
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/[0.04]"
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? "text-accent" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Guild Status */}
      <div className="px-3 py-4 border-t border-border-subtle space-y-3">
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Guild Status
        </p>
        <div className="space-y-1.5 px-3">
          <StatusRow label="TVL" value="12,450 CSPR" />
          <StatusRow label="Agents" value="3 Active" />
          <StatusRow
            label="24h PnL"
            value="+3.2%"
            valueClassName="text-profit"
          />
        </div>
      </div>
    </aside>
  );
}

function StatusRow({
  label,
  value,
  valueClassName = "text-text-primary",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-text-tertiary">{label}</span>
      <span className={`font-medium ${valueClassName}`}>{value}</span>
    </div>
  );
}

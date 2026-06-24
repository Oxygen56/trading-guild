"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Terminal,
  ArrowLeftRight,
  BarChart3,
  Users,
  Vault,
  Activity,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { clsx } from "clsx";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/terminal", label: "Terminal", icon: Terminal },
  { href: "/strategies", label: "Strategies", icon: ArrowLeftRight },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

const guildStats = [
  { icon: DollarSign, label: "TVL", value: "12,450 CSPR" },
  { icon: Activity, label: "Active Agents", value: "3" },
  { icon: TrendingUp, label: "24h PnL", value: "+3.2%" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-sidebar bg-bg-layer-1 border-r border-border-subtle flex flex-col z-20 overflow-y-auto">
      {/* Logo */}
      <div className="h-header flex items-center gap-3 px-6 border-b border-border-subtle flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-accent-muted flex items-center justify-center">
          <span className="text-accent text-sm font-bold">TG</span>
        </div>
        <div>
          <h1 className="font-display font-semibold text-sm text-text-primary leading-tight">
            Trading Guild
          </h1>
          <p className="text-xs text-text-tertiary">Casper Testnet</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-fast",
                isActive
                  ? "bg-accent-muted text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-layer-2"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Guild Stats */}
      <div className="px-3 py-4 border-t border-border-subtle space-y-3">
        <p className="px-3 text-xs font-medium text-text-tertiary uppercase tracking-wider">
          Guild Status
        </p>
        {guildStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 px-3 py-2"
          >
            <stat.icon className="w-4 h-4 text-text-tertiary flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-text-tertiary">{stat.label}</p>
              <p className="text-sm font-medium text-text-secondary truncate">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-border-subtle">
        <p className="text-xs text-text-tertiary">
          Casper Autonomous Trading Guild v1.0
        </p>
      </div>
    </aside>
  );
}

"use client";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export function TopBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-bg-root/80 backdrop-blur-md border-b border-border-subtle flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <h1 className="font-display font-semibold text-text-primary text-sm lg:hidden">
          Trading Guild
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Network Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-card border border-border-default text-xs font-medium text-text-secondary">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-glow" />
          Casper Testnet
        </span>

        {/* Mock Mode Indicator */}
        {process.env.NEXT_PUBLIC_CASPER_USE_MOCK === "true" && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded bg-warning/10 border border-warning/20 text-xs font-medium text-warning">
            MOCK
          </span>
        )}
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";

interface TopBarProps {
  onMenuToggle?: () => void;
}

export default function TopBar({ onMenuToggle }: TopBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="h-header bg-bg-layer-1/80 backdrop-blur-sm border-b border-border-subtle flex items-center justify-between px-6 flex-shrink-0 sticky top-0 z-10">
      {/* Left: Mobile menu button + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            onMenuToggle?.();
          }}
          className="lg:hidden p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-layer-2 transition-colors duration-fast"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Right: Network badge + status */}
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-muted border border-border-accent text-xs font-medium text-accent">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse-glow" />
          Casper Testnet
        </span>
      </div>
    </header>
  );
}

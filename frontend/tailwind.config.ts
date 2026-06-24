import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-root": "#060B1A",
        "bg-layer-1": "#0A1128",
        "bg-layer-2": "#0F1A36",
        "bg-card": "#111D3A",
        "bg-card-hover": "#162244",
        "bg-input": "#0A1128",
        "bg-modal": "#0F1A36",
        "border-subtle": "rgba(255, 255, 255, 0.06)",
        "border-default": "rgba(255, 255, 255, 0.10)",
        "border-strong": "rgba(255, 255, 255, 0.15)",
        "border-accent": "rgba(0, 229, 160, 0.30)",
        accent: "#00E5A0",
        "accent-hover": "#00C48C",
        "accent-muted": "rgba(0, 229, 160, 0.12)",
        "accent-glow": "rgba(0, 229, 160, 0.20)",
        "agent-strategy": "#6366F1",
        "agent-risk": "#F59E0B",
        "agent-execution": "#06B6D4",
        "agent-strategy-muted": "rgba(99, 102, 241, 0.15)",
        "agent-risk-muted": "rgba(245, 158, 11, 0.15)",
        "agent-execution-muted": "rgba(6, 182, 212, 0.15)",
        profit: "#10B981",
        loss: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6",
        "text-primary": "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-tertiary": "#64748B",
        "text-on-accent": "#060B1A",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "sans-serif"],
        body: ['"Inter"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },
      spacing: {
        sidebar: "260px",
        header: "64px",
      },
      maxWidth: {
        content: "1440px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        "glow-accent": "0 0 20px rgba(0, 229, 160, 0.20)",
        "glow-agent": "0 0 16px rgba(99, 102, 241, 0.25)",
      },
      transitionDuration: {
        fast: "150ms",
        normal: "250ms",
        slow: "400ms",
      },
    },
  },
  plugins: [],
};
export default config;

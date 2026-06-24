"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-root">
      <Sidebar />
      <div className="lg:ml-[260px]">
        <TopBar />
        <main className="p-6 max-w-[1440px]">{children}</main>
      </div>
    </div>
  );
}

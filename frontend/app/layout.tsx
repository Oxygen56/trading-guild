import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export const metadata: Metadata = {
  title: "Trading Guild — Casper Autonomous Trading",
  description:
    "AI-powered autonomous trading guild on Casper Testnet. Multi-agent DeFi strategies with transparent risk management and on-chain execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Sidebar />
        <div className="lg:ml-sidebar min-h-screen flex flex-col">
          <TopBar />
          <main className="flex-1 p-6 max-w-content mx-auto w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

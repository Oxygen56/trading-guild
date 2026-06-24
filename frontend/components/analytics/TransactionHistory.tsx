import { Transaction } from "@/lib/types";
import ChainTxLink from "@/components/shared/ChainTxLink";

const typeIcons: Record<string, string> = {
  swap: "🔄",
  add_liquidity: "💧",
  claim: "🏆",
  remove_liquidity: "📤",
};

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-lg overflow-hidden">
      <div className="p-5 pb-3">
        <h3 className="text-sm font-semibold text-text-primary">
          Transaction History
        </h3>
      </div>
      <div className="divide-y divide-border-subtle">
        {transactions.map((tx, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between px-5 py-3.5 hover:bg-bg-card-hover transition-colors duration-fast"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-lg">{typeIcons[tx.type] || "📋"}</span>
              <div className="min-w-0">
                <p className="text-sm text-text-primary truncate">
                  {tx.description}
                </p>
                <p className="text-xs text-text-tertiary">{tx.timestamp}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <span
                className={`text-sm font-mono font-medium ${
                  tx.amount.startsWith("+")
                    ? "text-profit"
                    : tx.amount.startsWith("-")
                    ? "text-loss"
                    : "text-text-secondary"
                }`}
              >
                {tx.amount}
              </span>
              <ChainTxLink txHash={tx.txHash} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

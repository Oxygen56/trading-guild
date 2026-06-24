"use client";

import { Copy, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ChainTxLinkProps {
  txHash: string;
  explorerUrl?: string;
}

export function ChainTxLink({ txHash, explorerUrl }: ChainTxLinkProps) {
  const [copied, setCopied] = useState(false);

  const shortHash = txHash.length > 12 ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}` : txHash;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-mono text-text-secondary">
      <span>Tx:</span>
      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1 text-agent-execution hover:text-text-primary transition-colors"
        title="Click to copy full hash"
      >
        <span>{shortHash}</span>
        {copied ? (
          <span className="text-xs text-accent">Copied!</span>
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
      {explorerUrl && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-tertiary hover:text-accent transition-colors"
          aria-label="View on block explorer"
        >
          <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </span>
  );
}

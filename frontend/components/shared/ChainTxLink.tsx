"use client";

import { ExternalLink, Copy, Check } from "lucide-react";
import { useState } from "react";

interface ChainTxLinkProps {
  txHash: string;
  className?: string;
}

export default function ChainTxLink({ txHash, className = "" }: ChainTxLinkProps) {
  const [copied, setCopied] = useState(false);

  const shortHash =
    txHash.length > 12
      ? `${txHash.slice(0, 6)}...${txHash.slice(-4)}`
      : txHash;

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const explorerUrl = `https://testnet.cspr.live/deploy/${txHash}`;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono text-sm text-text-secondary ${className}`}
    >
      <span>Tx: {shortHash}</span>
      <button
        onClick={handleCopy}
        className="text-text-tertiary hover:text-text-primary transition-colors duration-fast"
        title="Copy full address"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-profit" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
      <a
        href={explorerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-text-tertiary hover:text-accent transition-colors duration-fast"
        title="View on Casper Explorer"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </span>
  );
}

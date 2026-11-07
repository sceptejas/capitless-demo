"use client";
import { useState } from "react";

interface Props { value: string; className?: string; }

export default function CopyButton({ value, className = "" }: Props) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy to clipboard"}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono transition-colors
        ${copied ? "text-ok" : "text-muted-2 hover:text-[var(--text)]"} ${className}`}
      style={{ background: "var(--glass)", border: "1px solid var(--border)" }}
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="5" y="1" width="10" height="12" rx="2" stroke="currentColor"/>
          <path d="M3 4H2a1 1 0 00-1 1v10a1 1 0 001 1h9a1 1 0 001-1v-1" stroke="currentColor"/>
        </svg>
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

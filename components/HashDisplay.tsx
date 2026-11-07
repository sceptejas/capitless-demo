import CopyButton from "./CopyButton";
import { config } from "@/lib/config";

interface Props {
  hash: string;
  kind?: "tx" | "address";
  showCopy?: boolean;
  className?: string;
}

function shorten(h: string) {
  if (!h || h.length < 12) return h;
  return `${h.slice(0, 6)}…${h.slice(-4)}`;
}

export default function HashDisplay({ hash, kind = "tx", showCopy = true, className = "" }: Props) {
  const isPlaceholder = hash.includes("PLACEHOLDER");
  const url = kind === "tx"
    ? `${config.explorerBaseUrl}/tx/${hash}`
    : `${config.explorerBaseUrl}/address/${hash}`;

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-xs ${className}`}>
      {isPlaceholder ? (
        <span className="text-warn" title={hash}>—</span>
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          title={hash}
          className="text-accent hover:underline"
        >
          {shorten(hash)}
        </a>
      )}
      {showCopy && !isPlaceholder && <CopyButton value={hash} />}
    </span>
  );
}

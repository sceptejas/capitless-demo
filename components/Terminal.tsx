"use client";
import { useEffect, useRef, useState } from "react";
import GlassPanel from "./GlassPanel";

export interface TerminalLine {
  kind: "info" | "ok" | "warn" | "error";
  label: string;
  text: string;
}

interface Props {
  lines: TerminalLine[];
  running: boolean;
  onDone?: () => void;
}

const kindColor: Record<string, string> = {
  ok:    "var(--ok)",
  warn:  "var(--warn)",
  error: "var(--danger)",
  info:  "var(--muted-2)",
};

export default function Terminal({ lines, running, onDone }: Props) {
  const [shown, setShown] = useState<TerminalLine[]>([]);
  const [idx, setIdx]     = useState(0);
  const [skipped, setSkipped] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset when lines change
  useEffect(() => {
    setShown([]);
    setIdx(0);
    setSkipped(false);
  }, [lines]);

  useEffect(() => {
    if (!running) return;
    if (idx >= lines.length) { onDone?.(); return; }
    const delay = 120 + Math.random() * 100;
    intervalRef.current = setTimeout(() => {
      setShown(prev => [...prev, lines[idx]]);
      setIdx(i => i + 1);
    }, delay);
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
  }, [running, idx, lines, onDone]);

  const skip = () => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setShown(lines);
    setIdx(lines.length);
    setSkipped(true);
    onDone?.();
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [shown]);

  const isDone = idx >= lines.length;

  return (
    <GlassPanel className="flex flex-col overflow-hidden" style={{ minHeight: 340 }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)]">
        <span className="w-3 h-3 rounded-full" style={{ background: "var(--danger)" }} aria-hidden="true" />
        <span className="w-3 h-3 rounded-full" style={{ background: "var(--warn)" }} aria-hidden="true" />
        <span className="w-3 h-3 rounded-full" style={{ background: "var(--ok)" }} aria-hidden="true" />
        <span className="ml-3 font-mono text-xs text-muted-2">capitless / rfq-executor</span>
        {running && !isDone && (
          <button
            onClick={skip}
            className="ml-auto text-xs text-muted-2 hover:text-[var(--text)] px-2 py-0.5 rounded"
            style={{ border: "1px solid var(--border)" }}
          >
            Skip
          </button>
        )}
      </div>

      {/* Log area */}
      <div
        className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed"
        style={{ minHeight: 280, maxHeight: 380 }}
        aria-live="polite"
        aria-label="Transaction log"
      >
        {shown.length === 0 && !running && (
          <span className="text-muted-2">Press &quot;Run order&quot; to start.</span>
        )}
        {shown.map((line, i) => (
          <div key={i} className="flex gap-3 mb-1">
            <span className="w-14 shrink-0 font-semibold" style={{ color: kindColor[line.kind] }}>
              {line.label}
            </span>
            <span style={{ color: line.kind === "error" ? "var(--danger)" : "var(--text)" }}>
              {line.text}
            </span>
          </div>
        ))}
        {running && !isDone && !skipped && (
          <span className="inline-block w-2 h-4 ml-1" style={{ background: "var(--accent)", animation: "blink 1s step-end infinite" }} aria-hidden="true" />
        )}
        <div ref={bottomRef} />
      </div>

      <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>
    </GlassPanel>
  );
}

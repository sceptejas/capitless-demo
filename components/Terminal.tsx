"use client";
import { useEffect, useRef, useState } from "react";

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
  ok:    "#22C55E",
  warn:  "#F59E0B",
  error: "#EF4444",
  info:  "#999999",
};

export default function Terminal({ lines, running, onDone }: Props) {
  const [shown, setShown]     = useState<TerminalLine[]>([]);
  const [idx, setIdx]         = useState(0);
  const [skipped, setSkipped] = useState(false);
  const bottomRef             = useRef<HTMLDivElement>(null);
  const intervalRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setShown([]); setIdx(0); setSkipped(false); }, [lines]);

  useEffect(() => {
    if (!running) return;
    if (idx >= lines.length) { onDone?.(); return; }
    const delay = 140 + Math.random() * 80;
    intervalRef.current = setTimeout(() => {
      setShown(prev => [...prev, lines[idx]]);
      setIdx(i => i + 1);
    }, delay);
    return () => { if (intervalRef.current) clearTimeout(intervalRef.current); };
  }, [running, idx, lines, onDone]);

  const skip = () => {
    if (intervalRef.current) clearTimeout(intervalRef.current);
    setShown(lines); setIdx(lines.length); setSkipped(true); onDone?.();
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [shown]);

  const isDone = idx >= lines.length;

  return (
    <div style={{ background: "#080808", borderBottom: "1px solid #222", minHeight: 320, display: "flex", flexDirection: "column" }}>
      {/* Title bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderBottom: "1px solid #1A1A1A", background: "#111" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#333" }} />
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#777", marginLeft: 8, letterSpacing: "0.05em" }}>
          capitless / rfq-executor
        </span>
        {running && !isDone && (
          <button onClick={skip} style={{ marginLeft: "auto", fontFamily: "'Courier New', monospace", fontSize: 10, color: "#777", background: "none", border: "1px solid #333", padding: "2px 8px", cursor: "pointer", letterSpacing: "0.1em" }}>
            SKIP
          </button>
        )}
      </div>

      {/* Log */}
      <div
        style={{ flex: 1, padding: "16px", overflowY: "auto", minHeight: 260, maxHeight: 400, fontFamily: "'Courier New', monospace", fontSize: 12, lineHeight: 1.8 }}
        aria-live="polite"
        aria-label="Transaction log"
      >
        {shown.length === 0 && !running && (
          <span style={{ color: "#555" }}>$ press &quot;RUN ORDER&quot; to start_</span>
        )}
        {shown.map((line, i) => (
          <div key={i} style={{ display: "flex", gap: 16, marginBottom: 2 }}>
            <span style={{ width: 56, flexShrink: 0, color: kindColor[line.kind], fontWeight: 700, letterSpacing: "0.05em" }}>
              {line.label}
            </span>
            <span style={{ color: line.kind === "error" ? "#EF4444" : line.kind === "ok" ? "#F5F5F5" : "#888" }}>
              {line.text}
            </span>
          </div>
        ))}
        {running && !isDone && !skipped && (
          <span style={{ display: "inline-block", width: 8, height: 14, background: "#F5F5F5", animation: "blink 1s step-end infinite" }} aria-hidden="true" />
        )}
        <div ref={bottomRef} />
      </div>
      <style>{`@keyframes blink { 0%,100%{opacity:1}50%{opacity:0} }`}</style>
    </div>
  );
}

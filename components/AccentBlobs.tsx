"use client";
export default function AccentBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
      <div style={{
        position: "absolute", top: "-10%", left: "15%",
        width: 600, height: 600,
        background: "var(--blob-1)",
        borderRadius: "50%",
        filter: "blur(120px)",
      }} />
      <div style={{
        position: "absolute", top: "40%", right: "-5%",
        width: 500, height: 500,
        background: "var(--blob-2)",
        borderRadius: "50%",
        filter: "blur(100px)",
      }} />
      <div style={{
        position: "absolute", bottom: "5%", left: "5%",
        width: 400, height: 400,
        background: "var(--blob-3)",
        borderRadius: "50%",
        filter: "blur(90px)",
      }} />
    </div>
  );
}

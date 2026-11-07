"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { config } from "@/lib/config";

const links = [
  { href: "/",             label: "Demo" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/deployments",  label: "Deployments" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header style={{ position: "sticky", top: 0, zIndex: 50, width: "100%", display: "flex", justifyContent: "center", padding: "16px 24px", background: "transparent", pointerEvents: "none" }}>
      <nav
        aria-label="Main navigation"
        style={{
          pointerEvents: "all",
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "6px 8px",
          background: "#0F0F0F",
          border: "1px solid #FFFFFF",
          borderRadius: 999,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Wordmark */}
        <Link href="/" style={{
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 12,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          padding: "6px 16px",
          borderRight: "1px solid #333",
          marginRight: 4,
          textDecoration: "none",
          whiteSpace: "nowrap",
        }}>
          CAPITLESS
        </Link>

        {/* Links */}
        {links.map(l => (
          <Link key={l.href} href={l.href} style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: pathname === l.href ? "#000000" : "#FFFFFF",
            background: pathname === l.href ? "#FFFFFF" : "transparent",
            padding: "7px 16px",
            borderRadius: 999,
            textDecoration: "none",
            transition: "all 0.15s",
            whiteSpace: "nowrap",
          }}>
            {l.label}
          </Link>
        ))}

        {/* GitHub */}
        <a href={config.links.github} target="_blank" rel="noopener noreferrer" style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#FFFFFF",
          padding: "7px 16px",
          borderLeft: "1px solid #333",
          marginLeft: 4,
          textDecoration: "none",
          whiteSpace: "nowrap",
          opacity: 0.6,
          transition: "opacity 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
        >
          GitHub ↗
        </a>
      </nav>
    </header>
  );
}

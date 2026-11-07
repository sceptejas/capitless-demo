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
    <header
      className="sticky top-0 z-40 w-full"
      style={{ background: "#080808", borderBottom: "1px solid #222" }}
    >
      <nav
        className="mx-auto flex items-center justify-between px-6 h-14"
        style={{ maxWidth: 1100 }}
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontWeight: 900,
            fontSize: 15,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#F5F5F5",
          }}
        >
          CAPITLESS
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-0" role="list">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{
                  display: "block",
                  padding: "0 16px",
                  height: 56,
                  lineHeight: "56px",
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: pathname === l.href ? "#FFFFFF" : "#888888",
                  borderBottom: pathname === l.href ? "2px solid #FFFFFF" : "2px solid transparent",
                  transition: "color 0.1s, border-color 0.1s",
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* GitHub */}
        <a
          href={config.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#999",
            border: "1px solid #333",
            padding: "6px 14px",
            transition: "all 0.1s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#FFF"; (e.currentTarget as HTMLElement).style.borderColor = "#FFF"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#555"; (e.currentTarget as HTMLElement).style.borderColor = "#333"; }}
        >
          GitHub ↗
        </a>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{ color: "#888" }}
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div style={{ background: "#080808", borderTop: "1px solid #222" }} className="md:hidden px-6 pb-4 flex flex-col gap-0">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              style={{ padding: "12px 0", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: pathname === l.href ? "#FFF" : "#555", borderBottom: "1px solid #1A1A1A" }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

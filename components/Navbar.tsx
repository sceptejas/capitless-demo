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
    <header className="sticky top-0 z-40 w-full glass border-b border-[var(--border)]" style={{ borderRadius: 0 }}>
      <nav
        className="mx-auto flex items-center justify-between px-6 h-14"
        style={{ maxWidth: "var(--max-w, 1100px)" }}
        aria-label="Main navigation"
      >
        {/* Wordmark */}
        <Link href="/" className="font-mono font-semibold tracking-widest text-sm text-[var(--text)] hover:text-accent transition-colors">
          CAPITLESS
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {links.map(l => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`px-3 py-1.5 rounded text-sm transition-colors ${
                  pathname === l.href
                    ? "text-accent bg-accent-dim"
                    : "text-muted-2 hover:text-[var(--text)]"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* GitHub button */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={config.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-sm text-muted-2 hover:text-[var(--text)] transition-colors"
            style={{ border: "1px solid var(--border)" }}
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 005.47 7.59c.4.07.55-.17.55-.38v-1.33C3.72 14.34 3.25 13 3.25 13c-.36-.92-.88-1.17-.88-1.17-.72-.49.05-.48.05-.48.8.06 1.22.82 1.22.82.71 1.21 1.87.86 2.33.66.07-.51.28-.86.5-1.06-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8 8 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded text-muted-2 hover:text-[var(--text)]"
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 3l12 12M15 3L3 15"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 4h14M2 9h14M2 14h14"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded text-sm ${
                pathname === l.href ? "text-accent bg-accent-dim" : "text-muted-2"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <a href={config.links.github} target="_blank" rel="noopener noreferrer"
            className="px-3 py-2 text-sm text-muted-2">
            GitHub ↗
          </a>
        </div>
      )}
    </header>
  );
}

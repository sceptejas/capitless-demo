import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "var(--bg)",
        surface: "var(--surface)",
        accent:  "var(--accent)",
        muted:   "var(--muted)",
        ok:      "var(--ok)",
        warn:    "var(--warn)",
        danger:  "var(--danger)",
        info:    "var(--info)",
      },
      fontFamily: {
        sans:  ["Inter", "system-ui", "sans-serif"],
        mono:  ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
        sm:      "var(--radius-sm)",
        lg:      "var(--radius-lg)",
      },
      maxWidth: {
        content: "1100px",
      },
    },
  },
  plugins: [],
};

export default config;

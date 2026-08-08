import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // ── Brand Color Tokens ──────────────────────────────────────────────
      // Use these token names everywhere. Never use raw Tailwind color classes
      // like bg-blue-600 directly — always use the brand tokens below.
      colors: {
        // Primary brand slate — nav backgrounds, headings (Industrial Slate)
        navy: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a", // primary brand nav background
          950: "#020617",
        },
        // Action blue — buttons, links, active states (Electric Blue)
        action: {
          DEFAULT: "#3b82f6", // blue-500
          hover: "#2563eb",   // blue-600
          light: "#eff6ff",   // blue-50
        },
        // Compliance status colors
        compliance: {
          active: "#10b981",   // emerald-500
          inactive: "#f43f5e", // rose-500
          pending: "#f59e0b",  // amber-500
          broker: "#f43f5e",   // same as inactive
          unknown: "#94a3b8",  // slate-400
        },
        // Semantic surface colors
        surface: {
          base: "#fafafa",    // ultra-light grey
          muted: "#f4f4f5",   // zinc-100
          card: "#ffffff",
          border: "#e4e4e7",  // zinc-200
        },
        // Text tokens
        content: {
          primary: "#1e293b",   // slate-800
          secondary: "#475569", // slate-600
          muted: "#94a3b8",    // slate-400
          inverted: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-outfit)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tighter: "-0.03em",
        tight: "-0.015em",
      },
      lineHeight: {
        body: "1.65",
      },
      borderRadius: {
        card: "12px",
        badge: "6px",
      },
      boxShadow: {
        card: "0 8px 32px -4px rgba(0, 0, 0, 0.04), 0 4px 16px -4px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 12px 48px -4px rgba(0, 0, 0, 0.08), 0 8px 24px -4px rgba(0, 0, 0, 0.06)",
        focus: "0 0 0 3px rgba(59, 130, 246, 0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.2s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

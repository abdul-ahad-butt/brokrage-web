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
        // Primary brand navy — nav backgrounds, headings
        navy: {
          50: "#f0f4ff",
          100: "#e0e9ff",
          200: "#c0d3ff",
          300: "#93b3ff",
          400: "#6090ff",
          500: "#3d6fef",
          600: "#2b53d4",
          700: "#2240aa",
          800: "#1a3080",
          900: "#0f1d52", // primary brand nav background
          950: "#080e2e",
        },
        // Action blue — buttons, links, active states
        action: {
          DEFAULT: "#2563eb", // blue-600 equivalent
          hover: "#1d4ed8",
          light: "#dbeafe",
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
          base: "#f8fafc",    // slate-50
          muted: "#f1f5f9",   // slate-100
          card: "#ffffff",
          border: "#e2e8f0",  // slate-200
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
        card: "0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)",
        "card-hover": "0 4px 16px 0 rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.06)",
        focus: "0 0 0 3px rgba(37, 99, 235, 0.15)",
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

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#020408",
        abyss: "#070d14",
        surface: "#0d1520",
        panel: "#111c2a",
        border: "#1a2d42",
        muted: "#2a4060",
        signal: "#00c8f0",
        "signal-dim": "#0088aa",
        verdict: {
          low: "#22c55e",
          medium: "#f59e0b",
          high: "#f97316",
          critical: "#ef4444",
        },
        text: {
          primary: "#e8f4ff",
          secondary: "#7aa8cc",
          muted: "#4a6f8a",
        },
      },
    },
  },
  plugins: [],
};

export default config;
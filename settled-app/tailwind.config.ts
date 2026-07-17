import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        foreground: "#FAFAFA",
        muted: "#A1A1A1",
        subtle: "#666666",
        border: "rgba(255,255,255,0.1)",
        surface: "#0A0A0A",
        accent: "#10B981",
        "accent-hover": "#34D399",
        "accent-muted": "rgba(16, 185, 129, 0.12)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        card: "0.5rem",
        btn: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;

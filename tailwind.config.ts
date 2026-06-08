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
        canvas: "var(--color-canvas)",
        mist: "var(--color-mist)",
        ink: "var(--color-ink)",
        graphite: "var(--color-graphite)",
        stone: "var(--color-stone)",
        whisper: "var(--color-whisper)",
        violet: "var(--color-violet)",
        glow: "var(--color-glow)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      fontSize: {
        hero: ["clamp(44px, 6vw, 72px)", { fontWeight: "500", letterSpacing: "-0.02em" }],
        h1: ["48px", { fontWeight: "500", letterSpacing: "-0.01em" }],
        body: ["17px", { lineHeight: "1.6" }],
        label: ["13px", { letterSpacing: "0.1em" }],
      },
      borderColor: {
        DEFAULT: "var(--color-whisper)",
      },
    },
  },
  plugins: [],
};
export default config;

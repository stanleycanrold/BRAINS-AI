import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // nexa-brains design tokens
        bg: {
          base: "#0A0A0F",
          surface: "#12121A",
          elevated: "#1A1A26",
          border: "#232333",
        },
        cyan: {
          DEFAULT: "#00E5FF",
          hover: "#33EAFF",
          muted: "#0099B3",
        },
        pink: {
          DEFAULT: "#FF2E88",
          hover: "#FF5CA0",
          muted: "#B32063",
        },
        text: {
          primary: "#F5F5F7",
          secondary: "#A0A0B8",
          muted: "#6B6B85",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

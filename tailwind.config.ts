import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#F7F8FA",
          surface: "#FFFFFF",
          elevated: "#EEF0F2",
          border: "#DEE1E5",
        },
        primary: {
          DEFAULT: "#14267A",
          hover: "#0F1F58",
          light: "#EEF2FF",
          dark: "#0C1754",
        },
        success: {
          DEFAULT: "#2F8F5B",
          light: "#EAF7EF",
          muted: "#7ECFA3",
        },
        warning: {
          DEFAULT: "#C67C1E",
          light: "#FCF2E7",
          muted: "#E5B475",
        },
        danger: {
          DEFAULT: "#B3433D",
          light: "#FBEDEC",
          muted: "#D18D89",
        },
        text: {
          primary: "#14181F",
          secondary: "#6B7480",
          muted: "#9AA2AB",
        },
        sidebar: {
          bg: "#F7F8FA",
          active: "#EEF2FF",
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

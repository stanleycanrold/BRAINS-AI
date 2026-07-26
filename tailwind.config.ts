import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // BRAINS AI design tokens (matching design mockups)
        bg: {
          base: "#FFFFFF",
          surface: "#FAFBFC",
          elevated: "#F5F7FA",
          border: "#E5E7EB",
        },
        primary: {
          DEFAULT: "#0052CC",
          hover: "#0042A3",
          light: "#E3F0FF",
          dark: "#003399",
        },
        success: {
          DEFAULT: "#00BFA5",
          light: "#E0F7F4",
          muted: "#4DD0C1",
        },
        warning: {
          DEFAULT: "#FF9500",
          light: "#FFF3E0",
          muted: "#FFB74D",
        },
        danger: {
          DEFAULT: "#E74C3C",
          light: "#FADBD8",
          muted: "#F5B7B1",
        },
        text: {
          primary: "#1F2937",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
        sidebar: {
          bg: "#F0F4FB",
          active: "#E3F0FF",
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

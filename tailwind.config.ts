import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F5EDD6",
        linen: "#EDE0C4",
        loam: "#8B5E3C",
        earth: "#5C3D1E",
        sage: "#6B8F5E",
        forest: "#4A6741",
        cream: "#FAF3E0",
        straw: "#C9A96E",
        ink: "#2C1F0E",
        dust: "#8A7560",
        terracotta: "#C2683A",
        sprout: "#7DB87A",
        panel: "#D4BC8A",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        sans: ["'DM Sans'", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["'DM Mono'", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;

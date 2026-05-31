import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        broker: {
          bg: "#f9fafb",
          bg2: "#ffffff",
          surface: "#ffffff",
          elevated: "#f9fafb",
          soft: "#eafbf3",
          border: "#d8d8d8",
          ink: "#111827",
          muted: "#767676",
          green: "#007a5e",
          greenDark: "#004b3a",
          greenLight: "#26a296",
          lime: "#6dc600",
          bullish: "#007a5e",
          bearish: "#d10b23",
          warning: "#FFC857",
          info: "#2878ff",
          wildcard: "#D6A84F",
          audit: "#26a296",
          merger: "#6dc600"
        }
      },
      boxShadow: {
        glow: "0 18px 42px rgba(0, 122, 94, 0.18)",
        danger: "0 18px 42px rgba(209, 11, 35, 0.16)"
      }
    }
  },
  plugins: []
} satisfies Config;

import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0f172a",
        accent: "#2563eb"
      }
    }
  },
  plugins: []
} satisfies Config;

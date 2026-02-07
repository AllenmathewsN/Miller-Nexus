import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { 
        stoneBg: "#000000", 
        ink: "#d4af37", 
        mutedInk: "#b8860b", 
        evergreen: "#d4af37",
        gold: "#d4af37",
        darkGold: "#b8860b"
      },
      borderRadius: { xl2: "1.25rem" },
      boxShadow: { soft: "0 10px 30px rgba(212,175,55,0.15)" }
    }
  },
  plugins: [],
} satisfies Config;

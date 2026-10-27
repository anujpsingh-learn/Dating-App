import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Editorial Warm Terracotta
        primary: {
          DEFAULT: "#9f3c16",
          hover: "#873212",
          foreground: "#ffffff",
          container: "#ffdbcf",
          "on-container": "#390c00",
          50: "#fff5f2",
          100: "#ffebd6",
          200: "#ffd5bd",
          300: "#ffb59c",
          400: "#e07a52",
          500: "#9f3c16",
          600: "#822801",
          700: "#691f00",
          800: "#4f1600",
          900: "#390c00",
        },
        // Deep Forest Sage / Trust & Verification
        secondary: {
          DEFAULT: "#216a4f",
          hover: "#18533d",
          foreground: "#ffffff",
          container: "#a9f2cf",
          "on-container": "#002115",
          50: "#eafaf1",
          100: "#d0f3df",
          200: "#a9f2cf",
          300: "#7de1b4",
          400: "#44c68f",
          500: "#216a4f",
          600: "#18533d",
          700: "#134230",
          800: "#0f3225",
          900: "#002115",
        },
        // Tactile Canvas Tones
        linen: {
          base: "#faf8f5",
          surface: "#ffffff",
          inset: "#f4efeb",
          border: "rgba(26, 30, 30, 0.08)",
          slate: "#181c1c",
          muted: "#57423b",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        headline: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      boxShadow: {
        editorial: "0 4px 20px -2px rgba(26, 30, 30, 0.06), 0 1px 3px rgba(26, 30, 30, 0.03)",
        "editorial-lg": "0 12px 36px -4px rgba(26, 30, 30, 0.08), 0 2px 6px rgba(26, 30, 30, 0.03)",
      },
    },
  },
  plugins: [],
};
export default config;

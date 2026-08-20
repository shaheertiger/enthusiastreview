import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          900: "#1e293b",
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            a: { textDecoration: "none", fontWeight: "600" },
            "h2, h3": { scrollMarginTop: "5rem" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;

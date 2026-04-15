import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#111827",
          700: "#374151",
          500: "#6B7280",
          100: "#F3F4F6"
        }
      }
    }
  },
  plugins: []
};

export default config;

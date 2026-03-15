import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B4FA8",
          dark: "#0F3380",
          light: "#E8F0FD",
          tint: "#DBEAFE",
        },
        accent: {
          DEFAULT: "#E07B00",
          light: "#FFF3E0",
        },
        success: {
          DEFAULT: "#138808",
          light: "#E8F5E9",
        },
        "text-primary": "#1A1A2E",
        "text-secondary": "#4A5568",
        "bg-page": "#F7F8FA",
        border: "#E2E8F0",
      },
    },
  },
  plugins: [],
};
export default config;

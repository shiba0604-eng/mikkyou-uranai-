import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 密教カラーパレット
        "mikkyou-gold": "#C9A84C",
        "mikkyou-deep": "#1a0a2e",
        "mikkyou-red": "#8B0000",
        "danger-max": "#FF0000",
        "danger-high": "#DC2626",
        "danger-mid": "#F97316",
        "safe-green": "#16A34A",
      },
      fontFamily: {
        serif: ["Noto Serif JP", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;

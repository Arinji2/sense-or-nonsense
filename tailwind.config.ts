import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      height: {
        "screen-svh": "100svh",
      },
      backgroundImage: {
        "gradient-bg": "linear-gradient(to left, #2C2828, #403A3A)",
      },
      colors: {
        custom: {
          green: "#22C55E",
          red: "#EF4444",
          blue: "#3B82F6",
        },
      },
      letterSpacing: {
        title: "20px",
        subtitle: "6px",
        text: "2px",
      },
    },
  },
  plugins: [],
};
export default config;

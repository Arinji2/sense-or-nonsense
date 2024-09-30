import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
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
          black: "#2C2828",
        },
      },
      letterSpacing: {
        title: "0.1875rem",
        number: "-0.225rem",
      },
      maxWidth: {
        "full-page": "1280px",
      },
      keyframes: {
        "bounce-right": {
          "0%": {
            transform: "translateX(-25%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateX(0%)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
          "100%": {
            transform: "translateX(-25%)",
            "animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
        },
      },
      animation: {
        "bounce-right": "bounce-right 1s infinite",
      },
    },
  },
  plugins: [],
};
export default config;

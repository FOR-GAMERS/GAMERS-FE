import type { Config } from "tailwindcss";
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "deep-black": "#0a0a0a",
        "neon-cyan": "#00f3ff",
        "neon-purple": "#b23aff",
      },
    },
  },
  plugins: [
    typography,
  ],
};
export default config;

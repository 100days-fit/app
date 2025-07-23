/** @type {import('tailwindcss').Config} */
import nativewind from "nativewind/preset";

// Neon Wellness Theme Tailwind Config
// This file extends Tailwind CSS with a custom color palette inspired by a vibrant, modern wellness aesthetic.
// Colors are available as theme colors and can be used in both web and React Native (via nativewind).
//
// Palette:
// - Primary: #00F5A0
// - Accent: #6E00FF
// - Background: #121212
// - Text: #F5F5F5
// - Highlight: #FF5E84
// - Secondary: #CFFF04

export default {
  content: ["./src/App.tsx", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [nativewind],
  theme: {
    extend: {
      colors: {
        primary: "#00F5A0",
        accent: "#6E00FF",
        background: "#121212",
        text: "#F5F5F5",
        highlight: "#FF5E84",
        secondary: "#CFFF04",
      },
    },
  },
  plugins: [],
};

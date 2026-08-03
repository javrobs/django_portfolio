import {Config} from "tailwindcss"

const hue1 = 230;
const hue2 = 30;

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: `hsl(${hue1}, 55%, 13%)`,
        primaryTransparent: `hsla(${hue1}, 45%, 10%, 0.75)`,
        secondary: `hsl(${hue2}, 90%, 45%)`,
        secondaryTransparent: `hsla(${hue2}, 96%, 56%, 20%)`,
        primaryLight: `hsl(${hue1}, 80%, 90%)`,
        primaryLightTransparent: `hsla(${hue1}, 65%, 90%, 20%)`,
      },
      fontFamily: {
        manrope: ['Manrope', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
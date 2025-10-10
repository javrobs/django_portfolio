import {Config} from "tailwindcss"

const hue1 = 90;
const hue2 = 90;

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // primary: `hsl(${hue1}, 0%, 13%)`,
        // primaryTransparent: `hsla(${hue1}, 0%, 10%, 0.4)`,
        // secondary: `hsl(${hue2}, 90%, 45%)`,
        // secondaryTransparent: `hsla(${hue2}, 96%, 56%, 20%)`,
        // primaryLight: `hsl(${hue1}, 80%, 80%)`,
        // primaryLightTransparent: `hsla(${hue1}, 65%, 80%, 20%)`,
      },
      fontFamily: {
        // manrope: ['Manrope', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        // raleway: ['Raleway', 'sans-serif'],
        // offside: ['Offside', 'sans-serif'],
        // racing: ['Racing Sans One','sans-serif']
      },
    },
  },
  plugins: [],
}
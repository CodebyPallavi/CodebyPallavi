/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E11D48', // Rose-600
          foreground: '#FFFFFF',
          hover: '#BE123C', // Rose-700
        },
        secondary: '#0F172A', // Slate-900
        dark: {
          950: '#09090B', // Zinc-950
          900: '#18181B', // Zinc-900
          800: '#27272A', // Zinc-800
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Oswald', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

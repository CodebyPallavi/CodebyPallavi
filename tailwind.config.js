/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E11D48', // Rose-600, a nice bold red/pinkish gym color, or just Red-600 #DC2626
        secondary: '#0F172A', // Slate-900
        gymRed: '#FF0000',
        gymBlack: '#111111',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

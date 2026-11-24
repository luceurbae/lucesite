/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#08090B',
        bg2: '#101114',
        surface: '#17181C',
        ink: '#F5F5F5',
        mute: '#9999A3',
        blue: '#4B83FF',
        violet: '#8455FF',
        magenta: '#E65BFF',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}

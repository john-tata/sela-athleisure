/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        gold: '#C89A5A',
        'rich-black': '#111111',
        'cool-gray': '#6B7280',
        'light-gray': '#F5F5F5',
        'border-gray': '#E5E5E5',
      },
    },
  },
  plugins: [],
}

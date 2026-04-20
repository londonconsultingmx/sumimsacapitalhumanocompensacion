/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#1E293B',
        canvas: '#F9FAFB',
        teal: {
          DEFAULT: '#00897B',
          dark: '#00695C',
          light: '#4DB6AC',
        },
        status: {
          good: '#16A34A',
          warn: '#F59E0B',
          bad: '#DC2626',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 4px 14px rgba(15,23,42,0.06)',
      },
    },
  },
  plugins: [],
}

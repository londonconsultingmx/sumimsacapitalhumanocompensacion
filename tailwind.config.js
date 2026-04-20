/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Editorial palette matched to intro design
        bg: '#ffffff',
        paper: '#FBFAF6',      // oklch(98% 0.005 80) warm paper
        ink: '#1C1B17',        // oklch(18% 0.01 80) near-black
        muted: '#6B6A62',      // oklch(45% 0.015 80)
        rule: '#E7E4DC',       // oklch(90% 0.005 80) hairline
        blue: '#274B8E',       // oklch(38% 0.08 240) corporate accent
        gold: '#B68845',       // oklch(62% 0.10 75) secondary
        // status colors for the dashboard indicator pills
        status: {
          good: '#16A34A',
          warn: '#D97706',
          bad: '#B91C1C',
        },
        // keep teal as legacy accent alias
        teal: {
          DEFAULT: '#274B8E',
          dark: '#1B355F',
          light: '#4F6FA8',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,27,23,0.04), 0 4px 14px rgba(28,27,23,0.06)',
      },
    },
  },
  plugins: [],
}

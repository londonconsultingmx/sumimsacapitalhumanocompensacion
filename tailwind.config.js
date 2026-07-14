/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Manual de identidad: Myriad Pro para textos; Arial como fallback web.
        sans: ['"Myriad Pro"', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        // Display condensed para títulos, en el espíritu de la Incised 901 Nord BT.
        display: ['Oswald', '"Arial Narrow"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Paleta oficial SUMIMSA (Manual de Identidad 2026)
        bg: '#ffffff',
        paper: '#F5F8FC',      // fondo claro azulado
        ink: '#12256F',        // Pantone 2748 C — color primario
        muted: '#55648A',      // matiz del primario para texto secundario
        rule: '#DCE4F2',       // hairline azulado
        blue: '#009BDB',       // Pantone Process Cyan — secundario
        gold: '#5CB8B2',       // Pantone 7472 C — secundario (teal)
        // status colors for the dashboard indicator pills (semáforo — no cambian)
        status: {
          good: '#16A34A',
          warn: '#D97706',
          bad: '#B91C1C',
        },
        // Acento de acción (botones, links): cyan corporativo
        teal: {
          DEFAULT: '#009BDB',
          dark: '#0077A8',
          light: '#4FC0EA',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,37,111,0.05), 0 4px 14px rgba(18,37,111,0.08)',
      },
    },
  },
  plugins: [],
}

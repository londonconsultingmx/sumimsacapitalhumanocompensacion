/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Myriad Pro"', '"Segoe UI"', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['Oswald', '"Arial Narrow"', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Paleta sobria de reporte interno; el navy corporativo queda como acento.
        bg: '#FFFFFF',
        paper: '#F6F7F9',      // fondo de página
        ink: '#212B42',        // texto principal
        muted: '#66708A',      // texto secundario
        rule: '#E4E7EC',       // hairlines
        blue: '#24437A',       // acento (derivado del navy Pantone 2748 C)
        gold: '#6E87A8',       // acento secundario (azul acero)
        // semáforo de indicadores — no cambia
        status: {
          good: '#15803D',
          warn: '#B45309',
          bad: '#B91C1C',
        },
        // acción (botones/links)
        teal: {
          DEFAULT: '#24437A',
          dark: '#1B3460',
          light: '#4A6DA8',
        },
      },
      boxShadow: {
        // Anillo hairline en lugar de sombra suave — look de tabla de reporte.
        card: '0 0 0 1px #E4E7EC',
      },
    },
  },
  plugins: [],
}

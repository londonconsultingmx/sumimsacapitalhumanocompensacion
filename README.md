# Compensación Variable — Subdirecciones SUMIMSA 2025

Dashboard ejecutivo del esquema de compensación variable para las subdirecciones de
SUMIMSA (Auditoría, Capital Humano, CDS, Finanzas, Talleres, TI). Los datos se leen de
[`public/indicadores_2025.csv`](public/indicadores_2025.csv).

## Lógica

- Tope EBITDA corporativo: **96 %** → `calificación_final = calificación_bruta × 0.96`.
- Pesos por eje: Objetivos 40 %, Indicadores de Negocio 40 %, 360° 20 %.
- Score por eje = Σ(Cumple × Importancia) / Σ(Importancia).
- Valores anómalos de `Cumple #` (3, 5) se tratan como 1.

## Vistas

1. **Resultado grupal** — gauges y resumen de cumplimiento.
2. **Desglose por eje** — comparativo por área dentro de cada eje.
3. **Detalle por subdirector** — todos los indicadores con meta, real, importancia y status.
4. **¿Y sin el tope?** — calificación bruta vs final y el gap por el EBITDA al 96 %.

## Scripts

```bash
npm install
npm run dev       # desarrollo local
npm run build     # bundle de producción en ./dist
npm run preview   # sirve ./dist
```

## Deploy

Push a `main` dispara el workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
que construye el sitio y lo publica con GitHub Pages.

URL: https://londonconsultingmx.github.io/sumimsacapitalhumanocompensacion/

## Stack

React 18 + Vite · Tailwind CSS · Recharts · PapaParse.

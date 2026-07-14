import { useEffect, useState } from 'react'
import Papa from 'papaparse'

// Catálogo 2026: la misma batería benchmark del esquema simplificado 2025,
// aplicada al ejercicio 2026 (fórmula, meta y frecuencia; sin reales aún).
export function useCatalog2026() {
  const [state, setState] = useState({ loading: true, rows: null, error: null })

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}catalogo_2026.csv`
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map((r) => ({
            area: (r['Area'] ?? '').trim(),
            eje: (r['Eje'] ?? '').trim(),
            indicador: (r['Indicador'] ?? '').trim(),
            racional: (r['Racional'] ?? '').trim(),
            um: (r['UM'] ?? '').trim(),
            objetivo: (r['Objetivo'] ?? '').trim(),
            frecuencia: (r['Frecuencia'] ?? '').trim(),
          }))
          .filter((r) => r.area && r.indicador)
        setState({ loading: false, rows, error: null })
      },
      error: (err) => setState({ loading: false, rows: null, error: err }),
    })
  }, [])

  return state
}

import { useEffect, useState } from 'react'
import Papa from 'papaparse'

// Catálogo de referencia 2026: todas las subdirecciones, todos los indicadores.
// A diferencia del esquema 2025, este CSV sí trae un header limpio.
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
            real2026: (r['Real2026'] ?? '').trim(),
            real2025: (r['Real2025'] ?? '').trim(),
            fuente: (r['Fuente'] ?? '').trim(),
            compartido: (r['Compartido'] ?? '').trim(),
          }))
          .filter((r) => r.area && r.indicador)
        setState({ loading: false, rows, error: null })
      },
      error: (err) => setState({ loading: false, rows: null, error: err }),
    })
  }, [])

  return state
}

import { useEffect, useState } from 'react'
import Papa from 'papaparse'

// Propuesta 2026 leída por etapa del proceso (mapa Géminis 01: demanda a
// cierre financiero). Archivo aparte para no tocar la propuesta vigente.
export function usePropuestaEtapas() {
  const [state, setState] = useState({ loading: true, rows: null, error: null })

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}propuesta_2026_etapas.csv`
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map((r) => ({
            clave: (r['Clave'] ?? '').trim(),
            subdireccion: (r['Subdireccion'] ?? '').trim(),
            etapa: (r['Etapa'] ?? '').trim(),
            eje: (r['Eje'] ?? '').trim(),
            indicador: (r['Indicador'] ?? '').trim(),
            formula: (r['Formula'] ?? '').trim(),
            meta: (r['Meta2026'] ?? '').trim(),
            base: (r['Base2025'] ?? '').trim(),
            fuente: (r['Fuente'] ?? '').trim(),
            frecuencia: (r['Frecuencia'] ?? '').trim(),
            origen: (r['Origen'] ?? '').trim(),
            nota: (r['Nota'] ?? '').trim(),
            ejemplo: (r['Ejemplo'] ?? '').trim(),
          }))
          .filter((r) => r.subdireccion && r.indicador)
        setState({ loading: false, rows, error: null })
      },
      error: (err) => setState({ loading: false, rows: null, error: err }),
    })
  }, [])

  return state
}

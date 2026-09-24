import { useEffect, useState } from 'react'
import Papa from 'papaparse'

// Propuesta de indicadores de subdirectores 2026, organizada en los cinco ejes
// de Dirección: vender más, entregar mejor, resultados financieros, data
// correcta y actualizada, control interno y procesos. No sustituye la batería
// 2025 vigente; es la propuesta a discutir.
export function usePropuesta2026() {
  const [state, setState] = useState({ loading: true, rows: null, error: null })

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}propuesta_2026.csv`
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map((r) => ({
            clave: (r['Clave'] ?? '').trim(),
            subdireccion: (r['Subdireccion'] ?? '').trim(),
            eje: (r['Eje'] ?? '').trim(),
            indicador: (r['Indicador'] ?? '').trim(),
            formula: (r['Formula'] ?? '').trim(),
            meta: (r['Meta2026'] ?? '').trim(),
            buenoSi: (r['BuenoSi'] ?? '').trim(),
            figura: (r['Figura'] ?? '').trim(),
            director: (r['Director'] ?? '').trim().toUpperCase() === 'X',
            base: (r['Base2025'] ?? '').trim(),
            fuente: (r['Fuente'] ?? '').trim(),
            frecuencia: (r['Frecuencia'] ?? '').trim(),
            estadoDato: (r['EstadoDato'] ?? '').trim(),
            vs2025: (r['Vs2025'] ?? '').trim(),
            compartido: (r['Compartido'] ?? '').trim() === 'X',
            origen: (r['Origen'] ?? '').trim(),
            ejemplo: (r['Ejemplo'] ?? '').trim(),
            nota: (r['Nota'] ?? '').trim(),
          }))
          .filter((r) => r.subdireccion && r.indicador)
        setState({ loading: false, rows, error: null })
      },
      error: (err) => setState({ loading: false, rows: null, error: err }),
    })
  }, [])

  return state
}

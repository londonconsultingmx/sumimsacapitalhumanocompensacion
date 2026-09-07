import { useEffect, useState } from 'react'
import Papa from 'papaparse'

// Batería de 3–4 indicadores por gerencia, derivada de la estructura vigente
// (export de nómina) y contrastada contra referencias de industria para
// servicios petroleros en México.
export function useGerencias() {
  const [state, setState] = useState({ loading: true, rows: null, error: null })

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}gerencias_2026.csv`
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data
          .map((r) => ({
            subdireccion: (r['Subdireccion'] ?? '').trim(),
            departamento: (r['Departamento'] ?? '').trim(),
            puesto: (r['Puesto'] ?? '').trim(),
            titular: (r['Titular'] ?? '').trim(),
            ubicacion: (r['Ubicacion'] ?? '').trim(),
            indicador: (r['Indicador'] ?? '').trim(),
            formula: (r['Formula'] ?? '').trim(),
            meta: (r['Meta'] ?? '').trim(),
            benchmark: (r['Benchmark'] ?? '').trim(),
            frecuencia: (r['Frecuencia'] ?? '').trim(),
          }))
          .filter((r) => r.subdireccion && r.indicador)
        setState({ loading: false, rows, error: null })
      },
      error: (err) => setState({ loading: false, rows: null, error: err }),
    })
  }, [])

  return state
}

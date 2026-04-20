import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { normalizeRow } from '../utils/compensation.js'

// The CSV's declared header row is malformed: it is missing the "Indicador"
// column and has an extraneous "Pilar ASG" at the end, shifting every data
// column by one. We read without headers and map positionally instead.
const FIELDS = [
  'Eje',
  'Metrica',
  'Indicador',
  'Comunes',
  'UM',
  'Dirección',
  'Meta (#)',
  'Real',
  'Importancia',
  'Cumple #',
  'Cumple?',
  'Corte',
  'Año Esquema',
]

export function useData() {
  const [state, setState] = useState({ loading: true, rows: null, error: null })

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}indicadores_2025.csv`
    Papa.parse(url, {
      download: true,
      header: false,
      skipEmptyLines: true,
      complete: (results) => {
        const dataRows = results.data.slice(1) // drop declared (bad) header
        const rows = dataRows
          .map((arr) => {
            const obj = {}
            FIELDS.forEach((k, i) => { obj[k] = arr[i] })
            return normalizeRow(obj)
          })
          .filter((r) => r.eje && r.metrica)
        setState({ loading: false, rows, error: null })
      },
      error: (err) => setState({ loading: false, rows: null, error: err }),
    })
  }, [])

  return state
}

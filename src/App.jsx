import React, { useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import ResultadoGrupal from './components/ResultadoGrupal.jsx'
import DesgloseEjes from './components/DesgloseEjes.jsx'
import DetallePorArea from './components/DetallePorArea.jsx'
import SinTope from './components/SinTope.jsx'
import { useData } from './data/useData.js'
import { computeAllAreas, computeGrupal } from './utils/compensation.js'

export default function App() {
  const { loading, rows, error } = useData()
  const [tab, setTab] = useState('grupal')

  const { breakdowns, grupal } = useMemo(() => {
    if (!rows) return { breakdowns: [], grupal: { bruta: 0, final: 0 } }
    const bds = computeAllAreas(rows)
    return { breakdowns: bds, grupal: computeGrupal(bds) }
  }, [rows])

  return (
    <div className="min-h-full flex flex-col">
      <Header active={tab} onChange={setTab} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        {loading && <Loading />}
        {error && <ErrorBox error={error} />}
        {!loading && !error && rows && (
          <>
            {tab === 'grupal' && <ResultadoGrupal breakdowns={breakdowns} grupal={grupal} />}
            {tab === 'ejes' && <DesgloseEjes breakdowns={breakdowns} />}
            {tab === 'detalle' && <DetallePorArea breakdowns={breakdowns} />}
            {tab === 'sintope' && <SinTope breakdowns={breakdowns} grupal={grupal} />}
          </>
        )}
      </main>
      <footer className="max-w-7xl w-full mx-auto px-6 py-6 text-xs text-slate-500">
        Esquema 2025 · datos al corte 2025-12-31 · Tope EBITDA 96% aplicado a la calificación final.
      </footer>
    </div>
  )
}

function Loading() {
  return (
    <div className="flex items-center justify-center py-20 text-slate-500">
      Cargando indicadores…
    </div>
  )
}

function ErrorBox({ error }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
      <div className="font-semibold mb-1">No se pudo cargar el CSV</div>
      <div className="text-sm">{String(error?.message ?? error)}</div>
    </div>
  )
}

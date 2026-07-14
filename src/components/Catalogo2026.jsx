import React, { useMemo, useState } from 'react'
import { AREA_COLORS } from '../utils/compensation.js'
import { useCatalog2026 } from '../data/useCatalog2026.js'

// Bloques del esquema simplificado. Talleres y TBX dividen sus indicadores en
// Financieros / Operativos; las demás áreas usan un solo bloque de indicadores.
const EJE_ORDER = ['Indicadores de Negocio', 'Financieros', 'Operativos', '360']
const EJE_LABEL = {
  'Indicadores de Negocio': 'Indicadores de Negocio · peso 70%',
  Financieros: 'Indicadores de Negocio · Financieros (peso 70% junto con Operativos)',
  Operativos: 'Indicadores de Negocio · Operativos',
  360: 'Evaluación 360° · peso 30%',
}

export default function Catalogo2026() {
  const { loading, rows, error } = useCatalog2026()
  const areas = useMemo(() => {
    if (!rows) return []
    return Array.from(new Set(rows.map((r) => r.area))).sort((a, b) => a.localeCompare(b, 'es'))
  }, [rows])
  const [area, setArea] = useState('')
  const selected = area || areas[0] || ''

  if (loading) return <div className="py-20 text-center text-muted">Cargando catálogo 2026…</div>
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-5">
        No se pudo cargar el catálogo 2026: {String(error?.message ?? error)}
      </div>
    )
  }

  const areaRows = rows.filter((r) => r.area === selected)
  const color = AREA_COLORS[selected] ?? '#24437A'

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-md shadow-card p-6">
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted mb-1">
          Catálogo de indicadores · Esquema 2026
        </div>
        <h2 className="text-lg font-semibold text-ink">Batería benchmark 2026</h2>
        <p className="text-sm text-muted mt-1 max-w-3xl">
          Mismo esquema simplificado del cierre 2025 aplicado al ejercicio 2026: Indicadores de
          Negocio 70% y Evaluación 360° 30% (Talleres y TBX sin 360°, solo indicadores). Cada
          indicador declara su fórmula, su meta/benchmark y su frecuencia de medición; los
          reales se capturan durante 2026.
        </p>
      </div>

      <div className="bg-white rounded-md shadow-card p-5 flex flex-wrap items-center gap-3">
        <label htmlFor="cat-area" className="text-sm font-semibold text-slate-600">
          Subdirección:
        </label>
        <select
          id="cat-area"
          value={selected}
          onChange={(e) => setArea(e.target.value)}
          className="border border-slate-300 rounded-sm px-3 py-2 text-sm font-medium focus:border-teal focus:outline-none"
        >
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <span className="text-xs text-slate-500">{areaRows.length} indicadores</span>
      </div>

      {EJE_ORDER.map((eje) => {
        const ejeRows = areaRows.filter((r) => r.eje === eje)
        if (!ejeRows.length) return null
        return (
          <div key={eje} className="bg-white rounded-md shadow-card overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                {EJE_LABEL[eje] ?? eje}
              </h3>
              <span className="text-xs text-slate-500">{ejeRows.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 bg-slate-50 border-b border-slate-200">
                    <th className="py-2 px-5 font-medium">Indicador</th>
                    <th className="py-2 px-3 font-medium">Fórmula</th>
                    <th className="py-2 px-3 font-medium whitespace-nowrap">Meta / Benchmark</th>
                    <th className="py-2 px-3 font-medium">Frecuencia</th>
                  </tr>
                </thead>
                <tbody>
                  {ejeRows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 align-top">
                      <td className="py-2.5 px-5 text-ink font-medium max-w-xs">{r.indicador}</td>
                      <td className="py-2.5 px-3 text-slate-600 text-xs max-w-md">{r.racional || '—'}</td>
                      <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap font-medium">
                        {r.objetivo || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap text-xs uppercase tracking-wide">
                        {r.frecuencia || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </section>
  )
}

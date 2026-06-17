import React, { useMemo, useState } from 'react'
import { AREA_COLORS, fmtMetaReal } from '../utils/compensation.js'
import { useCatalog2026 } from '../data/useCatalog2026.js'

// Orden de ejes del catálogo (coincide con los prefijos del CSV).
const EJE_ORDER = [
  '01. Objetivos',
  '02. Indicadores Negocio',
  '03. Indicadores Operativos',
  '04. Resultados 360',
]
const EJE_LABEL = {
  '01. Objetivos': 'Objetivos',
  '02. Indicadores Negocio': 'Indicadores Negocio',
  '03. Indicadores Operativos': 'Indicadores Operativos',
  '04. Resultados 360': 'Resultados 360',
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
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
        No se pudo cargar el catálogo 2026: {String(error?.message ?? error)}
      </div>
    )
  }

  const areaRows = rows.filter((r) => r.area === selected)
  const color = AREA_COLORS[selected] ?? '#00897B'

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-1">
          Catálogo de indicadores · Esquema 2026
        </div>
        <h2 className="text-lg font-semibold text-ink">Listado de referencia (sin calificación)</h2>
        <p className="text-sm text-muted mt-1 max-w-3xl">
          Inventario de los indicadores planeados para 2026 de todas las subdirecciones
          (incluye Servicios/TBX). Muestra meta 2026, avance, real 2025 de referencia y la
          fuente. No calcula calificación ni tope EBITDA.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-5 flex flex-wrap items-center gap-3">
        <label htmlFor="cat-area" className="text-sm font-semibold text-slate-600">
          Subdirección:
        </label>
        <select
          id="cat-area"
          value={selected}
          onChange={(e) => setArea(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-teal focus:outline-none"
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
          <div key={eje} className="bg-white rounded-2xl shadow-card overflow-hidden">
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
                    <th className="py-2 px-4">Indicador</th>
                    <th className="py-2 px-3">UM</th>
                    <th className="py-2 px-3">Meta 2026</th>
                    <th className="py-2 px-3">Avance 2026</th>
                    <th className="py-2 px-3">Real 2025</th>
                    <th className="py-2 px-3">Fuente</th>
                  </tr>
                </thead>
                <tbody>
                  {ejeRows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 align-top">
                      <td className="py-2 px-4 text-slate-800 max-w-md">
                        {r.indicador}
                        {r.compartido && (
                          <span className="ml-2 text-[9px] font-semibold uppercase bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">
                            Compartido
                          </span>
                        )}
                        {r.racional && (
                          <div className="text-xs text-slate-400 mt-0.5">{r.racional}</div>
                        )}
                      </td>
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{r.um || '—'}</td>
                      <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                        {r.objetivo ? fmtMetaReal(r.objetivo, r.um) : '—'}
                      </td>
                      <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                        {r.real2026 ? fmtMetaReal(r.real2026, r.um) : '—'}
                      </td>
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">
                        {r.real2025 ? fmtMetaReal(r.real2025, r.um) : '—'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap">
                        {r.fuente ? (
                          <a
                            href={r.fuente}
                            target="_blank"
                            rel="noreferrer"
                            className="text-teal hover:text-teal-dark font-medium underline decoration-dotted underline-offset-2"
                          >
                            Power BI ↗
                          </a>
                        ) : (
                          '—'
                        )}
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

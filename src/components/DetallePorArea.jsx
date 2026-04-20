import React, { useState } from 'react'
import { StatusPill } from './StatusPill.jsx'
import {
  AREA_COLORS,
  EJE_LABELS,
  EJE_ORDER,
  EJE_WEIGHTS,
  EVIDENCIAS_URL,
  fmtMetaReal,
  fmtPct,
} from '../utils/compensation.js'

export default function DetallePorArea({ breakdowns }) {
  const [selected, setSelected] = useState(breakdowns[0]?.area ?? '')
  const b = breakdowns.find((x) => x.area === selected) ?? breakdowns[0]
  if (!b) return null

  const color = AREA_COLORS[b.area] ?? '#00897B'

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl shadow-card p-5 flex flex-wrap items-center gap-3">
        <label htmlFor="area-select" className="text-sm font-semibold text-slate-600">
          Subdirector / Área:
        </label>
        <select
          id="area-select"
          value={b.area}
          onChange={(e) => setSelected(e.target.value)}
          className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:border-teal focus:outline-none"
        >
          {breakdowns.map((x) => (
            <option key={x.area} value={x.area}>{x.area}</option>
          ))}
        </select>
        <a
          href={EVIDENCIAS_URL}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-2 bg-teal hover:bg-teal-dark transition text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Ver evidencias de {b.area}
          <span aria-hidden>↗</span>
        </a>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <div className="rounded-2xl p-5 text-white shadow-card" style={{ background: color }}>
          <div className="text-xs uppercase tracking-wider opacity-80">Calificación final</div>
          <div className="text-4xl font-bold mt-1">{fmtPct(b.final)}</div>
          <div className="text-xs opacity-80 mt-1">bruta {fmtPct(b.bruta)} · × 0.96 EBITDA</div>
        </div>
        {EJE_ORDER.map((k) => (
          <div key={k} className="rounded-2xl p-5 bg-white shadow-card">
            <div className="text-xs uppercase tracking-wider text-slate-500">
              {EJE_LABELS[k]}
            </div>
            <div className="text-3xl font-bold text-ink mt-1">{fmtPct(b.scores[k])}</div>
            <div className="text-xs text-slate-500 mt-1">
              peso {Math.round(EJE_WEIGHTS[k] * 100)}% · {b.rowsByEje[k].length} indicadores
            </div>
          </div>
        ))}
      </div>

      {EJE_ORDER.map((k) => {
        const rows = b.rowsByEje[k]
        if (!rows.length) return null
        return (
          <div key={k} className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-ink">{EJE_LABELS[k]}</h3>
                <p className="text-xs text-slate-500">
                  Score {fmtPct(b.scores[k])} · peso {Math.round(EJE_WEIGHTS[k] * 100)}%
                </p>
              </div>
              <div className="text-xs text-slate-500">{rows.length} indicadores</div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 bg-slate-50 border-b border-slate-200">
                    <th className="py-2 px-4">Indicador</th>
                    <th className="py-2 px-3">UM</th>
                    <th className="py-2 px-3">Dirección</th>
                    <th className="py-2 px-3">Meta</th>
                    <th className="py-2 px-3">Real</th>
                    <th className="py-2 px-3">Imp.</th>
                    <th className="py-2 px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0 align-top">
                      <td className="py-2 px-4 text-slate-800 max-w-md">{r.indicador}</td>
                      <td className="py-2 px-3 text-slate-500 whitespace-nowrap">{r.um || '—'}</td>
                      <td className="py-2 px-3 text-slate-500 text-xs">{r.direccion}</td>
                      <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                        {fmtMetaReal(r.metaRaw, r.um)}
                      </td>
                      <td className="py-2 px-3 text-slate-700 whitespace-nowrap">
                        {fmtMetaReal(r.realRaw, r.um)}
                      </td>
                      <td className="py-2 px-3">
                        <ImportanciaChip value={r.importancia} />
                      </td>
                      <td className="py-2 px-3"><StatusPill cumple={r.cumple} /></td>
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

function ImportanciaChip({ value }) {
  const styles =
    value >= 3
      ? 'bg-ink text-white'
      : value === 2
      ? 'bg-slate-300 text-slate-800'
      : 'bg-slate-100 text-slate-600'
  return (
    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${styles}`}>
      {value || '—'}
    </span>
  )
}

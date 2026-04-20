import React from 'react'
import Gauge from './Gauge.jsx'
import { CountPills } from './StatusPill.jsx'
import {
  AREA_COLORS,
  EBITDA_CAP,
  fmtPct,
} from '../utils/compensation.js'

export default function ResultadoGrupal({ breakdowns, grupal }) {
  const totals = breakdowns.reduce(
    (acc, b) => {
      acc.si += b.counts.si
      acc.parcial += b.counts.parcial
      acc.no += b.counts.no
      acc.total += b.total
      return acc
    },
    { si: 0, parcial: 0, no: 0, total: 0 }
  )

  return (
    <section className="flex flex-col gap-6">
      <div className="grid md:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col items-center">
          <div className="text-sm text-slate-500 mb-2">Calificación grupal (con tope)</div>
          <Gauge value={grupal.final} color="#00897B" sublabel="× 0.96 EBITDA" />
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col items-center">
          <div className="text-sm text-slate-500 mb-2">Calificación grupal bruta</div>
          <Gauge value={grupal.bruta} color="#1E293B" sublabel="sin tope" />
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 flex flex-col justify-center gap-3">
          <div className="text-sm text-slate-500">Resumen de indicadores</div>
          <div className="text-4xl font-bold text-ink">{totals.total}</div>
          <div className="text-xs text-slate-500 -mt-2">Indicadores evaluados</div>
          <CountPills counts={totals} />
          <div className="text-xs text-slate-500 mt-2">
            Diferencia grupal por tope EBITDA:{' '}
            <span className="font-semibold text-ink">
              {fmtPct(grupal.bruta - grupal.final)}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink">Calificación final por área</h2>
          <div className="text-xs text-slate-500">
            Tope EBITDA aplicado: {fmtPct(EBITDA_CAP, 0)}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {breakdowns.map((b) => (
            <AreaGauge key={b.area} b={b} />
          ))}
        </div>
      </div>
    </section>
  )
}

function AreaGauge({ b }) {
  const color = AREA_COLORS[b.area] ?? '#00897B'
  return (
    <div className="border border-slate-200 rounded-xl p-5 flex flex-col items-center gap-2 bg-slate-50/60">
      <div className="text-sm font-semibold text-ink text-center">{b.area}</div>
      <Gauge value={b.final} color={color} size={140} sublabel={`bruta ${fmtPct(b.bruta)}`} />
      <div className="mt-1"><CountPills counts={b.counts} /></div>
    </div>
  )
}

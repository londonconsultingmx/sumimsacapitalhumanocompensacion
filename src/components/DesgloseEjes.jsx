import React from 'react'
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts'
import {
  AREA_COLORS,
  EJE_LABELS,
  EJE_ORDER,
  EJE_WEIGHTS,
  THRESHOLD_APROBATORIO,
  fmtPct,
} from '../utils/compensation.js'

export default function DesgloseEjes({ breakdowns }) {
  // One chart per eje, comparing all areas
  const dataByEje = EJE_ORDER.map((eje) => ({
    eje,
    label: EJE_LABELS[eje],
    weight: EJE_WEIGHTS[eje],
    data: breakdowns.map((b) => ({
      area: b.area,
      score: Number((b.scores[eje] * 100).toFixed(2)),
      color: AREA_COLORS[b.area] ?? '#00897B',
    })),
  }))

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink">Score por eje y área</h2>
        <p className="text-sm text-slate-500 mt-1">
          Promedio ponderado por Importancia dentro de cada eje. Pesos finales: Objetivos 40% ·
          Indicadores 40% · 360° 20%.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {dataByEje.map((block) => (
          <div key={block.eje} className="bg-white rounded-2xl shadow-card p-5 flex flex-col">
            <div className="flex items-baseline justify-between mb-3">
              <h3 className="font-semibold text-ink">{block.label}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-teal/10 text-teal-dark font-semibold">
                peso {Math.round(block.weight * 100)}%
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={block.data}
                  layout="vertical"
                  margin={{ left: 8, right: 24, top: 4, bottom: 4 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={11} />
                  <YAxis type="category" dataKey="area" width={110} fontSize={11} />
                  <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} cursor={{ fill: '#F1F5F9' }} />
                  <ReferenceLine
                    x={THRESHOLD_APROBATORIO * 100}
                    stroke="#1C1B17"
                    strokeDasharray="4 3"
                    strokeWidth={1.5}
                    label={{ value: '75% mínimo', position: 'insideTopRight', fill: '#1C1B17', fontSize: 10, fontFamily: 'JetBrains Mono, monospace' }}
                  />
                  <Bar dataKey="score" radius={[0, 6, 6, 0]}>
                    {block.data.map((d) => (
                      <Cell key={d.area} fill={d.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 overflow-x-auto">
        <h3 className="font-semibold text-ink mb-4">Matriz de scores (%)</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4">Área</th>
              {EJE_ORDER.map((k) => (
                <th key={k} className="py-2 px-3">{EJE_LABELS[k]}</th>
              ))}
              <th className="py-2 px-3">Bruta</th>
              <th className="py-2 px-3">Final (×0.96)</th>
            </tr>
          </thead>
          <tbody>
            {breakdowns.map((b) => (
              <tr key={b.area} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 font-semibold text-ink">
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
                    style={{ background: AREA_COLORS[b.area] ?? '#00897B' }}
                  />
                  {b.area}
                </td>
                {EJE_ORDER.map((k) => (
                  <td key={k} className="py-2 px-3 text-slate-700">{fmtPct(b.scores[k])}</td>
                ))}
                <td className="py-2 px-3 font-semibold text-slate-700">{fmtPct(b.bruta)}</td>
                <td className="py-2 px-3 font-bold text-teal-dark">{fmtPct(b.final)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

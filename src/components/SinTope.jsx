import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { AREA_COLORS, EBITDA_CAP, fmtPct } from '../utils/compensation.js'

export default function SinTope({ breakdowns, grupal }) {
  const data = breakdowns.map((b) => ({
    area: b.area,
    final: Number((b.final * 100).toFixed(2)),
    bruta: Number((b.bruta * 100).toFixed(2)),
    diff: Number(((b.bruta - b.final) * 100).toFixed(2)),
  }))

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink">¿Qué hubieran sacado al 100% del EBITDA?</h2>
        <p className="text-sm text-slate-500 mt-1">
          El EBITDA corporativo cerró en <strong>96%</strong>, por lo que toda calificación se
          multiplica por <code className="bg-slate-100 px-1 rounded">0.96</code>. La diferencia es
          el <em>gap</em> que dejaron de ganar por no llegar al 100%.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <SummaryCard
          label="Promedio grupal (con tope)"
          value={fmtPct(grupal.final)}
          accent="#00897B"
          sub={`× ${EBITDA_CAP}`}
        />
        <SummaryCard
          label="Promedio grupal (sin tope)"
          value={fmtPct(grupal.bruta)}
          accent="#1E293B"
          sub="escenario EBITDA 100%"
        />
        <SummaryCard
          label="Gap grupal"
          value={fmtPct(grupal.bruta - grupal.final)}
          accent="#DC2626"
          sub="puntos porcentuales perdidos"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ left: 8, right: 24, top: 10, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" fontSize={12} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} fontSize={12} />
              <Tooltip formatter={(v) => `${Number(v).toFixed(1)}%`} cursor={{ fill: '#F1F5F9' }} />
              <Legend />
              <Bar dataKey="final" name="Final (con tope)" fill="#00897B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="bruta" name="Bruta (sin tope)" fill="#1E293B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card p-6 overflow-x-auto">
        <h3 className="font-semibold text-ink mb-4">Comparativo por área</h3>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b border-slate-200">
              <th className="py-2 pr-4">Área</th>
              <th className="py-2 px-3">Final (×0.96)</th>
              <th className="py-2 px-3">Bruta (100%)</th>
              <th className="py-2 px-3">Diferencia</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.area} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-4 font-semibold text-ink">
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
                    style={{ background: AREA_COLORS[d.area] ?? '#00897B' }}
                  />
                  {d.area}
                </td>
                <td className="py-2 px-3 font-semibold text-teal-dark">{d.final.toFixed(1)}%</td>
                <td className="py-2 px-3 text-slate-700">{d.bruta.toFixed(1)}%</td>
                <td className="py-2 px-3 text-red-600 font-semibold">-{d.diff.toFixed(1)} pp</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function SummaryCard({ label, value, accent, sub }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 border-l-4" style={{ borderColor: accent }}>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-3xl font-bold text-ink mt-2">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

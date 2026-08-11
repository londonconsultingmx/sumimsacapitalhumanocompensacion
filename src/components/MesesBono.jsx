import React from 'react'
import {
  AREA_COLORS,
  BASE_MESES_BONO,
  BOTTOM_LINE_CON_GS,
  BOTTOM_LINE_SIN_GS,
  EBITDA_CAP,
  ESCENARIOS_BONO,
  SUBDIRECTORES,
  fmtPct,
  mesesBono,
  puntosPorEje,
  tieneBono,
} from '../utils/compensation.js'

const fmtMeses = (n) => n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')

export default function MesesBono({ breakdowns }) {
  const filas = breakdowns
    .filter((b) => tieneBono(b.area))
    .map((b) => {
      const { indicadores, ev360 } = puntosPorEje(b)
      const base = mesesBono(b.bruta)
      return {
        area: b.area,
        subdirector: SUBDIRECTORES[b.area]?.nombre ?? '—',
        indicadores,
        ev360,
        bruta: b.bruta,
        base,
        escenarios: Object.fromEntries(ESCENARIOS_BONO.map((e) => [e.id, base * e.factor])),
      }
    })
    .sort((a, b) => b.base - a.base)

  const total = (id) => filas.reduce((s, f) => s + f.escenarios[id], 0)
  const totalConGS = total('blConGS')
  const totalSinGS = total('blSinGS')

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-md shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink">Compensación 2025 · Meses de bono</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          La calificación se convierte a meses de sueldo sobre una base tope de{' '}
          <strong>{BASE_MESES_BONO} meses</strong>:{' '}
          <code className="bg-slate-100 px-1 rounded">meses = calificación × {BASE_MESES_BONO}</code>.
          Sobre esa base se aplica el factor corporativo de cada escenario. El pago se calcula
          contra <strong>Bottom Line</strong>: incluyendo Goldman Sachs el bottom line cerró en{' '}
          <strong>{fmtPct(BOTTOM_LINE_CON_GS, 1)}</strong>; excluyéndolo llega al{' '}
          <strong>{fmtPct(BOTTOM_LINE_SIN_GS, 0)}</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <SummaryCard
          label="Bottom Line con GS"
          value={fmtMeses(totalConGS)}
          sub={`meses en total · factor ${BOTTOM_LINE_CON_GS}`}
          accent="#B45309"
        />
        <SummaryCard
          label="Bottom Line sin GS"
          value={fmtMeses(totalSinGS)}
          sub={`meses en total · factor ${BOTTOM_LINE_SIN_GS.toFixed(2)}`}
          accent="#24437A"
        />
        <SummaryCard
          label="Efecto Goldman Sachs"
          value={`-${fmtMeses(totalSinGS - totalConGS)}`}
          sub={`meses que GS le cuesta a los ${filas.length} subdirectores`}
          accent="#DC2626"
        />
      </div>

      <div className="bg-white rounded-md shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-ink">Meses de bono por escenario</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Indicadores y Ev. 360 en puntos sobre 100 · meses = calificación × {BASE_MESES_BONO} ×
            factor del escenario
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 bg-slate-50 border-b border-slate-200">
                <th className="py-2 px-4">Subdirector</th>
                <th className="py-2 px-3">Área</th>
                <th className="py-2 px-3 text-right">Base</th>
                <th className="py-2 px-3 text-right">Indicadores</th>
                <th className="py-2 px-3 text-right">Ev. 360</th>
                <th className="py-2 px-3 text-right">Calf. final</th>
                {ESCENARIOS_BONO.map((e) => (
                  <th
                    key={e.id}
                    title={e.desc}
                    className={`py-2 px-3 text-right whitespace-nowrap ${
                      e.id === 'blConGS' ? 'text-ink' : ''
                    }`}
                  >
                    {e.label}
                    <div className="font-normal text-[10px] text-slate-400">×{e.factor}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filas.map((f) => (
                <tr key={f.area} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 px-4 font-semibold text-ink whitespace-nowrap">
                    <span
                      className="inline-block w-2 h-2 rounded-full mr-2 align-middle"
                      style={{ background: AREA_COLORS[f.area] ?? '#24437A' }}
                    />
                    {f.subdirector}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">{f.area}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 tabular-nums">
                    {BASE_MESES_BONO}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums">
                    {f.indicadores === null ? '—' : f.indicadores.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums">
                    {f.ev360 === null ? '—' : f.ev360.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums">
                    {(f.bruta * 100).toFixed(2)}
                  </td>
                  {ESCENARIOS_BONO.map((e) => (
                    <td
                      key={e.id}
                      className={`py-2.5 px-3 text-right tabular-nums ${
                        e.id === 'blConGS'
                          ? 'font-bold text-ink'
                          : e.id === 'blSinGS'
                            ? 'text-slate-700'
                            : 'text-slate-400'
                      }`}
                    >
                      {fmtMeses(f.escenarios[e.id])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-ink">
                <td className="py-2.5 px-4" colSpan={6}>
                  Total ({filas.length} subdirectores)
                </td>
                {ESCENARIOS_BONO.map((e) => (
                  <td
                    key={e.id}
                    className={`py-2.5 px-3 text-right tabular-nums ${
                      e.id === 'blConGS' || e.id === 'blSinGS' ? '' : 'text-slate-400'
                    }`}
                  >
                    {fmtMeses(total(e.id))}
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-card p-6">
        <h3 className="font-semibold text-ink mb-3">Qué significa cada escenario</h3>
        <dl className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          {ESCENARIOS_BONO.map((e) => (
            <div key={e.id} className="flex gap-3">
              <dt className="font-semibold text-ink whitespace-nowrap min-w-[9.5rem]">
                {e.label}
                <span className="font-normal text-slate-400"> ×{e.factor}</span>
              </dt>
              <dd className="text-slate-500">{e.desc}</dd>
            </div>
          ))}
        </dl>
        <p className="text-xs text-muted mt-4">
          El escenario <strong>EBITDA {EBITDA_CAP * 100}%</strong> es el que la herramienta aplica a
          la calificación en el resto del portal. Aquí se muestra solo como referencia: el castigo
          corporativo debe aplicarse una sola vez, y el criterio de pago es el Bottom Line.
        </p>
      </div>
    </section>
  )
}

function SummaryCard({ label, value, accent, sub }) {
  return (
    <div className="bg-white rounded-md shadow-card p-5 border-l-4" style={{ borderColor: accent }}>
      <div className="text-xs uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-3xl font-bold text-ink mt-2 tabular-nums">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}

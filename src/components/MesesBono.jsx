import React from 'react'
import {
  AREA_COLORS,
  BASE_MESES_BONO,
  EBITDA_CAP,
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
      return {
        area: b.area,
        subdirector: SUBDIRECTORES[b.area]?.nombre ?? '—',
        indicadores,
        ev360,
        bruta: b.bruta,
        final: b.final,
        mesesPleno: mesesBono(b.bruta),
        mesesPago: mesesBono(b.final),
      }
    })
    .sort((a, b) => b.mesesPago - a.mesesPago)

  const totalPleno = filas.reduce((s, f) => s + f.mesesPleno, 0)
  const totalPago = filas.reduce((s, f) => s + f.mesesPago, 0)

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-md shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink">Compensación 2025 · Meses de bono</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          La calificación se convierte a meses de sueldo sobre una base tope de{' '}
          <strong>{BASE_MESES_BONO} meses</strong>:{' '}
          <code className="bg-slate-100 px-1 rounded">meses = calificación × {BASE_MESES_BONO}</code>.
          La columna <em>EBITDA 100%</em> es el escenario pleno; la de pago aplica el cierre real de
          EBITDA ({fmtPct(EBITDA_CAP, 0)}), que es lo mismo que usar la calificación con tope.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        <SummaryCard
          label={`Base tope`}
          value={`${BASE_MESES_BONO}.00`}
          sub="meses al 100% de cumplimiento"
          accent="#8B98AC"
        />
        <SummaryCard
          label="Promedio a pagar"
          value={fmtMeses(totalPago / (filas.length || 1))}
          sub={`meses · EBITDA ${fmtPct(EBITDA_CAP, 0)}`}
          accent="#24437A"
        />
        <SummaryCard
          label="Meses no devengados"
          value={fmtMeses(totalPleno - totalPago)}
          sub={`suma de los ${filas.length} subdirectores por el tope EBITDA`}
          accent="#DC2626"
        />
      </div>

      <div className="bg-white rounded-md shadow-card overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-ink">Meses de bono por subdirector</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Indicadores y Ev. 360 en puntos sobre 100 · ordenado por meses a pagar
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
                <th className="py-2 px-3 text-right">Meses (EBITDA 100%)</th>
                <th className="py-2 px-3 text-right">Meses a pagar</th>
                <th className="py-2 px-3 text-right">Δ</th>
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
                    {f.ev360 === null ? (
                      <span className="text-slate-400" title="El área no tiene evaluación 360°">
                        n/a
                      </span>
                    ) : (
                      f.ev360.toFixed(2)
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-700 tabular-nums">
                    {(f.bruta * 100).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 tabular-nums">
                    {fmtMeses(f.mesesPleno)}
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-ink tabular-nums">
                    {fmtMeses(f.mesesPago)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-red-600 tabular-nums">
                    -{fmtMeses(f.mesesPleno - f.mesesPago)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-50 border-t border-slate-200 font-semibold text-ink">
                <td className="py-2.5 px-4" colSpan={6}>
                  Total ({filas.length} subdirectores)
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums text-slate-500">
                  {fmtMeses(totalPleno)}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums">{fmtMeses(totalPago)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-red-600">
                  -{fmtMeses(totalPleno - totalPago)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
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

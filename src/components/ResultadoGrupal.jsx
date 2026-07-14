import React from 'react'
import {
  AREA_COLORS,
  EBITDA_CAP,
  EXCLUDED_FROM_GRUPAL,
  SUBDIRECTORES,
  THRESHOLD_APROBATORIO,
  fmtPct,
} from '../utils/compensation.js'

export default function ResultadoGrupal({ breakdowns, grupal }) {
  // El resumen grupal solo cuenta áreas que ponderan.
  const totals = breakdowns
    .filter((b) => !EXCLUDED_FROM_GRUPAL.has(b.area))
    .reduce(
      (acc, b) => {
        acc.si += b.counts.si
        acc.parcial += b.counts.parcial
        acc.no += b.counts.no
        acc.sinDato += b.counts.sinDato
        acc.total += b.total
        return acc
      },
      { si: 0, parcial: 0, no: 0, sinDato: 0, total: 0 }
    )

  const rows = breakdowns.slice().sort((a, b) => b.final - a.final)

  return (
    <section className="flex flex-col gap-5">
      {/* Resumen ejecutivo */}
      <div className="bg-white rounded-md shadow-card">
        <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-rule">
          <Stat
            label="Calificación grupal (con tope)"
            value={fmtPct(grupal.final)}
            note={`bruta ${fmtPct(grupal.bruta)} × ${EBITDA_CAP} EBITDA`}
          />
          <Stat
            label="Mínimo aprobatorio"
            value={fmtPct(THRESHOLD_APROBATORIO, 0)}
            note={
              grupal.final >= THRESHOLD_APROBATORIO
                ? 'el grupo está por encima del mínimo'
                : 'el grupo está por debajo del mínimo'
            }
          />
          <Stat
            label="Indicadores evaluados"
            value={String(totals.total - totals.sinDato)}
            note={
              <span className="whitespace-nowrap">
                <Dot c="#15803D" /> {totals.si} Sí&ensp;
                <Dot c="#B45309" /> {totals.parcial} Parcial&ensp;
                <Dot c="#B91C1C" /> {totals.no} No&ensp;
                <Dot c="#98A2B3" /> {totals.sinDato} sin dato
              </span>
            }
          />
        </div>
      </div>

      {/* Tabla por área */}
      <div className="bg-white rounded-md shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-rule flex items-baseline justify-between">
          <h2 className="text-base font-semibold text-ink">Calificación por área</h2>
          <div className="text-xs text-muted">Tope EBITDA aplicado: {fmtPct(EBITDA_CAP, 0)}</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted border-b border-rule">
                <th className="py-2.5 px-5 font-medium">Área</th>
                <th className="py-2.5 px-3 font-medium text-right">Indicadores (70%)</th>
                <th className="py-2.5 px-3 font-medium text-right">360° (30%)</th>
                <th className="py-2.5 px-3 font-medium text-right">Bruta</th>
                <th className="py-2.5 px-3 font-medium text-right">Final (×0.96)</th>
                <th className="py-2.5 px-3 font-medium w-52">&nbsp;</th>
                <th className="py-2.5 px-5 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((b) => (
                <AreaRow key={b.area} b={b} excluded={EXCLUDED_FROM_GRUPAL.has(b.area)} />
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-rule bg-paper/60">
                <td className="py-3 px-5 font-semibold text-ink">Promedio grupal</td>
                <td className="py-3 px-3" />
                <td className="py-3 px-3" />
                <td className="py-3 px-3 text-right font-semibold text-ink tabular-nums">
                  {fmtPct(grupal.bruta)}
                </td>
                <td className="py-3 px-3 text-right font-semibold text-ink tabular-nums">
                  {fmtPct(grupal.final)}
                </td>
                <td className="py-3 px-3">
                  <ScoreBar value={grupal.final} />
                </td>
                <td className="py-3 px-5">
                  <Estado value={grupal.final} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-rule text-xs text-muted">
          Ordenado por calificación final. La línea vertical de cada barra marca el mínimo
          aprobatorio de 75%.
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, note }) {
  return (
    <div className="px-5 py-4">
      <div className="text-xs text-muted">{label}</div>
      <div className="text-2xl font-semibold text-ink mt-1 tabular-nums">{value}</div>
      <div className="text-xs text-muted mt-1">{note}</div>
    </div>
  )
}

function Dot({ c }) {
  return (
    <span
      className="inline-block w-1.5 h-1.5 rounded-full align-middle mr-1"
      style={{ background: c }}
    />
  )
}

function AreaRow({ b, excluded }) {
  const color = AREA_COLORS[b.area] ?? '#24437A'
  const sub = SUBDIRECTORES[b.area]?.nombre
  return (
    <tr className="border-b border-rule/70 last:border-0">
      <td className="py-3 px-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
          <div>
            <div className="font-semibold text-ink leading-tight">
              {b.area}
              {excluded && (
                <span className="ml-2 text-[10px] font-medium uppercase tracking-wide text-muted">
                  no pondera
                </span>
              )}
            </div>
            {sub && <div className="text-xs text-muted leading-tight">{sub}</div>}
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-right tabular-nums text-slate-700">
        {b.scores['02. Indicadores de Negocio'] === null
          ? '—'
          : fmtPct(b.scores['02. Indicadores de Negocio'])}
      </td>
      <td className="py-3 px-3 text-right tabular-nums text-slate-700">
        {b.scores['03. 360'] === null ? (
          <span className="text-slate-400">Sin dato</span>
        ) : (
          fmtPct(b.scores['03. 360'])
        )}
      </td>
      <td className="py-3 px-3 text-right tabular-nums text-slate-700">{fmtPct(b.bruta)}</td>
      <td className="py-3 px-3 text-right tabular-nums font-semibold text-ink">
        {fmtPct(b.final)}
      </td>
      <td className="py-3 px-3">
        <ScoreBar value={b.final} />
      </td>
      <td className="py-3 px-5">
        <Estado value={b.final} />
      </td>
    </tr>
  )
}

// Barra horizontal sencilla con marca del mínimo aprobatorio.
function ScoreBar({ value }) {
  const v = Math.max(0, Math.min(1, value))
  return (
    <div className="relative h-2 bg-rule/60 rounded-sm w-full min-w-[10rem]">
      <div
        className="absolute left-0 top-0 bottom-0 rounded-sm"
        style={{ width: `${v * 100}%`, background: '#24437A' }}
      />
      <div
        className="absolute top-[-3px] bottom-[-3px] w-px bg-ink/50"
        style={{ left: `${THRESHOLD_APROBATORIO * 100}%` }}
      />
    </div>
  )
}

function Estado({ value }) {
  if (value >= THRESHOLD_APROBATORIO) {
    return <span className="text-xs font-semibold" style={{ color: '#15803D' }}>Aprobatorio</span>
  }
  if (value >= 0.6) {
    return <span className="text-xs font-semibold" style={{ color: '#B45309' }}>En riesgo</span>
  }
  return <span className="text-xs font-semibold" style={{ color: '#B91C1C' }}>Debajo del mínimo</span>
}

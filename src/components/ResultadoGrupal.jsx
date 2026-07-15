import React from 'react'
import {
  AREA_COLORS,
  EBITDA_CAP,
  EXCLUDED_FROM_GRUPAL,
  KPIS_SISTEMA,
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

  // Origen de los KPIs: cuántos salen de sistema vs. captura manual.
  // Base = indicadores de negocio de todas las áreas (los 360° no cuentan).
  const totalKpis = breakdowns.reduce(
    (s, b) => s + (b.rowsByEje['02. Indicadores de Negocio']?.length ?? 0),
    0
  )
  const sistemaKpis = KPIS_SISTEMA.reduce((s, k) => s + k.sistema, 0)

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

      {/* Origen de los KPIs: sistema vs. manual */}
      <OrigenKpis total={totalKpis} sistema={sistemaKpis} />

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
          aprobatorio de {Math.round(THRESHOLD_APROBATORIO * 100)}%.
        </div>
      </div>
    </section>
  )
}

// Panel de origen de los datos: cuántos KPIs salen de sistema (Business
// Central / Power BI) y cuántos se capturan manualmente. Los 360° no cuentan.
function OrigenKpis({ total, sistema }) {
  const manual = total - sistema
  const pctSistema = total ? sistema / total : 0
  const areasSistema = KPIS_SISTEMA.reduce((s, k) => s + k.sistema, 0)
  return (
    <div className="bg-white rounded-md shadow-card">
      <div className="px-5 py-4 border-b border-rule flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-base font-semibold text-ink">Origen de los KPIs</h2>
        <div className="text-xs text-muted">
          Base: {total} indicadores de negocio · los 360° no cuentan
        </div>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <span className="text-2xl font-semibold text-ink tabular-nums">{sistema}</span>{' '}
            <span className="text-sm text-slate-700">
              de sistema · <strong className="text-ink">{fmtPct(pctSistema, 0)}</strong>
            </span>
          </div>
          <div>
            <span className="text-2xl font-semibold text-muted tabular-nums">{manual}</span>{' '}
            <span className="text-sm text-slate-700">
              manuales · <strong className="text-ink">{fmtPct(1 - pctSistema, 0)}</strong>
            </span>
          </div>
        </div>
        {/* Barra apilada sistema vs manual */}
        <div className="flex h-2 rounded-sm overflow-hidden bg-rule/60">
          <div style={{ width: `${pctSistema * 100}%`, background: '#24437A' }} />
        </div>
        <div className="flex flex-col gap-1.5 mt-1">
          {KPIS_SISTEMA.map((k) => (
            <div key={k.area} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: AREA_COLORS[k.area] ?? '#24437A' }}
              />
              <span className="font-medium text-ink">{k.area}</span>
              <span className="text-slate-600 tabular-nums">{k.sistema} de sistema</span>
              {k.links.map((l) => (
                <a
                  key={l.url}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue hover:text-teal-dark underline decoration-dotted underline-offset-2"
                >
                  {l.label} ↗
                </a>
              ))}
              {!k.links.length && (
                <span className="text-xs text-muted">sistema de RH</span>
              )}
            </div>
          ))}
          <div className="text-xs text-muted mt-1">
            Auditoría, TI y Finanzas: captura manual ({areasSistema} de {total} KPIs del
            esquema salen de sistema).
          </div>
        </div>
      </div>
    </div>
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

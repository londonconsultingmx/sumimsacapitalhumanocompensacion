import React from 'react'
import {
  AREA_COLORS,
  BENCHMARK_LEVELS,
  SUBDIRECTORES,
  benchmarkLevelFor,
  fmtPct,
} from '../utils/compensation.js'

export default function BenchmarksPage({ breakdowns }) {
  // Order from 5 (top) to 1 (bottom) — as in the source PDF.
  const levels = BENCHMARK_LEVELS

  // Enriched list: each subdirector with their 360 score and benchmark level.
  const placed = breakdowns.map((b) => {
    const score360 = b.scores['03. 360'] ?? 0
    const lvl = benchmarkLevelFor(score360)
    const subdir = SUBDIRECTORES[b.area]?.nombre ?? b.area
    return { area: b.area, subdir, score360, level: lvl }
  })

  // Group subdirectors by level id for the distribution column.
  const byLevel = {}
  for (const lvl of levels) byLevel[lvl.id] = []
  for (const p of placed) {
    if (p.level) byLevel[p.level.id].push(p)
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-card p-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted mb-1">
          Capital Humano · Benchmark Consultorías Globales
        </div>
        <h2 className="text-lg font-semibold text-ink">Niveles de desempeño</h2>
        <p className="text-sm text-muted mt-1 max-w-3xl">
          Los scores de 360° de cada subdirector se clasifican en la curva de desempeño
          calibrada contra firmas como Korn Ferry, Aon, PwC, Deloitte y GM. El mínimo
          aprobatorio es <strong className="text-ink">75%</strong> (nivel 3 "Strong / Regularly demonstrated").
        </p>
      </div>

      {/* Level table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-slate-500 border-b border-slate-200">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Nivel</th>
                <th className="py-3 px-4">% Cumplimiento</th>
                <th className="py-3 px-4">Ranking SUMIMSA</th>
                <th className="py-3 px-4">Interpretación</th>
                <th className="py-3 px-4">Benchmark (consultoras globales)</th>
                <th className="py-3 px-4">Subdirectores</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((lvl) => {
                const here = byLevel[lvl.id]
                return (
                  <tr key={lvl.id} className="border-b border-slate-100 last:border-0 align-top">
                    <td className="py-4 px-4">
                      <div
                        className="w-7 h-7 rounded-sm flex items-center justify-center font-bold text-xs"
                        style={{ background: lvl.color, color: lvl.textOnColor }}
                      >
                        {lvl.id}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-ink">{lvl.label}</div>
                      <div className="text-xs text-muted mt-0.5">{lvl.rankingRange}</div>
                    </td>
                    <td className="py-4 px-4 font-mono text-ink">{lvl.rangeLabel}</td>
                    <td className="py-4 px-4">
                      <span
                        className="inline-block px-2 py-0.5 rounded-sm text-xs font-semibold"
                        style={{ background: `${lvl.color}22`, color: lvl.color === '#B9DEEA' ? '#1C1B17' : lvl.color }}
                      >
                        {lvl.ranking}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 max-w-xs">{lvl.interp}</td>
                    <td className="py-4 px-4 text-slate-600 text-xs max-w-sm">{lvl.external}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1">
                        {here.length === 0 ? (
                          <span className="text-xs text-slate-400">—</span>
                        ) : (
                          here.map((p) => <SubdirectorChip key={p.area} p={p} />)
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Per-subdirector cards with their placement */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {placed
          .slice()
          .sort((a, b) => b.score360 - a.score360)
          .map((p) => (
            <SubdirectorCard key={p.area} p={p} />
          ))}
      </div>

      <div className="bg-paper border border-rule rounded-2xl p-5 flex items-start gap-4">
        <div className="w-1.5 self-stretch bg-blue rounded-sm" />
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Principio</div>
          <div className="font-sans text-ink font-medium text-lg mt-1">
            Integridad como la base de un todo
          </div>
          <div className="text-sm text-muted mt-1 max-w-2xl">
            El desempeño se evalúa sobre la base de los valores SUMIMSA — Integridad,
            Efectividad, Trabajo Colaborativo, Responsabilidad y Enfoque al Cliente.
          </div>
        </div>
      </div>
    </section>
  )
}

function SubdirectorChip({ p }) {
  const dot = AREA_COLORS[p.area] ?? '#6B6A62'
  return (
    <div className="inline-flex items-center gap-2 text-xs">
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
      <span className="font-semibold text-ink">{p.subdir}</span>
      <span className="text-muted">· {p.area}</span>
      <span className="font-mono tabular-nums text-ink">{fmtPct(p.score360, 0)}</span>
    </div>
  )
}

function SubdirectorCard({ p }) {
  const dot = AREA_COLORS[p.area] ?? '#6B6A62'
  const lvl = p.level
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: dot }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
            {p.area}
          </span>
        </div>
        <span
          className="font-mono text-[10px] px-2 py-0.5 rounded-sm"
          style={{ background: lvl.color, color: lvl.textOnColor }}
        >
          Nivel {lvl.id}
        </span>
      </div>

      <div>
        <div className="font-sans font-bold text-ink text-lg leading-tight">{p.subdir}</div>
        <div className="font-sans text-sm text-muted mt-0.5">
          360° promedio:{' '}
          <span className="font-bold text-ink tabular-nums">{fmtPct(p.score360, 0)}</span>
        </div>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-sans font-bold text-2xl text-ink">{lvl.label}</span>
        <span className="font-mono text-[11px] text-muted">{lvl.rangeLabel}</span>
      </div>

      <div className="text-xs text-slate-700 leading-snug">{lvl.interp}</div>

      {/* Mini scale */}
      <div className="mt-2 flex items-stretch h-2 rounded-sm overflow-hidden">
        {BENCHMARK_LEVELS.slice().reverse().map((x) => (
          <div
            key={x.id}
            className="flex-1"
            style={{
              background: x.id === lvl.id ? x.color : `${x.color}33`,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] font-mono text-muted">
        <span>1</span>
        <span>2</span>
        <span>3</span>
        <span>4</span>
        <span>5</span>
      </div>
    </div>
  )
}

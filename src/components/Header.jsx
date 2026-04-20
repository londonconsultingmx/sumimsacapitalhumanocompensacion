import React from 'react'
import { EBITDA_CAP, EVIDENCIAS_URL, fmtPct } from '../utils/compensation.js'

const TABS = [
  { id: 'grupal', label: 'Resultado grupal' },
  { id: 'ejes', label: 'Desglose por eje' },
  { id: 'detalle', label: 'Detalle por área' },
  { id: 'sintope', label: '¿Y sin el tope?' },
]

export default function Header({ active, onChange }) {
  return (
    <header className="bg-ink text-white">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-teal-light/90 font-semibold">
              SUMIMSA · Esquema 2025
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              Compensación Variable — Subdirecciones
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Tope EBITDA corporativo:{' '}
              <span className="font-semibold text-teal-light">{fmtPct(EBITDA_CAP, 0)}</span> ·
              pesos por eje 40 / 40 / 20
            </p>
          </div>
          <a
            href={EVIDENCIAS_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-dark transition px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Ver evidencias en SharePoint
            <span aria-hidden>↗</span>
          </a>
        </div>
        <nav className="flex flex-wrap gap-1 -mb-2">
          {TABS.map((t) => {
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition ${
                  isActive
                    ? 'bg-canvas text-ink'
                    : 'bg-white/0 text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}

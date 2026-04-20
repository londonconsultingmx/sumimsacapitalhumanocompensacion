import React from 'react'
import BrandMark from './BrandMark.jsx'
import { EBITDA_CAP, EVIDENCIAS_URL, fmtPct } from '../utils/compensation.js'

const TABS = [
  { id: 'grupal', label: 'Resultado grupal' },
  { id: 'ejes', label: 'Desglose por eje' },
  { id: 'detalle', label: 'Detalle por área' },
  { id: 'sintope', label: '¿Y sin el tope?' },
]

export default function Header({ active, onChange, onBackToIntro }) {
  return (
    <header className="bg-ink text-paper">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <BrandMark size="sm" tone="paper" caption="Dirección de Capital Humano" />
            <div className="hidden md:block h-10 w-px bg-paper/20 mx-1" />
            <div className="hidden md:block">
              <div className="font-mono uppercase tracking-[0.22em] text-[10px] text-paper/70">
                Esquema 2025 · Subdirecciones
              </div>
              <h1 className="font-sans text-xl md:text-2xl font-bold mt-0.5 tracking-tight">
                Compensación Variable
              </h1>
              <p className="text-xs text-paper/70 mt-0.5">
                Tope EBITDA{' '}
                <span className="font-semibold text-gold">{fmtPct(EBITDA_CAP, 0)}</span>{' '}
                · pesos 40 / 40 / 20
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onBackToIntro && (
              <button
                onClick={onBackToIntro}
                className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/70 hover:text-paper transition px-3 py-2"
              >
                ← Intro
              </button>
            )}
            <a
              href={EVIDENCIAS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-blue hover:bg-blue/80 transition px-4 py-2 rounded-sm text-sm font-semibold"
            >
              Ver evidencias
              <span aria-hidden>↗</span>
            </a>
          </div>
        </div>
        <nav className="flex flex-wrap gap-1 -mb-2">
          {TABS.map((t) => {
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`px-4 py-2 rounded-t-sm text-sm font-medium transition ${
                  isActive
                    ? 'bg-paper text-ink'
                    : 'bg-white/0 text-paper/70 hover:text-paper hover:bg-white/10'
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

import React from 'react'
import BrandMark from './BrandMark.jsx'
import { EBITDA_CAP, EVIDENCIAS_URL, fmtPct } from '../utils/compensation.js'

const TABS = [
  { id: 'grupal', label: 'Resultado grupal' },
  { id: 'ejes', label: 'Desglose por eje' },
  { id: 'detalle', label: 'Detalle por área' },
  { id: 'sintope', label: '¿Y sin el tope?' },
  { id: 'benchmarks', label: 'Benchmarks' },
  { id: 'catalogo2026', label: 'Catálogo 2026' },
]

export default function Header({ active, onChange, onBackToIntro }) {
  return (
    <header className="bg-white border-b border-rule">
      <div className="max-w-7xl mx-auto px-6 pt-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <BrandMark size="sm" tone="ink" caption="Dirección de Capital Humano" />
            <div className="hidden md:block h-10 w-px bg-rule mx-1" />
            <div className="hidden md:block">
              <div className="text-[11px] uppercase tracking-[0.14em] text-muted">
                Esquema simplificado · Subdirecciones · Cierre 2025
              </div>
              <h1 className="text-lg font-bold text-ink mt-0.5 leading-tight">
                Compensación Variable
              </h1>
              <p className="text-xs text-muted mt-0.5">
                Tope EBITDA <span className="font-semibold text-ink">{fmtPct(EBITDA_CAP, 0)}</span>{' '}
                · Indicadores 70% · 360° 30%
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {onBackToIntro && (
              <button
                onClick={onBackToIntro}
                className="text-xs text-muted hover:text-ink transition"
              >
                ← Intro
              </button>
            )}
            <a
              href={EVIDENCIAS_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue hover:text-teal-dark transition"
            >
              Ver evidencias <span aria-hidden className="text-xs">↗</span>
            </a>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-1 -mb-px overflow-x-auto">
          {TABS.map((t) => {
            const isActive = t.id === active
            return (
              <button
                key={t.id}
                onClick={() => onChange(t.id)}
                className={`pb-3 text-sm border-b-2 transition whitespace-nowrap ${
                  isActive
                    ? 'border-ink text-ink font-semibold'
                    : 'border-transparent text-muted hover:text-ink'
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

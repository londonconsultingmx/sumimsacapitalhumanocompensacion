import React from 'react'
import BrandMark from './BrandMark.jsx'

const PILLARS = [
  { k: '01', label: 'Objetivos', pct: 40, desc: 'Metas individuales del periodo', accent: 'bg-ink' },
  { k: '02', label: 'Indicadores de Negocio', pct: 40, desc: 'Resultados financieros y operativos', accent: 'bg-blue' },
  { k: '03', label: 'Evaluación 360°', pct: 20, desc: 'Retroalimentación multi-nivel', accent: 'bg-gold' },
]

export default function IntroPage({ onEnter }) {
  return (
    <div className="min-h-screen w-full bg-bg text-ink relative overflow-hidden">
      {/* vertical guide lines */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {[8, 28, 50, 72, 92].map((x, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px bg-rule line-grow"
            style={{ left: `${x}%`, animationDelay: `${i * 0.08}s`, transformOrigin: 'top center' }}
          />
        ))}
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8 md:px-16 lg:px-28 pt-14 md:pt-20 pb-24">
        {/* top row */}
        <div className="flex items-start justify-between gap-6 rise-in">
          <BrandMark size="lg" caption="Dirección de Capital Humano" />
          <div className="flex items-center gap-3 pt-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="font-mono uppercase tracking-[0.28em] text-[11px] text-ink">
              Ejercicio <span className="text-blue">2025</span> · Confidencial
            </span>
          </div>
        </div>

        {/* main title */}
        <div className="mt-20 md:mt-24 lg:mt-28">
          <h1
            className="font-sans text-ink leading-[1.02] tracking-[-0.035em]"
            style={{ fontSize: 'clamp(56px, 11vw, 132px)' }}
          >
            <span className="mask-wrap font-light">
              <span className="mask-rise" style={{ animationDelay: '0.1s' }}>Esquema</span>
            </span>{' '}
            <span className="mask-wrap font-light text-muted">
              <span className="mask-rise" style={{ animationDelay: '0.25s' }}>de</span>
            </span>
            <br />
            <span className="mask-wrap font-bold">
              <span className="mask-rise" style={{ animationDelay: '0.45s' }}>Compensación</span>
            </span>
          </h1>

          <div className="flex items-center gap-6 mt-10">
            <div className="h-px w-20 bg-blue line-grow" style={{ animationDelay: '0.9s' }} />
            <span className="font-mono uppercase tracking-[0.32em] text-[12px] text-blue">
              Para Subdirectores
            </span>
          </div>
        </div>

        {/* pillar cards */}
        <div className="mt-14 md:mt-20 grid md:grid-cols-3 gap-5 md:gap-6">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.k} data={p} delay={1.1 + i * 0.15} />
          ))}
        </div>

        {/* footer row */}
        <div className="mt-14 md:mt-20 flex flex-wrap items-center justify-between gap-6 rise-in" style={{ animationDelay: '1.8s' }}>
          <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            <span>Tope EBITDA 96%</span>
            <span className="h-3 w-px bg-rule" />
            <span>6 Subdirecciones</span>
            <span className="h-3 w-px bg-rule" />
            <span>148 Indicadores</span>
          </div>

          <button
            onClick={onEnter}
            className="group inline-flex items-center gap-5 bg-ink text-paper px-6 py-3 hover:bg-blue transition-colors duration-300"
          >
            <span className="font-sans font-medium text-lg tracking-[0.04em]">Entrar</span>
            <span className="inline-flex items-center gap-2">
              <span className="h-px w-12 bg-paper transition-transform duration-500 group-hover:scale-x-125 origin-left" />
              <span className="text-lg leading-none">→</span>
            </span>
          </button>
        </div>
      </div>

      {/* bottom attribution rule */}
      <div className="absolute left-8 right-8 md:left-16 md:right-16 lg:left-28 lg:right-28 bottom-6 h-px bg-rule" />
      <div className="absolute left-8 md:left-16 lg:left-28 bottom-2 font-mono uppercase tracking-[0.22em] text-[10px] text-muted">
        SUMIMSA · 2025 · Dashboard ejecutivo
      </div>
    </div>
  )
}

function PillarCard({ data, delay }) {
  return (
    <div
      className="rise-in relative bg-paper border border-rule p-6 flex flex-col gap-3 min-h-[180px]"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
          PILAR {data.k}
        </span>
        <span className="font-sans font-bold text-ink text-3xl tabular-nums tracking-tight">
          {data.pct}%
        </span>
      </div>
      <div className="font-sans text-xl text-ink font-medium tracking-tight leading-tight">
        {data.label}
      </div>
      <div className="font-sans text-sm text-muted leading-snug">{data.desc}</div>
      <div className="mt-auto h-1 bg-ink/5 relative">
        <div
          className={`absolute left-0 top-0 bottom-0 ${data.accent} line-grow`}
          style={{ width: `${data.pct}%`, animationDelay: `${delay + 0.3}s` }}
        />
      </div>
    </div>
  )
}

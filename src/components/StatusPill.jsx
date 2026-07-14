import React from 'react'

// Semáforo sobrio: punto de color + texto, sin fondos de pastilla.
export function StatusPill({ cumple, sinDato }) {
  if (sinDato) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-slate-300" /> Sin dato
      </span>
    )
  }
  if (cumple === 1) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap" style={{ color: '#15803D' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: '#15803D' }} /> Sí
      </span>
    )
  }
  if (cumple === 0.5) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap" style={{ color: '#B45309' }}>
        <span className="w-2 h-2 rounded-full" style={{ background: '#B45309' }} /> Parcial
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold whitespace-nowrap" style={{ color: '#B91C1C' }}>
      <span className="w-2 h-2 rounded-full" style={{ background: '#B91C1C' }} /> No
    </span>
  )
}

export function CountPills({ counts }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-600">
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: '#15803D' }} /> {counts.si} Sí
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: '#B45309' }} /> {counts.parcial} Parcial
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full" style={{ background: '#B91C1C' }} /> {counts.no} No
      </span>
      {counts.sinDato > 0 && (
        <span className="inline-flex items-center gap-1.5 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-slate-300" /> {counts.sinDato} sin dato
        </span>
      )}
    </div>
  )
}

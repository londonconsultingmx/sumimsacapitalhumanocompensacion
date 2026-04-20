import React from 'react'

export function StatusPill({ cumple }) {
  if (cumple === 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> Sí
      </span>
    )
  }
  if (cumple === 0.5) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Parcial
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
      <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> No
    </span>
  )
}

export function CountPills({ counts }) {
  return (
    <div className="flex gap-2 text-xs">
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-green-600" /> {counts.si} Sí
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> {counts.parcial} Parcial
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-red-600" /> {counts.no} No
      </span>
    </div>
  )
}

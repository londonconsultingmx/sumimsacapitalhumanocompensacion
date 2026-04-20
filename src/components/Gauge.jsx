import React from 'react'

// Circular gauge rendered with SVG — value in [0, 1].
export default function Gauge({ value = 0, size = 160, color = '#00897B', label, sublabel }) {
  const v = Math.max(0, Math.min(1, value))
  const stroke = 12
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = circ * v
  const pct = (v * 100).toFixed(1)

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circ - dash}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-ink leading-none">{pct}%</span>
          {sublabel && <span className="text-xs text-slate-500 mt-1">{sublabel}</span>}
        </div>
      </div>
      {label && <div className="mt-3 text-sm font-medium text-slate-700 text-center">{label}</div>}
    </div>
  )
}

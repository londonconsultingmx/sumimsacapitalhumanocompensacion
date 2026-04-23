import React from 'react'

// Circular gauge rendered with SVG — value in [0, 1].
// If `threshold` is provided (also in [0, 1]), a dashed tick is drawn on the
// ring at that position (e.g. 0.75 = "mínimo aprobatorio").
export default function Gauge({
  value = 0,
  size = 160,
  color = '#00897B',
  label,
  sublabel,
  threshold,
}) {
  const v = Math.max(0, Math.min(1, value))
  const stroke = 12
  const r = (size - stroke) / 2
  const cx = size / 2
  const cy = size / 2
  const circ = 2 * Math.PI * r
  const dash = circ * v
  const pct = (v * 100).toFixed(1)

  // Threshold tick (inside the rotated group so the angle matches the stroke).
  // Angle in the rotated frame: f * 2π starting at 3-o'clock (which appears at
  // 12-o'clock after the -90° rotation).
  let tick = null
  if (typeof threshold === 'number' && threshold >= 0 && threshold <= 1) {
    const angle = threshold * 2 * Math.PI
    const inner = r - stroke / 2 - 2
    const outer = r + stroke / 2 + 4
    tick = {
      x1: cx + Math.cos(angle) * inner,
      y1: cy + Math.sin(angle) * inner,
      x2: cx + Math.cos(angle) * outer,
      y2: cy + Math.sin(angle) * outer,
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <g style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px` }}>
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
            {tick && (
              <line
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="#1C1B17"
                strokeWidth={2}
                strokeDasharray="3 2"
              />
            )}
          </g>
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

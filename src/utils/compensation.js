// Compensation scheme constants per CLAUDE.md
export const EBITDA_CAP = 0.96
export const EJE_WEIGHTS = {
  '00. Objetivos': 0.40,
  '02. Indicadores de Negocio': 0.40,
  '03. 360': 0.20,
}
export const EJE_LABELS = {
  '00. Objetivos': 'Objetivos',
  '02. Indicadores de Negocio': 'Indicadores de Negocio',
  '03. 360': '360°',
}
export const EJE_ORDER = ['00. Objetivos', '02. Indicadores de Negocio', '03. 360']

// Distinctive color per area
export const AREA_COLORS = {
  'Auditoría':       '#2563EB', // blue
  'Capital Humano':  '#7C3AED', // purple
  'CDS':             '#EA580C', // orange
  'Finanzas':        '#0EA5E9', // sky
  'Talleres':        '#B91C1C', // red
  'TI':              '#0F766E', // teal-ish
}

export const EVIDENCIAS_URL =
  'https://suministrosmarinos.sharepoint.com/sites/EsquemaObjetivosIndicadoresSubdirectores/Documentos%20compartidos/Forms/AllItems.aspx'

// --- numeric helpers -----------------------------------------------------

// Parse European-style numbers:
//  "0,9"         -> 0.9
//  "10.000.000"  -> 10000000
//  "4,73"        -> 4.73
//  "1.234,56"    -> 1234.56
export function parseEuroNumber(raw) {
  if (raw === null || raw === undefined) return NaN
  const s = String(raw).trim()
  if (s === '') return NaN
  const hasComma = s.includes(',')
  const hasDot = s.includes('.')
  if (hasComma && hasDot) {
    return Number(s.replace(/\./g, '').replace(',', '.'))
  }
  if (hasComma) {
    return Number(s.replace(',', '.'))
  }
  if (hasDot) {
    // If it looks like N.NNN.NNN or N.NNN (thousands), strip dots.
    const groups = s.split('.')
    const looksThousands =
      groups.length > 2 ||
      (groups.length === 2 && groups[1].length === 3 && groups[0].length <= 3 && !/^0/.test(groups[0]))
    if (looksThousands) return Number(s.replace(/\./g, ''))
    return Number(s)
  }
  return Number(s)
}

// Cumple # is already authoritative: 1 = Sí, 0.5 = Parcial, 0 = No.
// Some rows have 3 or 5 (data errors) — treat as 1.
export function normalizeCumple(raw) {
  const n = parseEuroNumber(raw)
  if (!Number.isFinite(n)) return 0
  if (n === 0 || n === 0.5 || n === 1) return n
  if (n > 1) return 1
  return 0
}

// --- row shaping ---------------------------------------------------------

// Map rows (positionally pre-keyed by the CSV loader) to normalized objects.
export function normalizeRow(row) {
  return {
    eje: String(row['Eje'] ?? '').trim(),
    metrica: String(row['Metrica'] ?? '').trim(),
    indicador: String(row['Indicador'] ?? '').trim(),
    comunes: String(row['Comunes'] ?? '').trim(),
    um: String(row['UM'] ?? '').trim(),
    direccion: String(row['Dirección'] ?? '').trim(),
    metaRaw: String(row['Meta (#)'] ?? ''),
    realRaw: String(row['Real'] ?? ''),
    importancia: Number(String(row['Importancia'] ?? '').replace(',', '.')) || 0,
    cumpleRaw: String(row['Cumple #'] ?? ''),
    cumple: normalizeCumple(row['Cumple #']),
    cumpleLabel: String(row['Cumple?'] ?? '').trim(),
    corte: String(row['Corte'] ?? '').trim(),
    anio: String(row['Año Esquema'] ?? '').trim(),
  }
}

// --- calculations --------------------------------------------------------

export function scoreEje(rowsOfEje) {
  let num = 0
  let den = 0
  for (const r of rowsOfEje) {
    const w = Number(r.importancia) || 0
    num += r.cumple * w
    den += w
  }
  return den === 0 ? 0 : num / den
}

export function computeAreaBreakdown(rows, area) {
  const areaRows = rows.filter((r) => r.eje === area)
  const byMetrica = {}
  for (const key of EJE_ORDER) {
    byMetrica[key] = areaRows.filter((r) => r.metrica === key)
  }
  const scores = {}
  for (const key of EJE_ORDER) {
    scores[key] = scoreEje(byMetrica[key])
  }
  const bruta =
    scores['00. Objetivos'] * EJE_WEIGHTS['00. Objetivos'] +
    scores['02. Indicadores de Negocio'] * EJE_WEIGHTS['02. Indicadores de Negocio'] +
    scores['03. 360'] * EJE_WEIGHTS['03. 360']
  const finalScore = bruta * EBITDA_CAP

  const counts = { si: 0, parcial: 0, no: 0 }
  for (const r of areaRows) {
    if (r.cumple === 1) counts.si += 1
    else if (r.cumple === 0.5) counts.parcial += 1
    else counts.no += 1
  }

  return {
    area,
    rowsByEje: byMetrica,
    scores,
    bruta,
    final: finalScore,
    diferencia: bruta - finalScore,
    counts,
    total: areaRows.length,
  }
}

export function computeAllAreas(rows) {
  const areas = Array.from(new Set(rows.map((r) => r.eje))).filter(Boolean)
  areas.sort((a, b) => a.localeCompare(b, 'es'))
  return areas.map((a) => computeAreaBreakdown(rows, a))
}

export function computeGrupal(breakdowns) {
  if (!breakdowns.length) return { bruta: 0, final: 0 }
  const bruta = breakdowns.reduce((s, b) => s + b.bruta, 0) / breakdowns.length
  const final = breakdowns.reduce((s, b) => s + b.final, 0) / breakdowns.length
  return { bruta, final }
}

// --- display helpers -----------------------------------------------------

export function fmtPct(n, digits = 1) {
  if (!Number.isFinite(n)) return '—'
  return `${(n * 100).toFixed(digits)}%`
}

export function fmtNumber(raw) {
  const n = parseEuroNumber(raw)
  if (!Number.isFinite(n)) return String(raw ?? '')
  // Format with up to 2 decimals, using Mexican locale
  return n.toLocaleString('es-MX', { maximumFractionDigits: 2 })
}

export function fmtMetaReal(raw, um) {
  const s = String(raw ?? '').trim()
  if (!s) return '—'
  const n = parseEuroNumber(s)
  if (!Number.isFinite(n)) return s
  if (um === '%') return `${(n * (n <= 1 ? 100 : 1)).toLocaleString('es-MX', { maximumFractionDigits: 2 })}%`
  return n.toLocaleString('es-MX', { maximumFractionDigits: 2 })
}

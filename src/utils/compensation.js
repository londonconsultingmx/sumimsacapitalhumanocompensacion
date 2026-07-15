// Esquema simplificado (batería benchmark London): 2 ejes, 70% Indicadores + 30% 360°.
// Áreas sin evaluación 360° (Talleres, TBX) se califican 100% con indicadores.
export const EBITDA_CAP = 0.96
export const EJE_WEIGHTS = {
  '02. Indicadores de Negocio': 0.70,
  '03. 360': 0.30,
}
export const EJE_LABELS = {
  '02. Indicadores de Negocio': 'Indicadores de Negocio',
  '03. 360': '360°',
}
export const EJE_ORDER = ['02. Indicadores de Negocio', '03. 360']

// Distinctive color per area — tonos apagados de reporte, distinguibles entre sí.
export const AREA_COLORS = {
  'Auditoría':            '#1F3A5F', // azul acero
  'Capital Humano':       '#5B4A8A', // violeta apagado
  'Cadena de Suministro': '#A65A2E', // siena
  'Finanzas':             '#2E6E8E', // petróleo
  'Talleres':             '#8A3B3B', // ladrillo
  'TBX':                  '#8A6D2F', // bronce
  'TBX Servicios':        '#8A6D2F', // alias usado en el catálogo 2026
  'TI':                   '#3E7C6F', // pino
}

// Subgrupos visuales dentro del eje Indicadores (no cambian el peso).
// Talleres y TBX se dividen en Financieros (hoja 01) y Operativos (hoja 02),
// como en la batería de Operaciones de la presentación.
export const SUBGRUPO_ORDER = ['Financieros', 'Operativos']
export const SUBGRUPO_LABELS = {
  Financieros: 'Financieros · se miden por unidad',
  Operativos: 'Operativos · se miden por unidad',
}

// KPIs cuyo dato sale de sistema (Business Central / Power BI), por área.
// Solo el conteo (confirmado por el usuario); los 360° no cuentan. Las ligas
// son los reportes de Power BI del excel original del proyecto.
const PBI = 'https://app.powerbi.com/Redirect?action=OpenReport&appId=0ef6ece6-9451-4ebe-af19-80bb1da7889c&ctid=9bb7b321-c671-47d3-897e-cd5e1a950253&pbi_source=appShareLink'
export const KPIS_SISTEMA = [
  {
    area: 'Cadena de Suministro',
    sistema: 7,
    links: [
      { label: 'Servicio · OTIF/SLA', url: `${PBI}&reportObjectId=14a2099c-e954-41d1-87bb-a44e0ad5d320&reportPage=cdc56100917931a099c6` },
      { label: 'Inventarios', url: `${PBI}&reportObjectId=f718c8b8-e07f-4afe-abf9-675511161781&reportPage=84f66aa5c8cc4e7dc833` },
      { label: 'Compras', url: `${PBI}&reportObjectId=9277e812-b72a-4dcc-9e02-02fe484c2ef8&reportPage=4054e62453e2d81188a4` },
    ],
  },
  {
    area: 'TBX',
    sistema: 6,
    links: [
      { label: 'Reporte TBX', url: `${PBI}&reportObjectId=c5d468b7-a9af-4641-a9db-f21086296f62&reportPage=ccbbeaf254334bcd18d3` },
    ],
  },
  {
    area: 'Talleres',
    sistema: 3,
    links: [
      { label: 'P&L por unidad', url: `${PBI}&reportObjectId=4263319a-5e62-4a0c-9b47-b4a301b464db&reportPage=d6a9b2f994156707e930` },
    ],
  },
  { area: 'Capital Humano', sistema: 3, links: [] },
]

export const EVIDENCIAS_URL =
  'https://suministrosmarinos.sharepoint.com/sites/EsquemaObjetivosIndicadoresSubdirectores/Documentos%20compartidos/Forms/AllItems.aspx'

// Passing threshold: 80% across all ejes, shown as a reference line in charts.
export const THRESHOLD_APROBATORIO = 0.80

// Subdirector per area (from 2024 evaluation PDF).
export const SUBDIRECTORES = {
  'Auditoría':            { nombre: 'Arturo Reyes' },
  'Capital Humano':       { nombre: 'Héctor Loredo' },
  'Cadena de Suministro': { nombre: 'Salvador Turrubiates' },
  'Finanzas':             { nombre: 'Alberto Castillo' },
  // Talleres y TBX comparten un mismo subdirector (Subdirector Técnico).
  'Talleres':             { nombre: 'Subdirector Técnico' },
  'TBX':                  { nombre: 'Subdirector Técnico' },
  'TBX Servicios':        { nombre: 'Subdirector Técnico' },
  'TI':                   { nombre: 'Subdirector de TI' },
}

// Benchmark levels (Korn Ferry / Aon / Deloitte / PwC style bell curve) —
// calibrated per SUMIMSA Capital Humano scheme. Each level defines min/max
// cumplimiento (inclusive/exclusive), ranking, interpretation, and external
// benchmark comparison text.
export const BENCHMARK_LEVELS = [
  {
    id: 5,
    label: 'Outstanding',
    rangeLabel: '95 – 100%',
    rangeMin: 0.95,
    rangeMax: 1.0001,
    ranking: 'Role Model',
    rankingRange: '90% – 100%',
    interp: 'Excepcional, muy raro. Rol modelo global.',
    external: 'En Korn Ferry y Aon este nivel se asocia con el top 5–10% del talento.',
    color: '#0B2C5C', // deep navy
    textOnColor: '#FFFFFF',
  },
  {
    id: 4,
    label: 'Excellent',
    rangeLabel: '90 – 94%',
    rangeMin: 0.90,
    rangeMax: 0.95,
    ranking: 'Role Model',
    rankingRange: '90% – 100%',
    interp: 'Excede expectativas de forma constante.',
    external: 'Similar a categorías "Exceeds" en PwC o Deloitte, que aplican a ~15–20%.',
    color: '#1F6FB0',
    textOnColor: '#FFFFFF',
  },
  {
    id: 3,
    label: 'Strong',
    rangeLabel: '75 – 89%',
    rangeMin: 0.75,
    rangeMax: 0.90,
    ranking: 'Regularly demonstrated',
    rankingRange: '75% – 89%',
    interp: 'Cumple con lo esperado y en ocasiones lo supera.',
    external: 'Equivalente a la mayoría en bell curve (60–70% en GM o Aon).',
    color: '#57A6CC',
    textOnColor: '#1C1B17',
  },
  {
    id: 2,
    label: 'Minimum / Improvement Needed',
    rangeLabel: '60 – 74%',
    rangeMin: 0.60,
    rangeMax: 0.75,
    ranking: 'Improvement Needed',
    rankingRange: '60% – 74%',
    interp: 'Por debajo de lo esperado. Necesita desarrollo.',
    external: 'Coincide con "Low performer" en bell curve (~10–15%).',
    color: '#B9DEEA',
    textOnColor: '#1C1B17',
  },
  {
    id: 1,
    label: 'Unsatisfactory',
    rangeLabel: '< 60%',
    rangeMin: 0,
    rangeMax: 0.60,
    ranking: '—',
    rankingRange: '< 60%',
    interp: 'No cumple con requisitos. Riesgo.',
    external: 'Asociado con el bottom 5–10% en sistemas de forced ranking.',
    color: '#B91C1C',
    textOnColor: '#FFFFFF',
  },
]

// Find the benchmark level that contains the given fraction [0, 1].
export function benchmarkLevelFor(fraction) {
  if (!Number.isFinite(fraction)) return null
  for (const lvl of BENCHMARK_LEVELS) {
    if (fraction >= lvl.rangeMin && fraction < lvl.rangeMax) return lvl
  }
  return BENCHMARK_LEVELS[BENCHMARK_LEVELS.length - 1]
}

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
  const cumpleLabel = String(row['Cumple?'] ?? '').trim()
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
    cumpleLabel,
    // "Sin dato": el indicador aplica pero aún no hay valor real; se excluye del
    // cálculo (no suma ni resta) y se muestra en gris.
    sinDato: cumpleLabel.toLowerCase() === 'sin dato',
    corte: String(row['Corte'] ?? '').trim(),
    anio: String(row['Año Esquema'] ?? '').trim(),
    fuente: String(row['Fuente'] ?? '').trim(),
    subgrupo: String(row['Subgrupo'] ?? '').trim(),
  }
}

// --- calculations --------------------------------------------------------

// Ceiling to nearest whole percent, e.g. 0.898 -> 0.90.
function ceilPct(n) {
  return Math.ceil(n * 100) / 100
}

// Relative achievement of one indicator: how close Real got to Meta as a
// fraction [0, 1] (capped), honoring the Dirección logic. Used to give partial
// credit instead of the absolute 0/0.5/1 compliance value.
//   "Arriba es bueno (>= Meta)" -> Real / Meta
//   "Arriba es malo (<= Meta)"  -> Meta / Real (lower Real is better)
//   "Es = Meta"                 -> 1 - |Real - Meta| / |Meta|
// Falls back to the precomputed Cumple # when Meta is not numeric, and treats a
// missing Real as 0 (pending / no actual yet).
export function achievementRatio(r) {
  const meta = parseEuroNumber(r.metaRaw)
  const real = parseEuroNumber(r.realRaw)
  if (!Number.isFinite(meta)) return r.cumple
  if (!Number.isFinite(real)) return 0
  const dir = r.direccion || ''
  if (dir.includes('<=')) {
    if (meta === 0) return real <= 0 ? 1 : 0
    if (real <= meta) return 1
    return real > 0 ? meta / real : 1
  }
  if (dir.startsWith('Es =')) {
    if (meta === 0) return real === 0 ? 1 : 0
    return Math.max(0, 1 - Math.abs(real - meta) / Math.abs(meta))
  }
  // default: "Arriba es bueno (>= Meta)"
  if (meta === 0) return real >= 0 ? 1 : 0
  return Math.min(1, real / meta)
}

// Score de un eje, o null si el eje no aplica para el área (sin filas con dato).
export function scoreEje(rowsOfEje, metrica) {
  const conDato = rowsOfEje.filter((r) => !r.sinDato)
  if (conDato.length === 0) return null
  // 360° is a simple average of the Real values (5 behavioral ratings),
  // then rounded up to the nearest whole percent per user request.
  if (metrica === '03. 360') {
    const reals = conDato
      .map((r) => parseEuroNumber(r.realRaw))
      .filter((n) => Number.isFinite(n))
    if (reals.length === 0) return null
    const avg = reals.reduce((s, n) => s + n, 0) / reals.length
    return ceilPct(avg)
  }
  // Indicadores: cumplimiento relativo (Real vs benchmark, tope 100%) por
  // indicador, ponderado por importancia. Los "sin dato" no suman ni restan.
  let num = 0
  let den = 0
  for (const r of conDato) {
    const w = Number(r.importancia) || 0
    num += achievementRatio(r) * w
    den += w
  }
  return den === 0 ? null : num / den
}

export function computeAreaBreakdown(rows, area) {
  const areaRows = rows.filter((r) => r.eje === area)
  const byMetrica = {}
  for (const key of EJE_ORDER) {
    byMetrica[key] = areaRows.filter((r) => r.metrica === key)
  }
  const scores = {}
  for (const key of EJE_ORDER) {
    scores[key] = scoreEje(byMetrica[key], key)
  }

  // 70% Indicadores + 30% 360°. Si un eje no aplica (p. ej. Talleres y TBX no
  // tienen 360°), el peso se renormaliza para que no castigue: el área se
  // califica solo con los ejes que sí tienen dato.
  let num = 0
  let den = 0
  for (const key of EJE_ORDER) {
    if (scores[key] === null) continue
    num += scores[key] * EJE_WEIGHTS[key]
    den += EJE_WEIGHTS[key]
  }
  const bruta = den === 0 ? 0 : num / den
  const finalScore = bruta * EBITDA_CAP

  const counts = { si: 0, parcial: 0, no: 0, sinDato: 0 }
  for (const r of areaRows) {
    if (r.sinDato) counts.sinDato += 1
    else if (r.cumple === 1) counts.si += 1
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

// Áreas que NO ponderan en la calificación grupal (existen y se evalúan, pero su
// subdirector no cuenta para el grupo ese año). TBX/Servicios salió del esquema
// 2025, así que ya no aplica; se deja el mecanismo por si vuelve a necesitarse.
export const EXCLUDED_FROM_GRUPAL = new Set()

export function ponderanGrupal(breakdowns) {
  return breakdowns.filter((b) => !EXCLUDED_FROM_GRUPAL.has(b.area))
}

export function computeGrupal(breakdowns) {
  const ponderan = ponderanGrupal(breakdowns)
  if (!ponderan.length) return { bruta: 0, final: 0 }
  const bruta = ponderan.reduce((s, b) => s + b.bruta, 0) / ponderan.length
  const final = ponderan.reduce((s, b) => s + b.final, 0) / ponderan.length
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
  // Los % vienen como fracción (0,95 = 95%). Valores hasta 3 se tratan como
  // fracción para cubrir sobrecumplimientos (1,8 = 180%); mayores ya son puntos.
  if (um === '%') return `${(n * (n <= 3 ? 100 : 1)).toLocaleString('es-MX', { maximumFractionDigits: 2 })}%`
  return n.toLocaleString('es-MX', { maximumFractionDigits: 2 })
}

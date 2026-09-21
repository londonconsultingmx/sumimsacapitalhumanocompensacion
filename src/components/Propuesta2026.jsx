import React, { useMemo, useState } from 'react'
import { usePropuesta2026 } from '../data/usePropuesta2026.js'

const EJES = [
  { id: '01. Vender más', label: 'Vender más', short: 'Vender' },
  { id: '02. Entregar mejor', label: 'Entregar mejor (On Time Delivery)', short: 'Entregar' },
  { id: '03. Resultados financieros', label: 'Resultados financieros', short: 'Finanzas' },
  { id: '04. Data correcta y actualizada', label: 'Data correcta y actualizada', short: 'Data' },
  { id: '05. Control interno y procesos', label: 'Control interno y procesos', short: 'Control' },
]

// Orden narrativo de Dirección: quien vende y entrega, quien abastece, quien
// cuida el dinero, quien cuida la data, quien cuida a la gente y el control.
const ORDEN_SUB = [
  'Objetivos compartidos',
  'Técnica · Operaciones',
  'Cadena de Suministros',
  'Finanzas',
  'TI',
  'Capital Humano & Legal',
  'Auditoría y Riesgo',
]

const SUBTITULO = {
  'Objetivos compartidos': 'Los tres que alinean a todas las subdirecciones con el negocio',
  'Técnica · Operaciones': 'Talleres · TBX · líneas de Proyectos y Servicios',
  'Cadena de Suministros': 'Abasto, inventarios y compras',
  'Finanzas': 'Convertir la venta en caja y cuidar el resultado',
  'TI': 'Sistemas, datos maestros y tableros',
  'Capital Humano & Legal': 'Gente certificada, nómina y cumplimiento laboral',
  'Auditoría y Riesgo': 'Control interno, cumplimiento y procesos',
}

const COLOR_SUB = {
  'Objetivos compartidos': '#24437A',
  'Técnica · Operaciones': '#8A3B3B',
  'Cadena de Suministros': '#A65A2E',
  'Finanzas': '#2E6E8E',
  'TI': '#3E7C6F',
  'Capital Humano & Legal': '#5B4A8A',
  'Auditoría y Riesgo': '#1F3A5F',
}

const ESTADO_STYLE = {
  'Existe en sistema': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Parcial': 'bg-amber-50 text-amber-800 border-amber-200',
  'Por construir': 'bg-rose-50 text-rose-800 border-rose-200',
}
const ORIGEN_STYLE = {
  'Catálogo 2026': 'bg-sky-50 text-sky-800 border-sky-200',
  'Propuesta Dirección': 'bg-slate-100 text-slate-600 border-slate-200',
}
const VS_STYLE = {
  'Se mantiene': 'text-slate-500',
  'Ajustado': 'text-amber-700',
  'Nuevo': 'text-teal-dark font-semibold',
}

function Chip({ text, styles }) {
  if (!text) return null
  const cls = styles[text] ?? 'bg-slate-100 text-slate-600 border-slate-200'
  return (
    <span className={`inline-block text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded-sm border whitespace-nowrap ${cls}`}>
      {text}
    </span>
  )
}

const TODAS = 'Todas'

export default function Propuesta2026() {
  const { loading, rows, error } = usePropuesta2026()
  const [vista, setVista] = useState('matriz')
  const [filtro, setFiltro] = useState(TODAS)

  const { subs, porSub, totales } = useMemo(() => {
    if (!rows) return { subs: [], porSub: {}, totales: {} }
    const presentes = ORDEN_SUB.filter((s) => rows.some((r) => r.subdireccion === s))
    const extra = [...new Set(rows.map((r) => r.subdireccion))].filter((s) => !presentes.includes(s))
    const subs = [...presentes, ...extra]
    const porSub = Object.fromEntries(subs.map((s) => [s, rows.filter((r) => r.subdireccion === s)]))
    const totales = {
      indicadores: rows.length,
      nuevos: rows.filter((r) => r.vs2025 === 'Nuevo').length,
      catalogo: rows.filter((r) => r.origen === 'Catálogo 2026').length,
      sistema: rows.filter((r) => r.estadoDato === 'Existe en sistema').length,
      construir: rows.filter((r) => r.estadoDato === 'Por construir').length,
    }
    return { subs, porSub, totales }
  }, [rows])

  if (loading) return <div className="py-20 text-center text-muted">Cargando propuesta…</div>
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-5">
        <div className="font-semibold mb-1">No se pudo cargar la propuesta 2026</div>
        <div className="text-sm">{String(error?.message ?? error)}</div>
      </div>
    )
  }

  const subsVisibles = subs.filter((s) => filtro === TODAS || s === filtro)

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-md shadow-card p-6">
        <div className="flex flex-wrap items-baseline gap-3">
          <h2 className="text-lg font-semibold text-ink">Propuesta · Indicadores de Subdirectores 2026</h2>
          <span className="text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-sm border bg-amber-50 text-amber-800 border-amber-200">
            Propuesta · no sustituye el esquema 2025
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-2 max-w-4xl">
          Indicadores específicos al contexto de SUMIMSA, organizados en los cinco ejes que pidió
          Dirección: <strong>vender más</strong>, <strong>entregar mejor</strong> (On Time Delivery),{' '}
          <strong>resultados financieros</strong>, <strong>data correcta y actualizada</strong>{' '}
          (maestros, transaccionales, tableros) y <strong>control interno y procesos</strong>.
          Cada eje se traduce al giro de cada subdirección: en Finanzas "vender más" es convertir la
          venta en caja; en Auditoría es que la empresa pueda licitar sin trabas.
        </p>
        <p className="text-sm text-slate-500 mt-2 max-w-4xl">
          Es <strong>aditiva</strong>: conserva todo el Catálogo 2026 vigente, clasificado en el eje
          que le corresponde, y le suma lo que pidió Dirección. En Cadena de Suministros se refuerza
          la <strong>gestión de proveedores</strong>: scorecard, penalizaciones cobradas, precio igual
          a la orden, proveedor alterno y anticipos amortizados.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
          <Stat label="Indicadores" value={totales.indicadores} />
          <Stat label="Del catálogo 2026" value={totales.catalogo} tone="text-sky-800" />
          <Stat label="Nuevos vs. 2025" value={totales.nuevos} />
          <Stat label="Ya salen de sistema" value={totales.sistema} tone="text-emerald-700" />
          <Stat label="Por construir el dato" value={totales.construir} tone="text-rose-700" />
        </div>
      </div>

      <div className="bg-white rounded-md shadow-card p-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-sm border border-slate-300 overflow-hidden">
          {[
            ['matriz', 'Matriz 5 ejes'],
            ['detalle', 'Detalle por subdirección'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setVista(id)}
              className={`px-3 py-1.5 text-sm font-medium transition ${
                vista === id ? 'bg-ink text-white' : 'bg-white text-slate-600 hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {vista === 'detalle' && (
          <>
            <label htmlFor="prop-sub" className="text-sm font-semibold text-slate-600 ml-2">
              Subdirección:
            </label>
            <select
              id="prop-sub"
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="border border-slate-300 rounded-sm px-3 py-1.5 text-sm font-medium focus:border-teal focus:outline-none"
            >
              <option value={TODAS}>Todas</option>
              {subs.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </>
        )}
        <div className="ml-auto flex flex-wrap gap-2 text-xs text-muted items-center">
          <span>Origen:</span>
          {Object.keys(ORIGEN_STYLE).map((k) => <Chip key={k} text={k} styles={ORIGEN_STYLE} />)}
          <span className="ml-2">Dato:</span>
          {Object.keys(ESTADO_STYLE).map((k) => <Chip key={k} text={k} styles={ESTADO_STYLE} />)}
        </div>
      </div>

      {vista === 'matriz' ? (
        <Matriz subs={subs} porSub={porSub} />
      ) : (
        subsVisibles.map((s) => <Detalle key={s} sub={s} rows={porSub[s]} />)
      )}

      <p className="text-xs text-muted max-w-4xl">
        Base 2025 tomada de los reales del cierre y del catálogo corporativo 2026. Las metas son
        propuesta para calibrar con cada subdirector antes de amarrarlas a compensación; los pesos
        por eje se definen una vez aprobada la batería.
      </p>
    </section>
  )
}

function Stat({ label, value, tone = 'text-ink' }) {
  return (
    <div className="border border-slate-200 rounded-sm px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`text-2xl font-bold tabular-nums ${tone}`}>{value}</div>
    </div>
  )
}

function Matriz({ subs, porSub }) {
  return (
    <div className="bg-white rounded-md shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-left text-slate-500">
              <th className="py-2 px-3 w-40 align-bottom">Eje</th>
              {subs.map((s) => (
                <th key={s} className="py-2 px-3 align-bottom min-w-[11rem]">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full" style={{ background: COLOR_SUB[s] ?? '#24437A' }} />
                    <span className="font-semibold text-ink">{s}</span>
                  </div>
                  <div className="font-normal text-[10px] text-slate-400 mt-0.5">{porSub[s].length} indicadores</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EJES.map((e) => (
              <tr key={e.id} className="border-b border-slate-100 last:border-0 align-top">
                <td className="py-3 px-3 font-semibold text-ink">
                  {e.label}
                </td>
                {subs.map((s) => {
                  const celda = porSub[s].filter((r) => r.eje === e.id)
                  return (
                    <td key={s} className="py-3 px-3">
                      {celda.length === 0 ? (
                        <span className="text-slate-300">—</span>
                      ) : (
                        <ul className="flex flex-col gap-1.5">
                          {celda.map((r, i) => (
                            <li key={i} className="leading-snug">
                              {r.origen === 'Catálogo 2026' && (
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-500 mr-1.5 align-middle" title="Catálogo 2026" />
                              )}
                              <span className="text-slate-800">{r.indicador}</span>
                              <span className="text-teal-dark font-semibold whitespace-nowrap"> · {r.meta}</span>
                              {r.vs2025 === 'Nuevo' && (
                                <span className="text-[9px] uppercase tracking-wide text-teal-dark ml-1">nuevo</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Detalle({ sub, rows }) {
  const color = COLOR_SUB[sub] ?? '#24437A'
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-3 border-l-4 pl-3" style={{ borderColor: color }}>
        <h3 className="text-base font-bold text-ink">{sub}</h3>
        <span className="text-xs text-muted">{SUBTITULO[sub]}</span>
        <span className="text-xs text-muted ml-auto">{rows.length} indicadores</span>
      </div>
      {EJES.map((e) => {
        const del = rows.filter((r) => r.eje === e.id)
        if (!del.length) return null
        return (
          <div key={e.id} className="bg-white rounded-md shadow-card overflow-hidden">
            <div className="px-5 py-2.5 border-b border-slate-200 bg-slate-50/60 flex items-baseline gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{e.label}</span>
              <span className="text-[11px] text-slate-400">· {del.length}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200 text-xs">
                    <th className="py-2 px-4 w-[22%]">Indicador</th>
                    <th className="py-2 px-3 w-[26%]">Fórmula</th>
                    <th className="py-2 px-3">Meta 2026</th>
                    <th className="py-2 px-3">Base 2025</th>
                    <th className="py-2 px-3">Fuente · frecuencia</th>
                    <th className="py-2 px-3">Origen</th>
                    <th className="py-2 px-3">Dato</th>
                    <th className="py-2 px-3">vs. 2025</th>
                  </tr>
                </thead>
                <tbody>
                  {del.map((r, i) => (
                    <tr key={i} className={`border-b border-slate-100 last:border-0 align-top ${r.compartido ? 'bg-slate-50/70' : ''}`}>
                      <td className="py-2.5 px-4">
                        <div className="font-medium text-ink">{r.indicador}</div>
                        {r.nota && <div className="text-xs text-slate-500 mt-1 leading-relaxed">{r.nota}</div>}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-slate-500 leading-relaxed">{r.formula}</td>
                      <td className="py-2.5 px-3 font-semibold text-teal-dark whitespace-nowrap">{r.meta}</td>
                      <td className="py-2.5 px-3 text-xs text-slate-600">{r.base}</td>
                      <td className="py-2.5 px-3 text-xs text-slate-500">
                        {r.fuente}
                        <div className="text-slate-400">{r.frecuencia}</div>
                      </td>
                      <td className="py-2.5 px-3"><Chip text={r.origen} styles={ORIGEN_STYLE} /></td>
                      <td className="py-2.5 px-3"><Chip text={r.estadoDato} styles={ESTADO_STYLE} /></td>
                      <td className={`py-2.5 px-3 text-xs whitespace-nowrap ${VS_STYLE[r.vs2025] ?? ''}`}>{r.vs2025}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}

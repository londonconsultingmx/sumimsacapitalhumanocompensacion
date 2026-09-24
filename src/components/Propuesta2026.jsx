import React, { useEffect, useMemo, useState } from 'react'
import { usePropuesta2026 } from '../data/usePropuesta2026.js'

// Propuesta de indicadores de subdirectores 2026. Documento de lectura: una
// tabla por subdirección, agrupada por eje, con clave para citar cada
// indicador en junta. Sin gráficas.

const EJES = [
  { id: '01. Vender más', label: 'Vender más' },
  { id: '02. Entregar mejor', label: 'Entregar mejor · On Time Delivery' },
  { id: '03. Resultados financieros', label: 'Resultados financieros' },
  { id: '04. Data correcta y actualizada', label: 'Data correcta y actualizada' },
  { id: '05. Control interno y procesos', label: 'Control interno y procesos' },
]

const ORDEN_SUB = [
  'Objetivos compartidos',
  'TBX',
  'Líneas de Servicio',
  'Cadena de Suministros',
  'Finanzas',
  'TI',
  'Capital Humano & Legal',
  'Auditoría y Riesgo',
]

const ALCANCE = {
  'Objetivos compartidos': 'Aplican a todas las áreas por igual.',
  'TBX': 'Renta de contenedores, consumibles y contratos con gobierno y Pemex.',
  'Líneas de Servicio': 'Bombas de Lodo, Preventores, Top Drive, Cabezales, Equipos de Control de Sólidos, Katch Kan y Monoboyas, con los talleres que las sostienen. SUMIMSA vende el equipo y después le suministra refacciones y servicio; no es renta como en TBX.',
  'Cadena de Suministros': 'Abasto, inventarios, compras y proveedores.',
  'Finanzas': 'Contabilidad, tesorería, control de obra y análisis.',
  'TI': 'Sistemas, datos maestros y tableros.',
  'Capital Humano & Legal': 'Personal, nómina, capacitación y legal.',
  'Auditoría y Riesgo': 'Auditoría interna, cumplimiento, control y procesos.',
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

// Selección de indicadores de Director: máximo 6 por subdirección. Se puede
// pasar de 6, pero la marca cambia de azul a amarillo. La selección vive en el
// navegador de quien la hace; el botón "Copiar selección" la exporta para
// fijarla en el archivo (columna Director) y que la vea todo el mundo.
const MAX_DIRECTOR = 6
const LS_KEY = 'propuesta2026.director'
const AZUL = '#1D4ED8'
const AMARILLO = '#EAB308'

function leerSeleccion() {
  try {
    const raw = window.localStorage.getItem(LS_KEY)
    if (!raw) return null
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? new Set(arr) : null
  } catch {
    return null
  }
}
function guardarSeleccion(set) {
  try { window.localStorage.setItem(LS_KEY, JSON.stringify([...set])) } catch { /* sin almacenamiento */ }
}

export default function Propuesta2026() {
  const { loading, rows, error } = usePropuesta2026()
  const [filtro, setFiltro] = useState('Todas')
  const [director, setDirector] = useState(() => leerSeleccion() ?? new Set())
  const [inicializado, setInicializado] = useState(() => leerSeleccion() !== null)
  const [aviso, setAviso] = useState('')
  // Si no hay selección guardada en este navegador, se toma la del archivo.
  useEffect(() => {
    if (inicializado || !rows) return
    setDirector(new Set(rows.filter((r) => r.director).map((r) => r.clave)))
    setInicializado(true)
  }, [rows, inicializado])
  const toggleDirector = (clave) => {
    setDirector((prev) => {
      const next = new Set(prev)
      if (next.has(clave)) next.delete(clave)
      else next.add(clave)
      guardarSeleccion(next)
      return next
    })
  }
  const copiarSeleccion = async () => {
    const texto = [...director].sort().join(', ')
    try {
      await navigator.clipboard.writeText(texto)
      setAviso(`Copiado: ${director.size} claves.`)
    } catch {
      setAviso(texto || 'Sin selección.')
    }
    setTimeout(() => setAviso(''), 4000)
  }
  const restablecer = () => {
    const base = new Set((rows ?? []).filter((r) => r.director).map((r) => r.clave))
    setDirector(base)
    guardarSeleccion(base)
  }
  // Las ligas del índice no pueden ser anclas (#id): el router del portal lee
  // el hash y mandaría a la portada. Se navega con scroll tras el render.
  const [irA, setIrA] = useState(null)
  useEffect(() => {
    if (!irA) return
    const el = document.getElementById(irA)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIrA(null)
  }, [irA, filtro])
  const irASub = (sub) => {
    setFiltro('Todas')
    setIrA(`prop-${slug(sub)}`)
  }

  const { subs, porSub, totales } = useMemo(() => {
    if (!rows) return { subs: [], porSub: {}, totales: {} }
    const presentes = ORDEN_SUB.filter((s) => rows.some((r) => r.subdireccion === s))
    const extra = [...new Set(rows.map((r) => r.subdireccion))].filter((s) => !presentes.includes(s))
    const subs = [...presentes, ...extra]
    const porSub = Object.fromEntries(subs.map((s) => [s, rows.filter((r) => r.subdireccion === s)]))
    const totales = {
      total: rows.length,
      catalogo: rows.filter((r) => r.origen === 'Catálogo 2026').length,
      nuevos: rows.filter((r) => r.origen !== 'Catálogo 2026').length,
    }
    return { subs, porSub, totales }
  }, [rows])

  if (loading) return <div className="py-20 text-center text-muted">Cargando propuesta…</div>
  if (error) {
    return (
      <div className="bg-white shadow-card rounded-md p-5 text-sm text-status-bad">
        No se pudo cargar la propuesta 2026: {String(error?.message ?? error)}
      </div>
    )
  }

  const visibles = subs.filter((s) => filtro === 'Todas' || s === filtro)

  return (
    <section className="flex flex-col gap-6">
      {/* Encabezado e instrucciones de lectura */}
      <div className="bg-white rounded-md shadow-card">
        <div className="px-6 pt-5 pb-4 border-b border-rule">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted">Propuesta para revisión de Dirección</div>
          <h2 className="text-xl font-semibold text-ink mt-1">Indicadores de Subdirectores 2026</h2>
          <p className="text-sm text-muted mt-2 max-w-3xl">
            Batería propuesta para el ejercicio 2026, organizada en los cinco ejes que fijó Dirección.
            Conserva el Catálogo 2026 vigente completo y le suma lo que se pidió. No sustituye el
            esquema 2025 ni entra todavía al cálculo de compensación.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-x-10 gap-y-4 px-6 py-5">
          <div>
            <h3 className="text-sm font-semibold text-ink">Cómo leer esta propuesta</h3>
            <ol className="mt-2 text-sm text-ink space-y-2 list-decimal pl-5 max-w-3xl">
              <li>
                <span className="font-medium">Empieza por los tres objetivos compartidos.</span> Aplican
                a todas las subdirecciones y son los que alinean con el negocio: EBITDA, entrega y
                calidad de datos.
              </li>
              <li>
                <span className="font-medium">Cada subdirección tiene su propia tabla</span>, dividida
                en los cinco ejes. El eje se traduce al giro del área: en Finanzas "vender más" es
                convertir la venta en caja; en Auditoría es que la empresa pueda licitar sin trabas.
              </li>
              <li>
                <span className="font-medium">Cada indicador tiene una clave</span> (por ejemplo C-22)
                para citarlo en la revisión. La columna <em>Ejemplo</em> muestra con números cómo se
                calcula y cuándo cumple o no.
              </li>
              <li>
                <span className="font-medium">La columna "Bueno si"</span> dice hacia dónde debe moverse el
                indicador: ↑ debe subir, ↓ debe bajar, ↔ debe mantenerse en rango. Evita leer al revés
                un indicador como NPT o cartera vencida.
              </li>
              <li>
                <span className="font-medium">La columna "Figura de mérito"</span> dice qué cualidad del
                negocio mueve cada indicador: rendimiento (dinero), crecimiento, liquidez, productividad,
                eficiencia, calidad, oportunidad (tiempo), cumplimiento o seguridad. Sirve para ver si
                una subdirección está cargada hacia un solo tipo de resultado.
              </li>
              <li>
                <span className="font-medium">La columna Director</span> marca los indicadores que
                sube a nivel Director cada subdirección: haz clic en el círculo para seleccionar o
                quitar. El máximo es {MAX_DIRECTOR} por subdirección; se puede pasar, pero la marca cambia
                de azul a amarillo. La selección se guarda en tu navegador; con "Copiar selección" me
                la mandas y la fijo en el archivo para que la vea todo el mundo.
              </li>
              <li>
                <span className="font-medium">Las metas son propuesta.</span> Se calibran con cada
                subdirector antes de amarrarlas a bono; los pesos por eje se definen al aprobar la
                batería.
              </li>
            </ol>
          </div>

          <div className="text-sm min-w-[16rem]">
            <h3 className="text-sm font-semibold text-ink">Contenido</h3>
            <table className="mt-2 w-full">
              <tbody>
                {subs.map((s) => (
                  <tr key={s} className="border-b border-rule last:border-0">
                    <td className="py-1.5 pr-4">
                      <a
                        href={`#/dashboard`}
                        onClick={(ev) => { ev.preventDefault(); irASub(s) }}
                        className="text-blue hover:underline"
                      >
                        {s}
                      </a>
                    </td>
                    <td className="py-1.5 text-right tabular-nums text-muted">{porSub[s].length}</td>
                  </tr>
                ))}
                <tr className="border-t border-rule font-semibold text-ink">
                  <td className="py-1.5 pr-4">Total</td>
                  <td className="py-1.5 text-right tabular-nums">{totales.total}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 text-xs text-muted leading-relaxed">
              {totales.catalogo} del Catálogo 2026 · {totales.nuevos} propuestos por Dirección.
            </div>
          </div>
        </div>
      </div>

      {/* Filtro */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label htmlFor="prop-sub" className="font-medium text-ink">Ver:</label>
        <select
          id="prop-sub"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-rule rounded-sm px-3 py-1.5 text-sm bg-white focus:border-blue focus:outline-none"
        >
          <option value="Todas">Todas las subdirecciones</option>
          {subs.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="ml-auto text-xs text-muted tabular-nums">
          <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1.5" style={{ background: AZUL }} />
          {director.size} de Director seleccionados
        </span>
        <button
          type="button"
          onClick={copiarSeleccion}
          className="text-xs font-medium text-blue border border-rule rounded-sm px-2.5 py-1 bg-white hover:border-blue"
        >
          Copiar selección
        </button>
        <button
          type="button"
          onClick={restablecer}
          className="text-xs text-muted border border-rule rounded-sm px-2.5 py-1 bg-white hover:text-ink"
        >
          Restablecer
        </button>
        {aviso && <span className="text-xs text-muted">{aviso}</span>}
      </div>

      {visibles.map((s) => (
        <TablaSub key={s} sub={s} rows={porSub[s]} director={director} onToggle={toggleDirector} />
      ))}

      <p className="text-xs text-muted max-w-3xl">
        Base 2025 tomada de los reales del cierre y del catálogo corporativo 2026. Los ejemplos usan
        cifras ilustrativas con el orden de magnitud real de SUMIMSA.
      </p>
    </section>
  )
}

function TablaSub({ sub, rows, director, onToggle }) {
  const nDir = rows.filter((r) => director.has(r.clave)).length
  const excedido = nDir > MAX_DIRECTOR
  const color = excedido ? AMARILLO : AZUL
  return (
    <div id={`prop-${slug(sub)}`} className="bg-white rounded-md shadow-card overflow-hidden scroll-mt-4">
      <div className="px-5 py-4 border-b border-rule">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-semibold text-ink">{sub}</h3>
          <span className="text-xs text-muted tabular-nums whitespace-nowrap">
            <span className="inline-block w-2.5 h-2.5 rounded-full align-middle mr-1.5" style={{ background: color }} />
            <span className={excedido ? 'text-amber-600 font-semibold' : ''}>Director {nDir} de {MAX_DIRECTOR}</span>
            {excedido && <span className="text-amber-600"> · excede el máximo</span>}
            <span className="mx-2">·</span>{rows.length} indicadores
          </span>
        </div>
        <div className="text-xs text-muted mt-0.5 max-w-3xl">{ALCANCE[sub]}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-rule text-xs">
              <th className="py-2 pl-5 pr-2 font-medium w-[4%]">Clave</th>
              <th className="py-2 px-1 font-medium w-[4%] text-center">Director</th>
              <th className="py-2 px-2 font-medium w-[18%]">Indicador</th>
              <th className="py-2 px-2 font-medium w-[15%]">Fórmula</th>
              <th className="py-2 px-2 font-medium w-[8%]">Meta 2026</th>
              <th className="py-2 px-2 font-medium w-[5%] text-center">Bueno si</th>
              <th className="py-2 px-2 font-medium w-[9%]">Figura de mérito</th>
              <th className="py-2 px-2 font-medium w-[7%]">Base 2025</th>
              <th className="py-2 px-2 pr-5 font-medium w-[30%]">Ejemplo</th>
            </tr>
          </thead>
          <tbody>
            {EJES.map((e) => {
              const del = rows.filter((r) => r.eje === e.id)
              if (!del.length) return null
              return (
                <React.Fragment key={e.id}>
                  <tr className="bg-paper border-b border-rule">
                    <td colSpan={9} className="py-1.5 pl-5 text-[11px] uppercase tracking-wider text-muted font-semibold">
                      {e.label} · {del.length}
                    </td>
                  </tr>
                  {del.map((r) => (
                    <tr key={r.clave} className="border-b border-rule last:border-0 align-top">
                      <td className="py-2.5 pl-5 pr-2 font-mono text-xs text-muted">{r.clave}</td>
                      <td className="py-2 px-1 text-center">
                        <button
                          type="button"
                          onClick={() => onToggle(r.clave)}
                          aria-pressed={director.has(r.clave)}
                          title={director.has(r.clave) ? 'Quitar de Director' : 'Marcar como indicador de Director'}
                          className="inline-block w-4 h-4 rounded-full border-2 align-middle transition"
                          style={
                            director.has(r.clave)
                              ? { background: color, borderColor: color }
                              : { background: 'transparent', borderColor: '#C7CCD6' }
                          }
                        />
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="font-medium text-ink">{r.indicador}</div>
                        {r.nota && <div className="text-xs text-muted mt-1 leading-relaxed">{r.nota}</div>}
                      </td>
                      <td className="py-2.5 px-2 text-xs text-muted leading-relaxed">{r.formula}</td>
                      <td className="py-2.5 px-2 text-ink font-medium">{r.meta}</td>
                      <td className="py-2.5 px-2 text-center text-ink text-base leading-none" title={r.buenoSi === '↑' ? 'Debe subir' : r.buenoSi === '↓' ? 'Debe bajar' : 'Debe mantenerse en rango'}>
                        {r.buenoSi}
                      </td>
                      <td className="py-2.5 px-2 text-xs text-ink">{r.figura}</td>
                      <td className="py-2.5 px-2 text-xs text-muted">{r.base}</td>
                      <td className="py-2.5 px-2 pr-5 text-xs text-ink leading-relaxed">{r.ejemplo}</td>
                    </tr>
                  ))}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

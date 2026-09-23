import React, { useEffect, useMemo, useState } from 'react'
import { usePropuestaEtapas } from '../data/usePropuestaEtapas.js'

// Propuesta 2026 leída por etapa del proceso demanda → cierre financiero
// (mapa Géminis 01). Misma batería y mismas claves que la pestaña
// Propuesta 2026, más los indicadores que salen del mapa. Hoja aparte para
// no tocar la propuesta vigente.

const ETAPAS = [
  { id: '01. Demanda y requisición', dueno: 'TBX · Líneas de Servicio (Cadena en stock)', decide: 'Comercial decide si el pedido nace; Operaciones decide si requisita o surte de stock.', firme: 'Pedido completo sin duplicado · requisición aprobada antes de comprar' },
  { id: '02. Proveedores', dueno: 'Cadena de Suministros', decide: 'Compras decide proveedor y costo.', firme: 'Costo vigente y único por artículo y proveedor' },
  { id: '03. Abasto', dueno: 'Cadena de Suministros · Finanzas paga', decide: 'Compras decide si la orden vive o va al embudo; Finanzas decide pagar o detener.', firme: 'Orden de compra con dueño y fecha comprometida' },
  { id: '04. Almacén', dueno: 'Cadena de Suministros (Inventarios)', decide: 'Almacén decide recibir, ubicar y liberar.', firme: 'Físico = sistema · recepción contra orden de compra' },
  { id: '05. Entrega', dueno: 'Cadena (Logística) · Líneas de Servicio · TBX', decide: 'Logística decide parcial o completo; la línea ejecuta el servicio.', firme: 'Remisión contra pedido de venta' },
  { id: '06. Cobro', dueno: 'Finanzas', decide: 'Finanzas decide facturar o detener por descuadre.', firme: 'Orden del cliente = recepción = factura' },
  { id: '07. Cierre financiero', dueno: 'Finanzas', decide: 'Finanzas cierra el mes con números firmes.', firme: 'Conciliado, publicado y declarado en fecha' },
  { id: 'Transversal', dueno: 'TI · Auditoría y Riesgo · Capital Humano & Legal', decide: 'Sistemas, documentos y políticas, y la gente que ejecuta cada etapa.', firme: 'Maestros con dueño nombrado · documentos vigentes' },
]

const ORDEN_SUB = [
  'Objetivos compartidos', 'TBX', 'Líneas de Servicio', 'Cadena de Suministros',
  'Finanzas', 'TI', 'Capital Humano & Legal', 'Auditoría y Riesgo',
]

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export default function PropuestaEtapas() {
  const { loading, rows, error } = usePropuestaEtapas()
  const [filtro, setFiltro] = useState('Todas')
  const [irA, setIrA] = useState(null)
  useEffect(() => {
    if (!irA) return
    const el = document.getElementById(irA)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIrA(null)
  }, [irA, filtro])

  const { subs, porEtapa, totales } = useMemo(() => {
    if (!rows) return { subs: [], porEtapa: {}, totales: {} }
    const subs = ORDEN_SUB.filter((s) => rows.some((r) => r.subdireccion === s))
    const porEtapa = Object.fromEntries(ETAPAS.map((e) => [e.id, rows.filter((r) => r.etapa === e.id)]))
    const totales = { total: rows.length, mapa: rows.filter((r) => r.origen === 'Mapa Géminis').length }
    return { subs, porEtapa, totales }
  }, [rows])

  if (loading) return <div className="py-20 text-center text-muted">Cargando propuesta por etapa…</div>
  if (error) {
    return (
      <div className="bg-white shadow-card rounded-md p-5 text-sm text-status-bad">
        No se pudo cargar la propuesta por etapa: {String(error?.message ?? error)}
      </div>
    )
  }

  const visibles = ETAPAS.filter((e) => filtro === 'Todas' || e.id === filtro)

  return (
    <section className="flex flex-col gap-6">
      <div className="bg-white rounded-md shadow-card">
        <div className="px-6 pt-5 pb-4 border-b border-rule">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted">Propuesta para revisión de Dirección · lectura alterna</div>
          <h2 className="text-xl font-semibold text-ink mt-1">Indicadores de Subdirectores 2026 · por etapa del proceso</h2>
          <p className="text-sm text-muted mt-2 max-w-3xl">
            La misma batería de la pestaña Propuesta 2026, con las mismas claves, ordenada por la
            etapa del flujo demanda → cierre financiero del mapa Géminis 01. Suma los indicadores
            que salen del mapa: el dato que debe estar firme en cada etapa y las cuatro rutas de
            surtido. La pestaña Propuesta 2026 no cambia.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_auto] gap-x-10 gap-y-4 px-6 py-5">
          <div>
            <h3 className="text-sm font-semibold text-ink">Cómo leer esta hoja</h3>
            <ol className="mt-2 text-sm text-ink space-y-2 list-decimal pl-5 max-w-3xl">
              <li>
                <span className="font-medium">El proceso tiene siete etapas y una capa transversal.</span> Demanda y
                requisición van juntas porque en la práctica son el mismo momento. Cierre financiero
                es la séptima: el proceso no termina cuando se cobra, termina cuando el mes queda firme.
              </li>
              <li>
                <span className="font-medium">Cada etapa tiene dueño, decisión y dato firme.</span> El dueño responde
                por los indicadores de la etapa; el dato firme es lo que debe estar en sistema para que la
                siguiente etapa pueda trabajar.
              </li>
              <li>
                <span className="font-medium">Finanzas aparece en tres etapas.</span> Paga o detiene en Abasto, factura
                o detiene en Cobro, y cierra el mes en Cierre financiero.
              </li>
              <li>
                <span className="font-medium">La matriz muestra qué etapa tiene indicador de quién</span> y qué celdas
                están vacías. Una celda vacía no siempre es un hueco: TI no tiene indicadores en Cobro
                porque no decide ahí.
              </li>
              <li>
                <span className="font-medium">Los indicadores con origen "Mapa Géminis" son nuevos</span> respecto a la
                pestaña Propuesta 2026. Todos los demás conservan su clave y su ejemplo.
              </li>
            </ol>
          </div>

          <div className="text-sm min-w-[17rem]">
            <h3 className="text-sm font-semibold text-ink">Etapas</h3>
            <table className="mt-2 w-full">
              <tbody>
                {ETAPAS.map((e) => (
                  <tr key={e.id} className="border-b border-rule last:border-0">
                    <td className="py-1.5 pr-4">
                      <a
                        href="#/dashboard"
                        onClick={(ev) => { ev.preventDefault(); setFiltro('Todas'); setIrA(`etapa-${slug(e.id)}`) }}
                        className="text-blue hover:underline"
                      >
                        {e.id}
                      </a>
                    </td>
                    <td className="py-1.5 text-right tabular-nums text-muted">{porEtapa[e.id].length}</td>
                  </tr>
                ))}
                <tr className="border-t border-rule font-semibold text-ink">
                  <td className="py-1.5 pr-4">Total</td>
                  <td className="py-1.5 text-right tabular-nums">{totales.total}</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-3 text-xs text-muted">{totales.mapa} indicadores nuevos que salen del mapa.</div>
          </div>
        </div>
      </div>

      {/* Matriz etapa × subdirección */}
      <div className="bg-white rounded-md shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-rule">
          <h3 className="text-base font-semibold text-ink">Quién tiene indicador en cada etapa</h3>
          <div className="text-xs text-muted mt-0.5">Clave y nombre corto. Las celdas vacías se muestran vacías.</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] table-fixed text-xs">
            <thead>
              <tr className="text-left text-muted border-b border-rule">
                <th className="py-2 pl-5 pr-2 font-medium w-[11%]">Etapa</th>
                {subs.map((s) => (
                  <th key={s} className="py-2 px-2 font-medium">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ETAPAS.map((e) => (
                <tr key={e.id} className="border-b border-rule last:border-0 align-top">
                  <td className="py-2.5 pl-5 pr-2">
                    <div className="font-semibold text-ink">{e.id}</div>
                    <div className="text-muted mt-0.5">{e.dueno}</div>
                  </td>
                  {subs.map((s) => {
                    const celda = porEtapa[e.id].filter((r) => r.subdireccion === s)
                    return (
                      <td key={s} className="py-2.5 px-2 leading-snug">
                        {celda.length === 0 ? (
                          <span className="text-rule">—</span>
                        ) : (
                          <ul className="space-y-1">
                            {celda.map((r) => (
                              <li key={r.clave}>
                                <span className="font-mono text-muted">{r.clave}</span>{' '}
                                <span className="text-ink">{r.indicador}</span>
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

      <div className="flex flex-wrap items-center gap-3 text-sm">
        <label htmlFor="etapa-sel" className="font-medium text-ink">Ver:</label>
        <select
          id="etapa-sel"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-rule rounded-sm px-3 py-1.5 text-sm bg-white focus:border-blue focus:outline-none"
        >
          <option value="Todas">Todas las etapas</option>
          {ETAPAS.map((e) => <option key={e.id} value={e.id}>{e.id}</option>)}
        </select>
      </div>

      {visibles.map((e) => <TablaEtapa key={e.id} etapa={e} rows={porEtapa[e.id]} subs={subs} />)}

      <p className="text-xs text-muted max-w-3xl">
        Etapas, dueños, decisiones y datos firmes tomados del mapa Géminis 01 "El mapa por etapa".
        Los ejemplos usan cifras ilustrativas con el orden de magnitud real de SUMIMSA.
      </p>
    </section>
  )
}

function TablaEtapa({ etapa, rows, subs }) {
  return (
    <div id={`etapa-${slug(etapa.id)}`} className="bg-white rounded-md shadow-card overflow-hidden scroll-mt-4">
      <div className="px-5 py-4 border-b border-rule">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="text-base font-semibold text-ink">{etapa.id}</h3>
          <span className="text-xs text-muted tabular-nums whitespace-nowrap">{rows.length} indicadores</span>
        </div>
        <dl className="mt-1.5 grid sm:grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-xs max-w-4xl">
          <dt className="text-muted">Dueño</dt><dd className="text-ink">{etapa.dueno}</dd>
          <dt className="text-muted">Decisión</dt><dd className="text-ink">{etapa.decide}</dd>
          <dt className="text-muted">Dato firme</dt><dd className="text-ink">{etapa.firme}</dd>
        </dl>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] table-fixed text-sm">
          <thead>
            <tr className="text-left text-muted border-b border-rule text-xs">
              <th className="py-2 pl-5 pr-2 font-medium w-[4%]">Clave</th>
              <th className="py-2 px-2 font-medium w-[10%]">Subdirección</th>
              <th className="py-2 px-2 font-medium w-[18%]">Indicador</th>
              <th className="py-2 px-2 font-medium w-[18%]">Fórmula</th>
              <th className="py-2 px-2 font-medium w-[8%]">Meta 2026</th>
              <th className="py-2 px-2 font-medium w-[30%]">Ejemplo</th>
              <th className="py-2 px-2 pr-5 font-medium w-[7%]">Origen</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s) => {
              const del = rows.filter((r) => r.subdireccion === s)
              if (!del.length) return null
              return (
                <React.Fragment key={s}>
                  {del.map((r) => (
                    <tr key={r.clave} className="border-b border-rule last:border-0 align-top">
                      <td className="py-2.5 pl-5 pr-2 font-mono text-xs text-muted">{r.clave}</td>
                      <td className="py-2.5 px-2 text-xs text-muted">{r.subdireccion}</td>
                      <td className="py-2.5 px-2">
                        <div className="font-medium text-ink">{r.indicador}</div>
                        {r.nota && <div className="text-xs text-muted mt-1 leading-relaxed">{r.nota}</div>}
                      </td>
                      <td className="py-2.5 px-2 text-xs text-muted leading-relaxed">{r.formula}</td>
                      <td className="py-2.5 px-2 text-ink font-medium">{r.meta}</td>
                      <td className="py-2.5 px-2 text-xs text-ink leading-relaxed">{r.ejemplo}</td>
                      <td className="py-2.5 px-2 pr-5 text-xs text-muted">
                        {r.origen === 'Mapa Géminis' ? 'Mapa Géminis' : r.origen === 'Catálogo 2026' ? 'Catálogo 2026' : 'Dirección'}
                      </td>
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

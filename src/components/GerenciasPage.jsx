import React, { useMemo, useState } from 'react'
import { useGerencias } from '../data/useGerencias.js'

// Orden de presentación: las subdirecciones del esquema de compensación primero,
// luego las áreas que no participan en él.
const ORDEN_SUB = [
  'Subdirección de Auditoría y Riesgo',
  'Subdirección de Cadena de Suministros',
  'Subdirección de Capital Humano & Legal',
  'Subdirección de Finanzas',
  'Subdirección de Proyectos',
  'Subdirección de TI',
  'Servicios',
  'Dirección General',
]

const COLOR_SUB = {
  'Subdirección de Auditoría y Riesgo': '#1F3A5F',
  'Subdirección de Cadena de Suministros': '#A65A2E',
  'Subdirección de Capital Humano & Legal': '#5B4A8A',
  'Subdirección de Finanzas': '#2E6E8E',
  'Subdirección de Proyectos': '#8A6D2F',
  'Subdirección de TI': '#3E7C6F',
  'Servicios': '#8A3B3B',
  'Dirección General': '#4B5563',
}

const TODAS = 'Todas'

// Perfil de la gerencia: define el peso de la batería. En Servicios y Proyectos
// los gerentes son sobre todo comerciales — dueños del P&L de su línea — y
// además responden por que la operación del cliente quede atendida con
// refaccionamiento y servicio.
const PERFIL_STYLE = {
  'Comercial · P&L de línea': 'bg-amber-50 text-amber-800 border-amber-200',
  'Operación': 'bg-sky-50 text-sky-800 border-sky-200',
  'Staff corporativo': 'bg-slate-100 text-slate-600 border-slate-200',
}

function PerfilChip({ perfil }) {
  if (!perfil) return null
  const cls = PERFIL_STYLE[perfil] ?? PERFIL_STYLE['Staff corporativo']
  return (
    <span className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-0.5 rounded-sm border ${cls}`}>
      {perfil}
    </span>
  )
}

export default function GerenciasPage() {
  const { loading, rows, error } = useGerencias()
  const [filtro, setFiltro] = useState(TODAS)

  const { grupos, subdirecciones, totalGerencias } = useMemo(() => {
    if (!rows) return { grupos: [], subdirecciones: [], totalGerencias: 0 }
    const subs = ORDEN_SUB.filter((s) => rows.some((r) => r.subdireccion === s))
    const extra = [...new Set(rows.map((r) => r.subdireccion))].filter((s) => !subs.includes(s))
    const orden = [...subs, ...extra]

    const grupos = orden
      .filter((s) => filtro === TODAS || s === filtro)
      .map((sub) => {
        const deSub = rows.filter((r) => r.subdireccion === sub)
        const puestos = [...new Set(deSub.map((r) => r.puesto))]
        return {
          sub,
          gerencias: puestos.map((p) => {
            const kpis = deSub.filter((r) => r.puesto === p)
            return { puesto: p, ...kpis[0], kpis }
          }),
        }
      })
    const totalGerencias = new Set(rows.map((r) => `${r.subdireccion}|${r.puesto}`)).size
    return { grupos, subdirecciones: orden, totalGerencias }
  }, [rows, filtro])

  if (loading) return <div className="py-20 text-center text-muted">Cargando estructura…</div>
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-md p-5">
        <div className="font-semibold mb-1">No se pudo cargar el catálogo de gerencias</div>
        <div className="text-sm">{String(error?.message ?? error)}</div>
      </div>
    )
  }

  const gerenciasVisibles = grupos.reduce((s, g) => s + g.gerencias.length, 0)

  return (
    <section className="flex flex-col gap-5">
      <div className="bg-white rounded-md shadow-card p-6">
        <h2 className="text-lg font-semibold text-ink">Indicadores por gerencia · 2026</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-4xl">
          Los <strong>4 indicadores más relevantes</strong> de cada una de las{' '}
          <strong>{totalGerencias} gerencias y subgerencias</strong> de la estructura, ordenados por
          subdirección. Cada indicador lleva su fórmula, la meta propuesta para SUMIMSA y la
          referencia de industria contra la que se calibró.
        </p>
        <p className="text-sm text-slate-500 mt-3 max-w-4xl">
          En <strong>Servicios</strong> y <strong>Proyectos</strong> las gerencias son{' '}
          <strong>sobre todo comerciales</strong>: cada una es dueña del P&amp;L de su línea, así
          que la batería arranca con ingreso contra meta, colocación del activo y margen. El cuarto
          indicador cubre lo que sostiene esa venta — que la operación del cliente quede atendida
          con refaccionamiento y servicio.
        </p>
        <p className="text-xs text-muted mt-3 max-w-4xl">
          Los benchmarks son rangos de referencia de servicios petroleros y renta de equipo en
          México (APQC, IADC, IOGP, API, PMI, IIA, SHRM/ATD, Gartner) y de la operación con Pemex
          como cliente principal. Son un punto de partida para calibrar con cada gerente, no cifras
          auditadas del sector.
        </p>
      </div>

      <div className="bg-white rounded-md shadow-card p-5 flex flex-wrap items-center gap-3">
        <label htmlFor="sub-select" className="text-sm font-semibold text-slate-600">
          Subdirección:
        </label>
        <select
          id="sub-select"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="border border-slate-300 rounded-sm px-3 py-2 text-sm font-medium focus:border-teal focus:outline-none"
        >
          <option value={TODAS}>Todas ({totalGerencias} gerencias)</option>
          {subdirecciones.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-xs text-muted ml-auto">
          {gerenciasVisibles} {gerenciasVisibles === 1 ? 'gerencia' : 'gerencias'} en pantalla
        </span>
      </div>

      {grupos.map((g) => (
        <div key={g.sub} className="flex flex-col gap-4">
          <div
            className="flex items-baseline gap-3 border-l-4 pl-3"
            style={{ borderColor: COLOR_SUB[g.sub] ?? '#24437A' }}
          >
            <h3 className="text-base font-bold text-ink">{g.sub}</h3>
            <span className="text-xs text-muted">
              {g.gerencias.length} {g.gerencias.length === 1 ? 'gerencia' : 'gerencias'}
            </span>
          </div>

          {g.gerencias.map((ger) => (
            <div key={ger.puesto} className="bg-white rounded-md shadow-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h4 className="font-semibold text-ink">{ger.puesto}</h4>
                <span className="text-sm text-slate-600">{ger.titular}</span>
                <PerfilChip perfil={ger.perfil} />
                <span className="text-xs text-muted ml-auto">
                  {ger.departamento} · {ger.ubicacion}
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 bg-slate-50 border-b border-slate-200">
                      <th className="py-2 px-4 w-[22%]">Indicador</th>
                      <th className="py-2 px-3 w-[26%]">Fórmula</th>
                      <th className="py-2 px-3 w-[13%]">Meta SUMIMSA</th>
                      <th className="py-2 px-3">Referencia de industria</th>
                      <th className="py-2 px-3 w-[9%]">Frecuencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ger.kpis.map((k, i) => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 align-top">
                        <td className="py-2.5 px-4 font-medium text-ink">{k.indicador}</td>
                        <td className="py-2.5 px-3 text-slate-500 text-xs leading-relaxed">
                          {k.formula}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-teal-dark whitespace-nowrap">
                          {k.meta}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 text-xs leading-relaxed">
                          {k.benchmark}
                        </td>
                        <td className="py-2.5 px-3 text-slate-400 text-xs whitespace-nowrap">
                          {k.frecuencia}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      ))}

      <p className="text-xs text-muted">
        Estructura tomada del export de nómina vigente. Seguridad Patrimonial aparece con ocho
        guardias pero sin gerencia asignada, por lo que no tiene batería en esta vista.
      </p>
    </section>
  )
}

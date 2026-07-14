# Proyecto: Dashboard de Compensación Variable — Subdirectores SUMIMSA 2025

> **ESQUEMA VIGENTE (jul-2026): simplificado 70/30.** Lo de abajo describe el esquema
> original 40/40/20; se conserva como referencia histórica. Reglas actuales:
> - Solo 2 ejes: `02. Indicadores de Negocio` (peso **70%**) y `03. 360` (peso **30%**).
>   El eje `00. Objetivos` se eliminó.
> - Los indicadores son la batería benchmark por giro (presentación London
>   "SUMIMSA-Indicadores-por-Subdireccion"): slide 1 de cada subdirección, y para
>   Operaciones las hojas 01 (Financieros) y 02 (Operativos), separada en
>   **Talleres** y **TBX** (columna `Subgrupo` = Financieros / Operativos).
> - El score de indicadores es **cumplimiento relativo**: `achievementRatio`
>   (Real vs Meta según `Dirección`, tope 100%), promediado por importancia.
> - Filas con `Cumple?` = `Sin dato` (Real vacío) **no suman ni restan** — se
>   excluyen del promedio y se muestran en gris.
> - **Talleres y TBX no tienen 360°**: su calificación es 100% indicadores (los
>   pesos se renormalizan; ver `computeAreaBreakdown`).
> - El tope EBITDA 96% se mantiene, igual que el escenario "sin tope".
> - Reales alimentados del cierre 2025 + Consejo de Administración ene-2026
>   (P&L por unidad, TBX Cumplimiento Presupuesto, CxP, madurez documental de
>   Auditoría) y datos confirmados por el usuario (OTIF 36%, abasto 59%, etc.).

## Datos
- Archivo fuente: `data/indicadores_2025.csv`
- Encoding: UTF-8 con BOM
- Separador: coma (`,`)
- Decimales: usan coma europea (`0,9` = 0.9) — parsear con cuidado
- Strings con comas internas están entre comillas dobles

## Estructura del CSV

| Columna | Descripción |
|---------|-------------|
| `Eje` | Área / Subdirección: Auditoría, Capital Humano, CDS, Finanzas, Talleres, TI |
| `Metrica` | Tipo de eje: `00. Objetivos`, `02. Indicadores de Negocio`, `03. 360` |
| `Comunes` | Nombre del indicador específico |
| `UM` | Unidad de medida (%, días, Número, USD, etc.) |
| `Dirección` | Lógica de evaluación: "Arriba es bueno (>= Meta)", "Arriba es malo (<= Meta)", "Es = Meta" |
| `Meta (#)` | Valor objetivo |
| `Real` | Valor real alcanzado |
| `Importancia` | Peso relativo del indicador dentro de su eje (1, 2, o 3) |
| `Cumple #` | Nivel de cumplimiento: 1 = Sí, 0.5 = Parcial, 0 = No |
| `Cumple?` | Etiqueta: "Si", "Parcial", "No" |
| `Corte` | Fecha de corte |
| `Año Esquema` | Año del esquema (25 = 2025) |
| `Pilar ASG` | Pilar ASG (no relevante para el cálculo principal) |

## Lógica de cálculo de compensación

### 1. Tope EBITDA
El cumplimiento del EBITDA corporativo fue del **96%**. Esto significa que la calificación final de cada subdirector queda **topada al 96%** de su calificación calculada.

```
calificación_final = calificación_bruta × 0.96
```

### 2. Tres ejes con pesos fijos

| Eje | Peso |
|-----|------|
| Objetivos (`00. Objetivos`) | 40% |
| Indicadores de Negocio (`02. Indicadores de Negocio`) | 40% |
| 360° (`03. 360`) | 20% |
| **Total** | **100%** |

### 3. Cálculo por eje (promedio ponderado por importancia)

Para cada área y cada eje:

```
score_eje = Σ(cumple_i × importancia_i) / Σ(importancia_i)
```

Donde `cumple_i` es el valor de la columna `Cumple #` (0, 0.5, o 1) y `importancia_i` es el peso relativo (1, 2, o 3).

### 4. Calificación bruta por área

```
calificación_bruta = (score_objetivos × 0.40) + (score_indicadores × 0.40) + (score_360 × 0.20)
```

### 5. Calificación final (con tope EBITDA)

```
calificación_final = calificación_bruta × 0.96
```

### 6. Escenario "sin tope" (EBITDA al 100%)

Widget adicional que muestre qué calificación habrían sacado **sin el tope del 96%**, es decir, la `calificación_bruta` directa. La diferencia es lo que dejaron de ganar por no llegar al 100% del EBITDA.

## Vistas requeridas

### Vista 1: Resultado grupal
- Calificación promedio grupal (con tope y sin tope)
- Barra o gauge por cada área mostrando su calificación final
- Resumen de cuántos indicadores cumplieron, parciales y no cumplieron

### Vista 2: Desglose por eje
- Score de cada eje (Objetivos, Indicadores, 360°) para todas las áreas
- Comparativo visual entre áreas por eje

### Vista 3: Detalle por subdirector/área (filtrable)
- Al seleccionar un área, mostrar:
  - Cada indicador con su meta, real, importancia y cumplimiento
  - Agrupados por eje
  - Status visual (verde = Sí, amarillo = Parcial, rojo = No)

### Vista 4: Widget "¿Qué hubieran sacado al 100%?"
- Por cada área: calificación_bruta vs calificación_final
- Diferencia en puntos porcentuales
- Puede ser una tabla simple o tarjetas comparativas

## Liga de evidencias
Todas las áreas comparten esta liga de SharePoint donde están las evidencias por área:
```
https://suministrosmarinos.sharepoint.com/sites/EsquemaObjetivosIndicadoresSubdirectores/Documentos%20compartidos/Forms/AllItems.aspx
```
Incluir un botón/link "Ver evidencias" que abra esta URL por área.

## Estilo visual
- Tema oscuro en header (#1E293B), fondo claro (#F9FAFB)
- Acento teal (#00897B) para highlights corporativos
- Cada área con su color distintivo
- Tipografía: DM Sans o similar
- Gauges circulares para calificaciones principales
- Barras horizontales para desglose por indicador
- Pills de status (verde/amarillo/rojo) para cumplimiento

## Tech stack sugerido
- React + Vite (o Next.js)
- Tailwind CSS
- Recharts o similar para gráficas
- PapaParse para leer el CSV
- Deploy: puede ser local o Vercel

## Notas
- Los valores de `Cumple #` ya están calculados en el CSV — no necesitas recalcularlos desde Meta vs Real
- La columna `Comunes` marca con "x" indicadores que son comunes entre áreas — por ahora no afecta el cálculo
- Algunos valores de `Cumple #` tienen valores como 3 o 5 (ej: TI fila 16-17) — estos parecen errores de datos, tratar como 1 para el cálculo

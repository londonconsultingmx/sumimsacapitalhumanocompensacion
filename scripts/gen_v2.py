#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generador v2 (a partir de KPIs_Consolidados 2026 (version 2).xlsb):

1) Esquema 2025 -> data/ + public/ indicadores_2025.csv
   - Quita TBX (Servicios) del esquema.
   - Refresca Talleres / Cadena de Suministro (CDS) / Finanzas usando:
       Meta  = Objetivo (col 'Objetivo', meta 2026 como proxy)
       Real  = columna '2025' (real de cierre 2025)
       Fuente= columna 'Fuente' (ligas Power BI)
     Incluye solo filas con Meta y Real(2025) numéricos (evaluables).
   - Añade columna 'Subgrupo' (Negocio / Operativos) para subdividir Indicadores
     SOLO visualmente (la Metrica de scoring sigue siendo '02. Indicadores de Negocio').
   - Conserva Auditoría / Capital Humano / TI tal cual (solo padding de columnas).
   - Conserva los 2 Objetivos manuales de Talleres (OTs 30%, Pedidos 50%).

2) Catálogo 2026 -> public/catalogo_2026.csv
   - Las 7 áreas, todas las filas (Mantener != NO), sin calificación.
   - Taxonomía: 01. Objetivos / 02. Indicadores Negocio / 03. Indicadores Operativos / 04. 360
"""
import pyxlsb, csv, re, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSB = os.path.join(ROOT, 'KPIs_Consolidados 2026 (version 2).xlsb')
CSV_2025 = [os.path.join(ROOT, 'data', 'indicadores_2025.csv'),
            os.path.join(ROOT, 'public', 'indicadores_2025.csv')]
CSV_CAT = os.path.join(ROOT, 'public', 'catalogo_2026.csv')
CORTE, ANIO = '2025-12-31T08:00:00Z', '25'
AREA_RENAME = {'CDS': 'Cadena de Suministro'}
REFRESH_2025 = {'Talleres', 'CDS', 'Finanzas'}  # áreas a regenerar para 2025

# ---- read xlsb ----------------------------------------------------------
def read_xlsb():
    wb = pyxlsb.open_workbook(XLSB)
    rows = []
    with wb.get_sheet('KPIs 2026') as s:
        for r in s.rows():
            rows.append([(c.v if c.v is not None else '') for c in r])
    hdr = [str(h).strip() for h in rows[0]]
    out = []
    for r in rows[1:]:
        d = {hdr[i]: (r[i] if i < len(r) else '') for i in range(len(hdr))}
        out.append(d)
    return out

def cell(d, k):
    v = d.get(k, '')
    return '' if v is None else str(v).strip()

# ---- numbers ------------------------------------------------------------
def parse_num(raw):
    if raw is None:
        return None
    s = str(raw).strip()
    if s == '':
        return None
    s = s.replace('>', ' ').replace('<', ' ').replace('$', ' ')
    scale = 1.0
    low = s.lower()
    if 'musd' in low:
        scale = 1_000_000.0
    elif 'kusd' in low:
        scale = 1_000.0
    s = re.sub(r'(?i)musd|kusd|usd|%', ' ', s).replace(',', '.')
    s = re.sub(r'[^0-9.\-]', ' ', s).strip()
    if s in ('', '.', '-'):
        return None
    if s.count('.') > 1:
        p = s.split('.'); s = ''.join(p[:-1]) + '.' + p[-1]
    try:
        return float(s) * scale
    except ValueError:
        return None

def fmt_num(x):
    if x is None:
        return ''
    if abs(x - round(x)) < 1e-9:
        return str(int(round(x)))
    return f'{x:.4f}'.rstrip('0').rstrip('.').replace('.', ',')

# ---- direction + cumple (relativo se calcula en runtime; aquí el absoluto) ----
MENOS = ['costo', 'día', 'dias', 'ciclo de conversión', 'ciclo de conversion',
         'accidente', 'rotación de personal', 'rotacion de personal',
         'herramientas dañad', 'herramientas perdid', 'dañad', 'perdid',
         'trabajos no aceptados', 'no aceptados', 'evento', 'ambiental',
         'unbilled', 'deductiva', 'desviación', 'desviacion']

def direction(ind, meta):
    low = ind.lower()
    if meta is not None and abs(meta) < 1e-9:
        return 'Es = Meta'
    for kw in MENOS:
        if kw in low:
            return 'Arriba es malo (<= Meta)'
    return 'Arriba es bueno (>= Meta)'

def cumple(meta, real, dirlabel):
    if real is None:
        return 0, 'No'
    op = '<=' if '<=' in dirlabel else ('=' if dirlabel.startswith('Es =') else '>=')
    if op == '=':
        if meta is None:
            return 0, 'No'
        if abs(real - meta) < 1e-9:
            return 1, 'Si'
        if abs(meta) < 1e-9:
            return (1, 'Si') if abs(real) < 1e-9 else (0, 'No')
        return (0.5, 'Parcial') if abs(real - meta) <= 0.1 * abs(meta) else (0, 'No')
    if meta is None or abs(meta) < 1e-9:
        return (1, 'Si') if (real is not None and abs(real) < 1e-9) else (0, 'No')
    if op == '<=':
        if real <= meta:
            return 1, 'Si'
        return (0.5, 'Parcial') if real <= meta / 0.9 else (0, 'No')
    if real >= meta:
        return 1, 'Si'
    return (0.5, 'Parcial') if real >= 0.9 * meta else (0, 'No')

# ---- eje mapping --------------------------------------------------------
def metrica_2025(eje):
    e = eje.lower()
    if '360' in e:
        return '03. 360'
    if 'objetivo' in e or 'comunes' in e:
        return '00. Objetivos'
    return '02. Indicadores de Negocio'

def subgrupo(eje):
    e = eje.lower()
    if 'operativos' in e:
        return 'Operativos'
    if 'macro' in e or 'negocio' in e:
        return 'Negocio'
    return ''

def ejecat_2026(eje):
    e = eje.lower()
    if '360' in e:
        return '04. Resultados 360'
    if 'objetivo' in e or 'comunes' in e:
        return '01. Objetivos'
    if 'operativos' in e:
        return '03. Indicadores Operativos'
    return '02. Indicadores Negocio'

def fuente_of(d):
    f = cell(d, 'Fuente')
    return f if f.lower().startswith('http') else ''

# =========================================================================
def build_2025(data):
    # Regenera SOLO Indicadores (Negocio+Operativos) y 360 de las 3 áreas.
    # Los Objetivos de esas áreas se conservan del CSV actual (la col '2025' del
    # Excel está incompleta para Objetivos/Comunes; regenerarlos los borraría).
    out, seen = [], set()
    for d in data:
        area = cell(d, 'Area')
        if area not in REFRESH_2025:
            continue
        if cell(d, 'Mantener').upper().startswith('NO'):
            continue
        ind = cell(d, 'Indicador')
        eje = cell(d, 'Eje Compensación')
        if not ind or not eje:
            continue
        metr = metrica_2025(eje)
        if metr == '00. Objetivos':
            continue                                 # se conservan del CSV actual
        meta = parse_num(cell(d, 'Objetivo'))
        real = parse_num(cell(d, '2025'))            # real de cierre 2025
        if real is None:                             # sin real 2025 -> no evaluable
            continue
        if metr != '03. 360' and meta is None:
            continue
        dirl = direction(ind, meta)
        cn, cl = cumple(meta, real, dirl)
        out_area = AREA_RENAME.get(area, area)
        sg = subgrupo(eje) if metr == '02. Indicadores de Negocio' else ''
        key = (out_area, metr, ind, fmt_num(meta), fmt_num(real))
        if key in seen:
            continue
        seen.add(key)
        comunes = 'x' if cell(d, 'Objetivo Compartido (MARCAR CON X)2').upper() == 'X' else ''
        out.append([out_area, metr, ind, comunes, cell(d, 'Unidad de Medida'),
                    dirl, fmt_num(meta), fmt_num(real), '1',
                    ('0.5' if cn == 0.5 else str(int(cn))), cl, CORTE, ANIO,
                    fuente_of(d), sg])
    return out

def build_catalog(data):
    out, seen = [], set()
    for d in data:
        area = cell(d, 'Area')
        if not area:
            continue
        if cell(d, 'Mantener').upper().startswith('NO'):
            continue
        ind = cell(d, 'Indicador')
        eje = cell(d, 'Eje Compensación')
        if not ind or not eje:
            continue
        out_area = AREA_RENAME.get(area, area)
        ejec = ejecat_2026(eje)
        comp = 'x' if cell(d, 'Objetivo Compartido (MARCAR CON X)2').upper() == 'X' else ''
        key = (out_area, ejec, ind)
        if key in seen:
            continue
        seen.add(key)
        out.append([out_area, ejec, ind, cell(d, 'Racional'),
                    cell(d, 'Unidad de Medida'), cell(d, 'Objetivo'),
                    cell(d, 'Real'), cell(d, '2025'), fuente_of(d), comp])
    return out

def main():
    data = read_xlsb()

    # ---- 2025 ----
    with open(CSV_2025[0], encoding='utf-8-sig', newline='') as f:
        existing = list(csv.reader(f))
    header = existing[0]
    while len(header) < 14:
        header.append('Fuente')
    if len(header) == 14:
        header = header + ['Subgrupo']
    # Conservar: Aud/CH/TI completas + SOLO los Objetivos de las 3 áreas refrescadas.
    OBJ_AREAS = {'Talleres', 'Cadena de Suministro', 'Finanzas'}
    keep = [r for r in existing[1:] if r and (
        r[0] in ('Auditoría', 'Capital Humano', 'TI') or
        (r[0] in OBJ_AREAS and r[1] == '00. Objetivos'))]
    keep = [r + [''] * (15 - len(r)) for r in keep]   # pad to 15
    new25 = build_2025(data)
    final25 = [header] + keep + new25
    for p in CSV_2025:
        with open(p, 'w', encoding='utf-8-sig', newline='') as f:
            csv.writer(f).writerows(final25)

    # ---- catálogo 2026 ----
    cat_header = ['Area', 'Eje', 'Indicador', 'Racional', 'UM',
                  'Objetivo', 'Real2026', 'Real2025', 'Fuente', 'Compartido']
    cat = build_catalog(data)
    with open(CSV_CAT, 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f); w.writerow(cat_header); w.writerows(cat)

    # ---- report ----
    import collections
    print('=== 2025 (regeneradas) ===')
    by = collections.Counter((r[0], r[1], r[14]) for r in new25)
    for (a, m, sg) in sorted(by):
        print(f'  {a:22} {m:28} {sg or "-":10} {by[(a,m,sg)]}')
    print('AREAS intactas 2025:', collections.Counter(r[0] for r in keep))
    print('TBX en 2025?', any(r[0] == 'TBX Servicios' for r in final25[1:]))
    print('=== catálogo 2026 ===', len(cat), 'filas')
    cb = collections.Counter((r[0], r[1]) for r in cat)
    for (a, e) in sorted(cb):
        print(f'  {a:22} {e:28} {cb[(a,e)]}')

if __name__ == '__main__':
    main()

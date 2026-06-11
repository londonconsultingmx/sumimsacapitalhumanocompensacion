#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
One-off generator: rebuild indicadores_2025.csv replacing Talleres, CDS(->Cadena de
Suministro) and Finanzas with the 2026 Excel data, plus the new TBX Servicios area.
Keeps Auditoria, Capital Humano and TI untouched. Maps the Excel's 6 ejes into the
platform's 3 ejes, derives Cumple from Objetivo vs Real, Importancia = 1.

Run:  python3 scripts/gen_indicadores.py
"""
import csv, re, zipfile, os
from xml.etree import ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = os.path.join(ROOT, 'KPIs_Consolidados 2026 (1).xlsx')
CSV_IN = os.path.join(ROOT, 'data', 'indicadores_2025.csv')
OUT_PATHS = [os.path.join(ROOT, 'data', 'indicadores_2025.csv'),
             os.path.join(ROOT, 'public', 'indicadores_2025.csv')]

NS = '{http://schemas.openxmlformats.org/spreadsheetml/2006/main}'

# ---- read xlsx -----------------------------------------------------------
def read_xlsx(path):
    z = zipfile.ZipFile(path)
    ss = []
    root = ET.fromstring(z.read('xl/sharedStrings.xml'))
    for si in root.findall(f'{NS}si'):
        ss.append(''.join(t.text or '' for t in si.iter(f'{NS}t')))
    sheet = ET.fromstring(z.read('xl/worksheets/sheet1.xml'))
    def colnum(ref):
        c = re.match(r'[A-Z]+', ref).group()
        n = 0
        for ch in c:
            n = n * 26 + (ord(ch) - 64)
        return n
    rows = []
    for row in sheet.find(f'{NS}sheetData').findall(f'{NS}row'):
        cells = {}
        for c in row.findall(f'{NS}c'):
            ref = c.get('r'); t = c.get('t')
            v = c.find(f'{NS}v')
            val = ''
            if v is not None:
                val = ss[int(v.text)] if t == 's' else v.text
            cells[colnum(ref)] = (val or '').strip()
        maxc = max(cells.keys()) if cells else 0
        rows.append([cells.get(i, '') for i in range(1, max(13, maxc) + 1)])
    return rows

# ---- number parsing ------------------------------------------------------
def parse_num(raw):
    """Parse Excel Objetivo/Real cells: '$46.20 MUSD', '$60 Kusd', '> $ 4 MUSD',
    '> 1', '36573000', '0.28', '0,9'. Returns float or None."""
    if raw is None:
        return None
    s = str(raw).strip()
    if s == '':
        return None
    s = s.replace('>', ' ').replace('<', ' ').replace('$', ' ').replace('%', ' ')
    scale = 1.0
    low = s.lower()
    if 'musd' in low or 'musd' in low:
        scale = 1_000_000.0
    elif 'kusd' in low:
        scale = 1_000.0
    elif low.strip().endswith(' m') or low.strip() == 'm':
        scale = 1_000_000.0
    s = re.sub(r'(?i)musd|kusd|usd', ' ', s)
    s = s.replace(',', '.')                      # european decimal -> dot
    s = re.sub(r'[^0-9.\-]', ' ', s).strip()
    if s == '' or s == '.' or s == '-':
        return None
    # collapse multiple dots (thousands) -> keep last as decimal only if 1-2 trailing
    if s.count('.') > 1:
        parts = s.split('.')
        s = ''.join(parts[:-1]) + '.' + parts[-1]
    try:
        return float(s) * scale
    except ValueError:
        return None

def fmt_num(x):
    if x is None:
        return ''
    if abs(x - round(x)) < 1e-9:
        return str(int(round(x)))
    s = f'{x:.4f}'.rstrip('0').rstrip('.')
    return s.replace('.', ',')

# ---- direction + cumple derivation --------------------------------------
MENOS_MEJOR = [
    'costo', 'día', 'dia ', 'dias', '(días', '(dias', 'ciclo de conversión',
    'ciclo de conversion', 'accidente', 'rotación de personal', 'rotacion de personal',
    'rotación del personal', 'rotacion del personal', 'herramientas dañad',
    'herramientas perdid', 'dañad', 'perdid', 'trabajos no aceptados', 'no aceptados',
    'evento', 'ambiental', 'unbilled', 'deductiva', 'desviación', 'desviacion',
]

def derive_direction(indicador, meta):
    low = indicador.lower()
    if meta is not None and abs(meta) < 1e-9:
        return 'Es = Meta', '='
    for kw in MENOS_MEJOR:
        if kw in low:
            return 'Arriba es malo (<= Meta)', '<='
    return 'Arriba es bueno (>= Meta)', '>='

def derive_cumple(meta, real, op):
    """Return (cumple_num, label). Real None -> pending (0/'No')."""
    if real is None:
        return 0, 'No'
    if op == '=':
        if meta is None:
            return 0, 'No'
        if abs(real - meta) < 1e-9:
            return 1, 'Si'
        if abs(meta) < 1e-9:
            return (1, 'Si') if abs(real) < 1e-9 else (0, 'No')
        if abs(real - meta) <= 0.1 * abs(meta):
            return 0.5, 'Parcial'
        return 0, 'No'
    if meta is None or abs(meta) < 1e-9:
        # no usable target; credit only if both effectively zero
        if abs(real) < 1e-9:
            return 1, 'Si'
        return 0, 'No'
    if op == '<=':
        if real <= meta:
            return 1, 'Si'
        if real <= meta / 0.9:          # within ~11% over the ceiling
            return 0.5, 'Parcial'
        return 0, 'No'
    # op == '>='
    if real >= meta:
        return 1, 'Si'
    if real >= 0.9 * meta:
        return 0.5, 'Parcial'
    return 0, 'No'

# ---- eje mapping ---------------------------------------------------------
def map_eje(eje_comp):
    e = eje_comp.lower()
    if '360' in e:
        return '03. 360'
    if 'objetivo' in e or 'comunes' in e:
        return '00. Objetivos'
    # macro/trigger, resultado u. negocio, resultados operativos
    return '02. Indicadores de Negocio'

AREA_RENAME = {'CDS': 'Cadena de Suministro'}
TARGET_AREAS = {'Talleres', 'TBX Servicios', 'CDS', 'Finanzas'}
CORTE = '2025-12-31T08:00:00Z'
ANIO = '25'

def build_rows():
    xrows = read_xlsx(XLSX)
    header = xrows[0]
    out = []
    seen = set()
    stats = {}
    for r in xrows[1:]:
        if len(r) < 13:
            r = r + [''] * (13 - len(r))
        area, indicador, racional, um, objetivo, real, aplica, compart, eje_comp, tipo, un, fuente, mantener = r[:13]
        area = area.strip()
        if area not in TARGET_AREAS:
            continue
        if mantener.strip().upper().startswith('NO'):
            continue
        if not indicador.strip() or not eje_comp.strip():
            continue
        metrica = map_eje(eje_comp)

        # Talleres: Objetivos handled manually -> drop Excel Objetivos & Comunes for Talleres
        if area == 'Talleres' and metrica == '00. Objetivos':
            continue

        meta_n = parse_num(objetivo)
        real_n = parse_num(real)
        # skip pure placeholders (no target AND no actual), except keep nothing useless
        if meta_n is None and real_n is None:
            continue

        dir_label, op = derive_direction(indicador, meta_n)
        cumple_n, cumple_lbl = derive_cumple(meta_n, real_n, op)

        out_area = AREA_RENAME.get(area, area)
        comunes = 'x' if compart.strip().upper() == 'X' else ''

        key = (out_area, metrica, indicador.strip(), fmt_num(meta_n), fmt_num(real_n))
        if key in seen:
            continue
        seen.add(key)

        row = [out_area, metrica, indicador.strip(), comunes, um.strip(),
               dir_label, fmt_num(meta_n), fmt_num(real_n), '1',
               (str(int(cumple_n)) if cumple_n in (0, 1) else '0.5'),
               cumple_lbl, CORTE, ANIO]
        out.append(row)
        s = stats.setdefault(out_area, {'si': 0, 'parcial': 0, 'no': 0, 'n': 0})
        s['n'] += 1
        s['si' if cumple_n == 1 else ('parcial' if cumple_n == 0.5 else 'no')] += 1

    # Talleres manual Objetivos (OTs real 30%, Pedidos real 50%) -- inserted at front
    manual = [
        ['Talleres', '00. Objetivos', 'OTs 100% Correctas', '', '%',
         'Arriba es bueno (>= Meta)', '1', '0,3', '1', '0', 'No', CORTE, ANIO],
        ['Talleres', '00. Objetivos', 'Pedidos de venta 100% Correcto', '', '%',
         'Arriba es bueno (>= Meta)', '1', '0,5', '1', '0', 'No', CORTE, ANIO],
    ]
    for m in manual:
        s = stats.setdefault('Talleres', {'si': 0, 'parcial': 0, 'no': 0, 'n': 0})
        s['n'] += 1; s['no'] += 1
    out = manual + out
    return out, stats

def main():
    new_rows, stats = build_rows()

    # read existing csv, keep header + untouched areas
    with open(CSV_IN, encoding='utf-8-sig', newline='') as f:
        existing = list(csv.reader(f))
    header = existing[0]
    keep = [r for r in existing[1:] if r and r[0] in ('Auditoría', 'Capital Humano', 'TI')]

    # order: keep grouping by area, then new areas
    final = [header] + keep + new_rows

    for path in OUT_PATHS:
        with open(path, 'w', encoding='utf-8-sig', newline='') as f:
            w = csv.writer(f)
            w.writerows(final)

    # report
    print('AREAS regeneradas:')
    for a in sorted(stats):
        s = stats[a]
        print(f"  {a:22} n={s['n']:3}  Si={s['si']:3} Parcial={s['parcial']:3} No={s['no']:3}")
    kept = {}
    for r in keep:
        kept[r[0]] = kept.get(r[0], 0) + 1
    print('AREAS intactas:', kept)
    print('Total filas:', len(final) - 1)

if __name__ == '__main__':
    main()

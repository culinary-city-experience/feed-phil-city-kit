#!/usr/bin/env python3
"""
Feed-Phil city kit — PDF engine.
Reads:  city.json (CITY/HOTEL/GROUPS/VENUES/TEXT) + maps.json (from gen_maps.py)
Writes: pdf.html (intermediate) + Feed-Phil-<City>.pdf (clickable, A4)

City-specific copy lives in city.json (CITY + TEXT). Do not edit per city.
"""
import json, urllib.parse, html as H, os

WORK = os.getcwd()
D = json.load(open(os.path.join(WORK,'city.json')))
M = json.load(open(os.path.join(WORK,'maps.json')))
CITY, HOTEL, GROUPS, VENUES, TEXT = D['CITY'], D['HOTEL'], D['GROUPS'], D['VENUES'], D['TEXT']

def gmaps(v):
    dest = v['address'].split('—')[0].split('⚠')[0].strip()
    return ("https://www.google.com/maps/dir/?api=1&origin=" + urllib.parse.quote(CITY['origin']) +
            "&destination=" + urllib.parse.quote(dest) + "&travelmode=transit")

def e(s): return H.escape(s, quote=False)

def tel(p):
    digits = '+' + ''.join(ch for ch in p if ch.isdigit())
    return digits[:14]

LP = D.get('LINE_PILL_COLORS') or json.load(open(os.path.join(WORK,'city_geo.json')))['line_colors']

css = """
@page { size: A4; margin: 30pt 34pt; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font: 10.5pt/1.45 Helvetica, Arial, sans-serif; color: #2B2118; background: #fff; }
.page { page-break-after: always; }
.page:last-child { page-break-after: auto; }
a { color: #C0392B; text-decoration: none; }
.hero { background: #A93226; color: #FFF8EE; border-radius: 12pt; padding: 22pt 24pt; margin-bottom: 14pt; }
.kicker { font-size: 8pt; letter-spacing: 2pt; text-transform: uppercase; opacity: .85; }
h1 { font-family: Georgia, serif; font-size: 25pt; margin: 4pt 0 6pt; }
.sub { font-size: 10pt; opacity: .95; }
.basebox { background: rgba(255,255,255,.14); border: .8pt solid rgba(255,255,255,.3); border-radius: 7pt; padding: 7pt 10pt; margin-top: 9pt; font-size: 9pt; }
h2 { font-family: Georgia, serif; font-size: 15pt; margin: 6pt 0 6pt; }
.mapwrap { text-align: center; }
.mapwrap svg { max-height: 502pt; width: auto; max-width: 100%; border: 1pt solid #E7DDCC; border-radius: 8pt; }
.legend { font-size: 7.8pt; color: #5E5343; margin-top: 5pt; display: flex; flex-wrap: wrap; gap: 3pt 9pt; justify-content: center; }
.dot { display: inline-block; width: 7pt; height: 7pt; border-radius: 50%; margin-right: 3pt; }
table.glance { width: 100%; border-collapse: collapse; font-size: 8.8pt; margin-top: 8pt; }
table.glance th { text-align: left; background: #2B2118; color: #FFF8EE; padding: 4pt 6pt; }
table.glance td { padding: 3.6pt 6pt; border-bottom: .7pt solid #E7DDCC; vertical-align: top; }
table.glance tr:nth-child(even) td { background: #F5EFE2; }
.ok { color: #2E6B2E; font-weight: bold; } .warn { color: #9A4E00; font-weight: bold; }
.group-h { display: flex; align-items: center; gap: 6pt; margin: 2pt 0 8pt; }
.group-h .sw { width: 10pt; height: 10pt; border-radius: 3pt; }
.group-h h3 { font-family: Georgia, serif; font-size: 13pt; }
.areamap { text-align: center; margin: 4pt 0 6pt; }
.areamap svg { max-height: 330pt; width: auto; max-width: 100%; border: 1pt solid #E7DDCC; border-radius: 8pt; }
.strolltip { background: #EEF3EA; border: .8pt solid #D8E3CF; border-radius: 7pt; padding: 7pt 10pt; margin: 0 0 10pt; font-size: 9.2pt; color: #44513C; }
.strolltip b { color: #2E5B33; }
.chunk { page-break-inside: avoid; }
.card { background: #FAF5EC; border: 1pt solid #E7DDCC; border-radius: 9pt; margin-bottom: 12pt; padding: 12pt 14pt; page-break-inside: avoid; }
.card-cols { display: flex; gap: 12pt; }
.card-main { flex: 1.35; } .card-side { flex: 1; min-width: 150pt; }
h4 { font-family: Georgia, serif; font-size: 13.5pt; display: flex; align-items: center; gap: 6pt; }
.badge { display: inline-flex; align-items: center; justify-content: center; width: 15pt; height: 15pt; border-radius: 50%; color: #fff; font: bold 9pt Helvetica; flex: none; }
.tagline { font-style: italic; color: #7A6C5D; font-size: 9pt; margin: 1pt 0 5pt; }
.phil { background: #FBF0DC; border-left: 3pt solid #E3A72F; padding: 5pt 8pt; border-radius: 0 5pt 5pt 0; font-size: 9pt; margin: 5pt 0; }
.facts { font-size: 9pt; margin: 5pt 0; }
.facts div { padding: 1.3pt 0; }
.flabel { display: inline-block; width: 44pt; color: #7A6C5D; font-size: 8pt; text-transform: uppercase; letter-spacing: .5pt; }
.status { display: inline-block; font-size: 8.6pt; font-weight: bold; border-radius: 5pt; padding: 3pt 7pt; margin: 3pt 0; }
.status.s-ok { background: #E8F3E4; color: #2E6B2E; } .status.s-warn { background: #FCEFE3; color: #9A4E00; }
.agenda { font-size: 8.4pt; color: #5B4A8A; background: #EFEAF8; border-radius: 5pt; padding: 2.6pt 6pt; display: inline-block; margin: 2pt 0 4pt; }
.transit { background: #F3F6F4; border: .8pt solid #DDE7E0; border-radius: 6pt; padding: 7pt 9pt; margin: 6pt 0; font-size: 8.8pt; }
.transit .th { font-weight: bold; margin-bottom: 3pt; }
.leave { color: #C0392B; }
.step { display: flex; gap: 5pt; padding: 1.4pt 0; align-items: baseline; }
.lpill { flex: none; font: bold 7.4pt Helvetica; color: #fff; border-radius: 3pt; padding: 2pt 4.6pt; min-width: 20pt; text-align: center; }
.step .dur { margin-left: auto; color: #7A6C5D; font-size: 8pt; flex: none; }
.btns { margin-top: 6pt; display: flex; flex-wrap: wrap; gap: 5pt; }
.btn { font-size: 8.6pt; font-weight: bold; border: 1.1pt solid #C0392B; color: #C0392B; border-radius: 5pt; padding: 3.4pt 7pt; }
.btn.primary { background: #C0392B; color: #fff; }
.infobox { background: #FFFDF8; border: 1pt solid #E7DDCC; border-radius: 9pt; padding: 11pt 13pt; margin-bottom: 10pt; page-break-inside: avoid; }
.infobox h3 { font-family: Georgia, serif; font-size: 11.5pt; margin-bottom: 4pt; }
.infobox ul { margin: 3pt 0 2pt 14pt; font-size: 9pt; }
.infobox li { margin: 2pt 0; }
.foot { font-size: 8pt; color: #7A6C5D; margin-top: 8pt; }
"""

def infobox(box):
    items = ''.join(f'<li>{it}</li>' for it in box['items'])   # items may contain HTML
    return f'<div class="infobox"><h3>{box["title"]}</h3><ul>{items}</ul></div>'

def card(v):
    g = GROUPS[v['group']]
    steps = ''
    for s in v['transit']['steps']:
        col = LP.get(s[0], '#8B8378')
        lbl = 'walk' if s[0]=='walk' else s[0]
        steps += f'<div class="step"><span class="lpill" style="background:{col}">{lbl}</span><span>{e(s[1])}</span><span class="dur">{e(s[2])}</span></div>'
    links = f'<a class="btn primary" href="{gmaps(v)}">Route (Google Maps, transit)</a>'
    for l in v['links']:
        links += f'<a class="btn" href="{l[1]}">{e(l[0])}</a>'
    phone = '—' if v['phone']=='—' else f'<a href="tel:{tel(v["phone"])}">{e(v["phone"])}</a>'
    st_cls = 's-ok' if v['status']['ok'] else 's-warn'
    st_txt = v['status']['text'].replace('✓','&#10003;').replace('⚠','&#9888;')
    agenda = f'<span class="agenda">Agenda: {e(v["agenda"])}</span>' if v.get('agenda') else ''
    return f'''
    <div class="card">
      <div class="card-cols">
        <div class="card-main">
          <h4><span class="badge" style="background:{g['color']}">{v['num']}</span>{e(v['name'])}</h4>
          <div class="tagline">{e(v['tagline'])}</div>
          <div class="phil"><b>What Phil had:</b> {e(v['phil'])}</div>
          <div class="facts">
            <div><span class="flabel">Address</span>{e(v['address'])}</div>
            <div><span class="flabel">Phone</span>{phone}</div>
            <div><span class="flabel">Price</span>{e(v['price'])}</div>
            <div><span class="flabel">Hours</span>{e(v['hours'])}</div>
          </div>
          <span class="status {st_cls}">{st_txt}</span><br>
          {agenda}
        </div>
        <div class="card-side">
          <div class="transit">
            <div class="th">{e(CITY['from_label'])} — {e(CITY['arrive_label'])} · <span class="leave">leave {e(v['transit']['leave'])}</span></div>
            {steps}
            <div style="margin-top:3pt;color:#7A6C5D;">{e(v['transit']['total'])}</div>
          </div>
        </div>
      </div>
      <div class="btns">{links}</div>
    </div>'''

def glance():
    rows = ''
    for v in VENUES:
        g = GROUPS[v['group']]
        ok = '<span class="ok">&#10003; yes</span>' if v['status']['ok'] else '<span class="warn">&#9888; later</span>'
        price = v['price'].split('·')[0].strip()
        rows += (f'<tr><td><b style="color:{g["color"]}">{v["num"]}</b></td><td><b>{e(v["name"])}</b></td>'
                 f'<td>{e(g["label"].split("·")[0].strip())}</td><td>{ok}</td><td>{e(price)}</td><td>{e(v["booking"])}</td></tr>')
    return (f'<table class="glance"><tr><th>#</th><th>Venue</th><th>Area</th>'
            f'<th>{e(CITY["glance_status_header"])}</th><th>Price</th><th>Booking</th></tr>{rows}</table>')

legend = ('<span><span class="dot" style="background:#2B2118"></span>&#9733; ' + e(CITY.get('hotel_legend','Your base')) + '</span>' +
          ''.join(f'<span><span class="dot" style="background:{g["color"]}"></span>{e(g["label"])}</span>' for g in GROUPS.values()) +
          ''.join(f'<span><span class="dot" style="background:{c}"></span>{e(l)}</span>' for l,c in CITY.get('legend_lines',[])))

pages = []
pages.append(f'''
<div class="page">
  <div class="hero">
    <div class="kicker">{e(CITY['kicker'])}</div>
    <h1>{e(CITY['title'])}</h1>
    <div class="sub">{e(CITY['subtitle'])}</div>
    <div class="basebox">{CITY['base_note']}</div>
  </div>
  <h2>The overview map</h2>
  <div class="mapwrap">{M['overview']}</div>
  <div class="legend">{legend}</div>
</div>''')

pages.append('<div class="page"><h2>At a glance</h2>' + glance() +
             '<div style="margin-top:12pt;"></div>' +
             ''.join(infobox(b) for b in TEXT['pdf_glance_boxes']) +
             f'<div class="foot">{TEXT["pdf_glance_foot"]}</div></div>')

chunks = []
for gid in D.get('GROUP_ORDER', list(GROUPS.keys())):
    vs = [v for v in VENUES if v['group']==gid]
    if not vs: continue
    g = GROUPS[gid]
    nums = ', '.join(str(v['num']) for v in vs)
    intro = (f'<div class="group-h"><span class="sw" style="background:{g["color"]}"></span><h3>{e(g["label"])}'
             f' <span style="color:#7A6C5D;font-size:9pt;font-family:Helvetica">&nbsp;· stops {nums}</span></h3></div>'
             f'<div class="areamap">{M["area_"+gid]}</div>'
             f'<div class="strolltip"><b>Wander here:</b> {e(g["stroll"])}</div>')
    chunks.append(intro)
    for v in vs:
        chunks.append(card(v))
pages.append('<div class="page">' + ''.join(f'<div class="chunk">{c}</div>' for c in chunks) + '</div>')

final = ''.join(f'<h2>{b["title"]}</h2>' + infobox({'title':'','items':b['items']}).replace('<h3></h3>','')
                for b in TEXT['pdf_final_sections'])
pages.append(f'<div class="page">{final}<div class="foot">{TEXT["pdf_final_foot"]}</div></div>')

doc = f'<!DOCTYPE html><html><head><meta charset="utf-8"><style>{css}</style></head><body>{"".join(pages)}</body></html>'
open(os.path.join(WORK,'pdf.html'),'w').write(doc)

outname = f"Feed-Phil-{CITY['name'].replace(' ','-')}.pdf"
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    pg.goto('file://' + os.path.join(WORK,'pdf.html'))
    pg.wait_for_timeout(800)
    pg.pdf(path=os.path.join(WORK,outname), format='A4', print_background=True)
    b.close()

data = open(os.path.join(WORK,outname),'rb').read()
print(f'gen_pdf: {outname} — {len(data)} bytes, {data.count(b"/URI")} link annotations')

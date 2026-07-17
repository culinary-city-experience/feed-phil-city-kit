# Feed Phil City Guide — Playbook

This is the repeatable process behind the Madrid guide, generalized to any
city Phil Rosenthal has visited. Give this whole folder (or just this file
plus `SURVEY.md`) to Claude along with a filled-in survey, and say:

> "Use the Feed Phil city-guide template for **[city]**." (see
> `KICKOFF_PROMPT.md` for the exact wording)

and it produces the same two deliverables as Madrid: a clickable PDF and a
single-file interactive HTML site, each with an overview map and
neighbourhood "stroll" maps.

---

## 0. Source material

Every guide draws on the same two sites, cross-checked against each other
and against official venue sites:

- https://www.philrosenthalworld.com/cities/ — pick the city from the list
  (URL pattern is `.../cities/<slug>`)
- https://feedphil.com/ — same city, second source; the two don't always
  agree on spelling or which location moved, so both matter
- https://feedphil.com/madrid and
  https://www.philrosenthalworld.com/cities/madrid are the reference
  implementation this template was extracted from — reread them (or the
  shipped `example-madrid/` output) if a step below is ambiguous.
- `CITIES.md` — the full current destination list (54, static as of July
  2026) with each one's exact URL slug on both sites. Look the slug up
  there rather than guessing from the city name: it isn't always a simple
  lowercase-and-hyphenate of the display name (Hong Kong is `hongkong`,
  Portland is `portland-oregon`, Sydney and Adelaide share one combined-
  episode slug). `CITY.name` in `city.js`, by contrast, is free text and
  can be multi-word ("Rio de Janeiro", "Basque Country") — `build.sh` and
  `gen_pdf.py` turn every space in it into a hyphen for the output
  filenames, so multi-word city names need no special handling there.

## 1. Gather the survey

Use `SURVEY.md` (or have the traveller fill in `survey.html` in a browser
and paste back the generated summary). At minimum you need: city, dates,
lodging address, free-time windows, splurge-vs-friendly preference, food/
drink leanings, non-food interests, dealbreakers, and a target evening
arrival time. Don't block on 100% completion — reasonable defaults are fine
for anything left blank (state the assumption in the final guide's intro).

## 2. Fetch and reconcile the venue lists

1. `WebFetch` both source URLs for the chosen city. Extract every venue:
   name, address if given, what Phil ate/did there, any link.
2. Where the two sites disagree (a closed location, a different address, a
   different spelling) prefer the more recent source and flag the
   discrepancy in the guide, the way Madrid's guide flagged StreetXO's move
   from Serrano 52 to Serrano 47.
3. Note any venues Phil visited that a local guide would actively steer you
   away from (over-touristy, since closed) — keep them in the list but mark
   them clearly, as Madrid's guide did with Mercado de San Miguel.

## 3. Verify each venue

For every venue, `WebSearch`/`WebFetch` the official site (or best
available source — Tripadvisor, esmadrid-style city tourism sites, etc.)
to confirm, as of today:

- Full current address (street + postal code)
- Phone number
- Opening hours (and which days it's closed)
- Price band — use a simple € to €€€€€ scale and note roughly what it
  buys (a per-person estimate is more useful than the raw symbol)
- Menu link and reservation link/method (online booking, phone-only, or
  no-reservations/queue)
- Whether it's still open at all — Phil's episodes can be years old

Geocode every venue and the lodging address to `[lat, lon]` (WebFetch a
geocoding service, or estimate from known city landmarks/streets if no
geocoder is reachable — accuracy to roughly 50–100m is enough for these
schematic maps).

## 4. Work out transit

For each venue, determine how to get there from the lodging by public
transit (or the traveller's stated preferred mode from the survey):

- Nearest station(s)/stop(s) to both lodging and venue, and the line(s)
  connecting them
- Walking legs with realistic times (~80m/min is a reasonable estimate)
- A total door-to-door time
- A suggested "leave by" time for the survey's target arrival time —
  and if the venue's kitchen doesn't open until later, say so explicitly
  and suggest what to do with the gap (a drink nearby, a stroll) rather
  than silently proposing an impossible reservation

## 5. Group into neighbourhoods

Cluster venues into 3–6 geographic/thematic groups (Madrid used: home turf
near the hotel, one food-crawl street, one upscale district, one historic
centre). Each group gets:

- A color
- A label
- A 2–4 sentence "stroll" tip: where to wander before or after dinner to
  get a feel for the neighbourhood — plazas, markets, live-music spots,
  viewpoints — deliberately NOT a route to the restaurant, just atmosphere

## 6. Build the data files

Fill in `template/city.js` and `template/city_geo.json` (see
`template/SCHEMA.md` for field-by-field docs, and `example-madrid/` for a
complete worked example of both files). In short:

- `city.js` — exports `CITY`, `HOTEL`, `GROUPS`, `VENUES`, `TEXT`,
  `GROUP_ORDER`, `LINE_PILL_COLORS`. This is everything both the PDF and
  the HTML site render — copy, links, transit steps, all of it.
- `city_geo.json` — the map geometry: stations, transit lines, streets,
  landmarks, parks, neighbourhood label positions, and per-map layout specs
  (which streets/landmarks/labels appear on the overview vs. each
  neighbourhood stroll map, and where labels sit to avoid collisions).

This is the most labor-intensive step. Budget real research time for
accurate coordinates and street geometry — the maps are hand-drawn vectors
by default, not pulled from a tile server, so they're only as good as this
data. (Optionally, real map imagery can be composited in as the background
behind these same vectors — see `../LIVE_MAPS.md`. Skip that entirely for a
first pass; it's a purely cosmetic upgrade you can add later without
touching `city_geo.json`.)

## 7. Generate the JSON + build

```
cd <your city working folder>
node -e "$(cat city.js); console.log(JSON.stringify({CITY,HOTEL,GROUPS,VENUES,TEXT,GROUP_ORDER,LINE_PILL_COLORS}))" > city.json
python3 <kit>/builder/gen_maps.py      # city.json + city_geo.json -> maps.json
python3 <kit>/builder/gen_pdf.py       # city.json + maps.json -> Feed-Phil-<City>.pdf
python3 - <<'PY'
tpl = open("<kit>/builder/site_template.html").read()
data = open("city.js").read()
open("Feed-Phil-<City>.html", "w").write(tpl.replace("/*__DATA__*/", data))
PY
```

Or just run `<kit>/builder/build.sh <city-folder>` to do all three steps at
once. See `KICKOFF_PROMPT.md` for the one-line request that gets Claude to
do all of this automatically in a fresh session.

If `GEOAPIFY_API_KEY` or `MAPBOX_ACCESS_TOKEN` is set, `build.sh` also
fetches real basemap imagery first (see `../LIVE_MAPS.md`); otherwise it
builds fully schematic maps as above with no extra step.

## 8. Verify before delivering

- Render each SVG map (open `maps.json`'s values in a browser, or screenshot
  via Playwright) and check for overlapping labels, off-canvas landmarks,
  and pins that collide when two venues share a street — nudge label
  offsets/`venue_display_offsets` in `city_geo.json` until clean.
- Rasterize the PDF (`pdftoppm -png Feed-Phil-<City>.pdf page`) and eyeball
  every page — confirm all link annotations are present
  (`grep -c /URI file.pdf` should be roughly 3-4 per venue plus a few more).
- Open the HTML in a headless browser and confirm all cards render even
  with Leaflet/tiles blocked (the offline fallback in `site_template.html`
  should degrade gracefully, not throw).
- Spot check 2–3 phone numbers, addresses, and reservation links against
  the venue's real site.

## 9. Deliver

`SendUserFile` both the PDF and the HTML. If the traveller has a device
bridge connected and wants a copy saved locally, write it there too. Offer
the same "share the HTML with a travel companion" framing as Madrid — it's
a single file, works offline except for the live map tiles, opens in any
browser.

---

## Design principles worth preserving

These aren't optional flourishes — they're why the Madrid guide worked:

- **Honesty about timing.** Most cities Phil visits eat later than a
  traveller might expect. Always compute the real kitchen-opening time
  and say plainly whether the survey's target arrival works, rather than
  proposing a reservation the restaurant won't honor.
- **Cross-reference the survey, don't just dump a venue list.** Call out
  which stops match stated interests, which fit which free-time slot, and
  which you'd actively skip given stated dealbreakers.
- **Stroll maps show atmosphere, not routes.** The neighbourhood maps
  exist so the traveller can wander before/after a meal — streets, plazas,
  markets, landmarks. Transit routing belongs only on the venue's own card.
- **Everything works offline once downloaded.** The PDF always does. The
  HTML site's cards, links, and content all work without a connection;
  only the live map tiles need one, and the guide should say so plainly
  rather than silently fail.
- **Flag discrepancies, don't hide them.** If Phil's source pages are
  stale (a venue closed, moved, or is now a different concept), say so in
  the guide itself, the way Madrid's called out StreetXO's move.

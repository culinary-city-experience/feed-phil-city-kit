# Data file schema

Two files drive everything: `city.js` (content) and `city_geo.json` (map
geometry). Both are read by the builder scripts in `builder/`. This doc is
the field-by-field reference; `example-madrid/` is the worked example —
when in doubt, copy its shape.

## city.js

A plain JS file that assigns and exports (via `module.exports` for Node, or
just top-level `const` for the browser `<script>` tag) these globals:
`CITY`, `HOTEL`, `GROUPS`, `VENUES`, `TEXT`, `GROUP_ORDER`,
`LINE_PILL_COLORS`. It's evaluated two ways: Node (to dump JSON for the PDF
builder) and directly in the browser (the site template inlines it
verbatim). Keep it strict ES5-ish — no `import`/`export` syntax, no
Node-only APIs.

### CITY

Multi-word names are fine (`"Rio de Janeiro"`, `"Basque Country"`) —
`build.sh` and `gen_pdf.py` turn every space in `name` into a hyphen for the
output filenames (`Feed-Phil-Rio-de-Janeiro.pdf`), no per-city handling
needed. This is a *different* string from the source-site URL slug, which
doesn't always follow the same pattern (Hong Kong is `hongkong`, not
`hong-kong`) — see `../CITIES.md` for the real slug of every destination.

```js
const CITY = {
  name: "Lisbon",                              // used in filenames — multi-word is fine, see below
  kicker: "SOMEBODY FEED PHIL × LISBON · 12–19 OCT 2026",
  title: "Eat Like Phil in Lisbon",
  subtitle: "All N stops from Phil Rosenthal's Lisbon episode — verified <date>, mapped, and wired into your agenda. For <names>.",
  base_note: "<b>Base:</b> <address> · <transit note>. All \"leave by\" times target <HH:MM> arrival. <one-line honesty note about local dining hours>",
  from_label: "From your base",                 // transit box header, PDF + site
  arrive_label: "arrive 19:00",                  // transit box header
  glance_status_header: "Serving at 19:00?",     // "at a glance" table column
  origin: "Full lodging address, City, Country", // used to build Google Maps routes
  hotel_legend: "Your base",                     // legend chip text
  legend_lines: [["L9","#A60084"], ["L5","#96BF0D"]]  // extra legend chips for transit lines (PDF)
};
```

### HOTEL

```js
const HOTEL = {
  name: "Your base: <name/description>",
  address: "Full address",
  coords: [lat, lon],
  stations: "Metro: X (L1) & Y (L2), each ~N min walk"
};
```

### GROUPS

Object keyed by a short group id (used everywhere else to tag venues).

```js
const GROUPS = {
  groupid: {
    label: "Display name · optional subtitle",
    color: "#HEXCOLOR",     // used for pins, badges, borders throughout
    stroll: "2-4 sentence atmosphere/wander tip for this neighbourhood — NOT directions to a venue."
  },
  ...
};
```

### VENUES

Array, ordered however you want them numbered (the `num` field is what
actually shows, so it can differ from array order if needed, but keeping
them aligned avoids confusion).

```js
const VENUES = [
  {
    id: "shortid",              // used for anchors, mini-map element ids — must be unique, no spaces
    num: 1,                     // the number shown on pins/badges
    group: "groupid",           // must match a GROUPS key
    name: "Venue Name",
    tagline: "One-line hook",
    phil: "What Phil ate/did here — the callout box.",
    address: "Full street address, postal code, city — ⚠ notes on moves/changes inline if needed",
    coords: [lat, lon],
    phone: "+XX XXX XXX XXX",   // or "—" if unavailable
    price: "€€€ · ~30–45 pp",   // free text; the € band + short context
    hours: "Human-readable hours, closed days called out",
    status: { ok: true|false, text: "✓/⚠ one-line note on whether it serves at your target arrival time" },
    agenda: "Optional: how this fits the traveller's stated plans — omit the key entirely if there's nothing to say",
    booking: "Book online / Phone only / Walk-in / No bookings — queue / etc.",  // used in PDF glance table
    transit: {
      leave: "HH:MM" or "HH:MM (with a caveat)",
      steps: [
        ["walk", "Description of the leg", "N min"],
        ["L9", "Line direction → destination station", "N stops"],
        ...
      ],
      total: "~N min door to door"
    },
    links: [
      ["Label", "https://..."],
      ...
    ]
  },
  ...
];
```

Notes:
- `status.ok` drives both the colored badge and the PDF glance-table
  checkmark/warning — compute it honestly from the venue's real hours vs.
  `CITY.arrive_label`'s target time.
- `transit.steps` first element of each tuple is a mode key. `"walk"` is
  always styled distinctly; anything else (e.g. `"L9"`, `"Bus 27"`) is
  looked up in `LINE_PILL_COLORS` (falls back to a neutral gray if missing).

### TEXT

Longer-form copy blocks, kept separate from VENUES so both the PDF and the
site can pull the same content without duplicating prose in two places.

```js
const TEXT = {
  pdf_glance_boxes: [
    { title: "The <HH:MM> problem (and the fix)", items: ["<li>-safe HTML string", ...] },
    { title: "Getting around in one minute", items: [...] }
  ],
  pdf_glance_foot: "Sources & methodology one-liner for the bottom of page 2.",
  pdf_final_sections: [
    { title: "Booking cheat-sheet", items: [...] },
    { title: "Phil × your agenda", items: [...] },
    { title: "Mind the details", items: [...] }
  ],
  pdf_final_foot: "Sources list + sign-off line for the last PDF page.",
  site_practical_boxes: [
    { title: "Getting around in one minute", items: [...] },
    ...
  ],
  site_foot: "Full HTML footer content — sources, credits, sign-off."
};
```

`items` entries are raw HTML strings (rendered with `innerHTML` / no
escaping) — safe because you author them, not user input. Use `<b>` for
emphasis, keep each item roughly one to three sentences.

### GROUP_ORDER

```js
const GROUP_ORDER = ["groupid1", "groupid2", ...];  // controls section order in the PDF
```

### LINE_PILL_COLORS

```js
const LINE_PILL_COLORS = {
  walk: "#8B8378",
  L9: "#A60084",
  L5: "#96BF0D",
  ...
};
```

Must cover every mode key used in any venue's `transit.steps`.

---

## city_geo.json

Pure JSON (no JS). Map geometry only — nothing here is displayed as text
except street/landmark/station labels, which are short place names.

```jsonc
{
  "line_colors": { "L9": "#A60084", ... },     // same values as LINE_PILL_COLORS, JSON form

  "stations": {
    "Station Name": { "lines": ["L9","L5"], "lat": 40.42, "lon": -3.70 },
    ...
  },

  "transit_lines": [
    { "line": "L9", "path": ["Station A", "Station B", "Station C"] },
    ...
  ],

  "annotations": [   // optional extra arrows on the overview (e.g. "L8 -> Airport")
    { "from_station": "Colombia", "dx": 56, "dy": -34, "color": "#F49FC3",
      "label": "L8 → Airport T4", "label_dx": 62, "label_dy": -14,
      "label_anchor": "end", "label_color": "#C4708F" }
  ],

  "streets": {
    "streetkey": { "name": "Display Name" or null, "path": [[lat,lon], [lat,lon], ...] },
    ...
  },

  "landmarks": {
    "id": { "label": "Landmark Name", "lat": 40.42, "lon": -3.70 },
    ...
  },

  "parks": {
    "id": { "label": "Park Name", "lat_min": .., "lat_max": .., "lon_min": .., "lon_max": .. }
  },

  "neighbourhoods": [
    { "label": "NEIGHBOURHOOD NAME", "lat": .., "lon": .. }   // faint background labels, overview only
  ],

  "overview": {
    "bounds": [lat_min, lat_max, lon_min, lon_max],
    "width": 760,
    "scale_m": 1000,
    "hotel_label": "Your base",
    "hotel_label_anchor": "start",
    "parks": ["id1", "id2"],                       // which parks to draw
    "street_layers": [
      { "keys": ["mainavenue"], "width": 9 },        // thicker for the main boulevard
      { "keys": ["street1","street2",...], "width": 5, "label_keys": ["street1"] }
      // label_keys optional — defaults to keys; use to draw a street but skip its label if crowded
    ],
    "station_labels": { "Station A": [8,-4], ... },  // [dx,dy] text offset; omit a station to hide its label
    "station_skip": ["Station Not Shown", ...],       // stations to omit entirely from this map
    "landmark_labels": { "id": ["start"|"end", dx, dy], ... },
    "venue_labels": { "venueid": [dx, dy, "start"|"end"], ... },   // REQUIRED for every venue
    "venue_display_offsets": { "venueid": [dx, dy], ... }          // optional pin nudge to de-collide
  },

  "areas": {
    "groupid": {
      "bounds": [lat_min, lat_max, lon_min, lon_max],
      "width": 640,
      "scale_m": 250,
      "streets": ["key1", "key2", ...],
      "label_streets": ["key1", ...],           // optional subset to label
      "parks": ["id1"],
      "stations": ["Station A", "Station B"],
      "station_labels": { "Station A": [dx,dy] },   // optional per-station override
      "landmarks": { "id": ["start"|"end", dx, dy] },
      "show_hotel": true|false,                 // draw the hotel star on this area map?
      "hotel_label_anchor": "end",
      "venue_labels": { "venueid": [dx, dy, "start"|"end"], ... },  // only venues in this group
      "venue_display_offsets": { "venueid": [dx, dy] }
    },
    ...   // one entry per GROUPS key that should get a stroll map (usually all of them)
  }
}
```

### Practical tips for filling this in

- Coordinates: geocode with any available tool (WebFetch a geocoder, or
  triangulate from known landmarks/streets on a map you can view). Precision
  to ~4 decimal places (~10m) is plenty.
- `streets`: you don't need a perfectly traced street network — 2–6 points
  per street capturing its general path is enough; these are schematic maps,
  not survey-accurate ones.
- Label collisions are the main iteration loop: render `maps.json`'s SVGs,
  screenshot them, and nudge `dx`/`dy` offsets until nothing overlaps. Budget
  for 2-3 rounds of this per city.
- `venue_display_offsets` matters most when two venues sit on the same
  street a few doors apart (e.g. two restaurants across from each other) —
  without a small offset their pins will fully overlap.
- Area map `bounds` should be tight enough that streets/labels are legible
  (roughly 1.5–2.5 km across works well for a 640px-wide render) but loose
  enough to show 2-4 named streets and a station or two for orientation.
- Optional: `gen_maps.py` will composite a real map image behind all of the
  above if it finds `basemaps/overview.png` / `basemaps/area_<group-id>.png`
  next to this file — see `../LIVE_MAPS.md`. This changes nothing about how
  you fill in `city_geo.json`; the same `bounds` values are reused to fetch
  a matching image, so get the schematic map right first and treat live
  basemaps as an optional finishing touch.

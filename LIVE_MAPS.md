# Live maps (optional)

By default every map in the kit — the overview and each neighbourhood
"stroll" map — is a hand-drawn schematic SVG: streets, parks, and landmarks
traced from real geometry in `city_geo.json`, rendered as clean vector line
art. This is deliberate and works everywhere, including fully offline. You
do not need anything in this document to get a complete, good-looking guide.

What this document adds is a way to swap in a real map image (actual
street-grid imagery, à la OpenStreetMap) as the *background* of each map,
with the same transit lines, stations, landmarks, pins, hotel marker, scale
bar, and north arrow drawn on top exactly as before. It's a strict visual
upgrade with no data changes — same bounding boxes, same overlay, same
links, same everything else.

There are two ways to get it. Pick whichever is easier for you; both feed
the same mechanism (a `basemaps/` folder of PNGs), and `gen_maps.py` picks
either up automatically.

## How it works

`builder/gen_maps.py` looks for `basemaps/overview.png` and
`basemaps/area_<group-id>.png` (one per neighbourhood group in
`city_geo.json`) next to a city's `city_geo.json`. For any map where the
matching PNG exists, it's embedded as the background image (clipped to the
map's rounded frame) and the schematic street/park drawing for that map is
skipped — everything else (transit lines, station dots, landmarks, venue
pins, hotel marker, scale bar, north arrow, and all labels) is still drawn
on top, now with a light halo behind the text so it stays legible over a
photographic background. Maps with no matching PNG fall back to the
schematic as usual, so you can mix real imagery for some maps and
schematic for others with no extra effort — the two coexist fine in one
guide.

Nothing else in the pipeline changes. `gen_pdf.py` and `site_template.html`
just embed whatever `gen_maps.py` produces.

## Option A — run it via the Claude desktop app (no API key needed from you now)

If you're using the Claude desktop app, it can open a bridge to your own
computer with full internet access, even in sessions (like this cloud
sandbox) that can't reach outside map services directly. Once that bridge
is connected, the same portable, dependency-free script can just be handed
to your machine to run:

1. Make sure the Claude desktop app is open (this is what makes the bridge
   available in a Claude Code / Cowork session).
2. Ask Claude to run `builder/fetch_basemaps.py <city-folder>` on your
   machine via the device bridge, pointed at the city folder you're
   building. It still needs a Geoapify key or a Mapbox token either way
   (see Option B for how to get one, free) — the desktop bridge just gets
   you past this sandbox's own network restrictions, not past needing
   credentials at all.
3. Claude copies the resulting `basemaps/*.png` files back into the city
   folder in this session, then re-runs `build.sh`.

This is the recommended path if you have the desktop app open anyway: it
needs no setup beyond the key/token, and everything else about the
workflow stays identical.

## Option B — get a free key/token (works anywhere, including headless)

`fetch_basemaps.py` supports two providers, either is a fine choice. Set
whichever credential you have and the script auto-detects which one to use
(if both are set, Geoapify wins unless you pass `--provider mapbox`).

| | Geoapify | Mapbox |
|---|---|---|
| Sign-up | No credit card | No credit card |
| Free tier | 3,000 map credits/day | 50,000 Static Images API requests/month |
| Cost per map | ~2–3 credits | 1 request |
| One city's maps (5–6 images) | Well under 20 credits — effectively free | 5–6 requests — effectively free |
| Env var | `GEOAPIFY_API_KEY` | `MAPBOX_ACCESS_TOKEN` |
| Default style used here | `osm-bright-grey` (muted, OSM-rendered) | `light-v11` (muted, Mapbox's own cartography) |
| Sign up | https://www.geoapify.com/ | https://www.mapbox.com/ |

Either is generous enough that for a personal trip guide — even rebuilt
many times — you will not come close to the free tier in either case. Pick
whichever you'd rather have an account with; there's no functional
difference in this kit.

Setup (Geoapify):
```
export GEOAPIFY_API_KEY=your_key_here
builder/build.sh <city-folder>
```

Setup (Mapbox — use the "Default public token" from your account page, or
a scoped one with Static Images API access):
```
export MAPBOX_ACCESS_TOKEN=your_token_here
builder/build.sh <city-folder>
```

With either variable set, `build.sh` automatically calls
`fetch_basemaps.py` before `gen_maps.py`, fetching one PNG per map sized
and framed to exactly match that map's `bounds` in `city_geo.json` — so
the image lines up 1:1 with the vector overlay with no manual alignment.

Or fetch without touching the environment or `build.sh`:
```
python3 builder/fetch_basemaps.py <city-folder> --api-key your_geoapify_key
python3 builder/fetch_basemaps.py <city-folder> --mapbox-token your_mapbox_token
python3 builder/fetch_basemaps.py <city-folder> --provider mapbox   # force it, if both are set
```

Useful flags:
- `--style STYLE` — Geoapify map style. Default `osm-bright-grey`. Other
  options include `osm-bright`, `osm-carto` (full-color, closest to
  openstreetmap.org's own default look), `osm-liberty`, and `toner-grey`
  (near-monochrome, highest contrast for the overlay).
- `--mapbox-style STYLE` — Mapbox style id. Default `light-v11`. Other
  options include `streets-v12`, `outdoors-v12`, `navigation-day-v1`.
- `--overwrite` — re-fetch even if a PNG already exists for a map (useful
  after changing a `bounds` value in `city_geo.json`).

### Why not raw OpenStreetMap tiles as a third option

OpenStreetMap's own tile servers (`tile.openstreetmap.org`) are a
volunteer-run, donation-funded service with an explicit
[usage policy](https://operations.osmfoundation.org/policies/tiles/) that
prohibits exactly the kind of bulk, automated, unattended fetching a build
script does — no API key is offered because it's not meant for this. It's
also the service this sandbox already can't reach directly (see the top of
this doc's context), so building it in would only ever work through the
desktop bridge, with no benefit over the two options above.

Both Geoapify's `osm-carto` style and, underneath everything, a good chunk
of Mapbox's own base data are themselves sourced from OpenStreetMap's
dataset — so "a background like OpenStreetMap" is already what you get,
just served through infrastructure that's actually built for programmatic,
metered access. If you specifically want the classic osm.org visual style
(not just OSM data), Geoapify's `osm-carto` is the closest match of
anything in this kit.

## `build.sh` behavior

`build.sh` checks, in order:

1. `GEOAPIFY_API_KEY` or `MAPBOX_ACCESS_TOKEN` is set → runs
   `fetch_basemaps.py` first (skips any PNG that already exists in
   `basemaps/`; failures here don't stop the build — it just falls back to
   schematic for whatever failed to fetch).
2. Neither set, but a `basemaps/` folder with at least one PNG already
   exists (e.g. you fetched via Option A and copied the files in, or
   fetched on a previous run) → reuses it as-is, no network call.
3. Neither → builds fully schematic, exactly as before this feature
   existed.

So it's always safe to just run `build.sh` — you get the best available
maps for whatever's set up, and nothing breaks if no live-map credential is
available.

## Notes

- `basemaps/` is a per-city folder (next to that city's `city.js` and
  `city_geo.json`), not shared — delete it any time to force a return to
  schematic maps, or to force a clean re-fetch.
- If you change a map's `bounds` in `city_geo.json`, delete (or
  `--overwrite`) the matching PNG so the fetched image is re-framed to
  match — otherwise the old image will be stretched to the new frame's
  aspect ratio, which looks wrong.
- `fetch_basemaps.py` is stdlib-only (no `pip install` needed) so it runs
  anywhere Python 3 does, including via the device bridge on a machine that
  has never had this kit's dependencies installed.

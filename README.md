# Feed Phil City Guide Kit

Turn any city from *Somebody Feed Phil* into a personal trip guide: a
clickable PDF for your phone and a single-file interactive HTML site,
each with an overview map and neighbourhood "stroll" maps, restaurant
details, reservation links, and transit directions from your lodging.
This kit is the Madrid guide, generalized so it can be rebuilt for any
other city Phil has visited.

## Quick start

1. **Fill in the survey.** Open `survey.html` in a browser, answer what
   you can, click "Generate summary," and copy the result — or just answer
   `SURVEY.md` directly in a chat.
2. **Kick off a session.** Give Claude this whole folder plus your survey
   answers using the prompt in `KICKOFF_PROMPT.md`.
3. **Claude does the rest**: pulls venues from
   https://www.philrosenthalworld.com/cities/ and https://feedphil.com/,
   verifies each one, works out transit, builds the maps, and produces
   your PDF + HTML guide.

## What's in this folder

| File / folder | Purpose |
|---|---|
| `README.md` | This file |
| `PLAYBOOK.md` | The full step-by-step process — what to research, how to verify, how to build, what to check before delivering |
| `LIVE_MAPS.md` | Optional: use real map imagery as the map background instead of pure schematic (two setup paths) |
| `CITIES.md` | The current list of Phil's 54 destinations and their exact source-site URL slugs |
| `SURVEY.md` | Plain-text interview to run before starting a new city |
| `survey.html` | The same interview as a fillable web form — city field autocompletes against `CITIES.md`'s list — open it in any browser, no install needed |
| `KICKOFF_PROMPT.md` | Copy-paste prompt to start a new city guide in a chat |
| `builder/gen_maps.py` | Generates the maps (overview + per-neighbourhood) from a city's data — schematic by default, or composited over real imagery if `basemaps/*.png` is present (see `LIVE_MAPS.md`) |
| `builder/fetch_basemaps.py` | Optional: fetches those real map images from Geoapify or Mapbox's static-map APIs — see `LIVE_MAPS.md` |
| `builder/gen_pdf.py` | Assembles the clickable PDF from the same data + generated maps |
| `builder/site_template.html` | The HTML site shell — city data gets inlined into it to produce the final single-file site |
| `builder/build.sh` | Runs all build steps for one city in one command (auto-fetches basemaps if `GEOAPIFY_API_KEY` or `MAPBOX_ACCESS_TOKEN` is set) |
| `template/city.js` | Blank content-data skeleton for a new city (copy this to start) |
| `template/city_geo.json` | Blank map-geometry skeleton for a new city (copy this to start) |
| `template/SCHEMA.md` | Field-by-field reference for both data files |
| `example-madrid/` | The original Madrid guide, in this template's format — a complete worked example of every file above |

## How it works, in one paragraph

Everything city-specific — restaurant details, copy, and map geometry —
lives in two data files (`city.js` and `city_geo.json`); the three builder
scripts never change per city. Fill in the two data files (using
`example-madrid/` as your model and `template/SCHEMA.md` as the reference),
then run `builder/build.sh <your-city-folder>` to produce
`Feed-Phil-<City>.pdf` and `Feed-Phil-<City>.html`. The heavy lifting is
research, not code: verifying each venue is still open, getting its current
address/phone/hours/price, working out realistic transit, and getting map
coordinates right.

## Requirements to actually build

- Python 3 with `playwright` installed and a Chromium browser available
  (used to render the maps to SVG-embedded HTML and print the final PDF)
- Node.js (used only to convert `city.js` to JSON — no npm packages needed)
- Web access to research venues and geocode addresses

If you're working inside a Claude session with the standard tool set
(WebFetch/WebSearch/Bash/Playwright), all of this is already available —
just follow `PLAYBOOK.md`.

Maps are schematic (hand-drawn SVG) by default and need nothing extra. If
you'd rather have real map imagery as the background, see `LIVE_MAPS.md` —
it's optional and purely cosmetic.

## Customizing further

- Palette, fonts, and layout live in the CSS blocks inside
  `builder/gen_pdf.py` (PDF) and `builder/site_template.html` (site) —
  both are plain CSS, safe to tweak globally for all future cities.
- Per-city color coding (one color per neighbourhood group) is set in each
  city's own `GROUPS` object in `city.js`, not in the shared CSS.

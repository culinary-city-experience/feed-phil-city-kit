# Somebody Feed Phil — city list & URL slugs

A static reference, not a live query. Phil Rosenthal has said the show
moves to YouTube starting in 2027, and both source sites' city lists were
unchanged through mid-2026 — so a fixed list here is more reliable than
re-scraping `cities-landing` every time, and saves a lookup step at the
start of each city guide. If a new destination shows up later, just add a
row (or ask Claude to check the two source pages again — they're linked
below).

**Sources checked July 2026:**
https://www.philrosenthalworld.com/cities-landing and https://feedphil.com/

## Why this file exists

The URL slug (the part after `/cities/` or `feedphil.com/`) is **not**
always just the display name lowercased with spaces turned to hyphens.
Three real examples from the list below:

- **Hong Kong** → `hongkong` — no hyphen at all.
- **Portland, OR** → `portland-oregon` — spells out the state, doesn't use
  the postal abbreviation.
- **Sydney** and **Adelaide** → both `sydney-adelaide` — one combined
  episode, two cities, one URL on both sites.

So: always copy the slug from this table (or verify it directly against
the source URL) rather than deriving it from the display name. This same
slug is what goes into a city's `city.js` wherever the source URLs are
cited (see `PLAYBOOK.md` / `KICKOFF_PROMPT.md`) — it has nothing to do with
`CITY.name`, which is a free-text display string and can contain spaces
fine (`"Rio de Janeiro"`, `"Basque Country"` all work — `build.sh` and
`gen_pdf.py` turn every space into a hyphen for the output filenames, e.g.
`Feed-Phil-Rio-de-Janeiro.pdf`, `Feed-Phil-Basque-Country.pdf`).

## The list

Season column cross-checked against `philrosenthalworld.com`'s own season
breakdown (48 cities across 8 *Somebody Feed Phil* seasons, plus 6 more
from the spinoff *I'll Have What Phil's Having* = 54 total) — same 54 this
table already had, just now with season/show attached to each.

| City | Slug | Season |
|---|---|---|
| Amsterdam | `amsterdam` | S8 |
| Austin | `austin` | S6 |
| Bangkok | `bangkok` | S1 |
| Barcelona | `barcelona` | Phil's Having |
| Basque Country | `basque-country` | S8 |
| Boston | `boston` | S8 |
| Buenos Aires | `buenos-aires` | S2 |
| Cape Town | `cape-town` | S2 |
| Chicago | `chicago` | S3 |
| Copenhagen | `copenhagen` | S2 |
| Croatia | `croatia` | S6 |
| Dublin | `dublin` | S2 |
| Dubai | `dubai` | S7 |
| Guatemala | `guatemala` | S8 |
| Hawaii | `hawaii` | S4 |
| Helsinki | `helsinki` | S5 |
| Hong Kong | `hongkong` | Phil's Having |
| Iceland | `iceland` | S7 |
| Italy | `italy` | Phil's Having |
| Kyoto | `kyoto` | S7 |
| Las Vegas | `las-vegas` | S8 |
| Lisbon | `lisbon` | S1 |
| London | `london` | S3 |
| Los Angeles | `los-angeles` | Phil's Having |
| Madrid | `madrid` | S5 |
| Maine | `maine` | S5 |
| Manila | `manila` | S8 |
| Marrakesh | `marrakesh` | S3 |
| Mexico City | `mexico-city` | S1 |
| Mississippi Delta | `mississippi-delta` | S4 |
| Montreal | `montreal` | S3 |
| Mumbai | `mumbai` | S7 |
| Nashville | `nashville` | S6 |
| New Orleans | `new-orleans` | S1 |
| New York City | `new-york-city` | S2 |
| Oaxaca | `oaxaca` | S5 |
| Orlando | `orlando` | S7 |
| Paris | `paris` | Phil's Having |
| Philadelphia | `philadelphia` | S6 |
| Portland, OR | `portland-oregon` | S5 |
| Rio de Janeiro | `rio-de-janeiro` | S4 |
| Saigon | `saigon` | S1 |
| San Francisco | `san-francisco` | S4 |
| Santiago | `santiago` | S6 |
| Scotland | `scotland` | S7 |
| Seoul | `seoul` | S3 |
| Singapore | `singapore` | S4 |
| Sydney & Adelaide | `sydney-adelaide` | S8 |
| Taipei | `taipei` | S7 |
| Tbilisi | `tbilisi` | S8 |
| Tel Aviv | `tel-aviv` | S1 |
| Tokyo | `tokyo` | Phil's Having |
| Venice | `venice` | S2 |
| Washington, DC | `washington-dc` | S7 |

54 destinations (Sydney and Adelaide share one row/slug since they're one
combined episode on both sites) — 53 rows, matching
`philrosenthalworld.com`'s own "54 cities, 487 restaurants" tally exactly.

## Using this list

- **Filling in `city.js`:** set `CITY.name` to whatever display form you
  want in the guide (doesn't need to match the slug — "Rio de Janeiro" is
  fine even though the slug is `rio-de-janeiro`). Everywhere the guide
  cites its two sources (`TEXT.pdf_glance_foot`, `TEXT.pdf_final_foot`,
  `TEXT.site_foot`, the "Phil's page" venue link, etc.), use the slug from
  this table to build `https://www.philrosenthalworld.com/cities/<slug>`
  and `https://feedphil.com/<slug>`.
- **`survey.html`:** the city field is a dropdown built from this same
  list, grouped by season, `<option value="slug">`. Picking one is the
  only way to fill it in (no free text, no typos) and the generated survey
  output includes the slug explicitly, e.g. "City: Basque Country
  (source-site slug: `basque-country`)" — so whoever builds the guide from
  that survey never has to re-derive or guess it.

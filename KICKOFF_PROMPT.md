# Kickoff prompt

Copy this into a chat with Claude (attach this whole `feed-phil-city-kit`
folder, or at minimum `PLAYBOOK.md` + `SURVEY.md` + `template/`) to start a
new city guide. Fill in the bracketed parts first — either by hand or by
pasting the generated output from `survey.html`.

---

> Use the Feed Phil city-guide template (see `PLAYBOOK.md`) to build me a
> trip guide for **[CITY]**.
>
> Pull venues from both source sites (look up the exact URL slug in
> `CITIES.md` first — it isn't always just the city name lowercased and
> hyphenated, e.g. Hong Kong is `hongkong`, Portland is `portland-oregon`):
> - https://www.philrosenthalworld.com/cities/[slug]
> - https://feedphil.com/[slug]
>
> Here's my survey:
>
> [paste your filled-in SURVEY.md answers, or the output from survey.html]
>
> Produce the same two deliverables as the reference Madrid guide
> (`example-madrid/`): a clickable PDF with an overview map and
> neighbourhood stroll maps, and a single-file interactive HTML site with
> live maps. Verify every venue's current address, phone, hours, and price
> before including it, and flag anything Phil's pages have wrong or
> out of date (closed, moved, renamed).

---

### If Claude doesn't already have the kit loaded

If you're starting a session that doesn't have this folder's context, the
short version is: read `PLAYBOOK.md` first, then `template/SCHEMA.md`, then
look at `example-madrid/city.js` and `example-madrid/city_geo.json` as a
worked example before starting research. The builder scripts are in
`builder/` and don't need to be modified per city — only the two data files
do. `CITIES.md` has the full current list of destinations and their
source-site URL slugs — check it before typing any `philrosenthalworld.com`
or `feedphil.com` link into a city's data.

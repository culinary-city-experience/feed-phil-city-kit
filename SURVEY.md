# Trip Survey — Somebody Feed Phil City Guide

Fill this in (or answer it conversationally with Claude) before starting a new
city guide. It replaces the old free-form `background.md` — same purpose,
faster to act on. Short answers are fine; skip anything that doesn't apply.

Save your answers as `survey.md` in this city's working folder, or just paste
them into the chat when you kick off the guide (see `KICKOFF_PROMPT.md`).

---

## 1. The basics

- **City:** (e.g. Lisbon, Tokyo, Austin, Bangkok — must be one Phil has
  actually visited; check https://www.philrosenthalworld.com/cities/ and
  https://feedphil.com/ for the current list)
- **Dates of the trip:** (arrival → departure, with day-of-week if you know it)
- **Purpose:** work trip with free evenings / pure vacation / mixed / other
- **Who's travelling:** just you / you + partner / you + colleague / group of N
- **Free time you actually have:** which afternoons, evenings, or full days
  are genuinely open? (Be specific — "Friday night and Saturday" is more
  useful than "some free time")

## 2. Where you're staying

- **Lodging address** (or neighbourhood if not booked yet):
- **Anything already booked nearby you want factored in** (a work office,
  a conference venue, a friend's place you're visiting):

## 3. Food & drink preferences

- **Splurge appetite:** happy to pay top euro/dollar for a bucket-list meal,
  or keep everything mid-range?
- **Cuisines / dishes you're chasing** (the whole point of following Phil —
  any dish, region, or food memory you specifically want to recreate):
- **Dietary restrictions or dislikes:**
- **Drink preferences:** wine, cocktails, local specialty, non-alcoholic,
  coffee culture, etc.
- **Splurge vs. friendly-price balance:** do you want one of each per day
  like the Madrid guide, or a different split?

## 4. Beyond the plate — interests to weave in

Pick whatever applies, add your own:

- [ ] Live music (genre: __________)
- [ ] Chess / board games / cards
- [ ] Sports — spectating (which: __________) or playing (which: __________)
- [ ] Art / museums (specific artists or periods you care about: ________)
- [ ] Markets and food halls
- [ ] Nature / parks / walking
- [ ] Nightlife — bars, clubs, late scene
- [ ] History / architecture
- [ ] Local language practice — are you learning it? Level?
- [ ] Something else entirely: __________

## 5. Atmosphere & dealbreakers

- **Likes:** (relaxed vs. buzzy, local vs. polished, indoor vs. terrace...)
- **Not into:** (tourist traps, clubbing, crowds, anything specific to avoid)
- **Anything already done on a previous trip** you don't need repeated
  (so we skip it and suggest something new):

## 6. Logistics preferences

- **Target arrival time for evening plans** (Madrid guide used 19:00 — pick
  what fits your actual schedule):
- **How you like getting around:** public transit / walking / rideshare /
  rental car / a mix
- **Budget comfort for transport:** happy to take cabs/rideshare when
  convenient, or prefer cheapest/public option always?
- **Mobility considerations** (a lot of walking is fine? stairs an issue?
  traveling with luggage between stops?):

## 7. Anything else

Open field — quirks, must-sees a friend recommended, an anniversary dinner
to plan around, a flight time that constrains the last day, etc.

---

### What happens with these answers

Claude uses this to:
1. Pull every venue Phil visited in the city from both source sites.
2. Cross-check which are still open, verify address/phone/hours/price.
3. Filter and prioritize using your answers above (splurge/friendly split,
   interests, dealbreakers).
4. Work out transit from your lodging to each venue, with a realistic
   arrival-time target from §6.
5. Build the same two deliverables as the Madrid guide: a clickable PDF and
   a single-file interactive HTML site, each with an overview map and
   neighbourhood stroll maps.

See `PLAYBOOK.md` for the full process if you want to run or adapt it
yourself.

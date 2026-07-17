// Somebody Feed Phil — Madrid. Data verified July 2026.
// Sources: philrosenthalworld.com/cities/madrid + feedphil.com/madrid + official sites.
//
// Reference implementation of the Feed Phil city-guide template — this is
// the guide the template was extracted from. See ../template/SCHEMA.md for
// field docs.

const CITY = {
  name: "Madrid",
  kicker: "Somebody Feed Phil × Madrid · 27 Sep – 4 Oct 2026",
  title: "Eat Like Phil in Madrid",
  subtitle: "All eleven stops from Phil Rosenthal's Madrid episode — verified July 2026, mapped, and wired into your agenda. For Mark & Niels.",
  base_note: "<b>Base:</b> Calle del Príncipe de Vergara 248, 28016 Madrid (Chamartín) · Metro Colombia (L8+L9) & Pío XII (L9), each ~6 min walk<br>All “leave by” times target a <b>19:00 arrival</b> — but note each card's kitchen hours: Madrid dines late.",
  from_label: "From the residence",
  arrive_label: "arrive 19:00",
  glance_status_header: "Serving at 19:00?",
  origin: "Calle del Príncipe de Vergara 248, 28016 Madrid",
  hotel_legend: "Your residence",
  legend_lines: [
    ["L9", "#A60084"],
    ["L7", "#F3721C"],
    ["L5", "#96BF0D"],
    ["L8 airport", "#F49FC3"]
  ]
};

const HOTEL = {
  name: "Your base: Residencia Infanta María Teresa",
  address: "Calle del Príncipe de Vergara 248, 28016 Madrid (Chamartín)",
  coords: [40.4631, -3.6754],
  stations: "Metro: Colombia (L8+L9) & Pío XII (L9), each ~6 min walk"
};

const GROUPS = {
  home:      { label: "Home turf · Chamartín",        color: "#2E7F72",
    stroll: "After dinner: wander Paseo de la Habana south to see the Bernabéu lit up (15 min), loop back past Mercado de Chamartín's quiet streets, or take a pre-dinner turn around Parque de Berlín. This is residential Madrid — relaxed, local, zero tourists." },
  chamberi:  { label: "Chamberí · Calle Ponzano",     color: "#D96C2C",
    stroll: "The verb is \"ponzanear\": drift bar to bar along Calle Ponzano — El Doble (no. 58) for the pre-dinner caña. With time to spare, stroll 10 min south to Plaza de Olavide, Chamberí's living room, ringed with terraces. Late jazz at Sala Clamores is a short walk; Museo Sorolla is on this side of town too." },
  salamanca: { label: "Salamanca",                    color: "#8E4585",
    stroll: "Perfect early-evening territory: tortilla at the market, then window-shop down Serrano — or the quieter Claudio Coello / Lagasca — to the Puerta de Alcalá, and slip into Retiro for golden hour. Calle de Jorge Juan is the elegant restaurant row; Museo Lázaro Galdiano crowns Serrano at no. 122." },
  centro:    { label: "Centro histórico",             color: "#C0392B",
    stroll: "The classic loop: Sol → San Ginés' alley → under Plaza Mayor's arches → down Cuchilleros past Botín → Cava Baja's tapas mile into La Latina. Or head east: Plaza de Santa Ana and the Huertas lanes for terraces, with Café Central (your Tuesday jazz) on C. del Prado. Sunday morning it's El Rastro." }
};

const GROUP_ORDER = ["home", "chamberi", "salamanca", "centro"];

const VENUES = [
{
  id: "sacha", num: 1, group: "home",
  name: "Sacha",
  tagline: "The bistro where Madrid's chefs eat — Phil's hideaway pick",
  phil: "Basque-influenced classics at Sacha Hormaechea's legendary bistro (since 1972).",
  address: "C. de Juan Hurtado de Mendoza 11 (garden courtyard), 28036 Madrid",
  coords: [40.4596, -3.6842],
  phone: "+34 913 45 59 52",
  price: "€€€€ · ~45–60 pp",
  hours: "Mon–Fri 13:45–16:00 & 20:45–24:00 · closed Sat & Sun",
  status: { ok: false, text: "⚠ Kitchen opens 20:45 — book the first dinner slot instead" },
  agenda: "Already your Monday splurge 🎯",
  booking: "Book online",
  transit: {
    leave: "20:30 for a 20:45 table (12 min walk)",
    steps: [["walk", "Walk 850 m from the residence — down P. de Vergara, right on C. de Alberto Alcocer side streets", "12 min"]],
    total: "12 min on foot — no metro needed"
  },
  links: [
    ["Website", "https://www.restaurantesacha.com/"],
    ["Reserve (CoverManager)", "https://www.covermanager.com/reservation/module_restaurant/restaurante-sacha/english"],
    ["World's 50 Best profile", "https://www.theworlds50best.com/discovery/Establishments/Spain/Madrid/Sacha.html"]
  ]
},
{
  id: "ponzano", num: 2, group: "chamberi",
  name: "Restaurante Ponzano",
  tagline: "Family-run tapas stalwart that gave the street its verb",
  phil: "Tomato with onion, mushroom & egg, octopus, lamb chops and a giant steak.",
  address: "C. de Ponzano 12, 28010 Madrid",
  coords: [40.4375, -3.6996],
  phone: "+34 914 48 68 80",
  price: "€€–€€€ · traditional market cooking since 1986",
  hours: "Mon–Thu 9:00–00:30 · Fri 9:00–01:30 · Sat 11:30–00:30 · Sun 11:30–24:00",
  status: { ok: true, text: "✓ Serving at 19:00 — bar runs all day" },
  agenda: "Fits your Thursday Ponzano crawl, between El Doble and Sala de Despiece",
  booking: "Online / walk-in",
  transit: {
    leave: "18:25",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Avenida de América", "3 stops"],
      ["L7", "L7 dir. Pitis → Alonso Cano", "2 stops"],
      ["walk", "Walk south on Alonso Cano, right on Bretón de los Herreros to Ponzano", "5 min"]
    ],
    total: "~28 min door to door"
  },
  links: [
    ["Website", "https://restauranteponzano.com/"],
    ["Menu (la carta)", "https://restauranteponzano.com/nuestra-cocina/la-carta/"],
    ["Reserve online", "https://restauranteponzano.com/reservas/"]
  ]
},
{
  id: "sala", num: 3, group: "chamberi",
  name: "Sala de Despiece",
  tagline: "Javier Bonet's butcher-lab tapas counter",
  phil: "The deconstructed beef tartare and roasted beet.",
  address: "C. de Ponzano 11, 28010 Madrid",
  coords: [40.4374, -3.6993],
  phone: "+34 917 52 61 06",
  price: "€€€ · ~35–50 pp",
  hours: "Lunch 13:00–16:00 (Fri–Sun to 17:30) · dinner 20:00–00:30 daily",
  status: { ok: false, text: "⚠ Dinner from 20:00 — do a Ponzano-street caña first" },
  agenda: "Already your Thursday splurge stop 🎯",
  booking: "Book online",
  transit: {
    leave: "18:25 (as Ponzano 12 — it's across the street)",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Avenida de América", "3 stops"],
      ["L7", "L7 dir. Pitis → Alonso Cano", "2 stops"],
      ["walk", "Walk 5 min — Ponzano 11 faces no. 12", "5 min"]
    ],
    total: "~28 min door to door"
  },
  links: [
    ["Website", "https://saladedespiece.com/"],
    ["Reserve", "https://www.saladedespiece.com/reservas/"]
  ]
},
{
  id: "barrera", num: 4, group: "chamberi",
  name: "Barrera",
  tagline: "Old-school casa de comidas (Phil's site spells it “Barera”)",
  phil: "Cabrito — roast baby goat — plus patatas revolconas with torreznos.",
  address: "C. de Alonso Cano 25, 28010 Madrid",
  coords: [40.4384, -3.6976],
  phone: "+34 915 94 17 57",
  price: "€€€ · ~40–50 pp",
  hours: "Tue–Sat 13:00–16:00 & 21:00–23:00 · Sun lunch only · closed Mon",
  status: { ok: false, text: "⚠ Dinner from 21:00 — reserve by phone (Spanish helps: practice!)" },
  agenda: "5 min from Ponzano — easy to fold into the Thursday crawl",
  booking: "Phone",
  transit: {
    leave: "18:30",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Avenida de América", "3 stops"],
      ["L7", "L7 dir. Pitis → Alonso Cano", "2 stops"],
      ["walk", "Walk 3 min — the station is on its doorstep", "3 min"]
    ],
    total: "~28 min door to door"
  },
  links: [
    ["Tripadvisor", "https://www.tripadvisor.com/Restaurant_Review-g187514-d7712251-Reviews-Restaurante_Barrera-Madrid.html"],
    ["Madrid à la Carta profile", "https://madridalacarta.com/en-madrid-restaurante/barrera/"]
  ]
},
{
  id: "mo", num: 5, group: "chamberi",
  name: "MO de Movimiento",
  tagline: "Wood-fired pizza & bread in a social-employment project",
  phil: "Sourdough pizza and bread from the wood ovens; the team employs at-risk youth.",
  address: "C. de Espronceda 34, 28003 Madrid",
  coords: [40.4415, -3.6985],
  phone: "+34 667 97 45 99",
  price: "€€–€€€ · card only",
  hours: "Daily 13:00–23:00, kitchen non-stop",
  status: { ok: true, text: "✓ Serving at 19:00 — one of the few good non-stop kitchens" },
  agenda: "Your guide's pick for a low-key evening",
  booking: "Online / walk-in",
  transit: {
    leave: "18:30",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Avenida de América", "3 stops"],
      ["L7", "L7 dir. Pitis → Alonso Cano", "2 stops"],
      ["walk", "Walk north on Alonso Cano, left on Espronceda", "3 min"]
    ],
    total: "~30 min door to door"
  },
  links: [
    ["Website", "https://modemovimiento.com/"],
    ["Menu", "https://qr.gourmeatsapp.com/n/3637"],
    ["Reserve", "https://modemovimiento.myrestoo.net/"]
  ]
},
{
  id: "casadani", num: 6, group: "salamanca",
  name: "Casa Dani · Mercado de la Paz",
  tagline: "Madrid's benchmark tortilla, inside a real neighbourhood market",
  phil: "The famous tortilla de patata at Casa Dani; lemon-smoked oysters at Oh Délice; jamón at La Boolette.",
  address: "C. de Ayala 28 (Mercado de la Paz), 28001 Madrid",
  coords: [40.4272, -3.6861],
  phone: "+34 915 75 59 25",
  price: "€ · tortilla portion a few euros; menú del día at lunch",
  hours: "Market Mon–Fri 9:00–20:00 · Sat 9:00–14:30 · closed Sun",
  status: { ok: true, text: "✓ Open till 20:00 Mon–Fri — but the tortilla can sell out; lunch is prime time" },
  agenda: "Best as a weekday lunch; pairs with StreetXO (2 min away) for a Salamanca double",
  booking: "Walk-in",
  transit: {
    leave: "18:32",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Núñez de Balboa", "4 stops"],
      ["walk", "Walk: Juan Bravo west, left on C. de Lagasca to Ayala", "8 min"]
    ],
    total: "~25 min · alt: bus 29 down P. de Vergara to Goya + 10 min walk"
  },
  links: [
    ["Casa Dani", "https://www.casadani.es/"],
    ["Menu", "https://en.casadani.es/carta"],
    ["Mercado de la Paz", "https://www.mercadodelapaz.com/"]
  ]
},
{
  id: "streetxo", num: 7, group: "salamanca",
  name: "StreetXO",
  tagline: "Dabiz Muñoz unleashed — wild, loud, brilliant",
  phil: "Hamachi sashimi with sea urchin, scallop with gazpacho, duck dumplings with crispy pig ear, roasted octopus, the “dinosaur egg” cocktail.",
  address: "C. de Serrano 47, 3rd floor of El Corte Inglés, 28001 Madrid — ⚠ moved from Serrano 52 (Phil's site is outdated)",
  coords: [40.4272, -3.6881],
  phone: "+34 915 31 98 84",
  price: "€€€–€€€€ · plates 16–30 each",
  hours: "Restaurant daily 13:00–16:00 & 20:00–23:00 · bar from 12:00 non-stop",
  status: { ok: false, text: "⚠ At 19:00: cocktail-bar only; dinner seating from 20:00. No reservations — queue early" },
  agenda: "Neither traditional nor relaxed — go only if curiosity wins (it might)",
  booking: "No bookings — queue",
  transit: {
    leave: "18:30",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Núñez de Balboa", "4 stops"],
      ["walk", "Walk: Juan Bravo west to Serrano, left to no. 47", "10 min"]
    ],
    total: "~27 min · alt: L9 → Av. de América → L4 to Serrano + 6 min walk"
  },
  links: [
    ["Website", "https://streetxo.com/madrid/en"],
    ["esmadrid info", "https://www.esmadrid.com/en/restaurants/streetxo"]
  ]
},
{
  id: "abuelo", num: 8, group: "centro",
  name: "La Casa del Abuelo",
  tagline: "Sizzling gambas al ajillo since 1906",
  phil: "The garlic prawns, bubbling in olive oil, with a glass of their sweet house wine.",
  address: "C. de la Victoria 12 (the 1906 original), 28012 Madrid",
  coords: [40.4162, -3.7015],
  phone: "+34 910 00 01 33",
  price: "€€ · quick, standing or table",
  hours: "Daily ~12:00–24:00, non-stop",
  status: { ok: true, text: "✓ Serving at 19:00 — perfect pre-jazz stop before Café Central (8 min walk)" },
  agenda: "Slots neatly before your Tuesday jazz night",
  booking: "Online / walk-in",
  transit: {
    leave: "18:22",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Núñez de Balboa", "4 stops"],
      ["L5", "L5 dir. Casa de Campo → Gran Vía", "4 stops"],
      ["walk", "Walk via C. de la Montera, cross Sol, left on Victoria", "7 min"]
    ],
    total: "~35 min · alt: L9 north to Plaza de Castilla → L1 to Sol + 3 min"
  },
  links: [
    ["Website", "https://www.lacasadelabuelo.es/"],
    ["Reserve online", "https://www.lacasadelabuelo.es/reservar-la-casa-del-abuelo-es"]
  ]
},
{
  id: "botin", num: 9, group: "centro",
  name: "Sobrino de Botín",
  tagline: "World's oldest restaurant — the oven has burned since 1725",
  phil: "Cochinillo asado (roast suckling pig) from the original wood-fired oven.",
  address: "C. de Cuchilleros 17, 28005 Madrid",
  coords: [40.4140, -3.7083],
  phone: "+34 913 66 42 17",
  price: "€€€€ · cochinillo ~€35",
  hours: "Daily 13:00–16:00 & 20:00–23:30",
  status: { ok: false, text: "⚠ Dinner from 20:00 — book the opening slot; on the tourist path but historically legit" },
  agenda: "Saturday-lunch alternative to the Malacatín cocido — book well ahead",
  booking: "Book well ahead",
  transit: {
    leave: "19:15 for the 20:00 first seating (18:15 if you want a Plaza Mayor stroll first)",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Núñez de Balboa", "4 stops"],
      ["L5", "L5 dir. Casa de Campo → La Latina", "7 stops"],
      ["walk", "Walk up Cava Baja to Plaza Puerta Cerrada, then Cuchilleros", "8 min"]
    ],
    total: "~40 min door to door"
  },
  links: [
    ["Website & menu", "https://botin.es/en/home/"],
    ["Phil's page", "https://www.philrosenthalworld.com/cities/madrid"]
  ]
},
{
  id: "sangines", num: 10, group: "centro",
  name: "Chocolatería San Ginés",
  tagline: "Churros con chocolate, 24 hours a day since 1894",
  phil: "Churros dunked in thick hot chocolate — Phil's breakfast, snack and dessert.",
  address: "Pasadizo de San Ginés 5, 28013 Madrid",
  coords: [40.4166, -3.7067],
  phone: "+34 913 65 65 46",
  price: "€ · churros + chocolate ~€5–6",
  hours: "24 h, 365 days",
  status: { ok: true, text: "✓ Always open — best at a weird hour (post-jazz 00:30 is lovely)" },
  agenda: "Already your Friday post-midnight plan 🎯",
  booking: "Walk-in, 24 h",
  transit: {
    leave: "18:18",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Núñez de Balboa", "4 stops"],
      ["L5", "L5 dir. Casa de Campo → Ópera", "6 stops"],
      ["walk", "Walk 3 min — the pasadizo is off C. del Arenal", "3 min"]
    ],
    total: "~38 min door to door"
  },
  links: [
    ["Website", "https://chocolateriasangines.com/"],
    ["Menu (PDF)", "https://chocolateriasangines.com/CARTA_SANGINES.pdf"]
  ]
},
{
  id: "sanmiguel", num: 11, group: "centro",
  name: "Mercado de San Miguel",
  tagline: "Phil's bonus scene — your guide files it under “Don'ts”",
  phil: "Tapas, oysters and ibérico in the 1916 iron-and-glass hall.",
  address: "Plaza de San Miguel s/n, 28005 Madrid",
  coords: [40.4154, -3.7091],
  phone: "—",
  price: "€€–€€€ · pretty, but tourist-priced",
  hours: "Daily 10:00–24:00 (Fri–Sat to 01:00)",
  status: { ok: true, text: "✓ Open at 19:00 — walk through for the architecture, save your appetite for Botín next door" },
  agenda: "Your real market is Chamartín. Trust the guide on this one 😉",
  booking: "Walk-in",
  transit: {
    leave: "18:15",
    steps: [
      ["walk", "Walk to Colombia", "6 min"],
      ["L9", "L9 dir. Arganda del Rey → Núñez de Balboa", "4 stops"],
      ["L5", "L5 dir. Casa de Campo → Ópera", "6 stops"],
      ["walk", "Walk down C. Mayor to Plaza de San Miguel", "5 min"]
    ],
    total: "~40 min door to door"
  },
  links: [
    ["Website", "https://www.mercadodesanmiguel.es/"]
  ]
}
];

const TEXT = {
  pdf_glance_boxes: [
    { title: "The 19:00 problem (and the fix)", items: [
      "Madrid kitchens mostly reopen <b>20:00–21:00</b>. Sure bets at 19:00: <b>Ponzano (2)</b>, <b>MO (5)</b>, <b>Casa Dani (6, Mon–Fri)</b>, <b>La Casa del Abuelo (8)</b>, <b>San Ginés (10)</b>, <b>San Miguel (11)</b>.",
      "For the rest: arrive 19:00, have a <b>caña on a terrace</b> nearby, walk in for the first seating — the most Madrid move there is.",
      "A 20:30 reservation marks you as a tourist but works fine as a compromise."
    ]},
    { title: "Metro in one minute", items: [
      "<b>Tarjeta Multi</b> (&euro;2.50 at red machines) + <b>10-trip Metrobús</b>; one card validates for both of you.",
      "Metro 6:00–1:30 daily. Later: night buses from Cibeles or Cabify (~&euro;12–15 home).",
      "Golden routes: <b>L9 south</b> to Núñez de Balboa (Salamanca + the L5 nightlife line) · <b>L9 &rarr; Av. de América &rarr; L7</b> for the Ponzano cluster · <b>L8 from Colombia</b> = your 15-min airport link.",
      "Google Maps handles Madrid transit well. Official apps: Metro de Madrid, EMT Madrid."
    ]}
  ],
  pdf_glance_foot: "Compiled from philrosenthalworld.com/cities/madrid and feedphil.com/madrid, cross-checked with official venue sites, July 2026. Schematic maps — distances and positions are approximate; tap any Route button for live directions.",
  pdf_final_sections: [
    { title: "Booking cheat-sheet", items: [
      "<b>Book days ahead:</b> Botín (9), Sacha (1), Sala de Despiece (3) — links on their cards.",
      "<b>Phone only:</b> Barrera (4) — <i>&ldquo;Hola, quería reservar una mesa para dos, el jueves a las nueve de la noche.&rdquo;</i>",
      "<b>No bookings:</b> StreetXO (7) — arrive at 20:00 opening or eat at the bar.",
      "<b>Walk-in fine:</b> Ponzano (2), MO (5), Casa Dani (6), La Casa del Abuelo (8), San Ginés (10), San Miguel (11)."
    ]},
    { title: "Phil × your agenda", items: [
      "<b>Mon 28 Sep</b> — Sacha (1) is already your splurge night. Phil approves.",
      "<b>Tue 29 Sep</b> — La Casa del Abuelo (8) slots in before the Café Central jazz set (8 min walk).",
      "<b>Thu 1 Oct</b> — the Ponzano crawl IS Phil territory: El Doble &rarr; Restaurante Ponzano (2) &rarr; Sala de Despiece (3); Barrera (4) and MO (5) are minutes away.",
      "<b>Fri 2 Oct</b> — post-midnight churros at San Ginés (10), exactly as planned.",
      "<b>Sat 3 Oct</b> — Botín (9) lunch is the alternative to Malacatín's cocido; San Miguel (11) is a look-not-eat stop nearby.",
      "<b>Weekday lunch</b> — Casa Dani (6) + StreetXO bar (7) make a Salamanca double, 2 min apart."
    ]},
    { title: "Mind the details", items: [
      "<b>StreetXO moved:</b> Phil's site still says Serrano 52 — it is now <b>Serrano 47, 3rd floor of El Corte Inglés</b>.",
      "<b>Sacha closes weekends</b>; Barrera closes Monday; Casa Dani &amp; Mercado de la Paz close Sunday (Sat from 14:30).",
      "Your guide files Mercado de San Miguel under &ldquo;Don'ts&rdquo; — Phil's bonus scene is the reason it's here at all. Walk through, spend your appetite elsewhere.",
      "Companion file: the interactive HTML guide (same content, live maps) — WhatsApp it to Niels; it opens in any browser."
    ]}
  ],
  pdf_final_foot: "Sources: philrosenthalworld.com/cities/madrid · feedphil.com/madrid · official venue websites &amp; esmadrid.com (all verified July 2026) · Schematic maps by Claude · &iexcl;Buen provecho!",
  site_practical_boxes: [
    { title: "🎫 Metro in one minute", items: [
      "Buy a <b>Tarjeta Multi</b> (€2.50) at any red machine; load a <b>10-trip Metrobús</b>. One card validates for <b>both of you</b>.",
      "Metro runs 6:00–1:30 daily. After that: night buses from Cibeles or a Cabify (~€12–15 home, fine split in two).",
      "Your golden routes: <b>L9 south</b> to Núñez de Balboa (Salamanca &amp; the L5 nightlife line) and <b>L9 → Av. de América → L7</b> for the Ponzano cluster.",
      "Google Maps handles Madrid transit well; official apps: Metro de Madrid &amp; EMT Madrid."
    ]},
    { title: "🕰 The 19:00 problem (and fix)", items: [
      "Madrid kitchens mostly reopen <b>20:00–21:00</b>. At 19:00 the sure bets are: <b>Ponzano (2)</b>, <b>MO (5)</b>, <b>Casa Dani (6, Mon–Fri)</b>, <b>Casa del Abuelo (8)</b>, <b>San Ginés (10)</b> and <b>San Miguel (11)</b>.",
      "For the rest: arrive 19:00, do a <b>caña + terrace</b> nearby, then walk in for the first seating — the most Madrid move there is.",
      "A 20:30 reservation marks you as a tourist but works fine as a compromise."
    ]},
    { title: "📌 Booking cheat-sheet", items: [
      "<b>Book days ahead:</b> Botín (9), Sacha (1), Sala de Despiece (3).",
      "<b>Phone only:</b> Barrera (4) — “Hola, quería reservar una mesa para dos…”",
      "<b>No bookings, queue:</b> StreetXO (7) — go at opening (20:00) or eat at the bar.",
      "<b>Walk-ins fine:</b> 2, 5, 6, 8, 10, 11."
    ]},
    { title: "📲 Share this guide", items: [
      "This is a <b>single file</b> — WhatsApp/email it to Niels; it opens in any browser, phone or laptop (internet needed for map tiles only).",
      "Companion <b>PDF</b> works fully offline — keep it on your phone for the metro.",
      "Every card's <b>Route</b> button opens live transit directions in Google Maps."
    ]}
  ],
  site_foot: 'Compiled from <a href="https://www.philrosenthalworld.com/cities/madrid">philrosenthalworld.com/cities/madrid</a> and <a href="https://feedphil.com/madrid">feedphil.com/madrid</a>, cross-checked against official venue sites, July 2026 · Map data © OpenStreetMap contributors · Made for Mark &amp; Niels — ¡buen provecho!'
};

const LINE_PILL_COLORS = {
  walk: "#8B8378",
  L9: "#A60084",
  L7: "#F3721C",
  L5: "#96BF0D",
  L1: "#2FA8E0",
  L4: "#824100",
  L8: "#F49FC3"
};

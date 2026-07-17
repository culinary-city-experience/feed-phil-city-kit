// Somebody Feed Phil — <CITY NAME>. Data verified <DATE>.
// Sources: philrosenthalworld.com/cities/<city> + feedphil.com/<city> + official sites.
//
// This is a blank starting skeleton — see ../example-madrid/city.js for a
// complete filled-in example, and ../template/SCHEMA.md for field docs.

const CITY = {
  name: "City Name",
  kicker: "SOMEBODY FEED PHIL × CITY NAME · DATE RANGE",
  title: "Eat Like Phil in City Name",
  subtitle: "All N stops from Phil Rosenthal's <City> episode — verified <date>, mapped, and wired into your agenda. For <names>.",
  base_note: "<b>Base:</b> <address> · <transit note>. All “leave by” times target <HH:MM> arrival. <honesty note about local dining hours>",
  from_label: "From your base",
  arrive_label: "arrive HH:MM",
  glance_status_header: "Serving at HH:MM?",
  origin: "Full lodging address, City, Country",
  hotel_legend: "Your base",
  legend_lines: [
    // ["L1", "#2FA8E0"],
  ]
};

const HOTEL = {
  name: "Your base: <name/description>",
  address: "Full address",
  coords: [0.0, 0.0],
  stations: "Nearest stations/stops and walking time"
};

const GROUPS = {
  // groupid: {
  //   label: "Display name · optional subtitle",
  //   color: "#HEXCOLOR",
  //   stroll: "2-4 sentence atmosphere/wander tip for this neighbourhood."
  // },
};

const GROUP_ORDER = [
  // "groupid1", "groupid2", ...
];

const VENUES = [
  // {
  //   id: "shortid", num: 1, group: "groupid",
  //   name: "Venue Name",
  //   tagline: "One-line hook",
  //   phil: "What Phil ate/did here.",
  //   address: "Full address",
  //   coords: [0.0, 0.0],
  //   phone: "+XX XXX XXX XXX",
  //   price: "€€€ · ~30-45 pp",
  //   hours: "Human-readable hours",
  //   status: { ok: true, text: "✓ Serving at HH:MM" },
  //   agenda: "Optional fit-to-plans note",
  //   booking: "Book online / Phone only / Walk-in / No bookings",
  //   transit: {
  //     leave: "HH:MM",
  //     steps: [ ["walk", "Description", "N min"] ],
  //     total: "~N min door to door"
  //   },
  //   links: [ ["Website", "https://..."] ]
  // },
];

const TEXT = {
  pdf_glance_boxes: [
    // { title: "...", items: ["...", "..."] },
  ],
  pdf_glance_foot: "Sources & methodology line.",
  pdf_final_sections: [
    // { title: "Booking cheat-sheet", items: ["..."] },
  ],
  pdf_final_foot: "Sources list + sign-off.",
  site_practical_boxes: [
    // { title: "...", items: ["..."] },
  ],
  site_foot: "Full HTML footer content."
};

const LINE_PILL_COLORS = {
  walk: "#8B8378"
  // L1: "#2FA8E0", ...
};

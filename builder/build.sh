#!/usr/bin/env bash
# Build the PDF + HTML deliverables for one city.
#
# Usage:
#   build.sh <city-folder>
#
# <city-folder> must contain city.js and city_geo.json (see
# ../template/SCHEMA.md and ../example-madrid/ for the shape of both).
# Outputs (city.json, maps.json, pdf.html, Feed-Phil-<City>.pdf,
# Feed-Phil-<City>.html) are written into the same folder.
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <city-folder>" >&2
  exit 1
fi

CITY_DIR="$(cd "$1" && pwd)"
KIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ ! -f "$CITY_DIR/city.js" ] || [ ! -f "$CITY_DIR/city_geo.json" ]; then
  echo "Error: $CITY_DIR must contain both city.js and city_geo.json" >&2
  exit 1
fi

echo "== Building in $CITY_DIR =="
cd "$CITY_DIR"

echo "-- city.js -> city.json"
node -e "$(cat city.js); console.log(JSON.stringify({CITY,HOTEL,GROUPS,VENUES,TEXT,GROUP_ORDER,LINE_PILL_COLORS}))" > city.json

if [ -n "${GEOAPIFY_API_KEY:-}" ] || [ -n "${MAPBOX_ACCESS_TOKEN:-}" ]; then
  echo "-- fetch_basemaps.py -> basemaps/ (live map credential detected)"
  python3 "$KIT_DIR/fetch_basemaps.py" . || echo "   (basemap fetch failed — continuing with schematic maps)"
elif [ -d "basemaps" ] && compgen -G "basemaps/*.png" > /dev/null; then
  echo "-- basemaps/ already present ($(ls basemaps/*.png | wc -l | tr -d ' ') PNGs) — reusing"
else
  echo "-- no GEOAPIFY_API_KEY / MAPBOX_ACCESS_TOKEN and no basemaps/ — schematic maps (see ../LIVE_MAPS.md)"
fi

echo "-- gen_maps.py -> maps.json"
python3 "$KIT_DIR/gen_maps.py"

echo "-- gen_pdf.py -> Feed-Phil-<City>.pdf"
python3 "$KIT_DIR/gen_pdf.py"

echo "-- site_template.html + city.js -> Feed-Phil-<City>.html"
python3 - <<PY
tpl = open("$KIT_DIR/site_template.html").read()
data = open("city.js").read()
import json
cityname = json.load(open("city.json"))["CITY"]["name"].replace(" ", "-")
open(f"Feed-Phil-{cityname}.html", "w").write(tpl.replace("/*__DATA__*/", data))
print(f"-> Feed-Phil-{cityname}.html")
PY

echo "== Done =="

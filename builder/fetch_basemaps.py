#!/usr/bin/env python3
"""
Feed-Phil city kit — live basemap fetcher (OPTIONAL).

Downloads a real map image per SVG map (the overview + one per neighbourhood
group) from a static-map provider, sized and framed to exactly match the
bounding box each map already uses in city_geo.json. gen_maps.py picks these
up automatically: if a PNG exists for a given map, it's composited in as the
background and the hand-drawn street/park layer is skipped; the transit
lines, stations, landmarks, pins, hotel marker, scale bar and north arrow
are drawn on top either way. No PNG present -> nothing changes, you get
today's schematic maps.

Two providers are supported, either is fine:
  geoapify  Free tier: no credit card, 3,000 map credits/day (a basic
            static map is ~2-3 credits, so a whole city costs a handful).
            Sign up: https://www.geoapify.com/
  mapbox    Free tier: 50,000 Static Images API requests/month, no credit
            card to start. Sign up: https://www.mapbox.com/ (use the
            "Default public token" from your account page, or a scoped one).

Deliberately stdlib-only (urllib, json, os) so this can run anywhere with
internet access and no pip installs — including via the Claude desktop
device bridge (device_bash) when this sandbox's own network can't reach
outside map services.

Usage:
    export GEOAPIFY_API_KEY=your_key_here       # geoapify.com, free, no card
    # or:
    export MAPBOX_ACCESS_TOKEN=your_token_here  # mapbox.com, free, no card
    python3 fetch_basemaps.py <city-folder>     # needs city_geo.json there

Or pass credentials directly:
    python3 fetch_basemaps.py <city-folder> --api-key your_geoapify_key
    python3 fetch_basemaps.py <city-folder> --mapbox-token your_mapbox_token

If both are set/passed, geoapify is used by default — force one with:
    python3 fetch_basemaps.py <city-folder> --provider mapbox

Optional:
    --style STYLE          Geoapify style (default: osm-bright-grey).
                            osm-bright-grey | osm-bright | osm-carto |
                            osm-liberty | toner-grey (near-monochrome)
    --mapbox-style STYLE   Mapbox style id (default: light-v11).
                            light-v11 | streets-v12 | outdoors-v12 |
                            navigation-day-v1
    --overwrite            re-fetch even if a PNG already exists for a map

See ../LIVE_MAPS.md for the full setup story, including the desktop-bridge
alternative for when you'd rather not use an API key at all, and why raw
OpenStreetMap tile access isn't offered as a third provider here.
"""
import json, os, sys, argparse, urllib.request, urllib.error, urllib.parse, math

def eprint(*a): print(*a, file=sys.stderr)

def bbox_and_size(bounds, width):
    """Shared math: derive height from bounds so the fetched image lines up
    1:1 with gen_maps.py's vector overlay, whichever provider is used."""
    lat_min, lat_max, lon_min, lon_max = bounds
    m_per_lat = 110574.0
    m_per_lon = 111320.0 * math.cos(math.radians((lat_min + lat_max) / 2))
    w_m = (lon_max - lon_min) * m_per_lon
    h_m = (lat_max - lat_min) * m_per_lat
    height = max(1, round(width * h_m / w_m))
    return lat_min, lat_max, lon_min, lon_max, height

def geoapify_url(bounds, width, style, api_key):
    lat_min, lat_max, lon_min, lon_max, height = bbox_and_size(bounds, width)
    params = {
        "style": style, "width": str(width), "height": str(height),
        "format": "png", "area": f"rect:{lon_min},{lat_min},{lon_max},{lat_max}",
        "apiKey": api_key,
    }
    return "https://maps.geoapify.com/v1/staticmap?" + urllib.parse.urlencode(params), height

def mapbox_url(bounds, width, style, token):
    lat_min, lat_max, lon_min, lon_max, height = bbox_and_size(bounds, width)
    bbox = f"[{lon_min},{lat_min},{lon_max},{lat_max}]"
    path = urllib.parse.quote(bbox, safe="[],.-")
    qs = urllib.parse.urlencode({"access_token": token})
    url = f"https://api.mapbox.com/styles/v1/mapbox/{style}/static/{path}/{width}x{height}?{qs}"
    return url, height

def main():
    ap = argparse.ArgumentParser(description="Fetch live basemap PNGs for a city's maps.")
    ap.add_argument("city_dir", help="Folder containing city_geo.json")
    ap.add_argument("--provider", choices=["geoapify", "mapbox"], default=None,
                     help="Force a provider. Default: whichever credential is set "
                          "(geoapify wins if both are).")
    ap.add_argument("--api-key", default=os.environ.get("GEOAPIFY_API_KEY"),
                     help="Geoapify API key (or set GEOAPIFY_API_KEY env var)")
    ap.add_argument("--mapbox-token", default=os.environ.get("MAPBOX_ACCESS_TOKEN"),
                     help="Mapbox access token (or set MAPBOX_ACCESS_TOKEN env var)")
    ap.add_argument("--style", default="osm-bright-grey",
                     help="Geoapify map style (default: osm-bright-grey)")
    ap.add_argument("--mapbox-style", default="light-v11",
                     help="Mapbox style id (default: light-v11)")
    ap.add_argument("--overwrite", action="store_true",
                     help="Re-download even if the PNG already exists")
    ap.add_argument("--timeout", type=int, default=25, help="Per-request timeout, seconds")
    args = ap.parse_args()

    provider = args.provider
    if not provider:
        if args.api_key:
            provider = "geoapify"
        elif args.mapbox_token:
            provider = "mapbox"

    if provider == "geoapify" and not args.api_key:
        eprint("Provider is geoapify but no key given. Set GEOAPIFY_API_KEY or pass --api-key.")
        sys.exit(1)
    if provider == "mapbox" and not args.mapbox_token:
        eprint("Provider is mapbox but no token given. Set MAPBOX_ACCESS_TOKEN or pass --mapbox-token.")
        sys.exit(1)
    if not provider:
        eprint("No credentials found. Set one of:")
        eprint("  GEOAPIFY_API_KEY       free, no card: https://www.geoapify.com/")
        eprint("  MAPBOX_ACCESS_TOKEN    free, no card: https://www.mapbox.com/")
        eprint("Nothing fetched — gen_maps.py will fall back to schematic maps, which is fine.")
        sys.exit(1)

    geo_path = os.path.join(args.city_dir, "city_geo.json")
    if not os.path.isfile(geo_path):
        eprint(f"Error: {geo_path} not found.")
        sys.exit(1)
    G = json.load(open(geo_path))

    out_dir = os.path.join(args.city_dir, "basemaps")
    os.makedirs(out_dir, exist_ok=True)

    jobs = []  # (output_name, bounds[lat_min,lat_max,lon_min,lon_max], width)
    ov = G["overview"]
    jobs.append(("overview", ov["bounds"], ov.get("width", 760)))
    for gid, A in G.get("areas", {}).items():
        jobs.append((f"area_{gid}", A["bounds"], A.get("width", 640)))

    if not jobs:
        eprint("No maps defined in city_geo.json (empty 'overview'/'areas') — nothing to fetch.")
        sys.exit(0)

    print(f"provider: {provider}"
          + (f" (style={args.style})" if provider == "geoapify" else f" (style={args.mapbox_style})"))

    ok, skipped, failed = 0, 0, 0
    for name, bounds, width in jobs:
        out_path = os.path.join(out_dir, f"{name}.png")
        if os.path.isfile(out_path) and not args.overwrite:
            print(f"skip  {name}.png (exists — use --overwrite to refetch)")
            skipped += 1
            continue

        if provider == "geoapify":
            url, height = geoapify_url(bounds, width, args.style, args.api_key)
        else:
            url, height = mapbox_url(bounds, width, args.mapbox_style, args.mapbox_token)

        try:
            req = urllib.request.Request(url, headers={"User-Agent": "feed-phil-city-kit/1.0"})
            with urllib.request.urlopen(req, timeout=args.timeout) as resp:
                data = resp.read()
            if not data.startswith(b"\x89PNG"):
                raise ValueError("response wasn't a PNG — check the API key/token / response body")
            with open(out_path, "wb") as f:
                f.write(data)
            print(f"OK    {name}.png  ({width}x{height}, {len(data)} bytes)")
            ok += 1
        except urllib.error.HTTPError as e:
            eprint(f"FAIL  {name}: HTTP {e.code} — {e.read()[:200]}")
            failed += 1
        except Exception as e:
            eprint(f"FAIL  {name}: {e}")
            failed += 1

    print(f"\n{ok} fetched, {skipped} skipped, {failed} failed -> {out_dir}/")
    if failed and ok == 0:
        eprint("All fetches failed — gen_maps.py will fall back to schematic maps.")
        sys.exit(1)

if __name__ == "__main__":
    main()

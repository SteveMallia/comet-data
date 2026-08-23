#!/usr/bin/env python3
"""
fetch_comets.py — Ontario Telescope Comet Tracker

Queries NASA JPL Horizons once per comet and writes a single comets.json
for the Comet Tracker page to read. Runs on a schedule from GitHub Actions;
the page itself never talks to JPL.

Usage:
    python fetch_comets.py --out comets.json

Exit codes:
    0  all comets fetched
    1  some comets failed (JSON still written, stale entries preserved)
    2  nothing fetched at all (JSON NOT overwritten)
"""

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

HORIZONS = "https://ssd.jpl.nasa.gov/api/horizons.api"

# Horizons designations.
#
# NOTE: the CAP and NOFRAG keywords stopped working in August 2026 —
# Horizons now parses them as filter expressions and rejects the request
# with "Missing operator in \"AP\"". Long-period comets have a single orbit
# solution and work with a bare "DES=...;". Periodic comets may return a
# list of apparition records; see resolve_record() below.
COMETS = [
    ("220P",    "DES=220P;"),
    ("10P",     "DES=10P;"),
    ("88P",     "DES=88P;"),
    ("78P",     "DES=78P;"),
    ("29P",     "DES=29P;"),
    ("169P",    "DES=169P;"),
    ("2025R3",  "DES=C/2025 R3;"),
    ("2024J3",  "DES=C/2024 J3;"),
    ("2023R1",  "DES=C/2023 R1;"),
    ("260P",    "DES=260P;"),
    ("2024R4",  "DES=C/2024 R4;"),
    ("63P",     "DES=63P;"),
    ("2026A2",  "DES=C/2026 A2;"),
    ("161P",    "DES=161P;"),
]

DAYS_BACK, DAYS_FORWARD = 14, 60
MONTHS = {m: i + 1 for i, m in enumerate(
    "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}


def horizons_url(des, start, stop):
    q = {
        "format": "text",
        "COMMAND": f"'{des}'",   # des may be a designation or a record number
        "OBJ_DATA": "NO",
        "MAKE_EPHEM": "YES",
        "EPHEM_TYPE": "OBSERVER",
        "CENTER": "'500@399'",          # geocentric; the page does alt/az itself
        "START_TIME": f"'{start}'",
        "STOP_TIME": f"'{stop}'",
        "STEP_SIZE": "'1 d'",
        "QUANTITIES": "'1,9,19,20,23'",  # RA/Dec, mag, r, delta, elongation
        "CSV_FORMAT": "YES",
        "ANG_FORMAT": "DEG",
    }
    return HORIZONS + "?" + urllib.parse.urlencode(q)


def to_jd(dt):
    return dt.timestamp() / 86400.0 + 2440587.5


def parse_date(s):
    # "2026-Aug-09 00:00"
    try:
        date_part = s.split()[0]
        y, mon, d = date_part.split("-")
        hh, mm = (s.split()[1].split(":") + ["0"])[:2] if len(s.split()) > 1 else ("0", "0")
        return datetime(int(y), MONTHS[mon], int(d), int(hh), int(mm), tzinfo=timezone.utc)
    except (ValueError, KeyError, IndexError):
        return None


def record_listing(body):
    """Parse Horizons' 'matching small-bodies' table.

    A periodic comet has one orbit solution per apparition, so a bare
    designation returns a list rather than an ephemeris, e.g.

        Record #  Epoch-yr  >MATCH NAME<
        --------  --------  -----------------------
        900033      1867    10P/Tempel 2
        900045      2026    10P/Tempel 2

    CAP used to pick the current one; it now errors. So take the record
    with the latest epoch year instead.
    """
    best = None
    for line in body.splitlines():
        m = re.match(r"\s*(\d{6,9})\s+(\d{4})\s+(\S.*)$", line)
        if not m:
            continue
        rec, year = m.group(1), int(m.group(2))
        if best is None or year > best[1]:
            best = (rec, year, m.group(3).strip())
    return best


def resolve(des, start, stop):
    """Return (ephemeris_text, record_used, error).

    One request for a long-period comet. Two for a periodic comet: one to
    get the record list, one for the chosen apparition.
    """
    text, err = fetch(des, start, stop)
    if text is None:
        return None, None, err
    if "$$SOE" in text:
        return text, None, None                    # single match, done

    hit = record_listing(text)
    if hit is None:
        head = [l.strip()[:90] for l in text.strip().splitlines()[:25]
                if l.strip() and set(l.strip()) != {"*"}]
        return None, None, ("no ephemeris and no parsable record list; "
                            f"response began: {head[:6]}")

    rec, year, name = hit
    text2, err2 = fetch(rec, start, stop)
    if text2 is None:
        return None, rec, f"record {rec} ({year}) fetch failed: {err2}"
    if "$$SOE" not in text2:
        msg = [l.strip() for l in text2.strip().splitlines()[2:]
               if l.strip() and set(l.strip()) != {"*"}]
        return None, rec, f"record {rec} ({year}) returned no ephemeris: {(msg[:1] or ['?'])[0][:70]}"
    return text2, rec, None


def find_header(head_text):
    """Locate the column-header line in everything preceding $$SOE.

    Horizons puts a rule of asterisks between the header and $$SOE, so the
    header is not the last line — it must be found by content. Searching
    backwards takes the ephemeris header rather than any earlier line that
    happens to mention R.A.
    """
    lines = head_text.strip().splitlines()
    for line in reversed(lines):
        s = line.strip()
        if not s or set(s) <= {"*"}:
            continue
        if "," not in s:
            continue
        low = s.lower()
        if "date__" in low or ("r.a." in low and s.count(",") >= 3):
            return [h.strip() for h in s.split(",")]
    return None


def parse(text):
    """Extract rows between $$SOE/$$EOE, indexing columns by header name.

    Column order is NOT fixed across Horizons versions, and `r`/`delta` sit
    immediately beside `rdot`/`deldot`. Matching headers exactly rather than
    by position is what stops those being silently swapped.
    """
    if "$$SOE" not in text or "$$EOE" not in text:
        return None, "no ephemeris block in response"

    head, rest = text.split("$$SOE", 1)
    block = rest.split("$$EOE", 1)[0]

    header = find_header(head)
    if header is None:
        tail = [l.strip()[:70] for l in head.strip().splitlines()[-4:]]
        return None, f"no column header found before $$SOE; last lines were {tail}"

    def starts(prefix):
        for i, h in enumerate(header):
            if h.lower().startswith(prefix):
                return i
        return -1

    def exact(name):
        for i, h in enumerate(header):
            if h == name:
                return i
        return -1

    # Horizons labels quantity 9 differently by object class:
    #   asteroids/planets -> "APmag"  "S-brt"
    #   comets            -> "T-mag"  "N-mag"
    # T-mag is the whole coma; N-mag is the central condensation. Looking
    # only for "APmag" silently discards every comet magnitude.
    idx = {
        "ra": starts("r.a"), "dec": starts("dec"),
        "mag": starts("t-mag") if starts("t-mag") >= 0 else starts("apmag"),
        "nmag": starts("n-mag"),
        "r": exact("r"), "delta": exact("delta"), "elong": starts("s-o-t"),
    }
    if idx["ra"] < 0 or idx["dec"] < 0:
        return None, f"could not locate RA/Dec columns in header: {header[:8]}"

    rows = []
    for line in block.strip().splitlines():
        cells = [c.strip() for c in line.split(",")]
        if len(cells) < 4:
            continue
        dt = parse_date(cells[0])
        if dt is None:
            continue

        def num(key):
            i = idx[key]
            if i < 0 or i >= len(cells) or cells[i] in ("", "n.a."):
                return None
            try:
                return float(cells[i])
            except ValueError:
                return None

        ra = num("ra")
        if ra is None:
            continue
        rows.append({
            "jd": round(to_jd(dt), 6),
            "ra": ra, "dec": num("dec"),
            "mag": num("mag"),      # T-mag: whole coma
            "nmag": num("nmag"),    # N-mag: central condensation
            "r": num("r"), "delta": num("delta"), "elong": num("elong"),
        })

    if not rows:
        return None, "ephemeris block contained no usable rows"
    return rows, None


SBDB = "https://ssd-api.jpl.nasa.gov/sbdb.api"


def fetch_sbdb(des):
    """Pull the published magnitude-law parameters for one comet.

    M1/K1 give total (coma) magnitude, M2/K2 give nuclear magnitude, via
    the standard IAU model:

        T-mag = M1 + 5*log10(delta) + K1*log10(r)
        N-mag = M2 + 5*log10(delta) + K2*log10(r)

    JPL fits these to the full set of MPC-reported observations. They are
    US federal government work and carry no licence restriction, which is
    the entire point of using them.
    """
    # Strip the Horizons record qualifiers; SBDB wants a bare designation.
    d = des.replace("DES=", "").split(";")[0]
    url = SBDB + "?" + urllib.parse.urlencode({"sstr": d, "phys-par": "1"})
    try:
        req = urllib.request.Request(
            url, headers={"User-Agent": "OntarioTelescope-CometTracker/1.0"})
        with urllib.request.urlopen(req, timeout=45) as r:
            data = json.loads(r.read().decode("utf-8", "replace"))
    except Exception as exc:                          # noqa: BLE001
        return None, f"{type(exc).__name__}: {exc}"

    out = {}
    for p in (data.get("phys_par") or []):
        name = (p.get("name") or "").upper()
        if name in ("M1", "K1", "M2", "K2", "PC"):
            try:
                out[name.lower()] = float(p.get("value"))
            except (TypeError, ValueError):
                pass
    orb = data.get("orbit") or {}
    for el in (orb.get("elements") or []):
        if el.get("name") in ("q", "e", "per", "tp"):
            try:
                out[el["name"]] = float(el.get("value"))
            except (TypeError, ValueError):
                pass
    if not out:
        return None, "no physical parameters returned"
    return out, None


def sanity_check(cid, rows):
    """Catch a response that parsed but is nonsense before it reaches the page."""
    problems = []
    if len(rows) < 30:
        problems.append(f"only {len(rows)} rows")
    for r in rows:
        if not (0 <= r["ra"] < 360):
            problems.append(f"RA out of range: {r['ra']}")
            break
    for r in rows:
        if r["dec"] is None or not (-90 <= r["dec"] <= 90):
            problems.append(f"Dec out of range: {r['dec']}")
            break
    # a comet should not jump more than a few degrees a day
    for a, b in zip(rows, rows[1:]):
        d = abs(b["ra"] - a["ra"])
        d = min(d, 360 - d)
        if d > 15:
            problems.append(f"implausible daily motion: {d:.1f} deg")
            break
    return problems


def fetch(des, start, stop, attempts=3):
    url = horizons_url(des, start, stop)
    last = "unknown error"
    for n in range(attempts):
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "OntarioTelescope-CometTracker/1.0"})
            with urllib.request.urlopen(req, timeout=60) as resp:
                return resp.read().decode("utf-8", "replace"), None
        except Exception as exc:                      # noqa: BLE001
            last = f"{type(exc).__name__}: {exc}"
            if n < attempts - 1:
                # Back off hard. If JPL is throttling, hammering makes it worse.
                time.sleep(10 * (n + 1))
    return None, last


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="comets.json")
    ap.add_argument("--sbdb", action="store_true",
                    help="also fetch magnitude-law parameters from the Small-Body "
                         "Database. Off by default: it doubles the number of requests "
                         "to JPL and the page does not currently use the result.")
    args = ap.parse_args()

    now = datetime.now(timezone.utc)
    start = (now - timedelta(days=DAYS_BACK)).strftime("%Y-%m-%d")
    stop = (now + timedelta(days=DAYS_FORWARD)).strftime("%Y-%m-%d")

    # Keep whatever we had, so one bad comet doesn't blank an existing entry.
    try:
        with open(args.out, encoding="utf-8") as fh:
            previous = json.load(fh).get("ephemerides", {})
    except (OSError, ValueError):
        previous = {}

    out, ok, failed, stale = {}, [], [], []
    phys, records = {}, {}

    for cid, des in COMETS:
        if args.sbdb:
            pp, perr = fetch_sbdb(des)
            if pp:
                phys[cid] = pp
            else:
                # Never fatal: the ephemeris already carries T-mag, which is
                # what the page reads. This is supplementary only.
                print(f"  {cid:8} sbdb skipped: {perr}")

        text, rec, err = resolve(des, start, stop)
        if rec:
            records[cid] = rec
        if text is None:
            print(f"  {cid:8} FETCH FAILED  {err}", file=sys.stderr)
            failed.append(cid)
        else:
            rows, perr = parse(text)
            if rows is None:
                print(f"  {cid:8} PARSE FAILED  {perr}", file=sys.stderr)
                failed.append(cid)
            else:
                problems = sanity_check(cid, rows)
                if problems:
                    print(f"  {cid:8} REJECTED  {'; '.join(problems)}", file=sys.stderr)
                    failed.append(cid)
                else:
                    out[cid] = rows
                    tag = f" (record {records[cid]})" if cid in records else ""
                    print(f"  {cid:8} ok  {len(rows)} rows{tag}")
                    ok.append(cid)

        if cid not in out and cid in previous:
            out[cid] = previous[cid]
            stale.append(cid)
        time.sleep(2)                                 # pace it: ~1 request / 2s

    if not ok:
        print("\nNothing fetched — leaving the existing file untouched.", file=sys.stderr)
        print("All requests failed. If the errors above are HTTP 429/503, JPL is "
              "throttling; wait an hour and retry rather than re-running immediately.",
              file=sys.stderr)
        return 2

    payload = {
        "generated": now.isoformat(timespec="seconds"),
        "source": "NASA/JPL Horizons and JPL Small-Body Database (public domain)",
        "window": {"start": start, "stop": stop},
        "ok": ok, "failed": failed, "reused_previous": stale,
        "physical": phys,
        "records": records,
        "ephemerides": out,
    }
    with open(args.out, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, separators=(",", ":"))

    size = len(json.dumps(payload, separators=(",", ":"))) / 1024
    print(f"\nWrote {args.out} — {len(ok)} fresh, {len(stale)} reused, "
          f"{len(failed)} failed, {size:.0f} KB")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())

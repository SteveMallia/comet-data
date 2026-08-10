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
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

HORIZONS = "https://ssd.jpl.nasa.gov/api/horizons.api"

# Horizons designations. CAP selects the latest orbit solution;
# NOFRAG keeps a periodic comet from matching its own fragments.
COMETS = [
    ("220P",    "DES=220P;CAP;NOFRAG"),
    ("10P",     "DES=10P;CAP;NOFRAG"),
    ("88P",     "DES=88P;CAP;NOFRAG"),
    ("78P",     "DES=78P;CAP;NOFRAG"),
    ("29P",     "DES=29P;CAP;NOFRAG"),
    ("169P",    "DES=169P;CAP;NOFRAG"),
    ("2025R3",  "DES=C/2025 R3;CAP"),
    ("2024J3",  "DES=C/2024 J3;CAP"),
    ("2023R1",  "DES=C/2023 R1;CAP"),
    ("260P",    "DES=260P;CAP;NOFRAG"),
    ("2024R4",  "DES=C/2024 R4;CAP"),
    ("63P",     "DES=63P;CAP;NOFRAG"),
    ("2026A2",  "DES=C/2026 A2;CAP"),
    ("161P",    "DES=161P;CAP;NOFRAG"),
]

DAYS_BACK, DAYS_FORWARD = 14, 60
MONTHS = {m: i + 1 for i, m in enumerate(
    "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split())}


def horizons_url(des, start, stop):
    q = {
        "format": "text",
        "COMMAND": f"'{des}'",
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

    idx = {
        "ra": starts("r.a"), "dec": starts("dec"), "mag": starts("apmag"),
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
            "ra": ra, "dec": num("dec"), "mag": num("mag"),
            "r": num("r"), "delta": num("delta"), "elong": num("elong"),
        })

    if not rows:
        return None, "ephemeris block contained no usable rows"
    return rows, None


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
                time.sleep(3 * (n + 1))               # be polite to a NASA service
    return None, last


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="comets.json")
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

    for cid, des in COMETS:
        text, err = fetch(des, start, stop)
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
                    print(f"  {cid:8} ok  {len(rows)} rows")
                    ok.append(cid)

        if cid not in out and cid in previous:
            out[cid] = previous[cid]
            stale.append(cid)
        time.sleep(1)                                 # ~1 req/sec

    if not ok:
        print("\nNothing fetched — leaving the existing file untouched.", file=sys.stderr)
        return 2

    payload = {
        "generated": now.isoformat(timespec="seconds"),
        "source": "NASA/JPL Horizons",
        "window": {"start": start, "stop": stop},
        "ok": ok, "failed": failed, "reused_previous": stale,
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

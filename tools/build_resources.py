# Construiește biblioteca de resurse externe a aplicației din cataloagele cercetării.
#
#   python tools/build_resources.py "research_notes/Resurse învățare data engineering" app/assets
#
# Citește tabelele markdown din notițe (secțiuni „deck `x`” / „exam: x”), păstrează
# doar rândurile cu URL și scrie app/assets/resources156.js. Dacă există
# app/assets/resources-status156.json (rezultatul verificării automate a linkurilor),
# starea HTTP a fiecărui link e inclusă.
import datetime, glob, json, os, re, sys

notes_dir, assets = sys.argv[1], sys.argv[2]

COLS = {
    "title": ["title", "titlu"], "url": ["url"], "provider": ["provider", "furnizor"],
    "type": ["type", "tip"], "level": ["level", "nivel"], "lang": ["lang", "limbă", "limba"],
    "cost": ["cost", "cost/license", "cost/licență"], "summary": ["rezumat", "summary"],
    "status": ["status", "ver.", "stare url", "stare", "status url"],
}
DECK_RE = re.compile(r"(?:deck|Deck)\s*[:`]*\s*`?([a-z0-9]+)`?|exam:\s*`?([a-z0-9]+)`?")


def colmap(header):
    out = {}
    for i, h in enumerate(header):
        k = h.strip().lower()
        for name, alts in COLS.items():
            if name not in out and any(k == a or k.startswith(a) for a in alts):
                out[name] = i
    return out


def verif(raw):
    s = (raw or "").strip().upper()
    if not s:
        return "unknown"
    if "!" in s:
        return "problem"
    first = re.sub(r"[\[\]()]", " ", s).split()
    tag = first[0] if first else ""
    if tag in ("F", "FETCHED"):
        return "fetched"
    if tag in ("S", "IDX", "I"):
        return "search"
    return "memory"


LEVELS = {"b": "începător", "beg": "începător", "beginner": "începător", "începător": "începător",
          "i": "intermediar", "int": "intermediar", "intermediate": "intermediar", "intermediar": "intermediar",
          "a": "avansat", "adv": "avansat", "advanced": "avansat", "avansat": "avansat"}


def level(raw):
    k = (raw or "").strip().lower()
    if k in LEVELS:
        return LEVELS[k]
    parts = [LEVELS.get(p.strip()) for p in re.split(r"[–\-/,]", k) if LEVELS.get(p.strip())]
    return "–".join(dict.fromkeys(parts)) if parts else (raw or "").strip()


decks, seen = {}, set()
for path in sorted(glob.glob(os.path.join(notes_dir, "*.md"))):
    deck, cols = None, None
    for line in open(path, encoding="utf-8"):
        s = line.strip()
        if s.startswith("#") or s.startswith("**"):
            m = DECK_RE.search(s)
            if m:
                deck = m.group(1) or m.group(2)
                cols = None
            elif s.startswith("#"):
                deck, cols = None, None
            continue
        if not s.startswith("|") or not deck:
            continue
        cells = [c.strip() for c in s.strip("|").split("|")]
        if set("".join(cells)) <= set("-: "):
            continue
        if cols is None or ("url" in [c.lower() for c in cells]):
            cols = colmap(cells)
            continue
        get = lambda k: cells[cols[k]] if k in cols and cols[k] < len(cells) else ""
        um = re.search(r"https?://[^\s|)>\]]+", get("url"))
        if not um:
            continue
        url = um.group(0).rstrip(".,;")
        if (deck, url) in seen:
            continue
        seen.add((deck, url))
        title = re.sub(r"[*`]", "", get("title")).strip()
        decks.setdefault(deck, []).append({
            "t": title, "u": url, "p": get("provider"), "ty": get("type"), "lv": level(get("level")),
            "lg": get("lang") or "EN", "c": get("cost"), "s": get("summary"), "v": verif(get("status")),
        })

status_file = os.path.join(assets, "resources-status156.json")
status = json.load(open(status_file)) if os.path.exists(status_file) else {}
checked = status.get("checked")
for rows in decks.values():
    for r in rows:
        st = status.get("urls", {}).get(r["u"])
        if st:
            if st.get("code") is not None:
                r["h"] = st["code"]
            if st.get("final") and st["final"] != r["u"]:
                r["f"] = st["final"]
            if st.get("note"):
                r["n"] = st["note"]

out = {"version": 1, "built": datetime.date.today().isoformat(), "checked": checked,
       "decks": decks}
with open(os.path.join(assets, "resources156.js"), "w", encoding="utf-8") as f:
    f.write("/* Generat de tools/build_resources.py din cercetarea de resurse. Nu edita manual. */\n")
    f.write("window.RESOURCES156 = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
n = sum(len(v) for v in decks.values())
by = {}
for rows in decks.values():
    for r in rows:
        by[r["v"]] = by.get(r["v"], 0) + 1
print("resurse:", n, "· domenii/examene:", len(decks), "·", by)
print(" ".join("%s(%d)" % (k, len(v)) for k, v in sorted(decks.items())))
# Lista de URL-uri pentru verificarea automată.
with open(os.path.join(assets, "..", "resources-urls.txt"), "w") as f:
    f.write("\n".join(sorted({r["u"] for rows in decks.values() for r in rows})) + "\n")

# Construiește app/assets/enrich157.js din fișele scrise în content/enrich157_*.json.
# Fișierul generat adaugă în window.SEED termeni, carduri și întrebări noi și
# completează sinonimele unor termeni existenți. Se încarcă după cards.js și înainte de app.js.
#
#   python tools/build_enrich.py content app/assets
import glob, hashlib, json, os, re, sys

src_dir, assets = sys.argv[1], sys.argv[2]
TODAY = "2026-11-19"
REV = "1.48.4"


def slug(s):
    return hashlib.sha1(s.encode("utf-8")).hexdigest()[:10]


updates = json.load(open(os.path.join(src_dir, "enrich157_updates.json"), encoding="utf-8"))
nosource = set(updates.get("nosource", []))
terms, seen = [], set()
for path in sorted(glob.glob(os.path.join(src_dir, "enrich157_terms_*.json"))):
    for x in json.load(open(path, encoding="utf-8")):
        if x["t"].lower() in seen:
            sys.exit("Termen dublat: " + x["t"])
        seen.add(x["t"].lower())
        src = None if x["t"] in nosource else x.get("src")
        origin = {"technology": x["tech"], "concept": x["concept"], "context": x["deck"], "scope": "learning-context",
                  "reviewedOn": TODAY}
        if x.get("exp"):
            origin["expansions"] = [{"short": x["exp"][0], "full": x["exp"][1], "source": src or ""}]
        if src:
            origin["source"] = src
        aliases = list(x.get("aliases", []))
        if x.get("exp") and x["exp"][1] != x["t"] and x["exp"][1] not in aliases:
            aliases.append(x["exp"][1])
        t = {"id": "t157-" + slug(x["deck"] + ":" + x["t"]), "deck": x["deck"], "t": x["t"], "d": x["d"],
             "levels": ["understand"], "origin": origin, "competencies": [],
             "studyQuality134": {"format": "extended", "hasSource": bool(src), "flags": [] if src else ["fără sursă externă dedicată"],
                                 "semanticReview": "authored-157",
                                 "note": "Fișă scrisă în 1.48.4 pe baza cercetării de resurse; verifică sursa pentru detalii actuale."},
             "detail": x["detail"], "example": x["example"], "check": {"q": x["q"], "a": x["a"]},
             "reviewedOn": TODAY, "s": [["Sursă oficială pentru aprofundare", src]] if src else []}
        if aliases:
            t["aliases"] = aliases
        terms.append(t)

cards = []
for i, c in enumerate(updates["cards"]):
    cards.append({"id": "c157-" + slug(c["q"]), "deck": c["deck"], "q": c["q"],
                  "a": c["a"] + "\n\n[Sursă oficială](" + c["src"] + ")", "tags": c.get("tags", []),
                  "level": "understand", "reviewedOn": TODAY})

questions = []
for q in updates["questions"]:
    opts = [{"t": q["ok"], "ok": True, "w": None}] + [{"t": b[0], "ok": False, "w": b[1]} for b in q["bad"]]
    questions.append({"id": "q157-" + slug(q["q"]), "dom": q["dom"], "q": q["q"], "o": opts, "e": q["e"], "mode": "single",
                      "level": q.get("level", "understand"), "deck": q["deck"], "certs": q.get("certs", []),
                      "sources": [["Sursă oficială", q["src"]]], "reviewedOn": TODAY,
                      "provenance": {"kind": "authored", "method": "enrich157", "reviewedOn": TODAY}})

payload = {"terms": terms, "cards": cards, "questions": questions, "aliases": updates.get("aliases", {})}
js = """/* Generat de tools/build_enrich.py din content/enrich157_*.json. Nu edita manual. */
(function () {
  var S = window.SEED, E = %s;
  if (!S || S.enrich157) return;
  var has = function (list, id) { return (list || []).some(function (x) { return x.id === id; }); };
  E.terms.forEach(function (t) { if (!has(S.terms, t.id)) S.terms.push(t); });
  E.cards.forEach(function (c) { if (!has(S.cards, c.id)) S.cards.push(c); });
  S.questions = S.questions || [];
  E.questions.forEach(function (q) { if (!has(S.questions, q.id)) S.questions.push(q); });
  Object.keys(E.aliases).forEach(function (id) {
    var t = (S.terms || []).filter(function (x) { return x.id === id; })[0];
    if (!t) return;
    t.aliases = (t.aliases || []).concat(E.aliases[id].filter(function (a) { return (t.aliases || []).indexOf(a) < 0; }));
  });
  S.enrich157 = { revision: "%s", terms: E.terms.length, cards: E.cards.length, questions: E.questions.length };
})();
""" % (json.dumps(payload, ensure_ascii=False, separators=(",", ":")), REV)
open(os.path.join(assets, "enrich157.js"), "w", encoding="utf-8").write(js)
print("termeni:", len(terms), "· carduri:", len(cards), "· întrebări:", len(questions), "· sinonime:", sum(len(v) for v in payload["aliases"].values()))
by = {}
for t in terms:
    by[t["deck"]] = by.get(t["deck"], 0) + 1
print(" ".join("%s(%d)" % kv for kv in sorted(by.items())))

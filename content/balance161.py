# -*- coding: utf-8 -*-
"""Etapa D (1.51.0): reechilibrarea întrebărilor grilă și corecturile din audit.

Generează app/assets/balance161.js, care se încarcă după cards.js și modifică SEED la pornire:

1. Rescrieri revizuite (content/balance161_overrides.json, cheie = id canonic, adică fără sufixul
   de examen): texte noi pentru variante, aceeași ordine și același răspuns corect; textul mutat
   din varianta corectă se adaugă la explicație („De ce: …”). Se aplică tuturor copiilor întrebării.
2. Regula automată din hook-ul balance155: dacă varianta corectă e de peste 1,6 ori mai lungă decât
   cea mai lungă variantă greșită, păstrează decizia (prima parte, până la „.”, „;” sau „:”) și mută
   justificarea în explicație.
3. Explicații noi pentru întrebările care doar repetau răspunsul (content/explanations161.json).
4. Corecturi de text: cuvinte lipite după o listă de cuvinte românești (nu atinge cod), denumiri
   de produse actualizate, titluri de termeni dublați diferențiate prin context.
5. Legăturile interne spre materiale inexistente sunt eliminate.

Tot ce se poate calcula dinainte (inclusiv cuvintele lipite) se calculează aici; la pornire se aplică doar valorile finale.

Rulare:  python3 content/balance161.py app/assets
"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
assets = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "..", "app", "assets")
src = open(os.path.join(assets, "cards.js"), encoding="utf-8").read()
S = json.loads(src[src.index("=") + 1:].strip().rstrip(";"))

GLUE_DOT = re.compile(r"(?<=[a-zăâîșț])\.(?=[A-ZĂÂÎȘȚ])")
BOUND = re.compile(r"(?<=[.;:])\s+")
EXAMS = list(S["teste"].keys())
CANON = re.compile(r"-(" + "|".join(map(re.escape, EXAMS)) + r")$")


def canon(i):
    return CANON.sub("", i)


def bad(opts, ratio=1.6):
    L = sorted(((len(o["t"]), o["ok"]) for o in opts), reverse=True)
    return L[0][1] and L[0][0] > ratio * L[1][0]


def shorten(text, maxlen):
    text = GLUE_DOT.sub(". ", text.strip())
    parts = BOUND.split(text)
    if len(parts) < 2:
        return None
    for k in range(1, len(parts)):
        keep = " ".join(parts[:k]).rstrip(";:,")
        if re.fullmatch(r"(Nu|Da)( [^.]{0,30})?\.?", keep):
            continue
        if 30 <= len(keep) <= maxlen:
            if not keep.endswith("."):
                keep += "."
            rest = " ".join(parts[k:]).strip()
            return keep, rest[:1].upper() + rest[1:]
    return None


def with_why(e, extra):
    extra = (extra or "").strip()
    if not extra or extra in (e or ""):
        return e
    extra = extra[:1].upper() + extra[1:]
    return ((e or "").rstrip() + "\n\n**De ce:** " + extra).strip()


def all_questions():
    for q in S["questions"]:
        yield "questions", q
    for k, qs in S["teste"].items():
        for q in qs:
            yield k, q


overrides = json.load(open(os.path.join(HERE, "balance161_overrides.json"), encoding="utf-8"))
explanations = json.load(open(os.path.join(HERE, "explanations161.json"), encoding="utf-8")) if os.path.exists(os.path.join(HERE, "explanations161.json")) else {}

out_q, report = {}, {"overrides": 0, "auto": 0, "explanations": 0, "skippedOverrides": []}
for bank, q in all_questions():
    o, c = q["o"], canon(q["id"])
    new_o, new_e = None, q.get("e") or ""
    if c in overrides:
        ov = overrides[c]
        if len(ov["o"]) != len(o):
            report["skippedOverrides"].append(q["id"])
        else:
            new_o = ov["o"]; new_e = with_why(new_e, ov.get("e_append")); report["overrides"] += 1
    elif q.get("mode") != "multiple" and sum(x["ok"] for x in o) == 1 and len(o) >= 3 and bad(o):
        ok_i = [i for i, x in enumerate(o) if x["ok"]][0]
        mx = max(len(x["t"]) for x in o if not x["ok"])
        r = shorten(o[ok_i]["t"], int(1.5 * mx))
        if r:
            new_o = [x["t"] for x in o]; new_o[ok_i] = r[0]; new_e = with_why(new_e, r[1]); report["auto"] += 1
    if q["id"] in explanations or c in explanations:
        new_e = explanations.get(q["id"]) or explanations[c]; report["explanations"] += 1
    if new_o is not None or new_e != (q.get("e") or ""):
        out_q[q["id"]] = {"o": new_o, "e": new_e}

# Titluri de termeni dublate între domenii: denumirea rămâne căutabilă ca sinonim.
TERM_TITLES = {
    "t-sp-05": "Executor (Spark)", "t-or-13": "Executor (orchestrare)",
    "t-az-16": "Volume (Unity Catalog)", "t-do-08": "Volume (Docker)",
    "t-fa-04": "Lakehouse (Fabric)", "t-mo-23": "Lakehouse (arhitectură)",
    "t-db-15": "Manifest (dbt)", "t-ic-01": "Manifest (Iceberg)",
    "v117-t-7182e7115c": "Read committed (izolare SQL)", "v118-t-f5b79d5a6662": "Read committed (consumator Kafka)",
}
# Domenii cu denumiri alternative în bancă, pe care „Progres pe domenii” nu le recunoștea (index în lista oficială).
DOMAIN_ALIASES = {"sparkcert": {"API DataFrame și Dataset": 0, "Arhitectură și componente": 1, "Depanare și optimizare": 3,
                                "Spark Connect și deployment": 5, "Pandas API on Spark": 6}}
# Corecturi punctuale de text (id → [câmp, text vechi, text nou]).
TEXT_FIXES = [
    ["card", "azure-009", "q", "Databricks Workflows: ce poți orchestra?", "Lakeflow Jobs (fostul Databricks Workflows): ce poți orchestra?"],
    ["card", "azure-009", "a", "DLT pipeline", "pipeline Lakeflow (fost DLT)"],
    ["card", "azure-010", "q", "Când folosești ADF și când Databricks Workflows?", "Când folosești ADF și când Lakeflow Jobs (fostul Databricks Workflows)?"],
    ["term", "t-dq-17", "example", "Analistulvede***", "Analistul vede `***`"],
    ["card", "course-snow-022", "a", "Analist Nvede", "Analistul Nord vede"],
]
# Cuvinte lipite: doar după aceste cuvinte românești (formele din cod, ca `States.Timeout`, rămân neatinse).
GLUE_WORDS = ["Nu", "explicită", "complet", "neapărat", "contract", "riscului", "date", "finită"]

# Cuvintele lipite se despart aici, la construire, nu la fiecare pornire: în balance161.js ajung doar
# valorile finale ale câmpurilor modificate.
GLUE = re.compile(r"(^|[^A-Za-z0-9_.`/])(" + "|".join(GLUE_WORDS) + r")\.(?=[A-ZĂÂÎȘȚ][a-zăâîșț])")
CODE = re.compile(r"(```[\s\S]*?```|`[^`]*`|https?://\S+)")
glue_n = [0]
def fix(t):
    if not isinstance(t, str) or "." not in t:
        return t
    def sub(m):
        glue_n[0] += 1
        return m.group(1) + m.group(2) + ". "
    return "".join(p if i % 2 else GLUE.sub(sub, p) for i, p in enumerate(CODE.split(t)))

def setf(store, oid, field, old, new):
    if new != old:
        store.setdefault(oid, {})[field] = new

text_fix = {}
for kind, oid, field, a, b in TEXT_FIXES:
    text_fix[(kind, oid, field)] = (a, b)
def fixed(kind, obj, field):
    v = obj.get(field)
    f = text_fix.get((kind, obj["id"], field))
    if f and isinstance(v, str):
        v = v.replace(f[0], f[1])
    return fix(v)

cards_out, terms_out, lessons_out = {}, {}, {}
for c in S.get("cards", []):
    for f in ("q", "a"):
        setf(cards_out, c["id"], f, c.get(f), fixed("card", c, f))
for t in S.get("terms", []):
    for f in ("d", "detail", "example"):
        setf(terms_out, t["id"], f, t.get(f), fixed("term", t, f))
for l in S.get("lectii", []):
    for f in ("obiectiv", "explicatie"):
        setf(lessons_out, l["id"], f, l.get(f), fix(l.get(f)))
# Întrebări: rescrierea (dacă există), apoi despărțirea cuvintelor, pe text, variante și explicație.
q_out = {}
for bank, q in all_questions():
    r = out_q.get(q["id"]) or {}
    opts = [dict(x) for x in q["o"]]
    if r.get("o"):
        for i, t in enumerate(r["o"]):
            opts[i]["t"] = t
    e = r["e"] if "e" in r else q.get("e")
    row = {}
    nq = fix(q.get("q"))
    if nq != q.get("q"): row["q"] = nq
    ne = fix(e)
    if ne != q.get("e"): row["e"] = ne
    no = [{"t": fix(x["t"]), **({"w": fix(x["w"])} if x.get("w") else {})} for x in opts]
    if any(no[i]["t"] != q["o"][i]["t"] or no[i].get("w", q["o"][i].get("w")) != q["o"][i].get("w") for i in range(len(no))):
        row["o"] = no
    if row:
        q_out[q["id"]] = row
# Legături spre materiale care nu mai există (calculate aici, ca la pornire să nu se parcurgă tot).
ids = {"card": {c["id"] for c in S.get("cards", [])}, "term": {t["id"] for t in S.get("terms", [])},
       "question": {q["id"] for _, q in all_questions()}, "lesson": {l["id"] for l in S.get("lectii", [])},
       "exercise": {x["id"] for x in S.get("exercitii", [])}}
links_out, links_n = {}, 0
for k, rows in (S.get("learningLinks") or {}).items():
    kept = [r for r in rows if r.get("kind") not in ids or r.get("id") in ids[r["kind"]]]
    if len(kept) != len(rows):
        links_out[k] = kept; links_n += len(rows) - len(kept)
plan_out = {}
for deck, lessons in (S.get("termLessonPlan134") or {}).items():
    nl = [[i for i in l if i in ids["term"]] for l in lessons]
    if nl != lessons:
        plan_out[deck] = nl

payload = {"questions": q_out, "terms": TERM_TITLES, "termText": terms_out, "cards": cards_out, "lessons": lessons_out,
           "links": links_out, "plan": plan_out, "domainAliases": DOMAIN_ALIASES,
           "n": {"q": sum(1 for _, q in all_questions() if q["id"] in out_q), "glue": glue_n[0], "links": links_n}}
js = """/* Generat de content/balance161.py (Etapa D). Nu edita manual. */
(function () {
  var S = window.SEED, B = %s;
  if (!S || S.balance161) return;
  function each(list, map, fn) { (list || []).forEach(function (x) { var r = map[x.id]; if (r) fn(x, r); }); }
  function assign(x, r) { Object.keys(r).forEach(function (k) { x[k] = r[k]; }); }
  var banks = [S.questions || []].concat(Object.keys(S.teste || {}).map(function (k) { return S.teste[k]; }));
  banks.forEach(function (bank) {
    bank.forEach(function (q) {
      // O listă de domenii goală ascundea întrebarea din „Progres pe domenii”; domeniul principal rămâne.
      if (Array.isArray(q.domains) && !q.domains.length) delete q.domains;
      var r = B.questions[q.id]; if (!r) return;
      if (r.q !== undefined) q.q = r.q;
      if (r.e !== undefined) q.e = r.e;
      if (r.o && r.o.length === q.o.length) r.o.forEach(function (o, i) { q.o[i].t = o.t; if (o.w) q.o[i].w = o.w; });
    });
  });
  each(S.cards, B.cards, assign);
  each(S.terms, B.termText, assign);
  each(S.lectii, B.lessons, assign);
  // Termeni dublați între domenii: titlul primește contextul, vechea denumire rămâne sinonim.
  each(S.terms, B.terms, function (t, title) { if (t.t === title) return; t.aliases = (t.aliases || []).concat([t.t]); t.t = title; });
  Object.keys(B.links).forEach(function (k) { if (S.learningLinks) S.learningLinks[k] = B.links[k]; });
  Object.keys(B.plan).forEach(function (d) { if (S.termLessonPlan134) S.termLessonPlan134[d] = B.plan[d]; });
  S.examDomainAliases = S.examDomainAliases || {};
  Object.keys(B.domainAliases).forEach(function (ex) { S.examDomainAliases[ex] = Object.assign({}, S.examDomainAliases[ex] || {}, B.domainAliases[ex]); });
  S.balance161 = B.n;
})();
""" % json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
open(os.path.join(assets, "balance161.js"), "w", encoding="utf-8").write(js)

# Raport: ponderea întrebărilor în care corecta e cea mai lungă, înainte și după.
def pct(apply):
    res = {}
    for bank, q in all_questions():
        if q.get("mode") == "multiple" or sum(x["ok"] for x in q["o"]) != 1:
            continue
        texts = [x["t"] for x in q["o"]]
        if apply and q["id"] in out_q and out_q[q["id"]]["o"]:
            texts = out_q[q["id"]]["o"]
        ok_i = [i for i, x in enumerate(q["o"]) if x["ok"]][0]
        longest = all(len(t) < len(texts[ok_i]) for i, t in enumerate(texts) if i != ok_i)
        r = res.setdefault(bank, [0, 0]); r[1] += 1; r[0] += longest
    return {k: round(100 * v[0] / v[1]) for k, v in res.items()}
report["before"], report["after"] = pct(False), pct(True)
print(json.dumps(report, ensure_ascii=False))

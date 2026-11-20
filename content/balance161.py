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
5. Legăturile interne spre materiale inexistente sunt eliminate la pornire.

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

payload = {"questions": out_q, "terms": TERM_TITLES, "fixes": TEXT_FIXES, "glue": GLUE_WORDS, "domainAliases": DOMAIN_ALIASES}
js = """/* Generat de content/balance161.py (Etapa D). Nu edita manual. */
(function () {
  var S = window.SEED, B = %s;
  if (!S || S.balance161) return;
  var n = { q: 0, glue: 0, links: 0 };
  function banks() { var all = (S.questions || []).slice(); Object.keys(S.teste || {}).forEach(function (k) { all = all.concat(S.teste[k]); }); return all; }
  banks().forEach(function (q) {
    // O listă de domenii goală ascundea întrebarea din „Progres pe domenii”; domeniul principal rămâne.
    if (Array.isArray(q.domains) && !q.domains.length) delete q.domains;
    var r = B.questions[q.id]; if (!r) return;
    if (r.o && r.o.length === q.o.length) r.o.forEach(function (t, i) { q.o[i].t = t; });
    if (typeof r.e === "string") q.e = r.e;
    n.q++;
  });
  Object.keys(B.terms).forEach(function (id) {
    (S.terms || []).forEach(function (t) { if (t.id !== id || t.t === B.terms[id]) return; t.aliases = (t.aliases || []).concat([t.t]); t.t = B.terms[id]; });
  });
  var lists = { card: S.cards || [], term: S.terms || [] };
  B.fixes.forEach(function (f) { (lists[f[0]] || []).forEach(function (x) { if (x.id === f[1] && typeof x[f[2]] === "string") x[f[2]] = x[f[2]].split(f[3]).join(f[4]); }); });
  // Cuvinte lipite: „Nu.Verific” → „Nu. Verific”, în afara blocurilor de cod și a URL-urilor.
  var glue = new RegExp("(^|[^\\\\w.`/])(" + B.glue.join("|") + ")\\\\.(?=[A-ZĂÂÎȘȚ][a-zăâîșț])", "g");
  function fix(s) {
    if (typeof s !== "string" || s.indexOf(".") < 0) return s;
    return s.split(/(```[\\s\\S]*?```|`[^`]*`|https?:\\/\\/\\S+)/).map(function (part, i) { return i %% 2 ? part : part.replace(glue, function (m, a, w) { n.glue++; return a + w + ". "; }); }).join("");
  }
  (S.cards || []).forEach(function (c) { c.q = fix(c.q); c.a = fix(c.a); });
  (S.terms || []).forEach(function (t) { t.d = fix(t.d); t.detail = fix(t.detail); t.example = fix(t.example); });
  banks().forEach(function (q) { q.q = fix(q.q); q.e = fix(q.e); q.o.forEach(function (o) { o.t = fix(o.t); if (o.w) o.w = fix(o.w); }); });
  (S.lectii || []).forEach(function (l) { l.obiectiv = fix(l.obiectiv); l.explicatie = fix(l.explicatie); });
  // Legături interne spre materiale care nu mai există.
  var ids = { card: {}, term: {}, question: {}, lesson: {}, exercise: {} };
  (S.cards || []).forEach(function (x) { ids.card[x.id] = 1; }); (S.terms || []).forEach(function (x) { ids.term[x.id] = 1; });
  banks().forEach(function (x) { ids.question[x.id] = 1; }); (S.lectii || []).forEach(function (x) { ids.lesson[x.id] = 1; }); (S.exercitii || []).forEach(function (x) { ids.exercise[x.id] = 1; });
  Object.keys(S.learningLinks || {}).forEach(function (k) {
    var rows = S.learningLinks[k] || [], kept = rows.filter(function (r) { return !ids[r.kind] || ids[r.kind][r.id]; });
    n.links += rows.length - kept.length; S.learningLinks[k] = kept;
  });
  // Planul lecțiilor de termeni: id-uri de termeni care nu mai există (lecțiile își păstrează pozițiile, deci progresul salvat rămâne valid).
  Object.keys(S.termLessonPlan134 || {}).forEach(function (deck) {
    S.termLessonPlan134[deck] = S.termLessonPlan134[deck].map(function (l) { return l.filter(function (id) { return ids.term[id]; }); });
  });
  S.examDomainAliases = S.examDomainAliases || {};
  Object.keys(B.domainAliases).forEach(function (ex) { S.examDomainAliases[ex] = Object.assign({}, S.examDomainAliases[ex] || {}, B.domainAliases[ex]); });
  S.balance161 = n;
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

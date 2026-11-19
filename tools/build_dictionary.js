// Inventarul dicționarului: pentru fiecare termen din glosar, unde apare în conținut
// (carduri, lecții, exerciții, studii de caz, întrebări), plus termenii folosiți în
// conținut care nu au încă fișă. Rezultatul: app/assets/dictionary156.js.
//
//   node tools/build_dictionary.js app/assets
const fs = require("fs"), path = require("path");
const dir = process.argv[2] || "app/assets";
global.window = {};
eval(fs.readFileSync(path.join(dir, "cards.js"), "utf8"));
const S = window.SEED;

const REFS_PER_KIND = 6;
const MIN_CANDIDATE_USES = 3;

function fold(s) {
  return String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "");
}
function flatten(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(flatten).join("\n");
  if (typeof v === "object") return Object.keys(v).map(k => flatten(v[k])).join("\n");
  return String(v);
}

// ---- documentele în care căutăm ----
const docs = [];
function add(kind, id, title, parts) {
  const raw = parts.map(flatten).join("\n");
  docs.push({ kind, id, title: String(title || id).slice(0, 120), raw: fold(raw), low: fold(raw).toLowerCase() });
}
(S.cards || []).forEach(c => add("card", c.id, c.q, [c.q, c.a]));
(S.lectii || []).forEach(l => add("lesson", l.id, l.titlu, [l.titlu, l.obiectiv, l.explicatie, l.exemplu, l.greseli, l.autoevaluare]));
(S.exercitii || []).forEach(x => add("exercise", x.id, x.titlu, [x.titlu, x.context, x.sarcini, x.rezultat, x.criterii, x.indicii, x.solutie]));
(S.caseStudies || []).forEach(x => add("case", x.id, x.titlu, [x.titlu, x.context, x.sarcini, x.rezultat, x.criterii, x.indicii, x.solutie]));
(S.questions || []).forEach(q => add("question", q.id, q.q, [q.q, (q.o || []).map(o => o.t), q.e]));

// ---- formele fiecărui termen ----
function forms(t) {
  const out = new Set();
  const addForm = x => { x = String(x || "").trim(); if (x.length >= 2) out.add(x); };
  [t.t].concat(t.aliases || []).forEach(name => {
    addForm(name);
    const m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(name);
    if (m) { addForm(m[1]); addForm(m[2]); }
  });
  ((t.origin || {}).expansions || []).forEach(x => { addForm(x.short); addForm(x.full); });
  return [...out];
}
const isAcronym = f => /^[A-Z0-9][A-Z0-9_.\-]{1,6}$/.test(f) && /[A-Z]/.test(f);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function matcher(f) {
  const ff = fold(f);
  if (isAcronym(f)) return { test: d => new RegExp("(^|[^A-Za-z0-9_])" + esc(ff) + "(?![A-Za-z0-9_])").test(d.raw), key: ff };
  if (ff.length < 3) return null;
  const re = new RegExp("(^|[^a-z0-9_])" + esc(ff.toLowerCase()) + "(?![a-z0-9_])");
  const needle = ff.toLowerCase();
  return { test: d => d.low.indexOf(needle) >= 0 && re.test(d.low), key: needle };
}

const terms = S.terms || [];
const index = {}, covered = new Set();
terms.forEach(t => {
  const ms = forms(t).map(f => { covered.add(fold(f).toLowerCase()); return matcher(f); }).filter(Boolean);
  const counts = {}, refs = {};
  docs.forEach(d => {
    if (!ms.some(m => m.test(d))) return;
    counts[d.kind] = (counts[d.kind] || 0) + 1;
    refs[d.kind] = refs[d.kind] || [];
    if (refs[d.kind].length < REFS_PER_KIND) refs[d.kind].push(d.id);
  });
  index[t.id] = { n: counts, r: refs };
});

// ---- trimiteri între termeni: ce alte fișe menționează termenul ----
const termDocs = terms.map(t => { const raw = fold([t.d, t.detail, t.example].map(flatten).join("\n")); return { id: t.id, raw, low: raw.toLowerCase() }; });
terms.forEach(t => {
  const ms = forms(t).map(matcher).filter(Boolean), refs = [];
  termDocs.forEach(d => { if (d.id !== t.id && ms.some(m => m.test(d))) refs.push(d.id); });
  if (refs.length) { index[t.id].n.term = refs.length; index[t.id].r.term = refs.slice(0, 12); }
});

// ---- termeni din conținut fără fișă: acronime și denumiri tehnice CamelCase ----
const STOP = new Set(["DA", "NU", "OK", "TODO", "ID", "II", "III", "IV", "VI", "VII", "VIII", "IX", "XI", "XII", "AND", "OR", "NOT", "AS", "ON", "BY", "IN", "IS", "TO", "OF", "THE", "A", "B", "C", "D", "E", "DE", "EU", "DP", "AI", "AUTO", "STRING", "ROWS", "ALL", "RUN", "LAB", "EUR", "TVA", "RON", "MB", "GB", "KB", "TB", "ROLE", "COLUMN", "APPLY", "FLATTEN", "AB", "PDF", "PR", "SYSADMIN"]);
// Cuvintele cheie SQL apar în cod; sunt sintaxă, nu termeni de dicționar.
"SELECT FROM WHERE TABLE CREATE ORDER DELETE SUM INTO INSERT COUNT COPY VALUES DISTINCT UPDATE SCHEMA GROUP SET JOIN ALTER USE WITH LIMIT REPLACE OVER WHEN GRANT THEN CASE BETWEEN ELSE END LEFT RIGHT INNER OUTER FULL CROSS UNION EXCEPT INTERSECT HAVING PARTITION BY ASC DESC NULLS FIRST LAST LIKE EXISTS VIEW DROP TRUNCATE MERGE MATCHED USING TARGET SOURCE PRIMARY KEY FOREIGN REFERENCES INDEX DEFAULT CHECK UNIQUE CONSTRAINT BEGIN COMMIT ROLLBACK TRANSACTION INT BIGINT VARCHAR CHAR DATE TIMESTAMP DECIMAL FLOAT DOUBLE BOOLEAN TRUE FALSE MIN MAX AVG CAST COALESCE ROW RANGE UNBOUNDED PRECEDING FOLLOWING CURRENT LAG LEAD RANK NUMBER IF REVOKE DATABASE CATALOG SHOW DESCRIBE EXPLAIN ANALYZE OPTIMIZE VACUUM ZORDER LOCATION OPTIONS PARTITIONED CLUSTER STREAM LIVE RECURSIVE LATERAL QUALIFY FILTER WINDOW ON".split(" ").forEach(w => STOP.add(w));
const cand = {};
docs.forEach(d => {
  const seen = new Set();
  const text = d.raw;
  (text.match(/(?<![A-Za-z0-9_])[A-Z][A-Z0-9]{1,7}(?![A-Za-z0-9_])/g) || []).forEach(w => seen.add(w));
  (text.match(/(?<![A-Za-z0-9_])[A-Z][a-z]+(?:[A-Z][a-z0-9]+)+(?![A-Za-z0-9_])/g) || []).forEach(w => seen.add(w));
  seen.forEach(w => {
    if (STOP.has(w) || covered.has(w.toLowerCase()) || /[A-Z]{2,}\d{2,}$/.test(w)) return;
    const c = cand[w] || (cand[w] = { w, n: 0, kinds: {}, r: [] });
    c.n++; c.kinds[d.kind] = (c.kinds[d.kind] || 0) + 1;
    if (c.r.length < REFS_PER_KIND) c.r.push([d.kind, d.id]);
  });
});
// Formele care diferă doar prin majuscule se unesc (ex. SELECT în cod și Select în text).
const candidates = Object.values(cand).filter(c => c.n >= MIN_CANDIDATE_USES)
  .sort((a, b) => b.n - a.n || a.w.localeCompare(b.w));

const totals = {};
docs.forEach(d => { totals[d.kind] = (totals[d.kind] || 0) + 1; });
const out = {
  version: 1,
  built: new Date().toISOString().slice(0, 10),
  docs: totals,
  terms: index,
  candidates: candidates.map(c => ({ w: c.w, n: c.n, k: c.kinds, r: c.r }))
};
const file = path.join(dir, "dictionary156.js");
fs.writeFileSync(file, "/* Generat de tools/build_dictionary.js. Nu edita manual. */\nwindow.DICT156 = " + JSON.stringify(out) + ";\n");
const used = Object.values(index).filter(x => Object.keys(x.n).length).length;
console.log("documente:", totals);
console.log("termeni cu fișă:", terms.length, "· apar în conținut:", used, "· fără apariții:", terms.length - used);
console.log("termeni din conținut fără fișă (≥" + MIN_CANDIDATE_USES + " apariții):", candidates.length);
console.log("primii:", candidates.slice(0, 60).map(c => c.w + "(" + c.n + ")").join(" "));
console.log("fișier:", file, (fs.statSync(file).size / 1024).toFixed(0) + " KiB");

// Verificarea calității conținutului, fără browser.
//   node tools/qa_content.js app/assets [raport.md]
// Erorile (ies cu cod 1) se aplică conținutului nou (1.48.4+) și invarianților tari.
// Avertismentele descriu conținutul moștenit, ca să fie văzut și reparat treptat.
const fs = require("fs"), path = require("path");
const dir = path.resolve(process.argv[2] || "app/assets"), reportPath = process.argv[3];
global.window = {};
const load = f => { const p = path.join(dir, f); if (fs.existsSync(p)) (0, eval)(fs.readFileSync(p, "utf8")); };
["cards.js", "balance161.js", "enrich157.js", "courses145-data.js", "atelier159.js", "resources156.js"].forEach(load);
const S = window.SEED, A = window.ATELIER159 || { exercises: [], cards: [], skills: [] }, R = window.RESOURCES156 || { decks: {} };
const errors = [], warns = [], info = [];
const err = (check, msg) => errors.push([check, msg]), warn = (check, msg) => warns.push([check, msg]);
const norm = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const isNew = id => /^(q157|t158|c157|t157)-/.test(String(id));
// La variante, punctuația contează (cod): doar litere mici, spații comprimate, fără punct final.
const normOpt = s => String(s || "").toLowerCase().replace(/\s+/g, " ").trim().replace(/[.;]+$/, "");
// Aceeași întrebare de competență e copiată intenționat în banca fiecărui examen (sufix -dp750, -dbra...).
const canon = id => String(id).replace(new RegExp("-(" + Object.keys((window.SEED || {}).teste || {}).join("|") + ")$"), "");

// ---- 1. Întrebări grilă: toate băncile ----
const banks = { "întrebări (SEED.questions)": S.questions || [] };
Object.keys(S.teste || {}).forEach(k => { banks["test " + k] = S.teste[k]; });
const seenText = {};
Object.entries(banks).forEach(([bank, qs]) => {
  let longest = 0, shortest = 0, single = 0, newLongest = 0, newSingle = 0, missingW = 0;
  qs.forEach(q => {
    const opts = q.o || [], ok = opts.filter(o => o.ok), multi = q.mode === "multiple";
    if (!q.q || !String(q.q).trim()) err("întrebare goală", bank + " · " + q.id);
    if (!multi && ok.length !== 1) err("număr de variante corecte", bank + " · " + q.id + ": " + ok.length + " corecte în modul single");
    if (multi && ok.length < 2) err("număr de variante corecte", bank + " · " + q.id + ": răspuns multiplu cu " + ok.length + " corecte");
    const keys = opts.map(o => normOpt(o.t));
    if (new Set(keys).size !== keys.length) (isNew(q.id) ? err : warn)("variante duplicate", bank + " · " + q.id);
    if (opts.some(o => !String(o.t || "").trim())) err("variantă goală", bank + " · " + q.id);
    if (!q.e || String(q.e).trim().length < 15) (isNew(q.id) ? err : warn)("explicație lipsă", bank + " · " + q.id);
    const wrongNoWhy = opts.filter(o => !o.ok && !String(o.w || "").trim()).length;
    if (wrongNoWhy) { missingW++; if (isNew(q.id)) err("varianta greșită fără explicație", bank + " · " + q.id); }
    if (!multi && ok.length === 1) {
      const okLen = ok[0].t.length, isLongest = opts.filter(o => !o.ok).every(o => o.t.length < okLen);
      single++; if (isLongest) longest++;
      if (opts.filter(o => !o.ok).every(o => o.t.length > okLen)) shortest++;
      if (isNew(q.id)) { newSingle++; if (isLongest) newLongest++; }
    }
    const k = norm(q.q);
    if (k.length > 30) { const c = canon(q.id); seenText[k] = seenText[k] || {}; seenText[k][c] = seenText[k][c] || (bank + " · " + q.id); }
  });
  if (single) {
    const pct = Math.round(longest / single * 100);
    const spct = Math.round(shortest / single * 100);
    info.push(["lungimea variantelor", bank + ": corecta e cea mai lungă în " + pct + "% și cea mai scurtă în " + spct + "% din " + single]);
    if (spct > 45) warn("lungimea variantelor (invers)", bank + ": corecta e cea mai scurtă în " + spct + "%");
    if (pct > 45) err("lungimea variantelor", bank + ": corecta e cea mai lungă în " + pct + "% (limita: 45%, hazardul: 25%)");
    else if (pct > 35) warn("lungimea variantelor", bank + ": corecta e cea mai lungă în " + pct + "% (ținta: sub 35%, hazardul: 25%)");
  }
  if (newSingle >= 8) {
    const pct = Math.round(newLongest / newSingle * 100);
    if (pct > 35) err("lungimea variantelor (conținut nou)", bank + ": " + pct + "% din " + newSingle + " întrebări noi");
  }
  if (missingW) info.push(["explicații pe variante greșite", bank + ": " + missingW + " întrebări au cel puțin o variantă greșită fără explicație"]);
});
Object.values(seenText).map(v => Object.values(v)).filter(v => v.length > 1).forEach(v => warn("întrebare dublată", v.slice(0, 4).join(" | ")));

// ---- 2. Glosar ----
const titles = {};
(S.terms || []).forEach(t => {
  if (!t.d || t.d.trim().length < 15) (isNew(t.id) ? err : warn)("definiție lipsă sau prea scurtă", t.id + " · " + t.t);
  if (t.d && t.d.length > 260) warn("definiție prea lungă pentru o grilă", t.id + " · " + t.t + " (" + t.d.length + " caractere)");
  if (!t.check || !t.check.q || !t.check.a) (isNew(t.id) ? err : warn)("fără întrebare de verificare", t.id + " · " + t.t);
  const k = norm(t.t); (titles[k] = titles[k] || []).push(t.id + "(" + t.deck + ")");
});
Object.entries(titles).filter(([, v]) => v.length > 1).forEach(([k, v]) => warn("termen dublat", k + ": " + v.join(", ")));

// ---- 3. Legături interne ----
const ids = { card: new Set((S.cards || []).map(x => x.id)), term: new Set((S.terms || []).map(x => x.id)),
  lesson: new Set((S.lectii || []).map(x => x.id)), exercise: new Set((S.exercitii || []).map(x => x.id)),
  question: new Set((S.questions || []).map(x => x.id).concat(...Object.values(S.teste || {}).map(b => b.map(q => q.id)))),
  scenario: new Set(((S.scen || {}).scenarios || []).map(x => x.id)), case: new Set((S.caseStudies || []).map(x => x.id)) };
let broken = 0; const brokenEx = [];
Object.entries(S.learningLinks || {}).forEach(([from, rows]) => (rows || []).forEach(r => {
  if (ids[r.kind] && !ids[r.kind].has(r.id)) { broken++; if (brokenEx.length < 8) brokenEx.push(from + " → " + r.kind + ":" + r.id); }
}));
if (broken) warn("legături interne rupte", broken + " legături spre materiale inexistente, de ex. " + brokenEx.join("; "));
Object.entries(S.termLessonPlan134 || {}).forEach(([deck, plan]) => plan.forEach(l => l.forEach(id => { if (!ids.term.has(id)) warn("plan de lecții cu termen inexistent", deck + ": " + id); })));

// ---- 4. Calitatea textului ----
const cedilla = /[şţŞŢ]/;
function textChecks(owner, fieldTexts, strict) {
  fieldTexts.forEach(([field, text]) => {
    if (typeof text !== "string" || !text) return;
    if (cedilla.test(text)) (strict ? err : warn)("diacritice cu sedilă (ş ţ în loc de ș ț)", owner + " · " + field);
    if ((text.match(/```/g) || []).length % 2) (strict ? err : warn)("bloc de cod neînchis", owner + " · " + field);
    const ticks = (text.replace(/```[\s\S]*?```/g, "").match(/`/g) || []).length;
    if (ticks % 2) (strict ? err : warn)("cod inline neînchis (`)", owner + " · " + field);
    if ((text.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "").replace(/\*{3,}/g, "").match(/\*\*/g) || []).length % 2) (strict ? err : warn)("îngroșare neînchisă (**)", owner + " · " + field);
  });
}
(S.cards || []).forEach(c => textChecks("card " + c.id, [["q", c.q], ["a", c.a]], isNew(c.id)));
(S.terms || []).forEach(t => textChecks("termen " + t.id, [["d", t.d], ["detail", t.detail], ["example", t.example]], isNew(t.id)));
Object.entries(banks).forEach(([bank, qs]) => qs.forEach(q => textChecks(bank + " " + q.id, [["q", q.q], ["e", q.e]].concat((q.o || []).map((o, i) => ["o" + i, o.t])), isNew(q.id))));
A.exercises.forEach(e => textChecks("atelier " + e.id, [["prompt", e.prompt], ["explanation", e.explanation], ["impact", e.impact]], true));
A.cards.forEach(c => textChecks("fișă atelier " + c.id, [["body", c.body]], true));

// ---- 5. Acoperirea domeniilor de examen față de ponderile oficiale ----
(S.certificari || []).forEach(c => {
  const qs = (S.teste || {})[c.id] || [], doms = c.domenii || [];
  if (!qs.length || !doms.length) return;
  doms.forEach(d => {
    const m = /(\d+)\s*[–-]\s*(\d+)/.exec(d.pondere || "") || /(\d+)/.exec(d.pondere || "");
    if (!m) return;
    const lo = +m[1], hi = +(m[2] || m[1]);
    const al = (S.examDomainAliases || {})[c.id] || {}, idx = doms.indexOf(d);
    const n = qs.filter(q => (q.domains || [q.dom]).some(x => x === d.nume || al[x] === idx)).length, pct = Math.round(n / qs.length * 100);
    info.push(["acoperire examen", c.id + " · " + d.nume + ": " + pct + "% (oficial " + d.pondere + ")"]);
    if (pct < lo - 7) warn("domeniu de examen subreprezentat", c.id + " · " + d.nume + ": " + pct + "% din întrebări, oficial " + d.pondere);
    if (pct > hi + 12) warn("domeniu de examen suprareprezentat", c.id + " · " + d.nume + ": " + pct + "% din întrebări, oficial " + d.pondere);
  });
});

// ---- 6. Biblioteca de resurse ----
Object.entries(R.decks || {}).forEach(([deck, rows]) => rows.forEach(r => {
  if (!/^https:\/\//.test(r.u)) err("resursă fără HTTPS", deck + " · " + r.u);
  if (!r.s) err("resursă fără rezumat", deck + " · " + r.u);
  if (typeof r.h === "number" && r.h >= 400 && r.h !== 403 && r.h !== 429) warn("link nefuncțional", deck + " · " + r.u + " (" + r.h + ")");
}));

// ---- 7. Pachetele Atelier (validatorul lor complet) ----
try {
  const tmp = fs.mkdtempSync(path.join(require("os").tmpdir(), "qa-"));
  const packs = ["content/atelier159.json", "content/atelier_mental160.json"].filter(f => fs.existsSync(path.join(dir, "..", "..", f))).map(f => path.join(dir, "..", "..", f));
  if (packs.length) require("child_process").execFileSync("node", [path.join(__dirname, "build_atelier.js"), ...packs, tmp], { stdio: "pipe" });
  info.push(["Atelier", "validatorul pachetelor trece"]);
} catch (e) { err("pachet Atelier invalid", String(e.stdout || e.message).trim().split("\n").slice(0, 5).join(" | ")); }
const atelierLongest = (() => { let n = 0, l = 0; A.exercises.forEach(e => { const gs = e.type === "tradeoff" ? [e.payload.options] : e.type === "diagnose" ? [e.payload.hypotheses, e.payload.tests] : []; gs.forEach(g => { const ok = g.find(o => o.ok); n++; if (g.filter(o => !o.ok).every(o => o.t.length < ok.t.length)) l++; }); }); return [l, n]; })();
if (atelierLongest[1]) { const pct = Math.round(atelierLongest[0] / atelierLongest[1] * 100); info.push(["lungimea variantelor", "Atelier: corecta e cea mai lungă în " + pct + "% din " + atelierLongest[1]]); if (pct > 35) err("lungimea variantelor (Atelier)", pct + "%"); }

// ---- Raport ----
const group = list => { const g = {}; list.forEach(([k, m]) => (g[k] = g[k] || []).push(m)); return g; };
const lines = ["# Raport de calitate a conținutului", "", "Generat de `tools/qa_content.js` la " + new Date().toISOString().slice(0, 10) + ".", "",
  "| | Număr |", "|---|---:|", "| Erori | " + errors.length + " |", "| Avertismente | " + warns.length + " |", ""];
[["Erori", errors], ["Avertismente", warns], ["Informații", info]].forEach(([title, list]) => {
  lines.push("## " + title, "");
  if (!list.length) lines.push("Niciuna.", "");
  Object.entries(group(list)).forEach(([k, msgs]) => { lines.push("### " + k + " (" + msgs.length + ")", ""); msgs.slice(0, 25).forEach(m => lines.push("- " + m)); if (msgs.length > 25) lines.push("- … și încă " + (msgs.length - 25)); lines.push(""); });
});
if (reportPath) fs.writeFileSync(reportPath, lines.join("\n") + "\n");
console.log("erori:", errors.length, "· avertismente:", warns.length);
Object.entries(group(errors)).forEach(([k, m]) => console.log("  EROARE", k + ":", m.length, "·", m.slice(0, 3).join(" | ")));
Object.entries(group(warns)).forEach(([k, m]) => console.log("  avertisment", k + ":", m.length));
process.exitCode = errors.length ? 1 : 0;

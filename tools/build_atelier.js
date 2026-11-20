// Validează pachetul de conținut Atelier și generează app/assets/atelier159.js.
//   node tools/build_atelier.js content/atelier159.json app/assets
// Pentru exercițiile cu date (datacheck), rulează fiecare variantă pe date și
// verifică faptul că doar varianta corectă dă rezultatul așteptat.
const fs = require("fs"), path = require("path");
const [src, out] = [process.argv[2] || "content/atelier159.json", process.argv[3] || "app/assets"];
const pack = JSON.parse(fs.readFileSync(src, "utf8"));
const TYPES = ["tradeoff", "flaw", "order", "slot", "datacheck"];
let errors = 0; const fail = m => { console.log("EROARE:", m); errors++; };
const skills = new Set(pack.skills.map(s => s.id));
pack.exercises.forEach(e => {
  if (!skills.has(e.skill)) fail(e.id + ": competență necunoscută " + e.skill);
  if (TYPES.indexOf(e.type) < 0) fail(e.id + ": tip necunoscut " + e.type);
  if (![1, 2, 3].includes(e.level)) fail(e.id + ": treaptă invalidă");
  if (!e.explanation || !e.impact || !e.hint) fail(e.id + ": lipsește explicația, impactul sau indiciul");
  const p = e.payload;
  if (e.type === "tradeoff" && p.options.filter(o => o.ok).length !== 1) fail(e.id + ": trebuie exact o variantă corectă");
  if (e.type === "flaw" && !(p.bad >= 0 && p.bad < p.lines.length)) fail(e.id + ": linia greșită nu există");
  if (e.type === "slot") {
    const n = (p.template.match(/\{\d+\}/g) || []).length;
    if (n !== p.answers.length) fail(e.id + ": numărul de spații nu corespunde răspunsurilor");
    p.answers.forEach(a => { if (!p.chips.includes(a)) fail(e.id + ": răspunsul " + a + " lipsește din jetoane"); });
  }
  if (e.type === "order" && p.steps.length < 3) fail(e.id + ": prea puțini pași");
  if (e.type === "datacheck") {
    const rows = p.rows.map(r => Object.fromEntries(p.columns.map((c, i) => [c, r[i]])));
    const keyOf = r => r[p.key];
    const want = JSON.stringify((p.expectedKeys || p.expected).slice().sort());
    const results = p.options.map(o => { const fn = (0, eval)("(" + o.fn + ")"); return JSON.stringify(rows.filter(r => fn(r, rows, p.context || {})).map(keyOf).sort()); });
    const ok = results.map(r => r === want);
    const right = p.options.findIndex(o => o.ok);
    if (right < 0 || p.options.filter(o => o.ok).length !== 1) fail(e.id + ": marchează exact o variantă corectă (ok)");
    else if (p.accept) { if (!p.accept.includes(right) || !p.accept.every(i => ok[i])) fail(e.id + ": varianta acceptată nu dă rezultatul așteptat"); }
    else if (ok.filter(Boolean).length !== 1 || !ok[right]) fail(e.id + ": doar varianta corectă trebuie să dea rezultatul așteptat (" + ok.join(",") + ")");
  }
});
const levels = {};
pack.exercises.forEach(e => { const k = e.skill + ":" + e.level; levels[k] = (levels[k] || 0) + 1; });
pack.skills.forEach(s => [1, 2, 3].forEach(l => { if (!levels[s.id + ":" + l]) fail(s.id + ": nu are exerciții pe treapta " + l); }));
if (errors) { console.log(errors + " erori; fișierul nu a fost generat."); process.exit(1); }
const byType = {}; pack.exercises.forEach(e => byType[e.type] = (byType[e.type] || 0) + 1);
fs.writeFileSync(path.join(out, "atelier159.js"), "/* Generat de tools/build_atelier.js din content/atelier159.json. Nu edita manual. */\nwindow.ATELIER159 = " + JSON.stringify(pack) + ";\n");
console.log("competențe:", pack.skills.length, "· exerciții:", pack.exercises.length, JSON.stringify(byType), "· fișe:", pack.cards.length);

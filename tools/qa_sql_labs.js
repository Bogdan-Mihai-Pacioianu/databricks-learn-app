// Rulează laboratoarele SQL cu motorul SQLite al aplicației (sql.js), în browser.
//   node tools/qa_sql_labs.js app/assets [raport.md]
// Soluția trebuie să ruleze și să treacă propria verificare; variantele-capcană (distractors)
// trebuie să ruleze și să NU treacă, altfel exercițiul are două răspunsuri corecte.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const dir = path.resolve(process.argv[2] || "app/assets"), reportPath = process.argv[3];
(async () => {
  const b = await chromium.launch(), p = await b.newPage();
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  await p.evaluate(() => window.DECARDS.loadSql());
  await p.waitForFunction(() => { try { return !window.DECARDS.labRun("SELECT 1").error; } catch (e) { return false; } }, null, { timeout: 90000 });
  const r = await p.evaluate(() => {
    const D = window.DECARDS, out = { n: 0, ok: 0, errors: [], warns: [], types: {} };
    window.SEED.lab.exercises.forEach(ex => {
      out.n++; out.types[ex.type] = (out.types[ex.type] || 0) + 1;
      let sol;
      try { sol = D.labRun(ex.solution, null, ex.validation); } catch (e) { out.errors.push(ex.id + " · soluția aruncă excepție: " + e); return; }
      if (sol.error) { out.errors.push(ex.id + " · soluția nu rulează: " + sol.error); return; }
      const self = D.labEvaluate(ex, ex.solution);
      if (!self.ok) { out.errors.push(ex.id + " · soluția nu trece propria verificare: " + self.motiv); return; }
      if (!ex.validation && !(sol.values || []).length && !(ex.task || "").match(/gol|niciun rând|zero rânduri/i)) out.warns.push(ex.id + " · soluția întoarce zero rânduri");
      (ex.distractors || []).forEach((d, i) => {
        const dr = D.labRun(d, null, ex.validation);
        if (dr.error) { out.warns.push(ex.id + " · varianta-capcană " + (i + 1) + " nu rulează: " + dr.error); return; }
        const ev = D.labEvaluate(ex, d);
        if (ev.ok) out.errors.push(ex.id + " · varianta-capcană " + (i + 1) + " dă același rezultat ca soluția");
      });
      out.ok++;
    });
    return out;
  });
  await b.close();
  const passed = r.n - new Set(r.errors.map(e => e.split(" ")[0])).size;
  console.log("exerciții SQL:", r.n, JSON.stringify(r.types), "· trec:", passed, "· erori:", r.errors.length, "· avertismente:", r.warns.length);
  r.errors.forEach(e => console.log("  EROARE", e)); r.warns.slice(0, 20).forEach(w => console.log("  avertisment", w));
  if (reportPath) fs.writeFileSync(reportPath, ["# Laboratoarele SQL", "", "Generat de `tools/qa_sql_labs.js` cu motorul SQLite al aplicației. Soluția trebuie să treacă propria verificare; variantele-capcană trebuie să nu treacă.", "",
    "| | Număr |", "|---|---:|", "| Exerciții | " + r.n + " |", "| Trec | " + passed + " |", "| Erori | " + r.errors.length + " |", "| Avertismente | " + r.warns.length + " |", "",
    "## Erori", "", ...(r.errors.length ? r.errors.map(e => "- " + e) : ["Niciuna."]), "", "## Avertismente", "", ...(r.warns.length ? r.warns.map(e => "- " + e) : ["Niciuna."]), ""].join("\n"));
  process.exitCode = r.errors.length ? 1 : 0;
})();

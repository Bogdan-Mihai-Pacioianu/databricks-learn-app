// Test Playwright pentru întrebările de examen adăugate în 1.48.5.  node tools/test_exams.js app/assets
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets");
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  const r = await p.evaluate(() => {
    const S = window.SEED, D = window.DECARDS, out = {};
    Object.keys(S.teste).forEach(ex => {
      const added = S.teste[ex].filter(q => q.id.startsWith("t158-"));
      if (!added.length) return;
      const m = D.examDomainMastery(ex);
      const assigned = new Set(); m.rows.forEach(r => r.questionIds.forEach(id => assigned.add(id)));
      out[ex] = { total: S.teste[ex].length, noi: added.length, faraDomeniu: added.filter(q => !assigned.has(q.id)).map(q => q.dom) };
    });
    return out;
  });
  const unassigned = await p.evaluate(() => { const D = window.DECARDS, out = {}; Object.keys(window.SEED.teste).forEach(ex => { const m = D.examDomainMastery(ex); if (m.rows.length && m.unassigned.length) out[ex] = m.unassigned.length; }); return out; });
  console.log("întrebări de examen fără domeniu:", JSON.stringify(unassigned));
  Object.entries(unassigned).forEach(([ex, n]) => fail(ex + ": " + n + " întrebări nu apar în Progres pe domenii"));
  Object.entries(r).forEach(([ex, v]) => { console.log(ex.padEnd(10), "total", v.total, "· noi", v.noi, v.faraDomeniu.length ? "· FĂRĂ DOMENIU: " + v.faraDomeniu.join(", ") : ""); if (v.faraDomeniu.length) fail(ex + " are întrebări neatribuite"); });
  // Un test complet pe DP-750 include întrebările noi și se poate parcurge.
  await p.evaluate(() => { const D = window.DECARDS; D.state.settings.setup = true; const su = document.getElementById("setup"); if (su) su.hidden = true; D.startExamPractice("dp750", "all", ""); });
  await p.waitForSelector("#lesson:not([hidden])");
  const n = await p.evaluate(() => window.DECARDS.L.lesson.items.filter(i => i.q && i.q.id.startsWith("t158-")).length);
  console.log("test DP-750: întrebări noi în sesiune:", n);
  if (!n) fail("întrebările noi nu apar în testul DP-750");
  await p.evaluate(() => { const L = window.DECARDS.L; const i = L.lesson.items.findIndex(x => x.q && x.q.id.startsWith("t158-")); L.i = i; });
  await p.evaluate(() => window.DECARDS.show && null);
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

// Test Playwright pentru recapitularea din greșeli și scorul de pregătire (1.53.0).
//   node tools/test_review.js app/assets [director-capturi]
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets"), shots = process.argv[3] || ".";
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  const DAY = 864e5;
  // 1. Greșeli vechi (dinainte de 1.53.0) intră direct în recapitulare; răspunsurile la întrebări partajate nu.
  const seeded = await p.evaluate(() => {
    const D = window.DECARDS, S = D.state, bank = window.SEED.teste.dp750;
    S.settings.setup = true; const su = document.getElementById("setup"); if (su) su.hidden = true;
    delete S.qreview; S.assessments = {};
    bank.slice(0, 3).forEach((q, i) => { S.assessments[q.id] = { correct: false, attempts: 1, errors: 1, last: Date.now() - 864e5 * (5 + i), exam: "dp750" }; });
    bank.slice(3, 8).forEach(q => { S.assessments[q.id] = { correct: true, attempts: 1, errors: 0, last: Date.now(), exam: "dp750" }; });
    S.assessments["x-q-apply"] = { correct: false, last: Date.now() };
    D.show("home");
    return { due: D.qReviewDue162(), card: !!document.getElementById("review-card162"), title: (document.querySelector("#review-card162 h2") || {}).textContent };
  });
  console.log("seed:", JSON.stringify(seeded));
  if (seeded.due.length !== 3) fail("greșelile existente nu au intrat în recapitulare");
  if (!seeded.card || !/De recapitulat azi \(3\)/.test(seeded.title || "")) fail("cardul de recapitulare lipsește de pe Azi");
  // 2. Sesiunea: răspuns corect → cutia 2, revine peste 3 zile; răspuns greșit → cutia 1, revine mâine.
  await p.click("#review-start162");
  await p.waitForSelector("#lesson:not([hidden])");
  async function answer(correct) {
    const id = await p.evaluate(ok => { const it = window.DECARDS.L.lesson.items[window.DECARDS.L.i], q = it.q;
      const i = q.o.findIndex(o => o.ok === ok); document.querySelector('#ls-body .opt[data-opt="' + i + '"]').click(); return q.id; }, correct);
    await p.click("#ls-go");
    await p.waitForSelector(".ex-model");
    const r = await p.evaluate(id => window.DECARDS.state.qreview[id] || null, id);
    await p.click("#ls-go");
    return { id, r };
  }
  const first = await answer(true), second = await answer(false);
  const days = r => r && Math.round((r.due - new Date().setHours(0, 0, 0, 0)) / DAY);
  console.log("după corect:", JSON.stringify(first.r), "zile:", days(first.r), "· după greșit:", JSON.stringify(second.r), "zile:", days(second.r));
  if (!first.r || first.r.box !== 2 || days(first.r) !== 3) fail("răspunsul corect nu mută întrebarea la 3 zile");
  if (!second.r || second.r.box !== 1 || days(second.r) !== 1) fail("răspunsul greșit nu readuce întrebarea mâine");
  // 3. Al treilea răspuns corect la recapitulare scoate întrebarea din listă.
  await p.evaluate(id => { const D = window.DECARDS, S = D.state; D.L = null; document.getElementById("lesson").hidden = true;
    Object.keys(S.qreview).forEach(k => { S.qreview[k].due = Date.now() + 5 * 864e5; }); S.qreview[id] = { box: 3, due: 0, last: 0, exam: "dp750" }; D.startReview162(); }, first.id);
  await p.waitForSelector("#lesson:not([hidden])");
  const n3 = await p.evaluate(() => window.DECARDS.L.lesson.items.length);
  const third = await answer(true);
  console.log("după a treia recapitulare:", n3, "întrebare în sesiune ·", JSON.stringify(third.r));
  if (n3 !== 1 || third.id !== first.id || third.r) fail("întrebarea nu iese din listă după a treia recapitulare corectă");
  await p.evaluate(() => { window.DECARDS.L = null; document.getElementById("lesson").hidden = true; document.getElementById("nav").hidden = false; });
  // 4. Scorul de pregătire: crește cu răspunsurile corecte și numește domeniul cu cel mai mare câștig.
  const ready = await p.evaluate(() => {
    const D = window.DECARDS, S = D.state, bank = window.SEED.teste.dp750;
    S.assessments = {}; const r0 = D.readiness162("dp750");
    bank.slice(0, 60).forEach(q => { S.assessments[q.id] = { correct: true, attempts: 1, errors: 0, last: Date.now(), exam: "dp750" }; });
    const r1 = D.readiness162("dp750");
    bank.slice(0, 60).forEach(q => { S.assessments[q.id].last = Date.now() - 200 * 864e5; });
    const r2 = D.readiness162("dp750");
    bank.slice(0, 60).forEach(q => { S.assessments[q.id].last = Date.now(); });
    D.show("home");
    const card = document.querySelector("#readiness-card162 [data-exam='dp750'] h3");
    return { r0: r0.pct, r1: r1.pct, r2: r2.pct, weak: r1.weak && r1.weak.name, rows: r1.rows.map(r => r.name + " " + r.pct), card: card && card.textContent,
      others: ["dbra", "sparkcert", "awsdea", "gcppde", "snowcore", "dp700", "dbrp", "examen"].map(id => { const r = D.readiness162(id); return id + ":" + (r ? r.pct : "—"); }).join(" ") };
  });
  console.log("pregătire:", JSON.stringify(ready));
  if (ready.r0 !== 0) fail("fără răspunsuri scorul trebuie să fie 0");
  if (!(ready.r1 > ready.r0)) fail("scorul nu crește după răspunsuri corecte");
  if (!(ready.r2 < ready.r1)) fail("răspunsurile vechi ar trebui să conteze mai puțin");
  if (!ready.weak) fail("nu e recomandat niciun domeniu");
  if (!ready.card || !/DP-750 · \d+% · /.test(ready.card)) fail("cardul de pregătire lipsește de pe Azi");
  // 5. Sesiunea recomandată pornește pe domeniul slab, iar pagina examenului arată detaliile.
  await p.click("#readiness-card162 [data-readiness-start='dp750']");
  await p.waitForSelector("#lesson:not([hidden])");
  const sess = await p.evaluate(() => { const items = window.DECARDS.L.lesson.items, rows = window.DECARDS.examDomainMastery("dp750").rows, weak = window.DECARDS.readiness162("dp750").weak;
    return { n: items.length, inWeak: items.filter(it => rows[weak.index].questionIds.includes(it.q.id)).length }; });
  console.log("sesiune:", JSON.stringify(sess));
  if (sess.n !== 15 || sess.inWeak !== 15) fail("sesiunea recomandată nu are 15 întrebări din domeniul slab");
  await p.screenshot({ path: path.join(shots, "shot_review_session.png") });
  await p.evaluate(() => { window.DECARDS.L = null; document.getElementById("lesson").hidden = true; document.getElementById("nav").hidden = false; window.DECARDS.show("home"); });
  await p.evaluate(() => document.getElementById("readiness-card162").scrollIntoView());
  await p.screenshot({ path: path.join(shots, "shot_readiness_home.png") });
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

// Test Playwright pentru Atelier (1.49.0).  node tools/test_atelier.js app/assets [director-capturi]
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets"), shots = process.argv[3] || require("os").tmpdir();
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  await p.evaluate(() => { const D = window.DECARDS; D.state.settings.setup = true; const su = document.getElementById("setup"); if (su) su.hidden = true; D.learnTab = "workshop"; D.show("learn"); });
  await p.waitForSelector("[data-fx-skill]");
  const nodes = await p.$$eval("[data-fx-skill]", n => n.map(x => x.getAttribute("data-fx-skill") + ":" + x.className.split(" ").pop()));
  console.log("traseu:", nodes.join(" "));
  await p.screenshot({ path: path.join(shots, "atelier_path.png") });

  // Rulează câte un exercițiu din fiecare tip, prin interfață.
  const ids = await p.evaluate(() => { const A = window.ATELIER159, out = {}; A.exercises.forEach(e => { if (!out[e.type]) out[e.type] = e.id; }); return out; });
  async function startOne(id) {
    await p.evaluate(id => { const D = window.DECARDS, e = window.ATELIER159.exercises.find(x => x.id === id); D.startRun([{ type: "fx", ex: e, noHint: false }], { titlu: "Test" }); }, id);
    await p.waitForSelector("#lesson:not([hidden]) .fx-head159");
  }
  async function result() { await p.waitForSelector("#ls-fb:not([hidden])"); return (await p.textContent("#ls-fb")).slice(0, 80); }
  // tradeoff: răspuns greșit, apoi verificăm înregistrarea erorii
  await startOne(ids.tradeoff);
  await p.evaluate(() => { const o = [...document.querySelectorAll("[data-fx-opt]")]; const e = window.DECARDS.L.lesson.items[0].ex; const bad = o.find(x => !e.payload.options[+x.getAttribute("data-fx-opt")].ok); bad.click(); });
  await p.click("#ls-go"); console.log("decizie (greșit):", await result());
  if (!(await p.$(".fx-impact159"))) fail("lipsește „De ce contează în producție”");
  await p.screenshot({ path: path.join(shots, "atelier_feedback.png") });
  // flaw: cu indiciu, linia corectă
  await startOne(ids.flaw);
  await p.click("#ls-alt");
  if (!(await p.$(".fx-hint159"))) fail("indiciul nu apare");
  await p.evaluate(() => { const e = window.DECARDS.L.lesson.items[0].ex; document.querySelector('[data-fx-line="' + e.payload.bad + '"]').click(); });
  await p.click("#ls-go"); console.log("capcană (cu indiciu):", await result());
  // order: pașii în ordinea corectă
  await startOne(ids.order);
  const nSteps = await p.evaluate(() => window.DECARDS.L.lesson.items[0].ex.payload.steps.length);
  for (let i = 0; i < nSteps; i++) await p.click('[data-fx-step="' + i + '"]');
  await p.screenshot({ path: path.join(shots, "atelier_order.png") });
  await p.click("#ls-go"); console.log("ordine (corect):", await result());
  // slot: jetoanele corecte
  await startOne(ids.slot);
  const answers = await p.evaluate(() => window.DECARDS.L.lesson.items[0].ex.payload.answers);
  for (const a of answers) await p.click('[data-fx-chip="' + a + '"]');
  await p.click("#ls-go"); console.log("completare (corect):", await result());
  // datacheck: varianta corectă, cu diff
  await startOne(ids.datacheck);
  await p.evaluate(() => { const e = window.DECARDS.L.lesson.items[0].ex; const i = e.payload.options.findIndex(o => o.ok); document.querySelector('[data-fx-opt="' + i + '"]').click(); });
  await p.screenshot({ path: path.join(shots, "atelier_data.png") });
  await p.click("#ls-go"); console.log("verificare pe date (corect):", await result());
  console.log("diff:", (await p.textContent(".fx-diff159")).slice(0, 120));
  // Sertarul Materiale în timpul unui exercițiu, fără să pierzi răspunsul
  await startOne(ids.slot);
  await p.click('[data-fx-chip="' + answers[0] + '"]');
  await p.click("#ls-materials159");
  await p.waitForSelector("#drawer-list159 [data-drawer-card]");
  console.log("sertar:", await p.$$eval("[data-drawer-card]", x => x.length), "fișe pentru competența curentă");
  await p.click('[data-drawer-tab="notes"]');
  await p.fill("#drawer-note159", "Verific mereu IS NULL, nu = NULL.");
  await p.click("#drawer-save-note159");
  await p.screenshot({ path: path.join(shots, "atelier_drawer.png") });
  await p.evaluate(() => { document.getElementById("modal").hidden = true; });
  const kept = await p.$$eval(".fx-slot159.on", x => x.length);
  console.log("răspuns păstrat după sertar:", kept > 0);
  if (!kept) fail("răspunsul s-a pierdut după deschiderea sertarului");
  // Reluarea sesiunii
  const snap = await p.evaluate(() => JSON.stringify(window.DECARDS.sessionSnapshot()).slice(0, 120));
  console.log("instantaneu sesiune:", snap);
  if (!/"type":"fx"/.test(snap)) fail("sesiunea Atelier nu se poate relua");
  await p.evaluate(() => window.DECARDS.endLesson());
  // Starea: coada de reparat, scor, statistici, ecranul Azi
  const st = await p.evaluate(() => { const D = window.DECARDS; return { repair: D.fxRepairQueue159().map(e => e.id), aut: D.fxAutonomy159(), errors: D.state.focus159.errors, notes: Object.keys(D.state.focus159.notes).length }; });
  console.log("stare:", JSON.stringify(st));
  if (st.repair.length < 2) fail("coada de reparat trebuie să conțină exercițiul greșit și pe cel cu indiciu");
  await p.evaluate(() => window.DECARDS.show("home"));
  if (!(await p.$("#repair-card159"))) fail("lipsește „Repară lacunele” pe ecranul Azi");
  console.log("Azi:", await p.textContent("#repair-card159 h2"));
  await p.click("#repair-start159");
  await p.waitForSelector("#lesson:not([hidden]) .fx-head159");
  console.log("sesiune de reparat:", await p.evaluate(() => window.DECARDS.L.lesson.items.length), "exerciții");
  await p.evaluate(() => window.DECARDS.endLesson());
  await p.evaluate(() => window.DECARDS.show("stats"));
  await p.waitForSelector("#autonomy159");
  console.log("statistici:", (await p.textContent("#autonomy159")).replace(/\s+/g, " ").slice(0, 160));
  await p.screenshot({ path: path.join(shots, "atelier_stats.png") });
  // Sesiune pe competență: 6 exerciții, prima treaptă întâi
  const sess = await p.evaluate(() => { const D = window.DECARDS; D.startSkillSession159("sql-null", false); return D.L.lesson.items.map(i => i.ex.level).join(""); });
  console.log("sesiune competență, trepte:", sess);
  // Progres salvat (rămâne după reîncărcarea stării)
  const persisted = await p.evaluate(() => { const D = window.DECARDS; D.save(true); const s = JSON.parse(JSON.stringify(D.state)); D.state = s; return Object.keys(D.state.focus159.ex).length; });
  console.log("exerciții cu progres după reîncărcare:", persisted);
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

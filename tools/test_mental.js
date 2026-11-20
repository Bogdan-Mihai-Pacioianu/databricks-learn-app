// Test Playwright pentru traseul „Modele mentale” (1.50.0).  node tools/test_mental.js app/assets [director-capturi]
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
  await p.waitForSelector('[data-fx-track="mental"].on');
  const nodes = await p.$$eval("[data-fx-skill]", n => n.map(x => x.getAttribute("data-fx-skill")));
  console.log("module:", nodes.length, nodes.join(" "));
  if (nodes.length !== 8) fail("traseul trebuie să aibă 8 module");
  const crowns = await p.$$eval('[data-fx-skill="mm-contract"] .fx-crown159', x => x.map(c => c.textContent));
  console.log("niveluri:", crowns.join(" | "));
  await p.screenshot({ path: path.join(shots, "mental_path.png") });
  // Comutare pe Tehnic și înapoi
  await p.click('[data-fx-track="tech"]'); await p.waitForSelector('[data-fx-track="tech"].on');
  console.log("tehnic:", await p.$$eval("[data-fx-skill]", n => n.length), "competențe");
  await p.click('[data-fx-track="mental"]');
  // Sesiune pe modul: niveluri în ordine, nivelul 4 fără indicii
  const sess = await p.evaluate(() => { const D = window.DECARDS; D.startSkillSession159("mm-retry", false); return D.L.lesson.items.map(i => i.ex.id + ":" + i.ex.level); });
  console.log("sesiune mm-retry:", sess.join(" "));
  await p.waitForSelector(".fx-head159");
  console.log("eticheta primului exercițiu:", await p.textContent(".fx-type159"), "·", await p.$eval(".fx-head159 .dict-chip156:nth-child(2)", x => x.textContent));
  await p.evaluate(() => window.DECARDS.endLesson());
  // Exercițiul „Ce se strică la retry?” cu diagramă și răspuns greșit → „Ce ai ratat”
  await p.evaluate(() => { const D = window.DECARDS, e = window.ATELIER159.exercises.find(x => x.id === "mr-2"); D.startRun([{ type: "fx", ex: e, noHint: false }], { titlu: "Test" }); });
  await p.waitForSelector(".fx-flow160");
  console.log("diagramă:", await p.getAttribute(".fx-flow160", "aria-label"));
  await p.evaluate(() => { const e = window.DECARDS.L.lesson.items[0].ex; const i = e.payload.options.findIndex(o => !o.ok); document.querySelector('[data-fx-opt="' + i + '"]').click(); });
  await p.click("#ls-go");
  await p.waitForSelector(".fx-missed160");
  console.log("feedback:", (await p.textContent("#ls-fb")).slice(0, 60), "·", await p.textContent(".fx-missed160"));
  await p.screenshot({ path: path.join(shots, "mental_retry.png") });
  // „Simptom → Ipoteză”, nivel 4: fără buton de indiciu, două alegeri
  await p.evaluate(() => { const D = window.DECARDS, e = window.ATELIER159.exercises.find(x => x.id === "mi-6"); D.startRun([{ type: "fx", ex: e, noHint: false }], { titlu: "Test" }); });
  await p.waitForSelector("[data-fx-h]");
  const hintVisible = await p.evaluate(() => !document.getElementById("ls-alt").hidden);
  console.log("indiciu la nivelul 4:", hintVisible ? "vizibil (greșit)" : "ascuns");
  if (hintVisible) fail("nivelul 4 nu trebuie să ofere indicii");
  await p.evaluate(() => { const e = window.DECARDS.L.lesson.items[0].ex; document.querySelector('[data-fx-h="' + e.payload.hypotheses.findIndex(o => o.ok) + '"]').click(); });
  const enabledAfterOne = await p.evaluate(() => !document.getElementById("ls-go").disabled);
  if (enabledAfterOne) fail("„Verifică” trebuie să ceară și testul");
  await p.evaluate(() => { const e = window.DECARDS.L.lesson.items[0].ex; document.querySelector('[data-fx-t="' + e.payload.tests.findIndex(o => o.ok) + '"]').click(); });
  await p.screenshot({ path: path.join(shots, "mental_diagnose.png") });
  await p.click("#ls-go");
  console.log("diagnostic:", (await p.textContent("#ls-fb")).slice(0, 40));
  // „Găsește presupunerea ascunsă”
  await p.evaluate(() => { const D = window.DECARDS, e = window.ATELIER159.exercises.find(x => x.id === "mr-4"); D.startRun([{ type: "fx", ex: e, noHint: false }], { titlu: "Test" }); });
  await p.waitForSelector(".fx-line159");
  await p.click('[data-fx-line="1"]'); await p.click("#ls-go");
  console.log("presupunere:", (await p.textContent("#ls-fb")).slice(0, 30));
  // Sertarul: Principii (model mental + matrice), Capcane & scenarii, Jurnal liber
  await p.evaluate(() => window.DECARDS.endLesson());
  await p.evaluate(() => window.DECARDS.openDrawer159("cheat"));
  await p.selectOption("#drawer-skill159", "mm-tradeoff");
  const principles = await p.$$eval("[data-drawer-card] .dict-chip156", x => x.map(c => c.textContent));
  console.log("principii mm-tradeoff:", principles.join(", "));
  await p.click('[data-drawer-tab="traps"]');
  console.log("capcane & scenarii:", await p.$$eval("[data-drawer-card]", x => x.length));
  await p.click('[data-drawer-tab="notes"]');
  await p.fill("#drawer-journal160", "La plăți aleg consistența; la știri, viteza.");
  await p.click("#drawer-journal-save160");
  await p.screenshot({ path: path.join(shots, "mental_journal.png") });
  const journal = await p.evaluate(() => Object.keys(window.DECARDS.state.focus159.notes).filter(k => k.startsWith("j-")).length);
  console.log("notițe libere în jurnal:", journal);
  if (!journal) fail("jurnalul nu a salvat notița");
  await p.evaluate(() => { document.getElementById("modal").hidden = true; window.DECARDS.setTabMode156("workshop", "learn"); window.DECARDS.show("learn"); });
  await p.waitForSelector("[data-fx-pitfalls]");
  console.log("Învață: catalog capcane +", await p.$$eval("[data-fx-learn]", x => x.length), "module");
  await p.screenshot({ path: path.join(shots, "mental_learn.png") });
  await p.evaluate(() => window.DECARDS.show("stats"));
  await p.waitForSelector("#autonomy159");
  console.log("statistici:", (await p.textContent("#autonomy159")).replace(/\s+/g, " ").slice(0, 260));
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

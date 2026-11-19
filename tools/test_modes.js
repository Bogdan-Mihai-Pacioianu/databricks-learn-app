// Test Playwright pentru modurile Învață / Practică.  node tools/test_modes.js app/assets [director-capturi]
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets"), shots = process.argv[3] || require("os").tmpdir();
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  // Progres simulat: 30 de termeni Spark învățați, 5 scadenți, 3 greșiți.
  await p.evaluate(() => {
    const D = window.DECARDS, now = Date.now();
    D.state.settings.setup = true; const su = document.getElementById("setup"); if (su) su.hidden = true;
    window.SEED.terms.filter(t => t.deck === "spark").slice(0, 30).forEach((t, i) => {
      D.state.learn.terms[t.id] = { s: 1 + (i % 5), c: 2, g: i < 3 ? 1 : 0, last: now, lastCorrect: i >= 3, due: i < 5 ? now - 1000 : now + 86400000 * 3 };
    });
    D.learnTab = "terms"; D.state.settings.termMode156 = "learn"; D.show("learn");
  });
  await p.waitForSelector("#tab-mode-learn");
  if (!(await p.$("#open-dictionary156"))) fail("modul Învață nu mai arată dicționarul");
  if (!(await p.$("[data-lesson]"))) fail("modul Învață nu mai arată lecțiile");
  await p.screenshot({ path: path.join(shots, "mode_learn.png") });

  await p.click("#tab-mode-practice");
  await p.waitForSelector("#practice-start156");
  if (await p.$("[data-lesson]")) fail("modul Practică arată lecțiile");
  console.log("scadenți:", await p.textContent("#practice-due156"));
  console.log("info:", await p.textContent("#practice-info156"));
  await p.screenshot({ path: path.join(shots, "mode_practice.png") });

  for (const [set, type] of [["due", "mix"], ["wrong", "mcq"], ["learned", "rev"], ["learning", "recall"], ["learned", "pairs"], ["all", "mix"]]) {
    await p.selectOption("#practice-set156", set); await p.selectOption("#practice-type156", type);
    const r = await p.evaluate(([s, t]) => { const n = window.DECARDS.practicePool156(s, "").length; return { n, info: document.getElementById("practice-info156").textContent }; }, [set, type]);
    console.log(set, type, "→", r.info);
  }
  await p.selectOption("#practice-set156", "learned"); await p.selectOption("#practice-type156", "recall");
  await p.click("#practice-start156");
  await p.waitForSelector("#lesson:not([hidden])");
  const types = await p.evaluate(() => window.DECARDS.L.lesson.items.map(i => i.type));
  console.log("sesiune scris:", types.length, "exerciții, tipuri:", [...new Set(types)].join(","));
  if (types.length !== 20) fail("sesiunea nu are 20 de exerciții");
  await p.screenshot({ path: path.join(shots, "mode_practice_run.png") });
  await p.evaluate(() => window.DECARDS.endLesson());
  await p.waitForSelector("#tab-mode-practice.on");
  console.log("după sesiune rămâne în Practică: da");
  // pe domenii
  await p.click('[data-practice-deck="spark"]');
  await p.waitForSelector("#lesson:not([hidden])");
  console.log("sesiune Spark:", await p.evaluate(() => window.DECARDS.L.lesson.items.length), "exerciții");
  console.log("domenii vizibile:", await p.evaluate(() => { window.DECARDS.endLesson(); return document.querySelectorAll("#learn-body > .practice-deck-row156").length; }));
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

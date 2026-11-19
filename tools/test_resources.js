// Test Playwright pentru biblioteca de resurse.  node tools/test_resources.js app/assets [director-capturi]
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets"), shots = process.argv[3] || require("os").tmpdir();
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  await p.evaluate(() => { const D = window.DECARDS; D.state.settings.setup = true; const su = document.getElementById("setup"); if (su) su.hidden = true; });
  for (const tab of ["concepts", "terms", "sql", "py", "cert"]) {
    const n = await p.evaluate(t => { const D = window.DECARDS; D.learnTab = t; D.setTabMode156(t, "learn"); D.show("learn"); return [...document.querySelectorAll("#learn-body [data-res-open]")].map(b => b.textContent); }, tab);
    console.log(tab, "→", n.length, "butoane:", n.slice(0, 3).join(" | "));
    if (!n.length) fail("tabul " + tab + " nu are buton de resurse");
  }
  await p.evaluate(() => { const D = window.DECARDS; D.learnTab = "concepts"; D.show("learn"); });
  await p.click("#learn-body [data-res-open]");
  await p.waitForSelector("#res-list156 .res-item156");
  console.log("titlu:", await p.textContent("#modal-title"), "·", await p.textContent("#res-count156"));
  await p.selectOption("#res-area156", "kafka");
  console.log("kafka:", await p.textContent("#res-count156"));
  await p.selectOption("#res-kind156", "course");
  console.log("kafka cursuri:", await p.textContent("#res-count156"));
  await p.selectOption("#res-kind156", ""); await p.selectOption("#res-area156", "");
  await p.uncheck("#modal-body .switch input");
  const broken = await p.$$eval(".res-broken", x => x.length); console.log("nefuncționale afișate:", broken);
  await p.check("#modal-body .switch input");
  if (await p.$$eval(".res-broken", x => x.length)) fail("linkurile nefuncționale nu se ascund");
  await p.fill("#res-search156", "examen"); console.log("caută „examen”:", await p.textContent("#res-count156"));
  await p.fill("#res-search156", "");
  await p.screenshot({ path: path.join(shots, "resources.png") });
  // Certificări: butonul unui examen filtrează pe examen.
  await p.evaluate(() => { const D = window.DECARDS; document.getElementById("modal").hidden = true; D.learnTab = "cert"; D.show("learn"); });
  await p.click('[data-exam="dp750"] [data-res-open]');
  console.log("dp750:", await p.inputValue("#res-area156"), "·", await p.textContent("#res-count156"));
  const href = await p.getAttribute("#res-list156 .res-title156", "href"); console.log("primul link:", href);
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

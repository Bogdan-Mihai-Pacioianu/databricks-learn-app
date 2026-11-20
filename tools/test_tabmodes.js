// Test Playwright: fiecare tab din Învață, în ambele moduri.  node tools/test_tabmodes.js app/assets [director-capturi]
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets"), shots = process.argv[3] || "";
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  await p.evaluate(() => { const D = window.DECARDS; D.state.settings.setup = true; const su = document.getElementById("setup"); if (su) su.hidden = true; D.show("learn"); });
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  const tabs = ["paths", "career", "concepts", "terms", "scen", "sql", "py", "cert", "projects", "saved"];
  for (const tab of tabs) {
    for (const mode of ["learn", "practice"]) {
      const r = await p.evaluate(([tab, mode]) => {
        const D = window.DECARDS; D.learnTab = tab; D.setTabMode156(tab, mode); D.show("learn");
        const root = document.getElementById("learn-body");
        const on = root.querySelector('[data-tab-mode].on');
        return { on: on && on.getAttribute("data-tab-mode"), n: root.children.length, text: root.innerText.replace(/\s+/g, " ").slice(0, 2000),
          start: !!root.querySelector('[id$="-start"], #practice-start156'), lessons: root.querySelectorAll("[data-lesson]").length,
          certTests: root.querySelectorAll("[data-cert-test141]").length };
      }, [tab, mode]);
      if (r.on !== mode) fail(tab + " " + mode + ": comutatorul nu arată modul");
      if (r.n < 4) fail(tab + " " + mode + ": tabul e gol");
      if (tab === "cert" && mode === "learn" && r.certTests) fail("cert Învață arată teste");
      if (tab === "cert" && mode === "practice" && !r.certTests) fail("cert Practică nu arată teste");
      if (tab === "terms" && mode === "practice" && r.lessons) fail("termeni Practică arată lecții");
      const hint = r.text.split(" Învață Practică ")[1] || "";
      console.log(tab.padEnd(9), mode.padEnd(8), String(r.n).padStart(3), "elemente ·", hint.slice(0, 90));
      if (shots) await p.screenshot({ path: path.join(shots, "tab_" + tab + "_" + mode + ".png") });
    }
  }
  // Practica generică pornește o sesiune reală (Concepte → Spark).
  await p.evaluate(() => { const D = window.DECARDS; D.learnTab = "concepts"; D.setTabMode156("concepts", "practice"); D.show("learn"); });
  await p.selectOption("#practice156_concepts-scope", "spark");
  console.log("concepte spark:", await p.textContent("#practice156_concepts-info"));
  await p.click("#practice156_concepts-start");
  await p.waitForSelector("#lesson:not([hidden])");
  const types = await p.evaluate(() => window.DECARDS.L.lesson.items.map(i => i.type));
  console.log("sesiune:", types.length, "exerciții ·", [...new Set(types)].join(","));
  if (types.length !== 20) fail("sesiunea nu are 20 de exerciții");
  await p.evaluate(() => window.DECARDS.endLesson());
  // Cursuri → SQL
  await p.evaluate(() => { const D = window.DECARDS; D.learnTab = "paths"; D.setTabMode156("paths", "practice"); D.show("learn"); });
  await p.selectOption("#practice156_paths-scope", "sql");
  console.log("curs sql:", await p.textContent("#practice156_paths-info"));
  // Scenarii Învață: deschide o situație
  await p.evaluate(() => { const D = window.DECARDS; D.learnTab = "scen"; D.setTabMode156("scen", "learn"); D.show("learn");
    const m = document.querySelector("[data-scen-learn-mod]"); m.open = true; });
  await p.waitForSelector("[data-scen-learn]");
  await p.evaluate(() => { document.querySelector("[data-scen-learn]").open = true; });
  await p.waitForSelector("[data-scen-learn] .ex-model");
  console.log("scenariu citit:", (await p.textContent("[data-scen-learn] .ex-model")).slice(0, 100));
  if (shots) await p.screenshot({ path: path.join(shots, "tab_scen_read.png") });
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

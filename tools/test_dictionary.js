// Test Playwright pentru dicționar.  node tools/test_dictionary.js app/assets [director-capturi]
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets"), shots = process.argv[3] || require("os").tmpdir();
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  await p.evaluate(() => { const D = window.DECARDS; D.state.settings.setup = true; const su = document.getElementById("setup"); if (su) su.hidden = true; D.learnTab = "terms"; D.show("learn"); });
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };

  const stats = await p.evaluate(() => { const e = window.DECARDS.dictEntries156(); const c = {}; e.forEach(r => c[r.kind] = (c[r.kind] || 0) + 1); return { total: e.length, kinds: c, terms: window.SEED.terms.length }; });
  console.log("intrări:", JSON.stringify(stats));
  if (stats.kinds.term !== stats.terms) fail("nu toți termenii sunt în dicționar");

  await p.click("#open-dictionary156");
  await p.waitForSelector("#dict-list .dict-row156");
  console.log("titlu:", await p.textContent("#modal-title"), "·", await p.textContent("#dict-count"));
  await p.screenshot({ path: path.join(shots, "dict_letters.png") });

  await p.click('[data-dict-letter="W"]');
  console.log("W:", await p.textContent("#dict-count"));
  const alias = await p.$('[data-dict-alias]');
  if (alias) { const t = await alias.textContent(); await alias.click(); console.log("trimitere:", t, "→", await p.textContent("#dict-count")); }

  await p.fill("#dict-search", "shuffle");
  await p.waitForSelector('[data-dict-term="t-sp-01"]');
  await p.evaluate(() => { const d = document.querySelector('[data-dict-term="t-sp-01"]'); d.open = true; });
  await p.waitForSelector('[data-dict-term="t-sp-01"] .dict-uses156');
  console.log("apare în:", (await p.textContent('[data-dict-term="t-sp-01"] .dict-uses156')).slice(0, 160));
  await p.screenshot({ path: path.join(shots, "dict_term.png") });

  await p.selectOption("#dict-show", "missing");
  await p.fill("#dict-search", "");
  await p.click('[data-dict-letter="S"]');
  const miss = await p.$("[data-dict-missing]");
  if (!miss) fail("nu apar termenii fără fișă");
  else {
    await p.evaluate(() => { document.querySelector("[data-dict-missing]").open = true; });
    console.log("fără fișă:", (await p.textContent("[data-dict-missing]")).slice(0, 200));
    await p.screenshot({ path: path.join(shots, "dict_missing.png") });
    const ref = await p.$("[data-dict-missing] [data-dict-ref]");
    if (ref) { await ref.click(); await p.waitForTimeout(400); console.log("deschis material:", (await p.textContent("#modal-title").catch(() => "")) || "(alt ecran)"); }
  }
  await p.evaluate(() => window.DECARDS.openDictionary156());
  await p.selectOption("#dict-show", "all");
  await p.click(".dict-letter156");
  console.log("tot:", await p.textContent("#dict-count"));
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

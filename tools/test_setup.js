// Test Playwright pentru pasul 1 al configurării.  node tools/test_setup.js app/assets [director-capturi]
const { chromium } = require("playwright");
const path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets"), shots = process.argv[3] || require("os").tmpdir();
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 400, height: 860 } });
  const errs = []; p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  await p.goto("file://" + dir + "/index.html");
  await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  await p.evaluate(() => window.DECARDS.openSetup());
  await p.waitForSelector("#su-counter156");
  console.log("start:", await p.textContent("#su-counter156"));
  await p.click('[data-su-quick="none"]');
  const none = await p.textContent("#su-counter156"); console.log("debifat:", none);
  if (!/^0 din/.test(none)) fail("debifarea nu a mers");
  await p.click('[data-su-deck="spark"] .switch'); await p.click('[data-su-deck="delta"] .switch');
  const two = await p.textContent("#su-counter156"); console.log("două:", two);
  if (!/^2 din/.test(two)) fail("contorul nu crește la bifare");
  await p.click('[data-su-quick="main"]'); console.log("principale:", await p.textContent("#su-counter156"));
  await p.click('[data-su-quick="all"]'); console.log("toate:", await p.textContent("#su-counter156"));
  await p.click('[data-su-deck="spark"] .su-more156');
  const det = await p.textContent('[data-su-deck="spark"] .su-detail156'); console.log("spark:", det.slice(0, 200));
  if (!/carduri/.test(det)) fail("detaliile nu apar");
  await p.click('[data-su-deck="sql"] .su-more156');
  console.log("sql:", (await p.textContent('[data-su-deck="sql"] .su-detail156')).slice(0, 200));
  await p.screenshot({ path: path.join(shots, "setup_step1.png") });
  // Continuă salvează alegerea.
  await p.click('[data-su-quick="main"]');
  await p.click("#su-next"); await p.click("#su-next"); await p.click("#su-next");
  const saved = await p.evaluate(() => { const d = window.DECARDS.state.settings.decks; return [d.spark, d["dp750-m1"]]; });
  console.log("salvat spark/dp750-m1:", saved);
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

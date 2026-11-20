// Test Playwright pentru pornirea mai rapidă (1.52.0).  node tools/test_lazy.js app/assets
// Graful căutării și arhiva de întrebări vin din seed-lazy162.js, după primul ecran.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const dir = path.resolve(process.argv[2] || "app/assets");
  const fail = m => { console.log("EȘEC:", m); process.exitCode = 1; };
  // 1. Fișierele: cards.js nu mai conține graful, index.html nu încarcă fișierul întârziat.
  const head = fs.readFileSync(path.join(dir, "cards.js"), "utf8");
  if (head.includes('"knowledgeGraph":') || head.includes('"questionArchive":')) fail("cards.js conține încă graful sau arhiva");
  if (fs.readFileSync(path.join(dir, "index.html"), "utf8").includes("seed-lazy162.js")) fail("index.html încarcă seed-lazy162.js la pornire");
  console.log("cards.js:", (fs.statSync(path.join(dir, "cards.js")).size / 1e6).toFixed(1), "MB · seed-lazy162.js:", (fs.statSync(path.join(dir, "seed-lazy162.js")).size / 1e6).toFixed(1), "MB");

  const b = await chromium.launch();
  const errs = [];
  async function open() {
    const p = await b.newPage({ viewport: { width: 400, height: 860 } });
    p.on("pageerror", e => errs.push(String(e))); p.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
    await p.goto("file://" + dir + "/index.html");
    await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
    return p;
  }
  // 2. Căutarea deschisă imediat după pornire așteaptă graful și apoi se deschide.
  const p1 = await open();
  const early = await p1.evaluate(() => !window.SEED.knowledgeGraph);
  // Ca butonul „Caută în toată aplicația” (ecranul de configurare îl acoperă la prima pornire).
  const opened = await p1.evaluate(() => window.DECARDS.openSearch());
  if (opened !== true) fail("openSearch nu a acceptat cererea");
  await p1.waitForFunction(() => !document.querySelector("#modal").hidden && document.querySelector("#modal-title").textContent === "Caută în toată aplicația", null, { timeout: 30000 })
    .catch(() => fail("căutarea nu s-a deschis"));
  console.log("graful lipsea la pornire:", early);
  // 3. După încărcare: graful, corecturile cursurilor, arhiva de întrebări, căutarea.
  const p2 = await open();
  await p2.waitForFunction(() => !!window.SEED.knowledgeGraph, null, { timeout: 30000 }).catch(() => fail("graful nu s-a încărcat"));
  const r = await p2.evaluate(() => {
    const S = window.SEED, D = window.DECARDS, keys = new Set(S.knowledgeGraph.nodes.map(n => n.key));
    const archived = Object.values(S.questionArchive || {})[0];
    return {
      nodes: S.knowledgeGraph.nodes.length,
      unitsMissing: S.courses145.units.filter(u => !keys.has("lesson:" + u.id)).length,
      archived: !!archived && !!D.knowledgeMaterial("question", archived.id),
      search: D.searchAll("Delta").length,
    };
  });
  console.log(JSON.stringify(r));
  if (r.unitsMissing) fail(r.unitsMissing + " lecții de curs lipsesc din căutare");
  if (!r.archived) fail("întrebările din arhivă nu se mai găsesc");
  if (!r.search) fail("căutarea nu întoarce rezultate");
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

// Test Playwright pentru fișele adăugate în 1.48.4.  node tools/test_enrich.js app/assets
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
    const S = window.SEED, D = window.DECARDS, out = { info: S.enrich157 };
    const s3 = S.terms.find(t => t.t === "S3");
    out.s3 = !!s3;
    out.dict = D.dictEntries156().filter(e => e.word === "S3").map(e => e.kind);
    out.uc = D.dictEntries156().filter(e => e.word === "UC").map(e => e.kind + "→" + e.term.t);
    const u = D.learnUnits().find(x => x.deck.id === "aws");
    out.awsLesson = u && u.lessons.some(l => l.terms.some(t => t.t === "S3"));
    out.cardInDeck = S.cards.filter(c => c.id.startsWith("c157-")).length;
    out.qPool = D.practicePool2156({ id: "x", decks: ["kafka"], certs: [] }, { question: true }, "all").filter(x => x.item.q.id.startsWith("q157-")).length;
    out.recall = D.checkRecall(s3, "Amazon Simple Storage Service");
    return out;
  });
  console.log(JSON.stringify(r));
  if (!r.s3 || r.dict[0] !== "term") fail("S3 nu e termen în dicționar");
  if (!r.awsLesson) fail("S3 nu apare în lecțiile AWS");
  if (!r.qPool) fail("întrebarea Kafka nouă nu apare în practică");
  // Lecția care conține S3 pornește fără erori.
  await p.evaluate(() => { const D = window.DECARDS; const u = D.learnUnits().find(x => x.deck.id === "aws"); const l = u.lessons.find(l => l.terms.some(t => t.t === "S3")); D.startLesson("aws", l.idx); });
  await p.waitForSelector("#lesson:not([hidden])");
  console.log("lecție:", await p.textContent("#ls-body .ls-term"));
  console.log("erori:", errs.length ? errs : "niciuna");
  if (errs.length) process.exitCode = 1;
  await b.close();
})();

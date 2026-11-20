// Verifică fiecare URL din app/resources-urls.txt și scrie rezultatul în
// app/assets/resources-status156.json și în jurnalul jobului (o linie per URL).
// Rulează în GitHub Actions, unde există acces la internet.  node tools/check_links.js
const fs = require("fs");
const urls = fs.readFileSync("app/resources-urls.txt", "utf8").split("\n").map(s => s.trim()).filter(Boolean);
const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
async function check(url) {
  for (const method of ["HEAD", "GET"]) {
    try {
      const ctl = new AbortController(), t = setTimeout(() => ctl.abort(), 25000);
      const r = await fetch(url, { method, redirect: "follow", signal: ctl.signal, headers: { "user-agent": UA, accept: "text/html,application/pdf,*/*" } });
      clearTimeout(t);
      if (method === "HEAD" && r.status >= 400) continue;
      return { code: r.status, final: r.url };
    } catch (e) { if (method === "GET") return { code: 0, error: String((e.cause && e.cause.code) || e.name) }; }
  }
}
(async () => {
  const out = {}, queue = urls.slice();
  await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) { const u = queue.shift(); out[u] = await check(u); } }));
  const by = {};
  Object.values(out).forEach(r => { const k = r.code >= 200 && r.code < 400 ? "ok" : r.code === 403 || r.code === 429 ? "blocked" : "broken"; by[k] = (by[k] || 0) + 1; });
  const result = { checked: new Date().toISOString().slice(0, 10), summary: by, urls: out };
  fs.writeFileSync("app/assets/resources-status156.json", JSON.stringify(result, null, 1) + "\n");
  console.log("REZUMAT " + JSON.stringify(by));
  // O linie per URL, ușor de citit din jurnal: LINK <cod> <url> -> <final>
  Object.entries(out).forEach(([u, r]) => console.log("LINK " + (r.code || r.error) + " " + u + (r.final && r.final !== u ? " -> " + r.final : "")));
  const lines = ["## Verificarea linkurilor", "", `ok: ${by.ok || 0} · blocate (403/429): ${by.blocked || 0} · nefuncționale: ${by.broken || 0}`, "", "| Cod | URL | Final |", "|---|---|---|"];
  Object.entries(out).filter(([, r]) => !(r.code >= 200 && r.code < 400)).forEach(([u, r]) => lines.push(`| ${r.code || r.error} | ${u} | ${r.final || ""} |`));
  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
})();

// Verificarea calității aplicației în browser.
//   node tools/qa_app.js app/assets [raport.md]
// Pe fiecare ecran și tab, la 360 px și 412 px, în temă întunecată și luminoasă:
// depășire pe orizontală, butoane prea mici, elemente fără nume accesibil, contrast,
// erori în consolă. Plus: timp de pornire, backup și restaurare, reluarea sesiunii după reîncărcare.
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const dir = path.resolve(process.argv[2] || "app/assets"), reportPath = process.argv[3];
const errors = [], warns = [], info = [];
const err = (k, m) => errors.push([k, m]), warn = (k, m) => warns.push([k, m]);
const TABS = ["paths", "career", "concepts", "terms", "scen", "sql", "py", "cert", "projects", "workshop", "saved"];

async function audit(p, label) {
  return p.evaluate(label => {
    const vw = document.documentElement.clientWidth, out = { overflow: [], small: [], tiny: [], unnamed: [], contrast: [] };
    const visible = el => { const r = el.getBoundingClientRect(), cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none" && !el.closest("[hidden]"); };
    const desc = el => (el.id ? "#" + el.id : el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/)[0] : "")) + " „" + (el.textContent || el.getAttribute("aria-label") || "").trim().slice(0, 30) + "”";
    if (document.documentElement.scrollWidth > vw + 1) {
      document.querySelectorAll("body *").forEach(el => { if (!visible(el)) return; const r = el.getBoundingClientRect(); if (r.right > vw + 1 && !el.closest(".fx-table-wrap159,.fx-code159,.study-table132,.fx-tpl159,pre,table,.seg")) out.overflow.push(desc(el) + " (" + Math.round(r.right) + "px)"); });
      if (!out.overflow.length) out.overflow.push("pagina e mai lată decât ecranul (" + document.documentElement.scrollWidth + "px)");
    }
    document.querySelectorAll("button, a[href], select, input, textarea, summary, [role=button]").forEach(el => {
      if (!visible(el) || el.disabled) return;
      const r = el.getBoundingClientRect();
      if (el.closest("#nav")) return;
      // O căsuță într-un rând-etichetă mare e atinsă prin toată eticheta; un link în mijlocul unui paragraf e exceptat (WCAG 2.5.8).
      const host = el.closest("label"), hostR = host && host.getBoundingClientRect();
      const inlineLink = el.tagName === "A" && el.closest("p, li") && (el.closest("p, li").textContent.trim().length > (el.textContent || "").trim().length + 10);
      const target = hostR && hostR.height >= 36 ? hostR : r;
      if (inlineLink) { if (r.height < 24) out.small.push(desc(el) + " (link în text) " + Math.round(r.width) + "×" + Math.round(r.height)); }
      else if (target.height < 24 || target.width < 24) out.tiny.push(desc(el) + " " + Math.round(r.width) + "×" + Math.round(r.height));
      else if (target.height < 36) out.small.push(desc(el) + " " + Math.round(r.width) + "×" + Math.round(r.height));
      const name = (el.getAttribute("aria-label") || el.getAttribute("title") || el.textContent || el.getAttribute("placeholder") || "").trim();
      const labelled = el.id && document.querySelector('label[for="' + el.id + '"]') || el.closest("label");
      if (!name && !labelled) out.unnamed.push(desc(el));
    });
    document.querySelectorAll("img").forEach(el => { if (visible(el) && !el.hasAttribute("alt")) out.unnamed.push("img fără alt: " + (el.getAttribute("src") || "").slice(0, 40)); });
    // Contrast: textul vizibil față de primul fundal opac din strămoși.
    const rgb = s => (s.match(/[\d.]+/g) || []).map(Number);
    const lum = c => { const a = c.slice(0, 3).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]; };
    const bgOf = el => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length >= 3 && (c.length < 4 || c[3] > 0.9)) return c; } return rgb(getComputedStyle(document.body).backgroundColor); };
    const seen = new Set();
    document.querySelectorAll("p, span, b, h1, h2, h3, h4, button, label, li, summary, a").forEach(el => {
      if (!visible(el) || !el.childNodes.length || ![...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) return;
      const cs = getComputedStyle(el); if (parseFloat(cs.opacity) < 1 || el.closest("[disabled]") || el.disabled) return;
      const fg = rgb(cs.color), bg = bgOf(el), l1 = lum(fg), l2 = lum(bg), ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      const big = parseFloat(cs.fontSize) >= 18.5 || (parseFloat(cs.fontSize) >= 14 && +cs.fontWeight >= 700);
      if (ratio < (big ? 3 : 4.5)) { const k = desc(el); if (!seen.has(k)) { seen.add(k); out.contrast.push(k + " " + ratio.toFixed(2) + ":1"); } }
    });
    return out;
  }, label);
}

(async () => {
  const b = await chromium.launch();
  for (const width of [360, 412]) for (const theme of ["dark", "light"]) {
    const p = await b.newPage({ viewport: { width, height: 800 } });
    const cons = []; p.on("pageerror", e => cons.push(String(e))); p.on("console", m => { if (m.type() === "error") cons.push(m.text()); });
    const t0 = Date.now();
    await p.goto("file://" + dir + "/index.html");
    await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
    const ms = Date.now() - t0;
    if (width === 360 && theme === "dark") { info.push(["pornire", "aplicația e gata în " + ms + " ms"]); if (ms > 15000) err("pornire lentă", ms + " ms"); }
    await p.evaluate(theme => { const D = window.DECARDS; D.state.settings.setup = true; D.state.settings.theme = theme; const su = document.getElementById("setup"); if (su) su.hidden = true; D.reload(); D.state.settings.setup = true; }, theme);
    const screens = [["Azi", () => window.DECARDS.show("home")], ["Statistici", () => window.DECARDS.show("stats")], ["Setări", () => window.DECARDS.show("settings")], ["Carduri", () => window.DECARDS.show("browse")]];
    const results = [];
    for (const [name, fn] of screens) { await p.evaluate(fn); await p.waitForTimeout(250); results.push([name, await audit(p, name)]); }
    for (const tab of TABS) for (const mode of ["learn", "practice"]) {
      await p.evaluate(([tab, mode]) => { const D = window.DECARDS; D.learnTab = tab; D.setTabMode156(tab, mode); D.show("learn"); }, [tab, mode]);
      await p.waitForTimeout(250); results.push(["Învață/" + tab + "/" + mode, await audit(p, tab)]);
    }
    // Ecranul unei sesiuni din Atelier și sertarul Materiale.
    await p.evaluate(() => { const e = window.ATELIER159.exercises.find(x => x.type === "datacheck"); window.DECARDS.startRun([{ type: "fx", ex: e }], { titlu: "QA" }); });
    await p.waitForTimeout(250); results.push(["Sesiune Atelier", await audit(p, "fx")]);
    await p.evaluate(() => window.DECARDS.openDrawer159("cheat")); await p.waitForTimeout(250); results.push(["Sertar Materiale", await audit(p, "drawer")]);
    await p.evaluate(() => { document.getElementById("modal").hidden = true; window.DECARDS.endLesson(); });
    const tag = width + "px/" + (theme === "dark" ? "întunecat" : "luminos");
    results.forEach(([name, r]) => {
      if (r.overflow.length) err("depășire pe orizontală", tag + " · " + name + ": " + r.overflow.slice(0, 3).join("; "));
      if (r.tiny.length) err("element atingibil sub 24 px", tag + " · " + name + ": " + r.tiny.slice(0, 3).join("; "));
      if (r.small.length) warn("buton sub 36 px înălțime", tag + " · " + name + ": " + r.small.length + ", de ex. " + r.small.slice(0, 2).join("; "));
      if (r.unnamed.length) err("element fără nume accesibil", tag + " · " + name + ": " + r.unnamed.slice(0, 3).join("; "));
      if (r.contrast.length) warn("contrast insuficient", tag + " · " + name + ": " + r.contrast.length + ", de ex. " + r.contrast.slice(0, 2).join("; "));
    });
    if (cons.length) err("erori în consolă", tag + ": " + cons.slice(0, 3).join(" | "));
    await p.close();
  }

  // ---- Backup și restaurare: progresul complet supraviețuiește ----
  {
    const p = await b.newPage({ viewport: { width: 400, height: 800 } });
    await p.goto("file://" + dir + "/index.html");
    await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
    const r = await p.evaluate(() => {
      const D = window.DECARDS, S = D.state, A = window.ATELIER159;
      S.settings.setup = true;
      D.fxRecord159(A.exercises[0], true, false); D.fxRecord159(A.exercises[1], false, false);
      S.focus159.notes["j-qa"] = { text: "notiță de test", at: Date.now(), skill: "" };
      const t = window.SEED.terms[0]; S.learn.terms[t.id] = { s: 3, c: 3, g: 0, last: Date.now(), due: Date.now() + 1e8 };
      S.assessments["qa-test"] = { correct: true, attempts: 1, errors: 0, last: Date.now() };
      const raw = JSON.stringify({ app: "decards", v: 1, exported: new Date().toISOString(), state: S });
      const back = D.inspectBackup(raw), st = back.state || back;
      return { ex: Object.keys((st.focus159 || {}).ex || {}).length, notes: Object.keys((st.focus159 || {}).notes || {}).length,
               terms: Object.keys((st.learn || {}).terms || {}).length, assess: !!(st.assessments || {})["qa-test"] };
    });
    info.push(["backup", JSON.stringify(r)]);
    if (r.ex < 2 || !r.notes || !r.terms || !r.assess) err("backup incomplet", JSON.stringify(r));
    await p.close();
  }

  // ---- Reluarea sesiunii după reîncărcarea paginii, pentru fiecare tip de exercițiu ----
  {
    const ctx = await b.newContext({ viewport: { width: 400, height: 800 } }), p = await ctx.newPage();
    await p.goto("file://" + dir + "/index.html");
    await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
    const kinds = await p.evaluate(() => {
      const D = window.DECARDS, A = window.ATELIER159, S = window.SEED;
      D.state.settings.setup = true;
      const fx = ["tradeoff", "flaw", "order", "slot", "datacheck", "diagnose"].map(t => A.exercises.find(e => e.type === t)).filter(Boolean).map(e => ({ type: "fx", ex: e }));
      const t = S.terms[0];
      const q = S.teste.dp750[0];
      D.startRun(fx.concat([D.revItem(t), D.recallItem(t), { type: "exam", q, exam: "dp750" }]), { titlu: "QA reluare" });
      D.L.i = 2; D.save(true);
      return D.L.lesson.items.map(i => i.type + (i.ex ? ":" + i.ex.type : "")).join(",");
    });
    await p.waitForTimeout(500);
    await p.reload();
    await p.waitForFunction(() => window.DECARDS && window.DECARDS.state, null, { timeout: 90000 });
    const r = await p.evaluate(() => { const D = window.DECARDS; const ok = D.resumeSession(); const L = D.L; return { ok: !!ok, n: L ? L.lesson.items.length : 0, i: L ? L.i : -1, types: L ? L.lesson.items.map(i => i.type + (i.ex ? ":" + i.ex.type : "")).join(",") : "" }; });
    info.push(["reluare sesiune", "înainte: " + kinds + " · după reîncărcare: " + JSON.stringify(r)]);
    if (!r.ok || r.types !== kinds || r.i !== 2) err("reluarea sesiunii", "așteptat " + kinds + " la poziția 2, primit " + JSON.stringify(r));
    await ctx.close();
  }
  await b.close();

  const group = list => { const g = {}; list.forEach(([k, m]) => (g[k] = g[k] || []).push(m)); return g; };
  const lines = ["# Raport de calitate a aplicației", "", "Generat de `tools/qa_app.js` la " + new Date().toISOString().slice(0, 10) + ".", "",
    "Ecrane verificate: Azi, Statistici, Setări, Carduri, toate cele " + TABS.length + " taburi din Învață în ambele moduri, o sesiune Atelier și sertarul Materiale, la 360 px și 412 px, în temă întunecată și luminoasă.", "",
    "| | Număr |", "|---|---:|", "| Erori | " + errors.length + " |", "| Avertismente | " + warns.length + " |", ""];
  [["Erori", errors], ["Avertismente", warns], ["Informații", info]].forEach(([title, list]) => {
    lines.push("## " + title, ""); if (!list.length) lines.push("Niciuna.", "");
    Object.entries(group(list)).forEach(([k, msgs]) => { lines.push("### " + k + " (" + msgs.length + ")", ""); msgs.slice(0, 30).forEach(m => lines.push("- " + m)); if (msgs.length > 30) lines.push("- … și încă " + (msgs.length - 30)); lines.push(""); });
  });
  if (reportPath) fs.writeFileSync(reportPath, lines.join("\n") + "\n");
  console.log("erori:", errors.length, "· avertismente:", warns.length);
  Object.entries(group(errors)).forEach(([k, m]) => console.log("  EROARE", k + ":", m.length, "·", m.slice(0, 2).join(" | ")));
  Object.entries(group(warns)).forEach(([k, m]) => console.log("  avertisment", k + ":", m.length, "·", m[0]));
  info.forEach(([k, m]) => console.log("  info", k + ":", m.slice(0, 200)));
  process.exitCode = errors.length ? 1 : 0;
})();

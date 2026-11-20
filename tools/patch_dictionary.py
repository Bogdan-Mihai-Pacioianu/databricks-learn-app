# Dicționarul termenilor: index A–Z cu toți termenii, denumirile alternative și
# termenii folosiți în conținut fără fișă, plus unde apare fiecare termen.
# Se aplică după tools/patch_terms.py (folosește termIsDue și termExercise).
#
#   python tools/patch_dictionary.py app/assets
import os, sys

assets = sys.argv[1]


def load(name):
    src = open(os.path.join(assets, name), encoding="utf-8", newline="").read()
    crlf = "\r\n" in src
    return src.replace("\r\n", "\n"), crlf


def store(name, src, crlf):
    open(os.path.join(assets, name), "w", encoding="utf-8", newline="").write(src.replace("\n", "\r\n") if crlf else src)


def rep(src, old, new):
    n = src.count(old)
    if n != 1:
        sys.exit("Înlocuirea nu se potrivește (%d apariții):\n%s" % (n, old[:200]))
    return src.replace(old, new)


# ---------------------------------------------------------------- app.js
js, crlf = load("app.js")
if "function openDictionary156" in js:
    sys.exit("Dicționarul este deja aplicat.")

js = rep(js, '''  function termsOfDeck(deckId) {''', r'''  // ---------------------------------------------------------------- Dicționar
  var DICT_KINDS156 = { card: ["card", "carduri"], lesson: ["lecție", "lecții"], exercise: ["exercițiu", "exerciții"],
    "case": ["studiu de caz", "studii de caz"], question: ["întrebare", "întrebări"], term: ["fișă", "alte fișe"] };
  function dictData156() { return window.DICT156 || { terms: {}, candidates: [], docs: {} }; }
  function dictLetter156(word) {
    var c = searchKey(word).replace(/^[^a-z0-9]+/, "").charAt(0).toUpperCase();
    return /[A-Z]/.test(c) ? c : "#";
  }
  function dictStatus156(term) {
    var s = termStrength(term.id);
    if (s > 0 && termIsDue(term.id)) return ["de repetat", "due"];
    if (s >= MAX_STRENGTH) return ["știut", "known"];
    if (s > 0) return ["în curs · " + s + "/" + MAX_STRENGTH, "learning"];
    return ["nou", "new"];
  }
  /** Toate intrările: termeni cu fișă, denumiri alternative (trimiteri) și termeni din conținut fără fișă. */
  function dictEntries156() {
    var rows = [], seen = {};
    allTerms().forEach(function (t) {
      rows.push({ kind: "term", word: t.t, term: t });
      seen[searchKey(t.t)] = true;
    });
    allTerms().forEach(function (t) {
      termAnswers(t).forEach(function (a) {
        var k = searchKey(a);
        if (seen[k] || a.length < 2) return;
        seen[k] = true;
        rows.push({ kind: "alias", word: a, term: t });
      });
    });
    (dictData156().candidates || []).forEach(function (c) {
      var k = searchKey(c.w);
      if (seen[k]) return;
      seen[k] = true;
      rows.push({ kind: "missing", word: c.w, cand: c });
    });
    rows.forEach(function (r) { r.key = searchKey(r.word); r.letter = dictLetter156(r.word); });
    return rows.sort(function (a, b) { return a.word.localeCompare(b.word, "ro", { sensitivity: "base" }) || a.word.localeCompare(b.word); });
  }
  function dictOpenRef156(kind, id) {
    closeModal();
    if (kind === "case") { openCaseStudy(id); return; }
    if (kind === "term") { var t = termById(id); if (t) openSaved({ kind: "term", id: id, title: t.t, material: t }); return; }
    openRelatedExplanation(kind, id);
  }
  function dictRefLabel156(kind, id) {
    if (kind === "term") { var t = termById(id); return t ? t.t : id; }
    if (kind === "case") { var c = (SEED.caseStudies || []).filter(function (x) { return x.id === id; })[0]; return c ? c.titlu : id; }
    var r = relatedResource(kind, id);
    return r ? String(materialTitle(kind, r) || id).replace(/[`*_#>]/g, "").slice(0, 90) : id;
  }
  /** „Apare în”: numărul de materiale pe tipuri și primele trimiteri, deschise direct. */
  function dictAppendUses156(host, counts, refs, onTerm) {
    var kinds = Object.keys(DICT_KINDS156).filter(function (k) { return counts[k]; });
    var box = el("section", "dict-uses156");
    box.appendChild(el("h3", null, "Apare în"));
    if (!kinds.length) {
      box.appendChild(el("p", "muted", "Nu apare cu această denumire în cardurile, lecțiile, exercițiile sau întrebările aplicației."));
      host.appendChild(box); return;
    }
    box.appendChild(el("p", "muted", kinds.map(function (k) { var n = counts[k]; return n + " " + DICT_KINDS156[k][n === 1 ? 0 : 1]; }).join(" · ")));
    kinds.forEach(function (k) {
      var list = el("div", "dict-refs156");
      (refs[k] || []).forEach(function (id) {
        var b = el("button", "btn mini secondary", (k === "term" ? "" : DICT_KINDS156[k][0] + " · ") + dictRefLabel156(k, id));
        b.setAttribute("data-dict-ref", k + ":" + id);
        b.onclick = function () { if (k === "term" && onTerm) onTerm(id); else dictOpenRef156(k, id); };
        list.appendChild(b);
      });
      if (counts[k] > (refs[k] || []).length) list.appendChild(el("span", "muted", "și încă " + (counts[k] - refs[k].length)));
      box.appendChild(list);
    });
    host.appendChild(box);
  }
  function openDictionary156(startWord) {
    var body = $("#modal-body"); body.innerHTML = "";
    var data = dictData156(), entries = dictEntries156();
    var nTerms = allTerms().length, nAlias = entries.filter(function (r) { return r.kind === "alias"; }).length,
        nMissing = entries.filter(function (r) { return r.kind === "missing"; }).length;
    $("#modal-title").textContent = "Dicționar · " + entries.length + " intrări";
    var raw = state.settings.dictionary156 || {};
    var prefs = { letter: typeof raw.letter === "string" ? raw.letter : "A", show: ["all", "terms", "missing"].indexOf(raw.show) >= 0 ? raw.show : "all",
                  deck: typeof raw.deck === "string" ? raw.deck : "", stage: ["", "new", "learning", "due", "known"].indexOf(raw.stage) >= 0 ? raw.stage : "" };
    var docs = data.docs || {}, nDocs = Object.keys(docs).reduce(function (s, k) { return s + docs[k]; }, 0);
    body.appendChild(el("p", "muted", nTerms + " termeni cu fișă · " + nAlias + " denumiri alternative · " + nMissing +
      " termeni din conținut fără fișă" + (nDocs ? " · inventar din " + nDocs + " materiale" + (data.built ? " (" + data.built + ")" : "") : "")));

    // Inventarul pe domenii: câți termeni are fiecare domeniu și cât de bine îi știi.
    var inv = el("details", "unit dict-inventory156"); inv.appendChild(el("summary", null, "Inventar pe domenii"));
    var table = el("div", "dict-inv-rows156");
    allDecks().forEach(function (d) {
      var ts = termsOfDeck(d.id); if (!ts.length) return;
      var known = ts.filter(function (t) { return termStrength(t.id) >= MAX_STRENGTH; }).length,
          started = ts.filter(function (t) { var s = termStrength(t.id); return s > 0 && s < MAX_STRENGTH; }).length,
          used = ts.filter(function (t) { var x = (data.terms || {})[t.id]; return x && Object.keys(x.n || {}).some(function (k) { return k !== "term"; }); }).length;
      var row = el("button", "dict-inv-row156");
      row.appendChild(el("b", null, d.name));
      row.appendChild(el("span", "muted", ts.length + " termeni · " + known + " știuți · " + started + " în curs · " + used + " folosiți în materiale"));
      row.onclick = function () { deck.value = d.id; prefs.letter = ""; query.value = ""; render(); };
      table.appendChild(row);
    });
    inv.appendChild(table); body.appendChild(inv);

    var query = el("input"); query.id = "dict-search"; query.type = "search"; query.maxLength = 120;
    query.placeholder = "Caută un termen, acronim sau sinonim…"; query.setAttribute("aria-label", "Caută în dicționar");
    body.appendChild(query);
    var controls = el("div", "glossary-controls133"); body.appendChild(controls);
    function choice(id, label, rows, value) {
      var f = el("label", "filter-field"); f.appendChild(el("span", null, label));
      var s = el("select"); s.id = id; s.setAttribute("aria-label", label);
      rows.forEach(function (r) { s.appendChild(new Option(r[1], r[0])); }); s.value = value;
      f.appendChild(s); controls.appendChild(f); return s;
    }
    var show = choice("dict-show", "Intrări", [["all", "Toate"], ["terms", "Doar cu fișă"], ["missing", "Fără fișă (din conținut)"]], prefs.show);
    var deck = choice("dict-deck", "Domeniu", [["", "Toate domeniile"]].concat(allDecks().filter(function (d) { return termsOfDeck(d.id).length; }).map(function (d) { return [d.id, d.name]; })), prefs.deck);
    var stage = choice("dict-stage", "Stadiu", [["", "Orice stadiu"], ["new", "Noi"], ["learning", "În curs"], ["due", "De repetat"], ["known", "Știuți"]], prefs.stage);
    var letters = el("div", "dict-letters156"); letters.setAttribute("role", "toolbar"); letters.setAttribute("aria-label", "Litere");
    body.appendChild(letters);
    var count = el("p", "muted"); count.id = "dict-count"; count.setAttribute("aria-live", "polite"); body.appendChild(count);
    var list = el("div"); list.id = "dict-list"; body.appendChild(list);

    function accept(r) {
      if (show.value === "terms" && r.kind === "missing") return false;
      if (show.value === "missing" && r.kind !== "missing") return false;
      if ((deck.value || stage.value) && !r.term) return false;
      if (deck.value && r.term.deck !== deck.value) return false;
      if (stage.value && dictStatus156(r.term)[1] !== stage.value) return false;
      return true;
    }
    function jumpTo(word) { query.value = word; render(); list.scrollIntoView({ block: "start" }); }
    function remember() {
      prefs.show = show.value; prefs.deck = deck.value; prefs.stage = stage.value;
      state.settings.dictionary156 = { letter: prefs.letter, show: prefs.show, deck: prefs.deck, stage: prefs.stage }; save();
    }
    function entryRow(r) {
      if (r.kind === "alias") {
        var a = el("button", "dict-alias156");
        a.setAttribute("data-dict-alias", r.term.id);
        a.appendChild(el("b", null, r.word)); a.appendChild(el("span", "muted", " → vezi " + r.term.t));
        a.onclick = function () { jumpTo(r.term.t); };
        return a;
      }
      var row = el("details", "unit glossary-row133 dict-row156"), summary = el("summary");
      summary.appendChild(el("span", "glossary-term133", r.word));
      if (r.kind === "missing") {
        row.setAttribute("data-dict-missing", r.word);
        summary.appendChild(el("span", "dict-chip156 missing", "fără fișă"));
        var k = r.cand.k || {};
        summary.appendChild(el("span", "glossary-brief133", "Folosit de " + r.cand.n + " ori în materiale: " +
          Object.keys(k).map(function (x) { return k[x] + " " + DICT_KINDS156[x][k[x] === 1 ? 0 : 1]; }).join(", ") + "."));
      } else {
        row.setAttribute("data-dict-term", r.term.id);
        var st = dictStatus156(r.term), dk = deckById(r.term.deck);
        summary.appendChild(el("span", "dict-chip156 " + st[1], st[0]));
        summary.appendChild(el("span", "glossary-brief133", (dk ? dk.name + " · " : "") + (r.term.d.length > 140 ? r.term.d.slice(0, 137) + "…" : r.term.d)));
      }
      row.appendChild(summary);
      var loaded = false;
      row.addEventListener("toggle", function () {
        if (!row.open || loaded) return; loaded = true;
        if (r.kind === "missing") {
          row.appendChild(el("p", "muted", "Termenul apare în conținutul aplicației, dar nu are încă o fișă cu definiție. Deschide un material ca să-l vezi în context."));
          var counts = {}, refs = {};
          (r.cand.r || []).forEach(function (x) { refs[x[0]] = refs[x[0]] || []; refs[x[0]].push(x[1]); });
          Object.keys(r.cand.k || {}).forEach(function (x) { counts[x] = r.cand.k[x]; refs[x] = refs[x] || []; });
          dictAppendUses156(row, counts, refs);
          return;
        }
        var t = r.term, d = el("div", "md"); d.innerHTML = renderMd(t.d); row.appendChild(d);
        appendTermDetails(row, t);
        var others = termAnswers(t).filter(function (x) { return x !== t.t; });
        if (others.length) row.appendChild(el("p", "muted", "Denumiri alternative: " + others.join(", ")));
        var info = (data.terms || {})[t.id] || { n: {}, r: {} };
        dictAppendUses156(row, info.n || {}, info.r || {}, function (id) { var o = termById(id); if (o) jumpTo(o.t); });
        var actions = el("div", "dict-refs156");
        var practice = el("button", "btn mini primary", "Exersează termenul");
        practice.onclick = function () { closeModal(); startRun([{ type: "intro", term: t }, termExercise(t)], { titlu: t.t }); };
        actions.appendChild(practice); row.appendChild(actions);
        libraryControls(row, "term", t.id);
      });
      return row;
    }
    function render() {
      var q = searchKey(query.value.trim()).replace(/\s+/g, " ");
      var pool = entries.filter(accept);
      // Bara de litere arată doar literele care au intrări după filtrele curente.
      var byLetter = {}; pool.forEach(function (r) { byLetter[r.letter] = (byLetter[r.letter] || 0) + 1; });
      var order = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("").filter(function (l) { return byLetter[l]; });
      if (!q && prefs.letter && order.indexOf(prefs.letter) < 0) prefs.letter = order[0] || "";
      letters.innerHTML = "";
      var allB = el("button", "dict-letter156" + (!q && !prefs.letter ? " on" : ""), "Tot");
      allB.onclick = function () { prefs.letter = ""; query.value = ""; render(); }; letters.appendChild(allB);
      order.forEach(function (l) {
        var b = el("button", "dict-letter156" + (!q && prefs.letter === l ? " on" : ""), l);
        b.setAttribute("data-dict-letter", l); b.setAttribute("aria-pressed", String(!q && prefs.letter === l));
        b.title = byLetter[l] + " intrări";
        b.onclick = function () { prefs.letter = l; query.value = ""; render(); };
        letters.appendChild(b);
      });
      var rows = q ? pool.filter(function (r) { return r.key.indexOf(q) >= 0; })
                     .sort(function (a, b) { return (b.key === q) - (a.key === q) || (b.key.indexOf(q) === 0) - (a.key.indexOf(q) === 0) || a.word.localeCompare(b.word, "ro", { sensitivity: "base" }); })
                   : prefs.letter ? pool.filter(function (r) { return r.letter === prefs.letter; }) : pool;
      count.textContent = rows.length + (rows.length === 1 ? " intrare" : " intrări") + (q ? " pentru „" + query.value.trim() + "”" : prefs.letter ? " la litera " + prefs.letter : "");
      list.innerHTML = "";
      var shown = 0, more = el("button", "btn secondary"); more.style.width = "100%";
      function append(n) {
        if (more.parentNode) more.remove();
        rows.slice(shown, shown + n).forEach(function (r) { list.appendChild(entryRow(r)); });
        shown = Math.min(rows.length, shown + n);
        if (shown < rows.length) { more.textContent = "Mai încarcă · " + shown + " din " + rows.length; list.appendChild(more); }
      }
      more.onclick = function () { append(120); };
      append(120);
      if (!rows.length) {
        list.appendChild(el("p", "muted", "Nicio intrare. Încearcă alt cuvânt sau caută și în definiții."));
        var g = el("button", "btn mini secondary", "Caută în definiții (glosar)");
        g.onclick = function () { var s = state.settings.glossary || {}; s.query = query.value; state.settings.glossary = s; openGlossary(); };
        list.appendChild(g);
      }
      if (rows.length === 1 && q && rows[0].kind !== "alias") { var only = list.querySelector("details"); if (only) only.open = true; }
      remember();
    }
    query.oninput = render;
    [show, deck, stage].forEach(function (s) { s.onchange = render; });
    if (startWord) query.value = startWord;
    render();
    $("#modal").hidden = false;
    if (!startWord) setTimeout(function () { if (query.isConnected) query.focus({ preventScroll: true }); }, 50);
  }

  function termsOfDeck(deckId) {''')

js = rep(js, '''    glossary.onclick = openGlossary; root.appendChild(glossary);''',
'''    glossary.onclick = openGlossary; root.appendChild(glossary);
    var dict156 = el("button", "btn big secondary", "Dicționar A–Z · toți termenii");
    dict156.id = "open-dictionary156";
    dict156.style.cssText = "width:100%;margin:-6px 0 16px";
    dict156.onclick = function () { openDictionary156(); }; root.appendChild(dict156);''')

js = rep(js, '''    learnUnits: learnUnits, buildLesson: buildLesson,''',
         '''    learnUnits: learnUnits, buildLesson: buildLesson, openDictionary156: openDictionary156, dictEntries156: dictEntries156,''')
store("app.js", js, crlf)

# ---------------------------------------------------------------- index.html
html, crlf = load("index.html")
html = rep(html, '<script src="app.js">', '<script src="dictionary156.js"></script>\n<script src="app.js">')
html = rep(html, '</head>', '''<style>
.dict-letters156{display:flex;flex-wrap:wrap;gap:6px;margin:12px 0;position:sticky;top:-1px;z-index:2;background:var(--surface,var(--bg));padding:6px 0}
.dict-letter156{min-width:36px;min-height:36px;border-radius:10px;border:1px solid var(--line,#8884);background:var(--surface2);color:var(--txt);font-weight:700;cursor:pointer}
.dict-letter156.on{background:var(--accent);color:var(--accent-on,#111);border-color:var(--accent)}
.dict-chip156{display:inline-block;margin-left:8px;padding:1px 8px;border-radius:999px;font-size:.72em;font-weight:700;vertical-align:middle;border:1px solid var(--line,#8884);color:var(--muted)}
.dict-chip156.known{color:var(--ok,#3c9);border-color:currentColor}.dict-chip156.due{color:var(--accent-txt,#e9b949);border-color:currentColor}
.dict-chip156.learning{color:var(--txt)}.dict-chip156.missing{border-style:dashed}
.dict-alias156{display:block;width:100%;text-align:left;padding:10px 4px;background:none;border:0;border-bottom:1px solid var(--line,#8883);color:var(--txt);cursor:pointer;min-height:44px}
.dict-refs156{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px;align-items:center}
.dict-refs156 .btn{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:left}
.dict-inv-rows156{display:grid;gap:6px;margin-top:8px}
.dict-inv-row156{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;padding:10px;border-radius:12px;border:1px solid var(--line,#8884);background:var(--surface2);color:var(--txt);cursor:pointer}
</style>
</head>''')
store("index.html", html, crlf)
print("ok")

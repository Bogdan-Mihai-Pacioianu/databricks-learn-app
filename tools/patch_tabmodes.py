# Fiecare tab din Învață are două moduri:
#   „Învață”  – cursuri, lecții, explicații, informații de citit;
#   „Practică” – întrebări, teste, exerciții, laboratoare, scenarii de rezolvat.
# Se aplică după tools/patch_terms.py, tools/patch_dictionary.py și tools/patch_modes.py.
#
#   python tools/patch_tabmodes.py app/assets
import os, sys

assets = sys.argv[1]
path = os.path.join(assets, "app.js")
src = open(path, encoding="utf-8", newline="").read()
crlf = "\r\n" in src
src = src.replace("\r\n", "\n")
if "function renderTabPractice156" in src:
    sys.exit("Modurile pe taburi sunt deja aplicate.")


def rep(old, new):
    global src
    n = src.count(old)
    if n != 1:
        sys.exit("Înlocuirea nu se potrivește (%d apariții):\n%s" % (n, old[:200]))
    src = src.replace(old, new)


# ---- 1. Comutatorul Învață / Practică pentru toate taburile ----------------
rep('''    root.appendChild(seg);

    if (learnTab === "career") { renderCareer142(root); return; }
    if (learnTab === "paths") { if(courses145Api())courses145Api().render(root);else renderCurriculum(root); return; }
    if (learnTab === "concepts") { renderCurriculum(root); return; }
    if (learnTab === "projects") { renderProjects(root); return; }
    if (learnTab === "saved") { renderSaved(root); return; }

    if (learnTab === "cert") { renderCertPath(root); return; }
    if (learnTab === "py") { if(courses145Api())courses145Api().returnBanner(root);renderPyPath(root); renderSparkPath(root); return; }
    if (learnTab === "sql") { if(courses145Api())courses145Api().returnBanner(root);renderLabPath(root); return; }
    if (learnTab === "scen") { renderScenPath(root); return; }''',
'''    root.appendChild(seg);

    var mode156 = tabMode156(learnTab);
    var modeSeg = el("div", "seg term-mode156");
    modeSeg.setAttribute("role", "group"); modeSeg.setAttribute("aria-label", "Mod de lucru");
    [["learn", "Învață"], ["practice", "Practică"]].forEach(function (m) {
      var b = el("button", "seg-b" + (mode156 === m[0] ? " on" : ""), m[1]);
      b.id = "tab-mode-" + m[0];
      b.setAttribute("data-tab-mode", m[0]);
      b.setAttribute("aria-pressed", String(mode156 === m[0]));
      b.onclick = function () { setTabMode156(learnTab, m[0]); renderLearn(); };
      modeSeg.appendChild(b);
    });
    root.appendChild(modeSeg);
    root.appendChild(el("p", "muted tab-mode-hint156", mode156 === "learn" ? TAB_LEARN_HINT156[learnTab] || "" : TAB_PRACTICE_HINT156[learnTab] || ""));
    var practice156 = mode156 === "practice";

    if (learnTab === "career") { if (practice156) renderTabPractice156(root, "career"); else renderCareer142(root); return; }
    if (learnTab === "paths") { if (practice156) renderTabPractice156(root, "paths"); else if(courses145Api())courses145Api().render(root);else renderCurriculum(root); return; }
    if (learnTab === "concepts") { if (practice156) renderTabPractice156(root, "concepts"); else renderCurriculum(root); return; }
    if (learnTab === "projects") { if (practice156) renderProjectPractice156(root); else renderProjects(root); return; }
    if (learnTab === "saved") { if (practice156) renderSavedPractice156(root); else { renderSaved(root); root.querySelectorAll("button").forEach(function (b) { if (b.textContent === "Repetă favoritele") b.remove(); }); } return; }

    if (learnTab === "cert") { if (practice156) renderCertPractice156(root); else { renderCertPath(root); root.querySelectorAll("[data-cert-test141]").forEach(function (b) { b.remove(); }); } return; }
    if (learnTab === "py") { if(courses145Api())courses145Api().returnBanner(root); if (practice156) { renderPyPath(root); renderSparkPath(root); renderTabPractice156(root, "py"); } else renderCourseLearn156(root, ["python", "spark"]); return; }
    if (learnTab === "sql") { if(courses145Api())courses145Api().returnBanner(root); if (practice156) { renderLabPath(root); renderTabPractice156(root, "sql"); } else renderCourseLearn156(root, ["sql", "relational"]); return; }
    if (learnTab === "scen") { if (practice156) renderScenPath(root); else renderScenLearn156(root); return; }''')

# Tabul Termeni folosește acum comutatorul general.
rep('''    var termMode = state.settings.termMode156 === "practice" ? "practice" : "learn";
    var modeSeg = el("div", "seg term-mode156");
    modeSeg.setAttribute("role", "group"); modeSeg.setAttribute("aria-label", "Mod de lucru cu termenii");
    [["learn", "Învață"], ["practice", "Practică"]].forEach(function (m) {
      var b = el("button", "seg-b" + (termMode === m[0] ? " on" : ""), m[1]);
      b.id = "term-mode-" + m[0];
      b.setAttribute("aria-pressed", String(termMode === m[0]));
      b.onclick = function () { state.settings.termMode156 = m[0]; save(); renderLearn(); };
      modeSeg.appendChild(b);
    });
    root.appendChild(modeSeg);
    if (termMode === "practice") { renderTermPractice156(root); return; }''',
'''    if (practice156) { renderTermPractice156(root); return; }''')

# ---- 2. Funcțiile noi ------------------------------------------------------
rep('''  // ---------------------------------------------------------------- Practică termeni''', r'''  // ---------------------------------------------------------------- Moduri pe taburi
  var TAB_LEARN_HINT156 = {
    paths: "Cursurile complete: lecții, explicații și exemple, în ordine.",
    career: "Etapele parcursului de carieră și ce trebuie să știi la fiecare.",
    concepts: "Conceptele structurate pe domenii, cu explicații și legături.",
    terms: "Lecții de termeni noi, glosarul și dicționarul A–Z.",
    scen: "Citește situațiile rezolvate: răspunsul corect și de ce.",
    sql: "Cursul SQL: lecții și explicații înainte de exerciții.",
    py: "Cursurile Python și Spark: lecții și explicații înainte de laboratoare.",
    cert: "Certificările, programa și materialele de studiu.",
    projects: "Proiectele finale: context, cerințe și criterii.",
    saved: "Materialele salvate și notițele tale, de recitit."
  };
  var TAB_PRACTICE_HINT156 = {
    paths: "Întrebări, carduri, termeni și scenarii din cursul ales.",
    career: "Exersezi materia unei etape din parcurs.",
    concepts: "Exersezi un domeniu: întrebări, carduri, termeni, scenarii.",
    terms: "Repetă termenii scadenți sau alege ce termeni exersezi.",
    scen: "Rezolvă scenariile: alegi varianta, apoi „Și dacă…”.",
    sql: "Exerciții SQL executabile și întrebări de verificare.",
    py: "Laboratoare Python și PySpark și întrebări de verificare.",
    cert: "Teste, greșeli de recapitulat, simulări și progres pe domenii.",
    projects: "Studii de caz și exerciții practice de rezolvat.",
    saved: "Repetă favoritele, greșelile sau cardurile scadente."
  };
  function tabMode156(tab) {
    var modes = state.settings.tabModes156 || {};
    if (modes[tab] === "practice" || modes[tab] === "learn") return modes[tab];
    if (tab === "terms" && state.settings.termMode156 === "practice") return "practice";
    return "learn";
  }
  function setTabMode156(tab, mode) {
    state.settings.tabModes156 = Object.assign({}, state.settings.tabModes156 || {});
    state.settings.tabModes156[tab] = mode;
    if (tab === "terms") state.settings.termMode156 = mode;
    save();
  }

  /** Domeniile (deck-urile) și certificările pe care le acoperă fiecare opțiune a unui tab. */
  function practiceScopes156(tab) {
    var named = function (ids) { return ids.filter(function (id) { return deckById(id); }); };
    if (tab === "paths") {
      var data = (SEED.courses145 || {}).courses || [];
      return data.map(function (c) { return { id: c.id, name: c.name, decks: c.deckIds || [], certs: c.certIds || [] }; });
    }
    if (tab === "career") {
      return (((SEED.career142 || {}).stages) || []).map(function (s) { return { id: s.id, name: s.name, decks: s.decks || [], certs: [] }; });
    }
    if (tab === "sql") return [{ id: "sql", name: "SQL și baze relaționale", decks: named(["sql", "relational"]), certs: [] }];
    if (tab === "py") return [{ id: "py", name: "Python și Spark", decks: named(["python", "spark"]), certs: [] }];
    return allDecks().map(function (d) { return { id: d.id, name: d.name, decks: [d.id], certs: [] }; });
  }
  /** Ce poate fi exersat în domeniile date, pe tipuri. Fiecare element are o stare: new / wrong / ok. */
  function practicePool2156(scope, kinds, filter) {
    var decks = {}, certs = {};
    scope.decks.forEach(function (d) { decks[d] = true; });
    scope.certs.forEach(function (c) { certs[c] = true; });
    var out = [], seenQ = {};
    function keep(status) { return filter === "all" || (filter === "wrong" ? status === "wrong" : status !== "ok"); }
    if (kinds.question) {
      var addQ = function (q, exam) {
        if (seenQ[q.id]) return; seenQ[q.id] = true;
        var a = state.assessments[q.id], status = !a ? "new" : a.correct ? "ok" : "wrong";
        if (keep(status)) out.push({ kind: "question", status: status, item: { type: "exam", q: q, exam: exam || null } });
      };
      (SEED.questions || []).forEach(function (q) {
        if (decks[q.deck] || (q.certs || []).some(function (c) { return certs[c]; })) addQ(q, null);
      });
      Object.keys(certs).forEach(function (c) { testExamen(c).forEach(function (q) { addQ(q, c); }); });
    }
    if (kinds.card) {
      var now = Date.now();
      allCards().forEach(function (c) {
        if (!decks[c.deck] || isSuspended(c.id)) return;
        var s = sched(c.id), status = s.st === "new" ? "new" : (s.st === "relearn" || s.lapses > 0 && s.due <= now) ? "wrong" : s.due <= now ? "new" : "ok";
        if (keep(status)) out.push({ kind: "card", status: status, item: { type: "card", card: c } });
      });
    }
    if (kinds.term) {
      allTerms().forEach(function (t) {
        if (!decks[t.deck]) return;
        var p = state.learn.terms[t.id], status = !p || !p.s ? "new" : p.lastCorrect === false ? "wrong" : termIsDue(t.id) ? "new" : "ok";
        if (keep(status)) out.push({ kind: "term", status: status, item: termExercise(t) });
      });
    }
    if (kinds.scen) {
      scenAll().forEach(function (sc) {
        if (!decks[sc.deck]) return;
        var d = state.scen.done[sc.id], status = !d ? "new" : (Array.isArray(d.lastCorrect) && d.lastCorrect.some(function (x) { return x === false; })) ? "wrong" : scenIsDone(sc.id) ? "ok" : "new";
        if (keep(status)) out.push({ kind: "scen", status: status, item: { type: "scen", sc: sc, pas: 0 } });
      });
    }
    return out;
  }
  var PRACTICE_KINDS156 = [["question", "Întrebări grilă"], ["card", "Carduri (autoevaluare)"], ["term", "Termeni"], ["scen", "Scenarii"]];
  function renderTabPractice156(root, tab) {
    var scopes = practiceScopes156(tab);
    var key = "practice156_" + tab, raw = (state.settings.tabPractice156 || {})[tab] || {};
    var cfg = {
      scope: scopes.some(function (s) { return s.id === raw.scope; }) ? raw.scope : (scopes[0] || {}).id,
      kind: ["mix", "question", "card", "term", "scen"].indexOf(raw.kind) >= 0 ? raw.kind : (tab === "sql" || tab === "py" ? "question" : "mix"),
      filter: ["todo", "wrong", "all"].indexOf(raw.filter) >= 0 ? raw.filter : "todo",
      count: [10, 20, 30, 50].indexOf(raw.count) >= 0 ? raw.count : 20
    };
    var box = el("section", "unit tab-practice156"); box.id = key;
    box.appendChild(el("h2", "sec-title", tab === "sql" || tab === "py" ? "Întrebări de verificare" : "Practică la alegere"));
    var form = el("div", "practice-form156"); box.appendChild(form);
    function field(label, id, rows, value, onChange) {
      var f = el("label", "filter-field"); f.appendChild(el("span", null, label));
      var s = el("select"); s.id = id; s.setAttribute("aria-label", label);
      rows.forEach(function (r) { s.appendChild(new Option(r[1], r[0])); });
      s.value = String(value); s.onchange = function () { onChange(s.value); update(); };
      f.appendChild(s); form.appendChild(f); return s;
    }
    var scopeLabel = { paths: "Curs", career: "Etapă", concepts: "Domeniu", saved: "Domeniu" }[tab] || "Domeniu";
    if (scopes.length > 1) field(scopeLabel, key + "-scope", scopes.map(function (s) { return [s.id, s.name]; }), cfg.scope, function (v) { cfg.scope = v; });
    field("Ce exersezi", key + "-kind", [["mix", "Mixt"]].concat(PRACTICE_KINDS156), cfg.kind, function (v) { cfg.kind = v; });
    field("Care", key + "-filter", [["todo", "Nefăcute, greșite, scadente"], ["wrong", "Doar greșite"], ["all", "Toate"]], cfg.filter, function (v) { cfg.filter = v; });
    field("Câte", key + "-count", [["10", "10"], ["20", "20"], ["30", "30"], ["50", "50"]], cfg.count, function (v) { cfg.count = Number(v); });
    var info = el("p", "muted"); info.id = key + "-info"; info.setAttribute("aria-live", "polite"); box.appendChild(info);
    var go = el("button", "btn big primary", "Începe practica"); go.id = key + "-start"; go.style.width = "100%"; box.appendChild(go);
    root.appendChild(box);
    function pool() {
      var scope = scopes.filter(function (s) { return s.id === cfg.scope; })[0];
      if (!scope) return [];
      var kinds = {}; (cfg.kind === "mix" ? ["question", "card", "term", "scen"] : [cfg.kind]).forEach(function (k) { kinds[k] = true; });
      return practicePool2156(scope, kinds, cfg.filter);
    }
    function update() {
      var all = state.settings.tabPractice156 || {}; all[tab] = { scope: cfg.scope, kind: cfg.kind, filter: cfg.filter, count: cfg.count };
      state.settings.tabPractice156 = all; save();
      var rows = pool(), by = {};
      rows.forEach(function (r) { by[r.kind] = (by[r.kind] || 0) + 1; });
      var parts = PRACTICE_KINDS156.filter(function (k) { return by[k[0]]; }).map(function (k) { return by[k[0]] + " " + k[1].toLowerCase(); });
      info.textContent = rows.length ? rows.length + " disponibile (" + parts.join(", ") + ") · sesiunea folosește " + Math.min(rows.length, cfg.count) :
        cfg.filter === "wrong" ? "Nicio greșeală de recapitulat aici." : cfg.filter === "todo" ? "Totul e făcut și la zi. Alege „Toate” ca să reiei." : "Nimic de exersat pentru alegerea asta.";
      go.disabled = !rows.length;
    }
    go.onclick = function () {
      var rows = pool();
      // Greșelile întâi, apoi restul amestecat; la mixt tipurile alternează.
      var wrong = shuffle(rows.filter(function (r) { return r.status === "wrong"; })), other = shuffle(rows.filter(function (r) { return r.status !== "wrong"; }));
      var picked = wrong.concat(other).slice(0, cfg.count).map(function (r) { return r.item; });
      var scope = scopes.filter(function (s) { return s.id === cfg.scope; })[0];
      startRun(shuffle(picked), { titlu: "Practică · " + (scope ? scope.name : "") });
    };
    update();
  }

  /** Învață pentru SQL / Python: cursurile care acoperă domeniile, apoi termenii lor. */
  function renderCourseLearn156(root, deckIds) {
    var api = courses145Api(), courses = ((SEED.courses145 || {}).courses || []).filter(function (c) {
      return (c.deckIds || []).some(function (d) { return deckIds.indexOf(d) >= 0; });
    });
    root.appendChild(el("h2", "sec-title", "Cursuri"));
    if (!courses.length || !api) root.appendChild(el("p", "muted", "Nu există un curs local pentru aceste domenii."));
    courses.forEach(function (c) {
      var p = api ? api.progress(c) : { read: 0, total: 0 };
      var card = el("article", "unit course-card145"); card.setAttribute("data-learn-course156", c.id);
      card.appendChild(el("h3", null, c.name));
      card.appendChild(el("p", "muted", p.read + "/" + p.total + " lecții parcurse"));
      if (c.intro) card.appendChild(el("p", null, c.intro.length > 220 ? c.intro.slice(0, 217) + "…" : c.intro));
      var start = el("button", "btn primary", p.read === p.total && p.total ? "Recapitulează cursul" : p.read ? "Continuă cursul" : "Începe cursul");
      start.onclick = function () { api.start(c.id); };
      var toc = el("button", "btn mini secondary", "Cuprins");
      toc.onclick = function () { api.intro(c.id); };
      var row = el("div", "dict-refs156"); row.appendChild(start); row.appendChild(toc); card.appendChild(row);
      root.appendChild(card);
    });
    root.appendChild(el("h2", "sec-title", "Termenii domeniului"));
    deckIds.forEach(function (d) {
      var deck = deckById(d), n = termsOfDeck(d).length; if (!deck || !n) return;
      var b = el("button", "btn secondary", deck.name + " · " + n + " termeni în dicționar");
      b.style.cssText = "width:100%;margin:0 0 8px";
      b.onclick = function () {
        state.settings.dictionary156 = Object.assign({}, state.settings.dictionary156 || {}, { deck: d, letter: "", show: "terms", stage: "" });
        openDictionary156();
      };
      root.appendChild(b);
    });
  }

  /** Învață pentru Scenarii: situațiile rezolvate, de citit, pe module. */
  function renderScenLearn156(root) {
    scenModules().forEach(function (m) {
      if (!m.sc.length) return;
      var mod = el("details", "unit scen-learn156"); mod.setAttribute("data-scen-learn-mod", m.mod.id);
      var sum = el("summary"); sum.appendChild(el("b", null, m.mod.nume));
      sum.appendChild(el("span", "glossary-brief133", m.sc.length + " situații · " + m.done + " rezolvate · " + (m.mod.scurt || "")));
      mod.appendChild(sum);
      var loaded = false;
      mod.addEventListener("toggle", function () {
        if (!mod.open || loaded) return; loaded = true;
        if (m.mod.final) mod.appendChild(el("p", "muted", "La final: " + m.mod.final));
        m.sc.forEach(function (sc) {
          var row = el("details", "unit glossary-row133"); row.setAttribute("data-scen-learn", sc.id);
          var s2 = el("summary"); s2.appendChild(el("span", "glossary-term133", sc.titlu)); row.appendChild(s2);
          var done = false;
          row.addEventListener("toggle", function () {
            if (!row.open || done) return; done = true;
            [[sc, "Situație"], [sc.v, "Și dacă…"]].forEach(function (pair) {
              var d = pair[0]; if (!d || !d.q) return;
              row.appendChild(el("h4", null, pair[1]));
              var s = el("div", "md"); s.innerHTML = renderMd(d.s || ""); row.appendChild(s);
              var q = el("div", "md"); q.innerHTML = renderMd("**" + d.q + "**"); row.appendChild(q);
              var ok = (d.o || []).filter(function (o) { return o.ok; })[0];
              if (ok) { var a = el("div", "md ex-model"); a.innerHTML = renderMd("**Răspuns:** " + ok.t); row.appendChild(a); }
              if (d.e) { var e = el("div", "md hint"); e.innerHTML = renderMd(d.e); row.appendChild(e); }
            });
            var b = el("button", "btn mini primary", "Rezolvă-l acum");
            b.onclick = function () { startRun([{ type: "scen", sc: sc, pas: 0 }], { titlu: sc.titlu }); };
            row.appendChild(b);
          });
          mod.appendChild(row);
        });
      });
      root.appendChild(mod);
    });
  }

  /** Practică pentru Certificări: teste, greșeli, simulări și progres pe domenii. */
  function renderCertPractice156(root) {
    examene().forEach(function (e) {
      var qs = testExamen(e.id); if (!qs.length) return;
      var answered = qs.filter(function (q) { return state.assessments[q.id]; }).length,
          wrong = qs.filter(function (q) { return state.assessments[q.id] && !state.assessments[q.id].correct; }).length;
      var row = el("div", "unit exam-row"); row.setAttribute("data-cert-practice156", e.id);
      var top = el("div", "exam-top"); top.appendChild(ico(icoDeck(e.id), "ico"));
      var txt = el("div", "exam-txt"), t = el("div", "exam-titlu");
      if (e.furnizor) t.appendChild(el("span", "exam-cod", e.cod)); t.appendChild(el("span", null, e.scurt)); txt.appendChild(t);
      txt.appendChild(el("div", "muted exam-sub", qs.length + " întrebări · " + answered + " rezolvate · " + wrong + " greșite"));
      top.appendChild(txt); row.appendChild(top);
      var actions = el("div", "dict-refs156");
      function btn(label, cls, fn, attr) { var b = el("button", "btn mini " + cls, label); if (attr) b.setAttribute(attr, e.id); b.onclick = fn; actions.appendChild(b); return b; }
      btn("Test scurt · " + Math.min(10, qs.length), "primary", function () { startExamPractice(e.id, "short", ""); }, "data-cert-test141");
      btn("Toate întrebările", "secondary", function () { startExamPractice(e.id, "all", ""); });
      var w = btn("Greșelile · " + wrong, "secondary", function () { startExamPractice(e.id, "mistakes", ""); }); w.disabled = !wrong;
      if (e.furnizor) btn("Progres pe domenii", "ghost", function () { openDomainMastery(e.id); });
      btn("Simulări și programă", "ghost", function () { deschideExamen(e.id); });
      row.appendChild(actions); root.appendChild(row);
    });
  }

  /** Practică pentru Proiecte: studiile de caz și exercițiile practice. */
  function renderProjectPractice156(root) {
    var groups = [["Studii de caz", SEED.caseStudies || []], ["Exerciții practice", SEED.exercitii || []]];
    groups.forEach(function (g) {
      if (!g[1].length) return;
      var byExam = {};
      g[1].forEach(function (x) { var k = x.examen || "general"; (byExam[k] = byExam[k] || []).push(x); });
      root.appendChild(el("h2", "sec-title", g[0] + " · " + g[1].length));
      Object.keys(byExam).forEach(function (k) {
        var ex = examenById(k), d = el("details", "unit"); d.setAttribute("data-project-practice156", g[0] + ":" + k);
        d.appendChild(el("summary", null, (ex ? (ex.cod ? ex.cod + " · " : "") + ex.scurt : "General") + " · " + byExam[k].length));
        byExam[k].forEach(function (x) {
          var b = el("button", "btn mini secondary", x.titlu); b.style.cssText = "display:block;width:100%;text-align:left;margin:6px 0";
          b.onclick = function () { openCaseStudy(x.id); };
          d.appendChild(b);
        });
        root.appendChild(d);
      });
    });
  }

  /** Practică pentru Salvate: aceleași surse ca recapitularea personalizată, direct în pagină. */
  function renderSavedPractice156(root) {
    [["favorites", "Repetă favoritele", "Materialele marcate cu stea."], ["mistakes", "Greșeli și concepte de consolidat", "Întrebări, termeni, carduri și scenarii la care ai greșit ultima dată."],
     ["due", "Carduri scadente", "Cardurile pe care repetiția spațiată le aduce azi."]].forEach(function (s) {
      var n = practiceCandidates(s[0], "", "").length;
      var b = el("button", "practice-deck-row156"); b.setAttribute("data-saved-practice156", s[0]);
      var meta = el("div", "deck-meta"); meta.appendChild(el("div", "deck-name", s[1] + " · " + n)); meta.appendChild(el("div", "deck-desc", s[2]));
      b.appendChild(meta); b.disabled = !n;
      b.onclick = function () { startRun(practiceCandidates(s[0], "", "").slice(0, 20), { titlu: s[1] }); };
      root.appendChild(b);
    });
    var more = el("button", "btn secondary", "Filtre avansate (certificare, nivel, număr)");
    more.style.width = "100%"; more.onclick = function () { openPractice("mistakes"); }; root.appendChild(more);
  }

  // ---------------------------------------------------------------- Practică termeni''')

rep('''    learnUnits: learnUnits, buildLesson: buildLesson,''',
    '''    learnUnits: learnUnits, buildLesson: buildLesson, tabMode156: tabMode156, setTabMode156: setTabMode156, practiceScopes156: practiceScopes156, practicePool2156: practicePool2156,''')

open(path, "w", encoding="utf-8", newline="").write(src.replace("\n", "\r\n") if crlf else src)

hp = os.path.join(assets, "index.html")
html = open(hp, encoding="utf-8", newline="").read()
if ".tab-mode-hint156" not in html:
    nl = "\r\n" if "\r\n" in html else "\n"
    css = (".tab-mode-hint156{margin:-6px 0 14px;font-size:.88em}" + nl +
           ".tab-practice156{margin:16px 0}.tab-practice156 .sec-title{margin-top:0}" + nl +
           ".scen-learn156>summary{min-height:44px;cursor:pointer;line-height:1.5}" + nl)
    marker = ".term-mode156{"
    if marker not in html:
        sys.exit("Aplică întâi tools/patch_modes.py.")
    html = html.replace(marker, css + marker, 1)
    open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

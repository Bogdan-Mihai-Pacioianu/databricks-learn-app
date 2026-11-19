# Tabul Termeni în două moduri: „Învață” (lecții, glosar, dicționar) și
# „Practică” (exersare la alegere: ce termeni, ce tip de exercițiu, câți).
# Se aplică după tools/patch_terms.py și tools/patch_dictionary.py.
#
#   python tools/patch_modes.py app/assets
import os, sys

assets = sys.argv[1]
path = os.path.join(assets, "app.js")
src = open(path, encoding="utf-8", newline="").read()
crlf = "\r\n" in src
src = src.replace("\r\n", "\n")
if "function renderTermPractice156" in src:
    sys.exit("Modurile sunt deja aplicate.")


def rep(old, new):
    global src
    n = src.count(old)
    if n != 1:
        sys.exit("Înlocuirea nu se potrivește (%d apariții):\n%s" % (n, old[:200]))
    src = src.replace(old, new)


# Comutatorul de mod, imediat după alegerea tabului Termeni.
rep('''    if (learnTab === "scen") { renderScenPath(root); return; }''',
'''    if (learnTab === "scen") { renderScenPath(root); return; }
    var termMode = state.settings.termMode156 === "practice" ? "practice" : "learn";
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
    if (termMode === "practice") { renderTermPractice156(root); return; }''')

rep('''  function termsOfDeck(deckId) {''', r'''  // ---------------------------------------------------------------- Practică termeni
  var PRACTICE_SETS156 = [
    ["due", "Scadenți azi", "Termenii care trebuie repetați acum."],
    ["wrong", "Greșiți recent", "Ultimul răspuns a fost greșit."],
    ["learning", "În curs de învățare", "Începuți, dar încă neștiuți."],
    ["known", "Știuți (recapitulare)", "Verifică dacă îi mai știi."],
    ["learned", "Toți termenii învățați", "Orice termen început sau știut."],
    ["favorite", "Favorite", "Termenii marcați cu stea."],
    ["all", "Toți termenii", "Inclusiv cei noi, pe care nu i-ai văzut încă."]
  ];
  var PRACTICE_TYPES156 = [
    ["mix", "Mixt, după nivel", "Recunoaștere pentru cei noi, invers pentru cei începuți, scris pentru cei știuți."],
    ["mcq", "Alege definiția", "Vezi termenul, alegi definiția."],
    ["rev", "Alege termenul", "Vezi definiția, alegi termenul."],
    ["recall", "Scrie termenul", "Vezi definiția, scrii termenul din memorie."],
    ["pairs", "Potriviri", "Potrivești câte 4 termeni cu definițiile lor."]
  ];
  function practicePool156(set, deck) {
    var fav = {};
    if (set === "favorite") savedMaterials().forEach(function (row) { if (row && row.kind === "term" && row.favorite) fav[row.id] = true; });
    var now = Date.now();
    var pool = allTerms().filter(function (t) {
      if (deck ? t.deck !== deck : !deckEnabled(t.deck)) return false;
      var p = state.learn.terms[t.id], s = p ? p.s : 0;
      if (set === "due") return s > 0 && termIsDue(t.id, now);
      if (set === "wrong") return !!p && p.lastCorrect === false;
      if (set === "learning") return s > 0 && s < MAX_STRENGTH;
      if (set === "known") return s >= MAX_STRENGTH;
      if (set === "learned") return s > 0;
      if (set === "favorite") return !!fav[t.id];
      return true;
    });
    // Cei mai slabi și cei mai întârziați întâi; restul amestecați, ca să nu vezi mereu aceiași.
    return shuffle(pool).sort(function (a, b) {
      var da = termDue(a.id), db = termDue(b.id);
      return termStrength(a.id) - termStrength(b.id) || (da || Infinity) - (db || Infinity);
    });
  }
  function practiceItems156(terms, type) {
    if (type === "pairs") {
      var items = [];
      for (var i = 0; i + 4 <= terms.length; i += 4) items.push(pairsItem(terms.slice(i, i + 4)));
      return items;
    }
    return shuffle(terms.map(function (t) {
      if (type === "mcq") return mcqItem(t);
      if (type === "rev") return revItem(t);
      if (type === "recall") return recallable(t) ? recallItem(t) : revItem(t);
      return termStrength(t.id) === 0 ? mcqItem(t) : termExercise(t);
    }));
  }
  function startTermPractice156(cfg) {
    var terms = practicePool156(cfg.set, cfg.deck).slice(0, cfg.count);
    if (cfg.type === "pairs") terms = terms.slice(0, terms.length - terms.length % 4);
    var items = practiceItems156(terms, cfg.type);
    if (!items.length) { toast("Nu sunt destui termeni pentru alegerea asta."); return false; }
    var label = PRACTICE_TYPES156.filter(function (x) { return x[0] === cfg.type; })[0];
    return startRun(items, { titlu: "Practică · " + (label ? label[1] : "termeni") });
  }
  function renderTermPractice156(root) {
    var p = learnProgress(), due = dueTerms();
    var hero = el("div", "hero");
    var left = el("div", "hero-l");
    left.appendChild(el("div", "hero-num", String(due.length)));
    left.appendChild(el("div", "hero-lbl", "de repetat azi"));
    hero.appendChild(left);
    var right = el("div", "hero-r");
    right.appendChild(el("div", "streak-n", String(p.stiute)));
    right.appendChild(el("div", "hero-sub", "știuți · " + p.incepute + " în curs din " + p.total));
    hero.appendChild(right);
    root.appendChild(hero);

    var quick = el("button", "btn big " + (due.length ? "primary" : "secondary"),
      due.length ? "Repetă termenii scadenți · " + due.length : "Niciun termen scadent acum");
    quick.id = "practice-due156"; quick.style.cssText = "width:100%;margin:0 0 18px"; quick.disabled = !due.length;
    quick.onclick = startTermReview;
    root.appendChild(quick);

    root.appendChild(el("h2", "sec-title", "Practică la alegere"));
    var raw = state.settings.termPractice156 || {};
    var cfg = {
      set: PRACTICE_SETS156.some(function (x) { return x[0] === raw.set; }) ? raw.set : "learned",
      type: PRACTICE_TYPES156.some(function (x) { return x[0] === raw.type; }) ? raw.type : "mix",
      deck: typeof raw.deck === "string" ? raw.deck : "",
      count: [10, 20, 30, 50].indexOf(raw.count) >= 0 ? raw.count : 20
    };
    var form = el("div", "practice-form156"); root.appendChild(form);
    function field(label, id, rows, value, onChange) {
      var f = el("label", "filter-field"); f.appendChild(el("span", null, label));
      var s = el("select"); s.id = id; s.setAttribute("aria-label", label);
      rows.forEach(function (r) { s.appendChild(new Option(r[1], r[0])); });
      s.value = String(value); s.onchange = function () { onChange(s.value); update(); };
      f.appendChild(s); form.appendChild(f); return s;
    }
    var decks = allDecks().filter(function (d) { return termsOfDeck(d.id).length; });
    var setSel = field("Ce termeni", "practice-set156", PRACTICE_SETS156, cfg.set, function (v) { cfg.set = v; });
    var setHelp = el("p", "muted practice-help156"); form.appendChild(setHelp);
    field("Domeniu", "practice-deck156", [["", "Domeniile active"]].concat(decks.map(function (d) { return [d.id, d.name]; })), cfg.deck, function (v) { cfg.deck = v; });
    field("Tip de exercițiu", "practice-type156", PRACTICE_TYPES156, cfg.type, function (v) { cfg.type = v; });
    var typeHelp = el("p", "muted practice-help156"); form.appendChild(typeHelp);
    field("Câți termeni", "practice-count156", [["10", "10"], ["20", "20"], ["30", "30"], ["50", "50"]], cfg.count, function (v) { cfg.count = Number(v); });

    var info = el("p", "muted"); info.id = "practice-info156"; info.setAttribute("aria-live", "polite"); root.appendChild(info);
    var go = el("button", "btn big primary", "Începe practica"); go.id = "practice-start156"; go.style.width = "100%";
    go.onclick = function () { startTermPractice156(cfg); };
    root.appendChild(go);

    // Sesiuni rapide pe fiecare domeniu: termenii învățați din domeniu, exercițiu mixt.
    root.appendChild(el("h2", "sec-title", "Pe domenii"));
    var rest = el("details", "unit practice-rest156"), restN = 0;
    decks.forEach(function (d) {
      var ts = termsOfDeck(d.id), learned = ts.filter(function (t) { return termStrength(t.id) > 0; }).length,
          dueN = ts.filter(function (t) { return termIsDue(t.id); }).length;
      var row = el("button", "practice-deck-row156");
      row.setAttribute("data-practice-deck", d.id);
      row.appendChild(ico(icoDeck(d.id), "deck-ico"));
      var meta = el("div", "deck-meta");
      meta.appendChild(el("div", "deck-name", d.name));
      meta.appendChild(el("div", "deck-desc", learned + " din " + ts.length + " învățați" + (dueN ? " · " + dueN + " de repetat" : "")));
      row.appendChild(meta);
      // Domeniile neîncepute stau strânse la final: practica are sens pe ce ai învățat.
      if (learned) row.onclick = function () { startTermPractice156({ set: dueN ? "due" : "learned", deck: d.id, type: "mix", count: 20 }); };
      else { row.onclick = function () { startTermPractice156({ set: "all", deck: d.id, type: "mcq", count: 10 }); }; restN++; }
      (learned ? root : rest).appendChild(row);
    });
    if (restN) {
      var sum = el("summary", null, "Domenii neîncepute · " + restN);
      rest.insertBefore(sum, rest.firstChild);
      rest.appendChild(el("p", "muted", "Aici exersezi direct pe termeni noi, cu grile de recunoaștere."));
      root.appendChild(rest);
    }
    if (restN === decks.length) root.insertBefore(el("p", "muted", "Încă n-ai început niciun domeniu. Fă o lecție în modul Învață sau alege un domeniu de mai jos."), rest);

    function update() {
      state.settings.termPractice156 = { set: cfg.set, type: cfg.type, deck: cfg.deck, count: cfg.count }; save();
      setHelp.textContent = (PRACTICE_SETS156.filter(function (x) { return x[0] === cfg.set; })[0] || [])[2] || "";
      typeHelp.textContent = (PRACTICE_TYPES156.filter(function (x) { return x[0] === cfg.type; })[0] || [])[2] || "";
      var n = practicePool156(cfg.set, cfg.deck).length, use = Math.min(n, cfg.count);
      if (cfg.type === "pairs") use -= use % 4;
      info.textContent = n ? (n + (n === 1 ? " termen disponibil" : " termeni disponibili") + " · sesiunea folosește " + use) :
        (cfg.set === "due" ? "Nimic scadent acum. Alege „Toți termenii învățați” sau alt set." :
         cfg.set === "all" ? "Niciun termen în domeniul ales." : "Niciun termen în setul ales. Învață câteva lecții în modul Învață.");
      go.disabled = !use;
    }
    update();
  }

  function termsOfDeck(deckId) {''')

rep('''    learnUnits: learnUnits, buildLesson: buildLesson,''',
    '''    learnUnits: learnUnits, buildLesson: buildLesson, practicePool156: practicePool156, startTermPractice156: startTermPractice156,''')
open(path, "w", encoding="utf-8", newline="").write(src.replace("\n", "\r\n") if crlf else src)

# Stiluri
hp = os.path.join(assets, "index.html")
html = open(hp, encoding="utf-8", newline="").read()
if ".practice-form156" not in html:
    css = '''.term-mode156{margin:4px 0 14px}.term-mode156 .seg-b{font-size:1em;padding:10px}
.practice-form156{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin:8px 0}
.practice-form156 .filter-field{min-width:0}.practice-form156 .filter-field>span{font-size:.8em;color:var(--muted)}
.practice-form156 select{width:100%}.practice-help156{grid-column:1/-1;margin:-4px 0 4px;font-size:.85em}
.practice-deck-row156{display:flex;gap:12px;align-items:center;width:100%;text-align:left;padding:12px;margin:0 0 8px;border-radius:14px;border:1px solid var(--line,#8884);background:var(--surface2);color:var(--txt);cursor:pointer;min-height:56px}
.practice-rest156>summary{min-height:44px;padding:8px 0;cursor:pointer}
@media(max-width:350px){.practice-form156{grid-template-columns:1fr}}
'''
    nl = "\r\n" if "\r\n" in html else "\n"
    marker = ".dict-letters156{"
    if marker not in html:
        sys.exit("Aplică întâi tools/patch_dictionary.py.")
    html = html.replace(marker, css.replace("\n", nl) + marker, 1)
    open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

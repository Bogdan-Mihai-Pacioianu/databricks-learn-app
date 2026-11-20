# Îmbunătățiri pentru învățarea termenilor (aplicat peste app.js 1.48.0).
# Fiecare înlocuire trebuie să apară exact o dată, altfel scriptul se oprește.
import sys

path = sys.argv[1]
src = open(path, encoding="utf-8", newline="").read()
crlf = "\r\n" in src
src = src.replace("\r\n", "\n")


def rep(old, new):
    global src
    n = src.count(old)
    if n != 1:
        sys.exit("Înlocuirea nu se potrivește (%d apariții):\n%s" % (n, old[:200]))
    src = src.replace(old, new)


# --- 1. Repetiție spațiată pentru termeni + exerciții noi -------------------
rep('''  var MAX_STRENGTH = 5;

  function allTerms() { return (SEED.terms || []); }''',
'''  var MAX_STRENGTH = 5;
  // Repetiție spațiată pentru termeni: după un răspuns corect, termenul revine
  // peste TERM_IVL_DAYS[forță] zile. Forța crește cel mult o dată pe zi, deci
  // „știut” (forța 5) înseamnă amintit corect în 5 zile diferite, la distanță.
  var TERM_IVL_DAYS = [0, 1, 3, 7, 16, 35];
  var TERM_RETRY_MIN = 10;

  function allTerms() { return (SEED.terms || []); }

  function termDue(id) {
    var s = state.learn.terms[id];
    if (!s || !s.s) return null;
    if (s.due) return s.due;
    return (s.last || 0) + TERM_IVL_DAYS[Math.min(s.s, MAX_STRENGTH)] * DAY;
  }
  function termIsDue(id, now) {
    var d = termDue(id);
    return d !== null && d <= (now || Date.now());
  }
  function dueTerms(now) {
    now = now || Date.now();
    return allTerms().filter(function (t) { return deckEnabled(t.deck) && termIsDue(t.id, now); })
      .sort(function (a, b) { return termStrength(a.id) - termStrength(b.id) || termDue(a.id) - termDue(b.id); });
  }

  /** Formele acceptate la scris: denumirea, sinonimele, acronimul din paranteză. */
  function termAnswers(term) {
    var out = [];
    function add(x) { x = String(x || "").trim(); if (x && out.indexOf(x) < 0) out.push(x); }
    [term.t].concat(term.aliases || []).forEach(function (name) {
      add(name);
      var m = /^(.*?)\\s*\\(([^)]+)\\)\\s*$/.exec(name);
      if (m) { add(m[1]); add(m[2]); }
    });
    ((term.origin || {}).expansions || []).forEach(function (x) { add(x.short); add(x.full); });
    return out;
  }
  function recallKey(s) {
    return searchKey(s).replace(/[^a-z0-9]+/g, "");
  }
  function editDistance(a, b) {
    var row = [], i, j;
    for (j = 0; j <= b.length; j++) row[j] = j;
    for (i = 1; i <= a.length; i++) {
      var prev = row[0]; row[0] = i;
      for (j = 1; j <= b.length; j++) {
        var cur = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = cur;
      }
    }
    return row[b.length];
  }
  /** 0 = exact, 1 = corect cu o greșeală de scriere, -1 = greșit. */
  function checkRecall(term, typed) {
    var k = recallKey(typed);
    if (!k) return -1;
    var best = -1;
    termAnswers(term).forEach(function (ans) {
      var a = recallKey(ans);
      if (!a) return;
      if (a === k) { best = 0; return; }
      var tol = a.length >= 10 ? 2 : a.length >= 5 ? 1 : 0;
      if (best !== 0 && tol && editDistance(a, k) <= tol) best = 1;
    });
    return best;
  }
  /** Termenul se poate cere la scris doar dacă are o formă scurtă, scriibilă. */
  function recallable(term) {
    return termAnswers(term).some(function (a) { var k = recallKey(a); return k.length >= 2 && a.length <= 32; });
  }
  /** Ascunde denumirea din definiție, ca întrebarea inversă să nu-și dea singură răspunsul. */
  function maskTerm(term, text) {
    var out = String(text || "");
    termAnswers(term).filter(function (a) { return a.length >= 3; })
      .sort(function (a, b) { return b.length - a.length; })
      .forEach(function (a) {
        var esc = a.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&");
        out = out.replace(new RegExp("(^|[^\\\\wăâîșțĂÂÎȘȚ])" + esc + "(?=$|[^\\\\wăâîșțĂÂÎȘȚ])", "gi"), "$1___");
      });
    return out;
  }
  function recallHint(term) {
    var name = termAnswers(term).filter(function (a) { return a.length <= 32; })
      .sort(function (a, b) { return a.length - b.length; })[0] || term.t;
    return name.split("").map(function (ch, i) {
      return /[\\s\\-_.()\\/]/.test(ch) ? ch : (i === 0 || /[\\s\\-_.(\\/]/.test(name[i - 1]) ? ch : "·");
    }).join("");
  }''')

# --- 2. Exerciții noi: definiție → termen și scrie termenul ------------------
rep('''    opts.push({ text: term.d, ok: true });
    return { type: "mcq", term: term, options: shuffle(opts) };
  }''',
'''    opts.push({ text: term.d, ok: true });
    return { type: "mcq", term: term, options: shuffle(opts) };
  }

  /** Invers: primești definiția și alegi denumirea. Cere amintire, nu doar recunoaștere. */
  function revItem(term) {
    var opts = distractors(term, 3).map(function (t) { return { text: t.t, ok: false, term: t }; });
    opts.push({ text: term.t, ok: true });
    return { type: "rev", term: term, options: shuffle(opts) };
  }

  function recallItem(term) { return { type: "recall", term: term }; }

  /** Alege exercițiul după cât de bine știi termenul: recunoaștere → invers → scris. */
  function termExercise(term) {
    var s = termStrength(term.id);
    if (s <= 0) return mcqItem(term);
    if (s >= 3 && recallable(term)) return Math.random() < 0.75 ? recallItem(term) : revItem(term);
    return Math.random() < 0.7 ? revItem(term) : mcqItem(term);
  }''')

# --- 3. Lecția: exercițiu potrivit nivelului + consolidare inversă -----------
rep('''    shuffle(lesson.terms.slice()).forEach(function (t) { items.push(mcqItem(t)); });
    if (lesson.terms.length >= 4) items.push(pairsItem(lesson.terms));
    return { id: lesson.id, deck: deckId, idx: idx, terms: lesson.terms, items: items };''',
'''    var noi = lesson.terms.filter(function (t) { return termStrength(t.id) === 0; });
    shuffle(lesson.terms.slice()).forEach(function (t) { items.push(termExercise(t)); });
    if (lesson.terms.length >= 4) items.push(pairsItem(lesson.terms));
    // Termenii noi revin la final în sens invers: definiția → denumirea.
    shuffle(noi.slice()).forEach(function (t) { items.push(revItem(t)); });
    return { id: lesson.id, deck: deckId, idx: idx, terms: lesson.terms, items: items };''')

# --- 4. markTerm: forța crește o dată pe zi, se calculează scadența ----------
rep('''    var t = state.learn.terms[id] || { s: 0, c: 0, g: 0 };
    if (corect) t.s = Math.min(MAX_STRENGTH, t.s + 1);
    else t.s = Math.max(0, t.s - 1);
    t[corect ? "c" : "g"] = (t[corect ? "c" : "g"] || 0) + 1;
    t.last = Date.now();
    t.lastCorrect = !!corect;
    state.learn.terms[id] = t;''',
'''    var t = state.learn.terms[id] || { s: 0, c: 0, g: 0 };
    var now = Date.now(), azi = dayKey(now);
    if (corect) {
      // A doua reușită în aceeași zi nu mai urcă forța: memoria se verifică peste zile.
      if (t.up !== azi || t.s === 0) { t.s = Math.min(MAX_STRENGTH, t.s + 1); t.up = azi; }
      t.due = now + TERM_IVL_DAYS[t.s] * DAY;
    } else {
      t.s = Math.max(0, t.s - 1);
      t.due = now + TERM_RETRY_MIN * MIN;
    }
    t[corect ? "c" : "g"] = (t[corect ? "c" : "g"] || 0) + 1;
    t.last = now;
    t.lastCorrect = !!corect;
    state.learn.terms[id] = t;''')

# --- 5. Afișarea exercițiilor noi ---------------------------------------------
rep('''    if (it.type === "pairs") {
      body.appendChild(el("div", "ls-kicker", "Potrivește termenii cu definițiile"));''',
'''    if (it.type === "rev") {
      body.appendChild(el("div", "ls-kicker", "Care termen are definiția asta?"));
      var rd = el("div", "ls-def md");
      rd.innerHTML = renderMd(maskTerm(it.term, it.term.d));
      body.appendChild(rd);
      var rl = el("div", "opts");
      it.options.forEach(function (o, i) {
        var b = el("button", "opt", o.text);
        b.setAttribute("data-opt", String(i));
        b.onclick = function () {
          if (L.verificat) return;
          L.raspuns = i;
          var all = rl.querySelectorAll(".opt");
          for (var k = 0; k < all.length; k++) all[k].classList.toggle("sel", k === i);
          setFoot("Verifică", true, verifica);
        };
        rl.appendChild(b);
      });
      body.appendChild(rl);
      setFoot("Verifică", false, verifica);
      $("#ls-fb").hidden = true;
      return;
    }

    if (it.type === "recall") {
      body.appendChild(el("div", "ls-kicker", "Scrie termenul"));
      var cd = el("div", "ls-def md");
      cd.innerHTML = renderMd(maskTerm(it.term, it.term.d));
      body.appendChild(cd);
      var inp = el("input", "recall-in");
      inp.id = "recall-input"; inp.type = "text"; inp.maxLength = 80;
      inp.autocomplete = "off"; inp.setAttribute("autocapitalize", "off"); inp.spellcheck = false;
      inp.placeholder = "Denumirea sau acronimul…";
      inp.setAttribute("aria-label", "Scrie termenul");
      inp.style.cssText = "width:100%;font-size:1.1em;padding:12px;margin:12px 0;border-radius:12px;border:1px solid var(--line, #8884)";
      body.appendChild(inp);
      var hintBox = el("p", "muted mono");
      hintBox.id = "recall-hint"; hintBox.hidden = true;
      body.appendChild(hintBox);
      L.hint = 0;
      inp.oninput = function () { setFoot("Verifică", !!inp.value.trim(), function () { verificaScris(false); }); };
      inp.onkeydown = function (e) { if (e.key === "Enter" && inp.value.trim()) { e.preventDefault(); verificaScris(false); } };
      setFoot("Verifică", false, function () { verificaScris(false); });
      var alt = $("#ls-alt");
      alt.hidden = false; alt.textContent = "Indiciu";
      alt.onclick = function () {
        if (L.verificat) return;
        if (!L.hint) {
          L.hint = 1; hintBox.hidden = false;
          hintBox.textContent = "Indiciu: " + recallHint(it.term);
          alt.textContent = "Nu știu";
          inp.focus();
        } else { verificaScris(true); }
      };
      $("#ls-fb").hidden = true;
      setTimeout(function () { if (inp.isConnected) inp.focus(); }, 60);
      return;
    }

    if (it.type === "pairs") {
      body.appendChild(el("div", "ls-kicker", "Potrivește termenii cu definițiile"));''')

# --- 6. Verificarea: grilă în ambele sensuri + exemplu la greșeală -----------
rep('''      L.gresite++;
      var aleasa = it.options[L.raspuns];
      if (aleasa && aleasa.term) {
        feedback(false, "Ai ales definiția lui „" + aleasa.term.t + "”. " +
                        it.term.t + " înseamnă: " + it.term.d);
      } else {
        feedback(false, it.term.t + ": " + it.term.d);
      }''',
'''      L.gresite++;
      var aleasa = it.options[L.raspuns];
      if (aleasa && aleasa.term && it.type === "rev") {
        feedback(false, "Ai ales „" + aleasa.term.t + "”, care înseamnă: " + aleasa.term.d +
                        " Definiția de aici este a lui „" + it.term.t + "”.");
      } else if (aleasa && aleasa.term) {
        feedback(false, "Ai ales definiția lui „" + aleasa.term.t + "”. " +
                        it.term.t + " înseamnă: " + it.term.d);
      } else {
        feedback(false, it.term.t + ": " + it.term.d);
      }''')

rep('''      L.reluari[k] = (L.reluari[k] || 0) + 1;
      if (L.reluari[k] <= MAX_RELUARI) {
        L.lesson.items.push(mcqItem(it.term));
        L.total = L.lesson.items.length;
      }
      setFoot("Continuă", true, avanseaza);
      loseHeart();
    }
    appendTermOrigin($("#ls-body"),it.term);
    if(!corect)appendRelated($("#ls-body"),it.term.id,"Explicații și practică pentru termenul greșit");
    save();
  }''',
'''      L.reluari[k] = (L.reluari[k] || 0) + 1;
      if (L.reluari[k] <= MAX_RELUARI) {
        // Prima reluare e în același sens; a doua îl întoarce, ca să nu memorezi poziția variantei.
        L.lesson.items.push(L.reluari[k] === 1 ? (it.type === "rev" ? revItem(it.term) : mcqItem(it.term)) : (it.type === "rev" ? mcqItem(it.term) : revItem(it.term)));
        L.total = L.lesson.items.length;
      }
      setFoot("Continuă", true, avanseaza);
      loseHeart();
    }
    appendTermOrigin($("#ls-body"),it.term);
    if(!corect){
      if(it.term.example)sectiuneMd($("#ls-body"),"Exemplu ca să-l ții minte",it.term.example);
      appendRelated($("#ls-body"),it.term.id,"Explicații și practică pentru termenul greșit");
    }
    save();
  }

  /** Verifică termenul scris. Indiciul ține termenul în lecție, dar nu-i urcă forța. */
  function verificaScris(renunt) {
    if (!L || L.verificat) return;
    var it = L.lesson.items[L.i];
    if (!it || it.type !== "recall") return;
    var inp = $("#recall-input");
    renunt = renunt === true;
    var typed = renunt ? "" : (inp ? inp.value : "");
    if (!renunt && !typed.trim()) return;
    var rez = renunt ? -1 : checkRecall(it.term, typed);
    var corect = rez >= 0;
    L.verificat = true;
    if (inp) inp.disabled = true;
    $("#ls-alt").hidden = true;
    if (corect) {
      if (!L.hint) markTerm(it.term.id, true);
      L.corecte++;
      var xp = L.hint ? XP_CORECT : XP_CORECT * 2;
      L.xp += xp; addXp(xp);
      feedback(true, rez === 1 ? "Aproape exact. Se scrie: " + it.term.t + "." : (L.hint ? "Corect, cu indiciu. Revine curând fără." : "Corect, din memorie."));
    } else {
      markTerm(it.term.id, false);
      L.gresite++;
      feedback(false, (renunt ? "" : "Ai scris „" + typed.trim() + "”. ") + "Termenul este: " + it.term.t + ".", renunt ? "Uite-l." : "Nu chiar.");
      var k = it.term.id;
      L.reluari[k] = (L.reluari[k] || 0) + 1;
      // Revine ca grilă inversă: întâi îl recunoști, apoi îl vei scrie altă dată.
      if (L.reluari[k] <= MAX_RELUARI) { L.lesson.items.push(revItem(it.term)); L.total = L.lesson.items.length; }
      if (it.term.example) sectiuneMd($("#ls-body"), "Exemplu ca să-l ții minte", it.term.example);
    }
    var other = termAnswers(it.term).filter(function (a) { return a !== it.term.t; });
    if (other.length) $("#ls-body").appendChild(el("p", "muted", "Accepți și: " + other.join(", ")));
    setFoot("Continuă", true, avanseaza);
    save();
  }''')

# Fără vieți la scris: e cel mai greu exercițiu, nu vrem să descurajeze.
rep('''var FARA_VIETI = { scen: 1, lab: 1, pylab: 1, spark: 1, card: 1, intro: 1, exam: 1 };''',
    '''var FARA_VIETI = { scen: 1, lab: 1, pylab: 1, spark: 1, card: 1, intro: 1, exam: 1, recall: 1 };''')

# --- 7. Persistența sesiunii (reluare după închiderea aplicației) -----------
rep('''    if (it.type === "mcq") return {type:"mcq",id:it.term.id,options:it.options.map(function (o) { return {id:(o.term || it.term).id,ok:!!o.ok}; })};''',
'''    if (it.type === "mcq" || it.type === "rev") return {type:it.type,id:it.term.id,options:it.options.map(function (o) { return {id:(o.term || it.term).id,ok:!!o.ok}; })};
    if (it.type === "recall") return {type:"recall",id:it.term.id};''')

rep('''    if (it.type === "mcq") {
      term = termById(it.id); if (!term || !Array.isArray(it.options)) return null;
      var options = it.options.map(function (o) { var t = termById(o.id); return t ? {text:t.d,ok:!!o.ok,term:t} : null; });
      if (options.some(function (o) { return !o; }) || options.filter(function (o) { return o.ok; }).length !== 1) return null;
      return {type:"mcq",term:term,options:options};
    }''',
'''    if (it.type === "mcq" || it.type === "rev") {
      term = termById(it.id); if (!term || !Array.isArray(it.options)) return null;
      var rev = it.type === "rev";
      var options = it.options.map(function (o) { var t = termById(o.id); return t ? {text:rev ? t.t : t.d,ok:!!o.ok,term:t} : null; });
      if (options.some(function (o) { return !o; }) || options.filter(function (o) { return o.ok; }).length !== 1) return null;
      return {type:it.type,term:term,options:options};
    }
    if (it.type === "recall") { term = termById(it.id); return term ? {type:"recall",term:term} : null; }''')

rep('''["scen","exam","mcq","spark"].indexOf(current.type)>=0''',
    '''["scen","exam","mcq","rev","recall","spark"].indexOf(current.type)>=0''')

# --- 8. Sesiunea zilnică: termenii scadenți înaintea celor doar „slabi” -----
rep('''    var slabi = [], noi = [];
    activi.forEach(function (t) {
      var s = termStrength(t.id);
      if (s === 0) noi.push(t);
      else if (s < MAX_STRENGTH) slabi.push({ t: t, s: s });
    });
    slabi.sort(function (a, b) { return a.s - b.s; });
    return {
      slabi: slabi.map(function (x) { return x.t; }),
      noi: shuffle(noi).slice(0, nrNoi)
    };''',
'''    var slabi = [], noi = [], scadenti = [], now = Date.now();
    activi.forEach(function (t) {
      var s = termStrength(t.id);
      if (s === 0) noi.push(t);
      else if (termIsDue(t.id, now)) scadenti.push({ t: t, s: s, due: termDue(t.id) });
      else if (s < MAX_STRENGTH) slabi.push({ t: t, s: s, due: termDue(t.id) });
    });
    // Întâi ce e scadent (cei mai slabi, apoi cei mai întârziați), apoi ce urmează să devină scadent.
    scadenti.sort(function (a, b) { return a.s - b.s || a.due - b.due; });
    slabi.sort(function (a, b) { return a.due - b.due || a.s - b.s; });
    return {
      slabi: scadenti.concat(slabi).map(function (x) { return x.t; }),
      scadenti: scadenti.length,
      noi: shuffle(noi).slice(0, nrNoi)
    };''')

rep('''    t.slabi.slice(0, nrSlabi).forEach(function (x) {
      items.push(mcqItem(x));
      folositi.push(x);
    });''',
'''    t.slabi.slice(0, nrSlabi).forEach(function (x) {
      items.push(termExercise(x));
      folositi.push(x);
    });''')

# --- 9. Ecranul Termeni: repetarea termenilor scadenți ---------------------
rep('''    right.appendChild(el("div", "hero-sub", "termeni știuți din " + p.total));
    hero.appendChild(right);
    root.appendChild(hero);''',
'''    right.appendChild(el("div", "hero-sub", "termeni știuți din " + p.total));
    hero.appendChild(right);
    root.appendChild(hero);
    var scad = dueTerms();
    var repBtn = el("button", "btn big " + (scad.length ? "primary" : "secondary"),
      scad.length ? "Repetă termenii scadenți · " + scad.length : "Niciun termen scadent azi");
    repBtn.id = "review-due-terms";
    repBtn.style.cssText = "width:100%;margin:0 0 6px";
    repBtn.disabled = !scad.length;
    repBtn.onclick = startTermReview;
    root.appendChild(repBtn);
    root.appendChild(el("p", "muted center", scad.length
      ? "Termenii revin la 1, 3, 7, 16 și 35 de zile. Cu cât îi știi mai bine, cu atât îi scrii din memorie."
      : (p.incepute ? "Următorii termeni învățați revin când le vine rândul." : "Începe o lecție; termenii învățați revin apoi automat la repetare.")));''')

rep('''  function termStrength(id) {''',
'''  /** Repetiție pentru termenii scadenți: exercițiul se alege după cât de bine îi știi. */
  function startTermReview() {
    var terms = dueTerms().slice(0, 15);
    if (!terms.length) { toast("Niciun termen scadent acum."); return false; }
    var items = terms.map(termExercise);
    if (terms.length >= 4) items.push(pairsItem(terms.slice(0, 8)));
    return startRun(items, { titlu: "Repetă termenii" });
  }

  function termStrength(id) {''')

rep('''    learnUnits: learnUnits, buildLesson: buildLesson,''',
    '''    learnUnits: learnUnits, buildLesson: buildLesson, dueTerms: dueTerms, termDue: termDue, startTermReview: startTermReview,
    checkRecall: checkRecall, maskTerm: maskTerm, termAnswers: termAnswers, revItem: revItem, recallItem: recallItem, termExercise: termExercise, markTerm: markTerm,''')

open(path, "w", encoding="utf-8", newline="").write(src.replace("\n", "\r\n") if crlf else src)
print("ok")

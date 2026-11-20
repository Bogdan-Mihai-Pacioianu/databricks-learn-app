# Atelier (1.49.0): exerciții de decizie, capcane, ordonare, completare și verificare pe date,
# cu scor de stăpânire, repetare la 1/3/7/21 de zile, coada „Repară lacunele”,
# sertarul „Materiale” din sesiune și secțiunea „Autonomie” din Statistici.
# Se aplică după celelalte patch-uri (are nevoie de modurile Învață/Practică).
#
#   python tools/patch_atelier.py app/assets
import os, sys

assets = sys.argv[1]
path = os.path.join(assets, "app.js")
src = open(path, encoding="utf-8", newline="").read()
crlf = "\r\n" in src
src = src.replace("\r\n", "\n")
if "function renderFx159" in src:
    sys.exit("Atelierul este deja aplicat.")


def rep(old, new):
    global src
    n = src.count(old)
    if n != 1:
        sys.exit("Înlocuirea nu se potrivește (%d apariții):\n%s" % (n, old[:200]))
    src = src.replace(old, new)


# ---- 1. Tab nou „Atelier” în Învață; implicit în modul Practică (traseul) ----
rep('''     ["cert", "Certificări"], ["projects", "Proiecte"], ["saved", "Salvate"]]''',
    '''     ["cert", "Certificări"], ["projects", "Proiecte"], ["workshop", "Atelier"], ["saved", "Salvate"]]''')
rep('''var tabIcons={concepts:"graf",career:"tinta",paths:"carte",terms:"carte",scen:"balon",sql:"baza",py:"terminal",cert:"insigna",projects:"cub",saved:"carduri"};''',
    '''var tabIcons={concepts:"graf",career:"tinta",paths:"carte",terms:"carte",scen:"balon",sql:"baza",py:"terminal",cert:"insigna",projects:"cub",workshop:"cheie",saved:"carduri"};''')
rep('''    if (learnTab === "career") { if (practice156) renderTabPractice156(root, "career"); else renderCareer142(root); return; }''',
    '''    if (learnTab === "workshop") { if (practice156) renderAtelierPath159(root); else renderAtelierLearn159(root); return; }
    if (learnTab === "career") { if (practice156) renderTabPractice156(root, "career"); else renderCareer142(root); return; }''')
rep('''    if (modes[tab] === "practice" || modes[tab] === "learn") return modes[tab];''',
    '''    if (modes[tab] === "practice" || modes[tab] === "learn") return modes[tab];
    if (tab === "workshop") return "practice";''')
rep('''    saved: "Materialele salvate și notițele tale, de recitit."
  };''', '''    saved: "Materialele salvate și notițele tale, de recitit.",
    workshop: "Fișe scurte: reguli, capcane frecvente și incidente reale, pe competențe."
  };''')
rep('''    saved: "Repetă favoritele, greșelile sau cardurile scadente."
  };''', '''    saved: "Repetă favoritele, greșelile sau cardurile scadente.",
    workshop: "Traseul pe competențe: decizii, capcane, ordinea pașilor, completare și verificare pe date."
  };''')

# ---- 2. Exercițiul „fx” în motorul de sesiuni ----
rep('''    if (it.type === "intro") {
      body.appendChild(el("div", "ls-kicker", "Termen nou"));''',
    '''    if (it.type === "fx") { renderFx159(body, it); return; }

    if (it.type === "intro") {
      body.appendChild(el("div", "ls-kicker", "Termen nou"));''')
rep('''var FARA_VIETI = { scen: 1, lab: 1, pylab: 1, spark: 1, card: 1, intro: 1, exam: 1, recall: 1 };''',
    '''var FARA_VIETI = { scen: 1, lab: 1, pylab: 1, spark: 1, card: 1, intro: 1, exam: 1, recall: 1, fx: 1 };''')
rep('''    if (it.type === "recall") return {type:"recall",id:it.term.id};''',
    '''    if (it.type === "recall") return {type:"recall",id:it.term.id};
    if (it.type === "fx") return {type:"fx",id:it.ex.id,noHint:!!it.noHint};''')
rep('''    if (it.type === "recall") { term = termById(it.id); return term ? {type:"recall",term:term} : null; }''',
    '''    if (it.type === "recall") { term = termById(it.id); return term ? {type:"recall",term:term} : null; }
    if (it.type === "fx") { item = fxById159(it.id); return item ? {type:"fx",ex:item,noHint:!!it.noHint} : null; }''')
rep('''["scen","exam","mcq","rev","recall","spark"].indexOf(current.type)>=0''',
    '''["scen","exam","mcq","rev","recall","spark","fx"].indexOf(current.type)>=0''')

# ---- 3. Repară lacunele pe ecranul Azi ----
rep('''    renderExperience139(root);
''', '''    renderExperience139(root);
    appendRepairCard159(root);
''')

# ---- 4. Autonomie în Statistici ----
rep('''    if(courses145Api())courses145Api().stats(root);
    var now = Date.now();''', '''    if(courses145Api())courses145Api().stats(root);
    renderAutonomy159(root);
    var now = Date.now();''')

# ---- 5. Funcțiile Atelierului ----
rep('''  // ---------------------------------------------------------------- Moduri pe taburi''', r'''  // ---------------------------------------------------------------- Atelier 1.49
  var FX_DAYS159 = [1, 3, 7, 21];
  var FX_LEVELS159 = ["Bază", "Edge cases", "Trade-offs", "Fără indicii"];
  var FX_LEVELS_MENTAL160 = ["Intuiție", "Cazuri limită", "Compromisuri", "Diagnostic"];
  var FX_TYPES159 = { tradeoff: "Alege decizia", flaw: "Găsește capcana", order: "Ordinea pașilor", slot: "Completează", datacheck: "Verifică pe date", diagnose: "Simptom → Ipoteză" };
  var FX_KINDS160 = { invariant: "Care e invarianța?", retry: "Ce se strică la retry?", compromise: "Alege compromisul", assumption: "Găsește presupunerea ascunsă", order: "Ordine și dependențe", diagnose: "Simptom → Ipoteză" };
  function fxTrack160(skillId) { var s = fxSkill159(skillId); return s && s.track === "mental" ? "mental" : "tech"; }
  function fxLevels160(skillId) { return fxTrack160(skillId) === "mental" ? FX_LEVELS_MENTAL160 : FX_LEVELS159; }
  function fxCurrentTrack160() { return (state.settings.atelierTrack160 === "tech") ? "tech" : "mental"; }
  function fxSkills160(track) { return atl159().skills.filter(function (s) { return (s.track || "tech") === track; }).sort(function (x, y) { return x.order - y.order; }); }
  function atl159() { return window.ATELIER159 || { skills: [], exercises: [], cards: [], tags: {} }; }
  function fxById159(id) { return atl159().exercises.filter(function (e) { return e.id === id; })[0] || null; }
  function fxSkill159(id) { return atl159().skills.filter(function (s) { return s.id === id; })[0] || null; }
  function fxOfSkill159(id) { return atl159().exercises.filter(function (e) { return e.skill === id; }); }
  function fxState159() {
    var s = state.focus159;
    if (!s || typeof s !== "object") s = state.focus159 = {};
    if (!s.ex || typeof s.ex !== "object") s.ex = {};
    if (!s.errors || typeof s.errors !== "object") s.errors = {};
    if (!s.notes || typeof s.notes !== "object") s.notes = {};
    return s;
  }
  function fxRec159(id) { return fxState159().ex[id] || null; }
  /** Scor 0–100: +25 fără indiciu, +10 cu indiciu, −20 la greșeală. Intervalul crește cu scorul. */
  function fxRecord159(ex, correct, hinted) {
    var st = fxState159(), now = Date.now();
    var r = st.ex[ex.id] || { m: 0, att: 0, hints: 0, ok: 0, okNoHint: 0, fail: 0, next: 0, last: null };
    r.att++; if (hinted) r.hints++;
    if (correct) {
      r.m = Math.min(100, r.m + (hinted ? 10 : 25)); r.ok++; if (!hinted) r.okNoHint++;
      var lvl = r.m >= 100 ? 3 : r.m >= 75 ? 2 : r.m >= 50 ? 1 : 0;
      r.ivl = FX_DAYS159[lvl]; r.next = now + r.ivl * DAY; r.last = hinted ? "hint" : "ok";
    } else {
      r.m = Math.max(0, r.m - 20); r.fail++; r.ivl = 0; r.next = now; r.last = "fail";
      if (ex.tag) st.errors[ex.tag] = (st.errors[ex.tag] || 0) + 1;
    }
    r.at = now; st.ex[ex.id] = r;
  }
  /** Coada „Repară lacunele”: greșite, rezolvate cu indiciu, apoi scadente. */
  function fxRepairQueue159() {
    var now = Date.now(), rank = { fail: 0, hint: 1 };
    return atl159().exercises.map(function (e) { return { e: e, r: fxRec159(e.id) }; })
      .filter(function (x) { return x.r && (x.r.last === "fail" || x.r.last === "hint" || (x.r.next && x.r.next <= now)); })
      .sort(function (a, b) { return (rank[a.r.last] === undefined ? 2 : rank[a.r.last]) - (rank[b.r.last] === undefined ? 2 : rank[b.r.last]) || a.r.next - b.r.next; })
      .map(function (x) { return x.e; });
  }
  /** Treptele unei competențe: 1–3 = toate exercițiile treptei rezolvate; 4 = toate rezolvate fără indiciu. */
  function fxSkillStatus159(skillId) {
    var list = fxOfSkill159(skillId), now = Date.now();
    var crowns = [1, 2, 3].map(function (l) {
      var xs = list.filter(function (e) { return e.level === l; });
      return xs.length > 0 && xs.every(function (e) { var r = fxRec159(e.id); return r && r.ok > 0; });
    });
    var l4 = list.filter(function (e) { return e.level === 4; });
    crowns.push(l4.length ? l4.every(function (e) { var r = fxRec159(e.id); return r && r.ok > 0; }) :
      (list.length > 0 && list.every(function (e) { var r = fxRec159(e.id); return r && r.okNoHint > 0; })));
    var recs = list.map(function (e) { return fxRec159(e.id); });
    var started = recs.some(Boolean), due = list.filter(function (e) { var r = fxRec159(e.id); return r && (r.last === "fail" || r.last === "hint" || (r.next && r.next <= now)); }).length;
    var mastery = list.length ? Math.round(recs.reduce(function (s, r) { return s + (r ? r.m : 0); }, 0) / list.length) : 0;
    var stateName = !started ? "new" : due ? "rusty" : (crowns[0] && crowns[1] && crowns[2]) ? "solid" : "progress";
    return { crowns: crowns, mastery: mastery, due: due, state: stateName, total: list.length };
  }
  function fxItem159(e, noHint) { return { type: "fx", ex: e, noHint: !!noHint }; }
  /** Sesiune de 6 exerciții: întâi treapta neterminată, apoi ce e scadent din competență. */
  function startSkillSession159(skillId, noHint) {
    var list = fxOfSkill159(skillId), st = fxSkillStatus159(skillId), pick = [];
    if (noHint) pick = list.filter(function (e) { var r = fxRec159(e.id); return !r || !r.okNoHint; });
    else {
      var lvl = [1, 2, 3, 4].filter(function (l, i) { return !st.crowns[i] && list.some(function (e) { return e.level === l; }); })[0];
      if (lvl) pick = list.filter(function (e) { return e.level === lvl; });
      var now = Date.now();
      list.forEach(function (e) { var r = fxRec159(e.id); if (pick.indexOf(e) < 0 && r && (r.last !== "ok" || (r.next && r.next <= now))) pick.push(e); });
      list.forEach(function (e) { if (pick.length < 6 && pick.indexOf(e) < 0 && (!lvl || e.level <= lvl + 2)) pick.push(e); });
    }
    if (!pick.length) pick = list.slice();
    var s = fxSkill159(skillId);
    return startRun(pick.slice(0, 6).map(function (e) { return fxItem159(e, noHint); }),
      { id: "atelier159:" + skillId, titlu: (s ? s.title : "Atelier") + (noHint ? " · fără indicii" : "") });
  }
  function startRepair159() {
    var q = fxRepairQueue159();
    if (!q.length) { toast("Nicio lacună de reparat acum."); return false; }
    return startRun(q.slice(0, 6).map(function (e) { return fxItem159(e, false); }), { id: "atelier159:repair", titlu: "Repară lacunele" });
  }
  function appendRepairCard159(root) {
    var n = fxRepairQueue159().length;
    if (!n) return;
    var card = el("section", "unit repair159"); card.id = "repair-card159";
    card.appendChild(el("p", "cozy-eyebrow", "ATELIER"));
    card.appendChild(el("h2", null, "Repară lacunele (" + n + ")"));
    card.appendChild(el("p", "muted", "Exerciții greșite, rezolvate cu indiciu sau ajunse la recapitulare. O sesiune scurtă de până la 6."));
    var b = el("button", "btn primary big", "Repară acum"); b.id = "repair-start159"; b.onclick = startRepair159;
    card.appendChild(b); root.appendChild(card);
  }

  // ---- Sesiunea: afișarea și verificarea fiecărui tip ----
  function fxDone159(it, correct, detail, wrongWhy) {
    if (L.verificat) return;
    L.verificat = true;
    var e = it.ex, hinted = !!L.hint;
    fxRecord159(e, correct, hinted);
    if (correct) { L.corecte++; var xp = hinted ? XP_CORECT : XP_CORECT * 2; L.xp += xp; addXp(xp); }
    else {
      L.gresite++;
      L.reluari[e.id] = (L.reluari[e.id] || 0) + 1;
      if (L.reluari[e.id] <= 1) { L.lesson.items.push(fxItem159(e, it.noHint)); L.total = L.lesson.items.length; }
    }
    feedback(correct, (wrongWhy ? wrongWhy + " " : "") + (correct && hinted ? "Corect, cu indiciu. Revine curând fără." : ""), correct ? "Corect." : "Aproape. Uite ce a scăpat:");
    var body = $("#ls-body");
    if (!correct && e.tag && (atl159().tags || {})[e.tag]) { var miss = el("p", "fx-missed160"); miss.appendChild(el("b", null, "Ce ai ratat: ")); miss.appendChild(document.createTextNode(atl159().tags[e.tag])); body.appendChild(miss); }
    if (detail) body.appendChild(detail);
    var ex = el("div", "md ex-model"); ex.innerHTML = renderMd(e.explanation); body.appendChild(ex);
    var prod = el("details", "unit fx-impact159"); prod.appendChild(el("summary", null, "De ce contează în producție"));
    var pm = el("div", "md"); pm.innerHTML = renderMd(e.impact); prod.appendChild(pm); body.appendChild(prod);
    $("#ls-alt").hidden = true;
    bumpStreak(Date.now());
    setFoot("Continuă", true, avanseaza);
    save();
  }
  function renderFx159(body, it) {
    var e = it.ex, p = e.payload, levels = fxLevels160(e.skill);
    L.hint = 0;
    var noHint = it.noHint || e.level === 4;
    body.classList.toggle("calm160", fxTrack160(e.skill) === "mental");
    var head = el("div", "fx-head159");
    head.appendChild(el("span", "dict-chip156 fx-type159", FX_KINDS160[e.kind] || FX_TYPES159[e.type] || e.type));
    head.appendChild(el("span", "dict-chip156", it.noHint && e.level < 4 ? levels[3] : levels[e.level - 1]));
    var sk = fxSkill159(e.skill); if (sk) head.appendChild(el("span", "muted fx-skill159", sk.title));
    body.appendChild(head);
    var q = el("div", "md q"); q.innerHTML = renderMd(e.prompt); body.appendChild(q);
    if (e.diagram) body.appendChild(fxFlow160(e.diagram));
    $("#ls-fb").hidden = true;
    var alt = $("#ls-alt");
    if (!noHint && e.hint) {
      alt.hidden = false; alt.textContent = "Indiciu";
      alt.onclick = function () { if (L.verificat || L.hint) return; L.hint = 1; var h = el("p", "hint fx-hint159", "Indiciu: " + e.hint); body.insertBefore(h, body.children[2] || null); alt.hidden = true; };
    }
    if (e.type === "tradeoff" || e.type === "datacheck") {
      if (e.type === "datacheck") body.appendChild(fxTable159(p.columns, p.rows));
      var ord = it.ord || (it.ord = shuffle(p.options.map(function (_, i) { return i; })));
      var list = el("div", "opts");
      ord.forEach(function (i, pos) {
        var o = p.options[i], b = el("button", "opt" + (e.type === "datacheck" ? " mono" : ""), o.t);
        b.setAttribute("data-fx-opt", String(i));
        b.onclick = function () { if (L.verificat) return; L.raspuns = i; list.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("sel", x === b); }); setFoot("Verifică", true, check); };
        list.appendChild(b);
      });
      body.appendChild(list);
      setFoot("Verifică", false, check);
      function check() {
        if (L.raspuns === null || L.raspuns === undefined) return;
        var chosen = p.options[L.raspuns], correct, detail = null, why = chosen.why || "";
        if (e.type === "datacheck") {
          var res = fxRunCheck159(p, L.raspuns);
          correct = p.accept ? p.accept.indexOf(L.raspuns) >= 0 : res.passed;
          detail = fxDiff159(res, p);
          if (!correct && res.passed) why = "Pe acest set dă rezultatul așteptat, dar nu respectă toată cerința.";
        } else correct = !!chosen.ok;
        list.querySelectorAll(".opt").forEach(function (x) {
          var i = Number(x.getAttribute("data-fx-opt")); x.disabled = true;
          if (p.options[i].ok) x.classList.add("ok"); else if (i === L.raspuns) x.classList.add("rau");
        });
        fxDone159(it, correct, detail, correct ? "" : why);
      }
      return;
    }
    if (e.type === "diagnose") {
      var pick = { h: null, t: null }, groups = {};
      [["hypotheses", "h", "1. Ce ipoteză explică cel mai bine?"], ["tests", "t", "2. Cum o testezi?"]].forEach(function (g) {
        body.appendChild(el("h4", "fx-dx-title160", g[2]));
        var box = el("div", "opts"); groups[g[1]] = box;
        var ord = (it.ord = it.ord || {})[g[1]] || (it.ord[g[1]] = shuffle(p[g[0]].map(function (_, i) { return i; })));
        ord.forEach(function (i) {
          var b = el("button", "opt", p[g[0]][i].t); b.setAttribute("data-fx-" + g[1], String(i));
          b.onclick = function () { if (L.verificat) return; pick[g[1]] = i; box.querySelectorAll(".opt").forEach(function (x) { x.classList.toggle("sel", x === b); }); setFoot("Verifică", pick.h !== null && pick.t !== null, checkDx); };
          box.appendChild(b);
        });
        body.appendChild(box);
      });
      setFoot("Verifică", false, checkDx);
      function checkDx() {
        if (pick.h === null || pick.t === null) return;
        var hOk = !!p.hypotheses[pick.h].ok, tOk = !!p.tests[pick.t].ok, why = [];
        [["hypotheses", "h"], ["tests", "t"]].forEach(function (g) {
          groups[g[1]].querySelectorAll(".opt").forEach(function (x) { var i = Number(x.getAttribute("data-fx-" + g[1])); x.disabled = true; if (p[g[0]][i].ok) x.classList.add("ok"); else if (i === pick[g[1]]) x.classList.add("rau"); });
        });
        if (!hOk) why.push("Ipoteza: " + (p.hypotheses[pick.h].why || ""));
        if (!tOk) why.push("Testul: " + (p.tests[pick.t].why || ""));
        fxDone159(it, hOk && tOk, null, why.join(" "));
      }
      return;
    }
    if (e.type === "flaw") {
      var code = el("div", "fx-code159");
      p.lines.forEach(function (line, i) {
        var b = el("button", "fx-line159");
        b.appendChild(el("span", "fx-ln159", String(i + 1))); b.appendChild(el("code", null, line));
        b.setAttribute("data-fx-line", String(i));
        b.onclick = function () { if (L.verificat) return; L.raspuns = i; code.querySelectorAll(".fx-line159").forEach(function (x) { x.classList.toggle("sel", x === b); }); setFoot("Verifică", true, checkFlaw); };
        code.appendChild(b);
      });
      body.appendChild(el("p", "muted", "Atinge linia care produce problema."));
      body.appendChild(code);
      setFoot("Verifică", false, checkFlaw);
      function checkFlaw() {
        if (L.raspuns === null || L.raspuns === undefined) return;
        var correct = L.raspuns === p.bad;
        code.querySelectorAll(".fx-line159").forEach(function (x) { var i = Number(x.getAttribute("data-fx-line")); x.disabled = true; if (i === p.bad) x.classList.add("ok"); else if (i === L.raspuns) x.classList.add("rau"); });
        fxDone159(it, correct, null, correct ? "" : "Problema e la linia " + (p.bad + 1) + ".");
      }
      return;
    }
    if (e.type === "order") {
      var pool = it.ord || (it.ord = shuffle(p.steps.map(function (_, i) { return i; })));
      var seq = [], mine = el("ol", "fx-seq159"), avail = el("div", "fx-avail159");
      body.appendChild(el("p", "muted", "Atinge pașii în ordinea corectă. Atinge un pas din listă ca să-l scoți."));
      body.appendChild(mine); body.appendChild(avail);
      function draw() {
        mine.innerHTML = ""; avail.innerHTML = "";
        seq.forEach(function (i, pos) { var li = el("li"); var b = el("button", "fx-step159 on", p.steps[i]); b.setAttribute("data-fx-seq", String(i)); b.onclick = function () { if (L.verificat) return; seq.splice(pos, 1); draw(); }; li.appendChild(b); mine.appendChild(li); });
        pool.forEach(function (i) { if (seq.indexOf(i) >= 0) return; var b = el("button", "fx-step159", p.steps[i]); b.setAttribute("data-fx-step", String(i)); b.onclick = function () { if (L.verificat) return; seq.push(i); draw(); }; avail.appendChild(b); });
        setFoot("Verifică", seq.length === p.steps.length, checkOrder);
      }
      draw();
      function checkOrder() {
        if (seq.length !== p.steps.length) return;
        var correct = seq.every(function (v, i) { return v === i; });
        mine.querySelectorAll(".fx-step159").forEach(function (x, pos) { x.disabled = true; x.classList.add(seq[pos] === pos ? "ok" : "rau"); });
        var detail = null;
        if (!correct) { detail = el("div", "unit"); detail.appendChild(el("b", null, "Ordinea corectă")); var ol = el("ol"); p.steps.forEach(function (s) { ol.appendChild(el("li", null, s)); }); detail.appendChild(ol); }
        fxDone159(it, correct, detail, correct ? "" : "Pașii marcați cu roșu nu sunt la locul lor.");
      }
      return;
    }
    if (e.type === "slot") {
      var filled = p.answers.map(function () { return null; }), tpl = el("pre", "fx-tpl159"), chips = el("div", "chips fx-chips159");
      var chipOrd = it.ord || (it.ord = shuffle(p.chips.map(function (_, i) { return i; })));
      body.appendChild(tpl); body.appendChild(el("p", "muted", "Atinge un jeton ca să completezi următorul spațiu liber. Atinge un spațiu completat ca să-l golești."));
      body.appendChild(chips);
      function drawSlots() {
        tpl.innerHTML = "";
        p.template.split(/(\{\d+\})/).forEach(function (part) {
          var m = /^\{(\d+)\}$/.exec(part);
          if (!m) { tpl.appendChild(document.createTextNode(part)); return; }
          var k = Number(m[1]), b = el("button", "fx-slot159" + (filled[k] !== null ? " on" : ""), filled[k] !== null ? p.chips[filled[k]] : "＿＿＿");
          b.setAttribute("data-fx-slot", String(k));
          b.onclick = function () { if (L.verificat) return; filled[k] = null; drawSlots(); };
          tpl.appendChild(b);
        });
        chips.innerHTML = "";
        chipOrd.forEach(function (i) {
          var b = el("button", "chip", p.chips[i]); b.setAttribute("data-fx-chip", p.chips[i]);
          b.disabled = filled.indexOf(i) >= 0;
          b.onclick = function () { if (L.verificat) return; var k = filled.indexOf(null); if (k < 0) return; filled[k] = i; drawSlots(); };
          chips.appendChild(b);
        });
        setFoot("Verifică", filled.indexOf(null) < 0, checkSlot);
      }
      drawSlots();
      function checkSlot() {
        if (filled.indexOf(null) >= 0) return;
        var ok = filled.map(function (i, k) { return p.chips[i] === p.answers[k]; });
        tpl.querySelectorAll(".fx-slot159").forEach(function (x) { var k = Number(x.getAttribute("data-fx-slot")); x.disabled = true; x.classList.add(ok[k] ? "ok" : "rau"); });
        chips.querySelectorAll("button").forEach(function (x) { x.disabled = true; });
        var correct = ok.every(Boolean);
        var detail = correct ? null : el("pre", "fx-tpl159 fx-solution159", p.template.replace(/\{(\d+)\}/g, function (_, k) { return p.answers[Number(k)]; }));
        fxDone159(it, correct, detail, correct ? "" : "Varianta corectă e mai jos.");
      }
      return;
    }
  }
  /** Diagramă schematică randată local: cutii și săgeți, cu pasul eșuat marcat. */
  function fxFlow160(d) {
    var box = el("div", "fx-flow160"); box.setAttribute("role", "img");
    box.setAttribute("aria-label", "Schemă: " + d.steps.join(", apoi ") + (typeof d.fail === "number" ? "; eșuează la " + d.steps[d.fail] : ""));
    d.steps.forEach(function (s, i) {
      if (i) box.appendChild(el("span", "fx-arrow160", "→"));
      box.appendChild(el("span", "fx-box160" + (d.fail === i ? " fail" : ""), (d.fail === i ? "✕ " : "") + s));
    });
    return box;
  }
  function fxTable159(columns, rows) {
    var wrap = el("div", "fx-table-wrap159"), t = el("table", "fx-table159"), tr = el("tr");
    columns.forEach(function (c) { tr.appendChild(el("th", null, c)); }); t.appendChild(tr);
    rows.forEach(function (r) { var row = el("tr"); r.forEach(function (v) { row.appendChild(el("td", v === null ? "fx-null159" : null, v === null ? "NULL" : String(v))); }); t.appendChild(row); });
    wrap.appendChild(t); return wrap;
  }
  /** Rulează local varianta aleasă pe datele exercițiului și compară cu rezultatul așteptat. */
  function fxRunCheck159(p, idx) {
    var rows = p.rows.map(function (r) { var o = {}; p.columns.forEach(function (c, i) { o[c] = r[i]; }); return o; });
    var fn = (0, eval)("(" + p.options[idx].fn + ")");
    var got = rows.filter(function (r) { return fn(r, rows, p.context || {}); }).map(function (r) { return r[p.key]; });
    var want = (p.expectedKeys || p.expected).slice();
    var extra = got.filter(function (k) { return want.indexOf(k) < 0; }), missing = want.filter(function (k) { return got.indexOf(k) < 0; });
    return { got: got, want: want, extra: extra, missing: missing, passed: !extra.length && !missing.length };
  }
  function fxDiff159(res, p) {
    var box = el("div", "unit fx-diff159");
    box.appendChild(el("b", null, res.passed ? "Verificare pe date: trece" : "Verificare pe date: nu trece"));
    box.appendChild(el("p", "mono", "Rezultatul tău (" + p.key + "): " + (res.got.length ? res.got.join(", ") : "niciun rând")));
    box.appendChild(el("p", "mono", "Așteptat: " + res.want.join(", ")));
    if (res.extra.length) box.appendChild(el("p", "mono", "În plus: " + res.extra.join(", ")));
    if (res.missing.length) box.appendChild(el("p", "mono", "Lipsă: " + res.missing.join(", ")));
    return box;
  }

  // ---- Sertarul „Materiale”, deschis de oriunde, inclusiv în timpul unui exercițiu ----
  function currentFx159() { var it = L && L.lesson && L.lesson.items[L.i]; return it && it.type === "fx" ? it.ex : null; }
  function openDrawer159(tab) {
    var body = $("#modal-body"); body.innerHTML = ""; $("#modal-title").textContent = "Materiale";
    var cur = currentFx159(), skill = cur ? cur.skill : (state.settings.drawer159 || {}).skill || "";
    var seg = el("div", "seg"), active = tab || (state.settings.drawer159 || {}).tab || "cheat";
    [["cheat", "Principii"], ["traps", "Capcane & scenarii"], ["notes", "Jurnalul meu"]].forEach(function (t) {
      var b = el("button", "seg-b" + (active === t[0] ? " on" : ""), t[1]); b.setAttribute("data-drawer-tab", t[0]);
      b.onclick = function () { state.settings.drawer159 = { tab: t[0], skill: skill }; save(); openDrawer159(t[0]); };
      seg.appendChild(b);
    });
    body.appendChild(seg);
    var pick = el("select"); pick.id = "drawer-skill159"; pick.setAttribute("aria-label", "Competență");
    pick.appendChild(new Option("Toate competențele", ""));
    atl159().skills.forEach(function (s) { pick.appendChild(new Option(s.title, s.id)); });
    pick.value = skill; pick.onchange = function () { skill = pick.value; state.settings.drawer159 = { tab: active, skill: skill }; save(); draw(); };
    body.appendChild(pick);
    var q = el("input"); q.type = "search"; q.id = "drawer-search159"; q.placeholder = "Caută în materiale…"; q.setAttribute("aria-label", "Caută în materiale");
    body.appendChild(q);
    var list = el("div"); list.id = "drawer-list159"; body.appendChild(list);
    function draw() {
      list.innerHTML = "";
      var needle = searchKey(q.value.trim());
      if (active === "notes") {
        if (cur) {
          var box = el("div", "unit"); box.appendChild(el("b", null, "Notiță pentru exercițiul curent"));
          var ta = el("textarea"); ta.id = "drawer-note159"; ta.rows = 4; ta.style.width = "100%"; ta.value = (fxState159().notes[cur.id] || {}).text || "";
          box.appendChild(ta);
          var sv = el("button", "btn primary", "Salvează notița"); sv.id = "drawer-save-note159";
          sv.onclick = function () { var t = ta.value.trim(), n = fxState159().notes; if (t) n[cur.id] = { text: t, at: Date.now(), skill: cur.skill }; else delete n[cur.id]; save(true); toast("Notiță salvată."); draw(); };
          box.appendChild(sv); list.appendChild(box);
        } else {
          var jb = el("div", "unit"); jb.appendChild(el("b", null, "Notiță nouă în jurnal"));
          jb.appendChild(el("p", "muted", "Ce ai înțeles, un exemplu din munca ta sau o regulă pe care nu vrei s-o uiți."));
          var jt = el("textarea"); jt.id = "drawer-journal160"; jt.rows = 4; jt.style.width = "100%"; jb.appendChild(jt);
          var js = el("button", "btn primary", "Salvează în jurnal"); js.id = "drawer-journal-save160";
          js.onclick = function () { var t = jt.value.trim(); if (!t) return; fxState159().notes["j-" + Date.now().toString(36)] = { text: t, at: Date.now(), skill: skill || "" }; save(true); toast("Salvat în jurnal."); draw(); };
          jb.appendChild(js); list.appendChild(jb);
        }
        var notes = fxState159().notes, ids = Object.keys(notes).filter(function (id) { return !skill || notes[id].skill === skill; })
          .filter(function (id) { return !needle || searchKey(notes[id].text).indexOf(needle) >= 0; })
          .sort(function (a, b) { return notes[b].at - notes[a].at; });
        if (!ids.length) list.appendChild(el("p", "muted", "Nicio notiță încă. Notițele salvate în timpul exercițiilor apar aici."));
        ids.forEach(function (id) { var e = fxById159(id), sk = fxSkill159(notes[id].skill), c = el("div", "unit"); c.appendChild(el("b", null, e ? e.prompt.slice(0, 90) : (sk ? sk.title : "Notiță liberă"))); c.appendChild(el("p", "muted", new Date(notes[id].at).toLocaleDateString("ro-RO"))); c.appendChild(el("p", null, notes[id].text)); list.appendChild(c); });
        var other = savedMaterials().filter(function (r) { return r && r.note; });
        if (other.length && !skill) { list.appendChild(el("h3", null, "Alte notițe din aplicație")); other.slice(0, 20).forEach(function (r) { var c = el("div", "unit"); c.appendChild(el("b", null, r.title)); c.appendChild(el("p", null, r.note)); list.appendChild(c); }); }
        return;
      }
      var cats = active === "cheat" ? ["cheat_sheet", "model", "matrix"] : ["anti_pattern", "incident", "pitfall", "scenario"];
      var cards = atl159().cards.filter(function (c) { return cats.indexOf(c.category) >= 0 && (!skill || c.skill === skill) && (!needle || searchKey(c.title + " " + c.body).indexOf(needle) >= 0); });
      if (!cards.length) list.appendChild(el("p", "muted", "Nicio fișă pentru alegerea asta."));
      cards.forEach(function (c) {
        var d = el("details", "unit glossary-row133"); d.setAttribute("data-drawer-card", c.id);
        var s = el("summary"); s.appendChild(el("span", "glossary-term133", c.title));
        s.appendChild(el("span", "dict-chip156", (FX_CAT160[c.category] || "fișă").toLowerCase())); d.appendChild(s);
        var m = el("div", "md"); m.innerHTML = renderMd(c.body); d.appendChild(m);
        if (cur && c.skill === cur.skill) d.open = true;
        list.appendChild(d);
      });
      var more = el("div", "dict-refs156");
      var dict = el("button", "btn mini secondary", "Dicționar A–Z"); dict.onclick = function () { openDictionary156(); }; more.appendChild(dict);
      var res = el("button", "btn mini secondary", "Bibliotecă de resurse"); res.onclick = function () { openResources156(""); }; more.appendChild(res);
      list.appendChild(more);
    }
    q.oninput = draw; draw();
    $("#modal").hidden = false;
  }
  document.addEventListener("click", function (ev) { var t = ev.target && ev.target.closest && ev.target.closest("#ls-materials159"); if (t) { ev.preventDefault(); openDrawer159(); } });

  // ---- Ecranele Atelierului ----
  function fxAutonomy159() {
    var st = fxState159(), ok = 0, okNoHint = 0, att = 0;
    Object.keys(st.ex).forEach(function (id) { var r = st.ex[id]; ok += r.ok || 0; okNoHint += r.okNoHint || 0; att += r.att || 0; });
    return { ok: ok, okNoHint: okNoHint, att: att, rate: ok ? Math.round(okNoHint / ok * 100) : 0 };
  }
  function fxTrackSeg160(root) {
    var track = fxCurrentTrack160(), seg = el("div", "seg fx-track160");
    [["mental", "Modele mentale"], ["tech", "Tehnic"]].forEach(function (t) {
      var b = el("button", "seg-b" + (track === t[0] ? " on" : ""), t[1]); b.setAttribute("data-fx-track", t[0]);
      b.onclick = function () { state.settings.atelierTrack160 = t[0]; save(); renderLearn(); };
      seg.appendChild(b);
    });
    root.appendChild(seg);
    return track;
  }
  function renderAtelierPath159(root) {
    var track = fxTrackSeg160(root);
    var a = fxAutonomy159(), skills = fxSkills160(track);
    var bar = el("div", "fx-bar159");
    [[String(state.streak && state.streak.count || 0), "zile la rând"], [a.ok ? a.rate + "%" : "–", "fără indicii"],
     [String(Math.round(skills.reduce(function (s, k) { return s + fxSkillStatus159(k.id).mastery; }, 0) / Math.max(1, skills.length))), "stăpânire medie"]]
      .forEach(function (x) { var c = el("div", "fx-stat159"); c.appendChild(el("b", null, x[0])); c.appendChild(el("span", "muted", x[1])); bar.appendChild(c); });
    var find = el("button", "btn mini secondary fx-find159", "Caută în materiale"); find.onclick = function () { openDrawer159("cheat"); }; bar.appendChild(find);
    root.appendChild(bar);
    var path = el("div", "fx-path159");
    var LABEL = { "new": "neînceput", progress: "în progres", solid: "solid", rusty: "necesită recapitulare" };
    skills.forEach(function (s, i) {
      var st = fxSkillStatus159(s.id), node = el("section", "fx-node159 " + st.state); node.setAttribute("data-fx-skill", s.id);
      var dot = el("div", "fx-dot159", String(i + 1)); node.appendChild(dot);
      var txt = el("div", "fx-node-txt159");
      txt.appendChild(el("h3", null, s.title));
      txt.appendChild(el("p", "muted", LABEL[st.state] + " · stăpânire " + st.mastery + "/100" + (st.due ? " · " + st.due + " de reparat" : "")));
      var crowns = el("div", "fx-crowns159");
      fxLevels160(s.id).forEach(function (l, k) { var c = el("span", "fx-crown159" + (st.crowns[k] ? " on" : ""), (st.crowns[k] ? "★ " : "☆ ") + l); crowns.appendChild(c); });
      txt.appendChild(crowns);
      var acts = el("div", "dict-refs156");
      var go = el("button", "btn mini primary", st.state === "new" ? "Începe" : "Continuă"); go.setAttribute("data-fx-start", s.id); go.onclick = function () { startSkillSession159(s.id, false); }; acts.appendChild(go);
      if (track === "tech" && st.crowns[0] && st.crowns[1] && st.crowns[2] && !st.crowns[3]) { var nh = el("button", "btn mini secondary", "Fără indicii"); nh.onclick = function () { startSkillSession159(s.id, true); }; acts.appendChild(nh); }
      var ref = el("button", "btn mini ghost", "Materiale"); ref.onclick = function () { state.settings.drawer159 = { tab: "cheat", skill: s.id }; openDrawer159("cheat"); }; acts.appendChild(ref);
      txt.appendChild(acts);
      node.appendChild(txt); path.appendChild(node);
    });
    root.appendChild(path);
    var n = fxRepairQueue159().length;
    if (!n) { root.appendChild(el("p", "muted center", "Nicio lacună de reparat. Exercițiile greșite sau rezolvate cu indiciu apar aici.")); return; }
    var fab = el("button", "btn big primary fx-repair159", "Repară lacunele (" + n + ")");
    fab.id = "repair-fab159"; fab.onclick = startRepair159; root.insertBefore(fab, path);
  }
  var FX_CAT160 = { cheat_sheet: "Regulă", anti_pattern: "Capcană", incident: "Incident", model: "Model mental", pitfall: "Capcană universală", matrix: "Matricea compromisurilor", scenario: "Scenariu de gândire" };
  function renderAtelierLearn159(root) {
    var track = fxTrackSeg160(root);
    if (track === "mental") {
      var pits = atl159().cards.filter(function (c) { return c.category === "pitfall"; });
      var cat = el("details", "unit"); cat.setAttribute("data-fx-pitfalls", "1");
      cat.appendChild(el("summary", null, "Catalogul capcanelor universale · " + pits.length));
      pits.forEach(function (c) { cat.appendChild(el("h4", null, c.title)); var m = el("div", "md"); m.innerHTML = renderMd(c.body); cat.appendChild(m); });
      root.appendChild(cat);
    }
    fxSkills160(track).forEach(function (s) {
      var d = el("details", "unit"); d.setAttribute("data-fx-learn", s.id);
      var sum = el("summary"); sum.appendChild(el("b", null, s.title)); sum.appendChild(el("span", "glossary-brief133", s.summary)); d.appendChild(sum);
      atl159().cards.filter(function (c) { return c.skill === s.id; }).forEach(function (c) {
        d.appendChild(el("h4", null, (FX_CAT160[c.category] || "Fișă") + " · " + c.title));
        var m = el("div", "md"); m.innerHTML = renderMd(c.body); d.appendChild(m);
      });
      var go = el("button", "btn mini primary", "Exersează competența"); go.onclick = function () { startSkillSession159(s.id, false); }; d.appendChild(go);
      root.appendChild(d);
    });
  }
  function renderAutonomy159(root) {
    var a = fxAutonomy159(), st = fxState159(), tags = atl159().tags || {};
    var box = el("section", "unit autonomy159"); box.id = "autonomy159";
    box.appendChild(el("h2", "sec-title", "Claritate & autonomie"));
    var g = el("div", "grid");
    g.appendChild(stat(a.ok ? a.rate + "%" : "–", "rezolvări fără indicii"));
    g.appendChild(stat(String(a.att), "încercări"));
    g.appendChild(stat(String(fxRepairQueue159().length), "de reparat"));
    box.appendChild(g);
    var good = atl159().skills.filter(function (s) { return fxSkillStatus159(s.id).mastery >= 75; }),
        rusty = atl159().skills.filter(function (s) { return fxSkillStatus159(s.id).due > 0; });
    box.appendChild(el("p", null, "Stăpânești bine: " + (good.length ? good.map(function (s) { return s.title; }).join(", ") : "încă niciun model")));
    box.appendChild(el("p", null, "Necesită recapitulare: " + (rusty.length ? rusty.map(function (s) { return s.title; }).join(", ") : "nimic acum")));
    [["mental", "Modele mentale"], ["tech", "Tehnic"]].forEach(function (tr) {
    box.appendChild(el("h3", null, "Acoperire · " + tr[1]));
    fxSkills160(tr[0]).forEach(function (s) {
      var k = fxSkillStatus159(s.id), row = el("div", "fx-cov159");
      row.appendChild(el("span", null, s.title));
      var pb = el("div", "pbar"), pf = el("div", "pbar-f"); pf.style.width = k.mastery + "%"; pb.appendChild(pf); row.appendChild(pb);
      row.appendChild(el("span", "muted", k.mastery >= 75 ? "sigur" : k.mastery >= 25 ? "în lucru" : k.mastery ? "nevoie de exercițiu" : "neînceput"));
      box.appendChild(row);
    });
    });
    var errs = Object.keys(st.errors).sort(function (x, y) { return st.errors[y] - st.errors[x]; });
    box.appendChild(el("h3", null, "Unde tinzi să sari peste cazuri limită"));
    if (!errs.length) box.appendChild(el("p", "muted", "Încă nicio greșeală înregistrată în Atelier."));
    errs.slice(0, 6).forEach(function (t) { box.appendChild(el("p", null, (tags[t] || t) + " · " + st.errors[t] + (st.errors[t] === 1 ? " greșeală" : " greșeli"))); });
    var go = el("button", "btn secondary", "Deschide Atelierul"); go.onclick = function () { learnTab = "workshop"; setTabMode156("workshop", "practice"); show("learn"); };
    box.appendChild(go);
    root.appendChild(box);
  }

  // ---------------------------------------------------------------- Moduri pe taburi''')

rep('''    learnUnits: learnUnits, buildLesson: buildLesson,''',
    '''    learnUnits: learnUnits, buildLesson: buildLesson, fxRepairQueue159: fxRepairQueue159, fxSkillStatus159: fxSkillStatus159, startSkillSession159: startSkillSession159, startRepair159: startRepair159, openDrawer159: openDrawer159, fxRunCheck159: fxRunCheck159, fxRecord159: fxRecord159, fxAutonomy159: fxAutonomy159, fxSkills160: fxSkills160,''')
open(path, "w", encoding="utf-8", newline="").write(src.replace("\n", "\r\n") if crlf else src)

# ---- index.html: scriptul de conținut, butonul Materiale în sesiune, stiluri ----
hp = os.path.join(assets, "index.html")
html = open(hp, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in html else "\n"
if "atelier159.js" not in html:
    t = '<script src="app.js">'
    if html.count(t) != 1: sys.exit("Nu găsesc app.js în index.html.")
    html = html.replace(t, '<script src="atelier159.js"></script>' + nl + t)
    s = '<span id="ls-hearts"></span>'
    if html.count(s) != 1: sys.exit("Nu găsesc bara sesiunii.")
    html = html.replace(s, '<button id="ls-materials159" class="btn mini secondary" type="button">Materiale</button>' + nl + '    ' + s)
    css = nl.join([
        ".fx-head159{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:8px}.fx-type159{color:var(--accent-txt,var(--accent));border-color:currentColor}.fx-skill159{font-size:.82em}",
        ".fx-code159,.fx-table-wrap159{overflow-x:auto;border-radius:12px;background:var(--surface2);padding:6px;margin:10px 0}",
        ".fx-line159{display:flex;gap:10px;width:100%;text-align:left;padding:10px 8px;border:0;border-radius:8px;background:none;color:var(--txt);font:13px/1.5 \"DataEng Mono\",monospace;white-space:pre;min-height:44px;cursor:pointer}",
        ".fx-line159.sel{outline:2px solid var(--accent)}.fx-line159.ok{background:rgba(60,200,140,.18)}.fx-line159.rau{background:rgba(230,90,90,.2)}.fx-ln159{color:var(--muted);min-width:1.5em}",
        ".fx-table159{border-collapse:collapse;font:13px/1.5 \"DataEng Mono\",monospace;white-space:nowrap}.fx-table159 th,.fx-table159 td{padding:6px 10px;border-bottom:1px solid var(--line,#8884);text-align:left}.fx-null159{color:var(--muted);font-style:italic}",
        ".opt.mono{font-family:\"DataEng Mono\",monospace;font-size:.88em}",
        ".fx-seq159{padding-left:1.4em;margin:10px 0;min-height:44px}.fx-seq159 li{margin:6px 0}.fx-avail159{display:grid;gap:8px}",
        ".fx-step159{display:block;width:100%;text-align:left;padding:12px;border-radius:12px;border:1px solid var(--line,#8884);background:var(--surface2);color:var(--txt);min-height:48px;cursor:pointer}",
        ".fx-step159.on{border-color:var(--accent)}.fx-step159.ok{border-color:var(--ok,#3c9)}.fx-step159.rau{border-color:var(--bad,#e66)}",
        ".fx-tpl159{white-space:pre-wrap;font:14px/2 \"DataEng Mono\",monospace;background:var(--surface2);padding:10px;border-radius:12px;overflow-x:auto}",
        ".fx-slot159{font:inherit;padding:2px 8px;border-radius:8px;border:1px dashed var(--accent);background:none;color:var(--accent-txt,var(--accent));min-height:36px;cursor:pointer}",
        ".fx-slot159.on{border-style:solid}.fx-slot159.ok{border-color:var(--ok,#3c9);color:var(--ok,#3c9)}.fx-slot159.rau{border-color:var(--bad,#e66);color:var(--bad,#e66)}",
        ".fx-chips159 .chip{min-height:44px}.fx-impact159>summary{min-height:44px;cursor:pointer;font-weight:700}",
        "#ls-materials159{margin:0 6px;min-height:36px}",
        ".fx-bar159{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0 0 14px}.fx-stat159{display:flex;flex-direction:column;padding:8px 12px;border-radius:12px;background:var(--surface2);min-width:80px}.fx-stat159 b{font-size:1.2em}.fx-find159{margin-left:auto}",
        ".fx-path159{display:grid;gap:12px;padding-bottom:16px}.fx-node159{display:flex;gap:12px;padding:12px;border-radius:16px;border:1px solid var(--line,#8884);background:var(--surface)}",
        ".fx-dot159{flex:0 0 40px;height:40px;border-radius:50%;display:grid;place-items:center;font-weight:800;background:var(--surface2);border:2px solid var(--line,#8884)}",
        ".fx-node159.progress .fx-dot159{border-color:var(--accent)}.fx-node159.solid .fx-dot159{background:var(--ok,#3c9);color:#062;border-color:var(--ok,#3c9)}.fx-node159.rusty .fx-dot159{border-color:#e9b949;color:#e9b949}",
        ".fx-node-txt159{flex:1;min-width:0}.fx-node-txt159 h3{margin:0 0 4px}.fx-crowns159{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}",
        ".fx-crown159{font-size:.78em;padding:2px 8px;border-radius:999px;border:1px solid var(--line,#8884);color:var(--muted)}.fx-crown159.on{color:#e9b949;border-color:#e9b949}",
        ".fx-repair159{width:100%;margin:0 0 14px}",
        ".fx-cov159{display:grid;grid-template-columns:1fr 90px auto;gap:8px;align-items:center;margin:6px 0;font-size:.9em}",
        ".repair159 h2{margin:4px 0}",
        ".calm160 .q{font-size:1.08em;line-height:1.7}.calm160 .opt{line-height:1.5;padding:14px}.calm160 .md{line-height:1.7}",
        ".fx-flow160{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:12px 0;padding:12px;border-radius:14px;background:var(--surface2)}",
        ".fx-box160{padding:8px 10px;border-radius:10px;border:1px solid var(--line,#8884);background:var(--surface);font-size:.86em}",
        ".fx-box160.fail{border-color:var(--bad,#e66);color:var(--bad,#e66);font-weight:700}.fx-arrow160{color:var(--muted)}",
        ".fx-missed160{padding:10px 12px;border-radius:12px;border-left:4px solid #e9b949;background:rgba(233,185,73,.1)}",
        ".fx-dx-title160{margin:14px 0 6px}.fx-track160{margin:0 0 12px}", ""])
    html = html.replace("</head>", "<style>" + nl + css + "</style>" + nl + "</head>", 1)
    open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

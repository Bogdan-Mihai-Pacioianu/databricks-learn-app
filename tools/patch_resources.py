# Biblioteca de resurse externe (linkuri oficiale și gratuite, cu rezumat în română).
# Se aplică după patch_terms, patch_dictionary, patch_modes, patch_tabmodes și patch_setup.
#
#   python tools/patch_resources.py app/assets
import os, sys

assets = sys.argv[1]
path = os.path.join(assets, "app.js")
src = open(path, encoding="utf-8", newline="").read()
crlf = "\r\n" in src
src = src.replace("\r\n", "\n")
if "function openResources156" in src:
    sys.exit("Biblioteca de resurse este deja aplicată.")


def rep(old, new):
    global src
    n = src.count(old)
    if n != 1:
        sys.exit("Înlocuirea nu se potrivește (%d apariții):\n%s" % (n, old[:200]))
    src = src.replace(old, new)


rep('''  // ---------------------------------------------------------------- Moduri pe taburi''', r'''  // ---------------------------------------------------------------- Resurse externe
  // Certificările își iau resursele din domeniile pe care le acoperă.
  var EXAM_RES156 = { dbra: ["azure", "delta"], dbrp: ["azure", "delta", "spark"], sparkcert: ["spark"], dp750: ["dp750", "azure"],
    dp700: ["dp700", "fabric"], dp203: ["dp203", "azure"], awsdea: ["aws"], gcppde: ["gcp"], snowcore: ["snow"], examen: ["interviu"] };
  var RES_TYPES156 = [["", "Toate tipurile"], ["docs", "Documentație oficială"], ["course", "Cursuri și trasee"], ["exam", "Ghiduri de examen și teste"],
    ["book", "Cărți și materiale deschise"], ["lab", "Practică și laboratoare"], ["other", "Altele"]];
  function resData156() { return window.RESOURCES156 || { decks: {} }; }
  function resKind156(r) {
    var t = String(r.ty || "").toLowerCase() + " " + String(r.t || "").toLowerCase();
    if (/exam|guide|ghid|practice|sample|study guide|certif/.test(t)) return "exam";
    if (/lab|sandbox|playground|quickstart|workshop|hands|free tier|trial|interactive|exercis/.test(t)) return "lab";
    if (/book|carte|textbook|paper|pdf|zine|whitepaper|open book/.test(t)) return "book";
    if (/course|curs|path|traseu|learning|tutorial|video|academy|zoomcamp/.test(t)) return "course";
    if (/doc|reference|spec|od\b|referin/.test(t)) return "docs";
    return "other";
  }
  function resStatus156(r) {
    if (typeof r.h === "number") {
      if (r.h >= 200 && r.h < 400) return ["link verificat", "ok"];
      if (r.h === 403 || r.h === 429) return ["site-ul blochează verificarea automată", "unknown"];
      return ["link nefuncțional" + (r.h ? " (" + r.h + ")" : ""), "broken"];
    }
    if (r.v === "problem") return ["serviciu oprit sau mutat", "broken"];
    return ["neverificat încă", "unknown"];
  }
  function resLabel156(key) {
    var d = deckById(key); if (d) return d.name;
    var e = examenById(key); if (e) return (e.cod ? e.cod + " · " : "") + e.scurt;
    return key.toUpperCase();
  }
  function resFor156(keys) {
    var decks = resData156().decks || {}, out = [], seen = {};
    keys.forEach(function (k) {
      (EXAM_RES156[k] || [k]).forEach(function (d) {
        (decks[d] || []).forEach(function (r) { if (seen[r.u]) return; seen[r.u] = true; out.push({ r: r, key: d }); });
      });
    });
    return out;
  }
  function resCount156(keys) { return resFor156(keys).length; }
  /** Butonul care deschide biblioteca, filtrată pe domeniile date (sau toată, fără filtru). */
  function resButton156(host, keys, label) {
    var n = keys ? resCount156(keys) : resCount156(Object.keys(resData156().decks || {}));
    if (!n) return null;
    var b = el("button", "btn secondary res-open156", (label || "Resurse externe") + " · " + n);
    b.setAttribute("data-res-open", (keys || []).join(","));
    b.onclick = function (e) { if (e) e.stopPropagation(); openResources156(keys ? keys[0] : ""); };
    host.appendChild(b); return b;
  }
  function openResources156(startKey) {
    var body = $("#modal-body"); body.innerHTML = "";
    var data = resData156(), keys = Object.keys(data.decks || {});
    var all = resFor156(keys);
    $("#modal-title").textContent = "Bibliotecă de resurse · " + all.length;
    var ok = all.filter(function (x) { return resStatus156(x.r)[1] === "ok"; }).length;
    body.appendChild(el("p", "muted", "Documentație oficială, cursuri gratuite, ghiduri de examen și cărți deschise, alese pe domenii. Se deschid în browser; conținutul aparține autorilor. " +
      (data.checked ? "Linkuri verificate automat la " + data.checked + ": " + ok + " din " + all.length + " funcționează." : "Linkurile nu au fost încă verificate automat.")));
    var raw = state.settings.resources156 || {};
    var controls = el("div", "glossary-controls133"); body.appendChild(controls);
    function choice(id, label, rows, value) {
      var f = el("label", "filter-field"); f.appendChild(el("span", null, label));
      var s = el("select"); s.id = id; s.setAttribute("aria-label", label);
      rows.forEach(function (r) { s.appendChild(new Option(r[1], r[0])); }); s.value = value;
      f.appendChild(s); controls.appendChild(f); return s;
    }
    var examKeys = examene().map(function (e) { return e.id; }).filter(function (id) { return resCount156([id]); });
    var deckKeys = keys.filter(function (k) { return deckById(k); }).sort(function (a, b) { return resLabel156(a).localeCompare(resLabel156(b), "ro"); });
    var area = choice("res-area156", "Domeniu", [["", "Toate domeniile"]].concat(examKeys.map(function (k) { return [k, "Examen · " + resLabel156(k)]; }),
      deckKeys.map(function (k) { return [k, resLabel156(k)]; })), startKey && (examKeys.indexOf(startKey) >= 0 || deckKeys.indexOf(startKey) >= 0) ? startKey : (startKey ? "" : raw.area || ""));
    var kind = choice("res-kind156", "Tip", RES_TYPES156, raw.kind || "");
    var hideBroken = el("label", "switch"); var hb = el("input"); hb.type = "checkbox"; hb.checked = raw.hideBroken !== false;
    hideBroken.appendChild(hb); hideBroken.appendChild(el("span", "sw-name", "Ascunde linkurile nefuncționale")); body.appendChild(hideBroken);
    var q = el("input"); q.type = "search"; q.id = "res-search156"; q.placeholder = "Caută: Kafka, examen, carte gratuită…"; q.setAttribute("aria-label", "Caută în resurse"); body.appendChild(q);
    var count = el("p", "muted"); count.id = "res-count156"; count.setAttribute("aria-live", "polite"); body.appendChild(count);
    var list = el("div"); list.id = "res-list156"; body.appendChild(list);
    function render() {
      state.settings.resources156 = { area: area.value, kind: kind.value, hideBroken: hb.checked }; save();
      var rows = area.value ? resFor156([area.value]) : all;
      var needle = searchKey(q.value.trim());
      rows = rows.filter(function (x) {
        if (kind.value && resKind156(x.r) !== kind.value) return false;
        if (hb.checked && resStatus156(x.r)[1] === "broken") return false;
        if (needle && searchKey([x.r.t, x.r.p, x.r.s, x.r.ty, resLabel156(x.key)].join(" ")).indexOf(needle) < 0) return false;
        return true;
      });
      count.textContent = rows.length + (rows.length === 1 ? " resursă" : " resurse");
      list.innerHTML = "";
      var groups = {}, order = [];
      rows.forEach(function (x) { if (!groups[x.key]) { groups[x.key] = []; order.push(x.key); } groups[x.key].push(x.r); });
      order.forEach(function (k) {
        list.appendChild(el("h3", "res-group156", resLabel156(k)));
        groups[k].forEach(function (r) {
          var st = resStatus156(r), item = el("article", "unit res-item156"); item.setAttribute("data-res-url", r.u);
          var a = el("a", "res-title156", r.t); a.href = r.f || r.u; a.target = "_blank"; a.rel = "noopener noreferrer";
          item.appendChild(a);
          if (r.s) item.appendChild(el("p", null, r.s));
          item.appendChild(el("p", "muted res-meta156", [r.p, r.ty, r.lv, r.lg, r.c].filter(Boolean).join(" · ")));
          if (r.n) item.appendChild(el("p", "muted", "Atenție: " + r.n + "."));
          item.appendChild(el("span", "dict-chip156 res-" + st[1], st[0]));
          list.appendChild(item);
        });
      });
      if (!rows.length) list.appendChild(el("p", "muted", "Nicio resursă pentru filtrele alese."));
    }
    [area, kind, hb].forEach(function (x) { x.onchange = render; }); q.oninput = render;
    render();
    $("#modal").hidden = false;
  }

  // ---------------------------------------------------------------- Moduri pe taburi''')

# Intrările: Concepte (Învață), Termeni (Învață), SQL/Python (Învață), Certificări (Învață, pe fiecare examen).
rep('''    if (learnTab === "concepts") { if (practice156) renderTabPractice156(root, "concepts"); else renderCurriculum(root); return; }''',
    '''    if (learnTab === "concepts") { if (practice156) renderTabPractice156(root, "concepts"); else { resButton156(root, null, "Bibliotecă de resurse externe"); renderCurriculum(root); } return; }''')
rep('''else { renderCertPath(root); root.querySelectorAll("[data-cert-test141]").forEach(function (b) { b.remove(); }); } return; }''',
    '''else { renderCertPath(root); root.querySelectorAll("[data-cert-test141]").forEach(function (b) { b.remove(); });
      root.querySelectorAll("[data-exam]").forEach(function (row) { var id = row.getAttribute("data-exam"), actions = row.querySelector(".cert-actions141") || row; resButton156(actions, [id], "Resurse oficiale"); }); } return; }''')
rep('''    root.appendChild(el("h2", "sec-title", "Termenii domeniului"));''',
    '''    resButton156(root, deckIds, "Resurse externe pentru domeniu");
    root.appendChild(el("h2", "sec-title", "Termenii domeniului"));''')
rep('''    dict156.onclick = function () { openDictionary156(); }; root.appendChild(dict156);''',
    '''    dict156.onclick = function () { openDictionary156(); }; root.appendChild(dict156);
    var res156 = resButton156(root, null, "Bibliotecă de resurse externe"); if (res156) res156.style.cssText = "width:100%;margin:-6px 0 16px";''')
# În configurare: câte resurse externe are fiecare domeniu.
rep('''          if (st.courses.length) detail.appendChild(el("p", "muted", "Curs: " + st.courses.join(", ")));''',
    '''          if (st.courses.length) detail.appendChild(el("p", "muted", "Curs: " + st.courses.join(", ")));
          var nr = resCount156([d.id]); if (nr) detail.appendChild(el("p", "muted", nr + " resurse externe în biblioteca aplicației"));''')
rep('''    learnUnits: learnUnits, buildLesson: buildLesson,''',
    '''    learnUnits: learnUnits, buildLesson: buildLesson, openResources156: openResources156, resFor156: resFor156, resKind156: resKind156,''')
open(path, "w", encoding="utf-8", newline="").write(src.replace("\n", "\r\n") if crlf else src)

hp = os.path.join(assets, "index.html")
html = open(hp, encoding="utf-8", newline="").read()
nl = "\r\n" if "\r\n" in html else "\n"
if "resources156.js" not in html:
    if html.count('<script src="dictionary156.js"></script>') != 1:
        sys.exit("Aplică întâi tools/patch_dictionary.py.")
    html = html.replace('<script src="dictionary156.js"></script>', '<script src="dictionary156.js"></script>' + nl + '<script src="resources156.js"></script>')
    css = nl.join([".res-group156{margin:18px 0 6px}", ".res-item156{display:block}", ".res-title156{font-weight:800;color:var(--accent-txt,var(--accent));text-decoration:underline;word-break:break-word}",
                   ".res-meta156{font-size:.82em;margin:4px 0}", ".dict-chip156.res-ok{color:var(--ok,#3c9);border-color:currentColor}", ".dict-chip156.res-broken{color:var(--bad,#e66);border-color:currentColor}",
                   ".res-open156{margin:6px 0}", ""])
    html = html.replace("</head>", "<style>" + nl + css + "</style>" + nl + "</head>", 1)
    open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

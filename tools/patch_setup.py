# Configurare, pasul 1 („Ce vrei să înveți?”):
#  - contor „N din M domenii bifate” care se actualizează la fiecare bifă;
#  - butoane: bifează toate, doar domeniile principale, doar modulele de certificare, debifează;
#  - domeniile grupate: principale și module de certificare;
#  - în dreapta fiecărui domeniu: totalul materialelor și o săgeată care arată tot ce conține.
#
#   python tools/patch_setup.py app/assets
import os, sys

assets = sys.argv[1]
path = os.path.join(assets, "app.js")
src = open(path, encoding="utf-8", newline="").read()
crlf = "\r\n" in src
src = src.replace("\r\n", "\n")
if "function setupDeckStats156" in src:
    sys.exit("Configurarea este deja modificată.")

old = '''      var box = el("div", "srow");
      allDecks().forEach(function (d) {
        var n = allCards().filter(function (c) { return c.deck === d.id; }).length;
        if (!n) return;
        var row = el("label", "switch");
        var cb = el("input"); cb.type = "checkbox";
        cb.checked = setupTmp.decks[d.id] !== false;
        cb.onchange = function () { setupTmp.decks[d.id] = cb.checked; };
        row.appendChild(cb);
        var nume = el("span", "sw-name");
        nume.appendChild(ico(icoDeck(d.id), "sw-ico"));
        nume.appendChild(el("span", null, d.name));
        row.appendChild(nume);
        row.appendChild(el("span", "muted", String(n)));
        box.appendChild(row);
      });
      body.appendChild(box);
      return;'''
new = '''      var stats = setupDeckStats156();
      var decks = allDecks().filter(function (d) { return stats[d.id] && stats[d.id].total; });
      var counter = el("div", "su-counter156"); counter.id = "su-counter156"; counter.setAttribute("aria-live", "polite");
      body.appendChild(counter);
      var quick = el("div", "su-quick156");
      [["all", "Bifează toate"], ["main", "Doar principale"], ["cert", "Doar certificări"], ["none", "Debifează tot"]].forEach(function (q) {
        var b = el("button", "btn mini secondary", q[1]); b.setAttribute("data-su-quick", q[0]);
        b.onclick = function () {
          decks.forEach(function (d) { var cert = isCertDeck156(d.id); setupTmp.decks[d.id] = q[0] === "all" || (q[0] === "main" && !cert) || (q[0] === "cert" && cert); });
          renderSetup();
        };
        quick.appendChild(b);
      });
      body.appendChild(quick);
      var boxes = [];
      function refresh() {
        var on = decks.filter(function (d) { return setupTmp.decks[d.id] !== false; });
        var mat = on.reduce(function (s, d) { return s + stats[d.id].total; }, 0);
        counter.textContent = on.length + " din " + decks.length + " domenii bifate · " + mat + " materiale în sesiuni";
        counter.classList.toggle("warn", !on.length);
        boxes.forEach(function (g) {
          var n = g.decks.filter(function (d) { return setupTmp.decks[d.id] !== false; }).length;
          g.count.textContent = n + "/" + g.decks.length;
        });
      }
      [["Domenii principale", decks.filter(function (d) { return !isCertDeck156(d.id); })],
       ["Module de certificare", decks.filter(function (d) { return isCertDeck156(d.id); })]].forEach(function (group) {
        if (!group[1].length) return;
        var head = el("div", "su-group156"); head.appendChild(el("b", null, group[0]));
        var gc = el("span", "muted"); head.appendChild(gc);
        body.appendChild(head);
        var box = el("div", "srow");
        boxes.push({ decks: group[1], count: gc });
        group[1].forEach(function (d) {
          var st = stats[d.id];
          var wrap = el("div", "su-deck156"); wrap.setAttribute("data-su-deck", d.id);
          var row = el("label", "switch");
          var cb = el("input"); cb.type = "checkbox";
          cb.checked = setupTmp.decks[d.id] !== false;
          cb.onchange = function () { setupTmp.decks[d.id] = cb.checked; refresh(); };
          row.appendChild(cb);
          var nume = el("span", "sw-name");
          nume.appendChild(ico(icoDeck(d.id), "sw-ico"));
          nume.appendChild(el("span", null, d.name));
          row.appendChild(nume);
          row.appendChild(el("span", "muted su-total156", String(st.total)));
          wrap.appendChild(row);
          // Săgeata din dreapta: tot ce conține domeniul.
          var more = el("button", "su-more156", "›");
          more.setAttribute("aria-label", "Ce conține " + d.name); more.setAttribute("aria-expanded", "false");
          var detail = el("div", "su-detail156"); detail.hidden = true;
          if (d.desc) detail.appendChild(el("p", null, d.desc));
          var list = el("div", "su-chips156");
          [["cards", "carduri"], ["terms", "termeni"], ["questions", "întrebări"], ["scen", "scenarii"], ["lessons", "lecții de curs"], ["sql", "exerciții SQL"], ["py", "laboratoare Python"]].forEach(function (k) {
            if (st[k[0]]) list.appendChild(el("span", "su-chip156", st[k[0]] + " " + k[1]));
          });
          detail.appendChild(list);
          if (st.courses.length) detail.appendChild(el("p", "muted", "Curs: " + st.courses.join(", ")));
          more.onclick = function (e) {
            e.preventDefault();
            detail.hidden = !detail.hidden;
            more.setAttribute("aria-expanded", String(!detail.hidden));
            more.classList.toggle("open", !detail.hidden);
          };
          wrap.appendChild(more);
          wrap.appendChild(detail);
          box.appendChild(wrap);
        });
        body.appendChild(box);
      });
      refresh();
      return;'''
if src.count(old) != 1:
    sys.exit("Pasul 1 al configurării nu se potrivește.")
src = src.replace(old, new)

anchor = '''  function setupNext() {'''
helpers = '''  /** Modulele de certificare sunt deck-urile cu sufix -mN (ex. dp750-m1). */
  function isCertDeck156(id) { return /-m\\d+$/.test(id) || !!examenById(id); }
  /** Ce conține fiecare domeniu: carduri, termeni, întrebări, scenarii, lecții, laboratoare. */
  function setupDeckStats156() {
    var out = {};
    function bump(deck, key) { if (!deck) return; var s = out[deck] || (out[deck] = { cards: 0, terms: 0, questions: 0, scen: 0, lessons: 0, sql: 0, py: 0, total: 0, courses: [] }); s[key]++; s.total++; }
    allCards().forEach(function (c) { bump(c.deck, "cards"); });
    allTerms().forEach(function (t) { bump(t.deck, "terms"); });
    (SEED.questions || []).forEach(function (q) { bump(q.deck, "questions"); });
    scenAll().forEach(function (s) { bump(s.deck, "scen"); });
    (((SEED.courses145 || {}).courses) || []).forEach(function (c) {
      var n = (c.levels || []).reduce(function (s, l) { return s + (l.unitIds || []).length; }, 0);
      (c.deckIds || []).forEach(function (d) {
        bump(d, "lessons"); out[d].lessons += n - 1; out[d].total += n - 1;
        out[d].courses.push(c.name);
      });
    });
    ((labData() || {}).exercises || []).forEach(function () { bump("sql", "sql"); });
    pyAll().forEach(function () { bump("python", "py"); });
    return out;
  }

'''
if src.count(anchor) != 1:
    sys.exit("Nu găsesc setupNext.")
src = src.replace(anchor, helpers + anchor)
src = src.replace('''    learnUnits: learnUnits, buildLesson: buildLesson,''',
                  '''    learnUnits: learnUnits, buildLesson: buildLesson, setupDeckStats156: setupDeckStats156,''', 1)
open(path, "w", encoding="utf-8", newline="").write(src.replace("\n", "\r\n") if crlf else src)

hp = os.path.join(assets, "index.html")
html = open(hp, encoding="utf-8", newline="").read()
if ".su-deck156" not in html:
    nl = "\r\n" if "\r\n" in html else "\n"
    css = nl.join([
        ".su-counter156{position:sticky;top:0;z-index:2;background:var(--bg);padding:10px 0;font-weight:700;color:var(--accent-txt,var(--accent))}",
        ".su-counter156.warn{color:var(--bad,#e66)}",
        ".su-quick156{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 12px}",
        ".su-group156{display:flex;justify-content:space-between;align-items:baseline;margin:14px 2px 6px}",
        ".su-deck156{display:grid;grid-template-columns:1fr auto;align-items:center;border-bottom:1px solid var(--line,#8883)}",
        ".su-deck156 .switch{border:0}",
        ".su-more156{min-width:44px;min-height:44px;font:700 1.7em/1 system-ui,sans-serif;color:var(--muted);background:none;border:0;cursor:pointer;transition:transform .15s}",
        ".su-more156.open{transform:rotate(90deg);color:var(--txt)}",
        ".su-detail156{grid-column:1/-1;padding:0 12px 12px 46px;font-size:.9em}",
        ".su-chips156{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}",
        ".su-chip156{padding:3px 10px;border-radius:999px;background:var(--surface2);border:1px solid var(--line,#8884)}",
        ""])
    html = html.replace("</head>", "<style>" + nl + css + "</style>" + nl + "</head>", 1)
    open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

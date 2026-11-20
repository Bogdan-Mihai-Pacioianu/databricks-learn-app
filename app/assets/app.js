/* DataEng Cards - logica aplicatiei */
(function () {
  "use strict";

  // ---------------------------------------------------------------- constante
  var MIN = 60 * 1000, DAY = 24 * 60 * MIN;
  var LEARN_STEPS = [1 * MIN, 10 * MIN];
  var RELEARN_STEP = 10 * MIN;
  var GRAD_IVL = 1 * DAY, EASY_IVL = 4 * DAY;
  var MIN_EASE = 1.3, DEF_EASE = 2.5, MAX_IVL = 365 * DAY;
  var AGAIN = 1, HARD = 2, GOOD = 3, EASY = 4;
  var CUSTOM_DECK = { id: "custom", name: "Cardurile mele", icon: "creion",
                      desc: "Carduri adăugate de tine" };
  var STORE_KEY = "decards.state";
  var APP_VERSION = window.SEED.contentRevision || "1.31.0";

  /* ---------------------------------------------------------------- pictograme
   * Un singur set, desenat pe aceeași grilă de 24, cu linii de 1.75 și
   * `currentColor`. Emoji-urile arătau altfel pe fiecare telefon și dădeau
   * aplicației un aer de machetă; astea moștenesc culoarea și mărimea textului.
   */
  var ICOANE = {
    viteza: '<path d="M4.3 17.6a8.6 8.6 0 1 1 15.4 0"/>' +
            '<path d="M12 13.6 15.8 9.4"/>' +
            '<circle cx="12" cy="14.2" r="1.3" fill="currentColor" stroke="none"/>',
    lacat: '<rect x="4.6" y="10.4" width="14.8" height="10" rx="2.4"/>' +
           '<path d="M8.2 10.4V7.6a3.8 3.8 0 0 1 7.6 0v2.8"/>' +
           '<path d="M12 14.4v2.4"/>',
    moneda: '<rect x="2.4" y="6.4" width="19.2" height="11.2" rx="2"/>' +
            '<circle cx="12" cy="12" r="2.8"/>' +
            '<path d="M6 10.2v3.6"/><path d="M18 10.2v3.6"/>',
    puls: '<path d="M2.6 12.4h4.2l2-5.2 3.4 10 2.4-6.6 1.6 1.8h5.2"/>',
    grafic: '<rect x="3.4" y="3.6" width="17.2" height="16.8" rx="2.4"/>' +
            '<path d="M7.8 16.6v-3.4"/><path d="M12 16.6V7.8"/><path d="M16.2 16.6v-5.8"/>',
    caramida: '<rect x="3" y="4.2" width="18" height="5.4" rx="1.2"/>' +
              '<rect x="3" y="9.6" width="18" height="5.4" rx="1.2"/>' +
              '<rect x="3" y="15" width="18" height="5.4" rx="1.2"/>' +
              '<path d="M9 4.2v5.4"/><path d="M15 9.6V15"/>',
    ramificare: '<circle cx="12" cy="4.8" r="2.1"/><circle cx="6" cy="19.2" r="2.1"/>' +
                '<circle cx="18" cy="19.2" r="2.1"/>' +
                '<path d="M10.7 6.6 7.3 17.4"/><path d="M13.3 6.6l3.4 10.8"/>',
    priza: '<path d="M8.4 3.4v5.2"/><path d="M15.6 3.4v5.2"/>' +
           '<path d="M5.6 8.6h12.8v3.2a6.4 6.4 0 0 1-12.8 0Z"/>' +
           '<path d="M12 18.2v2.4"/>',
    tinta: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/>' +
           '<circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/>',
    invata: '<path d="M2.5 8.6 12 4.2l9.5 4.4L12 13 2.5 8.6Z"/>' +
            '<path d="M6.6 10.7V16c0 1.5 2.4 2.7 5.4 2.7s5.4-1.2 5.4-2.7v-5.3"/>',
    carduri: '<rect x="3.2" y="6.8" width="13.2" height="13.2" rx="2.6"/>' +
             '<path d="M7.6 6.8V5.2A1.7 1.7 0 0 1 9.3 3.5h9.1a2.4 2.4 0 0 1 2.4 2.4v9.3"/>',
    statistici: '<path d="M3.5 20.3h17"/><path d="M6.5 20.3v-6.6"/>' +
                '<path d="M12 20.3V4.6"/><path d="M17.5 20.3v-9.6"/>',
    setari: '<path d="M3.5 7.5h8.2"/><path d="M16.8 7.5h3.7"/><circle cx="14.2" cy="7.5" r="2.5"/>' +
            '<path d="M3.5 16.5h3.7"/><path d="M12.3 16.5h8.2"/><circle cx="9.8" cy="16.5" r="2.5"/>',

    fulger: '<path d="M13.2 2.8 5.4 13.9h5.3L10.8 21.2 18.6 10H13l.2-7.2Z"/>',
    straturi: '<path d="m12 3 8.6 4.4L12 11.8 3.4 7.4 12 3Z"/>' +
              '<path d="m3.4 12 8.6 4.4 8.6-4.4"/><path d="m3.4 16.6 8.6 4.4 8.6-4.4"/>',
    nor: '<path d="M7.2 18.5a4.2 4.2 0 0 1-.4-8.38 5.7 5.7 0 0 1 11-1.3 4 4 0 0 1-.4 9.68H7.2Z"/>',
    baza: '<ellipse cx="12" cy="6" rx="7.4" ry="2.9"/>' +
          '<path d="M4.6 6v12c0 1.6 3.3 2.9 7.4 2.9s7.4-1.3 7.4-2.9V6"/>' +
          '<path d="M19.4 12c0 1.6-3.3 2.9-7.4 2.9S4.6 13.6 4.6 12"/>',
    schema: '<rect x="2.8" y="3.4" width="7.4" height="5" rx="1.6"/>' +
            '<rect x="13.8" y="3.4" width="7.4" height="5" rx="1.6"/>' +
            '<rect x="8.3" y="15.6" width="7.4" height="5" rx="1.6"/>' +
            '<path d="M6.5 8.4v3.6h11V8.4"/><path d="M12 12v3.6"/>',
    val: '<path d="M3 8.2c2.6-2.4 5.4-2.4 8 0s5.4 2.4 8 0"/>' +
         '<path d="M3 13c2.6-2.4 5.4-2.4 8 0s5.4 2.4 8 0"/>' +
         '<path d="M3 17.8c2.6-2.4 5.4-2.4 8 0s5.4 2.4 8 0"/>',
    cod: '<path d="m8.6 7.8-4.8 4.4 4.8 4.4"/><path d="m15.4 7.8 4.8 4.4-4.8 4.4"/>' +
         '<path d="m13.6 4.6-3.2 15"/>',
    scut: '<path d="M12 3.3 5 5.9v5.4c0 4.3 2.9 7.8 7 9.4 4.1-1.6 7-5.1 7-9.4V5.9L12 3.3Z"/>' +
          '<path d="m9 11.8 2.2 2.2 4-4.2"/>',
    // containere stivuite: grila simplă se confunda cu pictograma Fabric
    container: '<rect x="2.8" y="12.6" width="18.4" height="7.4" rx="1.6"/>' +
               '<rect x="6.2" y="5.6" width="6.4" height="7" rx="1.4"/>' +
               '<rect x="13.6" y="8.6" width="5.6" height="4" rx="1.4"/>',
    flux: '<path d="M3.8 7.4h11.4"/><path d="m12 4.2 3.2 3.2L12 10.6"/>' +
          '<path d="M20.2 16.6H8.8"/><path d="m12 13.4-3.2 3.2L12 19.8"/>',
    graf: '<circle cx="5.2" cy="5.6" r="2.4"/><circle cx="18.8" cy="5.6" r="2.4"/>' +
          '<circle cx="12" cy="18.4" r="2.4"/>' +
          '<path d="m6.8 7.5 3.8 8.6"/><path d="m17.2 7.5-3.8 8.6"/>',
    panza: '<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="3"/>' +
           '<path d="M3.4 9.2h17.2"/><path d="M3.4 14.8h17.2"/>' +
           '<path d="M9.2 3.4v17.2"/><path d="M14.8 3.4v17.2"/>',
    microfon: '<rect x="9" y="2.8" width="6" height="10.4" rx="3"/>' +
              '<path d="M5.4 11.4a6.6 6.6 0 0 0 13.2 0"/><path d="M12 18v3.2"/>',
    insigna: '<circle cx="12" cy="8.8" r="5.4"/>' +
             '<path d="m8.6 13.2-1.2 8 4.6-2.4 4.6 2.4-1.2-8"/>',
    cheie: '<path d="M14.8 3.4a5.2 5.2 0 0 0-4.6 7.3l-6.5 6.5a2 2 0 0 0 2.8 2.8l6.5-6.5a5.2 5.2 0 0 0 6.4-6.7l-3 3-2.7-.7-.7-2.7 3-3a5.2 5.2 0 0 0-1.2-.1Z"/>',
    cub: '<path d="m12 3 8.2 4.6v8.8L12 21l-8.2-4.6V7.6L12 3Z"/>' +
         '<path d="M12 12 3.8 7.6"/><path d="M12 12v9"/><path d="m12 12 8.2-4.4"/>',
    scanteie: '<path d="M11 3.2 12.6 8l4.8 1.6-4.8 1.6L11 16l-1.6-4.8L4.6 9.6 9.4 8 11 3.2Z"/>' +
              '<path d="M18 14.6l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z"/>',
    avertizare: '<path d="M12 4 2.9 19.6h18.2L12 4Z"/><path d="M12 10v4.2"/>' +
                '<circle cx="12" cy="17.2" r="1" fill="currentColor" stroke="none"/>',
    creion: '<path d="M4 20h4.2L20 8.2a2.2 2.2 0 0 0-3.1-3.1L5 16.9V20Z"/><path d="m14.8 6.3 3 3"/>',
    carte: '<path d="M4.6 3.8h8.6a3.2 3.2 0 0 1 3.2 3.2v13.2H7.8a3.2 3.2 0 0 1-3.2-3.2V3.8Z"/>' +
           '<path d="M7.8 20.2a3.2 3.2 0 0 1 0-6.4h8.6"/>',

    eprubeta: '<path d="M9.4 3v6.3L4.7 17.9A2.1 2.1 0 0 0 6.5 21h11a2.1 2.1 0 0 0 1.8-3.1L14.6 9.3V3"/>' +
              '<path d="M8.2 3h7.6"/><path d="M7.1 14.4h9.8"/>',
    terminal: '<rect x="3" y="4.4" width="18" height="15.2" rx="2.6"/>' +
              '<path d="m7.6 10.2 2.6 2.4-2.6 2.4"/><path d="M12.6 15h4.2"/>',
    balon: '<path d="M20.8 11.4a7.6 7.6 0 0 1-11 6.8L4 20l1.8-5.2a7.6 7.6 0 1 1 15-3.4Z"/>',
    inima: '<path d="M12 20.3S4.2 15.4 4.2 10.3A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 7.8 2.9c0 5.1-7.8 10-7.8 10Z"/>',
    inima_frantă: '<path d="M12 20.3S4.2 15.4 4.2 10.3A4.5 4.5 0 0 1 12 7.4a4.5 4.5 0 0 1 7.8 2.9c0 5.1-7.8 10-7.8 10Z"/>' +
                  '<path d="m12 7.4-2 3.5 3.2 1.7-2 4.2"/>',
    copiaza: '<rect x="8.6" y="8.6" width="11.4" height="11.4" rx="2.4"/>' +
             '<path d="M15.4 8.6V6.2A2.2 2.2 0 0 0 13.2 4H6.2A2.2 2.2 0 0 0 4 6.2v7a2.2 2.2 0 0 0 2.2 2.2h2.4"/>',
    bifa: '<path d="m5 12.6 4.6 4.6L19 6.8"/>',
    inchide: '<path d="M6 6 18 18"/><path d="M18 6 6 18"/>',
    joaca: '<path d="M8.4 5.3v13.4L18.8 12 8.4 5.3Z"/>',
    cerc: '<circle cx="12" cy="12" r="7.6"/>',
    cerc_partial: '<circle cx="12" cy="12" r="7.6"/>' +
                  '<path d="M12 4.4a7.6 7.6 0 0 1 0 15.2Z" fill="currentColor" stroke="none"/>',
    trofeu: '<path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0V4Z"/>' +
            '<path d="M7.5 5.5H4.8v1.8a3.2 3.2 0 0 0 3.2 3.2"/>' +
            '<path d="M16.5 5.5h2.7v1.8a3.2 3.2 0 0 1-3.2 3.2"/>' +
            '<path d="M12 13.5V17"/><path d="M8.5 20.5h7"/><path d="M9.8 17h4.4l.6 3.5H9.2l.6-3.5Z"/>'
  };

  /** Pictograma ca element, moștenind culoarea și mărimea textului din jur. */
  function ico(nume, clasa) {
    var sp = document.createElement("span");
    sp.className = "ico" + (clasa ? " " + clasa : "");
    sp.setAttribute("aria-hidden", "true");
    sp.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">' +
      (ICOANE[nume] || ICOANE.carte) + "</svg>";
    return sp;
  }

  var ICO_DECK = {
    spark: "fulger", delta: "straturi", azure: "nor", sql: "baza", model: "schema",
    stream: "val", python: "cod", quality: "scut", docker: "container", kafka: "flux",
    orchestrare: "graf", fabric: "panza", interviu: "microfon", cert: "insigna",
    dbt: "cheie", iceberg: "cub", ai: "scanteie", capcane: "avertizare",
    perf: "viteza", secur: "lacat", finante: "moneda", obs: "puls",
    bi: "grafic", iac: "caramida", algo: "ramificare", api: "priza",
    dp750: "nor", dp700: "panza", dbra: "insigna", dbrp: "trofeu",
    sparkcert: "fulger", examen: "tinta",
    custom: "creion"
  };
  // Un modul de programă („dp750-m2”) împrumută icoana examenului din care face parte.
  function icoDeck(id) {
    if (ICO_DECK[id]) return ICO_DECK[id];
    var tai = String(id || "").indexOf("-m");
    if (tai > 0 && ICO_DECK[id.slice(0, tai)]) return ICO_DECK[id.slice(0, tai)];
    return "carte";
  }

  // ------------------------------------------------- cardul structurat
  // Oglindă exactă a content/structura.py. Textul pașilor 1-2 nu se stochează
  // în seed, se reface aici din răspuns, ca să existe o singură copie a lui.
  // tools/check_structura.mjs verifică pe toate cardurile că cele două coincid.
  var PAS_EXEMPLU = "Exemplu", PAS_DETALIU = "În detaliu", PAS_PRACTICA = "În practică";
  var NIVEL = { i: "introductiv", a: "intermediar", v: "avansat" };

  function blocuri(text) {
    var out = [], buf = [], cod = [], inCod = false;
    function inchideProza() {
      if (buf.length) { out.push(buf.join("\n").trim()); buf = []; }
    }
    String(text).split("\n").forEach(function (linie) {
      if (linie.indexOf("```") === 0) {
        if (inCod) {
          cod.push(linie); out.push(cod.join("\n").trim()); cod = []; inCod = false;
        } else {
          inchideProza(); cod.push(linie); inCod = true;
        }
        return;
      }
      if (inCod) { cod.push(linie); return; }
      if (!linie.trim()) { inchideProza(); return; }
      buf.push(linie);
    });
    if (inCod && cod.length) out.push(cod.join("\n").trim());
    inchideProza();
    return out.filter(function (b) { return b; });
  }

  function bCod(b) { return b.indexOf("```") === 0; }
  function bLista(b) { return /^[ \t]*([-*]|\d+[.)])\s/.test(b); }
  function bTabel(b) { return b.replace(/^\s+/, "").indexOf("|") === 0; }
  function bIntroCod(b) {
    return b.length <= 120 && /:$/.test(b.replace(/\s+$/, "")) && b.indexOf("\n") < 0;
  }

  function imparteCard(c) {
    var authored=c.aut || {};
    if(c.course145 && !c.reviewRevision145){var detail145=String(authored.d || "").trim(),practice145=authored.x || [];if(detail145.split(/\s+/).length<15 || practice145[1]===c.a || /^Ce verifici înainte să aplici recomandarea/.test(practice145[0] || ""))return null;}
    // Explicit authored steps are a complete presentation contract. Paragraph
    // inference is only a fallback for historical unstructured answers.
    if(authored.i && authored.d && authored.x && authored.x.length===2){
      return {nivel:NIVEL[authored.n] || "intermediar",rezumat:authored.r || null,idee:authored.i,slaba:false,
        doi:{eticheta:authored.t==="cod"?PAS_EXEMPLU:PAS_DETALIU,text:authored.d},cheie:null,greseala:authored.g || null,
        tip:authored.t || null,modul:authored.m || null,exersare:{intrebare:authored.x[0],model:authored.x[1]},
        surse:(authored.s || []).map(function(x){return {nume:x[0],url:x[1]};})};
    }
    var bl = blocuri(c.a);
    if (bl.length < 2) return null;
    var cod = [], enumerari = [], proza = [], i = 0;
    while (i < bl.length) {
      var b = bl[i];
      if (bCod(b)) cod.push(b);
      else if (bLista(b) || bTabel(b)) enumerari.push(b);
      else if (bIntroCod(b) && i + 1 < bl.length && bCod(bl[i + 1])) {
        cod.push(b + "\n\n" + bl[i + 1]); i += 2; continue;
      } else proza.push(b);
      i++;
    }
    if (!proza.length) return null;

    var intro = null;
    if (/:$/.test(proza[0].replace(/\s+$/, "")) && proza[0].length <= 120) intro = proza.shift();
    if (!proza.length) return null;

    var idee = proza[0], rest = proza.slice(1);
    var incheiata = /[.!?]$/.test(idee.replace(/\s+$/, ""));
    if (idee.length < (incheiata ? 20 : 40)) return null;

    var cheie = null;
    if (rest.length >= 2 && rest[rest.length - 1].length <= 260) cheie = rest.pop();

    var eticheta, corp;
    if (cod.length) { eticheta = PAS_EXEMPLU; corp = cod.concat(enumerari, rest); }
    else if (enumerari.length) { eticheta = PAS_DETALIU; corp = enumerari.concat(rest); }
    else { eticheta = PAS_PRACTICA; corp = rest.slice(); }
    if (intro) corp = [intro].concat(corp);

    if (!corp.length) {
      if (cheie) { corp = [cheie]; cheie = null; eticheta = PAS_PRACTICA; }
      else return null;
    }
    var doi = corp.join("\n\n");
    if (doi.length < 40) return null;

    var aut = c.aut || {};
    // Cardurile de programă au pașii autorați integral; pentru restul, derivați.
    var dAut = aut.d
      ? { eticheta: aut.t === "cod" ? PAS_EXEMPLU : PAS_DETALIU, text: aut.d }
      : { eticheta: eticheta, text: doi };
    return {
      nivel: NIVEL[aut.n] || "intermediar",
      rezumat: aut.r || null,
      idee: aut.i || idee,
      slaba: !aut.i && !!aut.w,
      doi: dAut,
      cheie: aut.d ? null : cheie,
      greseala: aut.g || null,
      tip: aut.t || null,
      modul: aut.m || null,
      exersare: aut.x ? { intrebare: aut.x[0], model: aut.x[1] } :
        { intrebare: c.q, model: c.a, mode: "recall" },
      surse: (aut.s || []).map(function (x) { return { nume: x[0], url: x[1] }; })
    };
  }

  // ---------------------------------------------------------------- bridge
  var Bridge = window.Android || null;
  function rawLoad() {
    try {
      if (Bridge && Bridge.load) return Bridge.load();
      return window.localStorage.getItem(STORE_KEY);
    } catch (e) { return null; }
  }
  function rawSave(s) {
    try {
      if (Bridge && Bridge.save) { return Bridge.save(s)!==false; }
      window.localStorage.setItem(STORE_KEY, s);
      return true;
    } catch (e) { return false; }
  }
  function toast(msg) {
    if (Bridge && Bridge.toast) { try { Bridge.toast(msg); return; } catch (e) {} }
    var t = document.getElementById("toast");
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._tm); t._tm = setTimeout(function () { t.classList.remove("show"); }, 2200);
  }

  // ---------------------------------------------------------------- utilitare
  function $(sel) { return document.querySelector(sel); }
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined && txt !== null) e.textContent = txt;
    return e;
  }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function dayKey(ts) {
    var d = ts === undefined ? new Date() : new Date(ts);
    return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
  }
  function dayDiff(a, b) {
    var pa = a.split("-").map(Number), pb = b.split("-").map(Number);
    var da = new Date(pa[0], pa[1] - 1, pa[2]), db = new Date(pb[0], pb[1] - 1, pb[2]);
    return Math.round((da - db) / DAY);
  }
  function fmtIvl(ms) {
    if (ms < MIN) return "<1 min";
    if (ms < 60 * MIN) return Math.round(ms / MIN) + " min";
    if (ms < DAY) return Math.round(ms / (60 * MIN)) + " h";
    var d = ms / DAY;
    if (d < 30) return (d < 10 ? Math.round(d * 10) / 10 : Math.round(d)) + " z";
    if (d < 365) return Math.round(d / 30.4 * 10) / 10 + " luni";
    return Math.round(d / 365 * 10) / 10 + " ani";
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // ---------------------------------------------------------------- markdown
  function mdInline(s) {
    s = escapeHtml(s);
    // Codul iese din joc înainte de formatare: altfel un asterisc dintr-un
    // `*(1)` se împerechează cu altul din codul următor și sparge ambele.
    var cod = [];
    s = s.replace(/`([^`]+)`/g, function (m, c) {
      return "\u0001" + (cod.push(c) - 1) + "\u0001";
    });
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    s = s.replace(/\u0001(\d+)\u0001/g, function (m, i) {
      return "<code>" + cod[+i] + "</code>";
    });
    return s;
  }
  function tableCells132(line){
    var cells=[],value="",code=0,text=String(line).trim();
    for(var j=0;j<text.length;j++){var ch=text[j];if(ch==="\\" && text[j+1]==="|"){value+="|";j++;continue;}if(ch==="`"){var n=1;while(text[j+n]==="`")n++;if(!code)code=n;else if(code===n)code=0;value+=text.slice(j,j+n);j+=n-1;continue;}if(ch==="|" && !code){cells.push(value.trim());value="";}else value+=ch;}
    cells.push(value.trim());if(text[0]==="|")cells.shift();if(text[text.length-1]==="|" && cells[cells.length-1]==="")cells.pop();return cells;
  }
  function tableAt132(lines,index){if(index+1>=lines.length || lines[index].indexOf("|")<0)return null;var header=tableCells132(lines[index]),divider=tableCells132(lines[index+1]);return header.length>=2 && header.length===divider.length && divider.every(function(x){return /^:?-{3,}:?$/.test(x);})?{header:header,divider:divider}:null;}
  function renderMd(src) {
    var out = [], lines = String(src).split("\n"), i = 0;
    while (i < lines.length) {
      var line = lines[i];
      if (/^```/.test(line)) {
        var lang = line.slice(3).trim(), buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
        i++;
        out.push('<pre class="code" data-lang="' + escapeHtml(lang) + '"><code>' +
          escapeHtml(buf.join("\n")) + "</code></pre>");
        continue;
      }
      var markdownHeading=/^\s{0,3}(#{1,6})\s+(.+)$/.exec(line);
      if(markdownHeading){var level=Math.max(4,markdownHeading[1].length);out.push("<h"+level+">"+mdInline(markdownHeading[2])+"</h"+level+">");i++;continue;}
      var table=tableAt132(lines,i);
      if(table){var tableRows=[],aligns=table.divider.map(function(x){return x[0]===":"?(x[x.length-1]===":"?"center":"left"):(x[x.length-1]===":"?"right":"left");});i+=2;
        while(i<lines.length && lines[i].indexOf("|")>=0 && lines[i].trim()){var cells=tableCells132(lines[i]);if(cells.length!==table.header.length)break;tableRows.push(cells);i++;}
        out.push('<div class="study-table132" tabindex="0" role="region" aria-label="Tabel de studiu, derulare orizontală"><table><thead><tr>'+table.header.map(function(x,j){return '<th scope="col" style="text-align:'+aligns[j]+'">'+mdInline(x)+'</th>';}).join("")+"</tr></thead><tbody>"+tableRows.map(function(row){return "<tr>"+row.map(function(x,j){return '<td style="text-align:'+aligns[j]+'">'+mdInline(x)+'</td>';}).join("")+"</tr>";}).join("")+"</tbody></table></div>");continue;
      }
      if (/^\s*[-*]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
          items.push("<li>" + mdInline(lines[i].replace(/^\s*[-*]\s+/, "")) + "</li>");
          i++;
        }
        out.push("<ul>" + items.join("") + "</ul>");
        continue;
      }
      if (/^\s*\d+[.)]\s+/.test(line)) {
        var oitems = [], listStart = /^\s*(\d+)[.)]\s+/.exec(line)[1];
        while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) {
          var itemNumber = /^\s*(\d+)[.)]\s+/.exec(lines[i])[1];
          oitems.push('<li value="' + itemNumber + '">' + mdInline(lines[i].replace(/^\s*\d+[.)]\s+/, "")) + "</li>");
          i++;
        }
        out.push('<ol start="' + listStart + '">' + oitems.join("") + "</ol>");
        continue;
      }
      if (/^\s*$/.test(line)) { i++; continue; }
      var para = [];
      while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^```/.test(lines[i]) &&
             !/^\s*[-*]\s+/.test(lines[i]) && !/^\s*\d+[.)]\s+/.test(lines[i]) && !tableAt132(lines,i) && !/^\s{0,3}#{1,6}\s+/.test(lines[i])) {
        para.push(lines[i]); i++;
      }
      out.push("<p>" + mdInline(para.join("\n")).replace(/\n/g, "<br>") + "</p>");
    }
    return out.join("");
  }

  // ---------------------------------------------------------------- stare
  var SEED = window.SEED || { decks: [], cards: [] };
  var state, dirty = false, saveTimer = null;

  function defaultState() {
    return {
      v: 1,
      sched: {},
      custom: [],
      log: [],
      settings: { newPerDay: 10, maxRev: 60, theme: "dark", style: "retro", decks: {}, fontScale: 1,
                  hearts: true, hideAnswer: false, setup: false,
                  level: "mediu", goal: 60, asistent: true },
      learn: { terms: {}, lessons: {}, xp: 0, xpDay: { date: dayKey(), n: 0 } },
      lab: { done: {}, draft: {} },
      py: { done: {}, draft: {} },
      scen: { done: {} },
      assessments: {}, projects: {}, sparkPractice: {done:{},draft:{}}, exams: {sessions:{},generatedForms:{},activeId:null}, resume: null, returnSession: null, returnStack:[],
      library: { favorites: {}, notes: {} }, discovery:{query:"",filters:{},shown:25,nodeKey:null,returnKey:null},
      streak: { last: null, count: 0, best: 0 },
      daily: { date: dayKey(), newDone: 0, revDone: 0, questClaimed: {} }
    };
  }
  function migrate(s) {
    var d = defaultState();
    if (!s || typeof s !== "object") return d;
    s.v = s.v || 1;
    s.sched = s.sched || {};
    s.custom = Array.isArray(s.custom) ? s.custom : [];
    s.log = Array.isArray(s.log) ? s.log : [];
    s.settings = Object.assign({}, d.settings, s.settings || {});
    if (s.settings.asistent === undefined) s.settings.asistent = true;
    s.settings.decks = s.settings.decks || {};
    s.streak = Object.assign({}, d.streak, s.streak || {});
    s.learn = Object.assign({}, d.learn, s.learn || {});
    s.learn.terms = s.learn.terms || {};
    s.learn.lessons = s.learn.lessons || {};
    s.learn.xp = s.learn.xp || 0;
    s.learn.xpDay = Object.assign({ date: dayKey(), n: 0 }, s.learn.xpDay || {});
    s.lab = Object.assign({}, d.lab, s.lab || {});
    s.lab.done = s.lab.done || {};
    s.lab.draft = s.lab.draft || {};
    s.py = Object.assign({}, d.py, s.py || {});
    s.py.done = s.py.done || {};
    s.py.draft = s.py.draft || {};
    s.scen = Object.assign({}, d.scen, s.scen || {});
    s.scen.done = s.scen.done || {};
    s.assessments = s.assessments && typeof s.assessments === "object" ? s.assessments : {};
    s.sparkPractice=s.sparkPractice && typeof s.sparkPractice==="object" && !Array.isArray(s.sparkPractice)?s.sparkPractice:{done:{},draft:{}};
    ["done","draft"].forEach(function(k){if(!s.sparkPractice[k] || typeof s.sparkPractice[k]!=="object" || Array.isArray(s.sparkPractice[k]))s.sparkPractice[k]={};});
    Object.keys(s.sparkPractice.draft).forEach(function(id){var ex=sparkById(id),n=s.sparkPractice.draft[id];if(!ex || !Number.isInteger(n) || n<0 || n>=ex.o.length)delete s.sparkPractice.draft[id];});
    Object.keys(s.sparkPractice.done).forEach(function(id){var value=s.sparkPractice.done[id];if(!sparkById(id) || !value || typeof value!=="object" || typeof value.correct!=="boolean" || !Number.isFinite(value.attempts) || value.attempts<0)delete s.sparkPractice.done[id];});
    s.projects = s.projects && typeof s.projects === "object" ? s.projects : {};
    if(Array.isArray(s.projects))s.projects={};
    Object.keys(s.projects).forEach(function(id){var value=s.projects[id];if(!value || typeof value!=="object" || Array.isArray(value)){delete s.projects[id];return;}if(value.criteria!==undefined)value.criteria=Array.isArray(value.criteria)?value.criteria.filter(function(n,i,a){return Number.isInteger(n) && n>=0 && n<1000 && a.indexOf(n)===i;}):[];if(value.note!==undefined)value.note=typeof value.note==="string"?value.note.slice(0,20000):"";});
    s.exams=s.exams && typeof s.exams === "object" && !Array.isArray(s.exams)?s.exams:{sessions:{},activeId:null};
    s.exams.sessions=s.exams.sessions && typeof s.exams.sessions === "object" && !Array.isArray(s.exams.sessions)?s.exams.sessions:{};
    s.exams.generatedForms=s.exams.generatedForms && typeof s.exams.generatedForms==="object" && !Array.isArray(s.exams.generatedForms)?s.exams.generatedForms:{};
    Object.keys(s.exams.generatedForms).forEach(function(id){if(!validGeneratedForm(s.exams.generatedForms[id]))delete s.exams.generatedForms[id];});
    Object.keys(s.exams.sessions).forEach(function(id){if(!validAttempt(s.exams.sessions[id],s.exams.generatedForms))delete s.exams.sessions[id];});
    s.library = s.library && typeof s.library === "object" && !Array.isArray(s.library) ? s.library : {};
    ["favorites", "notes"].forEach(function (key) {
      if (!s.library[key] || typeof s.library[key] !== "object" || Array.isArray(s.library[key])) s.library[key] = {};
    });
    var discovery=s.discovery && typeof s.discovery==="object" && !Array.isArray(s.discovery)?s.discovery:{};
    s.discovery={query:typeof discovery.query==="string"?discovery.query.slice(0,500):"",filters:{},shown:Number.isInteger(discovery.shown)?clamp(discovery.shown,25,100000):25,nodeKey:typeof discovery.nodeKey==="string"?discovery.nodeKey.slice(0,300):null,returnKey:typeof discovery.returnKey==="string"?discovery.returnKey.slice(0,300):null};
    ["kind","deck","level","exam"].forEach(function(k){if(discovery.filters && typeof discovery.filters[k]==="string")s.discovery.filters[k]=discovery.filters[k].slice(0,120);});
    if (!s.resume || s.resume.v !== 1 || ["study", "lesson", "lab", "pylab", "simulation", "case", "project","reading","course","recap"].indexOf(s.resume.kind) < 0) s.resume = null;
    var returnKinds=["study","lesson","case","project","reading","course","recap"];
    if (!s.returnSession || s.returnSession.v !== 1 || returnKinds.indexOf(s.returnSession.kind)<0) s.returnSession=null;
    s.returnStack=Array.isArray(s.returnStack)?s.returnStack.filter(function(p){return p && p.v===1 && returnKinds.indexOf(p.kind)>=0;}).slice(-12):[];
    s.py.work = s.py.work && typeof s.py.work === "object" ? s.py.work : {};
    s.daily = Object.assign({}, d.daily, s.daily || {});
    if (!s.daily.questClaimed || typeof s.daily.questClaimed !== "object") {
      s.daily.questClaimed = {};
    }
    s=applyLessonRevision144(s);if(courses145Api())courses145Api().ensure(s);return s;
  }
  function applyLessonRevision144(s) {
    var audit=SEED.lessonReview144, ids=audit && audit.invalidatedAssessmentIds;
    if(!audit || !Array.isArray(ids) || !ids.length || s.settings.contentReview144Applied===audit.version)return s;
    var history=s.contentRevisionHistory144;
    if(!history || typeof history!=="object" || Array.isArray(history))history={assessments:{},sessions:[]};
    if(!history.assessments || typeof history.assessments!=="object" || Array.isArray(history.assessments))history.assessments={};
    if(!Array.isArray(history.sessions))history.sessions=[];
    ids.forEach(function(id){if(s.assessments[id]){history.assessments[id]=s.assessments[id];delete s.assessments[id];}});
    function stale(pending){return !!(pending && Array.isArray(pending.items) && pending.items.some(function(item){return ids.indexOf(item.id)>=0;}));}
    ["resume","returnSession"].forEach(function(key){if(stale(s[key])){history.sessions.push({reason:"question-content-corrected",session:s[key]});s[key]=null;}});
    s.returnStack=s.returnStack.filter(function(pending){if(!stale(pending))return true;history.sessions.push({reason:"question-content-corrected",session:pending});return false;});
    history.note="Rezultate și sesiuni dinaintea corectării conținutului; se păstrează ca istoric, fără a dovedi răspunsul la întrebarea revizuită.";
    s.contentRevisionHistory144=history;s.settings.contentReview144Applied=audit.version;return s;
  }
  function loadState() {
    var raw = rawLoad();
    if (raw) {
      try { state = migrate(JSON.parse(raw)); }
      catch (e) { state = defaultState(); }
    } else state = defaultState();
    state = applyLessonRevision144(state);if(courses145Api())courses145Api().ensure(state);
    rollDay();
  }
  function save(now) {
    var pending = sessionSnapshot();
    if (pending !== undefined) state.resume = pending;
    dirty = true;
    if (saveTimer) clearTimeout(saveTimer);
    if (now) { flush(); return; }
    saveTimer = setTimeout(flush, 400);
  }
  function flush() {
    if (!dirty) return;
    if (rawSave(JSON.stringify(state))) dirty = false;
    saveTimer = null;
  }
  function rollDay() {
    var k = dayKey();
    if (state.daily.date !== k) state.daily = { date: k, newDone: 0, revDone: 0, questClaimed: {} };
  }

  // ---------------------------------------------------------------- sesiuni salvate
  var questionIndex = null;
  function questionById(id) {
    if (!questionIndex) {
      questionIndex = Object.create(null);
      (SEED.questions || []).forEach(function (q) { questionIndex[q.id] = q; });
      Object.values(SEED.questionArchive || {}).forEach(function (q) { questionIndex[q.id] = q; });
      Object.keys(SEED.teste || {}).forEach(function (exam) {
        SEED.teste[exam].forEach(function (q) { questionIndex[q.id] = q; });
      });
      (SEED.minitest || []).forEach(function(mt){mt.intrebari.forEach(function(q){var item=miniQuestion(mt,q);questionIndex[item.id]=item;});});
    }
    return questionIndex[id] || null;
  }
  var termIndex162=null,termIndexSrc162=null,termIndexLen162=-1;
  function termById(id) {
    var all=allTerms();
    if(all!==termIndexSrc162 || all.length!==termIndexLen162){termIndex162=Object.create(null);all.forEach(function(t){if(!(t.id in termIndex162))termIndex162[t.id]=t;});termIndexSrc162=all;termIndexLen162=all.length;}
    var t=termIndex162[id];
    if(t && t.id===id)return t;
    termIndexSrc162=null;return all.filter(function (x) { return x.id === id; })[0] || null;
  }
  function encodeSessionItem(it) {
    if (!it) return null;
    if (it.type === "card") return {type:"card",id:it.card.id};
    if (it.type === "intro") return {type:"intro",id:it.term.id};
    if (it.type === "mcq" || it.type === "rev") return {type:it.type,id:it.term.id,options:it.options.map(function (o) { return {id:(o.term || it.term).id,ok:!!o.ok}; })};
    if (it.type === "recall") return {type:"recall",id:it.term.id};
    if (it.type === "fx") return {type:"fx",id:it.ex.id,noHint:!!it.noHint};
    if (it.type === "pairs") return {type:"pairs",ids:it.terms.map(function (t) { return t.id; }),left:it.stanga.map(function (t) { return t.id; }),right:it.dreapta.map(function (t) { return t.id; })};
    if (it.type === "scen") return {type:"scen",id:it.sc.id,pas:it.pas || 0,ord:it.ord || null};
    if (it.type === "exam") return {type:"exam",id:it.q.id,exam:it.exam || null,ord:it.ord || null,inline:questionById(it.q.id) ? null : it.q};
    if (it.type === "lab" || it.type === "pylab" || it.type === "spark") return {type:it.type,id:it.ex.id};
    return null;
  }
  function decodeSessionItem(it) {
    if (!it || typeof it !== "object") return null;
    var item, term;
    if (it.type === "card") { item = cardById(it.id); return item ? {type:"card",card:item} : null; }
    if (it.type === "intro") { term = termById(it.id); return term ? {type:"intro",term:term} : null; }
    if (it.type === "mcq" || it.type === "rev") {
      term = termById(it.id); if (!term || !Array.isArray(it.options)) return null;
      var rev = it.type === "rev";
      var options = it.options.map(function (o) { var t = termById(o.id); return t ? {text:rev ? t.t : t.d,ok:!!o.ok,term:t} : null; });
      if (options.some(function (o) { return !o; }) || options.filter(function (o) { return o.ok; }).length !== 1) return null;
      return {type:it.type,term:term,options:options};
    }
    if (it.type === "recall") { term = termById(it.id); return term ? {type:"recall",term:term} : null; }
    if (it.type === "fx") { item = fxById159(it.id); return item ? {type:"fx",ex:item,noHint:!!it.noHint} : null; }
    if (it.type === "pairs") {
      if (![it.ids,it.left,it.right].every(Array.isArray)) return null;
      var lists = [it.ids,it.left,it.right].map(function (ids) { return ids.map(termById); });
      if (lists.some(function (list) { return !list.length || list.some(function (t) { return !t; }); })) return null;
      return {type:"pairs",terms:lists[0],stanga:lists[1],dreapta:lists[2]};
    }
    if (it.type === "scen") {
      item = scenById(it.id); if (!item) return null;
      var stage = it.pas === 1 ? 1 : 0, count = (stage ? item.v : item).o.length;
      var ord = Array.isArray(it.ord) && it.ord.length === count && it.ord.every(function (n,i,a) { return Number.isInteger(n) && n>=0 && n<count && a.indexOf(n)===i; }) ? it.ord : null;
      return {type:"scen",sc:item,pas:stage,ord:ord};
    }
    if (it.type === "exam") {
      item = questionById(it.id) || it.inline;
      if (!item || typeof item.q !== "string" || !Array.isArray(item.o) || !item.o.length) return null;
      var order=Array.isArray(it.ord) && it.ord.length===item.o.length && it.ord.every(function(n,i,a){return Number.isInteger(n)&&n>=0&&n<item.o.length&&a.indexOf(n)===i;})?it.ord:null;
      return {type:"exam",q:item,exam:it.exam || null,ord:order};
    }
    if (it.type === "lab" || it.type === "pylab" || it.type === "spark") {
      item = it.type === "lab" ? labById(it.id) : it.type === "spark" ? sparkById(it.id) : pyById(it.id);
      return item ? {type:it.type,ex:item} : null;
    }
    return null;
  }
  function sessionSnapshot() {
    if (!state || !ui || !ui.activeFlow || ui.activeFlow==="course145") return undefined;
    if(ui.activeFlow==="recap"){var recap=(SEED.recaps || []).filter(function(x){return x.id===ui.activeRecapId;})[0];return recap?{v:1,kind:"recap",id:recap.id,title:recap.titlu,at:Date.now(),scroll:$("#lab-scroll").scrollTop}:null;}
    if(ui.activeFlow==="reading"){var reading=(SEED.lectii || []).filter(function(x){return x.id===ui.activeReadingId;})[0];return reading?{v:1,kind:"reading",id:reading.id,title:reading.titlu,at:Date.now(),scroll:$("#lab-scroll").scrollTop}:null;}
    if(ui.activeFlow==="course"){var course=examenById(ui.courseExam);return course?{v:1,kind:"course",id:course.id,title:course.cod,at:Date.now(),scroll:$("#lab-scroll").scrollTop}:null;}
    if(ui.activeFlow==="project"){var project=(SEED.projects || []).filter(function(x){return x.id===ui.activeProjectId;})[0];return project?{v:1,kind:"project",id:project.id,title:project.titlu,at:Date.now()}:null;}
    if(ui.activeFlow==="case"){var c=(SEED.caseStudies || []).concat(SEED.exercitii || []).filter(function(x){return x.id===ui.activeCaseId;})[0];return c?{v:1,kind:"case",id:c.id,title:c.titlu,at:Date.now()}:null;}
    if(ui.activeFlow==="simulation"){var attempt=simulationAttempt();return attempt && attempt.status==="active"?{v:1,kind:"simulation",id:attempt.id,title:examForm(attempt.formId).titlu,at:Date.now()}:null;}
    if (ui.activeFlow === "study") {
      if (!ui.queue.length || ui.qIndex >= ui.queue.length) return null;
      return {v:1,kind:"study",title:"Repetiție clasică",at:Date.now(),items:ui.queue.map(function (c) { return c.id; }),
        index:ui.qIndex,deck:ui.deckId,done:ui.sessionDone,start:ui.sessionStart,revealed:!!ui.revealed,step:pasStare,mistake:ui.lastMistake || null};
    }
    if (ui.activeFlow === "lab" || ui.activeFlow === "pylab") {
      var ex = ui.activeFlow === "lab" ? labById(ui.activeLabId) : pyById(ui.activeLabId);
      if (!ex) return null;
      if(ui.activeFlow==="pylab" && state.py.work && state.py.work[ex.id] && state.py.work[ex.id].phase==="gata")return null;
      if(ui.activeFlow==="lab" && labIsDone(ex.id) && (!ex.decizie || state.lab.done[ex.id].d!==undefined) && !(state.lab.work && state.lab.work[ex.id] && state.lab.work[ex.id].codeStatus!=="passed"))return null;
      return {v:1,kind:ui.activeFlow,id:ex.id,title:ex.titlu,at:Date.now()};
    }
    if (!L || L.finished || L.failed || L.hearts <= 0) return null;
    var specs = L.lesson.items.map(encodeSessionItem), index = L.i, partial = null, solvedLab=false;
    var current = L.lesson.items[index];
    if (current && L.verificat && ["scen","exam","mcq","rev","recall","spark","fx"].indexOf(current.type)>=0) {
      if (current.type === "scen" && !current.pas) { specs[index].pas=1; specs[index].ord=null; }
      else index++;
    } else if(current && current.type==="pylab" && state.py.work && state.py.work[current.ex.id] && state.py.work[current.ex.id].phase==="gata"){index++;solvedLab=true;}
    else if (current && current.type === "pairs" && current.terms.every(function (t) { return L.pairsOk[t.id]; })) index++;
    else partial = {selected:L.selected && L.selected.length ? L.selected.slice() : (L.raspuns===null?[]:[L.raspuns]),pairs:L.pairsOk,pairsWrong:!!L.pairsGresit,
      cardStep:current && current.type==="card" && pasStare?{i:pasStare.i,text:pasStare.text || "",vazut:!!pasStare.vazut}:null};
    return {v:1,kind:"lesson",title:L.titlu || "Sesiune de învățare",at:Date.now(),items:specs,index:index,
      meta:{id:L.lesson.id,deck:L.lesson.deck,idx:L.lesson.idx,terms:L.lesson.terms.map(function (t) { return t.id; })},
      score:{hearts:L.hearts,corecte:L.corecte+(solvedLab?1:0),gresite:L.gresite,xp:L.xp,reluari:L.reluari,start:L.start},partial:partial,original:L.original};
  }
  function resumeSession() {
    var pending = state.resume;
    if (!pending) return false;
    try {
    if(pending.kind==="project"){var project=(SEED.projects || []).filter(function(x){return x.id===pending.id;})[0];if(project){openProject(project);return true;}}
    if(pending.kind==="case")return openCaseStudy(pending.id);
    if(pending.kind==="recap"){if(openRecap(pending.id)){$("#lab-scroll").scrollTop=pending.scroll || 0;return true;}}
    if(pending.kind==="reading"){var reading=(SEED.lectii || []).filter(function(x){return x.id===pending.id;})[0];if(reading){deschideLectie(reading);$("#lab-scroll").scrollTop=pending.scroll || 0;return true;}}
    if(pending.kind==="course" && examenById(pending.id)){deschideExamen(pending.id);$("#lab-scroll").scrollTop=pending.scroll || 0;return true;}
    if(pending.kind==="simulation"){var attempt=state.exams.sessions[pending.id];if(attempt && validAttempt(attempt))return startSimulation(attempt.formId,attempt.id);}
    if (pending.kind === "lab" || pending.kind === "pylab") {
      var exists = pending.kind === "lab" ? labById(pending.id) : pyById(pending.id);
      if (exists) return pending.kind === "lab" ? openLab(pending.id) : openPyLab(pending.id);
    } else if (Array.isArray(pending.items) && pending.items.length <= 5000 && Number.isInteger(pending.index) && pending.index >= 0 && pending.index <= pending.items.length) {
      if (pending.kind === "study") {
        var queue = [], cursor = 0;
        pending.items.forEach(function (id,i) { var card=cardById(id); if (card) { if(i<pending.index)cursor++; queue.push(card); } });
        if (queue.length && cursor<queue.length) {
          ui.queue=queue;ui.qIndex=cursor;ui.deckId=pending.deck;ui.sessionDone=pending.done || 0;ui.sessionStart=pending.start || Date.now();
          ui.lastMistake=pending.mistake || null;
          ui.restoredPas=pending.step && Number.isInteger(pending.step.i) && pending.step.i>=0 && pending.step.i<=2
            ? {i:pending.step.i,text:typeof pending.step.text==="string"?pending.step.text.slice(0,20000):"",vazut:!!pending.step.vazut} : null;
          ui.activeFlow="study";$("#nav").hidden=true;$("#study").hidden=false;showCard();
          if (pending.revealed) reveal(); save(true); return true;
        }
      } else {
        var items=[], position=0;
        pending.items.forEach(function (spec,i) { var item=decodeSessionItem(spec);if(item){if(i<pending.index)position++;items.push(item);} });
        if (items.length) {
          var meta=pending.meta || {}, score=pending.score || {};
          L={lesson:{items:items,id:meta.id || null,deck:meta.deck || null,idx:meta.idx,terms:(meta.terms || []).map(termById).filter(Boolean)},
             titlu:pending.title || "Sesiune salvată",i:position,total:items.length,hearts:score.hearts || MAX_HEARTS,
             corecte:score.corecte || 0,gresite:score.gresite || 0,xp:score.xp || 0,reluari:score.reluari || {},start:score.start || Date.now(),
             original:pending.original || pending.items,raspuns:null,selected:[],verificat:false,pairsSel:null,pairsOk:{},pairsGresit:false};
          ui.activeFlow="lesson";$("#nav").hidden=true;$("#study").hidden=true;$("#lesson").hidden=false;
          var partial=pending.partial;
          if(partial && partial.cardStep && Number.isInteger(partial.cardStep.i) && partial.cardStep.i>=0 && partial.cardStep.i<=2)
            L.restoredPas={i:partial.cardStep.i,text:typeof partial.cardStep.text==="string"?partial.cardStep.text.slice(0,20000):"",vazut:!!partial.cardStep.vazut};
          renderItem();
          if (partial && !L.finished) {
            var item=L.lesson.items[L.i];
            if (item.type==="pairs") {
              L.pairsOk=partial.pairs || {};L.pairsGresit=!!partial.pairsWrong;
              $("#ls-body").querySelectorAll("[data-term],[data-def]").forEach(function (b) {
                var id=b.getAttribute("data-term") || b.getAttribute("data-def");
                if(L.pairsOk[id]){b.classList.add("ok");b.disabled=true;}
              });
            } else (partial.selected || []).forEach(function (i) {
              var b=$("#ls-body").querySelector('.opt[data-opt="'+Number(i)+'"]');if(b)b.click();
            });
          }
          save(true);return true;
        }
      }
    }
    } catch (error) { L=null; }
    state.resume=null;ui.activeFlow=null;save(true);show("home");
    toast("Sesiunea veche nu mai este disponibilă. Progresul deja înregistrat este păstrat.");return false;
  }

  // ---------------------------------------------------------------- colecția personală și recapitularea
  var MATERIAL_NAMES={card:"Card",term:"Termen",scenario:"Scenariu",sql:"SQL",python:"Python",spark:"PySpark offline",question:"Întrebare",project:"Proiect",lesson:"Lecție",exercise:"Exercițiu de curs",case:"Studiu de caz",recap:"Recapitulare"};
  function materialById(kind,id) {
    if(kind==="card")return cardById(id);
    if(kind==="term")return termById(id);
    if(kind==="scenario")return scenById(id);
    if(kind==="sql")return labById(id);
    if(kind==="python")return pyById(id);
    if(kind==="spark")return sparkById(id);
    if(kind==="question")return questionById(id);
    var pool=kind==="project"?SEED.projects:kind==="lesson"?SEED.lectii:kind==="exercise"?SEED.exercitii:kind==="case"?SEED.caseStudies:kind==="recap"?SEED.recaps:null;
    if(pool)return pool.filter(function(x){return x.id===id;})[0] || null;
    return null;
  }
  function materialTitle(kind,material) { return kind==="spark"?material.titlu:material.q || material.titlu || material.t || material.name || kind; }
  function noteText(key) {
    var value=state.library.notes[key];
    return typeof value==="string"?value:(value && typeof value.text==="string"?value.text:"");
  }
  function toggleFavorite(kind,id) {
    if(!materialById(kind,id))return false;
    var key=kind+":"+id;
    if(state.library.favorites[key])delete state.library.favorites[key];
    else state.library.favorites[key]={kind:kind,id:id,at:Date.now()};
    save(true);return !!state.library.favorites[key];
  }
  function libraryControls(host,kind,id) {
    if(!materialById(kind,id))return;
    var key=kind+":"+id, box=el("div","personal-controls");box.setAttribute("data-personal-key",key);
    var favorite=el("button","btn mini ghost");favorite.type="button";favorite.setAttribute("data-favorite",key);
    function label(){var on=!!state.library.favorites[key];favorite.textContent=on?"În favorite":"Salvează la favorite";favorite.setAttribute("aria-pressed",on?"true":"false");}
    label();favorite.onclick=function(){toggleFavorite(kind,id);label();};box.appendChild(favorite);
    var details=el("details","personal-note");details.appendChild(el("summary",null,"Notițele mele"));
    var input=el("textarea");input.rows=4;input.maxLength=20000;input.value=noteText(key);
    input.placeholder="Exemplul tău, o întrebare sau o idee de reținut…";input.setAttribute("aria-label","Notiță personală");
    input.setAttribute("data-note",key);details.appendChild(input);
    var status=el("span","muted");status.setAttribute("aria-live","polite");
    var timer=null;
    function store(){
      if(input.value.trim())state.library.notes[key]={text:input.value.slice(0,20000),at:Date.now()};
      else delete state.library.notes[key];
      save();
    }
    input.oninput=function(){store();status.textContent="Se salvează…";clearTimeout(timer);timer=setTimeout(function(){status.textContent=dirty?"Salvarea nu a reușit încă.":"Notiță salvată.";},650);};
    var button=el("button","btn mini secondary","Salvează notița");button.type="button";
    button.onclick=function(){store();save(true);status.textContent=dirty?"Nu am putut salva. Încearcă din nou.":"Notiță salvată.";};
    details.appendChild(button);details.appendChild(status);box.appendChild(details);host.appendChild(box);
    if(courses145Api() && ["card","term"].indexOf(kind)>=0)courses145Api().reference(host,materialById(kind,id));
  }
  function savedMaterials() {
    var keys={};Object.keys(state.library.favorites).concat(Object.keys(state.library.notes)).forEach(function(key){keys[key]=true;});
    return Object.keys(keys).map(function(key){
      var sep=key.indexOf(":"),kind=key.slice(0,sep),id=key.slice(sep+1),material=materialById(kind,id);
      if(!material)return null;
      var favorite=state.library.favorites[key],note=state.library.notes[key];
      return {key:key,kind:kind,id:id,material:material,title:materialTitle(kind,material),note:noteText(key),projectNote:kind==="project" && state.projects[id] && state.projects[id].note || "",favorite:!!favorite,
        at:Math.max(favorite && favorite.at || 0,note && note.at || 0)};
    }).filter(Boolean).sort(function(a,b){return b.at-a.at || a.title.localeCompare(b.title,"ro");});
  }
  function itemForMaterial(kind,material) {
    if(kind==="card")return {type:"card",card:material};
    if(kind==="term")return mcqItem(material);
    if(kind==="scenario")return {type:"scen",sc:material,pas:0};
    if(kind==="question")return {type:"exam",q:material};
    if(kind==="sql" || kind==="python")return {type:kind==="sql"?"lab":"pylab",ex:material};
    if(kind==="spark")return {type:"spark",ex:material};
    return null;
  }
  function weakItems() {
    var rows=[],groups={},lastLog={};
    state.log.forEach(function(log){if(!lastLog[log.id] || lastLog[log.id].t<=log.t)lastLog[log.id]=log;});
    Object.keys(lastLog).forEach(function(id){var log=lastLog[id],card=cardById(id);if(card && log.r<GOOD && !isSuspended(id))rows.push({item:{type:"card",card:card},at:log.t || 0});});
    Object.keys(state.learn.terms).forEach(function(id){var progress=state.learn.terms[id],term=termById(id);
      if(term && (progress.lastCorrect===false || (progress.lastCorrect===undefined && progress.g>0 && progress.s<MAX_STRENGTH)))rows.push({item:mcqItem(term),at:progress.last || 0});
    });
    Object.keys(state.assessments).forEach(function(id){
      var result=state.assessments[id],q=questionById(id);if(!q)return;
      var key=q.competency?q.competency+":"+q.level:q.id,previous=groups[key];
      if(!previous || (result.last || 0)>=(previous.result.last || 0))groups[key]={q:q,result:result};
    });
    Object.keys(groups).forEach(function(key){var value=groups[key];if(!value.result.correct)rows.push({item:{type:"exam",q:value.q,exam:value.result.exam || null},at:value.result.last || 0});});
    Object.keys(state.scen.done).forEach(function(id){var progress=state.scen.done[id],scenario=scenById(id);
      if(scenario && (Array.isArray(progress.lastCorrect)?progress.lastCorrect.some(function(x){return x===false;}):progress.g>0))rows.push({item:{type:"scen",sc:scenario,pas:0},at:progress.at || 0});
    });
    Object.keys(state.sparkPractice.done).forEach(function(id){var progress=state.sparkPractice.done[id],ex=sparkById(id);if(ex && progress.lastCorrect===false)rows.push({item:{type:"spark",ex:ex},at:progress.last || 0});});
    return rows.sort(function(a,b){return b.at-a.at;}).map(function(row){return row.item;});
  }
  function practiceCandidates(source,exam,level) {
    var items=source==="favorites"?savedMaterials().filter(function(row){return row.favorite;}).map(function(row){return itemForMaterial(row.kind,row.material);}):
      source==="due"?activeCards(null).filter(function(c){var s=sched(c.id);return s.st!=="new" && s.due<=Date.now();}).sort(function(a,b){return sched(a.id).due-sched(b.id).due;}).map(function(c){return {type:"card",card:c};}):weakItems();
    return items.filter(function(item){
      if(!item)return false;
      var material=item.card || item.term || item.sc || item.q || item.ex;
      var itemLevel=item.type==="mcq"?"understand":material.level;
      if(level && item.type==="mcq" && level!=="understand")return false;
      if(level && level!==itemLevel && (material.levels || []).indexOf(level)<0)return false;
      if(exam && (material.certs || []).indexOf(exam)<0 && material.deck!==exam && !(material.deck || "").startsWith(exam+"-m") && item.exam!==exam)return false;
      return true;
    });
  }
  function openPractice(source) {
    var body=$("#modal-body");body.innerHTML="";$("#modal-title").textContent="Studiu personalizat";
    function select(id,label,pairs){var wrapper=el("label","practice-field");wrapper.appendChild(el("span",null,label));var input=el("select");input.id=id;
      pairs.forEach(function(pair){var option=el("option",null,pair[1]);option.value=pair[0];input.appendChild(option);});wrapper.appendChild(input);body.appendChild(wrapper);return input;}
    var from=select("practice-source","Ce vrei să repeți?",[["mistakes","Greșeli și concepte de consolidat"],["favorites","Favoritele mele"],["due","Carduri scadente"]]);from.value=source || "mistakes";
    var exam=select("practice-exam","Certificare",[["","Toate"]].concat(examene().filter(function(e){return e.furnizor;}).map(function(e){return [e.id,e.cod];})));
    var level=select("practice-level","Nivel",[["","Toate"]].concat(LEARNING_LEVELS));
    var count=select("practice-size","Număr de materiale",[["5","5"],["10","10"],["20","20"],["30","30"]]);count.value="10";
    var info=el("p","muted");info.id="practice-count";body.appendChild(info);
    var go=el("button","btn primary big","Începe recapitularea");go.id="practice-start";body.appendChild(go);
    function update(){var n=practiceCandidates(from.value,exam.value,level.value).length;info.textContent=n+" materiale disponibile · sesiune de cel mult "+count.value+". Progresul deja înregistrat este păstrat.";go.disabled=!n;}
    [from,exam,level,count].forEach(function(input){input.onchange=update;});
    go.onclick=function(){var items=practiceCandidates(from.value,exam.value,level.value).slice(0,Number(count.value));closeModal();startRun(items,{titlu:"Recapitulare personalizată"});};
    update();$("#modal").hidden=false;
  }
  function openSaved(row) {
    closeModal();
    if(row.kind==="project"){openProject(row.material);return;}
    if(row.kind==="lesson"){openRelatedExplanation("lesson",row.id);return;}
    if(row.kind==="case" || row.kind==="exercise"){openCaseStudy(row.id);return;}
    if(row.kind==="recap"){openRecap(row.id);return;}
    if(row.kind==="card"){openDetail(row.material);return;}
    if(row.kind==="sql"){openLab(row.id);return;}
    if(row.kind==="python"){openPyLab(row.id);return;}
    if(row.kind==="spark"){openSparkLab(row.id);return;}
    if(row.kind==="term"){
      var body=$("#modal-body");body.innerHTML="";$("#modal-title").textContent=row.material.t;
      body.appendChild(el("p",null,row.material.d));appendTermDetails(body,row.material);appendRelated(body,row.id,"Consolidează conceptul");libraryControls(body,"term",row.id);appendLearningSources(body,row.material.s);
      var practice=el("button","btn primary","Exersează termenul");practice.onclick=function(){closeModal();startRun([mcqItem(row.material)],{titlu:row.material.t});};body.appendChild(practice);$("#modal").hidden=false;return;
    }
    startRun([itemForMaterial(row.kind,row.material)],{titlu:row.title});
  }
  function renderSaved(root) {
    root.appendChild(el("h2","sec-title","Favorite și notițe"));
    var practice=el("button","btn secondary","Repetă favoritele");practice.onclick=function(){openPractice("favorites");};root.appendChild(practice);
    var input=el("input");input.type="search";input.placeholder="Caută în materialele și notițele salvate…";input.id="saved-search";input.setAttribute("aria-label","Caută în salvate");root.appendChild(input);
    var select=el("select");select.id="saved-kind";select.setAttribute("aria-label","Tipul materialului salvat");
    var all=el("option",null,"Toate tipurile");all.value="";select.appendChild(all);
    Object.keys(MATERIAL_NAMES).forEach(function(kind){var o=el("option",null,MATERIAL_NAMES[kind]);o.value=kind;select.appendChild(o);});root.appendChild(select);
    var count=el("p","muted");count.id="saved-count";root.appendChild(count);var list=el("div");root.appendChild(list);
    function render(){list.innerHTML="";var key=searchKey(input.value),items=savedMaterials().filter(function(row){return (!select.value || select.value===row.kind) && (!key || searchKey(row.title+" "+row.note+" "+(row.projectNote || "")).indexOf(key)>=0);});
      count.textContent=items.length+" materiale salvate";
      var shown=0,more=el("button","btn secondary","Mai multe");
      function append(){if(more.parentNode)more.remove();items.slice(shown,shown+40).forEach(function(row){var box=el("div","unit saved-row");box.setAttribute("data-saved-key",row.key);
        box.appendChild(el("p","muted",MATERIAL_NAMES[row.kind]+(row.favorite?" · favorit":" · cu notițe")));
        var title=el("button","btn ghost saved-title");title.innerHTML=mdInline(row.title);title.onclick=function(){openSaved(row);};box.appendChild(title);
        if(row.note)box.appendChild(el("p","saved-note",row.note));
        if(row.projectNote)box.appendChild(el("p","saved-note","Planul proiectului · "+row.projectNote.slice(0,300)+(row.projectNote.length>300?"…":"")));
        var remove=el("button","btn mini ghost",row.favorite?"Scoate din favorite":"Deschide notița");
        remove.onclick=function(){if(row.favorite){toggleFavorite(row.kind,row.id);render();}else openSaved(row);};box.appendChild(remove);list.appendChild(box);
      });shown+=40;if(shown<items.length)list.appendChild(more);}
      more.onclick=append;append();if(!items.length){var filtered=!!key || !!select.value;list.appendChild(el("p","muted",filtered?"Niciun material salvat nu corespunde filtrelor.":"Salvează materiale cu butonul «Salvează la favorite» sau adaugă o notiță personală."));if(filtered){var reset=el("button","btn secondary","Șterge filtrele");reset.id="saved-clear";reset.onclick=function(){input.value="";select.value="";render();};list.appendChild(reset);}}
    }
    input.oninput=render;select.onchange=render;render();
  }
  function renderPersonalHome(root) {
    var box=el("div","personal-home");
    if(state.returnSession){var back=el("button","btn secondary","Revino la sesiunea inițială");back.id="return-study";back.onclick=restoreRelatedParent;box.appendChild(back);}
    if(state.resume && !root.querySelector("#resume-session")){var resume=el("div","unit resume-card");resume.appendChild(el("h3",null,"Sesiune salvată"));
      resume.appendChild(el("p","muted",state.resume.title || "Continuă de unde ai rămas"));
      var go=el("button","btn primary","Reia sesiunea");go.id="resume-session";go.onclick=resumeSession;resume.appendChild(go);
      var discard=el("button","btn mini ghost","Renunță la sesiunea salvată");discard.id="discard-session";
      discard.onclick=function(){state.resume=null;save(true);renderHome();};resume.appendChild(discard);box.appendChild(resume);}
    var weak=weakItems().length;box.appendChild(el("p","muted",weak?weak+(weak===1?" material de consolidat din încercările tale.":" materiale de consolidat din încercările tale."):"Nu ai greșeli de recapitulat. Poți exersa favoritele sau cardurile scadente."));
    var recap=el("button","btn secondary",weak?"Recapitulează · "+weak+(weak===1?" material":" materiale"):"Alege ce recapitulezi");recap.id="open-practice";recap.onclick=function(){openPractice("mistakes");};box.appendChild(recap);
    var saved=el("button","btn ghost","Favorite și notițe · "+savedMaterials().length);saved.id="open-saved";saved.onclick=function(){learnTab="saved";show("learn");};box.appendChild(saved);root.appendChild(box);
  }

  // Explicit learning relationships, kept separate from navigation and scoring.
  function relatedResources(id) {
    var rows=(SEED.learningLinks || {})[id] || [];
    if(cardById(id))rows=[{kind:"card",id:id}].concat(rows);
    var seen={};return rows.filter(function(row){var key=row.kind+":"+row.id;if(seen[key])return false;seen[key]=true;return !!relatedResource(row.kind,row.id);});
  }
  function relatedResource(kind,id) {
    if(kind==="lesson")return (SEED.lectii || []).filter(function(x){return x.id===id;})[0];
    if(kind==="exercise")return (SEED.exercitii || []).filter(function(x){return x.id===id;})[0];
    return materialById(kind,id);
  }
  function relatedTitle(row) {
    var resource=relatedResource(row.kind,row.id);
    return ({card:"Explicație",lesson:"Lecție",exercise:"Exercițiu",scenario:"Scenariu",sql:"Laborator SQL",python:"Laborator Python"}[row.kind] || row.kind)+" · "+materialTitle(row.kind,resource);
  }
  function appendRelated(host,id,title) {
    appendKnowledgeLink129(host,id);
    var rows=relatedResources(id);if(!rows.length)return;
    var details=el("details","related-learning");details.setAttribute("data-related",id);
    details.appendChild(el("summary",null,title || "Explicații și practică pentru acest subiect"));
    rows.forEach(function(row){var button=el("button","btn secondary related-link",relatedTitle(row));
      button.setAttribute("data-resource-kind",row.kind);button.setAttribute("data-resource-id",row.id);
      button.onclick=function(){if(["sql","python","scenario","spark"].indexOf(row.kind)>=0)launchRelatedPractice(row.kind,row.id);else openRelatedExplanation(row.kind,row.id);};details.appendChild(button);
    });host.appendChild(details);
  }
  function openRelatedExplanation(kind,id) {
    var resource=relatedResource(kind,id);if(!resource)return;
    if(kind==="lesson" && courses145Api())return deschideLectie(resource);
    if(kind==="term"){openSaved({kind:"term",id:id,title:resource.t,material:resource});return;}
    if(kind==="question")return launchRelatedPractice(kind,id);
    var body=$("#modal-body");body.innerHTML="";$("#modal-title").textContent=kind==="card"?"Explicație":kind==="lesson"?"Lecție":"Exercițiu";
    body.appendChild(el("h3",null,materialTitle(kind,resource)));
    if(kind==="card"){
      sectiuneMd(body,"Explicație",resource.a);libraryControls(body,"card",id);
      if(resource.aut && resource.aut.x && (!resource.course145 || imparteCard(resource))){sectiuneMd(body,"Exersează",resource.aut.x[0]);var model=el("details");model.appendChild(el("summary",null,"Compară cu explicația"));sectiuneMd(model,"Răspuns argumentat",resource.aut.x[1]);body.appendChild(model);}
    }else if(kind==="lesson"){
      sectiuneMd(body,"Obiectiv",resource.obiectiv);sectiuneMd(body,"Explicație",resource.explicatie);
      if(resource.exemplu)sectiuneMd(body,"Exemplu rezolvat",resource.exemplu.enunt+"\n\n"+resource.exemplu.rezolvare);
      (resource.autoevaluare || []).forEach(function(item){var row=el("details");row.appendChild(el("summary",null,item.q));sectiuneMd(row,"Explicație",item.a);body.appendChild(row);});
    }else{
      sectiuneMd(body,"Context",resource.context);if(resource.mediu)sectiuneMd(body,"Mediu",resource.mediu);
      sectiuneMd(body,"Date",resource.date);sectiuneMd(body,"Ce ai de făcut",resource.sarcini.map(function(s,i){return (i+1)+". "+s;}).join("\n"));
      var solution=el("details");solution.appendChild(el("summary",null,"Arată soluția argumentată"));sectiuneMd(solution,"Soluție",resource.solutie);body.appendChild(solution);
    }
    if(kind!=="card")libraryControls(body,kind,id);
    appendRelated(body,id,"Continuă cu materialele asociate");studyOutline132(body);$("#modal").hidden=false;
  }
  function launchRelatedPractice(kind,id) {
    var resource=relatedResource(kind,id);if(!resource)return false;
    var parent=sessionSnapshot();
    preserveParent129(parent);
    save(true);ui.activeFlow=null;L=null;closeModal();
    $("#study").hidden=true;$("#lesson").hidden=true;$("#lab").hidden=true;
    if(kind==="sql")return openLab(id);
    if(kind==="python")return openPyLab(id);
    if(kind==="spark")return openSparkLab(id);
    if(kind==="question")return startRun([{type:"exam",q:resource}],{titlu:"Verifică ideea"});
    return startRun([{type:"scen",sc:resource,pas:0}],{titlu:resource.titlu});
  }
  function restoreRelatedParent() {
    var parent=state.returnSession;if(!parent)return false;
    ui.activeFlow=null;L=null;labCur=null;pyCur=null;state.returnSession=state.returnStack.pop() || null;state.resume=parent;
    $("#study").hidden=true;$("#lesson").hidden=true;$("#lab").hidden=true;closeModal();save(true);
    return resumeSession();
  }

  function examDomainMastery(examId) {
    var exam=examenById(examId),questions=testExamen(examId),aliases=(SEED.examDomainAliases || {})[examId] || {};
    var rows=(exam.domenii || []).map(function(domain,index){return {index:index,name:domain.nume,weight:domain.pondere || null,questionIds:[],attempted:0,correct:0,wrongIds:[]};});
    var unassigned=[];
    questions.forEach(function(q){
      var indices=[];(q.domains || [q.dom]).forEach(function(name){var i=rows.findIndex(function(row){return row.name===name;});if(i<0 && aliases[name]!==undefined)i=aliases[name];if(i>=0 && rows[i] && indices.indexOf(i)<0)indices.push(i);});
      var explicit=((SEED.examQuestionDomainOverrides || {})[examId] || {})[q.id];if(explicit)indices=explicit.filter(function(i){return !!rows[i];});
      if(!indices.length){unassigned.push(q.id);return;}
      var result=state.assessments[q.id];
      if(q.competency && q.level){var shared=state.assessments[q.competency+"-q-"+q.level];if(shared && (!result || (shared.last || 0)>(result.last || 0)))result=shared;}
      indices.forEach(function(i){var row=rows[i];row.questionIds.push(q.id);if(result){row.attempted++;if(result.correct)row.correct++;else row.wrongIds.push(q.id);}});
    });return {rows:rows,unassigned:unassigned};
  }
  function startDomainPractice(examId,index,wrongOnly) {
    var row=examDomainMastery(examId).rows[index];if(!row)return false;
    var ids=wrongOnly?row.wrongIds:row.questionIds;
    var items=testExamen(examId).filter(function(q){return ids.indexOf(q.id)>=0;}).slice(0,20).map(function(q){return {type:"exam",q:q,exam:examId};});
    prepareRelatedRun129();return startRun(items,{titlu:examenById(examId).cod+" · "+row.name});
  }
  function renderDomainMastery(host,examId) {
    var mastery=examDomainMastery(examId);if(!mastery.rows.length)return;
    var section=el("div","domain-mastery");section.id="domain-mastery";
    section.appendChild(el("h3",null,"Stăpânire pe domenii · estimare locală"));
    section.appendChild(el("p","muted","Ponderile sunt cele din fișa examenului. Rezultatele descriu întrebările locale; nu sunt scoruri oficiale și nu dovedesc experiență practică."));
    mastery.rows.forEach(function(row){var box=el("div","unit domain-row");box.setAttribute("data-domain-index",String(row.index));
      box.appendChild(el("h4",null,row.name));box.appendChild(el("p","muted",row.weight?"Pondere publicată: "+row.weight:"Pondere neconfirmată în sursa disponibilă"));
      box.appendChild(el("p",null,row.correct+" / "+row.questionIds.length+" corecte la ultima încercare · "+row.attempted+" încercate · "+(row.questionIds.length-row.attempted)+" neîncercate"));
      var bar=el("progress");bar.max=Math.max(1,row.questionIds.length);bar.value=row.correct;bar.setAttribute("aria-label",row.name+": "+row.correct+" răspunsuri corecte din "+row.questionIds.length);box.appendChild(bar);
      var practice=el("button","btn secondary","Exersează domeniul");practice.disabled=!row.questionIds.length;practice.onclick=function(){startDomainPractice(examId,row.index,false);};box.appendChild(practice);
      var mistakes=el("button","btn ghost","Reia greșelile · "+row.wrongIds.length);mistakes.disabled=!row.wrongIds.length;mistakes.setAttribute("data-domain-wrong",String(row.index));mistakes.onclick=function(){startDomainPractice(examId,row.index,true);};box.appendChild(mistakes);section.appendChild(box);
    });if(mastery.unassigned.length)section.appendChild(el("p","muted",mastery.unassigned.length+" întrebări transversale au asocierea de domeniu neprecizată și nu intră în contoarele de mai sus."));
    host.appendChild(section);
  }

  // ---------------------------------------------------------------- colectie
  function allDecks() {
    var list = SEED.decks.slice();
    list.push(CUSTOM_DECK);
    return list;
  }
  function deckById(id) {
    var ds = allDecks();
    for (var i = 0; i < ds.length; i++) if (ds[i].id === id) return ds[i];
    var exam = examenById(id);
    return { id: id, name: exam ? exam.scurt : id, icon: "carte", desc: "" };
  }
  function deckEnabled(id) {
    return state.settings.decks[id] !== false;
  }
  function allCards() {
    return SEED.cards.concat(state.custom);
  }
  function cardById(id) {
    var all = allCards();
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  function sched(id) {
    var s = state.sched[id];
    if (!s) { s = { st: "new", due: 0, ivl: 0, ease: DEF_EASE, reps: 0, lapses: 0, step: 0 }; }
    return s;
  }
  function isSuspended(id) { return !!(state.sched[id] && state.sched[id].susp); }

  // ---------------------------------------------------------------- scheduler
  function fuzz(ivl) {
    if (ivl < 2 * DAY) return ivl;
    var pct = ivl < 7 * DAY ? 0.15 : ivl < 30 * DAY ? 0.1 : 0.05;
    var delta = ivl * pct;
    return Math.round(ivl - delta + Math.random() * 2 * delta);
  }
  // Calculeaza starea urmatoare fara sa o aplice (pentru preview pe butoane).
  function nextState(s, rating, now) {
    var n = Object.assign({}, s);
    n.reps = (s.reps || 0) + 1;
    if (s.st === "new" || s.st === "learn") {
      n.st = "learn";
      if (rating === AGAIN) { n.step = 0; n.due = now + LEARN_STEPS[0]; }
      else if (rating === HARD) {
        n.step = s.st === "new" ? 0 : (s.step || 0);
        n.due = now + LEARN_STEPS[Math.min(n.step, LEARN_STEPS.length - 1)];
      } else if (rating === GOOD) {
        var step = (s.st === "new" ? 0 : (s.step || 0)) + 1;
        if (step >= LEARN_STEPS.length) {
          n.st = "review"; n.step = 0; n.ivl = GRAD_IVL; n.due = now + GRAD_IVL;
        } else { n.step = step; n.due = now + LEARN_STEPS[step]; }
      } else {
        n.st = "review"; n.step = 0; n.ivl = EASY_IVL; n.due = now + EASY_IVL;
      }
      if (n.ease === undefined) n.ease = DEF_EASE;
      return n;
    }
    if (s.st === "relearn") {
      if (rating === AGAIN) { n.due = now + RELEARN_STEP; return n; }
      n.st = "review";
      n.ivl = Math.max(DAY, s.ivl || DAY);
      if (rating === EASY) n.ivl = Math.max(n.ivl, 2 * DAY);
      n.due = now + fuzz(n.ivl);
      return n;
    }
    // review
    var ivl = s.ivl || DAY, ease = s.ease || DEF_EASE;
    if (rating === AGAIN) {
      n.st = "relearn"; n.step = 0;
      n.lapses = (s.lapses || 0) + 1;
      n.ease = Math.max(MIN_EASE, ease - 0.2);
      n.ivl = Math.max(DAY, Math.round(ivl * 0.5));
      n.due = now + RELEARN_STEP;
      return n;
    }
    var factor;
    if (rating === HARD) { factor = 1.2; n.ease = Math.max(MIN_EASE, ease - 0.15); }
    else if (rating === GOOD) { factor = ease; n.ease = ease; }
    else { factor = ease * 1.3; n.ease = ease + 0.15; }
    var raw = Math.max(ivl + DAY, Math.round(ivl * factor));
    n.ivl = clamp(fuzz(raw), DAY, MAX_IVL);
    n.due = now + n.ivl;
    n.st = "review";
    return n;
  }
  function answer(cardId, rating, now) {
    now = now || Date.now();
    rollDay();
    var cur = sched(cardId);
    var wasNew = cur.st === "new";
    var wasReview = cur.st === "review" || cur.st === "relearn";
    var next = nextState(cur, rating, now);
    if (cur.susp) next.susp = cur.susp;
    next.last = now;
    state.sched[cardId] = next;
    if (wasNew) state.daily.newDone++;
    else if (wasReview) state.daily.revDone++;
    state.log.push({ t: now, id: cardId, r: rating });
    if (state.log.length > 8000) state.log = state.log.slice(-6000);
    bumpStreak(now);
    save();
    return next;
  }
  function bumpStreak(now) {
    var k = dayKey(now);
    if (state.streak.last === k) return;
    if (state.streak.last && dayDiff(k, state.streak.last) === 1) state.streak.count++;
    else state.streak.count = 1;
    state.streak.last = k;
    if (state.streak.count > state.streak.best) state.streak.best = state.streak.count;
  }

  // ---------------------------------------------------------------- cozi
  function activeCards(deckId) {
    return allCards().filter(function (c) {
      if (isSuspended(c.id)) return false;
      if (deckId) return c.deck === deckId || (c.certs || []).indexOf(deckId) >= 0 ||
        (examenById(deckId) && decurileExamenului(deckId).indexOf(c.deck) >= 0);
      return deckEnabled(c.deck);
    });
  }
  function deckCounts(deckId, now) {
    now = now || Date.now();
    var cards = activeCards(deckId);
    var r = { nou: 0, invat: 0, rev: 0, total: cards.length };
    for (var i = 0; i < cards.length; i++) {
      var s = sched(cards[i].id);
      if (s.st === "new") r.nou++;
      else if (s.st === "learn" || s.st === "relearn") { if (s.due <= now) r.invat++; }
      else if (s.due <= now) r.rev++;
    }
    return r;
  }
  function buildQueue(deckId, now) {
    now = now || Date.now();
    rollDay();
    var cards = activeCards(deckId);
    var learn = [], rev = [], nou = [];
    for (var i = 0; i < cards.length; i++) {
      var c = cards[i], s = sched(c.id);
      if (s.st === "new") nou.push(c);
      else if (s.st === "learn" || s.st === "relearn") { if (s.due <= now) learn.push(c); }
      else if (s.due <= now) rev.push(c);
    }
    learn.sort(function (a, b) { return sched(a.id).due - sched(b.id).due; });
    rev.sort(function (a, b) { return sched(a.id).due - sched(b.id).due; });
    shuffle(nou);
    var revLimit = Math.max(0, state.settings.maxRev - state.daily.revDone);
    var newLimit = Math.max(0, state.settings.newPerDay - state.daily.newDone);
    rev = rev.slice(0, revLimit);
    nou = nou.slice(0, newLimit);
    // intercalare: review-urile primele, cu carduri noi presarate uniform
    var q = learn.concat(interleave(rev, nou));
    return q;
  }
  function interleave(a, b) {
    if (!b.length) return a.slice();
    if (!a.length) return b.slice();
    var out = [], ratio = a.length / b.length, acc = 0, i = 0, j = 0;
    while (i < a.length || j < b.length) {
      if (j < b.length && (acc >= ratio || i >= a.length)) { out.push(b[j++]); acc -= ratio; }
      else if (i < a.length) { out.push(a[i++]); acc += 1; }
      else out.push(b[j++]);
    }
    return out;
  }
  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  // ---------------------------------------------------------------- UI: rutare
  var ui = { screen: "home", queue: [], qIndex: 0, deckId: null, revealed: false,
             browseFilter: "", browseDeck: "", browseKey: null, browseLimit: 100,
             editing: null, sessionDone: 0, sessionStart: 0 };

  function show(screen) {
    if (ui.activeFlow) { save(true); ui.activeFlow = null; }
    ui.screen = screen;
    ["home", "learn", "browse", "stats", "settings"].forEach(function (s) {
      var sec = document.getElementById("sc-" + s);
      if (sec) sec.hidden = (s !== screen);
      var tab = document.getElementById("tab-" + s);
      if (tab) {
        tab.classList.toggle("on", s === screen);
        // aria-current spune cititoarelor de ecran unde ești, nu doar culoarea
        if (s === screen) tab.setAttribute("aria-current", "page");
        else tab.removeAttribute("aria-current");
      }
    });
    $("#nav").hidden = false;
    $("#study").hidden = true;
    $("#lesson").hidden = true;
    $("#lab").hidden = true;
    if (screen === "home") renderHome();
    if (screen === "learn") renderLearn();
    if (screen === "browse") renderBrowse();
    if (screen === "stats") renderStats();
    if (screen === "settings") renderSettings();
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------- UI: acasa
  function renderHome() {
    var root = $("#home-body");
    root.innerHTML = "";
    rollDay();
    var quests = syncDailyQuests();
    var welcome=el("header","cozy-welcome"),welcomeText=el("div","cozy-welcome-text");
    welcomeText.appendChild(el("p","cozy-eyebrow","ÎNVAȚĂ · EXERSEAZĂ · CONSTRUIEȘTE"));var heading=el("h1",null,"Data engineering, ");heading.appendChild(el("span","cozy-marker","pas cu pas."));welcomeText.appendChild(heading);welcome.appendChild(welcomeText);root.appendChild(welcome);
    root.classList.add("today139");
    if(courses145Api()){
      if(!(state.courses145 && state.courses145.lastCourse)){
        var firstCourse=el("section","unit course-continue145");firstCourse.id="today-first-course147";
        firstCourse.appendChild(el("p","cozy-eyebrow","PRIMUL PAS · FUNDAMENTE"));
        firstCourse.appendChild(el("h2",null,"Începe cu SQL, de la explicație la practică"));
        firstCourse.appendChild(el("p",null,"Vei înțelege ce reprezintă un rând și cum alegi și ordonezi coloanele cu SELECT. Urmează un exemplu complet și o încercare proprie în SQLite."));
        var startCourse=el("button","btn primary","Începe cursul SQL");startCourse.id="today-start-course147";startCourse.onclick=function(){courses145Api().start("sql");};firstCourse.appendChild(startCourse);
        firstCourse.appendChild(el("p","muted","Recomandare pentru început. Poți alege oricând alt curs din Învață → Cursuri."));root.appendChild(firstCourse);
      }else courses145Api().resumeBanner(root);
    }
    var date=el("time","today-date139",new Date().toLocaleDateString("ro-RO",{weekday:"long",day:"numeric",month:"long"}));date.id="today-date139";date.dateTime=dayKey();welcomeText.insertBefore(date,welcomeText.firstChild);
    renderExperience139(root);
    appendRepairCard159(root);
    var next=undeAiRamas()[0];if(next || state.resume){var featured=el("section","cozy-featured"),resumable=!!state.resume;
      featured.appendChild(el("p","cozy-eyebrow",resumable?"SESIUNEA TA SALVATĂ":"CONTINUĂ DE UNDE AI RĂMAS"));featured.appendChild(el("h2",null,resumable?(state.resume.title || "Sesiune salvată"):next.titlu));featured.appendChild(el("p",null,resumable?"Planul și progresul tău sunt păstrate. Reia exact de unde ai rămas.":next.sub));
      var continueStudy=el("button","btn primary",resumable?"Reia sesiunea":"Continuă lecția");continueStudy.id=resumable?"resume-session":"cozy-continue";continueStudy.onclick=resumable?resumeSession:next.go;featured.appendChild(continueStudy);
      if(resumable){featured.id="today-resume139";var discard=el("button","btn mini ghost","Renunță la sesiunea salvată");discard.id="discard-session";discard.onclick=function(){state.resume=null;save(true);renderHome();};featured.appendChild(discard);root.appendChild(featured);}}
    // Fluxul Azi pornește de la o singură acțiune și traseele sunt disponibile
    // în pagina Învățare; banda veche cu cinci butoane concura cu sesiunea zilei.
    discoveryEntry129(root,"home-search-all");

    var xp = xpAzi(), goal = obiectivZi();
    var pct = Math.min(100, Math.round(xp / goal * 100));

    var ring = el("div", "ring");
    ring.style.setProperty("--p", pct + "%");ring.setAttribute("role","progressbar");ring.setAttribute("aria-label","Obiectivul zilnic de experiență");ring.setAttribute("aria-valuemin","0");ring.setAttribute("aria-valuemax",String(goal));ring.setAttribute("aria-valuenow",String(Math.min(xp,goal)));
    var inner = el("div", "ring-in");
    var xpEl = el("b", null, String(xp));
    xpEl.id = "home-xp";
    inner.appendChild(xpEl);
    inner.appendChild(el("span", null, "din " + goal + " XP"));
    ring.appendChild(inner);
    var dashboard=el("div","adventure-dashboard135");root.appendChild(dashboard);
    var session=el("section","cozy-session");session.appendChild(el("p","cozy-eyebrow","PROGRESUL DE AZI"));session.appendChild(ring);dashboard.appendChild(session);

    var p = learnProgress();
    var row = el("div", "today");
    row.appendChild(pill("Serie", state.streak.count + (state.streak.count === 1 ? " zi" : " zile")));
    row.appendChild(pill("Termeni știuți", p.stiute + "/" + p.total));
    session.appendChild(row);

    var rez = rezumatZi();
    var btn = el("button", "btn big primary", pct >= 100 ? "Continuă antrenamentul" : "Începe sesiunea de azi");
    btn.id = "btn-daily";
    if(state.resume)btn.textContent="Reia sesiunea salvată";
    btn.onclick = function () { if(state.resume)resumeSession();else startDaily(); };
    var launch=el("section","today-launch139");launch.setAttribute("aria-label","Acțiunea de studiu recomandată");launch.appendChild(btn);
    launch.appendChild(el("p","muted cozy-daily-summary",state.resume?"Sesiunea salvată are prioritate. Progresul ei este păstrat.":rez || "Ai terminat tot ce era programat pentru azi."));
    root.insertBefore(launch,root.querySelector(".today-profile139"));
    renderDailyQuests(dashboard, quests);
    if(featured && !resumable)root.appendChild(featured);

    var sec = el("div", "secundar");
    var clasic = el("button", "btn ghost", "Repetiție clasică");
    clasic.id = "btn-start-all";
    var c = deckCounts(null);
    var newLeft = Math.max(0, state.settings.newPerDay - state.daily.newDone);
    var revLeft = Math.max(0, state.settings.maxRev - state.daily.revDone);
    clasic.disabled = (Math.min(c.rev, revLeft) + c.invat + Math.min(c.nou, newLeft)) === 0;
    clasic.onclick = function () { startSession(null); };
    sec.appendChild(clasic);
    var pers = el("button", "btn ghost", "Personalizează");
    pers.id = "btn-personalizeaza";
    pers.onclick = openSetup;
    sec.appendChild(pers);
    root.appendChild(sec);

    renderPersonalHome(root);

    renderUnde(root);
  }

  function experience139(){
    var xp=Math.max(0,Number(state.learn.xp)||0),step=200;if(!Number.isFinite(xp))xp=0;
    return {xp:xp,level:Math.floor(xp/step)+1,within:xp%step,step:step,left:step-xp%step};
  }
  function renderExperience139(root){
    var data=experience139(),box=el("section","today-profile139");box.setAttribute("aria-label","Experiența acumulată prin practică");
    var badge=el("img","today-badge139");badge.src="app-icon139.svg";badge.alt="";badge.setAttribute("aria-hidden","true");box.appendChild(badge);
    var text=el("div","today-profile-text139");text.appendChild(el("p","cozy-eyebrow","JURNAL DE AVENTURĂ"));var level=el("strong",null,"Nivel "+data.level);level.id="today-level139";text.appendChild(level);text.appendChild(el("p","muted",data.xp+" XP acumulate · "+data.left+" până la nivelul următor"));
    var bar=el("progress");bar.id="today-level-progress139";bar.max=data.step;bar.value=data.within;bar.setAttribute("aria-label","Experiență în nivelul curent: "+data.within+" din "+data.step+" XP");text.appendChild(bar);text.appendChild(el("small","muted","Nivel de experiență în aplicație; nu este un scor de examen."));box.appendChild(text);root.appendChild(box);
  }
  function refreshToday139(){
    if(!state || document.visibilityState==="hidden" || ui.screen!=="home" || ui.activeFlow)return false;
    var date=$("#today-date139");if(date && date.dateTime!==dayKey()){renderHome();save(true);return true;}return false;
  }

  function adventureIcon135(id){
    var paths={understand:"M11 13H8V10H5V5H9V8H11V4H15V1H20V6H17V9H13V18H18V21H6V18H11Z",apply:"M1 20L8 5L12 12L16 3L23 20H1ZM6 17H18L15 11L12 16L8 10Z",debug:"M4 3H20V7H22V17H20V21H4V17H2V7H4ZM8 7V10H11V7ZM13 7V10H16V7ZM8 13V17H16V13Z",design:"M2 21V9H5V4H9V9H15V4H19V9H22V21H15V16H9V21ZM5 11V14H8V11ZM16 11V14H19V11Z",cert:"M7 2H17V5H22V11H19V14H16V17H14V19H18V22H6V19H10V17H8V14H5V11H2V5H7ZM4 7V10H7V7ZM17 7V10H20V7Z"};
    var svg=document.createElementNS("http://www.w3.org/2000/svg","svg");svg.setAttribute("viewBox","0 0 24 24");svg.setAttribute("aria-hidden","true");svg.setAttribute("shape-rendering","crispEdges");var path=document.createElementNS(svg.namespaceURI,"path");path.setAttribute("d",paths[id]);svg.appendChild(path);return svg;
  }
  function renderAdventure135(root){
    var hero=el("section","adventure-hero135");hero.setAttribute("aria-label","Lumea de studiu");
    var image=el("img","adventure-art135");image.src="adventure-world135.png";image.alt="";image.setAttribute("aria-hidden","true");image.decoding="async";hero.appendChild(image);
    var hud=el("div","adventure-hud135");hud.appendChild(el("span",null,"★ "+xpAzi()+" XP azi"));hud.appendChild(el("span",null,state.streak.count+" zile în serie"));hud.appendChild(el("span",null,"OFFLINE"));hero.appendChild(hud);hero.appendChild(el("div","adventure-caption135","O lume de concepte. O sesiune pe rând."));root.appendChild(hero);
    var road=el("nav","adventure-road135");road.setAttribute("aria-label","Alege nivelul de studiu");
    [["understand","Înțelege","#92e6b4"],["apply","Aplică","#85cfff"],["debug","Depanează","#c2a3ff"],["design","Proiectează","#ffd166"],["cert","Examene","#a0c5ff"]].forEach(function(pair){var b=el("button","adventure-stage135");b.setAttribute("data-adventure-stage135",pair[0]);b.style.setProperty("--stage-color",pair[2]);var medal=el("span","stage-medallion135");medal.appendChild(adventureIcon135(pair[0]));b.appendChild(medal);b.appendChild(el("span",null,pair[1]));b.setAttribute("aria-label",pair[0]==="cert"?"Deschide certificările":"Deschide traseele · "+pair[1]);b.onclick=function(){if(pair[0]!=="cert")state.settings.pathLevel135=pair[0];learnTab=pair[0]==="cert"?"cert":"paths";save(true);show("learn");};road.appendChild(b);});root.appendChild(road);
    var labs=el("div","adventure-labs135");labs.appendChild(el("p",null,"Laboratoare locale · încearcă, verifică, înțelege"));[["sql","SQL"],["py","Python"]].forEach(function(pair){var b=el("button","btn secondary",pair[1]);b.setAttribute("data-adventure-lab135",pair[0]);b.onclick=function(){if(pair[0]==="sql"){var x=labNext() || SEED.lab.exercises[0];if(x)openLab(x.id);}else{var x=pyNext() || pyAll()[0];if(x)openPyLab(x.id);}};labs.appendChild(b);});root.appendChild(labs);
  }

  /**
   * Ecranul „Azi” se termina dupa doua butoane, iar restul era gol. Aici arătăm
   * unde ai rămas în fiecare traseu, ca să poți intra direct, fără să cauți.
   */
  function undeAiRamas() {
    var out = [];
    var u = urmatoareaLectie();
    if (u) {
      out.push({ ico: icoDeck(u.deck.id), titlu: u.deck.name,
                 sub: "Lecția " + (u.lectie.idx + 1) + " din " + u.total,
                 go: function () { startLesson(u.lectie.deck, u.lectie.idx); } });
    }
    var sc = scenNext();
    if (sc) {
      var m = scenModules().filter(function (x) { return x.mod.id === sc.mod; })[0];
      out.push({ ico: "balon", titlu: m ? m.mod.nume : "Scenarii",
                 sub: m ? (m.done + " din " + m.sc.length + " rezolvate") : "",
                 go: function () { startScenModule(sc.mod); } });
    }
    var sql = labNext();
    if (sql) {
      out.push({ ico: "eprubeta", titlu: "SQL · " + sql.cap, sub: sql.titlu,
                 go: function () { openLab(sql.id); } });
    }
    var py = pyNext() || pyNeterminat();
    if (py) {
      var ramas = pyRamas(py);
      out.push({ ico: "terminal", titlu: "Python · " + py.cap,
                 sub: ramas.length ? ramas.join(" · ") + " de făcut" : py.titlu,
                 go: function () { openPyLab(py.id); } });
    }
    return out;
  }
  /** Primul laborator rezolvat căruia îi lipsește variația sau justificarea. */
  function pyNeterminat() {
    var a = pyAll();
    for (var i = 0; i < a.length; i++) if (!pyComplet(a[i])) return a[i];
    return null;
  }
  function urmatoareaLectie() {
    var units = learnUnits();
    for (var i = 0; i < units.length; i++) {
      for (var j = 0; j < units[i].lessons.length; j++) {
        if (!units[i].lessons[j].done) {
          return { deck: units[i].deck, lectie: units[i].lessons[j],
                   total: units[i].lessons.length };
        }
      }
    }
    return null;
  }

  function renderUnde(root) {
    var list = undeAiRamas();
    if (!list.length) return;
    root.appendChild(el("h2", "sec-title", "Unde ai rămas"));
    var card = el("div", "undelist");
    list.forEach(function (x) {
      var row = el("button", "exrow undelist-r");
      row.appendChild(ico(x.ico, "deck-ico"));
      var m = el("div", "exrow-m");
      m.appendChild(el("div", "exrow-t", x.titlu));
      if (x.sub) m.appendChild(el("div", "exrow-s", x.sub));
      row.appendChild(m);
      row.appendChild(ico("joaca", "undelist-go"));
      row.setAttribute("data-unde", x.ico);
      row.onclick = x.go;
      card.appendChild(row);
    });
    root.appendChild(card);
  }

  /**
   * Stare goală: un cadru de grafic fără bare nu spune nimic. Spunem ce
   * lipsește și ce o umple.
   */
  function gol(pictograma, titlu, text) {
    var b = el("div", "gol");
    b.appendChild(ico(pictograma, "gol-ico"));
    var m = el("div");
    m.appendChild(el("div", "gol-t", titlu));
    if (text) m.appendChild(el("p", "gol-s", text));
    b.appendChild(m);
    return b;
  }

  /**
   * Motoarele SQL și Python se încarcă la prima folosire (sute de kilobaiți de
   * WebAssembly, respectiv interpretor). Un ecran gol cu o linie de text pare
   * aplicație blocată; un schelet arată că se întâmplă ceva și cât va ocupa.
   */
  function scheletLaborator(eticheta) {
    var b = el("div", "schelet");
    var cap = el("div", "schelet-cap");
    cap.appendChild(el("span", "spin"));
    cap.appendChild(el("span", null, eticheta));
    b.appendChild(cap);
    [78, 96, 62].forEach(function (w) {
      var l = el("div", "sk sk-l");
      l.style.width = w + "%";
      b.appendChild(l);
    });
    b.appendChild(el("div", "sk sk-box"));
    return b;
  }

  function pill(label, val) {
    var p = el("div", "pill");
    p.appendChild(el("span", "pill-l", label));
    p.appendChild(el("span", "pill-v", val));
    return p;
  }
  function cnt(kind, n) {
    var c = el("span", "cnt c-" + kind, String(n));
    c.title = kind;
    return c;
  }
  function nextDueText(now) {
    var cards = activeCards(null), best = null;
    for (var i = 0; i < cards.length; i++) {
      var s = sched(cards[i].id);
      if (s.st !== "new" && s.due > now && (best === null || s.due < best)) best = s.due;
    }
    if (best === null) return "";
    return "Următorul card peste " + fmtIvl(best - now) + ".";
  }

  // ---------------------------------------------------------------- UI: sesiune
  function startSession(deckId) {
    ui.deckId = deckId;
    ui.queue = buildQueue(deckId);
    ui.qIndex = 0;
    ui.sessionDone = 0;
    ui.sessionStart = Date.now();
    if (!ui.queue.length) { toast("Nimic de învățat aici acum."); return; }
    ui.activeFlow = "study";
    $("#nav").hidden = true;
    $("#study").hidden = false;
    showCard();
  }
  function endSession() {
    save(true); ui.activeFlow = null;
    $("#study").hidden = true;
    $("#nav").hidden = false;
    flush();
    show("home");
    if (ui.sessionDone > 0) {
      var secs = Math.round((Date.now() - ui.sessionStart) / 1000);
      toast(ui.sessionDone + " carduri în " + (secs < 60 ? secs + "s" : Math.round(secs / 60) + " min"));
    }
  }
  function currentCard() {
    while (ui.qIndex < ui.queue.length) {
      var c = ui.queue[ui.qIndex];
      if (c && cardById(c.id) && !isSuspended(c.id)) return c;
      ui.qIndex++;
    }
    return null;
  }
  // ---------------------------------------------------------- cititorul pe pași
  // Pașii se pot sări: nota se poate da din oricare. O repetare a unui card
  // știut n-are de ce să coste trei ecrane.
  var pasStare = null;

  function pasCorp(gazda, p, c) {
    gazda.innerHTML = "";
    var i = pasStare.i;

    if (i === 0) {
      gazda.appendChild(el("div", "pas-h", "Ideea esențială"));
      var d = el("div", "md");
      d.innerHTML = renderMd(p.idee);
      gazda.appendChild(d);
      if (p.cheie) {
        var k = el("div", "cheie");
        k.appendChild(el("div", "cheie-et", "DE REȚINUT"));
        var kd = el("div", "md");
        kd.innerHTML = renderMd(p.cheie);
        k.appendChild(kd);
        gazda.appendChild(k);
      }
      if (p.slaba) {
        gazda.appendChild(el("div", "slab",
          "Ideea e extrasă automat din răspuns și încă n-a fost rescrisă de mână."));
      }
      return;
    }

    if (i === 1) {
      gazda.appendChild(el("div", "pas-h", p.doi.eticheta));
      var e = el("div", "md");
      e.innerHTML = renderMd(p.doi.text);
      gazda.appendChild(e);
      // Greșeala frecventă stă lângă explicație, nu la final: e confuzia pe care
      // trebuie să o recunoști exact când înțelegi mecanismul.
      if (p.greseala) {
        var g = el("div", "greseala");
        g.appendChild(el("div", "cheie-et", "GREȘEALA FRECVENTĂ"));
        var gd = el("div", "md");
        gd.innerHTML = renderMd(p.greseala);
        g.appendChild(gd);
        gazda.appendChild(g);
      }
      return;
    }

    // pasul 3 — exersare
    gazda.appendChild(el("div", "pas-h", p.exersare.mode === "recall" ? "Verifică ideea" : "Aplică ideea"));
    if (p.exersare.mode === "recall") gazda.appendChild(el("p", "muted",
      "Explică din memorie, apoi compară cu răspunsul cardului. Aceasta este o verificare de înțelegere; aplicațiile și scenariile asociate verifică transferul."));
    var q = el("div", "md");
    q.innerHTML = renderMd(p.exersare.intrebare);
    gazda.appendChild(q);

    var ta = el("textarea", "ex-ta");
    ta.placeholder = "Aș spune că…";
    ta.value = pasStare.text || "";
    ta.oninput = function () { pasStare.text = ta.value.slice(0,20000); save(); };
    gazda.appendChild(ta);

    if (pasStare.vazut) {
      var m = el("div", "ex-model");
      m.appendChild(el("div", "cheie-et", "O VARIANTĂ BUNĂ"));
      var md = el("div", "md");
      md.innerHTML = renderMd(p.exersare.model);
      m.appendChild(md);
      gazda.appendChild(m);
    } else {
      var b = el("button", "btn primary", "Compară cu explicația");
      b.style.width = "100%";
      b.onclick = function () {
        pasStare.vazut = true;
        pasCorp(gazda, p, c);
        save();
      };
      gazda.appendChild(b);
    }
  }

  function pasiMount(gazda, p, c) {
    gazda.innerHTML = "";
    var etichete = ["Înțelege", p.doi.eticheta];
    if (p.exersare) etichete.push("Exersează");

    var tabs = el("div", "pas-tabs");
    tabs.setAttribute("role", "tablist");
    var corp = el("div", "pas-corp");

    etichete.forEach(function (et, idx) {
      var t = el("button", "pas-t" + (idx === pasStare.i ? " sel" : ""));
      t.setAttribute("role", "tab");
      t.setAttribute("aria-selected", idx === pasStare.i ? "true" : "false");
      t.appendChild(el("b", null, String(idx + 1)));
      t.appendChild(el("span", null, et));
      t.onclick = function () {
        pasStare.i = idx;
        pasiMount(gazda, p, c);
        save();
        gazda.scrollIntoView({ block: "nearest" });
      };
      tabs.appendChild(t);
    });
    gazda.appendChild(tabs);
    gazda.appendChild(corp);
    pasCorp(corp, p, c);

    if (pasStare.i < etichete.length - 1) {
      var urm = el("button", "btn primary", "Continuă");
      urm.style.cssText = "width:100%;margin-top:14px";
      urm.onclick = function () {
        pasStare.i++;
        pasiMount(gazda, p, c);
        save();
        gazda.scrollIntoView({ block: "nearest" });
      };
      gazda.appendChild(urm);
    }

    if (p.surse && p.surse.length) {
      var sv = el("div", "surse");
      sv.appendChild(el("div", "surse-et", "SURSE PENTRU APROFUNDARE"));
      var linie = el("div");
      p.surse.forEach(function (x) {
        var a = el("a", null, x.nume);
        a.href = x.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        linie.appendChild(a);
      });
      sv.appendChild(linie);
      gazda.appendChild(sv);
    }
  }

  function showCard() {
    var c = currentCard();
    if (!c) { finishQueue(); return; }
    ui.revealed = false;
    var s = sched(c.id);
    $("#st-deck").textContent = deckById(c.deck).name;
    $("#st-state").textContent = s.st === "new" ? "nou" :
      (s.st === "learn" ? "în învățare" : s.st === "relearn" ? "reînvățare" : "repetare");
    $("#st-state").className = "badge b-" + s.st;
    var left = ui.queue.length - ui.qIndex;
    $("#st-left").textContent = left + " rămase";
    $("#st-bar").style.width = (ui.queue.length ? (ui.qIndex / ui.queue.length * 100) : 0) + "%";
    $("#st-q").innerHTML = renderMd(c.q);
    // nivelul și rezumatul stau lângă întrebare, vizibile înainte de răspuns
    var p = imparteCard(c);
    pasStare = ui.restoredPas || { i: 0, text: "", vazut: false };
    ui.restoredPas = null;
    $("#st-nivel").innerHTML = "";
    if (p) {
      $("#st-nivel").appendChild(el("span", "nivel n-" + p.nivel, p.nivel));
      if (p.tip) $("#st-nivel").appendChild(el("span", "nivel tip", p.tip));
      if (p.rezumat) $("#st-nivel").appendChild(el("div", "rezumat", p.rezumat));
    }
    if (p) {
      $("#st-a").innerHTML = "";
      pasiMount($("#st-a"), p, c);
    } else {
      $("#st-a").innerHTML = renderMd(c.a);
    }
    $("#st-tags").innerHTML = "";
    (c.tags || []).forEach(function (t) { $("#st-tags").appendChild(el("span", "tag", t)); });
    $("#st-answer").hidden = true;
    $("#st-rate").hidden = true;
    $("#st-reveal").hidden = false;
    $("#st-scroll").scrollTop = 0;
    libraryControls($("#st-nivel"), "card", c.id);
    appendRelated($("#st-a"),c.id);
    if(ui.lastMistake){var review=el("button","btn secondary","Revezi ultimul card dificil");review.id="review-last-mistake";review.onclick=function(){openRelatedExplanation("card",ui.lastMistake);};$("#st-nivel").appendChild(review);}
    save(true);
  }
  function reveal() {
    var c = currentCard();
    if (!c || ui.revealed) return;
    ui.revealed = true;
    $("#st-answer").hidden = false;
    $("#st-reveal").hidden = true;
    $("#st-rate").hidden = false;
    var s = sched(c.id), now = Date.now();
    [[AGAIN, "again"], [HARD, "hard"], [GOOD, "good"], [EASY, "easy"]].forEach(function (p) {
      var n = nextState(s, p[0], now);
      var lbl = document.getElementById("iv-" + p[1]);
      if (lbl) lbl.textContent = fmtIvl(Math.max(0, n.due - now));
    });
  }
  function rate(r) {
    var c = currentCard();
    if (!c || !ui.revealed) return;
    if(r<GOOD)ui.lastMistake=c.id;
    var next = answer(c.id, r, Date.now());
    ui.sessionDone++;
    ui.qIndex++;
    // cardurile ratate / in invatare se reintroduc mai tarziu in coada
    if (next.st === "learn" || next.st === "relearn") {
      var pos = Math.min(ui.queue.length, ui.qIndex + 3);
      ui.queue.splice(pos, 0, c);
    }
    showCard();
  }
  function finishQueue() {
    var done = ui.sessionDone;
    state.resume = null; ui.activeFlow = null; save(true);
    $("#st-q").innerHTML = "";
    $("#study").hidden = true;
    $("#nav").hidden = false;
    show("home");
    if (done > 0) {
      var secs = Math.round((Date.now() - ui.sessionStart) / 1000);
      toast("Gata! " + done + " carduri în " + (secs < 60 ? secs + "s" : Math.round(secs / 60) + " min"));
    } else toast("Nimic de învățat acum.");
    flush();
  }

  // ---------------------------------------------------------------- UI: browse
  var contentFilterState = {};
  var LEARNING_LEVELS = [["understand", "Înțelegere"], ["apply", "Aplicare"],
    ["debug", "Depanare"], ["design", "Proiectare"]];
  function contentFilters(host, scope, changed, withDeck) {
    var values = contentFilterState[scope] || (contentFilterState[scope] = {});
    var bar = el("div", "content-filters");
    function select(key, label, pairs) {
      var field = el("label", "filter-field"); field.appendChild(el("span", null, label));
      var control = el("select"); control.id = scope + "-" + key;
      control.setAttribute("aria-label", label);
      [["", "Toate"]].concat(pairs).forEach(function (pair) {
        var o = el("option", null, pair[1]); o.value = pair[0]; control.appendChild(o);
      });
      control.value = values[key] || "";
      control.onchange = function () { values[key] = control.value; changed(); };
      field.appendChild(control); bar.appendChild(field);
    }
    if (withDeck) select("deck", "Domeniu", allDecks().filter(function (d) {
      return d.id !== "custom";
    }).map(function (d) {
      var count = scope === "scenarios-filter" ? scenAll().filter(function(s) {
        return s.deck === d.id || (s.domains || []).indexOf(d.id) >= 0;
      }).length : null;
      return [d.id, d.name + (count === null ? "" : " (" + count + ")")];
    }));
    select("level", "Nivel", LEARNING_LEVELS);
    select("cert", "Certificare", examene().filter(function (e) { return !!e.furnizor; })
      .map(function (e) { return [e.id, e.cod]; }));
    if(scope==="cards-filter")select("personal","Colecția mea",[["favorite","Favorite"],["notes","Cu notițe"]]);
    host.appendChild(bar);
    return function (item) {
      if(values.personal==="favorite" && !state.library.favorites["card:"+item.id])return false;
      if(values.personal==="notes" && !noteText("card:"+item.id).trim())return false;
      if (values.deck && item.deck !== values.deck && (item.domains || []).indexOf(values.deck) < 0) return false;
      if (values.level && item.level !== values.level && (item.levels || []).indexOf(values.level) < 0) return false;
      if (values.cert && (item.certs || []).indexOf(values.cert) < 0 && item.deck !== values.cert &&
          !(item.deck || "").startsWith(values.cert + "-m")) return false;
      return true;
    };
  }
  function renderBrowse() {
    var root = $("#browse-list");
    root.innerHTML = "";
    var sel = $("#browse-deck");
    if (sel.options.length <= 1) {
      allDecks().forEach(function (d) {
        var o = el("option", null, d.name);
        o.value = d.id;
        sel.appendChild(o);
      });
    }
    sel.value = ui.browseDeck;
    $("#browse-q").value = ui.browseFilter;

    var advanced = $("#browse-advanced");
    if (!advanced) { advanced = el("div"); advanced.id = "browse-advanced"; root.parentNode.insertBefore(advanced, root); }
    advanced.innerHTML = "";
    var matchesFilter = contentFilters(advanced, "cards-filter", renderBrowse, false);
    var q = searchKey(ui.browseFilter.trim());
    var list = allCards().filter(function (c) {
      if (ui.browseDeck && c.deck !== ui.browseDeck) return false;
      if (!matchesFilter(c)) return false;
      if (!q) return true;
      return searchKey(c.q + " " + c.a + " " + (c.tags || []).join(" ") + " " +
        (c.aliases || []).join(" ") + " " + noteText("card:"+c.id)).indexOf(q) >= 0;
    });
    $("#browse-count").textContent = list.length + (list.length === 1 ? " card" : " carduri");
    var browseKey = ui.browseDeck + "\n" + q + JSON.stringify(contentFilterState["cards-filter"] || {});
    if (ui.browseKey !== browseKey) {
      ui.browseKey = browseKey;
      ui.browseLimit = 100;
    }
    function appendRange(from, to) {
    list.slice(from, to).forEach(function (c) {
      var s = sched(c.id);
      var row = el("div", "brow" + (isSuspended(c.id) ? " susp" : ""));
      var top = el("div", "brow-top");
      top.appendChild(ico(icoDeck(c.deck), "brow-ico"));
      // mdInline, nu renderMd: rândul e de o linie, n-are loc de paragrafe
      var bq = el("span", "brow-q");
      bq.innerHTML = mdInline(c.q);
      top.appendChild(bq);
      row.appendChild(top);
      // Eticheta „nou” pe toate cele 472 de rânduri era zgomot: starea implicită
      // nu spune nimic. O arătăm doar când cardul a ieșit din starea inițială.
      var sub = el("div", "brow-sub");
      if (s.st !== "new") {
        sub.appendChild(el("span", "badge b-" + s.st,
          s.st === "review" ? "repetare" : s.st === "relearn" ? "reînvățare" : "învățare"));
      }
      if (s.st === "review") sub.appendChild(el("span", "muted", "interval " + fmtIvl(s.ivl)));
      if (isSuspended(c.id)) sub.appendChild(el("span", "badge b-susp", "suspendat"));
      if (sub.childNodes.length) row.appendChild(sub);
      row.onclick = function () { openDetail(c); };
      root.appendChild(row);
    });
    }
    var shown = Math.min(ui.browseLimit, list.length);
    appendRange(0, shown);
    var more = el("button", "btn secondary", "");
    more.type = "button";
    more.setAttribute("data-browse-more", "true");
    function offerMore() {
      if (shown >= list.length) return;
      more.textContent = "Mai încarcă " + Math.min(100, list.length - shown) +
        " · " + shown + " din " + list.length;
      root.appendChild(more);
    }
    more.onclick = function () {
      root.removeChild(more);
      var next = Math.min(shown + 100, list.length);
      appendRange(shown, next);
      shown = next;
      ui.browseLimit = shown;
      offerMore();
    };
    offerMore();
    if (!list.length) {
      root.appendChild(gol("carduri", q ? "Niciun card pentru „" + ui.browseFilter.trim() + "”"
                                        : "Niciun card aici",
        q ? "Încearcă alt cuvânt sau șterge filtrul de deck."
          : "Adaugă primul card cu butonul de sus."));
    }
  }
  function openDetail(c) {
    var s = sched(c.id);
    var m = $("#modal");
    var body = $("#modal-body");
    $("#modal-title").textContent = deckById(c.deck).name;
    body.innerHTML = "";
    var qd = el("div", "md q"); qd.innerHTML = renderMd(c.q); body.appendChild(qd);
    body.appendChild(el("hr"));
    var ad = el("div", "md"); ad.innerHTML = renderMd(c.a); body.appendChild(ad);
    libraryControls(body,"card",c.id);
    appendRelated(body,c.id);
    if (c.aut && c.aut.g) {
      var trap = el("div", "cheie");
      trap.appendChild(el("div", "cheie-et", "GREȘEALĂ FRECVENTĂ"));
      trap.appendChild(el("p", null, c.aut.g));
      body.appendChild(trap);
    }
    if (c.aut && c.aut.s && c.aut.s.length) {
      var cardSources = el("div", "surse");
      cardSources.appendChild(el("div", "surse-et", "SURSE PENTRU APROFUNDARE"));
      c.aut.s.forEach(function (source) {
        if (!/^https:\/\//i.test(source[1])) return;
        var link = el("a", null, source[0]);
        link.href = source[1];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        var line = el("p"); line.appendChild(link);
        cardSources.appendChild(line);
      });
      body.appendChild(cardSources);
    }
    var info = el("div", "detail-info");
    info.appendChild(el("span", "muted", "Repetări: " + (s.reps || 0)));
    info.appendChild(el("span", "muted", "Lapsuri: " + (s.lapses || 0)));
    if (s.st === "review") info.appendChild(el("span", "muted", "Interval: " + fmtIvl(s.ivl)));
    if (s.st !== "new") info.appendChild(el("span", "muted", "Scadent: " +
      (s.due <= Date.now() ? "acum" : "peste " + fmtIvl(s.due - Date.now()))));
    if (s.ease) info.appendChild(el("span", "muted", "Ease: " + Math.round(s.ease * 100) / 100));
    body.appendChild(info);

    var acts = el("div", "modal-acts");
    var bSusp = el("button", "btn mini", isSuspended(c.id) ? "Reactivează" : "Suspendă");
    bSusp.onclick = function () {
      var sc = state.sched[c.id] || sched(c.id);
      sc.susp = !sc.susp;
      state.sched[c.id] = sc;
      save(true); closeModal(); renderBrowse();
    };
    acts.appendChild(bSusp);
    var bReset = el("button", "btn mini", "Resetează progresul");
    bReset.onclick = function () {
      delete state.sched[c.id];
      save(true); closeModal(); renderBrowse(); toast("Progres resetat.");
    };
    acts.appendChild(bReset);
    if (isCustom(c.id)) {
      var bEdit = el("button", "btn mini", "Editează");
      bEdit.onclick = function () { closeModal(); openEditor(c); };
      acts.appendChild(bEdit);
      var bDel = el("button", "btn mini danger", "Șterge");
      bDel.onclick = function () {
        if (!confirm("Ștergi cardul definitiv?")) return;
        state.custom = state.custom.filter(function (x) { return x.id !== c.id; });
        delete state.sched[c.id];
        delete state.library.favorites["card:"+c.id];delete state.library.notes["card:"+c.id];
        save(true); closeModal(); renderBrowse(); toast("Card șters.");
      };
      acts.appendChild(bDel);
    }
    body.appendChild(acts);
    m.hidden = false;
  }
  function isCustom(id) {
    return state.custom.some(function (x) { return x.id === id; });
  }
  function closeModal() { $("#modal").hidden = true; }

  // Fixed overlays must isolate both accessibility and keyboard interaction.
  // Observe their visibility so every existing open/close route uses one policy.
  function installOverlayAccessibility146() {
    var ids = ["study", "lesson", "lab", "setup", "modal", "editor"];
    var layers = ids.map(function (id) { return document.getElementById(id); });
    var roots = Array.prototype.filter.call(document.body.children, function (node) {
      return /^(HEADER|SECTION|NAV)$/.test(node.tagName) || layers.indexOf(node) >= 0;
    });
    var original = new Map(), returnFocus = new Map(), active = null;
    roots.forEach(function (node) {
      original.set(node, { inert: node.getAttribute("inert"), hidden: node.getAttribute("aria-hidden") });
    });
    var labels = { study: "Repetiție cu carduri", lesson: "Lecție și exerciții",
      lab: "Material de învățare și practică", setup: "Configurarea învățării" };
    layers.forEach(function (node) {
      node.setAttribute("role", "dialog");
      node.setAttribute("tabindex", "-1");
      if (labels[node.id]) node.setAttribute("aria-label", labels[node.id]);
    });
    $("#modal").setAttribute("aria-labelledby", "modal-title");
    $("#editor").setAttribute("aria-labelledby", "ed-title");
    $("#setup").setAttribute("aria-describedby", "su-step");
    function restoreAttribute(node, name, value) {
      if (value === null) node.removeAttribute(name); else node.setAttribute(name, value);
    }
    function usable(node) {
      return node && node !== document.body && node !== document.documentElement &&
        node.isConnected && !node.closest("[hidden],[inert]") &&
        node.getClientRects().length && typeof node.focus === "function";
    }
    function focus(node) {
      try { node.focus({ preventScroll: true }); } catch (e) { node.focus(); }
    }
    function sync() {
      var visible = layers.filter(function (node) { return !node.hidden; });
      visible.sort(function (a, b) {
        return (parseInt(getComputedStyle(a).zIndex, 10) || 0) -
          (parseInt(getComputedStyle(b).zIndex, 10) || 0) || layers.indexOf(a) - layers.indexOf(b);
      });
      var next = visible.length ? visible[visible.length - 1] : null;
      if (next === active) return;
      var previous = active, opener = document.activeElement;
      if (next && (!previous || !next.contains(previous))) {
        if (!returnFocus.has(next)) returnFocus.set(next, opener);
      }
      active = next;
      // Unhide the destination before moving focus; never aria-hide focused content.
      roots.forEach(function (node) {
        var saved = original.get(node);
        restoreAttribute(node, "inert", saved.inert);
        restoreAttribute(node, "aria-hidden", saved.hidden);
      });
      layers.forEach(function (node) {
        if (node === active) node.setAttribute("aria-modal", "true");
        else node.removeAttribute("aria-modal");
      });
      var restore = previous && returnFocus.get(previous);
      if (previous && previous.hidden) returnFocus.delete(previous);
      if (active) {
        if (usable(restore) && active.contains(restore)) focus(restore);
        else if (!active.contains(document.activeElement)) focus(active);
        roots.forEach(function (node) {
          if (node !== active) { node.setAttribute("inert", ""); node.setAttribute("aria-hidden", "true"); }
        });
      } else if (usable(restore)) focus(restore);
      else if (previous) {
        var fallback = document.querySelector('#nav [aria-current="page"]');
        if (usable(fallback)) focus(fallback);
      }
    }
    document.addEventListener("focusin", function (event) {
      if (active && !active.contains(event.target)) focus(active);
    }, true);
    document.addEventListener("click", function (event) {
      if (active && !active.contains(event.target)) {
        event.preventDefault(); event.stopImmediatePropagation();
      }
    }, true);
    document.addEventListener("keydown", function (event) {
      if (!active || event.key !== "Tab") return;
      var targets = Array.prototype.filter.call(active.querySelectorAll(
        'button,input,select,textarea,a[href],[tabindex],[contenteditable="true"]'), function (node) {
        return !node.disabled && node.tabIndex >= 0 && usable(node);
      });
      var first = targets[0], last = targets[targets.length - 1];
      if (!first) { event.preventDefault(); focus(active); }
      else if (event.shiftKey && (document.activeElement === first || document.activeElement === active)) {
        event.preventDefault(); focus(last);
      } else if (!event.shiftKey && (document.activeElement === last || !active.contains(document.activeElement))) {
        event.preventDefault(); focus(first);
      }
    }, true);
    var observer = new MutationObserver(sync);
    layers.forEach(function (node) { observer.observe(node, { attributes: true, attributeFilter: ["hidden"] }); });
    sync();
  }

  var scheduleFocusedEditable146 = null;
  function installFocusedEditable146() {
    var frame = null, delays = [], capped = null;
    function clearCap() {
      if (!capped) return;
      capped.classList.remove("focused-editable146");
      capped.style.removeProperty("--editable-space146");
      capped = null;
    }
    function reveal() {
      frame = null;
      var field = document.activeElement;
      clearCap();
      if (!field || !field.matches('textarea,input:not([type="checkbox"]):not([type="radio"]):not([type="range"]),[contenteditable="true"]') ||
          field.closest("[hidden],[inert]")) return;
      var panel = field.closest("#lab-scroll,#ls-scroll,#st-scroll,#su-scroll,.sheet-b");
      if (!panel || !panel.getClientRects().length) return;
      var rect = panel.getBoundingClientRect(), viewport = window.visualViewport;
      var visibleTop = viewport ? viewport.offsetTop : 0;
      var visibleBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
      var top = Math.max(rect.top, visibleTop) + 12;
      var bottom = Math.min(rect.bottom, visibleBottom) - 12;
      var layer = panel.closest("#lab,#lesson,#study,#setup,#modal,#editor");
      var footer = layer && layer.querySelector(".lab-foot,.ls-foot,.st-foot,.su-wrap,.sheet-f");
      if (footer && footer.getClientRects().length) bottom = Math.min(bottom, footer.getBoundingClientRect().top - 12);
      if (bottom - top < 24) return;
      var bounds = field.getBoundingClientRect();
      // A manually enlarged editor must fit too; its text keeps its own scrolling.
      if (field.tagName === "TEXTAREA" && bounds.height > bottom - top) {
        field.style.setProperty("--editable-space146", (bottom - top) + "px");
        field.classList.add("focused-editable146");
        capped = field;
        bounds = field.getBoundingClientRect();
      }
      var delta = bounds.bottom > bottom ? bounds.bottom - bottom :
        (bounds.top < top ? bounds.top - top : 0);
      if (Math.abs(delta) > 1) panel.scrollTop += delta;
    }
    scheduleFocusedEditable146 = function () {
      if (frame !== null) cancelAnimationFrame(frame);
      delays.forEach(clearTimeout);
      frame = requestAnimationFrame(reveal);
      // Native IME and visual viewport animations can finish after the focus event.
      delays = [80, 240].map(function (ms) { return setTimeout(function () {
        if (frame !== null) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(reveal);
      }, ms); });
    };
    document.addEventListener("focusin", scheduleFocusedEditable146);
    document.addEventListener("focusout", function () { clearCap(); });
    document.addEventListener("input", function (event) {
      if (event.target === document.activeElement) scheduleFocusedEditable146();
    });
    window.addEventListener("resize", scheduleFocusedEditable146);
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", scheduleFocusedEditable146);
      window.visualViewport.addEventListener("scroll", scheduleFocusedEditable146);
    }
  }

  // ---------------------------------------------------------------- UI: editor
  function openEditor(card) {
    ui.editing = card || null;
    var sel = $("#ed-deck");
    sel.innerHTML = "";
    allDecks().forEach(function (d) {
      var o = el("option", null, d.name);
      o.value = d.id;
      sel.appendChild(o);
    });
    sel.value = card ? card.deck : CUSTOM_DECK.id;
    $("#ed-q").value = card ? card.q : "";
    $("#ed-a").value = card ? card.a : "";
    $("#ed-tags").value = card && card.tags ? card.tags.join(", ") : "";
    $("#ed-title").textContent = card ? "Editează cardul" : "Card nou";
    $("#editor").hidden = false;
  }
  function saveEditor() {
    var q = $("#ed-q").value.trim(), a = $("#ed-a").value.trim();
    if (!q || !a) { toast("Completează întrebarea și răspunsul."); return; }
    var tags = $("#ed-tags").value.split(",").map(function (t) { return t.trim(); })
      .filter(function (t) { return t; });
    if (ui.editing) {
      ui.editing.q = q; ui.editing.a = a; ui.editing.tags = tags;
      ui.editing.deck = $("#ed-deck").value;
    } else {
      state.custom.push({
        id: "u-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e4).toString(36),
        deck: $("#ed-deck").value, q: q, a: a, tags: tags, created: Date.now()
      });
    }
    save(true);
    $("#editor").hidden = true;
    ui.editing = null;
    renderBrowse();
    toast("Card salvat.");
  }

  // ---------------------------------------------------------------- Lecții
  var LESSON_SIZE = 6, MAX_HEARTS = 5, XP_CORECT = 2, XP_LECTIE = 10;
  // De câte ori poate reveni un termen greșit în aceeași lecție. Fără plafon,
  // cu vieți oprite coada crește la fiecare greșeală și lecția nu se mai termină.
  var MAX_RELUARI = 2;
  var MAX_STRENGTH = 5;
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
      var m = /^(.*?)\s*\(([^)]+)\)\s*$/.exec(name);
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
        var esc = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        out = out.replace(new RegExp("(^|[^\\wăâîșțĂÂÎȘȚ])" + esc + "(?=$|[^\\wăâîșțĂÂÎȘȚ])", "gi"), "$1___");
      });
    return out;
  }
  function recallHint(term) {
    var name = termAnswers(term).filter(function (a) { return a.length <= 32; })
      .sort(function (a, b) { return a.length - b.length; })[0] || term.t;
    return name.split("").map(function (ch, i) {
      return /[\s\-_.()\/]/.test(ch) ? ch : (i === 0 || /[\s\-_.(\/]/.test(name[i - 1]) ? ch : "·");
    }).join("");
  }

  function appendLearningSources(root, sources) {
    if (!sources || !sources.length) return;
    var box = el("div", "surse");
    box.appendChild(el("div", "surse-et", "SURSE PENTRU APROFUNDARE"));
    sources.forEach(function (source) {
      if(!Array.isArray(source))source=[source.nume,source.url];
      if (!/^https:\/\//i.test(source[1])) return;
      var link = el("a", null, source[0]);
      link.href = source[1]; link.target = "_blank";
      link.rel = "noopener noreferrer";
      var line = el("p"); line.appendChild(link); box.appendChild(line);
    });
    root.appendChild(box);
  }

  function searchKey(value) {
    return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function appendTermOrigin(host,term){
    var origin=term.origin;
    if(!origin)return;
    var box=el("section","hint term-origin");
    box.setAttribute("data-term-origin",term.id);
    box.setAttribute("aria-label","De unde vine termenul");
    box.appendChild(el("h3",null,"De unde vine termenul"));
    box.appendChild(el("p",null,"Familie de concepte: "+origin.concept));
    box.appendChild(el("p",null,"Tehnologie / context: "+origin.technology));
    (origin.expansions || []).forEach(function(x){
      box.appendChild(el("p","mono",x.short+" = "+x.full));
    });
    if(origin.note)box.appendChild(el("p",null,origin.note));
    if(origin.context!==origin.technology)box.appendChild(el("p","muted","Îl studiezi aici în: "+origin.context));
    var sources=[];
    if(origin.source)sources.push(origin.source);
    (origin.expansions || []).forEach(function(x){if(sources.indexOf(x.source)<0)sources.push(x.source);});
    sources.forEach(function(url){
      if(!/^https:\/\//i.test(url))return;
      var a=el("a",null,"Documentația denumirii");a.href=url;a.target="_blank";a.rel="noopener noreferrer";
      var line=el("p","muted");line.appendChild(a);box.appendChild(line);
    });
    host.appendChild(box);
  }
  function termOriginText(term){
    var o=term.origin || {};
    return [o.concept,o.technology,o.context,o.note].concat((o.expansions || []).map(function(x){return x.short+" "+x.full;})).join(" ");
  }
  function appendTermDetails(host,term,originShown){
    if(!originShown)appendTermOrigin(host,term);
    if(term.studyQuality134){var quality=term.studyQuality134;host.appendChild(el("p","term-quality134",quality.format==="extended"?"Fișă dezvoltată · explicație, exemplu și verificare proprie":"Fișă de referință · definiție scurtă"));if(quality.flags.length){var gaps=el("details","unit");gaps.appendChild(el("summary",null,"Ce mai lipsește acestei fișe"));quality.flags.forEach(function(f){gaps.appendChild(el("p","muted",f));});host.appendChild(gaps);}}
    appendKnowledgeLink129(host,term.id,"term");
    if(term.canonicalId){var canonical=termById(term.canonicalId);if(canonical){host.appendChild(el("p","muted","Denumire alternativă pentru "+canonical.t+". Istoricul acestei intrări se păstrează."));var link=el("button","btn mini secondary","Deschide conceptul · "+canonical.t);link.onclick=function(){openSaved({kind:"term",id:canonical.id,material:canonical});};host.appendChild(link);}}
    if(term.detail)sectiuneMd(host,"În detaliu",term.detail);
    if(term.example)sectiuneMd(host,"Exemplu",term.example);
    if(term.check){var check=el("details","unit");check.appendChild(el("summary",null,"Verifică-te · "+term.check.q));sectiuneMd(check,"Răspuns argumentat",term.check.a);host.appendChild(check);}
  }
  function openGlossary() {
    var body=$("#modal-body");body.innerHTML="";$("#modal-title").textContent="Glosar · "+allTerms().length+" concepte";
    var raw=state.settings.glossary || {},prefs={quality:["all","extended","reference"].indexOf(raw.quality)>=0?raw.quality:"all",query:typeof raw.query==="string"?raw.query.slice(0,500):"",deck:typeof raw.deck==="string"?raw.deck:"",field:["all","name","definition","context","notes"].indexOf(raw.field)>=0?raw.field:"all",sort:raw.sort==="alpha"?"alpha":"relevance",personal:["all","favorite","notes"].indexOf(raw.personal)>=0?raw.personal:"all",level:typeof raw.level==="string"?raw.level:"",cert:typeof raw.cert==="string"?raw.cert:"",shown:Number.isInteger(raw.shown)?clamp(raw.shown,60,10000):60,openIds:Array.isArray(raw.openIds)?raw.openIds.filter(function(x){return typeof x==="string";}).slice(-8):[]};
    var engine=GLOSSARY133.create(allTerms(),function(id){return noteText("term:"+id);});
    var query=el("input");query.id="glossary-search";query.type="search";query.maxLength=500;query.placeholder="Denumire, acronim, exemplu sau tehnologie…";query.setAttribute("aria-label","Caută în glosar");query.value=prefs.query;body.appendChild(query);
    body.appendChild(el("p","muted","Combină cuvinte în orice ordine. Folosește ghilimele pentru o expresie exactă. Exemple: watermark întârziere, \"logical decoding\", WAL."));
    var controls=el("div","glossary-controls133");body.appendChild(controls);
    function choice(id,label,rows,value){var field=el("label","filter-field");field.appendChild(el("span",null,label));var select=el("select");select.id=id;select.setAttribute("aria-label",label);rows.forEach(function(row){select.appendChild(new Option(row[1],row[0]));});select.value=value;field.appendChild(select);controls.appendChild(field);return select;}
    var filter=choice("glossary-deck","Domeniu",[["","Toate domeniile"]].concat(allDecks().filter(function(d){return termsOfDeck(d.id).length;}).map(function(d){return [d.id,d.name];})),prefs.deck);
    var scope=choice("glossary-scope","Caută în",[["all","Tot conținutul"],["name","Denumiri și sinonime"],["definition","Explicații și exemple"],["context","Tehnologie și context"],["notes","Notițele mele"]],prefs.field);
    var quality=choice("glossary-quality134","Grad de detaliere",[["all","Toate fișele"],["extended","Explicație, exemplu și verificare"],["reference","Fișe scurte de aprofundat"]],prefs.quality);
    var sort=choice("glossary-sort","Ordonare",[["relevance","Relevanță"],["alpha","Alfabetic"]],prefs.sort);
    var personal=choice("glossary-personal","Colecția mea",[["all","Toți termenii"],["favorite","Favorite"],["notes","Cu notițe"]],prefs.personal);
    var advanced=el("details","glossary-advanced133");advanced.appendChild(el("summary",null,"Filtre avansate"));var extra=el("div","glossary-controls133");extra.appendChild(quality.parentNode);extra.appendChild(scope.parentNode);extra.appendChild(personal.parentNode);advanced.appendChild(extra);body.appendChild(advanced);contentFilterState["terms-filter"]={level:prefs.level,cert:prefs.cert};var matchesFilter=contentFilters(advanced,"terms-filter",changed,false);
    var clear=el("button","btn mini secondary","Șterge căutarea și filtrele");clear.id="glossary-clear";body.appendChild(clear);
    var count=el("p","muted");count.id="glossary-count";count.setAttribute("aria-live","polite");body.appendChild(count);var suggestions=el("div","glossary-suggestions133");body.appendChild(suggestions);var list=el("div");list.id="glossary-list";body.appendChild(list);
    function remember(){prefs.query=query.value;prefs.deck=filter.value;prefs.field=scope.value;prefs.sort=sort.value;prefs.personal=personal.value;prefs.quality=quality.value;prefs.level=contentFilterState["terms-filter"].level || "";prefs.cert=contentFilterState["terms-filter"].cert || "";state.settings.glossary=Object.assign({},prefs,{openIds:prefs.openIds.slice()});save();}
    function changed(){prefs.shown=60;render();}
    function render(){suggestions.innerHTML="";list.innerHTML="";clear.hidden=!(query.value.trim()||filter.value||quality.value!=="all"||scope.value!=="all"||sort.value!=="relevance"||personal.value!=="all"||contentFilterState["terms-filter"].level||contentFilterState["terms-filter"].cert);var matches=engine.search(query.value,{field:scope.value,sort:sort.value,accept:function(t){return (quality.value==="all"||(t.studyQuality134||{}).format===quality.value)&&(!filter.value||t.deck===filter.value)&&matchesFilter(t)&&(personal.value!=="favorite"||!!state.library.favorites["term:"+t.id])&&(personal.value!=="notes"||!!noteText("term:"+t.id).trim());}});count.textContent=matches.length+(matches.length===1?" concept":" concepte")+" · "+allTerms().length+" în glosar";remember();var shown=0,more=el("button","btn secondary");more.setAttribute("data-glossary-more","true");
      function append(limit){if(more.parentNode)more.remove();var end=Math.min(shown+limit,matches.length);matches.slice(shown,end).forEach(function(hit){var term=hit.term,row=el("details","unit glossary-row133");row.setAttribute("data-term-id",term.id);var summary=el("summary");summary.appendChild(el("span","glossary-term133",term.t));summary.appendChild(el("span","glossary-brief133",(term.d.length>145?term.d.slice(0,145)+"…":term.d)));if(hit.why.length)summary.appendChild(el("span","glossary-match133","Găsit în: "+hit.why.join(", ")));row.appendChild(summary);row.appendChild(el("p","muted",deckById(term.deck).name));row.appendChild(el("p",null,term.d));if(hit.snippet)row.appendChild(el("p","glossary-snippet133",hit.snippet));appendTermOrigin(row,term);var loaded=false;
        row.addEventListener("click",function(e){if(personal.value==="favorite" && e.target.closest("[data-favorite]"))Promise.resolve().then(function(){if(query.isConnected)render();});});
        row.addEventListener("toggle",function(){if(!row.isConnected)return;if(row.open){if(!loaded){loaded=true;appendTermDetails(row,term,true);appendRelated(row,term.id,"Consolidează conceptul");if(term.aliases&&term.aliases.length)row.appendChild(el("p","muted","Denumiri alternative: "+term.aliases.join(", ")));appendLearningSources(row,term.s);libraryControls(row,"term",term.id);}prefs.openIds=prefs.openIds.filter(function(id){return id!==term.id;}).concat(term.id).slice(-8);}else prefs.openIds=prefs.openIds.filter(function(id){return id!==term.id;});remember();});list.appendChild(row);if(prefs.openIds.indexOf(term.id)>=0)row.open=true;
      });shown=end;prefs.shown=shown;remember();if(shown<matches.length){more.textContent="Mai încarcă "+Math.min(60,matches.length-shown)+" · "+shown+" din "+matches.length;list.appendChild(more);}}
      more.onclick=function(){append(60);};append(Math.max(60,prefs.shown));
      if(!matches.length){list.appendChild(el("p","muted","Niciun concept nu corespunde căutării și filtrelor. Poți șterge filtrele sau reformula."));engine.suggest(query.value).forEach(function(word){var button=el("button","btn mini secondary","Ai vrut «"+word+"»?");button.setAttribute("data-glossary-suggestion",word);button.onclick=function(){query.value=word;changed();query.focus();};suggestions.appendChild(button);});}
    }
    query.oninput=changed;[filter,scope,sort,personal,quality].forEach(function(x){x.onchange=changed;});clear.onclick=function(){query.value="";filter.value="";scope.value="all";quality.value="all";sort.value="relevance";personal.value="all";prefs.openIds=[];contentFilterState["terms-filter"].level="";contentFilterState["terms-filter"].cert="";advanced.querySelectorAll("select").forEach(function(x){x.value="";});scope.value="all";quality.value="all";personal.value="all";changed();query.focus();};render();$("#modal").hidden=false;
  }

  // ---------------------------------------------------------------- Dicționar
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

  // ---------------------------------------------------------------- Resurse externe
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

  // ---------------------------------------------------------------- Atelier 1.49
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

  // ---------------------------------------------------------------- Moduri pe taburi
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
    saved: "Materialele salvate și notițele tale, de recitit.",
    workshop: "Fișe scurte: reguli, capcane frecvente și incidente reale, pe competențe."
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
    saved: "Repetă favoritele, greșelile sau cardurile scadente.",
    workshop: "Traseul pe competențe: decizii, capcane, ordinea pașilor, completare și verificare pe date."
  };
  function tabMode156(tab) {
    var modes = state.settings.tabModes156 || {};
    if (modes[tab] === "practice" || modes[tab] === "learn") return modes[tab];
    if (tab === "workshop") return "practice";
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
    resButton156(root, deckIds, "Resurse externe pentru domeniu");
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

  // ---------------------------------------------------------------- Practică termeni
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

  function termsOfDeck(deckId) {
    return allTerms().filter(function (t) { return t.deck === deckId; });
  }

  /** Unitățile = deck-urile care au termeni, fiecare împărțită în lecții de câte LESSON_SIZE. */
  function learnUnits() {
    var order = [], byDeck = {};
    allTerms().filter(function (t) { return deckEnabled(t.deck); }).forEach(function (t) {
      if (!byDeck[t.deck]) { byDeck[t.deck] = []; order.push(t.deck); }
      byDeck[t.deck].push(t);
    });
    return order.map(function (deckId) {
      var terms = byDeck[deckId], lessons = [];
      var plan=(SEED.termLessonPlan134 || {})[deckId],slices=[];
      if(plan){var planned={};plan.forEach(function(ids){ids.forEach(function(id){planned[id]=true;});slices.push(ids.map(termById).filter(Boolean));});var added=terms.filter(function(t){return !planned[t.id];});for(var n=0;n<added.length;n+=LESSON_SIZE)slices.push(added.slice(n,n+LESSON_SIZE));}
      else for(var n=0;n<terms.length;n+=LESSON_SIZE)slices.push(terms.slice(n,n+LESSON_SIZE));
      for (var i = 0; i < slices.length; i++) {
        var slice = slices[i];
        var id = deckId + ":" + i;
        var completed = state.learn.lessons[id];
        var covered = completed && completed.termIds;
        var stillComplete = !!(completed && completed.done) && slice.every(function (term) {
          return covered ? covered.indexOf(term.id) >= 0 : term.id.indexOf("v118-t-") !== 0 && !/^term13[34]-/.test(term.id);
        });
        lessons.push({
          id: id, deck: deckId, idx: i, terms: slice,
          done: stillComplete
        });
      }
      return {
        deck: deckById(deckId), terms: terms, lessons: lessons,
        done: lessons.filter(function (l) { return l.done; }).length,
        total: lessons.length
      };
    });
  }

  /** Repetiție pentru termenii scadenți: exercițiul se alege după cât de bine îi știi. */
  function startTermReview() {
    var terms = dueTerms().slice(0, 15);
    if (!terms.length) { toast("Niciun termen scadent acum."); return false; }
    var items = terms.map(termExercise);
    if (terms.length >= 4) items.push(pairsItem(terms.slice(0, 8)));
    return startRun(items, { titlu: "Repetă termenii" });
  }

  function termStrength(id) {
    var s = state.learn.terms[id];
    return s ? s.s : 0;
  }

  function learnProgress() {
    var terms = allTerms(), stiute = 0, incepute = 0;
    terms.forEach(function (t) {
      var s = termStrength(t.id);
      if (s >= MAX_STRENGTH) stiute++;
      else if (s > 0) incepute++;
    });
    return { total: terms.length, stiute: stiute, incepute: incepute };
  }

  function addXp(n) {
    var k = dayKey();
    if (state.learn.xpDay.date !== k) state.learn.xpDay = { date: k, n: 0 };
    state.learn.xp += n;
    state.learn.xpDay.n += n;
  }

  /** 3 distractori: definiții ale altor termeni, întâi din aceeași unitate. */
  function distractors(term, n) {
    // Două definiții sub același nume ar face întrebarea imposibilă, iar
    // „ai ales definiția lui X” ambiguu. Numele apare o singură dată.
    var luat = {},definitions={},concepts={};
    luat[term.t.trim().toLowerCase()] = 1;
    definitions[searchKey(term.d.trim())]=true;concepts[term.canonicalId || term.id]=true;
    function nou(t) {
      var k = t.t.trim().toLowerCase(),d=searchKey(t.d.trim()),canonical=t.canonicalId || t.id;
      if (luat[k] || definitions[d] || concepts[canonical]) return false;
      luat[k] = 1;definitions[d]=true;concepts[canonical]=true;
      return true;
    }
    var pool = shuffle(termsOfDeck(term.deck).filter(function (t) {
      return t.id !== term.id;
    })).filter(nou).slice(0, n);
    if (pool.length < n) {
      var rest = shuffle(allTerms().filter(function (t) {
        return t.deck !== term.deck && t.id !== term.id;
      })).filter(nou);
      pool = pool.concat(rest.slice(0, n - pool.length));
    }
    return pool;
  }

  function mcqItem(term) {
    // Ducem cu noi termenul fiecărui distractor: la greșeală putem spune exact
    // a cui e definiția pe care ai ales-o, nu doar că n-a fost bună.
    var opts = distractors(term, 3).map(function (t) {
      return { text: t.d, ok: false, term: t };
    });
    opts.push({ text: term.d, ok: true });
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
  }

  function pairsItem(terms) {
    var seen={},definitions={};var unique=terms.filter(function(t){var id=t.canonicalId || t.id,d=searchKey(t.d.trim());if(seen[id] || definitions[d])return false;seen[id]=true;definitions[d]=true;return true;});
    var sel = shuffle(unique).slice(0, 4);
    return {
      type: "pairs", terms: sel,
      stanga: shuffle(sel.slice()),
      dreapta: shuffle(sel.slice())
    };
  }

  /** Construiește lecția: termenii noi se prezintă întâi, apoi grile, apoi perechi. */
  function buildLesson(deckId, idx) {
    var unit = null, lesson = null;
    learnUnits().forEach(function (u) {
      if (u.deck.id !== deckId) return;
      unit = u;
      u.lessons.forEach(function (l) { if (l.idx === idx) lesson = l; });
    });
    if (!lesson) return null;
    var items = [];
    lesson.terms.forEach(function (t) {
      if (termStrength(t.id) === 0) items.push({ type: "intro", term: t });
    });
    var noi = lesson.terms.filter(function (t) { return termStrength(t.id) === 0; });
    shuffle(lesson.terms.slice()).forEach(function (t) { items.push(termExercise(t)); });
    if (lesson.terms.length >= 4) items.push(pairsItem(lesson.terms));
    // Termenii noi revin la final în sens invers: definiția → denumirea.
    shuffle(noi.slice()).forEach(function (t) { items.push(revItem(t)); });
    return { id: lesson.id, deck: deckId, idx: idx, terms: lesson.terms, items: items };
  }

  // ---------------------------------------------------------------- stare lecție
  var L = null;

  function startRun(items, meta) {
    if (!items || !items.length) { toast("Nu am ce să îți dau acum."); return false; }
    meta = meta || {};
    L = {
      lesson: { items: items, id: meta.id || null, deck: meta.deck || null,
                idx: meta.idx, terms: meta.terms || [] },
      titlu: meta.titlu || "", i: 0, total: items.length,
      hearts: MAX_HEARTS, corecte: 0, gresite: 0, xp: 0,
      raspuns: null, verificat: false, pairsSel: null, pairsOk: {}, pairsGresit: false,
      reluari: {}, start: Date.now()
    };
    L.original = items.map(encodeSessionItem);
    ui.activeFlow = "lesson";
    $("#study").hidden = true;
    $("#nav").hidden = true;
    $("#lesson").hidden = false;
    renderItem();
    return true;
  }

  function startLesson(deckId, idx) {
    var lesson = buildLesson(deckId, idx);
    if (!lesson || !lesson.items.length) { toast("Lecția nu are conținut."); return false; }
    return startRun(lesson.items, { id: lesson.id, deck: deckId, idx: idx,
                                    terms: lesson.terms, titlu: deckById(deckId).name });
  }

  function endLesson() {
    if(state.returnSession){save(true);restoreRelatedParent();return;}
    save(true); ui.activeFlow = null;
    L = null;
    $("#lesson").hidden = true;
    $("#nav").hidden = false;
    flush();
    show("learn");
    returnToDiscovery129();
  }

  function markTerm(id, corect) {
    var t = state.learn.terms[id] || { s: 0, c: 0, g: 0 };
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
    state.learn.terms[id] = t;
  }

  function renderItem() {
    if (!L) return;
    if (L.i >= L.lesson.items.length) { finishLesson(); return; }
    var it = L.lesson.items[L.i];
    L.raspuns = null; L.selected = []; L.verificat = false;
    L.pairsSel = null; L.pairsOk = {}; L.pairsGresit = false;
    save(true);

    $("#ls-bar").style.width = (L.i / L.total * 100) + "%";
    renderHearts();
    var body = $("#ls-body");
    body.innerHTML = "";
    $("#ls-rate").hidden = true;
    $("#ls-go").hidden = false;
    $("#ls-alt").hidden = true;

    if (it.type === "spark") { renderSparkItem(body,it); return; }
    if (it.type === "scen") {
      var sc = it.sc;
      var pas = it.pas || 0;
      var d = pas === 0 ? sc : sc.v;

      body.appendChild(el("div", "ls-kicker", pas === 0 ? "Situație" : "Și dacă…"));
      if (pas === 0) body.appendChild(el("div", "ls-term", sc.titlu));
      var sb = el("div", "md scen-s");
      sb.innerHTML = renderMd(d.s);
      body.appendChild(sb);
      var qb = el("div", "md scen-q");
      qb.innerHTML = renderMd(d.q);
      body.appendChild(qb);
      libraryControls(body, "scenario", sc.id);

      var lista = el("div", "opts");
      var variante = it.ord || (it.ord = shuffle(d.o.map(function (o, i) { return i; })));
      variante.forEach(function (idx, poz) {
        var o = d.o[idx];
        var b = el("button", "opt", o.t);
        b.setAttribute("data-opt", String(poz));
        b.onclick = function () {
          if (L.verificat) return;
          L.raspuns = poz;
          var all = lista.querySelectorAll(".opt");
          for (var k = 0; k < all.length; k++) all[k].classList.toggle("sel", k === poz);
          setFoot("Verifică", true, verificaScen);
        };
        lista.appendChild(b);
      });
      body.appendChild(lista);
      $("#ls-fb").hidden = true;
      setFoot("Verifică", false, verificaScen);

      function verificaScen() {
        if (L.verificat || L.raspuns === null) return;
        L.verificat = true;
        var corect = d.o[variante[L.raspuns]].ok;
        var opts = lista.querySelectorAll(".opt");
        for (var i = 0; i < opts.length; i++) {
          if (d.o[variante[i]].ok) opts[i].classList.add("ok");
          else if (i === L.raspuns) opts[i].classList.add("rau");
          opts[i].disabled = true;
        }
        scenMark(sc.id, pas, corect);
        if (corect) { L.corecte++; L.xp += XP_SCEN; } else L.gresite++;
        feedback(corect, corect ? "Exact." : "Nu e varianta asta.");
        var aleasa = d.o[variante[L.raspuns]];
        if (!corect && aleasa && aleasa.w) body.appendChild(deCeNu(aleasa.w));
        var ex = el("div", "md hint");
        ex.innerHTML = renderMd(d.e);
        body.appendChild(ex);
        appendLearningSources(body, sc.surse);
        setFoot(pas === 0 ? "Și dacă se schimbă ceva?" : "Continuă", true, function () {
          if (pas === 0) {
            it.pas = 1;
            it.ord = null;
            L.raspuns = null; L.verificat = false;
            renderItem();
          } else {
            L.i++;
            renderItem();
          }
        });
        save(true);
      }
      return;
    }

    if (it.type === "lab") {
      if (!SQLjs) {
        body.appendChild(el("div", "ls-kicker", "Laborator SQL"));
        body.appendChild(scheletLaborator("Se pregătește motorul SQL…"));
        $("#ls-fb").hidden = true;
        setFoot("Se pregătește…", false, function () {});
        loadSql().then(function () { renderItem(); },
                       function () { L.i++; renderItem(); });
        return;
      }
      body.appendChild(labSchema());
      labMount(body, it.ex, {
        setFoot: setFoot,
        feedback: feedback,
        onSolved: function () { L.corecte++; L.i++; renderItem(); }
      });
      $("#ls-fb").hidden = true;
      return;
    }

    if (it.type === "pylab") {
      if (!window.PYLAB.gata()) {
        body.appendChild(el("div", "ls-kicker", "Laborator Python"));
        body.appendChild(scheletLaborator("Se pregătește motorul Python…"));
        $("#ls-fb").hidden = true;
        setFoot("Se pregătește…", false, function () {});
        window.PYLAB.load().then(function () { renderItem(); },
                                 function () { L.i++; renderItem(); });
        return;
      }
      pyMount(body, it.ex, {
        setFoot: setFoot,
        feedback: feedback,
        onSolved: function () { L.corecte++; L.i++; renderItem(); }
      });
      $("#ls-fb").hidden = true;
      return;
    }

    if (it.type === "card") {
      var c = it.card;
      body.appendChild(el("div", "ls-kicker", deckById(c.deck).name));
      var q = el("div", "md q");
      q.innerHTML = renderMd(c.q);
      body.appendChild(q);
      var ans = el("div", "md ls-ans");
      var structured=imparteCard(c);
      if(structured){
        pasStare=L.restoredPas || {i:0,text:"",vazut:false};L.restoredPas=null;
        if(!structured.exersare && pasStare.i>1)pasStare.i=1;
        pasiMount(ans,structured,c);
      }else ans.innerHTML = renderMd(c.a);
      body.appendChild(ans);
      var tg = el("div", "tags");
      (c.tags || []).forEach(function (x) { tg.appendChild(el("span", "tag", x)); });
      body.appendChild(tg);
      libraryControls(body, "card", c.id);
      appendRelated(body,c.id);
      $("#ls-fb").hidden = true;
      if (state.settings.hideAnswer) {
        ans.hidden = true; tg.hidden = true;
        setFoot("Arată răspunsul", true, function () {
          ans.hidden = false; tg.hidden = false; cardRating(c);
        });
      } else {
        cardRating(c);
      }
      return;
    }

    if (it.type === "fx") { renderFx159(body, it); return; }

    if (it.type === "intro") {
      body.appendChild(el("div", "ls-kicker", "Termen nou"));
      body.appendChild(el("div", "ls-term", it.term.t));
      appendTermOrigin(body,it.term);
      var d = el("div", "ls-def");
      d.innerHTML = renderMd(it.term.d);
      body.appendChild(d);
      appendTermDetails(body,it.term,true);
      setFoot("Continuă", true, function () { L.i++; renderItem(); });
      $("#ls-fb").hidden = true;
      return;
    }

    if (it.type === "exam") {
      var q = it.q;
      if (q.dom) body.appendChild(el("div", "ls-kicker", q.dom));
      if (q.mode === "multiple") body.appendChild(el("p", "muted", "Răspuns multiplu · alege " + q.o.filter(function(o){return o.ok;}).length + " variante."));
      var qd = el("div", "md q");
      qd.innerHTML = renderMd(q.q);
      body.appendChild(qd);
      libraryControls(body, "question", q.id);
      var lx = el("div", "opts");
      var examOrder=it.ord || (it.ord=shuffle(q.o.map(function(_,i){return i;})));
      examOrder.forEach(function (i) {
        var o=q.o[i];
        var b = el("button", "opt");
        b.innerHTML = mdInline(o.t);
        b.setAttribute("data-opt", String(i));
        b.setAttribute("aria-pressed", "false");
        b.onclick = function () {
          if (L.verificat) return;
          if (q.mode === "multiple") {
            var pos = L.selected.indexOf(i);
            if (pos < 0) L.selected.push(i); else L.selected.splice(pos, 1);
            L.raspuns = L.selected.length ? L.selected[0] : null;
          } else { L.raspuns = i; L.selected = [i]; }
          var all = lx.querySelectorAll(".opt");
          for (var k = 0; k < all.length; k++) {
            var selected = L.selected.indexOf(Number(all[k].getAttribute("data-opt"))) >= 0;
            all[k].classList.toggle("sel", selected);
            all[k].setAttribute("aria-pressed", selected ? "true" : "false");
          }
          setFoot("Verifică", L.selected.length > 0, verificaExamen);
        };
        lx.appendChild(b);
      });
      body.appendChild(lx);
      setFoot("Verifică", false, verificaExamen);
      $("#ls-fb").hidden = true;
      save(true);
      return;
    }

    if (it.type === "mcq") {
      body.appendChild(el("div", "ls-kicker", "Ce înseamnă?"));
      body.appendChild(el("div", "ls-term", it.term.t));
      var list = el("div", "opts");
      it.options.forEach(function (o, i) {
        var b = el("button", "opt", o.text);
        b.setAttribute("data-opt", String(i));
        b.onclick = function () {
          if (L.verificat) return;
          L.raspuns = i;
          var all = list.querySelectorAll(".opt");
          for (var k = 0; k < all.length; k++) all[k].classList.toggle("sel", k === i);
          setFoot("Verifică", true, verifica);
        };
        list.appendChild(b);
      });
      body.appendChild(list);
      setFoot("Verifică", false, verifica);
      $("#ls-fb").hidden = true;
      return;
    }

    if (it.type === "rev") {
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
      body.appendChild(el("div", "ls-kicker", "Potrivește termenii cu definițiile"));
      var wrapT = el("div", "chips");
      it.stanga.forEach(function (t) {
        var b = el("button", "chip", t.t);
        b.setAttribute("data-term", t.id);
        b.onclick = function () { pairPick(t.id, b); };
        wrapT.appendChild(b);
      });
      body.appendChild(wrapT);
      var wrapD = el("div", "defs");
      it.dreapta.forEach(function (t) {
        var b = el("button", "defrow", t.d);
        b.setAttribute("data-def", t.id);
        b.onclick = function () { pairDrop(t.id, b); };
        wrapD.appendChild(b);
      });
      body.appendChild(wrapD);
      setFoot("Continuă", false, function () { L.i++; renderItem(); });
      $("#ls-fb").hidden = true;
      return;
    }
  }

  function pairPick(id, btn) {
    if (L.pairsOk[id]) return;
    L.pairsSel = id;
    var chips = $("#ls-body").querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      chips[i].classList.toggle("sel", chips[i] === btn);
    }
  }

  function pairDrop(id, btn) {
    if (!L.pairsSel || L.pairsOk[id]) return;
    var ales = L.pairsSel;
    var chip = $("#ls-body").querySelector('.chip[data-term="' + ales + '"]');
    if (ales === id) {
      L.pairsOk[id] = true;
      if (chip) { chip.classList.remove("sel"); chip.classList.add("ok"); chip.disabled = true; }
      btn.classList.add("ok"); btn.disabled = true;
      L.pairsSel = null;
      markTerm(id, true);
      var it = L.lesson.items[L.i];
      if (Object.keys(L.pairsOk).length === it.terms.length) {
        if (!L.pairsGresit) { L.corecte++; L.xp += XP_CORECT; addXp(XP_CORECT); }
        setFoot("Continuă", true, function () { L.i++; renderItem(); });
        feedback(true, "Toate perechile sunt corecte.");
      }
    } else {
      L.pairsGresit = true;
      L.gresite++;
      markTerm(ales, false);
      btn.classList.add("rau");
      if (chip) chip.classList.remove("sel");
      L.pairsSel = null;
      setTimeout(function () { btn.classList.remove("rau"); }, 500);
      loseHeart();
    }
    save();
  }

  function verificaExamen() {
    if (!L || L.verificat || L.raspuns === null) return;
    var it = L.lesson.items[L.i], q = it.q;
    var selected = L.selected && L.selected.length ? L.selected : [L.raspuns];
    var corect = q.o.every(function (o, i) { return !!o.ok === (selected.indexOf(i) >= 0); });
    L.verificat = true;
    var opts = $("#ls-body").querySelectorAll(".opt");
    for (var i = 0; i < opts.length; i++) {
      var optionIndex=Number(opts[i].getAttribute("data-opt"));
      if (q.o[optionIndex].ok) opts[i].classList.add("ok");
      else if (selected.indexOf(optionIndex) >= 0) opts[i].classList.add("rau");
      opts[i].disabled = true;
    }
    if (corect) {
      L.corecte++; L.xp += XP_CORECT; addXp(XP_CORECT);
      feedback(true, "Corect.");
    } else {
      L.gresite++;
      // explicația pe varianta aleasă: de ce suna bine și unde cade
      var fb = $("#ls-fb");
      fb.hidden = false;
      fb.className = "ls-fb bad";
      var reasons = selected.filter(function (i) { return !q.o[i].ok; }).map(function (i) { return q.o[i].w || ""; });
      var missed = q.o.filter(function (o, i) { return o.ok && selected.indexOf(i) < 0; }).length;
      fb.textContent = (missed ? "Ai omis " + missed + " variante corecte. " : "Nu. ") + reasons.join(" ");
    }
    // Explicația finală se arată în ambele cazuri: și când nimerești, e util să
    // știi de ce era corect, nu doar că a fost.
    var ex = el("div", "ex-model");
    ex.appendChild(el("div", "cheie-et", corect ? "DE CE E CORECT" : "RĂSPUNSUL CORECT"));
    var ed = el("div", "md");
    ed.innerHTML = renderMd(q.e);
    ex.appendChild(ed);
    $("#ls-body").appendChild(ex);
    appendLearningSources($("#ls-body"), q.sources);
    appendRelated($("#ls-body"),q.id,corect?"Aprofundează subiectul":"De la greșeală la explicație și practică");
    var prior = state.assessments[q.id] || {};
    state.assessments[q.id] = { correct: corect, attempts: (prior.attempts || 0) + 1,
      errors: (prior.errors || 0) + (corect ? 0 : 1), last: Date.now(),
      exam: it.exam || null, dom: q.dom || "", competency: q.competency || null };
    if (q.competency && q.level) {
      var canonicalId = q.competency + "-q-" + q.level;
      if (canonicalId !== q.id) {
        var shared = state.assessments[canonicalId] || {};
        state.assessments[canonicalId] = { correct: corect, attempts: (shared.attempts || 0) + 1,
          errors: (shared.errors || 0) + (corect ? 0 : 1), last: Date.now(),
          exam: null, dom: q.dom || "", competency: q.competency };
      }
    }
    setFoot("Continuă", true, avanseaza);
    save();
  }

  function verifica() {
    if (!L || L.verificat || L.raspuns === null) return;
    var it = L.lesson.items[L.i];
    var corect = it.options[L.raspuns].ok;
    L.verificat = true;
    markTerm(it.term.id, corect);
    var opts = $("#ls-body").querySelectorAll(".opt");
    for (var i = 0; i < opts.length; i++) {
      if (it.options[i].ok) opts[i].classList.add("ok");
      else if (i === L.raspuns) opts[i].classList.add("rau");
      opts[i].disabled = true;
    }
    if (corect) {
      L.corecte++; L.xp += XP_CORECT; addXp(XP_CORECT);
      feedback(true, "Corect.");
      setFoot("Continuă", true, avanseaza);
    } else {
      L.gresite++;
      var aleasa = it.options[L.raspuns];
      if (aleasa && aleasa.term && it.type === "rev") {
        feedback(false, "Ai ales „" + aleasa.term.t + "”, care înseamnă: " + aleasa.term.d +
                        " Definiția de aici este a lui „" + it.term.t + "”.");
      } else if (aleasa && aleasa.term) {
        feedback(false, "Ai ales definiția lui „" + aleasa.term.t + "”. " +
                        it.term.t + " înseamnă: " + it.term.d);
      } else {
        feedback(false, it.term.t + ": " + it.term.d);
      }
      // Termenul greșit revine la finalul lecției, dar de cel mult MAX_RELUARI
      // ori: cu vieți oprite, altfel coada crește la fiecare greșeală și bara
      // de progres dă înapoi la nesfârșit. Ce rămâne neștiut revine mâine,
      // prin planificare, nu prin prelungirea lecției de azi.
      var k = it.term.id;
      L.reluari[k] = (L.reluari[k] || 0) + 1;
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
  }

  function avanseaza() {
    if (!L) return;
    L.i++;
    renderItem();
  }

  /**
   * Explicația pentru varianta pe care ai ales-o TU. „Nu chiar” nu învață pe
   * nimeni nimic: ce contează e de ce argumentul ăla, care sună plauzibil, nu
   * ține.
   */
  function deCeNu(text) {
    var d = el("div", "md de-ce-nu");
    d.innerHTML = renderMd("**De ce nu varianta ta.** " + text);
    return d;
  }

  function feedback(ok, text, titlu) {
    var fb = $("#ls-fb");
    fb.hidden = false;
    fb.className = "ls-fb " + (ok ? "good" : "bad");
    fb.innerHTML = "";
    fb.appendChild(el("b", null, titlu || (ok ? "Bine!" : "Nu chiar.")));
    fb.appendChild(el("span", null, text));
  }

  function cardRating(c) {
    $("#ls-go").hidden = true;
    var row = $("#ls-rate");
    row.hidden = false;
    row.innerHTML = "";
    var s0 = sched(c.id), now = Date.now();
    [[AGAIN, "Din nou", "r-1"], [HARD, "Greu", "r-2"],
     [GOOD, "Bine", "r-3"], [EASY, "Ușor", "r-4"]].forEach(function (pp) {
      var n = nextState(s0, pp[0], now);
      var b = el("button", "rbtn " + pp[2]);
      b.appendChild(el("b", null, pp[1]));
      b.appendChild(el("span", null, fmtIvl(Math.max(0, n.due - now))));
      b.setAttribute("data-card-rate", String(pp[0]));
      b.onclick = function () { rateCard(c, pp[0]); };
      row.appendChild(b);
    });
  }

  /** Cardurile sunt autoevaluare, deci nu costă vieți. */
  function rateCard(c, r) {
    if (!L) return;
    answer(c.id, r, Date.now());
    if (r >= GOOD) { L.corecte++; L.xp += XP_CORECT; addXp(XP_CORECT); }
    else L.gresite++;
    $("#ls-rate").hidden = true;
    $("#ls-go").hidden = false;
    L.i++;
    renderItem();
  }

  function setFoot(label, enabled, fn) {
    var b = $("#ls-go");
    b.textContent = label;
    b.disabled = !enabled;
    b.onclick = fn;
  }

  /** Vieți doar la exercițiile care le consumă; altfel ar fi un indicator fals. */
  // La laborator nu pierzi vieți: codul care nu merge din prima e munca normală,
  // nu o greșeală de memorie.
  var FARA_VIETI = { scen: 1, lab: 1, pylab: 1, spark: 1, card: 1, intro: 1, exam: 1, recall: 1, fx: 1 };

  function renderHearts() {
    var h = $("#ls-hearts");
    var it = L && L.lesson.items[L.i];
    if (!state.settings.hearts || (it && FARA_VIETI[it.type])) { h.hidden = true; return; }
    h.hidden = false;
    h.innerHTML = "";
    for (var vi = 0; vi < MAX_HEARTS; vi++) {
      h.appendChild(ico("inima", vi < L.hearts ? "viata plina" : "viata goala"));
    }
    h.setAttribute("aria-label", L.hearts + " vieți din " + MAX_HEARTS);
    h.classList.toggle("low", L.hearts <= 1);
  }

  function loseHeart() {
    if (!state.settings.hearts) return;
    L.hearts--;
    renderHearts();
    if (L.hearts <= 0) setTimeout(lessonFailed, 650);
  }

  function lessonFailed() {
    if (!L) return;
    state.resume = null;
    L.failed = true;
    var body = $("#ls-body");
    body.innerHTML = "";
    body.appendChild(ico("inima_frantă", "ls-big rau"));
    body.appendChild(el("div", "ls-term", "Ai rămas fără vieți"));
    body.appendChild(el("p", "muted center",
      "Ai răspuns corect la " + L.corecte + " exerciții. Reia lecția când vrei."));
    $("#ls-fb").hidden = true;
    var deck = L.lesson.deck, idx = L.lesson.idx, lid2 = L.lesson.id;
    var original = L.original, title = L.titlu;
    setFoot("Reîncearcă", true, function () {
      if (lid2) startLesson(deck, idx);
      else startRun((original || []).map(decodeSessionItem).filter(Boolean), {titlu:title});
    });
    var alt = $("#ls-alt");
    alt.hidden = false;
    alt.textContent = "Ieși din lecție";
    alt.onclick = endLesson;
    save();
  }

  function finishLesson() {
    if (!L || L.finished) return;
    L.finished = true; state.resume = null;
    var lid = L.lesson.id;
    var total = L.corecte + L.gresite;
    var pct = total ? Math.round(L.corecte / total * 100) : 100;
    if (lid) {
      var prev = state.learn.lessons[lid] || {};
      state.learn.lessons[lid] = {
        done: true,
        termIds: L.lesson.terms.map(function (term) { return term.id; }),
        best: Math.max(prev.best || 0, pct),
        last: Date.now()
      };
    }
    var sparkOnly=L.lesson.items.length && L.lesson.items.every(function(it){return it.type==="spark";});
    if(!sparkOnly || L.xp>0){L.xp += XP_LECTIE;addXp(XP_LECTIE);}
    bumpStreak(Date.now());
    save(true);

    var body = $("#ls-body");
    body.innerHTML = "";
    body.appendChild(ico(pct >= 80 ? "trofeu" : "bifa", "ls-big bun"));
    body.appendChild(el("div", "ls-term", "Lecție terminată"));
    var g = el("div", "grid");
    g.appendChild(stat("+" + L.xp, "XP"));
    g.appendChild(stat(pct + "%", "corect"));
    body.appendChild(g);
    $("#ls-bar").style.width = "100%";
    $("#ls-fb").hidden = true;
    $("#ls-alt").hidden = true;
    if(state.returnSession){setFoot("Revino la sesiunea inițială",true,endLesson);return;}

    var deck = L.lesson.deck, idx = L.lesson.idx;
    var urm = null;
    if (lid) {
      learnUnits().forEach(function (u) {
        if (u.deck.id !== deck) return;
        u.lessons.forEach(function (l) { if (l.idx === idx + 1) urm = l; });
      });
    }
    if (!lid) {
      var atins = xpAzi() >= obiectivZi();
      body.appendChild(el("p", "muted center", atins
        ? "Obiectivul de azi e atins. Poți continua oricât vrei."
        : "Încă " + Math.max(0, obiectivZi() - xpAzi()) + " XP până la obiectivul de azi."));
    }
    setFoot(lid ? (urm ? "Lecția următoare" : "Gata") : "Încă o sesiune", true, function () {
      if (lid && urm) startLesson(deck, idx + 1);
      else if (!lid) { if (!startDaily()) endLesson(); }
      else endLesson();
    });
    var alt2 = $("#ls-alt");
    alt2.hidden = false;
    alt2.textContent = "Gata pentru azi";
    alt2.onclick = endLesson;
  }

  // ---------------------------------------------------------------- personalizare
  var NIVELE = {
    incepator: { nume: "Început", noi: 3, carduri: 6 },
    mediu:     { nume: "Mediu",   noi: 6, carduri: 12 },
    avansat:   { nume: "Avansat", noi: 10, carduri: 20 }
  };
  var OBIECTIVE = [
    { xp: 30, nume: "Ușor", sub: "~5 minute pe zi" },
    { xp: 60, nume: "Normal", sub: "~10 minute pe zi" },
    { xp: 120, nume: "Serios", sub: "~20 minute pe zi" }
  ];

  function nivel() { return NIVELE[state.settings.level] || NIVELE.mediu; }
  function obiectivZi() { return state.settings.goal || 60; }
  function xpAzi() {
    return state.learn.xpDay.date === dayKey() ? state.learn.xpDay.n : 0;
  }

  // Provocările zilnice premiază progresul pe traseu și practica distribuită,
  // nu acumularea repetitivă de XP dintr-un singur tip de exercițiu.
  function dailyQuestRows() {
    var today = dayKey();
    var terms = allTerms().filter(function (t) {
      var s = state.learn.terms[t.id];
      return s && s.last && dayKey(s.last) === today;
    }).length;
    var lessons = Object.keys(state.learn.lessons || {}).filter(function (id) {
      var s = state.learn.lessons[id];
      return s && s.done && s.last && dayKey(s.last) === today;
    }).length;
    var scenarios = Object.keys(state.scen.done || {}).filter(function (id) {
      var s = state.scen.done[id];
      return s && s.p1 && s.p2 && s.at && dayKey(s.at) === today;
    }).length;
    return [
      { id: "terms", title: "Exersează 5 concepte", progress: Math.min(5, terms), target: 5, reward: 10 },
      { id: "lesson", title: "Încheie o lecție", progress: Math.min(1, lessons), target: 1, reward: 10 },
      { id: "scenario", title: "Rezolvă un scenariu", progress: Math.min(1, scenarios), target: 1, reward: 10 }
    ];
  }

  function syncDailyQuests() {
    var rows = dailyQuestRows();
    var claimed = state.daily.questClaimed || (state.daily.questClaimed = {});
    var earned = 0;
    rows.forEach(function (q) {
      if (q.progress >= q.target && !claimed[q.id]) {
        claimed[q.id] = true;
        earned += q.reward;
      }
    });
    if (earned) {
      addXp(earned);
      save(true);
    }
    return { rows: rows, claimed: claimed, earned: earned };
  }

  function renderDailyQuests(root, data) {
    data = data || syncDailyQuests();
    var done = data.rows.filter(function (q) { return !!data.claimed[q.id]; }).length;
    var box = el("div", "quests");
    var head = el("div", "quests-head");
    head.appendChild(el("h2", null, "Provocările de azi"));
    head.appendChild(el("span", "quests-total", done + "/" + data.rows.length));
    box.appendChild(head);
    data.rows.forEach(function (q) {
      var gata = !!data.claimed[q.id];
      var row = el("div", "quest" + (gata ? " done" : ""));
      var top = el("div", "quest-top");
      top.appendChild(el("span", "quest-title", q.title));
      top.appendChild(el("span", "quest-reward", gata ? "✓ +" + q.reward + " XP" : "+" + q.reward + " XP"));
      row.appendChild(top);
      var track = el("div", "quest-track");
      track.setAttribute("role", "progressbar");
      track.setAttribute("aria-label", q.title);
      track.setAttribute("aria-valuemin", "0");
      track.setAttribute("aria-valuemax", String(q.target));
      track.setAttribute("aria-valuenow", String(q.progress));
      var fill = el("div", "quest-fill");
      fill.style.width = Math.round(q.progress / q.target * 100) + "%";
      track.appendChild(fill);
      row.appendChild(track);
      row.appendChild(el("div", "quest-count", q.progress + "/" + q.target));
      var start=el("button","btn secondary quest-start135",gata?"Reia practica":"Începe");start.setAttribute("data-quest-start135",q.id);
      start.onclick=function(){if(q.id==="terms"){learnTab="terms";show("learn");}else if(q.id==="lesson"){var u=urmatoareaLectie();if(u)startLesson(u.lectie.deck,u.lectie.idx);else{var units=learnUnits();if(units.length && units[0].lessons.length)startLesson(units[0].deck.id,0);}}else{var s=scenNext();if(s)startScenModule(s.mod);else{learnTab="scen";show("learn");}}};row.appendChild(start);
      box.appendChild(row);
    });
    root.appendChild(box);
  }

  function needsSetup() { return !state.settings.setup; }

  // ---------------------------------------------------------------- sesiunea zilnică
  /** Termeni din domeniile alese, ordonați după cât de slab îi știi. */
  function termeniTinta(nrNoi) {
    var activi = allTerms().filter(function (t) { return deckEnabled(t.deck); });
    var slabi = [], noi = [], scadenti = [], now = Date.now();
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
    };
  }

  /** Construiește sesiunea zilnică: termeni slabi, termeni noi, potriviri, carduri scadente. */
  function buildDaily() {
    var cfg = nivel();
    var tinta = Math.max(8, Math.min(40, Math.round(obiectivZi() / 2)));
    var t = termeniTinta(cfg.noi);
    var items = [], folositi = [];

    // 1. termenii noi: prezentare + grilă
    t.noi.forEach(function (x) {
      items.push({ type: "intro", term: x });
      items.push(mcqItem(x));
      folositi.push(x);
    });

    // 2. termenii slabi, cei mai slabi întâi
    var nrSlabi = Math.max(0, Math.round(tinta * 0.4));
    t.slabi.slice(0, nrSlabi).forEach(function (x) {
      items.push(termExercise(x));
      folositi.push(x);
    });

    // 3. un exercițiu de potrivire, dacă avem destui termeni
    if (folositi.length >= 4) items.push(pairsItem(folositi.slice(0, 8)));

    // 4. carduri scadente din repetiția spațiată
    var carduri = buildQueue(null).slice(0, cfg.carduri);
    var itemeCard = carduri.map(function (c) { return { type: "card", card: c }; });

    // amestecă: exercițiile de termeni și cardurile alternează
    var ex = items.filter(function (i) { return i.type !== "intro"; });
    var intro = items.filter(function (i) { return i.type === "intro"; });
    var mix = intro.concat(interleave(ex, itemeCard)).slice(0, tinta + intro.length);

    var sc1 = scenNext(true);
    if (sc1) mix.push({ type: "scen", sc: sc1, pas: 0 });

    // sesiunea se încheie cu ceva concret făcut cu datele
    var fin = exercitiuFinal();
    if (fin) {
      mix.push(fin);
      // se încarcă din timp motorul de care are nevoie, până ajungi la el
      if (fin.type === "lab") loadSql();
      else window.PYLAB.load().then(function () {}, function () {});
    }
    return mix;
  }

  /**
   * Alternează între SQL și Python, după care dintre cele două trasee a rămas
   * mai în urmă. Un laborator Python e mai lung decât un exercițiu SQL, deci
   * nu-l pui în fiecare sesiune.
   */
  function exercitiuFinal() {
    var exLab = deckEnabled("sql") ? labNext() : null, exPy = deckEnabled("python") ? pyNext() : null;
    if (!exLab && !exPy) return null;
    if (!exPy) return { type: "lab", ex: exLab };
    if (!exLab) return { type: "pylab", ex: exPy };
    var nLab = labData().exercises.length, nPy = pyAll().length;
    var fLab = nLab ? labChapters().reduce(function (s, c) { return s + c.done; }, 0) / nLab : 1;
    var fPy = nPy ? pyChapters().reduce(function (s, c) { return s + c.done; }, 0) / nPy : 1;
    return fPy < fLab ? { type: "pylab", ex: exPy } : { type: "lab", ex: exLab };
  }

  function rezumatZi() {
    var cfg = nivel();
    var t = termeniTinta(cfg.noi);
    var carduri = buildQueue(null).length;
    var p = [];
    if (t.noi.length) p.push(t.noi.length + " termeni noi");
    if (t.slabi.length) p.push(Math.min(t.slabi.length, Math.round(obiectivZi() / 5)) + " de repetat");
    if (carduri) p.push(Math.min(carduri, cfg.carduri) + " carduri");
    if (scenNext(true)) p.push("1 scenariu");
    var fin = exercitiuFinal();
    if (fin) p.push(fin.type === "pylab" ? "1 laborator Python" : "1 exercițiu SQL");
    return p.join(" · ");
  }

  function startDaily() {
    var items = buildDaily();
    if (!items.length) { toast("Nimic de învățat acum. Revino mai târziu."); return false; }
    return startRun(items, { titlu: "Sesiunea de azi" });
  }

  // ---------------------------------------------------------------- ecranul de configurare
  var setupStep = 0, setupTmp = null;

  function openSetup() {
    setupStep = 0;
    setupTmp = {
      decks: Object.assign({}, state.settings.decks),
      level: state.settings.level || "mediu",
      goal: state.settings.goal || 60
    };
    $("#setup").hidden = false;
    renderSetup();
  }

  function renderSetup() {
    var body = $("#su-body");
    body.innerHTML = "";
    $("#su-step").textContent = "Pasul " + (setupStep + 1) + " din 3";

    if (setupStep === 0) {
      body.appendChild(el("h2", "su-title", "Ce vrei să înveți?"));
      body.appendChild(el("p", "muted", "Sesiunile zilnice se construiesc doar din domeniile bifate. Le poți schimba oricând."));
      var stats = setupDeckStats156();
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
          var nr = resCount156([d.id]); if (nr) detail.appendChild(el("p", "muted", nr + " resurse externe în biblioteca aplicației"));
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
      return;
    }

    if (setupStep === 1) {
      body.appendChild(el("h2", "su-title", "Cât de în largul tău ești?"));
      body.appendChild(el("p", "muted", "Decide câte lucruri noi primești într-o sesiune."));
      Object.keys(NIVELE).forEach(function (k) {
        var n = NIVELE[k];
        var b = el("button", "pick" + (setupTmp.level === k ? " on" : ""));
        b.appendChild(el("b", null, n.nume));
        b.appendChild(el("span", null, n.noi + " termeni noi și până la " + n.carduri + " carduri per sesiune"));
        b.onclick = function () { setupTmp.level = k; renderSetup(); };
        body.appendChild(b);
      });
      return;
    }

    body.appendChild(el("h2", "su-title", "Cât vrei să exersezi zilnic?"));
    body.appendChild(el("p", "muted", "Obiectivul decide lungimea sesiunii. Poți continua și după ce l-ai atins."));
    OBIECTIVE.forEach(function (o) {
      var b = el("button", "pick" + (setupTmp.goal === o.xp ? " on" : ""));
      b.appendChild(el("b", null, o.nume));
      b.appendChild(el("span", null, o.sub + " · " + o.xp + " XP"));
      b.onclick = function () { setupTmp.goal = o.xp; renderSetup(); };
      body.appendChild(b);
    });
  }

  /** Modulele de certificare sunt deck-urile cu sufix -mN (ex. dp750-m1). */
  function isCertDeck156(id) { return /-m\d+$/.test(id) || !!examenById(id); }
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

  function setupNext() {
    if (setupStep < 2) { setupStep++; renderSetup(); return; }
    state.settings.decks = setupTmp.decks;
    state.settings.level = setupTmp.level;
    state.settings.goal = setupTmp.goal;
    state.settings.setup = true;
    save(true);
    $("#setup").hidden = true;
    show("home");
    toast("Gata. Apasă Continuă ca să începi.");
  }

  function setupBack() {
    if (setupStep === 0) {
      if (state.settings.setup) { $("#setup").hidden = true; show("home"); }
      return;
    }
    setupStep--;
    renderSetup();
  }

  // ---------------------------------------------------------------- Laborator SQL
  var XP_LAB = 5;
  var SQLjs = null, sqlPromise = null, sqlFail = null;

  function labData() { return SEED.lab || { dataset: null, exercises: [] }; }

  /** Încarcă motorul SQLite o singură dată, la cerere. */
  function loadSql() {
    if (SQLjs) return Promise.resolve(SQLjs);
    if (sqlPromise) return sqlPromise;
    sqlPromise = new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = "sql-wasm-inline.js";
      s.onload = function () {
        try {
          window.initSqlJs().then(function (S) { SQLjs = S; res(S); },
                                  function (e) { sqlFail = e; rej(e); });
        } catch (e) { sqlFail = e; rej(e); }
      };
      s.onerror = function () {
        sqlFail = new Error("motorul SQL nu a putut fi încărcat");
        rej(sqlFail);
      };
      document.head.appendChild(s);
    });
    return sqlPromise;
  }

  /** Rulează pe o bază nouă de fiecare dată, deci exercițiile nu se influențează. */
  function labRun(sql, setup, validation) {
    if (!SQLjs) return { error: "Motorul SQL nu e pregătit." };
    var db = null;
    try {
      db = new SQLjs.Database();
      db.run(labData().dataset.sql);
      if(setup)db.run(setup);
      var r, inspection = null;
      if (validation) {
        // Runtime evidence comes from this fresh SQLite database. These bounded
        // probes never compare the user's source with the reference SQL text.
        var effects = [], bytecode = [], history = (validation.historyChecks || []).map(function () { return false; });
        db.updateHook(function (operation, database, table) { effects.push({operation:operation,database:database,table:table}); });
        function probeResult(probe) {
          try {
            var rows = db.exec(probe.sql), result = rows.length ? rows[0] : {columns:[],values:[]};
            return labCheck(result,{columns:result.columns,values:probe.expected},probe.ordered !== false).ok;
          } catch (e) { return false; }
        }
        r = [];
        var statements = db.iterateStatements(sql), next;
        try {
          while (!(next = statements.next()).done) {
            var statement = next.value, columns = statement.getColumnNames(), values = [], plan = [];
            if ((validation.bytecode || []).length) {
              try { var explained=db.exec("EXPLAIN "+statement.getSQL());plan=explained.length?explained[0].values:[]; } catch (e) { /* Not every statement is explainable. */ }
            }
            while (statement.step()) values.push(statement.get());
            if (columns.length) r.push({columns:columns,values:values});
            bytecode=bytecode.concat(plan);
            (validation.historyChecks || []).forEach(function (probe,i) { if (!history[i] && probeResult(probe)) history[i]=true; });
          }
        } finally { statements.return(); }
        var checks=[];
        (validation.stateChecks || []).forEach(function (probe) { checks.push({label:probe.label,ok:probeResult(probe)}); });
        (validation.historyChecks || []).forEach(function (probe,i) { checks.push({label:probe.label,ok:history[i]}); });
        (validation.effects || []).forEach(function (rule) {
          var count=effects.filter(function (effect) {return effect.operation===rule.operation && effect.table===rule.table && (!rule.database || effect.database===rule.database);}).length;
          checks.push({label:"Operația "+rule.operation+" pe "+rule.table,ok:count >= (rule.min || 1)});
        });
        (validation.bytecode || []).forEach(function (rule) {
          var found=bytecode.some(function (op) {return op[1]===rule.opcode && (rule.p1===undefined || op[2]===rule.p1) && (rule.p2===undefined || op[3]===rule.p2) && (rule.p4===undefined || op[5]===rule.p4);});
          checks.push({label:rule.label,ok:found});
        });
        inspection={ok:checks.every(function (check) {return check.ok;}),checks:checks};
      } else r = db.exec(sql);
      var out = r.length ? { columns: r[0].columns, values: r[0].values }
                         : { columns: [], values: [] };
      if (!r.length) {
        var statement = db.prepare(sql);
        out.columns = statement.getColumnNames(); statement.free();
      }
      if (inspection) out.validation=inspection;
      db.close();
      return out;
    } catch (e) {
      try { if (db) db.close(); } catch (e2) {}
      return { error: String((e && e.message) || e) };
    }
  }

  function labNorm(v) {
    if (v === null || v === undefined) return "\u0000NULL";
    if (typeof v === "number") return Math.round(v * 1e6) / 1e6;
    return v;
  }
  function labKey(res, ordered) {
    var rows = res.values.map(function (r) { return r.map(labNorm).join("\u0001"); });
    if (!ordered) rows.sort();
    return rows.join("\u0002");
  }

  /** Compară seturile de rezultate, nu textul interogărilor. */
  function labCheck(user, sol, ordered) {
    if (user.error) return { ok: false, motiv: "Eroare SQL: " + user.error };
    if(sol.error)return {ok:false,motiv:"Datele acestui exercițiu nu au putut fi verificate."};
    if (!user.values.length || !sol.values.length) {
      var same=user.values.length === sol.values.length && user.columns.length > 0 && user.columns.length === sol.columns.length;
      return {ok:same,motiv:same?undefined:"Verifică numărul de coloane și dacă rezultatul trebuie să fie gol."};
    }
    var cu = user.values[0].length, cs = sol.values[0].length;
    if (cu !== cs) {
      return { ok: false, motiv: "Ai " + cu + (cu === 1 ? " coloană" : " coloane") +
               ", se așteptau " + cs + "." };
    }
    if (user.values.length !== sol.values.length) {
      return { ok: false, motiv: "Ai " + user.values.length + " rânduri, se așteptau " +
               sol.values.length + "." };
    }
    if (labKey(user, ordered) !== labKey(sol, ordered)) {
      return { ok: false, motiv: ordered
        ? "Numărul de rânduri e bun, dar valorile sau ordinea diferă."
        : "Numărul de rânduri e bun, dar valorile diferă." };
    }
    return { ok: true };
  }

  function labEvaluate(ex,sql,result,solution){
    var user=ex.validation ? labRun(sql,null,ex.validation) : (result || labRun(sql)),sol=solution || labRun(ex.solution),check=labCheck(user,sol,ex.ordered);
    if(!check.ok)return check;
    if(ex.validation && (!user.validation || !user.validation.ok)) {
      var failed=user.validation && user.validation.checks.filter(function (probe) {return !probe.ok;})[0];
      return {ok:false,motiv:"Transformarea bazei nu este încă verificată: "+(failed ? failed.label : "probe locale indisponibile")+"."};
    }
    var cases=ex.validationCases || [];
    for(var i=0;i<cases.length;i++){
      var test=cases[i],actual=labRun(sql,test.setup,test.validation),expected={columns:sol.columns,values:test.expected},extra=labCheck(actual,expected,ex.ordered);
      if(!extra.ok)return {ok:false,motiv:"Caz suplimentar · "+test.label+": "+extra.motiv,caseName:test.name,actual:actual,expected:expected};
      if(test.validation && (!actual.validation || !actual.validation.ok))return {ok:false,motiv:"Caz suplimentar · "+test.label+": transformarea obiectelor locale nu respectă probele exercițiului.",caseName:test.name};
    }
    return {ok:true,casesPassed:cases.length};
  }

  function labTable(res, max) {
    max = max || 12;
    var w = el("div", "tbl-wrap");
    if (res.error) {
      var er = el("div", "tbl-err", res.error);
      w.appendChild(er);
      return w;
    }
    var t = document.createElement("table");
    t.className = "tbl";
    var thead = document.createElement("tr");
    (res.columns || []).forEach(function (c) {
      thead.appendChild(el("th", null, c));
    });
    t.appendChild(thead);
    res.values.slice(0, max).forEach(function (row) {
      var tr = document.createElement("tr");
      row.forEach(function (v) {
        var td = el("td", v === null ? "nul" : null, v === null ? "NULL" : String(v));
        tr.appendChild(td);
      });
      t.appendChild(tr);
    });
    w.appendChild(t);
    if (res.values.length > max) {
      w.appendChild(el("div", "muted", "… și încă " + (res.values.length - max) + " rânduri"));
    }
    if (!res.values.length) w.appendChild(el("div", "muted", "(niciun rând)"));
    return w;
  }

  function labSchema() {
    var d = labData().dataset;
    var box = el("div", "schema");
    var head = el("button", "schema-h", "Vezi tabelele");
    var body = el("div", "schema-b");
    body.hidden = true;
    var res = labRun("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
    if (!res.error) {
      res.values.forEach(function (r) {
        var nume = r[0];
        var cols = labRun("SELECT * FROM " + nume + " LIMIT 0");
        body.appendChild(el("div", "schema-t", nume + "(" + (cols.columns || []).join(", ") + ")"));
      });
    }
    (d.note || []).forEach(function (n) { body.appendChild(el("div", "muted", "· " + n)); });
    head.onclick = function () {
      body.hidden = !body.hidden;
      head.textContent = body.hidden ? "Vezi tabelele" : "Ascunde tabelele";
    };
    box.appendChild(head);
    box.appendChild(body);
    return box;
  }

  // ---------------------------------------------------------------- exercițiul
  /**
   * Montează un exercițiu de laborator într-un container.
   * api: { setFoot(label, enabled, fn), feedback(ok, text), onSolved() }
   */
  /**
   * Diagnostic SQL, tot pe comportament: fiecare sondă e o interogare care
   * întruchipează o greșeală anume. Dacă rezultatul tău coincide cu al ei,
   * greșeala e dovedită, nu ghicită din textul interogării.
   */
  function diagnosticSql(ex, rezultatUtilizator) {
    var out = [];
    (ex.diagnostic || []).forEach(function (d) {
      var r = labRun(d.sql);
      if (r.error || !r.values) return;
      if (labKey(rezultatUtilizator, !!ex.ordered) === labKey(r, !!ex.ordered)) {
        out.push({ mesaj: d.mesaj });
      }
    });
    return out;
  }

  /**
   * Ce anume e diferit la varianta aleasă, calculat din cele două seturi de
   * rezultate. Mai exact decât un text autorat, fiindcă vorbește despre rândurile
   * pe care tocmai le-ai văzut.
   */
  function difera(ales, sol) {
    if (!ales || ales.error) return "Varianta aia nici măcar nu rulează.";
    var na = ales.values.length, ns = sol.values.length;
    if (na !== ns) {
      return "Varianta ta întoarce " + na + (na === 1 ? " rând" : " rânduri") +
             ", cea corectă " + ns + ". Întreabă-te care rânduri intră în plus " +
             "sau lipsesc, și din ce cauză.";
    }
    var ca = ales.values[0] ? ales.values[0].length : 0;
    var cs = sol.values[0] ? sol.values[0].length : 0;
    if (ca !== cs) {
      return "Numărul de rânduri e același, dar varianta ta are " + ca +
             (ca === 1 ? " coloană" : " coloane") + ", nu " + cs + ".";
    }
    return "Același număr de rânduri și de coloane, dar valorile sau ordinea " +
           "diferă. Compară rând cu rând primele două.";
  }

  /* ---------------------------------------------------------------- asistent
   * Aplicația nu are rețea și nu cheamă niciun model. Butonul ăsta doar
   * **compune** întrebarea — exercițiul, datele, codul tău și ce a picat — și o
   * pune în clipboard. Tu alegi dacă o lipești undeva și unde.
   *
   * Promptul cere un indiciu, nu soluția: un model care îți scrie direct
   * răspunsul te lasă exact unde erai.
   */
  function copiazaText(text) {
    try {
      if (Bridge && Bridge.copiaza) return !!Bridge.copiaza(text);
    } catch (e) { /* puntea lipsește */ }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e) { /* refuzat din file:// */ }
    var ta = null, previous = document.activeElement;
    try {
      ta = document.createElement("textarea");
      ta.value = text; ta.readOnly = true; ta.tabIndex = -1;
      ta.style.cssText = "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none";
      (document.querySelector('[aria-modal="true"]') || document.body).appendChild(ta);
      ta.focus({ preventScroll: true }); ta.select();
      return document.execCommand("copy");
    } catch (e) { return false; }
    finally {
      if (ta && ta.parentNode) ta.parentNode.removeChild(ta);
      if (previous && previous.isConnected && !previous.closest("[inert],[hidden]")) {
        try { previous.focus({ preventScroll: true }); } catch (e) { previous.focus(); }
      }
    }
  }

  function taie(text, maxim) {
    text = String(text || "");
    return text.length > maxim ? text.slice(0, maxim) + "\n… (restul tăiat)" : text;
  }

  /** Promptul pentru un laborator: enunț, date, codul tău, ce a picat. */
  function promptLaborator(ex, cod, rezultat, limbaj) {
    var p = [];
    p.push("Sunt la un exercițiu de data engineering și m-am blocat. " +
           "Nu-mi da soluția completă: spune-mi ce greșesc și dă-mi un indiciu, " +
           "ca să-l termin singur.");
    p.push("");
    p.push("## Exercițiul (" + limbaj + ")");
    p.push(ex.titlu);
    p.push("");
    p.push(taie(ex.task || "", 2000));
    if (ex.date) {
      p.push("");
      p.push("## Datele exercițiului");
      p.push("```python");
      p.push(taie(ex.date, 1200));
      p.push("```");
    }
    p.push("");
    p.push("## Ce am scris");
    p.push("```" + (limbaj === "SQL" ? "sql" : "python"));
    p.push(taie(cod, 2500));
    p.push("```");
    if (rezultat) {
      p.push("");
      p.push("## Ce nu merge");
      p.push(taie(rezultat, 1200));
    }
    p.push("");
    p.push("Răspunde în română.");
    return p.join("\n");
  }

  function asistentPornit() {
    return state.settings.asistent !== false;
  }

  /** Butonul, pus lângă „Resetează” în bara laboratorului. */
  function butonAsistent(da) {
    var b = el("button", "btn mini ghost asistent");
    b.appendChild(ico("copiaza"));
    b.appendChild(el("span", null, "Întreabă un asistent"));
    b.title = "Copiază întrebarea în clipboard";
    b.onclick = function () {
      var text = da();
      if (!text) return;
      var ok = copiazaText(text);
      toast(ok ? "Întrebarea e în clipboard. Lipește-o unde vrei."
               : "N-am putut copia pe acest dispozitiv.");
    };
    return b;
  }

  function labMount(host, ex, api) {
    var incercari = 0, indicii = 0, ales = null, blocuri = [];
    var sol = labRun(ex.solution);

    host.appendChild(el("div", "ls-kicker", "SQL · " + ex.cap));
    host.appendChild(el("div", "ls-term", ex.titlu));
    var t = el("div", "md");
    t.innerHTML = renderMd(ex.task);
    host.appendChild(t);
    libraryControls(host,"sql",ex.id);
    var materialNotice148=null;
    if(sqlMaterialStale148(ex.id)){materialNotice148=el("p","course-notice145","Materialul și datele acestui exercițiu au fost corectate. Ciorna și rezultatul anterior sunt păstrate; verifică din nou soluția pe datele actuale.");host.appendChild(materialNotice148);}
    if((ex.validationCases || []).length){var cases=el("details","unit lab-cases");cases.appendChild(el("summary",null,"Date suplimentare de verificare · "+ex.validationCases.length));ex.validationCases.forEach(function(test){sectiuneMd(cases,test.label,(test.description || "Verifică aceeași regulă pe aceste date suplimentare.")+"\n\n```sql\n"+test.setup+"\n```");});host.appendChild(cases);}

    var zona = el("div", "lab-zona");
    host.appendChild(zona);
    var rez = el("div", "lab-rez");
    host.appendChild(rez);

    var hintBtn = el("button", "btn mini ghost hintbtn", "Dă-mi un indiciu");
    hintBtn.hidden = true;
    hintBtn.onclick = function () {
      var h = (ex.hints || [])[indicii];
      if (!h) { hintBtn.hidden = true; return; }
      indicii++;
      var d = el("div", "hint");
      d.innerHTML = renderMd(h);
      rez.appendChild(d);
      if (indicii >= (ex.hints || []).length) hintBtn.hidden = true;
    };
    host.appendChild(hintBtn);

    function gata(okTxt) {
      api.feedback(true, okTxt || "Corect.");
      hintBtn.hidden = true;
      if (!labIsDone(ex.id)) labMark(ex.id, incercari, indicii);
      if(materialNotice148&&!sqlMaterialStale148(ex.id))materialNotice148.remove();

      function explica() {
        var exp = el("div", "md hint");
        exp.innerHTML = renderMd(ex.explain || "");
        rez.appendChild(exp);
        api.setFoot("Continuă", true, function () { api.onSolved(); });
      }
      if (!ex.decizie) { explica(); return; }
      api.setFoot("Justifică decizia", true, function () {
        zona.hidden = true;
        rez.innerHTML = "";
        decizieMount(rez, ex.decizie, api.setFoot, function (corect) {
          api.feedback(corect,
            corect ? "Ai ales motivul potrivit."
                   : "Argumentul ăsta sună plauzibil, dar nu e cel care decide.",
            corect ? "Exact." : "Nu asta decide.");
          labMark(ex.id, incercari, indicii, corect);
          explica();
        });
      });
    }
    function gresit(motiv) {
      api.feedback(false, motiv);
      if ((ex.hints || []).length && indicii < ex.hints.length) hintBtn.hidden = false;
    }

    // ---- prezice rezultatul ----
    if (ex.type === "predict") {
      var variante = shuffle([{ sql: ex.solution, ok: true }].concat(
        (ex.distractors || []).map(function (d) { return { sql: d, ok: false }; })));
      variante.forEach(function (v, i) {
        var b = el("button", "optbox");
        b.appendChild(el("div", "optbox-h", "Varianta " + (i + 1)));
        b.appendChild(labTable(labRun(v.sql), 6));
        b.setAttribute("data-pred", String(i));
        b.onclick = function () {
          if (ales !== null && variante[ales].ok) return;
          ales = i;
          var all = zona.querySelectorAll(".optbox");
          for (var k = 0; k < all.length; k++) all[k].classList.toggle("sel", k === i);
          api.setFoot("Verifică", true, verificaPredict);
        };
        zona.appendChild(b);
      });
      function verificaPredict() {
        if (ales === null) return;
        incercari++;
        var b = zona.querySelectorAll(".optbox")[ales];
        if (variante[ales].ok) {
          b.classList.add("ok");
          gata("Exact asta întoarce interogarea.");
        } else {
          b.classList.add("rau");
          gresit(difera(labRun(variante[ales].sql), sol));
        }
      }
      api.setFoot("Verifică", false, verificaPredict);
      return;
    }

    // ---- construiește din blocuri ----
    if (ex.type === "blocks") {
      var sursa = el("div", "chips");
      var tinta = el("div", "asamblat");
      zona.appendChild(el("div", "muted", "Atinge fragmentele în ordinea corectă:"));
      zona.appendChild(tinta);
      zona.appendChild(sursa);
      var amestec = shuffle((ex.blocks || []).slice());
      function deseneaza() {
        sursa.innerHTML = ""; tinta.innerHTML = "";
        amestec.forEach(function (b) {
          if (blocuri.indexOf(b) >= 0) return;
          var c = el("button", "chip mono", b);
          c.onclick = function () { blocuri.push(b); deseneaza(); };
          sursa.appendChild(c);
        });
        blocuri.forEach(function (b, i) {
          var c = el("button", "chip mono on", b);
          c.onclick = function () { blocuri.splice(i, 1); deseneaza(); };
          tinta.appendChild(c);
        });
        api.setFoot("Rulează", blocuri.length > 0, ruleazaBlocuri);
      }
      function ruleazaBlocuri() {
        incercari++;
        var sqlTxt = blocuri.join(" ");
        var r = labRun(sqlTxt);
        rez.innerHTML = "";
        rez.appendChild(el("div", "lab-lbl", "Rezultatul tău"));
        rez.appendChild(labTable(r));
        var c = labEvaluate(ex,sqlTxt,r,sol);
        if (c.ok) gata("Ordinea e corectă.");
        else gresit(c.motiv);
      }
      deseneaza();
      return;
    }

    // ---- scrie sau repară ----
    var ta = document.createElement("textarea");
    ta.className = "sqled";
    ta.spellcheck = false;
    ta.autocapitalize = "off";
    ta.autocomplete = "off";
    ta.value = (state.lab.draft && state.lab.draft[ex.id]) || ex.starter || "";
    state.lab.work=state.lab.work || {};
    if(state.lab.work[ex.id]){incercari=state.lab.work[ex.id].attempts || 0;indicii=state.lab.work[ex.id].hints || 0;}
    var sqlStatus=el("p","muted sql-code-status143");sqlStatus.setAttribute("aria-live","polite");
    function rememberSql143(status){state.lab.work[ex.id]={codeStatus:status,attempts:incercari,hints:indicii};sqlStatus.setAttribute("data-sql-code-status143",status);sqlStatus.textContent=status==="passed"?"Codul actual a trecut verificarea.":status==="failed"?"Codul actual nu trece verificarea. Rezolvările anterioare rămân în istoric.":"Ciorna curentă trebuie verificată. Rezolvările anterioare rămân în istoric.";}
    rememberSql143("unverified");
    ta.oninput = function () {
      state.lab.draft = state.lab.draft || {};
      state.lab.draft[ex.id] = ta.value;
      rez.innerHTML="";$("#lab-fb").hidden=true;$("#ls-fb").hidden=true;rememberSql143("unverified");
      save();
      api.setFoot("Rulează", ta.value.trim().length > 0, ruleaza);
    };
    zona.appendChild(ta);
    zona.appendChild(sqlStatus);

    var bar = el("div", "lab-bar");
    var reset = el("button", "btn mini ghost", "Resetează");
    reset.onclick = function () {
      ta.value = ex.starter || "";
      ta.oninput();
    };
    bar.appendChild(reset);
    if (asistentPornit()) {
      bar.appendChild(butonAsistent(function () {
        var r = labRun(ta.value);
        var ce = r.error ? "Interogarea dă eroare: " + r.error
                         : labEvaluate(ex,ta.value,r,sol).motiv || "";
        return promptLaborator(ex, ta.value, ce, "SQL");
      }));
    }
    zona.appendChild(bar);

    function ruleaza() {
      incercari++;
      var r = labRun(ta.value);
      rez.innerHTML = "";
      var gasiteSql = r.error ? [] : diagnosticSql(ex, r);
      if (gasiteSql.length) rez.appendChild(cutieDiagnostic(gasiteSql.slice(0, 2)));
      rez.appendChild(el("div", "lab-lbl", "Rezultatul tău"));
      rez.appendChild(labTable(r));
      var c = labEvaluate(ex,ta.value,r,sol);
      rememberSql143(c.ok?"passed":"failed");save();
      if (c.ok) gata();
      else {
        gresit(c.motiv);
        if(c.caseName){rez.appendChild(el("div","lab-lbl","Rezultatul pe datele suplimentare"));rez.appendChild(labTable(c.actual));}
        if (incercari >= 3 && !r.error) {
          rez.appendChild(el("div", "lab-lbl", "Ce ar trebui să iasă"));
          rez.appendChild(labTable(sol, 6));
        }
      }
    }
    api.setFoot("Rulează", ta.value.trim().length > 0, ruleaza);
  }

  // ---------------------------------------------------------------- progres
  function sqlMaterialRevision148(id) { return (labData().materialRevisions148 || {})[id]; }
  function sqlMaterialStale148(id) { var r=state.lab.done && state.lab.done[id],revision=sqlMaterialRevision148(id);return !!(r && revision && r.materialRevision148!==revision); }
  function labIsDone(id) { return !!(state.lab.done && state.lab.done[id]) && !sqlMaterialStale148(id); }
  function labMark(id, incercari, indicii, decizieOk) {
    state.lab.done = state.lab.done || {};
    var vechi = state.lab.done[id];
    var stale=sqlMaterialStale148(id),nou = !stale && vechi ? vechi : { t: incercari, h: indicii, at: Date.now() };
    if(stale){if(!state.lab.history148||typeof state.lab.history148!=="object"||Array.isArray(state.lab.history148))state.lab.history148={};state.lab.history148[id]=Object.assign({},vechi);}
    var revision=sqlMaterialRevision148(id);if(revision)nou.materialRevision148=revision;
    if (!vechi) addXp(XP_LAB);
    if (decizieOk === true) nou.d = 1;
    else if (decizieOk === false) nou.d = 0;
    state.lab.done[id] = nou;
    bumpStreak(Date.now());
    save(true);
  }
  function labChapters() {
    var caps = [], byCap = {};
    labData().exercises.forEach(function (e) {
      if (!byCap[e.cap]) { byCap[e.cap] = []; caps.push(e.cap); }
      byCap[e.cap].push(e);
    });
    return caps.map(function (c) {
      var ex = byCap[c];
      return { cap: c, ex: ex, done: ex.filter(function (x) { return labIsDone(x.id); }).length };
    });
  }
  function labNext() {
    var all = labData().exercises;
    for (var i = 0; i < all.length; i++) if (!labIsDone(all[i].id)) return all[i];
    return null;
  }
  function labById(id) {
    var all = labData().exercises;
    for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }

  // ---------------------------------------------------------------- ecranul de laborator
  var labCur = null;

  function openLab(id) {
    var ex = labById(id);
    if (!ex) return false;
    ui.activeFlow="lab";ui.activeLabId=id;save(true);
    $("#nav").hidden = true;
    $("#lab").hidden = false;
    var body = $("#lab-body");
    body.innerHTML = "";
    $("#lab-fb").hidden = true;
    $("#lab-cap").textContent = "Laborator SQL";
    body.appendChild(scheletLaborator("Se pregătește motorul SQL…"));
    $("#lab-go").disabled = true;
    labCur = ex;
    pyCur = null;
    loadSql().then(function () {
      if (labCur !== ex) return;
      body.innerHTML = "";
      $("#lab-cap").textContent = ex.cap;
      body.appendChild(labSchema());
      labMount(body, ex, labApi(ex));
      $("#lab-scroll").scrollTop = 0;
    }, function () {
      body.innerHTML = "";
      body.appendChild(el("div", "ls-term", "Motorul SQL nu pornește"));
      body.appendChild(el("p", "muted",
        "Laboratorul are nevoie de WebAssembly, care pare indisponibil pe acest WebView. " +
        "Restul aplicației funcționează normal."));
      setFootLab("Închide", true, closeLab);
    });
    return true;
  }

  function labApi(ex) {
    return {
      setFoot: setFootLab,
      feedback: function (ok, text) {
        var fb = $("#lab-fb");
        fb.hidden = false;
        fb.className = "ls-fb " + (ok ? "good" : "bad");
        fb.innerHTML = "";
        fb.appendChild(el("b", null, ok ? "Bine!" : "Încă nu."));
        fb.appendChild(el("span", null, text));
      },
      onSolved: function () {
        if(state.returnSession){closeLab();return;}
        state.resume=null;ui.activeFlow=null;save(true);
        var urm = labNext();
        if (urm && urm.id !== ex.id) openLab(urm.id);
        else closeLab();
      }
    };
  }

  function setFootLab(label, enabled, fn) {
    var b = $("#lab-go");
    b.removeAttribute("data-career-read142");b.removeAttribute("data-course-read143");
    b.textContent = label;
    b.disabled = !enabled;
    b.onclick = fn;
  }

  function closeLab() {
    if(simulationTimer){clearInterval(simulationTimer);simulationTimer=null;}
    if(state.returnSession){save(true);restoreRelatedParent();return;}
    save(true);ui.activeFlow=null;
    labCur = null;
    $("#lab").hidden = true;
    $("#nav").hidden = false;
    flush();
    show("learn");
    returnToDiscovery129();
  }

  function addLabSearch(root,kind,exercises) {
    var name=kind==="sql"?"SQL":"Python",key=kind+"-list",saved=contentFilterState[key] || {},box=el("div","lab-search");
    var input=el("input");input.type="search";input.id=kind+"-search";input.placeholder="Caută exerciții sau concepte "+name+"…";input.setAttribute("aria-label","Caută în "+name);input.value=saved.query || "";box.appendChild(input);
    var count=el("p","muted");count.id=kind+"-search-count";count.setAttribute("aria-live","polite");box.appendChild(count);
    var empty=el("div");empty.id=kind+"-empty";empty.hidden=true;empty.appendChild(el("p","muted","Niciun exercițiu pentru căutarea aceasta."));var clear=el("button","btn secondary","Șterge căutarea");clear.onclick=function(){input.value="";render();input.focus();};empty.appendChild(clear);box.appendChild(empty);
    root.insertBefore(box,root.querySelector(".hero"));
    function render(){var query=searchKey(input.value),visible=exercises.filter(function(e){return !query || searchKey(e.titlu+" "+e.cap+" "+(e.concepte || "")+" "+(e.task || "")).indexOf(query)>=0;});
      contentFilterState[key]={query:input.value};var ids={};visible.forEach(function(e){ids[e.id]=true;});var attr=kind==="sql"?"data-ex":"data-pyex";
      root.querySelectorAll("["+attr+"]").forEach(function(row){row.hidden=!ids[row.getAttribute(attr)];});
      root.querySelectorAll(".unit").forEach(function(unit){var rows=unit.querySelectorAll("["+attr+"]");if(rows.length)unit.hidden=!Array.from(rows).some(function(row){return !row.hidden;});});
      count.textContent=visible.length+" / "+exercises.length+" exerciții";empty.hidden=!!visible.length;
      var next=visible.filter(function(e){return kind==="sql"?!labIsDone(e.id):!pyComplet(e);})[0],go=$(kind==="sql"?"#btn-lab":"#btn-py");
      go.disabled=!next;go.textContent=next?"Continuă în laborator":visible.length?(query?"Selecția este rezolvată":"Tot laboratorul e rezolvat"):"Niciun exercițiu selectat";go.onclick=function(){if(next)(kind==="sql"?openLab:openPyLab)(next.id);};
    }
    input.oninput=render;render();
  }

  function renderLabPath(root) {
    var ex = labData().exercises;
    if (!ex.length) { root.appendChild(el("p", "muted center", "Laboratorul e gol.")); return; }
    var done = ex.filter(function (x) { return labIsDone(x.id); }).length;

    var hero = el("div", "hero");
    var l = el("div", "hero-l");
    l.appendChild(el("div", "hero-num", done + "/" + ex.length));
    l.appendChild(el("div", "hero-lbl", "exerciții rezolvate"));
    hero.appendChild(l);
    var r = el("div", "hero-r");
    r.appendChild(el("div", "hero-sub", labData().dataset.name));
    hero.appendChild(r);
    root.appendChild(hero);

    var urm = labNext();
    var cta = el("button", "btn big primary", urm ? "Continuă în laborator" : "Tot laboratorul e rezolvat");
    cta.id = "btn-lab";
    cta.disabled = !urm;
    cta.onclick = function () { if (urm) openLab(urm.id); };
    root.appendChild(cta);
    renderChallenge141(root,["sql"]);

    var gasit = false;
    labChapters().forEach(function (c) {
      var card = el("div", "unit");
      var head = el("div", "deck-h");
      head.appendChild(ico("eprubeta", "deck-ico"));
      var meta = el("div", "deck-meta");
      meta.appendChild(el("div", "deck-name", "SQL · " + c.cap));
      meta.appendChild(el("div", "deck-desc", c.done + "/" + c.ex.length + " rezolvate"));
      head.appendChild(meta);
      card.appendChild(head);
      var pb = el("div", "pbar");
      var pf = el("div", "pbar-f");
      pf.style.width = (c.done / c.ex.length * 100) + "%";
      pb.appendChild(pf);
      card.appendChild(pb);
      c.ex.forEach(function (e) {
        var gata2 = labIsDone(e.id);
        var next = !gata2 && !gasit;
        if (next) gasit = true;
        var row = el("button", "exrow" + (gata2 ? " done" : (next ? " next" : "")));
        row.appendChild(ico(gata2 ? "bifa" : (next ? "joaca" : "cerc"), "exrow-ico"));
        var m = el("div", "exrow-m");
        m.appendChild(el("div", "exrow-t", e.titlu));
        m.appendChild(el("div", "exrow-s", TIPURI[e.type] || e.type));
        row.appendChild(m);
        row.setAttribute("data-ex", e.id);
        row.onclick = function () { openLab(e.id); };
        card.appendChild(row);
      });
      root.appendChild(card);
    });
    addLabSearch(root,"sql",ex);
  }

  var TIPURI = {
    predict: "Prezice rezultatul",
    blocks: "Construiește din blocuri",
    fix: "Repară interogarea",
    write: "Scrie și rulează"
  };

  // ================================================================ Laborator Python
  // Codul tău rulează chiar în telefon, prin Brython, și e notat test cu test.
  // PySpark este practică offline de predicție, patchuri propuse și planuri.
  // Referințele sunt verificate separat în Spark local; telefonul nu execută Spark.
  var XP_PY = 8;

  function sparkExercises(){return ((SEED.sparkLab || {}).exercises || []);}
  function sparkById(id){return sparkExercises().filter(function(e){return e.id===id;})[0] || null;}
  function openSparkLab(id){var ex=sparkById(id);return ex?startRun([{type:"spark",ex:ex}],{titlu:"PySpark offline · "+ex.titlu}):false;}
  function renderSparkItem(body,it){
    var ex=it.ex,choice=state.sparkPractice.draft[ex.id];
    body.appendChild(el("div","ls-kicker",{predict:"Prezice rezultatul",fix:"Repară prin alegerea unui patch",plan:"Citește planul de execuție"}[ex.kind]));
    body.appendChild(el("h2",null,ex.titlu));
    body.appendChild(el("p","muted","Analiză offline · Nu se execută Spark pe telefon."));
    sectiuneMd(body,"Context și contract",ex.context);
    if(ex.kind!=="plan")body.appendChild(el("p","muted","În mediul PySpark presupunem SparkSession spark și importurile functions as F și Window."));
    sectiuneMd(body,ex.kind==="plan"?"Plan / log didactic":"Cod PySpark","```\n"+ex.code+"\n```");
    body.appendChild(el("h3",null,ex.q));libraryControls(body,"spark",ex.id);
    var list=el("div","opts");body.appendChild(list);
    ex.o.forEach(function(o,i){var b=el("button","opt",o.t);b.setAttribute("data-spark-option",String(i));b.classList.toggle("sel",choice===i);
      b.onclick=function(){if(L.verificat)return;choice=i;state.sparkPractice.draft[ex.id]=i;L.raspuns=i;Array.from(list.children).forEach(function(n,j){n.classList.toggle("sel",j===i);});save(true);setFoot("Verifică alegerea",true,verify);};list.appendChild(b);
    });
    function verify(){if(L.verificat || !Number.isInteger(choice) || !ex.o[choice])return;L.verificat=true;var ok=!!ex.o[choice].ok,prior=state.sparkPractice.done[ex.id] || {};
      state.sparkPractice.done[ex.id]={correct:ok || !!prior.correct,lastCorrect:ok,attempts:(prior.attempts || 0)+1,last:Date.now()};
      if(ok){L.corecte++;if(!prior.correct){addXp(5);L.xp+=5;}}else L.gresite++;
      Array.from(list.children).forEach(function(n,i){n.disabled=true;if(ex.o[i].ok)n.classList.add("ok");else if(i===choice)n.classList.add("rau");});
      feedback(ok,ok?"Alegere justificată de modelul dat.":"Revezi premisa și operatorul ales.");if(!ok)body.appendChild(deCeNu(ex.o[choice].w));sectiuneMd(body,"Explicație",ex.e);
      if(ex.patch)sectiuneMd(body,"Patchul propus","```python\n"+ex.patch+"\n```");
      setFoot("Continuă",true,function(){L.i++;renderItem();});save(true);
    }
    $("#ls-fb").hidden=true;setFoot("Verifică alegerea",Number.isInteger(choice),verify);
  }
  function renderSparkPath(root){
    var all=sparkExercises();if(!all.length)return;
    var section=el("details","unit");section.id="spark-practice-list";section.appendChild(el("summary",null,"PySpark offline · "+all.length+" exerciții"));
    section.appendChild(el("p","muted",(SEED.sparkLab || {}).note));
    all.forEach(function(ex){var done=state.sparkPractice.done[ex.id],latest=done && (typeof done.lastCorrect==="boolean"?done.lastCorrect:done.correct),label=latest?"✓ ":done?"De revizuit · ":"",b=el("button","exrow",label+ex.titlu+" · "+{predict:"rezultat",fix:"patch",plan:"plan"}[ex.kind]);b.setAttribute("data-spark-ex",ex.id);b.setAttribute("data-spark-latest143",latest?"correct":done?"review":"new");b.onclick=function(){openSparkLab(ex.id);};section.appendChild(b);});root.appendChild(section);
  }

  function pyData() { return (SEED.pylab || { exercises: [] }); }
  function pyAll() { return pyData().exercises; }
  function pyById(id) {
    var a = pyAll();
    for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i];
    return null;
  }
  function pyIsDone(id) { return !!(state.py.done && state.py.done[id]); }
  /** extra: { v: variația rezolvată, d: decizia justificată corect } */
  function pyMark(id, incercari, indicii, extra) {
    state.py.done = state.py.done || {};
    var vechi = state.py.done[id];
    var nou = vechi || { t: incercari, h: indicii, at: Date.now() };
    if (!vechi) addXp(XP_PY);
    if (extra) {
      if (extra.v) nou.v = 1;
      if (extra.d === true) nou.d = 1;
      else if (extra.d === false) nou.d = 0;
    }
    state.py.done[id] = nou;
    bumpStreak(Date.now());
    save(true);
  }
  function pyChapters() {
    var caps = [], byCap = {};
    pyAll().forEach(function (e) {
      if (!byCap[e.cap]) { byCap[e.cap] = []; caps.push(e.cap); }
      byCap[e.cap].push(e);
    });
    return caps.map(function (c) {
      var ex = byCap[c];
      return { cap: c, ex: ex, done: ex.filter(function (x) { return pyComplet(x); }).length };
    });
  }
  function pyNext() {
    var a = pyAll();
    for (var i = 0; i < a.length; i++) if (!pyIsDone(a[i].id)) return a[i];
    return null;
  }
  /** Rezolvat nu înseamnă demonstrat: mai pot rămâne variația și justificarea. */
  function pyComplet(ex) {
    var d = (state.py.done || {})[ex.id];
    if (!d) return false;
    if (ex.variatie && !d.v) return false;
    if (ex.decizie && d.d === undefined) return false;
    return true;
  }
  function pyRamas(ex) {
    var d = (state.py.done || {})[ex.id] || {};
    var p = [];
    if (ex.variatie && !d.v) p.push("variația");
    if (ex.decizie && d.d === undefined) p.push("justificarea");
    return p;
  }

  var pyCur = null;

  function openPyLab(id) {
    var ex = pyById(id);
    if (!ex) return false;
    ui.activeFlow="pylab";ui.activeLabId=id;save(true);
    $("#nav").hidden = true;
    $("#lab").hidden = false;
    var body = $("#lab-body");
    body.innerHTML = "";
    $("#lab-fb").hidden = true;
    $("#lab-cap").textContent = "Laborator Python";
    body.appendChild(scheletLaborator("Se pregătește motorul Python…"));
    $("#lab-go").disabled = true;
    pyCur = ex;
    labCur = null;
    window.PYLAB.load().then(function () {
      if (pyCur !== ex) return;
      body.innerHTML = "";
      $("#lab-cap").textContent = "Python · " + ex.cap;
      pyMount(body, ex, pyApi(ex));
      $("#lab-scroll").scrollTop = 0;
    }, function () {
      if (pyCur !== ex) return;
      body.innerHTML = "";
      body.appendChild(el("div", "ls-term", "Motorul Python nu pornește"));
      body.appendChild(el("p", "muted",
        "Laboratorul Python are nevoie de un interpretor care rulează în pagină. " +
        "Pe acest WebView nu a pornit. Restul aplicației funcționează normal."));
      setFootLab("Închide", true, closePyLab);
    });
    return true;
  }

  function pyApi(ex) {
    return {
      setFoot: setFootLab,
      feedback: function (ok, text, titlu) {
        var fb = $("#lab-fb");
        fb.hidden = false;
        fb.className = "ls-fb " + (ok ? "good" : "bad");
        fb.innerHTML = "";
        fb.appendChild(el("b", null, titlu || (ok ? "Toate testele trec." : "Încă nu.")));
        fb.appendChild(el("span", null, text));
      },
      onSolved: function () {
        if(state.returnSession){closePyLab();return;}
        state.resume=null;ui.activeFlow=null;save(true);
        var urm = pyNext();
        if (urm && urm.id !== ex.id) openPyLab(urm.id);
        else closePyLab();
      }
    };
  }

  function closePyLab() {
    if(state.returnSession){save(true);restoreRelatedParent();return;}
    save(true);ui.activeFlow=null;
    pyCur = null;
    $("#lab").hidden = true;
    $("#nav").hidden = false;
    flush();
    show("learn");
    returnToDiscovery129();
  }

  /** Blocul cu datele exercițiului, pliat: lung, dar trebuie să-l poți citi. */
  function pyDateBloc(date) {
    var d = el("details", "pydate");
    d.appendChild(el("summary", null, "Datele exercițiului"));
    var pre = el("pre", "mono pycod");
    pre.textContent = date;
    d.appendChild(pre);
    return d;
  }

  /**
   * Diagnosticul: ce anume e greșit în codul tău, dovedit prin rulare.
   * Apare deasupra listei de teste, fiindcă e mai util decât „5 din 7 nu trec”.
   */
  function cutieDiagnostic(gasite) {
    var b = el("div", "diag");
    b.appendChild(ico("tinta", "diag-ico"));
    var m = el("div", "diag-m");
    m.appendChild(el("div", "diag-t",
      gasite.length === 1 ? "Am găsit problema" : "Am găsit două probleme"));
    gasite.forEach(function (g) {
      var p = el("div", "md diag-p");
      p.innerHTML = renderMd(g.mesaj);
      m.appendChild(p);
    });
    b.appendChild(m);
    return b;
  }

  /** Derulează containerul care are bară, astfel încât `tinta` să fie sus. */
  function adu_in_vedere(host, tinta) {
    var sc = host && host.parentNode;
    if (!sc || sc.scrollTop === undefined) return;
    try { sc.scrollTop = Math.max(0, tinta.offsetTop - 12); } catch (e) { /* ignoră */ }
  }

  /**
   * Punctul 14 din plan: după ce ai rezolvat, spui DE CE ai ales cheia,
   * transformarea sau mecanismul. Explicația vine abia după răspunsul tău —
   * altfel ar fi o prelegere, nu o verificare.
   */
  function decizieMount(host, dec, setFoot, onDone) {
    var ales = null, raspuns = false;
    host.appendChild(el("div", "lab-lbl", "Justifică decizia"));
    var q = el("div", "dec-q");
    q.innerHTML = renderMd(dec.intrebare);
    host.appendChild(q);

    var lista = el("div", "dec-opts");
    var variante = shuffle(dec.optiuni.slice());
    variante.forEach(function (o, i) {
      var b = el("button", "optbox dec-o");
      b.appendChild(el("span", "dec-t", o.t));
      b.setAttribute("data-dec", String(i));
      b.onclick = function () {
        if (raspuns) return;
        ales = i;
        var all = lista.querySelectorAll(".dec-o");
        for (var k = 0; k < all.length; k++) all[k].classList.toggle("sel", k === i);
        setFoot("Verifică", true, verifica);
      };
      lista.appendChild(b);
    });
    host.appendChild(lista);

    function verifica() {
      if (ales === null || raspuns) return;
      raspuns = true;
      var all = lista.querySelectorAll(".dec-o");
      for (var k = 0; k < all.length; k++) {
        all[k].classList.remove("sel");
        if (variante[k].ok) all[k].classList.add("ok");
        else if (k === ales) all[k].classList.add("rau");
      }
      var corect = !!variante[ales].ok;
      if (!corect && variante[ales].de_ce) host.appendChild(deCeNu(variante[ales].de_ce));
      var exp = el("div", "md hint");
      exp.innerHTML = renderMd(dec.explicatie);
      host.appendChild(exp);
      onDone(corect);
    }
    setFoot("Verifică", false, verifica);
  }

  function pyMount(host, ex, api) {
    var incercari = 0, indicii = 0;
    // faze: baza -> variatie -> decizie -> gata
    var faza = "baza", vFacuta = false, dCorecta = null;
    state.py.work=state.py.work || {};
    var priorWork=state.py.work[ex.id] || {};
    var codePhase=priorWork.codePhase==="variatie" && ex.variatie?"variatie":"baza",codeStatus=priorWork.codeStatus || "unverified";
    if(!priorWork.codePhase && ex.variatie && (priorWork.vDone || /variatie/.test(priorWork.phase || "")))codePhase="variatie";
    incercari=priorWork.attempts || 0;indicii=priorWork.hints || 0;
    vFacuta=!!priorWork.vDone;dCorecta=priorWork.dCorrect===true?true:priorWork.dCorrect===false?false:null;
    function remember(phase,immediate){
      state.py.work[ex.id]={phase:phase,attempts:incercari,hints:indicii,vDone:vFacuta,dCorrect:dCorecta,codePhase:codePhase,codeStatus:codeStatus};
      if(ta)state.py.draft[ex.id]=ta.value;
      save(immediate!==false);
    }

    var kicker = el("div", "ls-kicker", "Python · " + ex.cap);
    host.appendChild(kicker);
    host.appendChild(el("div", "ls-term", ex.titlu));
    host.appendChild(el("div", "ls-sub", ex.concepte));

    var t = el("div", "md");
    t.innerHTML = renderMd(ex.task);
    host.appendChild(t);
    libraryControls(host,"python",ex.id);
    var dateBloc = pyDateBloc(ex.date);
    host.appendChild(dateBloc);

    var zona = el("div", "lab-zona");
    host.appendChild(zona);
    var rez = el("div", "lab-rez");
    host.appendChild(rez);

    /** Ce se rulează acum: exercițiul de bază sau variația. */
    function tinta() {
      return codePhase === "variatie"
        ? { date: ex.variatie.date, teste: ex.variatie.teste }
        : { date: ex.date, teste: ex.teste };
    }
    function indiciiSursa() {
      return (codePhase === "variatie" ? ex.variatie.hints : ex.hints) || [];
    }

    var ta = document.createElement("textarea");
    ta.className = "sqled pyed";
    ta.spellcheck = false;
    ta.autocapitalize = "off";
    ta.autocomplete = "off";
    ta.value = (state.py.draft && state.py.draft[ex.id]) || ex.starter || "";
    var codeNote=el("p","muted py-code-status143");codeNote.setAttribute("aria-live","polite");
    function codeStatusText(){codeNote.textContent=codeStatus==="passed"?"Codul actual a trecut testele pentru "+(codePhase==="variatie"?"variație.":"cerința de bază."):codeStatus==="failed"?"Codul actual nu trece verificarea. Rezolvările anterioare rămân în istoric.":"Ciorna curentă trebuie verificată înainte de continuare. Rezolvările anterioare rămân în istoric.";codeNote.setAttribute("data-python-code-status143",codeStatus);codeNote.setAttribute("data-python-code-phase143",codePhase);}
    ta.oninput = function () {
      if(faza==="gata")faza=codePhase;
      codeStatus="unverified";rez.innerHTML="";$("#lab-fb").hidden=true;$("#ls-fb").hidden=true;codeStatusText();
      state.py.draft = state.py.draft || {};
      state.py.draft[ex.id] = ta.value;
      remember(faza,false);
      api.setFoot("Rulează testele", ta.value.trim().length > 0, ruleaza);
    };
    // Tab inserează indentare, nu mută focusul: scrii Python, ai nevoie de ea.
    ta.onkeydown = function (e) {
      if (e.key !== "Tab") return;
      e.preventDefault();
      var s = ta.selectionStart, f = ta.selectionEnd;
      ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(f);
      ta.selectionStart = ta.selectionEnd = s + 4;
      ta.oninput();
    };
    zona.appendChild(ta);
    zona.appendChild(codeNote);codeStatusText();

    var bar = el("div", "lab-bar");
    var reset = el("button", "btn mini ghost", "Resetează");
    reset.onclick = function () {
      ta.value = (codePhase==="variatie" && ex.variatie.starter) || ex.starter || "";
      ta.oninput();
    };
    bar.appendChild(reset);

    var hintBtn = el("button", "btn mini ghost hintbtn", "Dă-mi un indiciu");
    hintBtn.hidden = true;
    hintBtn.onclick = function () {
      var h = indiciiSursa()[indicii];
      if (!h) { hintBtn.hidden = true; return; }
      indicii++;
      remember(faza);
      var dv = el("div", "hint");
      dv.innerHTML = renderMd(h);
      rez.appendChild(dv);
      if (indicii >= indiciiSursa().length) hintBtn.hidden = true;
    };
    bar.appendChild(hintBtn);
    if (asistentPornit()) {
      bar.appendChild(butonAsistent(function () {
        var t = tinta();
        var r = window.PYLAB.verifica(t, ta.value);
        var ce;
        if (r.err) {
          ce = r.err;
        } else {
          var picate = r.teste.filter(function (x) { return !x.ok; });
          ce = picate.length
            ? picate.map(function (x) { return "- " + x.nume + ": " + x.motiv; }).join("\n")
            : "Toate testele trec deja.";
        }
        return promptLaborator(
          { titlu: ex.titlu, task: (codePhase === "variatie" ? ex.variatie.enunt : ex.task),
            date: t.date }, ta.value, ce, "Python");
      }));
    }
    zona.appendChild(bar);

    /**
     * Punctul 15 din plan: cerința se schimbă, iar codul tău rămâne pe ecran.
     * Nu reproduci o rezolvare, o adaptezi — asta e diferența dintre a ști și
     * a-ți aminti.
     */
    function treciLaVariatie() {
      faza = "variatie";
      codePhase="variatie";codeStatus="unverified";codeStatusText();
      incercari = 0; indicii = 0;
      kicker.textContent = "Python · " + ex.cap + " · variație";
      // antetul ecranului de laborator, când suntem în el (nu și în lecție)
      var cap = document.getElementById("lab-cap");
      if (cap && !$("#lab").hidden) cap.textContent = "Python · " + ex.cap + " · variație";
      t.innerHTML = renderMd(ex.variatie.enunt);
      var nou = pyDateBloc(ex.variatie.date);
      host.replaceChild(nou, dateBloc);
      dateBloc = nou;
      rez.innerHTML = "";
      hintBtn.hidden = true;
      $("#lab-fb").hidden = true;
      if (!$("#ls-fb").hidden) $("#ls-fb").hidden = true;
      api.setFoot("Rulează testele", ta.value.trim().length > 0, ruleaza);
      remember("variatie");
      adu_in_vedere(host, host.firstChild || host);
    }

    function treciLaDecizie() {
      faza = "decizie";
      remember("decizie");
      rez.innerHTML = "";
      zona.hidden = true;
      decizieMount(rez, ex.decizie, api.setFoot, function (corect) {
        dCorecta = corect;
        // bara de jos trebuie să vorbească despre răspuns, nu despre testele
        // trecute acum două ecrane
        api.feedback(corect,
          corect ? "Ai ales motivul potrivit."
                 : "Argumentul ăsta sună plauzibil, dar nu e cel care decide.",
          corect ? "Exact." : "Nu asta decide.");
        pyMarcheaza();
        incheie();
      });
      // întrebarea trebuie să fie pe ecran, nu sub enunțul de dinainte
      adu_in_vedere(host, rez);
    }

    /** Explicația deciziilor, apoi gata. */
    function incheie() {
      faza = "gata";
      remember("gata");
      var exp = el("div", "md hint");
      exp.innerHTML = renderMd(ex.explain || "");
      rez.appendChild(exp);
      api.setFoot("Continuă", true, function () { api.onSolved(); });
    }

    function pyMarcheaza() {
      pyMark(ex.id, incercari, indicii, { v: vFacuta, d: dCorecta });
    }

    function gata() {
      hintBtn.hidden = true;

      if (faza === "baza") {
        api.feedback(true, "Soluția ta respectă toate criteriile exercițiului.");
        if (!pyIsDone(ex.id)) pyMarcheaza();
        remember("baza-rezolvata");
        if (ex.variatie) {
          var n = el("div", "md hint");
          n.innerHTML = renderMd(
            "**Acum schimbăm cerința.** Codul tău rămâne pe ecran: " +
            "adaptează-l, nu-l rescrie de la zero.");
          rez.appendChild(n);
          api.setFoot("Vezi variația", true, treciLaVariatie);
          return;
        }
        if (ex.decizie && dCorecta===null) { api.setFoot("Justifică decizia", true, treciLaDecizie); return; }
        pyMarcheaza();
        incheie();
        return;
      }

      if (faza === "variatie") {
        vFacuta = true;
        api.feedback(true, "Merge și pe cerința schimbată.");
        var ev = el("div", "md hint");
        ev.innerHTML = renderMd(ex.variatie.explain || "");
        rez.appendChild(ev);
        pyMarcheaza();
        remember("variatie-rezolvata");
        if (ex.decizie && dCorecta===null) { api.setFoot("Justifică decizia", true, treciLaDecizie); return; }
        incheie();
      }
    }

    function ruleaza() {
      if(faza==="gata")faza=codePhase;
      incercari++;
      remember(faza);
      var r = window.PYLAB.verifica(tinta(), ta.value);
      rez.innerHTML = "";

      if (r.err) {
        codeStatus="failed";codeStatusText();remember(faza);
        // O eroare de sintaxă sau la nivelul codului oprește totul: n-are rost
        // să arătăm douăsprezece teste picate pentru o paranteză lipsă.
        var box = el("div", "pyerr");
        box.appendChild(el("div", "lab-lbl", r.faza === "sintaxa"
          ? "Codul nu se compilează" : "Codul a dat o eroare"));
        var pre = el("pre", "mono", r.err);
        box.appendChild(pre);
        rez.appendChild(box);
        api.feedback(false, r.faza === "sintaxa"
          ? "Verifică sintaxa: indentarea, parantezele, două puncte la final de linie."
          : "Codul s-a oprit cu o eroare înainte să ajungă la teste.");
        if (indicii < indiciiSursa().length) hintBtn.hidden = false;
        return;
      }

      var trecute = r.teste.filter(function (x) { return x.ok; }).length;
      codeStatus=trecute===r.teste.length?"passed":"failed";codeStatusText();remember(faza);
      // Sondele sunt scrise pentru setul de date al exercițiului de bază, deci
      // nu se rulează pe variație, unde datele sunt altele.
      if (trecute < r.teste.length && codePhase === "baza" && (ex.diagnostic || []).length) {
        var gasite = window.PYLAB.diagnostic(
          { date: ex.date, diagnostic: ex.diagnostic }, ta.value);
        if (gasite.length) rez.appendChild(cutieDiagnostic(gasite.slice(0, 2)));
      }
      rez.appendChild(el("div", "lab-lbl", "Teste: " + trecute + "/" + r.teste.length));
      var lista = el("div", "pyteste");
      r.teste.forEach(function (x) {
        var row = el("div", "pytest " + (x.ok ? "ok" : "rau"));
        row.appendChild(ico(x.ok ? "bifa" : "inchide", "pytest-ico"));
        var m = el("div", "pytest-m");
        m.appendChild(el("div", "pytest-n", x.nume));
        if (!x.ok) m.appendChild(el("div", "pytest-d mono", x.motiv));
        row.appendChild(m);
        lista.appendChild(row);
      });
      rez.appendChild(lista);

      if (r.log) {
        rez.appendChild(el("div", "lab-lbl", "Ce ai tipărit"));
        var lg = el("pre", "mono pycod", r.log);
        rez.appendChild(lg);
      }

      if (trecute === r.teste.length) gata();
      else {
        api.feedback(false, (r.teste.length - trecute) + " din " + r.teste.length +
                            " teste nu trec încă.");
        if (indicii < indiciiSursa().length) hintBtn.hidden = false;
      }
    }

    api.setFoot("Rulează testele", ta.value.trim().length > 0, ruleaza);
    var resumePhase=priorWork.phase;
    if(resumePhase && resumePhase!=="gata"){
      vFacuta=!!priorWork.vDone;dCorecta=priorWork.dCorrect===true?true:priorWork.dCorrect===false?false:null;
      if((resumePhase==="variatie" || resumePhase==="baza-rezolvata") && ex.variatie)treciLaVariatie();
      else if((resumePhase==="decizie" || resumePhase==="variatie-rezolvata" || resumePhase==="baza-rezolvata") && ex.decizie)treciLaDecizie();
      else if(resumePhase==="baza-rezolvata" || resumePhase==="variatie-rezolvata")incheie();
      if(resumePhase===faza){incercari=priorWork.attempts || 0;indicii=priorWork.hints || 0;}
      if(resumePhase==="variatie"){codeStatus=priorWork.codeStatus || "unverified";codeStatusText();}
    }
    if(resumePhase==="gata"){
      if(codePhase==="variatie")treciLaVariatie();
      incercari=priorWork.attempts || 0;indicii=priorWork.hints || 0;vFacuta=!!priorWork.vDone;dCorecta=priorWork.dCorrect===true?true:priorWork.dCorrect===false?false:null;
      codeStatus=priorWork.codeStatus || "unverified";codeStatusText();
      if(codeStatus==="passed")incheie();
    }
    remember(faza);
  }

  /** Ecranul de laborator e același pentru SQL și Python; închide-l pe cel deschis. */
  function inchideLaborator() {
    if(ui.activeFlow==="course145"){courses145Leave();return;}
    if(ui.activeFlow==="lab" || ui.activeFlow==="pylab"){save(true);ui.activeFlow=null;}
    if (pyCur) closePyLab();
    else closeLab();
  }

  function renderPyPath(root) {
    var ex = pyAll();
    if (!ex.length) { root.appendChild(el("p", "muted center", "Laboratorul Python e gol.")); return; }
    var done = ex.filter(function (x) { return pyComplet(x); }).length;
    var teste = ex.reduce(function (s, e) {
      return s + e.teste.length + ((e.variatie && e.variatie.teste) || []).length;
    }, 0);

    var hero = el("div", "hero");
    var l = el("div", "hero-l");
    l.appendChild(el("div", "hero-num", done + "/" + ex.length));
    l.appendChild(el("div", "hero-lbl", "laboratoare duse până la capăt"));
    hero.appendChild(l);
    var r = el("div", "hero-r");
    r.appendChild(el("div", "hero-sub", teste + " de teste automate"));
    hero.appendChild(r);
    root.appendChild(hero);

    var urm = pyNext();
    var cta = el("button", "btn big primary",
                 urm ? "Continuă în laborator" : "Tot laboratorul e rezolvat");
    cta.id = "btn-py";
    cta.disabled = !urm;
    cta.onclick = function () { if (urm) openPyLab(urm.id); };
    root.appendChild(cta);
    renderChallenge141(root,["python","pandas","polars","pyspark"]);

    var gasit = false;
    pyChapters().forEach(function (c) {
      var card = el("div", "unit");
      var head = el("div", "deck-h");
      head.appendChild(ico("terminal", "deck-ico"));
      var meta = el("div", "deck-meta");
      meta.appendChild(el("div", "deck-name", "Python · " + c.cap));
      meta.appendChild(el("div", "deck-desc", c.done + "/" + c.ex.length + " rezolvate"));
      head.appendChild(meta);
      card.appendChild(head);
      var pb = el("div", "pbar");
      var pf = el("div", "pbar-f");
      pf.style.width = (c.done / c.ex.length * 100) + "%";
      pb.appendChild(pf);
      card.appendChild(pb);
      c.ex.forEach(function (e) {
        var gata2 = pyIsDone(e.id);
        var complet = pyComplet(e);
        var next = !gata2 && !gasit;
        if (next) gasit = true;
        var row = el("button", "exrow" + (complet ? " done" : (next ? " next" : "")));
        row.appendChild(ico(
          complet ? "bifa" : (gata2 ? "cerc_partial" : (next ? "joaca" : "cerc")),
          "exrow-ico"));
        var m = el("div", "exrow-m");
        m.appendChild(el("div", "exrow-t", e.titlu));
        m.appendChild(el("div", "exrow-s", gata2 && !complet
          ? pyRamas(e).join(" · ") + " de făcut"
          : e.teste.length + " teste · " + e.concepte));
        row.appendChild(m);
        row.setAttribute("data-pyex", e.id);
        row.onclick = function () { openPyLab(e.id); };
        card.appendChild(row);
      });
      root.appendChild(card);
    });

    var nota = el("div", "unit");
    nota.appendChild(el("div", "deck-name", "Despre PySpark"));
    var p = el("div", "md muted");
    p.innerHTML = renderMd(
      "În acest laborator rulezi Python local, cu teste și variații. Buclelor Python li se aplică o limită de pași și timp; operațiile interne foarte mari pot necesita repornirea aplicației. " +
      "Conceptele Spark se exersează și prin date mici, planuri și studii de caz, " +
      "iar exemplele marcate Spark cer un mediu Spark pentru execuție.\n\n" +
      "Pentru chei, cardinalitatea join-urilor și intervale temporale poți folosi " +
      "și exercițiile SQL din capitolul **Integritate**. " +
      "Laboratoarele **Timp** și **Reluare** verifică politici de întârziere și efecte repetate.");
    nota.appendChild(p);
    root.appendChild(nota);
    addLabSearch(root,"python",ex);
  }

  /** Mini-kata originale: feedback imediat și sesiune salvată prin fluxul de quiz existent. */
  function renderChallenge141(root, trackIds) {
    var pack=SEED.practice141 || {}, tracks=(pack.tracks || []).filter(function(t){return trackIds.indexOf(t.id)>=0;}), all=pack.questions || [];
    if(!tracks.length || !all.length)return;
    var box=el("section","unit kata-hub141");box.setAttribute("aria-label","Kata practice");
    var head=el("div","deck-h");head.appendChild(ico("terminal","deck-ico"));var meta=el("div","deck-meta");
    meta.appendChild(el("div","deck-name","Kata · provocări de interviu"));
    var visible=all.filter(function(q){return trackIds.indexOf(q.track)>=0;}),solved=visible.filter(function(q){return state.assessments[q.id] && state.assessments[q.id].correct;}).length;
    meta.appendChild(el("div","deck-desc",solved+" / "+visible.length+" rezolvate · exerciții originale cu feedback imediat"));head.appendChild(meta);box.appendChild(head);
    box.appendChild(el("p","muted","SQL și Python se pot rula în laborator. Pentru pandas, Polars și PySpark, aceste kata verifică raționamentul asupra codului; bibliotecile nu sunt instalate în aplicația offline."));
    tracks.forEach(function(track){
      var items=all.filter(function(q){return q.track===track.id;}),done=items.filter(function(q){return state.assessments[q.id] && state.assessments[q.id].correct;}).length;
      var group=el("div","kata-track141");var row=el("div","kata-track-head141");var title=el("div");title.appendChild(el("strong",null,track.name));title.appendChild(el("small","muted",track.level+" · "+track.engine));row.appendChild(title);
      var start=el("button","btn mini primary",done===items.length?"Reia · "+items.length:"Începe · "+items.length);start.setAttribute("data-kata-start141",track.id);start.onclick=function(){var pending=items.filter(function(q){return !(state.assessments[q.id] && state.assessments[q.id].correct);});var chosen=pending.length?pending:items;startRun(chosen.map(function(q){return {type:"exam",q:q,exam:"kata141"};}),{titlu:"Kata · "+track.name});};row.appendChild(start);group.appendChild(row);
      var progress=el("div","pbar");var fill=el("div","pbar-f");fill.style.width=(items.length?done/items.length*100:0)+"%";progress.appendChild(fill);group.appendChild(progress);
      var details=el("details","kata-list141");details.appendChild(el("summary",null,"Vezi provocările · "+done+"/"+items.length+" rezolvate"));
      items.forEach(function(q){var solved=state.assessments[q.id] && state.assessments[q.id].correct;var open=el("button","exrow"+(solved?" done":""));open.setAttribute("data-kata-item141",q.id);open.appendChild(ico(solved?"bifa":"joaca","exrow-ico"));var desc=el("div","exrow-m");desc.appendChild(el("div","exrow-t",q.title));desc.appendChild(el("div","exrow-s",q.level));open.appendChild(desc);open.onclick=function(){startRun([{type:"exam",q:q,exam:"kata141"}],{titlu:"Kata · "+track.name});};details.appendChild(open);});group.appendChild(details);box.appendChild(group);
    });
    var refs=el("p","kata-source141");refs.innerHTML='Format de antrenament inspirat de planurile de studiu și kata publice. Enunțurile din aplicație sunt originale. <a href="https://leetcode.com/studyplan/top-sql-50/" target="_blank" rel="noopener noreferrer">LeetCode SQL 50</a> · <a href="https://www.codewars.com/kata/sql" target="_blank" rel="noopener noreferrer">Codewars SQL kata</a> · <a href="https://www.codechef.com/practice" target="_blank" rel="noopener noreferrer">CodeChef Practice</a>.';box.appendChild(refs);root.appendChild(box);
  }

  // ---------------------------------------------------------------- Scenarii
  var XP_SCEN = 3;

  function scenData() { return SEED.scen || { modules: [], scenarios: [] }; }
  function scenAll() { return scenData().scenarios; }
  function scenById(id) {
    var a = scenAll();
    for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i];
    return null;
  }
  function scenOfMod(mid) {
    return scenAll().filter(function (s) { return s.mod === mid; });
  }
  function scenIsDone(id) {
    var d = state.scen.done[id];
    return !!(d && d.p1 && d.p2);
  }
  function scenMark(id, pas, corect) {
    var d = state.scen.done[id] || { p1: false, p2: false, g: 0 };
    d[pas === 0 ? "p1" : "p2"] = true;
    d.lastCorrect=Array.isArray(d.lastCorrect)?d.lastCorrect:[];
    d.lastCorrect[pas]=!!corect;
    if (!corect) d.g = (d.g || 0) + 1;
    d.at = Date.now();
    state.scen.done[id] = d;
    if (corect) { addXp(XP_SCEN); }
    bumpStreak(Date.now());
    save();
  }
  function scenNext(onlyEnabled) {
    var a = scenAll();
    for (var i = 0; i < a.length; i++) if ((!onlyEnabled || !a[i].deck || deckEnabled(a[i].deck)) && !scenIsDone(a[i].id)) return a[i];
    return null;
  }
  function scenModules() {
    return scenData().modules.map(function (m) {
      var sc = scenOfMod(m.id);
      return {
        mod: m, sc: sc,
        done: sc.filter(function (s) { return scenIsDone(s.id); }).length
      };
    });
  }

  /** Pornește un parcurs cu scenariile nerezolvate dintr-un modul. */
  function startScenModule(mid) {
    var sc = scenOfMod(mid);
    var ramase = sc.filter(function (s) { return !scenIsDone(s.id); });
    var lista = ramase.length ? ramase : sc;
    if (!lista.length) return false;
    var m = null;
    scenData().modules.forEach(function (x) { if (x.id === mid) m = x; });
    return startRun(lista.map(function (s) { return { type: "scen", sc: s, pas: 0 }; }),
                    { titlu: m ? m.nume : "Scenarii" });
  }

  // ---------------------------------------------------------------- UI: traseul de scenarii
  function renderScenPath(root) {
    var mods = scenModules();
    var matchesFilter = contentFilters(root, "scenarios-filter", function () { renderLearn(); }, true);
    var search = el("input"); search.type = "search"; search.placeholder = "Caută în scenarii…";
    search.id = "scenarios-search"; search.setAttribute("aria-label", "Caută în scenarii");
    var searchText = (contentFilterState["scenarios-filter"] || {}).query || "";
    search.value = searchText;
    search.oninput = function () { var pos=search.selectionStart;contentFilterState["scenarios-filter"].query = search.value;renderLearn();var fresh=$("#scenarios-search");fresh.focus();if(pos!==null)fresh.setSelectionRange(pos,pos); };
    root.appendChild(search);
    mods = mods.map(function (m) {
      var filtered = m.sc.filter(function (s) { return matchesFilter(s) && (!searchText || searchKey(JSON.stringify(s)).indexOf(searchKey(searchText)) >= 0); });
      return { mod: m.mod, sc: filtered, done: filtered.filter(function (s) { return scenIsDone(s.id); }).length };
    }).filter(function (m) { return m.sc.length > 0; });
    var visible=mods.reduce(function(n,m){return n+m.sc.length;},0);root.appendChild(el("p","muted",visible+" / "+scenAll().length+" scenarii pentru selecția curentă"));
    if (!mods.length) { root.appendChild(el("p", "muted center", "Niciun scenariu pentru selecția aceasta."));var clear=el("button","btn secondary","Șterge filtrele");clear.id="scenarios-clear";clear.onclick=function(){contentFilterState["scenarios-filter"]={};renderLearn();};root.appendChild(clear);return; }
    var tot = scenAll().length;
    var gata = scenAll().filter(function (s) { return scenIsDone(s.id); }).length;

    var hero = el("div", "hero");
    var l = el("div", "hero-l");
    l.appendChild(el("div", "hero-num", gata + "/" + tot));
    l.appendChild(el("div", "hero-lbl", "scenarii rezolvate"));
    hero.appendChild(l);
    var r = el("div", "hero-r");
    r.appendChild(el("div", "hero-sub", "concepte, nu unelte"));
    hero.appendChild(r);
    root.appendChild(hero);

    var urm = null;
    mods.some(function (m) { return m.sc.some(function (s) { if (!scenIsDone(s.id)) { urm = s; return true; } return false; }); });
    var cta = el("button", "btn big primary",
                 urm ? "Continuă cu scenariile" : "Toate scenariile sunt rezolvate");
    cta.id = "btn-scen";
    cta.disabled = !urm;
    cta.onclick = function () { if (urm) startRun([{ type: "scen", sc: urm, pas: 0 }], {titlu: urm.titlu}); };
    root.appendChild(cta);

    mods.forEach(function (m) {
      var card = el("div", "unit");
      var head = el("div", "deck-h");
      head.appendChild(ico("balon", "deck-ico"));
      var meta = el("div", "deck-meta");
      meta.appendChild(el("div", "deck-name", m.mod.nume));
      meta.appendChild(el("div", "deck-desc", m.mod.scurt));
      head.appendChild(meta);
      card.appendChild(head);

      var pb = el("div", "pbar");
      var pf = el("div", "pbar-f");
      pf.style.width = (m.sc.length ? m.done / m.sc.length * 100 : 0) + "%";
      pb.appendChild(pf);
      card.appendChild(pb);

      card.appendChild(el("div", "mod-final", "La final: " + m.mod.final));
      card.appendChild(el("div", "mod-sursa", m.mod.sursa));

      var go = el("button", "btn mini", m.done ? (m.done === m.sc.length ? "Reia" : "Continuă") : "Începe");
      go.setAttribute("data-mod", m.mod.id);
      go.onclick = function () { startRun(m.sc.map(function (s) { return {type:"scen",sc:s,pas:0}; }), {titlu:m.mod.nume}); };
      var bar = el("div", "mod-bar");
      bar.appendChild(el("span", "muted", m.done + "/" + m.sc.length));
      bar.appendChild(go);
      card.appendChild(bar);
      var choose = el("details");
      choose.style.marginTop = "12px";
      var summary = el("summary", "muted", "Alege sau reia un scenariu");
      summary.style.cursor = "pointer";
      choose.appendChild(summary);
      m.sc.forEach(function (scenario) {
        var pick = el("button", "btn mini ghost", scenario.titlu +
          (scenIsDone(scenario.id) ? " · rezolvat" : ""));
        pick.type = "button";
        pick.style.cssText = "width:100%;text-align:left;margin-top:7px";
        pick.setAttribute("data-scenario", scenario.id);
        pick.onclick = function () {
          startRun([{ type: "scen", sc: scenario, pas: 0 }], { titlu: scenario.titlu });
        };
        choose.appendChild(pick);
      });
      card.appendChild(choose);
      root.appendChild(card);
    });
  }

  // ---------------------------------------------------------------- UI: traseu
  var learnTab = "paths";

  // ------------------------------------------------- certificări
  function examene() { return (window.SEED.certificari || []); }
  function examenById(id) {
    var t = examene().filter(function (e) { return e.id === id; });
    return t.length ? t[0] : null;
  }
  // Unitatea examenului = fișa lui + unitățile modulelor de programă. Modulele sunt
  // deck-uri separate, ca niciuna să nu treacă de ~60 de carduri, dar progresul
  // examenului le însumează pe toate.
  function decurileExamenului(id) {
    var ids = [id];
    (window.SEED.module || []).forEach(function (m) {
      if (m.examen === id && ids.indexOf(m.id) < 0) ids.push(m.id);
    });
    return ids;
  }
  function cardurileExamenului(id) {
    var set = decurileExamenului(id);
    return allCards().filter(function (c) { return set.indexOf(c.deck) >= 0 || (c.certs || []).indexOf(id) >= 0; });
  }
  function progresExamen(id) {
    var lista = cardurileExamenului(id), stiute = 0;
    lista.forEach(function (c) {
      var s = state.sched[c.id];
      if (s && s.st === "review") stiute++;
    });
    return { total: lista.length, stiute: stiute };
  }

  function testExamen(id) {
    var t = (window.SEED.teste || {})[id];
    return t && t.length ? t : [];
  }
  function porneateTest(id) {
    return startExamPractice(id, "all", "");
  }
  function startExamPractice(id, mode, domain, provenance) {
    var t = testExamen(id).filter(function (q) {
      return (!domain || q.dom === domain || (q.domains || []).indexOf(domain) >= 0) && (!provenance || (q.provenance || {}).kind===provenance);
    });
    if (mode === "mistakes") t = t.filter(function (q) {
      return state.assessments[q.id] && !state.assessments[q.id].correct;
    });
    if (mode === "short") t = shuffle(t.slice()).slice(0, 10);
    if (!t.length) { toast(mode === "mistakes" ? "Nu ai greșeli de recapitulat pentru selecția aceasta." : "Nicio întrebare pentru selecția aceasta."); return false; }
    prepareRelatedRun129();
    return startRun(t.map(function (q) { return { type: "exam", q: q, exam: id }; }),
             { titlu: "Test de probă · " + (examenById(id) || {}).cod });
  }

  function startCertificateStudy143(id){
    if(courses145Api() && courses145Api().courseFor(id))return courses145Api().start(id);
    var pending=state.resume,lessons=materiale(id).lectii,reading=pending && pending.kind==="reading" && lessons.some(function(l){return l.id===pending.id;});
    if(reading || (pending && pending.kind==="study" && pending.deck===id))return resumeSession();
    if(buildQueue(id).length){startSession(id);return true;}
    var reads=state.settings.courseRead143 || {},careerReads=state.settings.careerRead142 || {};
    if(lessons.length){deschideLectie(lessons.filter(function(l){return !reads[l.id] && !careerReads[l.id];})[0] || lessons[0]);return true;}
    if(testExamen(id).length)return startExamPractice(id,"short","");
    toast("Certificarea nu are încă materiale locale disponibile. Consultă resursa oficială din catalog.");return false;
  }

  function renderCertPath(root) {
    var ex = examene();
    if (!ex.length) {
      root.appendChild(gol("insigna", "Nicio certificare",
        "Unitățile de examen nu au fost încărcate."));
      return;
    }
    root.appendChild(el("p", "muted cert-start-note141",
      "Alege certificarea și pornește direct. Progresul tău rămâne salvat între sesiuni."));

    ex.forEach(function (e) {
      var p = progresExamen(e.id);
      var course145=courses145Api() && courses145Api().courseFor(e.id),reading145=course145 && courses145Api().progress(course145);
      var row = el("div", "unit exam-row");
      row.setAttribute("data-exam", e.id);

      var top = el("div", "exam-top");
      top.appendChild(ico(icoDeck(e.id), "ico"));
      var txt = el("div", "exam-txt");
      var titlu = el("div", "exam-titlu");
      if (e.furnizor) titlu.appendChild(el("span", "exam-cod", e.cod));
      titlu.appendChild(el("span", null, e.scurt));
      txt.appendChild(titlu);
      txt.appendChild(el("div", "muted exam-sub",
        (e.furnizor ? e.furnizor + " · " : "") + (reading145 ? reading145.read+"/"+reading145.total+" lecții parcurse" : p.total+" carduri"+(p.stiute?" · "+p.stiute+" știute":""))));
      top.appendChild(txt);
      row.appendChild(top);

      if (e.deCe) row.appendChild(el("div", "muted exam-dece", e.deCe));
      var currentResource=((SEED.career142 || {}).resources || []).filter(function(r){return r.id===e.id;})[0];
      if(currentResource){row.appendChild(el("p","career-resource-status142",careerResourceStatus142(currentResource)));row.appendChild(el("p","muted",currentResource.note));appendLearningSources(row,[["Verifică sursa oficială curentă",currentResource.guideUrl || currentResource.url]]);}

      var bara = el("div", "progress");
      var umplut = el("div");
      umplut.style.width = (reading145 ? Math.round(reading145.read/Math.max(1,reading145.total)*100) : p.total ? Math.round(p.stiute / p.total * 100) : 0) + "%";
      bara.appendChild(umplut);
      row.appendChild(bara);

      var actions=el("div","cert-actions141");
      var begin=el("button","btn primary cert-begin141",(reading145 ? reading145.read : p.stiute) ? "Continuă învățarea" : "Începe învățarea");
      begin.setAttribute("data-cert-start141",e.id);begin.disabled=!p.total && !materiale(e.id).lectii.length && !testExamen(e.id).length;begin.onclick=function(){startCertificateStudy143(e.id);};actions.appendChild(begin);
      if(begin.disabled)row.appendChild(el("p","muted","Materialele locale sunt în curs de pregătire; resursa oficială rămâne disponibilă."));
      var details=el("button","btn mini ghost cert-details141","Programa și detalii");details.setAttribute("data-cert-details141",e.id);details.onclick=function(){deschideExamen(e.id);};actions.appendChild(details);
      var questions=testExamen(e.id);
      if(questions.length){var quiz=el("button","btn mini secondary","Test scurt · "+Math.min(10,questions.length));quiz.setAttribute("data-cert-test141",e.id);quiz.onclick=function(){startExamPractice(e.id,"short","");};actions.appendChild(quiz);}
      row.appendChild(actions);
      root.appendChild(row);
    });
  }

  function openDomainMastery(examId) {
    var body=$("#lab-body");body.innerHTML="";$("#lab-cap").textContent="Domenii și progres";
    labCur=null;pyCur=null;$("#nav").hidden=true;$("#lab").hidden=false;$("#lab-fb").hidden=true;
    var label=el("label",null,"Certificare");var select=el("select");select.id="mastery-exam";select.setAttribute("aria-label","Certificare pentru progresul pe domenii");
    examene().filter(function(e){return e.furnizor;}).forEach(function(e){var option=el("option",null,e.cod);option.value=e.id;select.appendChild(option);});
    select.value=examId || "dp750";label.appendChild(select);body.appendChild(label);var host=el("div");body.appendChild(host);
    function render(){host.innerHTML="";renderDomainMastery(host,select.value);$("#lab-scroll").scrollTop=0;}select.onchange=render;render();
    setFootLab("Închide",true,inchideLaborator);
  }

  // ------------------------------------------- materiale de studiu
  function materiale(examen) {
    var S = window.SEED;
    return {
      lectii: (S.lectii || []).filter(function (x) { return x.examen === examen; }),
      exercitii: (S.exercitii || []).filter(function (x) { return x.examen === examen; }),
      minitest: (S.minitest || []).filter(function (x) { return x.examen === examen; }),
      module: (S.module || []).filter(function (x) { return x.examen === examen; })
    };
  }

  function studySection132(host,title,key){
    var section=el("section","study-section132");section.setAttribute("data-study-title",title);if(key)section.setAttribute("data-study-key",key);
    var heading=el("h3","pas-h",title);section.appendChild(heading);host.appendChild(section);return section;
  }
  function studyOutline132(host){
    var old=host.querySelector(":scope > .study-outline132");if(old)old.remove();
    var sections=Array.from(host.children).filter(function(x){return x.classList.contains("study-section132");});if(sections.length<2)return;
    var nav=el("nav","study-outline132");nav.setAttribute("aria-label","Cuprinsul materialului");var details=el("details"),summary=el("summary",null,"Cuprins · "+sections.length+" secțiuni");details.appendChild(summary);var links=el("div","study-outline-links132");
    sections.forEach(function(section,i){var id=section.id || (host.id || "study")+"-section132-"+i;section.id=id;section.setAttribute("aria-labelledby",id+"-heading");var heading=section.querySelector(".pas-h");heading.id=id+"-heading";heading.tabIndex=-1;
      var previousNumber=heading.querySelector(".study-number132");if(previousNumber)previousNumber.remove();var number=el("span","study-number132",String(i+1).padStart(2,"0"));number.setAttribute("aria-hidden","true");heading.insertBefore(number,heading.firstChild);
      var button=el("button","study-jump132",String(i+1).padStart(2,"0")+" · "+section.getAttribute("data-study-title"));button.type="button";button.setAttribute("aria-controls",id);button.onclick=function(){details.open=false;heading.focus({preventScroll:true});section.scrollIntoView({block:"start",behavior:"auto"});if(host.id==="lab-body")save(true);};links.appendChild(button);
    });details.appendChild(links);nav.appendChild(details);host.insertBefore(nav,sections[0]);host.classList.add("study-page132");
  }
  function sectiuneMd(gazda, titlu, text) {
    if (!text) return;
    var section=studySection132(gazda,titlu),d=el("div","md");d.innerHTML=renderMd(text);section.appendChild(d);return section;
  }
  function deschideLectie(l) {
    if(courses145Api()){var course145=courses145Api(),owner145=course145.legacy[l.id],newUnit145=course145.unitFor(l.id);if(owner145)return course145.open(owner145.courseId,l.id);if(l.course145 && newUnit145)return course145.open(newUnit145.courseId,l.id);}
    preserveParent129(sessionSnapshot());labCur=null;pyCur=null;L=null;ui.activeFlow="reading";ui.activeReadingId=l.id;
    $("#study").hidden=true;$("#lesson").hidden=true;$("#lab").hidden=false;$("#nav").hidden=true;
    var body=$("#lab-body");body.innerHTML="";body.classList.remove("study-page132");$("#lab-cap").textContent="Lecție";
    var module=(SEED.module || []).concat(SEED.domainModules || []).filter(function(m){return m.id===l.modul;})[0];
    if(module)body.appendChild(el("p","study-breadcrumb132",module.nume));body.appendChild(el("h2","exam-h",l.titlu));
    var goal=studySection132(body,"Ce vei învăța","goal");goal.appendChild(el("p","rezumat",l.obiectiv || "Consultă explicația și verificările acestei lecții."));
    sectiuneMd(body,"Explicație",l.explicatie);
    if(l.supplement140){var sup=l.supplement140,host=body.lastElementChild,extra=el("div","objective-supplement140");extra.setAttribute("data-objective-supplement",sup.id);extra.appendChild(el("h3",null,"Completare verificată · programa offline"));var text=el("div","md");text.innerHTML=renderMd(sup.text+"\n\n```"+sup.language+"\n"+sup.code+"\n```\n\n**Rezultat așteptat și limite:** "+sup.expected);extra.appendChild(text);extra.appendChild(el("p","muted",sup.execution==="executed"?"Rulat: "+sup.executionEvidence:"Exemplu documentar; serviciul indicat nu a fost executat. Datele și calculele pot avea probe locale distincte."));var sourceLink=el("a","muted","Documentație de aprofundare · "+sup.reviewedOn);sourceLink.href=sup.source;sourceLink.target="_blank";sourceLink.rel="noopener noreferrer";extra.appendChild(sourceLink);host.appendChild(extra);}

    if(l.examples135){var examples=studySection132(body,"Exemplu rezolvat","examples");examples.appendChild(el("p","muted","Etichetele descriu verificarea consemnată în mediul de testare. Codul Spark și serviciile cloud nu se execută în aplicație."));l.examples135.forEach(function(x){var state=x.execution || {},label=state.status==="executed"?"Rulat în mediul de testare · "+state.engine+" "+state.version:"Nerulat · "+x.engine;examples.appendChild(el("p","execution-proof135",label));if(state.status==="executed")examples.appendChild(el("p","muted","Python "+state.python+" · Java "+state.java+" · dovadă "+state.evidenceId+" · "+(String(state.filesystem || "").indexOf("Java NIO")>=0?"Fișiere reale Windows · adaptor Java NIO · permisiuni POSIX neverificate":state.filesystem || "")));else examples.appendChild(el("p","muted",state.reason));var code=el("div","md");code.innerHTML=renderMd("```"+x.language+"\n"+x.code+"\n```");examples.appendChild(code);examples.appendChild(el("h4",null,"Rezultat așteptat și limite"));examples.appendChild(el("p",null,x.expected));});}
    else if(l.exemplu)sectiuneMd(body,"Exemplu rezolvat","**"+l.exemplu.enunt+"**\n\n"+l.exemplu.rezolvare);
    if(l.greseli && l.greseli.length){var mistakes=studySection132(body,"Greșeli frecvente","mistakes"),ul=el("ul","domeniu-lista");l.greseli.forEach(function(x){ul.appendChild(el("li",null,x));});mistakes.appendChild(ul);}
    if(l.autoevaluare && l.autoevaluare.length){var review=studySection132(body,"Autoevaluare","check");review.appendChild(el("p","muted","Formulează răspunsul înainte să deschizi explicația."));l.autoevaluare.forEach(function(x,i){var box=el("div","domeniu");box.appendChild(el("div","domeniu-nume",(i+1)+". "+x.q));var button=el("button","btn mini ghost","Arată răspunsul");button.onclick=function(){button.remove();var answer=el("div","md");answer.innerHTML=renderMd(x.a);box.appendChild(answer);};box.appendChild(button);review.appendChild(box);});}
    if(l.legacyProduction){var history=studySection132(body,"Judecata de producție","production-history"),original=l.legacyProduction,details=el("details","unit");details.appendChild(el("summary",null,"Lecția originală integrală · versiunea "+(l.legacyRevision || "1.34.0")));details.appendChild(el("p","muted","Text istoric păstrat. Comenzile și explicațiile revizuite sunt în secțiunile de mai sus."));sectiuneMd(details,"Obiectivul original",original.obiectiv);sectiuneMd(details,"Explicația originală",original.explicatie);if(original.exemplu)sectiuneMd(details,"Exemplul original",original.exemplu.enunt+"\n\n"+original.exemplu.rezolvare);if(original.greseli)sectiuneMd(details,"Greșelile originale",original.greseli.map(function(x){return "- "+x;}).join("\n"));(original.autoevaluare || []).forEach(function(x){sectiuneMd(details,x.q,x.a);});history.appendChild(details);}
    var practice=studySection132(body,"Continuă cu practica","practice");appendRelated(practice,l.id,"Exerciții și explicații asociate");
    if(!practice.querySelector("button"))practice.appendChild(el("p","muted","Poți reveni la curs pentru celelalte lecții și exerciții ale modulului."));
    appendLearningSources(body,l.sources);
    var personal=studySection132(body,"Notițe și favorite","personal");libraryControls(personal,"lesson",l.id);studyOutline132(body);
    if(/^career142-/.test(l.id) || (l.examen && examenById(l.examen))){
      body.appendChild(el("p","muted career-reading-note142","Marcarea lecturii păstrează locul în curs. Competențele se verifică separat prin răspunsuri, cod și proiecte."));
      var isRead=!!((state.settings.careerRead142 || {})[l.id] || (state.settings.courseRead143 || {})[l.id]);
      setFootLab(isRead?"Parcursă · continuă":"Am parcurs · continuă",true,function(){
        state.settings.courseRead143=state.settings.courseRead143 || {};state.settings.courseRead143[l.id]=Date.now();
        if(/^career142-/.test(l.id)){state.settings.careerRead142=state.settings.careerRead142 || {};state.settings.careerRead142[l.id]=Date.now();}save(true);
        var certificate=l.examen && examenById(l.examen),sameCourse=(SEED.lectii || []).filter(function(x){return certificate?x.examen===l.examen:x.modul===l.modul && careerOwner142("lessons",x)===careerOwner142("lessons",l) && /^career142-/.test(x.id);}),pos=sameCourse.findIndex(function(x){return x.id===l.id;});
        var next=sameCourse.slice(pos+1).concat(sameCourse.slice(0,pos)).filter(function(x){return !state.settings.courseRead143[x.id] && !((state.settings.careerRead142 || {})[x.id]);})[0];
        ui.activeFlow=null;if(next)deschideLectie(next);else if(certificate){
          if(testExamen(l.examen).length)startExamPractice(l.examen,"short","");
          else{state.resume=null;save(true);$("#lab").hidden=true;learnTab="cert";show("learn");toast("Lectura cursului este parcursă. Alege materialele de aprofundare sau resursa oficială a certificării.");}
        }else careerStart142(careerOwner142("lessons",l),true);
      });
      $("#lab-go").setAttribute("data-career-read142",l.id);
      $("#lab-go").setAttribute("data-course-read143",l.id);
    }else{$("#lab-go").removeAttribute("data-career-read142");setFootLab("Închide",true,inchideLaborator);}
    $("#lab-scroll").scrollTop=0;save(true);
  }

  function deschideExercitiu(x) {
    var body = $("#lab-body");
    $("#lab-cap").textContent = "Exercițiu";
    body.innerHTML = "";
    body.appendChild(el("h2", "exam-h", x.titlu));
    libraryControls(body,(SEED.caseStudies || []).some(function(c){return c.id===x.id;})?"case":"exercise",x.id);
    sectiuneMd(body, "Context", x.context);
    if (x.mediu) {
      var m = el("div", "nesigur");
      m.appendChild(el("div", "cheie-et", "MEDIU ȘI PRESUPUNERI"));
      var md = el("div", "md");
      md.innerHTML = renderMd(x.mediu);
      m.appendChild(md);
      if (x.presupuneri && x.presupuneri.length) {
        var ul = el("ul", "domeniu-lista");
        x.presupuneri.forEach(function (t) { ul.appendChild(el("li", null, t)); });
        m.appendChild(ul);
      }
      body.appendChild(m);
    }
    sectiuneMd(body, "Date", x.date);
    if (x.sarcini && x.sarcini.length) {
      body.appendChild(el("div", "pas-h", "Ce ai de făcut"));
      var ol = el("ol", "domeniu-lista");
      x.sarcini.forEach(function (t) { ol.appendChild(el("li", null, t)); });
      body.appendChild(ol);
    }
    sectiuneMd(body, "Rezultat așteptat", x.rezultat);
    if (x.criterii && x.criterii.length) {
      var c = el("div", "cheie");
      c.appendChild(el("div", "cheie-et", "CRITERII DE REUȘITĂ"));
      var ulc = el("ul", "domeniu-lista");
      x.criterii.forEach(function (t) { ulc.appendChild(el("li", null, t)); });
      c.appendChild(ulc);
      body.appendChild(c);
    }
    // Indiciile și soluția stau ascunse: un exercițiu cu soluția la vedere nu e exercițiu.
    (x.indicii || []).forEach(function (t, i) {
      var b = el("button", "btn mini ghost", "Indiciu " + (i + 1));
      b.style.cssText = "margin:6px 6px 0 0";
      b.onclick = function () {
        b.remove();
        var d = el("div", "md");
        d.style.marginTop = "6px";
        d.innerHTML = renderMd(t);
        body.insertBefore(d, bs);
      };
      body.appendChild(b);
    });
    var bs = el("button", "btn big primary", "Arată soluția");
    bs.style.cssText = "width:100%;margin-top:16px";
    bs.onclick = function () {
      bs.remove();
      sectiuneMd(body, "Soluție", x.solutie);studyOutline132(body);
      if (x.verificat) body.appendChild(el("div", "slab", x.verificat));
    };
    body.appendChild(bs);
    appendRelated(body,x.id,"Rulează practica locală asociată");studyOutline132(body);
    setFootLab("Închide", true, function () { inchideLaborator(); });
    $("#lab-scroll").scrollTop = 0;
  }

  function miniQuestion(mt,q) {
    return {id:mt.id+":"+q.id,dom:mt.titlu,q:q.q,e:q.e,o:q.o.map(function(t,i){return {t:t,ok:i===q.corect,w:i===q.corect?null:(q.de_ce || {})[i] || (q.de_ce || {})[String(i)]};})};
  }
  function porneateMiniTest(mt) {
    prepareRelatedRun129();
    startRun(mt.intrebari.map(function (q) {
      return { type: "exam", exam: mt.examen, q:miniQuestion(mt,q) };
    }), { titlu: mt.titlu });
  }

  function randDate(eticheta, valoare) {
    var d = el("div", "fisa-rand");
    d.appendChild(el("span", "fisa-et", eticheta));
    d.appendChild(el("span", "fisa-val", valoare));
    return d;
  }

  function deschideExamen(id) {
    var e = examenById(id);
    if (!e) return;
    ui.activeFlow="course";ui.courseExam=id;labCur=null;pyCur=null;
    var body = $("#lab-body");
    $("#lab-cap").textContent = e.cod;
    $("#lab").hidden = false;
    $("#nav").hidden = true;
    body.innerHTML = "";
    appendKnowledgeLink129(body,id,"certification");

    body.appendChild(el("h2", "exam-h", e.scurt));
    var currentResource=((SEED.career142 || {}).resources || []).filter(function(r){return r.id===e.id;})[0];
    if(currentResource){body.appendChild(el("p","career-resource-status142",careerResourceStatus142(currentResource)));body.appendChild(el("p","muted",currentResource.note));appendLearningSources(body,[["Sursa oficială și versiunea programei",currentResource.guideUrl || currentResource.url]]);}
    if (e.insigna) body.appendChild(el("div", "muted exam-oficial", e.insigna));
    if (e.deCe) body.appendChild(el("p", null, e.deCe));

    // ---- fișa examenului
    var f = e.format || {};
    var fisa = el("div", "fisa");
    fisa.appendChild(el("div", "cheie-et", "FIȘA EXAMENULUI"));
    if (e.furnizor) fisa.appendChild(randDate("Furnizor", e.furnizor));
    if (f.intrebari) fisa.appendChild(randDate("Întrebări", String(f.intrebari)));
    if (f.minute) fisa.appendChild(randDate("Durată", f.minute + " minute"));
    if (f.cost) fisa.appendChild(randDate("Cost", f.cost));
    if (f.prag) fisa.appendChild(randDate("Prag", f.prag));
    if (e.versiune) fisa.appendChild(randDate("Versiune", e.versiune));
    if (fisa.children.length > 1) studySection132(body,"Fișa examenului","exam-info").appendChild(fisa);

    if (e.materialNou && e.materialNou.length) {
      body.appendChild(el("div", "pas-h", "Materiale de aprofundare"));
      var coverage = el("ul", "domeniu-lista");
      e.materialNou.forEach(function (d) {
        coverage.appendChild(el("li", null, d.nume + " · " + d.carduri + " carduri noi"));
      });
      body.appendChild(coverage);
      body.appendChild(el("p", "muted", "Fiecare card nou include explicație, exemplu, greșeală frecventă și surse. " +
        "Completează practica din aplicație cu laboratoare și verifică programa oficială înainte de examen."));
    }

    // ---- domeniile cu pondere
    if (e.domenii && e.domenii.length) {
      var domainOverview=studySection132(body,"Domeniile măsurate","domains"),domainDetails=el("details","study-domain-overview132");domainDetails.appendChild(el("summary",null,"Vezi domeniile și ponderile"));domainOverview.appendChild(domainDetails);
      e.domenii.forEach(function (d) {
        var box = el("div", "domeniu");
        var cap = el("div", "domeniu-cap");
        cap.appendChild(el("span", "domeniu-nume", d.nume));
        if (d.pondere) cap.appendChild(el("span", "domeniu-pond", d.pondere));
        box.appendChild(cap);
        var ul = el("ul", "domeniu-lista");
        (d.subiecte || []).forEach(function (t) { ul.appendChild(el("li", null, t)); });
        box.appendChild(ul);
        domainDetails.appendChild(box);
      });
    }

    if (e.nou) {
      var n = el("div", "cheie");
      n.appendChild(el("div", "cheie-et", "CE E NOU"));
      var nd = el("div", "md");
      nd.innerHTML = renderMd(e.nou);
      n.appendChild(nd);
      body.appendChild(n);
    }

    // Ce n-a putut fi verificat se spune, nu se ascunde: o pondere inventată
    // trimite candidatul să învețe fix unde nu trebuie.
    if (e.nesigur) {
      var av = el("div", "nesigur");
      av.appendChild(el("div", "cheie-et", "CE N-AM PUTUT VERIFICA"));
      av.appendChild(el("div", null, e.nesigur));
      body.appendChild(av);
    }

    // ---- materiale de studiu
    renderExamTemplate(body,e.id);
    var mat = materiale(e.id);
    if(mat.lectii.length || mat.exercitii.length || mat.minitest.length){
      var library=studySection132(body,"Biblioteca pe module","library"),groups={},order=[];
      function addMaterial(kind,item){var key=item.modul || "other";if(!groups[key]){groups[key]=[];order.push(key);}groups[key].push({kind:kind,item:item});}
      mat.lectii.forEach(function(x){addMaterial("lesson",x);});mat.exercitii.forEach(function(x){addMaterial("exercise",x);});mat.minitest.forEach(function(x){addMaterial("mini",x);});
      order.forEach(function(key,i){var module=mat.module.concat(SEED.domainModules || []).filter(function(m){return m.id===key;})[0],entries=groups[key],details=el("details","study-module132");details.setAttribute("data-study-module",key);details.open=i===0;
        var counts={lesson:0,exercise:0,mini:0};entries.forEach(function(x){counts[x.kind]++;});details.appendChild(el("summary",null,(module?module.nume:"Materiale complementare")+" · "+entries.length+" materiale"));details.appendChild(el("p","muted",counts.lesson+" lecții · "+counts.exercise+" exerciții · "+counts.mini+" mini-teste"));
        entries.forEach(function(row){var button=el("button","mat-row");button.setAttribute("data-course-material",row.kind+":"+row.item.id);button.appendChild(el("span","mat-tip",{lesson:"lecție",exercise:"exercițiu",mini:"mini-test"}[row.kind]));button.appendChild(el("span",null,row.item.titlu));button.onclick=function(){if(row.kind==="lesson")deschideLectie(row.item);else if(row.kind==="exercise")openCaseStudy(row.item.id);else porneateMiniTest(row.item);};details.appendChild(button);});library.appendChild(details);
      });
    }

    // ---- acțiuni
    var p = progresExamen(e.id);
    var act = el("div", "exam-act");
    var bC = el("button", "btn big primary", "Învață cardurile (" + p.total + ")");
    bC.style.width = "100%";
    bC.onclick = function () {
      inchideLaborator();
      startSession(e.id);
    };
    act.appendChild(bC);

    var t = testExamen(e.id);
    var bT = el("button", "btn big", t.length
      ? "Test de probă (" + t.length + " întrebări)"
      : "Test de probă — în lucru");
    bT.style.cssText = "width:100%;margin-top:9px";
    bT.disabled = !t.length;
    bT.onclick = function () { porneateTest(e.id); };
    act.appendChild(bT);
    if (t.length) {
      var selector = el("select"); selector.id = "exam-domain"; selector.setAttribute("aria-label", "Domeniul testului");
      var first = el("option", null, "Toate domeniile"); first.value = ""; selector.appendChild(first);
      var domains = [];
      t.forEach(function (q) { (q.domains || [q.dom]).forEach(function (d) { if (d && domains.indexOf(d)<0) domains.push(d); }); });
      domains.sort().forEach(function (d) { var o = el("option", null, d); o.value = d; selector.appendChild(o); });
      act.appendChild(selector);
      [["short", "Sesiune de 10 întrebări"], ["domain", "Exersează domeniul ales"], ["mistakes", "Recapitulează greșelile"]].forEach(function (pair) {
        var b = el("button", "btn secondary", pair[1]); b.setAttribute("data-exam-mode", pair[0]);
        b.onclick = function () { startExamPractice(e.id, pair[0], selector.value); }; act.appendChild(b);
      });
      var practiced = t.filter(function (q) { return !!state.assessments[q.id]; });
      var solved = practiced.filter(function (q) { return state.assessments[q.id].correct; });
      act.appendChild(el("p", "muted", practiced.length + " întrebări încercate · " + solved.length +
        " cu ultimul răspuns corect. Aceste rezultate descriu exercițiile locale, nu scorul oficial al examenului."));
      var consolidation = el("details", "unit"); consolidation.appendChild(el("summary", null, "Rezultate pe domenii"));
      domains.forEach(function (domain) {
        var questions = t.filter(function (q) { return q.dom === domain || (q.domains || []).indexOf(domain)>=0; });
        var tried = questions.filter(function (q) { return !!state.assessments[q.id]; });
        var errors = tried.filter(function (q) { return !state.assessments[q.id].correct; });
        consolidation.appendChild(el("p", null, domain + ": " + tried.length + "/" + questions.length + " încercate · " + errors.length + " de recapitulat"));
      });
      act.appendChild(consolidation);
      renderDomainMastery(act,e.id);
      var objectives = (SEED.objectives || []).filter(function (o) { return o.exam === e.id; });
      var coverage = el("details", "unit"); coverage.appendChild(el("summary", null, "Programa și materialele asociate · " + objectives.length + " obiective"));
      coverage.appendChild(el("p", "muted", "Asocieri tematice către materialele din aplicație. Pentru subobiective și schimbări recente, verifică sursa oficială. Documentația externă necesită internet; lecțiile și exercițiile sunt offline."));
      objectives.forEach(function (objective) {
        var section = el("details"); section.appendChild(el("summary", null, objective.text));
        objective.competencies.forEach(function (id) {
          var skill = (SEED.competencies || []).filter(function (c) { return c.id === id; })[0];
          if (!skill) return;
          var b = el("button", "btn mini ghost", skill.name);
          b.onclick = function () { prepareRelatedRun129(); startCurriculum(skill.deck, "understand", skill.id); };
          section.appendChild(b);
        });
        coverage.appendChild(section);
      });
      act.appendChild(coverage);
    }
    studySection132(body,"Antrenament și recapitulare","training").appendChild(act);

    if (e.surse && e.surse.length) {
      var sv = el("div", "surse");
      sv.appendChild(el("div", "surse-et", "SURSA OFICIALĂ"));
      var linie = el("div");
      e.surse.forEach(function (x) {
        var a = el("a", null, x.nume);
        a.href = x.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        linie.appendChild(a);
      });
      sv.appendChild(linie);
      body.appendChild(sv);
    }

    studyOutline132(body);
    setFootLab("Închide", true, function () { inchideLaborator(); });
    $("#lab-scroll").scrollTop = 0;
  }

  function startCurriculum(deck, level, skillId) {
    var skills = (SEED.competencies || []).filter(function (s) { return s.deck === deck && (!skillId || s.id === skillId); });
    if (!skillId) {
      skills.sort(function (a, b) {
        var aq=skillQuestion129(a,level),bq=skillQuestion129(b,level),qa = aq && state.assessments[aq.id], qb = bq && state.assessments[bq.id];
        return (qa && qa.correct ? 1 : 0) - (qb && qb.correct ? 1 : 0);
      });
      skills = skills.slice(0, 6);
    }
    var items = [];
    skills.forEach(function (s) {
      var card = skillCard129(s,level);
      var question = skillQuestion129(s,level);
      if (card) items.push({type:"card",card:card});
      (s.extraCards || s.supplementaryCards || []).map(cardById).filter(function(c){return c && c.level===level;}).slice(0,2).forEach(function(c){items.push({type:"card",card:c});});
      if (question) items.push({type:"exam",q:question});
    });
    return startRun(items, {titlu:deckById(deck).name + " · " + levelLabel(level)});
  }
  function skillCard129(s,level){var id=(s.levelCardIds || {})[level];return cardById(id || s.id+"-"+level) || (s.cards || []).map(cardById).filter(function(c){return c && (c.level===level || (c.levels || []).indexOf(level)>=0);})[0] || null;}
  function skillQuestion129(s,level){var id=(s.levelQuestionIds || {})[level];return questionById(id || s.id+"-q-"+level) || (s.questions || []).map(questionById).filter(function(q){return q && q.level===level;})[0] || null;}
  function levelLabel(id) {
    var pair = LEARNING_LEVELS.filter(function (p) { return p[0] === id; })[0];
    return pair ? pair[1] : id;
  }
  function appendHandbookReference(host,ref){
    if(!ref)return;
    host.appendChild(el("p","muted",(ref.bookId==="sql-handbook"?"SQL Handbook":"Python Handbook")+" · cap. "+ref.chapter.join(", ")+" · p. "+ref.pages.map(function(r){return r[0]+(r[1]!==r[0]?"–"+r[1]:"");}).join(", ")+". Trimitere la materialul tău personal; textul manualului nu este inclus."));
  }
  function openCompetency134(skill){
    function md(host,text){var content=el("div","md");content.innerHTML=renderMd(text);host.appendChild(content);}
    var body=$("#modal-body");body.innerHTML="";$("#modal-title").textContent=skill.name;
    if(courses145Api())courses145Api().reference(body,skill);
    var term=termById(skill.term),intro=studySection132(body,"Conceptul și scopul","skill-intro");
    intro.appendChild(el("p","muted",deckById(skill.deck).name));if(term){intro.appendChild(el("p",null,term.d));appendTermOrigin(intro,term);}
    LEARNING_LEVELS.forEach(function(pair){var card=skillCard129(skill,pair[0]);if(!card)return;var section=studySection132(body,pair[1],"skill-"+pair[0]);section.appendChild(el("h4",null,card.q));md(section,card.a);var authored=card.aut || {};if(authored.p && card.a.indexOf(authored.p)<0)sectiuneMd(section,"Exemplu",authored.p);var question=skillQuestion129(skill,pair[0]);if(question){var details=el("details","unit");details.appendChild(el("summary",null,"Verifică raționamentul · "+question.q));md(details,question.e);section.appendChild(details);}var practice=el("button","btn secondary","Exersează · "+pair[1]);practice.setAttribute("data-skill-practice134",pair[0]);practice.onclick=function(){closeModal();startCurriculum(skill.deck,pair[0],skill.id);};section.appendChild(practice);});
    var related=studySection132(body,"Continuă cu practica","skill-related");appendRelated(related,skill.id,"Materialele competenței");studyOutline132(body);$("#modal").hidden=false;
  }
  function openContentAudit134(){
    var audit=SEED.contentAudit134;if(!audit)return;var body=$("#modal-body");body.innerHTML="";$("#modal-title").textContent="Acoperire și calitatea fișelor";
    body.appendChild(el("p",null,audit.terms+" termeni inventariați individual · "+audit.extended+" fișe dezvoltate · "+audit.reference+" fișe de referință."));
    body.appendChild(el("p","muted","Fișă dezvoltată = explicație, exemplu și verificare proprie prezente. Nu este o notă automată de corectitudine. "+(audit.authoredCases140?audit.authoredCases140+" fișe au primit cazuri și verificări proprii în 1.40. Revizia nu este o certificare independentă a tuturor afirmațiilor.":audit.reviewedTermsThisRelease+" termeni au fost reverificați semantic în lotul 1.34.")));
    audit.limits.forEach(function(text){body.appendChild(el("p","muted",text));});
    audit.domains.forEach(function(d){var row=el("section","unit");row.appendChild(el("h3",null,d.name));row.appendChild(el("p",null,d.terms+" termeni · "+d.extended+" fișe dezvoltate · "+d.competencies+" competențe · "+d.scenarios+" scenarii"));var open=el("button","btn secondary","Verifică termenii domeniului");open.setAttribute("data-audit-domain134",d.id);open.onclick=function(){state.settings.glossary={query:"",deck:d.id};save();openGlossary();};row.appendChild(open);body.appendChild(row);});$("#modal").hidden=false;
  }
  function renderCurriculum(root) {
    root.appendChild(el("h2", "sec-title", "Concepte și moduri de exersare"));
    root.appendChild(el("p", "muted", "Aici alegi activitatea pentru un concept: înțelegere, aplicare, depanare sau proiectare. Cursurile complete au separat nivelurile Junior, Intermediar și Avansat. Sesiunile de recapitulare includ cel mult șase concepte."));
    var search = el("input"); search.type = "search"; search.id = "curriculum-search";
    search.placeholder = "Caută un concept sau un traseu…"; search.setAttribute("aria-label", "Caută în trasee"); root.appendChild(search);
    var levelLabel=el("label","path-level-filter135","Nivelul de studiu"),levelFilter=el("select");levelFilter.id="path-level-filter135";levelFilter.setAttribute("aria-label","Nivelul traseelor");[["","Toate nivelurile"]].concat(LEARNING_LEVELS).forEach(function(pair){levelFilter.appendChild(new Option(pair[1],pair[0]));});levelFilter.value=LEARNING_LEVELS.some(function(pair){return pair[0]===state.settings.pathLevel135;})?state.settings.pathLevel135:"";levelLabel.appendChild(levelFilter);root.appendChild(levelLabel);
    var host = el("div"); root.appendChild(host);
    function render() {
      host.innerHTML = ""; var key = searchKey(search.value);
      (SEED.curriculum || []).forEach(function (path) {
        var skills = (SEED.competencies || []).filter(function (s) { return s.deck === path.deck; });
        if (key && searchKey(path.name + " " + skills.map(function (s) { var t=termById(s.term);return s.name+" "+(t?t.t+" "+(t.aliases || []).join(" "):""); }).join(" ")).indexOf(key)<0) return;
        var card = el("details", "unit curriculum-unit"); card.setAttribute("data-path", path.deck);
        card.appendChild(el("summary", null, path.name + " · " + skills.length + " competențe"));
        var guide=path.guide;if(guide){var overview=el("section","path-guide134");overview.appendChild(el("h3",null,"Ce vei putea explica și decide"));overview.appendChild(el("p",null,guide.purpose));overview.appendChild(el("h4",null,"Ordinea recomandată"));var steps=el("ol");guide.sequence.forEach(function(step){steps.appendChild(el("li",null,step));});overview.appendChild(steps);overview.appendChild(el("p",null,"Rezultat de urmărit: "+guide.deliverable));overview.appendChild(el("p","muted",guide.limit));card.appendChild(overview);}
        card.appendChild(el("p", "muted", "Prerechizite recomandate: " + (path.prerequisites.length?path.prerequisites.map(function (id) { return deckById(id).name; }).join(", "):"Poți începe aici; verifică explicația înainte de practică.")));
        var select = el("select"); select.setAttribute("aria-label", "Concept pentru " + path.name);
        var all = el("option", null, "Sesiune: următoarele șase concepte"); all.value=""; select.appendChild(all);
        skills.forEach(function (s) { var o = el("option", null, s.name); o.value=s.id; select.appendChild(o); });
        card.appendChild(select);
        var read=el("button","btn secondary","Studiază conceptul selectat");read.disabled=true;read.setAttribute("data-path-study134",path.deck);read.onclick=function(){var selected=skills.filter(function(s){return s.id===select.value;})[0];if(selected)openCompetency134(selected);};card.appendChild(read);
        var reference=el("div","path-reference");card.appendChild(reference);
        select.onchange=function(){reference.innerHTML="";var selected=skills.filter(function(s){return s.id===select.value;})[0];read.disabled=!selected;if(!selected)return;var term=termById(selected.term);if(term)reference.appendChild(el("p",null,term.d));appendHandbookReference(reference,selected.handbook);if(selected.handbookException)reference.appendChild(el("p","muted","Subiect neacoperit de handbook; sursele primare sunt în materialele legate."));appendRelated(reference,selected.id,"Practică și materiale pentru competență");};
        var row = el("div", "level-actions");
        LEARNING_LEVELS.forEach(function (pair) {
          if(levelFilter.value && pair[0]!==levelFilter.value)return;
          var passed = skills.filter(function (s) { var q=skillQuestion129(s,pair[0]),result = q && state.assessments[q.id]; return result && result.correct; }).length;
          var b = el("button", "btn secondary", pair[1] + " · " + passed + "/" + skills.length);
          b.disabled=!skills.length;b.setAttribute("data-path-level", pair[0]); b.onclick=function () { startCurriculum(path.deck,pair[0],select.value); }; row.appendChild(b);
        });
        card.appendChild(row);
        card.appendChild(el("p", "muted", "Contoarele arată verificările locale cu ultimul răspuns corect; nu reprezintă experiență executată în cloud."));
        if(guide && (guide.newTerms.length || guide.newScenarios.length)){var more=el("details","unit");more.appendChild(el("summary",null,"Fundamente completate · "+guide.newTerms.length+" termeni · "+guide.newScenarios.length+" scenarii"));guide.newTerms.forEach(function(id){var t=termById(id);if(!t)return;var b=el("button","btn mini secondary",t.t);b.setAttribute("data-path-term134",id);b.onclick=function(){openSaved({kind:"term",id:t.id,material:t});};more.appendChild(b);});guide.newScenarios.forEach(function(id){var s=SEED.scen.scenarios.filter(function(s){return s.id===id;})[0];if(!s)return;var b=el("button","btn mini secondary",s.titlu);b.setAttribute("data-path-scenario134",id);b.onclick=function(){openSaved({kind:"scenario",id:s.id,material:s});};more.appendChild(b);});card.appendChild(more);}
        var exams={azure:["dp750","dbra","dbrp"],fabric:["dp700"],spark:["sparkcert"],aws:["awsdea"],gcp:["gcppde"],snow:["snowcore"]}[path.deck] || [];
        exams.forEach(function(id){if(!(SEED.module || []).some(function(m){return m.examen===id;}))return;var e=examenById(id);if(!e)return;var course=el("button","btn secondary","Curs și practică · "+e.cod);course.setAttribute("data-path-course",id);course.onclick=function(){deschideExamen(id);};card.appendChild(course);});
        host.appendChild(card);
      });
      if (!host.children.length) host.appendChild(el("p", "muted", "Niciun traseu pentru căutarea aceasta."));
    }
    levelFilter.onchange=function(){state.settings.pathLevel135=levelFilter.value;save(true);render();};search.oninput=render; render();
  }
  function openProject(project) {
    L=null;labCur=null;pyCur=null;ui.activeFlow="project";ui.activeProjectId=project.id;
    $("#lab-cap").textContent="Proiect offline"; $("#lab").hidden=false; $("#nav").hidden=true;
    $("#lab-fb").hidden=true;
    var body=$("#lab-body"); body.innerHTML="";
    body.appendChild(el("h2",null,project.titlu));sectiuneMd(body,"Contextul proiectului",project.context);
    sectiuneMd(body,"Datele proiectului",project.date);
    sectiuneMd(body,"Ce construiești",project.sarcini.map(function (t,i) { return (i+1)+". "+t; }).join("\n"));
    var plan=studySection132(body,"Planul și criteriile tale","project-plan");
    var saved=state.projects[project.id] || {criteria:[]};
    var label=el("label",null,"Planul și dovezile tale · salvate local"),note=el("textarea");note.id="project-note";note.rows=7;note.maxLength=20000;note.value=saved.note || "";
    note.oninput=function(){var current=state.projects[project.id] || {criteria:[]};current.note=note.value.slice(0,20000);current.last=Date.now();state.projects[project.id]=current;save(true);};label.appendChild(note);plan.appendChild(label);
    plan.appendChild(el("p","muted","Bifează numai criteriile pentru care ai păstrat dovezi în planul tău."));
    project.criterii.forEach(function (criterion,i) {
      var label=el("label","project-criterion"); var check=el("input"); check.type="checkbox";
      check.checked=(saved.criteria || []).indexOf(i)>=0;
      check.onchange=function () {
        var result=state.projects[project.id] || {criteria:[]};
        result.criteria=(result.criteria || []).filter(function (x) { return x!==i; });
        if (check.checked) result.criteria.push(i);
        result.reviewed=result.criteria.length===project.criterii.length; result.last=Date.now(); state.projects[project.id]=result; save();
      };
      label.appendChild(check); label.appendChild(el("span",null,criterion)); plan.appendChild(label);
    });
    var explanation=el("details","unit"); explanation.appendChild(el("summary",null,"Compară cu rezolvarea argumentată"));
    sectiuneMd(explanation,"Rezolvare",project.rezolvare); body.appendChild(explanation);
    body.appendChild(el("p","muted","Bifarea criteriilor înregistrează autoevaluarea proiectului. Nu execută un serviciu cloud și nu acordă automat competențe demonstrate."));
    var linkedPractice=studySection132(body,"Exerciții asociate","project-practice");
    (project.links || []).forEach(function (id) {
      var sql=labById(id), py=pyById(id); if (!sql && !py) return;
      var b=el("button","btn secondary","Exersează: "+(sql || py).titlu);
      b.setAttribute("data-project-lab",id);b.onclick=function () { launchRelatedPractice(sql?"sql":"python",id); }; linkedPractice.appendChild(b);
    });
    if(project.workbench)mountProjectWorkbench130(body,project);
    libraryControls(studySection132(body,"Notițe și favorite","project-personal"),"project",project.id);studyOutline132(body);setFootLab("Închide",true,inchideLaborator); $("#lab-scroll").scrollTop=0;save(true);
  }
  function mountProjectWorkbench130(body,project){
    var ex=project.workbench,box=studySection132(body,"Atelierul executabil","artifact");box.id="project-workbench";
    sectiuneMd(box,"Contract executabil",ex.contract);box.appendChild(el("p","muted",ex.scope));
    var saved=state.projects[project.id] || {},editor=el("textarea","sqled");editor.id="project-code";editor.rows=14;editor.spellcheck=false;editor.setAttribute("aria-label","Codul artefactului proiectului");editor.value=typeof saved.code==="string"?saved.code:ex.starter;box.appendChild(editor);
    var status=el("p","muted");status.id="project-artifact-status";status.setAttribute("aria-live","polite");box.appendChild(status);var output=el("div");output.id="project-artifact-tests";box.appendChild(output);
    function store(){var value=state.projects[project.id] || {criteria:[]};value.code=editor.value.slice(0,20000);if(value.artifactProof){value.artifactHistory=(value.artifactHistory || []).concat([value.artifactProof]).slice(-10);}delete value.artifactProof;state.projects[project.id]=value;save(true);status.textContent="Ciornă salvată. Rezultatele trebuie verificate pentru codul curent.";output.innerHTML="";}
    editor.oninput=store;
    var run=el("button","btn primary","Verifică artefactul pe toate datele");run.id="project-run";run.onclick=async function(){var owner=state;run.disabled=true;status.textContent="Pregătim motorul Python local…";try{await PYLAB.load();if(owner!==state || !editor.isConnected)return;var source=editor.value,result=PYLAB.verifica(ex,source);output.innerHTML="";
      (result.teste || []).forEach(function(t,i){output.appendChild(el("p",t.ok?"bun":"rau",(t.ok?"✓ ":"× ")+(t.nume || ex.teste[i].nume)));if(!t.ok && t.motiv)output.appendChild(el("p","muted",t.motiv));});
      if(result.err || result.error)output.appendChild(el("p","rau",String(result.err || result.error)));
      if(source!==editor.value){status.textContent="Codul s-a schimbat. Rulează verificarea din nou.";return;}
      var value=state.projects[project.id] || {criteria:[]};value.code=source;value.artifactProof={passed:!!result.ok,tests:ex.teste.length,at:Date.now(),source:source,fixture:JSON.stringify({date:ex.date,tests:ex.teste,cases:ex.cases}),revision:APP_VERSION,engine:"Brython local"};state.projects[project.id]=value;save(true);
      status.textContent=result.ok?"Artefact verificat pe "+ex.teste.length+" seturi de date. Justificarea arhitecturii rămâne o evaluare separată.":"Artefactul nu respectă încă toate cazurile contractului.";
    }catch(e){status.textContent="Verificarea nu a putut fi terminată: "+String(e.message || e);}finally{run.disabled=false;}};box.appendChild(run);
    var fixtures=el("details","unit");fixtures.appendChild(el("summary",null,"Inspectează datele și rezultatele de acceptanță"));ex.cases.forEach(function(c,i){sectiuneMd(fixtures,ex.teste[i].nume,"Intrare:\n```json\n"+JSON.stringify(c[0],null,2)+"\n```\nRezultat așteptat:\n```json\n"+JSON.stringify(c[1],null,2)+"\n```");});box.appendChild(fixtures);
    var model=el("details","unit");model.appendChild(el("summary",null,"Compară cu implementarea de referință"));sectiuneMd(model,"Soluție locală","```python\n"+ex.solution+"\n```");box.appendChild(model);
    if(saved.artifactProof)status.textContent="Există o verificare anterioară. Rulează din nou pentru a confirma codul și datele curente.";
    body.appendChild(box);
  }
  function renderProjects(root) {
    if(courses145Api())courses145Api().projectCatalog(root);
    root.appendChild(el("h2","sec-title","Proiecte finale offline"));
    if(!(SEED.projects || []).length){root.appendChild(gol("carte","Niciun proiect disponibil","Proiectele incluse în biblioteca acestei versiuni apar aici. Planurile și notițele deja salvate se păstrează."));return;}
    (SEED.projects || []).forEach(function (p) {
      var card=el("div","unit"); card.appendChild(el("h3",null,p.titlu)); card.appendChild(el("p","muted",p.context));
      var done=state.projects[p.id]; var b=el("button","btn secondary",done && done.reviewed ? "Reia autoevaluarea" : "Deschide proiectul");
      b.setAttribute("data-project",p.id); b.onclick=function () { openProject(p); }; card.appendChild(b); root.appendChild(card);
    });
  }
  function careerResourceStatus142(r) {
    var labels={introductory:"Curs introductiv · aprofundare și practică rămase", "local-course-alignment-review-required":"Curs local disponibil · concordanța integrală cu examenul curent nu este încă verificată", "resource-only":"Resursă externă · fără curs local dedicat complet"};
    return (labels[r.status] || "Acoperire de verificat")+(r.guideEffective?" · ghid efectiv "+r.guideEffective:"");
  }
  function careerStageFor142(key) {
    key=String(key || "");
    var exact={custom:"foundations",dp203:"platforms",dp750:"platforms",dp700:"platforms",dbra:"platforms",dbrp:"reliability",sparkcert:"distributed",awsdea:"platforms",gcppde:"platforms",snowcore:"platforms",examen:"leadership"};
    if(exact[key])return exact[key];
    if(/^(dp750|dp700|dbra|aws|gcp|snow)-m/.test(key))return "platforms";
    if(/^dbrp-m/.test(key))return "reliability";
    if(/^spark-m/.test(key))return "distributed";
    if(/^tech-m/.test(key))return "leadership";
    var stage=((SEED.career142 || {}).stages || []).filter(function(s){return s.decks.indexOf(key)>=0;})[0];return stage?stage.id:null;
  }
  function careerCollections142() {
    var questionRows=[],ids={};(SEED.questions || []).forEach(function(q){if(!ids[q.id]){ids[q.id]=true;questionRows.push(q);}});Object.keys(SEED.teste || {}).forEach(function(exam){SEED.teste[exam].forEach(function(q){if(!ids[q.id]){ids[q.id]=true;questionRows.push(Object.assign({},q,{careerExam142:exam}));}});});
    return {cards:allCards(),terms:allTerms(),lessons:SEED.lectii || [],courseExercises:SEED.exercitii || [],caseStudies:SEED.caseStudies || [],scenarios:scenAll(),competencies:SEED.competencies || [],projects:SEED.projects || [],sql:labData().exercises || [],python:pyAll(),spark:sparkExercises(),kata:(SEED.practice141 || {}).questions || [],questions:questionRows,examForms:SEED.examForms || [],miniTests:SEED.minitest || [],recaps:SEED.recaps || []};
  }
  function careerOwner142(type,m) {
    if(type==="projects")return {"project119-ingestion":"foundations","project119-cdc":"pipelines","project119-model":"pipelines","project119-stream":"distributed","project119-governance":"reliability","project119-optimization":"reliability","project119-recovery":"reliability","project119-migration":"leadership"}[m.id] || null;
    if(type==="spark")return "distributed";
    if(type==="kata")return m.track==="pyspark"?"distributed":/^(pandas|polars)$/.test(m.track)?"pipelines":"foundations";
    if(type==="sql")return /DP-700|Associate/.test(m.cap)?"platforms":/Monitorizare|Producție/.test(m.cap)?"reliability":/Proiecte/.test(m.cap)?"leadership":/Avansat|Integritate|fereastră/.test(m.cap)?"pipelines":"foundations";
    if(type==="python")return /Associate/.test(m.cap)?"platforms":/Proiect/.test(m.cap)?"leadership":/Inginerie|Reconciliere/.test(m.cap)?"reliability":/Timp/.test(m.cap)?"distributed":/Pipeline|incrementală|Reluare|Schemă|Integrator/.test(m.cap)?"pipelines":"foundations";
    if(m.examen==="dp203")return "platforms";
    return careerStageFor142(m.deck) || careerStageFor142(m.modul) || careerStageFor142(m.examen || m.exam || m.careerExam142) || ((m.certs || []).map(careerStageFor142).filter(Boolean)[0]) || ((m.domains || []).map(careerStageFor142).filter(Boolean)[0]) || null;
  }
  function careerStage142(id) {var out={},collections=careerCollections142();Object.keys(collections).forEach(function(type){out[type]=collections[type].filter(function(m){return careerOwner142(type,m)===id;});});return out;}
  function careerStart142(id,skipReading) {
    if(courses145Api()){var stage145=((SEED.career142 || {}).stages || []).filter(function(x){return x.id===id;})[0];if(stage145){var first145=stage145.decks.map(function(d){return courses145Api().courseFor(d);}).filter(Boolean)[0];if(first145)return courses145Api().start(first145.id);}}
    var material=careerStage142(id),reads=state.settings.careerRead142 || {},intro=material.lessons.filter(function(l){return /^career142-/.test(l.id) && !reads[l.id];})[0];
    if(intro && !skipReading)return deschideLectie(intro);
    var chosen=null,level=null;LEARNING_LEVELS.some(function(pair){return material.competencies.some(function(s){var q=skillQuestion129(s,pair[0]);if(q && !(state.assessments[q.id] && state.assessments[q.id].correct)){chosen=s;level=pair[0];return true;}return false;});});
    if(chosen)return startCurriculum(chosen.deck,level,chosen.id);if(material.sql.length)return openLab(material.sql[0].id);if(material.python.length)return openPyLab(material.python[0].id);if(material.projects.length)return openProject(material.projects[0]);
    ui.activeFlow=null;learnTab="career";show("learn");toast("Alege un material din etapă pentru aprofundare.");
  }
  function careerAudit142() {
    var collections=careerCollections142(),counts={},unassigned={};Object.keys(collections).forEach(function(type){counts[type]=collections[type].length;unassigned[type]=collections[type].filter(function(m){return !careerOwner142(type,m);}).map(function(m){return m.id;});});
    return {counts:counts,unassigned:unassigned,unassignedDecks:allDecks().filter(function(d){return d.id!=="custom" && !careerStageFor142(d.id);}).map(function(d){return d.id;}),note:"Inventarul verifică distribuirea materialelor locale. Nu certifică acoperirea integrală a programelor externe."};
  }
  function careerOpen142(type,m) {
    if(type==="lessons")return deschideLectie(m);
    if(type==="competencies")return openCompetency134(m);
    if(type==="courseExercises" || type==="caseStudies")return openCaseStudy(m.id);
    if(type==="sql")return openLab(m.id);if(type==="python")return openPyLab(m.id);if(type==="spark")return openSparkLab(m.id);
    if(type==="scenarios")return startRun([{type:"scen",sc:m,pas:0}],{titlu:m.titlu});
    if(type==="questions" || type==="kata")return startRun([{type:"exam",q:m}],{titlu:m.title || "Verificare de raționament"});
    if(type==="projects")return openProject(m);if(type==="examForms")return startSimulation(m.id);if(type==="miniTests")return porneateMiniTest(m);if(type==="recaps")return openRecap(m.id);
    return openSaved({kind:type==="cards"?"card":"term",id:m.id,material:m});
  }
  function careerList142(host,type,items,label) {
    if(!items.length)return;
    var group=el("details","career-material142");group.setAttribute("data-career-type142",type);group.appendChild(el("summary",null,label+" · "+items.length));var list=el("div","career-material-list142"),limit=0;group.appendChild(list);
    function more(){var next=Math.min(items.length,limit+40);items.slice(limit,next).forEach(function(m){var b=el("button","mat-row");b.setAttribute("data-career-material142",type+":"+m.id);var name=m.titlu || m.title || m.name || m.t || m.q || m.id;b.appendChild(el("span",null,name));b.onclick=function(){careerOpen142(type,m);};list.appendChild(b);});limit=next;if(limit<items.length){var load=el("button","btn mini secondary","Mai încarcă · "+limit+" / "+items.length);load.onclick=function(){load.remove();more();};list.appendChild(load);}}
    group.ontoggle=function(){if(group.open && !limit)more();};host.appendChild(group);
  }
  function renderCareer142(root) {
    var data=SEED.career142;if(!data){root.appendChild(el("p","muted","Parcursul nu a fost încărcat."));return;}
    var hub=el("section","career-hub142");hub.id="career-hub142";hub.appendChild(el("h2",null,"De la junior la senior"));hub.appendChild(el("p",null,"Înveți conceptul, îl aplici în cod și aduni dovezi din proiecte. Parcurge etapele în ordine; poți reveni oricând la orice material."));hub.appendChild(el("p","muted","Etapele descriu pregătirea. Un rang profesional cere experiență reală, judecată și evaluarea proiectelor; XP și lectura nu dovedesc singure senioritatea."));
    data.stages.forEach(function(stage,index){
      var material=careerStage142(stage.id),checks=[],seen={};material.competencies.forEach(function(s){LEARNING_LEVELS.forEach(function(pair){var q=skillQuestion129(s,pair[0]);if(q && !seen[q.id]){seen[q.id]=true;checks.push(q);}});});var done=checks.filter(function(q){return state.assessments[q.id] && state.assessments[q.id].correct;}).length;
      var card=el("details","unit career-stage142");card.setAttribute("data-career-stage142",stage.id);card.open=index===0;card.appendChild(el("summary",null,stage.name));card.appendChild(el("p",null,stage.goal));card.appendChild(el("p","muted","Prerechizit recomandat: "+(index?data.stages[index-1].name:"fără prerechizite tehnice")));card.appendChild(el("p","career-evidence142","Dovada urmărită: "+stage.deliverable));
      (stage.evidenceCriteria || []).forEach(function(text){card.appendChild(el("p","muted","• "+text));});
      card.appendChild(el("p","career-counts142",material.cards.length+" carduri · "+material.terms.length+" concepte · "+material.lessons.length+" lecții · "+(material.sql.length+material.python.length+material.spark.length+material.courseExercises.length+material.kata.length)+" exerciții"));card.appendChild(el("p","muted",done+" / "+checks.length+" verificări locale cu ultimul răspuns corect. Proiectele sunt autoevaluate separat."));
      var executableDone=material.sql.filter(function(m){return labIsDone(m.id);}).length+material.python.filter(pyComplet).length,analysisDone=material.spark.filter(function(m){return state.sparkPractice.done[m.id] && state.sparkPractice.done[m.id].lastCorrect;}).length+material.kata.filter(function(m){return state.assessments[m.id] && state.assessments[m.id].correct;}).length;card.appendChild(el("p","muted","Practica executabilă SQL/Python: "+executableDone+" / "+(material.sql.length+material.python.length)+" finalizate. Analiza Spark/kata: "+analysisDone+" / "+(material.spark.length+material.kata.length)+" răspunsuri corecte."));
      var begin=el("button","btn primary","Începe etapa");begin.setAttribute("data-career-start142",stage.id);begin.onclick=function(){careerStart142(stage.id);};card.appendChild(begin);
      var labels={competencies:"Concepte structurate",cards:"Cartonașe",terms:"Termeni",lessons:"Cursuri și lecții",sql:"SQL executabil",python:"Python executabil",spark:"Cazuri PySpark",kata:"Kata de raționament",courseExercises:"Exerciții de curs",caseStudies:"Studii de caz",scenarios:"Scenarii",projects:"Proiecte și portofoliu",questions:"Întrebări de verificare",examForms:"Simulări",miniTests:"Mini-teste",recaps:"Recapitulări"};Object.keys(labels).forEach(function(type){careerList142(card,type,material[type],labels[type]);});
      var proof=el("details","career-portfolio142");proof.appendChild(el("summary",null,"Cum îți verifici portofoliul"));proof.appendChild(el("p",null,"Adună codul, datele de probă, rezultatele testelor, deciziile și limitele. Cere unui coleg să reproducă rezultatul și să încerce cazurile de eșec. Bifarea unui proiect în aplicație este autoevaluare, nu evaluare independentă."));card.appendChild(proof);hub.appendChild(card);
    });
    var resources=el("details","unit career-resources142");resources.id="career-resources142";resources.appendChild(el("summary",null,"Certificări și resurse oficiale · "+data.resources.length));resources.appendChild(el("p","muted",data.scope));data.resources.forEach(function(r){var row=el("article","career-resource142");var a=el("a",null,r.name);a.href=r.url;a.target="_blank";a.rel="noopener noreferrer";row.appendChild(a);row.appendChild(el("p","career-resource-status142",careerResourceStatus142(r)));row.appendChild(el("p","muted",r.note));if(r.coverageNote)row.appendChild(el("p","muted",r.coverageNote));if(r.access)row.appendChild(el("p","muted",r.access.indexOf("account")>=0?"Acces online; poate necesita cont sau înscriere.":"Documentație online; conținutul extern necesită conexiune la internet."));var lessons=(SEED.lectii || []).filter(function(l){return l.examen===r.id;});if(lessons.length){var start=el("button","btn mini secondary","Deschide cursul local · "+lessons.length+" lecții");start.setAttribute("data-career-cert142",r.id);start.onclick=function(){if(courses145Api() && courses145Api().start(r.id))return;deschideLectie(lessons[0]);};row.appendChild(start);}resources.appendChild(row);});hub.appendChild(resources);
    if(data.coverageLedger){var ledger=el("details","unit career-coverage142");ledger.id="career-coverage142";ledger.appendChild(el("summary",null,"DP-203: arii introduse și aprofundări rămase"));ledger.appendChild(el("p","muted",data.dp203Status));data.coverageLedger.forEach(function(row){var entry=el("section","career-resource142");entry.appendChild(el("h3",null,row.title));(row.topics || []).forEach(function(t){entry.appendChild(el("p",null,t.name+" · "+t.status));if(t.remaining)entry.appendChild(el("p","muted",t.remaining));});var lesson=(SEED.lectii || []).filter(function(l){return l.id===row.lessonId;})[0];if(lesson){var b=el("button","btn mini secondary","Studiază aria");b.onclick=function(){deschideLectie(lesson);};entry.appendChild(b);}ledger.appendChild(entry);});hub.appendChild(ledger);}
    if(data.coverageAudit){var mapped=data.coverageAudit,coverage=el("details","unit career-official-coverage142");coverage.id="career-official-coverage142";coverage.appendChild(el("summary",null,"Obiective de certificare: materialele legate și golurile"));coverage.appendChild(el("p","muted","Registrul local leagă 150 de obiective de materiale existente. O asociere locală nu dovedește concordanța integrală cu versiunea curentă a examenului. Revizia integrală a ghidurilor curente rămâne deschisă."));(mapped.examSummary || []).forEach(function(ex){var section=el("details","career-material142");section.setAttribute("data-career-exam-coverage142",ex.exam);var cert=examenById(ex.exam);section.appendChild(el("summary",null,(cert?cert.cod:ex.exam)+" · "+ex.mappedLocal+" asociate local · "+ex.partialLocal+" parțiale"));(mapped.objectives || []).filter(function(o){return o.exam===ex.exam;}).forEach(function(o){var item=el("details","career-material142");item.setAttribute("data-career-objective142",o.id);item.appendChild(el("summary",null,o.title));item.appendChild(el("p","muted",o.status==="mapped-local"?"Materiale locale asociate; acoperirea examenului curent este de verificat.":"Acoperire locală parțială."));(o.missing || []).forEach(function(text){item.appendChild(el("p","muted","De completat: "+text));});[["lessonIds","lessons",SEED.lectii],["exerciseIds","courseExercises",SEED.exercitii],["questionIds","questions",careerCollections142().questions],["cardIds","cards",allCards()]].forEach(function(pair){(o[pair[0]] || []).forEach(function(id){var m=pair[2].filter(function(x){return x.id===id;})[0];if(!m)return;var open=el("button","mat-row");open.appendChild(el("span",null,m.titlu || m.q || id));open.onclick=function(){careerOpen142(pair[1],m);};item.appendChild(open);});});section.appendChild(item);});coverage.appendChild(section);});hub.appendChild(coverage);}
    var audit=careerAudit142(),missing=Object.keys(audit.unassigned).reduce(function(n,k){return n+audit.unassigned[k].length;},0)+audit.unassignedDecks.length;var inventory=el("details","unit career-inventory142");inventory.id="career-inventory142";inventory.appendChild(el("summary",null,"Inventarul bibliotecii locale"));Object.keys(audit.counts).forEach(function(k){var labels={cards:"Cartonașe",terms:"Termeni",lessons:"Lecții",courseExercises:"Exerciții de curs",caseStudies:"Studii de caz",scenarios:"Scenarii",competencies:"Competențe",projects:"Proiecte",sql:"Exerciții SQL",python:"Exerciții Python",spark:"Cazuri PySpark",kata:"Kata",questions:"Întrebări unice",examForms:"Simulări",miniTests:"Mini-teste",recaps:"Recapitulări"};inventory.appendChild(el("p",null,(labels[k] || k)+": "+audit.counts[k]+" · fără etapă: "+audit.unassigned[k].length));});inventory.appendChild(el("p","muted",audit.note));if(missing)inventory.appendChild(el("p","rau",missing+" materiale sau categorii necesită asociere explicită."));hub.appendChild(inventory);root.appendChild(hub);
  }
  function renderLearn() {
    var root = $("#learn-body");
    root.innerHTML = "";
    discoveryEntry129(root,"learn-search-all");

    var seg = el("div", "seg learning-tabs");
    [["paths", "Cursuri"], ["career", "Parcurs"], ["concepts", "Concepte"], ["terms", "Termeni"], ["scen", "Scenarii"], ["sql", "SQL"], ["py", "Python"],
     ["cert", "Certificări"], ["projects", "Proiecte"], ["workshop", "Atelier"], ["saved", "Salvate"]]
      .forEach(function (pair) {
        var b = el("button", "seg-b" + (learnTab === pair[0] ? " on" : ""), pair[1]);
        b.id = "seg-" + pair[0];
        b.setAttribute("aria-pressed",String(learnTab===pair[0]));
        var tabIcons={concepts:"graf",career:"tinta",paths:"carte",terms:"carte",scen:"balon",sql:"baza",py:"terminal",cert:"insigna",projects:"cub",workshop:"cheie",saved:"carduri"};
        b.textContent="";b.appendChild(ico(tabIcons[pair[0]],"cozy-tab-icon"));b.appendChild(el("span",null,pair[1]));
        b.onclick = function () { learnTab = pair[0]; renderLearn(); };
        seg.appendChild(b);
      });
    root.appendChild(seg);

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

    if (learnTab === "workshop") { if (practice156) renderAtelierPath159(root); else renderAtelierLearn159(root); return; }
    if (learnTab === "career") { if (practice156) renderTabPractice156(root, "career"); else renderCareer142(root); return; }
    if (learnTab === "paths") { if (practice156) renderTabPractice156(root, "paths"); else if(courses145Api())courses145Api().render(root);else renderCurriculum(root); return; }
    if (learnTab === "concepts") { if (practice156) renderTabPractice156(root, "concepts"); else { resButton156(root, null, "Bibliotecă de resurse externe"); renderCurriculum(root); } return; }
    if (learnTab === "projects") { if (practice156) renderProjectPractice156(root); else renderProjects(root); return; }
    if (learnTab === "saved") { if (practice156) renderSavedPractice156(root); else { renderSaved(root); root.querySelectorAll("button").forEach(function (b) { if (b.textContent === "Repetă favoritele") b.remove(); }); } return; }

    if (learnTab === "cert") { if (practice156) renderCertPractice156(root); else { renderCertPath(root); root.querySelectorAll("[data-cert-test141]").forEach(function (b) { b.remove(); });
      root.querySelectorAll("[data-exam]").forEach(function (row) { var id = row.getAttribute("data-exam"), actions = row.querySelector(".cert-actions141") || row; resButton156(actions, [id], "Resurse oficiale"); }); } return; }
    if (learnTab === "py") { if(courses145Api())courses145Api().returnBanner(root); if (practice156) { renderPyPath(root); renderSparkPath(root); renderTabPractice156(root, "py"); } else renderCourseLearn156(root, ["python", "spark"]); return; }
    if (learnTab === "sql") { if(courses145Api())courses145Api().returnBanner(root); if (practice156) { renderLabPath(root); renderTabPractice156(root, "sql"); } else renderCourseLearn156(root, ["sql", "relational"]); return; }
    if (learnTab === "scen") { if (practice156) renderScenPath(root); else renderScenLearn156(root); return; }
    if (practice156) { renderTermPractice156(root); return; }
    var glossary = el("button", "btn big secondary", "Caută în glosar · " + allTerms().length + " concepte");
    glossary.id = "open-glossary";
    glossary.style.cssText = "width:100%;margin:10px 0 16px";
    glossary.onclick = openGlossary; root.appendChild(glossary);
    var dict156 = el("button", "btn big secondary", "Dicționar A–Z · toți termenii");
    dict156.id = "open-dictionary156";
    dict156.style.cssText = "width:100%;margin:-6px 0 16px";
    dict156.onclick = function () { openDictionary156(); }; root.appendChild(dict156);
    var res156 = resButton156(root, null, "Bibliotecă de resurse externe"); if (res156) res156.style.cssText = "width:100%;margin:-6px 0 16px";
    if(SEED.contentAudit134){var audit=el("button","btn secondary","Acoperire și calitatea fișelor");audit.id="open-content-audit134";audit.onclick=openContentAudit134;root.appendChild(audit);}
    var p = learnProgress();

    var hero = el("div", "hero");
    var left = el("div", "hero-l");
    left.appendChild(el("div", "hero-num", String(state.learn.xpDay.date === dayKey() ? state.learn.xpDay.n : 0)));
    left.appendChild(el("div", "hero-lbl", "XP azi"));
    hero.appendChild(left);
    var right = el("div", "hero-r");
    right.appendChild(el("div", "streak-n", String(p.stiute)));
    right.appendChild(el("div", "hero-sub", "termeni știuți din " + p.total));
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
      : (p.incepute ? "Următorii termeni învățați revin când le vine rândul." : "Începe o lecție; termenii învățați revin apoi automat la repetare.")));

    var units = learnUnits();
    var gasitUrmatoarea = false;
    units.forEach(function (u) {
      var card = el("div", "unit");
      var head = el("div", "deck-h");
      head.appendChild(ico(icoDeck(u.deck.id), "deck-ico"));
      var meta = el("div", "deck-meta");
      meta.appendChild(el("div", "deck-name", u.deck.name));
      meta.appendChild(el("div", "deck-desc", u.terms.length + " termeni · " +
        u.done + "/" + u.total + " lecții"));
      head.appendChild(meta);
      card.appendChild(head);

      var pb = el("div", "pbar");
      var pf = el("div", "pbar-f");
      pf.style.width = (u.total ? u.done / u.total * 100 : 0) + "%";
      pb.appendChild(pf);
      card.appendChild(pb);

      var nodes = el("div", "nodes");
      u.lessons.forEach(function (l) {
        var urmatoarea = !l.done && !gasitUrmatoarea;
        if (urmatoarea) gasitUrmatoarea = true;
        var b = el("button", "node" + (l.done ? " done" : (urmatoarea ? " next" : "")));
        if (l.done) b.appendChild(ico("bifa"));
        else b.appendChild(el("span", null, String(l.idx + 1)));
        b.title = "Lecția " + (l.idx + 1);
        b.setAttribute("aria-label", "Lecția " + (l.idx + 1) +
          (l.done ? ", terminată" : (urmatoarea ? ", urmează" : "")));
        b.setAttribute("data-lesson", l.id);
        b.onclick = function () { startLesson(l.deck, l.idx); };
        nodes.appendChild(b);
      });
      card.appendChild(nodes);
      root.appendChild(card);
    });

    if (!units.length) root.appendChild(el("p", "muted center", "Niciun termen disponibil."));
  }

  // ---------------------------------------------------------------- UI: stats
  function renderStats() {
    var root = $("#stats-body");
    root.innerHTML = "";
    if(courses145Api())courses145Api().stats(root);
    renderAutonomy159(root);
    var now = Date.now();

    // 1. sumar
    var cards = allCards().filter(function (c) { return deckEnabled(c.deck); });
    var buckets = { nou: 0, invat: 0, tanar: 0, matur: 0 };
    cards.forEach(function (c) {
      var s = sched(c.id);
      if (s.st === "new") buckets.nou++;
      else if (s.st === "learn" || s.st === "relearn") buckets.invat++;
      else if (s.ivl >= 21 * DAY) buckets.matur++;
      else buckets.tanar++;
    });
    var grid = el("div", "grid");
    grid.appendChild(stat(String(cards.length), "carduri active"));
    grid.appendChild(stat(String(buckets.matur), "mature (>21 z)"));
    grid.appendChild(stat(String(state.streak.count), "zile la rând"));
    grid.appendChild(stat(String(state.streak.best), "record zile"));
    root.appendChild(grid);

    var kataPack=SEED.practice141, kataQuestions=kataPack ? (kataPack.questions || []) : [];
    if(kataQuestions.length){
      var kataDone=kataQuestions.filter(function(q){return state.assessments[q.id] && state.assessments[q.id].correct;}).length;
      var kataSummary=el("section","unit kata-stats141");kataSummary.appendChild(el("h2","sec-title","Kata de programare"));
      kataSummary.appendChild(el("p",null,kataDone+" din "+kataQuestions.length+" provocări rezolvate corect · SQL, Python, pandas, Polars și PySpark."));
      var kataOpen=el("button","btn secondary","Vezi exercițiile și continuă");kataOpen.onclick=function(){learnTab="py";show("learn");};kataSummary.appendChild(kataOpen);root.appendChild(kataSummary);
    }

    // 2. compozitie
    root.appendChild(el("h2", "sec-title", "Compoziția colecției"));
    var tot = Math.max(1, cards.length);
    var bar = el("div", "stackbar");
    [["nou", buckets.nou], ["invat", buckets.invat], ["tanar", buckets.tanar], ["matur", buckets.matur]]
      .forEach(function (p) {
        if (!p[1]) return;
        var seg = el("div", "seg s-" + p[0]);
        seg.style.width = (p[1] / tot * 100) + "%";
        seg.title = p[0] + ": " + p[1];
        bar.appendChild(seg);
      });
    root.appendChild(bar);
    var leg = el("div", "legend");
    [["nou", "noi", buckets.nou], ["invat", "în învățare", buckets.invat],
     ["tanar", "tinere", buckets.tanar], ["matur", "mature", buckets.matur]].forEach(function (p) {
      var it = el("span", "leg");
      it.appendChild(el("i", "dot s-" + p[0]));
      it.appendChild(el("span", null, p[1] + " " + p[2]));
      leg.appendChild(it);
    });
    root.appendChild(leg);

    // 3. activitate 14 zile
    root.appendChild(el("h2", "sec-title", "Repetări, ultimele 14 zile"));
    var days = [], map = {};
    for (var i = 13; i >= 0; i--) {
      var k = dayKey(now - i * DAY);
      map[k] = 0; days.push(k);
    }
    var correct = 0, total30 = 0;
    state.log.forEach(function (e) {
      var k = dayKey(e.t);
      if (map[k] !== undefined) map[k]++;
      if (e.t > now - 30 * DAY) { total30++; if (e.r >= GOOD) correct++; }
    });
    var totalIstoric = days.reduce(function (a, k) { return a + map[k]; }, 0);
    if (totalIstoric === 0) {
      root.appendChild(gol("statistici", "Încă nicio repetare",
        "După prima sesiune apare aici cât ai lucrat, zi de zi."));
    } else {
    var max = Math.max(1, Math.max.apply(null, days.map(function (k) { return map[k]; })));
    var chart = el("div", "chart");
    days.forEach(function (k, idx) {
      var col = el("div", "col");
      var b = el("div", "bar");
      b.style.height = Math.round(map[k] / max * 100) + "%";
      if (map[k] === 0) b.classList.add("zero");
      b.title = k + ": " + map[k];
      col.appendChild(b);
      if (idx % 3 === 0 || idx === 13) col.appendChild(el("span", "xlab", k.slice(8)));
      else col.appendChild(el("span", "xlab", ""));
      chart.appendChild(col);
    });
    root.appendChild(chart);
    root.appendChild(el("p", "muted center", "Maxim " + max + " / zi · total " +
      totalIstoric + " în 14 zile"));
    }

    // 4. acuratete
    root.appendChild(el("h2", "sec-title", "Acuratețe (30 de zile)"));
    if (total30 === 0) {
      root.appendChild(gol("tinta", "Nimic de măsurat încă",
        "Acuratețea se calculează din răspunsurile tale la carduri."));
    } else {
      var pct = Math.round(correct / total30 * 100);
      var acc = el("div", "acc");
      var fill = el("div", "acc-f");
      fill.style.width = pct + "%";
      acc.appendChild(fill);
      root.appendChild(acc);
      root.appendChild(el("p", "muted center", pct + "% răspunsuri „Bine” sau „Ușor” din " + total30 + " repetări"));
    }

    // 5. prognoza
    root.appendChild(el("h2", "sec-title", "Următoarele 7 zile"));
    var fc = [];
    for (var d = 0; d < 7; d++) fc.push(0);
    cards.forEach(function (c) {
      var s = sched(c.id);
      if (s.st === "new") return;
      var diff = Math.floor((s.due - now) / DAY);
      if (diff < 0) diff = 0;
      if (diff < 7) fc[diff]++;
    });
    var totalPrognoza = fc.reduce(function (a, v) { return a + v; }, 0);
    if (totalPrognoza === 0) {
      root.appendChild(gol("carduri", "Niciun card programat",
        "Cardurile intră în repetiție spațiată pe măsură ce le vezi prima oară."));
    } else {
    var fmax = Math.max(1, Math.max.apply(null, fc));
    var fchart = el("div", "chart prognoza");
    var names = ["azi", "+1", "+2", "+3", "+4", "+5", "+6"];
    fc.forEach(function (v, idx) {
      var col = el("div", "col");
      var b = el("div", "bar alt");
      b.style.height = Math.round(v / fmax * 100) + "%";
      if (v === 0) b.classList.add("zero");
      b.title = v + " carduri";
      col.appendChild(b);
      col.appendChild(el("span", "xlab", names[idx]));
      fchart.appendChild(col);
    });
    root.appendChild(fchart);
    }

    // 6. competență demonstrată, separat de activitate
    //    Lista brută are ~38 de rânduri, aproape toate „Neînceput”: un perete pe
    //    care nu-l citește nimeni. Arătăm întâi bilanțul, apoi doar ce ai început,
    //    iar restul rămâne pliat.
    root.appendChild(el("h2", "sec-title", "Competență demonstrată"));
    var toate = competente();
    var grupe = { solid: [], indicii: [], recap: [], nou: [] };
    toate.forEach(function (c) { (grupe[c.stare] || grupe.nou).push(c); });

    var bilant = el("div", "comp-bilant");
    [["solid", "rezolvi independent"], ["indicii", "cu indicii"],
     ["recap", "de recapitulat"], ["nou", "neîncepute"]].forEach(function (g) {
      var b = el("div", "cb cb-" + g[0]);
      b.appendChild(el("b", null, String(grupe[g[0]].length)));
      b.appendChild(el("span", null, g[1]));
      bilant.appendChild(b);
    });
    root.appendChild(bilant);

    function listaComp(items) {
      var box = el("div", "srow");
      items.forEach(function (c) {
        var row = el("div", "comp");
        row.appendChild(el("span", "comp-n", c.nume));
        row.appendChild(el("span", "comp-s s-" + c.stare, c.eticheta));
        box.appendChild(row);
      });
      return box;
    }
    var incepute = grupe.solid.concat(grupe.indicii, grupe.recap);
    if (incepute.length) {
      root.appendChild(listaComp(incepute));
    } else {
      root.appendChild(gol("tinta", "Nicio competență măsurată încă",
        "Rezolvă un scenariu sau un laborator și apare aici ce poți face fără ajutor."));
    }
    if (grupe.nou.length) {
      var d = el("details", "comp-rest");
      var sm = el("summary", null, "Încă " + grupe.nou.length + " neîncepute");
      d.appendChild(sm);
      d.appendChild(listaComp(grupe.nou));
      root.appendChild(d);
    }
    root.appendChild(el("p", "muted center",
      "Activitatea de mai sus arată cât ai lucrat. Asta arată ce poți rezolva."));

    // 7. detaliile fiecărui deck rămân accesibile, dar nu împing rezumatul
    // și statisticile utile sub zeci de rânduri cu progres zero.
    var deckRows=[],deckCount=0;
    allDecks().forEach(function (d) {
      var dc = allCards().filter(function (c) { return c.deck === d.id; });
      if (!dc.length) return;
      deckCount++;
      var seen = dc.filter(function (c) { return sched(c.id).st !== "new"; }).length;
      var row = el("div", "prow");
      var head = el("div", "prow-h");
      var cap = el("span", "st-deck");
      cap.appendChild(ico(icoDeck(d.id), "st-deck-ico"));
      cap.appendChild(el("span", null, d.name));
      head.appendChild(cap);
      head.appendChild(el("span", "muted", seen + "/" + dc.length));
      row.appendChild(head);
      var pb = el("div", "pbar");
      var pf = el("div", "pbar-f");
      pf.style.width = Math.round(seen / dc.length * 100) + "%";
      pb.appendChild(pf);
      row.appendChild(pb);
      deckRows.push(row);
    });
    var deckDetails=el("details","deck-progress141");
    deckDetails.appendChild(el("summary","sec-title","Progres pe deck · "+deckCount+" colecții"));
    deckRows.forEach(function(row){deckDetails.appendChild(row);});root.appendChild(deckDetails);
  }
  var STARI = {
    solid:    { eticheta: "Rezolvi independent", stare: "solid" },
    indicii:  { eticheta: "Mai ai nevoie de indicii", stare: "indicii" },
    recap:    { eticheta: "De recapitulat", stare: "recap" },
    nou:      { eticheta: "Neînceput", stare: "nou" }
  };

  /** Competența se citește din cum ai rezolvat, nu din cât ai lucrat. */
  function competente() {
    var out = [];

    labChapters().forEach(function (c) {
      var rezolvate = c.ex.filter(function (e) { return labIsDone(e.id); });
      var k;
      if (!rezolvate.length) k = "nou";
      else if (rezolvate.length < c.ex.length) k = "recap";
      else {
        var curat = rezolvate.every(function (e) {
          var d = state.lab.done[e.id];
          if (!d || d.t > 1 || d.h) return false;
          if (e.decizie && d.d !== 1) return false;
          return true;
        });
        k = curat ? "solid" : "indicii";
      }
      out.push({ nume: "SQL · " + c.cap, eticheta: STARI[k].eticheta, stare: k });
    });

    pyChapters().forEach(function (c) {
      var rezolvate = c.ex.filter(function (e) { return pyIsDone(e.id); });
      var k;
      if (!rezolvate.length) k = "nou";
      else if (rezolvate.length < c.ex.length) k = "recap";
      else {
        // „Solid" înseamnă demonstrat: rezolvat curat, dus prin variație și
        // justificat. Rezolvat din a treia încercare, cu indicii, e „recapitulat".
        var curat = rezolvate.every(function (e) {
          var d = state.py.done[e.id];
          if (!d || d.t > 1 || d.h) return false;
          if (e.variatie && !d.v) return false;
          if (e.decizie && d.d !== 1) return false;
          return true;
        });
        k = curat ? "solid" : "indicii";
      }
      out.push({ nume: "Python · " + c.cap, eticheta: STARI[k].eticheta, stare: k });
    });

    scenModules().forEach(function (m) {
      var rez = m.sc.filter(function (x) { return scenIsDone(x.id); });
      var k;
      if (!rez.length) k = "nou";
      else if (rez.length < m.sc.length) k = "recap";
      else {
        var curat = rez.every(function (x) { return !(state.scen.done[x.id] || {}).g; });
        k = curat ? "solid" : "indicii";
      }
      out.push({ nume: m.mod.nume, eticheta: STARI[k].eticheta, stare: k });
    });

    learnUnits().forEach(function (u) {
      var vazuti = u.terms.filter(function (t) { return termStrength(t.id) > 0; });
      var k;
      if (!vazuti.length) k = "nou";
      else {
        var medie = vazuti.reduce(function (a, t) { return a + termStrength(t.id); }, 0) / vazuti.length;
        var acoperire = vazuti.length / u.terms.length;
        if (medie >= 4 && acoperire >= 0.8) k = "solid";
        else if (medie >= 2.5) k = "indicii";
        else k = "recap";
      }
      out.push({ nume: u.deck.name, eticheta: STARI[k].eticheta, stare: k });
    });

    var ordine = { solid: 0, indicii: 1, recap: 2, nou: 3 };
    out.sort(function (a, b) { return ordine[a.stare] - ordine[b.stare]; });
    return out;
  }

  function stat(v, l) {
    var s = el("div", "stat");
    s.appendChild(el("div", "stat-v", v));
    s.appendChild(el("div", "stat-l", l));
    return s;
  }

  // ---------------------------------------------------------------- UI: setari
  function renderSettings() {
    $("#set-new").value = state.settings.newPerDay;
    $("#set-rev").value = state.settings.maxRev;
    $("#set-theme").value = state.settings.theme;
    $("#set-style").value = state.settings.style || "retro";
    $("#set-font").value = String(state.settings.fontScale);
    var hb0 = document.getElementById("set-hearts");
    if (hb0) hb0.checked = state.settings.hearts !== false;
    var ha0 = document.getElementById("set-hideanswer");
    if (ha0) ha0.checked = !!state.settings.hideAnswer;
    var as0 = document.getElementById("set-asistent");
    if (as0) as0.checked = asistentPornit();
    var lv = document.getElementById("set-level");
    if (lv) lv.value = state.settings.level || "mediu";
    var gl = document.getElementById("set-goal");
    if (gl) gl.value = String(state.settings.goal || 60);
    var box = $("#set-decks");
    if(!document.getElementById("set-deck-scope143")){var scopeNote=el("p","muted","Domeniile active filtrează sesiunea zilnică. Poți deschide manual și materialele altor domenii sau certificări.");scopeNote.id="set-deck-scope143";box.parentNode.insertBefore(scopeNote,box);}
    box.innerHTML = "";
    allDecks().forEach(function (d) {
      var n = allCards().filter(function (c) { return c.deck === d.id; }).length;
      if (!n) return;
      var row = el("label", "switch");
      var cb = el("input");
      cb.type = "checkbox";
      cb.checked = deckEnabled(d.id);
      cb.onchange = function () {
        state.settings.decks[d.id] = cb.checked;
        save(true);
      };
      row.appendChild(cb);
      var nume = el("span", "sw-name");
        nume.appendChild(ico(icoDeck(d.id), "sw-ico"));
        nume.appendChild(el("span", null, d.name));
        row.appendChild(nume);
      row.appendChild(el("span", "muted", String(n)));
      box.appendChild(row);
    });
    $("#set-info").textContent = allCards().length + " carduri · " +
      Object.keys(state.sched).length + " cu progres · " + state.log.length + " repetări în jurnal";
    var note=document.getElementById("runtime-note141");if(!note){note=el("p","muted runtime-note141");note.id="runtime-note141";note.textContent="SQL rulează local în motorul SQLite, iar exercițiile Python rulează local în runtime-ul inclus. pandas, Polars și PySpark sunt folosite în kata de raționament, fără execuția bibliotecilor în aplicație.";document.getElementById("sc-settings").appendChild(note);}
  }
  function isDarkNow() {
    var t = state.settings.theme;
    if (t === "dark") return true;
    if (t === "light") return false;
    try { return window.matchMedia("(prefers-color-scheme: dark)").matches; }
    catch (e) { return true; }
  }
  function applyTheme() {
    var t = state.settings.theme;
    document.documentElement.setAttribute("data-style",state.settings.style==="classic"?"classic":"retro");
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    document.documentElement.style.setProperty("--fs", state.settings.fontScale);
    if (Bridge && Bridge.setDark) { try { Bridge.setDark(isDarkNow()); } catch (e) {} }
  }

  // Android trimite marginile ferestrei (edge-to-edge) ca "l,t,r,b,ime" în CSS px.
  window.__setInsets = function (csv) {
    var p = String(csv).split(",").map(parseFloat);
    if (p.length < 5 || p.some(function (n) { return !isFinite(n) || n < 0; })) return false;
    var names = ["--sal", "--sat", "--sar", "--sab", "--ime"];
    for (var i = 0; i < 5; i++) {
      document.documentElement.style.setProperty(names[i], p[i] + "px");
    }
    if (scheduleFocusedEditable146) scheduleFocusedEditable146();
    return true;
  };

  // ---------------------------------------------------------------- backup
  var MAX_BACKUP_BYTES146 = 20 * 1024 * 1024;
  function backupBytes146(text) { return new Blob([text]).size; }
  var BACKUP_TOO_LARGE146 = "Fișier prea mare. Limita copiei este de 20 MiB (UTF-8).";
  function exportBackup() {
    var payload = JSON.stringify({ app: "decards", v: 1, exported: new Date().toISOString(), state: state });
    if (backupBytes146(payload) > MAX_BACKUP_BYTES146) { toast(BACKUP_TOO_LARGE146); return; }
    if (Bridge && Bridge.exportBackup) {
      try {
        var res = Bridge.exportBackup(payload);
        toast(res || "Backup salvat.");
        return;
      } catch (e) { toast("Export eșuat: " + e); return; }
    }
    try {
      var blob = new Blob([payload], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "decards-backup.json";
      a.click();
      toast("Backup descărcat.");
    } catch (e) { toast("Export indisponibil aici."); }
  }
  function importBackup() {
    if (Bridge && Bridge.importBackup) { Bridge.importBackup(); return; }
    var inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "application/json,.json";
    inp.onchange = function () {
      var f = inp.files[0];
      if (!f) return;
      if (f.size > MAX_BACKUP_BYTES146) { toast(BACKUP_TOO_LARGE146); return; }
      var r = new FileReader();
      r.onload = function () { window.onImport(String(r.result)); };
      r.readAsText(f);
    };
    inp.click();
  }
  var pendingImport130=null;
  function inspectBackup130(raw){
    if(typeof raw!=="string")throw new Error("fișier gol sau neacceptat");
    if(backupBytes146(raw)>MAX_BACKUP_BYTES146)throw new Error(BACKUP_TOO_LARGE146);
    var obj=JSON.parse(raw),plain=function(x){return x && typeof x==="object" && !Array.isArray(x);};
    if(!plain(obj))throw new Error("rădăcina trebuie să fie un obiect");
    if(obj.app && ["decards","dataeng-learn","ro.dataeng.learn"].indexOf(obj.app)<0)throw new Error("copie creată de altă aplicație");
    if(obj.v!==undefined && obj.v!==1)throw new Error("versiune de copie nesuportată");
    var s=obj.state || obj;if(!plain(s) || !plain(s.sched))throw new Error("progresul de repetiție lipsește sau este invalid");
    if(s.custom!==undefined && !Array.isArray(s.custom))throw new Error("colecția de carduri personale este invalidă");
    if(s.log!==undefined && !Array.isArray(s.log))throw new Error("jurnalul este invalid");
    ["settings","learn","lab","py","scen","library","projects","exams","courses145"].forEach(function(k){if(s[k]!==undefined && !plain(s[k]))throw new Error("secțiune invalidă: "+k);});
    if(s.courses145)["courses","units","practice","projects","history"].forEach(function(k){objects(s.courses145[k],"Cursuri: "+k);});
    function objects(map,label){if(map!==undefined){if(!plain(map))throw new Error(label+": structură invalidă");Object.keys(map).forEach(function(k){if(!plain(map[k]))throw new Error(label+": înregistrare invalidă");});}}
    objects(s.sched,"Programări");objects(s.projects,"Proiecte");
    if(s.library){["notes","favorites"].forEach(function(k){if(s.library[k]!==undefined && !plain(s.library[k]))throw new Error("Bibliotecă: "+k+" invalid");});if(s.library.notes)Object.keys(s.library.notes).forEach(function(k){var n=s.library.notes[k];if(typeof n!=="string" && !(plain(n) && typeof n.text==="string" && (n.at===undefined || (typeof n.at==="number" && isFinite(n.at)))))throw new Error("Notiță invalidă");});}
    if(s.custom)s.custom.forEach(function(c){if(!plain(c) || typeof c.id!=="string" || typeof c.q!=="string" || typeof c.a!=="string")throw new Error("Card personal invalid");});
    if(s.projects)Object.keys(s.projects).forEach(function(k){var x=s.projects[k];if(x.code!==undefined && (typeof x.code!=="string" || x.code.length>20000))throw new Error("Ciornă de proiect invalidă sau prea mare");if(x.criteria!==undefined && !Array.isArray(x.criteria))throw new Error("Criterii de proiect invalide");});
    var count=0;function safe(x,depth){if(depth>60)throw new Error("structură prea adâncă");if(!x || typeof x!=="object")return;Object.keys(x).forEach(function(k){if(++count>300000)throw new Error("prea multe înregistrări");if(k==="__proto__" || k==="constructor" || k==="prototype")throw new Error("cheie de structură neacceptată");safe(x[k],depth+1);});}safe(s,0);
    var candidate=migrate(JSON.parse(JSON.stringify(s)));
    return {state:candidate,summary:{custom:candidate.custom.length,repetitions:Object.keys(candidate.sched).length,notes:Object.keys(candidate.library.notes).length,favorites:Object.keys(candidate.library.favorites).length,projects:Object.keys(candidate.projects).length}};
  }
  window.onImport = function(raw){
    pendingImport130=null;
    try{var inspected=inspectBackup130(raw);pendingImport130=inspected.state;var body=$("#modal-body");body.innerHTML="";$("#modal-title").textContent="Verifică copia înainte de restaurare";
      body.appendChild(el("p",null,"Restaurarea înlocuiește progresul local cu cel din fișier. Poți exporta copia curentă înainte de a continua."));
      var names={custom:"Carduri personale",repetitions:"Carduri cu programare",notes:"Notițe",favorites:"Favorite",projects:"Proiecte cu lucru salvat"};Object.keys(names).forEach(function(k){body.appendChild(el("p",null,names[k]+": "+inspected.summary[k]));});
      var exportCurrent=el("button","btn secondary","Exportă datele curente");exportCurrent.onclick=exportBackup;body.appendChild(exportCurrent);
      var apply=el("button","btn primary","Restaurează această copie");apply.id="import-confirm";apply.onclick=function(){
        if(!pendingImport130)return;var candidate=pendingImport130;
        if(!rawSave(JSON.stringify(candidate))){toast("Salvarea nu a reușit. Datele curente au rămas active; poți încerca din nou.");return;}
        L=null;ui.activeFlow=null;state=candidate;pendingImport130=null;rollDay();applyTheme();closeModal();save(true);show("home");toast("Backup restaurat.");
      };body.appendChild(apply);var cancel=el("button","btn secondary","Păstrează datele curente");cancel.id="import-cancel";cancel.onclick=function(){pendingImport130=null;closeModal();};body.appendChild(cancel);$("#modal").hidden=false;return true;
    }catch(e){toast("Fișier invalid: "+e.message);return false;}
  };

  // ---------------------------------------------------------------- back
  window.onBackPressed = function () {
    if (!$("#editor").hidden) { $("#editor").hidden = true; ui.editing = null; return true; }
    if (!$("#modal").hidden) { closeModal(); return true; }
    if (!$("#setup").hidden) {
      if (state.settings.setup) { $("#setup").hidden = true; show("home"); return true; }
      return true;   // configurarea inițială nu se poate sări
    }
    if (!$("#lab").hidden) { inchideLaborator(); return true; }
    if (!$("#lesson").hidden) { endLesson(); return true; }
    if (!$("#study").hidden) { endSession(); return true; }
    if (ui.screen !== "home") { show("home"); return true; }
    return false;
  };

  // ---------------------------------------------------------------- init
  function bind() {
    ["home", "learn", "browse", "stats", "settings"].forEach(function (s) {
      var t = document.getElementById("tab-" + s);
      if (!t) return;
      t.onclick = function () { show(s); };
      var slot = t.querySelector(".ic");
      if (slot && !slot.firstChild) slot.appendChild(ico(t.getAttribute("data-ico")));
    });
    // butoanele de închidere: aceeași pictogramă peste tot, nu un caracter
    ["st-close", "ls-close", "lab-close"].forEach(function (id) {
      var b = document.getElementById(id);
      if (b && !b.firstChild) b.appendChild(ico(b.getAttribute("data-ico"), "ico-inchide"));
    });
    $("#st-reveal").onclick = reveal;
    $("#st-card").onclick = function (e) {
      if (!ui.revealed && !e.target.closest("button,input,textarea,select,details,a,label")) reveal();
    };
    $("#st-close").onclick = endSession;
    $("#ls-close").onclick = endLesson;
    var rateBtns = document.querySelectorAll("[data-rate]");
    for (var i = 0; i < rateBtns.length; i++) {
      (function (b) {
        b.onclick = function () { rate(Number(b.getAttribute("data-rate"))); };
      })(rateBtns[i]);
    }
    $("#browse-q").oninput = function () { ui.browseFilter = this.value; renderBrowse(); };
    $("#browse-deck").onchange = function () { ui.browseDeck = this.value; renderBrowse(); };
    $("#browse-add").onclick = function () { openEditor(null); };
    var lc = document.getElementById("lab-close");
    if (lc) lc.onclick = inchideLaborator;
    $("#modal-close").onclick = closeModal;
    $("#modal").onclick = function (e) { if (e.target === this) closeModal(); };
    $("#ed-save").onclick = saveEditor;
    $("#ed-cancel").onclick = function () { $("#editor").hidden = true; ui.editing = null; };
    $("#set-new").onchange = function () {
      state.settings.newPerDay = clamp(parseInt(this.value, 10) || 0, 0, 200);
      this.value = state.settings.newPerDay; save(true);
    };
    $("#set-rev").onchange = function () {
      state.settings.maxRev = clamp(parseInt(this.value, 10) || 0, 0, 999);
      this.value = state.settings.maxRev; save(true);
    };
    $("#set-style").onchange = function(){state.settings.style=this.value;applyTheme();save(true);};
    $("#set-audit").onclick=openLibraryAudit;
    $("#set-theme").onchange = function () {
      state.settings.theme = this.value; applyTheme(); save(true);
    };
    $("#set-font").onchange = function () {
      state.settings.fontScale = parseFloat(this.value); applyTheme(); save(true);
    };
    var ha = document.getElementById("set-hideanswer");
    if (ha) ha.onchange = function () {
      state.settings.hideAnswer = this.checked; save(true);
    };
    var lvb = document.getElementById("set-level");
    if (lvb) lvb.onchange = function () { state.settings.level = this.value; save(true); };
    var glb = document.getElementById("set-goal");
    if (glb) glb.onchange = function () {
      state.settings.goal = parseInt(this.value, 10) || 60; save(true);
    };
    var sb = document.getElementById("set-personalize");
    if (sb) sb.onclick = openSetup;
    $("#su-next").onclick = setupNext;
    $("#su-back").onclick = setupBack;
    var ab = document.getElementById("set-asistent");
    if (ab) {
      ab.checked = asistentPornit();
      ab.onchange = function () {
        state.settings.asistent = this.checked; save(true);
      };
    }
    var hb = document.getElementById("set-hearts");
    if (hb) hb.onchange = function () {
      state.settings.hearts = this.checked; save(true);
    };
    $("#set-export").onclick = exportBackup;
    $("#set-import").onclick = importBackup;
    $("#set-reset").onclick = function () {
      if (!confirm("Resetezi progresul: cursuri, XP, repetiții, jurnal și serie, încercări, ciorne SQL/Python și dovezi/notițe din proiecte? Cardurile proprii și notele personale din bibliotecă rămân. Exportă un backup înainte dacă vrei să poți reveni.")) return;
      state.sched = {}; state.log = []; state.streak = { last: null, count: 0, best: 0 };
      state.daily = { date: dayKey(), newDone: 0, revDone: 0, questClaimed: {} };
      state.learn = { terms: {}, lessons: {}, xp: 0, xpDay: { date: dayKey(), n: 0 } };
      state.lab = { done: {}, draft: {} };
      state.py = { done: {}, draft: {}, work: {} };
      state.scen = { done: {} };
      state.courses145 = { courses: {}, units: {}, practice: {}, projects: {}, history: {}, migrated: true };
      state.assessments={};state.projects={};state.sparkPractice={done:{},draft:{}};state.exams={sessions:{},generatedForms:{},activeId:null};state.resume=null;state.returnSession=null;state.returnStack=[];state.discovery.returnKey=null;ui.activeFlow=null;L=null;clearInterval(simulationTimer);simulationId=null;
      save(true); show("home"); toast("Progres resetat.");
    };
    document.addEventListener("keydown", function (e) {
      if ($("#study").hidden) return;
      if(e.target && (e.target.matches("input,textarea,select") || e.target.isContentEditable || e.target.closest(".study-table132")))return;
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); ui.revealed ? rate(GOOD) : reveal(); }
      else if (ui.revealed && e.key >= "1" && e.key <= "4") rate(Number(e.key));
      else if (e.key === "Escape") endSession();
    });
    ["study","lesson"].forEach(function(id){document.getElementById(id).addEventListener("click",function(){Promise.resolve().then(function(){if(ui.activeFlow)save(true);});});});
    window.addEventListener("pagehide", function(){save(true);});
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "hidden") save(true);else refreshToday139();
    });
  }

  window.addEventListener("focus",function(){refreshToday139();});

  // Evaluări locale: răspunsurile se salvează înainte de corectare.
  var simulationId=null,simulationTimer=null;
  function longestAnswer135(q){var sizes=q.o.map(function(o){return o.t.trim().split(/\s+/).length;}),max=Math.max.apply(null,sizes);return q.o.some(function(o,i){return o.ok && sizes[i]===max;});}
  function validGeneratedForm(f){
    var bp=f && (SEED.examFormBlueprints || []).concat(SEED.examBlueprintArchive || []).filter(function(x){return x.examen===f.examen && Array.isArray(f.questionIds) && f.questionIds.every(function(id){return x.pools.some(function(pool){return pool.indexOf(id)>=0;});});})[0];
    if(!bp || typeof f.id!=="string" || !f.id.startsWith("generated128-") || !Array.isArray(f.questionIds) || f.questionIds.length!==bp.questionCount || new Set(f.questionIds).size!==bp.questionCount || !f.domainByQuestion || f.durationMinutes!==bp.durationMinutes)return false;
    return (!bp.minimumTechnicalPercent || 100*f.questionIds.filter(function(id){var q=questionById(id);return q.technicalReference138 || q.technicalReference137 || q.technicalReference136;}).length>=bp.minimumTechnicalPercent*f.questionIds.length) && (!bp.maximumLongestPercent || 100*f.questionIds.filter(function(id){return longestAnswer135(questionById(id));}).length<=bp.maximumLongestPercent*f.questionIds.length) && f.questionIds.filter(function(id){var q=questionById(id);return q && q.mode==="multiple";}).length>=(bp.minimumMultiple || 0) && bp.allocation.every(function(n,d){return f.questionIds.filter(function(id){return f.domainByQuestion[id]===d && bp.pools[d].indexOf(id)>=0;}).length===n;});
  }
  function generateWeightedExam(id,trial){
    var bp=(SEED.examFormBlueprints || []).filter(function(x){return x.examen===id;})[0];if(!bp)return false;
    var ids=[],domains={},pools=bp.pools.map(function(pool){return shuffle(pool.slice());}),selected=pools.map(function(){return [];}),multi=pools.map(function(pool){return pool.filter(function(qid){return questionById(qid).mode==="multiple";});});
    for(var i=0;i<(bp.minimumMultiple || 0);i++){var candidates=multi.map(function(pool,d){return {d:d,n:pool.length};}).filter(function(x){return x.n && selected[x.d].length<bp.allocation[x.d];}).sort(function(a,b){return b.n-a.n;});if(!candidates.length){toast("Nu sunt suficiente întrebări cu selecție multiplă pentru acest test.");return false;}var d=candidates[0].d;selected[d].push(multi[d].shift());}
    pools.forEach(function(pool,d){pool.forEach(function(qid){if(selected[d].length<bp.allocation[d] && selected[d].indexOf(qid)<0)selected[d].push(qid);});selected[d].forEach(function(qid){ids.push(qid);domains[qid]=d;});});
    var fid="generated128-"+id+"-"+Date.now()+"-"+Math.random().toString(36).slice(2,8),e=examenById(id);
    var f={id:fid,examen:id,titlu:e.cod+" · test nou echilibrat",questionCount:bp.questionCount,questionIds:shuffle(ids),domainByQuestion:domains,allocation:bp.allocation.slice(),durationMinutes:bp.durationMinutes,domainNames:e.domenii.map(function(d){return d.nume;}),note:"Test local generat după ponderile indicate. Numai întrebări scrise/adaptate individual; nu este scor oficial.",generation:"weighted-authored"};
    f.contentRevision=bp.contentRevision || APP_VERSION;
    if(!validGeneratedForm(f)){
      if(bp.maximumLongestPercent && (trial || 0)<79)return generateWeightedExam(id,(trial || 0)+1);
      var fallback=(SEED.examForms || []).filter(function(x){return x.examen===id;})[0];
      if(!fallback){toast("Nu este disponibil un set complet pentru distribuția cerută.");return false;}
      f=JSON.parse(JSON.stringify(fallback));f.id=fid;f.titlu=e.cod+" · formă verificată";
      f.note+=" Se folosește o formă editorială verificată deoarece selecția aleatorie nu a trecut toate limitele.";
      if(!validGeneratedForm(f))return false;
    }
    state.exams.generatedForms[fid]=f;save(true);return startSimulation(fid);
  }
  function examForm(id,generatedForms){var generated=generatedForms || (state && state.exams && state.exams.generatedForms) || {};return (SEED.examForms || []).concat(SEED.legacyExamForms || [],Object.values(generated)).filter(function(f){return f.id===id;})[0] || null;}
  function simulationAttempt(){return state.exams.sessions[simulationId] || null;}
  function validAttempt(a,generatedForms){
    var f=a && examForm(a.formId,generatedForms);
    return !!(f && a.answers && typeof a.answers==="object" && !Array.isArray(a.answers) && a.flags && typeof a.flags==="object" && !Array.isArray(a.flags) && ["active","completed"].indexOf(a.status)>=0 && Array.isArray(a.questionIds) && a.questionIds.length===f.questionIds.length &&
      a.questionIds.every(function(id,i){return id===f.questionIds[i] && questionById(id);}) && Number.isFinite(a.deadline) && Number.isInteger(a.index) && a.index>=0 && a.index<f.questionIds.length &&
      Object.keys(a.answers).every(function(id){var q=questionById(id),v=a.answers[id];return f.questionIds.indexOf(id)>=0 && q && Array.isArray(v) && v.every(function(n,i){return Number.isInteger(n) && n>=0 && n<q.o.length && v.indexOf(n)===i;});}) &&
      Object.keys(a.flags).every(function(id){return f.questionIds.indexOf(id)>=0 && typeof a.flags[id]==="boolean";}) &&
      (!a.orders || (typeof a.orders==="object" && !Array.isArray(a.orders) && Object.keys(a.orders).every(function(id){var q=questionById(id),v=a.orders[id];return f.questionIds.indexOf(id)>=0 && q && Array.isArray(v) && v.length===q.o.length && v.every(function(n,i){return Number.isInteger(n) && n>=0 && n<q.o.length && v.indexOf(n)===i;});}))));
  }
  function startSimulation(formId,attemptId){
    var form=examForm(formId);if(!form)return false;
    if(["course","reading","case","project"].indexOf(ui.activeFlow)>=0)prepareRelatedRun129();
    var a=attemptId && state.exams.sessions[attemptId];
    if(!a)Object.keys(state.exams.sessions).some(function(id){var x=state.exams.sessions[id];if(x.formId===formId && x.status==="active" && validAttempt(x)){a=x;return true;}return false;});
    if(!a){
      var id="attempt-"+Date.now()+"-"+Math.random().toString(36).slice(2,9),orders={};
      form.questionIds.forEach(function(qid){orders[qid]=shuffle(questionById(qid).o.map(function(_,i){return i;}));});
      a={id:id,formId:formId,questionIds:form.questionIds.slice(),status:"active",index:0,answers:{},flags:{},orders:orders,started:Date.now(),deadline:Date.now()+form.durationMinutes*60000};
      state.exams.sessions[id]=a;
    }
    if(!validAttempt(a)){toast("Această încercare nu mai corespunde testului disponibil.");return false;}
    simulationId=a.id;state.exams.activeId=a.id;L=null;labCur=null;pyCur=null;ui.activeFlow="simulation";
    $("#lesson").hidden=true;$("#study").hidden=true;$("#nav").hidden=true;$("#lab").hidden=false;$("#lab-fb").hidden=true;
    renderSimulation();save(true);return true;
  }
  function simulationCorrect(q,answer){
    var expected=q.o.map(function(o,i){return o.ok?i:-1;}).filter(function(i){return i>=0;});
    return Array.isArray(answer) && answer.length===expected.length && expected.every(function(i){return answer.indexOf(i)>=0;});
  }
  function recordSimulation(a){
    if(a.recorded)return;
    a.questionIds.forEach(function(id){var q=questionById(id),answer=a.answers[id];if(!Array.isArray(answer) || !answer.length)return;
      var ok=simulationCorrect(q,answer),prior=state.assessments[id] || {};
      state.assessments[id]={correct:ok,attempts:(prior.attempts || 0)+1,errors:(prior.errors || 0)+(ok?0:1),last:a.finished,exam:examForm(a.formId).examen,dom:q.dom || "",competency:q.competency || null};
    });a.recorded=true;
  }
  function finishSimulation(expired){
    var a=simulationAttempt();if(!a || a.status!=="active")return false;
    a.status="completed";a.finished=Date.now();a.expired=!!expired;
    a.correct=a.questionIds.filter(function(id){return simulationCorrect(questionById(id),a.answers[id]);}).length;
    recordSimulation(a);save(true);renderSimulation();return true;
  }
  function tickSimulation(){
    var a=simulationAttempt();if(!a || a.status!=="active" || ui.activeFlow!=="simulation")return;
    if(Date.now()>=a.deadline){finishSimulation(true);return;}
    var label=$("#simulation-clock"),seconds=Math.max(0,Math.ceil((a.deadline-Date.now())/1000));
    if(label)label.textContent=Math.floor(seconds/60)+":"+String(seconds%60).padStart(2,"0")+" rămase";
  }
  function renderSimulation(){
    if(simulationTimer)clearInterval(simulationTimer);simulationTimer=null;
    var a=simulationAttempt();if(!validAttempt(a))return;
    if(a.status==="active" && Date.now()>=a.deadline){finishSimulation(true);return;}
    var form=examForm(a.formId),body=$("#lab-body");body.innerHTML="";$("#lab-cap").textContent=form.titlu;
    if(a.status==="completed"){renderSimulationResult(body,a,form);return;}
    var clock=el("p","rezumat");clock.id="simulation-clock";clock.setAttribute("role","timer");body.appendChild(clock);
    body.appendChild(el("p","muted",form.note));
    var answered=a.questionIds.filter(function(id){return (a.answers[id] || []).length>0;}).length;
    body.appendChild(el("p",null,(a.index+1)+" / "+a.questionIds.length+" · "+answered+" răspunsuri salvate"));
    var nav=el("div","simulation-grid");nav.setAttribute("aria-label","Navigarea întrebărilor");
    a.questionIds.forEach(function(id,i){var b=el("button","btn mini ghost",String(i+1)+(a.flags[id]?" ★":"")+((a.answers[id] || []).length?" ✓":""));b.type="button";b.setAttribute("aria-current",i===a.index?"step":"false");b.onclick=function(){a.index=i;save(true);renderSimulation();};nav.appendChild(b);});body.appendChild(nav);
    var q=questionById(a.questionIds[a.index]),id=q.id,required=q.o.filter(function(o){return o.ok;}).length;
    body.appendChild(el("h3",null,q.q));body.appendChild(el("p","rezumat",required>1?"Selecție multiplă · alege "+required+" răspunsuri":"Alege un singur răspuns"));
    var group=el("fieldset");group.className="simulation-options";group.appendChild(el("legend","sr-only","Răspunsurile întrebării "+(a.index+1)));
    var order=a.orders && a.orders[id];if(!Array.isArray(order) || order.length!==q.o.length || new Set(order).size!==q.o.length || order.some(function(n){return !Number.isInteger(n) || n<0 || n>=q.o.length;}))order=q.o.map(function(_,i){return i;});
    order.forEach(function(index){var label=el("label","simulation-option"),input=el("input");input.type=required>1?"checkbox":"radio";input.name="simulation-answer";input.value=String(index);input.checked=(a.answers[id] || []).indexOf(index)>=0;
      input.onchange=function(){if(a.status!=="active")return;if(Date.now()>=a.deadline){finishSimulation(true);return;}
        var values=required>1?(a.answers[id] || []).filter(function(i){return i!==index;}):[];if(input.checked)values.push(index);a.answers[id]=values.sort(function(x,y){return x-y;});save(true);
      };label.appendChild(input);var text=el("span","md");text.innerHTML=renderMd(q.o[index].t);label.appendChild(text);group.appendChild(label);});body.appendChild(group);
    var flag=el("button","btn ghost",a.flags[id]?"Scoate marcajul de revizuire":"Marchează pentru revizuire");flag.id="simulation-flag";flag.onclick=function(){a.flags[id]=!a.flags[id];save(true);renderSimulation();};body.appendChild(flag);
    var previous=el("button","btn secondary","Înapoi");previous.id="simulation-previous";previous.disabled=a.index===0;previous.onclick=function(){a.index--;save(true);renderSimulation();};body.appendChild(previous);
    var submit=el("button","btn secondary","Predă testul");submit.id="simulation-submit";submit.onclick=function(){
      var missing=a.questionIds.filter(function(qid){return !(a.answers[qid] || []).length;}).length;
      if(confirm("Predai răspunsurile salvate? "+missing+" întrebări sunt fără răspuns. După predare nu mai poți schimba această încercare."))finishSimulation(false);
    };body.appendChild(submit);
    setFootLab(a.index<a.questionIds.length-1?"Următoarea întrebare":"Verifică și predă",true,function(){if(a.index<a.questionIds.length-1){a.index++;save(true);renderSimulation();}else submit.click();});
    $("#lab-scroll").scrollTop=0;tickSimulation();simulationTimer=setInterval(tickSimulation,1000);
  }
  function renderSimulationResult(body,a,form){
    body.appendChild(el("h2",null,a.correct+" / "+a.questionIds.length+" răspunsuri corecte"));
    body.appendChild(el("p","muted",(a.expired?"Timpul de practică a expirat. ":"")+"Rezultatul este local. Întrebările fără răspuns au zero puncte în acest test; nu sunt înregistrate ca încercate în progresul pe domenii. Nu se acordă XP pentru predarea repetată."));
    var rows={};a.questionIds.forEach(function(id){var domain=form.domainByQuestion[id],row=rows[domain] || {n:0,ok:0};row.n++;if(simulationCorrect(questionById(id),a.answers[id]))row.ok++;rows[domain]=row;});
    Object.keys(rows).forEach(function(index){var domain=form.domainNames?{nume:form.domainNames[index]}:(examenById(form.examen).domenii || [])[index];body.appendChild(el("p",null,(domain?domain.nume:"Practică transversală")+": "+rows[index].ok+" / "+rows[index].n));});
    a.questionIds.forEach(function(id,i){var q=questionById(id),ok=simulationCorrect(q,a.answers[id]),details=el("details","unit");details.setAttribute("data-simulation-review",id);details.appendChild(el("summary",null,(i+1)+". "+(ok?"Corect":"De consolidat")+" · "+q.q));
      q.o.forEach(function(o,index){var marked=(a.answers[id] || []).indexOf(index)>=0;var row=el("div","md");row.innerHTML=renderMd((marked?"**Ai ales** · ":"")+(o.ok?"**Corect** · ":"")+o.t+(!o.ok && o.w?"\n\n"+o.w:""));details.appendChild(row);});
      sectiuneMd(details,"Explicație",q.e);appendRelated(details,id,"Explicație și practică");body.appendChild(details);
    });
    var wrong=el("button","btn secondary","Exersează întrebările de consolidat");wrong.id="simulation-wrong";wrong.onclick=function(){var items=a.questionIds.filter(function(id){return !simulationCorrect(questionById(id),a.answers[id]);}).map(function(id){return {type:"exam",q:questionById(id),exam:form.examen};});if(!items.length){toast("Toate răspunsurile sunt corecte.");return;}inchideLaborator();startRun(items,{titlu:"Consolidare · "+form.titlu});};body.appendChild(wrong);
    setFootLab("Închide rezultatul",true,inchideLaborator);$("#lab-scroll").scrollTop=0;
  }
  function renderDomainModules(host,id){
    var modules=(SEED.domainModules || []).filter(function(m){return m.examen===id;});if(!modules.length)return;
    host.appendChild(el("h3",null,"Module pe domeniile examenului"));
    modules.forEach(function(m){var details=el("details","unit");details.setAttribute("data-domain-module",m.id);details.appendChild(el("summary",null,m.nume+" · "+(m.pondere || "pondere neconfirmată")));
      details.addEventListener("toggle",function(){if(!details.open || details.getAttribute("data-loaded"))return;details.setAttribute("data-loaded","true");details.appendChild(el("p","muted",m.source));
        (SEED.objectives || []).filter(function(o){return o.exam===id && o.domainIndex===m.domainIndex;}).forEach(function(o){var box=el("details","unit");box.setAttribute("data-objective",o.id);box.appendChild(el("summary",null,({direct:"Direct",partial:"Parțial",missing:"Lipsă"}[o.coverage] || o.coverage)+" · "+o.text));
          if(o.missing && o.missing.length)box.appendChild(el("p","muted","De completat: "+o.missing.join("; ")));
          [["lessonIds","lesson","Lecție"],["exerciseIds","exercise","Atelier"],["questionIds","question","Întrebare scrisă"]].forEach(function(group){(o[group[0]] || []).forEach(function(resource){var material=materialById(group[1],resource);var b=el("button","btn secondary",group[2]+" · "+(material?materialTitle(group[1],material):"Material indisponibil"));b.onclick=function(){openRelatedExplanation(group[1],resource);};box.appendChild(b);});});details.appendChild(box);
        });
        (m.caseIds || []).forEach(function(cid){var c=(SEED.caseStudies || []).filter(function(x){return x.id===cid;})[0];if(!c)return;var b=el("button","btn secondary","Studiu de caz · "+c.titlu);b.onclick=function(){openCaseStudy(cid);};details.appendChild(b);});
      });host.appendChild(details);
    });
  }
  function renderExamTemplate(host,id){
    var plan=studySection132(host,"Programa și modulele","plan"),testSection=studySection132(host,"Teste și sesiuni","tests"),application=null;
    if((SEED.caseStudies || []).concat(SEED.recaps || []).some(function(x){return x.examen===id;}))application=studySection132(host,"Cazuri și fișe de recapitulare","cases");
    host=testSection;
    if((SEED.examFormBlueprints || []).some(function(x){return x.examen===id;})){
      var generate=el("button","btn secondary","Generează un test nou după ponderi");generate.setAttribute("data-generate-exam",id);generate.onclick=function(){generateWeightedExam(id);};host.appendChild(generate);
    }
    var provenance=el("select");provenance.setAttribute("aria-label","Proveniența întrebărilor");provenance.setAttribute("data-question-provenance",id);
    [["","Toate întrebările"],["written","Scrise / adaptate individual"],["template","Din șablon de competență"]].forEach(function(row){provenance.appendChild(new Option(row[1],row[0]));});host.appendChild(provenance);
    var practice=el("button","btn secondary","Exersează întrebările selectate"),count=el("p","muted");host.appendChild(count);host.appendChild(practice);
    function filtered(){var n=testExamen(id).filter(function(q){return !provenance.value || (q.provenance || {}).kind===provenance.value;}).length;count.textContent=n+" întrebări pentru proveniența aleasă";practice.disabled=!n;}
    provenance.onchange=filtered;practice.onclick=function(){startExamPractice(id,"all","",provenance.value);};filtered();
    renderDomainModules(plan,id);
    (SEED.examForms || []).concat(Object.values(state.exams.generatedForms || {}),(SEED.legacyExamForms || []).filter(function(f){return Object.values(state.exams.sessions).some(function(a){return a.formId===f.id;});})).filter(function(f){return f.examen===id;}).forEach(function(form){
      var active=Object.keys(state.exams.sessions).map(function(k){return state.exams.sessions[k];}).filter(function(a){return a.formId===form.id && a.status==="active" && validAttempt(a);})[0];
      var currentBp=(SEED.examFormBlueprints || []).filter(function(b){return b.examen===form.examen;})[0];
      var historical=form.legacy || (currentBp && form.questionIds.every(function(qid){return !currentBp.pools.some(function(pool){return pool.indexOf(qid)>=0;});}));
      var button=el("button","mat-row",(historical?"Istoric · ":"")+(active?"Reia · ":"")+form.titlu+" · "+form.questionIds.length+" întrebări / "+form.durationMinutes+" min");button.setAttribute("data-exam-form",form.id);button.onclick=function(){startSimulation(form.id);};host.appendChild(button);
      if(historical)host.appendChild(el("p","muted","Banca anterioară este păstrată pentru încercările tale. Răspunsurile ei nu acordă stăpânire întrebărilor revizuite."));
      var history=Object.keys(state.exams.sessions).map(function(k){return state.exams.sessions[k];}).filter(function(a){return a.formId===form.id && a.status==="completed" && validAttempt(a);}).sort(function(a,b){return b.finished-a.finished;});
      if(history.length){var results=el("details","unit");results.appendChild(el("summary",null,"Încercări încheiate · "+history.length));history.forEach(function(a){var b=el("button","btn mini ghost",a.correct+"/"+a.questionIds.length+" · "+new Date(a.finished).toLocaleString("ro-RO"));b.onclick=function(){startSimulation(form.id,a.id);};results.appendChild(b);});host.appendChild(results);}
    });
    var coverage=(SEED.courseCoverage || []).filter(function(row){return row.examen===id;});
    if(coverage.length){var map=el("details","unit");map.appendChild(el("summary",null,"Programa și explicațiile cursului · "+coverage.length+" repere"));
      map.appendChild(el("p","muted","Corespondență pedagogică revizuită pe programa publicată. Practica este cea explicită a cardurilor și studiilor de caz; nu demonstrează execuție în cloud."));
      coverage.forEach(function(row){var detail=el("details");detail.appendChild(el("summary",null,row.topic));detail.appendChild(el("p","muted",row.verification));row.cardIds.forEach(function(cid){var c=cardById(cid);if(!c)return;var b=el("button","btn mini ghost",c.q);b.onclick=function(){openRelatedExplanation("card",cid);};detail.appendChild(b);});map.appendChild(detail);});plan.appendChild(map);
    }
    (SEED.caseStudies || []).filter(function(c){return c.examen===id;}).forEach(function(c){var b=el("button","mat-row","Studiu de caz · "+c.titlu);b.setAttribute("data-case",c.id);b.onclick=function(){openCaseStudy(c.id);};application.appendChild(b);});
    (SEED.recaps || []).filter(function(c){return c.examen===id;}).forEach(function(c){var b=el("button","mat-row","Recapitulare · "+c.titlu);b.setAttribute("data-recap",c.id);b.onclick=function(){openRecap(c.id);};application.appendChild(b);});
    if(plan.children.length===1)plan.appendChild(el("p","muted","Lecțiile și exercițiile cursului sunt grupate în biblioteca pe module."));
  }
  function openCaseStudy(id){
    var c=(SEED.caseStudies || []).concat(SEED.exercitii || []).filter(function(x){return x.id===id;})[0];if(!c)return false;
    preserveParent129(sessionSnapshot());L=null;labCur=null;pyCur=null;ui.activeFlow="case";ui.activeCaseId=id;$("#nav").hidden=true;$("#lab").hidden=false;$("#lab-fb").hidden=true;
    deschideExercitiu(c);var body=$("#lab-body"),key="case:"+id;
    var label=el("label",null,"Planul tău de rezolvare · salvat local"),note=el("textarea");note.id="case-note";note.rows=7;note.value=(state.projects[key] || {}).note || "";
    note.oninput=function(){var old=state.projects[key] || {};state.projects[key]=Object.assign({},old,{note:note.value.slice(0,20000),at:Date.now()});save(true);};label.appendChild(note);body.insertBefore(label,body.children[2] || null);
    var reviewed=el("button","btn secondary","Am comparat planul cu criteriile");reviewed.onclick=function(){state.projects[key]=Object.assign({},state.projects[key] || {},{reviewed:true,reviewedAt:Date.now()});save(true);toast("Autoevaluare salvată; nu marchează automat competențele ca stăpânite.");};body.appendChild(reviewed);appendLearningSources(body,c.sources);save(true);return true;
  }
  function openRecap(id){
    var c=(SEED.recaps || []).filter(function(x){return x.id===id;})[0];if(!c)return false;
    preserveParent129(sessionSnapshot());L=null;labCur=null;pyCur=null;ui.activeFlow="recap";ui.activeRecapId=id;$("#nav").hidden=true;$("#lab").hidden=false;$("#lab-fb").hidden=true;
    var body=$("#lab-body");body.innerHTML="";$("#lab-cap").textContent="Recapitulare";body.appendChild(el("h2",null,c.titlu));
    libraryControls(body,"recap",id);
    c.sections.forEach(function(section){var part=sectiuneMd(body,section.title,section.text) || body;part.appendChild(el("p","rezumat",section.check));(section.cards || []).forEach(function(id){var card=cardById(id);if(!card)return;var b=el("button","btn mini ghost",card.q);b.onclick=function(){openRelatedExplanation("card",id);};part.appendChild(b);});});
    appendRelated(body,id,"Materiale din recapitulare");appendLearningSources(body,c.sources);studyOutline132(body);setFootLab("Închide",true,inchideLaborator);$("#lab-scroll").scrollTop=0;save(true);return true;
  }

  function appendLibraryAudit128(body){
    var audit=SEED.libraryAudit;if(!audit)return;
    var section=el("details","unit");section.id="library-audit128";section.appendChild(el("summary",null,"Auditul competențelor, manualelor și examenelor"));
    section.addEventListener("toggle",function(){if(!section.open || section.getAttribute("data-loaded"))return;section.setAttribute("data-loaded","true");
      section.appendChild(el("p","muted","Orfan înseamnă material care nu aparține unui lanț de competență, nu conținut inutil. Clasificarea este structurală; evaluarea semantică are limitele de mai jos."));
      section.appendChild(el("p",null,"Trasee absente: "+audit.missingPaths.length+" · prerechizite fără traseu: "+audit.prerequisitesWithoutPaths.length+" · carduri în afara lanțurilor: "+audit.orphans.cards.length));
      audit.domains.forEach(function(d){var box=el("p",null,d.name+": "+d.cards+" carduri · diagnostic "+d.levelPercent.debug.toFixed(1)+"% · proiectare "+d.levelPercent.design.toFixed(1)+"% · "+d.scenarios+" scenarii" );box.setAttribute("data-audit-domain128",d.id);section.appendChild(box);});
      audit.certifications.forEach(function(e){section.appendChild(el("p",null,e.code+": "+e.written+" scrise/adaptate individual · "+e.template+" din șablon ("+e.templatePercent.toFixed(1)+"%)"));});
      var coverage=SEED.objectiveCoverageAudit;if(coverage){section.appendChild(el("h3",null,"Acoperirea obiectivelor"));section.appendChild(el("p",null,coverage.total+" obiective: "+(coverage.states.direct || 0)+" directe · "+(coverage.states.partial || 0)+" parțiale · "+(coverage.states.missing || 0)+" lipsă. Direct cere lecție, aplicație și minimum trei întrebări scrise legate explicit."));
        (coverage.partial || []).forEach(function(o){var b=el("details","unit");b.appendChild(el("summary",null,o.id+" · "+o.text));b.appendChild(el("p",null,o.missing.join("; ")));section.appendChild(b);});}
      var inventory=SEED.handbookInventory;if(inventory){section.appendChild(el("h3",null,"Inventarul manualelor personale"));section.appendChild(el("p","muted","Trimiteri la capitole și pagini. Textul, codul și fișierele PDF nu sunt incluse în aplicație. Exercițiile aplicației sunt originale."));
        inventory.books.forEach(function(book){var box=el("details","unit");box.setAttribute("data-handbook-inventory",book.id);box.appendChild(el("summary",null,book.title+" · "+book.pdfPages+" pagini · "+book.chapters+" capitole"));
          inventory.materials.filter(function(m){return m.bookId===book.id;}).forEach(function(m){box.appendChild(el("p",null,m.subject+" · pagini "+m.pages.map(function(r){return r.join("–");}).join(", ")+" · "+m.status+". "+m.reason));});section.appendChild(box);});
        inventory.dialectNotes.forEach(function(note){section.appendChild(el("p","muted",note));});}
    });body.appendChild(section);
  }
  function openLibraryAudit(){
    var audit=SEED.auditOverview;if(!audit){toast("Raportul bibliotecii nu este disponibil.");return false;}
    labCur=null;pyCur=null;ui.activeFlow=null;
    var body=$("#lab-body");body.innerHTML="";$("#lab-cap").textContent="Bibliotecă și audit";
    $("#nav").hidden=true;$("#lab").hidden=false;$("#lab-fb").hidden=true;
    body.appendChild(el("h2",null,"Ce avem în aplicație"));ensureCareerSearch142();body.appendChild(el("p","muted",(SEED.lectii || []).length+" lecții în biblioteca actuală · "+((SEED.career142 || {}).lessons || []).length+" lecții noi în parcursul Junior–Senior. Inventarul pe etape arată distribuția tuturor materialelor locale."));
    if(SEED.connectionsAudit129){var links129=SEED.connectionsAudit129;body.appendChild(el("h3",null,"Căutare și legături între materiale"));body.appendChild(el("p",null,links129.pathsAfter+" trasee · "+links129.competenciesAfter+" competențe · "+(SEED.knowledgeGraph?SEED.knowledgeGraph.nodes.filter(function(n){return n.active!==false && n.searchable!==false;}).length:"…")+" materiale în căutarea comună."));body.appendChild(el("p","muted",links129.reviewedTermLinks.termsWithReviewedLinks+" termeni au legături de competență revizuite. Fiecare termen are verificarea definiției; "+links129.contextOnlyTermCount+" au deocamdată numai context de domeniu în graf, fără competență aplicată dedicată confirmată."));var search129=el("button","btn secondary","Caută și urmărește un concept");search129.onclick=function(){openSearch129();};body.appendChild(search129);}
    appendLibraryAudit128(body);
    body.appendChild(el("p","muted","Inventarul inclus în versiunea "+APP_VERSION+" · verificat la "+audit.date+". Cardurile personale se păstrează separat."));
    var grid=el("div","audit-grid");grid.id="audit-overview";
    [["cards","Carduri"],["terms","Termeni"],["scenarios","Scenarii"],["sql","Exerciții SQL"],["python","Exerciții Python"],["caseStudies","Studii de caz"]].forEach(function(pair){var box=el("div","audit-stat");box.setAttribute("data-audit-stat",pair[0]);box.appendChild(el("strong",null,audit.counts[pair[0]].toLocaleString("ro-RO")));box.appendChild(el("span",null,pair[1]));grid.appendChild(box);});body.appendChild(grid);
    body.appendChild(el("h3",null,"Volum și diversitate"));
    body.appendChild(el("p",null,audit.questionAudit.bankEntries+" intrări în bănci · "+audit.questionAudit.uniqueNormalizedPrompts+" enunțuri distincte după normalizarea textului. Materia comună este reutilizată între certificări; aceste numere nu sunt o măsură a pregătirii pentru examen."));
    body.appendChild(el("h3",null,"Structura certificărilor"));
    audit.certifications.forEach(function(row){var box=el("div","audit-entry");box.setAttribute("data-audit-exam",row.id);box.appendChild(el("h4",null,row.code));
      box.appendChild(el("p",null,row.dedicated+" carduri dedicate · "+row.associated+" asociate în total, inclusiv materia comună."));
      box.appendChild(el("p","muted",row.lessons+" lecții · "+row.exercises+" exerciții de curs · "+row.cases+" cazuri · "+row.forms+" teste complete locale"));
      box.appendChild(el("p","muted",row.questions+" întrebări în bancă, dintre care "+row.multiple+" cu răspuns multiplu."));
      var button=el("button","btn secondary","Deschide materia");button.onclick=function(){deschideExamen(row.id);};box.appendChild(button);body.appendChild(box);
    });
    if (audit.rubrics) {
      body.appendChild(el("h3",null,"Cele opt rubrici · înainte și după"));
      body.appendChild(el("p","muted","Note editoriale despre material și funcționalitate, fără echivalare cu pregătirea ta pentru examen."));
      audit.rubrics.forEach(function(row){var box=el("div","audit-entry");box.setAttribute("data-rubric-audit",row.id);
        box.appendChild(el("h4",null,row.name+" · "+row.rating+"/10"));
        box.appendChild(el("p","muted","Înainte: "+row.before));box.appendChild(el("p",null,"Acum: "+row.after));
        box.appendChild(el("p",null,row.why));box.appendChild(el("p","muted","Plan: "+row.planned));
        box.appendChild(el("p","muted","Limită: "+row.open));body.appendChild(box);
      });
    }
    body.appendChild(el("h3",null,"Limitele verificării"));
    audit.findings.forEach(function(row){var box=el("div","audit-entry");box.appendChild(el("span","audit-priority",row.priority));box.appendChild(el("h4",null,row.title));box.appendChild(el("p",null,row.action));box.appendChild(el("p","muted","Criteriu: "+row.accept));body.appendChild(box);});
    var fields=audit.fields;
    body.appendChild(el("h3",null,"Pași expliciți și verificare"));
    body.appendChild(el("p",null,fields.explicitPractice+" / "+audit.counts.cards+" carduri au o provocare explicită autorată; "+fields.linkedCards+" au legături directe de învățare. "+(audit.legacyReferencePractice || "Lipsa câmpului nu demonstrează singură că explicația este greșită.")));
    body.appendChild(el("p","muted",audit.reviewScope));
    body.appendChild(el("p","muted","Testele browser și verificarea structurii APK sunt separate de instalarea pe un dispozitiv. Nu s-a efectuat încă un test pe telefon sau emulator și nu s-au executat workspace-uri cloud."));
    setFootLab("Închide raportul",true,inchideLaborator);$("#lab-scroll").scrollTop=0;return true;
  }

  var discovery129=null,knowledgePool129=null;
  function ensureCareerSearch142(){
    var graph=SEED.knowledgeGraph;if(!graph || !graph.nodes || !SEED.career142)return;
    var seen={};graph.nodes.forEach(function(n){seen[n.key]=true;});graph.adjacency=graph.adjacency || {};
    function add(kind,m,title,domains,certs){var key=kind+":"+m.id;if(seen[key])return;graph.nodes.push({key:key,kind:kind,id:m.id,title:title,domains:domains || [],certs:certs || [],aliases:[],levels:[],snippet:m.obiectiv || m.deCe || "",active:true,searchable:true});graph.adjacency[key]=[];seen[key]=true;}
    (SEED.lectii || []).filter(function(l){return /^career142-/.test(l.id);}).forEach(function(l){add("lesson",l,l.titlu,l.careerDeck?[l.careerDeck]:[],l.examen?[l.examen]:[]);});
    (SEED.certificari || []).filter(function(e){return e.id==="dp203";}).forEach(function(e){add("certification",e,e.cod+" · "+e.scurt,["azure"],[e.id]);});
  }
  function preserveParent129(parent){
    if(!parent || ["study","lesson","case","project","reading","course","recap"].indexOf(parent.kind)<0)return;
    var old=state.returnSession;
    var same=old && old.kind===parent.kind && (old.id?old.id===parent.id:old.title===parent.title && old.index===parent.index && JSON.stringify(old.items || [])===JSON.stringify(parent.items || []));
    if(old && !same){state.returnStack.push(old);state.returnStack=state.returnStack.slice(-12);}
    state.returnSession=parent;
  }
  function prepareRelatedRun129(){preserveParent129(sessionSnapshot());save(true);ui.activeFlow=null;L=null;labCur=null;pyCur=null;closeModal();$("#study").hidden=true;$("#lesson").hidden=true;$("#lab").hidden=true;}
  function knowledgeMaterial129(kind,id){
    if(kind==="question")return questionById(id);
    if(!knowledgePool129){knowledgePool129={};
      [["card",SEED.cards],["term",SEED.terms],["path",SEED.curriculum],["competency",SEED.competencies],["scenario",SEED.scen.scenarios],["sql",SEED.lab.exercises],["python",SEED.pylab.exercises],["spark",(SEED.sparkLab || {}).exercises],["lesson",SEED.lectii],["exercise",SEED.exercitii],["case",SEED.caseStudies],["recap",SEED.recaps],["project",SEED.projects],["certification",SEED.certificari],["objective",SEED.objectives],["domainModule",SEED.domainModules],["domain",SEED.decks],["question",Object.values(SEED.questionArchive || {})],["question",SEED.questions]].forEach(function(pair){(pair[1] || []).forEach(function(m){knowledgePool129[pair[0]+":"+m.id]=m;});});
      Object.values(SEED.teste || {}).forEach(function(bank){bank.forEach(function(q){knowledgePool129["question:"+q.id]=q;});});
      (SEED.minitest || []).forEach(function(mt){knowledgePool129["miniTest:"+mt.id]=mt;});
      (SEED.examForms || []).concat(SEED.legacyExamForms || []).forEach(function(f){knowledgePool129["examForm:"+f.id]=f;});
    }
    if(kind==="card"){var custom=(state.custom || []).filter(function(c){return c.id===id;})[0];if(custom)return custom;}
    return knowledgePool129[kind+":"+id] || null;
  }
  function discovery129Api(){
    ensureCareerSearch142();
    if(!discovery129 && window.Discovery129 && SEED.knowledgeGraph)discovery129=window.Discovery129.create({seed:SEED,getState:function(){return state;},resolve:knowledgeMaterial129,levels:LEARNING_LEVELS,save:function(){save(true);},
      courseReference:function(host,m){if(courses145Api())courses145Api().reference(host,m);},
      startTerm:function(id){var term=termById(id);if(!term)return false;prepareRelatedRun129();state.discovery.returnKey="term:"+id;return startRun([{type:"intro",term:term},mcqItem(term)],{titlu:"Definiție și verificare · "+term.t});},
      startSkill:function(kind,id,level){var s=knowledgeMaterial129(kind,id);if(!s)return false;prepareRelatedRun129();state.discovery.returnKey=kind+":"+id;return startCurriculum(s.deck,level,kind==="competency"?id:"");},
      openNative:function(kind,id){var m=knowledgeMaterial129(kind,id);if(!m)return false;state.discovery.returnKey=kind+":"+id;
        if(["sql","python","spark","scenario","question"].indexOf(kind)>=0)return launchRelatedPractice(kind,id);
        if(kind==="term" || kind==="card" || kind==="recap")return openSaved({kind:kind,id:id,material:m,title:materialTitle(kind,m)});
        closeModal();
        if(kind==="lesson"){deschideLectie(m);return true;}
        if(kind==="miniTest"){porneateMiniTest(m);return true;}
        if(kind==="case" || kind==="exercise")return openCaseStudy(id);
        preserveParent129(sessionSnapshot());
        if(kind==="certification"){if(courses145Api() && courses145Api().start(id))return true;deschideExamen(id);return true;}
        if(kind==="examForm")return startSimulation(id);
        if(kind==="project"){openProject(m);return true;}
        return false;
      }});
    return discovery129;
  }

  // Pornire mai rapidă: graful căutării și arhiva de întrebări vin din seed-lazy162.js, după primul ecran.
  var lazy162={state:SEED.knowledgeGraph?2:0,cbs:[]};
  function lazyReady162(){return lazy162.state===2 || !!SEED.knowledgeGraph;}
  function loadLazy162(){
    if(lazy162.state)return;lazy162.state=1;
    var s=document.createElement("script");s.src="seed-lazy162.js";
    s.onerror=function(){lazy162.state=0;};
    document.body.appendChild(s);
  }
  window.__seedLazy162=function(){
    lazy162.state=2;questionIndex=null;knowledgePool129=null;
    var cbs=lazy162.cbs;lazy162.cbs=[];cbs.forEach(function(f){try{f();}catch(e){}});
  };
  function whenLazy162(cb){if(lazyReady162()){cb();return;}lazy162.cbs.push(cb);loadLazy162();}
  function scheduleLazy162(){
    if(lazyReady162())return;
    var go=function(){loadLazy162();};
    if(window.requestIdleCallback)requestIdleCallback(go,{timeout:1500});else setTimeout(go,600);
  }
  function discoveryEntry129(root,id){var b=el("button","btn secondary","Caută în toată aplicația");b.id=id;b.onclick=function(){openSearch129();};root.appendChild(b);}
  function appendKnowledgeLink129(host,id,kind){if(!lazyReady162()){var ph=el("div");ph.style.display="contents";host.appendChild(ph);whenLazy162(function(){if(ph.isConnected){var d=discovery129Api();if(d)d.appendLink(ph,id,kind);}});return;}var d=discovery129Api();if(d)d.appendLink(host,id,kind);}
  function openSearch129(query){if(!lazyReady162()){toast("Se pregătește căutarea…");whenLazy162(function(){openSearch129(query);});return true;}var d=discovery129Api();return d?d.openSearch(query):false;}
  function openKnowledge129(key){if(!lazyReady162()){whenLazy162(function(){openKnowledge129(key);});return true;}var d=discovery129Api();return d?d.openNode(key):false;}
  function returnToDiscovery129(){var key=state.discovery.returnKey;state.discovery.returnKey=null;save(true);return key?openKnowledge129(key):false;}

  function init() {
    loadState();
    applyTheme();
    bind();
    show("home");
    if (needsSetup()) openSetup();
    installOverlayAccessibility146();
    installFocusedEditable146();
    document.body.classList.remove("loading");
    scheduleLazy162();
  }

  var courses145Instance=null;
  function courses145Leave(){ui.activeFlow=null;$("#lab-scroll").onscroll=null;$("#lab").hidden=true;$("#nav").hidden=false;learnTab="paths";show("learn");save(true);}
  function courses145Api(){
    if(!window.Courses145 || !SEED.courses145)return null;
    if(!courses145Instance)courses145Instance=window.Courses145.create({
      state:function(){return state;},renderMd:renderMd,save:function(now){save(now!==false);},closeModal:closeModal,
      enter:function(){if(ui.activeFlow!=="course145")preserveParent129(sessionSnapshot());L=null;labCur=null;pyCur=null;ui.activeFlow="course145";closeModal();$("#study").hidden=true;$("#lesson").hidden=true;$("#lab").hidden=false;$("#nav").hidden=true;$("#lab-fb").hidden=true;$("#lab-scroll").onscroll=null;$("#lab-scroll").scrollTop=0;},
      footer:setFootLab,leave:courses145Leave,personal:function(host,id){libraryControls(host,"lesson",id);},
      gradedPractice:function(id){ui.activeFlow=null;$("#lab-scroll").onscroll=null;$("#lab").hidden=true;$("#nav").hidden=false;learnTab=id==="sql"?"sql":"py";show("learn");if(id==="spark"){var spark=$("#spark-practice-list");if(spark){var back=$(".course-return147"),summary=spark.querySelector("summary");if(back&&summary)summary.insertAdjacentElement("afterend",back);spark.open=true;spark.tabIndex=-1;spark.style.scrollMarginTop="calc(var(--sat, 0px) + 12px)";requestAnimationFrame(function(){spark.scrollIntoView({block:"start"});spark.focus({preventScroll:true});});}}},
      examPractice:function(id){ui.activeFlow=null;$("#lab").hidden=true;return startExamPractice(id,"short","");},
      run:async function(kind,code){if(kind==="python"){await PYLAB.load();var r=PYLAB.run("",code,"None");return {output:r.err?String(r.err):(r.log || "Cod executat fără afișare. Folosește print pentru rezultate. Nu este o probă automată de corectitudine."),error:!!r.err};}await loadSql();var db=new SQLjs.Database();try{return {output:JSON.stringify(db.exec(code),null,2),error:false};}finally{db.close();}}
    });return courses145Instance;
  }
  // expus pentru teste
  window.DECARDS = {
    get courses145(){return courses145Api();},
    get state() { return state; },
    set state(s) { state = migrate(s); },
    nextState: nextState, answer: answer, buildQueue: buildQueue, deckCounts: deckCounts,
    sched: sched, renderMd: renderMd, mdInline: mdInline, fmtIvl: fmtIvl, dayKey: dayKey, dayDiff: dayDiff, show: show,
    ico: ico, icoDeck: icoDeck,
    examene: examene, examenById: examenById, deschideExamen: deschideExamen,
    progresExamen: progresExamen, testExamen: testExamen,
    get ui() { return ui; }, showCard: showCard,
    imparteCard: imparteCard, blocuri: blocuri,
    startSession: startSession, reveal: reveal, rate: rate, save: save, flush: flush,
    defaultState: defaultState, migrate: migrate, interleave: interleave, isDarkNow: isDarkNow,
    learnUnits: learnUnits, buildLesson: buildLesson, fxRepairQueue159: fxRepairQueue159, fxSkillStatus159: fxSkillStatus159, startSkillSession159: startSkillSession159, startRepair159: startRepair159, openDrawer159: openDrawer159, fxRunCheck159: fxRunCheck159, fxRecord159: fxRecord159, fxAutonomy159: fxAutonomy159, fxSkills160: fxSkills160, openResources156: openResources156, resFor156: resFor156, resKind156: resKind156, setupDeckStats156: setupDeckStats156, tabMode156: tabMode156, setTabMode156: setTabMode156, practiceScopes156: practiceScopes156, practicePool2156: practicePool2156, practicePool156: practicePool156, startTermPractice156: startTermPractice156, openDictionary156: openDictionary156, dictEntries156: dictEntries156, dueTerms: dueTerms, termDue: termDue, startTermReview: startTermReview,
    checkRecall: checkRecall, maskTerm: maskTerm, termAnswers: termAnswers, revItem: revItem, recallItem: recallItem, termExercise: termExercise, markTerm: markTerm, startLesson: startLesson, openGlossary: openGlossary,
    endLesson: endLesson, learnProgress: learnProgress, termStrength: termStrength,
    distractors: distractors, get L() { return L; },
    buildDaily: buildDaily, startDaily: startDaily, rezumatZi: rezumatZi,
    termeniTinta: termeniTinta, needsSetup: needsSetup, openSetup: openSetup,
    setupNext: setupNext, nivel: nivel, obiectivZi: obiectivZi, xpAzi: xpAzi,
    dailyQuestRows: dailyQuestRows, syncDailyQuests: syncDailyQuests,
    startRun: startRun, loadSql: loadSql, labRun: labRun, labEvaluate:labEvaluate, labCheck: labCheck,
    resumeSession:resumeSession,sessionSnapshot:sessionSnapshot,toggleFavorite:toggleFavorite,
    savedMaterials:savedMaterials,weakItems:weakItems,practiceCandidates:practiceCandidates,openPractice:openPractice,
    get appVersion(){return APP_VERSION;},experience139:experience139,refreshToday139:refreshToday139,
    careerAudit142:careerAudit142,careerStage142:careerStage142,
    relatedResources:relatedResources,openRelatedExplanation:openRelatedExplanation,launchRelatedPractice:launchRelatedPractice,
    restoreRelatedParent:restoreRelatedParent,examDomainMastery:examDomainMastery,startDomainPractice:startDomainPractice,
    startSimulation:startSimulation,finishSimulation:finishSimulation,simulationCorrect:simulationCorrect,openCaseStudy:openCaseStudy,openRecap:openRecap,
    generateWeightedExam:generateWeightedExam,validGeneratedForm:validGeneratedForm,examForm:examForm,
    openSparkLab:openSparkLab,sparkById:sparkById,
    get simulation(){return simulationAttempt();},
    openLibraryAudit:openLibraryAudit,
    searchAll:function(q,f){var d=discovery129Api();return d?d.searchAll(q,f):[];},openSearch:openSearch129,
    openSearchResult:function(kind,id){var d=discovery129Api();return d?d.openResult(kind,id):false;},openKnowledgeNode:openKnowledge129,
    openCompetency:function(id){return openKnowledge129("competency:"+id);},knowledgeMaterial:knowledgeMaterial129,
    deschideLectie:deschideLectie,
    inspectBackup:inspectBackup130,
    openDomainMastery:openDomainMastery,
    startExamPractice: startExamPractice, startCurriculum: startCurriculum, openProject: openProject,
    diagnosticSql: diagnosticSql,
    labChapters: labChapters, labNext: labNext, labById: labById, openLab: openLab,
    competente: competente, scenModules: scenModules, scenNext: scenNext,
    scenById: scenById, scenIsDone: scenIsDone, startScenModule: startScenModule,
    scenOfMod: scenOfMod,
    closeLab: closeLab, labIsDone: labIsDone,
    pyAll: pyAll, pyById: pyById, pyChapters: pyChapters, pyNext: pyNext,
    pyIsDone: pyIsDone, pyMark: pyMark, openPyLab: openPyLab, closePyLab: closePyLab,
    inchideLaborator: inchideLaborator, exercitiuFinal: exercitiuFinal,
    promptLaborator: promptLaborator, copiazaText: copiazaText,
    asistentPornit: asistentPornit, deCeNu: deCeNu, difera: difera,
    get learnTab() { return learnTab; }, set learnTab(v) { learnTab = v; },
    consts: { MIN: MIN, DAY: DAY, AGAIN: AGAIN, HARD: HARD, GOOD: GOOD, EASY: EASY,
              LEARN_STEPS: LEARN_STEPS, DEF_EASE: DEF_EASE, MIN_EASE: MIN_EASE },
    reload: function () { loadState(); applyTheme(); show("home"); }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();

/* Motor Python pentru laboratoare, peste Brython.
 *
 * Contract: codul utilizatorului NU se interpolează în sursa Python. Se trece
 * ca dată prin window.__py_src, iar un program fix îl execută cu exec() într-un
 * namespace propriu. Așa nu există probleme de escaping, de indentare, și
 * erorile de sintaxă se prind corect (Brython NU le aruncă în JS, le scrie doar
 * în consolă, deci trebuie prinse din Python).
 *
 * Comparația rezultatelor se face pe un șir canonic produs în Python, nu pe
 * obiecte trecute în JS: un dict cu chei amestecate (str + int) nu se convertește
 * în obiect JS și JSON.stringify crapă pe structură circulară.
 */
(function () {
  "use strict";

  // brython.min.js stă lângă acest fișier. Calculăm calea relativ la py.js, nu
  // la pagina care îl încarcă, ca să poată fi folosit și de verificatorul din build.
  var BAZA = (function () {
    try {
      var s = document.currentScript && document.currentScript.src;
      if (s) return s.replace(/[^/]*$/, "");
    } catch (e) { /* pagina nu suportă currentScript */ }
    return "";
  })();

  var RUNNER = [
    "from browser import window as _w",
    "import _sys as _sys_budget",
    "",
    "def _ser(v):",
    "    if v is None: return 'N'",
    "    if v is True: return 'T'",
    "    if v is False: return 'F'",
    "    if isinstance(v, int): return 'n' + str(v)",
    "    if isinstance(v, float):",
    "        if v != v: return 'nNaN'",
    "        if v == float('inf'): return 'n+Inf'",
    "        if v == float('-inf'): return 'n-Inf'",
    "        if v == int(v): return 'n' + str(int(v))",
    "        return 'n' + repr(v)",
    "    if isinstance(v, str): return 's' + str(len(v)) + ':' + v",
    "    if isinstance(v, (list, tuple)):",
    "        return '[' + _pack([_ser(x) for x in v]) + ']'",
    "    if isinstance(v, (set, frozenset)):",
    "        return '{' + _pack(sorted([_ser(x) for x in v])) + '}'",
    "    if isinstance(v, dict):",
    "        return '<' + _pack(sorted([_pack([_ser(k), _ser(v[k])]) for k in v])) + '>'",
    "    raise TypeError('Rezultat nesuportat: folosește numere, șiruri și colecții de valori simple.')",
    "",
    "def _pack(parts):",
    "    return ''.join([str(len(p)) + ':' + p for p in parts])",
    "",
    "def _disp(v):",
    "    try: t = repr(v)",
    "    except Exception: t = str(v)",
    "    if len(t) > 500: t = t[:500] + ' …'",
    "    return t",
    "",
    "_linii = []",
    "_log_size = 0",
    "def _print(*a, **k):",
    "    global _log_size",
    "    line = k.get('sep', ' ').join([str(x) for x in a])",
    "    _log_size += len(line)",
    "    if len(_linii) >= 500 or _log_size > 20000:",
    "        raise RuntimeError('Limita de afișare a laboratorului a fost depășită.')",
    "    _linii.append(line)",
    "",
    "_ns = {'print': _print}",
    "_w.__py_ser = ''",
    "_w.__py_disp = ''",
    "_w.__py_err = ''",
    "_w.__py_faza = ''",
    "_w.__py_log = ''",
    "_budget_steps = 0",
    "_budget_start = _w.performance.now()",
    "class _BudgetLimit(BaseException):",
    "    pass",
    "def _budget_trace(frame, event, arg):",
    "    global _budget_steps",
    "    _budget_steps += 1",
    "    if _budget_steps > 300000 or (_budget_steps % 128 == 0 and _w.performance.now() - _budget_start > 3000):",
    "        _w.__py_budget_exceeded = True",
    "        _sys_budget.settrace(None)",
    "        raise _BudgetLimit('Limita de pași sau timp a laboratorului a fost depășită. Verifică buclele și condiția de oprire.')",
    "    return _budget_trace",
    "_sys_budget.settrace(_budget_trace)",
    "try:",
    "    exec(_w.__py_date, _ns)",
    "except Exception as _e:",
    "    _w.__py_err = 'datele exercițiului: ' + str(_e)",
    "    _w.__py_faza = 'date'",
    "else:",
    "    try:",
    "        exec(_w.__py_src, _ns)",
    "    except _BudgetLimit as _e:",
    "        _w.__py_err = str(_e)",
    "        _w.__py_faza = 'limita'",
    "    except SyntaxError as _e:",
    "        _w.__py_err = 'Eroare de sintaxă: ' + str(_e)",
    "        _w.__py_faza = 'sintaxa'",
    "    except Exception as _e:",
    "        _w.__py_err = _e.__class__.__name__ + ': ' + str(_e)",
    "        _w.__py_faza = 'cod'",
    "    else:",
    "        try:",
    "            _v = eval(_w.__py_expr, _ns)",
    "            _w.__py_ser = _ser(_v)",
    "            _w.__py_disp = _disp(_v)",
    "        except _BudgetLimit as _e:",
    "            _w.__py_err = str(_e)",
    "            _w.__py_faza = 'limita'",
    "        except Exception as _e:",
    "            _w.__py_err = _e.__class__.__name__ + ': ' + str(_e)",
    "            _w.__py_faza = 'rulare'",
    "_sys_budget.settrace(None)",
    "_w.__py_log = '\\n'.join(_linii)",
    ""
  ].join("\n");

  var gata = false, prom = null, eroareIncarcare = null;

  function s(v) { return v === undefined || v === null ? "" : String(v); }

  /** Încarcă Brython o singură dată. Rezolvă abia după ce o rulare de probă trece. */
  function load() {
    if (gata) return Promise.resolve(true);
    if (prom) return prom;
    prom = new Promise(function (res, rej) {
      var t = document.createElement("script");
      t.src = BAZA + "brython.min.js";
      t.onload = function () {
        try {
          if (typeof window.brython !== "function") throw new Error("brython() lipsește");
          // pythonpath gol: fără el, Brython încearcă să aducă stdlib prin XHR,
          // iar din file:// cererea e refuzată.
          window.brython({ debug: 0, pythonpath: [] });
          var p = run("", "def _proba():\n    return 1 + 1", "_proba()");
          if (p.err || p.ser !== "n2") throw new Error(p.err || "proba a dat " + p.ser);
          gata = true;
          res(true);
        } catch (e) {
          eroareIncarcare = e;
          rej(e);
        }
      };
      t.onerror = function () {
        eroareIncarcare = new Error("motorul Python nu a putut fi încărcat");
        rej(eroareIncarcare);
      };
      document.head.appendChild(t);
    });
    return prom;
  }

  /** O rulare = un namespace nou, deci exercițiile și testele nu se influențează. */
  function run(date, src, expr) {
    if (typeof window.__BRYTHON__ === "undefined") {
      return { err: "Motorul Python nu e pregătit.", faza: "motor", log: "", ser: "", disp: "" };
    }
    window.__py_date = s(date);
    window.__py_src = s(src);
    window.__py_expr = s(expr);
    window.__py_ser = ""; window.__py_disp = ""; window.__py_err = "";
    window.__py_faza = ""; window.__py_log = ""; window.__py_budget_exceeded=false;
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    try {
      window.__BRYTHON__.runPythonSource(RUNNER, {
        __name__: "lab" + Math.random().toString(36).slice(2)
      });
    } catch (e) {
      if(window.__py_budget_exceeded)return {err:"Limita de pași sau timp a laboratorului a fost depășită. Verifică buclele și condiția de oprire.",faza:"limita",log:"",ser:"",disp:""};
      return {
        err: "Motorul Python a cedat: " + s(e && e.message || e),
        faza: "motor", log: "", ser: "", disp: ""
      };
    } finally {
      // Pinned Brython runtime: also clear the global trace if a JS exception
      // bypasses the Python error handlers. This is a step guard, not isolation
      // from every blocking JS/native operation exposed by the interpreter.
      window.__BRYTHON__.tracefunc=window.__BRYTHON__.builtins.None;
    }
    var t1 = (window.performance && performance.now) ? performance.now() : Date.now();
    return {
      ser: s(window.__py_ser),
      disp: s(window.__py_disp),
      log: s(window.__py_log),
      err: s(window.__py_err),
      faza: s(window.__py_faza),
      ms: Math.round(t1 - t0)
    };
  }

  /** Valoarea așteptată e tot o expresie Python, trecută prin același serializator. */
  function asteptat(date, expr) {
    return run(date, "", expr);
  }

  /**
   * Rulează toate testele unui exercițiu pe codul dat.
   * Întoarce { ok, teste: [{nume, ok, motiv, obtinut, log}], err, faza }.
   * O eroare de sintaxă sau la nivelul codului oprește totul: nu are rost să
   * raportăm opt teste picate pentru o paranteză lipsă.
   */
  function verifica(ex, src) {
    var rez = { ok: false, teste: [], err: "", faza: "", log: "" };
    var i, t, r, a;
    for (i = 0; i < ex.teste.length; i++) {
      t = ex.teste[i];
      r = run(ex.date, src, t.expr);
      if (r.faza === "sintaxa" || r.faza === "cod" || r.faza === "motor" || r.faza === "date" || r.faza === "limita") {
        rez.err = r.err; rez.faza = r.faza; rez.log = r.log;
        return rez;
      }
      if (!rez.log && r.log) rez.log = r.log;
      if (r.err) {
        rez.teste.push({ nume: t.nume, ok: false, motiv: r.err, obtinut: "", log: r.log });
        continue;
      }
      a = asteptat(ex.date, t.astept);
      if (a.err) {
        rez.teste.push({
          nume: t.nume, ok: false,
          motiv: "test defect: " + a.err, obtinut: r.disp, log: r.log
        });
        continue;
      }
      var equal = r.ser === a.ser;
      if (!equal && t.compare === "float" && /^n[-+0-9.]/.test(r.ser) && /^n[-+0-9.]/.test(a.ser)) {
        var rv=Number(r.ser.slice(1)),av=Number(a.ser.slice(1)),at=Number(t.absTol || 0),rt=Number(t.relTol || 0);
        equal=isFinite(rv)&&isFinite(av)&&isFinite(at)&&isFinite(rt)&&at>=0&&rt>=0&&Math.abs(rv-av)<=Math.max(at,rt*Math.max(Math.abs(rv),Math.abs(av)));
      }
      if (equal) {
        rez.teste.push({ nume: t.nume, ok: true, motiv: "", obtinut: r.disp, log: r.log });
      } else {
        rez.teste.push({
          nume: t.nume, ok: false,
          motiv: "s-a obținut " + r.disp + ", se aștepta " + a.disp,
          obtinut: r.disp, log: r.log
        });
      }
    }
    rez.ok = rez.teste.length > 0 && rez.teste.every(function (x) { return x.ok; });
    return rez;
  }

  /**
   * Diagnostic pe COMPORTAMENT, nu pe textul codului.
   *
   * O analiză care caută tipare în sursă se înșală la prima redenumire de
   * variabilă sau schimbare de formatare, și poate acuza pe nedrept. Aici
   * rulăm codul tău pe o sondă — o expresie aleasă ca să deosebească o greșeală
   * anume de toate celelalte — și comparăm cu semnătura acelei greșeli.
   *
   * Dacă rezultatul se potrivește, greșeala e **demonstrată**, nu bănuită.
   *
   * Fiecare sondă are forma { expr, semnatura, mesaj }: `expr` se evaluează în
   * contextul exercițiului, iar `semnatura` e o expresie Python care produce
   * valoarea caracteristică greșelii.
   */
  function diagnostic(ex, src) {
    var gasite = [];
    var sonde = ex.diagnostic || [];
    for (var i = 0; i < sonde.length; i++) {
      var s = sonde[i];
      var date = s.date || ex.date;
      var r = run(date, src, s.expr);
      // o eroare la sondă nu e un simptom: codul poate fi pur și simplu neterminat
      if (r.err || !r.ser) continue;
      var sem = run(date, "", s.semnatura);
      if (sem.err || !sem.ser) continue;
      if (r.ser === sem.ser) gasite.push({ mesaj: s.mesaj, obtinut: r.disp });
    }
    return gasite;
  }

  window.PYLAB = {
    load: load,
    run: run,
    verifica: verifica,
    diagnostic: diagnostic,
    asteptat: asteptat,
    gata: function () { return gata; },
    eroare: function () { return eroareIncarcare; }
  };
})();

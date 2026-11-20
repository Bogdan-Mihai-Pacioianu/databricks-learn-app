# Rulează laboratoarele Python ale aplicației cu CPython: soluția trebuie să treacă toate testele,
# iar codul de pornire (starter) nu trebuie să le treacă pe toate (altfel testele nu verifică nimic).
#   python3 tools/qa_python_labs.py app/assets [raport.md]
import json, multiprocessing as mp, os, sys, traceback

assets = sys.argv[1]
src = open(os.path.join(assets, "cards.js"), encoding="utf-8").read()
SEED = json.loads(src[src.index("=") + 1:].strip().rstrip(";"))
exercises = SEED["pylab"]["exercises"]


def run(code_parts, tests, q):
    try:
        env = {"__name__": "__lab__"}
        for c in code_parts:
            if c:
                exec(compile(c, "<lab>", "exec"), env)
        res = []
        for t in tests:
            try:
                got = eval(t["expr"], env)
                want = eval(t["astept"], env)
                res.append([t["nume"], got == want, "" if got == want else ("primit %r, așteptat %r" % (got, want))[:200]])
            except Exception as e:
                res.append([t["nume"], False, "%s: %s" % (type(e).__name__, str(e)[:150])])
        q.put(("ok", res))
    except Exception as e:
        q.put(("err", "%s: %s" % (type(e).__name__, str(e)[:200])))


def check(parts, tests, timeout=20):
    q = mp.Queue()
    p = mp.Process(target=run, args=(parts, tests, q))
    p.start(); p.join(timeout)
    if p.is_alive():
        p.terminate(); return ("err", "depășire de timp (%ds)" % timeout)
    return q.get() if not q.empty() else ("err", "procesul s-a oprit fără rezultat")


if __name__ == "__main__":
    errors, warns, lines = [], [], []
    for ex in exercises:
        tests = ex.get("teste") or []
        if not tests:
            warns.append("%s: fără teste" % ex["id"]); continue
        status, res = check([ex.get("date"), ex.get("solution")], tests)
        if status == "err":
            errors.append("%s · soluția nu rulează: %s" % (ex["id"], res)); continue
        failed = [r for r in res if not r[1]]
        if failed:
            errors.append("%s · soluția pică %d din %d teste: %s" % (ex["id"], len(failed), len(res), "; ".join("%s (%s)" % (f[0], f[2]) for f in failed[:2])))
        if ex.get("starter"):
            st, sres = check([ex.get("date"), ex.get("starter")], tests)
            if st == "ok" and all(r[1] for r in sres):
                warns.append("%s · codul de pornire trece deja toate testele" % ex["id"])
    ok = len(exercises) - len(set(e.split(" ")[0] for e in errors))
    print("laboratoare Python: %d · soluții care trec toate testele: %d · erori: %d · avertismente: %d" % (len(exercises), ok, len(errors), len(warns)))
    for e in errors: print("  EROARE", e)
    for w in warns: print("  avertisment", w)
    if len(sys.argv) > 2:
        with open(sys.argv[2], "w", encoding="utf-8") as f:
            f.write("# Laboratoarele Python\n\nGenerat de `tools/qa_python_labs.py`. Fiecare soluție rulează cu CPython pe datele laboratorului și trebuie să treacă toate testele.\n\n")
            f.write("| | Număr |\n|---|---:|\n| Laboratoare | %d |\n| Soluții care trec toate testele | %d |\n| Erori | %d |\n| Avertismente | %d |\n\n" % (len(exercises), ok, len(errors), len(warns)))
            for title, lst in (("Erori", errors), ("Avertismente", warns)):
                f.write("## %s\n\n" % title + ("".join("- %s\n" % x for x in lst) or "Niciuna.\n") + "\n")
    sys.exit(1 if errors else 0)

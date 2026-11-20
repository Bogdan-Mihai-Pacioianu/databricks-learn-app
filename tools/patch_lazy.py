# Pornire mai rapidă (1.52.0). Graful căutării comune și arhiva de întrebări vechi stau în
# seed-lazy162.js (vezi tools/split_seed.py) și se încarcă după primul ecran:
#   - app.js pornește încărcarea după init; căutarea, legăturile „Vezi și” și Statistici așteaptă graful;
#   - courses145-data.js aplică corecturile lui pe graf și când acesta sosește mai târziu;
#   - termById folosește un index în loc să parcurgă toată lista la fiecare apel.
# Folosire: python3 tools/patch_lazy.py app/assets
import os, sys

assets = sys.argv[1]

def patch(name, pairs):
    p = os.path.join(assets, name)
    s = open(p, encoding="utf-8", newline="").read()
    if "lazy162" in s or "graph145" in s:
        print(name, "e deja modificat"); return
    crlf = "\r\n" in s
    for old, new in pairs:
        if crlf:
            old, new = old.replace("\n", "\r\n"), new.replace("\n", "\r\n")
        if s.count(old) != 1:
            sys.exit("%s: textul de înlocuit apare de %d ori: %s" % (name, s.count(old), old[:80]))
        s = s.replace(old, new)
    open(p, "w", encoding="utf-8", newline="").write(s)
    print(name, "modificat")

# courses145-data.js: blocul care completează graful devine funcție, rulată acum și la sosirea grafului.
p = os.path.join(assets, "courses145-data.js")
s = open(p, encoding="utf-8", newline="").read()
if "graph145" not in s:
    i = s.index("var graph=S.knowledgeGraph;if(graph){")
    k = s.index("if(graph){", i) + len("if(graph)")
    d = 0
    while True:
        d += {"{": 1, "}": -1}.get(s[k], 0)
        if d == 0: break
        k += 1
    block = s[i:k + 1]
    s = s[:i] + ("function graph145(S){" + block + "}graph145(S);"
                 "(window.__seedLazyHooks162=window.__seedLazyHooks162||[]).push(graph145);") + s[k + 1:]
    open(p, "w", encoding="utf-8", newline="").write(s)
    print("courses145-data.js modificat")

LOADER = '''
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
'''

patch("app.js", [
    ("  function termById(id) {\n    return allTerms().filter(function (t) { return t.id === id; })[0] || null;\n  }",
     "  var termIndex162=null,termIndexSrc162=null,termIndexLen162=-1;\n"
     "  function termById(id) {\n"
     "    var all=allTerms();\n"
     "    if(all!==termIndexSrc162 || all.length!==termIndexLen162){termIndex162=Object.create(null);all.forEach(function(t){if(!(t.id in termIndex162))termIndex162[t.id]=t;});termIndexSrc162=all;termIndexLen162=all.length;}\n"
     "    var t=termIndex162[id];\n"
     "    if(t && t.id===id)return t;\n"
     "    termIndexSrc162=null;return all.filter(function (x) { return x.id === id; })[0] || null;\n"
     "  }"),
    ("+SEED.knowledgeGraph.nodes.filter(function(n){return n.active!==false && n.searchable!==false;}).length+",
     "+(SEED.knowledgeGraph?SEED.knowledgeGraph.nodes.filter(function(n){return n.active!==false && n.searchable!==false;}).length:\"…\")+"),
    ("  function discoveryEntry129(root,id){if(!SEED.knowledgeGraph)return;",
     LOADER + "  function discoveryEntry129(root,id){"),
    ("  function appendKnowledgeLink129(host,id,kind){var d=discovery129Api();if(d)d.appendLink(host,id,kind);}",
     "  function appendKnowledgeLink129(host,id,kind){if(!lazyReady162()){var ph=el(\"div\");ph.style.display=\"contents\";host.appendChild(ph);"
     "whenLazy162(function(){if(ph.isConnected){var d=discovery129Api();if(d)d.appendLink(ph,id,kind);}});return;}var d=discovery129Api();if(d)d.appendLink(host,id,kind);}"),
    ("  function openSearch129(query){var d=discovery129Api();return d?d.openSearch(query):false;}",
     "  function openSearch129(query){if(!lazyReady162()){toast(\"Se pregătește căutarea…\");whenLazy162(function(){openSearch129(query);});return true;}var d=discovery129Api();return d?d.openSearch(query):false;}"),
    ("  function openKnowledge129(key){var d=discovery129Api();return d?d.openNode(key):false;}",
     "  function openKnowledge129(key){if(!lazyReady162()){whenLazy162(function(){openKnowledge129(key);});return true;}var d=discovery129Api();return d?d.openNode(key):false;}"),
    ("    installFocusedEditable146();\n    document.body.classList.remove(\"loading\");\n  }",
     "    installFocusedEditable146();\n    document.body.classList.remove(\"loading\");\n    scheduleLazy162();\n  }"),
])

# Împarte conținutul de bază (content/seed/cards.js, 31 MB) în două fișiere din app/assets:
#   cards.js          ce trebuie la pornire (carduri, termeni, întrebări, lecții, laboratoare…);
#   seed-lazy162.js   graful căutării comune și arhiva de întrebări vechi, încărcate după primul ecran.
# Folosire: python3 tools/split_seed.py content/seed/cards.js app/assets
import json, os, sys

src, assets = sys.argv[1:3]
text = open(src, encoding="utf-8").read()
S = json.loads(text[text.index("=") + 1:].strip().rstrip(";"))
LAZY = ["knowledgeGraph", "questionArchive"]
lazy = {k: S.pop(k) for k in LAZY if k in S}

def dump(o):
    return json.dumps(o, ensure_ascii=False, separators=(",", ":"))

open(os.path.join(assets, "cards.js"), "w", encoding="utf-8").write("window.SEED = " + dump(S) + ";")
# La execuție, completează SEED și anunță aplicația (window.__seedLazy162, definit în app.js).
open(os.path.join(assets, "seed-lazy162.js"), "w", encoding="utf-8").write(
    "/* Generat de tools/split_seed.py. Nu edita manual. */\n(function(){var L=" + dump(lazy) +
    ";var S=window.SEED;if(!S)return;Object.keys(L).forEach(function(k){S[k]=L[k];});"
    "(window.__seedLazyHooks162||[]).forEach(function(f){try{f(S);}catch(e){}});"
    "if(window.__seedLazy162)window.__seedLazy162();})();\n")
for f in ("cards.js", "seed-lazy162.js"):
    print(f, round(os.path.getsize(os.path.join(assets, f)) / 1e6, 2), "MB")

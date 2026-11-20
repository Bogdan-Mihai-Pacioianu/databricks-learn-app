# Încarcă app/assets/enrich157.js (termeni, carduri și întrebări noi) imediat după cards.js.
#   python tools/patch_enrich.py app/assets
import os, sys
hp = os.path.join(sys.argv[1], "index.html")
html = open(hp, encoding="utf-8", newline="").read()
if "enrich157.js" in html:
    sys.exit("Fișele noi sunt deja încărcate.")
nl = "\r\n" if "\r\n" in html else "\n"
tag = '<script src="cards.js"></script>'
if html.count(tag) != 1:
    sys.exit("Nu găsesc încărcarea cards.js.")
html = html.replace(tag, tag + nl + '<script src="enrich157.js"></script>')
open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

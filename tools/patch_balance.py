# Încarcă app/assets/balance161.js (reechilibrarea și corecturile din Etapa D) imediat după cards.js.
#   python tools/patch_balance.py app/assets
import os, sys
hp = os.path.join(sys.argv[1], "index.html")
html = open(hp, encoding="utf-8", newline="").read()
if "balance161.js" in html:
    sys.exit("Etapa D este deja încărcată.")
nl = "\r\n" if "\r\n" in html else "\n"
tag = '<script src="cards.js"></script>'
if html.count(tag) != 1:
    sys.exit("Nu găsesc încărcarea cards.js.")
html = html.replace(tag, tag + nl + '<script src="balance161.js"></script>')
open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

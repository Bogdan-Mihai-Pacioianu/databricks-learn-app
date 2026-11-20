# Corecturi de accesibilitate găsite de tools/qa_app.js.
#   python tools/patch_a11y.py app/assets
import os, sys
hp = os.path.join(sys.argv[1], "index.html")
html = open(hp, encoding="utf-8", newline="").read()
fixes = [('<input id="set-new" type="number"', '<input id="set-new" aria-label="Carduri noi pe zi" type="number"'),
         ('<input id="set-rev" type="number"', '<input id="set-rev" aria-label="Repetări pe zi" type="number"')]
for old, new in fixes:
    if new in html: continue
    if html.count(old) != 1: sys.exit("Nu găsesc: " + old)
    html = html.replace(old, new)
# Linkurile care stau singure pe rând (surse, documentație) devin ținte de atingere de cel puțin 36 px.
css = "<style>p > a:only-child,.career-resource142 > a{display:inline-block;min-height:36px;padding:8px 0;line-height:1.3}</style>"
if css not in html:
    if html.count("</head>") != 1: sys.exit("Nu găsesc </head>.")
    html = html.replace("</head>", css + "\n</head>")
open(hp, "w", encoding="utf-8", newline="").write(html)
print("ok")

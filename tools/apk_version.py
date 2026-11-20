# Citește versiunea din manifestul binar (AXML):
#   python3 tools/apk_version.py app/AndroidManifest.xml        → versionName (1.52.0)
#   python3 tools/apk_version.py app/AndroidManifest.xml code   → versionCode
import re, struct, sys

d = open(sys.argv[1], "rb").read()
# Pool-ul de șiruri începe la octetul 8: tip, antet, mărime, nr. șiruri, nr. stiluri, flags, start șiruri.
typ, hsz, size, count, styles, flags, start = struct.unpack("<HHIIIII", d[8:32])
utf8 = flags & 0x100
offs = struct.unpack("<%dI" % count, d[36:36 + 4 * count])
strings = []
for o in offs:
    p = 8 + start + o
    if utf8:
        n = d[p + 1] if d[p] < 0x80 else ((d[p] & 0x7F) << 8 | d[p + 1])  # simplificat: șirurile versiunii sunt scurte
        p += 2 if d[p] < 0x80 else 3
        strings.append(d[p:p + n].decode("utf-8", "replace"))
    else:
        n = struct.unpack("<H", d[p:p + 2])[0]
        strings.append(d[p + 2:p + 2 + 2 * n].decode("utf-16-le", "replace"))
# Elementele XML (tip 0x0102): atributul cu numele „versionName” are valoarea brută în pool.
want = {strings.index(n): n for n in ("versionName", "versionCode") if n in strings}
found, p = {}, 8 + size
while p < len(d):
    ctype, chsz, csize = struct.unpack("<HHI", d[p:p + 8])
    if ctype == 0x0102:
        acount = struct.unpack("<H", d[p + 28:p + 30])[0]
        for a in range(acount):
            q = p + 36 + 20 * a
            ns, name, raw = struct.unpack("<III", d[q:q + 12])
            dtype, data = d[q + 15], struct.unpack("<I", d[q + 16:q + 20])[0]
            if name in want:
                found[want[name]] = strings[raw] if raw != 0xFFFFFFFF else data
    p += csize
if "versionName" not in found:
    sys.exit("nu găsesc versionName")
print(found["versionName"] if sys.argv[2:] != ["code"] else found["versionCode"])

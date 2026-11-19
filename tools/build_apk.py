# Reîmpachetează APK-ul cu asset-urile din director (modificate sau noi), aliniază intrările necomprimate
# și semnează cu APK Signature Scheme v2 (minSdk 24, deci v1 nu e necesar).
import hashlib, os, struct, sys, zipfile, datetime
from cryptography import x509
from cryptography.x509.oid import NameOID
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding

src_apk, assets_dir, out_apk, key_dir = sys.argv[1:5]

# ---- 1. zip nou, cu aceeași ordine și aceeași compresie ----
unsigned = out_apk + ".unsigned"
with zipfile.ZipFile(src_apk) as zin, open(unsigned, "wb") as f:
    zout = zipfile.ZipFile(f, "w")
    present = set()
    for info in zin.infolist():
        if info.filename.startswith("META-INF/"):
            continue
        data = zin.read(info.filename)
        present.add(info.filename)
        local = os.path.join(assets_dir, info.filename[len("assets/"):]) if info.filename.startswith("assets/") else None
        # Manifestul binar (versiune) se ia din directorul părinte al assets, dacă există.
        if info.filename == "AndroidManifest.xml":
            local = os.path.join(os.path.dirname(os.path.abspath(assets_dir)), "AndroidManifest.xml")
        if local and os.path.exists(local):
            data = open(local, "rb").read()
        zi = zipfile.ZipInfo(info.filename, date_time=info.date_time)
        zi.compress_type = info.compress_type
        zi.external_attr = info.external_attr
        zi.create_system = info.create_system
        if zi.compress_type == zipfile.ZIP_STORED:
            # datele încep la offset + 30 + nume + extra; aliniere la 4 octeți (4096 pentru .so)
            align = 4096 if info.filename.endswith(".so") else 4
            hdr = f.tell() + 30 + len(zi.filename.encode())
            pad = (-hdr) % align
            zi.extra = b"\x00" * pad
        zout.writestr(zi, data)
    # Fișierele noi din assets (de exemplu dictionary156.js) se adaugă comprimate.
    for root, _, files in os.walk(assets_dir):
        for name in sorted(files):
            rel = "assets/" + os.path.relpath(os.path.join(root, name), assets_dir).replace(os.sep, "/")
            if rel not in present:
                zout.write(os.path.join(root, name), rel, compress_type=zipfile.ZIP_DEFLATED)
                print("adăugat:", rel)
    zout.close()

apk = open(unsigned, "rb").read()
eocd = apk.rfind(b"PK\x05\x06")
cd_size, cd_off = struct.unpack("<II", apk[eocd + 12: eocd + 20])
contents, cd, eocd_bytes = apk[:cd_off], apk[cd_off:eocd], apk[eocd:]

# ---- 2. cheie de semnare (refolosită dacă există) ----
os.makedirs(key_dir, exist_ok=True)
kp, cp = os.path.join(key_dir, "key.pem"), os.path.join(key_dir, "cert.pem")
if os.path.exists(kp):
    key = serialization.load_pem_private_key(open(kp, "rb").read(), None)
    cert = x509.load_pem_x509_certificate(open(cp, "rb").read())
else:
    key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    name = x509.Name([x509.NameAttribute(NameOID.COMMON_NAME, "DataEng Learn test build")])
    now = datetime.datetime.now(datetime.timezone.utc)
    cert = (x509.CertificateBuilder().subject_name(name).issuer_name(name).public_key(key.public_key())
            .serial_number(x509.random_serial_number()).not_valid_before(now - datetime.timedelta(days=1))
            .not_valid_after(now + datetime.timedelta(days=365 * 30)).sign(key, hashes.SHA256()))
    open(kp, "wb").write(key.private_bytes(serialization.Encoding.PEM, serialization.PrivateFormat.PKCS8, serialization.NoEncryption()))
    open(cp, "wb").write(cert.public_bytes(serialization.Encoding.PEM))

# ---- 3. digest v2 (bucăți de 1 MiB) ----
def chunks(b):
    for i in range(0, len(b), 1 << 20):
        yield b[i:i + (1 << 20)]
parts = []
for sec in (contents, cd, eocd_bytes):
    for c in chunks(sec):
        parts.append(hashlib.sha256(b"\xa5" + struct.pack("<I", len(c)) + c).digest())
top = hashlib.sha256(b"\x5a" + struct.pack("<I", len(parts)) + b"".join(parts)).digest()

def lp(b): return struct.pack("<I", len(b)) + b
ALG = 0x0103  # RSASSA-PKCS1-v1_5 cu SHA-256
digests = lp(lp(struct.pack("<I", ALG) + lp(top)))
certs = lp(lp(cert.public_bytes(serialization.Encoding.DER)))
signed_data = digests + certs + lp(b"")
sig = key.sign(signed_data, padding.PKCS1v15(), hashes.SHA256())
pub = key.public_key().public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)
signer = lp(signed_data) + lp(lp(struct.pack("<I", ALG) + lp(sig))) + lp(pub)
v2 = lp(lp(signer))

pair = struct.pack("<Q", 4 + len(v2)) + struct.pack("<I", 0x7109871A) + v2
size = len(pair) + 8 + 16
block = struct.pack("<Q", size) + pair + struct.pack("<Q", size) + b"APK Sig Block 42"

new_eocd = eocd_bytes[:16] + struct.pack("<I", cd_off + len(block)) + eocd_bytes[20:]
open(out_apk, "wb").write(contents + block + cd + new_eocd)
os.remove(unsigned)
print("semnat:", out_apk, os.path.getsize(out_apk), "octeți")

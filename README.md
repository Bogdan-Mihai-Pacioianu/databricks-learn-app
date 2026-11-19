# databricks-learn-app

DataEng Learn: o aplicație Android offline, în limba română, pentru învățat Data Engineering (Spark, Delta Lake, Databricks, SQL, streaming și altele). Interfața este HTML/JS, rulată într-un WebView.

## Conținut

- `app/assets/`: codul aplicației (versiunea 1.48.0), cu îmbunătățirile pentru învățarea termenilor deja aplicate.
- `app/assets/dictionary156.js`: inventarul dicționarului (generat).
- `tools/build_dictionary.js`: generează inventarul: unde apare fiecare termen și ce termeni din conținut nu au fișă.
- `tools/patch_dictionary.py`: adaugă ecranul Dicționar în `app.js` și `index.html`. Se aplică după `patch_terms.py`.
- `tools/test_dictionary.js`: test Playwright pentru dicționar.
- `docs/inventar-termeni.md`: raportul inventarului, cu termenii fără fișă.
- `tools/patch_terms.py`: aplică aceleași îmbunătățiri peste alt `app.js`, de exemplu cel din sursa 1.54. Scriptul se oprește dacă o bucată de cod nu se potrivește.
- `patches/termeni-app.js.diff`: diferențele față de `app.js` 1.48.0, ca referință.
- `tools/build_apk.py`: reîmpachetează APK-ul cu asset-urile modificate și îl semnează cu APK Signature Scheme v2. Cheia se generează local în `signing/`, care nu se publică.
- `tools/test_terms.js`: test Playwright pentru exercițiile noi.
- `dist/DataEng-Learn-1.48.0-dictionar.apk`: build de test, semnat cu o cheie de test.

## Dicționarul termenilor

În tabul Termeni, butonul **Dicționar A–Z · toți termenii** deschide un dicționar cu 1716 intrări:
- **1358 de termeni cu fișă**, ordonați alfabetic, cu bară de litere A–Z;
- **208 denumiri alternative și acronime** ca trimiteri (de exemplu WAL → Write-ahead log);
- **150 de termeni folosiți în conținut, dar fără fișă**, de exemplu S3, DataFrame, BigQuery, SCD, IAM.

Pentru fiecare termen vezi:
- definiția și detaliile;
- stadiul: nou, în curs, de repetat sau știut;
- **unde apare**: câte carduri, lecții, exerciții, studii de caz, întrebări și alte fișe îl folosesc, cu butoane care deschid direct primele materiale;
- butonul **Exersează termenul**.

Filtrele: tip de intrare, domeniu și stadiu. Secțiunea **Inventar pe domenii** arată, pentru fiecare domeniu, câți termeni are, câți știi, câți sunt în curs și câți sunt folosiți în materiale.

Inventarul se regenerează cu:

```
node tools/build_dictionary.js app/assets
```

## Ce s-a schimbat la învățarea termenilor

- **Repetiție spațiată:** după un răspuns corect, termenul revine după 1, 3, 7, 16 și 35 de zile. După o greșeală revine după 10 minute. Forța unui termen crește cel mult o dată pe zi.
- **Exerciții potrivite nivelului:**
  - termen nou: alegi definiția potrivită pentru termen;
  - termen început: primești definiția și alegi termenul (numele e ascuns din definiție);
  - termen bine cunoscut: îl scrii din memorie. Sunt acceptate sinonimele, acronimul și o mică greșeală de scriere. Există buton de indiciu.
- **Butonul „Repetă termenii scadenți”** în tabul Termeni.
- **Lecțiile se încheie cu o rundă inversă** pentru termenii noi.
- **Feedback mai bun la greșeli:** explicația variantei alese și exemplul termenului.

## Instalarea APK-ului de test

APK-ul de test e semnat cu altă cheie decât aplicația instalată, deci Android nu îl acceptă peste ea. Fă întâi export de backup din Setări, dezinstalează aplicația, instalează APK-ul de test, apoi importă backup-ul.

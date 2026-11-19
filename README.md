# databricks-learn-app

DataEng Learn: o aplicație Android offline, în limba română, pentru învățat Data Engineering (Spark, Delta Lake, Databricks, SQL, streaming și altele). Interfața este HTML/JS, rulată într-un WebView.

## Conținut

- `app/assets/`: codul aplicației (versiunea 1.48.0), cu îmbunătățirile pentru învățarea termenilor deja aplicate.
- `tools/patch_terms.py`: aplică aceleași îmbunătățiri peste alt `app.js`, de exemplu cel din sursa 1.54. Scriptul se oprește dacă o bucată de cod nu se potrivește.
- `patches/termeni-app.js.diff`: diferențele față de `app.js` 1.48.0, ca referință.
- `tools/build_apk.py`: reîmpachetează APK-ul cu asset-urile modificate și îl semnează cu APK Signature Scheme v2. Cheia se generează local în `signing/`, care nu se publică.
- `tools/test_terms.js`: test Playwright pentru exercițiile noi.
- `dist/DataEng-Learn-1.48.0-termeni.apk`: build de test, semnat cu o cheie de test.

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

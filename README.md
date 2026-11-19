# databricks-learn-app

DataEng Learn: o aplicație Android offline, în limba română, pentru învățat Data Engineering (Spark, Delta Lake, Databricks, SQL, streaming și altele). Interfața este HTML/JS, rulată într-un WebView.

## Conținut

- `app/assets/`: codul aplicației (versiunea 1.48.1, cu conținutul din 1.48.0), cu îmbunătățirile pentru învățarea termenilor deja aplicate.
- `app/assets/dictionary156.js`: inventarul dicționarului (generat).
- `tools/build_dictionary.js`: generează inventarul: unde apare fiecare termen și ce termeni din conținut nu au fișă.
- `tools/patch_dictionary.py`: adaugă ecranul Dicționar în `app.js` și `index.html`. Se aplică după `patch_terms.py`.
- `tools/test_dictionary.js`: test Playwright pentru dicționar.
- `docs/inventar-termeni.md`: raportul inventarului, cu termenii fără fișă.
- `tools/patch_modes.py`: împarte tabul Termeni în modurile Învață și Practică. Se aplică după `patch_dictionary.py`.
- `tools/test_modes.js`: test Playwright pentru cele două moduri.
- `tools/patch_tabmodes.py`: adaugă modurile Învață și Practică la toate taburile. Se aplică după `patch_modes.py`.
- `tools/test_tabmodes.js`: test Playwright care parcurge fiecare tab în ambele moduri.
- `tools/patch_terms.py`: aplică aceleași îmbunătățiri peste alt `app.js`, de exemplu cel din sursa 1.54. Scriptul se oprește dacă o bucată de cod nu se potrivește.
- `patches/termeni-app.js.diff`: diferențele față de `app.js` 1.48.0, ca referință.
- `tools/build_apk.py`: reîmpachetează APK-ul cu asset-urile modificate și îl semnează cu APK Signature Scheme v2. Cheia se generează local în `signing/`, care nu se publică.
- `tools/test_terms.js`: test Playwright pentru exercițiile noi.
- `dist/DataEng-Learn-1.48.1.apk`: versiunea 1.48.1 (versionCode 12032), semnată cu o cheie de test.
- `app/AndroidManifest.xml`: manifestul binar cu versiunea 1.48.1; `tools/build_apk.py` îl folosește în locul celui din APK-ul original.

## Învață și Practică pe toate taburile

Fiecare tab din ecranul Învață are sus un comutator între **Învață**, pentru lecții și informații, și **Practică**, pentru întrebări și exerciții. Aplicația ține minte modul ales separat pentru fiecare tab.

| Tab | Învață | Practică |
|---|---|---|
| Cursuri | catalogul de cursuri, cu lecții | întrebări, carduri, termeni și scenarii din cursul ales |
| Parcurs | etapele de carieră | materia unei etape |
| Concepte | conceptele pe domenii | un domeniu ales: întrebări, carduri, termeni, scenarii |
| Termeni | lecții de termeni, glosar, dicționar | termeni scadenți și practică la alegere |
| Scenarii | situațiile rezolvate, de citit (răspuns și explicație) | rezolvarea scenariilor |
| SQL | cursul SQL și termenii domeniului | exercițiile SQL executabile și întrebări de verificare |
| Python | cursurile Python și Spark și termenii lor | laboratoarele Python și PySpark și întrebări de verificare |
| Certificări | certificările, programa, materialele | test scurt, toate întrebările, greșelile, progres pe domenii, simulări |
| Proiecte | proiectele finale | studiile de caz și exercițiile practice |
| Salvate | favoritele și notițele | repetă favoritele, greșelile sau cardurile scadente |

Practica la alegere are aceleași filtre peste tot:
- **ce exersezi:** mixt, întrebări, carduri, termeni sau scenarii;
- **care:** nefăcute, greșite și scadente; doar greșite; toate;
- **câte:** 10, 20, 30 sau 50.

Greșelile vin primele în sesiune.

## Modurile Învață și Practică la Termeni

Tabul Termeni are sus un comutator între două moduri. Aplicația ține minte ultimul mod ales.

- **Învață:** glosarul, dicționarul A–Z și lecțiile pe domenii, ca înainte.
- **Practică:** exersezi termeni pe care îi alegi tu:
  - butonul **Repetă termenii scadenți**;
  - **Practică la alegere**, unde alegi:
    - **ce termeni:** scadenți, greșiți recent, în curs, știuți, toți cei învățați, favorite sau toți;
    - **domeniul**;
    - **tipul de exercițiu:** mixt după nivel, alege definiția, alege termenul, scrie termenul sau potriviri;
    - **câți termeni:** 10, 20, 30 sau 50;
  - **Pe domenii:** o sesiune rapidă pentru fiecare domeniu început. Domeniile neîncepute sunt strânse la final.

Ordinea în care se aplică patch-urile peste un `app.js` original:

```
python tools/patch_terms.py app/assets/app.js
python tools/patch_dictionary.py app/assets
python tools/patch_modes.py app/assets
python tools/patch_tabmodes.py app/assets
node tools/build_dictionary.js app/assets
```

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

# databricks-learn-app

DataEng Learn: o aplicație Android offline, în limba română, pentru învățat Data Engineering (Spark, Delta Lake, Databricks, SQL, streaming și altele). Interfața este HTML/JS, rulată într-un WebView.

## Conținut

- `app/assets/`: codul aplicației (versiunea 1.50.0, cu conținutul din 1.48.0 plus conținutul nou din 1.48.4–1.50.0), cu îmbunătățirile pentru învățarea termenilor deja aplicate.
- `app/assets/dictionary156.js`: inventarul dicționarului (generat).
- `tools/build_dictionary.js`: generează inventarul: unde apare fiecare termen și ce termeni din conținut nu au fișă.
- `tools/patch_dictionary.py`: adaugă ecranul Dicționar în `app.js` și `index.html`. Se aplică după `patch_terms.py`.
- `tools/test_dictionary.js`: test Playwright pentru dicționar.
- `docs/inventar-termeni.md`: raportul inventarului, cu termenii fără fișă.
- `tools/patch_modes.py`: împarte tabul Termeni în modurile Învață și Practică. Se aplică după `patch_dictionary.py`.
- `tools/test_modes.js`: test Playwright pentru cele două moduri.
- `tools/patch_tabmodes.py`: adaugă modurile Învață și Practică la toate taburile. Se aplică după `patch_modes.py`.
- `tools/test_tabmodes.js`: test Playwright care parcurge fiecare tab în ambele moduri.
- `tools/patch_setup.py`: modifică pasul 1 al configurării. Adaugă contorul de domenii bifate, butoanele de bifare rapidă, gruparea pe tipuri și săgeata cu tot ce conține fiecare domeniu.
- `tools/test_setup.js`: test Playwright pentru configurare.
- `tools/patch_resources.py`: adaugă biblioteca de resurse externe. Se aplică după `patch_setup.py`.
- `tools/build_resources.py`: transformă cataloagele din cercetare în `app/assets/resources156.js`.
- `tools/check_links.js` și `.github/workflows/check-links.yml`: verificarea automată a linkurilor din GitHub Actions. Rezultatul se salvează în `app/assets/resources-status156.json`.
- `tools/test_resources.js`: test Playwright pentru bibliotecă.
- `reports/` și `research_notes/`: raportul de cercetare și notițele lui.
- `content/enrich157_*.json`: fișele scrise în 1.48.4 (65 de termeni, 18 carduri, 17 întrebări, sinonime noi).
- `tools/build_enrich.py`: le transformă în `app/assets/enrich157.js`, iar `tools/patch_enrich.py` îl încarcă după `cards.js`.
- `tools/test_enrich.js`: test Playwright pentru fișele noi.
- `content/exam158_*.json`: întrebările de examen din 1.48.5; `tools/build_enrich.py` le adaugă în testele certificărilor și raportează cât de des varianta corectă e cea mai lungă.
- `tools/test_exams.js`: verifică întrebările noi, atribuirea pe domenii și pornirea unui test.
- `content/atelier159.json`: pachetul de conținut Atelier, cu competențe, exerciții de 5 tipuri și fișe de referință.
- `tools/build_atelier.js`: validează pachetul și generează `app/assets/atelier159.js`. Rulează fiecare exercițiu cu date și refuză pachetul dacă altă variantă decât cea corectă dă rezultatul așteptat.
- `tools/patch_atelier.py`: motorul de exerciții, planificatorul, Repară lacunele, sertarul Materiale și Autonomie.
- `tools/test_atelier.js`: test Playwright pentru toate tipurile de exerciții, indicii, sertar, reluare, coada de reparat și statistici.
- `content/atelier_mental160.json`: cursul Modele mentale (8 module, 48 de exerciții, fișe de principii, capcane universale, matrice de compromisuri, scenarii de gândire).
- `tools/test_mental.js`: test Playwright pentru traseul Modele mentale.
- `tools/patch_terms.py`: aplică aceleași îmbunătățiri peste alt `app.js`, de exemplu cel din sursa 1.54. Scriptul se oprește dacă o bucată de cod nu se potrivește.
- `patches/termeni-app.js.diff`: diferențele față de `app.js` 1.48.0, ca referință.
- `tools/build_apk.py`: reîmpachetează APK-ul cu asset-urile modificate și îl semnează cu APK Signature Scheme v2. Cheia se generează local în `signing/`, care nu se publică.
- `tools/test_terms.js`: test Playwright pentru exercițiile noi.
- `dist/DataEng-Learn-1.50.0.apk`: versiunea 1.50.0 (versionCode 12040), semnată cu o cheie de test.
- `app/AndroidManifest.xml`: manifestul binar cu versiunea 1.50.0; `tools/build_apk.py` îl folosește în locul celui din APK-ul original.

## Modele mentale (1.50.0): gândire inginerească, fără tehnologie

În Atelier, selectorul **Modele mentale / Tehnic** alege traseul. Modele mentale e cursul nou, despre concepte universale, fără niciun tool.

### Cele 8 module

1. Intrări, ieșiri și contracte
2. Identitate, stare și timp
3. Idempotență, repetare și erori parțiale
4. Granularitate, modelare și responsabilități
5. Cazuri limită și invarianți
6. Compromisuri și scalare
7. Observabilitate și diagnosticare
8. Evoluție și compatibilitate

### Cele 4 niveluri ale fiecărui modul

| Nivel | Ce exersezi |
|---|---|
| **Intuiție** | definiția și situația simplă |
| **Cazuri limită** | valori lipsă, ordine greșită, duplicate, concurență |
| **Compromisuri** | alegeri între viteză, corectitudine, simplitate, cost |
| **Diagnostic** | simptom → ipoteză → test, fără indicii |

### Cele 6 tipuri de micro-exerciții

- Care e invarianța?
- Ce se strică la retry?
- Alege compromisul
- Găsește presupunerea ascunsă
- Ordine și dependențe
- Simptom → Ipoteză: alegi și ipoteza, și testul

O sesiune are 5–6 exerciții. Acolo unde ajută, exercițiile au o **diagramă schematică** randată local: cutii, săgeți și pasul eșuat marcat.

### Feedback constructiv

La o greșeală, aplicația spune **ce ai ratat** (de exemplu „Execuția dublă” sau „Ordinea nu e garantată”), de ce, și ce contează în producție.

### Materialele offline (sertarul Materiale și Atelier → Învață)

- **Principii:** fișe de model mental (pe scurt, regula de aur, când ajută, când nu ajută, întrebarea de verificare) și matricile compromisurilor.
- **Capcane & scenarii:** catalogul capcanelor universale și scenariile de gândire (ghișeul, fișa de inventar, rezervările, aprobările).
- **Jurnalul meu:** notițe libere sau legate de exercițiul curent.

### Statistici → Claritate & autonomie

- rata de rezolvare fără indicii;
- modelele stăpânite bine și cele care necesită recapitulare;
- acoperirea pe fiecare traseu;
- unde tinzi să sari peste cazuri limită.

### Lungimea variantelor

În ambele trasee, varianta corectă e cea mai lungă în 27% din cazuri și cea mai scurtă în 23%, deci lungimea nu indică răspunsul.

## Atelier (1.49.0): exersare locală pe competențe

Tabul nou **Învață → Atelier** pune în practică arhitectura de tip local-first. Totul rulează pe telefon, fără server.

### Pachetul de conținut

Fișierul este `atelier159.js`, generat din `content/atelier159.json` și separat de cod: competențele noi se adaugă fără schimbarea interfeței. Pachetul conține:
- **6 competențe:** SQL și NULL, Delta MERGE, performanță Spark, streaming cu stare, Unity Catalog, operarea pipeline-urilor;
- **36 de exerciții**, câte 2 pe fiecare treaptă;
- **12 fișe de referință:** reguli scurte, capcane frecvente și incidente.

### Motorul de exerciții

Are cinci tipuri de exerciții:

| Tip | Ce faci |
|---|---|
| **Alege decizia** | alegi varianta corectă dintr-un trade-off |
| **Găsește capcana** | atingi linia de cod sau de configurare care produce problema |
| **Ordinea pașilor** | atingi pașii în ordine; atingi un pas ca să-l scoți |
| **Completează** | pui jetoanele în spațiile libere |
| **Verifică pe date** | varianta aleasă rulează local pe un tabel mic, cu NULL, duplicate și cazuri limită |

**Rezultatul unei verificări pe date:** dacă trece, rândurile obținute, rândurile așteptate și diferențele („În plus” / „Lipsă”).

**Feedback-ul:** verde sau roșu, cu motivul, explicația și secțiunea expandabilă „De ce contează în producție”.

### Planificatorul

- **Scor de stăpânire 0–100 pe exercițiu:** +25 fără indiciu, +10 cu indiciu, −20 la greșeală.
- **Recapitulare** la 1, 3, 7 sau 21 de zile, după scor.
- **Repară lacunele:** exercițiile greșite, apoi cele rezolvate cu indiciu, apoi cele scadente. Apare pe ecranul Azi și în Atelier, într-o sesiune de până la 6 exerciții.

### Ecranele

- **Traseul** (Atelier → Practică):
  - bara de sus: zile la rând, rata fără indicii, stăpânirea medie și căutarea în materiale;
  - nodurile: neînceput, în progres, solid sau necesită recapitulare, cu patru trepte: Bază, Edge cases, Trade-offs, Fără indicii;
  - sesiunile au 6 exerciții, iar treapta neterminată vine prima.
- **Sertarul Materiale**: butonul din bara oricărei sesiuni. Răspunsul în curs se păstrează. Are trei taburi: Cheat-sheet, Capcane și incidente, Notițele mele (cu notiță legată de exercițiul curent), plus legături spre dicționar și bibliotecă.
- **Autonomie** (în Statistici):
  - rata de rezolvări fără indicii;
  - încercările;
  - câte exerciții sunt de reparat;
  - acoperirea pe competențe;
  - greșelile frecvente, grupate pe tipuri.

### Unde se salvează

Progresul stă în starea aplicației (`focus159`): se salvează pe telefon și intră în exportul de backup.

## Databricks DE Associate: 40 de întrebări noi în 1.48.7

Pentru Databricks Data Engineer Associate am adăugat **40 de întrebări noi**, după ponderile din ghidul din mai 2026:

| Domeniu | Întrebări noi |
|---|---|
| Platformă | 3 |
| Ingestie | 8 |
| Transformare | 9 |
| Lakeflow Jobs | 6 |
| CI/CD | 4 |
| Depanare | 4 |
| Guvernanță | 6 |

**Subiecte:** volumes, `read_files`, streaming tables în SQL, Kafka, Lakeflow Connect, schema hints, checkpoint-uri, CREATE OR REPLACE, INSERT OVERWRITE, `explode`, JSON cu `:`, funcții fereastră, deduplicare cu watermark, funcții SQL în Unity Catalog, PIVOT, For each, If/else, job cluster partajat, cron cu fus orar, notificări, retry, `bundle init`, mode development, OAuth pentru service principal, query profile, compactare, skew, Photon, MODIFY, vederi dinamice, Delta Sharing, REVOKE, workspace-catalog binding.

Împreună cu cele 10 din 1.48.5, DE Associate are acum 50 de întrebări noi, iar banca are 365 de întrebări.

**Lungimea variantelor:** varianta corectă e cea mai scurtă în 6 întrebări, pe pozițiile din mijloc în 25 și cea mai lungă în 9.

## DP-750: 41 de întrebări noi în 1.48.6

Pentru DP-750 am adăugat **41 de întrebări noi**, distribuite după ponderile oficiale:

| Arie | Întrebări noi |
|---|---|
| Pregătirea și configurarea mediului Azure Databricks | 7 |
| Securizarea și guvernanța obiectelor Unity Catalog | 7 |
| Pregătirea și procesarea datelor | 14 |
| Livrarea și întreținerea pipeline-urilor | 13 |

Împreună cu cele 9 din 1.48.5, DP-750 are acum 50 de întrebări noi, iar banca are 388 de întrebări.

**Lungimea variantelor:** la cele 41, varianta corectă e cea mai scurtă în 9 întrebări, pe pozițiile din mijloc în 22 și cea mai lungă în 10. Lungimea nu indică răspunsul.

## Întrebări de examen noi în 1.48.5

Am adăugat 83 de întrebări de tip scenariu în testele certificărilor:

| Certificare | Întrebări noi |
|---|---|
| Databricks DE Associate | 10 |
| Databricks DE Professional | 10 |
| Spark Developer Associate | 10 |
| DP-750 | 9 |
| DP-700 | 10 |
| AWS DEA-C01 | 10 |
| Google PDE | 9 |
| SnowPro Core COF-C03 | 11 |
| Tehnica de examen | 4 |

**Domenii:** fiecare întrebare e atribuită unui domeniu oficial al examenului, deci intră în testele scurte, în testele complete, în recapitularea greșelilor și în „Progres pe domenii”.

**Subiecte:** accent pe ce s-a schimbat în 2026 (Lakeflow Jobs și pipelines, Asset Bundles, AUTO CDC, Spark Connect, Fabric, Unity Catalog, COF-C03) și pe subiectele cu pondere mare.

**Explicații:** fiecare variantă greșită are o explicație.

**Lungimea variantelor:** varianta corectă e cea mai lungă în doar 20% din cazuri, sub nivelul hazardului de 25%, deci testul nu se poate trece alegând răspunsul cel mai lung. Justificarea completă apare în explicația de după răspuns. Am echilibrat la fel și cele 17 întrebări din 1.48.4.

## Conținut nou în 1.48.4

Pe baza cercetării, aplicația are acum conținut nou scris în română.

**65 de fișe de termeni noi.** Fiecare are definiție, detalii, exemplu, întrebare de verificare și sursă oficială verificată. Sunt termeni folosiți des în materiale, dar care nu aveau fișă:
- SQL, NULL, DDL, DML, JDBC;
- JSON, CSV, YAML, Parquet, Avro, ORC;
- API, REST, HTTP, DNS, TLS, TTL;
- AWS, S3, ARN, IAM, KMS, CloudWatch, DMS, EMR;
- GCP, BigQuery, GCS;
- ADLS Gen2, ADF, Databricks Runtime, Lakeflow pipelines, Databricks Free Edition;
- DataFrame, PySpark, JVM, OOM, SparkContext, PushedFilters, Garbage collection;
- pandas 3.0, Polars;
- SCD, BI, DAX;
- ParDo, DoFn;
- SLA, LTS, SIGTERM, DST, CLI, SDK;
- PII, GDPR, DLP, SHA-2, ACL;
- ZooKeeper, Airflow 3, HDFS, NameNode, ML, Snowpark, XTable.

Termenii noi apar în lecții, glosar, dicționar și practică.

**18 carduri cu noutățile din 2026:**
- DP-203 retras;
- DP-750 nou;
- DP-700;
- ghidurile Databricks din 2026;
- Spark Developer;
- AWS DEA-C01;
- Google PDE și mutarea pe Google Skills;
- SnowPro Core COF-C03;
- redenumirile Lakeflow;
- Kafka 4 fără ZooKeeper;
- Airflow 3;
- pandas 3;
- Soda Core 4 și GX 1.x;
- Terraform 004 și OpenTofu;
- laboratoare gratuite;
- DE Zoomcamp;
- versiunile Spark, Delta și Iceberg.

**17 întrebări grilă noi.** Fiecare are explicație pentru varianta corectă și pentru fiecare variantă greșită.

**Sinonime noi la termenii existenți:** UC, SCD2, CDF.

Faptele neconfirmate oficial în cercetare sunt marcate ca atare în text.

## Biblioteca de resurse externe

Biblioteca are 372 de linkuri unice, în 40 de domenii și examene: documentație oficială, cursuri gratuite, ghiduri de examen, cărți deschise și laboratoare. Fiecare are un rezumat în română. Linkurile au fost alese prin cercetare și verificate automat pe 19.11.2026:
- **356 funcționează;**
- **9 site-uri** blochează verificarea automată;
- **7 linkuri** au probleme. Aplicația le ascunde implicit.

**Unde găsești biblioteca:**
- Concepte și Termeni (modul Învață): toată biblioteca;
- SQL și Python: resursele domeniului;
- Certificări: „Resurse oficiale” la fiecare examen;
- configurare: numărul de resurse al fiecărui domeniu.

Conținutul aparține autorilor, așa că aplicația pune linkuri, nu copiază materialele.

## Configurare: ce vrei să înveți

La pasul 1 al configurării:
- **contorul** „N din 71 domenii bifate · M materiale în sesiuni” se actualizează la fiecare bifă;
- **butoanele de bifare rapidă:** Bifează toate, Doar principale (40), Doar certificări (31), Debifează tot;
- **domeniile sunt grupate** în Domenii principale și Module de certificare, fiecare grup cu contorul lui;
- **în dreapta fiecărui domeniu** apar totalul materialelor și o săgeată. Săgeata deschide tot ce conține domeniul: carduri, termeni, întrebări, scenarii, lecții de curs, exerciții SQL, laboratoare Python și cursul asociat.

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
python tools/patch_setup.py app/assets
python tools/patch_resources.py app/assets
python tools/patch_enrich.py app/assets
python tools/patch_atelier.py app/assets
node tools/build_atelier.js content/atelier159.json content/atelier_mental160.json app/assets
python tools/build_enrich.py content app/assets
python tools/build_resources.py "research_notes/Resurse învățare data engineering" app/assets
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

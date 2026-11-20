# databricks-learn-app

DataEng Learn: o aplicație Android offline, în limba română, pentru învățat Data Engineering (Spark, Delta Lake, Databricks, SQL, streaming și altele). Interfața este HTML/JS, rulată într-un WebView.

## Conținut

- `app/assets/`: codul aplicației (versiunea 1.52.1, cu conținutul din 1.48.0 plus conținutul nou din 1.48.4–1.52.0), cu îmbunătățirile pentru învățarea termenilor deja aplicate.
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
- `tools/qa_content.js`, `tools/qa_app.js`, `tools/run_all_tests.sh`: suita de calitate (vezi mai jos); `tools/patch_a11y.py`: corecturile de accesibilitate.
- `docs/calitate-continut.md`, `docs/calitate-aplicatie.md`: ultimele rapoarte de calitate.
- `content/balance161.py`: hook-ul Etapei D. Generează `app/assets/balance161.js`, încărcat după `cards.js`. Datele lui sunt `content/balance161_overrides.json` (360 de întrebări rescrise) și `content/explanations161.json` (25 de explicații noi).
- `tools/patch_balance.py`: încarcă hook-ul în `index.html`.
- `tools/qa_sql_labs.js`, `tools/qa_python_labs.py`: rulează soluțiile laboratoarelor SQL (motorul aplicației) și Python (CPython). Rapoartele lor sunt `docs/laboratoare-sql.md` și `docs/laboratoare-python.md`.
- `tools/patch_terms.py`: aplică aceleași îmbunătățiri peste alt `app.js`, de exemplu cel din sursa 1.54. Scriptul se oprește dacă o bucată de cod nu se potrivește.
- `patches/termeni-app.js.diff`: diferențele față de `app.js` 1.48.0, ca referință.
- `tools/build_apk.py`: împachetează APK-ul din `app/base/shell.apk` (manifest, resurse și `classes.dex` din APK-ul original, fără asset-uri), `app/AndroidManifest.xml` și `app/assets/`, apoi îl semnează cu APK Signature Scheme v2. Vezi „Semnarea APK-ului”.
- `tools/apk_version.py`: citește versiunea din manifestul binar; release-ul primește tag-ul `v<versiune>`.
- `content/seed/cards.js`: conținutul de bază complet (31 MB). `tools/split_seed.py` îl împarte în `app/assets/cards.js` (încărcat la pornire) și `app/assets/seed-lazy162.js` (graful căutării comune și arhiva de întrebări vechi, încărcate după primul ecran). `tools/patch_lazy.py` face aplicația să aștepte graful acolo unde e nevoie de el.
- `tools/test_terms.js`: test Playwright pentru exercițiile noi.
- APK-ul nu mai stă în repo: îl construiește și îl semnează GitHub la fiecare versiune nouă (vezi „Semnarea APK-ului”). Se descarcă din pagina de Releases.
- `app/AndroidManifest.xml`: manifestul binar cu versiunea 1.52.1; `tools/build_apk.py` îl folosește în locul celui din APK-ul original.

## Pornire mai rapidă (1.52.0)

Pornirea măsurată în Chromium, cu procesorul încetinit de 4 ori, ca pe un telefon obișnuit:

| | Înainte | Acum |
|---|---:|---:|
| Până la primul ecran | ~2,2 s | ~1,3 s |
| `cards.js` | 31,5 MB | 20,9 MB |
| Corecturile Etapei D (`balance161.js`) | ~260 ms | ~40 ms |

- **Căutarea comună (10 400 de noduri) și arhiva de întrebări vechi** se încarcă după primul ecran, din `seed-lazy162.js`:
  - dacă deschizi căutarea înainte să ajungă datele, ea apare imediat după aceea;
  - legăturile „Vezi conceptul” se adaugă la locul lor când sosește graful.
- **Corecturile din Etapa D** se calculează la construire, inclusiv cuvintele lipite. La pornire se aplică doar valorile finale, iar rezultatul e identic cu cel din 1.51.0.
- **Căutarea unui termen după id** folosește un index, nu mai parcurge toată lista.
- **Testul `tools/test_lazy.js`** verifică:
  - căutarea deschisă devreme;
  - lecțiile de curs din graf;
  - întrebările din arhivă;
  - rezultatele căutării.

## Etapa D (1.51.0): auditul și repararea conținutului

Etapa a pornit în sesiunea de pe calculator și s-a terminat aici, pe conținutul din repo. Hook-ul `content/balance161.py` reia regula din `balance155` și adaugă rescrierile manuale.

### Reechilibrarea întrebărilor grilă

| Bancă | Corecta cea mai lungă, înainte | După |
|---|---:|---:|
| Banca generală | 62% | 25% |
| DP-750 | 64% | 20% |
| Databricks DE Associate | 63% | 24% |
| DP-700 | 64% | 32% |
| Spark Developer | 67% | 19% |

Cum s-a făcut:
- **Regula automată:** 268 de întrebări. Unde varianta corectă era de peste 1,6 ori mai lungă, decizia rămâne în variantă, iar justificarea trece în explicație („De ce: …”).
- **Rescrieri manuale:** 360 de întrebări unice, aplicate și copiilor lor din băncile de examen, în total 556. Varianta corectă e scurtată, iar unele variante greșite sunt făcute mai precise. Ordinea și răspunsul corect nu se schimbă.
- **Verificarea lor:** fiecare rescriere a fost verificată automat: același număr de variante, același răspuns corect, codul păstrat, nicio diacritică cu sedilă.
- **Efectul invers:** varianta corectă e cea mai scurtă în 15–26% din cazuri, deci lungimea nu indică răspunsul în niciun sens.

### Celelalte reparații din audit

- **Explicații:** 25 de explicații noi, la întrebările care doar repetau răspunsul.
- **Legături:** 176 de legături interne spre o bancă veche de întrebări DE Professional, care nu mai exista, sunt eliminate.
- **Cuvinte lipite:** 139 despărțite („Nu.Verific” → „Nu. Verific”), după o listă de cuvinte românești. Codul, de exemplu `States.Timeout`, rămâne neatins.
- **Termeni dublați:** 5 perechi diferențiate prin context: Executor, Volume, Lakehouse, Manifest, Read committed. Dublura „ADLS Gen2” e eliminată.
- **Denumiri depășite:** „Databricks Workflows” → „Lakeflow Jobs”, „DLT pipeline” → „pipeline Lakeflow (fost DLT)”.
- **Progres pe domenii:** 51 de întrebări Spark Developer și 4 DP-750 nu apăreau deloc. Erau etichetate cu denumiri alternative sau aveau lista de domenii goală.
- **Plan de lecții:** 3 trimiteri spre termeni inexistenți.

### Exemplele de cod

| Laboratoare | Rezultat |
|---|---|
| SQL, 124 de exerciții | toate soluțiile trec propria verificare; nicio variantă-capcană nu dă același rezultat |
| Python, 62 de laboratoare | toate soluțiile trec toate testele cu CPython; niciun cod de pornire nu le trece deja |

### Ce rămâne

- **Băncile AWS și Google:** varianta corectă e cea mai scurtă în 54% și 60% din cazuri. Multe răspunsuri sunt valori scurte.
- **DE Associate:** aria Ingestie are 13% din întrebări, față de 21% oficial.
- **Resurse:** 4 linkuri nefuncționale, ascunse deja în aplicație.

## Verificări de calitate (1.50.1)

Toată suita pornește cu o singură comandă:

```
bash tools/run_all_tests.sh app/assets docs
```

Pe GitHub rulează automat la fiecare push și pull request, prin workflow-ul `.github/workflows/qa.yml`. Rapoartele apar ca artefact și în pagina rulării.

### 1. Conținutul (`tools/qa_content.js`, fără browser)

Raportul se scrie în `docs/calitate-continut.md`. Verifică:
- **Întrebări grilă din toate băncile:** exact o variantă corectă (sau cel puțin două la răspuns multiplu), variante duplicate sau goale, explicații lipsă, variante greșite fără motiv, întrebări dublate, lungimea variantei corecte (procentul în care e cea mai lungă).
- **Glosar:** definiții lipsă, prea scurte sau prea lungi, întrebări de verificare lipsă, termeni dublați.
- **Legături interne:** trimiteri spre carduri, termeni, lecții sau întrebări inexistente; planul lecțiilor de termeni.
- **Text:** diacritice cu sedilă (ş ţ în loc de ș ț), blocuri de cod, cod inline și îngroșări neînchise.
- **Examene:** ponderea fiecărui domeniu în bancă față de ponderea oficială.
- **Resurse:** doar HTTPS, rezumat obligatoriu, linkuri nefuncționale.
- **Atelier:** validatorul complet al pachetelor și lungimea variantelor.

Ce e eroare și ce e avertisment:
- **erori** (opresc suita): conținutul nou și invarianții de bază;
- **avertismente**: conținutul moștenit, ca să fie reparat treptat.

### 2. Funcționalitatea (10 teste Playwright)

Testele acoperă:
- termenii și dicționarul;
- modurile Învață/Practică;
- configurarea;
- resursele;
- fișele noi și întrebările de examen;
- Atelierul și Modele mentale.

### 3. Aplicația (`tools/qa_app.js`, în browser)

Raportul se scrie în `docs/calitate-aplicatie.md`. Verificarea trece prin fiecare ecran și prin toate cele 11 taburi, în ambele moduri, plus o sesiune Atelier și sertarul Materiale. Le verifică la 360 și 412 px, în temă întunecată și luminoasă:
- **depășirea pe orizontală;**
- **ținte de atingere:** eroare sub 24 px, avertisment sub 36 px;
- **elemente fără nume accesibil;**
- **contrastul textului**, după pragurile WCAG;
- **erori în consolă;**
- **timpul de pornire;**
- **backup-ul:** exportul și importul păstrează tot progresul;
- **reluarea sesiunii:** după reîncărcarea paginii, sesiunea revine cu toate cele 9 tipuri de exerciții, la aceeași poziție.

### Ce a găsit suita la prima rulare

**Reparat în 1.50.1:**
- două câmpuri din Setări fără etichetă accesibilă;
- linkurile spre surse aveau 22 px înălțime; acum au cel puțin 36 px.

**Rămase ca avertismente:**
- **Băncile vechi de întrebări:** răspunsul corect e cel mai lung în 56–64% din cazuri (DP-750, DE Associate, DP-700, Spark Developer și banca generală).
- **25 de întrebări vechi fără explicație.**
- **14 texte cu îngroșare neînchisă.**
- **6 termeni dublați și 4 domenii de examen sub- sau suprareprezentate.**

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
python tools/patch_a11y.py app/assets
python tools/patch_balance.py app/assets
python3 tools/patch_lazy.py app/assets
python3 tools/split_seed.py content/seed/cards.js app/assets
python3 content/balance161.py app/assets
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

## Semnarea APK-ului

Android acceptă o actualizare doar dacă e semnată cu aceeași cheie ca aplicația instalată. Toate versiunile de la 1.48.1 încoace folosesc aceeași cheie.

- **Certificatul public** e în `app/signing-cert.pem` (SHA-256 `DF:86:E8:22:…:74:1D`).
- **Cheia privată** e secretul `APK_SIGNING_KEY` al repo-ului (Settings → Secrets and variables → Actions) și o copie de rezervă păstrată de proprietar. Nu se pune niciodată în repo.
- **Release-ul:** când versiunea din `app/AndroidManifest.xml` se schimbă, `.github/workflows/release.yml`:
  - construiește APK-ul din `app/`;
  - îl semnează cu secretul;
  - verifică cu `apksigner` că certificatul e cel din `app/signing-cert.pem`;
  - publică release-ul `v<versiune>`, cu notele din `.github/release-notes.md`.
- **Fără o cheie nouă:** `tools/build_apk.py` refuză să genereze o cheie în GitHub Actions și verifică dacă cheia corespunde certificatului.
- **Construire locală:** `python3 tools/build_apk.py app/base/shell.apk app/assets dist/DataEng-Learn-<versiune>.apk <director cu key.pem și cert.pem>`. `dist/` e ignorat de git.
- **De la 1.52.1**, APK-ul publicat e construit exclusiv de GitHub. Dacă secretul lipsește, release-ul se oprește cu o eroare clară și nu se publică nimic.

Dacă vii de la versiunea construită pe calculator (1.48.0 sau 1.54), aceea are altă cheie. Pentru prima instalare fă export de backup din Setări, dezinstalează, instalează APK-ul și importă backup-ul. De atunci încolo, actualizările se instalează direct.

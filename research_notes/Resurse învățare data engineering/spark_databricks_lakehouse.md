# Resurse de învățare: Spark/PySpark, Delta Lake, Iceberg, Hudi, Databricks și certificările Databricks (stare: noiembrie 2026)

> **Notă despre verificare (citiți întâi).** Încercarea de a verifica fiecare URL direct a eșuat din cauza rețelei acestei sesiuni:
> `curl` prin proxy a primit `CONNECT tunnel failed, response 403` pentru practic toate gazdele (spark.apache.org, learn.microsoft.com, docs.databricks.com, github.com a returnat HTTP 403), iar WebFetch a dat `ENOTFOUND www.databricks.com`.
> Prin urmare, **niciun URL nu a putut fi încărcat direct**. Am folosit în schimb căutarea web: un URL marcat **[I] = indexat** a apărut ca rezultat exact în căutare în noiembrie 2026 (deci există și este probabil valid). Unul marcat **[C] = construit** urmează structura cunoscută a site-ului oficial, dar NU a fost confirmat în această sesiune și trebuie verificat (de ex. cu un `curl -I` dintr-o rețea deschisă) înainte de publicarea în aplicație. Pentru verificare reală, domeniile `databricks.com`, `docs.databricks.com`, `spark.apache.org`, `learn.microsoft.com`, `github.com`, `delta.io`, `iceberg.apache.org`, `hudi.apache.org` trebuie permise în setările de rețea ale sesiunii.
> Câmpuri: Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost/licență | Rezumat (RO) | Status URL. Deck-uri: spark, delta, iceberg, openlake, azure; examene: dbra, dbrp, sparkcert, dp750.

## Care sunt punctele de intrare oficiale în documentație și cursurile/traseele oficiale gratuite?

### Takeaway
Fiecare tehnologie are documentație oficială gratuită cu un quickstart rulabil local (Spark/PySpark prin pip, Delta prin `delta-spark`, Iceberg prin docker-compose, Hudi prin `--packages`). Databricks are un catalog de cursuri self-paced gratuite în Databricks Academy, plus Databricks Free Edition pentru exerciții practice. Microsoft Learn are trasee gratuite aliniate cu noul examen DP-750. Redenumiri importante: DLT a devenit „Lakeflow pipelines” (fost și „Lakeflow Declarative Pipelines”), Workflows/Jobs a devenit „Lakeflow Jobs”, iar modulul Python `dlt` a fost înlocuit de `pyspark.pipelines`.

### Cited Findings

**Stare versiuni și redenumiri**
- Apache Spark 4.3.0 ar fi fost publicat pe 30 octombrie 2026 (știre secundară). Pagina de download Apache arăta încă 4.1.2 (mai 2026) ca ultima știre, deci există un conflict, iar 4.3.0 rămâne neconfirmat la sursa primară. — [letsdatascience](https://letsdatascience.com/news/apache-spark-project-releases-version-430-978a19cf); [Apache release catalog 4.1.2](https://release-catalog.apache.org/spark/4.1.2/index.html)
- Ultimele patch-uri pe linii, conform endoflife.date: 4.2.1, 4.1.4 și 4.0.5 (21 oct. 2026). Politica de versiuni Spark spune că începând cu 4.3.0 lansările de funcționalități vin trimestrial, iar 4.5.0 e planificat ca ultimul 4.x. — [endoflife.date](https://endoflife.date/apache-spark); [Spark versioning policy](https://spark.apache.org/versioning-policy.md)
- Documentația Databricks: „Delta Live Tables (DLT) is now Lakeflow pipelines”, codul existent funcționează fără migrare, iar modulul `dlt` e înlocuit de `pyspark.pipelines` (`dlt` încă merge, dar se recomandă `pipelines`). SKU-urile clasice și schemele event log încă poartă „dlt”. — [What happened to DLT? (docs.databricks.com)](https://docs.databricks.com/aws/en/ldp/where-is-dlt); [versiunea Azure](https://learn.microsoft.com/en-us/azure/databricks/ldp/where-is-dlt)
- Tabelul oficial de redenumiri: „Lakeflow pipeline” este numele curent (foste: Delta Live Tables, DLT, Lakeflow Declarative Pipelines), iar „Lakeflow Jobs” este numele curent pentru Databricks Workflows/Jobs. Proiectul open-source corespondent este Apache Spark Declarative Pipelines (SDP), interoperabil dar cu funcționalități diferite. — [Renamed and deprecated product names](https://docs.databricks.com/gcp/en/resources/product-name-changes)
- Numele variază încă între surse: catalogul Academy și paginile demo folosesc „Lakeflow Spark Declarative Pipelines” și „Apache Spark Declarative Pipelines”. — [Academy free catalog](https://customer-academy.databricks.com/learn/public/catalog/view/141); [demo Databricks](https://www.databricks.com/resources/demos/tutorials/lakehouse-platform/lakeflow-declarative-pipeline)
- Quickstart-ul Iceberg folosește `iceberg-spark-runtime-4.1_2.13:1.11.0`, deci Iceberg 1.11 pe Spark 4.1. Quickstart-ul Delta arată `delta-spark` 4.0.0, iar artefactul vechi `delta-core` (0.x–2.x) este învechit. — [Iceberg Spark quickstart](https://iceberg.apache.org/spark-quickstart/); [Delta Quick Start](https://docs.delta.io/quick-start/)

**Deck `spark`: Apache Spark și PySpark**

| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat RO | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Spark Documentation (latest) | https://spark.apache.org/docs/latest/ | Apache Spark (ASF) | official docs | beg–adv | EN | gratuit, Apache-2.0 | Punctul de intrare oficial pentru toate ghidurile Spark (SQL, Streaming, MLlib, tuning). | [C] (domeniul spark.apache.org indexat) |
| 2 | Quick Start | https://spark.apache.org/docs/latest/quick-start.html | ASF | tutorial | beginner | EN | gratuit, Apache-2.0 | Primii pași cu shell-ul interactiv și o aplicație simplă în Python/Scala. | [C] |
| 3 | PySpark documentation (Getting Started + User Guide) | https://spark.apache.org/docs/latest/api/python/index.html | ASF | official docs | beg–int | EN | gratuit, Apache-2.0 | Instalare PySpark, DataFrame API, Spark Connect, pandas API on Spark, cu notebook-uri rulabile. | [C] |
| 4 | Spark SQL, DataFrames and Datasets Guide | https://spark.apache.org/docs/latest/sql-programming-guide.html | ASF | official docs | intermediate | EN | gratuit | Ghidul de referință pentru DataFrame/SQL, surse de date și funcții. Acoperă domeniile principale ale examenului Spark. | [C] |
| 5 | Structured Streaming Programming Guide | https://spark.apache.org/docs/latest/structured-streaming-programming-guide.html | ASF | official docs | intermediate | EN | gratuit | Concepte de streaming: triggers, watermark, stări, sink-uri, checkpointing. | [C] |
| 6 | Performance Tuning (AQE, join hints, caching) | https://spark.apache.org/docs/latest/sql-performance-tuning.html | ASF | official docs | advanced | EN | gratuit | Optimizarea interogărilor: Adaptive Query Execution, broadcast, partiționare. | [C] |
| 7 | Spark Connect Overview | https://spark.apache.org/docs/latest/spark-connect-overview.html | ASF | official docs | intermediate | EN | gratuit | Arhitectura client-server Spark Connect, care apare în ghidul examenului Spark (~5%). | [C] |
| 8 | Exemple oficiale Python (repo Spark) | https://github.com/apache/spark/tree/master/examples/src/main/python | ASF | hands-on lab | beg–int | EN | gratuit, Apache-2.0 | Scripturi PySpark oficiale rulabile local (SQL, streaming, ML). | [C] (github 403 din proxy) |
| 9 | Introduction to Apache Spark Architecture (Databricks Academy) | https://customer-academy.databricks.com/learn/course/112/introduction-to-apache-spark-architecture | Databricks Academy | official free course | beginner | EN | gratuit cu cont | Curs scurt despre driver, executori, joburi, stagii și task-uri. | [I] |
| 10 | Learning Spark, 2nd ed. (O'Reilly, oferit gratuit de Databricks) | https://pages.databricks.com/202003-US-EB-Learning-Spark-2nd-Edition_01_Downloadpage.html | Databricks / O'Reilly | open book (free vendor e-book) | beg–int | EN | gratuit cu formular. Oferta e din 2020 și poate fi expirată. | Carte completă despre Spark 3.0, DataFrame, SQL, streaming și Delta. Unele părți sunt depășite față de Spark 4. | [I], dar disponibilitate neconfirmată |
| 11 | LearningSparkV2 – notebook-uri cod carte | https://github.com/databricks/LearningSparkV2 | Databricks | hands-on lab | beg–int | EN | gratuit, open-source | Codul exemplelor din carte, rulabil în Free Edition sau local. | [C] |
| 12 | Imagine Docker oficială Spark | https://hub.docker.com/_/spark | ASF/Docker | hands-on lab | intermediate | EN | gratuit | Rulezi Spark local în container fără instalare manuală. | [C] |

**Deck `delta`: Delta Lake**

| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat RO | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Delta Lake documentation | https://docs.delta.io | Delta Lake (Linux Foundation) | official docs | beg–adv | EN | gratuit, Apache-2.0 | Documentația oficială: tranzacții ACID, time travel, MERGE, schema evolution, optimizări. | [I] |
| 2 | Delta Lake Quick Start | https://docs.delta.io/quick-start/ | Delta Lake | tutorial / hands-on | beginner | EN | gratuit | Instalezi `pyspark` + `delta-spark` local și creezi primul tabel Delta. | [I] |
| 3 | Getting Started with Delta Lake | https://delta.io/learn/getting-started | delta.io | tutorial | beginner | EN | gratuit | Traseu introductiv cu articole și tutoriale pas cu pas. | [I] |
| 4 | Delta Lake blog (articole tehnice) | https://delta.io/blog/ | delta.io | tutorial | int–adv | EN | gratuit | Articole practice: liquid clustering, deletion vectors, UniForm, delta-rs. | [C] |
| 5 | Repo Delta Lake (protocol + exemple) | https://github.com/delta-io/delta | Delta Lake | official docs / hands-on | advanced | EN | gratuit, Apache-2.0 | Cod sursă, specificația protocolului (PROTOCOL.md) și exemple. | [C] |
| 6 | delta-rs / Python `deltalake` | https://delta-io.github.io/delta-rs/ | Delta Lake | official docs | intermediate | EN | gratuit, Apache-2.0 | Lucrezi cu tabele Delta din Python fără Spark (pandas/Polars). | [C] |
| 7 | Delta Lake pe Databricks (docs) | https://docs.databricks.com/aws/en/delta/ | Databricks | official docs | int | EN | gratuit | Funcții Delta specifice Databricks: OPTIMIZE, liquid clustering, predictive optimization. | [C] |
| 8 | Delta Lake: The Definitive Guide (O'Reilly, pagină eBook Databricks) | https://www.databricks.com/p/ebook/delta-lake-the-definitive-guide-by-oreilly | Databricks / O'Reilly | open book (vendor e-book) | int–adv | EN | gratuit cu formular (neconfirmat). Ediția din oct. 2024 se vinde la retail. | Cartea de referință despre Delta, scrisă de Denny Lee și alții. | [I], dar gratuitatea neconfirmată |
| 9 | Apache Spark and Delta Lake Under the Hood (mini e-book) | https://www.databricks.com/resources/ebook/apache-spark-delta-lake-under-the-hood | Databricks | open book (vendor e-book) | intermediate | EN | gratuit cu formular | Explicație concisă a funcționării interne Spark și a jurnalului Delta. | [I] |

**Deck `iceberg`: Apache Iceberg**

| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat RO | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Iceberg Documentation (latest) | https://iceberg.apache.org/docs/latest/ | Apache Iceberg (ASF) | official docs | beg–adv | EN | gratuit, Apache-2.0 | Documentația oficială: tabele, partiționare ascunsă, evoluție schemă, cataloage. | [C] |
| 2 | Spark and Iceberg Quickstart (docker-compose) | https://iceberg.apache.org/spark-quickstart/ | ASF | hands-on lab | beginner | EN | gratuit | Pornești Spark + catalog REST + MinIO cu `docker-compose up` și rulezi SQL pe Iceberg. | [I] |
| 3 | Iceberg Table Spec | https://iceberg.apache.org/spec/ | ASF | official docs | advanced | EN | gratuit | Specificația formatului: metadata, manifeste, snapshot-uri, v2/v3. | [C] |
| 4 | Spark DDL / Queries / Writes | https://iceberg.apache.org/docs/latest/spark-ddl/ | ASF | official docs | intermediate | EN | gratuit | Comenzi Spark SQL pentru crearea, interogarea și scrierea tabelelor Iceberg. | [C] |
| 5 | Maintenance (expire snapshots, compaction) | https://iceberg.apache.org/docs/latest/maintenance/ | ASF | official docs | advanced | EN | gratuit | Întreținerea tabelelor: compactare, expirarea snapshot-urilor, orfani. | [C] |
| 6 | PyIceberg | https://py.iceberg.apache.org/ | ASF | official docs | intermediate | EN | gratuit, Apache-2.0 | Bibliotecă Python pentru Iceberg fără JVM. | [C] |
| 7 | docker-spark-iceberg (repo imagine quickstart) | https://github.com/databricks/docker-spark-iceberg | Databricks (ex-Tabular) | hands-on lab | beginner | EN | gratuit, open-source | Imaginea și notebook-urile folosite de quickstart-ul oficial. Repo-ul s-a mutat de la tabular-io la databricks. | [I] |
| 8 | Apache Polaris quickstart (catalog REST Iceberg) | https://polaris.apache.org/docs/quickstart | ASF | hands-on lab | intermediate | EN | gratuit | Rulezi un catalog Iceberg REST open-source local. | [I] |
| 9 | Apache Iceberg: The Definitive Guide (ediție gratuită Dremio) | https://www.dremio.com/guides/apache-iceberg-the-definitive-guide/ | Dremio / O'Reilly | open book (vendor e-book) | int–adv | EN | gratuit cu formular | Carte completă despre arhitectura Iceberg și utilizarea cu Spark și Flink. | [I] |

**Deck `openlake`: Apache Hudi, interoperabilitate și Unity Catalog OSS**

| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat RO | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Hudi Overview | https://hudi.apache.org/docs/overview | Apache Hudi (ASF) | official docs | beginner | EN | gratuit, Apache-2.0 | Prezentarea Hudi: upsert-uri, procesare incrementală, timeline. | [C] |
| 2 | Hudi Spark Quick Start | https://hudi.apache.org/docs/quick-start-guide | ASF | tutorial / hands-on | beginner | EN | gratuit | Pornești `pyspark` cu bundle-ul Hudi și faci insert, update, delete și time travel. | [I] |
| 3 | Hudi Table Types (COW vs MOR) | https://hudi.apache.org/docs/table_types | ASF | official docs | intermediate | EN | gratuit | Diferența dintre Copy-on-Write și Merge-on-Read și tipurile de interogări. | [C] |
| 4 | Hudi Concepts | https://hudi.apache.org/docs/concepts | ASF | official docs | intermediate | EN | gratuit | Timeline, layout de fișiere, indexare. | [C] |
| 5 | Hudi Docker Demo | https://hudi.apache.org/docs/docker_demo | ASF | hands-on lab | int–adv | EN | gratuit | Un demo complet cu Kafka, Spark și Hive în containere. | [C] |
| 6 | Apache XTable (interoperabilitate Delta/Iceberg/Hudi) | https://xtable.apache.org/ | ASF (incubator) | official docs | advanced | EN | gratuit, Apache-2.0 | Traduce metadatele între formatele de tabel deschise. | [C] |
| 7 | Unity Catalog OSS docs | https://docs.unitycatalog.io/ | Unity Catalog (LF AI & Data) | official docs / hands-on | intermediate | EN | gratuit, Apache-2.0 | Catalog open-source pentru tabele Delta/Iceberg și guvernanță, rulabil local. | [C] (proxy 403) |
| 8 | Ghidurile Iceberg/Delta de mai sus | vezi deck-urile delta, iceberg | — | — | — | — | — | Acest deck poate referi resursele Delta și Iceberg pentru comparații. | — |

**Deck `azure`: Databricks și Azure Databricks (Unity Catalog, Lakeflow, Jobs)**

| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat RO | Status |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Azure Databricks documentation | https://learn.microsoft.com/en-us/azure/databricks/ | Microsoft | official docs | beg–adv | EN (și traduceri automate, inclusiv ro-ro) | gratuit | Punctul de intrare oficial pentru Azure Databricks. | [C] (alte pagini din același arbore sunt [I]) |
| 2 | Databricks documentation (AWS) | https://docs.databricks.com/aws/en/ | Databricks | official docs | beg–adv | EN | gratuit | Documentația principală a platformei. Conținutul e în mare parte comun între cloud-uri. | [C] |
| 3 | Unity Catalog (Azure) | https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/ | Microsoft | official docs | intermediate | EN | gratuit | Guvernanță: metastore, catalog.schema.tabel, privilegii, lineage. | [C] |
| 4 | Lakeflow pipelines (fost DLT): ce s-a schimbat | https://learn.microsoft.com/en-us/azure/databricks/ldp/where-is-dlt | Microsoft | official docs | intermediate | EN | gratuit | Explică redenumirea DLT → Lakeflow pipelines și noul modul `pyspark.pipelines`. | [I] |
| 5 | Lakeflow pipelines Python reference | https://docs.databricks.com/aws/en/ldp/developer/python-ref | Databricks | official docs | int–adv | EN | gratuit | Referința API pentru tabele de streaming, materialized views și expectations. | [I] |
| 6 | Lakeflow Jobs | https://learn.microsoft.com/en-us/azure/databricks/jobs/ | Microsoft | official docs | intermediate | EN | gratuit | Orchestrare: task-uri, triggere, parametri, repair runs. | [C] |
| 7 | Renamed and deprecated product names | https://docs.databricks.com/gcp/en/resources/product-name-changes | Databricks | official docs | toate | EN | gratuit | Tabel de corespondență între numele vechi și cele noi (DLT, Workflows etc.). | [I] |
| 8 | Get Started with Databricks Free Edition (curs) | https://www.databricks.com/training/catalog/get-started-with-databricks-free-edition-4486 | Databricks Academy | official free course | beginner | EN | gratuit | Curs de ~30 de minute despre folosirea mediului gratuit Free Edition. | [I] |
| 9 | Databricks Free Edition (mediu practic) | https://www.databricks.com/learn/free-edition | Databricks | hands-on lab | toate | EN | gratuit cu cont, „perpetually free”, cu limite de resurse | Workspace serverless gratuit pentru exerciții cu notebook-uri, SQL, Lakeflow și Unity Catalog. | [C]. Free Edition este confirmat de [blog](https://www.databricks.com/blog/how-teach-databricks-free-edition). |
| 10 | Databricks Self-Paced Training – Free (catalog Academy) | https://customer-academy.databricks.com/learn/public/catalog/view/141 | Databricks Academy | official free course | beg–adv | EN (unele cursuri și în FR, ZH, JA, PT etc.) | gratuit cu cont | Catalogul cursurilor self-paced gratuite (Data Engineer track, Spark, SDP, UC). | [I] |
| 11 | Microsoft Learn: Set up and configure an Azure Databricks environment | https://learn.microsoft.com/en-us/training/paths/azure-databricks-data-engineer-set-up-configure-environment/ | Microsoft Learn | official free course | beg–int | EN (traduceri disponibile) | gratuit | Arhitectură, compute, organizarea Unity Catalog. Aliniat cu DP-750. | [I] |
| 12 | Microsoft Learn: Prepare and process data with Azure Databricks | https://learn.microsoft.com/en-us/training/paths/azure-databricks-data-engineer-prepare-process-data/ | Microsoft Learn | official free course | intermediate | EN | gratuit | Transformare și încărcare de date, constrângeri de calitate. | [I] |
| 13 | Microsoft Learn: Deploy and maintain data pipelines and workloads with Azure Databricks | https://learn.microsoft.com/en-us/training/paths/azure-databricks-data-engineer-deploy-maintain-data-pipelines-workloads/ | Microsoft Learn | official free course | int–adv | EN | gratuit | Lakeflow Jobs, Git, bundles și monitorizare. | [I] |
| 14 | dbdemos (demo-uri instalabile) | https://www.dbdemos.ai/ | Databricks | hands-on lab | int | EN | gratuit (rulează în workspace) | Demo-uri complete instalabile cu o comandă (Lakeflow, UC, streaming). | [C] |
| 15 | Big Book of Data Engineering | https://www.databricks.com/resources/ebook/big-book-of-data-engineering | Databricks | open book (vendor e-book) | int | EN | gratuit cu formular | Colecție de bune practici și arhitecturi lakehouse. | [C] |

### Inferences
- Pentru un cursant fără card de credit, combinația **Databricks Free Edition + cursurile gratuite din Academy + Microsoft Learn** acoperă toată partea practică pentru dbra, dbrp și dp750. Local, Spark, Delta, Iceberg și Hudi se pot rula gratuit cu pip sau Docker.
- În aplicație ar fi bine ca textele să folosească noile nume („Lakeflow pipelines / Spark Declarative Pipelines”, „Lakeflow Jobs”), cu „fost DLT / Workflows” în paranteză, deoarece ghidurile de examen 2026 folosesc terminologia nouă.
- Cărțile O'Reilly „gratuite” sunt oferte promoționale ale vendorilor (cu formular de contact), nu licențe deschise. Ofertele pot expira, așa că trebuie marcate ca „gratuit cu înregistrare, poate expira”.
- Microsoft Learn oferă traduceri automate în română (`/ro-ro/`). Pentru cursanții vorbitori de română, acesta este cel mai bun conținut oficial disponibil în limba lor. Pentru celelalte resurse nu am găsit versiuni în română.

### Gaps
- Niciun URL nu a putut fi încărcat direct (proxy 403 / ENOTFOUND), deci redirecționările nu au putut fi detectate. URL-urile [C] trebuie verificate.
- Nu am confirmat la sursa primară că Spark 4.3.0 este „latest” pe spark.apache.org.
- Nu am confirmat versiunile curente Hudi (1.x) și Delta (4.x) direct din paginile lor.
- Nu am confirmat calea exactă `docs.databricks.com/aws/en/ldp/` ca index (doar subpaginile `ldp/where-is-dlt` și `ldp/developer/python-ref` sunt [I]).
- Nu am verificat existența unor resurse în limba română (în afara traducerilor automate Microsoft Learn).

## Care sunt ghidurile oficiale curente pentru cele trei certificări Databricks (plus DP-750) și ce s-a schimbat recent?

### Takeaway
Toate cele trei examene Databricks au avut ghiduri noi în 2026. **DE Associate** are versiunea din 4 mai 2026: 45 de întrebări, 90 de minute, 200 USD și 7 domenii, cu Lakeflow Jobs și CI/CD ca domenii noi. **DE Professional** are un ghid datat 9 oct. 2026, cu 9 secțiuni și, conform surselor secundare, 60 de întrebări în 120 de minute. **Spark Developer Associate** are 7 domenii, inclusiv Spark Connect și pandas API on Spark. Versiunea de ghid (8 oct. 2026) și formatul (45 de întrebări / 90 de minute) nu sunt confirmate. **DP-750** (Microsoft) este noul examen Azure Databricks Data Engineer Associate, cu 4 arii de competențe. Majoritatea ponderilor provin din surse secundare, fiindcă databricks.com nu a putut fi accesat.

### Cited Findings

**dbra: Databricks Certified Data Engineer Associate**
- Exam page: https://www.databricks.com/learn/certification/data-engineer-associate [C], consistent cu referințele comunitare. — [Databricks Community](https://community.databricks.com/t5/certifications/clarification-on-updated-data-engineering-associate-exam-content/td-p/126760)
- Ghidul oficial este un PDF datat **4 mai 2026**: https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf [I]. Textul extras nu a permis confirmarea directă a ponderilor. — [PDF oficial](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf)
- Format: 45 de întrebări punctate cu alegere multiplă (plus până la 10 nepunctate), 90 de minute, 200 USD, online proctored, valabilitate 2 ani, fără prerechizite (se recomandă ~6 luni de experiență). Pragul de trecere nu e publicat (surse secundare). — [datadriven.io](https://datadriven.io/certifications/databricks-associate); [nicheelab](https://nicheelab.com/en/articles/databricks/data-engineer-associate/); [prepzee](https://prepzee.com/blog/databricks-associate-exam-guide/)
- Domenii (mai 2026, după surse secundare care citează ghidul): Databricks Intelligence Platform 6%, Data Ingestion & Loading 21%, Data Transformation & Modeling 22%, Working with Lakeflow Jobs 16%, Implementing CI/CD 10%, Troubleshooting/Monitoring/Optimization 10%, Governance & Security 15%. Ghidul vechi avea „Databricks Lakehouse Platform” la 24%. — [certify.courses](https://certify.courses/blog/databricks-data-engineer-associate-certification-guide); [addepto](https://addepto.com/blog/databricks-certified-data-engineer-associate-exam-guide/)
- O actualizare anterioară (2025) a schimbat în principal terminologia și a adăugat concepte precum Liquid Clustering, conform unui răspuns pe forumul Databricks. — [Databricks Community](https://community.databricks.com/t5/certifications/clarification-on-updated-data-engineering-associate-exam-content/td-p/126760)

**dbrp: Databricks Certified Data Engineer Professional**
- Exam page: https://www.databricks.com/learn/certification/data-engineer-professional [I]. Pagina listează încă 10 domenii vechi (Developing Code 22%, Cost & Performance 13% ...) și pare rămasă în urmă față de noul ghid. — [rezultat căutare pagină oficială](https://www.databricks.com/learn/certification/data-engineer-professional)
- Ghid nou datat **9 oct. 2026**, cu 9 secțiuni: Developing Code for Data Processing (Python & SQL) 23%, Data Ingestion & Acquisition 12%, Data Manipulation 12%, Monitoring & Alerting 10%, Cost & Performance Optimization 15%, Ensuring Data Security & Compliance 8%, Data Governance 5%, Debugging & Deploying 10%, Data Modeling 5% (surse secundare). — [Coding N Concepts](https://codingnconcepts.com/databricks/databricks-data-engineer-professional-exam-questions/); [Cloudsoft](https://cloudsoftsol.com/blog/databricks-data-engineer-professional-exam-guide)
- Format: 60 de întrebări punctate, 120 de minute. „Data Transformation” a fost redenumit „Data Manipulation”. Versiunea pe care o primești depinde de data programării examenului. — [Daily Debian](https://dailydebian.com/blogs/it-certification-news/databricks-data-engineer-professional-new-exam-october-2026)
- Conflict: certificationpractice.com listează domenii complet diferite (30% Data Processing, 20% Data Modeling...) și este considerat nefiabil. — [certificationpractice](https://certificationpractice.com/exam-overviews/databricks-certified-data-engineer-professional-quick-facts)
- Istoric: în aug.–sept. 2025 a existat un examen beta cu până la 180 de întrebări în 180 de minute, care acoperea Lakeflow Declarative Pipelines, Delta Sharing și Databricks Asset Bundles. Ghidul beta este depășit. — [Ghid beta (community attachment)](https://community.databricks.com/tmcxu86974/attachments/tmcxu86974/databricks-certification-discussion/3478/1/exam_guide.pdf)
- Preț: **neconfirmat** pentru Professional. Istoric era 200 USD, ca la toate examenele Databricks, dar nu am găsit sursă 2026.

**sparkcert: Databricks Certified Associate Developer for Apache Spark**
- Exam page: https://www.databricks.com/learn/certification/apache-spark-developer-associate [C]. Ghidul se descarcă din secțiunea „Getting Ready for the Exam”. Databricks nu oferă un sample exam. — [Databricks Community](https://community.databricks.com/t5/certifications/official-practice-exams-for-databricks-certified-associate/td-p/125642)
- Domenii (sursă secundară): Spark architecture & components 20%, Spark SQL 20%, DataFrame/Dataset API 30%, Troubleshooting & Tuning 10%, Structured Streaming 10%, Spark Connect 5%, Pandas API on Spark 5%. Pass-it.ai confirmă împărțirea 30/20/20. — [brickster.ai](https://www.brickster.ai/articles/spark-developer-associate-cheat-sheet); [pass-it.ai](https://pass-it.ai/certifications/databricks-certified-associate-developer-for-apache-spark/)
- Format: majoritatea surselor indică 45 de întrebări în 90 de minute, dar o sursă spune 60 în 120. Limbaj: Python (PySpark) și Spark SQL. O sursă afirmă că versiunea curentă a fost publicată pe 8 oct. 2026. Toate acestea sunt **neconfirmate**. — [Cloudsoft](https://cloudsoftsol.com/blog/databricks-apache-spark-developer-associate-exam-guide)
- Ghidul oficial nu menționează explicit o versiune Spark (Spark 4 neconfirmat). Examenele mai vechi „Spark 3.0” și „3.5” sunt retrase sau înlocuite. — [brickster.ai](https://www.brickster.ai/articles/spark-developer-associate-cheat-sheet)
- Preț: **neconfirmat** (istoric 200 USD).

**Pregătire gratuită oficială pentru examenele Databricks**
- Databricks oferă cursuri „overview” gratuite pentru certificări, iar Academy are cursuri self-paced gratuite pentru traseul Data Engineer, inclusiv două cursuri SDP. — [Databricks blog: free overview courses](https://www.databricks.com/blog/getting-databricks-certified-now-easier-free-overview-courses); [Community: SDP courses](https://community.databricks.com/t5/community-articles/learn-databricks-apache-spark-declarative-pipelines-from/td-p/168931)
- Hub-ul de certificări: https://www.databricks.com/learn/training/certification [I]. — [Databricks Certification](https://www.databricks.com/learn/training/certification)

**dp750: Microsoft DP-750, Implementing Data Engineering Solutions Using Azure Databricks**
- Study guide oficial: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-750 [I]. Certificarea se numește „Microsoft Certified: Azure Databricks Data Engineer Associate”. — [Microsoft Learn study guide](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-750)
- Arii de competențe: Set up & configure an Azure Databricks environment 15–20%, Secure & govern Unity Catalog objects 15–20%, Prepare & process data 30–35%, Deploy & maintain data pipelines and workloads 30–35%. Data este în conflict: ghidul englez arată „as of March 11, 2026”, dar ExamCollection și versiunea NL indică o actualizare aplicabilă din 19 oct. 2026. — [Microsoft Learn](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-750); [NL study guide](https://learn.microsoft.com/nl-nl/credentials/certifications/resources/study-guides/dp-750); [ExamCollection](https://www.examcollection.com/blog/microsoft-dp-750-certification-path/)
- Curs oficial DP-750T00-A: 4 zile, nivel intermediar, cu trasee Learn gratuite asociate. Laboratoarele (scenariul „CityMoves Transit”) sunt pe GitHub-ul MicrosoftLearning. — [Course DP-750T00-A](https://learn.microsoft.com/en-us/training/courses/dp-750t00); [Q&A datasets](https://learn.microsoft.com/en-us/answers/questions/6064782/practise-datasets-mentioned-in-dp-750-course)
- Profil: SQL și Python (fără Scala), Git/SDLC, Microsoft Entra, Azure Data Factory, Azure Monitor. Scorul de trecere este 700 (standard Microsoft). Numărul de întrebări, durata și prețul **nu sunt confirmate**. — [alexcole.net](https://www.alexcole.net/dp-750-azure-databricks-data-engineer-resource-guide/); [mscertquiz](https://mscertquiz.com/blog/dp-750-study-guide)

### Inferences
- Schimbarea dominantă în 2026 este trecerea la terminologia Lakeflow (Jobs, pipelines), adăugarea CI/CD și bundles la Associate, plus o restructurare și scurtare a Professional (de la 10 la 9 secțiuni, posibil 60 de întrebări în 120 de minute).
- Aplicația ar trebui să afișeze data ghidului și un avertisment de tipul „verifică pagina oficială înainte de programare”, deoarece versiunea depinde de data examenului.

### Gaps
- Nu am putut deschide PDF-urile oficiale (databricks.com inaccesibil). Ponderile pentru dbra, dbrp și sparkcert provin din surse secundare concordante.
- URL-urile exacte ale PDF-urilor pentru Professional (oct. 2026) și Spark (oct. 2026) nu au fost găsite.
- Prețul curent pentru dbrp și sparkcert, plus durata, numărul de întrebări și prețul DP-750, nu sunt confirmate.
- Nu este clar dacă Spark Developer Associate mai are și varianta Scala.

## Ce cărți și tutoriale gratuite sau cu licență deschisă sunt reputabile, și ce resurse sunt practice și rulabile gratuit?

### Takeaway
Nu am găsit cărți cu licență deschisă propriu-zisă (de ex. CC BY) pentru aceste subiecte. Resursele reputabile gratuite sunt e-book-uri promoționale ale vendorilor (Learning Spark 2e de la Databricks, Iceberg Definitive Guide de la Dremio, mini-e-book-uri Databricks) și documentația oficială Apache-2.0. Pentru exerciții practice gratuite există Databricks Free Edition, quickstart-urile Docker pentru Iceberg și Hudi și `pip install pyspark delta-spark` local.

### Cited Findings
- Learning Spark 2e (Damji, Wenig, Das, Lee) a fost oferită complet gratuit de Databricks în 2020. Oferta poate fi expirată, deși există o copie găzduită pe TechRepublic (actualizată în 2022). — [Databricks download page](https://pages.databricks.com/202003-US-EB-Learning-Spark-2nd-Edition_01_Downloadpage.html); [TechRepublic](https://www.techrepublic.com/resource-library/big-data/download-the-new-edition-of-learning-spark-from-o-reilly/)
- Apache Iceberg: The Definitive Guide (Shiran, Hughes, Merced) este gratuită pe Dremio, fără card. — [Dremio](https://www.dremio.com/guides/apache-iceberg-the-definitive-guide/)
- Delta Lake: The Definitive Guide (O'Reilly, oct. 2024, 382 de pagini). Pagina Databricks are formular „Get the eBook”, dar accesul gratuit complet nu e confirmat. Early release-ul gratuit din 2021 era doar un preview. — [Databricks eBook page](https://www.databricks.com/p/ebook/delta-lake-the-definitive-guide-by-oreilly); [O'Reilly](https://www.oreilly.com/library/view/-/9781098151935/); [Databricks blog 2021](https://www.databricks.com/de/blog/2021/06/22/get-your-free-copy-of-delta-lake-the-definitive-guide-early-release.html)
- Mini-e-book gratuit „Apache Spark and Delta Lake Under the Hood”. — [Databricks](https://www.databricks.com/resources/ebook/apache-spark-delta-lake-under-the-hood)
- Iceberg quickstart: `docker-compose up` cu imaginea tabulario/spark-iceberg (Spark + catalog preconfigurat), apoi `docker exec -it spark-iceberg spark-sql`. Repo-ul a ajuns la databricks/docker-spark-iceberg. — [Iceberg quickstart](https://iceberg.apache.org/spark-quickstart/); [GitHub](https://github.com/databricks/docker-spark-iceberg); [Docker Hub](https://hub.docker.com/r/tabulario/spark-iceberg)
- Hudi quickstart: `pyspark`/`spark-shell` cu pachetul `hudi-spark$SPARK_VERSION-bundle` și Kryo serializer. — [Hudi Quick Start](https://hudi.apache.org/docs/quick-start-guide)
- Delta quickstart: `pip install pyspark==<versiune compatibilă>` plus pachetul Delta. — [Delta Quick Start](https://docs.delta.io/quick-start/)
- Databricks Free Edition este „perpetually free”, iar ghidul pentru profesori asociază Lakeflow/SDP cu cursurile de data engineering. Academy are un curs gratuit de ~30 de minute despre Free Edition. — [How to teach with Databricks Free Edition](https://www.databricks.com/blog/how-teach-databricks-free-edition); [curs Free Edition](https://www.databricks.com/training/catalog/get-started-with-databricks-free-edition-4486)
- Laboratoarele DP-750 (notebook-uri și dataset-uri) sunt publicate de MicrosoftLearning pe GitHub. — [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/6064782/practise-datasets-mentioned-in-dp-750-course)
- Trebuie evitate site-urile de tip „dumps” (examcollection VCE, dumpsgate, p2pexams, certempire), care pretind că au întrebări reale de examen. Acestea încalcă acordurile de examen. — [ex. examcollection](https://www.examcollection.com/databricks/testking.certified-associate-developer-for-apache-spark.32528.vce.file.html)

### Inferences
- Mapare rulabilă gratuit: spark → pip/Docker local; delta → pip `delta-spark`; iceberg → docker-compose; openlake → Hudi bundle și Unity Catalog OSS local; azure, dbra, dbrp, sparkcert → Databricks Free Edition; dp750 → Microsoft Learn sandbox/labs (un abonament Azure poate fi necesar pentru unele laboratoare, neconfirmat).
- Mapare deck → examene: sparkcert ← spark (1–8, 9–11); dbra ← azure (2–10, 14), delta (1, 7); dbrp ← azure (toate), delta (5, 7, 8), spark (6); dp750 ← azure (1, 3, 4, 6, 11–13) și study guide DP-750.

### Gaps
- Nu am găsit niciun manual relevant cu licență Creative Commons.
- Nu am verificat dacă ofertele gratuite Learning Spark și Delta Definitive Guide mai sunt active în nov. 2026.
- Limitele exacte ale Free Edition (compute, cote) nu au fost verificate.
- Numărul curent de cursuri gratuite din Academy și titlurile lor exacte pentru fiecare examen nu au fost confirmate.

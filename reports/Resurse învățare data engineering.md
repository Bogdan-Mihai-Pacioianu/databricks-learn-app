# Construiți biblioteca DataEng Learn pe surse oficiale

Fiecare domeniu din DataEng Learn are deja material gratuit și autoritar. Coloana vertebrală este formată din documentația oficială a proiectelor (Apache Spark, Delta, Iceberg, Kafka, Airflow, PostgreSQL, Parquet etc.), traseele gratuite ale vendorilor (Databricks Academy și Free Edition, Microsoft Learn, Google Skills, Snowflake Hands-On Essentials, Confluent Developer, dbt Learn, HashiCorp Developer) și câteva cărți și cursuri cu licență deschisă: *Database Design 2e* (CC BY 4.0), OpenStax Statistics (CC BY 4.0), CMU 15-445, MIT 6.5840 și notele Kleppmann (CC BY-SA). Certificările s-au schimbat mult în 2026. Databricks DE Associate are ghid nou din 4 mai 2026, cu Lakeflow Jobs și CI/CD ca domenii noi. DE Professional are ghid nou din 9 octombrie 2026. DP-750 (Azure Databricks) a apărut în martie 2026. DP-203 este retras din 31 martie 2025. SnowPro Core a trecut la COF-C03 pe 16 februarie 2026. Tot în 2026, aplicația trebuie să reflecte redenumirile Databricks (DLT → Lakeflow pipelines, Workflows → Lakeflow Jobs), Kafka 4.x fără ZooKeeper, Airflow 3, pandas 3.0, Soda Core 4 și Terraform Associate 004. **Avertisment esențial:** rețeaua mediului de cercetare a blocat accesul direct la aproape toate site-urile sursă, deci aproape niciun URL din acest raport nu a fost încărcat efectiv. Fiecare link poartă un marcaj de verificare, iar înainte de publicare este obligatorie o verificare automată a linkurilor. Integrarea trebuie să rămână bazată pe linkuri, cu rezumate originale în română, pentru că licențele cursurilor și cărților terțe nu permit copierea conținutului în aplicație.

## Aproape niciun link nu a fost încărcat: cum citiți marcajele

Echipa de cercetare a lucrat pe 19 noiembrie 2026 într-un mediu cu listă de gazde permise foarte restrictivă. `curl` a primit `CONNECT tunnel failed, response 403` pentru practic toate gazdele, iar WebFetch a dat `ENOTFOUND`. Au fost blocate, printre altele, spark.apache.org, docs.databricks.com, learn.microsoft.com, docs.aws.amazon.com, skillbuilder.aws, learn.snowflake.com, docs.cloud.google.com, kafka.apache.org, opentextbc.ca, openstax.org, sre.google și github.com. Doar trei resurse au fost încărcate efectiv: pagina de certificare Google Professional Data Engineer, PDF-ul lucrării Kafka găzduit de Microsoft Research și repo-ul DataTalksClub Data Engineering Zoomcamp. În plus, s-a observat direct o redirecționare: `cloud.google.com/<produs>/docs/...` răspunde cu **301 către `docs.cloud.google.com/...`**.

Fiecare echipă a folosit propria notație. Le-am unificat astfel, păstrând sensul original al fiecărui marcaj:

| Marcaj în raport | Semnificație | Marcaje originale echivalente |
|---|---|---|
| **[V]** | Încărcat și citit în sesiune (HTTP 200) | V, V200, F |
| **[R]** | Redirecționare observată direct; în tabel apare ținta | R |
| **[S]** | URL-ul exact (sau forma lui canonică) a apărut în rezultatele căutării web din noiembrie 2026. Probabil există, dar nu s-a verificat HTTP 200 și nici dacă redirecționează | I (indexat), IDX, S |
| **[M]** | Din memorie sau construit după structura cunoscută a site-ului. **Neconfirmat în sesiune** | C (construit), NV, U, K |
| **[!]** | Problemă cunoscută: închis, mutat sau cu condiții | ! |

Concluzia practică: un marcaj [S] arată că pagina există, nu că linkul e corect la byte. Un marcaj [M] trebuie tratat ca ipoteză. Înainte de livrare, aplicația are nevoie de un pas automat de verificare (de ex. `curl -sIL` sau un link-checker în CI). Pasul trebuie să înregistreze codul HTTP și URL-ul final după redirecționări, să rescrie în catalog URL-urile canonice și să ruleze periodic. Pentru ca verificarea să funcționeze din mediul de lucru, gazdele de mai sus trebuie permise în setările de rețea ale sesiunii. Cele mai expuse la redirecționări sunt căile Kafka (noua structură versionată `/44/...`), subpaginile Confluent, domeniul dbt Learn (learn.getdbt.com vs courses.getdbt.com), căile MDN restructurate (`/Guides/`, `/Reference/`), Cloudflare Learning Center (posibil mutat la developers.cloudflare.com/internet), Google Skills (fost Cloud Skills Boost) și Snowflake Quickstarts.

**Licențe și model de integrare.** Aproape nimic din această listă nu poate fi copiat în aplicație. Kimball Group este „free to read”, dar cu toate drepturile rezervate. *The Linux Command Line* este CC BY-NC-ND, iar MIT OCW și *Python Packages* au clauze NC sau ND. Cărțile O'Reilly „gratuite” sunt oferte promoționale ale vendorilor, cu formular, nu licențe deschise. Documentația Microsoft, AWS și Google este gratuită la citit, dar proprietară. Chiar și conținutul CC BY sau CC BY-SA (OpenStax, BCcampus, Wikipedia, MDN, notele Kleppmann) cere atribuire și, pentru BY-SA, aceeași licență pentru derivate. Modelul corect este deci o **bibliotecă de linkuri cu rezumate originale în română**: titlu, furnizor, tip, nivel, cost, marcaj de verificare și un rezumat RO scris de echipă. Pentru română, materialul oficial e rar. Există traducerea parțială oficială a tutorialului Python ([docs.python.org/ro](https://docs.python.org/ro/3/tutorial/) [S]), interfața ro-ro a Microsoft Learn (se înlocuiește `/en-us/` cu `/ro-ro/`, dar conținutul poate fi traducere automată sau fallback în engleză) și textul GDPR pe EUR-Lex [M]. Restul este în engleză.

## Certificările s-au rescris în 2026: faptele de afișat în aplicație

Schimbarea dominantă a anului este trecerea Databricks la terminologia Lakeflow și adăugarea CI/CD și bundles în examene. Microsoft a lansat un examen dedicat Azure Databricks, iar Snowflake a trecut la o nouă versiune Core. Ponderile Databricks provin mai ales din surse secundare concordante, pentru că PDF-urile oficiale nu au putut fi deschise. De aceea, aplicația ar trebui să afișeze data ghidului și avertismentul „verifică pagina oficială înainte de programare”.

| Examen (id aplicație) | Stare la nov. 2026 | Format și cost | Domenii / ponderi | Grad de confirmare |
|---|---|---|---|---|
| Databricks DE Associate (`dbra`) | Activ. Ghid din **4 mai 2026** | 45 întrebări punctate (+ până la 10 nepunctate), 90 min, 200 USD, valabil 2 ani | Platform 6%, Ingestion & Loading 21%, Transformation & Modeling 22%, **Lakeflow Jobs 16%**, **CI/CD 10%**, Troubleshooting/Optimization 10%, Governance & Security 15% | Ponderi și format din surse secundare |
| Databricks DE Professional (`dbrp`) | Activ. Ghid nou din **9 oct. 2026**, 9 secțiuni | 60 întrebări, 120 min. Preț neconfirmat (istoric 200 USD) | Developing Code 23%, Ingestion 12%, Data Manipulation 12%, Monitoring 10%, Cost & Performance 15%, Security & Compliance 8%, Governance 5%, Debugging & Deploying 10%, Data Modeling 5% | Secundar. Pagina oficială afișează încă cele 10 domenii vechi |
| Databricks Spark Developer Associate (`sparkcert`) | Activ. Versiune (8 oct. 2026) neconfirmată | Probabil 45 întrebări / 90 min (o sursă spune 60 / 120). Python + Spark SQL | Architecture 20%, Spark SQL 20%, DataFrame API 30%, Troubleshooting & Tuning 10%, Structured Streaming 10%, **Spark Connect 5%**, **pandas API on Spark 5%** | Secundar. Versiunea Spark și varianta Scala neconfirmate |
| Microsoft DP-700 (`dp700`) | Activ (Fabric Data Engineer Associate) | 100 min; reînnoire anuală gratuită; evaluare de practică gratuită | 3 × 30–35%: implementare și gestionare, ingestie și transformare, monitorizare și optimizare | Domenii din ghid [S]. Data „as of” neconfirmată (26 ian / 20 apr / 21 iul / 19 oct 2026) |
| Microsoft DP-750 (`dp750`) | Nou, beta din martie 2026. Statut GA disputat | Prag de trecere 700. Durata (~100 min) și prețul (165 USD) doar din surse terțe | Setup 15–20%, Unity Catalog 15–20%, Prepare & process 30–35%, Pipelines & workloads 30–35% | Ponderi concordante în mai multe surse. Data ghidului în conflict (11 mar vs 19 oct 2026) |
| Microsoft DP-203 (`dp203`) | **Retras pe 31 martie 2025**, inclusiv reînnoirea. Cursul DP-203T00 retras (ILT până la 31 dec 2025) | — | Succesori: DP-700 (Fabric) și DP-750 (Azure Databricks) | Pagina oficială de reînnoire [S] |
| AWS DEA-C01 (`awsdea`) | Activ | 65 întrebări, 130 min, 150 USD (prețul neconfirmat oficial), prag 720/1000 (doar terți) | Ingestion & Transformation 34%, Store Management 26%, Operations & Support 22%, Security & Governance 18% | Ponderi din ghidul oficial indexat |
| Google Professional Data Engineer (`gcppde`) | Activ | **2 h, 40–50 întrebări, 200 USD**, EN/JA, valabil 2 ani; reînnoire 1 h, 20 întrebări, 100 USD | Design ~22%, Ingest & process ~25%, Store ~20%, Prepare & use ~15%, Maintain & automate ~18% | Format **[V]**. Ponderile secțiunilor 3–5 doar din terți |
| SnowPro Core (`snowcore`) | **COF-C03 din 16 feb 2026** (înlocuiește COF-C02). Variante ESP/KOR/JPN din 30 mar 2026 | 100 întrebări, 115 min, 175 USD, prag 750 (toate neconfirmate oficial) | 5 domenii (față de 6); primul, „AI Data Cloud Features & Architecture”, ~31% | Numele și ponderile domeniilor 2–5 neconfirmate |

Detaliile Databricks: noul ghid Associate este un PDF datat 4 mai 2026 ([PDF oficial](https://www.databricks.com/sites/default/files/2026-03/databricks-certified-data-engineer-associate-exam-guide-may-4-2026.pdf) [S]). Ponderile vin din [certify.courses](https://certify.courses/blog/databricks-data-engineer-associate-certification-guide) și [addepto](https://addepto.com/blog/databricks-certified-data-engineer-associate-exam-guide/). Ghidul vechi avea „Databricks Lakehouse Platform” la 24%, iar noul ghid a coborât platforma la 6% în favoarea operațiunilor. Pentru Professional, structura cu 9 secțiuni și formatul 60/120 vin de la [Coding N Concepts](https://codingnconcepts.com/databricks/databricks-data-engineer-professional-exam-questions/) și [Daily Debian](https://dailydebian.com/blogs/it-certification-news/databricks-data-engineer-professional-new-exam-october-2026). Ultima notează că „Data Transformation” a devenit „Data Manipulation” și că versiunea primită depinde de data programării. Pagina oficială a examenului ([databricks.com](https://www.databricks.com/learn/certification/data-engineer-professional) [S]) listează încă cele 10 domenii vechi, deci a rămas în urmă. Un site (certificationpractice.com) dă domenii complet diferite și trebuie ignorat. Ghidul beta din 2025 (180 de întrebări) este depășit. Pentru Spark Developer, ponderile vin de la [brickster.ai](https://www.brickster.ai/articles/spark-developer-associate-cheat-sheet), iar împărțirea 30/20/20 e confirmată de [pass-it.ai](https://pass-it.ai/certifications/databricks-certified-associate-developer-for-apache-spark/). Databricks nu oferă sample exam oficial ([Community](https://community.databricks.com/t5/certifications/official-practice-exams-for-databricks-certified-associate/td-p/125642)), dar are cursuri „overview” gratuite pentru certificări ([blog Databricks](https://www.databricks.com/blog/getting-databricks-certified-now-easier-free-overview-courses)).

Pentru Microsoft, ghidul DP-750 ([Learn](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-750) [S]) duce la certificarea „Microsoft Certified: Azure Databricks Data Engineer Associate”, anunțată pe [Tech Community](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-azure-databricks-data-engineer-associate-certification/4494114) [S]. Evaluarea de practică gratuită e găzduită pe AI Skills Navigator și necesită autentificare. Statutul beta/GA rămâne disputat: [aguidetocloud](https://www.aguidetocloud.com/cert-tracker/dp-750/) spune „beta fără dată GA”, iar [clearcatnet](https://www.clearcatnet.com/blog/dp750-certification-guide-2026) spune „GA, beta încheiat în mai 2026”. Niciuna nu citează Microsoft, deci aplicația ar trebui să afișeze „beta/GA de confirmat”. Retragerea DP-203 este confirmată pe [pagina de reînnoire](https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/renew) [S], iar calendarul cursului pe [Tech Community](https://techcommunity.microsoft.com/blog/iltcommunicationblog/dp-203t00-available-for-ilt-until-december-31st-2025/4397741) [S]. În aplicație, `dp203` devine arhivă istorică cu trimitere spre `dp700` și `dp750`.

Pentru celelalte cloud-uri, faptele Google sunt singurele verificate direct, pe [pagina certificării PDE](https://cloud.google.com/learn/certification/data-engineer) [V]. Formularul gratuit de întrebări-exemplu legat de acolo este singura resursă oficială de practică complet gratuită confirmată dintre cele trei. AWS are un ghid HTML detaliat ([docs.aws](https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.html) [S]). Setul oficial de 20 de întrebări din Skill Builder era istoric gratuit, dar o sursă îl plasează într-un curs pe abonament ([Class Central](https://classcentral.com/course/exam-prep-official-practice-question-set-aws-certified-data-engineer-associate-dea-c01-english-264809)), așa că nu trebuie etichetat „gratuit” până la verificare. COF-C03 apare pe [pagina Snowflake](https://learn.snowflake.com/en/certifications/snowpro-core-c03) [S]. Formatul vine doar de la [aguidetocloud](https://www.aguidetocloud.com/cert-tracker/snowpro-core/) și [open-exam-prep](https://open-exam-prep.com/blog/snowpro-core-certification-exam-guide-2026). Nu există întrebări oficiale gratuite de practică pentru SnowPro, iar unele pagini terțe descriu încă 6 domenii, ceea ce e învechit.

Certificările adiacente arată un tipar comun: cursurile sunt gratuite, examenul se plătește. Terraform Associate **004** testează Terraform 1.12, iar **003 a fost retras pe 8 ianuarie 2026**. Traseul și întrebările-exemplu sunt gratuite ([HashiCorp](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-study-004) [S]). Certificările Astronomer Airflow 3 au 75 de întrebări, 60 de minute, prag 70% și costă **150 USD**, cu vouchere gratuite doar la evenimente ([Astronomer](https://astronomer.io/certification) [S]). Singura insignă oficială complet gratuită este **dbt Fundamentals**, acordată după curs și quiz ([dbt Learn](https://getdbt.com/dbt-learn) [S]), deși forumul raportează întârzieri la emitere ([Discourse](https://discourse.getdbt.com/t/dbt-fundamentals/20441)). Site-urile de tip „exam dump” (examcollection VCE, dumpsgate, p2pexams, certempire, passitexams) încalcă acordurile de examen și trebuie excluse explicit.

## Redenumirile și versiunile pe care conținutul aplicației trebuie să le reflecte

Cel mai mare risc de conținut învechit vine din redenumiri, nu din tehnologie nouă. Documentația Databricks spune explicit că **„Delta Live Tables (DLT) is now Lakeflow pipelines”**. Codul existent funcționează fără migrare, dar modulul Python `dlt` este înlocuit de **`pyspark.pipelines`**, iar SKU-urile și schemele event log încă poartă „dlt” ([What happened to DLT?](https://docs.databricks.com/aws/en/ldp/where-is-dlt) [S]). Tabelul oficial de redenumiri stabilește „Lakeflow pipeline” ca nume curent (foste: DLT, Lakeflow Declarative Pipelines) și **„Lakeflow Jobs”** pentru fostele Workflows/Jobs. Echivalentul open-source este Apache Spark Declarative Pipelines (SDP) ([Renamed and deprecated product names](https://docs.databricks.com/gcp/en/resources/product-name-changes) [S]). Catalogul Academy folosește încă și varianta „Lakeflow Spark Declarative Pipelines” ([Academy](https://customer-academy.databricks.com/learn/public/catalog/view/141) [S]). Recomandarea este ca aplicația să folosească numele noi, cu „(fost DLT / Workflows)” în paranteză, fiindcă ghidurile de examen din 2026 folosesc terminologia nouă.

Versiunile din ecosistemul Spark au nevoie de prudență. O știre secundară anunță **Spark 4.3.0 pe 30 octombrie 2026** ([letsdatascience](https://letsdatascience.com/news/apache-spark-project-releases-version-430-978a19cf)), dar catalogul de release-uri Apache arăta 4.1.2 ([release catalog](https://release-catalog.apache.org/spark/4.1.2/index.html)). [endoflife.date](https://endoflife.date/apache-spark) listează patch-urile 4.2.1, 4.1.4 și 4.0.5, iar politica de versiuni spune că de la 4.3.0 lansările devin trimestriale și 4.5.0 va fi ultima din seria 4.x ([Spark versioning policy](https://spark.apache.org/versioning-policy.md)). Aplicația ar trebui deci să spună „Spark 4.x” fără să fixeze o versiune minoră. Quickstart-ul Delta folosește `delta-spark` 4.0.0, iar vechiul artefact `delta-core` este învechit ([Delta Quick Start](https://docs.delta.io/quick-start/) [S]). Quickstart-ul Iceberg folosește Iceberg 1.11 pe Spark 4.1 ([Iceberg quickstart](https://iceberg.apache.org/spark-quickstart/) [S]), iar repo-ul imaginii Docker s-a mutat de la tabular-io la [databricks/docker-spark-iceberg](https://github.com/databricks/docker-spark-iceberg) [S]. Ghidul Structured Streaming a fost împărțit în mai multe pagini sub `docs/latest/streaming/`; forma pe o singură pagină există până la 3.5.x ([Spark 3.5.7](https://spark.apache.org/docs/3.5.7/structured-streaming-programming-guide.html) [S]).

În streaming și orchestrare, **Kafka 4.0 este „prima versiune majoră care funcționează complet fără Apache ZooKeeper”**: KRaft e singurul mod, iar migrarea trece prin 3.9 ca versiune-punte ([anunț Kafka 4.0](https://kafka.apache.org/blog/2025/03/18/apache-kafka-4.0.0-release-announcement/) [S]). Documentația are acum o structură versionată, până la `/44/` ([zk2kraft 4.4](https://kafka.apache.org/44/getting-started/zk2kraft/) [S]). Airflow este la 3.x, cu importuri din `airflow.sdk` și documentație până la 3.3.2 ([TaskFlow tutorial](https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html) [S]). În IaC, OpenTofu (MPL 2.0) a ajuns la 1.12 (14 mai 2026) și 1.13 (30 septembrie 2026) ([InfoQ](https://infoq.com/news/2026/05/opentofu-release-terraform); [AlternativeTo](https://alternativeto.net/news/2026/10/opentofu-1-13-adds-windows-arm64-and-planning-functions/)). Ca alternativă open-source la Terraform, merită un loc în pachetul `iac`.

În Python și calitatea datelor, **pandas 3.0 (21 ianuarie 2026)** activează implicit Copy-on-Write și tipul `str`, cere Python ≥ 3.11 și recomandă trecerea prin 2.3 pentru a vedea avertismentele de depreciere ([what's new 3.0](https://pandas.pydata.org/docs/whatsnew/v3.0.0.html) [S]). Cartea gratuită a lui Wes McKinney precedă 3.0, deci trebuie însoțită de pagina de noutăți. **Soda Core 4** (prima versiune publică 4.0.5, 28 ianuarie 2026) este reconstruit în jurul contractelor de date în YAML, iar documentația v3 e legacy ([note de lansare Soda](https://docs.soda.io/soda-v4/release-notes/soda-core-release-notes) [S]). Pentru Great Expectations, linkurile trebuie să țintească GX Core 1.x, nu paginile 0.x care încă apar în căutare ([Try GX Core](https://docs.greatexpectations.io/docs/core/introduction/try_gx/) [S]). Toate trei sunt bune candidate pentru pachetul `capcane`.

Mediile practice s-au mutat și ele. Play with Docker/Kubernetes au anunțat indisponibilitate **de la 1 martie 2026** ([forum Docker](https://forums.docker.com/t/labs-play-with-docker-com-is-down/150915/2)), iar Katacoda este închis din 2023 ([blog Kubernetes](https://kubernetes.io/blog/2023/02/14/kubernetes-katacoda-tutorials-stop-from-2023-03-31/)). Ambele trebuie marcate [!]. Killercoda (cont gratuit) devine laboratorul implicit pentru Docker, Linux și Kubernetes. Google Cloud Skills Boost devine **„Google Skills” (skills.google)** ([blog Google Cloud](https://cloud.google.com/blog/topics/training-certifications/google-skills-new-home-AI-learning)), iar documentația Google se servește din `docs.cloud.google.com` [R]. Snowflake Quickstarts au trecut la `snowflake.com/en/developers/guides/` [S], cu URL-urile vechi încă indexate. Tutorialul SQL de la Mode afișează un banner de achiziție ThoughtSpot ([Mode](https://mode.com/sql-tutorial/sql-select-statement)), un risc pentru disponibilitatea pe termen lung, așa că merită o alternativă (pgexercises).

## Catalogul recomandat, pachet cu pachet

Tabelele de mai jos sunt selecția de bază pentru fiecare pachet al aplicației, cu marcajul de verificare păstrat. Notele de cercetare conțin liste mai lungi, de 8–15 intrări per pachet, cu rezumate RO deja scrise. Dacă nu se specifică altfel, limba este EN, iar costul este gratuit.

### Spark, formate de tabel și Databricks (spark, delta, iceberg, openlake, azure)

Pentru un cursant fără card de credit, combinația **Databricks Free Edition + cursurile gratuite din Databricks Academy + Microsoft Learn** acoperă toată partea practică pentru `dbra`, `dbrp`, `sparkcert` și `dp750`. Free Edition este descris ca „perpetually free” ([blog Databricks](https://www.databricks.com/blog/how-teach-databricks-free-edition)), dar limitele exacte de resurse nu au fost verificate. Spark, Delta, Iceberg și Hudi rulează gratuit și local, prin pip sau Docker. Nu am găsit niciun manual relevant cu licență Creative Commons: cărțile „gratuite” sunt e-book-uri promoționale ale vendorilor, care trebuie etichetate „gratuit cu înregistrare, poate expira”.

| Pachet | Resursă | URL | Tip / nivel | Marcaj |
|---|---|---|---|---|
| spark | Spark Documentation (latest) | https://spark.apache.org/docs/latest/ | docs, B–A | [M] |
| spark | PySpark docs (Getting Started, User Guide) | https://spark.apache.org/docs/latest/api/python/index.html | docs, B–I | [M] |
| spark | Spark SQL, DataFrames and Datasets Guide | https://spark.apache.org/docs/latest/sql-programming-guide.html | docs, I | [M] |
| spark | Performance Tuning (AQE, join hints) | https://spark.apache.org/docs/latest/sql-performance-tuning.html | docs, A | [M] |
| spark | Spark Connect Overview (în examen, ~5%) | https://spark.apache.org/docs/latest/spark-connect-overview.html | docs, I | [M] |
| spark | Introduction to Apache Spark Architecture (Academy) | https://customer-academy.databricks.com/learn/course/112/introduction-to-apache-spark-architecture | curs gratuit cu cont, B | [S] |
| spark | Learning Spark 2e (e-book Databricks/O'Reilly, ofertă din 2020, poate fi expirată; acoperă Spark 3.0) | https://pages.databricks.com/202003-US-EB-Learning-Spark-2nd-Edition_01_Downloadpage.html | carte vendor, B–I | [S], disponibilitate neconfirmată |
| delta | Delta Lake documentation | https://docs.delta.io | docs, B–A | [S] |
| delta | Delta Lake Quick Start (`delta-spark`) | https://docs.delta.io/quick-start/ | lab, B | [S] |
| delta | delta-rs / `deltalake` (Delta fără Spark) | https://delta-io.github.io/delta-rs/ | docs, I | [M] |
| delta | Apache Spark and Delta Lake Under the Hood | https://www.databricks.com/resources/ebook/apache-spark-delta-lake-under-the-hood | e-book cu formular, I | [S] |
| delta | Delta Lake: The Definitive Guide (gratuitatea neconfirmată) | https://www.databricks.com/p/ebook/delta-lake-the-definitive-guide-by-oreilly | e-book vendor, I–A | [S] |
| iceberg | Spark and Iceberg Quickstart (docker-compose) | https://iceberg.apache.org/spark-quickstart/ | lab, B | [S] |
| iceberg | Iceberg Table Spec | https://iceberg.apache.org/spec/ | spec, A | [M] |
| iceberg | Apache Polaris quickstart (catalog REST) | https://polaris.apache.org/docs/quickstart | lab, I | [S] |
| iceberg | Apache Iceberg: The Definitive Guide (Dremio, gratuit cu formular) | https://www.dremio.com/guides/apache-iceberg-the-definitive-guide/ | e-book vendor, I–A | [S] |
| openlake | Hudi Spark Quick Start | https://hudi.apache.org/docs/quick-start-guide | lab, B | [S] |
| openlake | Hudi Table Types (COW vs MOR) | https://hudi.apache.org/docs/table_types | docs, I | [M] |
| openlake | Apache XTable (interoperabilitate) | https://xtable.apache.org/ | docs, A | [M] |
| openlake | Unity Catalog OSS | https://docs.unitycatalog.io/ | docs, I | [M] |
| azure | Databricks Free Edition | https://www.databricks.com/learn/free-edition | lab gratuit cu cont | [M] (produsul confirmat de blog) |
| azure | Get Started with Databricks Free Edition (~30 min) | https://www.databricks.com/training/catalog/get-started-with-databricks-free-edition-4486 | curs, B | [S] |
| azure | Databricks Self-Paced Training – Free (catalog Academy) | https://customer-academy.databricks.com/learn/public/catalog/view/141 | curs, B–A | [S] |
| azure | Lakeflow pipelines: ce s-a schimbat (Azure) | https://learn.microsoft.com/en-us/azure/databricks/ldp/where-is-dlt | docs, I | [S] |
| azure | Lakeflow pipelines Python reference | https://docs.databricks.com/aws/en/ldp/developer/python-ref | docs, I–A | [S] |
| azure | Unity Catalog (Azure) | https://learn.microsoft.com/en-us/azure/databricks/data-governance/unity-catalog/ | docs, I | [M] |
| azure | Learn: Set up and configure an Azure Databricks environment | https://learn.microsoft.com/en-us/training/paths/azure-databricks-data-engineer-set-up-configure-environment/ | traseu, B–I | [S] |
| azure | Learn: Prepare and process data with Azure Databricks | https://learn.microsoft.com/en-us/training/paths/azure-databricks-data-engineer-prepare-process-data/ | traseu, I | [S] |
| azure | Learn: Deploy and maintain data pipelines and workloads | https://learn.microsoft.com/en-us/training/paths/azure-databricks-data-engineer-deploy-maintain-data-pipelines-workloads/ | traseu, I–A | [S] |
| azure | dbdemos (demo-uri instalabile) | https://www.dbdemos.ai/ | lab, I | [M] |
| dp750 | Course DP-750T00-A (traseele self-paced sunt gratuite; ILT plătit) | https://learn.microsoft.com/en-us/training/courses/dp-750t00 | curs, I | [S] |

### Platforma Microsoft (fabric, kql, bi, azure, kafka/Event Hubs)

Pentru Fabric, punctul de pornire este trial-ul de **60 de zile**, pe capacitate F4 sau F64. La expirare, elementele non-Power BI devin inaccesibile, iar datele rămân 7 zile în OneLake ([Fabric trial](https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial) [S]). Trial-ul cere probabil un cont de serviciu, nu unul personal. Pentru KQL, varianta cea mai accesibilă este clusterul gratuit ADX (aka.ms/kustofree, fără card, aproximativ un an, extensibil, după [SQLServerCentral](https://www.sqlservercentral.com/blogs/adx-and-kql-free-cluster-for-learning-purposes)), împreună cu clusterul public „help”, care are tabelul StormEvents. Kusto Detective Agency este listat oficial ca resursă de învățare ([KQL learning resources](https://learn.microsoft.com/kusto/query/kql-learning-resources) [S]).

| Pachet | Resursă | URL | Tip / nivel | Marcaj |
|---|---|---|---|---|
| fabric / dp700 | Study Guide DP-700 | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700 | ghid, I | [S] |
| fabric / dp700 | Fabric Data Engineer Associate (pagina certificării) | https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/ | ghid, I | [S] |
| dp700 | Practice Assessment DP-700 (assessmentId=90 din memorie) | https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/practice/assessment?assessment-type=practice&assessmentId=90 | practică, I | [M] |
| fabric | Microsoft Fabric documentation | https://learn.microsoft.com/en-us/fabric/ | docs | [M] |
| fabric | Fabric trial capacity | https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial | lab, B | [S] |
| dp750 | Pagina certificării Azure Databricks DE Associate | https://learn.microsoft.com/credentials/certifications/implementing-data-engineering-solutions-using-azure-databricks/ | ghid, I | [S] (slug neobișnuit, posibil redirect) |
| dp203 | Azure Data Engineer Associate – Renew (retras) | https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/renew | arhivă | [S] |
| azure | Get started with data engineering on Azure | https://learn.microsoft.com/en-us/training/paths/get-started-data-engineering | traseu, I | [S] |
| azure | Microsoft Learn – rol Data Engineer | https://learn.microsoft.com/en-us/training/roles/data-engineer | hub | [S] |
| azure | ADF Quickstart Learn modules | https://learn.microsoft.com/en-us/azure/data-factory/quickstart-learn-modules | docs, B | [S] |
| kafka | Event Hubs for Apache Kafka | https://learn.microsoft.com/en-us/azure/event-hubs/azure-event-hubs-kafka-overview | docs, I | [M] |
| kql | Data analysis in ADX with KQL (traseu) | https://learn.microsoft.com/en-us/training/paths/data-analysis-data-explorer-kusto-query-language/ | traseu, B | [S] |
| kql | Tutorial: Learn common operators | https://learn.microsoft.com/en-us/azure/kusto/query/tutorial | tutorial, B | [S] (posibil redirect) |
| kql | Kusto Detective Agency | https://detective.kusto.io/ | lab-joc, B–A | [S] (prin referințe) |
| kql | ADX free cluster | https://aka.ms/kustofree | lab, B | [M] (citat în surse) |
| bi | Study guide PL-300 (evaluare de practică gratuită) | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300 | ghid, I | [S] (varianta `/certifications/`) |
| bi | SQLBI Introducing DAX (3 h, 32 de lecții) | https://www.sqlbi.com/p/introducing-dax-video-course/ | curs video, B | [S] |
| bi | DAX Guide | https://dax.guide/ | referință | [M] |
| bi | DAX reference (Microsoft) | https://learn.microsoft.com/en-us/dax/ | docs | [M] |

### AWS, Google Cloud și Snowflake (aws, gcp, snow)

Fiecare platformă are o cale practică fără cost. Pentru AWS există laboratoarele de pe workshops.aws, rulate în contul propriu. Free Tier-ul este bazat pe credite din iulie 2025, informație neconfirmată în sesiune. Pentru Google există sandbox-ul BigQuery fără card și creditul de probă. Pentru Snowflake există trial-ul de 30 de zile și insignele gratuite Hands-On Essentials, care au corectare automată „DORA” și se emit pe Credly ([Snowflake blog](https://www.snowflake.com/en/blog/learn-snowflake-with-free-hands-on-workshops/)). Limitele sandbox-ului BigQuery (10 GB stocare, 1 TB interogări pe lună) și creditul trial Snowflake (istoric 400 USD) sunt din memorie, neconfirmate pentru 2026.

| Pachet | Resursă | URL | Tip / nivel | Marcaj |
|---|---|---|---|---|
| aws / awsdea | AWS Certified Data Engineer – Associate | https://aws.amazon.com/certification/certified-data-engineer-associate/ | ghid, I | [S] |
| aws / awsdea | DEA-C01 Exam Guide (HTML) | https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.html | ghid, I | [S] |
| aws | AWS Workshops – Big Data | https://workshops.aws/categories/Big%20Data | lab, B–I (costurile AWS se aplică) | [S] |
| aws | Well-Architected Data Analytics Lens | https://docs.aws.amazon.com/wellarchitected/latest/analytics-lens/analytics-lens.html | whitepaper, I | [M] |
| aws | AWS Glue Developer Guide | https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html | docs, B–I | [M] |
| aws | Building Data Lakes on AWS | https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/building-data-lake-aws.html | whitepaper | [M] |
| gcp / gcppde | Professional Data Engineer (pagina certificării) | https://cloud.google.com/learn/certification/data-engineer | ghid, I | **[V]** |
| gcppde | PDE Exam Guide (PDF; există și un v4.2) | https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf | ghid, I | [S] |
| gcppde | PDE Sample Questions (Google Form) | https://docs.google.com/forms/d/e/1FAIpQLSfkWEzBCP0wQ09ZuFm7G2_4qtkYbfmk_0getojdnPdCYmq37Q/viewform | practică gratuită | [V] (ca link pe pagina oficială) |
| gcp | Data Engineer Learning Path (Skills Boost → Google Skills; laboratoarele cer credite) | https://www.cloudskillsboost.google/paths/16 | curs, B–I | [S] |
| gcp | BigQuery sandbox | https://docs.cloud.google.com/bigquery/docs/sandbox | lab fără card, B | [R] |
| gcp | Analytics lakehouse reference architecture | https://docs.cloud.google.com/architecture/big-data-analytics/analytics-lakehouse | whitepaper, I | [M] |
| snow / snowcore | SnowPro Core COF-C03 | https://learn.snowflake.com/en/certifications/snowpro-core-c03 | ghid, I | [S] |
| snow | Hands-On Essentials Track | https://learn.snowflake.com/en/pages/hands-on-essentials-track | curs + insigne, B | [S] |
| snow | Badge 1: Data Warehousing Workshop (8–12 h) | https://learn.snowflake.com/en/courses/OD-ESS-DWW | workshop, B | [S] |
| snow | Snowflake Developer Guides (fost Quickstarts) | https://www.snowflake.com/en/developers/guides/ | tutorial, B–I | [S] |
| snow | Intro to Data Engineering with Snowpark Python | https://www.snowflake.com/en/developers/guides/data-engineering-with-snowpark-python-intro/ | tutorial, I | [S] |
| snow | Snowflake 30-day trial | https://signup.snowflake.com/ | lab, B | [M] |

### Fundamente (sql, relational, model, nosql, formats, stats, algo, distributed)

Aici există singurele manuale cu licență deschisă reală, iar o coloană vertebrală solidă se poate construi din ele. *Database Design 2e* este CC BY 4.0 ([BCcampus](https://collection.bccampus.ca/textbooks/database-design-2nd-edition-bccampus-96)). OpenStax *Introductory Statistics 2e* este CC BY 4.0, cu atribuire obligatorie și cu numele OpenStax exclus din licență ([prefață OpenStax](https://openstax.org/books/introductory-statistics-2e/pages/preface)); se leagă la originalul OpenStax, nu la oglinda LibreTexts. *Open Data Structures* este CC BY pe site-ul autorului, iar ediția AU Press este NC-ND ([BCcampus](https://collection.bccampus.ca/textbook/KUNixyPF)). Lecțiile CMU 15-445 sunt publice pe YouTube imediat după curs ([FAQ Fall 2025](https://15445.courses.cs.cmu.edu/fall2025/faq.html)), dar e mai sigur să legați pagina de program decât un ID de playlist ghicit. Notele lui Kleppmann de la Cambridge sunt CC BY-SA ([PDF 2021/22](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf)). Lucrările clasice trebuie legate la gazda autorului sau editorului (Google Research, USENIX, raft.github.io, allthingsdistributed.com), nu la oglinzi de tip Scribd. Pentru NoSQL și formate de fișier nu există manual deschis dedicat, așa că aceste pachete se sprijină pe documentație și specificații.

| Pachet | Resursă | URL | Tip / licență | Marcaj |
|---|---|---|---|---|
| sql | PostgreSQL Tutorial | https://www.postgresql.org/docs/current/tutorial.html | docs, PostgreSQL License | [M] |
| sql | PostgreSQL Window Functions | https://www.postgresql.org/docs/current/tutorial-window.html | docs | [M] |
| sql | PostgreSQL Exercises (81 de exerciții, fără login) | https://pgexercises.com/ | interactiv | [S] |
| sql | Mode SQL Tutorial (banner ThoughtSpot) | https://mode.com/sql-tutorial | interactiv | [S] |
| sql | SQLBolt | https://sqlbolt.com/ | interactiv | [M] (gazdă blocată) |
| relational / model | Database Design 2e | https://opentextbc.ca/dbdesign01/ | manual, CC BY 4.0 | [S] |
| relational / algo | CMU 15-445/645 (Fall 2025) | https://15445.courses.cs.cmu.edu/fall2025/schedule.html | curs universitar | [S] |
| relational | PostgreSQL: Using EXPLAIN | https://www.postgresql.org/docs/current/using-explain.html | docs | [M] |
| relational | PostgreSQL: Transaction Isolation | https://www.postgresql.org/docs/current/transaction-iso.html | docs | [M] |
| relational | Use The Index, Luke | https://use-the-index-luke.com/ | carte online gratuită | [M] |
| model | Kimball Dimensional Modeling Techniques | https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/ | referință, © (doar link) | [M] |
| model | dbt Snapshots (SCD2 în practică) | https://docs.getdbt.com/docs/build/snapshots | docs | [M] |
| nosql | DynamoDB NoSQL design best practices | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html | docs | [M] |
| nosql | MongoDB Data Modeling | https://www.mongodb.com/docs/manual/data-modeling/ | docs | [M] |
| nosql | Bigtable schema design | https://docs.cloud.google.com/bigtable/docs/schema-design | docs | [R] |
| formats | Apache Parquet docs | https://parquet.apache.org/docs/ | spec, Apache 2.0 | [M] |
| formats | Arrow Columnar Format | https://arrow.apache.org/docs/format/Columnar.html | spec | [M] |
| formats | Apache Avro specification (cale versionată) | https://avro.apache.org/docs/1.12.0/specification/ | spec | [M] |
| formats | DuckDB: Parquet | https://duckdb.org/docs/stable/data/parquet/overview | docs, MIT | [M] |
| stats | OpenStax Introductory Statistics 2e | https://openstax.org/details/books/introductory-statistics-2e | manual, CC BY 4.0 | [S] |
| stats | NIST/SEMATECH e-Handbook (EDA) | https://www.itl.nist.gov/div898/handbook/eda/eda.htm | referință, domeniu public | [M] |
| algo | Open Data Structures | https://opendatastructures.org/ | manual, CC BY | [S] |
| algo | MIT 6.006 (OCW) | https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ | curs, CC BY-NC-SA | [M] |
| algo | Apache DataSketches | https://datasketches.apache.org/ | docs | [M] |
| distributed | MIT 6.5840 Distributed Systems | https://pdos.csail.mit.edu/6.824/ | curs + laboratoare | [S] |
| distributed | Kleppmann, Distributed Systems notes | https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf | note, CC BY-SA | [S] |
| distributed | Kafka paper (NetDB 2011) | https://www.microsoft.com/en-us/research/wp-content/uploads/2017/09/Kafka.pdf | lucrare | **[V]** |
| distributed | Raft site + paper | https://raft.github.io/ | lucrare + vizualizare | [M] |
| distributed | Jepsen: Consistency models | https://jepsen.io/consistency | referință | [M] |

### Streaming, orchestrare, transformare și infrastructură (stream, flink, kafka, orchestrare, dbt, docker, iac, linux, net, api)

Toate uneltele au documentație oficială gratuită, iar majoritatea au și cursuri oficiale gratuite. Confluent Developer acoperă Kafka și Flink, Astronomer Academy acoperă Airflow, dbt Learn are cursuri „100% online și gratuite pentru toți”, iar HashiCorp Developer acoperă Terraform. Laboratoarele recomandate sunt Killercoda pentru Docker, Linux și Kubernetes, Tour of Beam pentru streaming și Docker Compose local pentru Kafka, Flink și Airflow. Pentru IaC, traseul HashiCorp „Docker get-started” nu cere cont cloud.

| Pachet | Resursă | URL | Tip / nivel | Marcaj |
|---|---|---|---|---|
| stream | Structured Streaming Programming Guide | https://spark.apache.org/docs/latest/streaming/index.html | docs, I | [M] |
| stream | Streaming 101 (Akidau) | https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/ | articol, B–I | [M] |
| stream | Tour of Beam | https://tour.beam.apache.org/ | lab interactiv, B | [M] |
| stream | Databricks: Apply watermarks | https://docs.databricks.com/structured-streaming/watermarks | docs, I | [S] |
| flink | Learn Flink: Hands-On Training | https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/overview/ | docs + exerciții | [M] (varianta master [S]) |
| flink | Confluent Apache Flink courses | https://developer.confluent.io/courses/apache-flink | curs, B | [S] |
| kafka | Apache Kafka Documentation (4.x, doar KRaft) | https://kafka.apache.org/documentation/ | docs | [M] (paginile versionate [S]) |
| kafka | Confluent Developer – Courses | https://developer.confluent.io/courses/ | curs, B–A | [S] |
| kafka | Kafka 101 | https://developer.confluent.io/courses/apache-kafka/events/ | curs video, B | [M] |
| orchestrare | Airflow docs (stable, 3.x) | https://airflow.apache.org/docs/apache-airflow/stable/index.html | docs | [M] |
| orchestrare | TaskFlow tutorial (`airflow.sdk`) | https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html | tutorial, B | [S] |
| orchestrare | Upgrading to Airflow 3 | https://airflow.apache.org/docs/apache-airflow/stable/installation/upgrading_to_airflow3.html | docs, I | [M] |
| orchestrare | Astronomer Academy | https://academy.astronomer.io/ | curs gratuit cu cont | [M] |
| orchestrare | Airflow Fundamentals Study Guide (PDF) | https://www.astronomer.io/uploads/Apache-Airflow-Fundamentals-Study-Guide.pdf | ghid | [S] |
| dbt | dbt Learn (landing) | https://getdbt.com/dbt-learn | curs, B–A | [S] |
| dbt | dbt Fundamentals (insignă gratuită) | https://learn.getdbt.com/courses/dbt-fundamentals | curs, B | [M] (domeniul vechi courses.getdbt.com e indexat) |
| dbt | dbt Fusion quickstart | https://docs.getdbt.com/guides/fusion | tutorial, I | [S] |
| dbt | jaffle-shop | https://github.com/dbt-labs/jaffle-shop | proiect demo | [M] |
| docker | Docker workshop (45 min) | https://docs.docker.com/get-started/hands-on-overview/ | tutorial, B | [S] |
| docker | Learn Kubernetes Basics (local, fără Katacoda) | https://kubernetes.io/docs/tutorials/kubernetes-basics/ | tutorial, B | [S] |
| docker | Killercoda playgrounds | https://killercoda.com/playgrounds | lab gratuit cu cont | [M] |
| docker | Play with Docker / Kubernetes | labs.play-with-docker.com | — | **[!]** indisponibil din 1 mar 2026 |
| iac | Terraform tutorials (hub) | https://developer.hashicorp.com/terraform/tutorials | curs, B–A | [S] |
| iac | Terraform Associate 004 – sample questions | https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-questions-004 | practică | [S] |
| iac | OpenTofu docs | https://opentofu.org/docs/ | docs, MPL 2.0 | [M] |
| linux | The Linux Command Line (PDF gratuit, CC BY-NC-ND, ed. a 7-a 2026) | https://linuxcommand.org/tlcl.php | carte deschisă (doar link) | [S] |
| linux | GNU Bash Reference Manual | https://www.gnu.org/software/bash/manual/ | docs, GFDL | [M] |
| linux | The Missing Semester (MIT) | https://missing.csail.mit.edu/ | curs, CC BY-NC-SA | [M] |
| linux | SadServers | https://sadservers.com/ | lab, nivel gratuit | [M] |
| net | Cloudflare – What is DNS? | https://www.cloudflare.com/learning/dns/what-is-dns/ | tutorial, B | [M] (posibil mutat) |
| net | MDN – An overview of HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview | docs, CC BY-SA | [M] |
| net | High Performance Browser Networking | https://hpbn.co/ | carte online gratuită | [M] |
| api | IETF draft Idempotency-Key | https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/ | spec (draft, nu RFC) | [S] |
| api | IETF draft RateLimit headers (draft-11) | https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers | spec | [S] |
| api | Stripe – Idempotent requests | https://docs.stripe.com/api/idempotent_requests | docs, I | [M] |
| api | AWS Builders' Library – retries and backoff with jitter | https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ | articol, I–A | [M] |
| api | dlt – REST API source | https://dlthub.com/docs/dlt-ecosystem/verified-sources/rest_api/basic | docs, I | [M] |

### Python, calitate, observabilitate, securitate, cost, AI, curricule, interviuri (python, quality, obs, secur, perf, ai, engineering, interviu)

Cel mai solid curriculum gratuit complet rămâne **DataTalksClub Data Engineering Zoomcamp**. Următoarea cohortă live începe în **ianuarie 2027**, iar studiul self-paced e posibil oricând, fără certificat. Modulele acoperă Docker/Terraform, orchestrare (Kestra), warehouse (BigQuery), dbt, platforme de date (Bruin), Spark și Kafka ([repo DE Zoomcamp](https://github.com/DataTalksClub/data-engineering-zoomcamp) [V]). Pentru că stack-ul se schimbă între cohorte, aplicația trebuie să lege rădăcina repo-ului. *Fundamentals of Data Engineering* și DDIA nu sunt gratuite și au fost excluse. Pentru interviuri, ghidurile gratuite specifice data engineering sunt rare, iar acesta este un gol real, nu un eșec al căutării. Stack-ul gratuit combină System Design Primer, secțiunea de interviuri din Data Engineer Handbook și practica SQL.

| Pachet | Resursă | URL | Tip / licență | Marcaj |
|---|---|---|---|---|
| engineering | Data Engineering Zoomcamp | https://github.com/DataTalksClub/data-engineering-zoomcamp | curs complet gratuit | **[V]** |
| engineering | Data Engineer Handbook | https://github.com/DataExpert-io/data-engineer-handbook | ghid | [M] |
| engineering | roadmap.sh Data Engineer | https://roadmap.sh/data-engineer | ghid | [M] |
| python | **[RO] Tutorialul de Python** (traducere parțială) | https://docs.python.org/ro/3/tutorial/ | docs oficiale în română | [S] |
| python | Python for Data Analysis 3e (open access, pre-pandas 3.0) | https://wesmckinney.com/book/ | carte online | [M] |
| python | pandas 3.0 – What's new | https://pandas.pydata.org/docs/whatsnew/v3.0.0.html | docs | [S] |
| python | Polars User Guide | https://docs.pola.rs/user-guide/getting-started/ | docs, MIT | [M] |
| python | pytest – Get Started | https://docs.pytest.org/en/stable/getting-started.html | docs | [M] |
| quality | GX Core 1.x – Try GX Core | https://docs.greatexpectations.io/docs/core/introduction/try_gx/ | docs, Apache-2.0 | [S] |
| quality | Soda Core v4 – Data contracts | https://docs.soda.io/data-contracts | docs | [S] |
| quality | dbt Data tests | https://docs.getdbt.com/docs/build/data-tests | docs | [M] |
| quality | OpenLineage docs | https://openlineage.io/docs/ | docs, Apache-2.0 | [M] |
| quality | **[RO] GDPR pe EUR-Lex** | https://eur-lex.europa.eu/legal-content/RO/TXT/?uri=CELEX:32016R0679 | text oficial în română | [M] |
| quality | **[RO] ANSPDCP** | https://www.dataprotection.ro/ | autoritatea română | [M] |
| obs | Google SRE books (index) | https://sre.google/books/ | cărți online gratuite | [M] |
| obs | SRE Workbook – Implementing SLOs | https://sre.google/workbook/implementing-slos/ | ghid | [M] |
| obs | OpenTelemetry Docs | https://opentelemetry.io/docs/ | docs | [M] |
| perf | Introduction to FinOps | https://learn.finops.org/introduction-to-finops | curs gratuit cu cont | [S] |
| perf | Databricks Optimization recommendations | https://docs.databricks.com/aws/en/optimizations/ | docs | [M] |
| perf | BigQuery query performance best practices | https://docs.cloud.google.com/bigquery/docs/best-practices-performance-overview | docs | [M] (redirect observat la gazdă) |
| secur | OWASP Secrets Management Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html | ghid, CC BY-SA | [M] |
| secur | OWASP API Security Top 10 (2023) | https://owasp.org/API-Security/editions/2023/en/0x00-header/ | ghid | [M] |
| secur | AWS IAM security best practices | https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html | docs | [M] |
| ai | LLM Zoomcamp | https://github.com/DataTalksClub/llm-zoomcamp | curs | [M] |
| ai | Hugging Face Open-Source AI Cookbook | https://huggingface.co/learn/cookbook/index | tutorial | [M] |
| ai | pgvector | https://github.com/pgvector/pgvector | docs | [M] |
| ai | Feast docs | https://docs.feast.dev/ | docs | [M] |
| interviu | The System Design Primer | https://github.com/donnemartin/system-design-primer | ghid, CC BY 4.0 | [S] |
| interviu | ML Interviews Book (Chip Huyen) | https://huyenchip.com/ml-interviews-book/ | carte online | [M] |
| interviu | DataLemur | https://datalemur.com/ | practică SQL, freemium | [M] |

## Concluzie

Constatarea cea mai importantă nu ține de o resursă anume, ci de tipul de risc. În 2026, conținutul învechit vine mai ales din redenumiri și versiuni (DLT, Workflows, ZooKeeper, Airflow 2, pandas 2, Soda v3, GX 0.x, COF-C02, DP-203, Terraform 003), nu din linkuri moarte. De aceea, biblioteca are nevoie de doi gardieni automați. Primul este un link-checker care rescrie URL-urile la forma canonică după redirecționare. Al doilea este un câmp „verificat la data” pe fiecare fapt de certificare, împreună cu o reverificare programată toamna, când Databricks, Microsoft și DataTalksClub își actualizează ghidurile și cohortele. Faptele de examen marcate aici ca secundare (ponderile Databricks, formatul DP-750, prețurile AWS și Snowflake) trebuie confirmate pe paginile oficiale înainte să apară în aplicație ca valori ferme.

A doua implicație este că valoarea proprie a aplicației stă în stratul românesc. Materialul oficial în română aproape lipsește: există doar tutorialul Python, interfața Microsoft Learn și textele juridice UE. În același timp, licențele (NC-ND, „all rights reserved”, e-book-uri cu formular) interzic preluarea conținutului. Rezumatele originale în română, maparea resurselor pe domeniile de examen și pachetul `capcane` despre schimbările din 2026 sunt deci exact contribuția pe care nicio sursă externă nu o oferă. Ele transformă o listă de linkuri în engleză într-un traseu de învățare utilizabil.

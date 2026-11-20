# Resurse gratuite de învățare: Python, calitate și guvernanță, observabilitate, securitate, performanță și cost, date pentru AI, curricule, interviuri

Research date: 2026-11-19. Researcher notes for the report writer.

**IMPORTANT: verification limits in this session (read first).**
- The sandbox network policy blocked direct HTTP checks: `curl` returned `CONNECT tunnel failed, response 403` for every non-GitHub host, `github.com` gave 403 to curl, and `gh api` was refused ("GitHub access to this repository is not enabled for this session"). WebFetch failed with `ENOTFOUND` for wesmckinney.com, sre.google, docs.greatexpectations.io, docs.soda.io and learn.finops.org (the error says these hosts are outside the session's allowed domains, not that they do not exist).
- Only **one URL was fetched successfully**: github.com/DataTalksClub/data-engineering-zoomcamp (WebFetch).
- Verification codes used in the tables below:
  - **F**: fetched and read in this session.
  - **S**: this exact URL (or its canonical parent) appeared in live web search results on 2026-11-19, so it is indexed and current. It was not fetched.
  - **NV**: a canonical URL from prior knowledge. It was **not verified** in this session and must be checked before shipping. A follow-up with network access (allow the hosts or run a link checker in CI) is required.
- Three Google Cloud URLs were seen to **redirect** during the curl attempt, before the CONNECT block: `cloud.google.com/...` now goes to `docs.cloud.google.com/...`. Use the new host. The redirect targets are listed below.
- Suggested deck mapping: python→`python`; quality and governance→`quality`; observability→`obs`; security→`secur`; performance and FinOps→`perf` (FinOps could also go to `finante` if that deck is about cloud and finance); data for AI→`ai`; curricula→`engineering`; interviews→`interviu`. Common pitfalls (pandas 3.0 Copy-on-Write, legacy Soda v3 docs, old GX 0.x docs) could seed `capcane`.

---

## Which complete free curricula are well regarded and current (DE Zoomcamp status as of 2026)?

### Takeaway
DataTalksClub's Data Engineering Zoomcamp is still free and open. The next live cohort starts in **January 2027**, and self-paced study is possible at any time (no certificate in self-paced mode). It is the strongest free end-to-end DE curriculum. Free companion curricula cover ML, MLOps and LLMs from the same provider, plus vendor learning paths.

### Cited Findings
- The DE Zoomcamp repo lists the live cohort start as "January 2027". A 2026 cohort folder exists. Self-paced mode is "Anytime", with free pre-recorded lectures and homework that is "available but not scored", but no leaderboard, peer review or certificate. — [DE Zoomcamp repo (F)](https://github.com/DataTalksClub/data-engineering-zoomcamp)
- Modules: 1) Containerization and IaC, 2) Workflow Orchestration (+ Workshop: Data Ingestion), 3) Data Warehousing, 4) Analytics Engineering, 5) Data Platforms, 6) Batch Processing, 7) Streaming, plus a final project. Tools: Docker/Compose, PostgreSQL, Terraform, GCP, Kestra, dlt, BigQuery, dbt (with DuckDB), Bruin, Spark, Kafka (Streams, KSQL), Avro. — [DE Zoomcamp repo (F)](https://github.com/DataTalksClub/data-engineering-zoomcamp)
- The repo FAQ states "All videos, materials, and homework are free and open-source". The fetched page did not name a specific license. — [DE Zoomcamp repo (F)](https://github.com/DataTalksClub/data-engineering-zoomcamp)
- Third-party summaries describe the Zoomcamp as a free ~9-week course that assumes basic fundamentals. — [DataCamp blog RO (S)](https://www.datacamp.com/ro/blog/top-free-data-engineering-resources)

#### Catalog — deck `engineering` (curricule complete)
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Data Engineering Zoomcamp | https://github.com/DataTalksClub/data-engineering-zoomcamp | DataTalksClub | free course (video + repo) | intermediar | EN | Gratuit; materiale open | F | Curs complet gratuit: Docker, Terraform, orchestrare, warehouse, dbt, Spark, Kafka și un proiect final; cohortă live în ian. 2027 sau self-paced. |
| 2 | DataTalksClub YouTube (înregistrări Zoomcamp) | https://www.youtube.com/@DataTalksClub | DataTalksClub | video | începător–intermediar | EN | Gratuit | NV | Toate lecțiile video ale zoomcamp-urilor și workshop-uri tematice. |
| 3 | MLOps Zoomcamp | https://github.com/DataTalksClub/mlops-zoomcamp | DataTalksClub | free course | intermediar | EN | Gratuit | NV | Cum duci modele ML în producție: tracking, orchestrare, deployment, monitorizare. |
| 4 | Data Engineer Handbook | https://github.com/DataExpert-io/data-engineer-handbook | DataExpert.io (Zach Wilson) | guide (listă curată) | toate | EN | Gratuit (repo public) | NV | Hartă de resurse DE: cărți, comunități, proiecte și bootcamp gratuit pe YouTube. |
| 5 | Data Engineer Roadmap | https://roadmap.sh/data-engineer | roadmap.sh | guide | începător | EN | Gratuit (cont opțional) | NV | Hartă vizuală a competențelor de data engineer, cu linkuri spre resurse. |
| 6 | Microsoft Learn – Data Engineer career path | https://learn.microsoft.com/en-us/training/career-paths/data-engineer | Microsoft | free course | începător–intermediar | EN (+ RO automat) | Gratuit | NV | Module gratuite pentru ingineri de date pe Azure/Fabric; interfață disponibilă și în română. |
| 7 | Databricks Customer Academy (cursuri self-paced gratuite) | https://customer-academy.databricks.com/ | Databricks | free course | începător–avansat | EN | Gratuit cu cont (unele cursuri plătite) | NV | Cursuri oficiale self-paced despre Lakehouse, Spark, Delta, Unity Catalog. |
| 8 | Start Data Engineering (blog + proiecte) | https://www.startdataengineering.com/ | Joseph Machado | tutorial | intermediar | EN | Gratuit (articole) | NV | Articole practice și proiecte end-to-end de data engineering. |
| 9 | Python for Everybody (bază Python) | https://www.py4e.com/ | Dr. Charles Severance (U. Michigan) | free course + open book | începător | EN | Gratuit, CC BY-NC-SA | NV | Introducere gratuită în Python, cu manual și exerciții, pentru cine pornește de la zero. |

### Inferences
- The January 2027 cohort start means the app can show "Cohorta următoare: ianuarie 2027; între timp, self-paced". Recheck each autumn.
- The tool stack (Kestra, dlt, Bruin, DuckDB) changes between cohorts. The app should link to the repo root, not to module subfolders that may move.

### Gaps
- No exact registration or start date was found for the January 2027 cohort, and the repo license file was not confirmed.
- "Fundamentals of Data Engineering" (Reis and Housley) is **not** free (O'Reilly, paid). It is excluded, and so is DDIA (paid).
- Coursera/edX DE courses are free only in audit mode where audit exists. They were not verified and are excluded.

---

## Official docs/tutorials for pandas, Polars, pytest, Great Expectations, Soda, OpenLineage, OpenTelemetry?

### Takeaway
All the tools listed have free official documentation. Two version changes matter for 2026 content: **pandas 3.0** (released 21 Jan 2026, Copy-on-Write and a string dtype by default) and **Soda Core 4** (first public v4 release 4.0.5, 28 Jan 2026, built around data contracts; v3 docs are legacy). GX documentation should target **GX Core 1.x**, not the 0.x pages that still appear in search.

### Cited Findings
- The pandas 3.0.0 release notes are dated January 21, 2026. Copy-on-Write is the default, string columns are inferred as `str` dtype, Python >= 3.11 is required, and upgrading to 2.3 first is recommended to see deprecation warnings. — [pandas 3.0.0 whatsnew (S)](https://pandas.pydata.org/docs/whatsnew/v3.0.0.html); [pandas blog (S)](https://pandas.pydata.org/community/blog/pandas-3.0.html)
- One third-party source puts Polars at 1.40.1 in April 2026, and Real Python mentions Polars 1.37 in February 2026 (secondary sources). — [vrlatech (S, third-party)](https://vrlatech.com/polars-vs-pandas-in-2026-which-python-dataframe-library-should-you-use/); [Real Python news Feb 2026 (S)](https://realpython.com/python-news-february-2026/)
- Soda Core 4 is "the open-source data contracts engine". Contracts are written in YAML. Packages are named `soda-{datasource}` (e.g., `soda-postgres`). The first public v4 release was 4.0.5 on 28 Jan 2026, and later releases reached 4.23.0. Soda v3 pages are legacy. — [Soda Core README (S)](https://raw.githubusercontent.com/sodadata/soda-core/main/README.md); [Soda v4 release notes (S)](https://docs.soda.io/soda-v4/release-notes/soda-core-release-notes); [Introducing Soda 4.0 (S)](https://soda.io/blog/introducing-soda-4.0)
- The GX Core 1.x docs offer "Introduction to GX Core" and "Try GX Core". The workflow is: set up the environment → connect to data → define Expectations → run validations → Data Docs. Search also returns old 0.7/0.8 and "1.0-prerelease" pages, which should be avoided. — [GX overview (S)](https://docs.greatexpectations.io/docs/core/introduction/gx_overview); [Try GX Core (S)](https://docs.greatexpectations.io/docs/core/introduction/try_gx/)
- The Python tutorial is officially translated into Romanian at docs.python.org/ro, but the translation is partial and some sections are still in English. — [Tutorialul de Python (S)](https://docs.python.org/ro/3/tutorial/)

#### Catalog — deck `python`
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | The Python Tutorial | https://docs.python.org/3/tutorial/ | Python Software Foundation | official docs | începător | EN | Gratuit; PSF License | NV | Tutorialul oficial Python: sintaxă, structuri de date, module, excepții, clase. |
| 2 | **[RO] Tutorialul de Python** | https://docs.python.org/ro/3/tutorial/ | PSF + voluntari | official docs (traducere) | începător | **RO** (parțial) | Gratuit | S | Tutorialul oficial tradus în română; unele secțiuni sunt încă în engleză. |
| 3 | Python for Data Analysis, 3rd ed. (Open Access) | https://wesmckinney.com/book/ | Wes McKinney | open book | începător–intermediar | EN | Gratuit online (ediția open access; tipăritul O'Reilly e plătit) | NV | Cartea creatorului pandas, gratuită online: NumPy, pandas, curățare și agregare de date. Scrisă pentru pandas 1.x/2.x, deci verifică noutățile din 3.0. |
| 4 | pandas – Getting started tutorials + 10 minutes to pandas | https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html | pandas dev team | official docs | începător | EN | Gratuit; BSD-3 | NV | Tutoriale oficiale scurte: citire, filtrare, grupare, combinare de tabele. |
| 5 | pandas 3.0 – What's new / migrare | https://pandas.pydata.org/docs/whatsnew/v3.0.0.html | pandas dev team | official docs | intermediar | EN | Gratuit | S | Schimbările din pandas 3.0 (Copy-on-Write, tip str) și cum îți migrezi codul. |
| 6 | Polars User Guide | https://docs.pola.rs/user-guide/getting-started/ | Polars | official docs | începător–intermediar | EN | Gratuit; MIT | NV | Ghid oficial Polars: expresii, lazy API, join-uri, plus secțiunea „Coming from pandas”. |
| 7 | pytest – Get Started + fixtures | https://docs.pytest.org/en/stable/getting-started.html | pytest-dev | official docs | începător–intermediar | EN | Gratuit; MIT | NV | Cum scrii și rulezi teste cu pytest, fixtures, parametrizare. |
| 8 | Python Packaging User Guide – Packaging projects | https://packaging.python.org/en/latest/tutorials/packaging-projects/ | PyPA | official docs | intermediar | EN | Gratuit | NV | Tutorial oficial: pyproject.toml, build și publicare a unui pachet Python. |
| 9 | Python Packages (py-pkgs) | https://py-pkgs.org/ | Tomas Beuzen, Tiffany Timbers | open book | intermediar | EN | Gratuit online (CC BY-NC-ND) | NV | Carte deschisă despre structurarea, testarea și publicarea pachetelor Python. |
| 10 | Python typing docs + mypy Getting Started | https://typing.python.org/en/latest/ ; https://mypy.readthedocs.io/en/stable/getting_started.html | Python typing council / mypy | official docs | intermediar | EN | Gratuit | NV | Type hints în Python și verificarea statică a tipurilor cu mypy. |

#### Catalog — deck `quality` (calitate și guvernanță)
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | GX Core – Introduction / Try GX Core | https://docs.greatexpectations.io/docs/core/introduction/try_gx/ | Great Expectations | official docs | începător–intermediar | EN | Gratuit; Apache-2.0 | S | Primul flux de validare cu GX Core 1.x: Expectations, validări, Data Docs. |
| 2 | Soda Core v4 (Data Contracts Engine) – docs | https://docs.soda.io/data-contracts | Soda | official docs | intermediar | EN | Gratuit (Soda Core open source; Soda Cloud plătit) | S | Contracte de date în YAML verificate cu Soda Core 4; evită paginile vechi v3. |
| 3 | Soda Core repo (README, instalare) | https://github.com/sodadata/soda-core | Soda | official docs | intermediar | EN | Open source | S | Instalarea pachetelor soda-{sursă} și exemple de contracte. |
| 4 | dbt – Data tests | https://docs.getdbt.com/docs/build/data-tests | dbt Labs | official docs | începător–intermediar | EN | Gratuit | NV | Teste de date în dbt (unique, not_null, relationships, teste custom). |
| 5 | dbt – Model contracts | https://docs.getdbt.com/docs/collaborate/govern/model-contracts | dbt Labs | official docs | intermediar | EN | Gratuit | NV | Cum impui schema unui model dbt prin contracte. |
| 6 | Open Data Contract Standard (ODCS) | https://bitol-io.github.io/open-data-contract-standard/ | Bitol (Linux Foundation AI & Data) | guide / spec | intermediar | EN | Gratuit; Apache-2.0 | NV | Standard deschis pentru descrierea contractelor de date (schemă, calitate, SLA). |
| 7 | OpenLineage docs | https://openlineage.io/docs/ | OpenLineage (LF AI & Data) | official docs | intermediar | EN | Gratuit; Apache-2.0 | NV | Standard deschis pentru lineage: evenimente run/job/dataset, integrări Spark, Airflow, dbt. |
| 8 | Unity Catalog (OSS) docs | https://docs.unitycatalog.io/ | Unity Catalog (LF AI & Data) | official docs | intermediar | EN | Gratuit; Apache-2.0 | NV | Catalog de date open source: guvernanță, permisiuni, lineage. |
| 9 | DataHub docs / OpenMetadata docs | https://datahubproject.io/docs/ ; https://docs.open-metadata.org/ | Acryl/LinkedIn; Collate | official docs | intermediar | EN | Gratuit; Apache-2.0 | NV | Două cataloage de date open source populare: descoperire, ownership, glosar. |
| 10 | **[RO] GDPR – Regulamentul (UE) 2016/679, text oficial în română** | https://eur-lex.europa.eu/legal-content/RO/TXT/?uri=CELEX:32016R0679 | Uniunea Europeană (EUR-Lex) | official docs | toate | **RO** | Gratuit | NV | Textul oficial GDPR în română; principii, temei legal, drepturile persoanei vizate. |
| 11 | EDPB – Ghid de protecția datelor pentru IMM-uri | https://www.edpb.europa.eu/sme-data-protection-guide/home_en | European Data Protection Board | guide | începător | EN (+ alte limbi UE; RO probabil, neconfirmat) | Gratuit | NV | Ghid practic despre GDPR: ce date ai, securitate, drepturi, încălcări de date. |
| 12 | **[RO] ANSPDCP** | https://www.dataprotection.ro/ | Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal | official docs / guide | toate | **RO** | Gratuit | NV | Autoritatea română pentru GDPR: ghiduri, decizii și sancțiuni din România. |

### Inferences
- The `capcane` deck could hold: "pandas 3.0: chained assignment no longer works (CoW)", "Soda v3 vs v4: legacy docs", "GX 0.x tutorials are obsolete in 1.x".
- McKinney's book predates pandas 3.0. The app should pair it with the 3.0 whatsnew page.

### Gaps
- Exact Polars docs path, the McKinney open-access status and license, pytest, OpenLineage and OpenTelemetry pages could not be fetched (network policy).
- No standalone "GDPR for data engineers" free course was found or verified.

---

## Free books legitimately available online (Google SRE books, Python for Data Analysis 3e, etc.)?

### Takeaway
Google publishes "Site Reliability Engineering" and "The Site Reliability Workbook" free online at sre.google/books (with "Building Secure and Reliable Systems"). Wes McKinney's Python for Data Analysis 3e has an open-access online edition. None of these could be fetched in this session (host blocked), so the URLs below are canonical but marked NV.

### Cited Findings
- No source could be fetched for the SRE books or the McKinney book. Their free status comes from prior knowledge. — (sre.google and wesmckinney.com returned ENOTFOUND under the network policy). See Gaps.
- The OpenTelemetry, Prometheus and OWASP pages were not fetched either. FinOps: the official "Introduction to FinOps" course is on learn.finops.org (free per prior knowledge), and an edX version (LFS175x) has a free audit track with a $169 verified track according to a third-party listing. Training "authorized and endorsed by the FinOps Foundation" is on learn.finops.org. — [learn.finops.org Introduction to FinOps (S)](https://learn.finops.org/introduction-to-finops); [ClassCentral listing (S, third-party)](https://classcentral.com/course/devops-the-linux-foundation-introduction-to-finop-20586); [FinOps for Engineers intro (S)](https://learn.finops.org/finops-for-engineers-introduction)

#### Catalog — deck `obs` (observabilitate)
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Site Reliability Engineering (SRE Book) | https://sre.google/sre-book/table-of-contents/ | Google | open book | intermediar | EN | Gratuit online (Google/O'Reilly) | NV | Cartea de bază SRE: SLO-uri, monitorizare, on-call, postmortem-uri. |
| 2 | The Site Reliability Workbook | https://sre.google/workbook/table-of-contents/ | Google | open book | intermediar | EN | Gratuit online | NV | Aplicarea practică a SRE, cu capitole dedicate implementării SLO-urilor și alertării. |
| 3 | Implementing SLOs (capitol Workbook) | https://sre.google/workbook/implementing-slos/ | Google | guide | intermediar | EN | Gratuit | NV | Pas cu pas: cum alegi SLI-uri, setezi SLO-uri și folosești error budget. |
| 4 | Google SRE books (index) | https://sre.google/books/ | Google | open book | toate | EN | Gratuit online | NV | Pagina cu toate cărțile SRE gratuite, inclusiv „Building Secure and Reliable Systems”. |
| 5 | OpenTelemetry Docs | https://opentelemetry.io/docs/ | OpenTelemetry (CNCF) | official docs | începător–intermediar | EN | Gratuit; CC BY 4.0 / Apache-2.0 | NV | Concepte OTel: trace-uri, metrici, loguri, colector, semantic conventions. |
| 6 | OpenTelemetry Python – Getting Started | https://opentelemetry.io/docs/languages/python/getting-started/ | OpenTelemetry | tutorial | intermediar | EN | Gratuit | NV | Instrumentezi o aplicație Python cu trace-uri și metrici OTel. |
| 7 | Python Logging HOWTO | https://docs.python.org/3/howto/logging.html | PSF | official docs | începător | EN | Gratuit | NV | Cum faci logging corect în Python: niveluri, handlere, configurare. |
| 8 | Prometheus – Overview | https://prometheus.io/docs/introduction/overview/ | Prometheus (CNCF) | official docs | începător | EN | Gratuit; Apache-2.0 | NV | Metrici time-series, PromQL și alertare, utile pentru monitorizarea pipeline-urilor. |
| 9 | OpenLineage (lineage ca semnal de observabilitate) | https://openlineage.io/docs/ | OpenLineage | official docs | intermediar | EN | Gratuit | NV | Urmărești rulările de job-uri și seturile de date pentru a detecta probleme în pipeline-uri. |

#### Catalog — deck `perf` (performanță și cost)
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Introduction to FinOps | https://learn.finops.org/introduction-to-finops | FinOps Foundation | free course | începător | EN | Gratuit (cont) | S | Curs oficial introductiv FinOps: principii, persona, ciclul Inform–Optimize–Operate. |
| 2 | FinOps for Engineers – Introduction | https://learn.finops.org/finops-for-engineers-introduction | FinOps Foundation | free course | începător | EN | Gratuit (de confirmat) | S | FinOps din perspectiva inginerilor: costul ca metrică de inginerie. |
| 3 | FinOps Framework | https://www.finops.org/framework/ | FinOps Foundation | guide | începător–intermediar | EN | Gratuit | NV | Cadrul FinOps: principii, domenii, capabilități, maturitate. |
| 4 | AWS Well-Architected – Cost Optimization Pillar | https://docs.aws.amazon.com/wellarchitected/latest/cost-optimization-pillar/welcome.html | AWS | guide | intermediar | EN | Gratuit | NV | Bune practici AWS pentru controlul și optimizarea costurilor în cloud. |
| 5 | Azure Well-Architected – Cost Optimization | https://learn.microsoft.com/en-us/azure/well-architected/cost-optimization/ | Microsoft | guide | intermediar | EN | Gratuit | NV | Principii și checklist de optimizare a costurilor pe Azure. |
| 6 | Google Cloud Architecture Framework – Cost optimization | https://docs.cloud.google.com/architecture/framework/cost-optimization | Google Cloud | guide | intermediar | EN | Gratuit | NV (redirect de la cloud.google.com observat) | Recomandări Google Cloud pentru costuri: vizibilitate, optimizare, guvernanță. |
| 7 | BigQuery – Query performance best practices | https://docs.cloud.google.com/bigquery/docs/best-practices-performance-overview | Google Cloud | official docs | intermediar | EN | Gratuit | NV (redirect observat) | Cum scrii interogări BigQuery rapide și ieftine: partiționare, clustering, filtrare. |
| 8 | Databricks – Optimization recommendations | https://docs.databricks.com/aws/en/optimizations/ | Databricks | official docs | intermediar | EN | Gratuit | NV | Optimizări Spark/Delta: layout de date, caching, AQE, Photon. |
| 9 | Use The Index, Luke! | https://use-the-index-luke.com/ | Markus Winand | open book | intermediar | EN | Gratuit online | NV | Carte gratuită despre indexare și tuning SQL pentru dezvoltatori. |
| 10 | PostgreSQL – Using EXPLAIN | https://www.postgresql.org/docs/current/using-explain.html | PostgreSQL Global Dev. Group | official docs | intermediar | EN | Gratuit | NV | Cum citești planurile de execuție pentru a optimiza interogări. |

### Inferences
- SRE books + OTel + logging HOWTO give a complete free path for the `obs` deck. SLOs come from the Workbook chapter.

### Gaps
- sre.google, wesmckinney.com and opentelemetry.io could not be fetched. Free status and exact chapter URLs must be rechecked.
- Whether the "FinOps for Engineers" course is free was not confirmed (the search snippet only showed its URL).

---

## Security for data platforms (supporting catalog, deck `secur`)

### Takeaway
OWASP (Top 10, API Security Top 10 2023, Cheat Sheet Series), the cloud IAM best-practice guides and NIST SP 800-53 together cover least privilege, secrets management, encryption and API security for free. No URL in this section could be fetched in this session (all NV).

### Cited Findings
- No security URL could be fetched (network policy). The canonical URLs come from prior knowledge, and the GCP IAM page was seen redirecting to docs.cloud.google.com. — see Gaps.

#### Catalog — deck `secur`
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | OWASP Top 10 | https://owasp.org/www-project-top-ten/ | OWASP Foundation | guide | începător | EN | Gratuit; CC BY-SA | NV | Cele mai frecvente 10 riscuri de securitate în aplicațiile web. |
| 2 | OWASP API Security Top 10 (2023) | https://owasp.org/API-Security/editions/2023/en/0x00-header/ | OWASP | guide | intermediar | EN | Gratuit; CC BY-SA | NV | Riscurile specifice API-urilor (autorizare la nivel de obiect, rate limiting etc.). |
| 3 | OWASP Secrets Management Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html | OWASP | guide | intermediar | EN | Gratuit; CC BY-SA | NV | Cum stochezi, rotești și auditezi secretele (chei, parole, token-uri). |
| 4 | OWASP SQL Injection Prevention Cheat Sheet | https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html | OWASP | guide | începător | EN | Gratuit | NV | Interogări parametrizate și alte apărări contra SQL injection. |
| 5 | OWASP Cheat Sheet Series (index; vezi Cryptographic Storage, Authorization) | https://cheatsheetseries.owasp.org/ | OWASP | guide | toate | EN | Gratuit | NV | Colecție de fișe scurte pe teme de securitate, inclusiv criptare și autorizare. |
| 6 | AWS IAM – Security best practices | https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html | AWS | official docs | intermediar | EN | Gratuit | NV | Least privilege, roluri temporare, MFA și auditul permisiunilor în AWS. |
| 7 | Google Cloud – Using IAM securely | https://docs.cloud.google.com/iam/docs/using-iam-securely | Google Cloud | official docs | intermediar | EN | Gratuit | NV (redirect observat) | Recomandări GCP pentru least privilege și conturi de serviciu. |
| 8 | Azure Key Vault – Overview | https://learn.microsoft.com/en-us/azure/key-vault/general/overview | Microsoft | official docs | începător | EN (+ RO automat) | Gratuit | NV | Gestionarea centralizată a secretelor, cheilor și certificatelor. |
| 9 | NIST SP 800-53 Rev. 5 | https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final | NIST | official docs | avansat | EN | Gratuit (domeniu public SUA) | NV | Catalogul de referință al controalelor de securitate (acces, criptare, audit). |
| 10 | Building Secure and Reliable Systems | https://sre.google/books/ | Google | open book | intermediar–avansat | EN | Gratuit online | NV | Carte Google gratuită despre proiectarea sistemelor sigure și fiabile. |

### Inferences
- OWASP lists are general web/API lists. In the app they should be framed for data APIs and SQL injection in pipelines.

### Gaps
- No data-platform-specific free security course was verified.

---

## Data for AI (supporting catalog, deck `ai`)

### Takeaway
Free official material covers feature stores (Feast), vector databases (pgvector, Qdrant, Weaviate), RAG (LlamaIndex/LangChain docs, Hugging Face Cookbook) and evaluation (Ragas). Plus DataTalksClub's LLM Zoomcamp. None of it was fetched (NV).

#### Catalog — deck `ai`
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | LLM Zoomcamp | https://github.com/DataTalksClub/llm-zoomcamp | DataTalksClub | free course | intermediar | EN | Gratuit | NV | Curs gratuit despre RAG: căutare vectorială, evaluare, monitorizare. |
| 2 | Hugging Face LLM Course | https://huggingface.co/learn/llm-course/chapter1/1 | Hugging Face | free course | începător–intermediar | EN | Gratuit | NV | Transformere, tokenizare, embeddings și fine-tuning, cu exemple practice. |
| 3 | Hugging Face Open-Source AI Cookbook | https://huggingface.co/learn/cookbook/index | Hugging Face | tutorial | intermediar | EN | Gratuit; Apache-2.0 | NV | Rețete practice de RAG, embeddings, evaluare cu LLM-as-judge. |
| 4 | Feast docs (feature store) | https://docs.feast.dev/ | Feast (LF AI & Data) | official docs | intermediar | EN | Gratuit; Apache-2.0 | NV | Feature store open source: definirea și servirea caracteristicilor pentru ML. |
| 5 | pgvector | https://github.com/pgvector/pgvector | pgvector | official docs | intermediar | EN | Gratuit; PostgreSQL License | NV | Căutare vectorială direct în PostgreSQL (indecși HNSW și IVFFlat). |
| 6 | Qdrant Documentation | https://qdrant.tech/documentation/ | Qdrant | official docs | intermediar | EN | Gratuit; Apache-2.0 | NV | Bază de date vectorială: colecții, filtre, căutare hibridă. |
| 7 | Weaviate Docs | https://docs.weaviate.io/weaviate | Weaviate | official docs | intermediar | EN | Gratuit; BSD-3 | NV | Bază de date vectorială cu vectorizare integrată și căutare hibridă. |
| 8 | LlamaIndex docs (ingestion, chunking, RAG) | https://docs.llamaindex.ai/en/stable/ | LlamaIndex | official docs | intermediar | EN | Gratuit; MIT | NV | Cum pregătești documentele pentru RAG: încărcare, fragmentare, indexare. |
| 9 | Ragas docs (evaluare RAG) | https://docs.ragas.io/ | Ragas | official docs | intermediar | EN | Gratuit; Apache-2.0 | NV | Metrici pentru evaluarea sistemelor RAG (faithfulness, relevanță, recall). |
| 10 | Google Machine Learning Crash Course | https://developers.google.com/machine-learning/crash-course | Google | free course | începător | EN | Gratuit | NV | Fundamente ML (date, features, evaluare), utile înainte de feature pipelines. |

### Gaps
- No URL was verified. LangChain docs moved domains several times, so they are excluded until checked.

---

## Reputable free interview-prep resources for data engineers?

### Takeaway
Free, reputable, **data-engineering-specific** interview guides are scarce. Most DE-specific prep kits found are paid. A free stack combines the general System Design Primer, Chip Huyen's free ML Interviews book, SQL practice (DataLemur's free tier, SQLBolt, Mode SQL tutorial), the DE Handbook's interview section and DDIA-style topics (replication, partitioning, batch vs stream).

### Cited Findings
- System Design Primer (donnemartin) is the most-cited free system design repo, with 250k+ stars. Other free options: ByteByteGo system-design-101, karanpratapsingh/system-design, Tech Interview Handbook. — [KDnuggets (S)](https://www.kdnuggets.com/10-github-repositories-to-ace-any-tech-interview); [DEV list (S)](https://dev.to/kumarkalyan/17-best-free-github-repositories-to-crack-system-design-interviews-h5p)
- The search found no clearly free, DE-specific GitHub interview guide. Several DE prep kits are paid (e.g., a $39 kit, the paid DataInterview). Typical DE system-design topics are replication, partitioning, consistency models, batch vs stream, and storage engine internals. — [DataInterview blog (S)](https://www.datainterview.com/blog/datainterview-vs-system-design-primer); [DEV DE prep kit (S, paid product)](https://dev.to/datanestdigital/data-engineering-interview-guide-data-engineering-interview-prep-kit-2mp6)

#### Catalog — deck `interviu`
| # | Title | URL | Provider | Type | Level | Lang | Cost/License | Ver. | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | The System Design Primer | https://github.com/donnemartin/system-design-primer | Donne Martin | guide | intermediar | EN | Gratuit; CC BY 4.0 | S (citat larg) | Ghidul gratuit de referință pentru interviuri de system design: scalare, cache, partiționare. |
| 2 | system-design-101 | https://github.com/ByteByteGoHq/system-design-101 | ByteByteGo | guide (vizual) | începător–intermediar | EN | Gratuit | NV | Explicații vizuale scurte ale conceptelor de system design. |
| 3 | Tech Interview Handbook | https://www.techinterviewhandbook.org/ | Yangshun Tay | guide | toate | EN | Gratuit; MIT | NV | Ghid complet de pregătire: CV, algoritmi, comportamental, negociere. |
| 4 | Data Engineer Handbook (secțiunea interviuri) | https://github.com/DataExpert-io/data-engineer-handbook | DataExpert.io | guide | intermediar | EN | Gratuit | NV | Resurse curate pentru interviuri DE: SQL, modelare de date, system design. |
| 5 | Introduction to Machine Learning Interviews Book | https://huyenchip.com/ml-interviews-book/ | Chip Huyen | open book | intermediar | EN | Gratuit online | NV | Carte gratuită despre procesul de interviu ML/date și întrebări tipice. |
| 6 | DataLemur (SQL interview questions) | https://datalemur.com/ | Nick Singh | tutorial / practică | începător–intermediar | EN | Freemium (multe întrebări gratuite) | NV | Întrebări SQL reale de interviu, cu un tutorial SQL gratuit. |
| 7 | SQLBolt | https://sqlbolt.com/ | SQLBolt | tutorial interactiv | începător | EN | Gratuit | NV | Lecții SQL interactive, de la SELECT la JOIN și agregări. |
| 8 | Mode SQL Tutorial | https://mode.com/sql-tutorial/ | Mode (ThoughtSpot) | tutorial | începător–intermediar | EN | Gratuit | NV | Tutorial SQL complet, inclusiv funcții fereastră și optimizare. |
| 9 | Data Engineering Cookbook | https://github.com/andkret/Cookbook | Andreas Kretz | open book | intermediar | EN | Gratuit | NV | Carte deschisă cu concepte DE, cazuri de studiu și întrebări de interviu. |

### Inferences
- The app could present a "DE system design" mini-path: System Design Primer (partitioning, replication, caching) + DE Zoomcamp batch and streaming modules + the SRE SLO chapter.

### Gaps
- No free, authoritative, DE-specific system design guide was confirmed. This is reported as a real gap, not as a search failure.
- **Romanian-language resources:** confirmed only the partial Romanian translation of the official Python tutorial and documentation (docs.python.org/ro, S). The GDPR text in Romanian (EUR-Lex) and ANSPDCP are authoritative but NV. Microsoft Learn offers a machine-translated ro-ro interface (NV). DataCamp has a Romanian interface, but it is freemium/paid ($14+/month per search), so it is excluded. The Bittnet "Data Science in Python Fundamentals" course is taught in Romanian, but it is paid/commercial and its price is not shown. — [Bittnet (S)](https://www.bittnet.ro/?p=15611); [DataCamp RO (S)](https://www.datacamp.com/ro/blog/best-free-resources-to-learn-python-for-data-science). No free Romanian-language course on data engineering, data quality, observability or FinOps was found.

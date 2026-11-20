# Free learning resources: streaming, Kafka, orchestration, dbt, containers, IaC, Linux, networking, APIs (deck ids: stream, flink, kafka, orchestrare, dbt, docker, iac, linux, net, api)

> **How the URLs were checked, and what this means for the app.** In this research session, direct fetching (WebFetch and curl) was **blocked by the network policy**. Every fetch failed with DNS/proxy refusals, including kafka.apache.org, spark.apache.org, nightlies.apache.org, beam.apache.org, developer.confluent.io and oreilly.com. No URL could be opened and checked for HTTP 200 or redirects. Instead, each URL has one of these marks:
> - **[S]** The exact URL (or its canonical form) appeared in **web search results dated November 2026**, so it is indexed and very likely live. The source column gives the citation.
> - **[K]** The URL comes from prior knowledge and is a well-established, long-lived URL, but it **was not confirmed in this session**. Run a link check (`curl -sIL`) before shipping. Treat it as "to be verified."
> - **[!]** A known problem: shut down, moved, or with conditions attached.
>
> Recommendation for the app: run an automated link checker (HTTP status plus final URL after redirects) over every row before publishing, and re-run it periodically.
>
> Language: almost all resources are **English (EN)**. The summaries are in Romanian, as requested. RO translations exist only in isolated cases (for example, some kubernetes.io pages have community localizations; the linuxcommand.org page lists translations of TLCL).

---

## Q1: What are the official docs and official free courses for each tool?

### Takeaway
Every tool has free official docs, and most have free official courses: Confluent Developer (Kafka/Flink), Astronomer Academy (Airflow), dbt Learn (dbt), HashiCorp Developer tutorials (Terraform), Docker get-started workshop, kubernetes.io tutorials. Free official badges exist for dbt Fundamentals (badge after course plus quiz). Airflow 3 Fundamentals and Terraform Associate 004 are paid exams (about $150 for Airflow, with free vouchers only through promotions). Big 2025–2026 changes to cover in the app: Kafka 4.x has no ZooKeeper (KRaft only), Airflow 3.x (`airflow.sdk` imports, latest docs at 3.3.x), Terraform Associate 004 (003 retired on 8 January 2026), and OpenTofu 1.12/1.13 as the open-source (MPL) alternative to Terraform under BSL.

### Cited Findings

#### Status facts (late 2026)
- Kafka 4.0 is "the first major release to operate entirely without Apache ZooKeeper". KRaft is the only mode. Migrating requires moving to KRaft on 3.x first (3.9 is the bridge release). Versioned docs exist up to /43/ and /44/ (4.3, 4.4) — [Kafka 4.0 announcement](https://kafka.apache.org/blog/2025/03/18/apache-kafka-4.0.0-release-announcement/); [KRaft vs ZooKeeper (4.4)](https://kafka.apache.org/44/getting-started/zk2kraft/)
- The kafka.apache.org docs site appears to have a new versioned structure (`/44/getting-started/...`). The classic `https://kafka.apache.org/documentation/` link could not be confirmed and probably redirects to the latest version — [Kafka 4.3 upgrade](https://kafka.apache.org/43/getting-started/upgrade/) **[flag: check the redirect]**
- The Airflow TaskFlow tutorial is published under `/stable/` and versioned paths up to **3.3.2**. Airflow 3 imports from `airflow.sdk` — [Airflow TaskFlow tutorial](https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html)
- Astronomer offers two Airflow 3 certifications (Fundamentals and DAG Authoring). Prep courses are free on Astronomer Academy. Exam: 75 questions, 60 min, 70% to pass, **$150**. Free exams come only through events or workshops (for example, a crash course on 14 January 2027 that includes a free exam code) — [Astronomer certification](https://astronomer.io/certification); [Study guide PDF](https://www.astronomer.io/uploads/Apache-Airflow-Fundamentals-Study-Guide.pdf); [Live workshop](https://academy.astronomer.io/live-certification-workshop); [Airflow Summit 2026 session](https://airflowsummit.org/sessions/2026/get-certified-dag-authoring-for-apache-airflow-3/)
- dbt Learn: courses are "100% online and free for everyone". dbt Fundamentals is about 5 h (split into several courses). It awards a **dbt Fundamentals badge** after the course and the final quiz (issued at credentials.getdbt.com). Community forum reports say the badge sometimes arrives late or not at all (a thread from July 2026). The Analytics Engineering and Architect certifications are paid (**$200** per a third-party source, not confirmed officially) — [dbt Learn](https://getdbt.com/dbt-learn); [dbt blog: new learn courses](https://www.getdbt.com/blog/new-learn-courses); [dbt Discourse](https://discourse.getdbt.com/t/dbt-fundamentals/20441); [techinterview directory (3rd party)](https://www.techinterview.org/bootcamp_directory/p/dbt-learn/)
- The dbt Fusion engine (written in Rust) can be used for free locally by dbt Core users. Fusion material is mostly webinars and workshops, not a dedicated course — [dbt Fusion blog](https://docs.getdbt.com/blog/dbt-fusion-engine); [Fusion quickstart](https://docs.getdbt.com/guides/fusion?step=5)
- Confluent Developer: free courses (Kafka 101, Schema Registry 101 with about 12 modules, Kafka Connect 101 with about 15 modules and 5 exercises, Apache Flink courses). The page also promotes a "Data Streaming Engineer" certificate — [Confluent courses](https://developer.confluent.io/courses/); [Medium Confluent 2024 roundup](https://medium.com/confluent/7-more-free-awesome-apache-kafka-resources-for-beginners-2024-6f7581e9a613); [Confluent Flink course](https://developer.confluent.io/courses/apache-flink); [Flink Java course](https://developer.confluent.io/courses/flink-java/overview/)
- Terraform Associate **004**: 1 h, multiple choice, tests Terraform 1.12. **003 was retired on 8 January 2026.** The official learning path, sample questions and content list are free (the exam itself is paid) — [Associate 004 study](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-study-004); [Sample questions 004](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-questions-004); [Review 004](https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-review-004)
- HashiCorp tutorials hub: get-started tracks for AWS, Azure, Docker, GCP, OCI and a sandbox. HCP Terraform has a free signup — [Terraform tutorials](https://developer.hashicorp.com/terraform/tutorials); [AWS get started](https://developer.hashicorp.com/terraform/tutorials/aws-get-started)
- OpenTofu 1.12.0 (14 May 2026, dynamic `prevent_destroy`), 1.13.0 (30 September 2026, Windows ARM64, experimental linting), patches 1.13.1/1.12.7. One source puts Terraform at 1.15.x — [InfoQ OpenTofu 2026](https://infoq.com/news/2026/05/opentofu-release-terraform); [OpenTofu blog](https://opentofu.org/blog/archive/); [AlternativeTo 1.13](https://alternativeto.net/news/2026/10/opentofu-1-13-adds-windows-arm64-and-planning-functions/); [OpenTofu releases](https://github.com/opentofu/opentofu/releases)
- Docker get-started: the official workshop is "45-minute, step-by-step" — [Docker workshop](https://docs.docker.com/get-started/hands-on-overview/)
- kubernetes.io "Learn Kubernetes Basics" still exists (modules: deploy, scale, update, debug), but the commands now run locally (kubectl and minikube). The Katacoda interactive part was removed (Katacoda stopped working on 31 March 2023; removed from the docs in October 2023) — [K8s basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/); [Katacoda shutdown blog](https://kubernetes.io/blog/2023/02/14/kubernetes-katacoda-tutorials-stop-from-2023-03-31/)
- Flink "Learn Flink: Hands-On Training" covers 4 concepts: continuous processing, event time, stateful processing, state snapshots. Each section has an exercise — [Learn Flink overview (master)](https://ci.apache.org/projects/flink/flink-docs-master/docs/learn-flink/overview/)
- Spark Structured Streaming guide: it has a "Handling Late Data and Watermarking" section. Watermarking has existed since Spark 2.1. In recent versions, the guide is split into several pages under `docs/latest/streaming/` (single-page form `structured-streaming-programming-guide.html` up to 3.5.x) — [Spark 3.5.7 guide](https://spark.apache.org/docs/3.5.7/structured-streaming-programming-guide.html); [Databricks watermarks](https://docs.databricks.com/structured-streaming/watermarks)
- IETF drafts for APIs: Idempotency-Key header (draft-07, October 2025, Standards Track; it follows the Stripe convention) and RateLimit header fields (draft-11, May 2026; defines `RateLimit-Policy` and `RateLimit`; the names changed between revisions). Both are still drafts, not RFCs — [Idempotency-Key draft](https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/); [RateLimit draft](https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers); [brandur.org](https://www.brandur.org/fragments/idempotency-key-draft)
- The Cloudflare Learning Center appears to also be served from developers.cloudflare.com/internet/ (for example `/internet/protocols/dns`), and the 429 page explains Retry-After and RFC 6585 — [Cloudflare internet/DNS](https://developers.cloudflare.com/internet/protocols/dns); [Cloudflare error 429](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-429/)

#### Catalog per deck
Abbreviations. Type: OD = official docs, OC = official free course, T = tutorial, IL = interactive lab, OB = open book, V = video. Level: B = beginner, I = intermediate, A = advanced. Language: EN unless noted.

**deck `stream` (concepts plus Spark Structured Streaming, Beam)**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Structured Streaming Programming Guide | https://spark.apache.org/docs/latest/streaming/index.html | Apache Spark | OD | I | Free, Apache 2.0 | Ghidul oficial: modelul tabelului nelimitat, ferestre pe event time, watermark-uri, checkpoint-uri și garanții end-to-end exactly-once. | [K] (single-page version up to 3.5.x [S]: https://spark.apache.org/docs/3.5.7/structured-streaming-programming-guide.html) |
| 2 | Streaming 101 (Tyler Akidau) | https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/ | O'Reilly Radar | Article | B–I | Free | Eseul clasic despre event time vs processing time, ferestre și de ce batch-ul e un caz particular de streaming. | [K] (fetch blocked) |
| 3 | Streaming 102 | https://www.oreilly.com/radar/the-world-beyond-batch-streaming-102/ | O'Reilly Radar | Article | I | Free | Continuare: watermark-uri, triggere, acumulare – modelul Dataflow explicat pe exemple. | [K] |
| 4 | Apache Beam Programming Guide | https://beam.apache.org/documentation/programming-guide/ | Apache Beam | OD | I | Free, Apache 2.0 | Referința Beam: PCollection, windowing, watermarks, triggere, date întârziate. | [K] |
| 5 | Tour of Beam | https://tour.beam.apache.org/ | Apache Beam | IL | B | Free | Tur interactiv în browser cu exemple rulabile (Java/Python/Go) despre conceptele Beam. | [K] |
| 6 | Beam Playground | https://play.beam.apache.org/ | Apache Beam | IL | B | Free | Rulezi pipeline-uri Beam direct în browser, fără instalare. | [K] |
| 7 | Databricks: Apply watermarks | https://docs.databricks.com/structured-streaming/watermarks | Databricks | OD | I | Free | Cum controlezi starea și datele întârziate cu withWatermark, inclusiv la join-uri și agregări. | [S] |
| 8 | Kafka exactly-once semantics (Confluent blog) | https://www.confluent.io/blog/exactly-once-semantics-are-possible-heres-how-apache-kafka-does-it/ | Confluent | Article | A | Free | Explică producătorul idempotent, tranzacțiile și cum se obține exactly-once în Kafka. | [K] |

**deck `flink`**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Learn Flink: Hands-On Training | https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/overview/ | Apache Flink | OD/T | B–I | Free, Apache 2.0 | Training oficial: procesare continuă, event time, stare și snapshot-uri, cu exerciții practice. | [K] (master version [S] at ci.apache.org) |
| 2 | Timely Stream Processing (concepts) | https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/ | Apache Flink | OD | I | Free | Event time, watermark-uri, lateness și ferestre în Flink. | [K] |
| 3 | Fault tolerance / checkpointing | https://nightlies.apache.org/flink/flink-docs-stable/docs/learn-flink/fault_tolerance/ | Apache Flink | OD | I–A | Free | Cum asigură Flink exactly-once prin checkpoint-uri și state backend-uri. | [K] |
| 4 | Flink SQL / Table API tutorials | https://nightlies.apache.org/flink/flink-docs-stable/docs/try-flink/table_api/ | Apache Flink | T | B | Free | Primul pipeline Flink cu Table API/SQL într-un mediu Docker local. | [K] |
| 5 | Apache Flink 101 / Flink courses | https://developer.confluent.io/courses/apache-flink | Confluent | OC | B | Free | Curs video oficial despre conceptele Flink (stream, stare, timp, SQL). | [S] |
| 6 | Building Flink Applications in Java | https://developer.confluent.io/courses/flink-java/overview/ | Confluent | OC | I | Free | Curs practic: aplicații Flink DataStream în Java, conectate la Kafka. | [S] |
| 7 | Flink training repo (exercises) | https://github.com/apache/flink-training | Apache Flink | IL/T | I | Free, Apache 2.0 | Exercițiile oficiale (taxi rides) care însoțesc Learn Flink. | [K] |

**deck `kafka`**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Apache Kafka Documentation | https://kafka.apache.org/documentation/ | Apache Kafka | OD | B–A | Free, Apache 2.0 | Documentația oficială: topic-uri, partiții, replicare, consumer groups, Connect, Streams (Kafka 4.x, doar KRaft). | [K] — versioned pages [S], e.g. https://kafka.apache.org/44/getting-started/zk2kraft/ |
| 2 | Kafka 4.0 release announcement | https://kafka.apache.org/blog/2025/03/18/apache-kafka-4.0.0-release-announcement/ | Apache Kafka | Article | I | Free | Ce s-a schimbat în 4.0: fără ZooKeeper, KRaft implicit, noul protocol de rebalansare, cozi. | [S] |
| 3 | Confluent Developer – Courses (hub) | https://developer.confluent.io/courses/ | Confluent | OC | B–A | Free (account for some exercises) | Catalogul de cursuri gratuite Kafka/Flink/Schema Registry/Connect. | [S] |
| 4 | Apache Kafka 101 | https://developer.confluent.io/courses/apache-kafka/events/ | Confluent | OC/V | B | Free | Serie video (Tim Berglund) despre evenimente, topic-uri, partiții, brokeri, producători și consumatori. | [K] (hub [S]) |
| 5 | Schema Registry 101 | https://developer.confluent.io/courses/schema-registry/key-concepts/ | Confluent | OC | I | Free | Scheme ca contracte între producători și consumatori; Avro/Protobuf/JSON Schema; compatibilitate. | [K] (hub [S]) |
| 6 | Kafka Connect 101 | https://developer.confluent.io/courses/kafka-connect/intro/ | Confluent | OC | I | Free | Conectori source/sink, SMT-uri, deployment și depanare – cu exerciții. | [K] (hub [S]) |
| 7 | Kafka tutorials (Confluent) | https://developer.confluent.io/tutorials/ | Confluent | T | I | Free | Rețete scurte, rulabile, pentru probleme concrete (consumatori, Streams, Flink SQL). | [K] |
| 8 | Kafka Streams docs | https://kafka.apache.org/documentation/streams/ | Apache Kafka | OD | I–A | Free | Biblioteca de stream processing inclusă în Kafka: KStream/KTable, ferestre, exactly-once. | [K] |
| 9 | Confluent Platform docs – Schema Registry | https://docs.confluent.io/platform/current/schema-registry/index.html | Confluent | OD | I | Free docs (Schema Registry: Confluent Community License) | Referința oficială pentru Schema Registry și regulile de compatibilitate. | [K] |

**deck `orchestrare` (Airflow, plus a short note on Dagster and Prefect)**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Airflow docs (stable) | https://airflow.apache.org/docs/apache-airflow/stable/index.html | Apache Airflow | OD | B–A | Free, Apache 2.0 | Documentația oficială Airflow 3.x: DAG-uri, task-uri, assets, scheduler, Task SDK. | [K] (stable path [S]) |
| 2 | Tutorial: Pythonic DAGs with TaskFlow | https://airflow.apache.org/docs/apache-airflow/stable/tutorial/taskflow.html | Apache Airflow | T | B | Free | Construiești un ETL cu @dag/@task și importuri din airflow.sdk (Airflow 3). | [S] |
| 3 | Fundamentals tutorial | https://airflow.apache.org/docs/apache-airflow/stable/tutorial/fundamentals.html | Apache Airflow | T | B | Free | Primul DAG pas cu pas: operatori, dependențe, templating. | [K] |
| 4 | Upgrading to Airflow 3 | https://airflow.apache.org/docs/apache-airflow/stable/installation/upgrading_to_airflow3.html | Apache Airflow | OD | I | Free | Ce s-a schimbat în Airflow 3 (Task SDK, assets în loc de datasets, UI nou, eliminări). | [K] |
| 5 | Astronomer Academy (Airflow 101 learning path) | https://academy.astronomer.io/ | Astronomer | OC | B–I | Free with account | Cursuri gratuite de pregătire pentru certificările Airflow 3 Fundamentals și DAG Authoring. | [K] (academy.astronomer.io/live-certification-workshop [S]) |
| 6 | Astronomer certification page | https://astronomer.io/certification | Astronomer | Cert info | B–I | Exam $150 (free vouchers only at events) | Detalii despre certificările Airflow 3 și cum obții voucher gratuit la workshop-uri. | [S] |
| 7 | Airflow Fundamentals Study Guide (PDF) | https://www.astronomer.io/uploads/Apache-Airflow-Fundamentals-Study-Guide.pdf | Astronomer | Guide | B | Free | Ghid de studiu: 75 întrebări, 60 min, prag 70% – temele examenului. | [S] |
| 8 | Dagster docs / Dagster University | https://docs.dagster.io/ ; https://courses.dagster.io/ | Dagster Labs | OD/OC | B–I | Free | Alternativă asset-centric la Airflow; cursuri gratuite "Dagster Essentials". | [K] |
| 9 | Prefect docs | https://docs.prefect.io/ | Prefect | OD | B | Free (OSS Apache 2.0) | Orchestrare Python-first cu decoratori @flow/@task; bun pentru comparație cu Airflow. | [K] |

**deck `dbt`**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | dbt Learn (catalog) | https://learn.getdbt.com/catalog | dbt Labs | OC | B–A | Free (account) | Toate cursurile gratuite dbt: Fundamentals, Jinja/Macros, Advanced Testing, Snapshots etc. | [K] (landing page https://getdbt.com/dbt-learn [S]) |
| 2 | dbt Fundamentals | https://learn.getdbt.com/courses/dbt-fundamentals | dbt Labs | OC | B | Free, badge after the quiz | Cursul de bază (~5 h): modele, surse, teste, documentație, deployment; acordă badge. | [K] (the old domain courses.getdbt.com still appears in the index [S]) |
| 3 | dbt Developer Hub – docs | https://docs.getdbt.com/docs/introduction | dbt Labs | OD | B–A | Free | Documentația oficială dbt (Core, platformă, Fusion). | [K] |
| 4 | Quickstart for dbt Core | https://docs.getdbt.com/guides/manual-install | dbt Labs | T | B | Free, Apache 2.0 (Core) | Instalezi dbt Core local și construiești primul proiect. | [K] |
| 5 | dbt Fusion quickstart | https://docs.getdbt.com/guides/fusion | dbt Labs | T | I | Free locally | Primii pași cu motorul Fusion (Rust), gratuit local pentru utilizatorii Core. | [S] |
| 6 | dbt Best Practices guides | https://docs.getdbt.com/best-practices | dbt Labs | OD | I | Free | Cum structurezi un proiect (staging/intermediate/marts), stil, materializări. | [K] |
| 7 | jaffle_shop / jaffle-shop sample project | https://github.com/dbt-labs/jaffle-shop | dbt Labs | T/repo | B | Free, Apache 2.0 | Proiectul demo oficial pentru exersare. | [K] |
| 8 | dbt Discourse / Community | https://discourse.getdbt.com/ | dbt Labs | Forum | B–A | Free | Forum pentru întrebări, inclusiv probleme cu badge-ul Fundamentals. | [S] |

**deck `docker` (Docker and Kubernetes)**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Docker – Get started | https://docs.docker.com/get-started/ | Docker | OD/T | B | Free | Concepte (imagini, containere, registre) și primii pași oficiali. | [K] |
| 2 | Docker workshop (45 min) | https://docs.docker.com/get-started/hands-on-overview/ | Docker | T | B | Free | Workshop pas cu pas: containerizezi o aplicație, volume, rețele, Compose. | [S] |
| 3 | Dockerfile reference & best practices | https://docs.docker.com/build/building/best-practices/ | Docker | OD | I | Free | Cum scrii Dockerfile-uri mici, sigure și cache-friendly (multi-stage). | [K] |
| 4 | Docker Compose docs | https://docs.docker.com/compose/ | Docker | OD | B–I | Free | Rulezi stive multi-container (ex. Airflow+Postgres) cu un fișier YAML. | [K] |
| 5 | Kubernetes – Learn Kubernetes Basics | https://kubernetes.io/docs/tutorials/kubernetes-basics/ | Kubernetes (CNCF) | T | B | Free, CC BY 4.0 docs | Deploy, scalare, update și depanare a unei aplicații cu kubectl/minikube. | [S] |
| 6 | Kubernetes Concepts | https://kubernetes.io/docs/concepts/ | Kubernetes | OD | I | Free | Pods, Deployments, Services, ConfigMaps, Jobs/CronJobs – fundamentul pentru pipeline-uri. | [K] |
| 7 | Introduction to Kubernetes (LFS158) | https://training.linuxfoundation.org/training/introduction-to-kubernetes/ | Linux Foundation | OC | B | Free (audit) | Curs introductiv gratuit al Linux Foundation despre arhitectura Kubernetes. | [K] |
| 8 | Killercoda – Kubernetes/Docker playgrounds | https://killercoda.com/playgrounds | Killercoda | IL | B–A | Free with account (paid tiers available) | Terminal în browser cu cluster Kubernetes/Docker temporar și scenarii ghidate. | [K] (free-account status confirmed by 3rd-party guides) |
| 9 | iximiuz Labs | https://labs.iximiuz.com/ | iximiuz | IL | I | Free tier | Playground-uri și tutoriale despre containere, rețele Linux și Kubernetes. | [K] |

**deck `iac` (Terraform plus OpenTofu)**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Terraform tutorials (hub) | https://developer.hashicorp.com/terraform/tutorials | HashiCorp (IBM) | OC/T | B–A | Free | Toate tutorialele oficiale Terraform, pe cloud-uri și teme. | [S] |
| 2 | Get started – Docker / AWS | https://developer.hashicorp.com/terraform/tutorials/docker-get-started ; https://developer.hashicorp.com/terraform/tutorials/aws-get-started | HashiCorp | T | B | Free (Docker track needs no cloud account) | Primul ciclu init/plan/apply; varianta Docker e ideală fără cont cloud. | AWS [S], Docker [K] |
| 3 | Terraform configuration language | https://developer.hashicorp.com/terraform/tutorials/configuration-language | HashiCorp | T | I | Free | Variabile, output-uri, module, funcții, expresii HCL. | [S] |
| 4 | Terraform docs (language) | https://developer.hashicorp.com/terraform/language | HashiCorp | OD | I–A | Free docs; Terraform is under BSL 1.1 | Referința limbajului: resurse, state, backend-uri, lifecycle. | [K] |
| 5 | Terraform Associate 004 – learning path | https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-study-004 | HashiCorp | OC | I | Free prep; exam is paid | Traseu oficial de pregătire pentru Associate 004 (Terraform 1.12). | [S] |
| 6 | Associate 004 – sample questions | https://developer.hashicorp.com/terraform/tutorials/certification-004/associate-questions-004 | HashiCorp | Quiz | I | Free | Întrebări de exemplu oficiale pentru examen. | [S] |
| 7 | OpenTofu docs | https://opentofu.org/docs/ | OpenTofu (Linux Foundation) | OD | B–A | Free, MPL 2.0 | Fork-ul open-source al Terraform; aceeași sintaxă HCL, plus criptarea state-ului. | [K] (opentofu.org/blog [S]) |
| 8 | OpenTofu releases | https://github.com/opentofu/opentofu/releases | OpenTofu | Changelog | I | Free, MPL 2.0 | Ce aduce fiecare versiune (1.12: prevent_destroy dinamic; 1.13: Windows ARM64, linting). | [S] |

**deck `linux`**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | The Linux Command Line (W. Shotts) | https://linuxcommand.org/tlcl.php | LinuxCommand.org | OB | B–I | Free PDF, CC BY-NC-ND (per 3rd-party sources) | Cartea de referință pentru shell: navigare, redirecționare, pipe-uri, scripturi bash. Ediția a 7-a internet (2026). | [S] (www.linuxcommand.org/tlcl.php) |
| 2 | LinuxCommand.org – Learning the Shell / Writing Shell Scripts | https://linuxcommand.org/lc3_learning_the_shell.php | LinuxCommand.org | T | B | Free | Tutorial online scurt, același autor – bun pentru carduri rapide. | [K] |
| 3 | GNU Bash Reference Manual | https://www.gnu.org/software/bash/manual/ | GNU | OD | I–A | Free, GFDL | Manualul oficial bash: expansiuni, quoting, set -euo pipefail, funcții. | [K] |
| 4 | GNU Coreutils manual | https://www.gnu.org/software/coreutils/manual/ | GNU | OD | I | Free, GFDL | sort, cut, uniq, wc, head/tail, split – uneltele de bază pentru procesare text. | [K] |
| 5 | systemd.timer man page | https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html | freedesktop.org | OD | I | Free | Programarea joburilor cu timere systemd (alternativa modernă la cron). | [K] |
| 6 | crontab(5) man page | https://man7.org/linux/man-pages/man5/crontab.5.html | man7.org | OD | B | Free | Sintaxa crontab, variabile de mediu și capcane. | [K] |
| 7 | Bash Guide (Greg's Wiki) / BashFAQ | https://mywiki.wooledge.org/BashGuide | Wooledge wiki | T | B–I | Free | Ghid comunitar foarte riguros despre bash corect (quoting, arrays, erori). | [K] |
| 8 | ShellCheck | https://www.shellcheck.net/ | ShellCheck (OSS) | IL | B–I | Free, GPLv3 | Analizator online care explică greșelile din scripturile shell. | [K] |
| 9 | The Missing Semester (MIT) | https://missing.csail.mit.edu/ | MIT CSAIL | V/T | B | Free, CC BY-NC-SA | Shell, scripting, data wrangling, git – cursul MIT despre unelte. | [K] |
| 10 | SadServers | https://sadservers.com/ | SadServers | IL | I | Free tier | Scenarii "repară serverul" în browser – depanare Linux reală. | [K] (sadservers.com/kubernetes/playgrounds [S]) |

**deck `net`**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Cloudflare Learning Center – What is DNS? | https://www.cloudflare.com/learning/dns/what-is-dns/ | Cloudflare | T | B | Free | DNS explicat vizual: resolver, root, TLD, servere autoritative. | [K] (Learning Center also at https://developers.cloudflare.com/internet/protocols/dns [S]; **check for a redirect**) |
| 2 | Cloudflare – What is TLS? | https://www.cloudflare.com/learning/ssl/transport-layer-security-tls/ | Cloudflare | T | B | Free | Cum funcționează TLS, handshake-ul și certificatele. | [K] |
| 3 | MDN – An overview of HTTP | https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview | MDN (Mozilla) | OD | B | Free, CC BY-SA 2.5 | Cererile, răspunsurile, metodele, headerele și status code-urile HTTP. | [K] (older path /docs/Web/HTTP/Overview probably redirects) |
| 4 | MDN – HTTP status codes | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status | MDN | OD | B | Free | Referința pentru 2xx/3xx/4xx/5xx – utilă la depanarea API-urilor. | [K] |
| 5 | Julia Evans – wizardzines (free zines) | https://wizardzines.com/ | Julia Evans | Zine | B | The black-and-white zines are free; the colour ones are paid | Benzi desenate tehnice; cele gratuite includ "So You Want to Be a Wizard". Zine-urile de rețea sunt plătite. | [S] |
| 6 | Julia Evans – blog (DNS, networking) | https://jvns.ca/ | Julia Evans | Blog | B–I | Free | Articole clare despre DNS, dig, tcpdump, HTTP – excelente pentru depanare. | [S] |
| 7 | AWS – What is Amazon VPC / PrivateLink | https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html ; https://docs.aws.amazon.com/vpc/latest/privatelink/what-is-privatelink.html | AWS | OD | I | Free | Subrețele, rute, security groups și private endpoints – de ce datele nu trec prin internet. | [K] |
| 8 | Azure Private Link / Private Endpoint | https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview | Microsoft | OD | I | Free | Private endpoints în Azure, cu impact asupra DNS-ului (private DNS zones). | [K] |
| 9 | High Performance Browser Networking (I. Grigorik) | https://hpbn.co/ | O'Reilly / Ilya Grigorik | OB | I–A | Free online | TCP, TLS, HTTP/2 explicate în profunzime, cu accent pe latență. | [K] |
| 10 | Beej's Guide to Network Concepts | https://beej.us/guide/bgnet0/ | Beej | OB | B–I | Free | Introducere prietenoasă în IP, subrețele, DNS, TCP/UDP. | [K] |

**deck `api`**

| # | Title | URL | Provider | Type | Level | Cost/License | Summary (RO) | Ver. |
|---|---|---|---|---|---|---|---|---|
| 1 | Stripe – Idempotent requests | https://docs.stripe.com/api/idempotent_requests | Stripe | OD | I | Free | Exemplul de referință pentru Idempotency-Key: reîncercări sigure fără duplicate. | [K] (Stripe behaviour described by http.dev [S]) |
| 2 | Stripe – Pagination | https://docs.stripe.com/api/pagination | Stripe | OD | B | Free | Paginare cu cursor (starting_after, has_more) – model clasic. | [K] |
| 3 | IETF draft – Idempotency-Key header | https://datatracker.ietf.org/doc/draft-ietf-httpapi-idempotency-key-header/ | IETF | Spec | A | Free | Standardul în lucru pentru headerul Idempotency-Key (draft-07). | [S] |
| 4 | IETF draft – RateLimit header fields | https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers | IETF | Spec | A | Free | Headerele RateLimit-Policy și RateLimit (draft-11, mai 2026). | [S] |
| 5 | MDN – 429 Too Many Requests / Retry-After | https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/429 | MDN | OD | B | Free | Ce înseamnă 429 și cum respecți Retry-After la extragere. | [K] |
| 6 | Cloudflare – Error 429 | https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-429/ | Cloudflare | OD | B | Free | Rate limiting din perspectiva serverului; Retry-After, RFC 6585. | [S] |
| 7 | GitHub REST API – pagination & rate limits | https://docs.github.com/en/rest/using-the-rest-api/using-pagination-in-the-rest-api ; https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api | GitHub | OD/T | B–I | Free | Paginare cu header Link și limitare de rată – exemplu real pe care îl poți exersa gratuit. | [K] |
| 8 | AWS Builders' Library – Timeouts, retries and backoff with jitter | https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/ | AWS | Article | I–A | Free | De ce și cum faci retry cu backoff exponențial și jitter. | [K] |
| 9 | Microsoft REST API Guidelines | https://github.com/microsoft/api-guidelines | Microsoft | Guide | I | Free, CC BY 4.0 | Convenții pentru paginare, erori, long-running operations. | [K] |
| 10 | dlt (data load tool) – REST API source | https://dlthub.com/docs/dlt-ecosystem/verified-sources/rest_api/basic | dltHub | OD/T | I | Free, Apache 2.0 | Extragere declarativă din API-uri REST cu paginare și incremental loading în Python. | [K] |

### Inferences
- With the network policy blocking fetches, about 35% of URLs are [S] and the rest are [K]. The [K] URLs are long-lived official canonical paths, but Confluent course sub-pages, the dbt Learn paths (courses.getdbt.com vs learn.getdbt.com), the new MDN paths (/Guides/, /Reference/) and the Cloudflare Learning Center (possible move to developers.cloudflare.com/internet) are the most likely to redirect.
- Badge/certification summary for the app: **free** = dbt Fundamentals badge (after the course and quiz). **Free courses, paid exam** = Astronomer Airflow 3 Fundamentals/DAG Authoring ($150; free vouchers at events), Terraform Associate 004, dbt Analytics Engineering ($200, unofficial figure), Confluent "Data Streaming Engineer" (status unconfirmed), CKA/CKAD (paid, outside this scope).
- For a Romanian learner, the official resources are in English. The Romanian summaries in the app supply the context, and the Kubernetes docs may have partial community translations.

### Gaps
- No URL could be checked for HTTP status or redirects (fetching was blocked). This needs a link check before publishing.
- I could not confirm whether developer.confluent.io still issues free certificates or badges (the page mentions "get your certificate as a Data Streaming Engineer", but I could not see whether it is free).
- I could not confirm the current canonical dbt Learn domain (learn.getdbt.com vs courses.getdbt.com). Both appear in the index.
- I could not confirm, from official sources in this session, the BSL 1.1 terms for Terraform or IBM's completion of the HashiCorp acquisition (my searches did not return them). Both are well-known facts from 2023–2025, but they are not cited here.
- I did not confirm the exact current Airflow version (3.3.2 is the highest seen in the docs index).

## Q2: Which free interactive environments exist?

### Takeaway
Killercoda (free account, unlimited scenarios on the free tier) is the main free browser playground for Kubernetes, Docker and Linux. Play with Docker/Kubernetes has a deprecation notice from 1 March 2026 and should be treated as unavailable. Katacoda has been shut down since 2023. Alternatives: iximiuz Labs, SadServers, Tour of Beam/Beam Playground, HashiCorp sandbox, the free HCP Terraform tier.

### Cited Findings
- The upstream Play-with-Docker repo has a deprecation notice: the PWD/PWK systems "will be unavailable starting March 1, 2026". The forum suggests iximiuz Labs as an alternative — [Docker forum: labs.play-with-docker.com is down](https://forums.docker.com/t/labs-play-with-docker-com-is-down/150915/2)
- Killercoda: a zero-config Kubernetes playground in the browser, a free account, unlimited scenarios on the free tier, and paid tiers for longer sessions — [collabnix comparison PWD/Killercoda](https://collabnix.com/choosing-the-perfect-kubernetes-playground-a-comparison-of-pwd-killercoda-and-other-options/); [rramos Killercoda article](https://rramos.github.io/2024/06/killercoda)
- Katacoda (O'Reilly) closed in June 2022 for public use. The kubernetes.io tutorials stopped working on 31 March 2023, and Kubernetes has not named an official replacement — [Kubernetes blog](https://kubernetes.io/blog/2023/02/14/kubernetes-katacoda-tutorials-stop-from-2023-03-31/)
- Overview of learn-by-doing platforms (iximiuz) — [iximiuz post](https://iximiuz.com/en/posts/learn-by-doing-platforms/)
- SadServers also offers Kubernetes playgrounds — [SadServers K8s playgrounds](https://sadservers.com/kubernetes/playgrounds)
- HashiCorp has a "sandbox" tutorials section and a free HCP Terraform signup — [Terraform sandbox](https://developer.hashicorp.com/terraform/tutorials/sandbox)
- KodeKloud has free Kubernetes playgrounds (possibly with a free account and limits) — [KodeKloud playground](https://kodekloud.com/playgrounds/playground-kubernetes-single-node-latest)

### Inferences
- For the app: use Killercoda as the default lab link (docker, linux, kubernetes), Tour of Beam for stream, a local Docker setup for Kafka/Flink/Airflow (official Docker Compose quickstarts), and the HashiCorp Docker get-started track for iac (no cloud account needed).
- Remove or mark any Play with Docker / Play with Kubernetes link as [!] unavailable.

### Gaps
- I could not confirm whether labs.play-with-docker.com is actually down in November 2026 (only the announced deprecation).
- I could not confirm Killercoda's current free-tier limits (session length) from an official page.
- I could not confirm the iximiuz Labs and KodeKloud free tiers in 2026.

## Q3: Best open books and free resources for Linux shell and networking?

### Takeaway
For Linux: *The Linux Command Line* (Shotts, free PDF under Creative Commons, 7th internet edition in 2026), GNU Bash and Coreutils manuals, Greg's BashGuide, ShellCheck, MIT Missing Semester. For networking: Cloudflare Learning Center (DNS/TLS), MDN HTTP, Julia Evans (only the black-and-white zines are free; the networking zines are paid, but her blog is free), High Performance Browser Networking (free online), and AWS/Azure docs for VPC and private endpoints.

### Cited Findings
- LinuxCommand.org: TLCL is "available for free download in PDF format under a Creative Commons license". Third-party sources give CC BY-NC-ND (3.0 US). The 7th Internet Edition is dated 2026. The No Starch print 3rd edition (27 January 2026) is paid — [linuxcommand.org/tlcl.php](https://www.linuxcommand.org/tlcl.php); [SourceForge mirror, 7th ed.](https://linuxcommand.sourceforge.io/tlcl.php); [FU Berlin listing](https://www.geo.fu-berlin.de/bibliotheken/Ebooks/The-Linux-Command-Line/index.html); [linuxlinks](https://linuxlinks.com/excellent-no-charge-books-learn-about-linux/14); [Penguin 3rd ed.](https://www.penguin.com.au/books/the-linux-command-line-3rd-edition-9781718504530)
- wizardzines: "the ones with black and white covers are free". Since 2018–2019 the policy has been "old zines free, new ones not". "So You Want to Be a Wizard" is free (December 2017). "Bite Size Networking" was released as paid, and "Networking! ACK!" has no confirmed free status. No DNS zine was found in the results — [wizardzines.com](https://wizardzines.com/); [jvns.ca: So you want to be a wizard](https://jvns.ca/blog/2017/12/01/new-zine--so-you-want-to-be-a-wizard/); [jvns.ca: Bite Size Networking](https://jvns.ca/blog/2019/03/15/new-zine--bite-size-networking-/)
- Cloudflare Learning Center: DNS as the "phone book of the Internet", and SSL/TLS as encryption over HTTP. The content also appears at developers.cloudflare.com/internet/ — [Cloudflare learning](https://cloudflare.com/learning); [developers.cloudflare.com/internet](https://developers.cloudflare.com/internet/)
- HTTP 429 and Retry-After (RFC 6585) explained by Cloudflare — [Cloudflare error 429](https://developers.cloudflare.com/support/troubleshooting/http-status-codes/4xx-client-error/error-429/)
- CNCF's list of Kubernetes resources for 2026 (useful for extending the docker deck) — [CNCF top 28 Kubernetes resources 2026](https://cncf.io/blog/2026/01/19/top-28-kubernetes-resources-for-2026-learn-and-stay-up-to-date)

### Inferences
- The TLCL license (NC-ND) allows linking and free use, but **not** embedding modified content in the app. Linking only is the safe option. The same applies to the Julia Evans zines (link to them, do not copy).
- MDN content is CC BY-SA. Short quotes with attribution are possible, but linking is simpler.

### Gaps
- The MDN pages (HTTP overview, 429) were not returned by search in this session. Their URLs are [K], and MDN restructured its paths in 2025 (`/Guides/`, `/Reference/`), so check for redirects.
- I could not confirm whether Julia Evans has published a new free zine about DNS or networking. As of the available results, the networking zines are paid.
- I could not confirm hpbn.co, beej.us/guide/bgnet0 or missing.csail.mit.edu in this session (all [K]).

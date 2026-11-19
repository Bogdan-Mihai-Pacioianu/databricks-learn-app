# Resurse de învățare data engineering: AWS, Google Cloud, Snowflake (decks aws / gcp / snow; exams awsdea / gcppde / snowcore)

> **How URLs were checked (read first).** This research ran on 2026-11-19 in a sandbox with a restricted network allowlist. Direct fetches (WebFetch and curl) **failed with DNS or proxy errors** for: aws.amazon.com, docs.aws.amazon.com, skillbuilder.aws, workshops.aws, learn.snowflake.com, docs.snowflake.com, quickstarts.snowflake.com, services.google.com, docs.cloud.google.com and www.cloudskillsboost.google. These are sandbox blocks, not proof that the URLs are dead. Only one page loaded fully: `https://cloud.google.com/learn/certification/data-engineer` (HTTP 200). One redirect was observed: `cloud.google.com/bigquery/docs/...` returns **301 to `docs.cloud.google.com/bigquery/docs/...`**, and the other `cloud.google.com/<product>/docs` and `/architecture` paths probably redirect the same way.
>
> Verification status column:
> - **V** = fetched and read.
> - **R** = a redirect was observed.
> - **S** = the exact URL appears in current (2026) web-search indexes, but a direct fetch was blocked.
> - **U** = an unconfirmed URL from known URL patterns; recheck it before shipping.
>
> Re-run a link checker from an unrestricted network before integrating these into the app.

## Key question 1: Official exam guides and free official prep (AWS Skill Builder, Google Cloud Skills Boost / Google Skills, Snowflake University / Hands-On Essentials)

### Takeaway
All three certifications have a public exam guide. Google publishes the most complete free official material: an exam guide PDF, a free sample-question form and a learning path. AWS publishes a detailed HTML exam guide on docs.aws.amazon.com and offers prep through Skill Builder, but whether the 20-question "Official Practice Question Set" is still free could not be confirmed. Snowflake replaced SnowPro Core COF-C02 with **COF-C03, which launched on 2026-02-16**, and runs the free Hands-On Essentials badge workshops.

### Cited Findings

#### Certification record: awsdea (AWS Certified Data Engineer – Associate)
- Exam code/version: **DEA-C01**. The exam guide has a revisions page, and AWS says it publishes revisions at least a month before they take effect. A v1.1 revision is mentioned by a third party. — [AWS exam guide](https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.html) (S); [Revisions page](https://docs.aws.amazon.com/id_id/aws-certification/latest/data-engineer-associate-01/dea-01-revisions.html) (S); [Data Vidhya](https://datavidhya.com/blog/aws-data-engineer-certification/)
- Domains and weights: D1 Data Ingestion and Transformation **34%**, D2 Data Store Management **26%**, D3 Data Operations and Support **22%**, D4 Data Security and Governance **18%**. — [AWS exam guide (official, via search index)](https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.html); confirmed by [Pluralsight](https://www.pluralsight.com/resources/blog/ai-and-data/aws-certified-data-engineer-associate)
- Questions: **65**, multiple choice or multiple response. AWS exams usually include 15 unscored questions, but this was not confirmed here. — [AWS cert page](https://aws.amazon.com/certification/certified-data-engineer-associate/) (S); [Cloud Academy](https://cloudacademy.com/?p=57989)
- Duration: **130 minutes**. The official cert page snippet shows this value. — [AWS cert page](https://aws.amazon.com/en/certification/certified-data-engineer-associate)
- Price: **USD 150**, from an AWS partner-readiness FAQ. The cost field on the official page was not visible in the search snippet, so treat this as **probably right but not confirmed against the official page in late 2026**. — [AWS training FAQ](https://training.resources.awscloud.com/partner-certification-readiness/data-engineer-associate-faqs)
- Passing score: 720/1000 scaled. This comes only from **third-party sites, so it is unconfirmed**. — [search summary of DEV/Udemy prep sites](https://dev.to/gowthampotureddi/aws-data-engineer-associate-dea-c01-certification-prep-roadmap-2hl)
- Exam guide PDF: `https://docs.aws.amazon.com/pdfs/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.pdf` (S). The older d1.awsstatic.com PDF is legacy; use the docs.aws version. — [search index](https://docs.aws.amazon.com/pdfs/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.pdf)
- Official prep: the cert page points to Skill Builder's **4-step exam prep plan**, which includes exam-style question walkthroughs, AWS Builder Labs and SimuLearn, and the Official Practice Exam. — [AWS cert page](https://aws.amazon.com/en/certification/certified-data-engineer-associate)
- Official Practice Question Set (DEA-C01, English) is a **20-question set with feedback** on Skill Builder. Its **free status is UNCONFIRMED for late 2026**. Historically it was free with a Skill Builder account, but one source places it inside the Exam Prep Enhanced Course, which needs a subscription. — [Class Central listing](https://classcentral.com/course/exam-prep-official-practice-question-set-aws-certified-data-engineer-associate-dea-c01-english-264809)
- An "Exam Prep Standard Course: DEA-C01" and an "Official Pretest" also exist on Skill Builder. The Standard Course is historically free; the Pretest and Enhanced Course need a subscription. Both are **unconfirmed**. — [Class Central, Standard Course](https://classcentral.com/course/exam-prep-standard-course-aws-certified-data-engineer-associate-dea-c01-278019); [Class Central, Pretest](https://classcentral.com/course/exam-prep-official-pretest-aws-certified-data-engineer-associate-dea-c01-english-277518)
- Free third-party alternative (not official): Digital Cloud Training offers a free 20-question DEA-C01 quiz. — [digitalcloud.training](https://digitalcloud.training/?p=551983)

#### Certification record: gcppde (Google Cloud Professional Data Engineer)
- Facts from the official page (**V**): length **2 hours**; **40–50** multiple-choice and multiple-select questions; fee **USD 200** plus tax; languages English and Japanese; online or onsite proctored; valid **2 years**; no prerequisites; recommended 3+ years of industry experience, including 1+ year on Google Cloud. A renewal exam exists: 1 hour, 20 questions, USD 100. — [Google Cloud cert page](https://cloud.google.com/learn/certification/data-engineer)
- Official links on that page (**V** as links; the targets themselves were not fetched):
  - Exam guide: `https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf`
  - Renewal guide: `https://services.google.com/fh/files/misc/professional_data_engineer_renewal_exam_guide_english.pdf`
  - Sample questions (free Google Form): `https://docs.google.com/forms/d/e/1FAIpQLSfkWEzBCP0wQ09ZuFm7G2_4qtkYbfmk_0getojdnPdCYmq37Q/viewform`
  - Learning path: `https://www.cloudskillsboost.google/paths/16`
  - Exam-prep webinar sign-up on cloudonair.withgoogle.com
  - [Google Cloud cert page](https://cloud.google.com/learn/certification/data-engineer)
- Exam version: the search index also lists a **v4.2** guide (`.../v4.2_professional_data_engineer_exam_guide_english.pdf`). The current version label is **unconfirmed**. — [search index](https://services.google.com/fh/files/misc/v4.2_professional_data_engineer_exam_guide_english.pdf)
- Domains and weights, from the v4.2 guide as quoted in search, plus third parties that agree:
  1. Designing data processing systems **~22%**
  2. Ingesting and processing the data **~25%**
  3. Storing the data **~20%**
  4. Preparing and using data for analysis **~15%**
  5. Maintaining and automating data workloads **~18%**

  The section names match the official cert page (V). Only the weights for sections 1 and 2 were seen in an official snippet; **sections 3–5 rely on third-party sources, so they are partly unconfirmed**. — [v4.2 guide](https://services.google.com/fh/files/misc/v4.2_professional_data_engineer_exam_guide_english.pdf); [sailor.sh](https://sailor.sh/blog/gcp-professional-data-engineer-exam-guide-2026/); [cloudsoftsol](https://cloudsoftsol.com/blog/google-cloud-professional-data-engineer-exam-guide/)
- Platform rebrand: **Google Cloud Skills Boost is becoming "Google Skills" (skills.google)**. Public profiles already live at www.skills.google, and Cloud customers keep free access to the existing content library. Old cloudskillsboost.google links will probably redirect, but this is **unconfirmed**. — [Google Cloud blog](https://cloud.google.com/blog/topics/training-certifications/google-skills-new-home-AI-learning); [Google blog](https://blog.google/outreach-initiatives/education/google-skills/); [Google Developers forum](https://discuss.google.dev/t/just-announced-google-skills-your-new-destination-for-ai-learning-and-more/272259)
- Learning path cost: courses can be watched for free, but labs use credits or a subscription. This is the usual model; the current model is **unconfirmed**, because the fetch was blocked.

#### Certification record: snowcore (SnowPro Core)
- Current exam code: **COF-C03**. It replaces COF-C02 and launched **2026-02-16** in English. Spanish, Korean and Japanese versions (ESP-C03, KOR-C03, JPN-C03) launched **2026-03-30**. — [Snowflake COF-C03 page](https://learn.snowflake.com/en/certifications/snowpro-core-c03) (S); [Spanish page](https://learn.snowflake.com/en/certifications/snowpro-core-esp-c03) (S); [Pluralsight path](https://www.pluralsight.com/paths/snowpror-core-certification-cof-c03)
- Format and price: **100 questions, 115 minutes, USD 175, passing score 750** (scaled). These come only from **third-party sites; the official page was not readable here, so they are unconfirmed**. — [aguidetocloud](https://www.aguidetocloud.com/cert-tracker/snowpro-core/); [open-exam-prep](https://open-exam-prep.com/blog/snowpro-core-certification-exam-guide-2026)
- Domains: COF-C03 has **5 domains** (COF-C02 had 6), per third-party sources. The first is "Snowflake AI Data Cloud Features and Architecture" at **~31%**. Other named domains include Account Management and Data Governance; Data Loading, Unloading and Connectivity; and Performance (plus related topics). **Exact names and weights for domains 2–5 are unconfirmed**; take them from the official COF-C03 study guide. Some pages still describe 6 domains, which is stale. — [open-exam-prep, domain weights](https://open-exam-prep.com/study-guides/snowflake-core/orientation-and-exam-strategy/blueprint-and-domain-weights); [open-exam-prep, C03 changes](https://open-exam-prep.com/blog/snowpro-core-cof-c03-changes-study-guide-2026)
- Free official practice questions: **not found**. Snowflake's official practice exam has historically been paid (about USD 50); this is **unconfirmed**. The study guide is linked from the COF-C03 page (S).
- Hands-On Essentials: the courses in the track are free, and "many of the badges are also free". Badge 1 is the Data Warehousing Workshop (On Demand, Free). Badges are graded automatically by "DORA" and issued through Credly within 24 hours. Badge 1 takes about 8–12 hours. — [Hands-On Essentials Track](https://learn.snowflake.com/en/pages/hands-on-essentials-track) (S); [Badge 1 course OD-ESS-DWW](https://learn.snowflake.com/en/courses/OD-ESS-DWW) (S); [Snowflake blog](https://www.snowflake.com/en/blog/learn-snowflake-with-free-hands-on-workshops/)

### Inferences
- **Do not label AWS's practice set as free** in the app. Show it as "free account required; may need a subscription" until it is checked. The Google sample-question form is the only fully free official practice resource confirmed among the three.
- In the snowcore exam metadata, show COF-C03 as the current exam. Mark question count, time, price and domain weights "neconfirmat oficial" (not officially confirmed).

### Gaps
- No direct fetches were possible for AWS, Snowflake or services.google.com, so the official price, duration and weights for DEA-C01 and COF-C03 could not be read on the official pages.
- No free official SnowPro Core practice questions were found.
- The current version label of the Google PDE exam guide is unknown (v4.2 or later).

## Key question 2: Free hands-on options (AWS Workshops, Google Cloud free tier and BigQuery sandbox, Snowflake 30-day trial, Snowflake Quickstarts)

### Takeaway
Each platform has a no-cost hands-on path:
- **AWS**: self-paced labs at workshops.aws, run in your own account under the Free Tier. Since July 2025 the Free Tier is credit-based; this is training-data knowledge and unconfirmed.
- **Google Cloud**: the BigQuery sandbox needs no credit card, and there is a USD 300 trial credit.
- **Snowflake**: a 30-day trial, plus Quickstarts, which now live under **snowflake.com/en/developers/guides/**. The legacy quickstarts.snowflake.com URLs are still indexed.

### Cited Findings
- workshops.aws category pages for "Big Data" and "Data lake" exist. They list a **Data Engineering Immersion Day** (Kinesis, DMS, Glue, Athena, QuickSight) and a No-Code/Low-Code Data Lake Fast Start. — [workshops.aws, Big Data](https://workshops.aws/categories/Big%20Data) (S); [workshops.aws, Data lake](https://workshops.aws/categories/Data%20lake) (S)
- An open-source lab, aws-samples/amazon-serverless-datalake-workshop, is on GitHub. — [GitHub](https://github.com/aws-samples/amazon-serverless-datalake-workshop) (S)
- Snowflake developer guides at the new domain:
  - [Intro to Data Engineering with Snowpark Python](https://www.snowflake.com/en/developers/guides/data-engineering-with-snowpark-python-intro/) (S)
  - [Data Engineering Pipelines with Snowpark Python](https://www.snowflake.com/en/developers/guides/data-engineering-pipelines-with-snowpark-python/) (S)
  - [Data Engineering with Notebooks](https://www.snowflake.com/en/developers/guides/data-engineering-with-notebooks/) (S)

  The guides' source is the [Snowflake-Labs/sfquickstarts repo](https://github.com/snowflake-labs/sfquickstarts) (S). The legacy URL [quickstarts.snowflake.com/guide/data_engineering_with_snowpark_python_intro](https://quickstarts.snowflake.com/guide/data_engineering_with_snowpark_python_intro/index.html) is still indexed (S).
- BigQuery sandbox docs: `https://cloud.google.com/bigquery/docs/sandbox` → **301 → `https://docs.cloud.google.com/bigquery/docs/sandbox`** (R). The redirect was observed directly; the content was not readable. The known limits (no credit card; 10 GB storage and 1 TB of queries per month; 60-day table expiry) come from training data and are **unconfirmed for late 2026**.
- Snowflake 30-day trial at signup.snowflake.com: the URL pattern is known, but the fetch was blocked (U). The trial has historically included USD 400 of credits; this is **unconfirmed**.

### Inferences
- In the app, store the canonical **docs.cloud.google.com** URLs for Google docs, so links avoid the 301.
- Store **snowflake.com/en/developers/guides/...** for Quickstarts.

### Gaps
- The specific workshops.aws workshop IDs (catalog.workshops.aws/workshops/&lt;uuid&gt;) could not be checked. Link to the category pages instead.
- The current terms of the AWS Free Tier and the Snowflake trial could not be fetched.

## Key question 3: Key whitepapers and reference architectures, plus the curated catalog (8–12 per provider)

### Takeaway
The main official guidance documents are:
- **AWS**: the Well-Architected Data Analytics Lens and the "Building Data Lakes on AWS" whitepaper.
- **Google Cloud**: the Architecture Center (analytics lakehouse) and the Well-Architected / Architecture Framework.
- **Snowflake**: the docs' own "Key concepts" and tutorials.

The catalog below is ready for import. Status codes follow the legend at the top. Levels: B = beginner, I = intermediate. Language is EN for all entries, because no official Romanian versions exist; the summaries are in Romanian for the learner.

### Cited Findings: catalog

#### deck `aws`
| # | Title | URL | Provider | Type | Level | Lang | Cost | Status | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | AWS Certified Data Engineer – Associate (cert page) | https://aws.amazon.com/certification/certified-data-engineer-associate/ | AWS | exam guide | I | EN | Free | S | Pagina oficială a examenului DEA-C01: format, preț, plan de pregătire. |
| 2 | DEA-C01 Exam Guide (HTML) | https://docs.aws.amazon.com/aws-certification/latest/data-engineer-associate-01/data-engineer-associate-01.html | AWS | exam guide | I | EN | Free | S | Ghidul oficial: domenii, ponderi, servicii incluse/excluse. |
| 3 | DEA-C01 Official Practice Question Set | https://classcentral.com/course/exam-prep-official-practice-question-set-aws-certified-data-engineer-associate-dea-c01-english-264809 (index; open via skillbuilder.aws) | AWS Skill Builder | sample questions | I | EN | Free account? (**unconfirmed**) | S | 20 întrebări oficiale cu explicații, în stilul examenului. |
| 4 | Exam Prep Standard Course: DEA-C01 | https://classcentral.com/course/exam-prep-standard-course-aws-certified-data-engineer-associate-dea-c01-278019 (index; open via skillbuilder.aws) | AWS Skill Builder | official free course | I | EN | Free account (historically; **unconfirmed**) | S | Curs oficial de recapitulare pe cele 4 domenii ale examenului. |
| 5 | AWS Workshops: Big Data / Data lake categories | https://workshops.aws/categories/Big%20Data | AWS | workshop | B–I | EN | Free content (AWS usage may cost) | S | Laboratoare ghidate (Glue, Athena, Kinesis, Lake Formation) în contul tău. |
| 6 | Well-Architected Data Analytics Lens | https://docs.aws.amazon.com/wellarchitected/latest/analytics-lens/analytics-lens.html | AWS | whitepaper | I | EN | Free | U | Bune practici de arhitectură pentru sisteme analitice pe AWS. |
| 7 | AWS Glue Developer Guide | https://docs.aws.amazon.com/glue/latest/dg/what-is-glue.html | AWS | official docs | B–I | EN | Free | U | ETL serverless, Data Catalog, crawlere și joburi Spark. |
| 8 | Amazon Athena User Guide | https://docs.aws.amazon.com/athena/latest/ug/what-is.html | AWS | official docs | B | EN | Free | U | Interogări SQL serverless direct pe date din S3. |
| 9 | Amazon Redshift Serverless – Getting Started | https://docs.aws.amazon.com/redshift/latest/gsg/new-user-serverless.html | AWS | tutorial | B | EN | Free docs (free trial credit for Redshift Serverless; **unconfirmed**) | U | Primul tău data warehouse Redshift, pas cu pas. |
| 10 | Amazon Kinesis Data Streams Developer Guide | https://docs.aws.amazon.com/streams/latest/dev/introduction.html | AWS | official docs | I | EN | Free | U | Ingestie și procesare de fluxuri de date în timp real. |
| 11 | AWS Lake Formation Developer Guide | https://docs.aws.amazon.com/lake-formation/latest/dg/what-is-lake-formation.html | AWS | official docs | I | EN | Free | U | Guvernanța și permisiunile fine pentru data lake-uri. |
| 12 | AWS Step Functions / Amazon MWAA guides | https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html ; https://docs.aws.amazon.com/mwaa/latest/userguide/what-is-mwaa.html | AWS | official docs | I | EN | Free | U | Orchestrarea pipeline-urilor: state machines și Apache Airflow gestionat. |
| (extra) | Amazon EMR Management Guide | https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html | AWS | official docs | I | EN | Free | U | Clustere Spark/Hadoop gestionate pentru procesare la scară mare. |
| (extra) | Building Data Lakes on AWS (whitepaper) | https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/building-data-lake-aws.html | AWS | whitepaper | B–I | EN | Free | U | Fundamentele unui data lake pe S3 și serviciile din jur. |

#### deck `gcp`
| # | Title | URL | Provider | Type | Level | Lang | Cost | Status | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Professional Data Engineer (cert page) | https://cloud.google.com/learn/certification/data-engineer | Google Cloud | exam guide | I | EN | Free | **V** | Pagina oficială: 2 h, 40–50 întrebări, 200 USD, link-uri de pregătire. |
| 2 | PDE Exam Guide (PDF) | https://services.google.com/fh/files/misc/professional_data_engineer_exam_guide_english.pdf | Google Cloud | exam guide | I | EN | Free | S | Lista completă de subiecte pe cele 5 secțiuni ale examenului. |
| 3 | PDE Sample Questions | https://docs.google.com/forms/d/e/1FAIpQLSfkWEzBCP0wQ09ZuFm7G2_4qtkYbfmk_0getojdnPdCYmq37Q/viewform | Google Cloud | sample questions | I | EN | Free | V (link) | Întrebări-exemplu oficiale, gratuite, cu formatul real al examenului. |
| 4 | Data Engineer Learning Path (Skills Boost → Google Skills) | https://www.cloudskillsboost.google/paths/16 | Google Cloud | official free course | B–I | EN | Free videos; labs need credits (**unconfirmed**) | S | Traseul oficial de cursuri și laboratoare pentru PDE. |
| 5 | BigQuery sandbox | https://docs.cloud.google.com/bigquery/docs/sandbox | Google Cloud | free tier lab | B | EN | Free, no card | R | Folosește BigQuery gratuit, fără card, cu limite lunare. |
| 6 | Google Cloud Free Program | https://cloud.google.com/free | Google Cloud | free tier lab | B | EN | Free (USD 300 trial credit + Always Free; **unconfirmed**) | U | Credit de probă și servicii mereu gratuite pentru exerciții. |
| 7 | BigQuery documentation (intro) | https://docs.cloud.google.com/bigquery/docs/introduction | Google Cloud | official docs | B | EN | Free | U (redirect target) | Data warehouse serverless: stocare, interogări, costuri. |
| 8 | Dataflow overview | https://docs.cloud.google.com/dataflow/docs/overview | Google Cloud | official docs | I | EN | Free | U | Procesare batch/stream cu Apache Beam, complet gestionată. |
| 9 | Pub/Sub overview | https://docs.cloud.google.com/pubsub/docs/overview | Google Cloud | official docs | B–I | EN | Free | U | Mesagerie asincronă pentru ingestie de evenimente. |
| 10 | Dataproc overview | https://docs.cloud.google.com/dataproc/docs/concepts/overview | Google Cloud | official docs | I | EN | Free | U | Spark și Hadoop gestionate, inclusiv varianta serverless. |
| 11 | Dataplex / Composer docs | https://docs.cloud.google.com/dataplex/docs/introduction ; https://docs.cloud.google.com/composer/docs/composer-3/composer-overview | Google Cloud | official docs | I | EN | Free | U | Guvernanța datelor (Dataplex) și orchestrare Airflow (Composer). |
| 12 | Architecture Framework + analytics lakehouse reference | https://docs.cloud.google.com/architecture/framework ; https://docs.cloud.google.com/architecture/big-data-analytics/analytics-lakehouse | Google Cloud | whitepaper | I | EN | Free | U | Principii Well-Architected și arhitectură de referință lakehouse. |

#### deck `snow`
| # | Title | URL | Provider | Type | Level | Lang | Cost | Status | Rezumat (RO) |
|---|---|---|---|---|---|---|---|---|---|
| 1 | SnowPro Core (COF-C03) certification page | https://learn.snowflake.com/en/certifications/snowpro-core-c03 | Snowflake | exam guide | I | EN | Free page | S | Pagina oficială a examenului COF-C03 și ghidul de studiu. |
| 2 | Hands-On Essentials Track | https://learn.snowflake.com/en/pages/hands-on-essentials-track | Snowflake University | official free course | B | EN | Free (most badges) | S | Serie de workshop-uri practice cu insigne Credly verificate automat. |
| 3 | Badge 1: Data Warehousing Workshop | https://learn.snowflake.com/en/courses/OD-ESS-DWW | Snowflake University | workshop | B | EN | Free | S | Primul workshop: încărcare date, warehouse-uri, roluri (8–12 h). |
| 4 | Snowflake 30-day free trial | https://signup.snowflake.com/ | Snowflake | free tier lab | B | EN | Free 30 days | U | Cont de probă gratuit pentru toate exercițiile practice. |
| 5 | Snowflake Developer Guides (ex-Quickstarts) | https://www.snowflake.com/en/developers/guides/ | Snowflake | tutorial | B–I | EN | Free | S | Ghiduri pas cu pas pentru pipeline-uri, Snowpark, AI. |
| 6 | Intro to Data Engineering with Snowpark Python | https://www.snowflake.com/en/developers/guides/data-engineering-with-snowpark-python-intro/ | Snowflake | tutorial | I | EN | Free | S | Primul pipeline de date în Python cu Snowpark. |
| 7 | Data Engineering Pipelines with Snowpark Python | https://www.snowflake.com/en/developers/guides/data-engineering-pipelines-with-snowpark-python/ | Snowflake | tutorial | I | EN | Free | S | Pipeline complet cu proceduri stocate, streams și tasks. |
| 8 | Snowpipe (docs) | https://docs.snowflake.com/en/user-guide/data-load-snowpipe-intro | Snowflake | official docs | I | EN | Free | U | Încărcare continuă, automată, a fișierelor noi. |
| 9 | Streams & Tasks (docs) | https://docs.snowflake.com/en/user-guide/streams-intro ; https://docs.snowflake.com/en/user-guide/tasks-intro | Snowflake | official docs | I | EN | Free | U | Captarea modificărilor (CDC) și programarea transformărilor. |
| 10 | Snowpark Developer Guide | https://docs.snowflake.com/en/developer-guide/snowpark/index | Snowflake | official docs | I | EN | Free | U | API DataFrame în Python/Java/Scala care rulează în Snowflake. |
| 11 | Time Travel (docs) | https://docs.snowflake.com/en/user-guide/data-time-travel | Snowflake | official docs | B–I | EN | Free | U | Interogarea și restaurarea datelor din trecut; UNDROP. |
| 12 | sfquickstarts GitHub repo | https://github.com/snowflake-labs/sfquickstarts | Snowflake Labs | tutorial | I | EN | Apache-2.0 (**license unconfirmed**) | S | Sursa deschisă a tuturor ghidurilor Quickstart. |

### Inferences
- Romanian-language official material was not found for any of the three providers. The Romanian summaries in the app supply that layer.
- For the exam view in the app, use these values:
  - **awsdea**: 65 Q / 130 min / USD 150 (price unconfirmed); weights 34/26/22/18.
  - **gcppde**: 40–50 Q / 120 min / USD 200 (verified); weights 22/25/20/15/18 (sections 3–5 unconfirmed).
  - **snowcore**: COF-C03; 100 Q / 115 min / USD 175 (all unconfirmed); 5 domains, first ~31%, remaining weights unconfirmed.

### Gaps
- Every row with status U or S needs a live link check from an unrestricted network before release. The sandbox blocked those hosts.
- The exact licences of the AWS and Google docs (both are proprietary but free to read) were not checked. The sfquickstarts licence is unconfirmed.

# Data-engineering foundations: free, open resources (decks: sql, relational, model, nosql, formats, stats, algo, distributed)

> **Verification status, read first (2026-11-19).** This session's network policy blocked direct fetching. `curl` got a proxy 403 (CONNECT refused) for every host except microsoft.com, and `WebFetch` got DNS failures (ENOTFOUND) for 15445.courses.cs.cmu.edu, opentextbc.ca, openstax.org, opendatastructures.org, pgexercises.com, sqlbolt.com, mode.com and kimballgroup.com. **No URL could be fully confirmed with an HTTP 200, except one: the Microsoft-hosted Kafka PDF.** Each entry below carries a status tag:
> - **[V200]**: fetched, HTTP 200.
> - **[S]**: the exact URL (or its parent page) came back in a live web search on 2026-11-19. This means it is indexed and very likely live, but it was not fetched.
> - **[U]**: canonical URL from prior knowledge. It was not checked in this session, so re-check it before shipping.
> - **[R]**: a redirect was observed.
>
> Before integrating into the app, re-run the link check from a network that allows these hosts. The URL list is ready in this file. For the app, the hosts that need allow-listing are 15445.courses.cs.cmu.edu, opentextbc.ca, openstax.org, opendatastructures.org, pgexercises.com, sqlbolt.com, mode.com and kimballgroup.com, plus every other host listed.

Column legend for the catalog tables: **Tip** = official docs / open textbook / free university course / interactive tutorial / paper / blog series; **Nivel** = B (beginner) / I (intermediate) / A (advanced); **Limba** = EN unless noted (almost nothing authoritative exists in Romanian for these topics); **Cost/Licență**.

## Which open-licensed textbooks and free university courses best cover each topic?

### Takeaway
A few open textbooks and university courses cover most of the foundations:
- *Database Design 2e* (BCcampus, CC BY 4.0) covers relational design and normalization.
- *OpenStax Introductory Statistics 2e* (CC BY 4.0) and the NIST/SEMATECH e-Handbook (US-government public domain) cover statistics and profiling.
- *Open Data Structures* (Morin) covers data structures. Its license depends on the edition.
- CMU 15-445/645 has free videos on the CMU-DB YouTube channel and covers DB internals, query plans, joins and transactions.
- MIT 6.5840 (formerly 6.824) covers distributed systems.
- Kleppmann's Cambridge notes (CC BY-SA) are a compact distributed-systems text.

### Cited Findings
- *Database Design – 2nd Edition* (Adrienne Watt, Nelson Eng; BCcampus, 2014) is licensed CC BY 4.0. A clone also exists on eCampusOntario Pressbooks. — [BCcampus collection](https://collection.bccampus.ca/textbooks/database-design-2nd-edition-bccampus-96); [About the Book](https://opentextbc.ca/dbdesign01/front-matter/about-the-book/); [Open Textbook Library](https://open.umn.edu/opentextbooks/textbooks/database-design-2nd-edition); [eCampusOntario clone](https://ecampusontario.pressbooks.pub/databasedesign02/)
- OpenStax *Introductory Statistics 2e* is CC BY 4.0. Attribution to OpenStax is required, and the OpenStax name and logos are excluded from the license. The LibreTexts mirror shows "not declared", so link to the OpenStax original. — [OpenStax preface](https://openstax.org/books/introductory-statistics-2e/pages/preface); [BCcampus listing](https://collection.bccampus.ca/textbooks/introductory-statistics-2e-openstax-444)
- *Open Data Structures* (Pat Morin): the author's source and text are released CC BY (attribution to opendatastructures.org). Older editions are listed as CC BY 2.5. The Athabasca University Press edition is listed as CC BY-NC-ND. — [Olympic College libguide](https://libguides.olympic.edu/Computer_Science); [BCcampus](https://collection.bccampus.ca/textbook/KUNixyPF); [Marshall repo](https://mds.marshall.edu/oa-textbooks/135); [GitHub patmorin/ods](https://www.Github.com/patmorin/ods)
- CMU 15-445/645 (Fall 2025): the FAQ says lectures are posted publicly on the CMU-DB YouTube channel right after class, for non-CMU students too. The schedule page has a "Video: Watch" link for each lecture (e.g. #06 Storage Models & Compression, #13 Query Execution I). — [Fall 2025 FAQ](https://15445.courses.cs.cmu.edu/fall2025/faq.html); [Fall 2025 schedule](https://15445.courses.cs.cmu.edu/fall2025/schedule.html); [Fall 2024 schedule](https://15445.courses.cs.cmu.edu/fall2024/schedule.html)
- MIT 6.5840 *Distributed Systems* (formerly 6.824) has a Spring 2026 offering: lectures, labs (Lab 1 = MapReduce, Raft labs), and a Spanner lecture. Pages are at pdos.csail.mit.edu/6.824. — [6.5840 home](https://pdos.csail.mit.edu/6.824/index.html); [schedule](https://pdos.csail.mit.edu/6.824/schedule.html); [general info](https://pdos.csail.mit.edu/6.824/general.html)
- Kleppmann's Cambridge *Distributed Systems* notes (the second half of Concurrent and Distributed Systems, 8 lectures) are published under Creative Commons BY-SA. The latest PDF found is the 2021/22 version. The course still runs in 2026-27, with Kleppmann as lecturer. — [2021/22 notes PDF](https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf); [2026-27 course page](https://www.cl.cam.ac.uk/teaching/2627/ConcDisSys/); [2026-27 materials](https://www.cl.cam.ac.uk/teaching/2627/ConcDisSys/materials.html)
- MIT's database course is now 6.5830/6.5831 (pages at dsg.csail.mit.edu). — [6.5830 syllabus](https://dsg.csail.mit.edu/6.5830/syllabus.php)

### Inferences
- In my judgment, the strongest "spine" for the app is BCcampus (relational/model), CMU 15-445 (sql/relational/algo internals), OpenStax and NIST (stats), ODS plus MIT 6.006 (algo), and MIT 6.5840 plus the Kleppmann notes (distributed).
- ODS: link to opendatastructures.org (CC BY) rather than the AU Press edition (NC-ND).

### Gaps
- I could not open the CMU-DB YouTube playlist to get a semester-specific playlist URL. I recommend linking to the course schedule page, which carries per-lecture video links, rather than to a guessed playlist ID.
- I found no open-licensed textbook dedicated to NoSQL modeling or to file formats. Those decks rely on official docs and specs.
- I found no Romanian-language authoritative resources. Every entry is EN, and only the summaries are in Romanian.

## Which official references are authoritative (PostgreSQL, SQLite, Parquet/Avro/ORC/Arrow, Kimball)? (with full per-deck catalog)

### Takeaway
The official project docs are the authoritative references, and all of them are free:
- PostgreSQL docs: PostgreSQL License.
- SQLite docs: public domain.
- Apache Parquet, Avro, ORC and Arrow specs: Apache License 2.0.
- Kimball Group "Dimensional Modeling Techniques" and Design Tips: free to read, all rights reserved (not openly licensed).

Below is the proposed catalog per deck. Status tags are as in the header.

### Cited Findings
Most rows below are [U] because direct fetching was blocked. Rows tagged [S] or [V200] are backed by the search or fetch evidence cited in each section.

#### Deck `sql` (SQL language, window functions, CTEs, practice)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | PostgreSQL Tutorial (Part I) | https://www.postgresql.org/docs/current/tutorial.html | PostgreSQL Global Development Group | official docs | B | Free; PostgreSQL License | Tutorialul oficial PostgreSQL: tabele, interogări, join-uri, agregări. | U |
| 2 | PostgreSQL: Window Functions (tutorial) | https://www.postgresql.org/docs/current/tutorial-window.html | PGDG | official docs | I | Free; PostgreSQL License | Introducere oficială în funcțiile fereastră (OVER, PARTITION BY). | U |
| 3 | PostgreSQL: WITH Queries (CTE) | https://www.postgresql.org/docs/current/queries-with.html | PGDG | official docs | I | Free; PostgreSQL License | CTE-uri și interogări recursive explicate oficial. | U |
| 4 | SQLite: SQL As Understood By SQLite | https://www.sqlite.org/lang.html | SQLite (Hipp et al.) | official docs | B–I | Free; public domain | Referința completă a dialectului SQL din SQLite. | U |
| 5 | SQLite Window Functions | https://www.sqlite.org/windowfunctions.html | SQLite | official docs | I | Free; public domain | Funcții fereastră în SQLite, cu exemple și cadre (frames). | U |
| 6 | SQLBolt | https://sqlbolt.com/ | Independent | interactive tutorial | B | Free (no license) | Lecții interactive scurte de SQL direct în browser. | U (host blocked here) |
| 7 | PostgreSQL Exercises | https://pgexercises.com/ | Alisdair Owens | interactive tutorial | B–I | Free, no login; code on GitHub | 81 de exerciții pe o bază PostgreSQL reală (club sportiv). | S |
| 8 | Mode SQL Tutorial | https://mode.com/sql-tutorial | Mode (now ThoughtSpot) | interactive tutorial | B–I | Free | Curs SQL pentru analiză de date: de la SELECT la funcții fereastră. | S (pages live, ThoughtSpot banner) |
| 9 | Modern SQL | https://modern-sql.com/ | Markus Winand | blog series | I–A | Free to read | Funcționalități SQL standard moderne și suportul lor în fiecare SGBD. | U |
| 10 | SQL Murder Mystery / Select Star SQL (alt.) | https://selectstarsql.com/ | Zi Chong Kao | interactive book | B | Free | Carte interactivă de SQL pe date reale. | U |

#### Deck `relational` (relational theory, query plans, indexes, transactions/isolation)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Database Design – 2nd Ed. | https://opentextbc.ca/dbdesign01/ | A. Watt, N. Eng / BCcampus | open textbook | B | CC BY 4.0 | Manual deschis: modelul relațional, ER, chei, normalizare. | S |
| 2 | CMU 15-445/645 Intro to Database Systems (Fall 2025) | https://15445.courses.cs.cmu.edu/fall2025/schedule.html | Carnegie Mellon (Andy Pavlo et al.) | free university course | I–A | Free videos + slides | Curs complet de sisteme de baze de date: stocare, indexare, execuție, tranzacții. | S |
| 3 | PostgreSQL: Using EXPLAIN | https://www.postgresql.org/docs/current/using-explain.html | PGDG | official docs | I | PostgreSQL License | Cum citești un plan de execuție în PostgreSQL. | U |
| 4 | PostgreSQL: Transaction Isolation | https://www.postgresql.org/docs/current/transaction-iso.html | PGDG | official docs | I–A | PostgreSQL License | Nivelurile de izolare și anomaliile (dirty read, phantom, serialization). | U |
| 5 | PostgreSQL: Concurrency Control (MVCC) | https://www.postgresql.org/docs/current/mvcc.html | PGDG | official docs | A | PostgreSQL License | Cum funcționează MVCC și blocările în PostgreSQL. | U |
| 6 | SQLite Query Planner | https://www.sqlite.org/queryplanner.html | SQLite | official docs | I | Public domain | Explicație clară a indexurilor și a planificatorului de interogări. | U |
| 7 | SQLite EXPLAIN QUERY PLAN | https://www.sqlite.org/eqp.html | SQLite | official docs | I | Public domain | Interpretarea planurilor de interogare în SQLite. | U |
| 8 | SQLite: Isolation In SQLite | https://www.sqlite.org/isolation.html | SQLite | official docs | I | Public domain | Izolarea tranzacțiilor în SQLite (WAL, serializabil). | U |
| 9 | Use The Index, Luke | https://use-the-index-luke.com/ | Markus Winand | blog series / free book | I | Free to read online | Ghid despre indexare SQL și performanță pentru dezvoltatori. | U |
| 10 | MIT 6.5830 Database Systems | https://dsg.csail.mit.edu/6.5830/syllabus.php | MIT (S. Madden) | free university course | A | Free materials | Curs MIT de baze de date: lecturi clasice și proiecte. | S |

#### Deck `model` (Kimball dimensional, SCD, Data Vault, normalization)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Kimball Dimensional Modeling Techniques | https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/ | Kimball Group | official reference | I | Free to read; © Kimball Group | Catalogul oficial de tehnici: fapte, dimensiuni, granularitate, SCD. | U (host blocked) |
| 2 | Kimball: Type 2 SCD | https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/type-2/ | Kimball Group | official reference | I | Free; © | Dimensiuni cu schimbare lentă de tip 2: rând nou pentru fiecare versiune. | U |
| 3 | Kimball Design Tips archive | https://www.kimballgroup.com/category/design-tips/ | Kimball Group | blog series | I–A | Free; © | Arhiva de "Design Tips" Kimball despre modelare dimensională. | U |
| 4 | Database Design 2e, normalization chapters | https://opentextbc.ca/dbdesign01/ | BCcampus | open textbook | B | CC BY 4.0 | Formele normale 1NF–BCNF explicate cu exemple. | S |
| 5 | Wikipedia: Slowly changing dimension | https://en.wikipedia.org/wiki/Slowly_changing_dimension | Wikipedia | reference | B–I | CC BY-SA 4.0 | Rezumat al tipurilor SCD 0–7. | U |
| 6 | Wikipedia: Data vault modeling | https://en.wikipedia.org/wiki/Data_vault_modeling | Wikipedia | reference | I | CC BY-SA 4.0 | Hub-uri, link-uri și sateliți: privire de ansamblu Data Vault. | U |
| 7 | Wikipedia: Database normalization | https://en.wikipedia.org/wiki/Database_normalization | Wikipedia | reference | B | CC BY-SA 4.0 | Normalizarea bazelor de date, formă cu formă. | U |
| 8 | dbt docs: Snapshots (SCD2 in practice) | https://docs.getdbt.com/docs/build/snapshots | dbt Labs | official docs | I | Free | Implementarea practică a SCD tip 2 cu dbt snapshots. | U |
| 9 | dbt blog: Building a Kimball dimensional model with dbt | https://docs.getdbt.com/blog/kimball-dimensional-model | dbt Labs | blog | I | Free | Exemplu pas cu pas de model stea Kimball construit în dbt. | U |
| 10 | The Analytics Setup Guidebook (Holistics) | https://www.holistics.io/books/setup-analytics/ | Holistics | free e-book | B–I | Free | Carte gratuită despre stack-ul analitic și modelarea datelor. | U |

#### Deck `nosql` (document, key-value, wide-column, graph; access-pattern modeling)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | DynamoDB: Data modeling / NoSQL design best practices | https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html | AWS | official docs | I | Free | Modelare pornind de la tiparele de acces în DynamoDB. | U |
| 2 | MongoDB Manual: Data Modeling | https://www.mongodb.com/docs/manual/data-modeling/ | MongoDB | official docs | B–I | Free | Încorporare vs. referințe și scheme pentru documente. | U |
| 3 | MongoDB University | https://learn.mongodb.com/ | MongoDB | interactive course | B–I | Free (account) | Cursuri gratuite despre MongoDB și modelarea documentelor. | U |
| 4 | Apache Cassandra: Data Modeling | https://cassandra.apache.org/doc/latest/cassandra/developing/data-modeling/index.html | Apache Cassandra | official docs | I | Apache 2.0 | Modelare query-first pentru baze wide-column. | U (path changed between versions; verify) |
| 5 | Bigtable: Schema design best practices | https://cloud.google.com/bigtable/docs/schema-design | Google Cloud | official docs | I | Free; CC BY 4.0 docs | Proiectarea cheilor de rând și evitarea hotspot-urilor. | R (301 → docs.cloud.google.com/bigtable/docs/schema-design) |
| 6 | Redis data types | https://redis.io/docs/latest/develop/data-types/ | Redis | official docs | B | Free | Structurile de date key-value din Redis (hash, set, sorted set, stream). | U |
| 7 | Neo4j GraphAcademy | https://graphacademy.neo4j.com/ | Neo4j | interactive course | B–I | Free | Cursuri gratuite de grafuri și Cypher, cu modelare. | U |
| 8 | Neo4j: Graph data modeling | https://neo4j.com/docs/getting-started/data-modeling/ | Neo4j | official docs | B | Free | Cum transformi un domeniu în noduri și relații. | U |
| 9 | Alex DeBrie: The What, Why, and When of Single-Table Design | https://www.alexdebrie.com/posts/dynamodb-single-table/ | Alex DeBrie | blog | I–A | Free | Designul cu un singur tabel în DynamoDB, explicat. | U |
| 10 | Dynamo paper (see distributed) | https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf | Amazon / DeCandia et al. | paper | A | Free (author-hosted) | Originea bazelor key-value cu consistență eventuală. | U |

#### Deck `formats` (Parquet, Avro, ORC, Arrow, JSON/CSV)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Apache Parquet documentation | https://parquet.apache.org/docs/ | Apache Software Foundation | official spec | I | Apache 2.0 | Formatul columnar Parquet: row groups, pagini, statistici. | U |
| 2 | Parquet: File format / Encodings | https://parquet.apache.org/docs/file-format/data-pages/encodings/ | ASF | official spec | A | Apache 2.0 | Codările Parquet (dictionary, RLE, delta). | U |
| 3 | Apache Avro specification | https://avro.apache.org/docs/1.12.0/specification/ | ASF | official spec | I | Apache 2.0 | Format pe rânduri cu schemă și evoluția schemei. | U (version path; also try /docs/) |
| 4 | Apache ORC specification | https://orc.apache.org/specification/ | ASF | official spec | A | Apache 2.0 | Formatul ORC: stripe-uri, indexuri, statistici. | U |
| 5 | Arrow Columnar Format | https://arrow.apache.org/docs/format/Columnar.html | ASF | official spec | A | Apache 2.0 | Formatul columnar în memorie Arrow și buffer-ele lui. | U |
| 6 | RFC 4180 (CSV) | https://www.rfc-editor.org/rfc/rfc4180 | IETF | standard | B | Free (IETF Trust) | Regulile CSV: ghilimele, separatoare, linii noi. | U |
| 7 | RFC 8259 (JSON) | https://www.rfc-editor.org/rfc/rfc8259 | IETF | standard | B | Free (IETF Trust) | Standardul JSON, inclusiv capcane cu numere mari și duplicate. | U |
| 8 | JSON Lines | https://jsonlines.org/ | Community | spec | B | Free | Format JSON delimitat pe linii pentru fluxuri de date. | U |
| 9 | DuckDB: Reading and writing Parquet | https://duckdb.org/docs/stable/data/parquet/overview | DuckDB Foundation | official docs | B–I | MIT | Interoghează direct fișiere Parquet cu SQL pentru experimente. | U |
| 10 | Apache Iceberg table spec | https://iceberg.apache.org/spec/ | ASF | official spec | A | Apache 2.0 | Formatul de tabel deasupra fișierelor Parquet/ORC/Avro. | U |

#### Deck `stats` (statistics for data quality and profiling)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Introductory Statistics 2e | https://openstax.org/details/books/introductory-statistics-2e | OpenStax (Rice Univ.) | open textbook | B | CC BY 4.0 | Manual deschis de statistică descriptivă și inferențială. | S (book pages indexed) |
| 2 | NIST/SEMATECH e-Handbook of Statistical Methods | https://www.itl.nist.gov/div898/handbook/ | NIST | official reference | I | Public domain (US gov) | Referință clasică pentru analiza exploratorie și detectarea outlier-ilor. | U |
| 3 | NIST Handbook: Exploratory Data Analysis | https://www.itl.nist.gov/div898/handbook/eda/eda.htm | NIST | official reference | I | Public domain | Capitolul EDA: histograme, box-plot, verificarea ipotezelor. | U |
| 4 | OpenIntro Statistics | https://www.openintro.org/book/os/ | OpenIntro (Diez, Çetinkaya-Rundel, Barr) | open textbook | B | CC BY-SA 3.0 (verify for 4th ed.) | Manual gratuit de statistică cu exerciții și date reale. | U |
| 5 | MIT 18.05 Intro to Probability and Statistics | https://ocw.mit.edu/courses/18-05-introduction-to-probability-and-statistics-spring-2022/ | MIT OCW | free university course | I | CC BY-NC-SA 4.0 | Curs MIT de probabilități și statistică, cu note și probleme. | U |
| 6 | Penn State STAT 500 Applied Statistics | https://online.stat.psu.edu/stat500/ | Penn State | free university course | I | CC BY-NC 4.0 | Note de curs de statistică aplicată, gratuite online. | U |
| 7 | Think Stats 3e | https://allendowney.github.io/ThinkStats/ | Allen Downey | open textbook | B–I | CC BY-NC-SA 4.0 | Statistică exploratorie cu Python și pandas. | U |
| 8 | Seeing Theory | https://seeing-theory.brown.edu/ | Brown University | interactive tutorial | B | Free | Vizualizări interactive pentru probabilități și statistică. | U |
| 9 | Great Expectations docs (data quality) | https://docs.greatexpectations.io/ | GX | official docs | I | Apache 2.0 (OSS) | Teste de calitate a datelor aplicate pe statistici de profil. | U |

#### Deck `algo` (hashing, sorting, joins, sketches)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | Open Data Structures | https://opendatastructures.org/ | Pat Morin | open textbook | I | CC BY (site); AU Press ed. NC-ND | Structuri de date: tabele hash, arbori, heap-uri, cu cod. | S (via catalogs) |
| 2 | MIT 6.006 Introduction to Algorithms (Spring 2020) | https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/ | MIT OCW | free university course | I | CC BY-NC-SA 4.0 | Curs MIT de algoritmi: sortare, hashing, grafuri, cu video. | U |
| 3 | Jeff Erickson, *Algorithms* | https://jeffe.cs.illinois.edu/teaching/algorithms/ | UIUC | open textbook | I–A | CC BY 4.0 | Manual gratuit de algoritmi de la UIUC. | U |
| 4 | CMU 15-445 lectures on hash tables, sorting & joins | https://15445.courses.cs.cmu.edu/fall2025/schedule.html | CMU | free university course | I–A | Free videos | Join-uri hash/sort-merge și sortare externă în motoare de BD. | S |
| 5 | Algorithms, 4th ed. (booksite) | https://algs4.cs.princeton.edu/home/ | Sedgewick & Wayne (Princeton) | free booksite | I | Free to read (book is commercial) | Conținut gratuit despre sortare, căutare și hashing. | U |
| 6 | HyperLogLog (Flajolet et al., 2007) | https://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf | INRIA | paper | A | Free (author-hosted) | Lucrarea originală despre estimarea cardinalității. | U |
| 7 | HyperLogLog in Practice (Google) | https://research.google/pubs/hyperloglog-in-practice-algorithmic-engineering-of-a-state-of-the-art-cardinality-estimation-algorithm/ | Google Research | paper | A | Free | HLL++: îmbunătățirile Google pentru numărarea distinctă. | U |
| 8 | Apache DataSketches | https://datasketches.apache.org/ | ASF | official docs | I–A | Apache 2.0 | Biblioteca de sketch-uri (HLL, Theta, KLL) și teoria din spate. | U |
| 9 | Redis: Bloom filter / HyperLogLog | https://redis.io/docs/latest/develop/data-types/probabilistic/bloom-filter/ | Redis | official docs | B–I | Free | Explicații practice pentru filtre Bloom și HLL. | U |

#### Deck `distributed` (consistency, replication, partitioning, consensus, time/ordering)
| # | Title | URL | Provider | Tip | Nivel | Cost/Licență | Rezumat (RO) | Status |
|---|---|---|---|---|---|---|---|---|
| 1 | MIT 6.5840 Distributed Systems | https://pdos.csail.mit.edu/6.824/ | MIT PDOS | free university course | A | Free materials + lecture videos | Cursul MIT de sisteme distribuite, cu laboratoare MapReduce și Raft. | S |
| 2 | Kleppmann, Distributed Systems lecture notes | https://www.cl.cam.ac.uk/teaching/2122/ConcDisSys/dist-sys-notes.pdf | Univ. of Cambridge | open lecture notes | I | CC BY-SA | Note concise: ceasuri, broadcast, replicare, consens. | S |
| 3 | Raft consensus site + paper | https://raft.github.io/ | Ongaro & Ousterhout | paper + interactive viz | I–A | Free | Algoritmul Raft explicat, cu vizualizare interactivă. | U |
| 4 | Lamport, Time, Clocks, and the Ordering of Events | https://lamport.azurewebsites.net/pubs/time-clocks.pdf | L. Lamport | paper | A | Free (author-hosted) | Ceasurile logice și ordinea evenimentelor. | U |
| 5 | Dynamo (SOSP 2007) | https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf | Amazon | paper | A | Free (CTO's site) | Replicare, quorum și consistență eventuală. | U |
| 6 | Bigtable (OSDI 2006) | https://www.usenix.org/legacy/event/osdi06/tech/chang/chang.pdf | Google / USENIX | paper | A | Free (USENIX open access) | Stocare wide-column distribuită. | U |
| 7 | Spanner (OSDI 2012) | https://www.usenix.org/conference/osdi12/technical-sessions/presentation/corbett | Google / USENIX | paper | A | Free | Bază globală cu TrueTime și tranzacții externe consistente. | U |
| 8 | MapReduce (OSDI 2004) | https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/ | Google Research | paper | I–A | Free | Modelul de procesare paralelă map/reduce. | U |
| 9 | Kafka: a Distributed Messaging System for Log Processing (NetDB 2011) | https://www.microsoft.com/en-us/research/wp-content/uploads/2017/09/Kafka.pdf | Kreps, Narkhede, Rao (LinkedIn) | paper | I | Free | Jurnalul distribuit care stă la baza Kafka. | **V200** |
| 10 | Jepsen: Consistency models | https://jepsen.io/consistency | Jepsen (K. Kingsbury) | reference / blog | I–A | Free | Hartă clară a modelelor de consistență (linearizabil, serializabil...). | U |
| 11 | Jay Kreps, The Log | https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying | LinkedIn Engineering | blog | I | Free | De ce jurnalul este abstracția centrală pentru date în timp real. | U |

### Inferences
- Licenses are clear-cut for PostgreSQL (PostgreSQL License), SQLite (public domain) and the Apache specs (Apache 2.0), all from well-known project licensing. Kimball content is free to read but copyrighted. The app should link to it, not copy it.
- MIT OCW is CC BY-NC-SA 4.0. Link-only use in an app is fine. Embedding content in a monetized app would conflict with NC.

### Gaps
- None of the [U] URLs could be fetched (proxy and DNS blocks). Paths that change often and need a fresh check: the Cassandra data-modeling path, the Avro versioned spec path, the DuckDB Parquet path, and the Parquet encodings path.
- The OpenIntro Statistics 4th-edition license could not be confirmed (historically CC BY-SA 3.0).

## Which free interactive practice sites are reputable for SQL, and do they still work?

### Takeaway
pgexercises.com and Mode's SQL tutorial are both still indexed and live as of Nov 2026. Mode's pages now carry a "ThoughtSpot acquires Mode" banner but still serve the tutorial. SQLBolt could not be checked in this session, so re-check it before shipping.

### Cited Findings
- pgexercises.com is a free interactive PostgreSQL practice site by Alisdair Owens. It has 81 exercises on a country-club dataset (members/facilities/bookings) and needs no login. The site code is on GitHub (AlisdairO/pgexercises), and Yugabyte docs host the same dataset. — [pgexercises getting started](https://pgexercises.com/gettingstarted.html); [Yugabyte docs](https://docs.yugabyte.com/stable/develop/sample-data/pgexercises/)
- The Mode SQL tutorial pages are live (e.g. SELECT lesson, intermediate SQL) and carry a banner that ThoughtSpot acquired Mode. They use sample tables such as `tutorial.us_housing_units`. — [Mode SELECT lesson](https://mode.com/sql-tutorial/sql-select-statement); [Intro to intermediate SQL](https://mode.com/sql-tutorial/intro-to-intermediate-sql)

### Inferences
- Mode's ownership change is a risk to the tutorial's long-term availability. Add a fallback entry (pgexercises or SQLBolt) and set up automated link-checking in the app.

### Gaps
- SQLBolt, SQLZoo, Select Star SQL and sql-practice.com were not confirmed live (fetch blocked, not searched within budget).

## Where are the classic distributed-systems papers legitimately hosted?

### Takeaway
Use author or publisher hosting:
- Google Research pub pages for MapReduce, Bigtable, Spanner and GFS.
- USENIX open-access pages for Bigtable (OSDI'06), Spanner (OSDI'12) and Raft (ATC'14).
- raft.github.io for the Raft paper.
- allthingsdistributed.com (Werner Vogels, Amazon CTO) for Dynamo.
- Microsoft Research's upload of the NetDB'11 paper for Kafka (fetched, HTTP 200). The MIT CSAIL course copy is the second choice.

### Cited Findings
- The Kafka paper (Kreps, Narkhede, Rao; LinkedIn; NetDB'11) is hosted on microsoft.com. The PDF returned HTTP 200 in this session, while the MSR "publication" landing page returned 404. Course copies exist at MIT CSAIL and CMU, and the Apache wiki copy is the slides, not the paper. — [MSR PDF](https://www.microsoft.com/en-us/research/wp-content/uploads/2017/09/Kafka.pdf); [MIT copy](https://people.csail.mit.edu/matei/courses/2015/6.S897/readings/kafka.pdf); [LinkedIn 2011 post](https://engineering.linkedin.com/27/project-kafka-distributed-publish-subscribe-messaging-system-reaches-v06)
- MIT 6.5840 covers MapReduce (Lab 1) and Spanner (a Spring 2026 lecture). Its schedule links the papers and is a good curated index. — [6.5840 schedule](https://pdos.csail.mit.edu/6.824/schedule.html)

### Inferences
- Canonical hosts from prior knowledge, all unverified this session: research.google/pubs/... for MapReduce, Bigtable, Spanner and GFS; usenix.org for OSDI/ATC papers (USENIX makes proceedings open access); raft.github.io/raft.pdf; allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf; lamport.azurewebsites.net for Lamport's papers. Avoid Scribd and random mirrors.

### Gaps
- Research.google, USENIX, raft.github.io, allthingsdistributed.com and lamport.azurewebsites.net could not be fetched (proxy 403). The research.google slugs in particular should be re-verified, since Google has restructured that site before.

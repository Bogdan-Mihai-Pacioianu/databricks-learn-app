# Raport de calitate a conținutului

Generat de `tools/qa_content.js` la 2026-11-20.

| | Număr |
|---|---:|
| Erori | 0 |
| Avertismente | 62 |

## Erori

Niciuna.

## Avertismente

### lungimea variantelor (5)

- întrebări (SEED.questions): corecta e cea mai lungă în 61% (nivelul hazardului: 25%)
- test dp750: corecta e cea mai lungă în 58% (nivelul hazardului: 25%)
- test dbra: corecta e cea mai lungă în 56% (nivelul hazardului: 25%)
- test dp700: corecta e cea mai lungă în 61% (nivelul hazardului: 25%)
- test sparkcert: corecta e cea mai lungă în 64% (nivelul hazardului: 25%)

### explicație lipsă (25)

- test dbrp · q135-dbrp-047
- test dbrp · q135-dbrp-076
- test dbrp · q135-dbrp-085
- test awsdea · q137-aws-qa-013
- test awsdea · q137-aws-qa-022
- test awsdea · q137-aws-qa-037
- test awsdea · q137-aws-qa-040
- test awsdea · q137-aws-qa-058
- test awsdea · q137-aws-qa-061
- test awsdea · q137-aws-qa-064
- test awsdea · q137-aws-qa-067
- test gcppde · q138-gcp-qa-001
- test gcppde · q138-gcp-qa-005
- test gcppde · q138-gcp-qa-007
- test gcppde · q138-gcp-qa-008
- test gcppde · q138-gcp-qa-010
- test gcppde · q138-gcp-qa-028
- test gcppde · q138-gcp-qa-034
- test gcppde · q138-gcp-qa-035
- test gcppde · q138-gcp-qa-041
- test gcppde · q138-gcp-qa-047
- test gcppde · q138-gcp-qa-050
- test gcppde · q138-gcp-qa-052
- test gcppde · q138-gcp-qa-059
- test gcppde · q138-gcp-qa-061

### termen dublat (6)

- executor: t-sp-05(spark), t-or-13(orchestrare)
- volume: t-az-16(azure), t-do-08(docker)
- adls gen2: t-az-24(azure), t157-ae0de1f22e(azure)
- lakehouse: t-fa-04(fabric), t-mo-23(model)
- manifest: t-db-15(dbt), t-ic-01(iceberg)
- read committed: v117-t-7182e7115c(relational), v118-t-f5b79d5a6662(kafka)

### legături interne rupte (1)

- 176 legături spre materiale inexistente, de ex. exercise128-dbrp-d1-o1 → question:q125-dbrp-03; exercise128-dbrp-d1-o1 → question:q125-dbrp-15; exercise128-dbrp-d1-o1 → question:q125-dbrp-30; exercise128-dbrp-d1-o2 → question:q125-dbrp-01; exercise128-dbrp-d1-o2 → question:q125-dbrp-02; exercise128-dbrp-d1-o2 → question:q125-dbrp-08; exercise128-dbrp-d1-o3 → question:q125-dbrp-04; exercise128-dbrp-d1-o3 → question:q125-dbrp-05

### plan de lecții cu termen inexistent (3)

- sql: t-sq-16
- sql: t-sq-17
- perf: t-pf-16

### îngroșare neînchisă (**) (14)

- card sec-009 · a
- card course-snow-022 · a
- card skill128-python-14-apply · q
- termen t-dq-17 · example
- termen term128-python-14 · example
- întrebări (SEED.questions) skill128-python-14-q-understand · o2
- întrebări (SEED.questions) skill128-python-14-q-apply · q
- întrebări (SEED.questions) skill128-python-14-q-apply · o0
- întrebări (SEED.questions) skill128-python-14-q-debug · o2
- întrebări (SEED.questions) skill128-python-14-q-design · o0
- test dbrp q135-dbrp-code-24 · e
- test dbrp q135-dbrp-code-28 · e
- test awsdea q137-aws-qa-061 · e
- test awsdea q137-aws-qa-061 · o0

### domeniu de examen subreprezentat (3)

- dbra · Ingestie și încărcare: 13% din întrebări, oficial 21%
- sparkcert · API-ul DataFrame: 19% din întrebări, oficial 30%
- sparkcert · Arhitectura Spark: 12% din întrebări, oficial 20%

### domeniu de examen suprareprezentat (1)

- sparkcert · Spark SQL: 40% din întrebări, oficial 20%

### link nefuncțional (4)

- distributed · https://engineering.linkedin.com/distributed-systems/log-what-every-software-engineer-should-know-about-real-time-datas-unifying (502)
- perf · https://learn.finops.org/finops-for-engineers-introduction (404)
- iceberg · https://polaris.apache.org/docs/quickstart (404)
- flink · https://nightlies.apache.org/flink/flink-docs-stable/docs/try-flink/table_api/ (404)

## Informații

### lungimea variantelor (11)

- întrebări (SEED.questions): corecta e cea mai lungă în 61% din 1117
- test dp750: corecta e cea mai lungă în 58% din 331
- test dbra: corecta e cea mai lungă în 56% din 308
- test dp700: corecta e cea mai lungă în 61% din 158
- test dbrp: corecta e cea mai lungă în 10% din 150
- test sparkcert: corecta e cea mai lungă în 64% din 177
- test examen: corecta e cea mai lungă în 24% din 33
- test awsdea: corecta e cea mai lungă în 6% din 123
- test gcppde: corecta e cea mai lungă în 17% din 110
- test snowcore: corecta e cea mai lungă în 20% din 211
- Atelier: corecta e cea mai lungă în 27% din 56

### acoperire examen (44)

- dp750 · Pregătirea și configurarea mediului Azure Databricks: 15% (oficial 15–20%)
- dp750 · Securizarea și guvernanța obiectelor Unity Catalog: 15% (oficial 15–20%)
- dp750 · Pregătirea și procesarea datelor: 36% (oficial 30–35%)
- dp750 · Livrarea și întreținerea pipeline-urilor: 35% (oficial 30–35%)
- dp700 · Implementarea și administrarea unei soluții de analiză: 31% (oficial 30–35%)
- dp700 · Ingestia și transformarea datelor: 40% (oficial 30–35%)
- dp700 · Monitorizarea și optimizarea soluției: 30% (oficial 30–35%)
- dbra · Platforma Databricks Intelligence: 6% (oficial 6%)
- dbra · Ingestie și încărcare: 13% (oficial 21%)
- dbra · Transformare și modelare: 28% (oficial 22%)
- dbra · Lucrul cu Lakeflow Jobs: 10% (oficial 16%)
- dbra · CI/CD: 14% (oficial 10%)
- dbra · Depanare, monitorizare, optimizare: 18% (oficial 10%)
- dbra · Guvernanță și securitate: 12% (oficial 15%)
- dbrp · Scrierea codului de procesare: 19% (oficial 23%)
- dbrp · Ingestie și achiziție: 11% (oficial 12%)
- dbrp · Manipularea datelor: 11% (oficial 12%)
- dbrp · Monitorizare și alertare: 11% (oficial 10%)
- dbrp · Cost și performanță: 12% (oficial 15%)
- dbrp · Securitate și conformitate: 11% (oficial 8%)
- dbrp · Guvernanță: 8% (oficial 5%)
- dbrp · Depanare și livrare: 8% (oficial 10%)
- dbrp · Modelarea datelor: 11% (oficial 5%)
- sparkcert · API-ul DataFrame: 19% (oficial 30%)
- sparkcert · Arhitectura Spark: 12% (oficial 20%)
- … și încă 19

### Atelier (1)

- validatorul pachetelor trece


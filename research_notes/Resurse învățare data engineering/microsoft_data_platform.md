# Platforma de date Microsoft: resurse gratuite (Azure data, Fabric/DP-700, DP-750, KQL, Power BI) — stare la 19 noiembrie 2026

> **Notă despre verificare (important pentru integrarea în aplicație):** în această sesiune NU s-a putut accesa direct niciun URL. learn.microsoft.com, techcommunity.microsoft.com, sqlbi.com, dax.guide, detective.kusto.io, dataexplorer.azure.com și blog.fabric.microsoft.com au fost toate blocate de politica de rețea a sesiunii: DNS/proxy a răspuns 403 sau ENOTFOUND, iar curl a returnat codul 000. Prin urmare:
> - **[IDX]** = URL-ul a apărut în rezultatele motorului de căutare în această sesiune. Asta indică faptul că pagina există și este indexată, dar fără confirmarea unui HTTP 200 sau a lipsei unui redirect.
> - **[NV]** = URL cunoscut din memorie, nevăzut în căutare și neverificat. Trebuie verificat înainte de publicare.
> - Toate URL-urile trebuie re-verificate cu o rulare `curl -I` din rețea deschisă înainte să intre în aplicație. Pentru a le putea verifica din sesiune, `learn.microsoft.com` trebuie adăugat la gazdele permise în rețeaua sesiunii.
> - **Limbă:** învățarea Microsoft are un locale `ro-ro`. O pagină de documentație ro-ro a apărut în căutare. Pentru a obține versiunea în română, se înlocuiește `/en-us/` cu `/ro-ro/` în URL. FAQ-ul Learn spune însă că, dacă un modul nu este încă localizat, conținutul apare în engleză. NU am confirmat că parcursurile de învățare DP-700/DP-750 sau ghidurile de studiu au versiune în română. Valoarea implicită recomandată pentru câmpul de limbă este „EN (interfață ro-ro disponibilă; conținut posibil traducere automată sau fallback EN)”.

## Ce resurse oficiale există pentru DP-700 și DP-750 (ghid de studiu, competențe, evaluare de practică, parcursuri)?

### Concluzie
- **DP-700** („Implementing Data Engineering Solutions Using Microsoft Fabric”, certificarea Microsoft Certified: Fabric Data Engineer Associate) este activ. Are trei domenii, fiecare cu pondere de 30–35%, și o evaluare de practică gratuită. Data actuală „skills measured as of” nu este confirmată: sursele terțe citează 26 ian, 20 apr, 21 iul și 19 oct 2026.
- **DP-750** are numele exact „Implementing Data Engineering Solutions Using Azure Databricks” și duce la certificarea **Microsoft Certified: Azure Databricks Data Engineer Associate**. Este un examen nou, anunțat în beta în martie 2026. Are patru domenii (15–20 / 15–20 / 30–35 / 30–35), un curs oficial DP-750T00 de 4 zile și o evaluare de practică gratuită găzduită pe AI Skills Navigator. Statutul GA nu este confirmat.

### Constatări citate

**DP-700 (exam id: dp700)**
- Ghid de studiu: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700 [IDX]. Unele copii din cache au încă titlul „(beta)”. — [Căutare](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700)
- Pagina certificării: https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/ [IDX]. Pagina examenului: https://learn.microsoft.com/credentials/certifications/exams/dp-700 [IDX] (posibil redirect către pagina certificării). — [Learn](https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/)
- Competențe măsurate: Implement and manage an analytics solution (30–35%); Ingest and transform data (30–35%); Monitor and optimize an analytics solution (30–35%). — [Ghid de studiu DP-700](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700)
- Jurnalul de modificări al ghidului marchează „Configure security and governance” ca modificare minoră. Celelalte domenii nu au modificări. — [Ghid de studiu DP-700](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700)
- Data ultimei actualizări este neconfirmată. Sursele terțe dau 26 ian 2026, 20 apr 2026, 21 iul 2026 și 19 oct 2026. — [open-exam-prep](https://open-exam-prep.com/blog/azure-dp-700-fabric-data-engineer-exam-guide-2026); [ultimateinfoguide](https://ultimateinfoguide.com/dp-700-exam-guide/)
- Evaluarea de practică gratuită este legată din ghidul de studiu. Ancora probabilă este `.../fabric-data-engineer-associate/practice/assessment?assessment-type=practice&assessmentId=90` [NV; ID-ul 90 este din memorie, de verificat]. — [Ghid de studiu DP-700](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700)
- Durată: pagina certificării indică 100 de minute. Reînnoirea se face anual, gratuit, printr-o evaluare online. — [Learn: certificare](https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/)
- Prețul nu a fost găsit în surse. Examenele Associate costă de regulă 165 USD în SUA, iar prețul variază pe țară (pentru România este probabil mai mic) [NECONFIRMAT].
- Partenerii Microsoft oferă o colecție de studiu „Microsoft Learn self-guided study materials: DP-700”, iar Microsoft are un plan oficial „Prepare for Exam DP-700”. — [Partner](https://partner.microsoft.com/en-jo/asset/collection/microsoft-learn-self-guided-study-materials-dp-700); [Blog Fabric](https://www.microsoft.com/en-us/microsoft-fabric/blog/?p=2450)

**DP-750 (exam id: dp750)**
- Nume confirmat: „Study Guide for Exam DP-750: Implementing Data Engineering Solutions Using Azure Databricks”. Certificarea este „Microsoft Certified: Azure Databricks Data Engineer Associate”. — [Ghid de studiu DP-750](https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-750) [IDX]; [Pagina certificării](https://learn.microsoft.com/credentials/certifications/implementing-data-engineering-solutions-using-azure-databricks/) [IDX]
- Anunț: postarea Tech Community „New Microsoft Certified: Azure Databricks Data Engineer Associate certification” (ID 4494114). O postare din martie 2026 descrie examenul ca fiind în beta. — [Tech Community](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-azure-databricks-data-engineer-associate-certification/4494114) [IDX]
- Ponderi: Set up and configure an Azure Databricks environment (15–20%); Secure and govern Unity Catalog objects (15–20%); Prepare and process data (30–35%); Deploy and maintain data pipelines and workloads (30–35%). Mai multe surse terțe concordă între ele. Pagina Microsoft nu a putut fi citită direct. — [dev.to](https://dev.to/enriqueaguila/single-guide-for-dp-750-azure-databricks-certification-2o06); [mscertquiz](https://mscertquiz.com/blog/dp-750-study-guide)
- Data „skills measured” este în conflict: „March 11, 2026” într-o sursă și „October 19, 2026” (actualizări minore la data modeling în Unity Catalog și la ciclul de dezvoltare) în alta [NECONFIRMAT]. — [Rezumat căutare; surse terțe](https://brollyacademy.com/dp-750/)
- Statutul beta/GA este în conflict: un ghid terț spune „beta din martie 2026, fără dată GA anunțată”, altul spune „GA (beta încheiat în mai 2026)”. Niciunul nu citează un anunț Microsoft [NECONFIRMAT]. — [aguidetocloud](https://www.aguidetocloud.com/cert-tracker/dp-750/); [clearcatnet](https://www.clearcatnet.com/blog/dp750-certification-guide-2026)
- Evaluarea de practică gratuită este pe **AI Skills Navigator**, pe pagina certificării, și necesită autentificare. Un ghid o descrie ca fiind „puțin mai ușoară decât examenul real”. — [Tech Community](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-azure-databricks-data-engineer-associate-certification/4494114); [dev.to](https://dev.to/enriqueaguila/single-guide-for-dp-750-azure-databricks-certification-2o06)
- Cursul oficial DP-750T00-A „Implement data engineering solutions using Azure Databricks” durează 4 zile, este condus de instructor (ILT) și se concentrează pe Azure Databricks și Unity Catalog. Pagina cursului listează parcursurile de auto-studiu gratuite asociate. — [Learn: curs](https://learn.microsoft.com/en-us/training/courses/dp-750t00) [IDX]
- Scurtătura citată pentru ghid este aka.ms/DP750-StudyGuide [NV]. — [Rezumat căutare](https://www.alexcole.net/dp-750-azure-databricks-data-engineer-resource-guide/)
- Durata (~100 min) și prețul (165 USD) apar doar pe un site terț [NECONFIRMAT]. — [brollyacademy](https://brollyacademy.com/dp-750/)
- Ghiduri comunitare (gratuite, neoficiale): un repo GitHub cu ghid DP-750 și un ghid pe dev.to. — [GitHub sifatnotes](https://github.com/sifatnotes/Microsoft-DP-750-Study-Guide-Azure-Databricks-Data-Engineer-Associate); [dev.to](https://dev.to/enriqueaguila/single-guide-for-dp-750-azure-databricks-certification-2o06)

### Inferențe
- DP-750 se aliniază strâns cu Databricks Data Engineer Associate (Unity Catalog, Lakeflow, Delta). Un candidat notează însă că accentul diferă de certificarea nativă Databricks, deci merită parcurs separat ghidul de studiu Microsoft.
- Cursurile Udemy găsite pentru DP-700, DP-750 și PL-300 sunt plătite și neafiliate cu Microsoft. Au fost excluse din catalog.

### Lacune
- Data exactă „skills measured as of” pentru DP-700 și DP-750, sub-obiectivele detaliate, URL-ul exact al evaluării de practică (assessmentId) și dacă DP-750 a ieșit din beta: nu au putut fi confirmate fiindcă learn.microsoft.com a fost blocat.
- Prețul pentru România nu a fost găsit în nicio sursă.
- Lista modulelor din parcursurile de învățare DP-700 și DP-750 nu a putut fi extrasă.

## Care este statutul DP-203 și al credențialelor conexe?

### Concluzie
DP-203 (Azure Data Engineer Associate), examenul și evaluarea de reînnoire au fost retrase pe **31 martie 2025**. Succesorul recomandat de Microsoft este DP-700 (Fabric Data Engineer Associate). DP-750 acoperă acum zona Azure Databricks.

### Constatări citate
- Pagina de reînnoire Microsoft spune că certificarea și evaluarea de reînnoire au fost retrase pe 31 martie 2025. — [Learn: renew](https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/renew) [IDX]
- Cursul ILT DP-203T00 a fost retras. A mai fost disponibil pentru ILT până la 31 decembrie 2025. — [Tech Community](https://techcommunity.microsoft.com/blog/iltcommunicationblog/dp-203t00-available-for-ilt-until-december-31st-2025/4397741)
- Succesorul indicat este Fabric Data Engineer Associate (DP-700), conform anunțului „New certification for Microsoft Fabric data engineers”. — [Tech Community](https://techcommunity.microsoft.com/blog/skills-hub-blog/new-certification-for-microsoft-fabric-data-engineers/4159977/replies/4366775); [Learn Q&A](https://learn.microsoft.com/en-us/answers/questions/2148495/do-i-need-to-take-the-dp-203-exam-as-it-will-be-re)
- După expirare, certificarea nu mai poate fi reînnoită sau recâștigată. Un răspuns Q&A asistat de AI afirmă „remains valid until March 31, 2026”; informația este de mâna a doua și neconfirmată. — [Learn Q&A](https://learn.microsoft.com/en-us/answers/questions/2152645/azure-data-engineer-recertification)
- Conținutul vechi de învățare pentru Azure data engineering rămâne gratuit și util pentru serviciile Azure. Exemple: parcursul „Get started with data engineering on Azure” (nivel intermediar; ADLS, Synapse) și modulul academic despre stream processing cu Event Hubs și Databricks. — [Learn path](https://learn.microsoft.com/en-us/training/paths/get-started-data-engineering); [Learn academic module](https://learn.microsoft.com/en-us/training/modules/microsoft-azure-data-engineering-academic-programs/2-objective-domains)

### Inferențe
- În aplicație, dp203 ar trebui marcat „Retras (31.03.2025)”, ca arhivă sau context istoric, cu trimitere la dp700 și dp750.

### Lacune
- Statutul DP-600 (Fabric Analytics Engineer) și PL-300 în noiembrie 2026 nu a putut fi verificat direct. Ambele apar ca pagini active în indexul de căutare. Un site terț menționează o actualizare a PL-300 pe 20 aprilie 2026 [NECONFIRMAT].

## Ce opțiuni practice gratuite există (Fabric trial, Azure free account, ADX free cluster, Kusto Detective Agency)?

### Concluzie
Există patru opțiuni gratuite:
- **Fabric trial:** 60 de zile, capacitate F4 sau F64.
- **ADX/Kusto free cluster:** gratuit, fără card, valabil aproximativ 1 an, extensibil.
- **Clusterul public „help” cu StormEvents:** disponibil prin dataexplorer.azure.com.
- **Kusto Detective Agency:** joc gratuit, se joacă pe un free cluster sau într-o bază KQL în Fabric.

### Constatări citate
- Fabric trial: 60 de zile, cu posibilitate de extindere prin vânzări. Capacitatea este F4 sau F64. La expirare, elementele non-Power BI devin inaccesibile, iar datele rămân în OneLake 7 zile. Numărul de trial-uri pe tenant este limitat. — [Learn: Fabric trial](https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial) [IDX]
- Tutorialul „Learn common operators” folosește tabelul StormEvents din clusterul public „help”. Pentru date proprii și comenzi de management, Microsoft recomandă un free cluster. — [Learn: KQL tutorial](https://learn.microsoft.com/en-us/azure/kusto/query/tutorial) [IDX]
- Free cluster: se creează prin aka.ms/kustofree cu un cont Microsoft, în câteva secunde. Este valabil aproximativ 1 an, cu posibilitate de extindere (sursă blog). — [SQLServerCentral](https://www.sqlservercentral.com/blogs/adx-and-kql-free-cluster-for-learning-purposes); [Medium](https://medium.com/courisity-is-a-drug/walk-through-guide-for-kusto-detective-agency-onboarding-level-5ed569e3b123)
- Kusto Detective Agency (https://detective.kusto.io) este listat oficial în pagina „KQL learning resources”. Sezonul 2 se poate juca pe o bază KQL în Fabric sau pe un free cluster. — [Learn: KQL learning resources](https://learn.microsoft.com/kusto/query/kql-learning-resources) [IDX]; [Tech Community S2](https://techcommunity.microsoft.com/t5/azure-data-explorer-blog/introducing-kusto-detective-agency-season-2-bigger-better-and/ba-p/3829614)
- Interogări de exemplu în interfața web ADX și ingestie de date de exemplu. — [Learn: web-ui-samples-query](https://learn.microsoft.com/en-us/azure/data-explorer/web-ui-samples-query) [IDX]; [Learn: ingest-sample-data](https://learn.microsoft.com/en-us/azure/data-explorer/ingest-sample-data) [IDX]
- Azure free account (https://azure.microsoft.com/free/) [NV]. Termenii nu au putut fi verificați. Din memorie: credit de 200 USD pentru 30 de zile, plus servicii gratuite 12 luni și „always free”; condițiile s-ar putea fi schimbat [NECONFIRMAT]. Alternativa pentru studenți este Azure for Students, fără card [NV].

### Inferențe
- Pentru un cursant fără tenant de organizație, pornirea unui Fabric trial poate cere un cont de serviciu sau de muncă, nu un cont personal Microsoft. Pentru KQL, free cluster-ul și clusterul help sunt cele mai accesibile.

### Lacune
- Termenii actuali (2026) ai Azure free account și eligibilitatea conturilor personale pentru Fabric trial nu au fost verificați.

## Care sunt cele mai bune referințe și tutoriale oficiale pentru KQL și DAX (și Power BI / PL-300)?

### Concluzie
- **KQL:** documentația oficială learn.microsoft.com/kusto (tutoriale, referință operatori, pagina de resurse) plus parcursul Learn „Data analysis in Azure Data Explorer with KQL”.
- **DAX:** referința oficială Microsoft plus DAX Guide și cursul gratuit „Introducing DAX” de la SQLBI (3 ore, 32 de lecții).
- **PL-300:** ghid de studiu oficial cu evaluare de practică gratuită.

### Constatări citate
- Parcursul Learn „Data analysis in Azure Data Explorer with Kusto Query Language” se află la https://learn.microsoft.com/en-us/training/paths/data-analysis-data-explorer-kusto-query-language/ [IDX]. — [Learn](https://learn.microsoft.com/en-us/training/paths/data-analysis-data-explorer-kusto-query-language/)
- Pagina „KQL learning resources” include Kusto Detective Agency și tutorialele pentru operatori și agregări. — [Learn](https://learn.microsoft.com/kusto/query/kql-learning-resources)
- SQLBI „Introducing DAX Video Course” este gratuit: 3 ore, 32 de lecții, cu exemple și exerciții descărcabile și certificat PDF. Videoclipurile sunt găzduite pe Vimeo. Un recenzent îl consideră puțin învechit, iar SQLBI plănuiește o versiune nouă. — [SQLBI](https://www.sqlbi.com/p/introducing-dax-video-course/) [IDX]
- Ghidul de studiu PL-300 se află la https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300 [IDX; URL-ul indexat este varianta `/certifications/...`, deci probabil există redirect]. Ghidul include o evaluare de practică gratuită și presupune competență în Power Query și DAX. — [Learn PL-300](https://learn.microsoft.com/en-us/certifications/resources/study-guides/PL-300)
- dax.guide (SQLBI) nu a apărut în căutare. Îl includem din memorie [NV].

### Lacune
- Calea exactă a referinței DAX Microsoft (learn.microsoft.com/en-us/dax/) și a parcursurilor PL-300 nu a fost verificată [NV].

---

## CATALOG pentru aplicație (deck id → resurse)

Legendă tip: docs = documentație oficială; path = parcurs de învățare Microsoft Learn; guide = ghid de studiu examen; practice = evaluare de practică; applied = Applied Skills; lab = laborator/sandbox; tutorial.
Legendă limbă: EN = engleză; „ro-ro?” = există locale ro-ro pe Learn (se înlocuiește `/en-us/` cu `/ro-ro/`), dar disponibilitatea traducerii nu a fost confirmată.
Cost: toate resursele de mai jos sunt gratuite; „cont” = necesită un cont Microsoft gratuit.

### exam: dp700
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Study Guide for Exam DP-700 | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700 | Microsoft Learn | guide | Intermediar | EN, ro-ro? | Gratuit | Lista oficială de competențe măsurate și ponderile lor (3 × 30–35%) pentru DP-700. | IDX |
| 2 | Microsoft Certified: Fabric Data Engineer Associate | https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/ | Microsoft Learn | guide (pagina certificării) | Intermediar | EN, ro-ro? | Gratuit (examen plătit) | Pagina certificării, cu programare examen, durată (100 min), reînnoire și parcursuri. | IDX |
| 3 | Practice Assessment DP-700 | https://learn.microsoft.com/en-us/credentials/certifications/fabric-data-engineer-associate/practice/assessment?assessment-type=practice&assessmentId=90 | Microsoft Learn | practice | Intermediar | EN | Gratuit (cont) | Test de practică gratuit cu întrebări în stilul examenului. | NV (ID neverificat; se accesează din ghid) |
| 4 | Exam DP-700 page | https://learn.microsoft.com/credentials/certifications/exams/dp-700 | Microsoft Learn | guide | Intermediar | EN | Gratuit | Pagina examenului, care probabil redirecționează către pagina certificării. | IDX (posibil redirect) |
| 5 | Microsoft Fabric trial | https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial | Microsoft Learn | lab | Începător | EN, ro-ro? | Gratuit 60 zile (cont de serviciu) | Cum activezi o capacitate Fabric de probă (F4/F64) timp de 60 de zile. | IDX |
| 6 | Self-guided study materials DP-700 (Partner) | https://partner.microsoft.com/en-jo/asset/collection/microsoft-learn-self-guided-study-materials-dp-700 | Microsoft Partner | path (colecție) | Intermediar | EN | Gratuit | Colecție oficială de materiale de auto-studiu pentru DP-700. | IDX |
| 7 | Chart your course as a Fabric Data Engineer | https://www.microsoft.com/en-us/microsoft-fabric/blog/?p=2450 | Microsoft Fabric Blog | tutorial/ghid | Începător | EN | Gratuit | Traseu oficial de pregătire pentru cariera de Fabric Data Engineer. | IDX |

### exam: dp750
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Study Guide for Exam DP-750 | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-750 | Microsoft Learn | guide | Intermediar | EN, ro-ro? | Gratuit | Competențele măsurate pentru examenul Azure Databricks (15–20/15–20/30–35/30–35). | IDX |
| 2 | Microsoft Certified: Azure Databricks Data Engineer Associate | https://learn.microsoft.com/credentials/certifications/implementing-data-engineering-solutions-using-azure-databricks/ | Microsoft Learn | guide (pagina certificării) | Intermediar | EN | Gratuit (examen plătit) | Pagina noii certificări Azure Databricks, cu link către evaluarea de practică. | IDX (slug neobișnuit; posibil redirect) |
| 3 | Course DP-750T00-A | https://learn.microsoft.com/en-us/training/courses/dp-750t00 | Microsoft Learn | path (curs + parcursuri self-paced) | Intermediar | EN | Self-paced gratuit; ILT plătit | Curs oficial de 4 zile despre Azure Databricks și Unity Catalog; parcursurile listate se pot urma gratuit. | IDX |
| 4 | DP-750 Practice Assessment (AI Skills Navigator) | (link din pagina certificării, #2) | Microsoft | practice | Intermediar | EN | Gratuit (cont) | Test de practică oficial, găzduit pe AI Skills Navigator. | Neconfirmat (URL exact necunoscut) |
| 5 | Anunț: New Azure Databricks Data Engineer Associate | https://techcommunity.microsoft.com/blog/skills-hub-blog/new-microsoft-certified-azure-databricks-data-engineer-associate-certification/4494114 | Microsoft Tech Community | tutorial/anunț | Toate | EN | Gratuit | Anunțul oficial al certificării și detaliile despre perioada beta. | IDX |
| 6 | DP-750 Study Guide (comunitate) | https://github.com/sifatnotes/Microsoft-DP-750-Study-Guide-Azure-Databricks-Data-Engineer-Associate | GitHub (comunitate) | tutorial | Intermediar | EN | Gratuit (licență de verificat) | Notițe comunitare pe domenii: Unity Catalog, Lakeflow, Delta, CI/CD. | IDX (neoficial) |

### exam: dp203
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Azure Data Engineer Associate – Renew (retired) | https://learn.microsoft.com/en-us/credentials/certifications/azure-data-engineer/renew | Microsoft Learn | guide | — | EN | Gratuit | Confirmă retragerea certificării și a reînnoirii pe 31.03.2025. | IDX |
| 2 | DP-203T00 disponibil ILT până la 31.12.2025 | https://techcommunity.microsoft.com/blog/iltcommunicationblog/dp-203t00-available-for-ilt-until-december-31st-2025/4397741 | Microsoft Tech Community | anunț | — | EN | Gratuit | Calendarul de retragere a cursului DP-203T00. | IDX |
| 3 | Q&A: Trebuie să dau DP-203? | https://learn.microsoft.com/en-us/answers/questions/2148495/do-i-need-to-take-the-dp-203-exam-as-it-will-be-re | Microsoft Q&A | anunț | — | EN | Gratuit | Explică trecerea de la DP-203 la DP-700. | IDX |

### deck: azure (ADLS Gen2, ADF, Synapse, Event Hubs, Azure SQL, Purview)
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Get started with data engineering on Azure | https://learn.microsoft.com/en-us/training/paths/get-started-data-engineering | Microsoft Learn | path | Intermediar | EN, ro-ro? | Gratuit | Introducere în data engineering pe Azure, cu ADLS Gen2 și Synapse. | IDX |
| 2 | Microsoft Learn for Data Engineers (rol) | https://learn.microsoft.com/en-us/training/roles/data-engineer | Microsoft Learn | path (hub) | Toate | EN, ro-ro? | Gratuit | Hub cu toate parcursurile pentru rolul de data engineer. | IDX |
| 3 | ADF – Quickstart Learn modules | https://learn.microsoft.com/en-us/azure/data-factory/quickstart-learn-modules | Microsoft Learn | docs/path | Începător | EN, ro-ro? | Gratuit | Modulele introductive Azure Data Factory și ingestia la scară mare. | IDX (indexat în alte locale) |
| 4 | Azure Data & AI collections | https://learn.microsoft.com/en-us/training/topics/azure-data-and-ai | Microsoft Learn | path (hub) | Toate | EN | Gratuit | Colecții tematice despre datele și AI-ul în Azure. | IDX |
| 5 | Microsoft Learn for Purview | https://learn.microsoft.com/training/purview | Microsoft Learn | path (hub) | Începător | EN, ro-ro? | Gratuit | Punct de intrare pentru guvernanța datelor cu Microsoft Purview. | IDX |
| 6 | Azure Data Engineering academic – objective domains (Event Hubs + Databricks streaming) | https://learn.microsoft.com/en-us/training/modules/microsoft-azure-data-engineering-academic-programs/2-objective-domains | Microsoft Learn | path (academic) | Intermediar | EN | Gratuit | Program academic care include stream processing cu Event Hubs. | IDX |
| 7 | Azure free account | https://azure.microsoft.com/free/ | Microsoft | lab | Începător | EN, ro-ro? | Gratuit (card necesar) | Cont Azure gratuit cu credit inițial și servicii gratuite. | NV |
| 8 | Azure Data Lake Storage Gen2 – introduction | https://learn.microsoft.com/en-us/azure/storage/blobs/data-lake-storage-introduction | Microsoft Learn | docs | Începător | EN, ro-ro? | Gratuit | Concepte ADLS Gen2: namespace ierarhic și ACL-uri. | NV |
| 9 | Azure Event Hubs documentation | https://learn.microsoft.com/en-us/azure/event-hubs/ | Microsoft Learn | docs | Intermediar | EN, ro-ro? | Gratuit | Documentația Event Hubs, inclusiv endpoint-ul compatibil Kafka. | NV |
| 10 | Azure SQL documentation | https://learn.microsoft.com/en-us/azure/azure-sql/ | Microsoft Learn | docs | Începător | EN, ro-ro? | Gratuit | Documentația Azure SQL Database și Managed Instance. | NV |

### deck: kafka (Event Hubs)
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Event Hubs for Apache Kafka overview | https://learn.microsoft.com/en-us/azure/event-hubs/azure-event-hubs-kafka-overview | Microsoft Learn | docs | Intermediar | EN, ro-ro? | Gratuit | Cum folosești clienți Kafka cu Event Hubs fără să modifici codul. | NV |
| 2 | Event Hubs documentation | https://learn.microsoft.com/en-us/azure/event-hubs/ | Microsoft Learn | docs | Intermediar | EN, ro-ro? | Gratuit | Documentația completă Event Hubs: capture, partiții, consumer groups. | NV |
| 3 | Academic module: stream processing with Event Hubs and Databricks | https://learn.microsoft.com/en-us/training/modules/microsoft-azure-data-engineering-academic-programs/2-objective-domains | Microsoft Learn | path | Intermediar | EN | Gratuit | Streaming end-to-end cu Event Hubs și Azure Databricks. | IDX |

### deck: fabric
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Fabric trial capacity | https://learn.microsoft.com/en-us/fabric/fundamentals/fabric-trial | Microsoft Learn | lab | Începător | EN, ro-ro? | Gratuit 60 zile | Activarea și limitele trial-ului Fabric (F4/F64, 60 de zile). | IDX |
| 2 | Microsoft Fabric getting started | https://www.microsoft.com/en-us/microsoft-fabric/getting-started | Microsoft | lab | Începător | EN (ro-ro?) | Gratuit | Pagina oficială de pornire pentru trial-ul Fabric. | IDX |
| 3 | Microsoft Fabric documentation | https://learn.microsoft.com/en-us/fabric/ | Microsoft Learn | docs | Toate | EN, ro-ro? | Gratuit | Documentația oficială: lakehouse, warehouse, pipelines, OneLake. | NV |
| 4 | DP-700 Study Guide | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-700 | Microsoft Learn | guide | Intermediar | EN, ro-ro? | Gratuit | Harta oficială a competențelor de data engineering în Fabric. | IDX |
| 5 | DP-600 Study Guide (Fabric Analytics Engineer) | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-600 | Microsoft Learn | guide | Intermediar | EN | Gratuit | Competențele analitice în Fabric (semantic models, warehouse). | IDX |
| 6 | Exam Readiness Zone: DP-600 | https://learn.microsoft.com/en-us/shows/exam-readiness-zone/preparing-for-dp-600-plan-implement-and-manage-a-solution-for-data-analytics | Microsoft Learn Shows | tutorial (video) | Intermediar | EN | Gratuit | Video oficial de pregătire pentru examenul DP-600. | IDX |
| 7 | Fabric Data Engineer career blog | https://www.microsoft.com/en-us/microsoft-fabric/blog/?p=2450 | Microsoft Fabric Blog | tutorial | Începător | EN | Gratuit | Traseul de skilling recomandat pentru Fabric Data Engineer. | IDX |

### deck: kql
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | KQL learning resources | https://learn.microsoft.com/en-us/kusto/query/kql-learning-resources | Microsoft Learn | docs (hub) | Toate | EN, ro-ro? | Gratuit | Lista oficială de resurse pentru învățarea KQL. | IDX (fără en-us) |
| 2 | Tutorial: Learn common operators | https://learn.microsoft.com/en-us/azure/kusto/query/tutorial | Microsoft Learn | tutorial | Începător | EN, ro-ro? | Gratuit | Operatorii de bază (where, summarize, project) pe tabelul StormEvents. | IDX (posibil redirect spre /kusto/query/tutorials/...) |
| 3 | Data analysis in ADX with KQL (learning path) | https://learn.microsoft.com/en-us/training/paths/data-analysis-data-explorer-kusto-query-language/ | Microsoft Learn | path | Începător | EN, ro-ro? | Gratuit | Parcurs oficial de analiză a datelor cu KQL în Azure Data Explorer. | IDX |
| 4 | Kusto Detective Agency | https://detective.kusto.io/ | Microsoft (ADX team) | lab (joc) | Începător–Avansat | EN | Gratuit (cont) | Joc detectivistic în care rezolvi cazuri scriind interogări KQL. | IDX (prin referințe) |
| 5 | ADX free cluster | https://aka.ms/kustofree | Microsoft | lab | Începător | EN | Gratuit (cont Microsoft) | Cluster Kusto gratuit, creat în câteva secunde, pentru exersare. | Citat în surse; nefetch-uit |
| 6 | ADX web UI + help cluster (StormEvents samples) | https://learn.microsoft.com/en-us/azure/data-explorer/web-ui-samples-query | Microsoft Learn | tutorial | Începător | EN, ro-ro? | Gratuit | Interogări de exemplu în interfața web dataexplorer.azure.com. | IDX |
| 7 | Ingest sample data into ADX | https://learn.microsoft.com/en-us/azure/data-explorer/ingest-sample-data | Microsoft Learn | tutorial | Începător | EN, ro-ro? | Gratuit | Încarci date de exemplu în propriul cluster. | IDX |
| 8 | KQL quick reference | https://learn.microsoft.com/en-us/kusto/query/kql-quick-reference | Microsoft Learn | docs | Toate | EN, ro-ro? | Gratuit | Fișă rapidă cu operatorii și funcțiile KQL. | NV |
| 9 | Azure Data Explorer web UI | https://dataexplorer.azure.com/ | Microsoft | lab | Începător | EN | Gratuit (cont) | Interfața web pentru interogări pe clusterul help sau pe free cluster. | NV (blocat în sesiune) |
| 10 | Real-Time Intelligence in Fabric docs | https://learn.microsoft.com/en-us/fabric/real-time-intelligence/ | Microsoft Learn | docs | Intermediar | EN, ro-ro? | Gratuit | Eventhouse, KQL database și Eventstream în Microsoft Fabric. | NV |

### deck: bi (Power BI, DAX, PL-300)
| # | Titlu | URL | Furnizor | Tip | Nivel | Limbă | Cost | Rezumat (RO) | Stare URL |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Study guide PL-300 | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/pl-300 | Microsoft Learn | guide | Intermediar | EN, ro-ro? | Gratuit | Competențele Power BI Data Analyst și link-ul spre evaluarea de practică gratuită. | IDX (varianta /certifications/; probabil redirect) |
| 2 | Introducing DAX Video Course | https://www.sqlbi.com/p/introducing-dax-video-course/ | SQLBI | tutorial (video) | Începător | EN | Gratuit (cont) | Curs gratuit de 3 ore (32 de lecții) despre fundamentele DAX și contextul de evaluare. | IDX |
| 3 | DAX Guide | https://dax.guide/ | SQLBI | docs | Toate | EN | Gratuit | Referință completă a funcțiilor DAX, cu exemple și compatibilitate. | NV |
| 4 | DAX reference (Microsoft) | https://learn.microsoft.com/en-us/dax/ | Microsoft Learn | docs | Toate | EN, ro-ro? | Gratuit | Referința oficială a funcțiilor DAX. | NV |
| 5 | Power BI documentation | https://learn.microsoft.com/en-us/power-bi/ | Microsoft Learn | docs | Toate | EN, ro-ro? | Gratuit | Documentația Power BI: modelare, rapoarte, semantic models. | NV |
| 6 | Star schema guidance for Power BI | https://learn.microsoft.com/en-us/power-bi/guidance/star-schema | Microsoft Learn | docs | Intermediar | EN, ro-ro? | Gratuit | De ce schema stea contează pentru modelele semantice. | NV |
| 7 | SQLBI articles | https://www.sqlbi.com/articles/ | SQLBI | tutorial | Intermediar–Avansat | EN | Gratuit | Articole de specialitate despre DAX și modelare. | NV |
| 8 | DP-600 Study Guide (semantic models în Fabric) | https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/dp-600 | Microsoft Learn | guide | Intermediar | EN | Gratuit | Partea de semantic models și DAX din Fabric Analytics Engineer. | IDX |

**Relevanță PL-300:** PL-300 rămâne credențialul de bază pentru Power BI (ghid activ, cu evaluare de practică gratuită și reînnoire anuală gratuită). Este util ca pas paralel pentru data engineer, care trebuie să înțeleagă modelele semantice consumate din Fabric. — [Learn PL-300](https://learn.microsoft.com/en-us/certifications/resources/study-guides/PL-300)

### Resurse excluse
Practice tests Udemy, Pluralsight și O'Reilly (plătite, neafiliate), plus site-urile de tip „exam dump” (de exemplu sqlschool „DP 750 Exam Dump”, passitexams). Acestea din urmă încalcă acordul de examen Microsoft și nu trebuie incluse.

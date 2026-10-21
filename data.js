/**
 * Clinical Inspection Findings Source Hub — data
 *
 * Structure
 *   categories[]       Finding categories, split by domain
 *     - id, domain ("co" Clinical Operations | "dm" Data Management), code, label, description
 *
 *   organizations[]
 *     - id, name, short, logoText, domain (for favicon), category, intro, url
 *       category: regulator | mnc | cro | industry | academia
 *     - sources[]      One published document (metrics report, warning letter, EPAR, notice, analysis …)
 *         - id, title, url, type, publishedAt, period, scope (inspected party), summary
 *         - sponsor     (optional) trial sponsor named in the source
 *         - flag, flagNote (optional) caveat shown as a badge, e.g. "Secondary source", "Allegation"
 *         - findings[]  { domain, cat, sev, text, ref }
 *             sev: critical | major | minor | trend (aggregate statistic / most-frequent finding)
 *
 *   insights[]         Curated cards shown on the Cross-comparison page
 *
 * Scope: publicly released sources dated 1 January 2020 onward; only Clinical Operations
 * and Data Management findings are captured. GMP and PV-system-only findings are excluded.
 * Source URLs were verified on 19 October 2026; a few are secondary copies (see flag).
 */
window.DATA = {
  lastCheckedAt: "2026-10-19",
  coverageStart: "2020-01-01",

  categories: [
    { id: "co-protocol",  domain: "co", code: "PR",  label: "Protocol compliance & eligibility", description: "Eligibility violations, protocol deviations, prohibited medications, missed or out-of-window assessments." },
    { id: "co-consent",   domain: "co", code: "IC",  label: "Informed consent process", description: "Consent before procedures, current ICF version, re-consent, signatures/dates, consent by delegated staff." },
    { id: "co-safety",    domain: "co", code: "SR",  label: "Safety reporting (AE/SAE/SUSAR)", description: "Late or missed AE/SAE reporting, causality assessment, RSI use, IND safety reports, SUSAR handling." },
    { id: "co-ip",        domain: "co", code: "IP",  label: "Investigational product & blinding", description: "IP accountability, storage/temperature, dosing errors, randomisation, unblinding risks." },
    { id: "co-oversight", domain: "co", code: "PI",  label: "Investigator oversight & delegation", description: "PI supervision, delegation logs, staff qualification and training, medical decisions by the PI." },
    { id: "co-sponsor",   domain: "co", code: "SP",  label: "Sponsor / CRO oversight & monitoring", description: "Monitoring adequacy, vendor qualification and oversight, contracts, escalation of non-compliance." },
    { id: "co-tmf",       domain: "co", code: "TMF", label: "Essential documents & TMF/ISF", description: "Missing or late essential documents, eTMF structure and access, ISF content, inspection readiness." },
    { id: "co-ethics",    domain: "co", code: "EC",  label: "IRB/IEC & regulatory submissions", description: "Changes before IRB/HA approval, continuing review, IND/CTA submissions, protocol amendments." },
    { id: "co-qms",       domain: "co", code: "QMS", label: "Quality system, SOPs, training & CAPA", description: "Missing or inadequate SOPs, audits, risk management, training records, ineffective CAPA." },
    { id: "dm-integrity", domain: "dm", code: "DI",  label: "Data integrity, falsification & fabrication", description: "Fabricated or manipulated data, PK profile duplication, backdating, untraceable data." },
    { id: "dm-source",    domain: "dm", code: "SD",  label: "Source data & ALCOA+ documentation", description: "Missing/inaccurate source and case histories, source–CRF discrepancies, certified copies, contemporaneity." },
    { id: "dm-csv",       domain: "dm", code: "CSV", label: "Computerised system validation (EDC/IRT/eCOA)", description: "Unvalidated EDC, IRT/IWRS, ePRO or EMR systems; configuration defects; vendor qualification of systems." },
    { id: "dm-audit",     domain: "dm", code: "AT",  label: "Audit trail, access control & data security", description: "Audit trail availability and review, shared credentials, user access management, confidentiality." },
    { id: "dm-crf",       domain: "dm", code: "CRF", label: "CRF/EDC data entry, queries & cleaning", description: "CRF design and completion, data entry delays, query handling, PI sign-off, data management plans." },
    { id: "dm-recon",     domain: "dm", code: "REC", label: "Data reconciliation & external/vendor data", description: "Clinical vs safety database reconciliation, IRT/eCRF consistency, external data transfers, imaging/BICR data." },
    { id: "dm-lock",      domain: "dm", code: "DBL", label: "Database lock, unblinding & data transfer/archiving", description: "Lock/unlock control, unblinding before lock, randomisation code breaks, record retention and archiving." },
    { id: "dm-report",    domain: "dm", code: "STA", label: "Statistical analysis & reporting accuracy", description: "SAP timing, analysis sets, programming QC, CSR accuracy, presentation of efficacy results." },
    { id: "dm-lab",       domain: "dm", code: "LAB", label: "Laboratory & bioanalytical data", description: "Bioanalytical method validation, sample analysis, central/local lab certification, biosample management." }
  ],

  insights: [
    {
      title: "Cross-regulator consensus",
      meta: "The same few issues dominate in every region",
      color: "#0071bc",
      bullets: [
        "Protocol and eligibility non-compliance is the top or second finding area at FDA (21 CFR 312.60 heads the CI 483 list every year), EMA, PMDA, NMPA/CFDI, Health Canada, TGA and MFDS.",
        "Inadequate or inaccurate source and case-history records (21 CFR 312.62(b), Health Canada C.05.012, CFDI 'original records') are the most consistent data-side finding in every region.",
        "Sponsor oversight of vendors recurs in EMA 2020–2024, PMDA FY2022–FY2024 and FDA sponsor 483 trends. Typical gaps are contracts without inspector access, no vendor audits and unqualified system providers."
      ]
    },
    {
      title: "Data management watch-list",
      meta: "Signals rising in recent inspections",
      color: "#0a8f7f",
      bullets: [
        "IRT/IWRS configuration failures now appear in MNC sponsor inspections: Lilly's tirzepatide IWRS validation, a BMS system that assigned the wrong treatment to 106 subjects, and a PMDA FY2024 IRT dosing defect.",
        "Inspectors use audit trails and metadata to detect late entry, batch entry and backdating (FDA Rejdak warning letter 2024, SCDM, MHRA CRO critical finding, ANVISA 2024–25).",
        "EMA reported more computer-system findings from 2021. The EMA computerised-systems guideline (2023) and ICH E6(R3) raise expectations on validation, data governance and access control."
      ]
    },
    {
      title: "Data integrity & fraud signals",
      meta: "Where regulators rejected data outright",
      color: "#e11d48",
      bullets: [
        "PK profile duplication at bioequivalence (BE) CROs led to mass suspensions: Panexcell (2020), Synchron (2022) and Synapse (2024). EMA, FDA and WHO PQ acted in parallel.",
        "Site-level fraud through site management organisations (SMOs) and investigators: Japan's Medipharma case (2023) and FDA's disqualification of an investigator in a GSK study (2022) involved fabricated consent, eligibility and IP records.",
        "Sponsors stay accountable: regulators rejected the data and required repeat studies no matter which party committed the misconduct."
      ]
    },
    {
      title: "Inspection-readiness priorities for sponsors",
      meta: "Practical focus areas drawn from the findings",
      color: "#c47f17",
      bullets: [
        "Confirm eligibility before randomisation or dosing, with the PI's medical review documented at the time.",
        "Re-consent with revised ICFs on time; this was the top individual-case finding at PMDA in FY2022–FY2023.",
        "Report safety events with the correct RSI. Late or missed SAE/SUSAR reports and RSI misuse appear at MHRA, PMDA and in FDA sponsor 483s.",
        "Keep the eTMF complete and accessible to inspectors, and use certified copies when SDV is performed on EMRs (EMA 2022–2024)."
      ]
    }
  ],

  organizations: [
    /* ======================= REGULATORS ======================= */
    {
      id: "fda", name: "FDA — U.S. Food and Drug Administration", short: "FDA", logoText: "FDA", domain: "fda.gov",
      category: "regulator",
      intro: "The Bioresearch Monitoring (BIMO) program inspects clinical investigators, sponsors/CROs and IRBs. Sources include metrics reports, Form 483 trend reports, warning letters and data-integrity notices.",
      url: "https://www.fda.gov/science-research/clinical-trials-and-human-subject-protection/bimo-inspection-metrics",
      sources: [
        { id: "fda-bimo-metrics-fy2024", title: "BIMO Inspection Metrics FY2024", url: "https://www.fda.gov/media/192870/download", type: "Inspection Metrics", publishedAt: "2025", period: "FY2024 (Oct 2023 – Sep 2024), with FY2020–FY2024 comparison", scope: "Clinical investigators, sponsors/CROs, sponsor-investigators, IRBs",
          summary: "1,076 BIMO inspections received a final classification, including 609 clinical investigator (CI), 99 sponsor/CRO and 86 IRB inspections. CI results were 484 NAI, 110 VAI and 15 OAI. That is the highest CI OAI count of FY2020–FY2024 (5, 5, 9, 9, 15).",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Most common CI Form 483 observations: failure to comply with Form FDA 1572 commitments, failure to follow the investigational plan, and protocol deviations.", ref: "21 CFR 312.60" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Inadequate or inaccurate case history records and inadequate study records are among the most common CI observations.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Inadequate accountability or control of investigational product records is a recurring CI observation.", ref: "21 CFR 312.62(a)" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Failure to report or record adverse events is a common CI observation. Sponsor-investigators were cited for not reporting SAEs to the sponsor.", ref: "21 CFR 312.64(b)" },
            { domain: "co", cat: "co-consent", sev: "trend", text: "Inadequate subject protection and informed consent (CI). Sponsor-investigators did not obtain Part 50 consent before dosing or study tests.", ref: "21 CFR 50.20 / 50.27" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Most common sponsor/CRO observation: failure to ensure proper monitoring and that the study follows the protocol and investigational plan.", ref: "21 CFR 312.50 / 312.56" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "Sponsor/CRO observations also included failure to submit an IND application and failure to submit IND safety reports.", ref: "21 CFR 312.20 / 312.32" }
          ] },
        { id: "fda-bimo-metrics-fy2023", title: "BIMO Inspection Metrics FY2023", url: "https://www.fda.gov/media/178661/download", type: "Inspection Metrics", publishedAt: "2024-05", period: "FY2023 (Oct 2022 – Sep 2023)", scope: "Clinical investigators, sponsors/CROs, sponsor-investigators, IRBs",
          summary: "1,073 BIMO inspections received a final classification: 681 CI (537 NAI / 136 VAI / 9 OAI), 103 sponsor/CRO (87 NAI / 16 VAI / 0 OAI) and 71 IRB. FDA also completed 106 remote regulatory assessments.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Top CI observation: failure to comply with Form FDA 1572 requirements and to follow the investigational plan.", ref: "21 CFR 312.60" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Inadequate or inaccurate case history records and study records ranked second among CI observations.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-consent", sev: "trend", text: "Inadequate subject protection and informed consent ranked third among CI observations.", ref: "21 CFR Part 50" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Sponsor/CRO: failure to ensure proper monitoring and conduct per protocol was the most common observation.", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-tmf", sev: "trend", text: "Sponsors/CROs and sponsor-investigators did not maintain or retain adequate records: IP accountability, Form FDA 1572 and financial disclosures.", ref: "21 CFR 312.57" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "Failure to submit an IND or IND safety report, and (for device studies) failure to submit the current investigator list every six months.", ref: "21 CFR 312.32; 812.150(b)(4)" }
          ] },
        { id: "fda-bimo-metrics-fy2022", title: "BIMO Inspection Metrics FY2022", url: "https://www.fda.gov/media/165853/download", type: "Inspection Metrics", publishedAt: "2023", period: "FY2022 (Oct 2021 – Sep 2022)", scope: "Clinical investigators, sponsors/monitors/CROs, sponsor-investigators, IRBs",
          summary: "766 BIMO inspections received a final classification: 504 CI (408 NAI / 87 VAI / 9 OAI), 81 sponsor/CRO (66 NAI / 15 VAI / 0 OAI) and 10 sponsor-investigator (3 OAI). On-site surveillance inspections resumed in July 2021 after the COVID-19 pause.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Common CI observations: Form 1572 and protocol compliance failures, failure to follow the investigational plan, and protocol deviations.", ref: "21 CFR 312.60" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Inadequate or inaccurate case history and study records were a common CI observation.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Inadequate accountability or control of the investigational product was a common CI observation.", ref: "21 CFR 312.62(a)" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Failure to report or record adverse events was a common CI observation.", ref: "21 CFR 312.64" },
            { domain: "co", cat: "co-oversight", sev: "trend", text: "Sponsor-investigators were often cited for failing to select qualified investigators and monitors and to ensure proper monitoring.", ref: "21 CFR 312.53 / 312.50" }
          ] },
        { id: "fda-bimo-metrics-fy2021", title: "BIMO Inspection Metrics FY2021", url: "https://www.fda.gov/media/156517/download", type: "Inspection Metrics", publishedAt: "2022", period: "FY2021 (Oct 2020 – Sep 2021)", scope: "Clinical investigators, sponsors/CROs, sponsor-investigators, IRBs",
          summary: "Volume was at a pandemic low: 611 inspections received a final classification, including 437 CI (350 NAI / 82 VAI / 5 OAI) and 79 sponsor/CRO (65 NAI / 12 VAI / 2 OAI). FDA also completed 140 remote regulatory assessments.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Failure to follow the investigational plan, and protocol deviations, were the first-listed common CI observation.", ref: "21 CFR 312.60" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Inadequate or inaccurate case histories and study records were the second-listed CI observation.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "CIs were cited for failure to comply with 21 CFR Part 56 IRB requirements. Failure to submit an IND was the first-listed sponsor/CRO observation.", ref: "21 CFR 312.66; 312.20" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Sponsors/CROs were cited for failing to select qualified investigators and monitors and to ensure proper monitoring.", ref: "21 CFR 312.50 / 312.53" }
          ] },
        { id: "fda-ci-483-trends-fy2024", title: "FY 2024 Clinical Investigator FDA 483 Observation Trends", url: "https://www.fda.gov/files/science%20%26%20research/published/fy_2024_ci_fda_483_observations_trends_1.pdf", type: "483 Observation Trends", publishedAt: "2025", period: "FY2024", scope: "Clinical investigators (drug, biologic, device)",
          summary: "156 of 692 CI inspections (23%) resulted in a Form FDA 483. Citations fell into five themes: protocol compliance, case histories, AE reporting to the sponsor, IP accountability and IRB.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Protocol sub-themes: inclusion criteria not met, exclusion criteria met, randomisation before eligibility was confirmed, missed visits or labs, out-of-window procedures, prohibited concomitant medication.", ref: "21 CFR 312.60 / 812.100" },
            { domain: "co", cat: "co-consent", sev: "trend", text: "ICF not obtained before screening or IP administration; revised consent not obtained or obtained late; no ICF at rescreening or for a sub-study.", ref: "21 CFR 312.60; 50.27" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Randomisation errors, IP kit selection errors, over- or under-dosing, inadequate storage or preparation, and unblinding. Accountability gaps covered use by subject, quantity, batch and disposition.", ref: "21 CFR 312.62(a)" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Case-history sub-themes: records not kept, missing or inadequate data, data discrepancies, non-contemporaneous records.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "AE/SAE reports to the sponsor that were unreported or late were a top theme.", ref: "21 CFR 312.64(b)" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "Changes made without prior IRB approval, unanticipated problems not reported, lapsed continuing review. New in FY2024: progress reports not submitted to the IRB.", ref: "21 CFR 312.66" },
            { domain: "co", cat: "co-oversight", sev: "trend", text: "Studies not personally supervised, unidentified sub-investigators and unqualified personnel.", ref: "21 CFR 312.60" }
          ] },
        { id: "fda-ci-483-trends-fy2023", title: "FY 2023 Clinical Investigator FDA 483 Observation Trends", url: "https://www.fda.gov/media/183349/download", type: "483 Observation Trends", publishedAt: "2024", period: "FY2023", scope: "Clinical investigators",
          summary: "142 of 693 CI inspections (20%) resulted in a Form FDA 483. The top themes were protocol compliance, case histories, AE reporting, IRB and IP accountability.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Protocol compliance was the leading theme: eligibility failures, prohibited medications, missed visits or labs, and incorrectly performed procedures.", ref: "21 CFR 312.60" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Case histories: missing or inadequate records and data, data discrepancies and non-contemporaneous entries.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "IP accountability: missing records of use by subject, dates, quantities, batch/code and return or disposition.", ref: "21 CFR 312.62(a)" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "AE or safety reports to the sponsor that were unreported or late.", ref: "21 CFR 312.64(b)" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "Changes made before IRB approval, unanticipated problems not reported, and problems with IRB initial or continuing review.", ref: "21 CFR 312.66" }
          ] },
        { id: "fda-sponsor-483-trends-fy2024", title: "FY 2024 Sponsor FDA 483 Observation Trends", url: "https://www.fda.gov/files/science%20%26%20research/published/fy_2024_sponsor_fda_483_data_observation_trends_0.pdf", type: "483 Observation Trends", publishedAt: "2025", period: "FY2024", scope: "Sponsors, CROs, sponsor-investigators",
          summary: "31 of 125 sponsor inspections (25%) resulted in a Form FDA 483. The themes were sponsor responsibilities, securing compliance, IRB approval, annual reporting and IP records.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Inadequate monitoring of clinical sites, and monitoring plans that were not followed, were the leading sponsor-responsibility themes.", ref: "21 CFR 312.50 / 812.40" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Late safety reporting, and failure to inform clinical investigators of safety events.", ref: "21 CFR 312.50; 312.56(c)" },
            { domain: "dm", cat: "dm-csv", sev: "trend", text: "Inadequate validation of electronic systems used to maintain source records.", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Protocols did not tell sites how to report deviations; deviations were reported late or under-reported; subjects were enrolled under outdated protocol versions.", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Failure to secure compliance: terminated or non-compliant CIs not reported to FDA, and IRB-approved consent forms not used.", ref: "21 CFR 312.56(b)" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "IP shipment, receipt and disposition records not kept (sponsor-investigators).", ref: "21 CFR 312.57(a)" }
          ] },
        { id: "fda-osi-7yr-gcp-outcomes-2025", title: "A 7-Year Analysis of the U.S. FDA GCP Inspection Outcomes for Marketing Applications (FDA/CDER OSI authors, TIRS)", url: "https://link.springer.com/article/10.1007/s43441-025-00835-6", type: "FDA publication (peer-reviewed)", publishedAt: "2025-07-19", period: "Calendar years 2017–2023", scope: "Routine CDER GCP inspections of CIs, sponsors and CROs",
          summary: "Analysis of 2,836 routine GCP inspections supporting CDER applications: 81.2% NAI, 18.5% VAI, 0.3% OAI. The share of inspections ending in a Form 483 fell from 23.5% (2017) to 10.4% (2023).",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Not adhering to the protocol was the most common deficiency area: 45.0% of classification upgrades and 40.6% of downgrades.", ref: "21 CFR 312.60" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Inadequate records were the second most common deficiency area (23.8% of upgrades, 31.9% of downgrades).", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Safety reporting accounted for 15.0% of deficiency areas in upgraded inspections.", ref: "21 CFR 312.64" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Monitoring/oversight, drug accountability and informed consent each made up less than 9% of final deficiencies in upgrades. Downgrades rose in 2020–2022, which the authors link to COVID-19 flexibility.", ref: "21 CFR 312.50" }
          ] },
        { id: "fda-cder-oc-annual-report-2025", title: "CDER Office of Compliance Annual Report (2025) — Clinical Trial Oversight & BIMO", url: "https://www.fda.gov/media/192091/download", type: "Annual Report", publishedAt: "2026-04", period: "Calendar year 2025", scope: "Sponsors, CROs, clinical investigators, IRBs (CDER)",
          summary: "In 2025 CDER reviewed more than 590 inspections and remote regulatory assessments, evaluated more than 1,000 complaints about trial conduct, and issued 14 BIMO warning letters and 6 untitled letters.",
          findings: [
            { domain: "co", cat: "co-oversight", sev: "trend", text: "11 of the 14 BIMO warning letters issued in 2025 went to clinical investigators or sponsor-investigators.", ref: "21 CFR 312.60 / 312.62" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "3 of the 14 BIMO warning letters in 2025 went to sponsors; CDER also issued 6 untitled letters.", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "ClinicalTrials.gov non-compliance: 42 Preliminary Notices and 2 Notices of Noncompliance; about 90% of recipients then posted results.", ref: "42 U.S.C. 282(j)" }
          ] },
        { id: "fda-notice-panexcell-synchron-2021", title: "FDA Notification — Clinical and bioanalytical studies by Panexcell and Synchron unacceptable", url: "https://www.fda.gov/drugs/drug-safety-and-availability/notification-pharmaceutical-companies-clinical-and-bioanalytical-studies-conducted-panexcell", type: "Data Integrity Notification", publishedAt: "2021-09-16", period: "Inspections and data analyses before Sep 2021", scope: "CROs (BA/BE clinical and bioanalytical, India)",
          summary: "FDA found significant misconduct at two India-based CROs. It issued untitled letters, rejected the data, required sponsors to repeat the studies, and changed the therapeutic equivalence ratings of affected generics to 'BX'.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Significant misconduct led to invalid study data being submitted to FDA. All clinical and bioanalytical studies by both CROs were deemed unacceptable.", ref: "21 CFR 320" },
            { domain: "dm", cat: "dm-lab", sev: "critical", text: "Bioanalytical and clinical BE data cannot support bioequivalence. Therapeutic equivalence ratings of affected generics were changed to 'BX'.", ref: "21 CFR 320" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Sponsors must repeat essential BA/BE studies elsewhere or withdraw the products. Sponsors remain responsible for the integrity of their data.", ref: "21 CFR 312.50" }
          ] },
        { id: "fda-notice-synapse-2024", title: "FDA Notification — Clinical and bioanalytical studies by Synapse Labs unacceptable", url: "https://www.fda.gov/drugs/drug-safety-and-availability/notification-pharmaceutical-companies-clinical-and-bioanalytical-studies-conducted-synapse-labs-pvt", type: "Data Integrity Notification", publishedAt: "2024-06-18", period: "Data analyses 2023–2024", scope: "CRO (Pune, India; BA/BE)",
          summary: "FDA found significant unexplained anomalies in Synapse study data that indicated falsification. All of the CRO's studies must be repeated, and affected generics were moved to 'BX'.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Significant unexplained anomalies in BE study data in several applications indicated falsified data.", ref: "21 CFR 320" },
            { domain: "dm", cat: "dm-lab", sev: "critical", text: "Both the bioanalytical and clinical portions were rejected as unreliable and must be re-run at another site.", ref: "21 CFR 320" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Sponsors must use an entity with no unresolved data-integrity concerns and respond within 30 days, or face withdrawal proceedings.", ref: "21 CFR 314.150" }
          ] },
        { id: "fda-wl-zadra-2021", title: "Warning Letter — Joseph A. Zadra, M.D. (Clinical Investigator)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/joseph-zadra-md-619451-10142021", type: "Warning Letter", publishedAt: "2021-10-14", period: "Inspection May 2021", scope: "Clinical investigator (CDER; Barrie, Ontario)",
          summary: "An ineligible subject was enrolled and dosed, and protocol-required safety labs were missed for several subjects.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "major", text: "A subject who did not meet an inclusion criterion was enrolled and dosed. The cause was a coordinator's lab-unit conversion error, although the lab report flagged the value.", ref: "21 CFR 312.60" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "Required pre-dose safety labs were not performed for several subjects, who still received study drug for up to 9 months.", ref: "21 CFR 312.60" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "The CI blamed the study coordinator. FDA stated that the CI is ultimately responsible for eligibility and protocol compliance.", ref: "21 CFR 312.60; Form FDA 1572" },
            { domain: "co", cat: "co-qms", sev: "minor", text: "The new protocol-compliance SOP was judged insufficient because it did not require the CI to personally ensure compliance.", ref: "21 CFR 312.60" }
          ] },
        { id: "fda-wl-melnyk-2021", title: "Warning Letter — Vasyl Melnyk, M.D. (Clinical Investigator)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/vasyl-melnyk-md-623671-12212021", type: "Warning Letter", publishedAt: "2021-12-21", period: "Inspection Sep 2021", scope: "Clinical investigator (CDER; Kyiv, Ukraine)",
          summary: "The CI lost the study records, including signed ICFs, source data and CRFs, for a protocol supporting a pending BLA.",
          findings: [
            { domain: "dm", cat: "dm-lock", sev: "major", text: "Study records were not kept for the required retention period while a BLA was pending; archived boxes could not be produced.", ref: "21 CFR 312.62(c)" },
            { domain: "co", cat: "co-consent", sev: "major", text: "Signed and dated ICFs were not retained for any randomised subject.", ref: "21 CFR 312.62(c); 50.27" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Source data (medical history, eligibility, AEs, concomitant medications) were missing for 16 subjects; CRFs were missing for all subjects.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-tmf", sev: "major", text: "The losses were found only when the sponsor's CRO prepared for the FDA inspection, which showed inadequate archiving controls for the investigator site file.", ref: "21 CFR 312.62(c)" }
          ] },
        { id: "fda-nooh-villaman-bencosme-2022", title: "Notice of Opportunity for Hearing (Disqualification) — Yvelice A. Villaman-Bencosme, M.D.", url: "https://www.fda.gov/media/162778/download", type: "Disqualification Notice (NOOH)", publishedAt: "2022-09-26", period: "Inspection 2017; guilty plea Jan 2021", scope: "Clinical investigator", sponsor: "GSK (paediatric asthma study SAS115358 'VESTRI')",
          summary: "CDER began disqualification proceedings after the CI pleaded guilty to wire-fraud conspiracy. False data had been entered for subjects who never took part in a GSK paediatric trial.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Case histories were fabricated for subjects who did not take part, including fake examinations and study visits.", ref: "21 CFR 312.70(a)" },
            { domain: "co", cat: "co-consent", sev: "critical", text: "Records falsely showed that subjects had given informed consent.", ref: "21 CFR 312.70(a); 50.27" },
            { domain: "co", cat: "co-protocol", sev: "critical", text: "Records falsely showed that subjects met the eligibility criteria.", ref: "21 CFR 312.70(a)" },
            { domain: "co", cat: "co-ip", sev: "critical", text: "Drug accountability records falsely showed study drug received and returned for subjects who did not take part.", ref: "21 CFR 312.62(a)" }
          ] },
        { id: "fda-wl-greenwald-2023", title: "Warning Letter — Maria W. Greenwald, M.D. (Clinical Investigator)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/maria-w-greenwald-md-670580-10202023", type: "Warning Letter", publishedAt: "2023-10-20", period: "Inspection 2022", scope: "Clinical investigator (CDER)",
          summary: "Eligibility and prohibited-medication violations, including a subject co-enrolled in two protocols, and incomplete case histories.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "major", text: "Ineligible subjects were not excluded and took prohibited medications. One subject was enrolled in two of the CI's protocols at the same time.", ref: "21 CFR 312.60" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Case histories left out diagnoses and concomitant medications that were recorded in the same subject's records for another protocol.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-qms", sev: "minor", text: "The response claimed corrections but gave no documentation and no corrective action plan.", ref: "21 CFR 312.62(b)" }
          ] },
        { id: "fda-wl-nobles-2024", title: "Warning Letter — Nobles Medical Technology II, Inc. (Sponsor, device IDE)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/nobles-medical-technology-ii-inc-673465-01262024", type: "Warning Letter", publishedAt: "2024-01-26", period: "Inspection Oct 2023", scope: "Sponsor (CDRH; STITCH PFO closure study)",
          summary: "A device sponsor had no monitoring plan, inadequate monitoring reports, missing IRB approvals and unqualified investigators and monitors.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "major", text: "There was no written monitoring plan. Reports did not record what was reviewed or whether source documents were compared with CRFs.", ref: "21 CFR 812.40" },
            { domain: "dm", cat: "dm-crf", sev: "major", text: "Investigators signed CRFs 8–12 months after monitoring visits, and 11 CRFs were never signed.", ref: "21 CFR 812.140" },
            { domain: "co", cat: "co-ethics", sev: "major", text: "No documented IRB approval or continuing review for protocol versions 5 and 6 at several sites.", ref: "21 CFR 812.42" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "No evidence that investigators were qualified or that the sponsor had the training to monitor.", ref: "21 CFR 812.43" },
            { domain: "co", cat: "co-tmf", sev: "major", text: "Investigator agreements lacked the supervision commitment, and no financial disclosure records were provided.", ref: "21 CFR 812.43(c)" }
          ] },
        { id: "fda-wl-rejdak-2024", title: "Warning Letter — Konrad Rejdak, M.D., Ph.D. (Clinical Investigator)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/konrad-rejdak-md-phd-671405-05292024", type: "Warning Letter", publishedAt: "2024-05-29", period: "Inspection May 2023", scope: "Clinical investigator (CBER; Lublin, Poland)", sponsor: "Takeda/Baxalta (HyQvia CIDP Phase 3, Protocol 161403)",
          summary: "Primary-endpoint INCAT scores were entered into tablets up to 25 days after the assessment, without source documentation, and the times were edited to look contemporaneous.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Assessment times and dates were edited afterwards so that late entries looked contemporaneous.", ref: "21 CFR 312.62(b)" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "144 assessment values, including the INCAT primary endpoint, had no source documentation, with entry lags of up to 25 days. The protocol required paper capture when real-time entry was not possible.", ref: "21 CFR 312.62(b)" },
            { domain: "co", cat: "co-qms", sev: "minor", text: "FDA rejected the explanation of poor internet during COVID-19: affected visits pre-dated the pandemic.", ref: "21 CFR 312.62(b)" }
          ] },
        { id: "fda-wl-mit-irb-2024", title: "Warning Letter — Massachusetts Institute of Technology COUHES (IRB)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/massachusetts-institute-technology-mit-663218-06212024", type: "Warning Letter", publishedAt: "2024-06-21", period: "Remote assessment May–Jun 2023", scope: "IRB (CBER)",
          summary: "The IRB approved informed consent forms that were missing elements required by 21 CFR 50.25.",
          findings: [
            { domain: "co", cat: "co-ethics", sev: "major", text: "The IRB did not require that consent information complied with 21 CFR 50.25.", ref: "21 CFR 56.109(b)" },
            { domain: "co", cat: "co-consent", sev: "major", text: "Approved ICFs left out alternative procedures or treatments and the statement that FDA may inspect records.", ref: "21 CFR 50.25(a)(4)-(5)" }
          ] },
        { id: "fda-wl-lightner-2025", title: "Warning Letter — Amy Lightner, MD (Sponsor-Investigator)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/amy-lightner-md-682593-03252025", type: "Warning Letter", publishedAt: "2025-03-25", period: "Inspection Apr 2023", scope: "Sponsor-investigator (CBER)",
          summary: "Subjects were dosed before eligibility results were available, AEs were not sent to the medical monitor, and records were not retained.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "major", text: "Subjects received IP before eligibility samples were collected or resulted.", ref: "21 CFR 312.60" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "No documentation that AEs were sent to the independent medical monitor as the protocols required.", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-safety", sev: "major", text: "Adverse events were not documented or reported as the protocol and FDA regulations require.", ref: "21 CFR 312.64" },
            { domain: "dm", cat: "dm-lock", sev: "major", text: "Study records were not retained for the required 2-year period.", ref: "21 CFR 312.57(c)" }
          ] },
        { id: "fda-wl-exthera-2026", title: "Warning Letter — ExThera Medical Corporation (Sponsor, device IDE)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/exthera-medical-corporation-715068-02062026", type: "Warning Letter", publishedAt: "2026-02-06", period: "Inspection May–Jun 2025", scope: "Sponsor (CDRH)",
          summary: "Investigational devices were shipped for compassionate use without FDA approval, and the sponsor could not show that signed consent had been verified.",
          findings: [
            { domain: "co", cat: "co-ethics", sev: "major", text: "Devices were shipped for emergency or compassionate use before an IDE supplement was approved.", ref: "21 CFR 812.35(a)" },
            { domain: "co", cat: "co-qms", sev: "major", text: "The firm did not follow its own work instruction requiring FDA approval before compassionate use.", ref: "21 CFR 812.35(a)" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "The clinical monitoring plans required ICF verification, and the sponsor could not show this was done.", ref: "21 CFR 812.40; 812.46" },
            { domain: "co", cat: "co-consent", sev: "major", text: "No evidence that enrolled subjects signed informed consent in either study.", ref: "21 CFR 50.27" }
          ] },
        { id: "fda-wl-de-la-torre-silva-2026", title: "Warning Letter — Maria E. De La Torre Silva, M.D. (Clinical Investigator)", url: "https://www.fda.gov/inspections-compliance-enforcement-and-criminal-investigations/warning-letters/maria-e-de-la-torre-silva-md-735690-07272026", type: "Warning Letter", publishedAt: "2026-07-27", period: "Inspection 2025", scope: "Clinical investigator (CDER; Homestead, Florida)",
          summary: "A subject was dosed in two trials at the same time. Dosing logs, IP accountability and EDC conflicted, and kits recorded as used came back with seals intact.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "major", text: "A subject was randomised and dosed while still receiving IP in another trial.", ref: "21 CFR 312.60" },
            { domain: "co", cat: "co-ip", sev: "major", text: "Disposition records were inadequate for six subjects who self-administered IP at home.", ref: "21 CFR 312.62(a)" },
            { domain: "dm", cat: "dm-recon", sev: "major", text: "Subject dosing logs, the site IP accountability log and EDC IP entries did not agree.", ref: "21 CFR 312.62(a)" },
            { domain: "dm", cat: "dm-integrity", sev: "major", text: "Kits recorded as dispensed and used were returned with tamper-evident seals intact, which undermines the reliability of the dosing data.", ref: "21 CFR 312.62(a)" }
          ] }
      ]
    },

    {
      id: "ema", name: "EMA — European Medicines Agency (GCP Inspectors Working Group)", short: "EMA", logoText: "EMA", domain: "ema.europa.eu",
      category: "regulator",
      intro: "Coordinates GCP inspections requested by the CHMP for EU marketing applications. Its GCP Inspectors Working Group publishes annual reports that grade findings by category.",
      url: "https://www.ema.europa.eu/en/human-regulatory-overview/research-development/compliance-research-development/good-clinical-practice",
      sources: [
        { id: "ema-gcp-iwg-annual-2024", title: "Annual Report of the GCP Inspectors Working Group 2024", url: "https://www.ema.europa.eu/en/documents/report/annual-report-good-clinical-practice-inspectors-working-group-2024_en.pdf", type: "Annual Report", publishedAt: "2026-01-20", period: "2024", scope: "CHMP-requested GCP inspections (major/critical only)",
          summary: "67 inspections: 42 investigator sites, 18 sponsors, 5 CROs and 2 BE labs. They produced 335 major or critical findings (11 critical). The top categories were General, Trial Management and Investigational Site.",
          findings: [
            { domain: "co", cat: "co-tmf", sev: "trend", text: "Essential documents: 41 findings (2 critical). TMF/ISF incomplete, no formal TMF QC, and monitors or inspectors could not access site systems holding essential documents.", ref: "ICH E6(R3) App. C" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Source documentation: 38 findings (2 critical). Source data were incomplete, inaccurate or not contemporaneous, did not match the CRF, and SDV was done on uncertified EMR copies.", ref: "ICH E6(R3) 2.12" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Monitoring: 35 major findings. Visits were inadequate or delayed, monitoring was not risk-based, SAE delays and deviations went undetected, and CRAs had no EHR access.", ref: "ICH E6(R3) 3.11.4" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "Data management: 27 findings (1 critical). No DMP or oversight, delays in entry and cleaning, data changes after the primary analysis, and Excel used for sensitive data.", ref: "ICH E6(R3) 4" },
            { domain: "dm", cat: "dm-csv", sev: "major", text: "Inadequate data migration and system validation.", ref: "ICH E6(R3) 4.3" },
            { domain: "dm", cat: "dm-audit", sev: "major", text: "Unblinded or pseudonymised data were sent without encryption, and version control and date/time stamping of datasets were inadequate.", ref: "ICH E6(R3) 4.2" },
            { domain: "co", cat: "co-qms", sev: "major", text: "SOPs: 22 major findings (missing, late or misaligned SOPs for critical processes), and no audits of vendors or sites.", ref: "ICH E6(R3) 3.10" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "Eligibility was not confirmed before randomisation, and deviations in IMP timing were not detected.", ref: "ICH E6(R3) 2.5" }
          ] },
        { id: "ema-gcp-iwg-annual-2023", title: "Annual Report of the GCP Inspectors Working Group 2023", url: "https://www.ema.europa.eu/en/documents/report/annual-report-good-clinical-practice-inspectors-working-group-2023_en.pdf", type: "Annual Report", publishedAt: "2024-12-09", period: "2023", scope: "CHMP-requested GCP inspections",
          summary: "67 inspections (46 investigator sites, 17 sponsors) produced 720 deficiencies: 36 critical, 336 major and 348 minor. The Computer System category had 46 findings, 5 of them critical.",
          findings: [
            { domain: "co", cat: "co-tmf", sev: "trend", text: "Essential documents was the most frequent sub-category (74). Limited eTMF access affected inspection readiness, documents were missing, and source data locations were undefined.", ref: "ICH E6(R2) 8" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "Data management: 48 findings (5 critical). A deficient query process put incorrect data in the CSR, and communication between sites and vendors on data handling was poor.", ref: "ICH E6(R2) 5.5" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Monitoring: 40 findings (4 critical). Monitors missed deviations, IMP reconciliation, informed consent issues, and AE or eligibility assessments not done by a physician.", ref: "ICH E6(R2) 5.18" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "Undelegated staff performed trial tasks, unauthorised persons had system access, and delegation was documented retrospectively.", ref: "ICH E6(R2) 4.1.5" },
            { domain: "co", cat: "co-qms", sev: "major", text: "No independent QA, no audits of vendors or sites, and missing SOPs for critical processes (29 SOP findings).", ref: "ICH E6(R2) 5.1, 5.19" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "The SAP was not finalised before unblinding, the final analysis had no QC, and the primary endpoint was missing from the final analysis.", ref: "ICH E9" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "Eligibility was not completed before IMP dosing, doses exceeded the protocol, and the sponsor granted eligibility waivers.", ref: "ICH E6(R2) 4.5" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Safety reporting: 20 findings. Deficient site processes led to under-reporting of AEs and SAEs.", ref: "ICH E6(R2) 4.11" }
          ] },
        { id: "ema-gcp-iwg-annual-2022", title: "Annual Report of the GCP Inspectors Working Group 2022", url: "https://www.ema.europa.eu/en/documents/annual-report/annual-report-good-clinical-practice-inspectors-working-group-2022_en.pdf", type: "Annual Report", publishedAt: "2024-01-11", period: "2022", scope: "CHMP-requested GCP inspections",
          summary: "36 inspections (26 routine, 10 triggered) produced 470 deficiencies: 17 critical, 260 major and 193 minor, about 13 per site.",
          findings: [
            { domain: "co", cat: "co-tmf", sev: "trend", text: "Essential documents was the largest sub-category (58). A hybrid TMF lacked emails, migration records and validation documents, and eTMF uploads were delayed.", ref: "ICH E6(R2) 8" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Vendor contracts did not give inspectors the right to inspect, and vendors were not audited or qualified before the trial started.", ref: "ICH E6(R2) 5.2" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Certified copies were produced by an unvalidated process, and EMR printouts had no reliable completeness check.", ref: "ICH E6(R2) 1.63, 4.9" },
            { domain: "co", cat: "co-ip", sev: "major", text: "Accidental unmasking: unblinding information appeared in SUSAR queries sent to blinded sponsor staff and was forwarded to sites.", ref: "ICH E6(R2) 5.5.3(g)" },
            { domain: "dm", cat: "dm-lock", sev: "major", text: "Adjudicated events were not uploaded before the final lock, so the database had to be defrozen, with very limited documentation.", ref: "ICH E6(R2) 5.5" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "Insufficient QC of deviation listings and programming put participants wrongly in the per-protocol set; post hoc analyses had no documented rationale.", ref: "ICH E9" },
            { domain: "dm", cat: "dm-recon", sev: "major", text: "Insufficient evidence of how reconciliations were performed for several data transfers.", ref: "ICH E6(R2) 5.5" },
            { domain: "co", cat: "co-safety", sev: "major", text: "SAEs were not reported within 24 hours, a life-threatening AE was classed as non-serious, and AEs in medical records were missing from the eCRF.", ref: "ICH E6(R2) 4.11" }
          ] },
        { id: "ema-gcp-iwg-annual-2021", title: "Annual Report of the GCP Inspectors Working Group 2021", url: "https://www.ema.europa.eu/en/documents/report/annual-report-good-clinical-practice-inspectors-working-group-2021_en.pdf", type: "Annual Report", publishedAt: "2022-11-21", period: "2021", scope: "CHMP-requested GCP inspections (triggered only, COVID-19)",
          summary: "27 triggered inspections produced 286 deficiencies: 24 critical, 152 major and 110 minor. EMA noted an increase in computer-system findings (33 findings, 4 critical).",
          findings: [
            { domain: "dm", cat: "dm-csv", sev: "trend", text: "Computer System became the third most cited category. Systems had no risk assessment, there was no validation procedure, and test documentation was missing.", ref: "ICH E6(R2) 5.5.3" },
            { domain: "dm", cat: "dm-audit", sev: "critical", text: "User access was never reviewed, audit trails could not reconstruct events, and remote access was unencrypted. Critical patches were not deployed.", ref: "ICH E6(R2) 5.5.3(c)-(e)" },
            { domain: "dm", cat: "dm-recon", sev: "major", text: "No robust reconciliation of the clinical and safety databases before lock, and PIs did not review or sign off eCRF data.", ref: "ICH E6(R2) 5.5" },
            { domain: "co", cat: "co-tmf", sev: "trend", text: "Essential documents: 40 findings (3 critical). Documents were missing or filed late, and could be deleted without QC.", ref: "ICH E6(R2) 8" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Persistent SDV backlog, insufficient monitoring resources, and no vendor prequalification or oversight.", ref: "ICH E6(R2) 5.2, 5.18" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "The eCRF allowed randomisation before eligibility was confirmed, a trial-wide eligibility waiver was applied, and serious breaches were found late.", ref: "ICH E6(R2) 4.5, 5.20" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "The interim analysis supporting the MAA used incomplete data, and programming was not final at unblinding.", ref: "ICH E9" }
          ] },
        { id: "ema-gcp-iwg-annual-2020", title: "Annual Report of the GCP Inspectors Working Group 2020", url: "https://www.ema.europa.eu/en/documents/report/annual-report-good-clinical-practice-inspectors-working-group-2020_en.pdf", type: "Annual Report", publishedAt: "2022-05-20", period: "2020", scope: "CHMP-requested GCP inspections",
          summary: "34 inspections produced 363 deficiencies (16 critical). The most cited category was Trial Management (Sponsor), with 168 findings, 9 of them critical.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Trial Management (Sponsor) was the most cited category (168). Audit gaps included no audits of key vendors and a weak vendor evaluation process.", ref: "ICH E6(R2) 5.2, 5.19" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Monitoring did not identify and fix deficiencies, non-compliance was not escalated, and review of monitoring reports was undocumented.", ref: "ICH E6(R2) 5.18" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "Data management: 53 findings. Audit trails in archived PDF CRFs were ambiguous, an eCRF time-setting error produced wrong SAE reports, and completion guidelines were finalised after the first subject.", ref: "ICH E6(R2) 5.5.3" },
            { domain: "co", cat: "co-tmf", sev: "trend", text: "Document control: 53 findings (4 critical). Documents were missing from the TMF, eTMF naming did not identify documents, and the ISF had gaps.", ref: "ICH E6(R2) 8" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "An EMR system was not an acceptable source, copies were illegible, and there was no source data location list at trial start.", ref: "ICH E6(R2) 4.9" },
            { domain: "co", cat: "co-ip", sev: "major", text: "No site record that dispensed IMP matched the IWRS allocation, no IWRS audit trail was provided at trial end, and accountability logs were incomplete.", ref: "ICH E6(R2) 4.6, 5.14" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "The CSR was inconsistent on deviations and exclusions from analysis, and one CSR left out a site's GCP non-compliance.", ref: "ICH E3" }
          ] },
        { id: "ema-notice-csv-2020", title: "Notice to sponsors on validation and qualification of computerised systems used in clinical trials (EMA/INS/GCP/467532/2019)", url: "https://www.ema.europa.eu/en/documents/regulatory-procedural-guideline/notice-sponsors-validation-qualification-computerised-systems-used-clinical-trials_en.pdf", type: "Regulatory Notice", publishedAt: "2020-04-15", period: "2019–2020", scope: "Sponsors using eCRF, ePRO, IRT and safety databases",
          summary: "Issued 'given recent inspection findings'. It warns that undocumented validation may lead inspectors to recommend that the data not be used in an MAA.",
          findings: [
            { domain: "dm", cat: "dm-csv", sev: "trend", text: "Sponsors could not provide adequate qualification and validation documentation for computerised data collection tools.", ref: "ICH E6(R2) 5.5.3" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Vendor contracts gave no access to requirement specifications, allowed no pre-qualification audits and gave inspectors no access.", ref: "ICH E6(R2) 5.2" },
            { domain: "dm", cat: "dm-csv", sev: "trend", text: "Sponsors relied on vendor documentation without assessing it or validating trial-specific configurations.", ref: "EMA GCP Q&A" }
          ] }
      ]
    },

    {
      id: "mhra", name: "MHRA — UK Medicines and Healthcare products Regulatory Agency", short: "MHRA", logoText: "MHRA", domain: "gov.uk",
      category: "regulator",
      intro: "The UK GCP Inspectorate publishes inspection metrics with detailed examples of critical findings. It also runs an inspectorate blog on recurring findings and issues enforcement notices.",
      url: "https://www.gov.uk/government/publications/good-clinical-practice-inspection-metrics",
      sources: [
        { id: "mhra-gcp-metrics-2019-2020", title: "GCP Inspections Metrics Report: 1 April 2019 to 31 March 2020", url: "https://assets.publishing.service.gov.uk/media/64357bfe89f19f00133cfb40/GCP_inspection_metrics_2019-2020.pdf", type: "Metrics Report", publishedAt: "2023-03-29", period: "Apr 2019 – Mar 2020", scope: "UK MHRA GCP inspections (sponsors, CROs, sites, Phase 1 units)",
          summary: "36 GCP inspections. 4 of 7 commercial sponsors and 1 of 5 CROs had critical findings. This is the latest MHRA GCP metrics report and contains detailed examples of critical findings.",
          findings: [
            { domain: "co", cat: "co-safety", sev: "critical", text: "All four commercial-sponsor critical findings were pharmacovigilance: unapproved RSI, a non-conservative approach to causality, unreported SUSARs and ineffective CAPA.", ref: "SI 2004/1031 Regs 33, 35" },
            { domain: "dm", cat: "dm-lock", sev: "critical", text: "CRO: database locks happened after unblinded data were released, page freezing was undocumented, and hard-coding of primary endpoint data was uncontrolled.", ref: "SI 2004/1031 Sch 1 Pt 2" },
            { domain: "dm", cat: "dm-audit", sev: "critical", text: "The eCRF audit trail could not be reviewed in a usable format, the IRT audit trail was lost when the vendor decommissioned the system, and CRO staff had undelegated edit rights.", ref: "SI 2004/1031 Sch 1 Pt 2 (9)" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Primary endpoint data were queried after unblinding, and repeated undocumented statistical runs changed the primary p-value.", ref: "SI 2004/1031 Reg 28" },
            { domain: "co", cat: "co-ip", sev: "critical", text: "IMP blister wallets were unlabelled for dose and timing, and the dose given could not be verified from IRT or shipping records.", ref: "SI 2004/1031 Regs 29, 30" },
            { domain: "dm", cat: "dm-lab", sev: "critical", text: "Samples were analysed by an unvalidated method, and extra analyses were run without protocol approval or consent.", ref: "SI 2004/1031 Reg 28" },
            { domain: "co", cat: "co-sponsor", sev: "critical", text: "A UK sponsor had no oversight of a trial run by a non-EU sponsor and missed chances to notify a serious breach.", ref: "SI 2004/1031 Regs 28, 29" },
            { domain: "co", cat: "co-oversight", sev: "critical", text: "Phase 1: PK data from failed analytical runs reached the dose-escalation committee without the PI being informed.", ref: "SI 2004/1031 Sch 1 Pt 2" }
          ] },
        { id: "mhra-blog-esystem-ecrf-2021", title: "Is your eSystem actually an eCRF (electronic case report form)?", url: "https://mhrainspectorate.blog.gov.uk/2021/05/11/is-your-esystem-actually-an-ecrf-electronic-case-report-form/", type: "Inspectorate Blog", publishedAt: "2021-05-11", period: "2020–2021", scope: "Sponsors, CTUs and vendors (IRT, ePRO, eCRF)",
          summary: "IRT, ePRO and other eSystems were acting as eCRFs without eCRF controls such as audit trails, investigator control and query processes.",
          findings: [
            { domain: "dm", cat: "dm-crf", sev: "critical", text: "A CTU database was turned into an eCRF without a risk assessment or validation, and sponsor staff changed investigator data without PI approval.", ref: "ICH E6(R2) 4.9.3, 5.5.3" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Clinical data entered into IRT (sometimes the only source) were integrated with no audit trail or investigator control.", ref: "SI 2004/1031 Sch 1 Pt 2 (9)" },
            { domain: "dm", cat: "dm-recon", sev: "trend", text: "IRT values were changed in the eCRF after SDV but not in IRT, so the two datasets no longer matched.", ref: "ICH E6(R2) 5.5.3" },
            { domain: "dm", cat: "dm-audit", sev: "trend", text: "Data-change requests in IRT and ePRO bypassed the investigator and needed only sponsor approval.", ref: "ICH E6(R2) 4.9.3" }
          ] },
        { id: "mhra-blog-rsi-part3-2021", title: "Reference Safety Information (RSI) for Clinical Trials — Part III", url: "https://mhrainspectorate.blog.gov.uk/2021/02/05/reference-safety-information-rsi-for-clinical-trials-part-iii/", type: "Inspectorate Blog", publishedAt: "2021-02-05", period: "2019–2021", scope: "Sponsors (clinical trial pharmacovigilance)",
          summary: "MHRA had raised critical RSI findings at 8 organisations since January 2019, and the blog sets out the common non-compliances.",
          findings: [
            { domain: "co", cat: "co-safety", sev: "trend", text: "8 organisations had critical RSI findings, including unreported SUSARs caused by incorrect RSI use.", ref: "CT-3; CTFG RSI Q&A" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "RSI applied from the case receipt date instead of the event onset date, and comparator IMPs excluded, so comparator SUSARs were under-reported.", ref: "CT-3 (55)" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Fatal and life-threatening SARs were treated as expected, including through auto-labelling.", ref: "CTFG RSI Q&A" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "RSI changes were put in place before the substantial amendment was approved.", ref: "SI 2004/1031 Reg 29" }
          ] },
        { id: "mhra-celixir-infringement-2024", title: "Infringement Notice: Cell Therapy Ltd (trading as Celixir)", url: "https://assets.publishing.service.gov.uk/media/669e263afc8e12ac3edb00de/Celixir_infringement_notice.pdf", type: "Enforcement Notice", publishedAt: "2024-07-17", period: "Inspections Jul & Sep 2020", scope: "Sponsor and investigator site",
          summary: "Inspections found 9 critical and 3 major findings, and MHRA served an infringement notice under Regulation 48.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "critical", text: "The quality system was inadequate, staff lacked trial experience, and there were no procedures for serious breaches or vendor oversight.", ref: "SI 2004/1031 Reg 28" },
            { domain: "co", cat: "co-ip", sev: "critical", text: "IMP was labelled with a 12-month shelf life against the 3 or 9 months approved, and had technically expired at dosing.", ref: "SI 2004/1031 Reg 29" },
            { domain: "co", cat: "co-tmf", sev: "critical", text: "There was no sponsor TMF, and the CRO eTMF lacked many essential documents, so trial conduct could not be reconstructed.", ref: "SI 2004/1031 Reg 31A" },
            { domain: "co", cat: "co-ethics", sev: "critical", text: "A participant was dosed after MHRA issued a notice of non-acceptance of an amendment.", ref: "SI 2004/1031 Regs 12, 29" }
          ] },
        { id: "mhra-gcp-hot-topics-2024", title: "MHRA GCP Hot Topics (Lead Senior GCP Inspector presentation)", url: "https://icr-global.org/wp-content/uploads/2024/04/3-Hot-Topics-in-Inspections-Andy-Fisher-MHRA-19Apr2024.pdf", type: "Regulator presentation", publishedAt: "2024-04-19", period: "2022–2024", scope: "UK GCP inspections", flag: "Secondary host", flagNote: "MHRA inspector slides hosted on the ICR website.",
          summary: "Notable recent findings and computerised-system challenges: user management, validation, EHR access, eTMF and audit trails.",
          findings: [
            { domain: "co", cat: "co-safety", sev: "trend", text: "Unapproved RSI used, leading to unreported SUSARs and DSUR errors.", ref: "CTFG RSI Q&A" },
            { domain: "co", cat: "co-qms", sev: "trend", text: "Poor change management of protocol amendments, and trials not risk-assessed or re-assessed during conduct.", ref: "ICH E6(R2) 5.0, 5.1" },
            { domain: "co", cat: "co-consent", sev: "trend", text: "Patients in trials run during the pandemic were not appropriately consented.", ref: "ICH E6(R2) 4.8" },
            { domain: "dm", cat: "dm-audit", sev: "trend", text: "A CRO collected identifiable patient information in a decentralised trial (confidentiality breach).", ref: "SI 2004/1031" },
            { domain: "co", cat: "co-oversight", sev: "trend", text: "PI medical oversight gaps: eligibility decisions not documented and safety information not overseen.", ref: "ICH E6(R2) 4.3" }
          ] }
      ]
    },

    {
      id: "nmpa", name: "NMPA / CFDI — China National Medical Products Administration (Center for Food and Drug Inspection)", short: "NMPA / CFDI", logoText: "NMPA", domain: "nmpa.gov.cn",
      category: "regulator",
      intro: "CFDI runs clinical trial registration inspections (药物临床试验注册核查) and site supervisory inspections. Its annual reports and NMPA notices list the common problems found.",
      url: "https://www.cfdi.org.cn/",
      sources: [
        { id: "cfdi-annual-2022", title: "CFDI Drug Inspection Annual Report 2022 (国家药监局核查中心2022年度药品检查工作报告)", url: "https://www.cpi.ac.cn/sjcx/yjbg/202310/t20231011_388978.html", type: "Annual Report", publishedAt: "2023-10-07", period: "2022", scope: "Clinical trial registration inspections (new drugs & generics)", flag: "Re-post", flagNote: "Full text re-posted by the China Pharmaceutical Information Center (cpi.ac.cn).",
          summary: "341 clinical trial registration inspections were completed. New drugs: 2 failed, 60 had major deficiencies, and 23 institutions were ordered to rectify. Generics: 34 tasks were flagged for review attention.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "New-drug inspections: 2 failed (不通过), 60 had major deficiencies, and 22 trial sites plus 1 central lab were ordered to rectify.", ref: "" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "New drugs: the main problems were completeness and accuracy of source data records.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Recording of safety events (new drugs), and handling and reporting of safety information (generics).", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Protocol compliance, subject screening and enrolment, and protocol execution.", ref: "" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Drug administration records and execution (用药记录和执行).", ref: "" },
            { domain: "co", cat: "co-ethics", sev: "trend", text: "Ethics committee operation and management.", ref: "" },
            { domain: "dm", cat: "dm-lab", sev: "trend", text: "BE: bioanalytical method validation, sample analysis and reference-standard management; 3 labs were ordered to rectify.", ref: "" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "For-cause inspection: the applicant could not provide original records or electronic data, and the submitted chromatograms were untraceable.", ref: "" }
          ] },
        { id: "cfdi-annual-2021", title: "CFDI Drug Inspection Annual Report 2021 (国家药监局核查中心2021年度药品检查工作报告)", url: "https://www.cfdi.org.cn/resource/news/14698.html", type: "Annual Report", publishedAt: "2022-06-26", period: "2021", scope: "Drug registration inspections incl. clinical trial data",
          summary: "1,214 registration inspections were completed (1,066 clinical trial or marketing applications), and 10 failed. The report lists the main problems in clinical data.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "10 of 1,214 registration inspection tasks failed (不通过).", ref: "" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Original medical records (原始病历) were not detailed or were incomplete; this was listed first among the main problems. Concomitant medication records were also incomplete.", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Protocol deviations were not reported.", ref: "" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "Rating scales and questionnaires were completed and corrected improperly.", ref: "" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Investigational product (试验用药) records were inaccurate.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Safety information was recorded incompletely.", ref: "" }
          ] },
        { id: "nmpa-reg-inspection-outcomes-2024", title: "2024 clinical trial registration-inspection outcomes by site (2024年药物临床试验注册核查监督检查结果及处理情况)", url: "http://www.ainusen.com/nd.jsp?id=400", type: "Inspection outcome compilation", publishedAt: "2025-02-25", period: "Nov 2023 – Apr 2024", scope: "Chinese clinical trial sites (BE, Phase I, oncology)", flag: "Secondary source", flagNote: "A CRO's compilation of results disclosed on the NMPA trial-site filing platform.",
          summary: "Site-level results mostly read 'pass, but needs focused review attention'. Provinces had to supervise rectification before the site could start new trials, and one site received an administrative warning.",
          findings: [
            { domain: "co", cat: "co-qms", sev: "critical", text: "One site (Anhui Jimin Cancer Hospital) was investigated and received an administrative 'warning' penalty.", ref: "" },
            { domain: "co", cat: "co-ethics", sev: "major", text: "The ethics committee did not review amendments or violations, or review SUSARs as GCP requires.", ref: "China GCP (2020) Art. 12" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "eCRF data did not match the original outpatient EMR.", ref: "" },
            { domain: "dm", cat: "dm-audit", sev: "major", text: "The outpatient EMR system was not used as GCP requires.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "major", text: "SAE reports were not submitted to the sponsor as GCP requires.", ref: "China GCP (2020) Art. 26" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "Investigators did not follow the protocol; sites were given 6 months to rectify before starting new trials.", ref: "" }
          ] },
        { id: "hunan-2024-joint-inspections", title: "Common problems in on-site clinical trial inspections — Hunan Provincial Drug Inspection Center, 2024 (药物临床试验现场核查常见问题分析及建议)", url: "https://www.sohu.com/a/923340290_121123705", type: "Journal article", publishedAt: "2025", period: "2024", scope: "CFDI-commissioned joint inspections at 21 Hunan sites", flag: "Reprint", flagNote: "Journal article by a provincial inspection centre, reprinted on Sohu.",
          summary: "39 site inspections found 246 problems. The top areas were data recording and reporting, safety information, and screening and protocol execution.",
          findings: [
            { domain: "dm", cat: "dm-source", sev: "major", text: "The year's only major deficiency: source data did not match EDC for all 4 sampled subjects, and the conclusion was upgraded to 'needs focused review attention'.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "AE/SAE omissions in CRFs, weak causality assessment, and late SAE, death or SUSAR reports.", ref: "" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "CRF omissions and corrections without reasons; inconsistencies between source, CRF, database and submission.", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Unrecorded deviations, and subjects enrolled against eligibility criteria or without evidence of eligibility.", ref: "" },
            { domain: "co", cat: "co-oversight", sev: "trend", text: "PIs with too many projects delegated all oversight, and some PIs only signed records.", ref: "" },
            { domain: "dm", cat: "dm-csv", sev: "trend", text: "Hospital HIS/LIS/PACS systems were not validated or not used for trials, so external history was untraceable.", ref: "" }
          ] },
        { id: "zhongshan-inspection-reports-2016-2023", title: "Quality improvement and risk control based on on-site inspection reports — Zhongshan Hospital, Fudan University (基于现场核查报告探究药物临床试验质量提升与风险控制策略)", url: "https://lczz.cbpt.cnki.net/portal/journal/portal/client/paper/b1eaf94f70b7ee838ea1ad246c73a24d", type: "Journal article", publishedAt: "2024-12-25", period: "2016–2023", scope: "27 regulatory inspection reports at one major Chinese site",
          summary: "A Pareto analysis of 104 problems found that four areas account for 75% of findings.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Subject screening, enrolment and protocol execution was the largest category (32.7%).", ref: "" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Investigational product management was the second risk factor (about 17%).", ref: "" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Safety information processing and reporting (about 14%).", ref: "" },
            { domain: "dm", cat: "dm-lab", sev: "trend", text: "Biological sample management and central laboratory (about 11%).", ref: "" }
          ] },
        { id: "nmpa-ivd-trial-2024-15", title: "NMPA Notice 2024 No.15 — device clinical trial spot-check, Guangdong Hexin IVD kit (国家药监局关于医疗器械临床试验监督抽查情况的通告)", url: "https://yjj.sh.gov.cn/ylqx/20240417/d4f7723936cf47e79701b5c814962936.html", type: "Enforcement notice", publishedAt: "2024-04-15", period: "2024", scope: "IVD (device) clinical trial supporting registration",
          summary: "Authenticity problems led to refusal of registration and a 1-year ban on resubmission.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "For all 318 samples, test times in the data summary did not match the instrument records.", ref: "" },
            { domain: "dm", cat: "dm-report", sev: "critical", text: "Results in the clinical study report did not match the source; registration was refused.", ref: "" }
          ] }
      ]
    },

    {
      id: "pmda", name: "PMDA / MHLW — Japan Pharmaceuticals and Medical Devices Agency", short: "PMDA", logoText: "PMDA", domain: "pmda.go.jp",
      category: "regulator",
      intro: "The Office of Non-clinical and Clinical Compliance runs GCP on-site and document-based conformity inspections for every new drug application and publishes yearly findings.",
      url: "https://www.pmda.go.jp/review-services/inspections/gcp/0001.html",
      sources: [
        { id: "pmda-gcp-fy2024", title: "GCP on-site and document-based conformity inspection results FY2024 (令和6年度 GCP実地調査及び適合性書面調査 調査実績)", url: "https://www.pmda.go.jp/files/000278604.pdf", type: "Annual inspection metrics", publishedAt: "2026-01-16", period: "FY2024 (Apr 2024 – Mar 2025)", scope: "New-drug GCP inspections (sponsors and sites)",
          summary: "127 inspections at 130 sites. All 112 domestic sponsor results were compliant (5 with findings).",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "major", text: "A monitoring report falsely stated that the revised ICF draft had been given to the investigator.", ref: "J-GCP Art. 21-22" },
            { domain: "dm", cat: "dm-csv", sev: "major", text: "Inadequate SOPs led to an IRT defect, and some subjects did not receive the protocol dose.", ref: "J-GCP Art. 4" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "All 4 site findings were AEs, medical history or concomitant medications missing from CRFs, which monitoring also missed.", ref: "J-GCP Art. 47, 21" },
            { domain: "co", cat: "co-qms", sev: "minor", text: "The sponsor had not prepared an audit plan or audit procedures.", ref: "J-GCP Art. 23" },
            { domain: "dm", cat: "dm-audit", sev: "major", text: "The EDC was set up so that the investigator could not review some CRFs entered by site staff.", ref: "" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "The CSR used data the investigator had not reviewed, and weak QC left scattered errors in submission documents.", ref: "" }
          ] },
        { id: "pmda-gcp-fy2023", title: "GCP on-site and document-based conformity inspection results FY2023 (令和5年度 調査実績)", url: "https://www.pmda.go.jp/files/000273412.pdf", type: "Annual inspection metrics", publishedAt: "2025", period: "FY2023 (Apr 2023 – Mar 2024)", scope: "New-drug GCP inspections (sponsors and sites)",
          summary: "Of 100 domestic sponsor results, 93 were compliant without findings, 5 with findings and 2 conditionally compliant. The report includes improvement items from site management organization (SMO) fraud.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "An SMO engaged in organised misconduct: CRFs were prepared from fabricated subject diaries.", ref: "J-GCP Art. 41, 46, 47" },
            { domain: "dm", cat: "dm-audit", sev: "critical", text: "A CRC impersonated the investigator in the system, and an unqualified, disguised staff member performed all examinations.", ref: "J-GCP Art. 47" },
            { domain: "co", cat: "co-consent", sev: "critical", text: "The CRC gave the consent explanations, while the PI signed as if he had given them himself.", ref: "J-GCP Art. 50-54" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Site system findings: outsourcing contracts with couriers, vendors and imaging sites lacked required GCP clauses (8 of 12).", ref: "J-GCP Art. 39-2" },
            { domain: "co", cat: "co-consent", sev: "trend", text: "Most frequent individual-case finding: consent not re-obtained with a revised ICF (6 of 17).", ref: "J-GCP Art. 54" },
            { domain: "co", cat: "co-safety", sev: "major", text: "Sponsor findings: late transmission of unknown serious ADRs, and monitoring missed AEs absent from CRFs.", ref: "J-GCP Art. 20, 21" }
          ] },
        { id: "pmda-gcp-fy2022", title: "GCP on-site and document-based conformity inspection results FY2022 (令和4年度 調査実績)", url: "https://www.pmda.go.jp/files/000266338.pdf", type: "Annual inspection metrics", publishedAt: "2024-01-19", period: "FY2022 (Apr 2022 – Mar 2023)", scope: "New-drug GCP inspections; document-based inspections",
          summary: "117 inspections; all 108 domestic sponsor results were compliant. Document-based inspections gave 4 conditional compliances, involving blinding and records.",
          findings: [
            { domain: "co", cat: "co-consent", sev: "trend", text: "Most frequent individual-case finding (8 of 15): no re-consent with a revised ICF, and the explaining investigator did not sign.", ref: "J-GCP Art. 50-54" },
            { domain: "dm", cat: "dm-lock", sev: "critical", text: "Conditional compliance: the sponsor did not monitor blinding status and analysed data from cases where the blind was compromised.", ref: "" },
            { domain: "dm", cat: "dm-csv", sev: "critical", text: "Conditional compliance: the EDC was misconfigured, so the blind could not be considered maintained.", ref: "" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Parts of the source records were not kept, including physician review of labs and records for the primary endpoint.", ref: "J-GCP Art. 41" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "A subject meeting an exclusion criterion was enrolled and dosed, and a stratification factor was entered wrongly.", ref: "J-GCP Art. 44, 46" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Sites had no compliant written contracts with IP delivery vendors.", ref: "J-GCP Art. 39-2" }
          ] },
        { id: "pmda-gcp-fy2021", title: "Current status and points to note in GCP on-site inspections — FY2021 cases (医薬品のGCP実地調査の現状と留意点)", url: "https://www.pmda.go.jp/files/000250378.pdf", type: "Inspection findings presentation", publishedAt: "2023", period: "FY2021 (Apr 2021 – Mar 2022)", scope: "110 domestic products, 235 sites",
          summary: "Of 110 domestic sponsor results, 100 were compliant without findings. Most site findings were protocol deviations and IP management.",
          findings: [
            { domain: "co", cat: "co-ip", sev: "major", text: "Wrong kit numbers, expired IP and wrong doses were given, and IP stored out of range was used without asking the sponsor.", ref: "J-GCP Art. 39" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Protocol deviations dominated individual-case findings (25 of 28): dosing rules, prohibited medications, required tests.", ref: "J-GCP Art. 46" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "Ineligible subjects were enrolled; investigators often interpreted the eligibility criteria themselves.", ref: "J-GCP Art. 44" },
            { domain: "co", cat: "co-ethics", sev: "major", text: "The IRB did not perform annual continuing review of trials lasting more than a year.", ref: "J-GCP Art. 27-34" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Most frequent sponsor finding: late annual safety reports and late transmission of unknown serious ADRs.", ref: "J-GCP Art. 20" }
          ] },
        { id: "pmda-gcp-fy2019", title: "Current status and points to note in GCP on-site inspections — FY2019 results (医薬品のGCP実地調査の現状と留意点)", url: "https://www.pmda.go.jp/files/000239711.pdf", type: "Inspection metrics presentation", publishedAt: "2021", period: "FY2019 (Apr 2019 – Mar 2020)", scope: "Domestic new-drug GCP inspections",
          summary: "124 results: 104 compliant without findings, 18 compliant with findings and 2 conditionally compliant.",
          findings: [
            { domain: "co", cat: "co-safety", sev: "trend", text: "Most frequent sponsor finding (15 of 34): late safety reports and late transmission of unknown serious ADRs.", ref: "J-GCP Art. 20" },
            { domain: "co", cat: "co-ip", sev: "major", text: "The comparator was not supplied as IP (commercial stock was used) and IP records were not kept.", ref: "J-GCP Art. 16-17" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Monitoring did not detect eligibility violations, or took no action on them.", ref: "J-GCP Art. 21" },
            { domain: "co", cat: "co-qms", sev: "major", text: "2 applications were conditionally compliant, so non-compliant subject data had to be removed.", ref: "" }
          ] },
        { id: "mhlw-medipharma-2023", title: "MHLW: GCP violations by SMO Medipharma Co. and impact on approved products (株式会社メディファーマによるGCP違反の概要)", url: "https://www.mhlw.go.jp/content/11121000/001256136.pdf", type: "Regulatory enforcement summary", publishedAt: "2023-10-17", period: "2023", scope: "For-cause unannounced inspection of an SMO and site",
          summary: "A whistleblower report triggered inspections that confirmed GCP violations. The SMO was involved in 116 drug trials and 25 approved products; MHLW concluded the efficacy and safety conclusions were unaffected.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Trial data, including IP dosing and blood-sampling times, were falsified in at least 7 studies.", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "critical", text: "Spirometry was deliberately manipulated to enrol ineligible subjects.", ref: "" },
            { domain: "dm", cat: "dm-audit", sev: "critical", text: "Physician, staff and CRC user IDs and passwords, including those for electronic signatures, were shared within the SMO.", ref: "" },
            { domain: "co", cat: "co-qms", sev: "critical", text: "SMO employees completed required trainings on behalf of physicians and staff.", ref: "" },
            { domain: "co", cat: "co-ip", sev: "critical", text: "IP temperature excursions were concealed and the temperature records falsified.", ref: "" }
          ] },
        { id: "pmda-smo-fraud-note-2024", title: "PMDA: Points to consider before using cases involving a fraudulent SMO in an application (不正を行ったSMOが関与した症例…留意点)", url: "https://www.pmda.go.jp/files/000267863.pdf", type: "Regulatory notice", publishedAt: "2024-04-09", period: "2024", scope: "Applicants using data from SMO-supported sites",
          summary: "Applicants must show the reliability of affected cases before including them in a submission.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Sponsors must assess CRC involvement in enrolment, consent, endpoint recording and IP management at affected sites.", ref: "" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Sponsors must verify that all source documents were retained and are consistent before using the data.", ref: "" }
          ] }
      ]
    },

    {
      id: "health-canada", name: "Health Canada — Clinical Trial Compliance Program", short: "Health Canada", logoText: "HC", domain: "canada.ca",
      category: "regulator",
      intro: "Inspects qualified investigator sites, sponsors and CROs under Division 5 of the Food and Drug Regulations, and publishes report cards in its Drug and Health Products Inspections Database.",
      url: "https://www.drug-inspections.canada.ca/gcp/index-en.html",
      sources: [
        { id: "hc-dhpid-gcp-aggregate-2020-2026", title: "Health Canada GCP Inspection Report Cards 2020–2026 — aggregated observation frequency", url: "https://www.drug-inspections.canada.ca/gcp/index-en.html", type: "Inspection database (aggregated)", publishedAt: "2026-10-19", period: "Inspections started Jan 2020 – Oct 2026", scope: "Qualified investigator sites (sponsor-attributed)", flag: "Hub-derived tally", flagNote: "Counted on 19 Oct 2026 from Health Canada's public report cards; this is not a Health Canada publication.",
          summary: "165 GCP inspections started since 2020, 10 of them non-compliant. Their report cards contain 1,256 observations: 72% under C.05.010 and 26% under C.05.012 (records).",
          findings: [
            { domain: "co", cat: "co-qms", sev: "trend", text: "The most frequent observation (261, 21%) was that the sponsor did not implement systems and procedures to ensure trial quality.", ref: "C.05.010(c)" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Second most frequent (177, 14%): trial records had errors or missing information that prevented accurate reporting and verification.", ref: "C.05.012" },
            { domain: "co", cat: "co-oversight", sev: "trend", text: "Medical decisions were not under QI supervision (63), tasks were not delegated properly (56), and staff lacked training (42).", ref: "C.05.010(f),(g)" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "No systems for documenting and reporting deviations (55), and the trial was not conducted per protocol (32).", ref: "C.05.010(b),(c)" },
            { domain: "co", cat: "co-consent", sev: "trend", text: "No systems to ensure participants were properly consented (43).", ref: "C.05.010(h)" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "No systems for adequate monitoring (40), and study information was not communicated in time (58).", ref: "C.05.010(c)" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "Data transcribed into case reports were inaccurate or incomplete (35).", ref: "C.05.012" },
            { domain: "dm", cat: "dm-csv", sev: "trend", text: "Electronic systems were not validated (16), and electronic data did not meet completeness and reliability requirements (11).", ref: "C.05.010(c); C.05.012" }
          ] },
        { id: "hc-irc-regeneron-2024", title: "Health Canada GCP Inspection Report Card — Regeneron (Odronextamab Phase 2), Non-compliant", url: "https://www.drug-inspections.canada.ca/gcp/fullReportCard-en.html?gcpid=82320178-78d9-445c-bb2f-f99dd1ba47a8&lang=en", type: "Inspection Report Card", publishedAt: "2024", period: "Inspection Aug 2024", scope: "QI site (Ontario)", sponsor: "Regeneron",
          summary: "12 observations led to a non-compliant rating and a notice of intent to suspend the site authorization.",
          findings: [
            { domain: "co", cat: "co-oversight", sev: "major", text: "Medical care and decisions were not under QI supervision (3 observations), and some staff lacked training or experience.", ref: "C.05.010" },
            { domain: "co", cat: "co-safety", sev: "major", text: "No systems to communicate study information to the right personnel in time.", ref: "C.05.010" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "No systems for adequate monitoring.", ref: "C.05.010" },
            { domain: "co", cat: "co-consent", sev: "major", text: "No systems to ensure participants were properly consented.", ref: "C.05.010" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Records had errors or missing information, and delegation records were incomplete.", ref: "C.05.012" },
            { domain: "dm", cat: "dm-lock", sev: "major", text: "No systems to ensure records were maintained and archived.", ref: "C.05.010" }
          ] },
        { id: "hc-irc-anthos-2024", title: "Health Canada GCP Inspection Report Card — Anthos Therapeutics (Abelacimab Phase 3), Non-compliant", url: "https://www.drug-inspections.canada.ca/gcp/fullReportCard-en.html?gcpid=2c434d4d-2ddc-434d-8959-812cbcd8572e&lang=en", type: "Inspection Report Card", publishedAt: "2024", period: "Inspection Oct 2024", scope: "QI site (Alberta)", sponsor: "Anthos Therapeutics",
          summary: "6 observations led to a non-compliant rating. Corrective actions were accepted and the authorization was not suspended.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "major", text: "The trial was not conducted according to the protocol.", ref: "C.05.010" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Records did not fully show that the trial was conducted per GCP.", ref: "C.05.012" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "Medical care and decisions were not under QI supervision.", ref: "C.05.010" },
            { domain: "co", cat: "co-ip", sev: "major", text: "No systems to ensure the drug was handled and stored properly.", ref: "C.05.010" }
          ] },
        { id: "hc-irc-atma-2023", title: "Health Canada GCP Inspection Report Card — ATMA Journey Centres (Psilocybin Phase 1), Non-compliant", url: "https://www.drug-inspections.canada.ca/gcp/fullReportCard-en.html?gcpid=60976e61-ba02-429b-9277-132d6420990d&lang=en", type: "Inspection Report Card", publishedAt: "2023", period: "Inspection Apr 2023", scope: "Sponsor / QI site",
          summary: "16 observations led to a non-compliant rating. Suspension was proposed, then withdrawn after corrective action.",
          findings: [
            { domain: "co", cat: "co-oversight", sev: "major", text: "No QI supervision of medical decisions, improper delegation, and untrained staff.", ref: "C.05.010" },
            { domain: "co", cat: "co-safety", sev: "major", text: "No systems to document and report adverse events.", ref: "C.05.010" },
            { domain: "co", cat: "co-ip", sev: "major", text: "No control of drug inventory, and the drug was not stored to GMP standards.", ref: "C.05.010" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Records had errors or missing information that prevented verification.", ref: "C.05.012" }
          ] },
        { id: "hc-irc-remedy-2022", title: "Health Canada GCP Inspection Report Card — Remedy (MDMA Phase 2), Non-compliant", url: "https://www.drug-inspections.canada.ca/gcp/fullReportCard-en.html?gcpid=5ade3e60-a0e0-452c-b83e-8a3dc120aad0&lang=en", type: "Inspection Report Card", publishedAt: "2022", period: "Inspection Jun 2022", scope: "Sponsor / QI site (Ontario)",
          summary: "13 observations led to a non-compliant rating. The authorization was later reinstated.",
          findings: [
            { domain: "co", cat: "co-qms", sev: "major", text: "No systems to ensure quality, train staff or calibrate equipment.", ref: "C.05.010" },
            { domain: "dm", cat: "dm-csv", sev: "major", text: "No procedures to ensure electronic systems were validated.", ref: "C.05.010" },
            { domain: "co", cat: "co-consent", sev: "major", text: "Written consent was not obtained before participation in the trial or the amended trial.", ref: "C.05.010" },
            { domain: "co", cat: "co-ethics", sev: "major", text: "The protocol was changed before Health Canada approved it, and required information was not sent to the REB.", ref: "C.05.008" }
          ] },
        { id: "hc-qcroc-webinar-2021", title: "Health Canada Clinical Trial Compliance Program — clinical trial inspections webinar (Q-CROC)", url: "https://qcroc.ca/wp-content/uploads/2021/02/Presentation-Sante-Canada-Inspection-essais-cliniques_Q-CROC_24-fev.-2021.V2.pdf", type: "Regulator presentation", publishedAt: "2021-02-24", period: "2015–2020 statistics; virtual inspections 2020–21", scope: "QI sites, sponsors, CROs", flag: "Secondary host", flagNote: "Health Canada presentation hosted on the Q-CROC website.",
          summary: "2,129 observations: 1% critical, 39% major and 60% minor. 68% fell under C.05.010 and 28% under C.05.012.",
          findings: [
            { domain: "co", cat: "co-qms", sev: "trend", text: "C.05.010(c) (systems and procedures) was the most cited provision, with 1,043 of 2,129 observations (49%).", ref: "C.05.010(c)" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Records made up 28% of observations: errors, incomplete subject records, and drug shipment and return records.", ref: "C.05.012" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Critical example: eligibility criteria were not respected, so subjects who should have been excluded were randomised.", ref: "C.05.010(b)" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Critical example: new safety information was not passed on to the QI.", ref: "C.05.010(c)" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Falsified or misrepresented records are classed as a critical (Risk 1) observation.", ref: "C.05.012" }
          ] },
        { id: "hc-ucalgary-lessons-2024", title: "Lessons Learned from 2024 Regulatory Inspections — Health Canada QI inspection case (University of Calgary)", url: "https://cumming.ucalgary.ca/sites/default/files/teams/27/Lunch%20%26%20Learn%20-%20Lessons%20Learned%20from%20Regulatory%20Inspections.pdf", type: "Site-published case study", publishedAt: "2025-01-13", period: "2024", scope: "QI site, industry-sponsored trial", flag: "Site-published", flagNote: "A trial site's own account of a Health Canada inspection.",
          summary: "The site was rated non-compliant with 4 critical observations, and an intent-to-suspend letter was sent to the sponsor.",
          findings: [
            { domain: "dm", cat: "dm-source", sev: "critical", text: "Source records were missing for eligibility criteria and baseline assessments.", ref: "C.05.012" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Reviews of eligibility, lab and safety documents were backdated on paper printouts.", ref: "C.05.012" },
            { domain: "co", cat: "co-oversight", sev: "critical", text: "The QI documented medical decisions inadequately.", ref: "C.05.010(f)" },
            { domain: "co", cat: "co-sponsor", sev: "critical", text: "Inadequate monitoring was cited as a critical observation.", ref: "C.05.010" }
          ] }
      ]
    },

    {
      id: "mfds", name: "MFDS — Korea Ministry of Food and Drug Safety (식품의약품안전처)", short: "MFDS", logoText: "MFDS", domain: "mfds.go.kr",
      category: "regulator",
      intro: "Korea's medicines regulator. It inspects sponsors, CROs and sites for marketing approval and presents aggregated findings at its annual clinical trial policy briefings.",
      url: "https://www.mfds.go.kr/",
      sources: [
        { id: "mfds-approval-inspections-2022", title: "MFDS 2022 GCP inspections for marketing approval — main findings (품목허가 임상시험 실태조사 결과)", url: "http://www.newsthevoice.com/news/articleView.html?idxno=31429", type: "News report of regulator briefing", publishedAt: "2023-02-24", period: "2022", scope: "21 sponsors/CROs and 36 sites", flag: "Secondary source", flagNote: "Korean news report of an MFDS policy briefing.",
          summary: "The top sponsor areas were IP safety information (22%) and data handling and statistics (22%). The top site areas were records (38%) and protocol compliance (29%).",
          findings: [
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "Sponsors: the CRF was finalised after the first subject was enrolled, and SOPs for electronic data processing and statistics were inadequate.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "Sponsors: no medical assessment, or an undocumented one, of serious adverse reactions.", ref: "" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Monitors who knew of violations took no corrective action, and source–CRF discrepancies were missed.", ref: "" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Sites: source did not match the CRF, and IP administration and AE times were not recorded.", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Sites: samples and tests were missed, and prescriptions were written before a randomisation number was obtained.", ref: "" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Sites: no temperature or time records at IP receipt, storage or dispensing.", ref: "" }
          ] },
        { id: "mfds-approval-inspections-2022-severity", title: "MFDS 2022 approval GCP inspections — critical and major findings including unblinding", url: "https://www.pharmnews.com/news/articleView.html?idxno=219074", type: "News report of regulator briefing", publishedAt: "2023-02-27", period: "2022", scope: "21 sponsors/CROs", flag: "Secondary source", flagNote: "Korean news report of an MFDS policy briefing.",
          summary: "94 sponsor and CRO findings: 8 critical and 45 major.",
          findings: [
            { domain: "co", cat: "co-qms", sev: "trend", text: "94 sponsor/CRO findings: 8 critical and 45 major.", ref: "" },
            { domain: "dm", cat: "dm-lock", sev: "critical", text: "Randomisation codes were broken without following the SOP.", ref: "" }
          ] },
        { id: "mfds-approval-inspections-2021", title: "MFDS 2021 GCP inspections for marketing approval and safety-system inspections", url: "http://www.newsthevoice.com/news/articleView.html?idxno=25520", type: "News report of regulator briefing", publishedAt: "2022-02-23", period: "2021", scope: "20 sponsors, 26 sites; 15 safety-system inspections", flag: "Secondary source", flagNote: "Korean news report of an MFDS policy briefing.",
          summary: "Safety-system inspections led to 20 corrective actions; the report also lists site and sponsor findings.",
          findings: [
            { domain: "dm", cat: "dm-report", sev: "major", text: "No QC evidence for statistical programs, and inadequate QC of external analysis data.", ref: "" },
            { domain: "co", cat: "co-consent", sev: "major", text: "Original signed consent forms were lost, and revised ICFs reached investigators long after IRB approval.", ref: "" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "Sample pre-processing was done by staff not delegated the task.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "major", text: "SUSAR criteria were vague, non-experts did medical assessments, and SAEs were tracked in Excel.", ref: "" }
          ] }
      ]
    },

    {
      id: "tga", name: "TGA — Australia Therapeutic Goods Administration", short: "TGA", logoText: "TGA", domain: "tga.gov.au",
      category: "regulator",
      intro: "TGA's GCP Inspection Program inspects Australian trial sites, commercial and investigator-initiated, and publishes de-identified metrics.",
      url: "https://www.tga.gov.au/",
      sources: [
        { id: "tga-gcpip-2023-2024", title: "TGA GCP Inspection Program Metrics Report 2023–2024", url: "https://www.tga.gov.au/sites/default/files/2025-04/good-clinical-practice-inspection-program-2023-2024-250407.pdf", type: "Annual inspection metrics", publishedAt: "2025-04-07", period: "Jan 2023 – Dec 2024", scope: "13 inspections of Australian trial sites",
          summary: "Every inspection found deficiencies. Critical deficiencies were found in protocol compliance, trial management and IP, but none in commercially sponsored trials.",
          findings: [
            { domain: "co", cat: "co-consent", sev: "trend", text: "Consent was deficient in 10 of 12 routine inspections: procedures before consent, superseded PICFs, and consent by non-designated staff.", ref: "ICH E6(R2) 4.8" },
            { domain: "co", cat: "co-safety", sev: "trend", text: "The most frequent protocol sub-category was SAEs not reported, or reported late, to the sponsor.", ref: "ICH E6(R2) 4.11.1" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "Ineligible participants were enrolled, and deviations were implemented without HREC approval.", ref: "ICH E6(R2) 4.5" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Source documentation did not meet ALCOA-C, changes were untraceable, and CRF data had no supporting source.", ref: "ICH E6(R2) 4.9" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "No delegation logs, staff worked before training, and an uncertified lab was used.", ref: "ICH E6(R2) 4.1.5, 4.2" },
            { domain: "co", cat: "co-ip", sev: "major", text: "IP accountability was incomplete, and blinded staff had unmonitored access to unblinded data.", ref: "ICH E6(R2) 4.6, 4.7" },
            { domain: "dm", cat: "dm-csv", sev: "critical", text: "Investigator-initiated trials used unvalidated electronic systems, with no monitoring and no quality system.", ref: "ICH E6(R2) 5.5.3" }
          ] }
      ]
    },

    {
      id: "anvisa", name: "ANVISA — Brazil National Health Surveillance Agency", short: "ANVISA", logoText: "ANV", domain: "gov.br",
      category: "regulator",
      intro: "ANVISA's Clinical Research Coordination (COPEC) runs GCP inspections of trial sites and sponsors/CROs and publishes annual metrics.",
      url: "https://www.gov.br/anvisa/pt-br",
      sources: [
        { id: "anvisa-bpc-metrics-2024-2025", title: "ANVISA GCP Inspection Metrics Report 2024–2025 (Relatório de Métricas de Inspeções de BPC)", url: "https://www.gov.br/anvisa/pt-br/assuntos/noticias-anvisa/2026/copy_of_COPEC_MtricasdeinspeodeBPC_20242025.pdf/@@display-file/file", type: "Annual inspection metrics", publishedAt: "2026-05-18", period: "2024–2025", scope: "12 inspections of Brazilian trial sites",
          summary: "11 inspections produced 136 findings. Sites had 20 critical and 39 major findings; 11 critical and 23 major findings were attributable to sponsors or CROs.",
          findings: [
            { domain: "dm", cat: "dm-source", sev: "trend", text: "The most frequent critical site finding was a lack of concordance between source data, CRF and report.", ref: "" },
            { domain: "dm", cat: "dm-audit", sev: "critical", text: "EMR addenda were allowed without traceability, the same correction reason was always used, and EMR templates mimicked the CRF.", ref: "" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Non-contemporaneous entries for sample and IP times, and data collected only in sponsor systems the site could not access.", ref: "" },
            { domain: "co", cat: "co-consent", sev: "major", text: "Participants did not sign the latest approved ICF, and re-consent was not done.", ref: "" },
            { domain: "co", cat: "co-qms", sev: "trend", text: "The most frequent major site findings were training and deficient site quality systems.", ref: "" },
            { domain: "dm", cat: "dm-crf", sev: "major", text: "Sponsor/CRO findings covered study management systems, data management and CRF design.", ref: "" }
          ] }
      ]
    },

    {
      id: "who-pq", name: "WHO Prequalification — Inspections", short: "WHO PQ", logoText: "WHO", domain: "who.int",
      category: "regulator",
      intro: "WHO Prequalification inspects clinical and bioequivalence CROs that support prequalified medicines, and issues Notices of Concern when it finds serious GCP or data-integrity failures.",
      url: "https://extranet.who.int/prequal/inspection-services",
      sources: [
        { id: "who-pq-noc-accutest-2022", title: "Notice of Concern: Accutest Research Laboratories, Navi Mumbai, India", url: "https://extranet.who.int/prequal/sites/default/files/document_files/Accutest_NoticeOfConcern_28Nov2022.pdf", type: "Notice of Concern", publishedAt: "2022-11-28", period: "Inspection May–Jun 2022", scope: "BE clinical unit (CRO)",
          summary: "Three BE studies were rejected over oversight and data-integrity failures. The notice was withdrawn in August 2023 after a follow-up inspection.",
          findings: [
            { domain: "co", cat: "co-qms", sev: "critical", text: "Inadequate management oversight led to malpractice, including inappropriate change control.", ref: "WHO GCP" },
            { domain: "dm", cat: "dm-audit", sev: "critical", text: "Electronic raw data had been deleted, and access control was inadequate.", ref: "WHO TRS 1033 Annex 4" },
            { domain: "dm", cat: "dm-csv", sev: "critical", text: "Computerised system validation requirements were not met.", ref: "WHO TRS 1033 Annex 4" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "A hidden room in the pathology lab held unexplained analytical reports and study documents.", ref: "WHO TRS 1033 Annex 4" },
            { domain: "dm", cat: "dm-lab", sev: "critical", text: "An undeclared haematology analyser was found, and there were critical deviations in reporting lab results.", ref: "WHO GCP" }
          ] },
        { id: "who-pq-noc-panexcell-2020", title: "Notice of Concern: Panexcell Clinical Lab Private Limited, Navi Mumbai, India", url: "https://extranet.who.int/prequal/sites/default/files/document_files/NOC_Panexcell_09Oct2020.pdf", type: "Notice of Concern", publishedAt: "2020-10-09", period: "2015–2020", scope: "BE studies for WHO applications (CRO)",
          summary: "Issued after the EMA referral. WHO concluded that data reliability and the QMS were not robust.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "The CRO could not explain duplicated PK profiles that changed the outcome to a passing result.", ref: "WHO TRS 996 Annex 9" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Dolutegravir Cmax ratios showed a non-random distribution.", ref: "WHO TRS 996 Annex 9" },
            { domain: "co", cat: "co-qms", sev: "critical", text: "The QMS failed to exclude data manipulation.", ref: "WHO GCP" }
          ] }
      ]
    },

    /* ======================= GLOBAL MNC PHARMA ======================= */
    {
      id: "pfizer", name: "Pfizer", short: "Pfizer", logoText: "PFE", domain: "pfizer.com",
      category: "mnc",
      intro: "US-based global pharma company and sponsor, with BioNTech, of the pivotal Comirnaty COVID-19 vaccine trial.",
      url: "https://www.pfizer.com/",
      sources: [
        { id: "pfizer-fda-eir-2023-04", title: "FDA Establishment Inspection Report — Pfizer, Inc. (Groton, CT), sponsor inspection Apr 2023", url: "https://www.keypedia.com/records/eir/pfizer-inc/cf3a8a77-b238-4293-b06b-75cfecbed946", type: "FDA BIMO sponsor inspection (EIR)", publishedAt: "2023-04-19", period: "2023", scope: "Sponsor and CRO oversight (8 sites selected)", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "A high-priority PDUFA sponsor inspection that closed without a Form 483. The report documents data-quality problems at one site, which the sponsor had already found and was remediating.",
          findings: [
            { domain: "dm", cat: "dm-source", sev: "major", text: "Repeated source data inaccuracies at clinical site 1102.", ref: "" },
            { domain: "dm", cat: "dm-crf", sev: "major", text: "CRF data-entry discrepancies at site 1102.", ref: "" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "The site did not follow sponsor procedures. The response was an audit, more monitoring and retraining of the CI.", ref: "" }
          ] },
        { id: "pfizer-ventavia-bmj-2021", title: "Covid-19: Researcher blows the whistle on data integrity issues in Pfizer's vaccine trial (BMJ 2021;375:n2635)", url: "https://www.bmj.com/content/375/bmj.n2635", type: "Investigative report + whistleblower case", publishedAt: "2021-11-02", period: "2020", scope: "Ventavia Research Group sites (Texas) in the pivotal Phase 3 trial", flag: "Allegation", flagNote: "Whistleblower allegations reported by The BMJ, not confirmed regulator findings. The False Claims Act suit was dismissed on procedural grounds in August 2024.",
          summary: "A former Ventavia regional director made allegations backed by internal documents. Pfizer and FDA said the trial data were not invalidated.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Alleged: Ventavia falsified data in the trial.", ref: "" },
            { domain: "co", cat: "co-ip", sev: "major", text: "Alleged unblinding risk: vaccine packaging with participant IDs left in the open, and assignment printouts left in charts.", ref: "" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "Alleged: inadequately trained vaccinators, and site QC overwhelmed by the volume of problems.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "major", text: "Alleged: slow follow-up of adverse events.", ref: "" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Oversight questioned: an anonymous complaint was received in September 2020, and FDA did not inspect the Ventavia sites.", ref: "" }
          ] }
      ]
    },

    {
      id: "astrazeneca", name: "AstraZeneca", short: "AstraZeneca", logoText: "AZ", domain: "astrazeneca.com",
      category: "mnc",
      intro: "UK/Sweden-headquartered global pharma company. It developed AZD1222 with Oxford and markets Imfinzi and Imjudo in oncology.",
      url: "https://www.astrazeneca.com/",
      sources: [
        { id: "az-imjudo-epar-poseidon-gcp", title: "Imjudo (tremelimumab) EPAR assessment report — variation II/0001, section 2.1.3 GCP", url: "https://www.ema.europa.eu/en/documents/variation-report/imjudo-h-c-006016-ii-0001-epar-assessment-report-variation_en.pdf", type: "EMA EPAR (CHMP-requested GCP inspection)", publishedAt: "2023", period: "2022", scope: "POSEIDON study: investigator site (DE), main CRO (US), sponsor (CA)",
          summary: "The routine GCP inspection found one critical finding at the CRO and major findings at all sites. The data remained usable, but a CSR addendum on mis-stratified subjects was required.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "critical", text: "One critical finding at the main CRO; the EPAR does not disclose what it was.", ref: "EPAR 2.1.3" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "A major finding at the sponsor site led to a required CSR addendum listing mis-stratified subjects.", ref: "EPAR 2.1.3" },
            { domain: "co", cat: "co-qms", sev: "major", text: "Major and minor findings at all inspected sites, judged unlikely to affect overall data quality.", ref: "EPAR 2.1.3" }
          ] },
        { id: "az-azd1222-dsmb-2021", title: "NIAID Statement on AstraZeneca Vaccine (DSMB concern on outdated efficacy data)", url: "https://www.nih.gov/news-events/news-releases/niaid-statement-astrazeneca-vaccine", type: "Funder public statement", publishedAt: "2021-03-23", period: "2021", scope: "AZD1222 US Phase 3 trial — interim efficacy press release",
          summary: "The DSMB was concerned that the efficacy release used outdated information. The updated primary analysis gave 76% efficacy, against 79% at interim.",
          findings: [
            { domain: "dm", cat: "dm-report", sev: "major", text: "The public efficacy results included outdated information and gave an incomplete view of efficacy.", ref: "" },
            { domain: "dm", cat: "dm-lock", sev: "minor", text: "The interim analysis used a 17 Feb 2021 data cut-off although more cases had accrued; the updated analysis added 49 cases.", ref: "https://www.astrazeneca.com/media-centre/press-releases/2021/update-following-statement-by-niaid-on-azd1222-us-phase-iii-trial-data.html" },
            { domain: "co", cat: "co-sponsor", sev: "minor", text: "Sponsor communication was not aligned with independent data monitoring.", ref: "" }
          ] },
        { id: "az-oxford-dosing-error-reuters-2020", title: "SPECIAL REPORT: How a British COVID-19 vaccine went from pole position to troubled start (Reuters)", url: "https://www.reuters.com/business/healthcare-pharmaceuticals/special-report-how-british-covid-19-vaccine-went-pole-position-troubled-start-2020-12-24/", type: "Investigative media report", publishedAt: "2020-12-24", period: "2020", scope: "Oxford/AstraZeneca UK Phase 2/3 trial", flag: "Media report", flagNote: "Investigative journalism (Reuters) supported by company disclosures.",
          summary: "A potency-measurement error meant many UK participants got about half the intended first dose; the headline 90% efficacy came from that unplanned subgroup.",
          findings: [
            { domain: "co", cat: "co-ip", sev: "major", text: "A vial concentration measurement problem led to a dosing error: many subjects received about half the intended dose.", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "A protocol amendment added a full-dose group after the error was reported to the regulator.", ref: "" },
            { domain: "co", cat: "co-consent", sev: "major", text: "The letter to about 1,500 affected volunteers did not disclose that an error had occurred.", ref: "https://www.reuters.com/article/us-health-coronavirus-vaccine-oxford-exc-idUSKBN2A1263/" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "The headline 90% efficacy came from the unplanned half-dose subgroup (62% full/full, 70% pooled).", ref: "" }
          ] }
      ]
    },

    {
      id: "merck-msd", name: "Merck & Co. / MSD", short: "MSD", logoText: "MSD", domain: "merck.com",
      category: "mnc",
      intro: "US-headquartered global pharma company, known as MSD outside the US and Canada.",
      url: "https://www.merck.com/",
      sources: [
        { id: "merck-fda-483-2021-01", title: "FDA Form 483 / EIR — Merck & Co. (Rahway, NJ), sponsor inspection Jan 2021", url: "https://www.keypedia.com/records/eir/merck-company/00d546bd-356c-43e3-990a-a4cfc3897440", type: "FDA BIMO sponsor inspection (Form 483 + EIR)", publishedAt: "2021-01-20", period: "2021", scope: "Sponsor oversight, IND 132120 (belzutifan)", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "One Form 483 observation for monitoring failures, plus two discussion items.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Monitoring follow-up letters to sites were late against the monitoring plan (Site 011: 11 of 22; Site 040: 9 of 21).", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-qms", sev: "minor", text: "The protocol deviation management plan lacked approval signatures and change control.", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "minor", text: "No evidence that monitors retrained sites on recurring deviations, such as out-of-window visits.", ref: "" }
          ] }
      ]
    },

    {
      id: "roche-genentech", name: "Roche / Genentech", short: "Roche", logoText: "RO", domain: "roche.com",
      category: "mnc",
      intro: "Swiss global pharma group; Genentech is its US R&D and commercial subsidiary.",
      url: "https://www.roche.com/",
      sources: [
        { id: "genentech-fda-483-2024-03", title: "FDA Form 483 — Genentech, Inc., sponsor inspection Mar 2024 (VAI)", url: "https://www.keypedia.com/records/483/genentech-inc/7887b305-0de6-472c-b596-8cbd94e8d300", type: "FDA BIMO sponsor inspection (Form 483)", publishedAt: "2024-03-12", period: "2024", scope: "Sponsor of drug studies incl. a decentralised component", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "Three 483 observations, classified VAI.",
          findings: [
            { domain: "co", cat: "co-ip", sev: "major", text: "Inadequate records of receipt, shipment and disposition of investigational drug.", ref: "21 CFR 312.57(a)" },
            { domain: "co", cat: "co-qms", sev: "major", text: "Decentralised study staff lacked the required GCP training.", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-safety", sev: "major", text: "Not all investigators received timely written IND safety reports.", ref: "21 CFR 312.56(c) / 312.32" }
          ] },
        { id: "genentech-fda-483-2023-08", title: "FDA Form 483 — Genentech, Inc., sponsor inspection Aug 2023", url: "https://www.keypedia.com/records/483/genentech-inc/ce85e9f0-3331-495a-b1b4-a7e2df5fa79b", type: "FDA BIMO sponsor inspection (Form 483)", publishedAt: "2023-08-11", period: "2023", scope: "Sponsor of a clinical study", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "A single-observation 483, later classified VAI.",
          findings: [
            { domain: "co", cat: "co-ethics", sev: "major", text: "FDA was not notified that a PI's participation had been terminated for cause.", ref: "21 CFR 312.56(b)" }
          ] }
      ]
    },

    {
      id: "novartis", name: "Novartis", short: "Novartis", logoText: "NVS", domain: "novartis.com",
      category: "mnc",
      intro: "Swiss global pharma company that publicly discloses its yearly health-authority inspection counts.",
      url: "https://www.novartis.com/",
      sources: [
        { id: "novartis-fda-483-2023-08", title: "FDA Form 483 — Novartis Pharmaceuticals Corporation (East Hanover, NJ), sponsor inspection Aug 2023 (VAI)", url: "https://www.keypedia.com/records/483/novartis-pharmaceuticals-corporation/b86a870b-4f00-4ca2-a2ea-f19029e24813", type: "FDA BIMO sponsor inspection (Form 483)", publishedAt: "2023-08-21", period: "2023", scope: "Sponsor monitoring of a clinical study", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; Novartis's own inspections page reports one FDA VAI in 2023.",
          summary: "Two 21 CFR 312.50 citations, classified VAI.",
          findings: [
            { domain: "co", cat: "co-ip", sev: "major", text: "IP stored outside the required temperature was still dispensed to subjects.", ref: "21 CFR 312.50" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Monitoring visits did not identify the IP temperature excursions.", ref: "21 CFR 312.50" }
          ] }
      ]
    },

    {
      id: "bms", name: "Bristol Myers Squibb", short: "BMS", logoText: "BMS", domain: "bms.com",
      category: "mnc",
      intro: "US-headquartered global biopharma company; its subsidiary Juno Therapeutics works in cell therapy.",
      url: "https://www.bms.com/",
      sources: [
        { id: "bms-fda-eir-2022-02", title: "FDA EIR — Bristol Myers Squibb (Princeton, NJ), sponsor inspection Jan–Feb 2022", url: "https://www.keypedia.com/records/eir/bristol-myers-squibb/c022e3f7-a9fe-4645-894c-a39b36c9c734", type: "FDA BIMO sponsor inspection (EIR, no 483)", publishedAt: "2022-02-02", period: "2021–2022", scope: "Sponsor oversight incl. review of self-identified issues", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "No Form 483. The report records FDA's review of serious issues BMS had found itself.",
          findings: [
            { domain: "dm", cat: "dm-csv", sev: "major", text: "A system failure assigned the wrong treatment to 106 subjects. CAPA included SOP updates and stronger UAT.", ref: "" },
            { domain: "co", cat: "co-sponsor", sev: "minor", text: "Vendor guidance was revised to strengthen sponsor oversight of vendor UAT.", ref: "" },
            { domain: "co", cat: "co-oversight", sev: "major", text: "Site 092 was terminated for egregious non-compliance, including assessments by unqualified staff, and its data were excluded.", ref: "" },
            { domain: "co", cat: "co-qms", sev: "minor", text: "Sub-investigators performed efficacy assessments before completing mandatory training.", ref: "" }
          ] },
        { id: "bms-fda-eir-2022-03", title: "FDA EIR — Bristol-Myers Squibb (Summit, NJ), sponsor inspection Mar 2022 (NAI)", url: "https://www.keypedia.com/records/eir/bristol-myers-squibb-company/d539f239-1103-4fe2-acdf-a6f28938d6e1", type: "FDA BIMO sponsor inspection (EIR, NAI)", publishedAt: "2022-03-14", period: "2022", scope: "Two clinical studies", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "Classified NAI, with one discussion item on SAE data completeness.",
          findings: [
            { domain: "co", cat: "co-safety", sev: "minor", text: "Follow-up SAE forms sometimes lacked the CTCAE grade or seriousness criteria.", ref: "" }
          ] },
        { id: "bms-juno-fda-eir-2022-03", title: "FDA EIR — Juno Therapeutics (BMS subsidiary), sponsor inspection Mar 2022", url: "https://www.keypedia.com/records/eir/juno-therapeutics-inc-a-subsidiary-of-bristol-myers-squibb/787a4458-197b-4164-b6d3-363216511b1d", type: "FDA (CBER) BIMO sponsor inspection (EIR, no 483)", publishedAt: "2022-03-18", period: "2022", scope: "Global Phase 3 JCAR017-BCM-003 (liso-cel)", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "No Form 483. Two discussion items.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "minor", text: "The first DSMB meeting did not follow the timing set in the charter.", ref: "" },
            { domain: "co", cat: "co-safety", sev: "minor", text: "Two follow-up SAE reports were submitted late.", ref: "" }
          ] }
      ]
    },

    {
      id: "lilly", name: "Eli Lilly and Company", short: "Lilly", logoText: "LLY", domain: "lilly.com",
      category: "mnc",
      intro: "US-headquartered global pharma company (tirzepatide, donanemab).",
      url: "https://www.lilly.com/",
      sources: [
        { id: "lilly-kisunla-epar-gcp", title: "Kisunla (donanemab) EPAR — public assessment report (GCP inspection outcome)", url: "https://www.ema.europa.eu/en/documents/assessment-report/kisunla-epar-public-assessment-report_en.pdf", type: "EMA EPAR", publishedAt: "2025", period: "2023–2025", scope: "TRAILBLAZER-ALZ 2: 2 sites (PL, CA) and the sponsor site",
          summary: "The EMA GCP inspection reported five major findings that did not affect the acceptability of the data. Assessors also commented on how protocol deviations were counted.",
          findings: [
            { domain: "co", cat: "co-qms", sev: "major", text: "Five major GCP findings across two investigator sites and the sponsor; the data remained acceptable.", ref: "EPAR 2.6" },
            { domain: "dm", cat: "dm-report", sev: "minor", text: "Deviations were summarised with a sequential filter that counts each patient once, which may under-count deviations.", ref: "EPAR 2.6" },
            { domain: "co", cat: "co-protocol", sev: "minor", text: "49.4% of randomised patients had study-procedure compliance deviations.", ref: "EPAR 2.6" },
            { domain: "co", cat: "co-consent", sev: "minor", text: "21.3% of important deviations concerned informed consent.", ref: "EPAR 2.6" },
            { domain: "co", cat: "co-safety", sev: "minor", text: "9.6% of deviations concerned safety reporting, mostly safety MRIs that were missing or not reviewed.", ref: "EPAR 2.6" }
          ] },
        { id: "lilly-fda-eir-2022-01-tirzepatide", title: "FDA EIR — Eli Lilly and Company, sponsor inspection Jan 2022 (NDA 215866, tirzepatide)", url: "https://www.keypedia.com/records/eir/eli-lilly-and-company/df21d2c6-ef3b-4bf8-8555-8d8782799426", type: "FDA BIMO sponsor inspection (EIR, VAI)", publishedAt: "2022-01-13", period: "2021–2022", scope: "Sponsor oversight of SURPASS-2, -3, -5", flag: "Secondary source", flagNote: "Summary from the KeyPedia FOIA aggregator; check the original in FDA's FOIA reading room.",
          summary: "Classified VAI with discussion items. A follow-up inspection in September 2022 was NAI.",
          findings: [
            { domain: "dm", cat: "dm-csv", sev: "major", text: "IWRS validation was ineffective, posing potential risk to subject safety and data integrity.", ref: "" },
            { domain: "co", cat: "co-sponsor", sev: "minor", text: "Inadequate monitoring of medical-history records at one site.", ref: "" },
            { domain: "dm", cat: "dm-lab", sev: "minor", text: "Two sites did not provide local lab certifications during COVID-19.", ref: "" },
            { domain: "co", cat: "co-tmf", sev: "minor", text: "Follow-up: documents uploaded to the eTMF must be certified true copies.", ref: "" }
          ] }
      ]
    },

    {
      id: "amgen", name: "Amgen", short: "Amgen", logoText: "AMG", domain: "amgen.com",
      category: "mnc",
      intro: "US-headquartered global biotech company and sponsor of the CodeBreaK program for sotorasib (Lumakras).",
      url: "https://www.amgen.com/",
      sources: [
        { id: "amgen-lumakras-odac-crl-2023", title: "FDA Briefing Document — ODAC 5 Oct 2023: sotorasib (CodeBreaK 200)", url: "https://www.fda.gov/media/172696/download", type: "FDA advisory committee review + CRL", publishedAt: "2023-10-05", period: "2020–2023", scope: "Phase 3 CodeBreaK 200 (sotorasib vs docetaxel)",
          summary: "FDA said trial-conduct and bias issues made the PFS result unreliable. ODAC voted 10–2 against relying on it, and a CRL followed in December 2023.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "major", text: "Asymmetric early dropout: 13% of docetaxel patients versus 1% of sotorasib patients received no therapy.", ref: "FDA briefing 4.1" },
            { domain: "dm", cat: "dm-report", sev: "major", text: "Investigators called progression earlier than blinded central review (BICR) in the docetaxel arm and later in the sotorasib arm.", ref: "FDA briefing 4.2" },
            { domain: "co", cat: "co-protocol", sev: "major", text: "Patients crossed over early, before BICR-confirmed progression.", ref: "FDA briefing 4.3" },
            { domain: "dm", cat: "dm-recon", sev: "major", text: "The imaging charter was not followed, with multiple BICR assessments of the primary endpoint.", ref: "FDA briefing 4.6" },
            { domain: "co", cat: "co-sponsor", sev: "major", text: "Bias-minimisation measures were not adequately applied, leading to a CRL and a new confirmatory trial.", ref: "https://www.amgen.com/newsroom/press-releases/2023/12/amgen-provides-regulatory-update-on-status-of-lumakras-sotorasib" }
          ] }
      ]
    },

    /* ======================= CRO CASES ======================= */
    {
      id: "synapse", name: "Synapse Labs Pvt. Ltd (Pune, India)", short: "Synapse Labs", logoText: "SYN",
      category: "cro",
      intro: "Indian CRO that ran clinical and bioanalytical BE studies. EMA suspended more than 400 generic medicines that relied on its studies.",
      url: "https://www.ema.europa.eu/en/medicines/human/referrals/synapse-labs",
      sources: [
        { id: "ema-synapse-a31-assessment-2024", title: "Synapse Article 31 referral — CHMP Assessment report (EMEA/H/A-31/1529)", url: "https://www.ema.europa.eu/en/documents/referral/synapse-article-31-referral-assessment-report_en.pdf", type: "EMA Referral Assessment Report", publishedAt: "2024-03-21", period: "2009–2022", scope: "EU referral after an AEMPS (Spain) remote GCP inspection",
          summary: "5 critical findings and 1 major finding. CHMP recommended suspending most of the more than 400 medicines, and the European Commission decided on 24 May 2024.",
          findings: [
            { domain: "dm", cat: "dm-csv", sev: "critical", text: "The CRO could not show that its computerised systems and data management ensured data integrity (4 critical findings).", ref: "EMA computerised systems guideline" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "PK anomalies in more than 20 studies (2013–2018), consistent with duplicated plasma profiles.", ref: "EMA BE guideline" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Source documentation for clinical and bioanalytical work was not clearly established.", ref: "ICH E6(R2) 4.9" },
            { domain: "co", cat: "co-qms", sev: "critical", text: "Intentional misrepresentation of data could not be ruled out, and the QMS was compromised for years.", ref: "Directive 2001/83/EC Art 31" }
          ] }
      ]
    },
    {
      id: "synchron", name: "Synchron Research Services (Ahmedabad, India)", short: "Synchron", logoText: "SRS",
      category: "cro",
      intro: "Indian CRO that ran clinical and bioanalytical BE studies for generic medicines.",
      url: "https://www.ema.europa.eu/en/medicines/human/referrals/synchron-research-services",
      sources: [
        { id: "ema-synchron-a31-assessment-2022", title: "Synchron Article 31 referral — CHMP Assessment report (EMEA/H/A-31/1515)", url: "https://www.ema.europa.eu/en/documents/referral/synchron-article-31-referral-assessment-report_en.pdf", type: "EMA Referral Assessment Report", publishedAt: "2022-09-15", period: "2005–2021", scope: "EU referral of medicines relying on Synchron BE studies",
          summary: "CHMP recommended suspending about 100 generics, and the European Commission decided on 28 November 2022.",
          findings: [
            { domain: "dm", cat: "dm-lab", sev: "critical", text: "The site failed to show that its BE analytical method was accurate and sensitive (FDA inspection, 2019).", ref: "ICH M10" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Pairs of subjects had overlapping plasma profiles; FDA concluded the CRO created false data.", ref: "EMA BE guideline" },
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Subgroups had test/reference ratios consistently above or below 1, a non-random pattern.", ref: "EMA BE guideline" },
            { domain: "co", cat: "co-qms", sev: "critical", text: "Similar concerns in 2005 and 2009 had been treated as isolated, and the QMS was judged unsuitable.", ref: "Directive 2001/83/EC Art 31" }
          ] }
      ]
    },
    {
      id: "panexcell", name: "Panexcell Clinical Laboratories (Navi Mumbai, India)", short: "Panexcell", logoText: "PNX",
      category: "cro",
      intro: "Indian CRO with a bioequivalence study site in Navi Mumbai.",
      url: "https://www.ema.europa.eu/en/medicines/human/referrals/panexcell",
      sources: [
        { id: "ema-panexcell-referral-2020", title: "Panexcell referral — suspension of medicines over flawed studies", url: "https://www.ema.europa.eu/en/medicines/human/referrals/panexcell", type: "EMA Referral", publishedAt: "2020-07-24", period: "pre-2020", scope: "EU referral after Austrian/German GCP inspection",
          summary: "CHMP recommended suspending all EU medicines authorised on Panexcell BE data.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "critical", text: "Samples from different patients were exceptionally similar, indicating possible PK profile duplication.", ref: "EMA BE guideline" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "Staff recorded the wrong room temperature for the sample-processing area.", ref: "ICH E6(R2) 2.10" },
            { domain: "co", cat: "co-qms", sev: "critical", text: "Serious concerns about the QMS and the reliability of all data from the site.", ref: "Directive 2001/83/EC Art 31" }
          ] }
      ]
    },

    /* ======================= INDUSTRY & PROFESSIONAL BODIES ======================= */
    {
      id: "scdm", name: "Society for Clinical Data Management (SCDM)", short: "SCDM", logoText: "SCDM", domain: "scdm.org",
      category: "industry",
      intro: "Global professional association for clinical data management, publishing papers on risk-based data management, eSource and audit-trail review.",
      url: "https://scdm.org/",
      sources: [
        { id: "scdm-cdm-to-cds-part2-2020", title: "The Evolution of Clinical Data Management into Clinical Data Science (Part 2: Technology Enablers) — §10.1 Audit Trail", url: "https://scdm.org/wp-content/uploads/2024/03/2020_Evolution-of-CDM-to-CDS-Part-2-Technology-Enablers.pdf", type: "Industry reflection paper", publishedAt: "2020", period: "2019–2020", scope: "Sponsor eSource/ePRO and EDC data",
          summary: "Reports issues that regulators found through audit-trail and metadata review during GCP inspections.",
          findings: [
            { domain: "dm", cat: "dm-audit", sev: "major", text: "Audit trails showed data were entered by unauthorised individuals.", ref: "§10.1" },
            { domain: "dm", cat: "dm-integrity", sev: "major", text: "ePRO data were entered faster than the assessment could have been performed, and a group of subjects was batch-entered at the same time.", ref: "§10.1" },
            { domain: "dm", cat: "dm-source", sev: "major", text: "eSource primary efficacy data were not entered directly as the protocol required; an alternative source existed.", ref: "§10.1" },
            { domain: "co", cat: "co-qms", sev: "trend", text: "Without risk-based audit-trail review procedures, sponsors miss non-compliance that only metadata reveals.", ref: "§10.1" }
          ] }
      ]
    },
    {
      id: "capra", name: "Canadian Association of Professionals in Regulatory Affairs (CAPRA)", short: "CAPRA", logoText: "CAP", domain: "capra.ca",
      category: "industry",
      intro: "Canadian professional association for regulatory affairs practitioners.",
      url: "https://capra.ca/",
      sources: [
        { id: "capra-11-years-gcp-inspections-2025", title: "Insights from 11 Years of Good Clinical Practice (GCP) Inspections", url: "https://capra.ca/en/blog/insights-from-11-years-of-good-clinical-practice-gcp-inspections-2025-05-13-1", type: "Trend analysis of EMA GCP IWG reports 2013–2023", publishedAt: "2025-05-13", period: "2013–2023", scope: "CHMP-requested GCP inspections",
          summary: "Trial management (sponsor) produced the most critical findings, driven by data management and monitoring.",
          findings: [
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Trial management (sponsor) ranked first for critical deficiencies in 9 of 11 years.", ref: "Table 3" },
            { domain: "dm", cat: "dm-crf", sev: "trend", text: "Over 60% of critical trial-management deficiencies came from data management and monitoring (81.8% in 2023).", ref: "Table 4" },
            { domain: "dm", cat: "dm-report", sev: "critical", text: "Example critical finding: deviation handling produced an incorrect per-protocol set, and the query process put wrong data in the CSR.", ref: "" },
            { domain: "dm", cat: "dm-crf", sev: "critical", text: "Example critical finding: PIs did not review and sign off eCRF data.", ref: "" }
          ] }
      ]
    },
    {
      id: "redica", name: "Redica Systems", short: "Redica", logoText: "RED", domain: "redica.com",
      category: "industry",
      intro: "Regulatory intelligence company that analyses FDA 483s, inspection reports and warning letters.",
      url: "https://www.redica.com/",
      sources: [
        { id: "redica-ci-483-data-integrity-2022", title: "Data Integrity and Your Clinical Investigator: What the Data Shows", url: "https://www.redica.com/resources/post/data-integrity-and-your-clinical-investigator-what-the-data-shows", type: "Industry analytics of FDA CI 483s", publishedAt: "2022-05-26", period: "c.2002–2021", scope: "1,200+ FDA 483s issued to clinical investigators", flag: "Pre-2020 data", flagNote: "Published in 2022, but the dataset goes back before 2020.",
          summary: "Data integrity is under-recognised, yet it appears in most CI 483s.",
          findings: [
            { domain: "dm", cat: "dm-integrity", sev: "trend", text: "Data integrity observations appear in more than half of CI 483s, though they are rarely labelled as such.", ref: "" },
            { domain: "dm", cat: "dm-source", sev: "trend", text: "Over three-quarters of data integrity observations involve original data, attributability or accuracy.", ref: "" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "21 CFR 312.60 protocol compliance is consistently the number-one 483 observation.", ref: "21 CFR 312.60" }
          ] }
      ]
    },
    {
      id: "goodwin", name: "Goodwin Procter LLP (Life Sciences)", short: "Goodwin", logoText: "GW", domain: "goodwinlaw.com",
      category: "industry",
      intro: "Law firm with a life sciences regulatory practice that publishes yearly analyses of BIMO enforcement.",
      url: "https://www.goodwinlaw.com/",
      sources: [
        { id: "goodwin-bimo-fy2023-2024", title: "Common FDA Bioresearch Monitoring (BIMO) Violations: Updates from FY 2023 to Now", url: "https://www.goodwinlaw.com/en/insights/publications/2024/07/alerts-lifesciences-common-fda-bioresearch-monitoring-violations", type: "Professional analysis", publishedAt: "2024-07", period: "FY2023–FY2024", scope: "FDA BIMO inspections and warning letters",
          summary: "Analysis of the FY2023 BIMO metrics and recent warning letters, by entity type.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Top CI observation: wrong drug administration, randomisation errors, and enrolment of ineligible subjects.", ref: "21 CFR 312.60" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Inadequate IP accountability at both investigators and sponsors.", ref: "21 CFR 312.57 / 312.62(a)" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Most common sponsor/CRO observation: failure to ensure proper monitoring.", ref: "21 CFR 312.50" }
          ] }
      ]
    },

    /* ======================= RESEARCH & LITERATURE ======================= */
    {
      id: "tufts-csdd", name: "Tufts Center for the Study of Drug Development (Tufts CSDD)", short: "Tufts CSDD", logoText: "TCS", domain: "csdd.tufts.edu",
      category: "academia",
      intro: "Academic research centre that benchmarks drug development practice using data from industry working groups.",
      url: "https://csdd.tufts.edu/",
      sources: [
        { id: "tufts-protocol-deviations-tirs-2022", title: "Benchmarking Protocol Deviations and Their Variation by Major Disease Categories (TIRS 2022;56(4):632–636)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8979478/", type: "Peer-reviewed benchmarking study", publishedAt: "2022-04-04", period: "187 protocols from about 24 companies", scope: "Phase I–III protocols from pharma and CROs",
          summary: "The first published benchmark of protocol deviation volume. Deviations are pervasive and highest in oncology.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Phase III protocols average 118.5 deviations, involving 32.8% of patients; Phase II averages 75.3 (30.0%).", ref: "Table 2" },
            { domain: "co", cat: "co-protocol", sev: "trend", text: "Oncology Phase II/III protocols have about 20% more deviations than non-oncology, involving about 47% of participants.", ref: "" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "The number of sites correlates strongly with the number of deviations.", ref: "" }
          ] }
      ]
    },
    {
      id: "literature", name: "Peer-reviewed literature (TIRS and others)", short: "Literature", logoText: "LIT", domain: "link.springer.com",
      category: "academia",
      intro: "Peer-reviewed analyses of regulatory GCP inspection outcomes and finding categories.",
      url: "https://link.springer.com/journal/43441",
      sources: [
        { id: "tirs-fda-ema-gcp-concordance-2022", title: "Descriptive Analysis of GCP Inspection Findings from FDA and EMA (TIRS 2022)", url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9356921/", type: "Peer-reviewed analysis", publishedAt: "2022", period: "2009–2015 inspections; published 2022", scope: "49 common FDA–EMA inspections", flag: "Pre-2020 data", flagNote: "Published in 2022 but analyses inspections from 2009–2015.",
          summary: "Concordance between FDA and EMA was high for protocol compliance and trial management; EMA reported documentation findings more often.",
          findings: [
            { domain: "co", cat: "co-protocol", sev: "trend", text: "CI inspections: FDA's top area was protocol compliance (43%) and EMA's was documentation (46%); concordance on protocol compliance was about 90%.", ref: "" },
            { domain: "co", cat: "co-sponsor", sev: "trend", text: "Sponsor/CRO inspections: FDA's top area was trial management (45%); concordance was 89%.", ref: "" },
            { domain: "co", cat: "co-tmf", sev: "trend", text: "All 23 sponsor/CRO inspections had documentation findings, such as an incomplete TMF.", ref: "" },
            { domain: "co", cat: "co-ip", sev: "trend", text: "Study drug findings had low concordance, for example on oversight of drug shipments.", ref: "" }
          ] }
      ]
    }
  ]
};

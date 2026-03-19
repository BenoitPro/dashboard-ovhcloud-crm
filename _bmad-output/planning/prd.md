---
stepsCompleted:
  - step-01-init
  - step-02-discovery
  - step-02b-vision
  - step-02c-executive-summary
  - step-03-success
  - step-04-journeys
  - step-05-domain
  - step-06-innovation
  - step-07-project-type
  - step-08-scoping
  - step-09-functional
  - step-10-nonfunctional
  - step-11-polish
  - step-12-complete
inputDocuments: []
workflowType: 'prd'
classification:
  projectType: web_app
  domain: saas_b2b
  complexity: medium
  projectContext: brownfield
---

# Product Requirements Document — Dashboard OVHcloud CRM 2

**Author:** Benoit
**Date:** 2026-03-18

---

## Executive Summary

OVHcloud Account Managers currently lose an estimated **45–60 minutes per day** per rep navigating a fragmented, outdated Dynamics interface — clicking between 4+ separate tools to perform basic tasks (NIC lookups, delivery tracking, activity logging). At 12 AMs, this represents **~500+ hours of non-selling time per month** recoverable through this initiative.

The Dashboard OVHcloud CRM 2 replaces this friction with a unified, action-oriented cockpit purpose-built for both hunting and farming workflows. The dashboard acts as an intelligent presentation layer sitting **on top of** the existing Dynamics 365 backend — the frontend adapts to the data structures already available in the backend, not the reverse. Enrichment features (consumption signals, news feeds, opportunity scoring) are handled via lightweight, **non-intrusive external API calls** that remain fully isolated from the Dynamics backend, eliminating integration risk while enabling progressive enhancement.

### What Makes This Special

This dashboard is built around a strict **zero-friction philosophy**, inspired by best-in-class CRMs but tailored to OVHcloud's specific B2B Account Management workflows:

- **Zero-Friction Activity Logging:** Persistent floating modals (HubSpot-style) allow call logging, meeting creation, and AI-powered transcription (Greffier/Gladia) from any screen without context-switching.
- **NIC-Aware Account Hierarchy:** Full Parent/Child account tree grouping multiple NICs (OVHcloud unique identifiers) under a master account, with consolidated views of contracts, consumption, and history.
- **Power Mapping:** Visual org-chart of stakeholders within each account (Decision Maker, Influencer, Operational) with "met/not met" status tracking — directly embedded in the Account view.
- **Intelligent Opportunity Scoring:** Hybrid internal/external scoring (web signals, SIRET-based IT budget estimates, hiring signals) to prioritize the right bets.
- **Embedded Delivery Tracking:** Real-time order status within Opportunities, eliminating NIC copy-paste between tools.
- **Contract Repository:** Dedicated contract tab on each Account, centralizing renewals and expiry alerts.

---

## Project Classification

### Business Context *(for all stakeholders)*

| Dimension | Value |
|---|---|
| **Product Type** | CRM Dashboard — Account Management Focus |
| **Target Users** | 12 Account Managers (Senior & Junior), OVHcloud Sales |
| **Primary Use Case** | Unified daily cockpit replacing fragmented Dynamics UI |
| **Project Context** | Enhancement of existing system (brownfield) |
| **Delivery Timeline** | Functional prototype with mock data — 48h sprint |

### Technical Architecture Notes *(for developers)*

| Dimension | Value |
|---|---|
| **Implementation** | Pure Frontend Prototype (HTML/CSS/JS or framework TBD) |
| **Data Strategy** | Mock JSON data mirroring Dynamics schema — no live backend calls in prototype |
| **Integration Principle** | **Frontend adapts to existing backend data structures.** The dev handoff involves replacing mock JSON with real Dynamics API calls — no backend modification required. |
| **Enrichment Strategy** | External enrichments (consumption, news, scoring signals) are handled via **isolated, satellite API calls** that never touch the Dynamics backend — zero integration risk. |
| **Handoff Format** | Clean, commented codebase + API Integration Map document listing all required backend endpoints and external API touchpoints |

---

## Success Criteria

### User Success

An Account Manager considers this dashboard successful when:
- All weekly activities, priorities, and account alerts are visible at a glance upon login — without a single additional click.
- Logging a call or meeting takes under 15 seconds from any screen (floating modal).
- The Account view consolidates NIC hierarchy, Power Map, contracts, enrichment data, and delivery status in a single place — eliminating tab-switching entirely.
- External enrichment (news, hiring signals, SIRET-based IT budget estimation) proactively surfaces actionable reasons to call before the AM even thinks to look.

**"Aha!" moment:** The first time an AM opens the dashboard, sees a contract expiring next month for a top account, spots a hiring signal on that same account, and books a call — all within 2 minutes and 3 clicks.

### Business Success

| Horizon | Target | Metric |
|---|---|---|
| **Week 2 (internal team)** | 8 / 12 Key Account Managers | Daily active users post-launch |
| **Month 1 (scale-out)** | 30 / ~60 Sales reps across teams | Daily active users post-rollout |
| **Month 1–3 (executive KPI)** | Improved forecast accuracy | Reduction in CRO-level forecast delta |
| **Ongoing** | 2/3 of active users | Weekly retention rate |

**Executive Sponsor:** Octave (CEO/Founder & CRO alignment) — success is validated when the dashboard generates measurably better pipeline visibility and forecast reliability, positioning the CRM as a strategic revenue tool rather than an administrative burden.

### Technical Success

- The prototype renders fully functional with rich mock data in a modern browser (Chrome, Edge) with no console errors.
- All primary dashboard widgets are interactive: clickable agenda slots, floating activity creation modals (Call / Meeting / Task), account navigation, and alert cards.
- The codebase is clean, commented, and structured so the CRM dev team can replace mock data files with real Dynamics API calls with minimal effort.
- An "API Integration Map" document is delivered alongside the code, listing every data point, its mock source, and its expected real backend endpoint or external API origin.

### Measurable Outcomes

- **Time saved:** Target reduction of 30–45 min/AM/day in administrative navigation (vs. current Dynamics baseline of 45–60 min estimated).
- **Forecast quality:** Measurable improvement in weekly forecast accuracy within 30 days of full-team adoption (CEO/CRO-validated).
- **Adoption speed:** 67% of the core KAM team (8/12) using the dashboard daily by end of Week 2 post-launch.

---

## User Journeys

### Journey 1: Thomas — The Hunter's Morning (Happy Path)

**Persona:** Thomas, 32, Account Manager (Hunter focus). Tech-savvy, used to HubSpot and fast tooling. Currently frustrated by the mismatch between his sales pace and the CRM's sluggishness.

**Opening Scene — The Problem Today:**
Thomas opens his computer at 8:45am. He has 3 tabs open before his first call: Dynamics (for leads), his personal Outlook calendar, and a spreadsheet where he tracks his own follow-up reminders because the CRM's task view is too clunky. He checks the Leads tab in Dynamics. There are 4 new leads. Two are abandoned cart signals — poorly enriched, wrong segment owner, no company context. He spends 20 minutes manually Googling the companies to decide if they're even worth a call. By the time he's ready to dial, he's already lost half his morning momentum.

At the end of Friday, he batch-creates 12 activity logs for the week — calls he made, meetings he had — all in one painful administrative session, because logging each interaction live in Dynamics takes too long and kills his flow.

**Rising Action — With the New Dashboard:**
Thomas logs in. The Dashboard loads instantly. At the top: his KPI bar shows 2 new enriched leads flagged this morning, a pipeline value, and 3 activities due today (auto-surfaced by the agenda widget — none manually hunted for).

He clicks the first lead. The enrichment panel shows: company size, estimated IT budget from SIRET data, 1 recent hire in infrastructure on WTTJ, and an abandoned cart signal from 3 days ago. In 45 seconds, Thomas knows this lead is worth a call.

**Climax — Zero-Friction Logging:**
He dials. Mid-call, he clicks "Log Call" in the persistent floating modal at the bottom of the screen. It pre-fills the account name and date. He types 2 sentences of notes — or dictates them via the Greffier button — while still talking. He hits save. 12 seconds. He doesn't need Friday anymore.

**Resolution — New Reality:**
By end of week, Thomas's pipeline is fully documented in real-time. His manager sees accurate activity data. Thomas reclaims 45 minutes of selling time daily. He refers to it as "the CRM that doesn't slow me down."

**Capabilities Revealed:**
- Enriched lead view (SIRET-based scoring, web signals, hiring signals)
- Persistent floating activity modal (Call, Meeting, Task)
- Speech-to-text integration point (Greffier/Gladia)
- Agenda widget with auto-surfacing of overdue and upcoming activities

---

### Journey 2: Sophie — The Farmer's Account Review (Happy Path)

**Persona:** Sophie, 41, Key Account Manager (Farming focus). Manages a portfolio of strategic accounts. Extremely organized — maintains shadow Excel files and personal notes because the CRM can't hold the context she needs. She doesn't dislike technology; she dislikes tools that make her job harder.

**Opening Scene — The Problem Today:**
Sophie starts her day by opening three things: her personal Excel "Power Map" spreadsheet (with org charts, LinkedIn links, stakeholder notes per account), Tableau (for consumption numbers the CRM displays wrong), and Dynamics (for opportunity status). She switches between all three constantly. When she wants to track a delivery order, she has to copy the NIC into an internal OVHcloud tool, navigate 4 levels to find the relevant sub-segment, and manually update the delivery date back in Dynamics if it slipped. This takes 15–20 minutes per account — just to stay informed.

She also spends 10 minutes each morning reading tech news manually to find conversation starters for her client calls. Some mornings she misses a key signal — a client triggered a cost-reduction initiative, and she didn't hear about it in time.

Finally, once a month she spots "orphaned" accounts in her sector — leads or accounts assigned to "Default Owner" that should be in her portfolio (lost opportunities from 2 years ago that could now be reactivated). Today, she finds them by accident.

**Rising Action — With the New Dashboard:**
Sophie logs in. The Notification Feed on the right panel shows: one strategic account has reduced its cloud consumption by 18% over 30 days (churn risk — call flagged), and another account has increased hosting spend by 34% (upsell signal). Both have a "Call now" shortcut. She didn't need to open Tableau today.

Below, the Agenda shows her two prep calls for this afternoon. She clicks on the 3pm slot. The account panel opens to the right: NIC hierarchy with parent company and 3 child entities grouped, contract expiring in 47 days highlighted in amber, and a news feed showing that this client's CTO published an article about infrastructure modernization this week. Sophie has her conversation opener before the call even starts.

**Climax — Power Map & Delivery Tracking, In One Place:**
For her 11am quarterly review prep, Sophie opens the Account view. She checks the Power Map tab: the org chart shows the decision-maker (CFO, "met"), an influencer she hasn't spoken to yet (VP Engineering, "not met"), and two operational contacts. She adds a note next to the VP Engineering: "intro via CFO — ask next call." No more Excel notebook.

She checks the Delivery Tracker on the open opportunity: the server order is showing a 3-week delay. She updates the forecast date in one click and leaves an internal note. The CRM stays accurate. She doesn't need the NIC lookup tool today.

**Resolution — New Reality:**
Sophie finally uses the CRM *as her primary tool*, not a secondary one she reluctantly logs into. Her notes live inside the system. Her account knowledge compounds. Her manager sees real-time forecast data. And once a quarter, the "Default Owner sweep" widget surfaces 2-3 dormant accounts she can reactivate — additional pipeline she would have missed entirely.

**Capabilities Revealed:**
- Consumption alert widgets (churn risk / upsell detection — external API)
- NIC-Aware Account Hierarchy (parent/child grouping)
- Power Map tab (org chart with role tags, met/not met, notes)
- Contract expiry alerts with timeline visualization
- Delivery Tracker embedded in Opportunity view
- Account news/enrichment feed (conversation starters)
- "Default Owner" account recovery widget

---

### Journey Requirements Summary

| Capability | Thomas (Hunter) | Sophie (Farmer) |
|---|---|---|
| Enriched lead/account view | ✅ Core | ✅ Core |
| Persistent floating activity modal | ✅ Core | ✅ Core |
| Agenda widget (auto-surfaced tasks) | ✅ Core | ✅ Secondary |
| Speech-to-text logging | ✅ Core | ⬜ Optional |
| Consumption alerts (churn/upsell) | ⬜ Optional | ✅ Core |
| NIC hierarchy (parent/child) | ⬜ Optional | ✅ Core |
| Power Map tab | ⬜ Optional | ✅ Core |
| Contract expiry alerts | ⬜ Secondary | ✅ Core |
| Delivery Tracker in Opportunity | ⬜ Secondary | ✅ Core |
| News / Enrichment feed | ✅ Secondary | ✅ Core |
| Default Owner recovery widget | ⬜ Optional | ✅ Secondary |

---

## Domain-Specific Requirements

Ces contraintes découlent du contexte SaaS B2B interne d'OVHcloud et encadrent les choix d'architecture.

### Sécurité & Gouvernance des données
- **Statut interne :** Outil strictement interne — grande flexibilité sur la manipulation des données de consommation ; aucune restriction d'affichage spécifique pour le MVP.
- **Souveraineté des données (Speech-to-Text) :** Greffier et Gladia tournent sur l'infrastructure OVHcloud. Les données vocales ne quittent pas le SI interne.

### Identité & Droits d'Accès
- **Authentification :** Le dashboard s'appuiera sur le SSO interne d'OVHcloud.
- **Permissions :** Héritage strict des droits Dynamics 365 — le dashboard n'introduit aucune nouvelle strate d'autorisation. Rôle unique : Account Manager (dashboard non accessible aux managers ou autres départements).
- **⚠️ Action de suivi :** La technologie SSO exacte (non-Microsoft) est à identifier post-MVP avant l'intégration backend réelle.

---

## Innovation & Patterns Différenciants

Ce dashboard s'inscrit dans une tendance de marché forte : les entreprises abandonnent la customisation CRM au profit de **Sales Engagement Platforms** en surcouche (Outreach, Salesloft). Ce projet en est la version internalisée, sur-mesure pour un hébergeur cloud.

### Axes d'Innovation Détectés

- **Decoupled "Cockpit" Architecture (API Adapter Pattern) :** Un frontend Zero-Friction qui "répare" l'UX de Dynamics 365 sans aucune migration backend — le risque d'intégration est quasi-nul.
- **Workflow Automation via AI :** Modales de saisie persistantes avec Speech-to-Text (Gladia/Greffier) permettant la dictée de comptes-rendus en cours d'appel — élimination de la dette administrative du vendredi soir.
- **Hybrid Opportunity Scoring :** Score dynamique combinant signaux internes (conso Tableau) et open-data (SIRET, WTTJ) pour des triggers d'appels invisibles dans un CRM traditionnel.

### Validation & Plan de Secours

- **Validation de latence :** L'approche API Adapter sera validée lors du passage prototype → Phase 2 (mesure de latence proxy en lecture/écriture simultané).
- **Fallback Speech-to-Text :** Si la retranscription est inexacte sur le vocabulaire cloud (NIC, VLAN, bare-metal...), fallback sur une saisie manuelle optimisée avec templates courts intégrés à la même modale.

---

## Architecture Technique & Intégrations

### Périmètre de Déploiement
- **Instance unique**, exclusivement pour l'équipe AM France (12 utilisateurs). Aucun besoin de multi-géographie ou scalabilité mondiale pour le MVP.

### API Landscape

| Système | Type | Périmètre |
|---|---|---|
| **Dynamics 365** | Proxy lecture/écriture | Core — MVP (mock JSON → Phase 2 : API réelle) |
| **Tableau** | Lecture | Core — Alertes consommation interne |
| **Greffier / Gladia** | Envoi audio / réception texte | Core — Speech-to-Text interne |
| **SIRET** | Open Data | Core — Estimation budget IT |
| **WTTJ** | Open Data | Core — Signaux recrutement tech |
| **Confluence / Jira** | Tickets support liés au NIC | Roadmap — Post-MVP |
| **LinkedIn** | Signaux recrutement | Écarté V1 (scraping trop instable) |

---

## Project Scoping & Phased Development

### MVP Strategy — « Experience MVP » (48h Prototype)

L'objectif du MVP n'est pas de connecter de vrais backends, mais de **prouver par la démonstration** la valeur de la philosophie Zero-Friction via un frontend ultra-réactif alimenté par des mocks JSON riches et réalistes.

**Ressources :** Équipe lean — 1 développeur frontend UI/UX, 1 PM expert métier.

### Phase 1 — MVP (Vendredi)

**Journeys couverts :** Triage des leads (Thomas) + Revue de compte rapide (Sophie).

**Livrables Must-Have :**
- App Shell Dynamics-inspired (navigation latérale).
- Top KPI Bar (Pipeline €, Activités du jour, Opportunités ouvertes).
- My Accounts Panel (tri priorité, NIC grouping, health indicators).
- My Opportunities Panel (Opportunity Score badge, Delivery Tracker progress bar).
- Activity Feed / Notifications (churn, upsell, renouvellement, news).
- Floating "Log Activity" Modal (Call / Meeting / Task, placeholder Speech-to-Text).
- Agenda widget (création d'activité en 1 clic).

### Phase 2 — Growth (Semaines 3–6)

- Remplacement des mocks JSON par l'API proxy Dynamics 365 & Tableau.
- Activation du Speech-to-Text Greffier/Gladia dans la modale.
- Enrichissement automatisé SIRET / WTTJ.
- Vue Account complète : Power Map, onglet Contrats, Delivery Tracker détaillé.

### Phase 3 — Expansion (Mois 2–6)

- Intégration Confluence/Jira (tickets support liés au NIC client).
- Moteur de recommandation "Next Best Action" algorithmique.
- Déploiement multi-équipe (~60 commerciaux, profils Hunter & Farmer).
- Automatisations post-closing (won opportunity → création ordre).

### Risk Mitigation Strategy

| Risque | Mitigation |
|---|---|
| **Latence API Proxy (Phase 2)** | Caching agressif côté frontend (SWR/React Query) |
| **Mauvaise adoption seniors** | UI mimétisme Dynamics — repères visuels familiers, friction retirée silencieusement |
| **Indisponibilité devs backend OVH** | Approche 100% Headless Frontend — mock JSON prouve la valeur avant d'engager la bande passante backend |
| **SSO inconnu** | Prototype sans auth réelle (mock session) — à connecter en Phase 2 |

---

## Functional Requirements

> **Contrat de Capacités — Binding.** Toute capacité non listée ici n'existera pas dans le produit.

### 1. Authentification & Contrôle d'Accès
- FR01 : Un Account Manager peut se connecter au dashboard via le SSO interne d'OVHcloud.
- FR02 : Le système affiche uniquement les données appartenant au portefeuille de l'AM connecté (héritage Dynamics 365 strict).

### 2. Tableau de Bord Principal (Dashboard View)
- FR03 : Un AM peut visualiser une barre KPI en tête de dashboard (pipeline total €, activités du jour, nb d'opportunités ouvertes).
- FR04 : Un AM peut voir un widget Agenda hebdomadaire listant ses activités (appels, réunions, tâches) à venir et en retard.
- FR05 : Un AM peut créer une activité (Appel / Réunion / Tâche) depuis l'Agenda en un clic.
- FR06 : Un AM peut consulter un feed d'alertes et de notifications classées par type (risque churn, signal upsell, renouvellement de contrat, news externe).

### 3. Gestion des Comptes (Account Panel)
- FR07 : Un AM peut consulter la liste de ses comptes triée par priorité.
- FR08 : Un AM peut voir pour chaque compte son statut de santé (indicateur visuel : expiration de contrat, variation de consommation).
- FR09 : Un AM peut naviguer dans la hiérarchie parent/enfant des comptes (groupement de NICs).
- FR10 : Un AM peut accéder à la vue détaillée d'un compte (Post-MVP : Power Map, Contrats, Enrichissements).

### 4. Gestion des Opportunités (Opportunity Pipeline)
- FR11 : Un AM peut consulter la liste de ses opportunités en cours avec leur valeur et leur stade.
- FR12 : Un AM peut voir un badge de score d'opportunité (Opportunity Score) pour chaque opportunité.
- FR13 : Un AM peut consulter l'état d'avancement d'une livraison (Delivery Tracker) depuis l'opportunité, sans naviguer vers un outil externe.

### 5. Logging d'Activité (Zero-Friction Modal)
- FR14 : Un AM peut ouvrir une modale de saisie d'activité flottante depuis n'importe quel écran sans perdre son contexte.
- FR15 : Un AM peut logger un appel, une réunion ou une tâche avec pré-remplissage automatique (compte, date).
- FR16 : Un AM peut dicter ses notes de call via un bouton Speech-to-Text intégré à la modale (Greffier/Gladia).
- FR17 : Un AM peut sauvegarder une activité en moins de 15 secondes depuis l'ouverture de la modale.

### 6. Enrichissement & Signaux Externes
- FR18 : Le système peut afficher des signaux de consommation interne (hausse/baisse %) associés à chaque compte depuis Tableau.
- FR19 : Le système peut afficher des alertes de renouvellement de contrat avec le nombre de jours restants avant expiration.
- FR20 : Le système peut afficher des signaux de recrutement tech (WTTJ) associés à un compte comme signal d'opportunité.
- FR21 : Le système peut afficher un score d'entreprise basé sur des données SIRET (estimation budget IT) sur la fiche account.

### 7. Navigation & Structure Applicative
- FR22 : Un AM peut naviguer entre les sections principales (Dashboard, Accounts, Opportunities, Contacts) via une barre latérale permanente.
- FR23 : Le dashboard affiche une interface familière inspirée de Dynamics 365 pour minimiser la courbe d'apprentissage.
- FR24 : L'application est utilisable sur Chrome et Edge (desktop uniquement, usage interne).

---

## Non-Functional Requirements

### Performance
- NFR01 : Chaque page principale (Dashboard, Accounts, Opportunities) doit s'afficher en moins de 2 secondes sur une connexion réseau interne OVHcloud standard.
- NFR02 : La modale de logging d'activité doit s'ouvrir en moins de 300ms depuis n'importe quel écran.
- NFR03 : Les données mockées doivent être indiscernables de données réelles en termes de temps de chargement (sans latence artificielle dans le prototype).

### Sécurité
- NFR04 : L'accès au dashboard est exclusivement conditionné à une authentification SSO valide (aucun accès anonyme possible).
- NFR05 : Aucune donnée client ne doit être stockée côté navigateur en dehors de la session active (pas de localStorage de données sensibles).
- NFR06 : La technologie SSO exacte est à confirmer post-MVP (en attente de la documentation du SI OVHcloud).

### Intégration
- NFR07 : Le dashboard doit fonctionner en mode « mock data complet » sans aucun appel réseau réel (prototype isolé), permettant une démonstration hors-ligne.
- NFR08 : La structure des mocks JSON doit refléter fidèlement le schéma Dynamics 365 pour permettre une substitution directe par l'API réelle en Phase 2.
- NFR09 : Les enrichissements externes (SIRET, WTTJ) doivent être traités comme des données satellites non bloquantes — une absence de réponse de l'API externe ne doit pas bloquer l'affichage de la fiche compte.

### Fiabilité & Maintenabilité
- NFR10 : Le codebase doit être commenté et structuré pour permettre à un développeur backend tiers de remplacer les mocks JSON par des appels API réels sans refactoring majeur.
- NFR11 : Un document « API Integration Map » doit être livré en parallèle du prototype, listant chaque donnée mockée, sa source simulée et l'endpoint Dynamics/API externe attendu.

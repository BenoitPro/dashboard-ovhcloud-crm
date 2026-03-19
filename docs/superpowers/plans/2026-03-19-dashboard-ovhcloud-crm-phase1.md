# Dashboard OVHcloud CRM 2 — Phase 1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully interactive HTML/CSS/JS prototype of the OVHcloud Account Manager CRM dashboard powered by rich mock JSON data — no backend, no build step, works from a local HTTP server.

**Architecture:** Pure frontend SPA using vanilla JS modules + ES6 imports. A central `app.js` orchestrates routing and component mounting. Mock data lives in JSON files mirroring the Dynamics 365 schema. CSS uses custom properties for the Dynamics 365 Fluent UI design system. Zero framework dependencies — the only optional dev dependency is a local HTTP server.

**Tech Stack:** HTML5, CSS3 (custom properties, CSS Grid, Flexbox), Vanilla JS (ES6 modules), JSON mock data, Python/Node HTTP server for local dev.

---

## Folder Structure

```
/
├── index.html                          # App entry point (SPA shell)
├── css/
│   ├── dynamics-theme.css              # Fluent UI variables (colors, typography, spacing)
│   ├── layout.css                      # Nav sidebar, header, main content grid
│   └── components.css                  # Cards, badges, modals, tables, alerts
├── js/
│   ├── app.js                          # Main entry: router, state, component mount
│   ├── router.js                       # Hash-based routing (#dashboard, #accounts, etc.)
│   ├── state.js                        # Lightweight in-memory store (no framework)
│   ├── data/
│   │   ├── loader.js                   # fetch() wrapper over mock JSON files
│   │   ├── mock-user.json              # AM profile, permissions, session
│   │   ├── mock-accounts.json          # 15 accounts with NIC hierarchy, health, contracts
│   │   ├── mock-opportunities.json     # 20 opportunities with score, delivery, stage
│   │   ├── mock-activities.json        # 30 activities (calls, meetings, tasks)
│   │   └── mock-notifications.json     # 10 notifications (churn, upsell, renewal, news)
│   └── components/
│       ├── nav-sidebar.js              # Left navigation (Dynamics-style)
│       ├── kpi-bar.js                  # Top KPI strip (pipeline €, activities, opps)
│       ├── agenda-widget.js            # Weekly agenda + 1-click activity creation
│       ├── accounts-panel.js           # Account list (priority sort, NIC groups, health)
│       ├── opportunities-panel.js      # Opp list (score badge, delivery tracker)
│       ├── notification-feed.js        # Alert feed (churn/upsell/renewal/news)
│       └── floating-modal.js           # Persistent "Log Activity" modal (Call/Meeting/Task)
├── pages/
│   ├── dashboard.js                    # Composes dashboard view (kpi + agenda + feed + panels)
│   ├── accounts.js                     # Accounts list page
│   ├── account-detail.js               # Account detail (NIC hierarchy, enrichment placeholder)
│   ├── opportunities.js                # Opportunities pipeline page
│   └── contacts.js                     # Contacts placeholder page
└── docs/
    └── api-integration-map.md          # Deliverable: mock → real API mapping
```

---

## Task 1: Project Scaffold & Dev Server

**Files:**
- Create: `index.html`
- Create: `css/dynamics-theme.css`
- Create: `js/app.js` (empty shell)

- [ ] **Step 1: Create index.html**

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OVHcloud CRM — Account Manager Dashboard</title>
  <link rel="stylesheet" href="css/dynamics-theme.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
</head>
<body>
  <div id="app-shell">
    <nav id="nav-sidebar"></nav>
    <main id="main-content">
      <div id="kpi-bar"></div>
      <div id="page-outlet"></div>
    </main>
  </div>
  <div id="floating-modal-container"></div>
  <script type="module" src="js/app.js"></script>
</body>
</html>
```

- [ ] **Step 2: Create css/dynamics-theme.css** (Fluent UI / Dynamics 365 design tokens)

```css
:root {
  /* Fluent UI Brand Colors */
  --color-brand: #0078d4;
  --color-brand-dark: #106ebe;
  --color-brand-darker: #005a9e;
  --color-brand-light: #c7e0f4;
  --color-brand-lightest: #eff6fc;

  /* Neutrals */
  --color-bg: #f3f2f1;
  --color-surface: #ffffff;
  --color-border: #edebe9;
  --color-border-strong: #d2d0ce;
  --color-text-primary: #323130;
  --color-text-secondary: #605e5c;
  --color-text-disabled: #a19f9d;
  --color-nav-bg: #1b1a19;
  --color-nav-text: #c8c6c4;
  --color-nav-hover: #323130;
  --color-nav-active: #0078d4;
  --color-nav-active-bg: rgba(0,120,212,0.15);

  /* Status Colors */
  --color-success: #107c10;
  --color-success-bg: #dff6dd;
  --color-warning: #d83b01;
  --color-warning-bg: #fed9cc;
  --color-amber: #ca5010;
  --color-amber-bg: #fff4ce;
  --color-danger: #a4262c;
  --color-danger-bg: #fde7e9;
  --color-info: #0078d4;
  --color-info-bg: #eff6fc;

  /* Typography */
  --font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  --font-size-xs: 11px;
  --font-size-sm: 12px;
  --font-size-base: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 28px;
  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Elevation */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 8px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06);
  --shadow-lg: 0 16px 32px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06);
  --shadow-modal: 0 24px 48px rgba(0,0,0,0.20);

  /* Layout */
  --nav-width: 220px;
  --header-height: 48px;
  --kpi-height: 72px;
  --modal-width: 480px;
  --border-radius: 4px;
  --border-radius-lg: 8px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background: var(--color-bg);
  overflow: hidden;
  height: 100vh;
}
```

- [ ] **Step 3: Create js/app.js** (empty entry point stub)

```js
// OVHcloud CRM Dashboard — Main Entry
// Replace mock data imports with real Dynamics API calls in Phase 2

console.log('[CRM] App initializing...');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[CRM] DOM ready — Phase 1 MVP');
});
```

- [ ] **Step 4: Start local server and verify index.html loads**

```bash
cd "/Users/benoit/Documents/Antigravity_Dev/Dashboard OVHcloud CRM 2"
python3 -m http.server 8080
```

Open `http://localhost:8080` — expect: blank white page, no console errors.

---

## Task 2: Mock JSON Data (Dynamics-Schema-Aligned)

**Files:**
- Create: `js/data/mock-user.json`
- Create: `js/data/mock-accounts.json`
- Create: `js/data/mock-opportunities.json`
- Create: `js/data/mock-activities.json`
- Create: `js/data/mock-notifications.json`
- Create: `js/data/loader.js`

- [ ] **Step 1: Create mock-user.json**

```json
{
  "id": "am-thomas-001",
  "firstName": "Thomas",
  "lastName": "Dupont",
  "email": "thomas.dupont@ovhcloud.com",
  "role": "Account Manager",
  "avatar": "TD",
  "pipeline_total_eur": 842000,
  "activities_today": 4,
  "open_opportunities": 17
}
```

- [ ] **Step 2: Create mock-accounts.json** (15 accounts, NIC hierarchy, health signals)

```json
[
  {
    "id": "acc-001",
    "name": "Decathlon Group",
    "nic_parent": "DEC-12345",
    "nic_children": ["DEC-12345-A", "DEC-12345-B", "DEC-12345-C"],
    "priority": 1,
    "health": "warning",
    "health_reason": "Contract expiring in 47 days",
    "contract_expiry_days": 47,
    "consumption_delta_pct": -18,
    "consumption_signal": "churn_risk",
    "siret_score": 87,
    "siret_budget_est_eur": 2400000,
    "wttj_signal": "2 DevOps hires (Cloud infra)",
    "news_snippet": "Decathlon annonce sa migration cloud européenne — Q2 2026",
    "sector": "Retail",
    "country": "FR",
    "am_id": "am-thomas-001",
    "power_map": [
      {"name": "Marc Lebrun", "role": "CFO", "status": "Decision Maker", "met": true},
      {"name": "Laure Simon", "role": "VP Engineering", "status": "Influencer", "met": false},
      {"name": "Kevin Roy", "role": "SysAdmin", "status": "Operational", "met": true}
    ]
  },
  {
    "id": "acc-002",
    "name": "Engie Digital",
    "nic_parent": "ENG-99001",
    "nic_children": ["ENG-99001-A"],
    "priority": 2,
    "health": "good",
    "health_reason": null,
    "contract_expiry_days": 180,
    "consumption_delta_pct": 34,
    "consumption_signal": "upsell",
    "siret_score": 91,
    "siret_budget_est_eur": 5100000,
    "wttj_signal": "4 Cloud Architect hires",
    "news_snippet": "Engie signe un accord de souveraineté numérique avec OVHcloud",
    "sector": "Energy",
    "country": "FR",
    "am_id": "am-thomas-001",
    "power_map": [
      {"name": "Sophie Marchand", "role": "CTO", "status": "Decision Maker", "met": true},
      {"name": "Romain Blais", "role": "Head of Infra", "status": "Operational", "met": true}
    ]
  },
  {
    "id": "acc-003",
    "name": "Société Générale",
    "nic_parent": "SG-44201",
    "nic_children": ["SG-44201-A", "SG-44201-B"],
    "priority": 3,
    "health": "critical",
    "health_reason": "Contract expiring in 12 days",
    "contract_expiry_days": 12,
    "consumption_delta_pct": -5,
    "consumption_signal": "stable",
    "siret_score": 95,
    "siret_budget_est_eur": 8900000,
    "wttj_signal": null,
    "news_snippet": null,
    "sector": "Finance",
    "country": "FR",
    "am_id": "am-thomas-001",
    "power_map": [
      {"name": "Pierre Duval", "role": "CISO", "status": "Decision Maker", "met": false}
    ]
  },
  {
    "id": "acc-004",
    "name": "Leroy Merlin",
    "nic_parent": "LM-77301",
    "nic_children": [],
    "priority": 4,
    "health": "good",
    "health_reason": null,
    "contract_expiry_days": 365,
    "consumption_delta_pct": 8,
    "consumption_signal": "stable",
    "siret_score": 74,
    "siret_budget_est_eur": 1200000,
    "wttj_signal": "1 Cloud Engineer hire",
    "news_snippet": null,
    "sector": "Retail",
    "country": "FR",
    "am_id": "am-thomas-001",
    "power_map": []
  },
  {
    "id": "acc-005",
    "name": "Air France - KLM",
    "nic_parent": "AF-55501",
    "nic_children": ["AF-55501-A"],
    "priority": 5,
    "health": "warning",
    "health_reason": "Contract expiring in 62 days",
    "contract_expiry_days": 62,
    "consumption_delta_pct": 2,
    "consumption_signal": "stable",
    "siret_score": 88,
    "siret_budget_est_eur": 3200000,
    "wttj_signal": null,
    "news_snippet": "Air France-KLM cherche à réduire ses coûts cloud de 30% en 2026",
    "sector": "Transport",
    "country": "FR",
    "am_id": "am-thomas-001",
    "power_map": [
      {"name": "Isabelle Faure", "role": "IT Director", "status": "Decision Maker", "met": true}
    ]
  }
]
```

- [ ] **Step 3: Create mock-opportunities.json** (20 opportunities)

```json
[
  {
    "id": "opp-001",
    "name": "Decathlon — Migration Bare Metal Q3",
    "account_id": "acc-001",
    "account_name": "Decathlon Group",
    "value_eur": 120000,
    "stage": "Proposal",
    "stage_pct": 60,
    "score": 82,
    "score_label": "Hot",
    "score_color": "success",
    "delivery_status": "In Progress",
    "delivery_pct": 45,
    "delivery_note": "Server order delayed 3 weeks — supplier constraint",
    "close_date": "2026-05-15",
    "am_id": "am-thomas-001"
  },
  {
    "id": "opp-002",
    "name": "Engie — Public Cloud Expansion",
    "account_id": "acc-002",
    "account_name": "Engie Digital",
    "value_eur": 280000,
    "stage": "Negotiation",
    "stage_pct": 80,
    "score": 91,
    "score_label": "Hot",
    "score_color": "success",
    "delivery_status": "Pending",
    "delivery_pct": 0,
    "delivery_note": "Awaiting signed order",
    "close_date": "2026-04-01",
    "am_id": "am-thomas-001"
  },
  {
    "id": "opp-003",
    "name": "Société Générale — Renouvellement Contrat Annuel",
    "account_id": "acc-003",
    "account_name": "Société Générale",
    "value_eur": 450000,
    "stage": "Closing",
    "stage_pct": 90,
    "score": 95,
    "score_label": "Critical",
    "score_color": "warning",
    "delivery_status": "Not Started",
    "delivery_pct": 0,
    "delivery_note": "Contract must be signed before delivery launch",
    "close_date": "2026-03-31",
    "am_id": "am-thomas-001"
  },
  {
    "id": "opp-004",
    "name": "Leroy Merlin — Hosted Private Cloud",
    "account_id": "acc-004",
    "account_name": "Leroy Merlin",
    "value_eur": 65000,
    "stage": "Discovery",
    "stage_pct": 20,
    "score": 54,
    "score_label": "Warm",
    "score_color": "info",
    "delivery_status": "Not Started",
    "delivery_pct": 0,
    "delivery_note": null,
    "close_date": "2026-07-01",
    "am_id": "am-thomas-001"
  },
  {
    "id": "opp-005",
    "name": "Air France — Disaster Recovery OVH",
    "account_id": "acc-005",
    "account_name": "Air France - KLM",
    "value_eur": 95000,
    "stage": "Qualification",
    "stage_pct": 40,
    "score": 67,
    "score_label": "Warm",
    "score_color": "info",
    "delivery_status": "Not Started",
    "delivery_pct": 0,
    "delivery_note": null,
    "close_date": "2026-06-15",
    "am_id": "am-thomas-001"
  }
]
```

- [ ] **Step 4: Create mock-activities.json**

```json
[
  {
    "id": "act-001",
    "type": "call",
    "subject": "Suivi contrat renouvellement",
    "account_id": "acc-003",
    "account_name": "Société Générale",
    "opp_id": "opp-003",
    "due_date": "2026-03-19T10:00:00",
    "status": "overdue",
    "notes": null,
    "am_id": "am-thomas-001"
  },
  {
    "id": "act-002",
    "type": "meeting",
    "subject": "Quarterly Business Review — Engie",
    "account_id": "acc-002",
    "account_name": "Engie Digital",
    "opp_id": "opp-002",
    "due_date": "2026-03-19T15:00:00",
    "status": "upcoming",
    "notes": "Préparer slides pipeline + expansion Public Cloud",
    "am_id": "am-thomas-001"
  },
  {
    "id": "act-003",
    "type": "task",
    "subject": "Envoyer proposition commerciale Leroy Merlin",
    "account_id": "acc-004",
    "account_name": "Leroy Merlin",
    "opp_id": "opp-004",
    "due_date": "2026-03-20T17:00:00",
    "status": "upcoming",
    "notes": null,
    "am_id": "am-thomas-001"
  },
  {
    "id": "act-004",
    "type": "call",
    "subject": "Point livraison Bare Metal Decathlon",
    "account_id": "acc-001",
    "account_name": "Decathlon Group",
    "opp_id": "opp-001",
    "due_date": "2026-03-21T09:30:00",
    "status": "upcoming",
    "notes": null,
    "am_id": "am-thomas-001"
  }
]
```

- [ ] **Step 5: Create mock-notifications.json**

```json
[
  {
    "id": "notif-001",
    "type": "churn_risk",
    "title": "Risque churn — Decathlon",
    "body": "Consommation cloud en baisse de 18% sur 30 jours. Contrat expire dans 47 jours.",
    "account_id": "acc-001",
    "urgency": "high",
    "cta": "Appeler maintenant",
    "timestamp": "2026-03-19T07:30:00"
  },
  {
    "id": "notif-002",
    "type": "upsell",
    "title": "Signal upsell — Engie Digital",
    "body": "Hausse de consommation +34% sur 30 jours. 4 offres d'emploi Cloud Architect actives.",
    "account_id": "acc-002",
    "urgency": "medium",
    "cta": "Voir l'opportunité",
    "timestamp": "2026-03-19T07:45:00"
  },
  {
    "id": "notif-003",
    "type": "renewal",
    "title": "Renouvellement critique — Société Générale",
    "body": "Contrat expire dans 12 jours. Aucune action enregistrée cette semaine.",
    "account_id": "acc-003",
    "urgency": "critical",
    "cta": "Voir le contrat",
    "timestamp": "2026-03-19T08:00:00"
  },
  {
    "id": "notif-004",
    "type": "news",
    "title": "News — Air France-KLM",
    "body": "Air France-KLM cherche à réduire ses coûts cloud de 30% — article Les Echos.",
    "account_id": "acc-005",
    "urgency": "low",
    "cta": "Lire l'article",
    "timestamp": "2026-03-19T08:30:00"
  }
]
```

- [ ] **Step 6: Create js/data/loader.js**

```js
// Data loader — Phase 1: reads mock JSON files
// Phase 2: replace fetch paths with Dynamics 365 API endpoints
// See docs/api-integration-map.md for endpoint mapping

const BASE = './js/data/';

export async function loadUser() {
  const r = await fetch(`${BASE}mock-user.json`);
  return r.json();
}

export async function loadAccounts() {
  const r = await fetch(`${BASE}mock-accounts.json`);
  return r.json();
}

export async function loadOpportunities() {
  const r = await fetch(`${BASE}mock-opportunities.json`);
  return r.json();
}

export async function loadActivities() {
  const r = await fetch(`${BASE}mock-activities.json`);
  return r.json();
}

export async function loadNotifications() {
  const r = await fetch(`${BASE}mock-notifications.json`);
  return r.json();
}

// Load all data in parallel
export async function loadAll() {
  const [user, accounts, opportunities, activities, notifications] =
    await Promise.all([
      loadUser(),
      loadAccounts(),
      loadOpportunities(),
      loadActivities(),
      loadNotifications()
    ]);
  return { user, accounts, opportunities, activities, notifications };
}
```

- [ ] **Step 7: Verify data loads — update app.js temporarily**

```js
import { loadAll } from './data/loader.js';

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadAll();
  console.assert(data.accounts.length > 0, 'Accounts loaded');
  console.assert(data.user.firstName === 'Thomas', 'User loaded');
  console.log('[CRM] Mock data loaded ✓', data);
});
```

Open `http://localhost:8080`, check console: no errors, data object logged.

---

## Task 3: Layout & Navigation

**Files:**
- Create: `css/layout.css`
- Create: `js/router.js`
- Create: `js/state.js`
- Create: `js/components/nav-sidebar.js`

- [ ] **Step 1: Create css/layout.css**

```css
/* ===== APP SHELL ===== */
#app-shell {
  display: grid;
  grid-template-columns: var(--nav-width) 1fr;
  grid-template-rows: 1fr;
  height: 100vh;
  overflow: hidden;
}

/* ===== LEFT NAV ===== */
#nav-sidebar {
  background: var(--color-nav-bg);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-logo {
  padding: var(--space-4) var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  min-height: var(--header-height);
}

.nav-logo-text {
  color: #ffffff;
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.nav-logo-sub {
  color: var(--color-nav-text);
  font-size: var(--font-size-xs);
}

.nav-section-label {
  padding: var(--space-4) var(--space-4) var(--space-2);
  color: var(--color-text-disabled);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  color: var(--color-nav-text);
  cursor: pointer;
  border-radius: 0;
  transition: background 0.1s, color 0.1s;
  font-size: var(--font-size-base);
  border-left: 3px solid transparent;
  text-decoration: none;
  user-select: none;
}

.nav-item:hover {
  background: var(--color-nav-hover);
  color: #ffffff;
}

.nav-item.active {
  background: var(--color-nav-active-bg);
  color: var(--color-brand-light);
  border-left-color: var(--color-nav-active);
  font-weight: var(--font-weight-semibold);
}

.nav-item .nav-icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
  flex-shrink: 0;
}

.nav-badge {
  margin-left: auto;
  background: var(--color-brand);
  color: white;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.nav-user {
  margin-top: auto;
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-nav-text);
}

.nav-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-brand);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ===== MAIN CONTENT ===== */
#main-content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--color-bg);
}

#kpi-bar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
  min-height: var(--kpi-height);
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  gap: var(--space-8);
}

#page-outlet {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-5) var(--space-6);
  display: grid;
  gap: var(--space-5);
}

/* Dashboard 2-column layout */
#page-outlet.layout-dashboard {
  grid-template-columns: 1fr 340px;
  grid-template-rows: auto 1fr;
  align-content: start;
}

/* ===== FLOATING MODAL OVERLAY ===== */
#floating-modal-container {
  position: fixed;
  bottom: var(--space-5);
  right: var(--space-5);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: var(--space-3);
}
```

- [ ] **Step 2: Create js/state.js**

```js
// Lightweight in-memory state store
// Phase 2: replace with React Query / SWR cache

let _state = {};
const _listeners = new Set();

export function getState() { return _state; }

export function setState(partial) {
  _state = { ..._state, ...partial };
  _listeners.forEach(fn => fn(_state));
}

export function subscribe(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}
```

- [ ] **Step 3: Create js/router.js**

```js
// Hash-based router — #dashboard, #accounts, #opportunities, #contacts
const routes = {};

export function registerRoute(hash, handler) {
  routes[hash] = handler;
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function initRouter() {
  const handle = () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    const handler = routes[hash] || routes['dashboard'];
    if (handler) handler(hash);
    // Update nav active state
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === hash);
    });
  };
  window.addEventListener('hashchange', handle);
  handle(); // run on load
}
```

- [ ] **Step 4: Create js/components/nav-sidebar.js**

```js
import { navigate } from '../router.js';

export function renderNavSidebar(container, user) {
  container.innerHTML = `
    <div class="nav-logo">
      <div class="nav-avatar" style="background: #0078d4">${user.avatar}</div>
      <div>
        <div class="nav-logo-text">OVHcloud CRM</div>
        <div class="nav-logo-sub">Account Manager</div>
      </div>
    </div>

    <div class="nav-section-label">Principal</div>

    <a class="nav-item active" data-route="dashboard" href="#dashboard">
      <span class="nav-icon">⊞</span> Dashboard
    </a>
    <a class="nav-item" data-route="accounts" href="#accounts">
      <span class="nav-icon">🏢</span> Comptes
      <span class="nav-badge">15</span>
    </a>
    <a class="nav-item" data-route="opportunities" href="#opportunities">
      <span class="nav-icon">◈</span> Opportunités
      <span class="nav-badge">17</span>
    </a>
    <a class="nav-item" data-route="contacts" href="#contacts">
      <span class="nav-icon">👤</span> Contacts
    </a>

    <div class="nav-section-label">Activité</div>

    <a class="nav-item" data-route="activities" href="#activities">
      <span class="nav-icon">📋</span> Activités
    </a>
    <a class="nav-item" data-route="reports" href="#reports">
      <span class="nav-icon">📊</span> Rapports
    </a>

    <div class="nav-user">
      <div class="nav-avatar">${user.avatar}</div>
      <div style="min-width:0">
        <div style="color:#fff;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${user.firstName} ${user.lastName}
        </div>
        <div style="font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${user.email}
        </div>
      </div>
    </div>
  `;
}
```

- [ ] **Step 5: Update app.js to render nav & test routing**

```js
import { loadAll } from './data/loader.js';
import { initRouter, registerRoute } from './router.js';
import { setState } from './state.js';
import { renderNavSidebar } from './components/nav-sidebar.js';

document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadAll();
  setState(data);

  // Render persistent chrome
  renderNavSidebar(document.getElementById('nav-sidebar'), data.user);

  // Register stub routes
  registerRoute('dashboard', () => {
    document.getElementById('page-outlet').className = 'layout-dashboard';
    document.getElementById('page-outlet').innerHTML = '<p style="color:#605e5c;padding:16px">Dashboard — loading...</p>';
  });
  registerRoute('accounts', () => {
    document.getElementById('page-outlet').className = '';
    document.getElementById('page-outlet').innerHTML = '<p style="color:#605e5c;padding:16px">Accounts — loading...</p>';
  });
  registerRoute('opportunities', () => {
    document.getElementById('page-outlet').className = '';
    document.getElementById('page-outlet').innerHTML = '<p style="color:#605e5c;padding:16px">Opportunities — loading...</p>';
  });
  registerRoute('contacts', () => {
    document.getElementById('page-outlet').className = '';
    document.getElementById('page-outlet').innerHTML = '<p style="color:#605e5c;padding:16px">Contacts — coming soon</p>';
  });
  registerRoute('activities', () => {
    document.getElementById('page-outlet').className = '';
    document.getElementById('page-outlet').innerHTML = '<p style="color:#605e5c;padding:16px">Activités — disponible en Phase 2</p>';
  });
  registerRoute('reports', () => {
    document.getElementById('page-outlet').className = '';
    document.getElementById('page-outlet').innerHTML = '<p style="color:#605e5c;padding:16px">Rapports — disponible en Phase 2</p>';
  });

  initRouter();
});
```

- [ ] **Step 6: Verify layout in browser**

Expect: Dark left nav with OVHcloud CRM branding + user avatar, nav items visible, clicking routes updates content. No console errors.

---

## Task 4: Components CSS

**Files:**
- Create: `css/components.css`

- [ ] **Step 1: Create css/components.css**

```css
/* ===== KPI BAR ===== */
.kpi-metric {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 140px;
}

.kpi-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--font-weight-semibold);
}

.kpi-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.kpi-value.green { color: var(--color-success); }
.kpi-value.blue  { color: var(--color-brand); }

.kpi-divider {
  width: 1px;
  height: 40px;
  background: var(--color-border);
  align-self: center;
}

/* ===== CARDS ===== */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.card-body {
  padding: var(--space-4);
}

/* ===== BADGES ===== */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  line-height: 1.4;
  white-space: nowrap;
}

.badge-success { background: var(--color-success-bg); color: var(--color-success); }
.badge-warning { background: var(--color-warning-bg); color: var(--color-warning); }
.badge-info    { background: var(--color-info-bg);    color: var(--color-info); }
.badge-danger  { background: var(--color-danger-bg);  color: var(--color-danger); }
.badge-neutral { background: var(--color-border);     color: var(--color-text-secondary); }

/* ===== HEALTH INDICATOR ===== */
.health-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.health-dot.good     { background: var(--color-success); }
.health-dot.warning  { background: var(--color-amber); }
.health-dot.critical { background: var(--color-danger); }

/* ===== DATA LIST ROWS ===== */
.list-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 0.1s;
  min-height: 52px;
}

.list-row:last-child { border-bottom: none; }
.list-row:hover { background: var(--color-brand-lightest); }
.list-row:hover .row-name { color: var(--color-brand); }

.row-name {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-meta {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.nic-chip {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background: var(--color-border);
  border-radius: 3px;
  padding: 1px 5px;
  font-family: 'Consolas', monospace;
}

/* ===== PROGRESS BAR ===== */
.progress-wrap {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  background: var(--color-brand);
  transition: width 0.3s ease;
}

.progress-fill.danger  { background: var(--color-danger); }
.progress-fill.warning { background: var(--color-amber); }
.progress-fill.success { background: var(--color-success); }

.progress-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
  min-width: 30px;
  text-align: right;
}

/* ===== SCORE BADGE ===== */
.score-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  flex-shrink: 0;
  border: 2px solid;
}
.score-badge.success { border-color: var(--color-success); color: var(--color-success); }
.score-badge.info    { border-color: var(--color-info);    color: var(--color-info); }
.score-badge.warning { border-color: var(--color-amber);   color: var(--color-amber); }
.score-badge.danger  { border-color: var(--color-danger);  color: var(--color-danger); }

/* ===== NOTIFICATION CARD ===== */
.notif-card {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 0.1s;
  align-items: flex-start;
}
.notif-card:last-child { border-bottom: none; }
.notif-card:hover { background: var(--color-brand-lightest); }

.notif-icon {
  font-size: 18px;
  width: 28px;
  text-align: center;
  flex-shrink: 0;
  padding-top: 2px;
}

.notif-content { flex: 1; min-width: 0; }
.notif-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  margin-bottom: 2px;
}
.notif-body {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
}
.notif-cta {
  font-size: var(--font-size-sm);
  color: var(--color-brand);
  font-weight: var(--font-weight-semibold);
  margin-top: 4px;
  display: inline-block;
}
.notif-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
  white-space: nowrap;
  padding-top: 4px;
}

.notif-strip.critical { border-left: 3px solid var(--color-danger); }
.notif-strip.high     { border-left: 3px solid var(--color-amber); }
.notif-strip.medium   { border-left: 3px solid var(--color-brand); }
.notif-strip.low      { border-left: 3px solid var(--color-border-strong); }

/* ===== AGENDA ITEM ===== */
.agenda-item {
  display: flex;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  cursor: pointer;
  transition: background 0.1s;
}
.agenda-item:last-child { border-bottom: none; }
.agenda-item:hover { background: var(--color-brand-lightest); }

.agenda-time {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  width: 50px;
  text-align: right;
  flex-shrink: 0;
}
.agenda-time.overdue { color: var(--color-danger); font-weight: var(--font-weight-semibold); }

.agenda-type-icon {
  font-size: 14px;
  width: 22px;
  text-align: center;
  flex-shrink: 0;
}

.agenda-subject {
  flex: 1;
  font-size: var(--font-size-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.agenda-account {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* ===== BUTTONS ===== */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 6px 16px;
  border-radius: var(--border-radius);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.1s, border-color 0.1s, color 0.1s;
  white-space: nowrap;
}

.btn-primary {
  background: var(--color-brand);
  color: white;
  border-color: var(--color-brand);
}
.btn-primary:hover { background: var(--color-brand-dark); border-color: var(--color-brand-dark); }

.btn-secondary {
  background: transparent;
  color: var(--color-brand);
  border-color: var(--color-brand);
}
.btn-secondary:hover { background: var(--color-brand-lightest); }

.btn-ghost {
  background: transparent;
  color: var(--color-text-secondary);
  border-color: var(--color-border-strong);
}
.btn-ghost:hover { background: var(--color-border); }

.btn-sm { padding: 4px 10px; font-size: var(--font-size-sm); }
.btn-fab {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-brand);
  color: white;
  font-size: 24px;
  border: none;
  box-shadow: var(--shadow-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.1s, box-shadow 0.1s;
}
.btn-fab:hover { background: var(--color-brand-dark); box-shadow: var(--shadow-lg); }

/* ===== MODAL ===== */
.modal-float {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-modal);
  width: var(--modal-width);
  border: 1px solid var(--color-border);
  overflow: hidden;
  animation: slideUp 0.18s ease-out;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--color-brand);
  color: white;
}

.modal-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
}

.modal-close {
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  opacity: 0.8;
  transition: opacity 0.1s;
}
.modal-close:hover { opacity: 1; }

.modal-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
}

.modal-tab {
  flex: 1;
  padding: var(--space-2) var(--space-4);
  text-align: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.1s, border-color 0.1s;
}
.modal-tab.active {
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
}
.modal-tab:hover:not(.active) { color: var(--color-text-primary); }

.modal-body { padding: var(--space-4); display: flex; flex-direction: column; gap: var(--space-3); }
.modal-footer { padding: var(--space-3) var(--space-4); border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; gap: var(--space-2); }

/* ===== FORM FIELDS ===== */
.field-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  margin-bottom: 4px;
  display: block;
}

.field-input, .field-select, .field-textarea {
  width: 100%;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--border-radius);
  padding: 6px 10px;
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background: var(--color-surface);
  outline: none;
  transition: border-color 0.1s, box-shadow 0.1s;
}

.field-input:focus, .field-select:focus, .field-textarea:focus {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 2px var(--color-brand-light);
}

.field-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.field-stt {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
}

.btn-stt {
  flex-shrink: 0;
  background: none;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--border-radius);
  padding: 6px 10px;
  cursor: pointer;
  font-size: 18px;
  transition: background 0.1s;
  color: var(--color-text-secondary);
}
.btn-stt:hover { background: var(--color-border); color: var(--color-brand); }
.btn-stt.recording { background: var(--color-danger-bg); border-color: var(--color-danger); color: var(--color-danger); animation: pulse 1s infinite; }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ===== ACCOUNT DETAIL ===== */
.account-detail-header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-5);
  padding: var(--space-5) var(--space-6);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}

.account-name-xl {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1.1;
}

.nic-tree {
  margin: var(--space-2) 0;
  padding-left: var(--space-4);
  border-left: 2px solid var(--color-border);
}

.nic-tree-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 2px 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* ===== POWER MAP ===== */
.power-map {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.power-card {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--space-3);
  min-width: 160px;
  position: relative;
}

.power-card.not-met {
  border-style: dashed;
}

.power-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: var(--font-weight-semibold);
  margin-bottom: 4px;
}

.power-name {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
}

.power-status-tag {
  font-size: var(--font-size-xs);
  margin-top: 4px;
  font-weight: var(--font-weight-semibold);
}

.power-met-badge {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  font-size: 10px;
  padding: 1px 5px;
  border-radius: 8px;
}
.power-met-badge.met { background: var(--color-success-bg); color: var(--color-success); }
.power-met-badge.not-met { background: var(--color-border); color: var(--color-text-secondary); }
```

- [ ] **Step 2: Verify CSS loads without errors**

Reload `http://localhost:8080` — check console, no CSS errors. Nav should look styled.

---

## Task 5: KPI Bar Component

**Files:**
- Create: `js/components/kpi-bar.js`

- [ ] **Step 1: Create js/components/kpi-bar.js**

```js
export function renderKpiBar(container, user) {
  const fmt = (n) => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(n);

  container.innerHTML = `
    <div class="kpi-metric">
      <span class="kpi-label">Pipeline Total</span>
      <span class="kpi-value blue">${fmt(user.pipeline_total_eur)}</span>
    </div>
    <div class="kpi-divider"></div>
    <div class="kpi-metric">
      <span class="kpi-label">Activités Aujourd'hui</span>
      <span class="kpi-value">${user.activities_today}</span>
    </div>
    <div class="kpi-divider"></div>
    <div class="kpi-metric">
      <span class="kpi-label">Opportunités Ouvertes</span>
      <span class="kpi-value">${user.open_opportunities}</span>
    </div>
    <div style="margin-left:auto">
      <button class="btn btn-primary" id="btn-log-activity">+ Logger une activité</button>
    </div>
  `;
}
```

- [ ] **Step 2: Wire KPI bar in app.js and verify**

Add to app.js after state set:
```js
import { renderKpiBar } from './components/kpi-bar.js';
// inside DOMContentLoaded:
renderKpiBar(document.getElementById('kpi-bar'), data.user);
```

Verify: three KPI metrics visible in header bar with Dynamics styling.

---

## Task 6: Dashboard Page — Accounts Panel

**Files:**
- Create: `js/components/accounts-panel.js`
- Create: `js/pages/dashboard.js`

- [ ] **Step 1: Create js/components/accounts-panel.js**

```js
const HEALTH_ICONS = { good: '🟢', warning: '🟡', critical: '🔴' };

function healthBadge(account) {
  if (account.health === 'critical') return `<span class="badge badge-danger">${account.contract_expiry_days}j</span>`;
  if (account.health === 'warning') return `<span class="badge badge-warning">${account.contract_expiry_days}j</span>`;
  return '';
}

function consumptionChip(account) {
  const d = account.consumption_delta_pct;
  if (!d) return '';
  const cls = d > 0 ? 'badge-success' : 'badge-danger';
  const arrow = d > 0 ? '↑' : '↓';
  return `<span class="badge ${cls}">${arrow}${Math.abs(d)}%</span>`;
}

export function renderAccountsPanel(container, accounts) {
  // Sort by priority
  const sorted = [...accounts].sort((a, b) => a.priority - b.priority);
  const rows = sorted.map(acc => `
    <div class="list-row" data-account-id="${acc.id}" onclick="window.location.hash='account-${acc.id}'">
      <div class="health-dot ${acc.health}"></div>
      <div style="flex:1;min-width:0">
        <div class="row-name">${acc.name}</div>
        <div style="display:flex;gap:4px;align-items:center;margin-top:2px">
          <span class="nic-chip">${acc.nic_parent}</span>
          ${acc.nic_children.length > 0 ? `<span class="row-meta">+${acc.nic_children.length} NICs</span>` : ''}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
        ${consumptionChip(acc)}
        ${healthBadge(acc)}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Mes Comptes</span>
        <button class="btn btn-ghost btn-sm" onclick="window.location.hash='accounts'">Voir tous →</button>
      </div>
      ${rows}
    </div>
  `;
}
```

- [ ] **Step 2: Create js/components/opportunities-panel.js**

```js
export function renderOpportunitiesPanel(container, opportunities) {
  const fmt = (n) => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(n);

  const rows = opportunities.slice(0, 5).map(opp => `
    <div class="list-row">
      <div class="score-badge ${opp.score_color}">${opp.score}</div>
      <div style="flex:1;min-width:0">
        <div class="row-name">${opp.name}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
          <div class="progress-wrap" style="flex:1;max-width:120px">
            <div class="progress-bar">
              <div class="progress-fill" style="width:${opp.stage_pct}%"></div>
            </div>
            <span class="progress-label">${opp.stage}</span>
          </div>
          ${opp.delivery_pct > 0 ? `
          <div class="progress-wrap" style="flex:1;max-width:100px">
            <div class="progress-bar">
              <div class="progress-fill warning" style="width:${opp.delivery_pct}%"></div>
            </div>
            <span class="progress-label" style="color:var(--color-amber)">Livr. ${opp.delivery_pct}%</span>
          </div>` : ''}
        </div>
      </div>
      <div class="row-meta" style="text-align:right;flex-shrink:0">
        <div style="font-weight:600;color:var(--color-text-primary)">${fmt(opp.value_eur)}</div>
        <div style="font-size:11px">${opp.close_date}</div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Pipeline Opportunités</span>
        <button class="btn btn-ghost btn-sm" onclick="window.location.hash='opportunities'">Voir tous →</button>
      </div>
      ${rows}
    </div>
  `;
}
```

- [ ] **Step 3: Create js/components/notification-feed.js**

```js
const NOTIF_ICONS = {
  churn_risk: '⚠️',
  upsell: '📈',
  renewal: '🔔',
  news: '📰'
};

function timeAgo(timestamp) {
  const diff = Date.now() - new Date(timestamp).getTime();
  const m = Math.round(diff / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.round(m / 60)}h`;
}

export function renderNotificationFeed(container, notifications) {
  const items = notifications.map(n => `
    <div class="notif-card notif-strip ${n.urgency}">
      <div class="notif-icon">${NOTIF_ICONS[n.type] || '📌'}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-body">${n.body}</div>
        <span class="notif-cta">${n.cta} →</span>
      </div>
      <div class="notif-time">${timeAgo(n.timestamp)}</div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="card" style="grid-column:2;grid-row:1/3">
      <div class="card-header">
        <span class="card-title">Alertes & Notifications</span>
        <span class="badge badge-danger">${notifications.filter(n=>n.urgency==='critical').length}</span>
      </div>
      ${items}
    </div>
  `;
}
```

- [ ] **Step 4: Create js/components/agenda-widget.js**

```js
const ACTIVITY_ICONS = { call: '📞', meeting: '📅', task: '✅' };

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function renderAgendaWidget(container, activities, onCreateActivity) {
  const today = new Date().toDateString();
  const todayActivities = activities
    .filter(a => new Date(a.due_date).toDateString() === today ||
                 new Date(a.due_date) < new Date())
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date));

  const upcoming = activities
    .filter(a => new Date(a.due_date).toDateString() !== today && new Date(a.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 3);

  const renderItem = (a) => `
    <div class="agenda-item">
      <span class="agenda-time ${a.status === 'overdue' ? 'overdue' : ''}">${formatTime(a.due_date)}</span>
      <span class="agenda-type-icon">${ACTIVITY_ICONS[a.type] || '📌'}</span>
      <span class="agenda-subject">${a.subject}</span>
      <span class="agenda-account">${a.account_name}</span>
    </div>
  `;

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Agenda du jour</span>
        <button class="btn btn-primary btn-sm" id="btn-create-activity-agenda">+ Activité</button>
      </div>
      ${todayActivities.length ? todayActivities.map(renderItem).join('') : '<p style="padding:16px;color:var(--color-text-secondary);font-size:13px">Aucune activité aujourd\'hui</p>'}
      ${upcoming.length ? `
        <div style="padding:8px 16px;font-size:11px;color:var(--color-text-disabled);text-transform:uppercase;letter-spacing:.06em;font-weight:600;border-top:1px solid var(--color-border)">À venir</div>
        ${upcoming.map(renderItem).join('')}
      ` : ''}
    </div>
  `;

  document.getElementById('btn-create-activity-agenda')?.addEventListener('click', () => {
    if (onCreateActivity) onCreateActivity();
  });
}
```

- [ ] **Step 5: Create js/pages/dashboard.js**

```js
import { renderAccountsPanel } from '../components/accounts-panel.js';
import { renderOpportunitiesPanel } from '../components/opportunities-panel.js';
import { renderNotificationFeed } from '../components/notification-feed.js';
import { renderAgendaWidget } from '../components/agenda-widget.js';
import { getState } from '../state.js';

export function mountDashboard(outlet, openModal) {
  const { accounts, opportunities, activities, notifications } = getState();

  outlet.className = 'layout-dashboard';
  outlet.innerHTML = `
    <div id="widget-agenda" style="grid-column:1;grid-row:1"></div>
    <div id="widget-notifications" style="grid-column:2;grid-row:1/3"></div>
    <div id="widget-accounts" style="grid-column:1;grid-row:2"></div>
    <div id="widget-opportunities" style="grid-column:1;grid-row:3"></div>
  `;

  renderAgendaWidget(document.getElementById('widget-agenda'), activities, openModal);
  renderNotificationFeed(document.getElementById('widget-notifications'), notifications);
  renderAccountsPanel(document.getElementById('widget-accounts'), accounts);
  renderOpportunitiesPanel(document.getElementById('widget-opportunities'), opportunities);
}
```

- [ ] **Step 6: Wire dashboard route in app.js**

```js
import { mountDashboard } from './pages/dashboard.js';
// inside routes:
registerRoute('dashboard', () => {
  mountDashboard(document.getElementById('page-outlet'), () => openFloatingModal());
});
```

- [ ] **Step 7: Verify dashboard renders fully**

`http://localhost:8080` — expect:
- KPI bar with 3 metrics
- 2-column layout: left (agenda + accounts + opps), right (notifications)
- All cards populated with mock data
- No console errors

---

## Task 7: Floating Activity Modal

**Files:**
- Create: `js/components/floating-modal.js`

- [ ] **Step 1: Create js/components/floating-modal.js**

```js
import { getState } from '../state.js';

let modalEl = null;
let fabEl = null;
let _open = false;
let _activeTab = 'call';

export function initFloatingModal(container) {
  // FAB button (always visible)
  fabEl = document.createElement('button');
  fabEl.className = 'btn-fab';
  fabEl.title = 'Logger une activité';
  fabEl.innerHTML = '+';
  fabEl.addEventListener('click', toggleModal);
  container.appendChild(fabEl);

  // Modal element
  modalEl = document.createElement('div');
  modalEl.className = 'modal-float';
  modalEl.style.display = 'none';
  container.appendChild(modalEl);
}

function toggleModal() {
  if (_open) closeModal();
  else openModal();
}

export function openModal(prefillAccountId = null) {
  _open = true;
  renderModal(prefillAccountId);
  modalEl.style.display = 'block';
  fabEl.innerHTML = '✕';
  fabEl.style.background = 'var(--color-brand-darker)';
  // Focus subject field
  setTimeout(() => modalEl.querySelector('.field-input')?.focus(), 50);
}

function closeModal() {
  _open = false;
  modalEl.style.display = 'none';
  fabEl.innerHTML = '+';
  fabEl.style.background = '';
}

function renderModal(prefillAccountId) {
  const { accounts } = getState();
  const accountOptions = accounts.map(a =>
    `<option value="${a.id}" ${a.id === prefillAccountId ? 'selected' : ''}>${a.name}</option>`
  ).join('');

  const tabs = ['call', 'meeting', 'task'];
  const tabLabels = { call: '📞 Appel', meeting: '📅 Réunion', task: '✅ Tâche' };

  const tabBar = tabs.map(t => `
    <div class="modal-tab ${t === _activeTab ? 'active' : ''}" data-tab="${t}">
      ${tabLabels[t]}
    </div>
  `).join('');

  const today = new Date().toISOString().slice(0, 16);

  modalEl.innerHTML = `
    <div class="modal-header">
      <span class="modal-title">Logger une activité</span>
      <button class="modal-close" id="modal-close-btn">✕</button>
    </div>
    <div class="modal-tabs">${tabBar}</div>
    <div class="modal-body">
      <div>
        <label class="field-label">Compte</label>
        <select class="field-select" id="modal-account">
          <option value="">— Sélectionner un compte —</option>
          ${accountOptions}
        </select>
      </div>
      <div>
        <label class="field-label">Sujet</label>
        <input type="text" class="field-input" id="modal-subject" placeholder="Ex: Suivi proposition commerciale" />
      </div>
      <div>
        <label class="field-label">Date & heure</label>
        <input type="datetime-local" class="field-input" id="modal-date" value="${today}" />
      </div>
      <div>
        <label class="field-label">Notes</label>
        <div class="field-stt">
          <textarea class="field-textarea" id="modal-notes" placeholder="Notes de l'activité..."></textarea>
          <button class="btn-stt" id="btn-stt" title="Dicter via Greffier/Gladia (Phase 2)">🎤</button>
        </div>
        <div style="font-size:11px;color:var(--color-text-disabled);margin-top:4px">
          🎤 Speech-to-Text disponible en Phase 2 (Greffier / Gladia)
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" id="modal-cancel">Annuler</button>
      <button class="btn btn-primary" id="modal-save">Enregistrer</button>
    </div>
  `;

  // Tab switching
  modalEl.querySelectorAll('.modal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      _activeTab = tab.dataset.tab;
      modalEl.querySelectorAll('.modal-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === _activeTab));
    });
  });

  // Close
  modalEl.querySelector('#modal-close-btn')?.addEventListener('click', closeModal);
  modalEl.querySelector('#modal-cancel')?.addEventListener('click', closeModal);

  // STT placeholder
  modalEl.querySelector('#btn-stt')?.addEventListener('click', () => {
    alert('Speech-to-Text sera connecté à Greffier/Gladia en Phase 2.\n\nDicte tes notes et elles apparaîtront ici automatiquement.');
  });

  // Save
  modalEl.querySelector('#modal-save')?.addEventListener('click', () => {
    const subject = modalEl.querySelector('#modal-subject').value.trim();
    if (!subject) {
      modalEl.querySelector('#modal-subject').style.borderColor = 'var(--color-danger)';
      modalEl.querySelector('#modal-subject').focus();
      return;
    }
    // Phase 2: POST to Dynamics 365 API
    console.log('[CRM] Activity saved (mock):', {
      type: _activeTab,
      account: modalEl.querySelector('#modal-account').value,
      subject,
      date: modalEl.querySelector('#modal-date').value,
      notes: modalEl.querySelector('#modal-notes').value
    });
    closeModal();
    // TODO: append to activity list in state
  });
}
```

- [ ] **Step 2: Wire floating modal in app.js**

```js
import { initFloatingModal, openModal } from './components/floating-modal.js';
// After renderNavSidebar:
initFloatingModal(document.getElementById('floating-modal-container'));

// expose for dashboard
window.openFloatingModal = openModal;

// Wire KPI bar button
document.getElementById('btn-log-activity')?.addEventListener('click', () => openModal());
```

- [ ] **Step 3: Verify modal — the 15-second test**

1. Open `http://localhost:8080`
2. Click "+" FAB (bottom right) — modal slides up in <300ms ✓
3. Select an account, type subject, hit "Enregistrer"
4. Time it: target < 15 seconds from FAB click to save ✓
5. Check console: activity object logged, no errors

---

## Task 8: Accounts Page & Account Detail

**Files:**
- Create: `js/pages/accounts.js`
- Create: `js/pages/account-detail.js`

- [ ] **Step 1: Create js/pages/accounts.js**

```js
import { getState } from '../state.js';

const HEALTH_LABELS = { good: 'Actif', warning: 'Attention', critical: 'Critique' };
const HEALTH_CLASS = { good: 'badge-success', warning: 'badge-warning', critical: 'badge-danger' };

export function mountAccounts(outlet) {
  const { accounts } = getState();
  outlet.className = '';
  outlet.style.gridTemplateColumns = '';

  const sorted = [...accounts].sort((a, b) => a.priority - b.priority);

  outlet.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
      <h1 style="font-size:var(--font-size-lg);font-weight:700">Mes Comptes</h1>
      <span style="color:var(--color-text-secondary);font-size:13px">${accounts.length} comptes dans votre portefeuille</span>
    </div>
    <div class="card">
      ${sorted.map(acc => `
        <div class="list-row" onclick="window.location.hash='account-${acc.id}'" style="gap:16px">
          <div class="health-dot ${acc.health}"></div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px">
              <span class="row-name">${acc.name}</span>
              <span class="badge ${HEALTH_CLASS[acc.health]}">${HEALTH_LABELS[acc.health]}</span>
              ${acc.consumption_delta_pct !== 0 ? `
                <span class="badge ${acc.consumption_delta_pct > 0 ? 'badge-success' : 'badge-danger'}">
                  ${acc.consumption_delta_pct > 0 ? '↑' : '↓'}${Math.abs(acc.consumption_delta_pct)}%
                </span>` : ''}
            </div>
            <div style="display:flex;gap:6px;align-items:center;margin-top:4px">
              <span class="nic-chip">${acc.nic_parent}</span>
              ${acc.nic_children.map(n => `<span class="nic-chip" style="opacity:.6">${n}</span>`).join('')}
              <span class="row-meta">${acc.sector} · ${acc.country}</span>
            </div>
            ${acc.wttj_signal ? `<div style="font-size:11px;color:var(--color-brand);margin-top:2px">💼 ${acc.wttj_signal}</div>` : ''}
          </div>
          <div style="text-align:right;flex-shrink:0">
            ${acc.contract_expiry_days <= 90 ? `
              <div class="badge ${acc.contract_expiry_days <= 30 ? 'badge-danger' : 'badge-warning'}">
                Contrat J-${acc.contract_expiry_days}
              </div>` : ''}
            <div class="row-meta" style="margin-top:4px">Score IT: ${acc.siret_score}/100</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
```

- [ ] **Step 2: Create js/pages/account-detail.js**

```js
import { getState } from '../state.js';

export function mountAccountDetail(outlet, accountId) {
  const { accounts, opportunities, activities } = getState();
  const acc = accounts.find(a => a.id === accountId);
  if (!acc) {
    outlet.innerHTML = '<p style="padding:24px;color:var(--color-danger)">Compte introuvable.</p>';
    return;
  }

  const fmt = (n) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);

  const accOpps = opportunities.filter(o => o.account_id === accountId);
  const accActivities = activities.filter(a => a.account_id === accountId).slice(0, 5);

  const powerMapHtml = acc.power_map.length ? acc.power_map.map(p => `
    <div class="power-card ${p.met ? '' : 'not-met'}">
      <span class="power-met-badge ${p.met ? 'met' : 'not-met'}">${p.met ? '✓ Rencontré' : 'Non rencontré'}</span>
      <div class="power-role">${p.status}</div>
      <div class="power-name">${p.name}</div>
      <div class="power-status-tag" style="color:var(--color-text-secondary)">${p.role}</div>
    </div>
  `).join('') : '<p style="color:var(--color-text-secondary);font-size:13px">Power Map non renseigné</p>';

  outlet.className = '';
  outlet.innerHTML = `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
      <a href="#accounts" style="color:var(--color-brand);font-size:13px;text-decoration:none">← Mes Comptes</a>
      <span style="color:var(--color-text-disabled)">/</span>
      <span style="font-size:13px">${acc.name}</span>
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="account-detail-header">
        <div style="flex:1">
          <div class="account-name-xl">${acc.name}</div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap">
            <span class="badge badge-neutral">${acc.sector}</span>
            <span class="badge badge-neutral">${acc.country}</span>
            ${acc.contract_expiry_days <= 90 ? `<span class="badge ${acc.contract_expiry_days <= 30 ? 'badge-danger' : 'badge-warning'}">Contrat expire dans ${acc.contract_expiry_days} jours</span>` : ''}
          </div>
          <div style="margin-top:12px">
            <div style="font-size:11px;color:var(--color-text-disabled);text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px">NICs</div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="nic-chip" style="font-size:12px">${acc.nic_parent} (parent)</span>
              ${acc.nic_children.map(n => `<span class="nic-chip" style="font-size:12px;opacity:.7">${n}</span>`).join('')}
            </div>
          </div>
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:11px;color:var(--color-text-disabled);margin-bottom:4px">Score IT (SIRET)</div>
          <div style="font-size:36px;font-weight:700;color:var(--color-brand)">${acc.siret_score}</div>
          <div style="font-size:12px;color:var(--color-text-secondary)">Budget est. ${fmt(acc.siret_budget_est_eur)}</div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 340px;gap:16px;align-items:start">
      <div style="display:flex;flex-direction:column;gap:16px">
        <!-- Power Map -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Power Map</span>
          </div>
          <div class="card-body">
            <div class="power-map">${powerMapHtml}</div>
          </div>
        </div>

        <!-- Opportunities -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Opportunités (${accOpps.length})</span>
          </div>
          ${accOpps.length ? accOpps.map(opp => `
            <div class="list-row">
              <div class="score-badge ${opp.score_color}">${opp.score}</div>
              <div style="flex:1;min-width:0">
                <div class="row-name">${opp.name}</div>
                <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
                  <span class="badge badge-info">${opp.stage}</span>
                  ${opp.delivery_pct > 0 ? `<span class="badge badge-warning">Livraison ${opp.delivery_pct}%</span>` : ''}
                </div>
                ${opp.delivery_note ? `<div style="font-size:11px;color:var(--color-amber);margin-top:2px">⚠ ${opp.delivery_note}</div>` : ''}
              </div>
              <div style="text-align:right">${fmt(opp.value_eur)}</div>
            </div>
          `).join('') : '<p style="padding:16px;color:var(--color-text-secondary);font-size:13px">Aucune opportunité</p>'}
        </div>

        <!-- Activities -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Activités récentes</span>
          </div>
          ${accActivities.length ? accActivities.map(a => `
            <div class="list-row">
              <span style="font-size:18px">${{call:'📞',meeting:'📅',task:'✅'}[a.type]}</span>
              <div style="flex:1;min-width:0">
                <div class="row-name">${a.subject}</div>
                <div class="row-meta">${new Date(a.due_date).toLocaleDateString('fr-FR')}</div>
              </div>
              <span class="badge ${a.status === 'overdue' ? 'badge-danger' : 'badge-neutral'}">${a.status === 'overdue' ? 'En retard' : 'À venir'}</span>
            </div>
          `).join('') : '<p style="padding:16px;color:var(--color-text-secondary);font-size:13px">Aucune activité récente</p>'}
        </div>
      </div>

      <!-- Right column: enrichment feed -->
      <div style="display:flex;flex-direction:column;gap:16px">
        ${acc.news_snippet ? `
        <div class="card">
          <div class="card-header"><span class="card-title">News</span></div>
          <div class="card-body">
            <p style="font-size:13px;line-height:1.5">📰 ${acc.news_snippet}</p>
          </div>
        </div>` : ''}

        ${acc.wttj_signal ? `
        <div class="card">
          <div class="card-header"><span class="card-title">Signaux Recrutement (WTTJ)</span></div>
          <div class="card-body">
            <p style="font-size:13px">💼 ${acc.wttj_signal}</p>
            <p style="font-size:11px;color:var(--color-text-disabled);margin-top:4px">Source: Welcome to the Jungle — Phase 2: API live</p>
          </div>
        </div>` : ''}

        <div class="card">
          <div class="card-header"><span class="card-title">Consommation Cloud</span></div>
          <div class="card-body">
            <div style="font-size:32px;font-weight:700;color:${acc.consumption_delta_pct < 0 ? 'var(--color-danger)' : 'var(--color-success)'}">
              ${acc.consumption_delta_pct > 0 ? '↑' : '↓'}${Math.abs(acc.consumption_delta_pct)}%
            </div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px">sur 30 jours glissants</div>
            <div style="font-size:11px;color:var(--color-text-disabled);margin-top:8px">Source: Tableau — Phase 2: API live</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
```

- [ ] **Step 3: Wire accounts routes in app.js**

```js
import { mountAccounts } from './pages/accounts.js';
import { mountAccountDetail } from './pages/account-detail.js';

// Update registerRoute calls:
registerRoute('accounts', () => { mountAccounts(outlet); });

// Dynamic account detail route
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('account-')) {
    const id = hash.replace('account-', '');
    mountAccountDetail(document.getElementById('page-outlet'), id);
  }
});
```

- [ ] **Step 4: Verify accounts page and detail**

1. Click "Comptes" in nav → see list of 15 accounts with health dots, NICs, badges
2. Click any account → see detail page with Power Map, opportunities, enrichment
3. No console errors

---

## Task 9: Opportunities Page

**Files:**
- Create: `js/pages/opportunities.js`

- [ ] **Step 1: Create js/pages/opportunities.js**

```js
import { getState } from '../state.js';

export function mountOpportunities(outlet) {
  const { opportunities } = getState();
  outlet.className = '';

  const fmt = (n) => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(n);

  const totalPipeline = opportunities.reduce((sum, o) => sum + o.value_eur, 0);

  outlet.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
      <h1 style="font-size:var(--font-size-lg);font-weight:700">Pipeline Opportunités</h1>
      <div style="display:flex;gap:16px;align-items:center">
        <span style="font-size:13px;color:var(--color-text-secondary)">Total: <strong>${fmt(totalPipeline)}</strong></span>
        <span style="font-size:13px;color:var(--color-text-secondary)">${opportunities.length} opportunités</span>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div style="display:flex;gap:8px">
          <span class="badge badge-danger">Fermeture critique (J-30)</span>
          <span class="badge badge-warning">En cours de livraison</span>
        </div>
      </div>
      ${opportunities.sort((a, b) => b.score - a.score).map(opp => `
        <div class="list-row" style="padding:12px 16px;min-height:64px">
          <div class="score-badge ${opp.score_color}" title="Opportunity Score">${opp.score}</div>
          <div style="flex:1;min-width:0">
            <div class="row-name">${opp.name}</div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">${opp.account_name}</div>
            <div style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap">
              <div class="progress-wrap" style="width:160px">
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${opp.stage_pct}%"></div>
                </div>
                <span class="progress-label" style="min-width:80px">${opp.stage}</span>
              </div>
              ${opp.delivery_status !== 'Not Started' ? `
              <div class="progress-wrap" style="width:140px">
                <div class="progress-bar">
                  <div class="progress-fill warning" style="width:${opp.delivery_pct}%"></div>
                </div>
                <span class="progress-label warning" style="min-width:70px;color:var(--color-amber)">Livr. ${opp.delivery_pct}%</span>
              </div>` : ''}
              ${opp.delivery_note ? `<span style="font-size:11px;color:var(--color-amber)">⚠ ${opp.delivery_note}</span>` : ''}
            </div>
          </div>
          <div style="text-align:right;flex-shrink:0;padding-left:16px">
            <div style="font-weight:700;font-size:16px">${fmt(opp.value_eur)}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">Closing: ${opp.close_date}</div>
            <div class="badge badge-info" style="margin-top:4px;font-size:10px">${opp.score_label}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}
```

- [ ] **Step 2: Wire opportunities route in app.js**

```js
import { mountOpportunities } from './pages/opportunities.js';
registerRoute('opportunities', () => { mountOpportunities(outlet); });
```

- [ ] **Step 3: Verify opportunities page**

Click "Opportunités" in nav → full list with scores, progress bars, delivery trackers. Sorted by score desc.

---

## Task 10: API Integration Map

**Files:**
- Create: `docs/api-integration-map.md`

- [ ] **Step 1: Create docs/api-integration-map.md**

```markdown
# API Integration Map — Dashboard OVHcloud CRM 2

> Phase 2 handoff document: replace each mock JSON source with the corresponding real API endpoint.

## Data Point → Mock → Real API

### User / Session

| Data Point | Mock Source | Phase 2 Endpoint |
|---|---|---|
| AM profile (name, avatar, role) | `mock-user.json` | `GET /api/data/v9.2/systemusers({userId})` (Dynamics 365 OData) |
| KPI: Pipeline total | `mock-user.json#pipeline_total_eur` | `GET /api/data/v9.2/opportunities?$filter=ownerid eq {userId}&$select=estimatedvalue` (aggregate) |
| KPI: Activities today | `mock-user.json#activities_today` | `GET /api/data/v9.2/activitypointers?$filter=ownerid eq {userId} and scheduledend ge today` |
| KPI: Open opportunities count | `mock-user.json#open_opportunities` | `GET /api/data/v9.2/opportunities/$count?$filter=statecode eq 0 and ownerid eq {userId}` |

### Accounts

| Data Point | Mock Source | Phase 2 Endpoint |
|---|---|---|
| Account list | `mock-accounts.json` | `GET /api/data/v9.2/accounts?$filter=ownerid eq {userId}&$orderby=ovh_priority` |
| NIC parent/children hierarchy | `acc.nic_parent`, `acc.nic_children` | Custom field `ovh_nic_parent` + related entity query |
| Contract expiry days | `acc.contract_expiry_days` | `GET /api/data/v9.2/contracts?$filter=customerid eq {accountId}&$select=expireson` |
| Health indicator | `acc.health` | Derived from `contract_expiry_days` + `consumption_delta_pct` (frontend logic) |

### Opportunities

| Data Point | Mock Source | Phase 2 Endpoint |
|---|---|---|
| Opportunity list | `mock-opportunities.json` | `GET /api/data/v9.2/opportunities?$filter=ownerid eq {userId}&$expand=customerid` |
| Stage / progress | `opp.stage`, `opp.stage_pct` | `opp.stagename` + lookup table (stagename → pct) |
| Delivery Tracker | `opp.delivery_status`, `opp.delivery_pct` | Internal OVHcloud delivery API (NIC-based): `GET /delivery/orders/{nic}` |
| Delivery note | `opp.delivery_note` | `GET /delivery/orders/{nic}/comments` |
| Opportunity Score | `opp.score` | Hybrid (Phase 2): internal signals + SIRET + WTTJ — computed by scoring microservice |

### Activities

| Data Point | Mock Source | Phase 2 Endpoint |
|---|---|---|
| Activity list (calls/meetings/tasks) | `mock-activities.json` | `GET /api/data/v9.2/activitypointers?$filter=ownerid eq {userId}&$orderby=scheduledend` |
| Create activity | Modal save (console.log) | `POST /api/data/v9.2/phonecalls` / `appointments` / `tasks` (Dynamics entity-type) |

### Notifications / Enrichment

| Data Point | Mock Source | Phase 2 Endpoint |
|---|---|---|
| Consumption alerts (churn/upsell) | `mock-notifications.json` | Tableau API: `GET /api/v1/metrics/consumption/{nic}?window=30d` |
| News feed | `acc.news_snippet` | Aggregator TBD (RSS + LLM summary) — Phase 2 design required |
| WTTJ hiring signals | `acc.wttj_signal` | `GET https://api.welcometothejungle.com/jobs?company_slug={slug}` (WTTJ Partner API) |
| SIRET / IT Budget score | `acc.siret_score`, `acc.siret_budget_est_eur` | `GET https://api.insee.fr/entreprises/sirene/V3/siret/{siret}` + scoring model |

### Authentication

| Concern | Mock (Phase 1) | Phase 2 |
|---|---|---|
| SSO | Mock session (no auth) | OVHcloud internal SSO — technology TBD (confirm with SI team) |
| Permission filtering | `am_id` field in mock JSON | Dynamics 365 record-level security (inherited from Dynamics roles) |

## Speech-to-Text Integration Point

| Component | Mock (Phase 1) | Phase 2 |
|---|---|---|
| Modal STT button | Alert placeholder | `POST https://greffier.internal.ovhcloud.com/transcribe` (audio blob → text) |
| Fallback | Manual textarea | Manual textarea with short-form templates (call / meeting / task) |
```

- [ ] **Step 2: Verify the file exists and is readable**

Open `docs/api-integration-map.md` in editor — verify all tables are complete and accurate.

---

## Task 11: Final Polish & End-to-End Verification

- [ ] **Step 1: Smoke test all routes**

| Route | Expected |
|---|---|
| `#dashboard` | KPI bar + Agenda + Accounts panel + Opportunities panel + Notifications feed |
| `#accounts` | Full account list with health dots, NIC chips, badges |
| `#account-acc-001` | Decathlon detail: Power Map, opps, enrichment |
| `#opportunities` | Full pipeline sorted by score, delivery trackers |
| `#contacts` | "Coming soon" placeholder |
| FAB click | Floating modal slides up in <300ms |
| Modal save | Activity logged to console, modal closes |
| Agenda "+" button | Modal opens |
| "Voir tous →" buttons | Navigate to correct page |

- [ ] **Step 2: Check console for errors across all routes**

Zero console errors expected. Zero 404s expected.

- [ ] **Step 3: Validate NFR03 — no artificial latency**

All mock data must load and render without any `setTimeout` delays — data appears immediately on navigation.

- [ ] **Step 4: Final commit**

```bash
git init
git add .
git commit -m "feat: Dashboard OVHcloud CRM Phase 1 MVP — full prototype with mock data

- Dynamics 365 Fluent UI design system (CSS custom properties)
- App shell: dark left nav, KPI bar, hash-based routing
- Dashboard view: agenda, accounts panel, opportunities pipeline, notifications feed
- Accounts list page with NIC hierarchy, health indicators, enrichment signals
- Account detail: Power Map, opportunities, delivery tracker, enrichment sidebar
- Opportunities pipeline with Opportunity Score badges and delivery progress bars
- Floating 'Log Activity' modal (Call/Meeting/Task) — <300ms open, <15s save
- Rich mock JSON data aligned to Dynamics 365 OData schema
- API Integration Map document (docs/api-integration-map.md)"
```

---

## Deliverables Checklist

- [ ] `index.html` — single-file SPA entry point
- [ ] `css/dynamics-theme.css` — Fluent UI design tokens
- [ ] `css/layout.css` — app shell grid layout
- [ ] `css/components.css` — all UI components
- [ ] `js/data/*.json` — 5 mock JSON files (Dynamics-schema aligned)
- [ ] `js/data/loader.js` — data loading abstraction
- [ ] `js/state.js` — in-memory state store
- [ ] `js/router.js` — hash-based SPA router
- [ ] `js/components/*.js` — 7 components
- [ ] `js/pages/*.js` — 4 page modules
- [ ] `js/app.js` — orchestration entry point
- [ ] `docs/api-integration-map.md` — Phase 2 handoff document

---

*Plan approved and ready for execution.*

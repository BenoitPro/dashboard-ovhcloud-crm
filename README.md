# Dashboard OVHcloud CRM 2

Cockpit unifié pour les Account Managers OVHcloud. Couche de présentation au-dessus de Dynamics 365 — remplace la navigation fragmentée de l'interface native par un dashboard orienté action.

**Phase actuelle : 1 — Prototype avec données mockées.**
Phase 2 = branchement sur les vraies APIs (voir [docs/api-integration-map.md](docs/api-integration-map.md)).

---

## Lancer le projet en local

**Prérequis :** Node.js 18+

```bash
npm install
npm run dev
```

Ouvre `http://localhost:5173` dans le navigateur.

```bash
npm run build    # bundle de production dans dist/
npm run preview  # prévisualise le build de production
```

---

## Stack

| Couche | Technologie |
|---|---|
| Frontend | Vanilla JS (ES modules) |
| Build | Vite 5 |
| CSS | Custom — thème Dynamics 365 |
| Données Phase 1 | JSON statiques (`js/data/mock-*.json`) |
| Données Phase 2 | Dynamics 365 OData v9.2 + APIs satellites |

Pas de framework frontend (React, Vue, etc.). Pas de TypeScript.

---

## Structure du projet

```
├── index.html
├── js/
│   ├── app.js                  # Point d'entrée — init state, routes, layout
│   ├── router.js               # Routeur client-side (hash-based)
│   ├── state.js                # Store global (lecture/écriture centralisée)
│   ├── data/
│   │   ├── loader.js           # ★ Couche d'abstraction données — seul fichier à modifier en Phase 2
│   │   ├── mock-user.json
│   │   ├── mock-accounts.json
│   │   ├── mock-opportunities.json
│   │   ├── mock-activities.json
│   │   └── mock-notifications.json
│   ├── components/
│   │   ├── nav-sidebar.js      # Navigation latérale
│   │   ├── kpi-bar.js          # Barre KPI en haut (pipeline €, activités, opps)
│   │   ├── accounts-panel.js   # Liste comptes avec health status
│   │   ├── opportunities-panel.js
│   │   ├── notification-feed.js
│   │   ├── agenda-widget.js
│   │   └── floating-modal.js   # Modal flottant persistant (log appel / réunion / tâche)
│   └── pages/
│       ├── dashboard.js        # Vue cockpit principal
│       ├── accounts.js         # Liste comptes
│       ├── account-detail.js   # Fiche compte (Power Map, contrats, NIC)
│       └── opportunities.js    # Pipeline opportunités
├── css/
│   ├── dynamics-theme.css      # Design tokens (couleurs, typographie Dynamics 365)
│   ├── layout.css              # Structure de page (sidebar + main)
│   └── components.css          # Styles des composants
└── docs/
    └── api-integration-map.md  # ★ Document de handoff Phase 2
```

---

## Pages et routes

| Route | Page | Statut |
|---|---|---|
| `#dashboard` | Cockpit principal | Phase 1 |
| `#accounts` | Liste des comptes | Phase 1 |
| `#account-detail` | Fiche compte (Power Map, NIC, contrats) | Phase 1 |
| `#opportunities` | Pipeline opportunités + scoring | Phase 1 |
| `#contacts` | Contacts | Stub — Phase 2 |
| `#activities` | Activités / agenda | Stub — Phase 2 |
| `#reports` | Rapports | Stub — Phase 2 |

---

## Passer en Phase 2 (données réelles)

**Un seul fichier à modifier : `js/data/loader.js`**

Chaque fonction (`loadUser`, `loadAccounts`, etc.) remplace son `fetch` mock par l'appel Dynamics correspondant. Le reste de l'app ne change pas.

Le mapping complet mock → endpoint réel est dans **[docs/api-integration-map.md](docs/api-integration-map.md)** :
- Endpoints Dynamics 365 OData v9.2
- Champs custom OVHcloud à créer dans Dynamics
- APIs satellites (Tableau, SIRET, WTTJ, Greffier/Gladia)
- Checklist Phase 2 complète

---

## Points à confirmer avant Phase 2

- [ ] **SSO** — technologie à valider avec l'équipe SI OVHcloud
- [ ] **Proxy CORS** — à mettre en place pour les appels Dynamics depuis le browser
- [ ] **Champs custom Dynamics** — `ovh_nic_parent`, `ovh_nic_id`, `ovh_priority`, `ovh_stakeholder_role`, `ovh_met_status`, `ovh_score`

---

## Documentation

| Document | Contenu |
|---|---|
| [docs/api-integration-map.md](docs/api-integration-map.md) | Handoff dev Phase 2 — mapping endpoints complet |
| [_bmad-output/planning/prd.md](_bmad-output/planning/prd.md) | PRD complet — contexte métier et exigences |

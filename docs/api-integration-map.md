# API Integration Map — Dashboard OVHcloud CRM 2

> **Phase 2 handoff document.** Replace each mock source below with the corresponding real API endpoint to activate live data.
>
> All mock data lives in `js/data/mock-*.json`. The abstraction layer is `js/data/loader.js` — only this file needs to change in Phase 2.

---

## Authentication

| Concern | Phase 1 (Mock) | Phase 2 (Real) |
|---|---|---|
| SSO | Mock session — no auth required | OVHcloud internal SSO — **technology TBD** (confirm with SI team before Phase 2) |
| User identity | `mock-user.json` | `GET /api/data/v9.2/WhoAmI` → Dynamics user ID |
| Permission filtering | `am_id` field in mock JSON | Dynamics 365 record-level security (OwnerId = current user) |

---

## User / Session

| Data Point | Mock Source | Phase 2 Endpoint | Notes |
|---|---|---|---|
| AM profile (name, avatar, role) | `mock-user.json` | `GET /api/data/v9.2/systemusers({userId})?$select=fullname,internalemailaddress` | Dynamics OData v9.2 |
| KPI: Pipeline total € | `mock-user.json#pipeline_total_eur` | `GET /api/data/v9.2/opportunities?$filter=ownerid eq {userId} and statecode eq 0&$select=estimatedvalue` (aggregate sum client-side) | |
| KPI: Activities today | `mock-user.json#activities_today` | `GET /api/data/v9.2/activitypointers?$filter=ownerid eq {userId} and scheduledend ge {todayStart} and scheduledend lt {tomorrowStart}&$count=true` | |
| KPI: Open opportunities count | `mock-user.json#open_opportunities` | `GET /api/data/v9.2/opportunities/$count?$filter=statecode eq 0 and ownerid eq {userId}` | |

---

## Accounts

| Data Point | Mock Source | Phase 2 Endpoint | Notes |
|---|---|---|---|
| Account list | `mock-accounts.json` | `GET /api/data/v9.2/accounts?$filter=ownerid eq {userId}&$orderby=ovh_priority asc` | Requires custom field `ovh_priority` |
| Account name, sector, country | `acc.name`, `acc.sector`, `acc.country` | Standard Dynamics fields: `name`, `industrycodename`, `address1_country` | |
| NIC parent | `acc.nic_parent` | Custom field: `ovh_nic_parent` (string) | OVHcloud-specific field |
| NIC children | `acc.nic_children[]` | `GET /api/data/v9.2/accounts?$filter=ovh_nic_parent_id eq {parentAccountId}&$select=ovh_nic_id` | Child accounts linked by parent |
| Contract expiry days | `acc.contract_expiry_days` | `GET /api/data/v9.2/contracts?$filter=customerid/accountid eq {accountId} and statecode eq 1&$select=expireson&$orderby=expireson asc&$top=1` | Closest active contract |
| Health status | `acc.health` (good/warning/critical) | **Derived** client-side from `contract_expiry_days` + `consumption_delta_pct` | Not a Dynamics field |
| Consumption delta % | `acc.consumption_delta_pct` | `GET /tableau-proxy/metrics/consumption/{nicId}?window=30d` — Tableau API (internal proxy) | External — non-blocking |
| Consumption signal | `acc.consumption_signal` | **Derived** from delta % (client-side logic: <-10% → churn_risk, >20% → upsell) | |
| SIRET score | `acc.siret_score` | `GET /scoring-service/siret/{siret}` — Internal scoring microservice | Non-blocking satellite API |
| SIRET budget estimate | `acc.siret_budget_est_eur` | Same scoring microservice response | Non-blocking satellite API |
| WTTJ hiring signals | `acc.wttj_signal` | `GET /enrichment-proxy/wttj?company={companySlug}` — Welcome to the Jungle partner API | Non-blocking satellite API |
| News snippet | `acc.news_snippet` | `GET /enrichment-proxy/news?company={name}` — Aggregator + LLM summary (TBD) | Non-blocking satellite API — Phase 2 design needed |

---

## Account Power Map

| Data Point | Mock Source | Phase 2 Endpoint | Notes |
|---|---|---|---|
| Contact list per account | `acc.power_map[]` | `GET /api/data/v9.2/contacts?$filter=parentcustomerid eq {accountId}&$select=fullname,jobtitle,ovh_stakeholder_role,ovh_met_status` | Requires custom fields |
| Stakeholder role (Decision Maker, Influencer, Operational) | `p.status` | Custom field: `ovh_stakeholder_role` | |
| Met/Not Met status | `p.met` (boolean) | Custom field: `ovh_met_status` (boolean) | |

---

## Opportunities

| Data Point | Mock Source | Phase 2 Endpoint | Notes |
|---|---|---|---|
| Opportunity list | `mock-opportunities.json` | `GET /api/data/v9.2/opportunities?$filter=ownerid eq {userId} and statecode eq 0&$expand=customerid($select=name)&$orderby=ovh_score desc` | |
| Stage / Stage % | `opp.stage`, `opp.stage_pct` | `opp.stagename` + client-side lookup table (stagename → percentage) | Stage % requires a mapping config |
| Opportunity Score | `opp.score`, `opp.score_label`, `opp.score_color` | `GET /scoring-service/opportunity/{opportunityId}` — Internal scoring microservice | Hybrid: Dynamics signals + SIRET + WTTJ |
| Value | `opp.value_eur` | `opp.estimatedvalue` (Dynamics standard field) | |
| Close date | `opp.close_date` | `opp.estimatedclosedate` | |
| Delivery status | `opp.delivery_status` | `GET /delivery-api/orders/{nicId}/status` — Internal OVHcloud delivery API | External — non-blocking |
| Delivery progress % | `opp.delivery_pct` | Same delivery API response | |
| Delivery note | `opp.delivery_note` | `GET /delivery-api/orders/{nicId}/comments?$top=1` | |

---

## Activities

| Data Point | Mock Source | Phase 2 Endpoint | Notes |
|---|---|---|---|
| Activity list | `mock-activities.json` | `GET /api/data/v9.2/activitypointers?$filter=ownerid eq {userId}&$orderby=scheduledend asc&$select=subject,activitytypecode,scheduledend,regardingobjectid` | |
| Activity type (call/meeting/task) | `act.type` | `activitytypecode` mapped: `phonecall` → call, `appointment` → meeting, `task` → task | |
| Create call | Modal save action | `POST /api/data/v9.2/phonecalls` with `{ subject, scheduledend, regardingobjectid, description }` | |
| Create meeting | Modal save action | `POST /api/data/v9.2/appointments` | |
| Create task | Modal save action | `POST /api/data/v9.2/tasks` | |
| Speech-to-Text (notes field) | Alert placeholder in modal | `POST https://greffier.internal.ovhcloud.com/transcribe` (audio blob → text) | Greffier/Gladia — Phase 2 |

---

## Notifications

| Data Point | Mock Source | Phase 2 Endpoint | Notes |
|---|---|---|---|
| All notifications | `mock-notifications.json` | **Aggregated** from multiple sources below | No single Dynamics endpoint |
| Churn risk alerts | `type: churn_risk` | Derived from Tableau consumption API (delta < -10% → alert) | Client-side threshold |
| Upsell signals | `type: upsell` | Derived from Tableau consumption API (delta > 20% → signal) | Client-side threshold |
| Contract renewal alerts | `type: renewal` | Derived from contracts expiry query (≤ 90 days → notification) | Client-side threshold |
| News notifications | `type: news` | External aggregator proxy (TBD — Phase 2 design required) | Non-blocking satellite API |

---

## Non-Blocking Satellite APIs

All external enrichment APIs (Tableau, SIRET, WTTJ, News) are **non-blocking**:
- If the API is unavailable or slow, the main account/opportunity view still loads
- Enrichment data appears progressively (Phase 2: use `Promise.allSettled`, not `Promise.all`)
- A missing enrichment shows a "Données non disponibles" placeholder, never a broken layout

---

## Phase 2 Checklist

- [ ] Confirm SSO technology with OVHcloud SI team
- [ ] Set up Dynamics 365 API proxy (CORS + auth headers)
- [ ] Create custom Dynamics fields: `ovh_nic_parent`, `ovh_nic_id`, `ovh_priority`, `ovh_stakeholder_role`, `ovh_met_status`, `ovh_score`
- [ ] Define stage-name → percentage mapping config
- [ ] Set up Tableau consumption API proxy
- [ ] Set up delivery API proxy
- [ ] Integrate SIRET scoring microservice
- [ ] Configure WTTJ partner API access
- [ ] Connect Greffier/Gladia Speech-to-Text in modal
- [ ] Design news aggregator + LLM summary pipeline
- [ ] Replace `loader.js` mock fetch paths with real API calls
- [ ] Add error handling and loading states throughout

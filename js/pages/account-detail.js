// Account detail page — NIC hierarchy, Power Map, opportunities, enrichment sidebar
// Phase 2: data from Dynamics 365 accounts/opportunities/activities APIs

import { getState } from '../state.js';

export function mountAccountDetail(outlet, accountId) {
  const { accounts, opportunities, activities } = getState();
  const acc = accounts.find(a => a.id === accountId);

  outlet.className = '';
  outlet.style.cssText = '';

  if (!acc) {
    outlet.innerHTML = `
      <p style="padding:40px;color:var(--color-danger);">
        Compte introuvable : <code>${accountId}</code>
        <br><a href="#accounts" style="color:var(--color-brand)">← Retour aux comptes</a>
      </p>`;
    return;
  }

  const fmt = (n) => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(n);

  const accOpps = opportunities.filter(o => o.account_id === accountId);
  const accActivities = activities
    .filter(a => a.account_id === accountId)
    .sort((a, b) => new Date(b.due_date) - new Date(a.due_date))
    .slice(0, 5);

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const getRoleStyle = (status) => {
    const s = status.toLowerCase();
    if (s.includes('decision')) return 'color: var(--color-brand); background: var(--color-brand-lightest); border-color: var(--color-brand-light);';
    if (s.includes('influenc')) return 'color: #7c3aed; background: #ede9fe; border-color: #ddd6fe;'; // Indigo/Purple
    return 'color: var(--color-text-secondary); background: var(--color-border); border-color: var(--color-border-strong);';
  };

  // Power Map HTML
  const powerMapHtml = acc.power_map.length
    ? `<div class="power-map-container">
        ` + acc.power_map.map(p => `
        <div class="power-card-v2 ${p.met ? 'met' : 'not-met'}">
          <div class="power-card-header">
            <div class="power-avatar" style="${getRoleStyle(p.status)}">
              ${getInitials(p.name)}
              <div class="power-met-dot ${p.met ? 'met' : 'not-met'}" title="${p.met ? 'Rencontré' : 'Non rencontré'}">
                ${p.met ? `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` : ''}
              </div>
            </div>
            <div class="power-info">
              <div class="power-name">${p.name}</div>
              <div class="power-job" title="${p.role}">${p.role}</div>
            </div>
          </div>
          <div class="power-card-footer">
            <span class="power-status-badge" style="${getRoleStyle(p.status).replace('border-color', '/*').replace(';', '*/;')} border-radius: 4px; padding: 4px 8px; font-size: 10px;">${p.status}</span>
          </div>
        </div>
      `).join('') + `</div>`
    : `<p style="padding:16px;color:var(--color-text-secondary);font-size:13px;text-align:center;">Power Map non renseigné — à compléter</p>`;

  outlet.innerHTML = `
    <!-- Breadcrumb -->
    <div class="breadcrumb">
      <a href="#accounts">← Mes Comptes</a>
      <span class="breadcrumb-sep">/</span>
      <span class="breadcrumb-current">${acc.name}</span>
    </div>

    <!-- Account header card -->
    <div class="card" style="margin-bottom:0">
      <div style="display:flex;align-items:flex-start;gap:var(--space-5);padding:var(--space-5) var(--space-6)">
        <div style="flex:1;min-width:0">
          <div class="account-name-xl">${acc.name}</div>
          <div style="display:flex;gap:8px;align-items:center;margin-top:8px;flex-wrap:wrap">
            <span class="badge badge-neutral">${acc.sector}</span>
            <span class="badge badge-neutral">${acc.country}</span>
            <span class="health-dot ${acc.health}" style="margin-left:4px"></span>
            ${acc.contract_expiry_days <= 90 ? `
              <span class="badge ${acc.contract_expiry_days <= 30 ? 'badge-danger' : 'badge-warning'}">
                Contrat expire dans ${acc.contract_expiry_days} jours
              </span>` : ''}
          </div>
          <!-- NIC Hierarchy -->
          <div style="margin-top:14px">
            <div style="font-size:11px;color:var(--color-text-disabled);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px">Hiérarchie NIC</div>
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              <span class="nic-chip" style="font-size:12px;font-weight:600">${acc.nic_parent} <span style="opacity:.6">(parent)</span></span>
              ${acc.nic_children.map(n => `<span class="nic-chip" style="font-size:12px;opacity:.7">${n}</span>`).join('')}
            </div>
          </div>
        </div>
        <!-- SIRET Score -->
        <div style="text-align:right;flex-shrink:0">
          <div style="font-size:11px;color:var(--color-text-disabled);margin-bottom:4px">Score IT (SIRET)</div>
          <div style="font-size:40px;font-weight:700;color:var(--color-brand);line-height:1">${acc.siret_score}</div>
          <div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px">Budget est. ${fmt(acc.siret_budget_est_eur)}</div>
        </div>
      </div>
    </div>

    <!-- 2-column body -->
    <div style="display:grid;grid-template-columns:1fr 320px;gap:var(--space-4);align-items:start">

      <!-- Left column -->
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">

        <!-- Power Map -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Power Map</span>
            <span style="font-size:11px;color:var(--color-text-disabled)">${acc.power_map.length} contact${acc.power_map.length !== 1 ? 's' : ''}</span>
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
          ${accOpps.length
            ? accOpps.map(opp => `
                <div class="list-row" style="min-height:60px">
                  <div class="score-badge ${opp.score_color}">${opp.score}</div>
                  <div style="flex:1;min-width:0">
                    <div class="row-name">${opp.name}</div>
                    <div style="display:flex;gap:8px;align-items:center;margin-top:4px;flex-wrap:wrap">
                      <span class="badge badge-info">${opp.stage}</span>
                      ${opp.delivery_pct > 0 ? `<span class="badge badge-warning">Livraison ${opp.delivery_pct}%</span>` : ''}
                    </div>
                    ${opp.delivery_note ? `<div style="font-size:11px;color:var(--color-amber);margin-top:2px">⚠ ${opp.delivery_note}</div>` : ''}
                  </div>
                  <div class="row-meta" style="text-align:right;flex-shrink:0">
                    <div style="font-weight:600;color:var(--color-text-primary)">${fmt(opp.value_eur)}</div>
                    <div style="font-size:11px;margin-top:2px">${opp.close_date}</div>
                  </div>
                </div>
              `).join('')
            : `<p style="padding:16px;color:var(--color-text-secondary);font-size:13px">Aucune opportunité en cours</p>`
          }
        </div>

        <!-- Activities -->
        <div class="card">
          <div class="card-header">
            <span class="card-title">Activités récentes</span>
            <button class="btn btn-primary btn-sm" onclick="window._openModal && window._openModal('${acc.id}')">+ Activité</button>
          </div>
          ${accActivities.length
            ? accActivities.map(a => `
                <div class="list-row">
                  <span style="font-size:18px">${{call:'📞',meeting:'📅',task:'✅'}[a.type] || '📌'}</span>
                  <div style="flex:1;min-width:0">
                    <div class="row-name">${a.subject}</div>
                    <div class="row-meta">${new Date(a.due_date).toLocaleDateString('fr-FR', {weekday:'short',day:'numeric',month:'short'})}</div>
                  </div>
                  <span class="badge ${a.status === 'overdue' ? 'badge-danger' : 'badge-neutral'}">${a.status === 'overdue' ? 'En retard' : 'À venir'}</span>
                </div>
              `).join('')
            : `<p style="padding:16px;color:var(--color-text-secondary);font-size:13px">Aucune activité enregistrée</p>`
          }
        </div>
      </div>

      <!-- Right column: enrichment -->
      <div style="display:flex;flex-direction:column;gap:var(--space-4)">
        ${acc.news_snippet ? `
          <div class="card">
            <div class="card-header"><span class="card-title">News</span></div>
            <div class="card-body">
              <p style="font-size:13px;line-height:1.5">📰 ${acc.news_snippet}</p>
              <p style="font-size:11px;color:var(--color-text-disabled);margin-top:8px">Source: agrégateur externe — Phase 2: API live</p>
            </div>
          </div>` : ''}

        ${acc.wttj_signal ? `
          <div class="card">
            <div class="card-header"><span class="card-title">Signaux Recrutement</span></div>
            <div class="card-body">
              <p style="font-size:13px">💼 ${acc.wttj_signal}</p>
              <p style="font-size:11px;color:var(--color-text-disabled);margin-top:8px">Source: Welcome to the Jungle — Phase 2: API live</p>
            </div>
          </div>` : ''}

        <div class="card">
          <div class="card-header"><span class="card-title">Consommation Cloud</span></div>
          <div class="card-body">
            <div style="font-size:36px;font-weight:700;line-height:1;color:${acc.consumption_delta_pct === 0 ? 'var(--color-text-secondary)' : acc.consumption_delta_pct < 0 ? 'var(--color-danger)' : 'var(--color-success)'}">
              ${acc.consumption_delta_pct === 0 ? '→' : acc.consumption_delta_pct > 0 ? '↑' : '↓'}${Math.abs(acc.consumption_delta_pct)}%
            </div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:4px">sur 30 jours glissants</div>
            ${acc.consumption_signal === 'churn_risk' ? `<div class="badge badge-danger" style="margin-top:8px">Risque churn</div>` : ''}
            ${acc.consumption_signal === 'upsell' ? `<div class="badge badge-success" style="margin-top:8px">Signal upsell</div>` : ''}
            <p style="font-size:11px;color:var(--color-text-disabled);margin-top:8px">Source: Tableau — Phase 2: API live</p>
          </div>
        </div>
      </div>

    </div>
  `;
}

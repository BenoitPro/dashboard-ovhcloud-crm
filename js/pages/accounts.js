// Accounts list page
// Phase 2: data from Dynamics 365 accounts API

import { getState } from '../state.js';

const HEALTH_LABELS = { good: 'Actif', warning: 'Attention', critical: 'Critique' };
const HEALTH_CLASS = { good: 'badge-success', warning: 'badge-warning', critical: 'badge-danger' };

export function mountAccounts(outlet) {
  const { accounts } = getState();
  outlet.className = '';
  outlet.style.cssText = '';

  const sorted = [...accounts].sort((a, b) => a.priority - b.priority);

  outlet.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
      <h1 style="font-size:var(--font-size-lg);font-weight:700">Mes Comptes</h1>
      <span style="color:var(--color-text-secondary);font-size:13px">${accounts.length} comptes dans votre portefeuille</span>
    </div>
    <div class="card">
      ${sorted.map(acc => `
        <div class="list-row" onclick="window.location.hash='account-${acc.id}'" style="min-height:60px;gap:var(--space-4)">
          <div class="health-dot ${acc.health}" style="flex-shrink:0"></div>
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap">
              <span class="row-name">${acc.name}</span>
              <span class="badge ${HEALTH_CLASS[acc.health]}">${HEALTH_LABELS[acc.health]}</span>
              ${acc.consumption_delta_pct !== 0 ? `
                <span class="badge ${acc.consumption_delta_pct > 0 ? 'badge-success' : 'badge-danger'}">
                  ${acc.consumption_delta_pct > 0 ? '↑' : '↓'}${Math.abs(acc.consumption_delta_pct)}%
                </span>` : ''}
            </div>
            <div style="display:flex;gap:6px;align-items:center;margin-top:4px;flex-wrap:wrap">
              <span class="nic-chip">${acc.nic_parent}</span>
              ${acc.nic_children.slice(0, 3).map(n => `<span class="nic-chip" style="opacity:.65">${n}</span>`).join('')}
              ${acc.nic_children.length > 3 ? `<span class="row-meta">+${acc.nic_children.length - 3}</span>` : ''}
              <span class="row-meta">${acc.sector} · ${acc.country}</span>
            </div>
            ${acc.wttj_signal ? `<div style="font-size:11px;color:var(--color-brand);margin-top:2px">💼 ${acc.wttj_signal}</div>` : ''}
          </div>
          <div style="text-align:right;flex-shrink:0;min-width:100px">
            ${acc.contract_expiry_days <= 90 ? `
              <div class="badge ${acc.contract_expiry_days <= 30 ? 'badge-danger' : 'badge-warning'}">
                Contrat J-${acc.contract_expiry_days}
              </div>` : ''}
            <div class="row-meta" style="margin-top:4px">IT Score: ${acc.siret_score}/100</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

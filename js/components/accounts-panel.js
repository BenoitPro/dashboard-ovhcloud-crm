// Accounts Panel — dashboard widget showing top accounts
// Phase 2: data from Dynamics 365 accounts API

function consumptionChip(acc) {
  const d = acc.consumption_delta_pct;
  if (!d || d === 0) return '';
  const cls = d > 0 ? 'badge-success' : 'badge-danger';
  const arrow = d > 0 ? '↑' : '↓';
  return `<span class="badge ${cls}">${arrow}${Math.abs(d)}%</span>`;
}

function contractBadge(acc) {
  if (acc.contract_expiry_days <= 30) {
    return `<span class="badge badge-danger">J-${acc.contract_expiry_days}</span>`;
  }
  if (acc.contract_expiry_days <= 90) {
    return `<span class="badge badge-warning">J-${acc.contract_expiry_days}</span>`;
  }
  return '';
}

export function renderAccountsPanel(container, accounts) {
  const sorted = [...accounts].sort((a, b) => a.priority - b.priority).slice(0, 6);

  const rows = sorted.map(acc => `
    <div class="list-row" onclick="window.location.hash='account-${acc.id}'">
      <div class="health-dot ${acc.health}"></div>
      <div style="flex:1;min-width:0">
        <div class="row-name">${acc.name}</div>
        <div style="display:flex;gap:4px;align-items:center;margin-top:2px;flex-wrap:wrap">
          <span class="nic-chip">${acc.nic_parent}</span>
          ${acc.nic_children.length > 0 ? `<span class="row-meta">+${acc.nic_children.length} NICs</span>` : ''}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0">
        ${consumptionChip(acc)}
        ${contractBadge(acc)}
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Mes Comptes</span>
        <a href="#accounts" class="btn btn-ghost btn-sm">Voir tous →</a>
      </div>
      <div class="list-fade-container">
        ${rows}
      </div>
    </div>
  `;
}

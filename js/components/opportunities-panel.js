// Opportunities Panel — dashboard widget
// Phase 2: data from Dynamics 365 opportunities API

export function renderOpportunitiesPanel(container, opportunities) {
  const fmt = (n) => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(n);

  const topOpps = [...opportunities]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const rows = topOpps.map(opp => `
    <div class="list-row">
      <div class="score-badge ${opp.score_color}" title="Opportunity Score: ${opp.score}">${opp.score}</div>
      <div style="flex:1;min-width:0">
        <div class="row-name">${opp.name}</div>
        <div style="display:flex;align-items:center;gap:8px;margin-top:4px;flex-wrap:wrap">
          <div class="progress-wrap" style="width:140px">
            <div class="progress-bar">
              <div class="progress-fill" style="width:${opp.stage_pct}%"></div>
            </div>
            <span class="progress-label">${opp.stage}</span>
          </div>
          ${opp.delivery_pct > 0 ? `
            <div class="progress-wrap" style="width:110px">
              <div class="progress-bar">
                <div class="progress-fill warning" style="width:${opp.delivery_pct}%"></div>
              </div>
              <span class="progress-label" style="color:var(--color-amber)">Livr. ${opp.delivery_pct}%</span>
            </div>
          ` : ''}
        </div>
      </div>
      <div class="row-meta" style="text-align:right;flex-shrink:0;padding-left:8px">
        <div style="font-weight:600;color:var(--color-text-primary)">${fmt(opp.value_eur)}</div>
        <div style="font-size:11px;margin-top:2px">${opp.close_date}</div>
      </div>
    </div>
  `).join('');

  container.innerHTML = `
    <div class="card">
      <div class="card-header">
        <span class="card-title">Pipeline Opportunités</span>
        <a href="#opportunities" class="btn btn-ghost btn-sm">Voir tous →</a>
      </div>
      <div class="list-fade-container">
        ${rows}
      </div>
    </div>
  `;
}

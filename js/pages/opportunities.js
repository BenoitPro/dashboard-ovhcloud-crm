// Opportunities pipeline page
// Phase 2: data from Dynamics 365 opportunities API

import { getState } from '../state.js';

export function mountOpportunities(outlet) {
  const { opportunities } = getState();
  outlet.className = '';
  outlet.style.cssText = '';

  const fmt = (n) => new Intl.NumberFormat('fr-FR', {
    style: 'currency', currency: 'EUR', maximumFractionDigits: 0
  }).format(n);

  const totalPipeline = opportunities.reduce((sum, o) => sum + o.value_eur, 0);
  const sortedOpps = [...opportunities].sort((a, b) => b.score - a.score);

  outlet.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:var(--space-2)">
      <h1 style="font-size:var(--font-size-lg);font-weight:700">Pipeline Opportunités</h1>
      <div style="display:flex;gap:var(--space-4);align-items:center">
        <span style="font-size:13px;color:var(--color-text-secondary)">
          Total: <strong style="color:var(--color-text-primary)">${fmt(totalPipeline)}</strong>
        </span>
        <span style="font-size:13px;color:var(--color-text-secondary)">${opportunities.length} opportunités</span>
      </div>
    </div>

    <div class="card">
      <div class="card-header" style="flex-wrap:wrap;gap:8px">
        <span class="card-title">Toutes les opportunités</span>
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="badge badge-danger">Fermeture critique (J-30)</span>
          <span class="badge badge-warning">Livraison en cours</span>
        </div>
      </div>
      ${sortedOpps.map(opp => `
        <div class="list-row" style="padding:12px 16px;min-height:72px;align-items:flex-start;gap:12px">
          <div class="score-badge ${opp.score_color}" style="margin-top:4px" title="Score: ${opp.score} — ${opp.score_label}">${opp.score}</div>
          <div style="flex:1;min-width:0">
            <div class="row-name">${opp.name}</div>
            <div style="font-size:12px;color:var(--color-text-secondary);margin-top:1px">${opp.account_name}</div>
            <div style="display:flex;gap:10px;align-items:center;margin-top:6px;flex-wrap:wrap">
              <!-- Stage progress -->
              <div class="progress-wrap" style="min-width:160px;max-width:200px">
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${opp.stage_pct}%"></div>
                </div>
                <span class="progress-label" style="min-width:80px">${opp.stage}</span>
              </div>
              <!-- Delivery tracker (only if active) -->
              ${opp.delivery_status !== 'Not Started' ? `
                <div class="progress-wrap" style="min-width:130px;max-width:180px">
                  <div class="progress-bar">
                    <div class="progress-fill warning" style="width:${opp.delivery_pct}%"></div>
                  </div>
                  <span class="progress-label" style="color:var(--color-amber);min-width:70px">Livr. ${opp.delivery_pct}%</span>
                </div>
              ` : ''}
            </div>
            <!-- Delivery note -->
            ${opp.delivery_note ? `
              <div style="font-size:11px;color:var(--color-amber);margin-top:4px">⚠ ${opp.delivery_note}</div>
            ` : ''}
          </div>
          <!-- Value & close date -->
          <div style="text-align:right;flex-shrink:0;padding-top:4px">
            <div style="font-weight:700;font-size:16px;color:var(--color-text-primary)">${fmt(opp.value_eur)}</div>
            <div style="font-size:11px;color:var(--color-text-secondary);margin-top:3px">Closing: ${opp.close_date}</div>
            <span class="badge badge-info" style="margin-top:4px">${opp.score_label}</span>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

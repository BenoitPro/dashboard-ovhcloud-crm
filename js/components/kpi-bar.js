// KPI Bar — persistent top strip
// Phase 2: replace user mock fields with aggregated Dynamics API calls

export function renderKpiBar(container, user) {
  const fmt = (n) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(n);

  const mrr_eur = 142500;
  const mrr_increase = "+4%";

  const healthScore = 92;
  const health_increase = "+2 pts";

  // Dynamic health score styling
  const healthColorClass = healthScore >= 90 ? 'green' : healthScore >= 70 ? 'orange' : 'danger';
  const healthEmoji = healthScore >= 90 ? '💚' : healthScore >= 70 ? '🧡' : '❤️';

  // Quality Check scores (mock Phase 1)
  const qc = { activity: 87, account: 94, opportunity: 78 };
  const qcStyle = (s) => s >= 90
    ? 'background:var(--color-success-bg);color:var(--color-success)'
    : s >= 70
    ? 'background:var(--color-amber-bg);color:var(--color-amber)'
    : 'background:var(--color-danger-bg);color:var(--color-danger)';

  container.innerHTML = `
    <div class="kpi-metric">
      <div class="kpi-header">
        <span class="kpi-label">📊 Pipeline</span>
        <span class="kpi-delta up" title="Voir le détail">+12%</span>
      </div>
      <span class="kpi-value blue">${fmt(user.pipeline_total_eur)}</span>
    </div>

    <div class="kpi-metric">
      <div class="kpi-header">
        <span class="kpi-label">💰 MRR</span>
        <span class="kpi-delta up" title="Voir le détail">${mrr_increase}</span>
      </div>
      <span class="kpi-value blue">${fmt(mrr_eur)}</span>
    </div>

    <div class="kpi-metric">
      <div class="kpi-header">
        <span class="kpi-label">${healthEmoji} Health Score</span>
        <span class="kpi-delta up" title="Voir le détail">${health_increase}</span>
      </div>
      <span class="kpi-value ${healthColorClass}">${healthScore}<span class="kpi-unit">/100</span></span>
    </div>

    <div class="kpi-metric">
      <span class="kpi-label">📅 Activités</span>
      <span class="kpi-value">${user.activities_today}<span class="kpi-unit"> auj.</span></span>
    </div>

    <div class="kpi-metric">
      <div class="kpi-header">
        <span class="kpi-label">🎯 Opps</span>
        <span class="kpi-delta down" title="Voir le détail">-1</span>
      </div>
      <span class="kpi-value">${user.open_opportunities}</span>
    </div>

    <div class="kpi-metric kpi-metric--qc">
      <span class="kpi-label">✅ Quality Check</span>
      <div class="kpi-subscores">
        <div class="kpi-subscore" style="${qcStyle(qc.activity)}">
          <span class="kpi-subscore-lbl">Act</span>
          <span class="kpi-subscore-val">${qc.activity}</span>
        </div>
        <div class="kpi-subscore" style="${qcStyle(qc.account)}">
          <span class="kpi-subscore-lbl">E-Cpt</span>
          <span class="kpi-subscore-val">${qc.account}</span>
        </div>
        <div class="kpi-subscore" style="${qcStyle(qc.opportunity)}">
          <span class="kpi-subscore-lbl">Opp</span>
          <span class="kpi-subscore-val">${qc.opportunity}</span>
        </div>
      </div>
    </div>
  `;

  container.querySelectorAll('.kpi-delta').forEach(delta => {
    delta.addEventListener('click', () => {
      alert("En phase 2, ce bouton ouvrira un rapport détaillé des évolutions par rapport au mois précédent.");
    });
  });
}

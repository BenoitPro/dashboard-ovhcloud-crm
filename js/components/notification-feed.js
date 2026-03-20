// Notification Feed — alerts panel
// Phase 2: churn/upsell from Tableau API, renewals from Dynamics, news from external aggregator

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
  if (m < 1440) return `${Math.round(m / 60)}h`;
  return `${Math.round(m / 1440)}j`;
}

export function renderNotificationFeed(container, notifications) {
  const criticalCount = notifications.filter(n => n.urgency === 'critical').length;

  const items = notifications.map(n => `
    <div class="notif-card notif-strip ${n.urgency}" onclick="window.location.hash='account-${n.account_id}'">
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
    <div class="card" style="height:100%">
      <div class="card-header">
        <span class="card-title">Alertes &amp; Notifications</span>
        ${criticalCount > 0 ? `<span class="badge badge-danger">${criticalCount} critique${criticalCount > 1 ? 's' : ''}</span>` : ''}
        <a href="#notifications" class="btn btn-ghost btn-sm" style="margin-left: auto">Voir toutes →</a>
      </div>
      <div class="notif-fade-container">
        ${items}
      </div>
    </div>
  `;
}

// Dashboard page — composes all dashboard widgets
// Phase 2: data comes from real Dynamics API via state

import { renderAccountsPanel } from '../components/accounts-panel.js';
import { renderOpportunitiesPanel } from '../components/opportunities-panel.js';
import { renderNotificationFeed } from '../components/notification-feed.js';
import { renderAgendaWidget } from '../components/agenda-widget.js';
import { getState } from '../state.js';

export function mountDashboard(outlet, openModalCallback) {
  const { accounts, opportunities, activities, notifications } = getState();

  // Set up 2-column grid layout
  outlet.className = 'layout-dashboard';
  outlet.innerHTML = `
    <div id="widget-accounts"      style="grid-column:1;grid-row:1"></div>
    <div id="widget-notifications" style="grid-column:2;grid-row:1/3"></div>
    <div id="widget-opportunities" style="grid-column:1;grid-row:2"></div>
    <div id="widget-agenda"        style="grid-column:1/3;grid-row:3"></div>
  `;

  renderAgendaWidget(
    document.getElementById('widget-agenda'),
    activities,
    openModalCallback
  );

  renderNotificationFeed(
    document.getElementById('widget-notifications'),
    notifications
  );

  renderAccountsPanel(
    document.getElementById('widget-accounts'),
    accounts
  );

  renderOpportunitiesPanel(
    document.getElementById('widget-opportunities'),
    opportunities
  );

  // Global listener for new activity
  const onActivitySaved = () => {
    // Re-render widget with new data
    const updatedState = getState();
    renderAgendaWidget(
      document.getElementById('widget-agenda'),
      updatedState.activities,
      openModalCallback
    );
  };
  
  // Clean up old listeners to prevent memory leaks if route changes
  window.removeEventListener('crm-activity-saved', window._dashboardActivityListener);
  window._dashboardActivityListener = onActivitySaved;
  window.addEventListener('crm-activity-saved', window._dashboardActivityListener);
}

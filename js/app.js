// OVHcloud CRM Dashboard — Main Entry Point
// Phase 1: Mock data | Phase 2: Replace loader paths with Dynamics 365 API

import { loadAll } from './data/loader.js';
import { setState } from './state.js';
import { initRouter, registerRoute } from './router.js';
import { renderNavSidebar } from './components/nav-sidebar.js';
import { renderKpiBar } from './components/kpi-bar.js';
import { initFloatingModal } from './components/floating-modal.js';

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[CRM] App initializing...');

  // Load all mock data in parallel
  const data = await loadAll();
  setState(data);

  const outlet = document.getElementById('page-outlet');

  // Render persistent chrome
  renderNavSidebar(
    document.getElementById('nav-sidebar'),
    data.user,
    data.accounts,
    data.opportunities
  );
  renderKpiBar(document.getElementById('kpi-bar'), data.user);
  initFloatingModal(document.getElementById('floating-modal-container'));

  const kpiBar = document.getElementById('kpi-bar');
  const showKpiBar = (visible) => kpiBar.classList.toggle('hidden', !visible);
  // Hidden by default until the dashboard route sets it visible
  showKpiBar(false);

  // Register routes (pages imported lazily to keep initial load fast)
  registerRoute('dashboard', async () => {
    showKpiBar(true);
    outlet.className = 'layout-dashboard';
    const { mountDashboard } = await import('./pages/dashboard.js');
    mountDashboard(outlet, (accountId, startStr, endStr) => window._openModal && window._openModal(accountId, startStr, endStr));
  });

  registerRoute('accounts', async () => {
    showKpiBar(false);
    outlet.className = '';
    outlet.style.gridTemplateColumns = '';
    const { mountAccounts } = await import('./pages/accounts.js');
    mountAccounts(outlet);
  });

  registerRoute('account-detail', async (hash) => {
    showKpiBar(false);
    outlet.className = '';
    outlet.style.gridTemplateColumns = '';
    const accountId = hash.replace('account-', '');
    const { mountAccountDetail } = await import('./pages/account-detail.js');
    mountAccountDetail(outlet, accountId);
  });

  registerRoute('opportunities', async () => {
    showKpiBar(false);
    outlet.className = '';
    outlet.style.gridTemplateColumns = '';
    const { mountOpportunities } = await import('./pages/opportunities.js');
    mountOpportunities(outlet);
  });

  registerRoute('contacts', () => {
    showKpiBar(false);
    outlet.className = '';
    outlet.style.gridTemplateColumns = '';
    outlet.innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:16px">👤</div>
        <h2 style="font-size:20px;margin-bottom:8px">Contacts</h2>
        <p>Disponible en Phase 2</p>
      </div>
    `;
  });

  registerRoute('activities', () => {
    showKpiBar(false);
    outlet.className = '';
    outlet.style.gridTemplateColumns = '';
    outlet.innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:16px">📋</div>
        <h2 style="font-size:20px;margin-bottom:8px">Activités</h2>
        <p>Disponible en Phase 2</p>
      </div>
    `;
  });

  registerRoute('reports', () => {
    showKpiBar(false);
    outlet.className = '';
    outlet.style.gridTemplateColumns = '';
    outlet.innerHTML = `
      <div style="padding:40px;text-align:center;color:var(--color-text-secondary)">
        <div style="font-size:48px;margin-bottom:16px">📊</div>
        <h2 style="font-size:20px;margin-bottom:8px">Rapports</h2>
        <p>Disponible en Phase 2</p>
      </div>
    `;
  });

  // Init router (reads current hash and navigates)
  initRouter();

  console.log('[CRM] App ready ✓');
});

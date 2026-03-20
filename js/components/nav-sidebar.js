export function renderNavSidebar(container, user, accounts, opportunities) {
  container.innerHTML = `
    <div class="nav-logo">
      <div class="nav-avatar" style="background: #0078d4">${user.avatar}</div>
      <div>
        <div class="nav-logo-text">OVHcloud CRM</div>
        <div class="nav-logo-sub">Account Manager</div>
      </div>
    </div>

    <div class="nav-section-label">Principal</div>

    <a class="nav-item" data-route="dashboard" href="#dashboard">
      <span class="nav-icon">⊞</span> Dashboard
    </a>
    <a class="nav-item" data-route="accounts" href="#accounts">
      <span class="nav-icon">🏢</span> Comptes
      <span class="nav-badge">${accounts.length}</span>
    </a>
    <a class="nav-item" data-route="opportunities" href="#opportunities">
      <span class="nav-icon">◈</span> Opportunités
      <span class="nav-badge">${opportunities.length}</span>
    </a>
    <a class="nav-item" data-route="contacts" href="#contacts">
      <span class="nav-icon">👤</span> Contacts
    </a>

    <div class="nav-section-label">Activité</div>

    <a class="nav-item" data-route="activities" href="#activities">
      <span class="nav-icon">📋</span> Activités
    </a>
    <a class="nav-item" data-route="reports" href="#reports">
      <span class="nav-icon">📊</span> Rapports
    </a>

    <div class="nav-user">
      <div class="nav-avatar">${user.avatar}</div>
      <div style="min-width:0">
        <div style="color:#fff;font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${user.firstName} ${user.lastName}
        </div>
        <div style="font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
          ${user.email}
        </div>
      </div>
    </div>
  `;
}

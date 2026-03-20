// Data loader — Phase 1: reads mock JSON files
// Phase 2: replace fetch paths with Dynamics 365 API endpoints
// See docs/api-integration-map.md for endpoint mapping

const BASE = '/js/data/';

export async function loadUser() {
  const r = await fetch(`${BASE}mock-user.json`);
  return r.json();
}

export async function loadAccounts() {
  const r = await fetch(`${BASE}mock-accounts.json`);
  return r.json();
}

export async function loadOpportunities() {
  const r = await fetch(`${BASE}mock-opportunities.json`);
  return r.json();
}

export async function loadActivities() {
  const r = await fetch(`${BASE}mock-activities.json`);
  return r.json();
}

export async function loadNotifications() {
  const r = await fetch(`${BASE}mock-notifications.json`);
  return r.json();
}

// Load all data in parallel
export async function loadAll() {
  const [user, accounts, opportunities, activities, notifications] =
    await Promise.all([
      loadUser(),
      loadAccounts(),
      loadOpportunities(),
      loadActivities(),
      loadNotifications()
    ]);
  return { user, accounts, opportunities, activities, notifications };
}

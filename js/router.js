// Hash-based router — #dashboard, #accounts, #opportunities, #contacts
const routes = {};

export function registerRoute(hash, handler) {
  routes[hash] = handler;
}

export function navigate(hash) {
  window.location.hash = hash;
}

export function initRouter() {
  const handle = () => {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    // Handle dynamic account routes like #account-acc-001
    const baseHash = hash.startsWith('account-') ? 'account-detail' : hash;
    const handler = routes[baseHash] || routes['dashboard'];
    if (handler) handler(hash);
    // Update nav active state
    document.querySelectorAll('.nav-item[data-route]').forEach(el => {
      el.classList.toggle('active', el.dataset.route === baseHash || el.dataset.route === hash);
    });
  };
  window.addEventListener('hashchange', handle);
  handle(); // run on load
}

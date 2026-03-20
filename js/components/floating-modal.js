// Floating Activity Modal — persistent zero-friction logger
// Phase 2: save action POSTs to Dynamics 365 API (phonecalls/appointments/tasks entities)
// See docs/api-integration-map.md for endpoint details

import { getState } from '../state.js';

let modalEl = null;
let fabEl = null;
let _open = false;
let _activeTab = 'call';

export function initFloatingModal(container) {
  // FAB button — always visible bottom-right
  fabEl = document.createElement('button');
  fabEl.className = 'btn-fab';
  fabEl.title = 'Logger une activité (Ctrl+L)';
  fabEl.setAttribute('aria-label', 'Ouvrir le journal d\'activité');
  fabEl.innerHTML = '+';
  fabEl.addEventListener('click', toggleModal);
  container.appendChild(fabEl);

  // Modal element — hidden initially
  modalEl = document.createElement('div');
  modalEl.className = 'modal-float';
  modalEl.style.display = 'none';
  container.appendChild(modalEl);

  // Keyboard shortcut Ctrl+L
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
      e.preventDefault();
      toggleModal();
    }
  });

  // Expose to window for cross-component access
  window._openModal = openModal;
}

function toggleModal() {
  if (_open) closeModal();
  else openModal();
}

export function openModal(prefillAccountId = null, prefillDateStr = null, prefillEndDateStr = null) {
  _open = true;
  renderModal(prefillAccountId, prefillDateStr, prefillEndDateStr);
  modalEl.style.display = 'block';
  fabEl.innerHTML = '✕';
  fabEl.style.background = 'var(--color-brand-darker)';
  // Focus the subject field after animation
  setTimeout(() => {
    const subjectField = modalEl.querySelector('#modal-subject');
    if (subjectField) subjectField.focus();
  }, 80);
}

function closeModal() {
  _open = false;
  modalEl.style.display = 'none';
  fabEl.innerHTML = '+';
  fabEl.style.background = '';
}

function renderModal(prefillAccountId, prefillDateStr = null, prefillEndDateStr = null) {
  const { accounts } = getState();

  const accountOptions = accounts.map(a =>
    `<option value="${a.id}" ${a.id === prefillAccountId ? 'selected' : ''}>${a.name}</option>`
  ).join('');

  const TABS = [
    { id: 'call',    label: '📞 Appel' },
    { id: 'meeting', label: '📅 Réunion' },
    { id: 'task',    label: '✅ Tâche' }
  ];

  const tabBar = TABS.map(t => `
    <div class="modal-tab ${t.id === _activeTab ? 'active' : ''}" data-tab="${t.id}">
      ${t.label}
    </div>
  `).join('');

  const now = prefillDateStr ? new Date(prefillDateStr) : new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  const todayLocal = new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);

  let endLocal = todayLocal;
  if (prefillEndDateStr) {
    const end = new Date(prefillEndDateStr);
    endLocal = new Date(end.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
  } else {
    // Default duration is 30 mins
    const endDef = new Date(now.getTime() + 30 * 60000);
    endLocal = new Date(endDef.getTime() - timezoneOffsetMs).toISOString().slice(0, 16);
  }

  modalEl.innerHTML = `
    <div class="modal-header">
      <span class="modal-title">Logger une activité</span>
      <button class="modal-close" id="modal-close-btn" aria-label="Fermer">✕</button>
    </div>
    <div class="modal-tabs" id="modal-tabs">${tabBar}</div>
    <div class="modal-body">
      <div>
        <label class="field-label" for="modal-account">Compte</label>
        <select class="field-select" id="modal-account">
          <option value="">— Sélectionner un compte —</option>
          ${accountOptions}
        </select>
      </div>
      <div>
        <label class="field-label" for="modal-subject">Sujet *</label>
        <input
          type="text"
          class="field-input"
          id="modal-subject"
          placeholder="Ex : Suivi proposition commerciale"
          autocomplete="off"
        />
      </div>
      <div style="display:flex; gap:16px;">
        <div style="flex:1">
          <label class="field-label" for="modal-date">Début</label>
          <input type="datetime-local" class="field-input" id="modal-date" value="${todayLocal}" />
        </div>
        <div style="flex:1">
          <label class="field-label" for="modal-date-end">Fin</label>
          <input type="datetime-local" class="field-input" id="modal-date-end" value="${endLocal}" />
        </div>
      </div>
      <div>
        <label class="field-label" for="modal-notes">Notes</label>
        <div class="field-stt">
          <textarea
            class="field-textarea"
            id="modal-notes"
            placeholder="Notes de l'activité…"
          ></textarea>
          <button class="btn-stt" id="btn-stt" title="Dicter via Greffier/Gladia (Phase 2)" type="button">🎤</button>
        </div>
        <div style="font-size:11px;color:var(--color-text-disabled);margin-top:4px">
          🎤 Speech-to-Text disponible en Phase 2 (Greffier / Gladia)
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost" id="modal-cancel" type="button">Annuler</button>
      <button class="btn btn-primary" id="modal-save" type="button">Enregistrer</button>
    </div>
  `;

  // Tab switching
  modalEl.querySelector('#modal-tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.modal-tab');
    if (!tab) return;
    _activeTab = tab.dataset.tab;
    modalEl.querySelectorAll('.modal-tab').forEach(t =>
      t.classList.toggle('active', t.dataset.tab === _activeTab)
    );
  });

  // Close buttons
  modalEl.querySelector('#modal-close-btn').addEventListener('click', closeModal);
  modalEl.querySelector('#modal-cancel').addEventListener('click', closeModal);

  // STT placeholder — Phase 2
  modalEl.querySelector('#btn-stt').addEventListener('click', () => {
    alert(
      'Speech-to-Text sera connecté à Greffier / Gladia en Phase 2.\n\n' +
      'La transcription audio apparaîtra automatiquement dans le champ Notes.'
    );
  });

  // Save
  modalEl.querySelector('#modal-save').addEventListener('click', () => {
    const subjectEl = modalEl.querySelector('#modal-subject');
    const subject = subjectEl.value.trim();

    if (!subject) {
      subjectEl.style.borderColor = 'var(--color-danger)';
      subjectEl.focus();
      return;
    }

    const payload = {
      type: _activeTab,
      account_id: modalEl.querySelector('#modal-account').value,
      subject,
      due_date: new Date(modalEl.querySelector('#modal-date').value).toISOString(),
      // End date parsing / storing
      end_date: new Date(modalEl.querySelector('#modal-date-end').value).toISOString(),
      notes: modalEl.querySelector('#modal-notes').value.trim()
    };

    // Phase 1: mock save in memory
    const state = getState();
    if(state && state.activities) {
      state.activities.push(payload);
    }
    console.log('[CRM] Activity saved (mock):', payload);
    
    // Notify app to re-render
    window.dispatchEvent(new CustomEvent('crm-activity-saved'));

    closeModal();
  });

  // Close on Escape key
  modalEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

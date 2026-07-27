(function consentManager(global) {
  'use strict';

  const storageKey = 'lefusil_consent_v1';
  const version = global.LEFUSIL_SITE_CONFIG.consentVersion;
  const defaults = { necessary: true, preferences: false, analytics: false, marketing: false, version, timestamp: null };
  let opener = null;

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey));
      return value?.version === version ? { ...defaults, ...value } : null;
    } catch { return null; }
  }

  function write(value) {
    const state = { ...defaults, ...value, necessary: true, version, timestamp: new Date().toISOString() };
    try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch {}
    global.dispatchEvent(new CustomEvent('lefusil:consent', { detail: state }));
    global.lefusilAnalytics?.track('cookie_consent_updated', { locale: global.LEFUSIL_LOCALE?.current });
    render();
    return state;
  }

  function markup() {
    const categories = ['necessary', 'preferences', 'analytics', 'marketing'].map((type) => `
      <label><span><strong>${type[0].toUpperCase() + type.slice(1)}</strong><small>${type === 'necessary' ? 'Required for locale, consent and core interactions.' : 'No external service is currently connected.'}</small></span>
      <input type="checkbox" name="${type}" ${type === 'necessary' ? 'checked disabled' : ''}></label>`).join('');
    return `<div class="consent-banner" id="consentBanner" role="region" aria-label="Cookie consent"><div><strong>Privacy preferences</strong><p>Necessary storage supports site features. Optional analytics and marketing remain disabled unless you consent.</p></div><div class="consent-actions"><button class="btn" data-consent-all>Accept All</button><button class="btn btn-outline" data-consent-reject>Reject Non-Essential</button><button class="footer-text-button" data-consent-manage>Manage Preferences</button></div></div><div class="consent-dialog" id="consentDialog" role="dialog" aria-modal="true" aria-labelledby="consentTitle" aria-hidden="true"><div class="consent-backdrop"></div><form class="consent-panel"><h2 id="consentTitle">Cookie Settings</h2><p>Choose optional categories. Necessary storage cannot be disabled.</p>${categories}<div class="consent-actions"><button class="btn" type="submit">Save</button><button class="btn btn-outline" type="button" data-consent-cancel>Cancel</button><button class="footer-text-button" type="button" data-consent-reset>Reset consent</button></div></form></div>`;
  }

  function render() { const banner = document.querySelector('#consentBanner'); if (banner) banner.hidden = Boolean(read()); }
  function open() {
    opener = document.activeElement;
    const dialog = document.querySelector('#consentDialog');
    const state = read() || defaults;
    ['preferences', 'analytics', 'marketing'].forEach((type) => { dialog.querySelector(`[name=${type}]`).checked = state[type]; });
    dialog.classList.add('open'); dialog.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock');
    dialog.querySelector('input:not(:disabled)').focus();
  }
  function close() {
    const dialog = document.querySelector('#consentDialog');
    dialog.classList.remove('open'); dialog.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); opener?.focus();
  }

  addEventListener('DOMContentLoaded', () => {
    document.body.insertAdjacentHTML('beforeend', markup());
    global.lefusilI18n?.apply(document);
    render();
    document.addEventListener('click', (event) => {
      if (event.target.closest('[data-consent-all]')) write({ preferences: true, analytics: true, marketing: true });
      if (event.target.closest('[data-consent-reject]')) write(defaults);
      if (event.target.closest('[data-consent-manage]')) open();
      if (event.target.closest('[data-consent-cancel],.consent-backdrop')) close();
      if (event.target.closest('[data-consent-reset]')) { try { localStorage.removeItem(storageKey); } catch {} close(); render(); }
    });
    document.querySelector('#consentDialog form').addEventListener('submit', (event) => {
      event.preventDefault(); const data = new FormData(event.target);
      write({ preferences: data.has('preferences'), analytics: data.has('analytics'), marketing: data.has('marketing') }); close();
    });
    document.addEventListener('keydown', (event) => {
      const dialog = document.querySelector('#consentDialog.open'); if (!dialog) return;
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      if (event.key === 'Tab') {
        const items = [...dialog.querySelectorAll('button,input:not([disabled])')]; const first = items[0]; const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  });
  global.lefusilConsent = { get: () => read() || defaults, set: write, open };
})(window);

const AGE_GATE_KEY = 'jonezie_age_gate_ack_v2';
const AGE_GATE_STYLE_ID = 'jonezie-live-overrides';
const AGE_GATE_STYLE_HREF = 'live-overrides.css?v=20260427a';

function ensureAgeGateStyles() {
  if (!document.head || document.getElementById(AGE_GATE_STYLE_ID)) return;
  const link = document.createElement('link');
  link.id = AGE_GATE_STYLE_ID;
  link.rel = 'stylesheet';
  link.href = AGE_GATE_STYLE_HREF;
  document.head.appendChild(link);
}

function initAgeGate() {
  ensureAgeGateStyles();
  if (window.localStorage.getItem(AGE_GATE_KEY) === 'true') return;

  const gate = document.createElement('div');
  gate.className = 'age-gate';
  gate.setAttribute('data-age-gate', '');
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'age-gate-title');
  gate.setAttribute('aria-describedby', 'age-gate-description');

  gate.innerHTML = `
    <div class="age-gate__backdrop" aria-hidden="true"></div>
    <section class="age-gate__dialog">
      <div class="age-gate__brand">
        <img src="jonezie-labs-logo.webp?v=20261029" alt="Jonezie Labs" />
      </div>
      <span class="age-gate__eyebrow">21+ confirmation required</span>
      <h2 id="age-gate-title">Before you enter, confirm you are 21 or older.</h2>
      <p id="age-gate-description" class="age-gate__lead">
        This website is intended only for adults age 21+ who understand that all peptide listings from Jonezie Labs are offered strictly for research use only and are not for human use.
      </p>
      <div class="age-gate__checks">
        <label class="age-gate__check">
          <input type="checkbox" data-age-gate-check="age" />
          <span>
            <strong>Age acknowledgment</strong>
            <small>I confirm I am 21 years of age or older.</small>
          </span>
        </label>
        <label class="age-gate__check">
          <input type="checkbox" data-age-gate-check="research" />
          <span>
            <strong>Research-use acknowledgment</strong>
            <small>I understand all peptide products offered by Jonezie Labs are for research use only and are not for human use.</small>
          </span>
        </label>
      </div>
      <div class="age-gate__actions">
        <button class="button primary" type="button" data-age-gate-confirm disabled>I am 21+ and I understand</button>
        <button class="button secondary" type="button" data-age-gate-exit>Leave site</button>
      </div>
      <p class="age-gate__disclaimer">Entering the site means you acknowledge these terms before browsing products, pricing, or checkout.</p>
    </section>
  `;

  const confirmButton = gate.querySelector('[data-age-gate-confirm]');
  const exitButton = gate.querySelector('[data-age-gate-exit]');
  const checks = Array.from(gate.querySelectorAll('[data-age-gate-check]'));
  const focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const closeGate = () => {
    window.localStorage.setItem(AGE_GATE_KEY, 'true');
    document.body.classList.remove('age-gate-open');
    gate.remove();
  };

  const exitSite = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.location.href = 'about:blank';
  };

  document.body.appendChild(gate);
  document.body.classList.add('age-gate-open');
  confirmButton?.focus();

  const syncConfirmState = () => {
    const allChecked = checks.every((check) => check.checked);
    if (confirmButton) confirmButton.disabled = !allChecked;
  };

  checks.forEach((check) => {
    check.addEventListener('change', syncConfirmState);
  });

  syncConfirmState();
  confirmButton?.addEventListener('click', closeGate);
  exitButton?.addEventListener('click', exitSite);

  gate.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      return;
    }

    if (event.key !== 'Tab') return;
    const nodes = Array.from(gate.querySelectorAll(focusable)).filter((node) => !node.hasAttribute('disabled'));
    if (!nodes.length) return;

    const first = nodes[0];
    const last = nodes[nodes.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function bindCheckoutAgeGate() {
  if (window.localStorage.getItem(AGE_GATE_KEY) === 'true') return;

  const pathname = window.location.pathname || '';
  const isCheckout = pathname.endsWith('/checkout.html') || pathname.endsWith('checkout.html');
  if (!isCheckout) return;

  const form = document.querySelector('[data-checkout-form]');
  if (!form || form.dataset.ageGateBound === 'true') return;
  form.dataset.ageGateBound = 'true';

  let gateShown = false;
  const showGate = (event) => {
    if (window.localStorage.getItem(AGE_GATE_KEY) === 'true') return;
    if (gateShown) return;
    gateShown = true;
    if (event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
    initAgeGate();
  };

  form.addEventListener('submit', showGate, true);
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('focus', showGate, { once: true });
    field.addEventListener('input', showGate, { once: true });
    field.addEventListener('change', showGate, { once: true });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindCheckoutAgeGate);
} else {
  bindCheckoutAgeGate();
}

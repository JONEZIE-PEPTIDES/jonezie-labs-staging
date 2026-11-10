(() => {
  const library = window.JONEZIE_SITE_LIBRARY || null;
  if (!library) return;

  const pathname = window.location.pathname || '';
  const isCheckout = pathname.endsWith('/checkout.html') || pathname.endsWith('checkout.html');
  if (isCheckout) return;
  const searchParams = new URLSearchParams(window.location.search);
  const forcePreview = searchParams.get('showLeadCapture') === '1';

  const STORAGE_KEY = 'jonezie_lead_capture_state';
  const WELCOME_CODE = 'TRIBE';
  const WELCOME_DISCOUNT_RATE = 0.30;
  const WELCOME_CLAIMS_KEY = 'jonezie_tribe_claimed_emails';
  const DAILY_EXPOSURE_MS = 1000 * 60 * 60 * 24;
  const existingState = getState();
  const lastExposureAt = existingState.lastShownAt || existingState.dismissedAt || 0;
  const hasRecentExposure = lastExposureAt && (Date.now() - lastExposureAt) < DAILY_EXPOSURE_MS;
  const hasSignup = Boolean(existingState.email);

  bindInlineForms();
  if (!forcePreview && (hasSignup || hasRecentExposure)) return;

  const modal = injectModal();
  if (!modal) return;
  if (forcePreview) {
    modal.hidden = false;
    modal.dataset.trigger = 'Preview override';
    document.body.classList.add('lead-capture-open');
  }
  bindTriggers(modal);

  function bindInlineForms() {
    const forms = document.querySelectorAll('[data-lead-inline-form], .vendor-form-updates');
    forms.forEach((form) => {
      if (form.dataset.leadBound) return;
      form.dataset.leadBound = 'true';

      const trigger = form.querySelector('[data-lead-inline-submit], .vendor-submit');
      const emailInput = form.querySelector('input[type="email"]');
      const phoneInput = form.querySelector('input[name="updatesPhone"], input[name="phone"]');
      const feedback = ensureInlineFeedback(form);

      trigger?.addEventListener('click', async () => {
        const email = String(emailInput?.value || '').trim();
        if (!isValidEmail(email)) {
          feedback.textContent = 'Enter a valid email to sign up.';
          return;
        }

        const state = {
          email,
          phone: String(phoneInput?.value || '').trim(),
          source: 'Inline signup',
          trigger: 'Inline form',
          subscribedAt: Date.now()
        };
        trigger.disabled = true;
        feedback.textContent = 'Saving your signup...';
        const submission = await submitLeadSignup(state);
        trigger.disabled = false;
        if (!submission.ok) {
          feedback.textContent = 'We could not save that signup. Email customerservice@jonezielabs.com and we will get you added.';
          return;
        }
        persistState(state);
        window.JONEZIE_ANALYTICS?.generateLead('inline_signup', {
          lead_source: state.source
        });
        feedback.textContent = 'You are set. Thanks for signing up.';
      });
    });
  }

  function injectModal() {
    const wrapper = document.createElement('div');
    wrapper.className = 'lead-capture-modal';
    wrapper.hidden = true;
    wrapper.innerHTML = `
      <div class="lead-capture-backdrop" data-lead-close></div>
      <div class="lead-capture-dialog" role="dialog" aria-modal="true" aria-label="Jonezie Labs insider access">
        <button class="lead-capture-close" type="button" data-lead-close aria-label="Close sign-up prompt">&times;</button>
        <div class="lead-capture-brand">
          <img class="lead-capture-logo" src="jonezie-labs-white-logo.webp?v=20261029" alt="Jonezie Labs" />
        </div>
        <p class="eyebrow">Jonezie Labs</p>
        <h2>Stay Connected</h2>
        <p>New drops. Clean references. Major sales.</p>
        <p class="lead-capture-offer">Sign up and receive 30% off your first order.</p>
        <form class="lead-capture-form" data-lead-modal-form>
          <label>
            <span class="sr-only">Name</span>
            <input type="text" name="name" placeholder="Name" aria-label="Name" autocomplete="name" required />
          </label>
          <label>
            <span class="sr-only">Email</span>
            <input type="email" name="email" placeholder="Email" aria-label="Email" autocomplete="email" required />
          </label>
          <button class="button primary lead-capture-submit" type="submit">Get Access</button>
          <p class="lead-capture-feedback" data-lead-feedback aria-live="polite"></p>
          <p class="lead-capture-note">No spam. Research reference only.</p>
        </form>
      </div>`;
    document.body.appendChild(wrapper);

    const form = wrapper.querySelector('[data-lead-modal-form]');
    const feedback = wrapper.querySelector('[data-lead-feedback]');
    form?.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      if (!name) {
        feedback.textContent = 'Enter your name to continue.';
        return;
      }
      if (!isValidEmail(email)) {
        feedback.textContent = 'Enter a valid email to continue.';
        return;
      }
      const emailKey = normalizeEmail(email);
      const alreadyIssued = hasWelcomeCodeClaim(emailKey);

      const state = {
        name,
        email,
        source: 'Lead capture modal',
        trigger: wrapper.dataset.trigger || 'Manual',
        subscribedAt: Date.now(),
        welcomeCode: WELCOME_CODE,
        welcomeDiscountRate: WELCOME_DISCOUNT_RATE,
        welcomeCodeStatus: alreadyIssued ? 'existing' : 'new'
      };
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) submitButton.disabled = true;
      feedback.textContent = 'Saving your signup...';
      const submission = await submitLeadSignup(state);
      if (submitButton) submitButton.disabled = false;
      if (!submission.ok) {
        feedback.textContent = 'We could not save that signup. Email customerservice@jonezielabs.com and we will get you added.';
        return;
      }
      markWelcomeCodeClaim(emailKey);
      persistState(state);
      window.JONEZIE_ANALYTICS?.generateLead('lead_capture_modal', {
        lead_source: state.source,
        lead_trigger: state.trigger
      });
      renderWelcomeConfirmation(wrapper, state);
    });

    wrapper.querySelectorAll('[data-lead-close]').forEach((button) => {
      button.addEventListener('click', () => dismiss(wrapper));
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !wrapper.hidden) dismiss(wrapper);
    });

    return wrapper;
  }

  function bindTriggers(modal) {
    let shown = false;
    let scrollTimerStarted = false;

    const open = (trigger) => {
      if (shown || getState().email) return;
      shown = true;
      modal.hidden = false;
      modal.dataset.trigger = trigger;
      document.body.classList.add('lead-capture-open');
      const state = getState();
      persistState({ ...state, lastShownAt: Date.now() });
    };

    const onFirstScroll = () => {
      if (scrollTimerStarted) return;
      scrollTimerStarted = true;
      window.removeEventListener('scroll', onFirstScroll);
      window.setTimeout(() => open('25 seconds after first scroll'), 25000);
    };

    window.addEventListener('scroll', onFirstScroll, { passive: true, once: true });
  }

  function dismiss(modal) {
    modal.hidden = true;
    document.body.classList.remove('lead-capture-open');
    const state = getState();
    persistState({ ...state, dismissedAt: Date.now() });
  }

  function ensureInlineFeedback(form) {
    let feedback = form.querySelector('[data-lead-inline-feedback]');
    if (!feedback) {
      feedback = document.createElement('p');
      feedback.setAttribute('data-lead-inline-feedback', '');
      feedback.className = 'lead-inline-feedback';
      form.appendChild(feedback);
    }
    return feedback;
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || '').trim());
  }

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function getWelcomeClaims() {
    try {
      const claims = JSON.parse(window.localStorage.getItem(WELCOME_CLAIMS_KEY) || '{}');
      return claims && typeof claims === 'object' ? claims : {};
    } catch {
      return {};
    }
  }

  function hasWelcomeCodeClaim(emailKey) {
    return Boolean(emailKey && getWelcomeClaims()[emailKey]);
  }

  function markWelcomeCodeClaim(emailKey) {
    if (!emailKey) return;
    const claims = getWelcomeClaims();
    claims[emailKey] = {
      code: WELCOME_CODE,
      claimedAt: Date.now()
    };
    window.localStorage.setItem(WELCOME_CLAIMS_KEY, JSON.stringify(claims));
  }

  function getState() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function persistState(state) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function renderWelcomeConfirmation(wrapper, state) {
    const dialog = wrapper.querySelector('.lead-capture-dialog');
    if (!dialog) return;
    dialog.classList.add('lead-capture-dialog-confirmed');
    dialog.innerHTML = `
      <button class="lead-capture-close" type="button" data-lead-close aria-label="Close sign-up prompt">&times;</button>
      <div class="lead-capture-brand">
        <img class="lead-capture-logo" src="jonezie-labs-white-logo.webp?v=20261029" alt="Jonezie Labs" />
      </div>
      <p class="eyebrow">Jonezie Labs</p>
      <h2>Welcome to the tribe!</h2>
      <p>Here is your 30% off code for your first order.</p>
      <div class="lead-capture-code-box" aria-label="Welcome discount code">
        <span>${WELCOME_CODE}</span>
        <button class="lead-capture-copy" type="button" data-lead-copy-code>Copy Code</button>
      </div>
      <p class="lead-capture-note">One first-order code per email address.</p>
      <p class="lead-capture-feedback" data-lead-feedback aria-live="polite"></p>
    `;
    const copyButton = dialog.querySelector('[data-lead-copy-code]');
    const feedback = dialog.querySelector('[data-lead-feedback]');
    copyButton?.addEventListener('click', async () => {
      const copied = await copyText(WELCOME_CODE);
      copyButton.textContent = copied ? 'Copied!' : 'Copy failed';
      if (feedback) feedback.textContent = copied ? `Code copied. Paste ${WELCOME_CODE} at checkout.` : `Select and copy ${WELCOME_CODE} manually.`;
      window.setTimeout(() => {
        copyButton.textContent = 'Copy Code';
      }, 1600);
    });
    dialog.querySelectorAll('[data-lead-close]').forEach((button) => {
      button.addEventListener('click', () => dismiss(wrapper));
    });
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch {}
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try {
      copied = document.execCommand('copy');
    } catch {
      copied = false;
    }
    textarea.remove();
    return copied;
  }

  async function submitLeadSignup(state) {
    if (typeof library.submitLeadCapture !== 'function') {
      return { ok: false, reason: 'missing-submit-handler' };
    }

    return library.submitLeadCapture({
      name: state.name,
      email: state.email,
      phone: state.phone,
      source: state.source,
      trigger: state.trigger,
      welcomeCode: state.welcomeCode,
      welcomeDiscountRate: state.welcomeDiscountRate,
      welcomeCodeStatus: state.welcomeCodeStatus,
      page: window.location.href
    });
  }
})();

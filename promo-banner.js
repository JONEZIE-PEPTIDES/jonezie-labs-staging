(() => {
  const DEFAULT_PROMO = {
    code: 'FALL25',
    rate: 0.25,
    freeShipping: false,
    message: 'Use code FALL25 for 25% off'
  };

  const USA250_PROMO = {
    code: 'USA250',
    rate: 0.35,
    freeShipping: false,
    message: 'Use code USA250 for 35% off through July 5',
    startsAt: '2026-06-29T00:00:00-04:00',
    endsAt: '2026-07-06T00:00:00-04:00'
  };

  const MEMORIAL_DAY_PROMO = {
    code: 'MD25',
    rate: 0.25,
    freeShipping: false,
    message: 'Memorial Day sale: use code MD25 for 25% off',
    startsAt: '2026-05-22T00:00:00-04:00',
    endsAt: '2026-05-26T00:00:00-04:00'
  };

  function isPromoActive(promo, now = Date.now()) {
    if (!promo?.startsAt || !promo?.endsAt) return true;
    const startsAt = Date.parse(promo.startsAt);
    const endsAt = Date.parse(promo.endsAt);
    if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false;
    return now >= startsAt && now < endsAt;
  }

  function getActivePromo(now = Date.now()) {
    if (isPromoActive(USA250_PROMO, now)) return USA250_PROMO;
    if (isPromoActive(MEMORIAL_DAY_PROMO, now)) return MEMORIAL_DAY_PROMO;
    return applyTemporaryRate(DEFAULT_PROMO, now);
  }

  function getPromoByCode(code, now = Date.now()) {
    const normalized = String(code || '').trim().toUpperCase();
    if (!normalized) return null;
    if (normalized === USA250_PROMO.code) {
      return isPromoActive(USA250_PROMO, now) ? USA250_PROMO : null;
    }
    if (normalized === MEMORIAL_DAY_PROMO.code) {
      return isPromoActive(MEMORIAL_DAY_PROMO, now) ? MEMORIAL_DAY_PROMO : null;
    }
    if (normalized === DEFAULT_PROMO.code) return applyTemporaryRate(DEFAULT_PROMO, now);
    return null;
  }

  function applyTemporaryRate(promo, now = Date.now()) {
    const temporaryRate = promo?.temporaryRate;
    if (!temporaryRate) return promo;
    const startsAt = Date.parse(temporaryRate.startsAt);
    const endsAt = Date.parse(temporaryRate.endsAt);
    const isTemporaryActive = Number.isFinite(startsAt) && Number.isFinite(endsAt) && now >= startsAt && now < endsAt;
    if (!isTemporaryActive) return promo;
    return {
      ...promo,
      rate: Number(temporaryRate.rate || promo.rate || 0),
      message: temporaryRate.message || promo.message
    };
  }

  function renderPromoCopy() {
    const activePromo = getActivePromo();
    document.querySelectorAll('.promo-track span').forEach((span) => {
      if (span.textContent.includes('Use code') || span.textContent.includes('Memorial Day sale')) {
        span.textContent = activePromo.message;
      }
    });

    const checkoutPromoCopy = document.querySelector('[data-active-promo-copy]');
    if (checkoutPromoCopy) {
      checkoutPromoCopy.innerHTML = `Active code: <strong>${activePromo.code}</strong> (${Math.round(activePromo.rate * 100)}% off)`;
    }

    document.dispatchEvent(new CustomEvent('jonezie:promo-updated', {
      detail: {
        code: activePromo.code,
        rate: activePromo.rate,
        message: activePromo.message,
        freeShipping: activePromo.freeShipping
      }
    }));
  }

  window.JONEZIE_PROMO = {
    DEFAULT_PROMO,
    USA250_PROMO,
    MEMORIAL_DAY_PROMO,
    getActivePromo,
    getPromoByCode,
    isPromoActive,
    applyTemporaryRate
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPromoCopy, { once: true });
  } else {
    renderPromoCopy();
  }
})();

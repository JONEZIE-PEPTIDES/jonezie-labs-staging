(() => {
  const DEFAULT_PROMO = {
    code: 'FALL25',
    rate: 0.25,
    freeShipping: false,
    message: 'Use code FALL25 for 25% off'
  };
  const AD_FALL_SALE = {
    code: 'FALL40-AUTO',
    rate: 0.40,
    freeShipping: false,
    auto: true,
    message: 'Fall sale · 40% off automatically'
  };

  function isAdSaleContext() {
    const path = window.location.pathname;
    if (/(^|\/)research-(entry|store)\.html$/.test(path)) return true;
    if (new URLSearchParams(window.location.search).get('ad') !== 'fall40') return false;
    return /\/products\/[^/]+\.html$|\/product\.html$|\/checkout\.html$/.test(path);
  }

  function withAdSale(url) {
    if (!isAdSaleContext()) return url;
    const target = new URL(url, document.baseURI);
    if (target.origin !== window.location.origin) return url;
    if (!/\/products\/[^/]+\.html$|\/product\.html$|\/checkout\.html$|\/research-store\.html$/.test(target.pathname)) return url;
    target.searchParams.set('ad', 'fall40');
    const current = new URLSearchParams(window.location.search);
    for (const [key, value] of current) {
      if (/^utm_[a-z0-9_]+$/i.test(key) || ['ttclid', 'gclid', 'fbclid'].includes(key.toLowerCase())) {
        if (!target.searchParams.has(key)) target.searchParams.set(key, value);
      }
    }
    return target.href;
  }

  function getAdSaleUnitPrice(price) {
    const unitCents = Math.round(Number(price) * 100);
    if (!Number.isFinite(unitCents) || unitCents < 0) return 0;
    return Math.round(unitCents * (1 - AD_FALL_SALE.rate)) / 100;
  }

  if (isAdSaleContext()) {
    document.body.classList.add('ad-sale-mode');
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'ad-sale.css?v=20261103adfall40';
    document.head.appendChild(style);
    document.addEventListener('click', (event) => {
      const link = event.target.closest?.('a[href]');
      if (!link) return;
      link.href = withAdSale(link.href);
    }, true);
    if (/\/products\/[^/]+\.html$|\/product\.html$|\/checkout\.html$/.test(window.location.pathname)) {
      const focusAdLinks = () => {
        document.querySelectorAll('a[href]').forEach((link) => {
          const target = new URL(link.href, document.baseURI);
          if (target.origin !== window.location.origin) return;
          if (/\/(research-guides|comparison)\.html$/.test(target.pathname)) {
            link.remove();
          } else if (/\/catalog\.html$/.test(target.pathname)) {
            link.href = withAdSale('research-store.html#full-catalog');
          } else if (/\/index\.html$/.test(target.pathname) &&
            ['', '#top', '#featured', '#full-catalog'].includes(target.hash)) {
            link.href = withAdSale('research-store.html');
          }
        });
      };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(focusAdLinks), { once: true });
      } else {
        requestAnimationFrame(focusAdLinks);
      }
    }
  }

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
    if (isAdSaleContext()) return AD_FALL_SALE;
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
      if (span.textContent.includes('Use code') || span.textContent.includes('Memorial Day sale') || span.textContent.includes('Fall sale')) {
        span.textContent = activePromo.message;
      }
    });

    const checkoutPromoCopy = document.querySelector('[data-active-promo-copy]');
    if (checkoutPromoCopy && activePromo.auto) {
      checkoutPromoCopy.innerHTML = '<strong>Fall sale: 40% off automatically applied.</strong> Other codes cannot be combined.';
    } else if (checkoutPromoCopy) {
      checkoutPromoCopy.innerHTML = `Active code: <strong>${activePromo.code}</strong> (${Math.round(activePromo.rate * 100)}% off)`;
    }

    document.dispatchEvent(new CustomEvent('jonezie:promo-updated', {
      detail: {
        code: activePromo.code,
        rate: activePromo.rate,
        message: activePromo.message,
        freeShipping: activePromo.freeShipping,
        auto: Boolean(activePromo.auto)
      }
    }));
  }

  window.JONEZIE_PROMO = {
    DEFAULT_PROMO,
    AD_FALL_SALE,
    USA250_PROMO,
    MEMORIAL_DAY_PROMO,
    getActivePromo,
    getPromoByCode,
    isPromoActive,
    applyTemporaryRate,
    isAdSaleContext,
    withAdSale,
    getAdSaleUnitPrice
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderPromoCopy, { once: true });
  } else {
    renderPromoCopy();
  }
})();

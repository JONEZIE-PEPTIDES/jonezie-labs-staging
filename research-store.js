(() => {
  const offer = window.JONEZIE_PROMO?.getActivePromo?.();
  if (offer?.code && Number.isFinite(Number(offer.rate))) {
    const headline = document.querySelector('.ad-offer strong');
    const detail = document.querySelector('.ad-offer > div > span:last-child');
    if (headline) headline.textContent = `${Math.round(Number(offer.rate) * 100)}% off eligible products`;
    if (detail) {
      detail.textContent = '';
      detail.append('Use code ');
      const code = document.createElement('b');
      code.textContent = String(offer.code);
      detail.append(code, ' at checkout. Shipping is excluded.');
    }
  }

  // Keep this campaign page's navigation focused after the shared nav script runs.
  const focusNavigation = () => {
    const links = [
      ['Products', '#full-catalog'],
      ['Shipping', 'shipping-policy.html'],
      ['Policies', 'terms.html'],
      ['Contact', 'mailto:customerservice@jonezielabs.com']
    ];
    const menu = document.querySelector('.brand-menu-panel');
    if (menu) menu.innerHTML = links.map(([name, href]) => `<a href="${href}">${name}</a>`).join('');
    const nav = document.querySelector('.site-nav');
    if (nav) {
      nav.querySelectorAll('.site-nav-mobile-link').forEach((link) => link.remove());
      const pill = nav.querySelector('.nav-products-pill');
      if (pill) {
        pill.insertAdjacentHTML('beforebegin', links.map(([name, href]) => `<a class="site-nav-mobile-link" href="${href}">${name}</a>`).join(''));
        pill.href = '#full-catalog';
      }
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', focusNavigation, { once: true });
  } else {
    focusNavigation();
  }
  // Carry common campaign parameters to product and checkout links on the same site.
  const campaign = new URLSearchParams(location.search);
  const allowed = Array.from(campaign.entries()).filter(([key]) =>
    /^utm_[a-z0-9_]+$/i.test(key) || ['ttclid', 'gclid', 'fbclid'].includes(key.toLowerCase()));
  if (!allowed.length) return;
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link || link.getAttribute('href')?.startsWith('#')) return;
    const destination = new URL(link.href, location.href);
    if (destination.origin !== location.origin || !/\/(products\/[^/]+\.html|product\.html|catalog\.html|checkout\.html)$/.test(destination.pathname)) return;
    allowed.forEach(([key, value]) => {
      if (!destination.searchParams.has(key)) destination.searchParams.set(key, value);
    });
    link.href = destination.href;
  }, true);
})();

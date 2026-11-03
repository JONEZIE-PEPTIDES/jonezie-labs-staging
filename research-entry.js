(() => {
  const offer = window.JONEZIE_PROMO?.getActivePromo?.();
  if (offer?.code && Number.isFinite(Number(offer.rate))) {
    const headline = document.querySelector('[data-entry-offer]');
    const code = document.querySelector('[data-entry-code]');
    if (headline) headline.textContent = `${Math.round(Number(offer.rate) * 100)}% off eligible products`;
    if (code) code.textContent = String(offer.code);
  }

  const link = document.querySelector('[data-entry-link]');
  if (!link) return;
  const destination = new URL(link.href, location.href);
  const campaign = new URLSearchParams(location.search);
  for (const [key, value] of campaign.entries()) {
    if (/^utm_[a-z0-9_]+$/i.test(key) || ['ttclid', 'gclid', 'fbclid'].includes(key.toLowerCase())) {
      destination.searchParams.set(key, value);
    }
  }
  link.href = destination.href;
})();

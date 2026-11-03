(() => {
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

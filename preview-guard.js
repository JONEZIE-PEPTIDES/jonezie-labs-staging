(() => {
  window.JONEZIE_STAGING_PREVIEW = true;
  document.addEventListener('submit', (event) => {
    if (event.target.matches('[data-nav-search-form]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    window.alert('This is a staging preview. Order requests and signups are disabled here.');
  }, true);
  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = '@media (max-width: 640px) { body.product-sticky-visible .staging-preview-banner { bottom: calc(112px + env(safe-area-inset-bottom)) !important; } } @media (min-width: 641px) { body.product-sticky-visible .staging-preview-banner { bottom: 96px !important; } }';
    document.head.appendChild(style);
    const banner = document.createElement('div');
    banner.className = 'staging-preview-banner';
    banner.textContent = 'STAGING PREVIEW · Checkout and signups disabled';
    banner.setAttribute('aria-label', 'Staging preview');
    banner.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483647;max-width:calc(100vw - 24px);padding:9px 13px;border:1px solid #66e0d2;border-radius:12px;background:#071b28;color:#c9fff0;box-shadow:0 8px 26px #0005;font:700 12px/1.3 Arial,sans-serif;pointer-events:none';
    document.body.appendChild(banner);
  });
})();

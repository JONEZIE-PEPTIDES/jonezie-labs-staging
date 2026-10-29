(() => {
  const ROOT = location.pathname.includes('/products/') ? '../' : '';
  const FOOTER_STYLE_ID = 'jonezie-site-footer-styles';
  const FOOTER_CSS = ``;
  const FOOTER_HTML = `
    <div class="footer-panel">
      <div class="footer-grid">
        <section class="footer-brand" aria-label="Jonezie Labs">
          <a class="footer-logo" href="${ROOT}index.html" aria-label="Jonezie Labs home">
            <img src="${ROOT}jonezie-labs-white-logo.webp?v=20261029" alt="Jonezie Labs" loading="lazy" decoding="async" />
          </a>
          <p>Clear product information, straightforward ordering, and real support.</p>
          <a class="footer-email" href="mailto:customerservice@jonezielabs.com?subject=Jonezie%20Labs%20Support">customerservice@jonezielabs.com</a>
          <div class="footer-socials" aria-label="Jonezie Labs social links">
            <a href="https://www.instagram.com/jonezielabs" target="_blank" rel="noopener" aria-label="Jonezie Labs on Instagram">${icon('instagram')}</a>
          </div>
        </section>

        <nav class="footer-nav" aria-label="Explore Jonezie Labs">
          <h3>Explore</h3>
          <a href="${ROOT}catalog.html">Full Catalog</a>
          <a href="${ROOT}index.html#featured">Popular Picks</a>
          <a href="${ROOT}why-jonezie.html">Why Jonezie</a>
          <a href="${ROOT}research-guides.html">Research Guides</a>
          <a href="${ROOT}comparison.html">Comparisons</a>
        </nav>

        <nav class="footer-nav" aria-label="Help and policies">
          <h3>Help &amp; Policies</h3>
          <a href="mailto:orders@jonezielabs.com?subject=Order%20Help">Order Help</a>
          <a href="${ROOT}shipping-policy.html">Shipping</a>
          <a href="${ROOT}returns-refunds.html">Returns &amp; Refunds</a>
          <a href="${ROOT}terms.html">Policies</a>
          <a href="${ROOT}privacy.html">Privacy</a>
          <a href="${ROOT}index.html#supplier-intake">Supplier Intake</a>
        </nav>
      </div>

      <div class="footer-bottom">
        <p>Research products are for laboratory use only, not human or veterinary use. Product information is not intended to diagnose, treat, cure, or prevent disease.</p>
        <p>&copy; 2026 Jonezie Labs LLC. All rights reserved.</p>
      </div>
    </div>
  `;

  function renderFooter() {
    injectFooterStyles();
    const existingFooters = Array.from(document.querySelectorAll('footer.site-footer, footer.why-page-footer'));
    const existingFooter = existingFooters[0];
    existingFooters.slice(1).forEach((duplicateFooter) => duplicateFooter.remove());
    const footer = existingFooter || document.createElement('footer');
    footer.className = 'site-footer';
    footer.setAttribute('aria-label', 'Jonezie Labs footer');
    footer.innerHTML = FOOTER_HTML;

    if (!existingFooter) {
      const shell = document.querySelector('.page-shell, .home-shell') || document.body;
      shell.appendChild(footer);
    }
  }

  function injectFooterStyles() {
    if (!FOOTER_CSS.trim()) {
      document.getElementById(FOOTER_STYLE_ID)?.remove();
      return;
    }
    if (document.getElementById(FOOTER_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = FOOTER_STYLE_ID;
    style.textContent = FOOTER_CSS;
    document.head.appendChild(style);
  }

  function icon(name) {
    const icons = {
      beaker: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6"/><path d="M10 3v5.5L4.8 18.4A2 2 0 0 0 6.6 21h10.8a2 2 0 0 0 1.8-2.6L14 8.5V3"/><path d="M7.7 16h8.6"/><path d="M9 12.6h6"/></svg>',
      mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m4.5 7 7.5 6 7.5-6"/></svg>',
      instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/><path d="M16.8 7.2h.01"/></svg>',
      chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6.5A3.5 3.5 0 0 1 8.5 3h7A3.5 3.5 0 0 1 19 6.5v4A3.5 3.5 0 0 1 15.5 14H11l-5 4v-4.2a3.5 3.5 0 0 1-1-2.4z"/><path d="M8.5 8.5h7"/><path d="M8.5 11h4"/></svg>',
      chevron: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg>'
    };
    return icons[name] || '';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderFooter, { once: true });
  } else {
    renderFooter();
  }

  if (!window.JONEZIE_STAGING_PREVIEW && !document.getElementById('jonezie-support-chat-loader')) {
    const script = document.createElement('script');
    script.id = 'jonezie-support-chat-loader';
    script.src = `${ROOT}support-chat.js?v=20261013staging2`;
    script.async = true;
    document.head.appendChild(script);
  }
})();

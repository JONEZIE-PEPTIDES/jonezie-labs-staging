(() => {
  const ROOT = document.querySelector('base') ? '' : (location.pathname.includes('/products/') ? '../' : '');
  const FOOTER_HTML = `
    <div class="footer-panel">
      <div class="footer-grid">
        <section class="footer-brand" aria-label="Jonezie Labs">
          <a class="footer-logo" href="${ROOT}index.html" aria-label="Jonezie Labs home">
            <img src="${ROOT}jonezie-labs-footer-refined.webp" alt="Jonezie Labs" loading="lazy" decoding="async" />
          </a>
          <p>Clear product information, straightforward ordering, and real support.</p>
          <a class="footer-email" href="mailto:customerservice@jonezielabs.com?subject=Jonezie%20Labs%20Support">customerservice@jonezielabs.com</a>
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

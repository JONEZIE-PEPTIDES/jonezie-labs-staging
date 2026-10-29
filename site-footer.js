(() => {
  const ROOT = location.pathname.includes('/products/') ? '../' : '';
  const FOOTER_STYLE_ID = 'jonezie-site-footer-styles';
  const FOOTER_CSS = ``;
  const FOOTER_HTML = `
    <div class="site-footer-main">
      <section class="site-footer-brand" aria-label="Jonezie Labs">
        <a class="site-footer-logo" href="${ROOT}index.html" aria-label="Jonezie Labs home">
          <img src="${ROOT}jonezie-labs-white-logo.webp?v=20261029" alt="Jonezie Labs" loading="eager" decoding="async" />
        </a>
        <h2>Quality peptides.<br />Clear pricing.<br /><span>Real support.</span></h2>
        <p>Built for researchers who want cleaner ordering, better product navigation, and faster answers.</p>
        <div class="site-footer-socials" aria-label="Jonezie Labs links">
          <a href="mailto:customerservice@jonezielabs.com?subject=Jonezie%20Labs%20Support" aria-label="Email Jonezie Labs">
            ${icon('mail')}
          </a>
          <a href="https://www.instagram.com/jonezielabs" target="_blank" rel="noopener" aria-label="Jonezie Labs on Instagram">
            ${icon('instagram')}
          </a>
        </div>
      </section>

      <nav class="site-footer-links" aria-label="Footer shop links">
        <h3>Shop</h3>
        <a href="${ROOT}terms.html"><span>Policies</span>${icon('chevron')}</a>
        <a href="${ROOT}catalog.html"><span>Full Catalog</span>${icon('chevron')}</a>
        <a href="${ROOT}index.html#featured"><span>Popular Picks</span>${icon('chevron')}</a>
        <a href="${ROOT}research-guides.html"><span>Research Guides</span>${icon('chevron')}</a>
      </nav>

      <nav class="site-footer-links site-footer-links-support" aria-label="Footer support links">
        <h3>Support</h3>
        <a href="mailto:customerservice@jonezielabs.com?subject=Jonezie%20Labs%20Support"><span>Contact Us</span>${icon('chevron')}</a>
        <a href="mailto:orders@jonezie.com?subject=Order%20Help"><span>Order Help</span>${icon('chevron')}</a>
        <a href="${ROOT}shipping-policy.html"><span>Shipping Policy</span>${icon('chevron')}</a>
        <a href="${ROOT}returns-refunds.html"><span>Returns &amp; Refunds</span>${icon('chevron')}</a>
        <a href="mailto:customerservice@jonezielabs.com?subject=COAs%20and%20Product%20Questions"><span>COAs & Product Questions</span>${icon('chevron')}</a>
        <a href="${ROOT}index.html#supplier-intake"><span>Supplier Intake</span>${icon('chevron')}</a>
      </nav>

      <aside class="site-footer-help" aria-label="Order support">
        <h3>Need help with an order?</h3>
        <p>Questions about products, invoices, shipping, or order status get handled by a real person.</p>
        <a class="site-footer-contact-button" href="mailto:customerservice@jonezielabs.com?subject=Jonezie%20Labs%20Support">
          ${icon('mail')}
          <span>Contact Us</span>
        </a>
        <a class="site-footer-email" href="mailto:customerservice@jonezielabs.com">
          ${icon('mail')}
          <span>customerservice@jonezielabs.com</span>
        </a>
        <div class="site-footer-supplier">
          <span>Supplier inquiries:</span>
          <a href="mailto:procurement@jonezielabs.com?subject=Jonezie%20Labs%20Supplier%20Inquiry">
            ${icon('mail')}
            <span>procurement@jonezielabs.com</span>
          </a>
        </div>
      </aside>
    </div>

    <div class="site-footer-legal">
      <div class="site-footer-legal-icon" aria-hidden="true">${icon('beaker')}</div>
      <p>Research products are for laboratory use only, not human or veterinary use.<br />Product information is not intended to diagnose, treat, cure, or prevent disease.</p>
      <span aria-hidden="true" class="site-footer-dot"></span>
      <p class="site-footer-copyright">&copy; 2026 Jonezie Labs LLC.<br />All rights reserved.</p>
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

  if (!document.getElementById('jonezie-support-chat-loader')) {
    const script = document.createElement('script');
    script.id = 'jonezie-support-chat-loader';
    script.src = `${ROOT}support-chat.js?v=20261013staging2`;
    script.async = true;
    document.head.appendChild(script);
  }
})();

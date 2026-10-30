(() => {
  const NAV_CATEGORY_LINKS = [
    ['catalog.html', 'Full Products'],
    ['index.html#featured', 'Popular Products'],
    ['why-jonezie.html', 'Why Jonezie'],
    ['research-guides.html', 'Research Guides'],
    ['comparison.html', 'Comparisons'],
    ['michigan-peptides.html', 'Michigan'],
    ['index.html#faq', 'FAQ'],
    ['terms.html', 'Policies']
  ];

  installStickyHeaderRule();
  installSearchResultsStyle();
  syncSiteNavigation();
  installDesktopHeaderAutoHide();
  syncWhyJonezieHomepage();

  const catalog = window.JONEZIE_CATALOG || null;
  const library = window.JONEZIE_SITE_LIBRARY || null;
  library?.initShellMenus?.();
  const forms = document.querySelectorAll('[data-nav-search-form]');
  if (!forms.length) return;

  const products = [];
  const seen = new Set();
  [...(catalog?.featured || []), ...(catalog?.products || [])].forEach((product) => {
    if (!product?.slug || seen.has(product.slug)) return;
    seen.add(product.slug);
    const name = library?.getProductDisplayName?.(product) || product.name;
    products.push({
      name,
      slug: product.slug,
      searchTerms: [name, product.name, product.slug, product.sourceName, ...(product.searchAliases || [])]
        .filter(Boolean)
        .map((value) => String(value).toLowerCase())
    });
  });

  products.sort((a, b) => a.name.localeCompare(b.name));

  forms.forEach((form) => {
    const input = form.querySelector('[data-nav-search-input]');
    if (!input) return;
    const menu = document.createElement('div');
    const menuId = `${input.id || 'nav-search'}-results`;
    let matches = [];
    let activeIndex = -1;

    menu.className = 'nav-search-results';
    menu.id = menuId;
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    form.appendChild(menu);
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-controls', menuId);
    input.setAttribute('aria-expanded', 'false');

    const listId = input.getAttribute('list');
    const list = listId ? document.getElementById(listId) : null;
    input.removeAttribute('list');
    list?.remove();

    input.addEventListener('input', () => {
      input.setCustomValidity('');
      updateMenu();
    });
    input.addEventListener('focus', updateMenu);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (menu.hidden) updateMenu();
        setActive(activeIndex + 1);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (menu.hidden) updateMenu();
        setActive(activeIndex - 1);
        return;
      }

      if (event.key === 'Escape') {
        hideMenu();
        return;
      }

      if (event.key !== 'Enter') return;
      event.preventDefault();
      if (!menu.hidden && matches[activeIndex]) {
        navigateToSlug(matches[activeIndex].slug);
        return;
      }
      navigateToProduct(input, { reportMissing: true });
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      navigateToProduct(input, { reportMissing: true });
    });
    menu.addEventListener('mousedown', (event) => {
      event.preventDefault();
    });
    menu.addEventListener('click', (event) => {
      const option = event.target.closest('[data-product-slug]');
      if (!option) return;
      navigateToSlug(option.dataset.productSlug);
    });
    input.addEventListener('blur', () => {
      window.setTimeout(hideMenu, 120);
    });

    function updateMenu() {
      const query = input.value.trim().toLowerCase();
      activeIndex = -1;
      if (!query) {
        hideMenu();
        return;
      }
      matches = products
        .filter((product) => product.searchTerms.some((term) => term.includes(query)))
        .sort((a, b) => {
          const aStarts = a.name.toLowerCase().startsWith(query);
          const bStarts = b.name.toLowerCase().startsWith(query);
          return Number(bStarts) - Number(aStarts) || a.name.localeCompare(b.name);
        })
        .slice(0, 8);

      if (!matches.length) {
        hideMenu();
        return;
      }

      menu.innerHTML = matches.map((product, index) => `
        <button class="nav-search-option" type="button" role="option" id="${menuId}-option-${index}" data-product-slug="${escapeHtml(product.slug)}" aria-selected="false">
          <span>${escapeHtml(product.name)}</span>
          <small aria-hidden="true">View →</small>
        </button>
      `).join('');
      menu.hidden = false;
      input.setAttribute('aria-expanded', 'true');
      input.removeAttribute('aria-activedescendant');
    }

    function hideMenu() {
      menu.hidden = true;
      matches = [];
      activeIndex = -1;
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
    }

    function setActive(index) {
      if (!matches.length) return;
      activeIndex = (index + matches.length) % matches.length;
      menu.querySelectorAll('.nav-search-option').forEach((option, optionIndex) => {
        const isActive = optionIndex === activeIndex;
        option.classList.toggle('is-active', isActive);
        option.setAttribute('aria-selected', String(isActive));
        if (isActive) {
          input.setAttribute('aria-activedescendant', option.id);
          option.scrollIntoView({ block: 'nearest' });
        }
      });
    }
  });

  function navigateToProduct(input, { reportMissing = false } = {}) {
    const query = input.value.trim().toLowerCase();
    if (!query || !products.length) return false;

    const exactMatch = products.find((product) => {
      return product.searchTerms.some((term) => term === query);
    });
    const partialMatch = products.find((product) => {
      return product.searchTerms.some((term) => term.includes(query));
    });
    const match = exactMatch || partialMatch;

    if (match) {
      window.JONEZIE_ANALYTICS?.search(input.value.trim(), {
        search_result: match.name,
        search_result_slug: match.slug,
        matched: true
      });
      navigateToSlug(match.slug);
      return true;
    }

    window.JONEZIE_ANALYTICS?.search(input.value.trim(), {
      matched: false
    });

    if (reportMissing) {
      input.setCustomValidity('No matching product found.');
      input.reportValidity();
    }

    return false;
  }

  function navigateToSlug(slug) {
    window.location.href = library?.getProductUrl ? library.getProductUrl(slug) : `products/${encodeURIComponent(slug)}.html`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function syncSiteNavigation() {
    const isHome = /(^|\/)(index\.html)?$/.test(window.location.pathname);
    const normalizeHref = (href) => {
      if (!isHome) return href;
      return href.replace(/^index\.html(?=#)/, '');
    };

    document.querySelectorAll('.brand-menu-panel').forEach((panel) => {
      panel.innerHTML = NAV_CATEGORY_LINKS
        .map(([href, label]) => `<a href="${normalizeHref(href)}">${label}</a>`)
        .join('');
    });

    document.querySelectorAll('.site-nav').forEach((nav) => {
      const productPill = nav.querySelector('.nav-products-pill');
      nav.querySelectorAll('.site-nav-mobile-link').forEach((link) => link.remove());
      const mobileMarkup = NAV_CATEGORY_LINKS
        .map(([href, label]) => `<a href="${normalizeHref(href)}" class="site-nav-mobile-link">${label}</a>`)
        .join('');
      if (productPill) {
        productPill.insertAdjacentHTML('beforebegin', mobileMarkup);
        productPill.href = normalizeHref('catalog.html');
      }
    });
  }

  function installDesktopHeaderAutoHide() {
    const header = document.querySelector('.site-header-home');
    if (!header) return;
    let scrollAnchor = window.scrollY;

    const update = () => {
      const scrollY = window.scrollY;
      const menuOpen = Boolean(header.querySelector('.brand-menu-panel:not([hidden]), .site-nav.is-open'));
      if (window.innerWidth <= 860 || scrollY < 180 || menuOpen || header.matches(':focus-within')) {
        header.classList.remove('header-desktop-hidden');
        scrollAnchor = scrollY;
        return;
      }
      if (Math.abs(scrollY - scrollAnchor) < 14) return;
      header.classList.toggle('header-desktop-hidden', scrollY > scrollAnchor);
      scrollAnchor = scrollY;
    };

    header.addEventListener('focusin', () => header.classList.remove('header-desktop-hidden'));
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  function installStickyHeaderRule() {
    if (document.getElementById('jonezie-sticky-header-rule')) return;
    const style = document.createElement('style');
    style.id = 'jonezie-sticky-header-rule';
    style.textContent = `
      .site-header,
      .site-header-home,
      .site-header-home.site-header-home-sticky,
      .product-header {
        position: sticky !important;
        top: 14px !important;
        z-index: 90 !important;
      }
    `;
    document.head.appendChild(style);
  }

  function installSearchResultsStyle() {
    if (document.getElementById('jonezie-nav-search-results-style')) return;
    const style = document.createElement('style');
    style.id = 'jonezie-nav-search-results-style';
    style.textContent = `
      .nav-search{position:relative}
      .nav-search-results{position:absolute;top:calc(100% + 10px);left:0;right:0;z-index:120;display:grid;gap:6px;min-width:min(340px,calc(100vw - 32px));max-height:360px;padding:10px;overflow-y:auto;border:1px solid rgba(131,242,255,.22);border-radius:18px;background:radial-gradient(circle at 82% 0%,rgba(255,95,169,.18),transparent 36%),linear-gradient(180deg,rgba(7,20,29,.98),rgba(4,13,20,.98));box-shadow:0 24px 54px rgba(0,0,0,.36),inset 0 0 0 1px rgba(255,255,255,.03)}
      .nav-search-results[hidden]{display:none}
      .nav-search-option{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;width:100%;min-height:42px;padding:9px 11px;border:1px solid transparent;border-radius:12px;background:transparent;color:rgba(255,255,255,.92);font:inherit;text-align:left;cursor:pointer}
      .nav-search-option span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.88rem;font-weight:900}
      .nav-search-option small{color:var(--cyan-soft,#83f2ff);font-size:.68rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
      .nav-search-option:hover,.nav-search-option:focus-visible,.nav-search-option.is-active{border-color:rgba(255,95,169,.3);background:linear-gradient(135deg,rgba(255,95,169,.14),rgba(40,216,239,.12));outline:0}
    `;
    document.head.appendChild(style);
  }

  function syncWhyJonezieHomepage() {
    const mission = document.getElementById('mission');
    if (mission) mission.remove();

    const resourceGrid = document.querySelector('#research-resources .resource-grid');
    if (!resourceGrid || resourceGrid.querySelector('[href="why-jonezie.html"]')) return;

    resourceGrid.insertAdjacentHTML('afterbegin', `
      <a class="resource-card resource-card-featured" href="why-jonezie.html">
        <p class="eyebrow">Why Jonezie</p>
        <h3>Peptides without the supplier weirdness.</h3>
        <p>Fair prices, clean options, shipping choices, fast answers, and order extras that make Jonezie feel different.</p>
        <span class="catalog-link">Open Why Jonezie</span>
      </a>
    `);
  }
})();

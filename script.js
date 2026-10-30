const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const catalogData = window.JONEZIE_CATALOG || null;
const contentData = window.JONEZIE_PRODUCT_CONTENT || null;
const siteLibrary = window.JONEZIE_SITE_LIBRARY || null;
const CART_KEY = 'jonezie_cart';
const PRODUCT_FALLBACK_IMAGE = 'product-placeholder.svg';
const IMAGE_ASSET_VERSION = '20260409e';

if (menuToggle && siteNav && !menuToggle.dataset.menuBound) {
  menuToggle.dataset.menuBound = 'true';
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const browsingHeader = document.querySelector('.site-header-home-sticky');
let browsingHeaderScrollAnchor = window.scrollY;
function updateBrowsingHeaderVisibility() {
  if (!browsingHeader) return;
  const scrollY = window.scrollY;
  if (window.innerWidth > 860 || scrollY < 180 || siteNav?.classList.contains('is-open')) {
    browsingHeader.classList.remove('header-scrolled-away');
    browsingHeaderScrollAnchor = scrollY;
    return;
  }
  if (Math.abs(scrollY - browsingHeaderScrollAnchor) < 14) return;
  browsingHeader.classList.toggle('header-scrolled-away', scrollY > browsingHeaderScrollAnchor);
  browsingHeaderScrollAnchor = scrollY;
}
menuToggle?.addEventListener('click', () => browsingHeader?.classList.remove('header-scrolled-away'));
browsingHeader?.addEventListener('focusin', () => browsingHeader.classList.remove('header-scrolled-away'));
window.addEventListener('scroll', updateBrowsingHeaderVisibility, { passive: true });
window.addEventListener('resize', updateBrowsingHeaderVisibility);
updateBrowsingHeaderVisibility();

function initBrandMenus() {
  const menus = document.querySelectorAll('[data-brand-menu]');
  if (!menus.length) return;

  const closeMenu = (menu) => {
    const trigger = menu.querySelector('.brand-menu-trigger');
    const panel = menu.querySelector('.brand-menu-panel');
    if (!trigger || !panel) return;
    trigger.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
  };

  menus.forEach((menu) => {
    const trigger = menu.querySelector('.brand-menu-trigger');
    const panel = menu.querySelector('.brand-menu-panel');
    if (!trigger || !panel || trigger.dataset.menuBound) return;
    trigger.dataset.menuBound = 'true';

    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      menus.forEach((candidate) => closeMenu(candidate));
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.hidden = false;
      }
    });

    panel.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => closeMenu(menu));
    });
  });

  document.addEventListener('click', (event) => {
    menus.forEach((menu) => {
      if (!menu.contains(event.target)) closeMenu(menu);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    menus.forEach((menu) => closeMenu(menu));
  });
}

initBrandMenus();

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getAccent(category) {
  if (['Metabolic', 'Cellular', 'Growth'].includes(category)) return 'accent-cyan';
  if (['Aesthetics', 'Performance'].includes(category)) return 'accent-pink';
  return 'accent-cyan';
}

function getProductUrl(slug) {
  return siteLibrary?.getProductUrl ? siteLibrary.getProductUrl(slug) : `products/${encodeURIComponent(slug)}.html`;
}

function withFallbackImage(path) {
  return escapeHtml((path || '').replace('../', ''));
}

function getImageSrc(path) {
  const sanitized = withFallbackImage(path).trim();
  const fallback = `${PRODUCT_FALLBACK_IMAGE}?v=${IMAGE_ASSET_VERSION}`;
  if (!sanitized) return fallback;
  if (sanitized.includes('?')) return sanitized;
  return `${sanitized}?v=${IMAGE_ASSET_VERSION}`;
}

function renderStrengthChips(options) {
  const limit = 4;
  const strengthList = (options || [])
    .map((option) => {
      const strength = escapeHtml(option.mgOption);
      if (!strength) return '';
      const isBackorder = String(option.inventoryStatus || '').toLowerCase() === 'backorder';
      return `<span${isBackorder ? ' class="backorder-chip"' : ''}>${strength}${isBackorder ? ' (Backorder)' : ''}</span>`;
    })
    .filter(Boolean);

  const visible = strengthList.slice(0, limit);
  if (strengthList.length > limit) {
    visible.push(`<span class="more-chip">+${strengthList.length - limit}</span>`);
  }

  return visible.join('');
}

function getProductContent(product) {
  return contentData?.products?.[product.slug] || null;
}

function getProductDisplaySummary(product, productContent) {
  if (window.JONEZIE_SITE_LIBRARY?.getProductDisplaySummary) {
    return window.JONEZIE_SITE_LIBRARY.getProductDisplaySummary(product, productContent);
  }
  return productContent?.shortDescription || product.description || '';
}

function getCardSummary(product, productContent) {
  const description = getProductDisplaySummary(product, productContent).trim();
  const firstSentence = description.match(/^.*?[.!?](?=\s|$)/);
  return firstSentence ? firstSentence[0] : description;
}

function getCardTitle(product) {
  return window.JONEZIE_SITE_LIBRARY?.getProductDisplayName?.(product) || product.name;
}

function getCardStockLabel(product) {
  const statuses = (product.options || []).map((option) => String(option.inventoryStatus || 'in_stock').toLowerCase());
  if (statuses.length && statuses.every((status) => status === 'sold_out')) return 'Sold out';
  if (statuses.includes('in_stock')) return 'In stock';
  if (statuses.includes('backorder')) return 'Backorder';
  return 'Check availability';
}

function getLowestOfferedPrice(product) {
  const candidates = [];
  (product.options || []).forEach((option) => {
    const status = String(option.inventoryStatus || '').toLowerCase();
    if (['sold_out', 'discontinued', 'hidden', 'test', 'gift', 'complimentary'].includes(status)) return;

    ['singleVialPrice', 'eightVialPrice', 'tenVialPrice'].forEach((field) => {
      const numeric = parsePrice(option[field]);
      if (numeric > 0) candidates.push({ numeric, display: option[field] });
    });
  });

  if (!candidates.length) return product.startingPriceSingle || '';
  candidates.sort((a, b) => a.numeric - b.numeric);
  return candidates[0].display;
}

let cardPromoSource;

function normalizeCardPromo(promo) {
  const code = String(promo?.code || '').trim();
  const rate = Number(promo?.rate || 0);
  if (!code || !Number.isFinite(rate) || rate <= 0) return null;
  return { code, rate };
}

function getActiveCardPromo() {
  if (cardPromoSource !== undefined) return cardPromoSource;
  return normalizeCardPromo(window.JONEZIE_PROMO?.getActivePromo?.());
}

function formatDiscountedPrice(price, rate) {
  const numeric = parsePrice(price);
  if (!numeric || !Number.isFinite(rate) || rate <= 0) return '';
  return `$${(numeric * (1 - rate)).toFixed(2)}`;
}

function renderCardPricing(product, selectedPrice) {
  const price = selectedPrice || getLowestOfferedPrice(product);
  if (!price) return '<span class="catalog-price-rule">View all pricing</span>';
  const promo = getActiveCardPromo();
  const promoPrice = promo ? formatDiscountedPrice(price, promo.rate) : '';
  const promoLine = promoPrice
    ? `<span class="card-promo-price">${escapeHtml(promoPrice)} with code ${escapeHtml(promo.code)}</span>`
    : '';
  return `
    <div class="card-pricing">
      <span class="card-from-price">${escapeHtml(price)}</span>
      ${promoLine}
    </div>`;
}

function getFeaturedQuickAdd(product) {
  for (const option of product.options || []) {
    if (String(option.inventoryStatus || 'in_stock').toLowerCase() !== 'in_stock') continue;
    const packs = [
      { key: 'singleVialPrice', label: 'Single Vial', price: option.singleVialPrice },
      { key: 'eightVialPrice', label: '8-Kit', price: option.eightVialPrice },
      { key: 'tenVialPrice', label: 'Full 10-Kit', price: option.tenVialPrice }
    ];
    const pack = packs.find((candidate) => parsePrice(candidate.price) > 0);
    if (pack) return { option, pack };
  }
  return null;
}

function renderFeatured() {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid || !catalogData) return;

  const featured = (catalogData.featured || []).filter(Boolean);
  grid.innerHTML = featured.map((product, index) => {
    const selection = getFeaturedQuickAdd(product);
    const pricing = renderCardPricing(product, selection?.pack.price);
    const imageSrc = getImageSrc(product.image);
    const fallbackImageSrc = `${PRODUCT_FALLBACK_IMAGE}?v=${IMAGE_ASSET_VERSION}`;
    const loadingMode = index < 3 ? 'eager' : 'lazy';
    const fetchPriority = index < 3 ? 'high' : 'low';
    const imageDimensions = product.hasUpdatedLabel ? 'width="1254" height="1254"' : '';
    const productUrl = getProductUrl(product.slug);
    const title = getCardTitle(product);
    const selectionLabel = selection
      ? `${selection.option.mgOption} · ${selection.pack.label}`
      : getCardStockLabel(product);
    return `
      <article class="product-card featured-shop-card ${getAccent(product.category)}" data-updated-label="${Boolean(product.hasUpdatedLabel)}">
      <a class="featured-card-image" data-product-slug="${escapeHtml(product.slug)}" href="${productUrl}" aria-label="View ${escapeHtml(title)} options">
        ${product.hasUpdatedLabel ? '<div class="product-card-media">' : ''}
        <img src="${imageSrc}" ${imageDimensions} alt="${escapeHtml(product.name)} product visual" loading="${loadingMode}" decoding="async" fetchpriority="${fetchPriority}" onerror="this.onerror=null;this.src='${fallbackImageSrc}'" />
        ${product.hasUpdatedLabel ? '</div>' : ''}
      </a>
      <div class="product-copy">
        <a class="featured-card-name" data-product-slug="${escapeHtml(product.slug)}" href="${productUrl}"><h3>${escapeHtml(title)}</h3></a>
        <p class="featured-card-selection">${escapeHtml(selectionLabel)}</p>
        <div class="product-top product-top-price">${pricing}</div>
        <div class="featured-card-actions">
          ${selection ? `<button type="button" data-featured-add="${escapeHtml(product.slug)}" aria-label="Add ${escapeHtml(title)}, ${escapeHtml(selectionLabel)}, to cart">+ Add to cart</button>` : ''}
          <a data-product-slug="${escapeHtml(product.slug)}" href="${productUrl}">View options <span aria-hidden="true">&rarr;</span></a>
        </div>
      </div>
      </article>`;
  }).join('');
}

function bindFeaturedQuickAdds() {
  const grid = document.querySelector('[data-featured-grid]');
  if (!grid) return;
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('[data-featured-add]');
    if (!button || !grid.contains(button)) return;
    const product = (catalogData?.featured || []).find((item) => item.slug === button.dataset.featuredAdd);
    const selection = product && getFeaturedQuickAdd(product);
    if (!selection) return;
    const { option, pack } = selection;
    const item = {
      slug: product.slug,
      name: product.name,
      code: option.code,
      mgOption: option.mgOption,
      packKey: pack.key,
      packLabel: pack.label,
      unitPrice: parsePrice(pack.price),
      unitPriceDisplay: pack.price,
      quantity: 1,
      image: product.image,
      inventoryStatus: 'in_stock',
      backorderNote: ''
    };
    addItemToCart(item);
    window.JONEZIE_ANALYTICS?.addToCart(item);
    button.textContent = 'Added to cart';
    window.setTimeout(() => { if (button.isConnected) button.textContent = '+ Add to cart'; }, 1400);
  });
}

function renderCatalog() {
  const grid = document.querySelector('[data-catalog-grid]');
  if (!grid || !catalogData) return;
  const search = document.querySelector('[data-catalog-search]')?.value.trim().toLowerCase() || '';
  const strength = document.querySelector('[data-catalog-strength]')?.value || '';
  const stock = document.querySelector('[data-catalog-stock]')?.value || '';
  const format = document.querySelector('[data-catalog-format]')?.value || '';
  const products = [...(catalogData.products || [])]
    .filter((product) => {
      const options = product.options || [];
      const searchTerms = [getCardTitle(product), product.name, product.sourceName, product.slug, ...(product.searchAliases || []), ...options.map((option) => option.mgOption)]
        .filter(Boolean).join(' ').toLowerCase();
      if (search && !searchTerms.includes(search)) return false;
      if (strength && !options.some((option) => option.mgOption === strength)) return false;
      if (stock && !options.some((option) => String(option.inventoryStatus || 'in_stock').toLowerCase() === stock)) return false;
      if (format && !options.some((option) => parsePrice(option[format]) > 0)) return false;
      return true;
    })
    .sort((a, b) => getCardTitle(a).localeCompare(getCardTitle(b)));
  const resultCount = document.querySelector('[data-catalog-result-count]');
  if (resultCount) resultCount.textContent = `${products.length} ${products.length === 1 ? 'product' : 'products'} found`;
  if (!products.length) {
    grid.innerHTML = '<div class="catalog-empty"><h2>No products found</h2><p>Try a different name, strength, or filter.</p></div>';
    return;
  }
  grid.innerHTML = products.map((product) => {
    const strengthChips = renderStrengthChips(product.options);
    const pricing = renderCardPricing(product);
    const imageSrc = getImageSrc(product.image);
    const fallbackImageSrc = `${PRODUCT_FALLBACK_IMAGE}?v=${IMAGE_ASSET_VERSION}`;
    return `
      <article class="catalog-card${product.slug === '5-amino-1mq' ? ' catalog-color-study' : ''}" data-updated-label="${Boolean(product.hasUpdatedLabel)}">
      <a class="card-link-shell card-main-link" data-product-slug="${escapeHtml(product.slug)}" href="${getProductUrl(product.slug)}" aria-label="Open ${escapeHtml(getCardTitle(product))} product page">
        ${product.hasUpdatedLabel ? '<div class="product-card-media">' : ''}
        <img src="${imageSrc}" alt="${escapeHtml(product.name)} product visual" loading="lazy" decoding="async" fetchpriority="low" onerror="this.onerror=null;this.src='${fallbackImageSrc}'" />
        ${product.hasUpdatedLabel ? '</div>' : ''}
        <div class="catalog-copy">
          <h3>${escapeHtml(getCardTitle(product))}</h3>
          <div class="catalog-top catalog-top-price">${pricing}</div>
          <div class="option-chips">${strengthChips}</div>
          <span class="card-availability">${escapeHtml(getCardStockLabel(product))}</span>
          <span class="catalog-link">View product</span>
        </div>
      </a>
      </article>`;
  }).join('');
}

function initCatalogControls() {
  const strengthSelect = document.querySelector('[data-catalog-strength]');
  if (!strengthSelect || !catalogData) return;
  const strengths = [...new Set((catalogData.products || []).flatMap((product) =>
    (product.options || []).map((option) => option.mgOption).filter(Boolean)))];
  strengths.sort((a, b) => (parsePrice(a) || 0) - (parsePrice(b) || 0) || a.localeCompare(b));
  strengthSelect.insertAdjacentHTML('beforeend', strengths.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join(''));
  document.querySelectorAll('[data-catalog-search], [data-catalog-strength], [data-catalog-stock], [data-catalog-format]')
    .forEach((control) => control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change', () => {
      ensureCatalogRendered();
      renderCatalog();
      bindProductClickTracking(document.querySelector('[data-catalog-grid]'));
    }));
  document.querySelector('[data-catalog-clear]')?.addEventListener('click', () => {
    document.querySelectorAll('[data-catalog-search], [data-catalog-strength], [data-catalog-stock], [data-catalog-format]')
      .forEach((control) => { control.value = ''; });
    renderCatalog();
    bindProductClickTracking(document.querySelector('[data-catalog-grid]'));
  });
}

let hasRenderedCatalog = false;

function ensureCatalogRendered() {
  if (hasRenderedCatalog) return;
  renderCatalog();
  bindProductClickTracking(document.querySelector('[data-catalog-grid]'));
  hasRenderedCatalog = true;
}

function refreshProductCardPricing() {
  renderFeatured();
  bindProductClickTracking(document.querySelector('[data-featured-grid]'));
  if (!hasRenderedCatalog) return;
  renderCatalog();
  bindProductClickTracking(document.querySelector('[data-catalog-grid]'));
}

function handlePromoUpdated(event) {
  cardPromoSource = normalizeCardPromo(event.detail);
  refreshProductCardPricing();
}

function renderCounts() {
  if (!catalogData) return;
  document.querySelectorAll('[data-total-products]').forEach((node) => {
    node.textContent = String(catalogData.totalProducts || 0);
  });
  document.querySelectorAll('[data-total-configurations]').forEach((node) => {
    node.textContent = String(catalogData.totalConfigurations || 0);
  });
}

function initMerchImageLightbox() {
  const lightbox = document.querySelector('[data-image-lightbox]');
  const triggers = document.querySelectorAll('[data-merch-zoom]');
  if (!lightbox || !triggers.length) return;

  const previewImage = lightbox.querySelector('[data-image-lightbox-img]');
  const caption = lightbox.querySelector('[data-image-lightbox-caption]');
  const closeButtons = lightbox.querySelectorAll('[data-image-lightbox-close]');
  if (!previewImage) return;

  const close = () => {
    if (lightbox.hidden) return;
    lightbox.hidden = true;
    previewImage.removeAttribute('src');
    previewImage.removeAttribute('alt');
    if (caption) caption.textContent = '';
    document.body.classList.remove('lightbox-open');
  };

  const openFrom = (trigger) => {
    const image = trigger.querySelector('img');
    if (!image) return;

    previewImage.src = image.currentSrc || image.src;
    previewImage.alt = image.alt || 'Expanded merch image';
    if (caption) caption.textContent = image.alt || '';

    lightbox.hidden = false;
    document.body.classList.add('lightbox-open');
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openFrom(trigger));
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      openFrom(trigger);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener('click', close);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function getCart() {
  try {
    return JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function setCart(cart) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('jonezie:cart-updated'));
}

function addItemToCart(item) {
  const cart = getCart();
  const existing = cart.find((entry) => entry.slug === item.slug && entry.code === item.code && entry.packKey === item.packKey);
  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  setCart(cart);
}

function sanitizeCode(value) {
  return String(value || '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function parsePrice(value) {
  if (!value) return 0;
  const cleaned = String(value).replace(/[^0-9.]/g, '');
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function initMerchPurchases() {
  const cards = document.querySelectorAll('[data-merch-purchase]');
  if (!cards.length) return;

  cards.forEach((card) => {
    const sizeSelect = card.querySelector('[data-merch-size]');
    const qtyInput = card.querySelector('[data-merch-qty]');
    const qtyMinus = card.querySelector('[data-merch-qty-minus]');
    const qtyPlus = card.querySelector('[data-merch-qty-plus]');
    const addButton = card.querySelector('[data-merch-add]');
    const feedback = card.querySelector('[data-merch-feedback]');
    const name = card.getAttribute('data-merch-name') || 'Merch Item';
    const slug = card.getAttribute('data-merch-slug') || sanitizeCode(name).toLowerCase();
    const image = card.getAttribute('data-merch-image') || PRODUCT_FALLBACK_IMAGE;
    const unitPrice = Number.parseFloat(card.getAttribute('data-merch-price') || '0');

    const clampQuantity = () => {
      const parsed = Number.parseInt(qtyInput?.value || '1', 10);
      const quantity = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
      if (qtyInput) qtyInput.value = String(quantity);
      return quantity;
    };

    qtyMinus?.addEventListener('click', () => {
      const current = clampQuantity();
      if (qtyInput) qtyInput.value = String(Math.max(1, current - 1));
    });

    qtyPlus?.addEventListener('click', () => {
      const current = clampQuantity();
      if (qtyInput) qtyInput.value = String(current + 1);
    });

    qtyInput?.addEventListener('blur', clampQuantity);

    addButton?.addEventListener('click', () => {
      const quantity = clampQuantity();
      const size = sizeSelect?.value || 'Standard';
      const optionCode = sanitizeCode(size) || 'STANDARD';
      const priceDisplay = Number.isFinite(unitPrice) ? `$${unitPrice.toFixed(2)}` : 'Pending';

      addItemToCart({
        slug,
        code: `MERCH_${sanitizeCode(slug)}_${optionCode}`,
        packKey: `merch_${optionCode.toLowerCase()}`,
        packLabel: 'Merch',
        name,
        mgOption: `Size ${size}`,
        image,
        quantity,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
        unitPriceDisplay: priceDisplay,
        inventoryStatus: 'in_stock'
      });
      window.JONEZIE_ANALYTICS?.addToCart({
        slug,
        code: `MERCH_${sanitizeCode(slug)}_${optionCode}`,
        packLabel: 'Merch',
        name,
        category: 'Merch',
        mgOption: `Size ${size}`,
        quantity,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0
      });

      if (feedback) feedback.textContent = `${name} (${size}) added to cart.`;
      if (addButton) {
        const original = addButton.textContent;
        addButton.textContent = 'Added';
        window.setTimeout(() => {
          addButton.textContent = original;
        }, 900);
      }
    });
  });
}

function bindProductClickTracking(scope = document) {
  if (!scope || !catalogData) return;
  const allProducts = [...(catalogData.featured || []), ...(catalogData.products || [])];
  const bySlug = new Map(allProducts.map((product) => [product.slug, product]));
  scope.querySelectorAll('[data-product-slug]').forEach((link) => {
    if (link.dataset.analyticsBound) return;
    link.dataset.analyticsBound = 'true';
    link.addEventListener('click', () => {
      const product = bySlug.get(link.getAttribute('data-product-slug'));
      if (!product) return;
      window.JONEZIE_ANALYTICS?.selectItem({
        slug: product.slug,
        name: product.name,
        category: product.category,
        unitPrice: parsePrice(product.startingPriceSingle),
        itemListName: link.closest('[data-featured-grid]') ? 'Featured products' : 'Catalog'
      });
    });
  });
}

function initDeferredCatalogRender() {
  const section = document.querySelector('#full-catalog');
  const grid = document.querySelector('[data-catalog-grid]');
  if (!section || !grid || !catalogData) return;

  if (window.location.hash === '#full-catalog') {
    ensureCatalogRendered();
    return;
  }

  const renderOnDemand = () => {
    ensureCatalogRendered();
    window.removeEventListener('hashchange', handleHashChange);
  };

  const handleHashChange = () => {
    if (window.location.hash === '#full-catalog') {
      renderOnDemand();
    }
  };

  window.addEventListener('hashchange', handleHashChange);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      renderOnDemand();
    }, { rootMargin: '320px 0px' });
    observer.observe(section);
    return;
  }

  window.setTimeout(renderOnDemand, 1200);
}

renderCounts();
initCatalogControls();
renderFeatured();
bindFeaturedQuickAdds();
bindProductClickTracking(document.querySelector('[data-featured-grid]'));
document.addEventListener('jonezie:promo-updated', handlePromoUpdated);
initDeferredCatalogRender();
initMerchImageLightbox();
initMerchPurchases();

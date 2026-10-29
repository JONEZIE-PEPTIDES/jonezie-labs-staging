(() => {
  const CART_KEY = 'jonezie_cart';
  const MAX_BADGE_COUNT = 99;
  const CHECKOUT_PATH = 'checkout.html';

  function getCartCount() {
    try {
      const cart = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
      const removed = new Set(window.JONEZIE_ADMIN_CONFIG?.removeProductSlugs || []);
      const removedOptions = new Set(window.JONEZIE_ADMIN_CONFIG?.removeOptionCodes || []);
      return cart.reduce((sum, item) => sum + (removed.has(item.slug) || removedOptions.has(item.code) ? 0 : Number(item.quantity) || 0), 0);
    } catch {
      return 0;
    }
  }

  function createMobileCartButton() {
    const header = document.querySelector('.site-header .menu-toggle');
    if (!header) return null;
    const existing = document.querySelector('[data-mobile-cart]');
    if (existing) return existing;

    const shortcut = document.createElement('a');
    shortcut.className = 'mobile-cart-shortcut';
    shortcut.href = document.querySelector('[data-cart-link]')?.getAttribute('href') || CHECKOUT_PATH;
    shortcut.setAttribute('data-mobile-cart', '');
    shortcut.setAttribute('data-cart-link', '');
    shortcut.setAttribute('aria-label', 'Open cart');
    shortcut.innerHTML = `
      <span class="mobile-cart-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" role="presentation">
          <path d="M3 4h2.2l2.1 9.3c.1.4.4.7.8.7h8.9c.4 0 .8-.3.9-.7l1.6-6.3H7.1" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/>
          <circle cx="10" cy="19" r="1.7" fill="currentColor"/>
          <circle cx="17" cy="19" r="1.7" fill="currentColor"/>
        </svg>
      </span>
      <span class="mobile-cart-count" data-cart-count hidden>0</span>
    `;
    header.before(shortcut);
    return shortcut;
  }

  function renderCartBadge() {
    const count = getCartCount();
    const displayCount = count > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : String(count);
    createMobileCartButton();

    document.querySelectorAll('[data-cart-count]').forEach((node) => {
      node.textContent = displayCount;
      node.hidden = count === 0;
    });

    document.querySelectorAll('[data-cart-link]').forEach((node) => {
      const suffix = count === 1 ? 'item' : 'items';
      const label = count > 0 ? `Open cart with ${count} ${suffix}` : 'Open cart';
      node.setAttribute('aria-label', label);
    });
  }

  window.addEventListener('storage', (event) => {
    if (!event.key || event.key === CART_KEY) renderCartBadge();
  });
  window.addEventListener('focus', renderCartBadge);
  window.addEventListener('pageshow', renderCartBadge);
  window.addEventListener('jonezie:cart-updated', renderCartBadge);

  renderCartBadge();
})();

(() => {
  const hasFooter = document.querySelector('script[src*="site-footer.js"]');
  if (hasFooter || window.JONEZIE_FOOTER_LOADER_ADDED) return;
  window.JONEZIE_FOOTER_LOADER_ADDED = true;

  const root = location.pathname.includes('/products/') ? '../' : '';
  const script = document.createElement('script');
  script.src = `${root}site-footer.js?v=20260603g`;
  script.defer = true;
  document.head.appendChild(script);
})();

(() => {
  const HOT_GIRL_STICKER_PATH = 'assets/Lables%20and%20stickers/hot_girl_summer_jonezie_sticker_black_background.webp?v=20260501b';
  const SUMMER_STICKER_PATH = 'assets/Lables%20and%20stickers/beach_volleyball_showdown_with_lively_vials.webp';

  function injectMerchStyles() {
    if (document.getElementById('jonezie-merch-live-patch')) return;
    const style = document.createElement('style');
    style.id = 'jonezie-merch-live-patch';
    style.textContent = `
      .merch-product-wide { grid-column: 1 / -1; }
      .sticker-art.is-missing-art { position: relative; min-height: 260px; }
      .sticker-art.is-missing-art img { display: none; }
      .sticker-art.is-missing-art::before {
        content: "Sticker art loading";
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 0 16px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.24);
        background: var(--ember-fill);
        color: #1f1d28;
        font-family: "Space Grotesk", sans-serif;
        font-size: 0.82rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      @media (max-width: 980px) {
        .merch-product-wide { grid-column: auto; }
      }
    `;
    document.head.appendChild(style);
  }

  function setEyebrow(card, label) {
    const eyebrow = card?.querySelector('.eyebrow');
    if (eyebrow) eyebrow.textContent = label;
  }

  function removeDescription(card) {
    card?.querySelectorAll('.merch-copy > p:not(.eyebrow)').forEach((node) => node.remove());
  }

  function setStickerPrice(card) {
    card?.querySelectorAll('.merch-meta span').forEach((span) => {
      if (/Price:/i.test(span.textContent)) span.textContent = 'Price: $3.00';
    });
    const purchase = card?.querySelector('[data-merch-purchase]');
    if (purchase) purchase.dataset.merchPrice = '3.00';
  }

  function setStickerImage(card, imagePath, altText) {
    const img = card?.querySelector('.sticker-art img');
    const purchase = card?.querySelector('[data-merch-purchase]');
    if (img) {
      img.src = imagePath;
      img.alt = altText;
      img.addEventListener('error', () => img.closest('.sticker-art')?.classList.add('is-missing-art'), { once: true });
    }
    if (purchase) purchase.dataset.merchImage = imagePath;
  }

  function buildSummerStickerCard() {
    const article = document.createElement('article');
    article.className = 'merch-product merch-product-sticker';
    article.innerHTML = `
      <div class="sticker-art" data-merch-zoom role="button" tabindex="0" aria-label="Open larger image of Summer Stack Bros sticker">
        <img src="${SUMMER_STICKER_PATH}" alt="Summer Stack Bros sticker" />
      </div>
      <div class="merch-copy compact-copy">
        <p class="eyebrow">Sticker</p>
        <h3>Summer Stack Bros</h3>
        <div class="merch-meta">
          <span>Price: $3.00</span>
          <span>Sticker format</span>
        </div>
        <div class="merch-purchase" data-merch-purchase data-merch-slug="summer-stack-bros-sticker" data-merch-name="Summer Stack Bros Sticker" data-merch-image="${SUMMER_STICKER_PATH}" data-merch-price="3.00">
          <div class="merch-purchase-row">
            <label>Format</label>
            <select data-merch-size>
              <option value="Standard">Standard</option>
            </select>
          </div>
          <div class="merch-purchase-row">
            <label>Quantity</label>
            <div class="merch-qty-control">
              <button type="button" data-merch-qty-minus aria-label="Decrease quantity">-</button>
              <input data-merch-qty type="number" min="1" value="1" inputmode="numeric" />
              <button type="button" data-merch-qty-plus aria-label="Increase quantity">+</button>
            </div>
          </div>
          <button class="button primary merch-add-button" type="button" data-merch-add>Add To Cart</button>
          <p class="merch-add-feedback" data-merch-feedback aria-live="polite"></p>
        </div>
      </div>
    `;
    const img = article.querySelector('img');
    img.addEventListener('error', () => img.closest('.sticker-art')?.classList.add('is-missing-art'), { once: true });
    return article;
  }

  function patchMerch() {
    const shelf = document.querySelector('#merch .merch-shelf');
    if (!shelf) return;
    injectMerchStyles();

    const cards = [...shelf.querySelectorAll('.merch-product')];
    const hat = cards.find((card) => /Signature Hat/i.test(card.textContent));
    const hotSticker = cards.find((card) => /Hot Girl Summer Sticker/i.test(card.textContent));
    const shirt = cards.find((card) => /Hot Girl Summer Shirt/i.test(card.textContent));

    if (hat) {
      hat.classList.add('merch-product-wide');
      setEyebrow(hat, 'Hat');
      removeDescription(hat);
    }

    if (hotSticker) {
      hotSticker.classList.add('merch-product-sticker');
      setEyebrow(hotSticker, 'Sticker');
      removeDescription(hotSticker);
      setStickerPrice(hotSticker);
      setStickerImage(hotSticker, HOT_GIRL_STICKER_PATH, 'Sticker');
    }

    if (!shelf.querySelector('[data-merch-slug="summer-stack-bros-sticker"]')) {
      const summerCard = buildSummerStickerCard();
      if (shirt) shelf.insertBefore(summerCard, shirt);
      else shelf.appendChild(summerCard);
    }

    if (shirt) {
      shirt.classList.add('merch-product-wide');
      setEyebrow(shirt, 'Shirt');
      removeDescription(shirt);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchMerch, { once: true });
  } else {
    patchMerch();
  }
})();

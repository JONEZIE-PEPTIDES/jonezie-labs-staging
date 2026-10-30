const CART_KEY = 'jonezie_cart';
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const cartRoot = document.querySelector('[data-checkout-cart]');
const summaryItems = document.querySelector('[data-summary-items]');
const summarySubtotal = document.querySelector('[data-summary-subtotal]');
const summaryDiscount = document.querySelector('[data-summary-discount]');
const summaryShipping = document.querySelector('[data-summary-shipping]');
const summaryTotal = document.querySelector('[data-summary-total]');
const form = document.querySelector('[data-checkout-form]');
const phoneInput = form?.querySelector('input[name="customerPhone"]') || null;
const submitButton = form?.querySelector('button[type="submit"]') || null;
const formFeedback = document.querySelector('[data-checkout-feedback]');
const successCard = document.querySelector('[data-checkout-success]');
const clearCartButton = document.querySelector('[data-clear-cart]');
const promoCodeInput = document.querySelector('[data-promo-code]');
const activePromoCopy = document.querySelector('[data-active-promo-copy]');
const shippingMethodInput = document.querySelector('[data-shipping-method]');
const shippingHelp = document.querySelector('[data-shipping-help]');
const PRODUCT_FALLBACK_IMAGE = 'product-placeholder.svg';
function getCartDisplayName(item) {
  const product = window.JONEZIE_CATALOG?.products?.find((entry) => entry.slug === item.slug);
  return product && window.JONEZIE_SITE_LIBRARY?.getProductDisplayName
    ? window.JONEZIE_SITE_LIBRARY.getProductDisplayName(product)
    : item.name;
}
function getCartImage(item) {
  const product = window.JONEZIE_CATALOG?.products?.find((entry) => entry.slug === item.slug);
  const path = String(product?.image || item.image || PRODUCT_FALLBACK_IMAGE).replace(/^(\.\.\/)+/, '').trim();
  return path.includes('?') ? path : `${path}?v=20261029checkoutcards1`;
}
function getCurrentCatalogCartItem(item) {
  const product = window.JONEZIE_CATALOG?.products?.find((entry) => entry.slug === item.slug);
  if (!product) return item;
  const option = product.options?.find((entry) => entry.code === item.code)
    || product.options?.find((entry) => entry.mgOption === item.mgOption);
  const packKey = item.packKey || ({ 'single vial': 'singleVialPrice', '8-kit': 'eightVialPrice',
    '8-vial kit': 'eightVialPrice', 'full 10-kit': 'tenVialPrice',
    '10-vial pack': 'tenVialPrice' })[String(item.packLabel || '').toLowerCase()];
  if (!option || !packKey || !option[packKey]) return item;
  const unitPrice = Number(String(option[packKey]).replace(/[$,]/g, ''));
  if (!Number.isFinite(unitPrice) || unitPrice <= 0) return item;
  const inventoryStatus = option.inventoryStatus || 'in_stock';
  return { ...item, code: option.code, packKey, image: product.image, unitPrice,
    unitPriceDisplay: formatMoney(unitPrice), inventoryStatus,
    backorderNote: inventoryStatus === 'backorder'
      ? option.backorderNote || product.backorderNote || item.backorderNote || '' : '' };
}
const ORDER_REQUEST_CONFIG = window.JONEZIE_ORDER_REQUEST_CONFIG || {};
const ORDER_REQUEST_FALLBACK_EMAIL = String(ORDER_REQUEST_CONFIG.fallbackEmail || 'orders@jonezielabs.com').trim() || 'orders@jonezielabs.com';
const ORDER_REQUEST_RESPONSE_TIMEOUT_MS = 12000;
const ORDER_REQUEST_SUCCESS_MESSAGE = 'Thank you for your order request. We will review your order and email a secure invoice link shortly. Payment must be completed before your order is shipped. Orders with unpaid invoices after 48 hours may be automatically canceled. Once payment is completed, your order will be prepared for shipment and tracking information will be sent by email.';
const FIRST_ORDER_CODE_REDEMPTIONS_KEY = 'jonezie_first_order_code_redeemed_emails';
const LEGACY_WELCOME_CODE_REDEMPTIONS_KEY = 'jonezie_welcome7_redeemed_emails';
const PROMO_CODES = {
  PEPPERS: {
    rate: 0.20,
    freeShipping: false
  },
  SUMMER: {
    rate: 0.30,
    freeShipping: false
  },
  FALL25: {
    rate: 0.25,
    freeShipping: false
  },
  VET40: {
    rate: 0.40,
    freeShipping: false
  },
  MRGOGO: {
    rate: 0.40,
    freeShipping: false,
    enabledAt: '2026-10-09T20:54:00Z',
    durationHours: 24,
    eligiblePackKeys: ['singleVialPrice'],
    eligibleVariants: {
      retatrutide: ['10mg'],
      tirzepatide: ['15mg'],
      semaglutide: ['10mg'],
      tesamorelin: ['10mg'],
      'mots-c': ['10mg'],
      'ghk-cu': ['50mg'],
      'bpc-5mg-plus-tb-5mg': ['10mg'],
      'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg': ['80mg'],
      kpv: ['10mg'],
      hcg: ['5000iu']
    }
  },
  FOUNDER50: {
    rate: 0.50,
    freeShipping: false,
    active: false
  },
  LENNY04: {
    rate: 0.40,
    freeShipping: false
  },
  LENNY41: {
    rate: 0.41,
    freeShipping: false
  },
  FATHER40: {
    rate: 0.40,
    freeShipping: false
  },
  'FRIEND&FAM35': {
    rate: 0.35,
    freeShipping: false
  },
  FALL35: {
    rate: 0.35,
    freeShipping: false
  },
  'FRIEND&FAM25': {
    rate: 0.25,
    freeShipping: false
  },
  LENNYSFRIEND30: {
    rate: 0.30,
    freeShipping: false
  },
  GOODGUY25: {
    rate: 0.25,
    freeShipping: false
  },
  BIGDOG20: {
    rate: 0.20,
    freeShipping: false
  },
  MD25: {
    rate: 0.25,
    freeShipping: false,
    startsAt: '2026-05-22T00:00:00-04:00',
    endsAt: '2026-05-26T00:00:00-04:00'
  },
  LOCAL15: {
    rate: 0.15,
    freeShipping: true
  },
  MILKO: {
    rate: 0.50,
    freeShipping: false
  },
  WELCOME7: {
    rate: 0.40,
    freeShipping: false,
    firstOrderOnly: true
  },
  TRIBE: {
    rate: 0.30,
    freeShipping: false,
    firstOrderOnly: true
  }
};
const SHIPPING_OPTIONS = [
  {
    id: 'ground-advantage',
    label: 'USPS Ground Advantage',
    window: '2-5 business days',
    price: 8.00,
    note: 'Everyday shipping'
  },
  {
    id: 'priority-mail',
    label: 'USPS Priority Mail',
    window: '1-3 business days',
    price: 12.25,
    note: 'Packages with tracking'
  },
  {
    id: 'ups-2nd-day-air',
    label: 'UPS 2nd Day Air',
    window: '2 business days',
    price: 25.00,
    note: 'Faster delivery option'
  },
  {
    id: 'backorder-fulfillment',
    label: 'Backorder Fulfillment',
    window: '10-15 business days',
    price: 29.00,
    note: 'For backorder items only',
    backorderOnly: true
  }
];

let isSubmittingOrderRequest = false;
let submittedOrderSnapshot = null;
let hasTrackedBeginCheckout = false;
let lastTrackedPromoCode = '';
let lastTrackedShippingId = '';

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
installManualFallbackStyles();
initCheckoutForm();

function initCheckoutForm() {
  if (!form) return;

  if (phoneInput) {
    phoneInput.maxLength = 14;
    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhoneDisplay(phoneInput.value);
      syncPhoneValidity();
      if (formFeedback?.dataset.state === 'error') clearFeedback();
    });

    phoneInput.addEventListener('blur', () => {
      phoneInput.value = formatPhoneDisplay(phoneInput.value);
      syncPhoneValidity();
    });

    syncPhoneValidity();
  }

  form.addEventListener('input', (event) => {
    if (event.target !== phoneInput && formFeedback?.dataset.state === 'error') {
      clearFeedback();
    }
  });
}

function getCart() {
  try {
    const removed = new Set(window.JONEZIE_ADMIN_CONFIG?.removeProductSlugs || []);
    const removedOptions = new Set(window.JONEZIE_ADMIN_CONFIG?.removeOptionCodes || []);
    const items = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
    if (!Array.isArray(items)) return [];
    const grouped = new Map();
    items.filter((item) => item && !removed.has(item.slug) && !removedOptions.has(item.code)).forEach((rawItem) => {
      const item = getCurrentCatalogCartItem(rawItem);
      const quantity = Math.max(1, Math.trunc(Number(item.quantity) || 1));
      const unitCents = Math.round(Number(item.unitPrice || 0) * 100);
      const variant = [item.slug || item.name, item.mgOption, item.packKey || item.packLabel, unitCents,
        item.inventoryStatus, item.backorderNote].map((value) => String(value || '').trim().toLowerCase()).join('|');
      if (grouped.has(variant)) grouped.get(variant).quantity += quantity;
      else grouped.set(variant, { ...item, quantity });
    });
    return [...grouped.values()];
  } catch {
    return [];
  }
}

function setCart(cart) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent('jonezie:cart-updated'));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

function isPromoCurrentlyActive(promo) {
  if (promo?.active === false) return false;
  if (promo?.durationHours) {
    const enabledAt = Date.parse(promo.enabledAt);
    if (!Number.isFinite(enabledAt)) return false;
    const now = Date.now();
    return now >= enabledAt && now < enabledAt + promo.durationHours * 60 * 60 * 1000;
  }
  if (!promo?.startsAt || !promo?.endsAt) return true;
  const startsAt = Date.parse(promo.startsAt);
  const endsAt = Date.parse(promo.endsAt);
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt)) return false;
  const now = Date.now();
  return now >= startsAt && now < endsAt;
}

function getPromoRate(promo, now = Date.now()) {
  if (!promo) return 0;
  const temporaryRate = promo.temporaryRate;
  if (temporaryRate) {
    const startsAt = Date.parse(temporaryRate.startsAt);
    const endsAt = Date.parse(temporaryRate.endsAt);
    const hasValidWindow = Number.isFinite(startsAt) && Number.isFinite(endsAt);
    if (hasValidWindow && now >= startsAt && now < endsAt) {
      return Number(temporaryRate.rate || promo.rate || 0);
    }
  }
  return Number(promo.rate || 0);
}

function getPhoneDigits(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizePhoneDigits(value) {
  const digits = getPhoneDigits(value);
  if (digits.length === 11 && digits.startsWith('1')) return digits.slice(1);
  return digits.slice(0, 10);
}

function formatPhoneDisplay(value) {
  const digits = normalizePhoneDigits(value);
  if (!digits) return '';
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

function syncPhoneValidity() {
  if (!phoneInput) return true;
  const normalizedDigits = normalizePhoneDigits(phoneInput.value);

  if (!phoneInput.value.trim()) {
    phoneInput.setCustomValidity('Phone number is required.');
    return false;
  }

  if (normalizedDigits.length !== 10) {
    phoneInput.setCustomValidity('Enter a valid 10-digit phone number.');
    return false;
  }

  phoneInput.setCustomValidity('');
  return true;
}

function setFeedback(message, state = '') {
  if (!formFeedback) return;
  formFeedback.textContent = message;
  formFeedback.dataset.state = state;
  formFeedback.className = 'checkout-form-feedback';
  if (state) formFeedback.classList.add(`is-${state}`);
}

function clearFeedback() {
  setFeedback('');
}

function installManualFallbackStyles() {
  if (document.getElementById('checkout-manual-fallback-styles')) return;
  const style = document.createElement('style');
  style.id = 'checkout-manual-fallback-styles';
  style.textContent = `
    .checkout-success-card h2 {
      margin: 0 0 10px;
      font-family: "Space Grotesk", sans-serif;
      font-size: 1.35rem;
      line-height: 1.15;
    }
    .checkout-manual-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin: 18px 0;
    }
    .checkout-manual-actions .button {
      margin: 0;
    }
    .checkout-manual-order-text {
      width: 100%;
      min-height: 240px;
      padding: 16px;
      border: 1px solid rgba(98, 219, 240, 0.18);
      border-radius: 18px;
      background: rgba(3, 10, 14, 0.88);
      color: #f4fbff;
      font: 0.86rem/1.5 "Manrope", sans-serif;
      resize: vertical;
    }
  `;
  document.head.appendChild(style);
}

function isLocalPreview() {
  const host = window.location.hostname || '';
  return !host || host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

function getOrderRequestEndpoint() {
  return String(ORDER_REQUEST_CONFIG.endpoint || '').trim();
}

function createOrderId() {
  const timestamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `JL-${timestamp}-${suffix}`;
}

function getInventoryLabel(status) {
  const value = String(status || 'in_stock').toLowerCase();
  if (value === 'backorder') return 'Backorder';
  if (value === 'sold_out') return 'Sold Out';
  return 'In Stock';
}

function getPromoDetails() {
  const rawCode = String(promoCodeInput?.value || '').trim().toUpperCase();
  const promo = PROMO_CODES[rawCode] || null;
  const isValid = Boolean(promo) && isPromoCurrentlyActive(promo);
  return {
    code: rawCode,
    rate: isValid ? getPromoRate(promo) : 0,
    freeShipping: isValid ? Boolean(promo?.freeShipping) : false,
    firstOrderOnly: isValid ? Boolean(promo?.firstOrderOnly) : false,
    eligiblePackKeys: isValid ? promo?.eligiblePackKeys || null : null,
    eligibleVariants: isValid ? promo?.eligibleVariants || null : null,
    isValid
  };
}

function isPromoEligibleItem(item, promo) {
  if (!promo?.eligibleVariants) return true;
  const slug = String(item.slug || '').toLowerCase();
  const strength = String(item.mgOption || '').toLowerCase();
  if (!promo.eligibleVariants[slug]?.includes(strength)) return false;

  const packKey = item.packKey || (String(item.packLabel || '').toLowerCase() === 'single vial' ? 'singleVialPrice' : '');
  if (!promo.eligiblePackKeys?.includes(packKey)) return false;

  const product = window.JONEZIE_CATALOG?.products?.find((entry) => entry.slug === slug);
  const option = product?.options?.find((entry) => String(entry.mgOption || '').toLowerCase() === strength);
  if (!option || String(option.inventoryStatus || '').toLowerCase() === 'sold_out') return false;
  const catalogPriceCents = Math.round(Number(String(option[packKey] || '').replace(/[$,]/g, '')) * 100);
  const cartPriceCents = Math.round(Number(item.unitPrice) * 100);
  return catalogPriceCents > 0 && cartPriceCents === catalogPriceCents;
}

function getPromoDiscount(cart, promo) {
  if (!promo?.isValid) return 0;
  if (!promo.eligibleVariants) {
    return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * promo.rate;
  }
  const discountCents = cart.reduce((sum, item) => {
    if (!isPromoEligibleItem(item, promo)) return sum;
    const unitCents = Math.round(Number(item.unitPrice) * 100);
    const saleCents = Math.round(unitCents * (1 - promo.rate));
    return sum + (unitCents - saleCents) * item.quantity;
  }, 0);
  return discountCents / 100;
}

function renderPromoStatus(promo, cart = []) {
  if (!activePromoCopy) return;
  if (!promo.code) {
    const activePromo = window.JONEZIE_PROMO?.getActivePromo?.();
    const activeCode = activePromo?.code || 'FALL25';
    const activeRate = Number(activePromo?.rate || 0.25);
    activePromoCopy.innerHTML = `Active code: <strong>${escapeHtml(activeCode)}</strong> (${Math.round(activeRate * 100)}% off)`;
    activePromoCopy.dataset.state = 'default';
    return;
  }
  if (promo.isValid) {
    const scope = promo.eligibleVariants ? ' on selected single-vial products' : '';
    activePromoCopy.innerHTML = `Active code: <strong>${escapeHtml(promo.code)}</strong> (${Math.round(promo.rate * 100)}% off${scope})`;
    if (promo.eligibleVariants && cart.length && !getPromoDiscount(cart, promo)) {
      activePromoCopy.innerHTML += '. No eligible items in this cart.';
    }
    activePromoCopy.dataset.state = 'valid';
    return;
  }
  activePromoCopy.innerHTML = `Code <strong>${escapeHtml(promo.code)}</strong> is not active.`;
  activePromoCopy.dataset.state = 'invalid';
}

function normalizePromoEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function getFirstOrderCodeRedemptions() {
  try {
    const redemptions = JSON.parse(window.localStorage.getItem(FIRST_ORDER_CODE_REDEMPTIONS_KEY) || '{}');
    return redemptions && typeof redemptions === 'object' ? redemptions : {};
  } catch {
    return {};
  }
}

function getLegacyWelcomeRedemptions() {
  try {
    const redemptions = JSON.parse(window.localStorage.getItem(LEGACY_WELCOME_CODE_REDEMPTIONS_KEY) || '{}');
    return redemptions && typeof redemptions === 'object' ? redemptions : {};
  } catch {
    return {};
  }
}

function hasRedeemedFirstOrderCode(email, code) {
  const emailKey = normalizePromoEmail(email);
  const promoCode = String(code || '').trim().toUpperCase();
  if (!emailKey || !promoCode) return false;
  const redemptions = getFirstOrderCodeRedemptions();
  const record = redemptions[emailKey];
  if (record?.[promoCode]) return true;
  return promoCode === 'WELCOME7' && Boolean(getLegacyWelcomeRedemptions()[emailKey]);
}

function markFirstOrderCodeRedeemed(email, code) {
  const emailKey = normalizePromoEmail(email);
  const promoCode = String(code || '').trim().toUpperCase();
  if (!emailKey || !promoCode) return;
  const redemptions = getFirstOrderCodeRedemptions();
  redemptions[emailKey] = {
    ...(redemptions[emailKey] || {}),
    [promoCode]: {
      code: promoCode,
      redeemedAt: Date.now()
    },
    redeemedAt: Date.now()
  };
  window.localStorage.setItem(FIRST_ORDER_CODE_REDEMPTIONS_KEY, JSON.stringify(redemptions));
}

function trackBeginCheckoutOnce(cart, promo, shippingOption) {
  if (hasTrackedBeginCheckout || !cart.length) return;
  hasTrackedBeginCheckout = true;
  window.JONEZIE_ANALYTICS?.beginCheckout(cart, {
    coupon: promo?.isValid ? promo.code : '',
    shipping_tier: shippingOption?.label || ''
  });
}

function trackPromoIfValid(promo, cart) {
  const discountValue = getPromoDiscount(cart, promo);
  if (!promo?.isValid || !promo.code || !discountValue || promo.code === lastTrackedPromoCode) return;
  lastTrackedPromoCode = promo.code;
  window.JONEZIE_ANALYTICS?.applyPromoCode(promo.code, {
    discount_rate: promo.rate,
    discount_value: discountValue
  });
}

function trackShippingIfChanged(cart, shippingOption, promo) {
  if (!shippingOption || shippingOption.id === lastTrackedShippingId) return;
  lastTrackedShippingId = shippingOption.id;
  window.JONEZIE_ANALYTICS?.addShippingInfo(cart, shippingOption, {
    coupon: promo?.isValid ? promo.code : '',
    shipping_cost: getEffectiveShippingCost(shippingOption, promo)
  });
}

function getAvailableShippingOptions(cart) {
  const hasBackorder = cart.some((item) => String(item.inventoryStatus || '').toLowerCase() === 'backorder');
  return SHIPPING_OPTIONS.filter((option) => !option.backorderOnly || hasBackorder);
}

function getSelectedShipping(cart) {
  const availableOptions = getAvailableShippingOptions(cart);
  if (!availableOptions.length) return null;

  const allBackorder = cart.length > 0 && cart.every((item) => String(item.inventoryStatus || '').toLowerCase() === 'backorder');
  const preferredId = shippingMethodInput?.value;
  const matched = availableOptions.find((option) => option.id === preferredId);
  if (matched) return matched;

  const defaultOption = allBackorder
    ? availableOptions.find((option) => option.backorderOnly) || availableOptions[0]
    : availableOptions[0];

  if (shippingMethodInput) shippingMethodInput.value = defaultOption.id;
  return defaultOption;
}

function getEffectiveShippingCost(shippingOption, promo) {
  if (!shippingOption) return 0;
  return promo?.freeShipping ? 0 : (shippingOption.price || 0);
}

function renderShippingOptions(cart, promo = null) {
  if (!shippingMethodInput) return null;
  const availableOptions = getAvailableShippingOptions(cart);
  const previousValue = shippingMethodInput.value;

  shippingMethodInput.innerHTML = availableOptions.map((option) => `
    <option value="${option.id}">
      ${option.label} - ${option.window} - ${promo?.freeShipping ? 'FREE' : formatMoney(option.price)}
    </option>`).join('');

  if (!availableOptions.length) {
    shippingMethodInput.disabled = true;
    if (shippingHelp) shippingHelp.textContent = 'Add products to your cart to choose a shipping option.';
    return null;
  }

  shippingMethodInput.disabled = false;
  if (previousValue && availableOptions.some((option) => option.id === previousValue)) {
    shippingMethodInput.value = previousValue;
  }
  const selected = getSelectedShipping(cart);
  if (shippingHelp && selected) {
    shippingHelp.textContent = promo?.freeShipping
      ? `Free shipping applied with ${promo.code}. ${selected.window} delivery window.`
      : `${selected.note}. ${selected.window} delivery window.`;
  }
  return selected;
}

function buildShippingAddressDisplay(streetAddress, city, state, zipCode) {
  const street = String(streetAddress || '').trim();
  const locality = [String(city || '').trim(), String(state || '').trim()]
    .filter(Boolean)
    .join(', ');
  const localityWithZip = [locality, String(zipCode || '').trim()]
    .filter(Boolean)
    .join(' ');

  return [street, localityWithZip].filter(Boolean).join(', ');
}

function renderSummaryValues({ itemCount, subtotal, discountAmount, shippingCost, total, isFreeShipping = false }) {
  if (summaryItems) summaryItems.textContent = String(itemCount || 0);
  if (summarySubtotal) summarySubtotal.textContent = formatMoney(subtotal || 0);
  if (summaryDiscount) summaryDiscount.textContent = discountAmount ? `- ${formatMoney(discountAmount)}` : '$0.00';
  if (summaryShipping) summaryShipping.textContent = isFreeShipping && itemCount ? 'FREE' : formatMoney(shippingCost || 0);
  if (summaryTotal) summaryTotal.textContent = formatMoney(total || 0);
}

function buildSubmittedOrderSnapshot(payload) {
  return {
    orderId: payload.orderId,
    customerFirstName: payload.customer.firstName || payload.customer.name || 'there',
    customerName: payload.customer.name || 'Customer',
    itemCount: payload.totals.itemCount,
    subtotal: payload.totals.subtotal,
    discountAmount: payload.totals.discount,
    shippingCost: payload.totals.shipping,
    total: payload.totals.estimatedTotal,
    isFreeShipping: payload.totals.shippingDisplay === 'FREE',
    shippingLabel: payload.shippingMethod
      ? `${payload.shippingMethod.label} | ${payload.shippingMethod.window}`
      : 'Shipping pending',
    shippingMethodName: payload.shippingMethod?.label || 'Shipping pending',
    shippingWindow: payload.shippingMethod?.window || 'Invoice follow-up pending',
    items: payload.items
  };
}

function renderSubmittedOrder() {
  if (!cartRoot || !submittedOrderSnapshot) return;

  renderSummaryValues(submittedOrderSnapshot);
  const orderLines = submittedOrderSnapshot.items.map((item) => `
    <li>
      <span>${escapeHtml(getCartDisplayName(item))} | ${escapeHtml(item.mgOption)} | ${escapeHtml(item.packLabel)} | Qty ${item.quantity}</span>
      <strong>${escapeHtml(item.lineTotalDisplay)}</strong>
    </li>`).join('');
  cartRoot.innerHTML = `
    <div class="empty-cart-card checkout-complete-card">
      <h2>Order request received.</h2>
      <p>We are reviewing ${escapeHtml(submittedOrderSnapshot.customerName)}'s order and will send a secure invoice link by email shortly.</p>
      <p class="checkout-complete-meta">${escapeHtml(submittedOrderSnapshot.shippingLabel)}</p>
      <ul class="checkout-complete-list">
        ${submittedOrderSnapshot.items.map((item) => `<li>${escapeHtml(getCartDisplayName(item))} | ${escapeHtml(item.mgOption)} | ${escapeHtml(item.packLabel)} | Qty ${item.quantity} | ${escapeHtml(item.lineTotalDisplay)}</li>`).join('')}
      </ul>
    </div>`;
}

function renderSubmittedOrderPremium() {
  if (!cartRoot || !submittedOrderSnapshot) return;

  renderSummaryValues(submittedOrderSnapshot);
  const orderLines = submittedOrderSnapshot.items.map((item) => `
    <li>
      <span>${escapeHtml(getCartDisplayName(item))} | ${escapeHtml(item.mgOption)} | ${escapeHtml(item.packLabel)} | Qty ${item.quantity}</span>
      <strong>${escapeHtml(item.lineTotalDisplay)}</strong>
    </li>`).join('');

  cartRoot.innerHTML = `
    <div class="checkout-complete-card">
      <div class="checkout-complete-hero">
        <div class="checkout-complete-icon" aria-hidden="true">&#10003;</div>
        <div>
          <h1>Order request received.</h1>
          <p class="checkout-complete-thanks">Thanks, ${escapeHtml(submittedOrderSnapshot.customerFirstName)} - we're reviewing your order now.</p>
          <p class="checkout-complete-id">Request ID <strong>${escapeHtml(submittedOrderSnapshot.orderId)}</strong></p>
          <p>No payment was collected on this page. Once your order is reviewed and confirmed, Jonezie Labs will email a secure invoice link to the email address on your order. Please check your inbox and spam folder.</p>
          <p class="checkout-payment-options"><strong>Payment options include:</strong> credit or debit card, Apple Pay, Google Pay, Cash App Pay, ACH bank transfer, and Afterpay.</p>
        </div>
      </div>

      <div class="checkout-invoice-alert">
        <span>48 HR</span>
        <div>
          <strong>Invoice must be paid before your order ships.</strong>
          <p>Orders with unpaid invoices for more than 48 hours may be automatically canceled.</p>
        </div>
      </div>

      <div class="checkout-complete-request">
        <div>
          <span class="checkout-complete-label">Shipping</span>
          <strong>${escapeHtml(submittedOrderSnapshot.shippingMethodName)}</strong>
          <p>${escapeHtml(submittedOrderSnapshot.shippingWindow)}</p>
        </div>
        <div>
          <span class="checkout-complete-label">Estimated Total</span>
          <strong>${escapeHtml(formatMoney(submittedOrderSnapshot.total))}</strong>
          <p>Final confirmation arrives by email.</p>
        </div>
      </div>

      <div class="checkout-complete-order">
        <span class="checkout-complete-label">Your Request</span>
        <ul class="checkout-complete-list">${orderLines}</ul>
      </div>

      <h3>What happens next</h3>
      <div class="checkout-next-grid">
        <article><span>1</span><strong>Review</strong><p>We confirm your order request.</p></article>
        <article><span>2</span><strong>Invoice</strong><p>We email your secure invoice link.</p></article>
        <article><span>3</span><strong>Payment</strong><p>You pay the secure invoice.</p></article>
        <article><span>4</span><strong>Ship</strong><p>Tracking is sent after label creation.</p></article>
      </div>

      <div class="checkout-complete-actions">
        <a class="button primary" href="catalog.html">Continue Shopping</a>
        <a class="button secondary" href="mailto:orders@jonezielabs.com?subject=Order%20request%20help%20-%20${encodeURIComponent(submittedOrderSnapshot.orderId || 'Jonezie')}">Need Help?</a>
      </div>
    </div>`;
}

function renderCart() {
  if (!cartRoot) return;
  if (submittedOrderSnapshot) {
    renderSubmittedOrderPremium();
    return;
  }

  const cart = getCart();

  if (!cart.length) {
    renderPromoStatus(getPromoDetails());
    cartRoot.innerHTML = `
      <div class="empty-cart-card">
        <h2>Your cart is empty.</h2>
        <p>Go back to the catalog, choose a product option, and add it to cart to begin checkout.</p>
        <a class="button primary" href="catalog.html">Browse Catalog</a>
      </div>`;
    renderSummaryValues({
      itemCount: 0,
      subtotal: 0,
      discountAmount: 0,
      shippingCost: 0,
      total: 0
    });
    renderShippingOptions(cart, getPromoDetails());
    return;
  }

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const promo = getPromoDetails();
  renderPromoStatus(promo, cart);
  const shippingOption = renderShippingOptions(cart, promo);
  const shippingCost = getEffectiveShippingCost(shippingOption, promo);
  const discountAmount = getPromoDiscount(cart, promo);
  const total = subtotal - discountAmount + shippingCost;
  trackBeginCheckoutOnce(cart, promo, shippingOption);

  renderSummaryValues({
    itemCount,
    subtotal,
    discountAmount,
    shippingCost,
    total,
    isFreeShipping: promo.freeShipping && Boolean(shippingOption)
  });

  cartRoot.innerHTML = cart.map((item, index) => `
    <article class="checkout-item-card">
      <div class="checkout-item-visual"><img src="${escapeHtml(getCartImage(item))}" alt="${escapeHtml(getCartDisplayName(item))} product image" onerror="this.onerror=null;this.src='${PRODUCT_FALLBACK_IMAGE}'" /></div>
      <div class="checkout-item-copy">
        <div class="checkout-item-topline"><h2>${escapeHtml(getCartDisplayName(item))}</h2><strong>${formatMoney(item.unitPrice * item.quantity)}</strong></div>
        <p class="checkout-item-variant">${escapeHtml(item.mgOption)} · ${escapeHtml(item.packLabel)}</p>
        <p class="checkout-item-unit">${formatMoney(item.unitPrice)} each · ${escapeHtml(getInventoryLabel(item.inventoryStatus))}</p>
        ${item.backorderNote ? `<p class="checkout-item-note">${escapeHtml(item.backorderNote)}</p>` : ''}
      </div>
      <div class="checkout-item-controls">
        <div class="checkout-item-stepper" role="group" aria-label="Quantity for ${escapeHtml(getCartDisplayName(item))} ${escapeHtml(item.mgOption)} ${escapeHtml(item.packLabel)}">
          <button type="button" data-quantity-index="${index}" data-quantity-delta="-1" aria-label="Decrease quantity">−</button>
          <span aria-live="polite">${item.quantity}</span>
          <button type="button" data-quantity-index="${index}" data-quantity-delta="1" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-item-button" type="button" data-remove-index="${index}">Remove</button>
      </div>
    </article>`).join('');

  cartRoot.querySelectorAll('[data-quantity-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextCart = getCart();
      const index = Number(button.dataset.quantityIndex);
      const delta = Number(button.dataset.quantityDelta);
      const item = nextCart[index];
      if (!item || ![-1, 1].includes(delta)) return;
      if (delta < 0) window.JONEZIE_ANALYTICS?.removeFromCart({ ...item, quantity: 1 });
      else window.JONEZIE_ANALYTICS?.addToCart({ ...item, quantity: 1 });
      item.quantity += delta;
      if (item.quantity <= 0) nextCart.splice(index, 1);
      setCart(nextCart);
      renderCart();
    });
  });

  cartRoot.querySelectorAll('[data-remove-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextCart = getCart();
      const removed = nextCart.splice(Number(button.getAttribute('data-remove-index')), 1)[0];
      if (removed) window.JONEZIE_ANALYTICS?.removeFromCart(removed);
      setCart(nextCart);
      renderCart();
    });
  });
}

function buildOrderRequestPayload({
  cart,
  firstName,
  lastName,
  email,
  phone,
  streetAddress,
  city,
  state,
  zipCode,
  notes,
  promo,
  shippingOption,
  shippingCost,
  subtotal,
  discountAmount,
  total
}) {
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const orderId = createOrderId();
  const requestedAt = new Date().toISOString();
  const formattedPhone = formatPhoneDisplay(phone);
  const normalizedFirstName = String(firstName || '').trim();
  const normalizedLastName = String(lastName || '').trim();
  const shippingAddress = buildShippingAddressDisplay(streetAddress, city, state, zipCode);

  return {
    orderId,
    requestedAt,
    invoiceFlow: 'Review and confirm order, then email a secure invoice link.',
    paymentNotice: 'All invoices must be paid before an order is shipped. Orders with unpaid invoices for more than 48 hours may be automatically canceled.',
    researchUseNotice: 'Items requested below are for laboratory research only.',
    customer: {
      firstName: normalizedFirstName,
      lastName: normalizedLastName,
      name: `${normalizedFirstName} ${normalizedLastName}`.trim(),
      email: String(email || '').trim(),
      phone: formattedPhone,
      phoneDigits: normalizePhoneDigits(phone),
      shippingStreetAddress: String(streetAddress || '').trim(),
      shippingCity: String(city || '').trim(),
      shippingState: String(state || '').trim().toUpperCase(),
      shippingZip: String(zipCode || '').trim(),
      shippingAddress
    },
    promoCode: promo.isValid && (!promo.eligibleVariants || discountAmount > 0) ? promo.code : '',
    notes: String(notes || '').trim(),
    shippingMethod: shippingOption ? {
      id: shippingOption.id,
      label: shippingOption.label,
      window: shippingOption.window,
      note: shippingOption.note,
      cost: shippingCost,
      costDisplay: promo.freeShipping ? 'FREE' : formatMoney(shippingCost)
    } : null,
    totals: {
      itemCount,
      subtotal,
      subtotalDisplay: formatMoney(subtotal),
      discount: discountAmount,
      discountDisplay: discountAmount > 0 ? `- ${formatMoney(discountAmount)}` : '$0.00',
      shipping: shippingCost,
      shippingDisplay: shippingOption ? (promo.freeShipping ? 'FREE' : formatMoney(shippingCost)) : '$0.00',
      estimatedTotal: total,
      estimatedTotalDisplay: formatMoney(total)
    },
    items: cart.map((item) => ({
      slug: item.slug,
      name: item.name,
      code: item.code,
      mgOption: item.mgOption,
      packLabel: item.packLabel,
      quantity: item.quantity,
      inventoryStatus: getInventoryLabel(item.inventoryStatus),
      backorderNote: String(item.backorderNote || '').trim(),
      unitPrice: item.unitPrice,
      unitPriceDisplay: item.unitPriceDisplay,
      lineTotal: item.unitPrice * item.quantity,
      lineTotalDisplay: formatMoney(item.unitPrice * item.quantity)
    })),
    includedWithOrder: [
      'Free vial cap cover',
    ],
    pageUrl: window.location.href,
    timezone: String(Intl.DateTimeFormat().resolvedOptions().timeZone || '').trim(),
    locale: String(navigator.language || '').trim(),
    userAgent: String(navigator.userAgent || '').trim()
  };
}

function buildOrderRequestLines(payload) {
  const shippingLine = payload.shippingMethod
    ? `${payload.shippingMethod.label} | ${payload.shippingMethod.window} | ${payload.shippingMethod.costDisplay}`
    : 'Not selected';

  const lines = [
    'New Jonezie order request',
    '',
    `Order ID: ${payload.orderId}`,
    `Submitted At: ${payload.requestedAt}`,
    `Invoice Flow: ${payload.invoiceFlow}`,
    `Payment Notice: ${payload.paymentNotice}`,
    '',
    `Research-use notice: ${payload.researchUseNotice}`,
    '',
    `Customer: ${payload.customer.name || 'Not provided'}`,
    `First Name: ${payload.customer.firstName || 'Not provided'}`,
    `Last Name: ${payload.customer.lastName || 'Not provided'}`,
    `Email: ${payload.customer.email || 'Not provided'}`,
    `Phone: ${payload.customer.phone || 'Not provided'}`,
    `Street Address: ${payload.customer.shippingStreetAddress || 'Not provided'}`,
    `City: ${payload.customer.shippingCity || 'Not provided'}`,
    `State: ${payload.customer.shippingState || 'Not provided'}`,
    `ZIP Code: ${payload.customer.shippingZip || 'Not provided'}`,
    `Shipping Address: ${payload.customer.shippingAddress || 'Not provided'}`,
    `Shipping Method: ${shippingLine}`,
    `Promo code: ${payload.promoCode || 'None'}`,
    '',
    'Order items:'
  ];

  payload.items.forEach((item) => {
    lines.push(`- ${item.name} | ${item.mgOption} | ${item.packLabel} | ${item.inventoryStatus} | Qty ${item.quantity} | ${item.unitPriceDisplay} each | ${item.lineTotalDisplay} total`);
    if (item.backorderNote) lines.push(`  Backorder note: ${item.backorderNote}`);
  });

  lines.push('');
  lines.push(`Subtotal: ${payload.totals.subtotalDisplay}`);
  lines.push(`Discount: ${payload.promoCode ? `${payload.totals.discountDisplay} (${payload.promoCode})` : '$0.00'}`);
  lines.push(`Shipping: ${payload.shippingMethod ? `${payload.totals.shippingDisplay} (${payload.shippingMethod.label})` : '$0.00'}`);
  lines.push(`Estimated Total: ${payload.totals.estimatedTotalDisplay}`);
  lines.push('');
  lines.push(`Included with order: ${payload.includedWithOrder.join(' + ')}`);
  lines.push('');
  lines.push(`Notes: ${payload.notes || 'None'}`);

  return lines;
}

function buildOrderRequestMailtoUrl(payload) {
  const subject = encodeURIComponent(`Jonezie Order Request - ${payload.customer.name || 'Customer'} - ${payload.orderId}`);
  const body = encodeURIComponent(buildOrderRequestLines(payload).join('\n'));
  return `mailto:${ORDER_REQUEST_FALLBACK_EMAIL}?subject=${subject}&body=${body}`;
}

function openOrderRequestMailto(payload) {
  window.location.href = buildOrderRequestMailtoUrl(payload);
}

function renderManualOrderFallback(payload) {
  if (!successCard) return;

  const orderText = buildOrderRequestLines(payload).join('\n');
  const mailtoUrl = buildOrderRequestMailtoUrl(payload);
  successCard.hidden = false;
  successCard.innerHTML = `
    <h2>Finish this order request by email.</h2>
    <p>Your desktop may not have an email app connected, so we built the order request below. Send it to <strong>${escapeHtml(ORDER_REQUEST_FALLBACK_EMAIL)}</strong> and we will review it for invoice follow-up.</p>
    <div class="checkout-manual-actions">
      <a class="button primary" href="${escapeHtml(mailtoUrl)}">Open Email Draft</a>
      <button class="button secondary" type="button" data-copy-order-request>Copy Order Request</button>
    </div>
    <textarea class="checkout-manual-order-text" readonly rows="12">${escapeHtml(orderText)}</textarea>
  `;

  const copyButton = successCard.querySelector('[data-copy-order-request]');
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(orderText);
      setFeedback('Order request copied. Paste it into an email to orders@jonezielabs.com.', 'success');
    } catch {
      const textArea = successCard.querySelector('.checkout-manual-order-text');
      textArea?.focus();
      textArea?.select();
      setFeedback('Select and copy the order request text, then email it to orders@jonezielabs.com.', 'info');
    }
  });
}

async function submitOrderRequest(payload) {
  const endpoint = getOrderRequestEndpoint();
  if (!endpoint) {
    if (isLocalPreview()) {
      return { ok: true, mode: 'manual-email' };
    }

    return { ok: true, mode: 'manual-email' };
  }

  const request = fetch(endpoint, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-store',
      credentials: 'omit',
      keepalive: true,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    })
    .then(() => ({ status: 'completed' }))
    .catch((error) => ({ status: 'failed', error }));

  let timeoutId = null;
  const timeout = new Promise((resolve) => {
    timeoutId = window.setTimeout(() => resolve({ status: 'timeout' }), ORDER_REQUEST_RESPONSE_TIMEOUT_MS);
  });
  const result = await Promise.race([request, timeout]);
  if (result.status !== 'timeout' && timeoutId !== null) window.clearTimeout(timeoutId);

  if (result.status === 'timeout') {
    console.warn('Order request response timed out; the background request is still running.');
    return { ok: true, mode: 'remote', reason: 'response-timeout' };
  }

  if (result.status === 'failed') {
    console.error('Order request submission failed.', result.error);
    return { ok: true, mode: 'manual-email', reason: 'network-error' };
  }

  return { ok: true, mode: 'remote' };
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isSubmittingOrderRequest) return;

  const cart = getCart();
  if (!cart.length) {
    setFeedback('Your cart is empty. Add products before submitting an order request.', 'error');
    return;
  }

  const phoneIsValid = syncPhoneValidity();
  if (!form.reportValidity() || !phoneIsValid) {
    phoneInput?.reportValidity();
    return;
  }

  isSubmittingOrderRequest = true;
  setFeedback('Submitting order request...', 'pending');
  if (submitButton) submitButton.disabled = true;
  if (clearCartButton) clearCartButton.disabled = true;

  const formData = new FormData(form);
  const firstName = formData.get('customerFirstName') || '';
  const lastName = formData.get('customerLastName') || '';
  const email = formData.get('customerEmail') || '';
  const phone = formData.get('customerPhone') || '';
  const streetAddress = formData.get('shippingStreetAddress') || '';
  const city = formData.get('shippingCity') || '';
  const state = formData.get('shippingState') || '';
  const zipCode = formData.get('shippingZip') || '';
  const notes = formData.get('customerNotes') || '';
  const promo = getPromoDetails();
  if (promo.isValid && promo.firstOrderOnly && hasRedeemedFirstOrderCode(email, promo.code)) {
    isSubmittingOrderRequest = false;
    if (submitButton) submitButton.disabled = false;
    if (clearCartButton) clearCartButton.disabled = false;
    setFeedback(`${promo.code} has already been used with this email address.`, 'error');
    return;
  }
  const shippingOption = getSelectedShipping(cart);
  const shippingCost = getEffectiveShippingCost(shippingOption, promo);
  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  const discountAmount = getPromoDiscount(cart, promo);
  const total = subtotal - discountAmount + shippingCost;

  const payload = buildOrderRequestPayload({
    cart,
    firstName,
    lastName,
    email,
    phone,
    streetAddress,
    city,
    state,
    zipCode,
    notes,
    promo,
    shippingOption,
    shippingCost,
    subtotal,
    discountAmount,
    total
  });

  const submission = await submitOrderRequest(payload);

  isSubmittingOrderRequest = false;
  if (submitButton) submitButton.disabled = false;
  if (clearCartButton) clearCartButton.disabled = false;

  if (!submission.ok) {
    setFeedback('We could not submit your order request. Please try again or email orders@jonezielabs.com for help.', 'error');
    return;
  }

  if (submission.mode === 'manual-email') {
    window.JONEZIE_ANALYTICS?.orderRequestSubmit(payload);
    if (promo.isValid && promo.firstOrderOnly) markFirstOrderCodeRedeemed(email, promo.code);
    renderManualOrderFallback(payload);
    openOrderRequestMailto(payload);
    setFeedback(
      submission.reason === 'network-error'
        ? 'Automatic submission was blocked. Use the email draft or copy the order request below and send it to orders@jonezielabs.com.'
        : 'Email draft opened if your desktop has a mail app. If nothing opened, use the copy button below and email the order request to orders@jonezielabs.com.',
      'info'
    );
    successCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }

  if (submission.reason === 'response-timeout') {
    window.JONEZIE_ANALYTICS?.event('order_request_response_timeout', {
      order_id: String(payload.orderId || '').slice(0, 80)
    });
  }
  window.JONEZIE_ANALYTICS?.orderRequestSubmit(payload);
  if (promo.isValid && promo.firstOrderOnly) markFirstOrderCodeRedeemed(email, promo.code);
  submittedOrderSnapshot = buildSubmittedOrderSnapshot(payload);
  document.body.classList.add('checkout-order-complete');
  if (successCard) {
    successCard.hidden = false;
    successCard.innerHTML = `
      <h2>Reminder</h2>
      <p>Please check your inbox and spam folder for your secure invoice link. No payment was collected at checkout.</p>
    `;
  }
  if (form) form.hidden = true;

  clearFeedback();
  setCart([]);
  renderCart();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

clearCartButton?.addEventListener('click', () => {
  if (isSubmittingOrderRequest) return;
  submittedOrderSnapshot = null;
  document.body.classList.remove('checkout-order-complete');
  if (successCard) successCard.hidden = true;
  if (form) form.hidden = false;
  clearFeedback();
  setCart([]);
  renderCart();
});

promoCodeInput?.addEventListener('input', () => {
  if (submittedOrderSnapshot) return;
  const cart = getCart();
  trackPromoIfValid(getPromoDetails(), cart);
  renderCart();
});

shippingMethodInput?.addEventListener('change', () => {
  if (submittedOrderSnapshot) return;
  const cart = getCart();
  trackShippingIfChanged(cart, getSelectedShipping(cart), getPromoDetails());
  renderCart();
});

renderCart();

(() => {
  const catalog = window.JONEZIE_CATALOG;
  const config = window.JONEZIE_ADMIN_CONFIG || {};
  if (!catalog) return;

  const removeSet = new Set((config.removeProductSlugs || []).map((slug) => String(slug || '').trim().toLowerCase()).filter(Boolean));
  const removeOptionSet = new Set((config.removeOptionCodes || []).map((code) => String(code || '').trim().toUpperCase()).filter(Boolean));
  const addedProducts = Array.isArray(config.addProducts) ? config.addProducts : [];
  const optionInventory = config.optionInventory || {};
  const defaults = config.defaults || {};

  function normalizeStatus(value) {
    const raw = String(value || 'in_stock').trim().toLowerCase();
    if (raw === 'backorder' || raw === 'sold_out' || raw === 'in_stock') return raw;
    return 'in_stock';
  }

  function applyInventory(list) {
    if (!Array.isArray(list)) return;
    list.forEach((product) => {
      if (!Array.isArray(product?.options)) return;
      product.options.forEach((option) => {
        const inventory = optionInventory[option.code] || {};
        const status = normalizeStatus(inventory.status);
        const internalLeadDays = inventory.internalLeadDays
          || (status === 'backorder' ? defaults.backorderLeadDays : defaults.inStockLeadDays)
          || null;
        option.inventoryStatus = status;
        option.internalLeadDays = internalLeadDays;
      });
    });
  }

  function filterRemoved(list) {
    if (!Array.isArray(list) || !removeSet.size) return Array.isArray(list) ? list.slice() : [];
    return list.filter((product) => !removeSet.has(String(product?.slug || '').toLowerCase()));
  }

  function filterRemovedOptions(list) {
    return list.flatMap((product) => {
      if (!Array.isArray(product?.options)) return [product];
      const options = product.options.filter((option) => !removeOptionSet.has(String(option.code || '').toUpperCase()));
      if (!options.length) return [];
      if (options.length === product.options.length) return [product];
      const first = options[0];
      return [{
        ...product,
        options,
        startingPriceSingle: first.singleVialPrice,
        startingPrice8: first.eightVialPrice,
        startingPrice10: first.tenVialPrice
      }];
    });
  }

  let featured = filterRemoved(catalog.featured || []);
  let products = filterRemoved(catalog.products || []);

  if (addedProducts.length) {
    const productMap = new Map();
    const featuredMap = new Map();

    featured.forEach((product) => featuredMap.set(product.slug, product));
    products.forEach((product) => productMap.set(product.slug, product));

    addedProducts.forEach((product) => {
      if (!product?.slug) return;
      productMap.set(product.slug, product);
      if (product.featured) featuredMap.set(product.slug, product);
    });

    featured = Array.from(featuredMap.values());
    products = Array.from(productMap.values());
  }

  featured = filterRemovedOptions(featured);
  products = filterRemovedOptions(products);
  applyInventory(featured);
  applyInventory(products);

  catalog.featured = featured;
  catalog.products = products;
  catalog.totalProducts = products.length;
  catalog.totalConfigurations = products.reduce((sum, product) => {
    return sum + (Array.isArray(product.options) ? product.options.length : 0);
  }, 0);
})();

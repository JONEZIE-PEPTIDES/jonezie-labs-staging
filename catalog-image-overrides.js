(() => {
  const catalog = window.JONEZIE_CATALOG;
  if (!catalog) return;
  const approvedLabels = window.JONEZIE_NEW_LABELS || [];
  const approvedSlugs = new Set(approvedLabels.map(({ slug }) => slug));

  const IMAGE_OVERRIDES_BY_SLUG = {
    'mt-2': 'assets/products/20261022/mt-2.webp',
    'pt-141': 'assets/products/20261022/pt-141.webp',
    'oxytocin-acetate': 'oxytocin-acetate-new-hero-product-image.webp',
    epithalon: 'assets/products/20261022/epithalon.webp',
    'bpc-157': 'assets/products/20261022/bpc-157.webp',
    'bpc-5mg-plus-tb-5mg': 'assets/products/20261022/wolverine.webp',
    semax: 'assets/products/20261022/semax.webp',
    kpv: 'assets/products/20261022/kpv.webp',
    'ss-31': 'assets/products/20261022/ss-31.webp',
    'cjc-1295-without-dac': 'assets/products/20261022/cjc-1295-without-dac.webp',
    hcg: 'assets/products/20261022/hcg.webp',
    aod: 'OFFICAL%20PRODUCT%20IMAGES%20FOR%20JONEZIE%20LABS%20SITE/AOD_5MG_3ML_Vial_Jonezie_Labs_.webp?v=20260501a',
    tesamorelin: 'assets/products/20261022/tesamorelin.webp',
    'bac-water': 'assets/products/20261022/bac-water.webp',
    'b12-10000mcg-10ml': 'assets/products/20261022/b12-3000mcg-3ml.webp',
    '5-amino-1mq': 'assets/products/20261022/5-amino-1mq.webp',
    'ghk-cu': 'assets/products/20261022/ghk-cu.webp',
    'mots-c': 'assets/products/20261022/mots-c.webp',
    'cjc-1295-with-dac': 'cjc-1295-with-dac-official.png',
    'kisspeptin-10': 'assets/products/20261022/kisspeptin-10.webp',
    dermorphin: 'dermorphin-new-hero-product-image.webp',
    dsip: 'dsip-new-hero-product-image.webp',
    glutathione: 'assets/products/20261022/glutathione.webp',
    cagrilintide: 'assets/products/20261022/cagrilintide.webp',
    'cagrilintide-2-5mg-plus-semaglutide-2-5mg': 'OFFICAL%20PRODUCT%20IMAGES%20FOR%20JONEZIE%20LABS%20SITE/CAG_SEMA_5MG_3ML_Vial.webp?v=20260501a',
    'cagrilintide-5mg-plus-semaglutide-5mg': 'assets/products/20261022/cagrilintide-5mg-plus-semaglutide-5mg-20261028.webp',
    hmg: 'hmg-new-hero-product-image.webp',
    cerebrolysin: 'assets/products/20261022/cerebrolysin.webp',
    'ara-290': 'assets/products/20261022/ara-290.webp',
    'snap-8': 'assets/products/20261022/snap-8.webp',
    pnc27: 'pnc27-new-hero-product-image.webp',
    tb500: 'assets/products/20261022/tb500.webp',
    'ghrp-6-acetate': 'ghrp-6-new-hero-product-image.webp',
    'cjc-1295-without-dac-plus-ipamorelin': 'cjc-1295-without-dac-official.png',
    'ghk-cu-35mg-plus-tb-500-10mg-plus-bpc-157-5mg': 'glow-official.png',
    'ghk-cu-50mg-plus-kpv-10mg-plus-bpc-157-10mg': 'klow-official.png',
    'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg': 'assets/products/20261022/ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg.webp',
    'bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg': 'assets/products/20261022/bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg.webp',
    nad: 'assets/products/20261022/nad.webp',
    survodutide: 'survodutide-new-hero-product-image.webp',
    semaglutide: 'assets/products/20261022/semaglutide-20261028.webp',
    'tirzepatide': 'assets/products/20261022/tirzepatide-20261027.webp',
    retatrutide: 'assets/products/20261022/retatrutide.webp',
    'mt-1': 'assets/products/20261022/mt-1.webp',
    mt1: 'assets/products/20261022/mt-1.webp',
    'melanotan-1': 'assets/products/20261022/mt-1.webp',
    'slu-pp-322': 'slu-pp-322-new-hero-product-image.webp',
    'igf-1lr3': 'assets/products/20261022/igf-1lr3.webp',
    ipamorelin: 'assets/products/20261022/ipamorelin.webp',
    pinealon: 'pinealon-new-hero-product-image.webp',
    selank: 'assets/products/20261022/selank.webp',
    vip: 'assets/products/20261022/vip-20261029.webp',
    mazdutide: 'mazdutide-new-hero-product-image.webp',
    thymalin: 'thymalin-new-hero-product-image.webp',
    'thymosin-alpha-1': 'assets/products/20261022/thymosin-alpha-1.webp',
    lc216: 'lc216-new-hero-product-image.webp',
    ...Object.fromEntries(approvedLabels.map(({ slug, image }) => [slug, image]))
  };

  const DISPLAY_NAME_OVERRIDES = {
    cerebrolysin: 'Cerebrolysin 60mg',
    retatrutide: 'GLP-3(RT)'
  };

  const FEATURED_FALLBACK_PRODUCTS = {
    hcg: {
      name: 'HCG',
      sourceName: 'HCG',
      slug: 'hcg',
      category: 'Growth',
      description: 'A growth-axis research compound used in endocrine, recovery, and body-composition signaling studies.',
      startingPriceSingle: '$50.46',
      startingPrice8: '$352.40',
      startingPrice10: '$417.69',
      image: 'assets/products/20261022/hcg.webp',
      options: [
        {
          code: 'HCG5KIU',
          specification: '5000iu*10vials',
          mgOption: '5000iu',
          singleVialPrice: '$50.46',
          eightVialPrice: '$352.40',
          tenVialPrice: '$417.69'
        },
        {
          code: 'HCG10KIU',
          specification: '10000iu/10vials',
          mgOption: '10000iu',
          singleVialPrice: '$90.82',
          eightVialPrice: '$634.33',
          tenVialPrice: '$751.84'
        }
      ]
    }
  };

  function applyOverrides(list) {
    if (!Array.isArray(list)) return;
    list.forEach((product) => {
      const override = IMAGE_OVERRIDES_BY_SLUG[product?.slug];
      if (override) product.image = override;
      product.hasUpdatedLabel = approvedSlugs.has(product.slug);
      const displayName = DISPLAY_NAME_OVERRIDES[product?.slug];
      if (displayName) product.name = displayName;
      if (product?.slug === 'retatrutide') product.searchAliases = ['reta', 'retatrutide'];
    });
  }

  const featuredLookup = new Map(
    [...(catalog.featured || []), ...(catalog.products || []), ...Object.values(FEATURED_FALLBACK_PRODUCTS)]
      .filter((product) => product?.slug)
      .map((product) => [product.slug, product])
  );

  // The approved list also defines display order, without a second allowlist.
  catalog.featured = approvedLabels
    .map(({ slug }) => {
      const product = featuredLookup.get(slug);
      if (!product) return null;
      return { ...product };
    })
    .filter(Boolean);

  applyOverrides(catalog.featured);
  applyOverrides(catalog.products);

  function syncMerchCards() {
    const merchSection = document.querySelector('#merch');
    if (!merchSection) return;

    const removeDescription = (article) => {
      article?.querySelectorAll('.merch-copy > p:not(.eyebrow)').forEach((node) => node.remove());
    };

    const setEyebrow = (article, label) => {
      const eyebrow = article?.querySelector('.merch-copy .eyebrow');
      if (eyebrow) eyebrow.textContent = label;
    };

    const setPrice = (article, price) => {
      const priceNode = [...(article?.querySelectorAll('.merch-meta span') || [])]
        .find((node) => node.textContent.trim().toLowerCase().startsWith('price:'));
      if (priceNode) priceNode.textContent = `Price: $${price}`;
      const purchase = article?.querySelector('[data-merch-purchase]');
      if (purchase) purchase.setAttribute('data-merch-price', price);
    };

    const hotGirlPurchase = merchSection.querySelector('[data-merch-slug="hot-girl-summer-sticker"]');
    const hotGirlArticle = hotGirlPurchase?.closest('.merch-product');
    if (hotGirlArticle) {
      const hotGirlImage = 'assets/Lables%20and%20stickers/hot_girl_summer_jonezie_sticker_black_background.webp?v=20260501b';
      const image = hotGirlArticle.querySelector('.sticker-art img, .merch-card img');
      if (image) {
        image.src = hotGirlImage;
        image.alt = 'Hot Girl Summer sticker';
        image.onerror = () => image.closest('.sticker-art')?.classList.add('is-missing-art');
      }
      setEyebrow(hotGirlArticle, 'Sticker');
      setPrice(hotGirlArticle, '3.00');
      hotGirlPurchase.setAttribute('data-merch-image', hotGirlImage);
      hotGirlPurchase.setAttribute('data-merch-name', 'Hot Girl Summer Sticker');
      removeDescription(hotGirlArticle);
    }

    if (!merchSection.querySelector('[data-merch-slug="summer-stack-bros-sticker"]')) {
      const summerStackCard = document.createElement('article');
      summerStackCard.className = 'merch-product merch-product-sticker';
      summerStackCard.innerHTML = `
        <div class="sticker-art" data-merch-zoom role="button" tabindex="0" aria-label="Open larger image of Summer Stack Bros sticker">
          <img src="assets/Lables%20and%20stickers/beach_volleyball_showdown_with_lively_vials.webp" alt="Summer Stack Bros sticker" onerror="this.closest('.sticker-art').classList.add('is-missing-art')" />
        </div>
        <div class="merch-copy compact-copy">
          <p class="eyebrow">Sticker</p>
          <h3>Summer Stack Bros</h3>
          <div class="merch-meta">
            <span>Price: $3.00</span>
            <span>Sticker format</span>
          </div>
          <div class="merch-purchase" data-merch-purchase data-merch-slug="summer-stack-bros-sticker" data-merch-name="Summer Stack Bros Sticker" data-merch-image="assets/Lables%20and%20stickers/beach_volleyball_showdown_with_lively_vials.webp" data-merch-price="3.00">
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
        </div>`;
      hotGirlArticle?.after(summerStackCard);
    }

    const hatArticle = merchSection.querySelector('[data-merch-slug="jonezie-labs-signature-hat"]')?.closest('.merch-product');
    setEyebrow(hatArticle, 'Hat');
    removeDescription(hatArticle);

    const shirtArticle = merchSection.querySelector('[data-merch-slug="hot-girl-summer-shirt"]')?.closest('.merch-product');
    setEyebrow(shirtArticle, 'Shirt');
    removeDescription(shirtArticle);
  }

  syncMerchCards();
})();

(() => {
  const catalog = window.JONEZIE_CATALOG || null;
  const content = window.JONEZIE_PRODUCT_CONTENT || null;
  const library = window.JONEZIE_SITE_LIBRARY || null;
  if (!catalog || !library) return;

  library.initShellMenus();

  const statsNode = document.querySelector('[data-guide-stats]');
  const guideIndexNode = document.querySelector('[data-guide-index]');
  const guideSectionsNode = document.querySelector('[data-guide-sections]');
  const resourceLinksNode = document.querySelector('[data-guide-resource-links]');

  renderStats();
  renderGuideIndex();
  renderGuideSections();
  renderResourceLinks();
  updateMeta();

  function renderStats() {
    if (!statsNode) return;
    statsNode.innerHTML = `
      <article class="guide-stat-card">
        <p class="eyebrow"><svg aria-hidden="true"><use href="#guide-icon-book"></use></svg><span class="sr-only">Guides</span></p>
        <strong>Clear Research References</strong>
        <span>Review product information, handling considerations, and related research resources in one place.</span>
      </article>
      <article class="guide-stat-card">
        <p class="eyebrow"><svg aria-hidden="true"><use href="#guide-icon-flask"></use></svg><span class="sr-only">Handling</span></p>
        <strong>Storage &amp; Preparation</strong>
        <span>Find general storage, documentation, and laboratory-handling information.</span>
      </article>
      <article class="guide-stat-card">
        <p class="eyebrow"><svg aria-hidden="true"><use href="#guide-icon-shield"></use></svg><span class="sr-only">Research use only</span></p>
        <strong>Research Use Only</strong>
        <span>All products and information are provided strictly for research, laboratory, and analytical purposes.</span>
      </article>`;
  }

  function renderGuideIndex() {
    if (!guideIndexNode) return;
    guideIndexNode.innerHTML = library.GUIDE_LIBRARY.map((guide) => `
      <a class="resource-card" href="#guide-${guide.key}">
        <p class="eyebrow">Category</p>
        <h3>${escapeHtml(guide.title)}</h3>
        <p>${escapeHtml(guide.summary)}</p>
        <span class="catalog-link">View guide</span>
      </a>`).join('');
  }

  function renderGuideSections() {
    if (!guideSectionsNode) return;
    guideSectionsNode.innerHTML = library.GUIDE_LIBRARY.map((guide) => {
      const products = library.getGuideProductList(guide.key, catalog, 6);
      const comparisonCards = library.getComparisonPairs(catalog, 48)
        .filter((pair) => guide.categories.includes(pair.left?.category) || guide.categories.includes(pair.right?.category))
        .slice(0, 4);
      const practicalNotes = buildGuidePracticalNotes(guide, products);

      return `
        <section id="guide-${guide.key}" class="guide-article">
          <div class="section-heading compact">
            <p class="eyebrow">${escapeHtml(guide.categories.join(' / '))}</p>
            <h2>${escapeHtml(guide.title)}</h2>
            <p>${escapeHtml(guide.intro)}</p>
          </div>
          <div class="guide-article-grid">
            <article class="guide-article-card">
              <p class="eyebrow">Key Concepts</p>
              <h3>What to review in this category</h3>
              <ul class="research-list">
                ${guide.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
              </ul>
            </article>
            <article class="guide-article-card">
              <p class="eyebrow">Practical Notes</p>
              <h3>General Storage &amp; Handling</h3>
              <ul class="research-list">
                ${practicalNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join('')}
              </ul>
              <p class="guide-ruo-note">${escapeHtml(library.RUO_COPY.full)}</p>
            </article>
            <article class="guide-article-card">
              <p class="eyebrow">Related Products</p>
              <h3>Start with current listings</h3>
              <div class="mini-link-grid">
                ${products.map((product) => renderProductMiniCard(product)).join('')}
              </div>
            </article>
            <article class="guide-article-card">
              <p class="eyebrow">Related Comparisons</p>
              <h3>Open related comparisons</h3>
              <div class="mini-link-grid">
                ${comparisonCards.map((pair) => renderComparisonMiniCard(pair.left, pair.right)).join('')}
              </div>
            </article>
            <article class="guide-article-card">
              <p class="eyebrow">FAQ</p>
              <h3>Common questions</h3>
              <div class="guide-faq-list">
                ${guide.faq.map((item) => `
                  <div class="guide-faq-item">
                    <strong>${escapeHtml(item.question)}</strong>
                    <p>${escapeHtml(item.answer)}</p>
                  </div>`).join('')}
              </div>
            </article>
          </div>
        </section>`;
    }).join('');
  }

  function renderResourceLinks() {
    if (!resourceLinksNode) return;
    resourceLinksNode.innerHTML = `
      <div class="resource-strip">
        <article class="resource-strip-card">
          <p class="eyebrow">Comparisons</p>
          <h2>Compare related products side by side.</h2>
          <p>Move from a guide into direct compound comparisons for class notes, product context, storage information, and related listings.</p>
          <div class="resource-links-inline">
            <a class="button secondary" href="comparison.html">View Comparisons</a>
          </div>
        </article>
        <article class="resource-strip-card">
          <p class="eyebrow">Catalog</p>
          <h2>Keep product information close.</h2>
          <div class="mini-link-grid">
            <a class="mini-link-card" href="catalog.html">
              <strong>Full Products</strong>
              <span>Return to the live product listing for current pricing, card presentation, and the active catalog view.</span>
            </a>
            <a class="mini-link-card" href="index.html#faq">
              <strong>FAQ</strong>
              <span>Review ordering, research-use, and product-reference answers in the main FAQ.</span>
            </a>
          </div>
        </article>
      </div>`;
  }

  function buildGuidePracticalNotes(guide, products) {
    const leadProduct = products[0] || null;
    const leadProfile = leadProduct ? library.getProductInfoProfile(leadProduct, getProductContent(leadProduct), catalog) : null;
    const forms = Array.from(new Set(products.map((product) => library.getProductForm(product)).filter(Boolean))).slice(0, 3);
    const notes = [];

    if (forms.length) {
      notes.push(`Most listings in this category are cataloged as ${forms.join(', ').toLowerCase()}.`);
    }
    if (leadProfile?.storageNote) {
      notes.push(leadProfile.storageNote);
    }
    if (leadProfile?.handlingNote) {
      notes.push(leadProfile.handlingNote);
    }
    notes.push(`Use direct comparisons after you confirm product class, listed strengths, and the broader research context for ${guide.title.replace(/\s+Research Guide$/i, '').toLowerCase()}.`);

    return notes.slice(0, 4);
  }


  function renderProductMiniCard(product) {
    const profile = library.getProductInfoProfile(product, getProductContent(product), catalog);
    return `
      <a class="mini-link-card" href="${library.getProductUrl(product.slug)}">
        <strong>${escapeHtml(product.name)}</strong>
        <span>${escapeHtml(profile.researchContext)}</span>
      </a>`;
  }

  function renderComparisonMiniCard(leftProduct, rightProduct) {
    return `
      <a class="mini-link-card" href="${library.getComparisonUrl(leftProduct.slug, rightProduct.slug)}">
        <strong>${escapeHtml(leftProduct.name)} vs ${escapeHtml(rightProduct.name)}</strong>
        <span>Compare research classification, molecular targets, available strengths, product format, and general storage information.</span>
      </a>`;
  }

  function updateMeta() {
    const canonicalUrl = `${library.getSiteOrigin()}/research-guides.html`;
    const metaDescription = 'Jonezie Labs research guides covering product information, laboratory handling, storage, labels, COAs, and compound comparisons for research-use-only reference.';
    document.title = 'Research Guides | Jonezie Labs';
    upsertMeta('meta[name="description"]', { name: 'description', content: metaDescription });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: document.title });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: metaDescription });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: document.title });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: metaDescription });
    upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonicalUrl });

    setStructuredData({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          name: document.title,
          url: canonicalUrl,
          description: metaDescription
        },
        {
          '@type': 'ItemList',
          itemListElement: library.GUIDE_LIBRARY.map((guide, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: guide.title,
            url: `${canonicalUrl}#guide-${guide.key}`
          }))
        }
      ]
    });
  }

  function getProductContent(product) {
    return content?.products?.[product.slug] || null;
  }

  function upsertMeta(selector, attributes) {
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('meta');
      document.head.appendChild(node);
    }
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function upsertLink(selector, attributes) {
    let node = document.head.querySelector(selector);
    if (!node) {
      node = document.createElement('link');
      document.head.appendChild(node);
    }
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    return node;
  }

  function setStructuredData(data) {
    let node = document.head.querySelector('script[data-guides-schema]');
    if (!node) {
      node = document.createElement('script');
      node.type = 'application/ld+json';
      node.setAttribute('data-guides-schema', '');
      document.head.appendChild(node);
    }
    node.textContent = JSON.stringify(data);
  }

  function escapeHtml(value) {
    return library.escapeHtml(value);
  }
})();

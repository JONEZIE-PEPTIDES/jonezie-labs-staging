# Approved Label Workflow

The homepage contains only the approved new-label featured grid. The complete
inventory lives at `catalog.html`; previous `index.html#full-catalog` links redirect.
Pricing, stock, variants, checkout and the shipping countdown are unchanged.

`new-label-products.js` is the shared approved-artwork manifest, in homepage order.
Both featured products and the animated announcement read it. All 35 approved
products are included, including Wolverine, B12, and the upgraded Semaglutide image.
MOTS-c and Tesamorelin must have at least four products between them.

Homepage/catalog cards use a compact, blended studio-background frame for approved
photos. The original image remains unchanged inside that frame. Product detail
images and the falling announcement's square thumbnails are not reframed.
See `product-card-framing.md` for rendering and background-asset details.

For each future approved label update:

1. Preserve the full supplied composition; export the hero WebP to
   `assets/products/20261022/` and a 320px WebP to `assets/products/label-reveal/`.
2. Add its canonical catalog slug and image filename stem to the manifest. This
   automatically updates its catalog image, featured status and animation artwork.
   For replacements, use a versioned filename to avoid stale browser caches.
3. Update the product page's static hero, Open Graph, Twitter and JSON-LD images.
4. Bump the manifest script cache version on all consuming pages.
5. Run both label/catalog tests and check desktop/mobile before publishing.

Tests: `node scripts/test-new-labels.cjs` and `node scripts/test-featured-catalog.cjs`.
Update the expected approved count in the latter when adding an approved product.

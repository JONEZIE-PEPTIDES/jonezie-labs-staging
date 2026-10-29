window.JONEZIE_SITE_LIBRARY = (() => {
  const SITE_ORIGIN = 'https://www.jonezielabs.com';
  const RESOURCE_DOWNLOAD = null;
  const LEAD_CAPTURE = {
    endpoint: String(window.JONEZIE_LEAD_CAPTURE_CONFIG?.endpoint || '').trim()
  };
  const RUO_COPY = {
    short: 'For laboratory research reference only. Not for human or veterinary use.',
    full: 'All product information is provided for research, laboratory, or analytical reference only. Products are not for human or veterinary use.'
  };
  const COA_IMAGE_BY_SLUG = {
    'bpc-157': 'coa-bpc-157.png',
    'cjc-1295-with-dac': 'coa-cjc-1295.png',
    'cjc-1295-without-dac': 'coa-cjc-1295.png',
    'cjc-1295-without-dac-plus-ipamorelin': 'coa-cjc-1295.png',
    cagrilintide: 'coa-cagrilintide.png',
    'cagrilintide-2-5mg-plus-semaglutide-2-5mg': 'coa-cagrilintide.png',
    'cagrilintide-5mg-plus-semaglutide-5mg': 'coa-cagrilintide.png',
    'ghk-cu': 'coa-ghk-cu.png',
    'ghk-cu-35mg-plus-tb-500-10mg-plus-bpc-157-5mg': 'coa-glow.png',
    'bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg': 'coa-glow.png',
    'ghk-cu-50mg-plus-kpv-10mg-plus-bpc-157-10mg': 'coa-klow.png',
    'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg': 'coa-klow.png',
    hcg: 'coa-hcg.png',
    ipamorelin: 'coa-ipamorelin.png',
    'mots-c': 'coa-mots-c.png',
    nad: 'coa-nad.png',
    'igf-1lr3': 'coa-igf-1lr3.png',
    kpv: 'coa-kpv.png',
    retatrutide: 'coa-retatrutide.png',
    selank: 'coa-selank.png',
    semaglutide: 'coa-semaglutide.png',
    tb500: 'coa-tb500.png',
    tesamorelin: 'coa-tesamorelin.png',
    tirzepatide: 'coa-tirzepatide.png',
    vip: 'coa-vip.png'
  };
  function getCoaImageForSlug(slug) {
    return COA_IMAGE_BY_SLUG[String(slug || '')] || null;
  }
  const CATEGORY_DISPLAY_LABELS = {
    Metabolic: 'Metabolic Research',
    Cognitive: 'Cognitive Research',
    Recovery: 'Tissue & Repair Research',
    Growth: 'Growth-Axis Research',
    Cellular: 'Cellular Research',
    Aesthetics: 'Dermal & Pigmentation Research',
    Specialty: 'Specialty Research',
    Performance: 'Specialty Research',
    Support: 'Laboratory Support'
  };
  const TOOL_LIBRARY = [];

  const GUIDE_LIBRARY = [
    {
      key: 'metabolic',
      categories: ['Metabolic'],
      title: 'Metabolic Research Guide',
      summary: 'Explore compounds studied in relation to metabolic signaling, incretin pathways, glucose-homeostasis markers, energy-balance endpoints, and metabolic endpoint models.',
      intro: 'Metabolic research often reviews receptor signaling, incretin pathways, glucose-homeostasis markers, energy-balance endpoints, and metabolic endpoint models. Individual product pages and comparisons help clarify class, format, listed strengths, and supporting documentation.',
      bullets: [
        'Compare GLP-1, GIP, glucagon, amylin, and adjacent metabolic research pathways.',
        'Review whether a listing is a single compound or a blended research product.',
        'Use comparison pages to review semaglutide, tirzepatide, GLP-3(RT), cagrilintide blends, and nearby entries side by side.'
      ],
      faq: [
        {
          question: 'Which products are included in metabolic research?',
          answer: 'This category includes products such as semaglutide, tirzepatide, GLP-3(RT), survodutide, mazdutide, cagrilintide, AOD, and SLU-PP-322 when listed in the active catalog.'
        },
        {
          question: 'What should I compare first?',
          answer: 'Start with compound class, molecular targets, available strengths, product format, storage information, and supporting documentation.'
        }
      ]
    },
    {
      key: 'recovery',
      categories: ['Recovery'],
      title: 'Recovery Research Guide',
      summary: 'Explore compounds investigated in tissue-repair pathways, inflammatory-signaling, vascular-response, and wound-closure laboratory models.',
      intro: 'Recovery research commonly examines tissue-remodeling pathways, vascular response, inflammatory signaling, and repair-related laboratory models. Reviewing product pages and comparisons can help separate single compounds, blends, and supporting research categories.',
      bullets: [
        'Review BPC-157, TB500, Wolverine blends, Ara-290, and related repair-pathway products when available.',
        'Compare single-compound listings against blends before selecting a product page.',
        'Keep storage, mixing, and label information close when reviewing multi-vial research materials.'
      ],
      faq: [
        {
          question: 'Which recovery products are commonly reviewed together?',
          answer: 'Researchers often compare BPC-157, TB500, Wolverine blends, Ara-290, and Thymosin Alpha-1 by format, listed strength, and research category.'
        },
        {
          question: 'Where can I find product-specific storage information?',
          answer: 'Open the product page or the storage guide for the most relevant storage and handling notes tied to the selected product.'
        }
      ]
    },
    {
      key: 'aesthetics',
      categories: ['Aesthetics'],
      title: 'Aesthetics Research Guide',
      summary: 'Explore compounds studied in collagen-related pathways, pigmentation, skin biology, tissue remodeling, and cosmetic research models.',
      intro: 'Aesthetics research may include collagen-related signaling, pigmentation pathways, skin-barrier biology, tissue remodeling, and cosmetic research models. Product pages help separate single compounds from blends and show current strengths and documentation.',
      bullets: [
        'Review GHK-CU, KPV, MT-1, MT-2, SNAP-8, and related aesthetics-focused listings when available.',
        'Compare skin, barrier, collagen, pigmentation, and cosmetic-pathway research context.',
        'Use comparisons to separate individual compounds from multi-compound blends.'
      ],
      faq: [
        {
          question: 'What belongs in the aesthetics research category?',
          answer: 'This category groups products reviewed for collagen, skin-barrier, pigmentation, tissue-remodeling, and cosmetic-pathway research context.'
        },
        {
          question: 'How do I compare a single compound with a blend?',
          answer: 'Check the product label, listed components, strengths, and supporting documentation, then use the comparison page when an appropriate side-by-side option is available.'
        }
      ]
    },
    {
      key: 'growth',
      categories: ['Growth'],
      title: 'Growth-Axis Research Guide',
      summary: 'Explore compounds associated with growth-hormone signaling, secretagogue activity, endocrine pathways, and related laboratory models.',
      intro: 'Growth-axis research often compares secretagogue activity, GHRH-related compounds, endocrine signaling, and related endocrine-response models. The most useful review starts with compound class, available strengths, and product-specific documentation.',
      bullets: [
        'Compare CJC-1295 variants, ipamorelin, IGF-1 LR3, HCG, HMG, and related growth-axis products when available.',
        'Review strength options carefully because several listings have multiple tiers.',
        'Use related comparisons to separate secretagogues, direct growth-signaling compounds, and endocrine-support products.'
      ],
      faq: [
        {
          question: 'What makes the growth-axis category different?',
          answer: 'Growth-axis products are usually reviewed by secretagogue activity, GH-axis signaling, endocrine context, listed strengths, and research format.'
        },
        {
          question: 'What should I review before comparing growth-axis products?',
          answer: 'Confirm the product name, compound class, strength options, product documentation, and general storage information.'
        }
      ]
    },
    {
      key: 'cognitive',
      categories: ['Cognitive'],
      title: 'Cognitive Research Guide',
      summary: 'Explore compounds studied in neuroregulation, stress-response signaling, sleep-related pathways, and cognitive research models.',
      intro: 'Cognitive research can include neuroregulation, stress-response signaling, sleep-related pathways, neurotrophic support, and broader central-nervous-system research. Product pages and comparisons help keep those differences clear.',
      bullets: [
        'Review Semax, Selank, DSIP, Pinealon, VIP, Cerebrolysin, Oxytocin Acetate, and related products when listed.',
        'Distinguish focus, stress-response, sleep, neurotrophic, and CNS-signaling research context.',
        'Use individual product pages for product-specific documentation, strength options, and handling information.'
      ],
      faq: [
        {
          question: 'Which products are included in cognitive research?',
          answer: 'This category can include Semax, Selank, DSIP, Pinealon, VIP, Cerebrolysin, Oxytocin Acetate, and related neuroregulatory research products.'
        },
        {
          question: 'How do I choose a comparison?',
          answer: 'Start with products that share a general research area, then compare molecular targets, format, strengths, and storage information.'
        }
      ]
    },
    {
      key: 'cellular',
      categories: ['Cellular'],
      title: 'Cellular Research Guide',
      summary: 'Explore compounds investigated in mitochondrial function, cellular stress, antioxidant pathways, metabolic flexibility, and aging-related research.',
      intro: 'Cellular research commonly reviews mitochondrial function, cellular stress response, antioxidant pathways, metabolic flexibility, and aging-related models. Evidence can vary by compound, so product-specific pages and supporting references should be reviewed closely.',
      bullets: [
        'Review MOTS-c, NAD, SS-31, Epithalon, Thymalin, PNC27, and related cellular-function listings when available.',
        'Compare mitochondrial, bioregulator, antioxidant, and cellular-stress research context separately.',
        'Use product pages to review available strengths, documentation, and handling information.'
      ],
      faq: [
        {
          question: 'What should I compare in cellular research products?',
          answer: 'Compare molecular target, research model, product format, listed strengths, storage notes, and available documentation.'
        },
        {
          question: 'Are all cellular products studied the same way?',
          answer: 'No. Some focus on mitochondrial signaling, while others are reviewed in bioregulator, antioxidant, cellular-stress, or specialty research models.'
        }
      ]
    },
    {
      key: 'support',
      categories: ['Support', 'Performance'],
      title: 'Support And Performance Guide',
      summary: 'Explore preparation supplies and specialty research products that do not fall within the primary research categories.',
      intro: 'Support and specialty products can be used alongside broader research workflows or reviewed as narrower standalone listings. Check product pages for format, documentation, storage notes, and whether the item is eligible for comparison.',
      bullets: [
        'Review BAC Water, B12 support items, Dermorphin, PT-141, LC216, and related specialty products when listed.',
        'Use product pages to confirm whether a listing is a support material, specialty compound, or comparison-eligible product.',
        'Keep storage, label, and preparation references available when reviewing support materials.'
      ],
      faq: [
        {
          question: 'Why are support and specialty products grouped together?',
          answer: 'Some items support laboratory preparation or sit outside the primary research categories, so they are grouped here for easier review.'
        },
        {
          question: 'Are support items compared like peptide products?',
          answer: 'Not always. Some support materials are not comparison-eligible, so their product page and storage notes are the best place to start.'
        }
      ]
    }
  ];

  const STORAGE_PROFILES = {
    Metabolic: {
      title: 'Cold-chain metabolic storage',
      shortSummary: 'Store lyophilized material in a cool, dry, light-protected environment. After reconstitution, refrigerate promptly and minimize repeated warm cycles.',
      bullets: [
        'Protect vials from direct light, humidity, and prolonged room-temperature exposure.',
        'Use clearly labeled reconstitution dates so multi-compound handling stays traceable.',
        'For multi-vial studies, keep handling time short and return refrigerated material quickly.'
      ]
    },
    Recovery: {
      title: 'Repair-category storage',
      shortSummary: 'Recovery compounds are best handled with the same cold-chain discipline used for other lyophilized research products, with extra attention to labeling and repeat handling.',
      bullets: [
        'Keep unopened material cool, dry, and sealed until needed.',
        'After mixing, refrigerate and avoid repeated temperature swings.',
        'Track open-date and lot-level notes when comparing stacks or multi-part blends.'
      ]
    },
    Aesthetics: {
      title: 'Aesthetics and collagen storage',
      shortSummary: 'Store aesthetics-focused products in a cool, dry, dark environment and keep post-reconstitution handling clean and consistent.',
      bullets: [
        'Light protection matters for clean appearance and handling stability.',
        'Use calibrated volumes and clear labels when comparing singles against stacks.',
        'Refrigerate mixed material and keep session-by-session handling disciplined.'
      ]
    },
    Growth: {
      title: 'Endocrine and growth storage',
      shortSummary: 'Store growth-axis products in a dry, low-light environment before mixing and refrigerate after reconstitution.',
      bullets: [
        'Separate lots and strength tiers clearly when a product has multiple option ranges.',
        'Avoid leaving mixed product at room temperature longer than needed for laboratory handling.',
        'Document storage timing when comparing secretagogues, GH products, and endocrine-support compounds.'
      ]
    },
    Cognitive: {
      title: 'Neuro-support storage',
      shortSummary: 'Keep cognitive products cool, dry, and light-protected before mixing; refrigerate after reconstitution and maintain clear handling notes.',
      bullets: [
        'Label mix dates and keep handling standardized during multi-product comparisons.',
        'Avoid repeated warm-to-cold cycles when working through longer research windows.',
        'Pair storage notes with the quick-reference asset for easier repeat ordering.'
      ]
    },
    Cellular: {
      title: 'Cellular-function storage',
      shortSummary: 'Cellular and cellular-aging research products should stay cool, dry, and light-protected pre-mix, with refrigerated storage after reconstitution.',
      bullets: [
        'Use consistent labeling when comparing mitochondrial or cellular-aging compounds across several strengths.',
        'Keep mixed material cold between sessions and avoid unnecessary agitation.',
        'Document open dates for research traceability and quicker replenishment planning.'
      ]
    },
    Support: {
      title: 'Support-item handling',
      shortSummary: 'Support products still need clean storage and handling discipline so lot labels and pairing notes stay clear.',
      bullets: [
        'Keep support materials sealed, labeled, and easy to pair with the right product lot.',
        'Use storage notes to reduce handling mistakes across large order batches.',
        'Link support items back to tools and guides so researchers do not need to guess the next step.'
      ]
    },
    Performance: {
      title: 'Specialty performance storage',
      shortSummary: 'Performance and specialty items should follow the same cool, dry, light-protected storage baseline as the rest of the lineup.',
      bullets: [
        'Keep specialty items well labeled because they are often revisited less often than core catalog products.',
        'After mixing, refrigerate and minimize repeated exposure to ambient conditions.',
        'Pair niche products with clear labels and handling notes so repeat ordering stays simple.'
      ]
    }
  };

  const MIXING_PROFILES = {
    Metabolic: {
      title: 'Metabolic mixing guide',
      steps: [
        'Confirm the vial label, selected strength, and intended dilution volume before opening the vial.',
        'Add diluent slowly along the inside wall of the vial rather than spraying directly onto the lyophilized cake.',
        'Let the vial settle, then gently rotate to dissolve. Avoid shaking aggressively.'
      ]
    },
    Recovery: {
      title: 'Recovery mixing guide',
      steps: [
        'Match the product strength to the correct study label before reconstitution begins.',
        'Use measured diluent and introduce it slowly to keep the product handling gentle and repeatable.',
        'Gently swirl until mixed, then refrigerate and log the reconstitution date.'
      ]
    },
    Aesthetics: {
      title: 'Aesthetics mixing guide',
      steps: [
        'Record the compound and target volume before adding diluent so stack comparisons stay organized.',
        'Add diluent along the vial wall and allow the cake to hydrate gradually.',
        'Roll or swirl gently until dissolved and store refrigerated after mixing.'
      ]
    },
    Growth: {
      title: 'Growth-axis mixing guide',
      steps: [
        'Verify strength tier and product code first because GH-axis products often have several option ranges.',
        'Use a clean measured dilution volume and add it carefully down the vial wall.',
        'Allow the solution to clear with gentle rotation, then refrigerate and log handling details.'
      ]
    },
    Cognitive: {
      title: 'Cognitive mixing guide',
      steps: [
        'Check the compound, reconstitution volume, and lot label before beginning.',
        'Add diluent slowly with low agitation and let the vial rest briefly between motions.',
        'Refrigerate after mixing and keep labeling consistent across compounds in the same research category.'
      ]
    },
    Cellular: {
      title: 'Cellular mixing guide',
      steps: [
        'Confirm compound identity and dilution volume so mitochondrial or longevity comparisons stay traceable.',
        'Introduce diluent gently and avoid forceful shaking during dissolution.',
        'Store refrigerated after mixing and note the reconstitution date for lab records.'
      ]
    },
    Support: {
      title: 'Support-item guide',
      steps: [
        'Match the support item to the correct compound before use.',
        'Keep handling surfaces clean and document how support materials are paired with specific lots.',
        'Use the quick-reference download when building a repeatable reconstitution setup.'
      ]
    },
    Performance: {
      title: 'Specialty mixing guide',
      steps: [
        'Verify the selected product and dilution target before beginning any handling.',
        'Add diluent gradually and keep physical agitation low.',
        'Refrigerate after reconstitution and use clear labels if the product is being reviewed alongside nearby compounds.'
      ]
    }
  };

  const NON_COMPARISON_CATEGORIES = new Set(['Support']);
  const NON_COMPARISON_SLUGS = new Set(['bac-water', 'b12-10000mcg-10ml']);
  const CATEGORY_RESEARCH_CONTEXT = {
    Metabolic: 'Metabolic research may examine receptor signaling, metabolic regulation, glycemic-marker modeling, and metabolic endpoint pathways.',
    Recovery: 'Recovery research may examine repair pathways, tissue remodeling, vascular response, and inflammatory-signaling models.',
    Aesthetics: 'Aesthetics research may examine collagen-pathway signaling, pigmentation, skin remodeling, and cosmetic-pathway analysis.',
    Growth: 'Growth-axis research may examine GH-axis signaling, endocrine models, and related metabolic-pathway context.',
    Cognitive: 'Cognitive research may examine neuro-support, stress-response signaling, sleep-related pathways, and CNS-signaling models.',
    Cellular: 'Cellular research may examine mitochondrial signaling, cellular stress, antioxidant pathways, and whole-cell function.',
    Support: 'Support items are reviewed as laboratory materials used alongside storage, mixing, and broader research reference work.',
    Performance: 'Specialty research may examine narrower signaling pathways where product format and handling notes require closer review.'
  };
  const COMPARISON_THEME_RULES = [
    {
      key: 'metabolic-incretin',
      label: 'Incretin and satiety-pathway compounds',
      category: 'Metabolic',
      fragments: ['semaglutide', 'tirzepatide', 'retatrutide', 'survodutide', 'mazdutide', 'cagrilintide']
    },
    {
      key: 'metabolic-body-composition',
      label: 'Metabolic endpoint compounds',
      category: 'Metabolic',
      fragments: ['aod', '5-amino-1mq', 'slu-pp-322']
    },
    {
      key: 'recovery-repair',
      label: 'Repair-pathway compounds',
      category: 'Recovery',
      fragments: ['bpc', 'tb', 'ara-290', 'wolverine', 'thymosin-alpha-1']
    },
    {
      key: 'aesthetics-skin',
      label: 'Skin-remodeling compounds',
      category: 'Aesthetics',
      fragments: ['ghk-cu', 'kpv', 'glow', 'klow']
    },
    {
      key: 'aesthetics-pigmentation',
      label: 'Pigmentation compounds',
      category: 'Aesthetics',
      fragments: ['mt-1', 'mt-2']
    },
    {
      key: 'aesthetics-cosmetic',
      label: 'Cosmetic-support compounds',
      category: 'Aesthetics',
      fragments: ['snap-8', 'b12-blend']
    },
    {
      key: 'growth-secretagogue',
      label: 'GH-axis secretagogues',
      category: 'Growth',
      fragments: ['tesamorelin', 'cjc', 'ipamorelin', 'ghrp-6']
    },
    {
      key: 'growth-factor',
      label: 'Direct growth-signaling compounds',
      category: 'Growth',
      fragments: ['igf-1lr3', 'cjc-1295-without-dac']
    },
    {
      key: 'growth-fertility',
      label: 'Fertility-signaling compounds',
      category: 'Growth',
      fragments: ['hcg', 'hmg', 'kisspeptin']
    },
    {
      key: 'cognitive-focus',
      label: 'Focus and neuro-support compounds',
      category: 'Cognitive',
      fragments: ['semax', 'selank', 'cerebrolysin']
    },
    {
      key: 'cognitive-restoration',
      label: 'Restoration-pathway compounds',
      category: 'Cognitive',
      fragments: ['dsip', 'pinealon', 'vip', 'oxytocin']
    },
    {
      key: 'cellular-mito',
      label: 'Mitochondrial and energy compounds',
      category: 'Cellular',
      fragments: ['mots-c', 'nad', 'ss-31']
    },
    {
      key: 'cellular-longevity',
      label: 'Longevity and bioregulator compounds',
      category: 'Cellular',
      fragments: ['epithalon', 'thymalin']
    },
    {
      key: 'cellular-specialty',
      label: 'Specialty cellular compounds',
      category: 'Cellular',
      fragments: ['pnc27']
    },
    {
      key: 'performance-drive',
      label: 'Drive and specialty compounds',
      category: 'Performance',
      fragments: ['dermorphin', 'pt-141', 'lc216']
    }
  ];

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  function getSiteOrigin() {
    return SITE_ORIGIN;
  }

  function getAbsoluteUrl(path) {
    return new URL(String(path || '').replace(/^\.\//, ''), `${SITE_ORIGIN}/`).toString();
  }

  function getCatalogProducts(catalog) {
    const products = [];
    const seen = new Set();
    [...(catalog?.featured || []), ...(catalog?.products || [])].forEach((product) => {
      if (!product?.slug || seen.has(product.slug)) return;
      seen.add(product.slug);
      products.push(product);
    });
    return products;
  }

  function getProductMap(catalog) {
    return new Map(getCatalogProducts(catalog).map((product) => [product.slug, product]));
  }

  function getProductBySlug(catalog, slug) {
    return getProductMap(catalog).get(String(slug || '').trim()) || null;
  }

  function getProductUrl(slug) {
    return `products/${encodeURIComponent(slug)}.html`;
  }

  function getProductCanonicalUrl(slug) {
    return `${SITE_ORIGIN}/${getProductUrl(slug)}`;
  }

  function getProductSeoTypeLabel(product) {
    if (!product) return 'Research Product';
    return product.category === 'Support' ? 'Research Support' : 'Research Peptide';
  }

  function getCategoryDisplayLabel(category) {
    const key = String(category || '').trim();
    return CATEGORY_DISPLAY_LABELS[key] || key || 'Research';
  }

  function getProductPageTitle(product) {
    if (!product?.name) return 'Research Product | Jonezie Labs';
    return `${getProductDisplayName(product)} | Jonezie Labs`;
  }

  function getSortedPair(leftSlug, rightSlug) {
    return [String(leftSlug || '').trim(), String(rightSlug || '').trim()].filter(Boolean).sort((a, b) => a.localeCompare(b));
  }

  function getComparisonUrl(leftSlug, rightSlug) {
    const pair = getSortedPair(leftSlug, rightSlug);
    if (pair.length !== 2) return 'comparison.html';
    return `comparison.html?left=${encodeURIComponent(pair[0])}&right=${encodeURIComponent(pair[1])}`;
  }

  function getGuideForCategory(category) {
    return GUIDE_LIBRARY.find((guide) => guide.categories.includes(category)) || GUIDE_LIBRARY.find((guide) => guide.key === 'support');
  }

  function getGuideForProduct(product) {
    return getGuideForCategory(product?.category);
  }

  function getGuideUrl(guideKey) {
    return `research-guides.html#guide-${encodeURIComponent(guideKey)}`;
  }

  function getGuideUrlForProduct(product) {
    const guide = getGuideForProduct(product);
    return guide ? getGuideUrl(guide.key) : 'research-guides.html';
  }

  function getToolsUrl() {
    return 'catalog.html';
  }

  function isBlendProduct(product) {
    const slug = String(product?.slug || '').toLowerCase();
    const name = String(product?.name || '').toLowerCase();
    return slug.includes('plus') || slug.includes('stack') || name.includes('+') || name.includes('stack');
  }

  function getProductForm(product) {
    if (!product) return 'Research vial';
    if (product.slug === 'bac-water') return 'Support vial';
    if (product.slug === 'b12-10000mcg-10ml') return 'Red aqueous support vial';
    if (isBlendProduct(product)) return 'Multi-compound lyophilized vial';
    return 'Lyophilized research vial';
  }

  function getProductCompoundClass(product) {
    if (!product) return 'Research compound';
    const theme = getComparisonTheme(product);
    const blend = isBlendProduct(product);
    const fallback = blend ? `${product.category} research blend` : `${product.category} research compound`;
    if (product.slug === 'bac-water') return 'Laboratory support solution';
    if (product.slug === 'b12-10000mcg-10ml') return 'Cobalamin support material';

    switch (theme?.key) {
      case 'metabolic-incretin':
        return blend ? 'Multi-pathway incretin blend' : 'Incretin-pathway research compound';
      case 'metabolic-body-composition':
        return blend ? 'Metabolic endpoint research blend' : 'Metabolic endpoint research compound';
      case 'recovery-repair':
        return blend ? 'Repair-pathway peptide blend' : 'Repair-pathway research peptide';
      case 'aesthetics-skin':
        return blend ? 'Skin-remodeling research blend' : 'Skin-remodeling research compound';
      case 'aesthetics-pigmentation':
        return blend ? 'Pigmentation-pathway blend' : 'Pigmentation-pathway research peptide';
      case 'aesthetics-cosmetic':
        return blend ? 'Cosmetic-pathway blend' : 'Cosmetic-pathway research compound';
      case 'growth-secretagogue':
        return blend ? 'GH-axis secretagogue blend' : 'GH-axis secretagogue';
      case 'growth-factor':
        return 'Growth-signaling research compound';
      case 'growth-fertility':
        return 'Endocrine-signaling research compound';
      case 'cognitive-focus':
        return blend ? 'Neuro-support blend' : 'Neuro-support research compound';
      case 'cognitive-restoration':
        return blend ? 'Restoration-pathway blend' : 'Restoration-pathway research compound';
      case 'cellular-mito':
        return blend ? 'Mitochondrial research blend' : 'Mitochondrial-function research compound';
      case 'cellular-longevity':
        return blend ? 'Bioregulator blend' : 'Bioregulator research compound';
      case 'cellular-specialty':
        return 'Specialty cellular research compound';
      case 'performance-drive':
        return blend ? 'Specialty signaling blend' : 'Specialty signaling research compound';
      default:
        return fallback;
    }
  }

  function getProductStructureNote(product) {
    if (!product) return 'Cataloged as a research vial.';
    if (product.slug === 'bac-water') return 'Cataloged as a support solution used alongside storage, mixing, and broader laboratory reference work.';
    if (product.slug === 'b12-10000mcg-10ml') return 'Cataloged as a red aqueous cobalamin support vial for methylation, red-cell, and neurologic-function research reference.';
    if (isBlendProduct(product)) return 'Listed as a multi-compound blend with multiple active entries in one vial.';
    const theme = getComparisonTheme(product);
    if (theme?.label) return `Listed as a single-compound vial inside the ${theme.label.toLowerCase()} research category.`;
    return `Listed as a single-compound vial inside the ${String(product.category || 'research').toLowerCase()} research category.`;
  }

  function getProductResearchContext(product, productContent) {
    if (productContent?.researchSummary) return productContent.researchSummary;
    if (productContent?.shortDescription) return productContent.shortDescription;
    return CATEGORY_RESEARCH_CONTEXT[product?.category] || 'Reviewed for laboratory comparison and handling reference work.';
  }

  function getProductDisplaySummary(product, productContent = null) {
    if (productContent?.shortDescription) return productContent.shortDescription;
    const name = product?.name || 'This listing';
    switch (product?.category) {
      case 'Metabolic':
        return `${name} is listed for laboratory research into receptor signaling, glucose-homeostasis markers, energy-balance endpoints, and related metabolic pathway models.`;
      case 'Recovery':
        return `${name} is listed for laboratory research into repair pathways, tissue-remodeling models, vascular response, and inflammatory-signaling context.`;
      case 'Aesthetics':
        return `${name} is listed for laboratory research into collagen-pathway signaling, skin-model biology, pigmentation, and cosmetic-pathway analysis.`;
      case 'Growth':
        return `${name} is listed for laboratory research into GH-axis signaling, endocrine models, and related metabolic-pathway context.`;
      case 'Cognitive':
        return `${name} is listed for laboratory research into neuroregulation, stress-response signaling, sleep-related pathways, and CNS-signaling models.`;
      case 'Cellular':
        return `${name} is listed for laboratory research into mitochondrial signaling, cellular stress, antioxidant pathways, and whole-cell function.`;
      case 'Support':
        return `${name} is listed as a laboratory support material for storage, preparation, handling, and analytical reference workflows.`;
      case 'Performance':
        return `${name} is listed for laboratory research into specialty signaling pathways, product format, and handling context.`;
      default:
        return product?.description || 'Reviewed for laboratory comparison and handling reference work.';
    }
  }

  function getProductDisplayName(product) {
    if (product?.slug === 'bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg') return 'GLOW';
    return product?.name || '';
  }

  function getProductHandlingNote(product) {
    const profile = getMixingProfile(product);
    const steps = Array.isArray(profile?.steps) ? profile.steps.slice(0, 2) : [];
    if (!steps.length) return 'Confirm the vial label before handling and keep mixing gentle and well documented.';
    return steps.join(' ');
  }

  function getProductComparisonSummary(product, productContent) {
    const themeLabel = getComparisonThemeLabel(product);
    const context = getProductResearchContext(product, productContent);
    return `${themeLabel} with handling and pricing details kept close for faster side-by-side review. ${context}`;
  }

  function getProductMetaDescription(product, productContent = null) {
    if (!product?.name) {
      return 'Browse Jonezie Labs research products for current strengths, formats, pricing, and test reports.';
    }
    const strengths = getOptionStrengthList(product).join(', ');
    return `${getProductDisplayName(product)} at Jonezie Labs. View ${strengths || 'available strengths'}, pack formats, pricing, and available test documentation. For laboratory research only.`;
  }

  function getRelatedToolSet(product) {
    return [];
  }

  function getProductInfoProfile(product, productContent = null, catalog = null) {
    const guide = getGuideForProduct(product);
    const storageProfile = getStorageProfile(product);
    const mixingProfile = getMixingProfile(product);
    const relatedCompounds = catalog ? getRelatedProducts(product, catalog, 4) : [];
    const comparisonCandidates = catalog ? getComparisonCandidates(product, catalog, 3) : [];
    const strengths = getOptionStrengthList(product);
    return {
      name: product?.name || 'Research compound',
      shortDescription: getProductDisplaySummary(product, productContent),
      researchContext: getProductResearchContext(product, productContent),
      compoundClass: getProductCompoundClass(product),
      researchCategory: getCategoryDisplayLabel(product?.category),
      form: getProductForm(product),
      storageNote: storageProfile.shortSummary,
      handlingNote: getProductHandlingNote(product),
      structureNote: getProductStructureNote(product),
      comparisonSummary: getProductComparisonSummary(product, productContent),
      strengths,
      guide,
      storageProfile,
      mixingProfile,
      relatedCompounds,
      comparisonCandidates,
      relatedTools: getRelatedToolSet(product),
      ruoDisclaimer: RUO_COPY.full
    };
  }

  function getStorageProfile(product) {
    return STORAGE_PROFILES[product?.category] || STORAGE_PROFILES.Support;
  }

  function getMixingProfile(product) {
    return MIXING_PROFILES[product?.category] || MIXING_PROFILES.Support;
  }

  function getOptionStrengthList(product) {
    return (product?.options || []).map((option) => option.mgOption).filter(Boolean);
  }

  function parsePrice(value) {
    if (value == null || value === '') return null;
    const numeric = Number.parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
  }

  function formatMoney(value) {
    if (!Number.isFinite(value)) return 'Pending';
    return `$${value.toFixed(2)}`;
  }

  function getStartingPrice(product) {
    const option = product?.options?.[0];
    return parsePrice(product?.startingPriceSingle || option?.singleVialPrice || option?.eightVialPrice || option?.tenVialPrice);
  }

  function getGuideProductList(guideKey, catalog, limit = 6) {
    const guide = GUIDE_LIBRARY.find((entry) => entry.key === guideKey);
    if (!guide) return [];
    return getCatalogProducts(catalog)
      .filter((product) => guide.categories.includes(product.category))
      .sort((left, right) => {
        const leftPrice = getStartingPrice(left) || Number.POSITIVE_INFINITY;
        const rightPrice = getStartingPrice(right) || Number.POSITIVE_INFINITY;
        return leftPrice - rightPrice || left.name.localeCompare(right.name);
      })
      .slice(0, limit);
  }

  function isComparisonEligible(product) {
    if (!product?.slug) return false;
    if (NON_COMPARISON_SLUGS.has(product.slug)) return false;
    if (NON_COMPARISON_CATEGORIES.has(product.category)) return false;
    return true;
  }

  function getComparisonTheme(product) {
    if (!isComparisonEligible(product)) return null;
    const slug = String(product.slug || '').toLowerCase();
    return COMPARISON_THEME_RULES.find((rule) => (
      rule.category === product.category
      && rule.fragments.some((fragment) => slug.includes(fragment))
    )) || null;
  }

  function getComparisonThemeLabel(product) {
    const theme = getComparisonTheme(product);
    if (theme?.label) return theme.label;
    return `${product?.category || 'Research'} research category compounds`;
  }

  function scoreProductRelationship(sourceProduct, candidate) {
    if (!sourceProduct || !candidate || sourceProduct.slug === candidate.slug) return -1;
    let score = 0;
    if (sourceProduct.category === candidate.category) score += 6;
    const sourceName = String(sourceProduct.name || '').toLowerCase();
    const candidateName = String(candidate.name || '').toLowerCase();
    const sourceWords = sourceName.split(/[^a-z0-9]+/).filter(Boolean);
    const candidateWords = candidateName.split(/[^a-z0-9]+/).filter(Boolean);
    sourceWords.forEach((word) => {
      if (word.length > 2 && candidateWords.includes(word)) score += 2;
    });
    const sourceGuide = getGuideForProduct(sourceProduct);
    const candidateGuide = getGuideForProduct(candidate);
    if (sourceGuide && candidateGuide && sourceGuide.key === candidateGuide.key) score += 2;
    const sourceStrengths = getOptionStrengthList(sourceProduct).length;
    const candidateStrengths = getOptionStrengthList(candidate).length;
    if (Math.abs(sourceStrengths - candidateStrengths) <= 1) score += 1;
    return score;
  }

  function scoreComparisonRelationship(sourceProduct, candidate) {
    if (!isComparisonEligible(sourceProduct) || !isComparisonEligible(candidate)) return -1;
    if (sourceProduct.slug === candidate.slug) return -1;
    if (sourceProduct.category !== candidate.category) return -1;

    const sourceTheme = getComparisonTheme(sourceProduct);
    const candidateTheme = getComparisonTheme(candidate);
    if (sourceTheme && candidateTheme && sourceTheme.key !== candidateTheme.key) return -1;

    let score = 8;
    if (sourceTheme && candidateTheme && sourceTheme.key === candidateTheme.key) score += 4;

    const sourceGuide = getGuideForProduct(sourceProduct);
    const candidateGuide = getGuideForProduct(candidate);
    if (sourceGuide && candidateGuide && sourceGuide.key === candidateGuide.key) score += 2;

    const sourceWords = String(sourceProduct.name || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const candidateWords = String(candidate.name || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
    const overlappingWords = sourceWords.filter((word) => word.length > 2 && candidateWords.includes(word));
    score += Math.min(overlappingWords.length, 3);

    const sourceStrengths = getOptionStrengthList(sourceProduct).length;
    const candidateStrengths = getOptionStrengthList(candidate).length;
    if (Math.abs(sourceStrengths - candidateStrengths) <= 1) score += 1;

    const sourcePrice = getStartingPrice(sourceProduct);
    const candidatePrice = getStartingPrice(candidate);
    if (Number.isFinite(sourcePrice) && Number.isFinite(candidatePrice)) {
      const ratio = Math.max(sourcePrice, candidatePrice) / Math.max(Math.min(sourcePrice, candidatePrice), 1);
      if (ratio <= 2.5) score += 1;
    }

    return score;
  }

  function areProductsComparable(leftProduct, rightProduct) {
    return scoreComparisonRelationship(leftProduct, rightProduct) >= 10;
  }

  function getRelatedProducts(product, catalog, limit = 4) {
    return getCatalogProducts(catalog)
      .filter((candidate) => candidate.slug !== product?.slug)
      .map((candidate) => ({ product: candidate, score: scoreProductRelationship(product, candidate) }))
      .filter((entry) => entry.score >= 2)
      .sort((left, right) => right.score - left.score || left.product.name.localeCompare(right.product.name))
      .slice(0, limit)
      .map((entry) => entry.product);
  }

  function getComparisonCandidates(product, catalog, limit = 3) {
    if (!isComparisonEligible(product)) return [];
    return getCatalogProducts(catalog)
      .filter((candidate) => candidate.slug !== product?.slug)
      .map((candidate) => ({ product: candidate, score: scoreComparisonRelationship(product, candidate) }))
      .filter((entry) => entry.score >= 10)
      .sort((left, right) => right.score - left.score || left.product.name.localeCompare(right.product.name))
      .slice(0, limit)
      .map((entry) => entry.product);
  }

  function getComparisonPairs(catalog, limit = 18) {
    const products = getCatalogProducts(catalog).filter(isComparisonEligible);
    const pairs = [];
    const seen = new Set();

    products.forEach((product) => {
      getComparisonCandidates(product, catalog, 3).forEach((candidate) => {
        const pair = getSortedPair(product.slug, candidate.slug);
        const key = pair.join('::');
        if (pair.length !== 2 || seen.has(key)) return;
        seen.add(key);
        pairs.push({
          left: getProductBySlug(catalog, pair[0]),
          right: getProductBySlug(catalog, pair[1])
        });
      });
    });

    return pairs
      .filter((pair) => pair.left && pair.right)
      .sort((left, right) => {
        const leftScore = (getStartingPrice(left.left) || 0) + (getStartingPrice(left.right) || 0);
        const rightScore = (getStartingPrice(right.left) || 0) + (getStartingPrice(right.right) || 0);
        return leftScore - rightScore || left.left.name.localeCompare(right.left.name);
      })
      .slice(0, limit);
  }

  function getProductFaqs(product, productContent) {
    const profile = getProductInfoProfile(product, productContent);
    const strengths = profile.strengths.join(', ') || 'Current options are shown in the product selector.';

    return [
      {
        question: `What is ${product.name} usually researched for?`,
        answer: profile.researchContext
      },
      {
        question: `How should ${product.name} be stored during research handling?`,
        answer: profile.storageNote
      },
      {
        question: `Which ${product.name} strengths are available on Jonezie Labs?`,
        answer: `${product.name} is currently listed with the following options: ${strengths}.`
      },
      {
        question: `Where should I go next after reviewing ${product.name}?`,
        answer: `Use the related comparisons, ${profile.guide?.title.toLowerCase() || 'research guide'}, and product pages to review current strengths, formats, and available documentation.`
      }
    ];
  }

  function getComparisonFaqs(leftProduct, rightProduct) {
    const leftProfile = getProductInfoProfile(leftProduct);
    const rightProfile = getProductInfoProfile(rightProduct);
    const comparisonTheme = getComparisonThemeLabel(leftProduct);
    return [
      {
        question: `Why compare ${leftProduct.name} and ${rightProduct.name} on the same page?`,
        answer: `Putting ${leftProduct.name} and ${rightProduct.name} side by side helps researchers compare ${comparisonTheme.toLowerCase()}, current strengths, handling notes, and price entry points in one focused read.`
      },
      {
        question: `Are ${leftProduct.name} and ${rightProduct.name} in the same research category?`,
        answer: leftProduct.category === rightProduct.category
          ? `Yes. Both products sit in the ${leftProduct.category.toLowerCase()} research category and are grouped here because they speak to closely related research goals.`
          : `They touch adjacent themes, but they do not sit in the same primary category: ${leftProduct.category} and ${rightProduct.category}.`
      },
      {
        question: `What should I review after this comparison?`,
        answer: `Move from this read into the linked product pages, the ${leftProfile.guide?.title.toLowerCase() || 'matching research guide'}, and the related tools to compare structure notes, storage discipline, and nearby compounds in the same research category.`
      },
      {
        question: `What does this page avoid on purpose?`,
        answer: `${leftProduct.name} and ${rightProduct.name} are presented for laboratory, analytical, and catalog-reference work only. The comparison does not include human-use instructions, dosing guidance, or outcome claims.`
      }
    ];
  }

  function getLeadMagnetMailto(details) {
    const payload = [
      `Lead source: ${details.source || 'Site capture'}`,
      `Trigger: ${details.trigger || 'Manual'}`,
      `Email: ${details.email || ''}`,
      `Phone: ${details.phone || ''}`,
      `Interest: ${details.interest || ''}`,
      `Page: ${details.page || window.location.href}`
    ].join('\n');
    return `mailto:customerservice@jonezielabs.com?subject=${encodeURIComponent('Jonezie Labs lead capture signup')}&body=${encodeURIComponent(payload)}`;
  }

  function getLeadCaptureEndpoint() {
    return LEAD_CAPTURE.endpoint;
  }

  function isLocalPreview() {
    const host = window.location.hostname || '';
    return host === '127.0.0.1' || host === 'localhost';
  }

  async function submitLeadCapture(details) {
    const endpoint = getLeadCaptureEndpoint();
    if (!endpoint) {
      return isLocalPreview()
        ? { ok: true, mode: 'local-preview' }
        : { ok: false, reason: 'missing-endpoint' };
    }

      const payload = {
        capturedAt: new Date().toISOString(),
        name: String(details.name || '').trim(),
        email: String(details.email || '').trim(),
        phone: String(details.phone || '').trim(),
        source: String(details.source || 'Site capture').trim(),
        trigger: String(details.trigger || 'Manual').trim(),
        welcomeCode: String(details.welcomeCode || '').trim(),
        welcomeDiscountRate: details.welcomeDiscountRate || '',
        welcomeCodeStatus: String(details.welcomeCodeStatus || '').trim(),
        page: String(details.page || window.location.href).trim(),
      referrer: String(document.referrer || '').trim(),
      timezone: String(Intl.DateTimeFormat().resolvedOptions().timeZone || '').trim(),
      locale: String(navigator.language || '').trim(),
      userAgent: String(navigator.userAgent || '').trim()
    };

    try {
      await fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-store',
        credentials: 'omit',
        keepalive: true,
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      });
      return { ok: true, mode: 'remote' };
    } catch (error) {
      console.error('Lead capture submission failed.', error);
      return { ok: false, reason: 'network-error' };
    }
  }

  function enhanceCustomSelects(root = document) {
    if (!root?.querySelectorAll) return;
    bindCustomSelectEvents();
    root.querySelectorAll('.comparison-select-form select, .tool-form select, .lead-capture-form select').forEach((select) => {
      if (!(select instanceof HTMLSelectElement)) return;
      upsertCustomSelect(select);
    });
  }

  function upsertCustomSelect(select) {
    let shell = select.closest('.custom-select-shell');
    if (!shell) {
      shell = document.createElement('div');
      shell.className = 'custom-select-shell';
      select.parentNode?.insertBefore(shell, select);
      shell.appendChild(select);

      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'custom-select-trigger';
      trigger.setAttribute('aria-haspopup', 'listbox');
      trigger.innerHTML = `
        <span class="custom-select-value"></span>
        <span class="custom-select-icon" aria-hidden="true"></span>`;

      const panel = document.createElement('div');
      panel.className = 'custom-select-panel';
      panel.hidden = true;

      const list = document.createElement('div');
      list.className = 'custom-select-list';
      list.setAttribute('role', 'listbox');
      panel.appendChild(list);

      shell.appendChild(trigger);
      shell.appendChild(panel);

      trigger.addEventListener('click', () => {
        if (shell.classList.contains('is-open')) {
          closeCustomSelect(shell);
          return;
        }
        openCustomSelect(shell);
      });

      trigger.addEventListener('keydown', (event) => {
        if (!['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) return;
        event.preventDefault();
        openCustomSelect(shell);
        focusCustomOption(shell, event.key === 'ArrowUp' ? 'last' : 'selected');
      });

      select.addEventListener('change', () => syncCustomSelectState(select));
    }

    select.classList.add('custom-select-native');
    syncCustomSelectState(select);
  }

  function syncCustomSelectState(select) {
    const shell = select.closest('.custom-select-shell');
    if (!shell) return;

    const trigger = shell.querySelector('.custom-select-trigger');
    const triggerValue = shell.querySelector('.custom-select-value');
    const panel = shell.querySelector('.custom-select-panel');
    const list = shell.querySelector('.custom-select-list');
    if (!trigger || !triggerValue || !panel || !list) return;

    const selectedOption = select.selectedOptions?.[0] || select.options[select.selectedIndex] || null;
    const fallbackOption = Array.from(select.options).find((option) => !option.disabled) || null;
    const currentOption = selectedOption || fallbackOption;
    const isPlaceholder = !select.value;

    triggerValue.textContent = currentOption?.textContent?.trim() || 'Choose an option';
    trigger.classList.toggle('is-placeholder', isPlaceholder);
    trigger.disabled = select.disabled;
    trigger.setAttribute('aria-expanded', shell.classList.contains('is-open') ? 'true' : 'false');

    list.innerHTML = Array.from(select.options).map((option) => {
      const isSelected = option.value === select.value;
      const isDisabled = option.disabled || (option.value === '' && select.required);
      return `
        <button
          type="button"
          class="custom-select-option${isSelected ? ' is-selected' : ''}${isDisabled ? ' is-disabled' : ''}"
          role="option"
          aria-selected="${isSelected ? 'true' : 'false'}"
          data-value="${escapeHtml(option.value)}"
          ${isDisabled ? 'disabled' : ''}
        >${escapeHtml(option.textContent || '')}</button>`;
    }).join('');

    list.querySelectorAll('.custom-select-option').forEach((button) => {
      button.addEventListener('click', () => {
        const nextValue = button.getAttribute('data-value') || '';
        select.value = nextValue;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        closeCustomSelect(shell);
        trigger.focus();
      });

      button.addEventListener('keydown', (event) => {
        const options = getCustomOptions(shell);
        const currentIndex = options.indexOf(button);
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          options[(currentIndex + 1) % options.length]?.focus();
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          options[(currentIndex - 1 + options.length) % options.length]?.focus();
        } else if (event.key === 'Home') {
          event.preventDefault();
          options[0]?.focus();
        } else if (event.key === 'End') {
          event.preventDefault();
          options[options.length - 1]?.focus();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          closeCustomSelect(shell);
          trigger.focus();
        }
      });
    });
  }

  function openCustomSelect(shell) {
    document.querySelectorAll('.custom-select-shell.is-open').forEach((node) => {
      if (node !== shell) closeCustomSelect(node);
    });
    const panel = shell.querySelector('.custom-select-panel');
    const trigger = shell.querySelector('.custom-select-trigger');
    if (!panel || !trigger) return;
    shell.classList.add('is-open');
    panel.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }

  function closeCustomSelect(shell) {
    const panel = shell.querySelector('.custom-select-panel');
    const trigger = shell.querySelector('.custom-select-trigger');
    if (!panel || !trigger) return;
    shell.classList.remove('is-open');
    panel.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  function focusCustomOption(shell, mode = 'selected') {
    const options = getCustomOptions(shell);
    if (!options.length) return;
    if (mode === 'last') {
      options[options.length - 1].focus();
      return;
    }
    const selected = shell.querySelector('.custom-select-option.is-selected:not(:disabled)');
    (selected || options[0]).focus();
  }

  function getCustomOptions(shell) {
    return Array.from(shell.querySelectorAll('.custom-select-option:not(:disabled)'));
  }

  function bindCustomSelectEvents() {
    if (document.body.dataset.customSelectBound === 'true') return;
    document.body.dataset.customSelectBound = 'true';

    document.addEventListener('click', (event) => {
      document.querySelectorAll('.custom-select-shell.is-open').forEach((shell) => {
        if (!shell.contains(event.target)) closeCustomSelect(shell);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      document.querySelectorAll('.custom-select-shell.is-open').forEach((shell) => closeCustomSelect(shell));
    });
  }

  function initShellMenus() {
    const menuToggle = document.querySelector('.menu-toggle');
    const siteNav = document.querySelector('.site-nav');
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

  return {
    SITE_ORIGIN,
    RESOURCE_DOWNLOAD,
    RUO_COPY,
    TOOL_LIBRARY,
    GUIDE_LIBRARY,
    escapeHtml,
    slugify,
    parsePrice,
    formatMoney,
    getSiteOrigin,
    getAbsoluteUrl,
    getCatalogProducts,
    getProductMap,
    getProductBySlug,
    getProductUrl,
    getProductCanonicalUrl,
    getCategoryDisplayLabel,
    getProductPageTitle,
    getProductMetaDescription,
    getComparisonUrl,
    getGuideForCategory,
    getGuideForProduct,
    getGuideUrl,
    getGuideUrlForProduct,
    getGuideProductList,
    getToolsUrl,
    getStorageProfile,
    getMixingProfile,
    getProductForm,
    getProductCompoundClass,
    getProductDisplaySummary,
    getProductDisplayName,
    getCoaImageForSlug,
    getProductStructureNote,
    getProductResearchContext,
    getProductHandlingNote,
    getProductComparisonSummary,
    getRelatedToolSet,
    getProductInfoProfile,
    getOptionStrengthList,
    getStartingPrice,
    getRelatedProducts,
    isComparisonEligible,
    areProductsComparable,
    getComparisonThemeLabel,
    getComparisonCandidates,
    getComparisonPairs,
    getProductFaqs,
    getComparisonFaqs,
    getLeadCaptureEndpoint,
    submitLeadCapture,
    getLeadMagnetMailto,
    enhanceCustomSelects,
    initShellMenus
  };
})();

(() => {
  const PRODUCT_ROWS = [
    ['MT-1', '5mg', 25.875, 180.72, 214.2],
    ['MT-2 (Melanotan 2 Acetate)', '10mg', 25.875, 180.72, 214.2],
    ['PT-141', '10mg', 28.75, 200.8, 238],
    ['Selank', '5mg', 25.875, 180.72, 214.2],
    ['Selank', '10mg', 31.625, 220.88, 261.8],
    ['Oxytocin Acetate', '2mg', 17.25, 120.48, 142.8],
    ['Epithalon', '10mg', 25.875, 180.72, 214.2],
    ['Epithalon', '50mg', 63.25, 441.76, 523.6],
    ['BPC157', '5mg', 23, 160.64, 190.4],
    ['BPC157', '10mg', 37.375, 261.04, 309.4],
    ['WOLVERINE (BPC 5mg + TB 5mg)', '10mg', 46, 321.28, 380.8],
    ['WOLVERINE (BPC 10mg + TB 10mg)', '20mg', 77.625, 542.16, 642.6],
    ['Semax', '5mg', 23, 160.64, 190.4],
    ['Semax', '10mg', 25.875, 180.72, 214.2],
    ['Semaglutide', '5mg', 23, 160.64, 190.4],
    ['Semaglutide', '10mg', 28.75, 200.8, 238],
    ['Semaglutide', '15mg', 34.5, 240.96, 285.6],
    ['Semaglutide', '20mg', 43.125, 301.2, 357],
    ['Semaglutide', '30mg', 54.625, 381.52, 452.2],
    ['SS-31', '10mg', 40.25, 281.12, 333.2],
    ['SS-31', '50mg', 166.75, 1164.64, 1380.4],
    ['Tirzepatide', '5mg', 23, 160.64, 190.4],
    ['Tirzepatide', '10mg', 28.75, 200.8, 238],
    ['Tirzepatide', '15mg', 37.375, 261.04, 309.4],
    ['Tirzepatide', '20mg', 46, 321.28, 380.8],
    ['Tirzepatide', '30mg', 54.625, 381.52, 452.2],
    ['Tirzepatide', '40mg', 69, 481.92, 571.2],
    ['Tirzepatide', '50mg', 83.375, 582.32, 690.2],
    ['CJC-1295 Without DAC', '5mg', 37.375, 261.04, 309.4],
    ['CJC-1295 Without DAC', '10mg', 63.25, 441.76, 523.6],
    ['HCG', '5000iu', 43.125, 301.2, 357],
    ['HCG', '10000iu/10vials', 77.625, 542.16, 642.6],
    ['AOD', '5mg', 51.75, 361.44, 428.4],
    ['Tesamorelin', '5mg', 46, 321.28, 380.8],
    ['Tesamorelin', '10mg', 83.375, 582.32, 690.2],
    ['Tesamorelin', '15mg', 115, 803.2, 952],
    ['GHK-CU', '50mg', 20.125, 140.56, 166.6],
    ['GHK-CU', '100mg', 28.75, 200.8, 238],
    ['KissPeptin-10', '5mg', 28.75, 200.8, 238],
    ['KissPeptin-10', '10mg', 46, 321.28, 380.8],
    ['MOTS-c', '10mg', 31.625, 220.88, 261.8],
    ['KPV', '10mg', 31.625, 220.88, 261.8],
    ['MOTS-c', '40mg', 86.25, 602.4, 714],
    ['Retatrutide', '10mg', 48.875, 341.36, 404.6],
    ['Retatrutide', '15mg', 66.125, 461.84, 547.4],
    ['Retatrutide', '20mg', 83.375, 582.32, 690.2],
    ['Retatrutide', '30mg', 115, 803.2, 952],
    ['Dermorphin', '5mg', 28.75, 200.8, 238],
    ['Glutathione', '600mg', 23, 160.64, 190.4],
    ['Glutathione', '1200mg', 31.625, 220.88, 261.8],
    ['Glutathione', '1500mg', 34.5, 240.96, 285.6],
    ['BAC Water', '10ml/10vials', 8.625, 60.24, 71.4],
    ['B12 10000mcg 10ml', '3000 MCG / 3 mL', 17, 136, 170],
    ['B12 10000mcg 10ml', '10,000mcg / 10ml', 18.80342, 150.42735, 188.03419],
    ['Cagrilintide2.5mg+Semaglutide2.5mg', '5mg', 46, 321.28, 380.8],
    ['Cagrilintide5mg+Semaglutide5mg', '10mg', 77.625, 542.16, 642.6],
    ['HMG', '75iu', 34.5, 240.96, 285.6],
    ['cerebrolysin', '60mg', 31.625, 220.88, 261.8],
    ['Cagrilintide', '5mg', 63.25, 441.76, 523.6],
    ['Cagrilintide', '10mg', 92, 642.56, 761.6],
    ['Ara-290', '10mg', 31.625, 220.88, 261.8],
    ['SNAP-8', '10mg', 23, 160.64, 190.4],
    ['Pinealon', '5mg', 23, 160.64, 190.4],
    ['Pinealon', '10mg', 31.625, 220.88, 261.8],
    ['Pinealon', '20mg', 46, 321.28, 380.8],
    ['PNC27', '5mg', 46, 321.28, 380.8],
    ['PNC27', '10mg', 74.75, 522.08, 618.8],
    ['KLOW (GHK-CU50+TB10+BC10+KPV10)', '80mg', 109.25, 763.04, 904.4],
    ['TB500', '10mg', 63.25, 441.76, 523.6],
    ['TB500', '5mg', 34.5, 240.96, 285.6],
    ['Ipamorelin', '5mg', 23, 160.64, 190.4],
    ['Ipamorelin', '10mg', 37.375, 261.04, 309.4],
    ['NAD', '100mg', 23, 160.64, 190.4],
    ['NAD', '500mg', 34.5, 240.96, 285.6],
    ['NAD', '1000mg', 69, 481.92, 571.2],
    ['GLOW STACK (BPC 157 10mg+GHK-CU 50mg+TB500 10mg)', '70mg', 86.25, 602.4, 714],
    ['Survodutide', '10mg', 135.125, 943.76, 1118.6],
    ['SLU-PP-322', '5mg', 57.5, 401.6, 476],
    ['IGF-1LR3', '0.1mg', 20.125, 140.56, 166.6],
    ['IGF-1LR3', '1mg', 97.75, 682.72, 809.2],
    ['VIP', '5mg', 40.25, 281.12, 333.2],
    ['VIP', '10mg', 69, 481.92, 571.2],
    ['GHRP-6 Acetate', '5mg', 14.375, 100.4, 119],
    ['GHRP-6 Acetate', '10mg', 24.15, 168.672, 199.92],
    ['Mazdutide', '10mg', 92, 642.56, 761.6],
    ['Thymalin', '10mg', 28.75, 200.8, 238],
    ['DSIP', '5mg', 23, 160.64, 190.4],
    ['DSIP', '15mg', 46, 321.28, 380.8],
    ['Thymosin Alpha-1', '5mg', 43.125, 301.2, 357],
    ['Thymosin Alpha-1', '10mg', 77.625, 542.16, 642.6],
    ['LC216', '10mg', 31.625, 220.88, 261.8]
  ];

  const EXTRA_PRODUCTS = [
    {
      name: '5-Amino-1MQ',
      sourceName: '5-amino-1mq',
      slug: '5-amino-1mq',
      category: 'Metabolic',
      description: '5-Amino-1MQ is an active metabolic listing at Jonezie. A small-molecule NNMT inhibitor for adipose-tissue, glucose-handling, hepatic lipid, and cellular-energy research workflows.',
      startingPriceSingle: '$23.00',
      startingPrice8: '$160.64',
      startingPrice10: '$190.40',
      image: 'assets/products/20261022/5-amino-1mq.webp',
      options: [
        {
          code: '5AM5',
          specification: '5mg*10vials',
          mgOption: '5mg',
          singleVialPrice: '$23.00',
          eightVialPrice: '$160.64',
          tenVialPrice: '$190.40'
        },
        {
          code: '5AM10',
          specification: '10mg*10vials',
          mgOption: '10mg',
          singleVialPrice: '$35.00',
          eightVialPrice: '$244.45',
          tenVialPrice: '$289.74'
        }
      ]
    }
  ];

  const FEATURED_SLUGS = ['bpc-157', 'ghk-cu', 'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg', 'mots-c', 'retatrutide', 'semaglutide', 'tirzepatide', 'b12-10000mcg-10ml', '5-amino-1mq', 'kpv', 'cjc-1295-without-dac'];
  const BACKORDER_NOTES = {};
  const PRODUCT_PRICE_MULTIPLIER = 1.17;

  // Amino Club regular single-vial prices checked 2026-10-09. Increases are halved.
  // Only include an exact compound/blend and strength with a verified regular price.
  const AMINO_CLUB_REGULAR_PRICES = {
    'MT-2 (Melanotan 2 Acetate)|10mg': 29.95,
    'PT-141|10mg': 29.99,
    'Selank|10mg': 29.95,
    'Epithalon|10mg': 29.99,
    'BPC157|10mg': 39.99,
    'WOLVERINE (BPC 5mg + TB 5mg)|10mg': 79.99,
    'WOLVERINE (BPC 10mg + TB 10mg)|20mg': 149.99,
    'Semax|10mg': 29.95,
    'AOD|5mg': 49.99,
    'Tesamorelin|10mg': 69.99,
    'GHK-CU|50mg': 29.99,
    'KissPeptin-10|10mg': 49.99,
    'MOTS-c|10mg': 39.99,
    'KPV|10mg': 39.99,
    'Retatrutide|10mg': 69.99,
    'Retatrutide|20mg': 134.99,
    'Glutathione|1500mg': 59.99,
    'Cagrilintide|10mg': 69.99,
    'Ara-290|10mg': 49.99,
    'SNAP-8|10mg': 29.99,
    'Pinealon|10mg': 49.99,
    'KLOW (GHK-CU50+TB10+BC10+KPV10)|80mg': 99.99,
    'TB500|10mg': 39.99,
    'Ipamorelin|10mg': 49.99,
    'NAD|500mg': 69.99,
    'GLOW STACK (BPC 157 10mg+GHK-CU 50mg+TB500 10mg)|70mg': 89.99,
    'IGF-1LR3|1mg': 69.99,
    'VIP|10mg': 49.99,
    'DSIP|5mg': 29.99,
    'Thymosin Alpha-1|10mg': 39.99
  };
  const SINGLE_PRICE_OVERRIDES = {
    'B12 10000mcg 10ml|3000 MCG / 3 mL': 17,
    'Retatrutide|20mg': 107
  };

  const NAME_OVERRIDES = {
    bpc157: 'BPC-157',
    'mt-1': 'MT-1 (Melanotan 1)',
    'wolverine (bpc 5mg + tb 5mg)': 'Wolverine (BPC 5mg + TB 5mg)',
    'wolverine (bpc 10mg + tb 10mg)': 'Wolverine (BPC 10mg + TB 10mg)',
    'cagrilintide2.5mg+semaglutide2.5mg': 'Cagrilintide 2.5mg + Semaglutide 2.5mg',
    'cagrilintide5mg+semaglutide5mg': 'Cagrilintide 5mg + Semaglutide 5mg',
    'kisspeptin-10': 'Kisspeptin-10',
    cerebrolysin: 'Cerebrolysin',
    'klow (ghk-cu50+tb10+bc10+kpv10)': 'KLOW',
    'glow stack (bpc 157 10mg+ghk-cu 50mg+tb500 10mg)': 'GLOW Stack (BPC 157 10mg + GHK-CU 50mg + TB500 10mg)',
    'b12 10000mcg 10ml': 'B12',
    retatrutide: 'GLP-3(RT)'
  };

  const SLUG_OVERRIDES = {
    bpc157: 'bpc-157',
    'mt-1': 'mt-1',
    'mt-2 (melanotan 2 acetate)': 'mt-2',
    'wolverine (bpc 5mg + tb 5mg)': 'bpc-5mg-plus-tb-5mg',
    'wolverine (bpc 10mg + tb 10mg)': 'bpc-10mg-plus-tb-10mg',
    'cagrilintide2.5mg+semaglutide2.5mg': 'cagrilintide-2-5mg-plus-semaglutide-2-5mg',
    'cagrilintide5mg+semaglutide5mg': 'cagrilintide-5mg-plus-semaglutide-5mg',
    'klow (ghk-cu50+tb10+bc10+kpv10)': 'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg',
    'glow stack (bpc 157 10mg+ghk-cu 50mg+tb500 10mg)': 'bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg',
    'cjc-1295 without dac': 'cjc-1295-without-dac',
    'ghrp-6 acetate': 'ghrp-6-acetate',
    'kisspeptin-10': 'kisspeptin-10',
    'mots-c': 'mots-c',
    'ss-31': 'ss-31',
    'igf-1lr3': 'igf-1lr3',
    'b12 10000mcg 10ml': 'b12-10000mcg-10ml',
    retatrutide: 'retatrutide'
  };

  const CATEGORY_OVERRIDES = {
    'mt-1': 'Aesthetics',
    'mt-2 (melanotan 2 acetate)': 'Aesthetics',
    'pt-141': 'Performance',
    selank: 'Cognitive',
    'oxytocin acetate': 'Cognitive',
    epithalon: 'Cellular',
    bpc157: 'Recovery',
    'wolverine (bpc 5mg + tb 5mg)': 'Recovery',
    'wolverine (bpc 10mg + tb 10mg)': 'Recovery',
    semax: 'Cognitive',
    semaglutide: 'Metabolic',
    'ss-31': 'Cellular',
    tirzepatide: 'Metabolic',
    'cjc-1295 without dac': 'Growth',
    hcg: 'Growth',
    aod: 'Metabolic',
    tesamorelin: 'Growth',
    'ghk-cu': 'Aesthetics',
    'kpv': 'Aesthetics',
    'kisspeptin-10': 'Performance',
    'mots-c': 'Cellular',
    retatrutide: 'Metabolic',
    dermorphin: 'Performance',
    glutathione: 'Support',
    'bac water': 'Support',
    'cagrilintide2.5mg+semaglutide2.5mg': 'Metabolic',
    'cagrilintide5mg+semaglutide5mg': 'Metabolic',
    hmg: 'Growth',
    cerebrolysin: 'Cognitive',
    cagrilintide: 'Metabolic',
    'ara-290': 'Recovery',
    'snap-8': 'Aesthetics',
    pinealon: 'Cognitive',
    pnc27: 'Cellular',
    'klow (ghk-cu50+tb10+bc10+kpv10)': 'Aesthetics',
    tb500: 'Recovery',
    ipamorelin: 'Growth',
    nad: 'Cellular',
    'glow stack (bpc 157 10mg+ghk-cu 50mg+tb500 10mg)': 'Aesthetics',
    survodutide: 'Metabolic',
    'slu-pp-322': 'Metabolic',
    'igf-1lr3': 'Growth',
    vip: 'Cognitive',
    'ghrp-6 acetate': 'Growth',
    mazdutide: 'Metabolic',
    thymalin: 'Cellular',
    dsip: 'Cognitive',
    'thymosin alpha-1': 'Recovery',
    lc216: 'Performance',
    'b12 10000mcg 10ml': 'Support'
  };

  const IMAGE_OVERRIDES_BY_SLUG = {
    'bpc-5mg-plus-tb-5mg': 'assets/products/20261022/wolverine.webp',
    'mots-c': 'assets/products/20261022/mots-c.webp',
    'bpc-157': 'assets/products/20261022/bpc-157.webp',
    'ghk-cu': 'assets/products/20261022/ghk-cu.webp',
    'bac-water': 'assets/products/20261022/bac-water.webp',
    kpv: 'assets/products/20261022/kpv.webp',
    'ara-290': 'assets/products/20261022/ara-290.webp',
    selank: 'assets/products/20261022/selank.webp',
    semax: 'assets/products/20261022/semax.webp',
    tesamorelin: 'assets/products/20261022/tesamorelin.webp',
    nad: 'assets/products/20261022/nad.webp',
    semaglutide: 'assets/products/20261022/semaglutide-20261028.webp',
    tirzepatide: 'assets/products/20261022/tirzepatide-20261027.webp',
    cerebrolysin: 'assets/products/20261022/cerebrolysin.webp',
    'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg': 'assets/products/20261022/ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg.webp',
    'snap-8': 'assets/products/20261022/snap-8.webp',
    cagrilintide: 'assets/products/20261022/cagrilintide.webp',
    'igf-1lr3': 'assets/products/20261022/igf-1lr3.webp',
    'ss-31': 'assets/products/20261022/ss-31.webp',
    'cjc-1295-without-dac': 'assets/products/20261022/cjc-1295-without-dac.webp',
    tb500: 'assets/products/20261022/tb500.webp',
    'pt-141': 'assets/products/20261022/pt-141.webp',
    'cagrilintide-5mg-plus-semaglutide-5mg': 'assets/products/20261022/cagrilintide-5mg-plus-semaglutide-5mg-20261028.webp',
    ipamorelin: 'assets/products/20261022/ipamorelin.webp',
    epithalon: 'assets/products/20261022/epithalon.webp',
    'thymosin-alpha-1': 'assets/products/20261022/thymosin-alpha-1.webp',
    'kisspeptin-10': 'assets/products/20261022/kisspeptin-10.webp',
    retatrutide: 'assets/products/20261022/retatrutide.webp',
    'mt-1': 'assets/products/20261022/mt-1.webp',
    'mt-2': 'assets/products/20261022/mt-2.webp',
    '5-amino-1mq': 'assets/products/20261022/5-amino-1mq.webp',
    glutathione: 'assets/products/20261022/glutathione.webp',
    hcg: 'assets/products/20261022/hcg.webp',
    'bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg': 'assets/products/20261022/bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg.webp',
    'b12-10000mcg-10ml': 'assets/products/20261022/b12-3000mcg-3ml.webp',
    vip: 'assets/products/20261022/vip-20261029.webp'
  };

  const DESCRIPTION_BY_CATEGORY = {
    Metabolic: 'A metabolic research compound in the active Jonezie lineup, commonly tracked for appetite, energy-balance, and glucose-signaling pathways.',
    Recovery: 'A recovery-focused research peptide used for tissue-repair, inflammatory-signaling, and resilience-pathway studies.',
    Aesthetics: 'An aesthetics-focused research product used in skin, pigmentation, collagen, or cosmetic-pathway workflows.',
    Growth: 'A growth-axis research compound used in endocrine, recovery, and body-composition signaling studies.',
    Cognitive: 'A cognitive and neuro-support research compound used in focus, stress-response, and restoration-pathway studies.',
    Cellular: 'A cellular-function research compound used in mitochondrial, longevity, or whole-cell signaling studies.',
    Performance: 'A performance research compound used in high-output, drive, and function-focused pathway studies.',
    Support: 'A support product used in laboratory handling, preparation, and workflow support.'
  };

  function toKey(value) {
    return String(value || '').trim().toLowerCase();
  }

  function formatMoney(value) {
    const number = Number(value || 0);
    const fixed = number.toFixed(2);
    const [whole, decimal] = fixed.split('.');
    const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${withCommas}.${decimal}`;
  }

  function applyProductPriceMultiplier(value) {
    return Number(value || 0) * PRODUCT_PRICE_MULTIPLIER;
  }

  function slugify(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-{2,}/g, '-');
  }

  function inferCategory(rawName) {
    const name = String(rawName || '').toLowerCase();
    if (name.includes('semaglutide') || name.includes('tirzepatide') || name.includes('retatrutide') || name.includes('cagrilintide') || name.includes('survodutide') || name.includes('mazdutide') || name.includes('aod') || name.includes('slu-pp')) return 'Metabolic';
    if (name.includes('ghk') || name.includes('snap') || name.includes('kpv') || name.includes('mt-1') || name.includes('mt-2')) return 'Aesthetics';
    if (name.includes('tb500') || name.includes('bpc') || name.includes('tesamorelin') || name.includes('thymosin alpha')) return 'Recovery';
    if (name.includes('ghrp') || name.includes('hcg') || name.includes('hmg') || name.includes('ipamorelin') || name.includes('igf') || name.includes('cjc')) return 'Growth';
    if (name.includes('semax') || name.includes('selank') || name.includes('dsip') || name.includes('pinealon') || name.includes('vip') || name.includes('cerebrolysin') || name.includes('oxytocin')) return 'Cognitive';
    if (name.includes('nad') || name.includes('ss-31') || name.includes('mots') || name.includes('epithalon') || name.includes('thymalin') || name.includes('pnc')) return 'Cellular';
    return 'Support';
  }

  function parseStrengthOrder(value) {
    const match = String(value || '').replace(/,/g, '').toLowerCase().match(/(\d+(\.\d+)?)/);
    return match ? Number.parseFloat(match[1]) : 999999;
  }

  function getDisplayStrength(strength) {
    const cleaned = String(strength || '')
      .replace(/\/\s*\d+\s*vials?/gi, '')
      .trim();
    return cleaned || String(strength || '').trim();
  }

  function getOptionCode(slug, displayStrength, usedCodes) {
    const slugParts = String(slug || '').split('-').filter(Boolean);
    const prefix = (slugParts.length > 1
      ? slugParts.map((part) => part[0]).join('').slice(0, 3)
      : String(slug || '').slice(0, 3)).toUpperCase();

    const normalizedStrength = String(displayStrength || '').toUpperCase().replace(/\s+/g, '');
    const strengthMatch = normalizedStrength.match(/(\d+(?:\.\d+)?)([A-Z]+)/);
    let strengthToken = normalizedStrength.replace(/[^A-Z0-9]/g, '').slice(0, 8);

    if (strengthMatch) {
      const numeric = Number.parseFloat(strengthMatch[1]);
      const unit = strengthMatch[2];
      let numberToken = strengthMatch[1].replace('.', 'P');
      if (unit === 'IU' && Number.isFinite(numeric) && numeric >= 1000 && Number.isInteger(numeric / 1000)) {
        numberToken = `${numeric / 1000}K`;
      }
      strengthToken = `${numberToken}${unit}`.slice(0, 8);
    }

    let code = `${prefix}${strengthToken}`;
    if (!code) code = `OPT${usedCodes.size + 1}`;
    let index = 2;
    while (usedCodes.has(code)) {
      code = `${prefix}${strengthToken}`.slice(0, 8) + index;
      index += 1;
    }
    usedCodes.add(code);
    return code;
  }

  const byProduct = new Map();
  const usedCodes = new Set();

  PRODUCT_ROWS.forEach(([rawName, strength, single, eightPack, tenPack]) => {
    const nameKey = toKey(rawName);
    const displayName = NAME_OVERRIDES[nameKey] || rawName;
    const slug = SLUG_OVERRIDES[nameKey] || slugify(displayName);
    const category = CATEGORY_OVERRIDES[nameKey] || inferCategory(rawName);
    const displayStrength = getDisplayStrength(strength);
    const specification = String(strength).includes('vials') ? String(strength) : `${strength}*10vials`;
    const image = IMAGE_OVERRIDES_BY_SLUG[slug] || 'product-placeholder.svg';
    const priceKey = `${rawName}|${strength}`;
    const competitorRegularPrice = AMINO_CLUB_REGULAR_PRICES[priceKey];
    const currentSingleCents = Math.round(Number(applyProductPriceMultiplier(single).toFixed(2)) * 100);
    const targetSingleCents = competitorRegularPrice == null ? null : Math.round((competitorRegularPrice - 2) * 100);
    const matchedSinglePrice = SINGLE_PRICE_OVERRIDES[priceKey] ?? (targetSingleCents == null ? null : Math.round(
      targetSingleCents > currentSingleCents
        ? (currentSingleCents + targetSingleCents) / 2
        : targetSingleCents
    ) / 100);

    if (!byProduct.has(slug)) {
      byProduct.set(slug, {
        name: displayName,
        sourceName: rawName,
        slug,
        category,
        description: `${displayName} is an active ${category.toLowerCase()} listing at Jonezie. ${DESCRIPTION_BY_CATEGORY[category] || DESCRIPTION_BY_CATEGORY.Support}`,
        startingPriceSingle: '$0.00',
        startingPrice8: '$0.00',
        startingPrice10: '$0.00',
        image,
        options: []
      });
    }

    const product = byProduct.get(slug);
    const optionCode = getOptionCode(slug, displayStrength, usedCodes);
    product.options.push({
      code: optionCode,
      specification,
      mgOption: displayStrength,
      singleVialPrice: formatMoney(matchedSinglePrice ?? applyProductPriceMultiplier(single)),
      eightVialPrice: formatMoney(matchedSinglePrice === null ? applyProductPriceMultiplier(eightPack) : matchedSinglePrice * eightPack / single),
      tenVialPrice: formatMoney(matchedSinglePrice === null ? applyProductPriceMultiplier(tenPack) : matchedSinglePrice * tenPack / single)
    });
  });

  const products = Array.from(byProduct.values()).map((product) => {
    const sortedOptions = [...product.options].sort((a, b) => {
      const diff = parseStrengthOrder(a.mgOption) - parseStrengthOrder(b.mgOption);
      if (diff !== 0) return diff;
      return String(a.mgOption).localeCompare(String(b.mgOption));
    });
    const backorderNote = BACKORDER_NOTES[product.slug] || '';
    const options = backorderNote
      ? sortedOptions.map((option) => ({
          ...option,
          inventoryStatus: 'backorder',
          backorderNote
        }))
      : sortedOptions;
    const first = options[0] || { singleVialPrice: '$0.00', eightVialPrice: '$0.00', tenVialPrice: '$0.00' };
    return {
      ...product,
      ...(backorderNote ? { inventoryStatus: 'backorder', backorderNote } : {}),
      options,
      startingPriceSingle: first.singleVialPrice,
      startingPrice8: first.eightVialPrice,
      startingPrice10: first.tenVialPrice
    };
  });

  EXTRA_PRODUCTS.forEach((extraProduct) => {
    const existingIndex = products.findIndex((product) => product.slug === extraProduct.slug);
    if (existingIndex >= 0) {
      products[existingIndex] = extraProduct;
    } else {
      products.push(extraProduct);
    }
  });

  const featured = FEATURED_SLUGS
    .map((slug) => products.find((product) => product.slug === slug))
    .filter(Boolean);

  const timestamp = new Date();
  const generatedAt = `${timestamp.getFullYear()}-${String(timestamp.getMonth() + 1).padStart(2, '0')}-${String(timestamp.getDate()).padStart(2, '0')} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}:${String(timestamp.getSeconds()).padStart(2, '0')}`;

  window.JONEZIE_CATALOG = {
    generatedAt,
    totalProducts: products.length,
    totalConfigurations: products.reduce((sum, product) => sum + product.options.length, 0),
    featured,
    products
  };
})();

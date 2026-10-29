(() => {
  // Add approved artwork here once both the hero and thumbnail exist.
  // This shared list controls homepage features and the animated reveal.
  const artwork = {
    retatrutide: 'retatrutide',
    semaglutide: 'semaglutide-20261028',
    'mots-c': 'mots-c',
    semax: 'semax',
    'mt-1': 'mt-1',
    cerebrolysin: 'cerebrolysin',
    'bac-water': 'bac-water',
    tesamorelin: 'tesamorelin',
    'bpc-5mg-plus-tb-5mg': 'wolverine',
    '5-amino-1mq': '5-amino-1mq',
    glutathione: 'glutathione',
    hcg: 'hcg',
    'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg': 'ghk-cu-50mg-plus-tb-500-10mg-plus-bpc-157-10mg-plus-kpv-10mg',
    'bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg': 'bpc-157-10mg-plus-ghk-cu-50mg-plus-tb500-10mg',
    tirzepatide: 'tirzepatide-20261027',
    'ghk-cu': 'ghk-cu',
    selank: 'selank',
    'bpc-157': 'bpc-157',
    nad: 'nad',
    kpv: 'kpv',
    'cjc-1295-without-dac': 'cjc-1295-without-dac',
    'mt-2': 'mt-2',
    'pt-141': 'pt-141',
    epithalon: 'epithalon',
    'ss-31': 'ss-31',
    'kisspeptin-10': 'kisspeptin-10',
    cagrilintide: 'cagrilintide',
    'cagrilintide-5mg-plus-semaglutide-5mg': 'cagrilintide-5mg-plus-semaglutide-5mg-20261028',
    'ara-290': 'ara-290',
    'snap-8': 'snap-8',
    tb500: 'tb500',
    'igf-1lr3': 'igf-1lr3',
    ipamorelin: 'ipamorelin',
    'thymosin-alpha-1': 'thymosin-alpha-1',
    'b12-10000mcg-10ml': 'b12-3000mcg-3ml',
    vip: 'vip-20261029'
  };

  window.JONEZIE_NEW_LABELS = Object.entries(artwork).map(([slug, file]) => ({
    slug,
    image: `assets/products/20261022/${file}.webp`,
    thumbnail: `assets/products/label-reveal/${file}.webp`
  }));
})();

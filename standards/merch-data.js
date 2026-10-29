window.JONEZIE_STANDARDS_MERCH = {
  redirect: {
    // Light-switch control for /standards/: false shows this page, true redirects to target.
    enabled: false,
    target: '../index.html#featured',
    delayMs: 0,
    hideMainSiteLinksWhenDisabled: true
  },
  cartKey: 'jonezie_standards_merch_cart',
  orderKey: 'jonezie_standards_merch_last_order',
  promotion: {
    enabled: true,
    rate: 0.25
  },
  products: [
    {
      slug: 'jonezie-labs-signature-hat',
      sku: 'JL-STANDARDS-HAT-001',
      name: 'Jonezie Labs Signature Hat',
      option: 'One Size',
      price: 110.00,
      image: '../jonezie-labs-hat.png?v=20260410a',
      productType: 'Merchandise',
      description: 'Premium navy snapback with the Jonezie Labs neon mark across the front panel. Adjustable one-size fit.'
    },
    {
      slug: 'fully-automatic-micro-vickers-hardness-tester',
      sku: 'JL-STANDARDS-VICKERS-001',
      name: 'Fully Automatic Micro Vickers Hardness Tester',
      option: 'Automatic Measurement Software',
      price: 51993.75,
      image: 'fully-automatic-micro-vickers-hardness-tester.png?v=20260914a',
      productType: 'Automatic Micro Hardness Tester',
      description: 'Fully automatic Micro Vickers hardness tester with automatic measurement software for laboratory material hardness testing workflows.'
    },
    {
      slug: 'stainless-steel-lab-spatula-micro-scoop-set',
      sku: 'JL-STANDARDS-SPATULA-SET-001',
      name: '22 Pcs Stainless Steel Lab Spatula Micro Scoop Set',
      option: '22 Piece Set',
      price: 25.00,
      image: 'stainless-steel-lab-spatula-micro-scoop-set.png?v=20260914a',
      productType: 'Lab Spatula Micro Scoop Set',
      description: 'Stainless steel 22-piece lab spatula and micro scoop set for handling powders and small laboratory samples.'
    },
    {
      slug: 'drying-rack-stand-lab-glassware-bottles',
      sku: 'JL-STANDARDS-DRYING-RACK-001',
      name: 'Drying Rack Stand for Lab Glassware and Bottles',
      option: 'Rack Stand',
      price: 85.00,
      image: 'drying-rack-stand-lab-glassware-bottles.png?v=20260914a',
      productType: 'Lab Glassware Drying Rack',
      description: 'Drying rack stand for organizing and air-drying laboratory glassware, bottles, cylinders, and beakers.'
    },
    {
      slug: 'research-vial-kit-case',
      sku: 'JL-STANDARDS-VIAL-CASE-001',
      name: 'Research Kit',
      promotionLabel: 'Peptide Research Kits',
      option: 'One Case',
      price: 57.18,
      saleRate: 0.30,
      image: 'research-vial-kit-case.png?v=20261008a',
      productType: 'Vial Storage Case',
      description: 'Compact case with molded compartments for organizing research vials and small laboratory supplies.'
    }
  ],
  shippingOptions: [
    {
      id: 'usps-ground-advantage',
      label: 'USPS Ground Advantage',
      window: '2-5 business days',
      price: 8.00
    },
    {
      id: 'usps-priority-mail',
      label: 'USPS Priority Mail',
      window: '1-3 business days',
      price: 12.25
    },
    {
      id: 'ups-2nd-day-air',
      label: 'UPS 2nd Day Air',
      window: '2 business days',
      price: 25.00
    }
  ],
  tax: {
    mode: 'invoice',
    label: 'Calculated on invoice'
  },
  payment: {
    mode: 'invoice-after-review',
    label: 'Secure invoice after order review'
  }
};

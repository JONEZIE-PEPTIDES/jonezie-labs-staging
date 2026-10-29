window.JONEZIE_ADMIN_CONFIG = {
  // Remove by slug (example: ['tesamorelin'])
  removeProductSlugs: ['bpc-10mg-plus-tb-10mg'],

  // Hide individual configurations without removing the product.
  removeOptionCodes: ['TIR5MG', 'TIR40MG', 'TIR50MG'],

  // Add full product objects here in the same shape as catalog-data.js.
  // Optional: include featured: true to also inject into featured cards.
  addProducts: [],

  // Inventory by MG option code (example: RT20, CU100).
  // Allowed status values: in_stock, backorder, sold_out
  // internalLeadDays is intentionally not shown in the storefront UI.
  optionInventory: {
    LC210MG: { status: 'in_stock' },
    S310MG: { status: 'in_stock' },
    S350MG: { status: 'in_stock' },
    RET15MG: { status: 'backorder' },
    MC40MG: { status: 'backorder' },
    TES15MG: { status: 'backorder' },
    // RT20: { status: 'backorder', internalLeadDays: '20-23' },
    // CU100: { status: 'in_stock', internalLeadDays: '5-10' }
  },

  defaults: {
    inStockLeadDays: '5-10',
    backorderLeadDays: '20-23'
  }
};

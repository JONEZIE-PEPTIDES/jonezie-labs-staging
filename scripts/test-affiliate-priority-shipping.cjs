const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');
const affiliatePricing = require('../affiliate-pricing.js');

const source = fs.readFileSync(path.join(__dirname, '..', 'checkout.js'), 'utf8');
const discountStart = source.indexOf('function getPromoDiscount(');
const discountEnd = source.indexOf('function renderPromoStatus(', discountStart);
const shippingStart = source.indexOf('function qualifiesForFreePriority(');
const shippingEnd = source.indexOf('function renderShippingOptions(', shippingStart);
assert.ok(discountStart >= 0 && discountEnd > discountStart);
assert.ok(shippingStart >= 0 && shippingEnd > shippingStart);

const context = {
  affiliatePricing,
  getCart: () => [],
  isAdSaleEligibleItem: () => true,
  window: { JONEZIE_PROMO: { getAdSaleUnitPrice: (price) => Math.round(price * 60) / 100 } }
};
vm.runInNewContext(source.slice(discountStart, discountEnd)
  + source.slice(shippingStart, shippingEnd), context);
const priority = { id: 'priority-mail', price: 12.25 };
const ground = { id: 'ground-advantage', price: 8 };
const cart = (cents) => [{ unitPrice: cents / 100, quantity: 1 }];
const noPromo = { isValid: false, freeShipping: false };

test('Priority Mail is free only above $1,000 after discounts', () => {
  assert.equal(context.getEffectiveShippingCost(priority, noPromo, cart(100000)), 12.25);
  assert.equal(context.getEffectiveShippingCost(priority, noPromo, cart(100001)), 0);
  const partner = { isValid: true, partnerCode: true, freeShipping: false };
  assert.equal(context.getEffectiveShippingCost(priority, partner, cart(142857)), 12.25);
  assert.equal(context.getEffectiveShippingCost(priority, partner, cart(142859)), 0);
});

test('Partner Ground Advantage remains free from $150 after its discount', () => {
  const partner = { isValid: true, partnerCode: true, freeShipping: false };
  assert.equal(context.getEffectiveShippingCost(ground, partner, cart(21427)), 8);
  assert.equal(context.getEffectiveShippingCost(ground, partner, cart(21428)), 0);
  assert.equal(context.getEffectiveShippingCost(priority, partner, cart(21428)), 12.25);
});

test('The automatic 40% ad discount counts before the Priority threshold', () => {
  const adOffer = { isValid: true, auto: true, freeShipping: false };
  assert.equal(context.getEffectiveShippingCost(priority, adOffer, cart(166666)), 12.25);
  assert.equal(context.getEffectiveShippingCost(priority, adOffer, cart(166668)), 0);
});

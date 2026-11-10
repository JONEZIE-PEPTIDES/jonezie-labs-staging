const assert = require('node:assert/strict');
const test = require('node:test');
const pricing = require('../affiliate-pricing.js');

test('30% partner discount and free Ground Advantage begin at $150 after discount', () => {
  const below = pricing.quote({ subtotalCents: 21427, shippingMethodId: 'ground-advantage', shippingCostCents: 800 });
  assert.equal(below.discountedMerchandiseCents, 14999);
  assert.equal(below.shippingCents, 800);

  const threshold = pricing.quote({ subtotalCents: 21428, shippingMethodId: 'ground-advantage', shippingCostCents: 800 });
  assert.equal(threshold.discountedMerchandiseCents, 15000);
  assert.equal(threshold.shippingCents, 0);
  assert.equal(threshold.amountToInvoiceCents, 15000);
});

test('other shipping methods retain their charge', () => {
  const quote = pricing.quote({ subtotalCents: 22000, shippingMethodId: 'priority-mail', shippingCostCents: 1225 });
  assert.equal(quote.discountedMerchandiseCents, 15400);
  assert.equal(quote.shippingCents, 1225);
});

test('credit reduces invoice amount and commissionable merchandise without double counting shipping', () => {
  const quote = pricing.quote({ subtotalCents: 22000, shippingMethodId: 'ground-advantage', shippingCostCents: 800, creditRequestedCents: 2000 });
  assert.equal(quote.amountToInvoiceCents, 13400);
  assert.equal(quote.commissionableCents, 13400);
  assert.equal(pricing.rewardCents(quote.commissionableCents, true), 2680);
  assert.equal(pricing.rewardCents(quote.commissionableCents, false), 938);
});

test('credit cannot exceed the amount owed', () => {
  const quote = pricing.quote({ subtotalCents: 10000, shippingMethodId: 'ground-advantage', shippingCostCents: 800, creditRequestedCents: 20000 });
  assert.equal(quote.creditAppliedCents, 7800);
  assert.equal(quote.amountToInvoiceCents, 0);
  assert.equal(quote.commissionableCents, 0);
});

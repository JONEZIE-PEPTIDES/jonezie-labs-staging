const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const context = { Date, String, Number, Array, Set };
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'refref-sandbox', 'PaidInvoice.gs'), 'utf8'), context);
const invoice = {
  fullyPaidVerified: true,
  customerId: 'square-customer-1', invoiceId: 'square-invoice-2',
  paidAt: '2026-11-10T17:00:00.000Z', paidAmountCents: 16000,
  taxCents: 0, shippingCents: 2000, commissionableCents: 14000,
  sourceOrderIndex: 2, refCode: 'u9vj3ea82z'
};

test('paid invoice uses actual cents, Square identity, and verified order index', () => {
  const event = context.buildJoneziePaidInvoiceEvent(invoice);
  assert.equal(event.type, 'purchase');
  assert.equal(event.participant.externalId, 'square-customer-1');
  assert.equal(event.purchase.externalResourceId, 'square-invoice-2');
  assert.equal(event.purchase.paidAmountMinor, '16000');
  assert.equal(event.purchase.commissionableAmountMinor, '14000');
  assert.equal(event.purchase.sourceOrderIndex, 2);
  assert.equal(event.refCode, 'u9vj3ea82z');
  assert.throws(() => context.buildJoneziePaidInvoiceEvent({ ...invoice, fullyPaidVerified: false }), /Fully paid/);
  assert.throws(() => context.buildJoneziePaidInvoiceEvent({ ...invoice, commissionableCents: 16001 }), /exceeds/);
  assert.throws(() => context.buildJoneziePaidInvoiceEvent({ ...invoice, shippingCents: 2001 }), /exceeds/);
});

test('first-purchase proof includes all prior paid invoices and the current one', () => {
  const input = {
    customerId: invoice.customerId, invoiceId: invoice.invoiceId,
    paidAt: invoice.paidAt, coverageFrom: '2025-01-01T00:00:00.000Z',
    completeHistoryVerified: true, paidInvoiceIds: ['square-invoice-1', 'square-invoice-2'],
    sourceOrderIndex: 2, verifiedBy: 'owner@example.com',
    verifiedAt: '2026-11-10T17:15:00.000Z'
  };
  const history = context.buildJoneziePaidHistory(input);
  assert.equal(history.coverage.complete, true);
  assert.equal(history.coverage.purchaseKeys.length, 2);
  assert.equal(history.coverage.purchaseKeys[0].externalResourceId, 'square-invoice-1');
  assert.equal(history.supersedesEvidenceId, undefined);
  assert.throws(() => context.buildJoneziePaidHistory({
    customerId: invoice.customerId, invoiceId: invoice.invoiceId,
    paidAt: invoice.paidAt, coverageFrom: '2025-01-01T00:00:00.000Z',
    completeHistoryVerified: true, paidInvoiceIds: ['square-invoice-1'],
    sourceOrderIndex: 2, verifiedBy: 'owner@example.com',
    verifiedAt: '2026-11-10T17:15:00.000Z'
  }), /end with the current/);
});

test('only a matching, unadjusted RefRef partner reward becomes Jonezie Cash', () => {
  const reward = {
    id: 'rwd-1', projectId: 'prj_q191fewr9ma7n', eventId: 'evt-paid-1',
    beneficiaryRole: 'referrer', beneficiary: { partnerId: 'partner-1' },
    benefitKind: 'cash', fulfillmentStatus: 'pending',
    delivery: { method: 'manual' },
    money: { amountMinor: '700', netAmountMinor: '700', currency: 'USD', currencyExponent: 2 }
  };
  const input = {
    fullyPaidVerified: true, reward, eventId: 'evt-paid-1', partnerId: 'partner-1',
    partnerCode: 'ZLEONARD', invoiceId: 'square-invoice-2', verifiedBy: 'Jonezie owner'
  };
  const grant = context.buildJonezieConfirmedCreditGrant(input);
  assert.equal(grant.rewardId, 'rwd-1');
  assert.equal(grant.amountCents, 700);
  assert.equal(grant.invoiceId, 'square-invoice-2');
  assert.throws(() => context.buildJonezieConfirmedCreditGrant({ ...input, fullyPaidVerified: false }), /Fully paid/);
  assert.throws(() => context.buildJonezieConfirmedCreditGrant({ ...input, eventId: 'different' }), /eligible confirmed/);
  assert.throws(() => context.buildJonezieConfirmedCreditGrant({ ...input, reward: { ...reward, void: { reasonCode: 'fraud' } } }), /eligible confirmed/);
  assert.throws(() => context.buildJonezieConfirmedCreditGrant({ ...input, reward: { ...reward, money: { ...reward.money, netAmountMinor: '500' } } }), /adjusted/);
  assert.throws(() => context.buildJonezieConfirmedCreditGrant({ ...input, reward: { ...reward, beneficiary: { partnerId: 'another-partner' } } }), /eligible confirmed/);
});

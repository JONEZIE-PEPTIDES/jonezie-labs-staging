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
  taxCents: 0, commissionableCents: 14000,
  sourceOrderIndex: 2, partnerCode: 'JONEZIE1'
};

test('paid invoice uses actual cents, Square identity, and verified order index', () => {
  const event = context.buildJoneziePaidInvoiceEvent(invoice);
  assert.equal(event.type, 'purchase');
  assert.equal(event.participant.externalId, 'square-customer-1');
  assert.equal(event.purchase.externalResourceId, 'square-invoice-2');
  assert.equal(event.purchase.paidAmountMinor, '16000');
  assert.equal(event.purchase.commissionableAmountMinor, '14000');
  assert.equal(event.purchase.sourceOrderIndex, 2);
  assert.equal(event.refCode, 'JONEZIE1');
  assert.throws(() => context.buildJoneziePaidInvoiceEvent({ ...invoice, fullyPaidVerified: false }), /Fully paid/);
  assert.throws(() => context.buildJoneziePaidInvoiceEvent({ ...invoice, commissionableCents: 16001 }), /exceeds/);
});

test('first-purchase proof includes all prior paid invoices and the current one', () => {
  const history = context.buildJoneziePaidHistory({
    customerId: invoice.customerId, invoiceId: invoice.invoiceId,
    paidAt: invoice.paidAt, coverageFrom: '2025-01-01T00:00:00.000Z',
    completeHistoryVerified: true, paidInvoiceIds: ['square-invoice-1', 'square-invoice-2'],
    sourceOrderIndex: 2, verifiedBy: 'owner@example.com',
    verifiedAt: '2026-11-10T17:15:00.000Z'
  });
  assert.equal(history.coverage.complete, true);
  assert.equal(history.coverage.purchaseKeys.length, 2);
  assert.equal(history.coverage.purchaseKeys[0].externalResourceId, 'square-invoice-1');
  assert.throws(() => context.buildJoneziePaidHistory({
    customerId: invoice.customerId, invoiceId: invoice.invoiceId,
    paidAt: invoice.paidAt, coverageFrom: '2025-01-01T00:00:00.000Z',
    completeHistoryVerified: true, paidInvoiceIds: ['square-invoice-1'],
    sourceOrderIndex: 2, verifiedBy: 'owner@example.com',
    verifiedAt: '2026-11-10T17:15:00.000Z'
  }), /include the current/);
});

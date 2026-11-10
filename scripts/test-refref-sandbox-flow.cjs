const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const scriptDir = path.join(__dirname, '..', 'google-apps-script', 'refref-sandbox');
const source = ['PaidInvoice.gs', 'RefRefSandboxFlow.gs']
  .map((name) => fs.readFileSync(path.join(scriptDir, name), 'utf8')).join('\n');

function harness(responses) {
  const calls = [];
  const grants = [];
  const context = {
    Date, String, Number, Array, Set, JSON, Object, encodeURIComponent,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'sandbox-key' }) },
    UrlFetchApp: { fetch: (url, options) => {
      calls.push({ url, options });
      const next = responses.shift();
      if (!next) throw new Error('Unexpected RefRef request');
      return {
        getResponseCode: () => next.status || 200,
        getContentText: () => JSON.stringify(next.body || {})
      };
    } },
    jonezieCreditGrant: (grant) => {
      grants.push(grant);
      return { entryKey: 'grant:' + grant.rewardId, duplicate: false,
        balance: { availableCents: grant.amountCents } };
    }
  };
  vm.runInNewContext(source, context);
  return { context, calls, grants };
}

const paid = {
  fullyPaidVerified: true, customerId: 'square-test-customer',
  invoiceId: 'square-test-invoice', paidAt: '2026-11-10T17:00:00.000Z',
  paidAmountCents: 10800, taxCents: 0, shippingCents: 800, commissionableCents: 10000,
  sourceOrderIndex: 1, refCode: 'refref-test-code',
  coverageFrom: '2026-01-01T00:00:00.000Z', completeHistoryVerified: true,
  paidInvoiceIds: ['square-test-invoice'], verifiedBy: 'Jonezie owner',
  verifiedAt: '2026-11-10T17:10:00.000Z'
};

test('verified paid invoice creates the participant before submitting paid history', () => {
  const { context, calls, grants } = harness([
    { body: { success: true, eventId: 'evt-test', processingState: 'pending' } },
    { body: { success: true } }
  ]);
  const result = context.recordJoneziePaidInvoiceSandbox(paid);
  assert.equal(result.eventId, 'evt-test');
  assert.match(calls[0].url, /\/v1\/track\/events$/);
  assert.match(calls[1].url, /\/v1\/evidence\/paid-history$/);
  assert.equal(JSON.parse(calls[0].options.payload).purchase.externalResourceId, paid.invoiceId);
  assert.equal(grants.length, 0);
  assert.throws(() => context.recordJoneziePaidInvoiceSandbox({ ...paid, fullyPaidVerified: false }), /Fully paid/);
  assert.equal(calls.length, 2);
});

test('a paid-history failure stops the flow before any credit grant', () => {
  const { context, calls, grants } = harness([
    { body: { success: true, eventId: 'evt-test', processingState: 'pending' } },
    { status: 404, body: { message: 'not found' } }
  ]);
  assert.throws(() => context.recordJoneziePaidInvoiceSandbox(paid), /paid-history returned HTTP 404/);
  assert.equal(calls.length, 2);
  assert.equal(grants.length, 0);
});

test('confirmed reward is checked before the ledger grant and fulfillment', () => {
  const reward = {
    id: 'rwd-test', projectId: 'prj_q191fewr9ma7n', eventId: 'evt-test',
    beneficiaryRole: 'referrer', beneficiary: { partnerId: 'partner-test' },
    benefitKind: 'cash', fulfillmentStatus: 'pending',
    delivery: { method: 'manual' },
    money: { amountMinor: '2000', netAmountMinor: '2000',
      currency: 'USD', currencyExponent: 2 }
  };
  const input = {
    fullyPaidVerified: true, rewardId: reward.id, eventId: reward.eventId,
    partnerId: 'partner-test', partnerCode: 'ZLEONARD',
    invoiceId: paid.invoiceId, verifiedBy: 'Jonezie owner'
  };
  const { context, calls, grants } = harness([
    { body: reward }, { body: { ...reward, fulfillmentStatus: 'fulfilled' } }
  ]);
  const result = context.grantJonezieConfirmedRewardSandbox(input);
  assert.equal(result.entryKey, 'grant:rwd-test');
  assert.equal(grants[0].amountCents, 2000);
  assert.match(calls[0].url, /\/v1\/rewards\/rwd-test\?projectId=/);
  assert.match(calls[1].url, /\/v1\/rewards\/rwd-test\/fulfillment$/);
  assert.equal(JSON.parse(calls[1].options.payload).externalReference, 'grant:rwd-test');

  const bad = harness([{ body: { ...reward, eventId: 'other-event' } }]);
  assert.throws(() => bad.context.grantJonezieConfirmedRewardSandbox(input), /eligible confirmed/);
  assert.equal(bad.grants.length, 0);
  assert.equal(bad.calls.length, 1);
});

test('one paid-invoice action discovers both first-order rewards without typed reward IDs', () => {
  const reward = (id, cents) => ({
    id, projectId: 'prj_q191fewr9ma7n', eventId: 'evt-test',
    beneficiaryRole: 'referrer', beneficiary: { partnerId: 'partner-test' },
    benefitKind: 'cash', fulfillmentStatus: 'pending',
    delivery: { method: 'manual' },
    money: { amountMinor: String(cents), netAmountMinor: String(cents),
      currency: 'USD', currencyExponent: 2 }
  });
  const bonus = reward('rwd-bonus', 1300);
  const base = reward('rwd-base', 700);
  const { context, calls, grants } = harness([
    { body: { eventId: 'evt-test' } }, { body: { success: true } },
    { body: { rewards: [bonus, base], next: '' } },
    { body: bonus }, { body: { success: true } },
    { body: base }, { body: { success: true } }
  ]);
  const result = context.completeJoneziePaidInvoiceSandbox({ ...paid, partnerCode: 'ZLEONARD' });
  assert.equal(result.status, 'credited');
  assert.equal(result.grants.length, 2);
  assert.deepEqual(grants.map((grant) => grant.amountCents), [1300, 700]);
  assert.match(calls[2].url, /\/v1\/rewards\?projectId=/);
});

test('pending rewards do not issue credit and can be reconciled later', () => {
  const { context, calls, grants } = harness([
    { body: { eventId: 'evt-test' } }, { body: { success: true } },
    { body: { rewards: [], next: '' } }, { body: { rewards: [], next: '' } }
  ]);
  const first = context.completeJoneziePaidInvoiceSandbox({ ...paid, partnerCode: 'ZLEONARD' });
  assert.equal(first.status, 'pending_refref');
  const retry = context.reconcileJoneziePaidInvoiceSandbox({
    fullyPaidVerified: true, invoiceId: paid.invoiceId, eventId: first.eventId,
    partnerCode: 'ZLEONARD', verifiedBy: 'Jonezie owner'
  });
  assert.equal(retry.status, 'pending_refref');
  assert.equal(grants.length, 0);
  assert.equal(calls.length, 4);
});

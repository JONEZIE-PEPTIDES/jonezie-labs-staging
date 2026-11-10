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
  paidAmountCents: 10800, taxCents: 0, commissionableCents: 10000,
  sourceOrderIndex: 1, refCode: 'refref-test-code',
  coverageFrom: '2026-01-01T00:00:00.000Z', completeHistoryVerified: true,
  paidInvoiceIds: ['square-test-invoice'], verifiedBy: 'Jonezie owner',
  verifiedAt: '2026-11-10T17:10:00.000Z'
};

test('verified paid invoice sends history before purchase and returns event ID', () => {
  const { context, calls, grants } = harness([
    { body: { success: true } },
    { body: { success: true, eventId: 'evt-test', processingState: 'pending' } }
  ]);
  const result = context.recordJoneziePaidInvoiceSandbox(paid);
  assert.equal(result.eventId, 'evt-test');
  assert.match(calls[0].url, /\/v1\/evidence\/paid-history$/);
  assert.match(calls[1].url, /\/v1\/track\/events$/);
  assert.equal(JSON.parse(calls[1].options.payload).purchase.externalResourceId, paid.invoiceId);
  assert.equal(grants.length, 0);
  assert.throws(() => context.recordJoneziePaidInvoiceSandbox({ ...paid, fullyPaidVerified: false }), /Fully paid/);
  assert.equal(calls.length, 2);
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

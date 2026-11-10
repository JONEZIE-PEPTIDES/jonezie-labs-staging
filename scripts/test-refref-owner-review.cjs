const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const dir = path.join(__dirname, '..', 'google-apps-script', 'refref-sandbox');
const source = ['CreditLedger.gs', 'PaidInvoice.gs', 'OwnerPaidReview.gs']
  .map((file) => fs.readFileSync(path.join(dir, file), 'utf8')).join('\n');

function reviewRow() {
  return [
    'invoice-2', 'customer-1', '2026-11-10T17:00:00.000Z',
    '108.00', '0.00', '8.00', '100.00',
    'invoice-1, invoice-2', '2025-01-01T00:00:00.000Z',
    'ZLEONARD', 'ref-code', 'YES', 'YES', 'YES', 'Jonezie owner',
    'APPROVE', '', '', '', ''
  ];
}

function harness(row) {
  const calls = [];
  const rows = [Array(20).fill(''), row];
  const sheet = {
    getLastRow: () => rows.length,
    getRange: (r, c) => ({
      getValues: () => [rows[r - 1].slice(c - 1)],
      setValue: (value) => { rows[r - 1][c - 1] = value; },
      clearContent: () => { rows[r - 1][c - 1] = ''; }
    })
  };
  const context = {
    Date, String, Number, Array, Set, Object,
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'ledger-id' }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush: () => {} },
    LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) },
    recordJoneziePaidInvoiceSandbox: (input) => {
      calls.push({ type: 'record', input });
      return { eventId: 'evt-2' };
    },
    reconcileJoneziePaidInvoiceSandbox: (input) => {
      calls.push({ type: 'reconcile', input });
      return { status: 'credited', grants: [{ amountCents: 700 }] };
    }
  };
  vm.runInNewContext(source, context);
  return { context, rows, calls };
}

test('owner approval converts verified dollars to cents and records the event', () => {
  const { context, rows, calls } = harness(reviewRow());
  const result = context.processJoneziePaidReviewsSandbox();
  assert.equal(result[0].status, 'credited');
  assert.equal(calls[0].input.paidAmountCents, 10800);
  assert.equal(calls[0].input.shippingCents, 800);
  assert.equal(calls[0].input.commissionableCents, 10000);
  assert.equal(calls[0].input.sourceOrderIndex, 2);
  assert.equal(rows[1][16], 'CREDITED');
  assert.equal(rows[1][17], 'evt-2');
  assert.equal(rows[1][18], '7.00');
  assert.equal(rows[1][15], '');
});

test('unpaid or unverified history cannot submit an event', () => {
  const row = reviewRow();
  row[11] = 'NO';
  const { context, rows, calls } = harness(row);
  const result = context.processJoneziePaidReviewsSandbox();
  assert.equal(result[0].status, 'needs_review');
  assert.equal(calls.length, 0);
  assert.equal(rows[1][16], 'NEEDS_REVIEW');
});

test('an already started invoice cannot be submitted twice', () => {
  const row = reviewRow();
  row[17] = 'evt-prior';
  const { context, calls } = harness(row);
  const result = context.processJoneziePaidReviewsSandbox();
  assert.equal(result[0].status, 'needs_review');
  assert.equal(calls.length, 0);
});

test('recheck uses the stored event without resubmitting the Square purchase', () => {
  const row = reviewRow();
  row[15] = 'RECHECK';
  row[16] = 'PENDING_REFREF';
  row[17] = 'evt-prior';
  const { context, calls, rows } = harness(row);
  const result = context.processJoneziePaidReviewsSandbox();
  assert.equal(result[0].status, 'credited');
  assert.deepEqual(calls.map((call) => call.type), ['reconcile']);
  assert.equal(calls[0].input.eventId, 'evt-prior');
  assert.equal(rows[1][16], 'CREDITED');
});

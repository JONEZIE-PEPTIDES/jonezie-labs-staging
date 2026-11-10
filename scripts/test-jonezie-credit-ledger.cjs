const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function ledger() {
  const rows = [];
  const properties = new Map();
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => rows.push(row),
    setFrozenRows: () => {},
    getRange: (start, column, count) => ({
      getValues: () => rows.slice(start - 1, start - 1 + count).map((row) => row.slice(column - 1))
    })
  };
  const book = {
    getId: () => 'private-test-ledger',
    getSheetByName: () => sheet,
    insertSheet: () => sheet
  };
  const context = {
    Date, String, Number, Math,
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (name) => properties.get(name),
      setProperty: (name, value) => properties.set(name, value)
    }) },
    SpreadsheetApp: {
      create: () => book, openById: () => book, flush: () => {}
    },
    LockService: { getScriptLock: () => ({ waitLock: () => {}, releaseLock: () => {} }) }
  };
  const source = fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'refref-sandbox', 'CreditLedger.gs'), 'utf8');
  vm.runInNewContext(source, context);
  return { context, rows };
}

const grant = {
  partnerId: 'partner-1', partnerCode: 'JONEZIE1',
  invoiceId: 'square-paid-1', rewardId: 'refref-reward-1',
  amountCents: 2000, verifiedBy: 'owner@example.com'
};

test('paid reward is granted once and redemption cannot exceed balance', () => {
  const { context, rows } = ledger();
  assert.equal(context.jonezieCreditGrant(grant).balance.availableCents, 2000);
  assert.equal(context.jonezieCreditGrant(grant).duplicate, true);
  assert.equal(rows.length, 2);
  assert.throws(() => context.jonezieCreditRedeem({
    partnerId: grant.partnerId, partnerCode: grant.partnerCode,
    invoiceId: 'square-invoice-2', amountCents: 2001, verifiedBy: 'owner@example.com'
  }), /Insufficient/);
  assert.equal(context.jonezieCreditRedeem({
    partnerId: grant.partnerId, partnerCode: grant.partnerCode,
    invoiceId: 'square-invoice-2', amountCents: 1200, verifiedBy: 'owner@example.com'
  }).balance.availableCents, 800);
  assert.equal(context.jonezieCreditBalance(grant.partnerId).netCents, 800);
});

test('cancelled invoice releases credit once; refunded reward can make net negative', () => {
  const { context, rows } = ledger();
  context.jonezieCreditGrant(grant);
  context.jonezieCreditRedeem({
    partnerId: grant.partnerId, partnerCode: grant.partnerCode,
    invoiceId: 'square-invoice-2', amountCents: 1200, verifiedBy: 'owner@example.com'
  });
  const release = { relatedEntryKey: 'redeem:square-invoice-2', verifiedBy: 'owner@example.com' };
  assert.equal(context.jonezieCreditReleaseRedemption(release).balance.availableCents, 2000);
  assert.equal(context.jonezieCreditReleaseRedemption(release).duplicate, true);
  assert.equal(rows.length, 4);
  context.jonezieCreditRedeem({
    partnerId: grant.partnerId, partnerCode: grant.partnerCode,
    invoiceId: 'square-invoice-3', amountCents: 1800, verifiedBy: 'owner@example.com'
  });
  const reversed = context.jonezieCreditReverseGrant({
    relatedEntryKey: 'grant:refref-reward-1', verifiedBy: 'owner@example.com'
  });
  assert.equal(reversed.balance.netCents, -1800);
  assert.equal(reversed.balance.availableCents, 0);
});

test('conflicting invoice replay and spreadsheet formula text are rejected or escaped', () => {
  const { context, rows } = ledger();
  context.jonezieCreditGrant({ ...grant, note: '=HYPERLINK("bad")' });
  assert.match(rows[1][10], /^'/);
  assert.throws(() => context.jonezieCreditGrant({ ...grant, amountCents: 3000 }), /different details/);
  assert.throws(() => context.jonezieCreditGrant({ ...grant, rewardId: '=bad' }), /invalid/);
});

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function loadEndpoint({ sheetFails = false } = {}) {
  const rows = [];
  const emails = [];
  const properties = new Map();
  const sheet = {
    getLastRow: () => rows.length,
    appendRow: (row) => rows.push(row),
    setFrozenRows: () => {}
  };
  const spreadsheet = {
    getId: () => 'test-sheet',
    getUrl: () => 'https://docs.google.com/spreadsheets/d/test-sheet',
    getSheetByName: () => sheet,
    insertSheet: () => sheet
  };
  const context = {
    Date, JSON, Math, String, Number, Array, Boolean,
    MailApp: { sendEmail: (email) => emails.push(email) },
    SpreadsheetApp: {
      create: () => {
        if (sheetFails) throw new Error('Sheet unavailable');
        return spreadsheet;
      },
      openById: () => spreadsheet
    },
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (key) => properties.get(key),
      setProperty: (key, value) => properties.set(key, value)
    }) },
    ContentService: {
      MimeType: { JSON: 'json', TEXT: 'text' },
      createTextOutput: (value) => ({ value, setMimeType() { return this; } })
    }
  };
  const source = fs.readFileSync(path.join(__dirname, '..', 'google-apps-script', 'order-request', 'Code.gs'), 'utf8');
  vm.runInNewContext(source, context);
  return { context, rows, emails };
}

const request = {
  orderId: 'JL-TEST-1',
  requestedAt: '2026-11-10T16:00:00.000Z',
  customer: { name: 'Test Customer', email: 'customer@example.com' },
  partnerOffer: { code: 'ZLEONARD', refCode: 'u9vj3ea82z' },
  referralHandle: 'sample-handle',
  creditRequest: { amountRequested: 20, amountRequestedDisplay: '$20.00' },
  totals: { subtotal: 200, discount: 60, estimatedTotalDisplay: '$120.00' },
  items: []
};

test('partner requests reach the owner email and review sheet', () => {
  const { context, rows, emails } = loadEndpoint();
  const result = context.doPost({ postData: { contents: JSON.stringify(request) } });
  assert.equal(JSON.parse(result.value).ok, true);
  assert.equal(rows.length, 2);
  assert.deepEqual(Array.from(rows[1]).slice(0, 8), [
    request.requestedAt, request.orderId, 'customer@example.com', 'ZLEONARD',
    'sample-handle', 140, 20, 'Awaiting owner review'
  ]);
  assert.match(emails[0].body, /Partner order log: https:\/\/docs\.google\.com/);
  assert.match(emails[0].body, /Partner credit: issue only after the Square invoice is fully paid/);
  assert.equal(rows[1].length, rows[0].length);
  assert.equal(rows[1][rows[0].indexOf('RefRef Tracking Code')], 'u9vj3ea82z');
  assert.match(emails[0].body, /RefRef Tracking Code: u9vj3ea82z/);
});

test('sheet failure never suppresses the order request email', () => {
  const { context, emails } = loadEndpoint({ sheetFails: true });
  const result = context.doPost({ postData: { contents: JSON.stringify(request) } });
  assert.equal(JSON.parse(result.value).ok, true);
  assert.match(emails[0].body, /Could not save; use this email as the record/);
});

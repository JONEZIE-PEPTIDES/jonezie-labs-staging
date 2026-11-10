// Private owner review sheet. Never publish this as a web app. After Square
// reports an invoice fully paid, the owner verifies the facts, enters one row,
// sets Action to APPROVE, and runs processJoneziePaidReviewsSandbox().
const JONEZIE_PAID_REVIEW_HEADERS = [
  'Square Invoice ID', 'Square Customer ID', 'Paid At UTC', 'Paid Total USD',
  'Tax USD', 'Shipping USD', 'Merchandise Paid USD',
  'All Paid Invoice IDs (oldest first, comma-separated)', 'History Start UTC',
  'Partner Code', 'RefRef Tracking Code', 'Square Fully Paid? YES',
  'Full Paid History Checked? YES', 'Code Pair Checked? YES', 'Verified By',
  'Action (APPROVE or RECHECK)', 'Status', 'RefRef Event ID',
  'Jonezie Cash USD', 'Last Error'
];

function prepareJoneziePaidReviewSandbox() {
  const sheet = joneziePaidReviewSheet_();
  return { sheetUrl: sheet.getParent().getUrl(), tabName: sheet.getName() };
}

function processJoneziePaidReviewsSandbox() {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = joneziePaidReviewSheet_();
    const results = [];
    for (let rowNumber = 2; rowNumber <= sheet.getLastRow(); rowNumber++) {
      const row = sheet.getRange(rowNumber, 1, 1, JONEZIE_PAID_REVIEW_HEADERS.length).getValues()[0];
      const action = String(row[15] || '').trim().toUpperCase();
      if (action !== 'APPROVE' && action !== 'RECHECK') continue;
      try {
        const input = joneziePaidReviewInput_(row);
        let eventId = String(row[17] || '').trim();
        if (action === 'APPROVE') {
          if (eventId || String(row[16] || '').trim()) {
            throw new Error('This invoice was already started; review its status before another approval');
          }
          sheet.getRange(rowNumber, 17).setValue('PROCESSING');
          SpreadsheetApp.flush();
          const recorded = recordJoneziePaidInvoiceSandbox(input);
          eventId = recorded.eventId;
          sheet.getRange(rowNumber, 18).setValue(eventId);
          SpreadsheetApp.flush();
        } else if (!eventId || !['PENDING_REFREF', 'PARTIAL_REFREF'].includes(String(row[16] || ''))) {
          throw new Error('RECHECK requires an approved invoice with pending rewards');
        }
        const result = reconcileJoneziePaidInvoiceSandbox(Object.assign({}, input, { eventId }));
        sheet.getRange(rowNumber, 17).setValue(result.status.toUpperCase());
        sheet.getRange(rowNumber, 19).setValue(
          (result.grants.reduce((sum, grant) => sum + grant.amountCents, 0) / 100).toFixed(2)
        );
        sheet.getRange(rowNumber, 20).clearContent();
        results.push({ rowNumber, status: result.status, eventId });
      } catch (error) {
        if (error.jonezieEventId) sheet.getRange(rowNumber, 18).setValue(error.jonezieEventId);
        sheet.getRange(rowNumber, 17).setValue('NEEDS_REVIEW');
        sheet.getRange(rowNumber, 20).setValue(String(error.message || error));
        results.push({ rowNumber, status: 'needs_review', error: String(error.message || error) });
      } finally {
        sheet.getRange(rowNumber, 16).clearContent();
        SpreadsheetApp.flush();
      }
    }
    return results;
  } finally {
    lock.releaseLock();
  }
}

function joneziePaidReviewSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty(JONEZIE_CREDIT_SHEET_PROPERTY);
  if (!id) throw new Error('Set up the private Jonezie Cash ledger first');
  const book = SpreadsheetApp.openById(id);
  const sheet = book.getSheetByName('Paid Reviews') || book.insertSheet('Paid Reviews');
  if (!sheet.getLastRow()) {
    sheet.appendRow(JONEZIE_PAID_REVIEW_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function joneziePaidReviewInput_(row) {
  if (String(row[11]).trim().toUpperCase() !== 'YES' ||
      String(row[12]).trim().toUpperCase() !== 'YES' ||
      String(row[13]).trim().toUpperCase() !== 'YES') {
    throw new Error('Confirm Square payment, complete paid history, and code pairing');
  }
  const invoiceId = requiredPaidText_(row[0], 'Square invoice ID');
  const paidInvoiceIds = requiredPaidText_(row[7], 'Complete paid invoice IDs')
    .split(',').map((id) => requiredPaidText_(id, 'Paid invoice ID'));
  if (paidInvoiceIds[paidInvoiceIds.length - 1] !== invoiceId) {
    throw new Error('The current Square invoice must be last in paid history');
  }
  return {
    fullyPaidVerified: true, completeHistoryVerified: true,
    invoiceId, customerId: requiredPaidText_(row[1], 'Square customer ID'),
    paidAt: requiredPaidTimestamp_(row[2], 'Paid at'),
    paidAmountCents: jonezieReviewMoney_(row[3], 'Paid total'),
    taxCents: jonezieReviewMoney_(row[4], 'Tax'),
    shippingCents: jonezieReviewMoney_(row[5], 'Shipping'),
    commissionableCents: jonezieReviewMoney_(row[6], 'Paid merchandise'),
    paidInvoiceIds, sourceOrderIndex: paidInvoiceIds.length,
    coverageFrom: requiredPaidTimestamp_(row[8], 'History start'),
    partnerCode: requiredPaidText_(row[9], 'Partner code'),
    refCode: requiredPaidText_(row[10], 'RefRef tracking code'),
    verifiedBy: requiredPaidText_(row[14], 'Verifier'),
    verifiedAt: new Date().toISOString()
  };
}

function jonezieReviewMoney_(value, label) {
  const text = String(value).trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(text)) throw new Error(label + ' must be USD with at most two decimals');
  const parts = text.split('.');
  const cents = Number(parts[0]) * 100 + Number((parts[1] || '').padEnd(2, '0'));
  if (!Number.isSafeInteger(cents)) throw new Error(label + ' is too large');
  return cents;
}

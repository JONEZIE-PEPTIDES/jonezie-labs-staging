// Owner-only Jonezie Cash ledger. Run these functions in the private Apps Script
// project; do not deploy them as a public web app or call them from checkout.
const JONEZIE_CREDIT_SHEET_PROPERTY = 'JONEZIE_CREDIT_LEDGER_SHEET_ID';
const JONEZIE_CREDIT_HEADERS = [
  'Recorded At', 'Entry Key', 'Partner ID', 'Partner Code', 'Type',
  'Amount Cents', 'Invoice ID', 'RefRef Reward ID', 'Related Entry Key',
  'Verified By', 'Note'
];

function jonezieCreditBalance(partnerId) {
  const id = requiredCreditText_(partnerId, 'Partner ID');
  const sheet = jonezieCreditSheet_(false);
  if (!sheet) return { partnerId: id, availableCents: 0, netCents: 0 };
  const entries = jonezieCreditEntries_(sheet);
  const netCents = entries.filter((entry) => entry.partnerId === id)
    .reduce((sum, entry) => sum + creditSignedAmount_(entry), 0);
  return { partnerId: id, availableCents: Math.max(0, netCents), netCents };
}

// Grant only after the Square invoice is fully paid and the reward is confirmed.
function jonezieCreditGrant(input) {
  const partnerId = requiredCreditText_(input.partnerId, 'Partner ID');
  const invoiceId = requiredCreditText_(input.invoiceId, 'Square invoice ID');
  const rewardId = requiredCreditText_(input.rewardId, 'RefRef reward ID');
  const entry = {
    key: 'grant:' + rewardId,
    partnerId,
    partnerCode: requiredCreditText_(input.partnerCode, 'Partner code'),
    type: 'GRANT', amountCents: positiveCreditCents_(input.amountCents),
    invoiceId, rewardId, relatedKey: '',
    verifiedBy: requiredCreditText_(input.verifiedBy, 'Verifier'),
    note: safeCreditNote_(input.note)
  };
  return appendJonezieCreditEntry_(entry);
}

// Record before sending the Square invoice. The partner and available balance
// must have been checked by the owner against the private ledger.
function jonezieCreditRedeem(input) {
  const invoiceId = requiredCreditText_(input.invoiceId, 'Square invoice ID');
  const partnerId = requiredCreditText_(input.partnerId, 'Partner ID');
  const entry = {
    key: 'redeem:' + invoiceId,
    partnerId,
    partnerCode: requiredCreditText_(input.partnerCode, 'Partner code'),
    type: 'REDEEM', amountCents: positiveCreditCents_(input.amountCents),
    invoiceId, rewardId: '', relatedKey: '',
    verifiedBy: requiredCreditText_(input.verifiedBy, 'Verifier'),
    note: safeCreditNote_(input.note)
  };
  return appendJonezieCreditEntry_(entry);
}

// If an invoice is cancelled, release the exact redemption recorded for it.
function jonezieCreditReleaseRedemption(input) {
  return appendCreditReversal_(input, 'REDEEM', 'RELEASE_REDEMPTION');
}

// If a paid order is refunded, reverse the exact grant. A negative net balance
// means previously spent credit must be resolved before any further use.
function jonezieCreditReverseGrant(input) {
  return appendCreditReversal_(input, 'GRANT', 'REVERSE_GRANT');
}

function appendCreditReversal_(input, originalType, reversalType) {
  const relatedKey = requiredCreditText_(input.relatedEntryKey, 'Related entry key');
  const verifiedBy = requiredCreditText_(input.verifiedBy, 'Verifier');
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = jonezieCreditSheet_(false);
    if (!sheet) throw new Error('Credit entry was not found');
    const entries = jonezieCreditEntries_(sheet);
    const original = entries.find((entry) => entry.key === relatedKey && entry.type === originalType);
    if (!original) throw new Error('Matching credit entry was not found');
    const key = reversalType.toLowerCase() + ':' + relatedKey;
    const entry = {
      key, partnerId: original.partnerId, partnerCode: original.partnerCode,
      type: reversalType, amountCents: original.amountCents,
      invoiceId: original.invoiceId, rewardId: original.rewardId,
      relatedKey, verifiedBy, note: safeCreditNote_(input.note)
    };
    return appendCreditToSheet_(sheet, entries, entry);
  } finally {
    lock.releaseLock();
  }
}

function appendJonezieCreditEntry_(entry) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const sheet = jonezieCreditSheet_(true);
    const entries = jonezieCreditEntries_(sheet);
    return appendCreditToSheet_(sheet, entries, entry);
  } finally {
    lock.releaseLock();
  }
}

function appendCreditToSheet_(sheet, entries, entry) {
  const existing = entries.find((row) => row.key === entry.key);
  if (existing) {
    if (existing.partnerId !== entry.partnerId || existing.type !== entry.type ||
        existing.amountCents !== entry.amountCents || existing.invoiceId !== entry.invoiceId ||
        existing.rewardId !== entry.rewardId || existing.relatedKey !== entry.relatedKey) {
      throw new Error('Entry key already exists with different details');
    }
    return { entryKey: entry.key, duplicate: true, balance: jonezieCreditBalance(entry.partnerId) };
  }
  if (entry.type === 'REDEEM') {
    const net = entries.filter((row) => row.partnerId === entry.partnerId)
      .reduce((sum, row) => sum + creditSignedAmount_(row), 0);
    if (entry.amountCents > net) throw new Error('Insufficient Jonezie Cash balance');
  }
  sheet.appendRow([
    new Date().toISOString(), entry.key, entry.partnerId, entry.partnerCode,
    entry.type, entry.amountCents, entry.invoiceId, entry.rewardId,
    entry.relatedKey, entry.verifiedBy, entry.note
  ]);
  SpreadsheetApp.flush();
  return { entryKey: entry.key, duplicate: false, balance: jonezieCreditBalance(entry.partnerId) };
}

function jonezieCreditSheet_(create) {
  const properties = PropertiesService.getScriptProperties();
  const id = properties.getProperty(JONEZIE_CREDIT_SHEET_PROPERTY);
  if (!id && !create) return null;
  const book = id ? SpreadsheetApp.openById(id) : SpreadsheetApp.create('Jonezie Cash Ledger - Private');
  if (!id) properties.setProperty(JONEZIE_CREDIT_SHEET_PROPERTY, book.getId());
  const sheet = book.getSheetByName('Entries') || book.insertSheet('Entries');
  if (!sheet.getLastRow()) {
    sheet.appendRow(JONEZIE_CREDIT_HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jonezieCreditEntries_(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  return sheet.getRange(2, 1, lastRow - 1, JONEZIE_CREDIT_HEADERS.length)
    .getValues().map((row) => ({
      key: String(row[1]), partnerId: String(row[2]), partnerCode: String(row[3]),
      type: String(row[4]), amountCents: Number(row[5]), invoiceId: String(row[6]),
      rewardId: String(row[7]), relatedKey: String(row[8])
    }));
}

function creditSignedAmount_(entry) {
  return (entry.type === 'GRANT' || entry.type === 'RELEASE_REDEMPTION' ? 1 : -1) * entry.amountCents;
}

function requiredCreditText_(value, label) {
  const text = String(value || '').trim();
  if (!text || /^[=+\-@]/.test(text) || /[\r\n]/.test(text)) throw new Error(label + ' is missing or invalid');
  return text;
}

function positiveCreditCents_(value) {
  if (!Number.isSafeInteger(value) || value <= 0) throw new Error('Amount must be positive whole cents');
  return value;
}

function safeCreditNote_(value) {
  const text = String(value || '').trim();
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

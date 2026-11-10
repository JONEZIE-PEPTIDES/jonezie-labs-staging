// Prepare RefRef Sandbox facts from a fully paid Square invoice. These builders
// make no network calls. A trusted owner workflow must verify every input.
const JONEZIE_REFREF_SANDBOX_PROJECT = 'prj_q191fewr9ma7n';

function buildJoneziePaidInvoiceEvent(input) {
  if (!input || input.fullyPaidVerified !== true) {
    throw new Error('Fully paid Square invoice must be verified');
  }
  const customerId = requiredPaidText_(input.customerId, 'Square customer ID');
  const invoiceId = requiredPaidText_(input.invoiceId, 'Square invoice ID');
  const paidAt = requiredPaidTimestamp_(input.paidAt, 'Paid at');
  const paidCents = nonnegativePaidCents_(input.paidAmountCents, 'Paid amount');
  const taxCents = nonnegativePaidCents_(input.taxCents, 'Tax');
  const commissionableCents = nonnegativePaidCents_(input.commissionableCents, 'Commissionable merchandise');
  if (!paidCents || commissionableCents > paidCents - taxCents) {
    throw new Error('Commissionable merchandise exceeds the paid amount before tax');
  }
  if (!Number.isSafeInteger(input.sourceOrderIndex) || input.sourceOrderIndex < 1) {
    throw new Error('Verified customer paid-order number is required');
  }
  const event = {
    projectId: JONEZIE_REFREF_SANDBOX_PROJECT,
    participant: { kind: 'individual', externalId: customerId },
    type: 'purchase',
    purchase: {
      resourceType: 'invoice', externalResourceId: invoiceId,
      paidAt, currency: 'USD', currencyExponent: 2,
      paidAmountMinor: String(paidCents), taxMinor: String(taxCents),
      commissionableAmountMinor: String(commissionableCents),
      sourceOrderIndex: input.sourceOrderIndex
    }
  };
  if (input.refCode) event.refCode = requiredPaidText_(input.refCode, 'RefRef tracking code');
  return event;
}

// RefRef requires complete prior paid history before a first-purchase rule
// resolves. Include every paid Square invoice through the current invoice.
function buildJoneziePaidHistory(input) {
  const customerId = requiredPaidText_(input.customerId, 'Square customer ID');
  const invoiceId = requiredPaidText_(input.invoiceId, 'Square invoice ID');
  const from = requiredPaidTimestamp_(input.coverageFrom, 'Coverage start');
  const through = requiredPaidTimestamp_(input.paidAt, 'Paid at');
  if (Date.parse(from) > Date.parse(through)) throw new Error('Coverage begins after paid invoice');
  if (input.completeHistoryVerified !== true) throw new Error('Complete Square paid history must be verified');
  if (!Array.isArray(input.paidInvoiceIds) || !input.paidInvoiceIds.length) {
    throw new Error('Complete paid invoice IDs are required');
  }
  const ids = input.paidInvoiceIds.map((id) => requiredPaidText_(id, 'Paid invoice ID'));
  if (new Set(ids).size !== ids.length || !ids.includes(invoiceId)) {
    throw new Error('Paid invoice history must be unique and include the current invoice');
  }
  if (!Number.isSafeInteger(input.sourceOrderIndex) || input.sourceOrderIndex !== ids.length) {
    throw new Error('Paid invoice history must match the verified order number');
  }
  return {
    projectId: JONEZIE_REFREF_SANDBOX_PROJECT,
    sourceEvidenceId: 'square-paid-history:' + customerId + ':' + invoiceId,
    participant: { kind: 'individual', externalId: customerId },
    coverage: {
      from, through, complete: true,
      purchaseKeys: ids.map((id) => ({ resourceType: 'invoice', externalResourceId: id }))
    },
    sourceSnapshot: {
      source: 'Square paid invoices',
      verifiedBy: requiredPaidText_(input.verifiedBy, 'Verifier'),
      verifiedAt: requiredPaidTimestamp_(input.verifiedAt, 'Verified at')
    }
  };
}

// Convert a RefRef reward into an owner-reviewed ledger grant. The caller must
// fetch the reward from RefRef and match its event ID to the recorded paid
// Square invoice event; browser or order-request data is never trusted here.
function buildJonezieConfirmedCreditGrant(input) {
  if (!input || input.fullyPaidVerified !== true) {
    throw new Error('Fully paid Square invoice must be verified');
  }
  const reward = input.reward;
  if (!reward || reward.projectId !== JONEZIE_REFREF_SANDBOX_PROJECT ||
      reward.eventId !== requiredPaidText_(input.eventId, 'RefRef event ID') ||
      reward.beneficiaryRole !== 'referrer' ||
      reward.beneficiary?.partnerId !== requiredPaidText_(input.partnerId, 'RefRef partner ID') ||
      reward.benefitKind !== 'cash' || reward.void ||
      !['pending', 'fulfilled'].includes(reward.fulfillmentStatus) ||
      !['manual', 'operator'].includes(reward.delivery?.method) ||
      reward.money?.currency !== 'USD' || reward.money?.currencyExponent !== 2) {
    throw new Error('RefRef reward is not an eligible confirmed partner reward');
  }
  const rawAmount = reward.money.netAmountMinor;
  if (!/^\d+$/.test(String(rawAmount)) || !Number.isSafeInteger(Number(rawAmount)) ||
      Number(rawAmount) <= 0 || String(reward.money.amountMinor) !== String(rawAmount)) {
    throw new Error('RefRef reward amount is invalid or adjusted');
  }
  return {
    partnerId: input.partnerId,
    partnerCode: requiredPaidText_(input.partnerCode, 'Partner code'),
    invoiceId: requiredPaidText_(input.invoiceId, 'Square invoice ID'),
    rewardId: requiredPaidText_(reward.id, 'RefRef reward ID'),
    amountCents: Number(rawAmount),
    verifiedBy: requiredPaidText_(input.verifiedBy, 'Verifier')
  };
}

function requiredPaidText_(value, label) {
  const text = String(value || '').trim();
  if (!text || /[\r\n]/.test(text)) throw new Error(label + ' is missing or invalid');
  return text;
}

function requiredPaidTimestamp_(value, label) {
  const text = requiredPaidText_(value, label);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(text) || !Number.isFinite(Date.parse(text))) {
    throw new Error(label + ' must be a UTC ISO timestamp');
  }
  return text;
}

function nonnegativePaidCents_(value, label) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(label + ' must be nonnegative whole cents');
  return value;
}

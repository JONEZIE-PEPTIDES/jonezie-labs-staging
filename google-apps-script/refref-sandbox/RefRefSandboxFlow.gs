// Owner-run Sandbox workflow. Never expose these functions as a public web app.
// The owner verifies paid Square facts and customer history before each call.
const JONEZIE_REFREF_API = 'https://api.refref.ai';

function recordJoneziePaidInvoiceSandbox(input) {
  const event = buildJoneziePaidInvoiceEvent(input);
  const history = buildJoneziePaidHistory(input);
  // The first review supplies the customer's paid history for first-order
  // eligibility. Subsequent verified purchases already have a prior paid order.
  const recorded = jonezieRefRefRequest_('post', '/v1/track/events', event);
  if (!recorded.eventId) throw new Error('RefRef did not return a purchase event ID');
  try {
    if (!(input.priorHistorySubmitted === true && input.sourceOrderIndex > 1)) {
      jonezieRefRefRequest_('post', '/v1/evidence/paid-history', history);
    }
  } catch (error) {
    // Keep the event ID so an owner can inspect the partial submission. Never
    // automatically send the purchase again after a paid-history failure.
    error.jonezieEventId = recorded.eventId;
    throw error;
  }
  return {
    invoiceId: input.invoiceId,
    eventId: recorded.eventId,
    processingState: recorded.processingState || 'unknown'
  };
}

// Run only after RefRef has earned the reward. If RefRef evaluation is still
// pending, this function fails without granting credit. A repeated grant uses
// the Reward ID as its ledger idempotency key.
function grantJonezieConfirmedRewardSandbox(input) {
  if (!input || input.fullyPaidVerified !== true) {
    throw new Error('Fully paid Square invoice must be verified');
  }
  const rewardId = requiredPaidText_(input.rewardId, 'RefRef reward ID');
  const reward = jonezieRefRefRequest_(
    'get', '/v1/rewards/' + encodeURIComponent(rewardId) +
      '?projectId=' + encodeURIComponent(JONEZIE_REFREF_SANDBOX_PROJECT)
  );
  const grant = buildJonezieConfirmedCreditGrant(Object.assign({}, input, { reward }));
  if (input.expectedAmountCents !== undefined && grant.amountCents !== input.expectedAmountCents) {
    throw new Error('RefRef reward changed before approval');
  }
  const result = jonezieCreditGrant(grant);
  // Record that Jonezie delivered the store credit after the ledger write.
  // If this call fails, rerunning is safe: the ledger grant is idempotent.
  jonezieRefRefRequest_('post', '/v1/rewards/' + encodeURIComponent(rewardId) +
    '/fulfillment', {
    projectId: JONEZIE_REFREF_SANDBOX_PROJECT,
    externalReference: result.entryKey
  });
  return { rewardId, entryKey: result.entryKey, duplicate: result.duplicate,
    amountCents: grant.amountCents, balance: result.balance };
}

// One owner action after checking the Square invoice and the customer's full
// paid history. RefRef can evaluate rewards asynchronously, so a pending result
// is normal; rerun reconcileJoneziePaidInvoiceSandbox with the returned event ID.
function completeJoneziePaidInvoiceSandbox(input) {
  requiredPaidText_(input && input.partnerCode, 'Partner code');
  requiredPaidText_(input && input.refCode, 'RefRef tracking code');
  const recorded = recordJoneziePaidInvoiceSandbox(input);
  return reconcileJoneziePaidInvoiceSandbox({
    fullyPaidVerified: input.fullyPaidVerified,
    invoiceId: input.invoiceId,
    eventId: recorded.eventId,
    sourceOrderIndex: input.sourceOrderIndex,
    commissionableCents: input.commissionableCents,
    partnerCode: input.partnerCode,
    verifiedBy: input.verifiedBy
  });
}

function reconcileJoneziePaidInvoiceSandbox(input) {
  if (!input || input.fullyPaidVerified !== true) {
    throw new Error('Fully paid Square invoice must be verified');
  }
  const eventId = requiredPaidText_(input.eventId, 'RefRef event ID');
  const invoiceId = requiredPaidText_(input.invoiceId, 'Square invoice ID');
  const partnerCode = requiredPaidText_(input.partnerCode, 'Partner code');
  const verifiedBy = requiredPaidText_(input.verifiedBy, 'Verifier');
  if (!Number.isSafeInteger(input.sourceOrderIndex) || input.sourceOrderIndex < 1) {
    throw new Error('Verified customer paid-order number is required');
  }
  const commissionable = nonnegativePaidCents_(input.commissionableCents, 'Commissionable merchandise');
  const expectedAmounts = (input.sourceOrderIndex === 1 ? [7, 13] : [7])
    .map((percent) => Math.round(commissionable * percent / 100))
    .filter((amount) => amount > 0);
  const expectedRewardCount = expectedAmounts.length;
  let cursor = '';
  let pageCount = 0;
  const matching = [];
  const seenRewardIds = new Set();
  do {
    const path = '/v1/rewards?projectId=' + encodeURIComponent(JONEZIE_REFREF_SANDBOX_PROJECT) +
      '&limit=100' + (cursor ? '&after=' + encodeURIComponent(cursor) : '');
    const page = jonezieRefRefRequest_('get', path);
    if (!Array.isArray(page.rewards)) throw new Error('RefRef reward list is invalid');
    page.rewards.forEach((reward) => {
      if (reward.eventId === eventId && reward.beneficiaryRole === 'referrer' &&
          reward.benefitKind === 'cash' && reward.void == null &&
          !seenRewardIds.has(reward.id)) {
        matching.push(reward);
        seenRewardIds.add(reward.id);
      }
    });
    cursor = page.next || '';
    if (++pageCount > 100) throw new Error('RefRef reward list exceeded the review limit');
  } while (cursor);

  const remainingAmounts = expectedAmounts.slice();
  const eligible = matching.map((reward) => {
    if (!['pending', 'fulfilled'].includes(reward.fulfillmentStatus)) {
      throw new Error('Matching RefRef reward is not ready for Jonezie Cash');
    }
    const amount = Number(reward.money?.netAmountMinor);
    const match = remainingAmounts.indexOf(amount);
    if (match < 0) throw new Error('RefRef reward does not match the approved rate and paid merchandise');
    remainingAmounts.splice(match, 1);
    return { reward, amount };
  });
  const grants = eligible.map(({ reward, amount }) => {
    return grantJonezieConfirmedRewardSandbox({
      fullyPaidVerified: true, invoiceId, eventId, partnerCode, verifiedBy,
      partnerId: requiredPaidText_(reward.beneficiary?.partnerId, 'RefRef partner ID'),
      rewardId: requiredPaidText_(reward.id, 'RefRef reward ID'),
      expectedAmountCents: amount
    });
  });
  return {
    invoiceId, eventId,
    status: matching.length >= expectedRewardCount ? 'credited' :
      matching.length ? 'partial_refref' : 'pending_refref',
    expectedRewardCount, grants
  };
}

function jonezieRefRefRequest_(method, path, body) {
  const key = PropertiesService.getScriptProperties().getProperty('REFREF_SANDBOX_API_KEY');
  if (!key) throw new Error('Missing Sandbox RefRef API key');
  const options = {
    method,
    headers: { 'X-Api-Key': key },
    muteHttpExceptions: true
  };
  if (body) {
    options.contentType = 'application/json';
    options.payload = JSON.stringify(body);
  }
  const response = UrlFetchApp.fetch(JONEZIE_REFREF_API + path, options);
  if (response.getResponseCode() !== 200) {
    throw new Error('RefRef ' + method.toUpperCase() + ' ' + path.split('?')[0] +
      ' returned HTTP ' + response.getResponseCode());
  }
  return JSON.parse(response.getContentText());
}

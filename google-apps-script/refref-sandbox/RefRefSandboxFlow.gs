// Owner-run Sandbox workflow. Never expose these functions as a public web app.
// The owner verifies paid Square facts and customer history before each call.
const JONEZIE_REFREF_API = 'https://api.refref.ai';

function recordJoneziePaidInvoiceSandbox(input) {
  const event = buildJoneziePaidInvoiceEvent(input);
  const history = buildJoneziePaidHistory(input);
  // The purchase creates the participant; paid history completes reward evaluation.
  const recorded = jonezieRefRefRequest_('post', '/v1/track/events', event);
  jonezieRefRefRequest_('post', '/v1/evidence/paid-history', history);
  if (!recorded.eventId) throw new Error('RefRef did not return a purchase event ID');
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
  const result = jonezieCreditGrant(grant);
  // Record that Jonezie delivered the store credit after the ledger write.
  // If this call fails, rerunning is safe: the ledger grant is idempotent.
  jonezieRefRefRequest_('post', '/v1/rewards/' + encodeURIComponent(rewardId) +
    '/fulfillment', {
    projectId: JONEZIE_REFREF_SANDBOX_PROJECT,
    externalReference: result.entryKey
  });
  return { rewardId, entryKey: result.entryKey, duplicate: result.duplicate,
    balance: result.balance };
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

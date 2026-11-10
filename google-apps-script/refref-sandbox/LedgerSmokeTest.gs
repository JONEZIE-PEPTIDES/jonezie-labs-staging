// Synthetic, private sandbox check. No real invoice or partner is used.
function runJonezieCashSandboxSmokeTest() {
  const prefix = 'sandbox-credit-smoke-' + Date.now();
  const partnerId = prefix + '-partner';
  const partnerCode = 'ZLEONARD-TEST';
  const paidInvoiceId = prefix + '-paid-invoice';
  const redemptionInvoiceId = prefix + '-redemption-invoice';
  const rewardId = prefix + '-reward';
  const verifiedBy = 'Jonezie sandbox smoke test';

  const grant = jonezieCreditGrant({
    partnerId, partnerCode, invoiceId: paidInvoiceId,
    rewardId, amountCents: 2000, verifiedBy
  });
  if (grant.balance.availableCents !== 2000) throw new Error('Grant balance mismatch');

  const redemption = jonezieCreditRedeem({
    partnerId, partnerCode, invoiceId: redemptionInvoiceId,
    amountCents: 1200, verifiedBy
  });
  if (redemption.balance.availableCents !== 800) throw new Error('Redemption balance mismatch');

  const released = jonezieCreditReleaseRedemption({
    relatedEntryKey: 'redeem:' + redemptionInvoiceId, verifiedBy
  });
  if (released.balance.availableCents !== 2000) throw new Error('Release balance mismatch');

  const reversed = jonezieCreditReverseGrant({
    relatedEntryKey: 'grant:' + rewardId, verifiedBy
  });
  if (reversed.balance.availableCents !== 0) throw new Error('Reversal balance mismatch');

  const summary = {
    partnerId,
    grantCents: 2000,
    redemptionCents: 1200,
    finalAvailableCents: jonezieCreditBalance(partnerId).availableCents,
    ledgerSheetId: PropertiesService.getScriptProperties().getProperty(JONEZIE_CREDIT_SHEET_PROPERTY)
  };
  if (!summary.ledgerSheetId) throw new Error('Private ledger sheet was not created');
  Logger.log(JSON.stringify(summary));
  return summary;
}

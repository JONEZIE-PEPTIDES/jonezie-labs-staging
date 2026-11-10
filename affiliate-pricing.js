(function (root, factory) {
  const pricing = factory();
  if (typeof module === 'object' && module.exports) module.exports = pricing;
  if (root) root.JONEZIE_AFFILIATE_PRICING = pricing;
})(typeof window !== 'undefined' ? window : null, function () {
  const PARTNER_DISCOUNT_BPS = 3000;
  const FIRST_PAID_ORDER_REWARD_BPS = 2000;
  const REPEAT_PAID_ORDER_REWARD_BPS = 700;
  const FREE_GROUND_THRESHOLD_CENTS = 15000;

  function nonnegativeCents(value) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 0) throw new RangeError('Expected nonnegative cents');
    return number;
  }

  function percentCents(amountCents, basisPoints) {
    return Math.round(nonnegativeCents(amountCents) * basisPoints / 10000);
  }

  function quote({ subtotalCents, shippingMethodId, shippingCostCents, creditRequestedCents = 0 }) {
    const subtotal = nonnegativeCents(subtotalCents);
    const standardShipping = nonnegativeCents(shippingCostCents);
    const requestedCredit = nonnegativeCents(creditRequestedCents);
    const discountCents = percentCents(subtotal, PARTNER_DISCOUNT_BPS);
    const discountedMerchandiseCents = subtotal - discountCents;
    const freeGroundShipping = shippingMethodId === 'ground-advantage'
      && discountedMerchandiseCents >= FREE_GROUND_THRESHOLD_CENTS;
    const shippingCents = freeGroundShipping ? 0 : standardShipping;
    const creditAppliedCents = Math.min(requestedCredit, discountedMerchandiseCents + shippingCents);
    const amountToInvoiceCents = discountedMerchandiseCents + shippingCents - creditAppliedCents;
    // Credit is applied to merchandise first for partner-reward accounting.
    const commissionableCents = Math.max(0, discountedMerchandiseCents - creditAppliedCents);

    return {
      subtotalCents: subtotal,
      discountCents,
      discountedMerchandiseCents,
      freeGroundShipping,
      shippingCents,
      creditAppliedCents,
      amountToInvoiceCents,
      commissionableCents
    };
  }

  function rewardCents(commissionableCents, firstPaidOrder) {
    return percentCents(commissionableCents,
      firstPaidOrder ? FIRST_PAID_ORDER_REWARD_BPS : REPEAT_PAID_ORDER_REWARD_BPS);
  }

  return {
    PARTNER_DISCOUNT_BPS,
    FIRST_PAID_ORDER_REWARD_BPS,
    REPEAT_PAID_ORDER_REWARD_BPS,
    FREE_GROUND_THRESHOLD_CENTS,
    percentCents,
    quote,
    rewardCents
  };
});

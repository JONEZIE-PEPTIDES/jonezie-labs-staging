(function polishCheckoutSuccess() {
  if (typeof renderSubmittedOrder !== 'function') return;

  renderSubmittedOrder = function renderSubmittedOrder() {
    if (!cartRoot || !submittedOrderSnapshot) return;

    renderSummaryValues(submittedOrderSnapshot);
    const customerName = submittedOrderSnapshot.customerName || 'there';
    const firstName = customerName.split(' ').filter(Boolean)[0] || customerName;
    const shippingParts = String(submittedOrderSnapshot.shippingLabel || 'Shipping pending')
      .split('|')
      .map((part) => part.trim())
      .filter(Boolean);
    const shippingMethod = shippingParts[0] || 'Shipping pending';
    const shippingWindow = shippingParts[1] || 'Invoice follow-up pending';
    const orderLines = submittedOrderSnapshot.items.map((item) => `
      <li>
        <span>${escapeHtml(item.name)} | ${escapeHtml(item.mgOption)} | ${escapeHtml(item.packLabel)} | Qty ${item.quantity}</span>
        <strong>${escapeHtml(item.lineTotalDisplay)}</strong>
      </li>`).join('');

    cartRoot.innerHTML = `
      <div class="checkout-complete-card">
        <div class="checkout-complete-hero">
          <div class="checkout-complete-icon" aria-hidden="true">&#10003;</div>
          <div>
            <h2>Order request received.</h2>
            <p class="checkout-complete-thanks">Thanks, ${escapeHtml(firstName)} - we're reviewing your order now.</p>
            <p>No payment was collected on this page. Once your order is reviewed and confirmed, Jonezie Labs will email a secure Stripe invoice to the email address on your order. Please check your inbox and spam folder.</p>
          </div>
        </div>

        <div class="checkout-invoice-alert">
          <span>48 HR</span>
          <div>
            <strong>Invoice must be paid before your order ships.</strong>
            <p>Unpaid order requests automatically cancel after 48 hours.</p>
          </div>
        </div>

        <div class="checkout-complete-request">
          <div>
            <span class="checkout-complete-label">Shipping</span>
            <strong>${escapeHtml(shippingMethod)}</strong>
            <p>${escapeHtml(shippingWindow)}</p>
          </div>
          <div>
            <span class="checkout-complete-label">Estimated Total</span>
            <strong>${escapeHtml(formatMoney(submittedOrderSnapshot.total))}</strong>
            <p>Final confirmation arrives by email.</p>
          </div>
        </div>

        <div class="checkout-complete-order">
          <span class="checkout-complete-label">Your Request</span>
          <ul class="checkout-complete-list">${orderLines}</ul>
        </div>

        <h3>What happens next</h3>
        <div class="checkout-next-grid">
          <article><span>1</span><strong>Review</strong><p>We confirm your order request.</p></article>
          <article><span>2</span><strong>Invoice</strong><p>We email your Stripe invoice link.</p></article>
          <article><span>3</span><strong>Payment</strong><p>You pay the secure invoice.</p></article>
          <article><span>4</span><strong>Ship</strong><p>Tracking is sent after label creation.</p></article>
        </div>

        <div class="checkout-complete-actions">
          <a class="button primary" href="catalog.html">Continue Shopping</a>
          <a class="button secondary" href="mailto:orders@jonezielabs.com?subject=Order%20request%20help">Need Help?</a>
        </div>
      </div>`;
  };

  if (successCard) {
    const observer = new MutationObserver(() => {
      if (!submittedOrderSnapshot || successCard.dataset.polishedSuccess === 'true') return;
      successCard.dataset.polishedSuccess = 'true';
      successCard.innerHTML = '<h2>Reminder</h2><p>Please check your inbox and spam folder for your Stripe invoice. No payment was collected at checkout.</p>';
    });
    observer.observe(successCard, { childList: true, subtree: true });
  }
})();

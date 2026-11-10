const ADMIN_EMAIL = 'orders@jonezielabs.com';
const BACKUP_ADMIN_EMAIL = 'jonezielabs@gmail.com';
const FROM_NAME = 'Jonezie Labs';
const REPLY_TO_EMAIL = 'orders@jonezielabs.com';
const LEAD_SHEET_NAME = 'Jonezie Lead Capture Log';
const LEAD_SHEET_PROPERTY = 'JONEZIE_LEAD_CAPTURE_SHEET_ID';
const PARTNER_ORDER_SHEET_PROPERTY = 'JONEZIE_PARTNER_ORDER_SHEET_ID';
const PARTNER_ORDER_HEADERS = [
  'Requested At', 'Order ID', 'Customer Email', 'Partner Code', 'Referral Handle',
  'Discounted Merchandise', 'Credit Requested', 'Review Status', 'Square Invoice ID',
  'Paid At', 'Paid Merchandise', 'Paid Total', 'Prior Paid Invoice IDs',
  'First Paid Order Verified', 'RefRef Event ID', 'Jonezie Cash Granted',
  'Jonezie Cash Redeemed', 'RefRef Tracking Code'
];
const LEAD_SHEET_HEADERS = [
  'Captured At',
  'Email',
  'Phone',
  'Source',
  'Trigger',
  'Page',
  'Referrer',
  'Timezone',
  'Locale',
  'User Agent'
];

function doGet() {
  return ContentService
    .createTextOutput('Jonezie Labs order request endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function doPost(event) {
  try {
    const payload = JSON.parse((event.postData && event.postData.contents) || '{}');
    if (isLeadCapturePayload(payload)) {
      return handleLeadCapture(payload);
    }

    const customerEmail = getValue(payload, ['customer', 'email']);
    const orderId = payload.orderId || 'Order request';
    const customerName = getValue(payload, ['customer', 'name']) || 'Customer';
    let partnerOrderLog = null;
    if (payload.partnerOffer || payload.referralHandle || payload.creditRequest) {
      try {
        partnerOrderLog = appendPartnerOrderRequest(payload);
      } catch (error) {
        partnerOrderLog = { ok: false, error: String(error) };
      }
    }

    MailApp.sendEmail({
      to: `${ADMIN_EMAIL},${BACKUP_ADMIN_EMAIL}`,
      subject: `New Jonezie order request - ${customerName} - ${orderId}`,
      body: buildAdminEmail(payload, partnerOrderLog),
      name: FROM_NAME,
      replyTo: customerEmail || REPLY_TO_EMAIL
    });

    if (customerEmail) {
      MailApp.sendEmail({
        to: customerEmail,
        cc: ADMIN_EMAIL,
        bcc: BACKUP_ADMIN_EMAIL,
        subject: `Jonezie Labs order request received - ${orderId}`,
        body: buildCustomerEmail(payload),
        name: FROM_NAME,
        replyTo: REPLY_TO_EMAIL
      });
    }

    return jsonResponse({
      ok: true,
      orderId
    });
  } catch (error) {
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: 'Jonezie order request endpoint error',
      body: error && error.stack ? error.stack : String(error),
      name: FROM_NAME,
      replyTo: REPLY_TO_EMAIL
    });

    return jsonResponse({
      ok: false
    });
  }
}

function isLeadCapturePayload(payload) {
  return Boolean(payload)
    && Boolean(payload.email)
    && !Array.isArray(payload.items)
    && !payload.customer;
}

function handleLeadCapture(payload) {
  const email = String(payload.email || '').trim();
  const source = String(payload.source || 'Site capture').trim();
  const trigger = String(payload.trigger || 'Manual').trim();
  let sheetLog = null;

  try {
    sheetLog = appendLeadCaptureRow(payload);
  } catch (error) {
    sheetLog = {
      ok: false,
      error: error && error.stack ? error.stack : String(error)
    };
  }

  MailApp.sendEmail({
    to: `${ADMIN_EMAIL},${BACKUP_ADMIN_EMAIL}`,
    subject: `New Jonezie email signup - ${email}`,
    body: buildLeadCaptureAdminEmail(payload, sheetLog),
    name: FROM_NAME,
    replyTo: email || REPLY_TO_EMAIL
  });

  return jsonResponse({
    ok: true,
    type: 'lead-capture',
    email,
    source,
    trigger,
    sheetLog: sheetLog && sheetLog.ok ? 'saved' : 'not-saved'
  });
}

function appendLeadCaptureRow(payload) {
  const spreadsheet = getLeadCaptureSpreadsheet();
  const sheet = getOrCreateLeadCaptureSheet(spreadsheet);
  ensureLeadCaptureHeaders(sheet);
  sheet.appendRow([
    payload.capturedAt || new Date().toISOString(),
    payload.email || '',
    payload.phone || '',
    payload.source || 'Site capture',
    payload.trigger || 'Manual',
    payload.page || '',
    payload.referrer || '',
    payload.timezone || '',
    payload.locale || '',
    payload.userAgent || ''
  ]);

  return {
    ok: true,
    spreadsheetId: spreadsheet.getId(),
    url: spreadsheet.getUrl()
  };
}

function getLeadCaptureSpreadsheet() {
  const properties = PropertiesService.getScriptProperties();
  const existingId = properties.getProperty(LEAD_SHEET_PROPERTY);
  if (existingId) {
    try {
      return SpreadsheetApp.openById(existingId);
    } catch (error) {
      properties.deleteProperty(LEAD_SHEET_PROPERTY);
    }
  }

  const spreadsheet = SpreadsheetApp.create(LEAD_SHEET_NAME);
  properties.setProperty(LEAD_SHEET_PROPERTY, spreadsheet.getId());
  return spreadsheet;
}

function getOrCreateLeadCaptureSheet(spreadsheet) {
  return spreadsheet.getSheetByName('Signups') || spreadsheet.insertSheet('Signups');
}

function appendPartnerOrderRequest(payload) {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheet;
  const existingId = properties.getProperty(PARTNER_ORDER_SHEET_PROPERTY);
  if (existingId) spreadsheet = SpreadsheetApp.openById(existingId);
  else {
    spreadsheet = SpreadsheetApp.create('Jonezie Partner Orders');
    properties.setProperty(PARTNER_ORDER_SHEET_PROPERTY, spreadsheet.getId());
  }
  const sheet = spreadsheet.getSheetByName('Order Requests') || spreadsheet.insertSheet('Order Requests');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(PARTNER_ORDER_HEADERS);
    sheet.setFrozenRows(1);
  }
  const totals = payload.totals || {};
  const merchandise = Number(totals.subtotal || 0) - Number(totals.discount || 0);
  sheet.appendRow([
    payload.requestedAt || new Date().toISOString(),
    payload.orderId || '',
    getValue(payload, ['customer', 'email']) || '',
    getValue(payload, ['partnerOffer', 'code']) || '',
    payload.referralHandle || '',
    Math.round(merchandise * 100) / 100,
    Number(getValue(payload, ['creditRequest', 'amountRequested']) || 0),
    'Awaiting owner review', '', '', '', '', '', '', '', '', '',
    getValue(payload, ['partnerOffer', 'refCode']) || ''
  ]);
  return { ok: true, url: spreadsheet.getUrl() };
}

function ensureLeadCaptureHeaders(sheet) {
  const currentHeaders = sheet
    .getRange(1, 1, 1, LEAD_SHEET_HEADERS.length)
    .getValues()[0];
  const hasHeaders = currentHeaders.some((value) => String(value || '').trim());
  if (!hasHeaders) {
    sheet.getRange(1, 1, 1, LEAD_SHEET_HEADERS.length).setValues([LEAD_SHEET_HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function buildLeadCaptureAdminEmail(payload, sheetLog) {
  const lines = [
    'New Jonezie email signup',
    '',
    `Email: ${payload.email || 'Not provided'}`,
    `Phone: ${payload.phone || 'Not provided'}`,
    `Source: ${payload.source || 'Site capture'}`,
    `Trigger: ${payload.trigger || 'Manual'}`,
    `Page: ${payload.page || 'Not provided'}`,
    `Referrer: ${payload.referrer || 'None'}`,
    `Captured At: ${payload.capturedAt || new Date().toISOString()}`,
    `Timezone: ${payload.timezone || 'Not provided'}`,
    `Locale: ${payload.locale || 'Not provided'}`,
    '',
    `Sheet Log: ${sheetLog && sheetLog.ok ? `Saved to ${sheetLog.url}` : 'Not saved'}`,
    ...(sheetLog && !sheetLog.ok ? [`Sheet Log Error: ${sheetLog.error}`] : []),
    '',
    'RAW LEAD PAYLOAD',
    JSON.stringify(payload, null, 2)
  ];

  return lines.join('\n');
}

function buildAdminEmail(payload, partnerOrderLog) {
  const customer = payload.customer || {};
  const totals = payload.totals || {};
  const shippingMethod = payload.shippingMethod || null;
  const items = Array.isArray(payload.items) ? payload.items : [];
  const included = Array.isArray(payload.includedWithOrder)
    ? payload.includedWithOrder.filter((item) => !/hot girl summer sticker/i.test(String(item || '')))
    : [];
  const customerName = customer.name || [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Not provided';
  const shippingAddress = customer.shippingAddress || [
    customer.shippingStreetAddress,
    [customer.shippingCity, customer.shippingState].filter(Boolean).join(', '),
    customer.shippingZip
  ].filter(Boolean).join(' ') || 'Not provided';
  const lines = [
    'New Jonezie order request',
    '',
    `Order ID: ${payload.orderId || 'Not provided'}`,
    `Submitted At: ${payload.requestedAt || new Date().toISOString()}`,
    '',
    'CUSTOMER INFO',
    `Name: ${customerName}`,
    `Email: ${customer.email || 'Not provided'}`,
    `Phone: ${customer.phone || customer.phoneDigits || 'Not provided'}`,
    '',
    'SHIP TO',
    `Street Address: ${customer.shippingStreetAddress || 'Not provided'}`,
    `City: ${customer.shippingCity || 'Not provided'}`,
    `State: ${customer.shippingState || 'Not provided'}`,
    `ZIP Code: ${customer.shippingZip || 'Not provided'}`,
    `Full Shipping Address: ${shippingAddress}`,
    '',
    'ORDER DETAILS',
    `Customer: ${customerName}`,
    `Email: ${customer.email || 'Not provided'}`,
    `Phone: ${customer.phone || 'Not provided'}`,
    '',
    'Shipping',
    `Street Address: ${customer.shippingStreetAddress || 'Not provided'}`,
    `City: ${customer.shippingCity || 'Not provided'}`,
    `State: ${customer.shippingState || 'Not provided'}`,
    `ZIP Code: ${customer.shippingZip || 'Not provided'}`,
    `Shipping Address: ${customer.shippingAddress || 'Not provided'}`,
    `Shipping Method: ${formatShippingMethod(shippingMethod)}`,
    '',
    `Promo Code: ${payload.promoCode || 'None'}`,
    ...(payload.partnerOffer ? [
      `Partner Code: ${payload.partnerOffer.code || 'Not provided'}`,
      `RefRef Tracking Code: ${payload.partnerOffer.refCode || 'Not provided'}`,
      'Partner offer: verify active code and 30% discount before creating the invoice.',
      'Partner credit: issue only after the Square invoice is fully paid.'
    ] : []),
    ...(payload.referralHandle ? [
      'Partner referral link: captured with this request; reconcile with the paid Square invoice before recording a RefRef purchase.'
    ] : []),
    ...(partnerOrderLog ? [
      `Partner order log: ${partnerOrderLog.ok ? partnerOrderLog.url : 'Could not save; use this email as the record'}`,
      ...(partnerOrderLog.ok ? [] : [`Partner order log error: ${partnerOrderLog.error}`])
    ] : []),
    ...(payload.creditRequest ? [
      `Jonezie Cash code: ${payload.creditRequest.code || 'Not provided'}`,
      `Jonezie Cash requested: ${payload.creditRequest.amountRequestedDisplay || '$0.00'}`,
      'Verify the available credit balance and mark the redemption before sending the Square invoice.'
    ] : []),
    '',
    'Order items:'
  ];

  if (items.length) {
    items.forEach((item) => {
      lines.push(`- ${item.name || 'Product'} | ${item.mgOption || 'Option'} | ${item.packLabel || 'Pack'} | ${item.inventoryStatus || 'Status pending'} | Qty ${item.quantity || 1} | ${item.unitPriceDisplay || ''} each | ${item.lineTotalDisplay || ''} total`);
    });
  } else {
    lines.push('- No items received');
  }

  lines.push('');
  lines.push(`Subtotal: ${totals.subtotalDisplay || '$0.00'}`);
  lines.push(`Discount: ${payload.promoCode ? `${totals.discountDisplay || '$0.00'} (${payload.promoCode})` : '$0.00'}`);
  lines.push(`Shipping: ${shippingMethod ? `${totals.shippingDisplay || '$0.00'} (${shippingMethod.label || 'Shipping'})` : '$0.00'}`);
  if (payload.creditRequest) lines.push(`Jonezie Cash requested: ${totals.creditRequestedDisplay || '$0.00'} (pending verification)`);
  lines.push(`Estimated Total: ${totals.estimatedTotalDisplay || '$0.00'}`);
  lines.push('');
  lines.push(`Included with order: ${included.length ? included.join(' + ') : 'None listed'}`);
  lines.push('');
  lines.push(`Notes: ${payload.notes || 'None'}`);
  lines.push('');
  lines.push('Invoice note: Review the order, then email a secure Square invoice. Payment must be completed before shipment.');
  lines.push('');
  lines.push('RAW CHECKOUT PAYLOAD');
  lines.push(JSON.stringify(payload, null, 2));

  return lines.join('\n');
}

function buildCustomerEmail(payload) {
  const customer = payload.customer || {};
  const totals = payload.totals || {};
  const items = Array.isArray(payload.items) ? payload.items : [];
  const included = Array.isArray(payload.includedWithOrder)
    ? payload.includedWithOrder.filter((item) => !/hot girl summer sticker/i.test(String(item || '')))
    : [];
  const firstName = customer.firstName || customer.name || 'there';
  const lines = [
    `Hi ${firstName},`,
    '',
    'We received your Jonezie Labs order request and will review it shortly. If everything looks good, your next email will include a secure Square, Inc. invoice link for payment.',
    '',
    `Order ID: ${payload.orderId || 'Not provided'}`,
    `Estimated Total: ${totals.estimatedTotalDisplay || '$0.00'}`,
    ...(payload.creditRequest ? [`Jonezie Cash requested: ${payload.creditRequest.amountRequestedDisplay || '$0.00'} (pending verification before invoicing)`] : []),
    `Shipping Method: ${formatShippingMethod(payload.shippingMethod)}`,
    '',
    'Order items:'
  ];

  if (items.length) {
    items.forEach((item) => {
      lines.push(`- ${item.name || 'Product'} | ${item.mgOption || 'Option'} | ${item.packLabel || 'Pack'} | Qty ${item.quantity || 1} | ${item.lineTotalDisplay || ''}`);
    });
  } else {
    lines.push('- No items received');
  }

  lines.push('');
  lines.push(`Included with order: ${included.length ? included.join(' + ') : 'None listed'}`);
  lines.push('');
  lines.push('This is an order request confirmation, not a payment receipt. Your order is not confirmed for shipment until the invoice is paid.');
  lines.push('');
  lines.push('Please check your inbox and spam folder for the next two follow-up emails:');
  lines.push('1. Your invoice email with the Square, Inc. payment link.');
  lines.push('2. After payment, your order photo and USPS or UPS tracking link.');
  lines.push('');
  lines.push('Because those emails contain payment and tracking links, they can sometimes land in spam.');
  lines.push('');
  lines.push('Jonezie Labs');

  return lines.join('\n');
}

function formatShippingMethod(shippingMethod) {
  if (!shippingMethod) return 'Not selected';
  return [
    shippingMethod.label || '',
    shippingMethod.window || '',
    shippingMethod.costDisplay || ''
  ].filter(Boolean).join(' | ') || 'Not selected';
}

function getValue(source, path) {
  return path.reduce((value, key) => value && value[key], source) || '';
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

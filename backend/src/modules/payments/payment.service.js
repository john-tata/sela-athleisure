const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');
const crypto = require('crypto');
const orderService = require('../orders/order.service');

let paystack;
try {
  const Paystack = require('paystack-api')(process.env.PAYSTACK_SECRET_KEY);
  paystack = Paystack;
} catch {
  // paystack-api may not be installed; we'll build raw REST calls as fallback
}

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = 'https://api.paystack.co';

/**
 * Make authenticated request to Paystack API
 */
async function paystackRequest(endpoint, options = {}) {
  const url = `${PAYSTACK_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!data.status) {
    throw new AppError(data.message || 'Paystack error', 400, 'PAYSTACK_ERROR');
  }
  return data;
}

/**
 * Initialize Paystack payment
 */
async function initializePayment(order, email) {
  if (!email) {
    throw new AppError('Email is required for payment', 400, 'VALIDATION_ERROR');
  }

  const amountInKobo = Math.round(order.total * 100);
  const callbackUrl = `${process.env.FRONTEND_URL}/checkout/verify`;

  const payload = {
    email,
    amount: amountInKobo,
    reference: order.order_number,
    callback_url: callbackUrl,
    metadata: {
      order_id: order.id,
      order_number: order.order_number,
      customer_email: email,
    },
  };

  // Use SDK if available, otherwise raw fetch
  if (paystack && paystack.transaction && paystack.transaction.initialize) {
    const result = await paystack.transaction.initialize(payload);
    return {
      authorizationUrl: result.data.authorization_url,
      reference: result.data.reference,
      accessCode: result.data.access_code,
    };
  }

  const result = await paystackRequest('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return {
    authorizationUrl: result.data.authorization_url,
    reference: result.data.reference,
    accessCode: result.data.access_code,
  };
}

/**
 * Verify Paystack payment
 */
async function verifyPayment(reference) {
  if (!reference) {
    throw new AppError('Payment reference is required', 400, 'VALIDATION_ERROR');
  }

  let result;

  if (paystack && paystack.transaction && paystack.transaction.verify) {
    result = await paystack.transaction.verify({ reference });
  } else {
    result = await paystackRequest(`/transaction/verify/${encodeURIComponent(reference)}`, {
      method: 'GET',
    });
  }

  const paymentData = result.data;

console.log("PAYSTACK VERIFY:", paymentData);

  // Update order payment status based on verification
if (paymentData.status === 'success') {
  const { data, error } = await supabaseAdmin
  .from('orders')
  .update({
    payment_status: 'paid',
    status: 'confirmed',
    paystack_reference: paymentData.reference,
  })
  .eq('order_number', paymentData.reference)
  .select();

console.log("UPDATED ORDER:", data);
console.log("UPDATE ERROR:", error);

  const { data: order } = await supabaseAdmin
    .from('orders')
    .select('id')
    .eq('order_number', paymentData.reference)
    .single();

  if (order) {
    await orderService.reduceInventory(order.id);
  }

} else {
  await supabaseAdmin
    .from('orders')
    .update({
      payment_status: 'failed',
    })
    .eq('order_number', paymentData.reference);
}

  return paymentData;
}

/**
 * Handle Paystack webhook
 */
async function handleWebhook(event, signature) {
  // Verify HMAC-SHA512 signature
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(event, 'utf8')
    .digest('hex');

  if (hash !== signature) {
    throw new AppError('Invalid webhook signature', 400, 'INVALID_SIGNATURE');
  }

  const payload = JSON.parse(event);
  const eventType = payload.event;
  const data = payload.data;

  if (eventType === 'charge.success') {
    await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        status: 'confirmed',
        paid_at: data.paid_at,
      })
      .eq('order_number', data.reference);

    return { status: 'paid', reference: data.reference };
  }
const { data: order } = await supabaseAdmin
  .from('orders')
  .select('id')
  .eq('order_number', paymentData.reference)
  .single();

if (order) {
  await orderService.reduceInventory(order.id);
}
  if (eventType === 'charge.failed') {
    await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'failed',
      })
      .eq('order_number', data.reference);

    return { status: 'failed', reference: data.reference };
  }

  return { status: 'ignored', event: eventType };
}

module.exports = {
  initializePayment,
  verifyPayment,
  handleWebhook,
};

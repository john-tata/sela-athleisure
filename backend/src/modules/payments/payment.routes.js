const express = require('express');
const router = express.Router();
const { z } = require('zod');
const paymentService = require('./payment.service');
const validate = require('../../middleware/validate');
const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

// NOTE: The /webhook endpoint is registered directly in server.js
// (before express.json()) to receive the raw body for signature verification.

// POST /api/v1/payments/initialize - initialize Paystack payment
const initializeSchema = z.object({
  orderId: z.string().uuid(),
  email: z.string().email(),
});

router.post('/initialize', validate(initializeSchema), async (req, res, next) => {
  try {
    const { orderId, email } = req.body;

    // Fetch order
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      throw new AppError('Order not found', 404, 'NOT_FOUND');
    }

    const result = await paymentService.initializePayment(order, email);

    res.json({
      status: 'success',
      data: result,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/payments/verify/:reference - verify payment after callback
router.get('/verify/:reference', async (req, res, next) => {
  try {
    const { reference } = req.params;
    const paymentData = await paymentService.verifyPayment(reference);

    res.json({
      status: 'success',
      data: paymentData,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

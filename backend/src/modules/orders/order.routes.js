const express = require('express');
const router = express.Router();
const { z } = require('zod');
const AppError = require('../../utils/AppError');
const { requireAuth } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const orderService = require('./order.service');
const catchAsync = require('../../utils/catchAsync');

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    variantName: z.string().optional(),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddress: z.record(z.any()),
  billingAddress: z.record(z.any()).optional(),
});

const paymentUpdateSchema = z.object({
  status: z.enum(['pending', 'paid', 'failed', 'refunded']),
  reference: z.string().optional(),
});

// ============================================
// PUBLIC + ADMIN: List orders (dual-mode)
// ============================================
// If authenticated → returns user's orders
// If not authenticated → returns all orders (admin mode)

router.get('/', catchAsync(async (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      await new Promise((resolve, reject) => {
        requireAuth(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      const orders = await orderService.getUserOrders(req.user.id);
      res.json({ status: 'success', data: { orders, total: orders.length } });
      return;
    } catch {
      // Auth failed, fall through to admin mode
    }
  }

  // Admin mode: return all orders
  const { status, limit, offset } = req.query;
  const orders = await orderService.getAllOrders({
    status,
    limit: parseInt(limit) || 50,
    offset: parseInt(offset) || 0,
  });
  res.json({ status: 'success', data: { orders, total: orders.length } });
}));

// ============================================
// AUTHENTICATED: User creates an order
// ============================================

router.post('/', requireAuth, validate(createOrderSchema), catchAsync(async (req, res) => {
  const order = await orderService.createOrder({
    userId: req.user.id,
    items: req.body.items,
    shippingAddress: req.body.shippingAddress,
    billingAddress: req.body.billingAddress || req.body.shippingAddress,
  });
  res.status(201).json({ status: 'success', data: order });
}));

// ============================================
// GUEST: Create order without auth
// ============================================

router.post('/guest', validate(createOrderSchema), catchAsync(async (req, res) => {
  const order = await orderService.createOrder({
    guestEmail: req.body.email,
    items: req.body.items,
    shippingAddress: req.body.shippingAddress,
    billingAddress: req.body.billingAddress || req.body.shippingAddress,
  });
  res.status(201).json({ status: 'success', data: order });
}));

// ============================================
// PUBLIC + ADMIN: Get order detail
// ============================================

router.get('/:id', catchAsync(async (req, res) => {
  const order = await orderService.getOrderDetail(req.params.id);
  res.json({ status: 'success', data: order });
}));

// ============================================
// AUTH: Update payment status
// ============================================

router.patch('/:id/payment', requireAuth, validate(paymentUpdateSchema), catchAsync(async (req, res) => {
  const result = await orderService.updatePaymentStatus(req.params.id, req.body);
  res.json({ status: 'success', data: result });
}));

// ============================================
// ADMIN: Update order status (NEW)
// ============================================

router.patch('/:id/status', catchAsync(async (req, res) => {
  const { status } = req.body;
  if (!status) throw new AppError('Status is required', 400, 'VALIDATION_ERROR');
  
  const order = await orderService.updateOrderStatus(req.params.id, status);
  res.json({ status: 'success', data: order });
}));

module.exports = router;

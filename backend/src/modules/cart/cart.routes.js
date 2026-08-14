const express = require('express');
const router = express.Router();
const { z } = require('zod');
const cartService = require('./cart.service');
const validate = require('../../middleware/validate');
const { requireAuth, optionalAuth } = require('../../middleware/auth');

const addItemSchema = z.object({
  productId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(10),
}).refine((data) => data.productId || data.variantId, {
  message: 'Either productId or variantId is required',
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(1).max(10)
});

function getCartContext(req) {
  return {
    userId: req.userId || null,
    guestToken: req.headers['x-guest-token'] || null
  };
}

router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const cart = await cartService.getCart(getCartContext(req));
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
});

router.post('/items', optionalAuth, validate(addItemSchema), async (req, res, next) => {
  try {
    await cartService.addItem({ ...getCartContext(req), ...req.body });
    const cart = await cartService.getCart(getCartContext(req));
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
});

router.put('/items/:itemId', optionalAuth, validate(updateItemSchema), async (req, res, next) => {
  try {
    await cartService.updateItem({
      ...getCartContext(req),
      itemId: req.params.itemId,
      quantity: req.body.quantity
    });

    const cart = await cartService.getCart(getCartContext(req));

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});

router.delete('/items/:itemId', optionalAuth, async (req, res, next) => {
  try {
    await cartService.removeItem({
      ...getCartContext(req),
      itemId: req.params.itemId
    });

    const cart = await cartService.getCart(getCartContext(req));

    res.json({
      success: true,
      data: cart
    });
  } catch (err) {
    next(err);
  }
});
router.post('/merge', requireAuth, async (req, res, next) => {
  try {
    const guestToken = req.headers['x-guest-token'];
    if (!guestToken) throw new (require('../../utils/AppError'))('Guest token required', 400);
    await cartService.mergeCart(req.userId, guestToken);
    const cart = await cartService.getCart({ userId: req.userId, guestToken: null });
    res.json({ success: true, data: cart });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

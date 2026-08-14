const express = require('express');
const router = express.Router();
const { z } = require('zod');

const { requireAuth, requireAdmin } = require('../../middleware/auth');
const validate = require('../../middleware/validate');
const catchAsync = require('../../utils/catchAsync');
const shippingService = require('./shipping.service');

const zoneSchema = z.object({
  name: z.string().min(1),
  state: z.string().optional().nullable(),
  shipping_fee: z.coerce.number().min(0),
  free_shipping_threshold: z
    .union([
      z.coerce.number().min(0),
      z.literal(''),
      z.null(),
    ])
    .optional(),
  is_active: z.boolean().optional(),
});

const updateZoneSchema = zoneSchema.partial();


// ============================================
// ADMIN — Shipping zones
// ============================================

router.get(
  '/zones',
  requireAuth,
  requireAdmin,
  catchAsync(async (req, res) => {
    const zones = await shippingService.getAllZones();

    res.json({
      status: 'success',
      data: { zones },
    });
  })
);

router.post(
  '/zones',
  requireAuth,
  requireAdmin,
  validate(zoneSchema),
  catchAsync(async (req, res) => {
    const zone = await shippingService.createZone(req.body);

    res.status(201).json({
      status: 'success',
      data: zone,
    });
  })
);

router.patch(
  '/zones/:id',
  requireAuth,
  requireAdmin,
  validate(updateZoneSchema),
  catchAsync(async (req, res) => {
    const zone = await shippingService.updateZone(
      req.params.id,
      req.body
    );

    res.json({
      status: 'success',
      data: zone,
    });
  })
);

router.delete(
  '/zones/:id',
  requireAuth,
  requireAdmin,
  catchAsync(async (req, res) => {
    const result = await shippingService.deleteZone(
      req.params.id
    );

    res.json({
      status: 'success',
      data: result,
    });
  })
);


// ============================================
// STOREFRONT — Calculate shipping
// ============================================

router.get(
  '/calculate',
  catchAsync(async (req, res) => {
    const result = await shippingService.calculateShipping({
      state: req.query.state,
      subtotal: req.query.subtotal,
    });

    res.json({
      status: 'success',
      data: result,
    });
  })
);

module.exports = router;
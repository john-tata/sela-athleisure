const express = require('express');
const router = express.Router();

const dashboardService = require('./dashboard.service');
const catchAsync = require('../../utils/catchAsync');
const { requireAuth, requireAdmin } = require('../../middleware/auth');

router.get(
  '/',
  requireAuth,
  requireAdmin,
  catchAsync(async (req, res) => {
    const stats = await dashboardService.getDashboardStats();

    res.json({
      status: 'success',
      data: stats,
    });
  })
);

module.exports = router;
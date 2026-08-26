const express = require('express');

const {
  requireAuth,
} = require('../../middleware/auth');

const {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
} = require('./favorite.service');

const AppError = require('../../utils/AppError');

const router = express.Router();

// GET /favorites
// Get all favorites for logged-in user
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const favorites = await getFavorites(req.userId);

    res.json({
      success: true,
      favorites,
    });
  } catch (error) {
    next(error);
  }
});

// GET /favorites/:productId
// Check whether a product is favorited
router.get('/:productId', requireAuth, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const favorite = await isFavorite(
      req.userId,
      productId
    );

    res.json({
      success: true,
      isFavorite: favorite,
    });
  } catch (error) {
    next(error);
  }
});

// POST /favorites
// Add product to favorites
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      throw new AppError(
        'productId is required',
        400,
        'VALIDATION_ERROR'
      );
    }

    const result = await addFavorite(
      req.userId,
      productId
    );

    res.status(201).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /favorites/:productId
// Remove product from favorites
router.delete('/:productId', requireAuth, async (req, res, next) => {
  try {
    const { productId } = req.params;

    const result = await removeFavorite(
      req.userId,
      productId
    );

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
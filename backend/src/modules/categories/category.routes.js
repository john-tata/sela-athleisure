const express = require('express');
const router = express.Router();
const categoryService = require('./category.service');
const catchAsync = require('../../utils/catchAsync');

// ============================================
// PUBLIC: Storefront endpoints (PRESERVED)
// ============================================

// GET /api/v1/categories — list all categories
router.get('/', catchAsync(async (req, res) => {
  const categories = await categoryService.getCategoryTree();
  res.json({ status: 'success', data: { categories, total: categories.length } });
}));

// GET /api/v1/categories/:slug — single category
router.get('/:slug', catchAsync(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.json({ status: 'success', data: category });
}));

// ============================================
// ADMIN: CRUD endpoints (NEW)
// ============================================

// POST /api/v1/categories — create category
router.post('/', catchAsync(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({ status: 'success', data: category });
}));

// PATCH /api/v1/categories/:id — update category
router.patch('/:id', catchAsync(async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.json({ status: 'success', data: category });
}));

// DELETE /api/v1/categories/:id — delete category
router.delete('/:id', catchAsync(async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  res.json({ status: 'success', data: result });
}));

module.exports = router;

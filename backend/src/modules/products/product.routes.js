const express = require('express');
const router = express.Router();
const productService = require('./product.service');
const catchAsync = require('../../utils/catchAsync');

// ============================================
// PUBLIC: Storefront endpoints (PRESERVED)
// ============================================

// GET /api/v1/products — list with filters
router.get('/', catchAsync(async (req, res) => {
  const { category, limit, offset, sort, search: searchQuery } = req.query;

  if (searchQuery) {
    const products = await productService.searchProducts(searchQuery, {
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
    });
    res.json({ status: 'success', data: { products, total: products.length } });
  } else {
    const products = await productService.getProducts({
      category,
      limit: parseInt(limit) || 20,
      offset: parseInt(offset) || 0,
      sort: sort || 'newest',
    });
    res.json({ status: 'success', data: { products, total: products.length } });
  }
}));

// GET /api/v1/products/:slug — single product detail
router.get('/:slug', catchAsync(async (req, res) => {
  const product = await productService.getProductBySlug(req.params.slug);
  res.json({ status: 'success', data: product });
}));

// ============================================
// ADMIN: CRUD endpoints (NEW)
// ============================================

// POST /api/v1/products — create product
router.post('/', catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ status: 'success', data: product });
}));

// PATCH /api/v1/products/:slug — update product
router.patch('/:slug', catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.slug, req.body);
  res.json({ status: 'success', data: product });
}));

// DELETE /api/v1/products/:slug — delete product
router.delete('/:slug', catchAsync(async (req, res) => {
  const result = await productService.deleteProduct(req.params.slug);
  res.json({ status: 'success', data: result });
}));

module.exports = router;

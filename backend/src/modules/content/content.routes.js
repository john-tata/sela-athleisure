const express = require('express');
const router = express.Router();
const contentService = require('./content.service');
const catchAsync = require('../../utils/catchAsync');

// ============================================
// PUBLIC: Storefront endpoints (PRESERVED)
// ============================================

router.get('/hero-slides', catchAsync(async (req, res) => {
  const slides = await contentService.getHeroSlides();
  res.json({ status: 'success', data: { slides, total: slides.length } });
}));

router.get('/testimonials', catchAsync(async (req, res) => {
  const testimonials = await contentService.getTestimonials();
  res.json({ status: 'success', data: { testimonials, total: testimonials.length } });
}));

router.get('/lookbook', catchAsync(async (req, res) => {
  const lookbook = await contentService.getLookbookImages();
  res.json({ status: 'success', data: { lookbook, total: lookbook.length } });
}));

// ============================================
// ADMIN: Hero Slides CRUD (NEW)
// ============================================

router.post('/hero-slides', catchAsync(async (req, res) => {
  const slide = await contentService.createHeroSlide(req.body);
  res.status(201).json({ status: 'success', data: slide });
}));

router.patch('/hero-slides/:id', catchAsync(async (req, res) => {
  const slide = await contentService.updateHeroSlide(req.params.id, req.body);
  res.json({ status: 'success', data: slide });
}));

router.delete('/hero-slides/:id', catchAsync(async (req, res) => {
  const result = await contentService.deleteHeroSlide(req.params.id);
  res.json({ status: 'success', data: result });
}));

// ============================================
// ADMIN: Testimonials CRUD (NEW)
// ============================================

router.post('/testimonials', catchAsync(async (req, res) => {
  const testimonial = await contentService.createTestimonial(req.body);
  res.status(201).json({ status: 'success', data: testimonial });
}));

router.patch('/testimonials/:id', catchAsync(async (req, res) => {
  const testimonial = await contentService.updateTestimonial(req.params.id, req.body);
  res.json({ status: 'success', data: testimonial });
}));

router.delete('/testimonials/:id', catchAsync(async (req, res) => {
  const result = await contentService.deleteTestimonial(req.params.id);
  res.json({ status: 'success', data: result });
}));

// ============================================
// ADMIN: Lookbook CRUD (NEW)
// ============================================

router.post('/lookbook', catchAsync(async (req, res) => {
  const image = await contentService.createLookbookImage(req.body);
  res.status(201).json({ status: 'success', data: image });
}));

router.patch('/lookbook/:id', catchAsync(async (req, res) => {
  const image = await contentService.updateLookbookImage(req.params.id, req.body);
  res.json({ status: 'success', data: image });
}));

router.delete('/lookbook/:id', catchAsync(async (req, res) => {
  const result = await contentService.deleteLookbookImage(req.params.id);
  res.json({ status: 'success', data: result });
}));

module.exports = router;

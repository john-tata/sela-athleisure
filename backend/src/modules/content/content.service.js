const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

// ============================================
// FIELD MAPPING: Admin field names ↔ Database columns
// ============================================
// Hero Slides:   title→heading, subtitle→subtext, cta_text→cta_primary, cta_link→cta_primary_link
// Testimonials:  name→customer_name, avatar_url→customer_photo, quote→review_text, role→role
// Lookbook:      title→title, image_url→image_url, sort_order→sort_order
// ============================================

// ============================
// EXISTING: Storefront (PRESERVED)
// ============================

async function getHeroSlides() {
  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  // Map DB columns → admin-friendly field names
  return data ? data.map(s => ({
    id: s.id,
    title: s.heading,
    subtitle: s.subtext,
    cta_text: s.cta_primary,
    cta_link: s.cta_primary_link,
    cta_secondary: s.cta_secondary,
    cta_secondary_link: s.cta_secondary_link,
    image_url: s.image_url,
    sort_order: s.sort_order,
    is_active: s.is_active,
  })) : [];
}

async function getTestimonials() {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  return data ? data.map(t => ({
    id: t.id,
    name: t.customer_name,
    role: t.role,
    avatar_url: t.customer_photo,
    rating: t.rating,
    quote: t.review_text,
    is_verified: t.is_verified,
    is_active: t.is_active,
  })) : [];
}

async function getLookbookImages() {
  const { data, error } = await supabaseAdmin
    .from('lookbook_images')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  return data ? data.map(l => ({
    id: l.id,
    title: l.title,
    image_url: l.image_url,
    alt_text: l.alt_text,
    is_tall: l.is_tall,
    sort_order: l.sort_order,
    is_active: l.is_active,
  })) : [];
}

// ============================
// NEW: Admin CRUD — Hero Slides
// ============================

async function createHeroSlide(data) {
  const { data: slide, error } = await supabaseAdmin
    .from('hero_slides')
    .insert({
      heading: data.title || '',
      subtext: data.subtitle || null,
      cta_primary: data.cta_text || null,
      cta_primary_link: data.cta_link || null,
      image_url: data.image_url,
      sort_order: data.sort_order || 0,
      is_active: data.is_active !== false,
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  return {
    id: slide.id,
    title: slide.heading,
    subtitle: slide.subtext,
    cta_text: slide.cta_primary,
    cta_link: slide.cta_primary_link,
    image_url: slide.image_url,
    sort_order: slide.sort_order,
    is_active: slide.is_active,
  };
}

async function updateHeroSlide(id, data) {
  const payload = {};
  if (data.title !== undefined) payload.heading = data.title;
  if (data.subtitle !== undefined) payload.subtext = data.subtitle;
  if (data.cta_text !== undefined) payload.cta_primary = data.cta_text;
  if (data.cta_link !== undefined) payload.cta_primary_link = data.cta_link;
  if (data.cta_secondary !== undefined) payload.cta_secondary = data.cta_secondary;
  if (data.cta_secondary_link !== undefined) payload.cta_secondary_link = data.cta_secondary_link;
  if (data.image_url !== undefined) payload.image_url = data.image_url;
  if (data.sort_order !== undefined) payload.sort_order = data.sort_order;
  if (data.is_active !== undefined) payload.is_active = data.is_active;

  const { data: slide, error } = await supabaseAdmin
    .from('hero_slides')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!slide) throw new AppError('Hero slide not found', 404, 'NOT_FOUND');

  return {
    id: slide.id,
    title: slide.heading,
    subtitle: slide.subtext,
    cta_text: slide.cta_primary,
    cta_link: slide.cta_primary_link,
    image_url: slide.image_url,
    sort_order: slide.sort_order,
    is_active: slide.is_active,
  };
}

async function deleteHeroSlide(id) {
  const { data, error } = await supabaseAdmin
    .from('hero_slides')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!data) throw new AppError('Hero slide not found', 404, 'NOT_FOUND');

  return { deleted: true, id: data.id };
}

// ============================
// NEW: Admin CRUD — Testimonials
// ============================

async function createTestimonial(data) {
  const { data: t, error } = await supabaseAdmin
    .from('testimonials')
    .insert({
      customer_name: data.name || '',
      role: data.role || null,
      customer_photo: data.avatar_url || null,
      rating: Math.min(5, Math.max(1, Number(data.rating) || 5)),
      review_text: data.quote || '',
      is_active: data.is_active !== false,
      is_verified: true,
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  return {
    id: t.id,
    name: t.customer_name,
    role: t.role,
    avatar_url: t.customer_photo,
    rating: t.rating,
    quote: t.review_text,
    is_verified: t.is_verified,
    is_active: t.is_active,
  };
}

async function updateTestimonial(id, data) {
  const payload = {};
  if (data.name !== undefined) payload.customer_name = data.name;
  if (data.role !== undefined) payload.role = data.role;
  if (data.avatar_url !== undefined) payload.customer_photo = data.avatar_url;
  if (data.rating !== undefined) payload.rating = Math.min(5, Math.max(1, Number(data.rating) || 5));
  if (data.quote !== undefined) payload.review_text = data.quote;
  if (data.is_active !== undefined) payload.is_active = data.is_active;

  const { data: t, error } = await supabaseAdmin
    .from('testimonials')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!t) throw new AppError('Testimonial not found', 404, 'NOT_FOUND');

  return {
    id: t.id,
    name: t.customer_name,
    role: t.role,
    avatar_url: t.customer_photo,
    rating: t.rating,
    quote: t.review_text,
    is_verified: t.is_verified,
    is_active: t.is_active,
  };
}

async function deleteTestimonial(id) {
  const { data, error } = await supabaseAdmin
    .from('testimonials')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!data) throw new AppError('Testimonial not found', 404, 'NOT_FOUND');

  return { deleted: true, id: data.id };
}

// ============================
// NEW: Admin CRUD — Lookbook
// ============================

async function createLookbookImage(data) {
  const { data: l, error } = await supabaseAdmin
    .from('lookbook_images')
    .insert({
      title: data.title || null,
      image_url: data.image_url,
      sort_order: data.sort_order || 0,
      is_active: data.is_active !== false,
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  return {
    id: l.id,
    title: l.title,
    image_url: l.image_url,
    sort_order: l.sort_order,
    is_active: l.is_active,
  };
}

async function updateLookbookImage(id, data) {
  const payload = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.image_url !== undefined) payload.image_url = data.image_url;
  if (data.sort_order !== undefined) payload.sort_order = data.sort_order;
  if (data.is_active !== undefined) payload.is_active = data.is_active;

  const { data: l, error } = await supabaseAdmin
    .from('lookbook_images')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!l) throw new AppError('Lookbook image not found', 404, 'NOT_FOUND');

  return {
    id: l.id,
    title: l.title,
    image_url: l.image_url,
    sort_order: l.sort_order,
    is_active: l.is_active,
  };
}

async function deleteLookbookImage(id) {
  const { data, error } = await supabaseAdmin
    .from('lookbook_images')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!data) throw new AppError('Lookbook image not found', 404, 'NOT_FOUND');

  return { deleted: true, id: data.id };
}

module.exports = {
  // Existing (storefront)
  getHeroSlides,
  getTestimonials,
  getLookbookImages,
  // New (admin) — Hero Slides
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  // New (admin) — Testimonials
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  // New (admin) — Lookbook
  createLookbookImage,
  updateLookbookImage,
  deleteLookbookImage,
};

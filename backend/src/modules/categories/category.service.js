const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

// ============================================
// EXISTING: Storefront queries (PRESERVED)
// ============================================

async function getCategoryTree() {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  return (data || []).map(c => ({
    ...c,
    product_count: 0,
  }));
}

async function getCategoryBySlug(slug) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) throw new AppError('Category not found', 404, 'NOT_FOUND');
  return data;
}

// ============================================
// NEW: Admin CRUD operations
// ============================================

async function createCategory(categoryData) {
  const { data, error } = await supabaseAdmin
    .from('categories')
    .insert({
      name: categoryData.name,
      slug: categoryData.slug,
      description: categoryData.description || null,
      image_url: categoryData.image_url || null,
      sort_order: categoryData.sort_order || 0,
      is_active: categoryData.is_active !== false,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new AppError('Category slug already exists', 409, 'DUPLICATE_SLUG');
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  return data;
}

async function updateCategory(id, updateData) {
  const payload = {};
  if (updateData.name !== undefined) payload.name = updateData.name;
  if (updateData.slug !== undefined) payload.slug = updateData.slug;
  if (updateData.description !== undefined) payload.description = updateData.description || null;
  if (updateData.image_url !== undefined) payload.image_url = updateData.image_url || null;
  if (updateData.sort_order !== undefined) payload.sort_order = updateData.sort_order;
  if (updateData.is_active !== undefined) payload.is_active = updateData.is_active;

  const { data, error } = await supabaseAdmin
    .from('categories')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') throw new AppError('Category slug already exists', 409, 'DUPLICATE_SLUG');
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }
  if (!data) throw new AppError('Category not found', 404, 'NOT_FOUND');

  return data;
}

async function deleteCategory(id) {
  // Check if category has products
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id')
    .eq('category_id', id)
    .limit(1);

  if (products && products.length > 0) {
    throw new AppError('Cannot delete category with products. Reassign products first.', 400, 'CATEGORY_HAS_PRODUCTS');
  }

  const { data, error } = await supabaseAdmin
    .from('categories')
    .delete()
    .eq('id', id)
    .select('id')
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!data) throw new AppError('Category not found', 404, 'NOT_FOUND');

  return { deleted: true, id: data.id };
}

module.exports = {
  // Existing (storefront)
  getCategoryTree,
  getCategoryBySlug,
  // New (admin)
  createCategory,
  updateCategory,
  deleteCategory,
};

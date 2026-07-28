const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

// ============================================
// EXISTING: Storefront queries (PRESERVED)
// ============================================

async function getProducts({ category, limit = 20, offset = 0, sort = 'newest' }) {
  let query = supabaseAdmin
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(*)
    `)
    .eq('is_active', true);

  if (category) {
    const { data: cat } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    if (cat) query = query.eq('category_id', cat.id);
  }

  const orderMap = {
    newest: { column: 'created_at', ascending: false },
    price_asc: { column: 'base_price', ascending: true },
    price_desc: { column: 'base_price', ascending: false },
    name_asc: { column: 'name', ascending: true },
    sales: { column: 'created_at', ascending: false },
  };
  const order = orderMap[sort] || orderMap.newest;
  query = query.order(order.column, { ascending: order.ascending });

  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  return data ? data.map(normalizeProduct) : [];
}

async function getProductBySlug(slug) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(*),
      product_variants(*)
    `)
    .eq('slug', slug)
    .single();

  if (error || !data) throw new AppError('Product not found', 404, 'NOT_FOUND');
  return normalizeProduct(data);
}

async function searchProducts(query, { limit = 20, offset = 0 }) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      categories(name, slug),
      product_images(*)
    `)
    .eq('is_active', true)
    .textSearch('search_vector', query, { type: 'websearch' })
    .range(offset, offset + limit - 1);

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  return data ? data.map(normalizeProduct) : [];
}

// ============================================
// NEW: Admin CRUD operations
// ============================================

async function createProduct(productData) {
  const { images, ...productFields } = productData;

  // 1. Insert product
  const { data: product, error } = await supabaseAdmin
    .from('products')
    .insert({
      name: productFields.name,
      slug: productFields.slug,
      description: productFields.description || '',
      base_price: productFields.base_price,
      compare_price: productFields.compare_price || null,
      category_id: productFields.category_id || null,
      is_featured: productFields.is_featured || false,
      is_active: productFields.is_active !== false,
      inventory_quantity: productFields.inventory_quantity || 0,
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  // 2. Insert images if provided
  if (images && images.length > 0) {
    const imageRows = images.map((img, i) => ({
  product_id: product.id,

  // Accept either a string or an object
  url: typeof img === "string" ? img : img.url,

  is_primary:
    typeof img === "string"
      ? i === 0
      : (img.is_primary ?? i === 0),

  sort_order:
    typeof img === "string"
      ? i
      : (img.sort_order ?? i),

  alt_text:
    typeof img === "string"
      ? productFields.name
      : (img.alt_text || productFields.name),
}));

    const { error: imgError } = await supabaseAdmin
      .from('product_images')
      .insert(imageRows);

    if (imgError) {
  console.error(imgError);
  throw imgError;
}
  }

  // 3. Return product with images
  return getProductBySlug(product.slug);
}

async function updateProduct(slug, updateData) {
  const { images, ...productFields } = updateData;

  // 1. Get current product
  const { data: current } = await supabaseAdmin
    .from('products')
    .select('id, slug')
    .eq('slug', slug)
    .single();

  if (!current) throw new AppError('Product not found', 404, 'NOT_FOUND');

  // 2. Build update payload (only include defined fields)
  const payload = {};
  if (productFields.name !== undefined) payload.name = productFields.name;
  if (productFields.slug !== undefined) payload.slug = productFields.slug;
  if (productFields.description !== undefined) payload.description = productFields.description;
  if (productFields.base_price !== undefined) payload.base_price = productFields.base_price;
  if (productFields.compare_price !== undefined) payload.compare_price = productFields.compare_price || null;
  if (productFields.category_id !== undefined) payload.category_id = productFields.category_id || null;
  if (productFields.is_featured !== undefined) payload.is_featured = productFields.is_featured;
  if (productFields.is_active !== undefined) payload.is_active = productFields.is_active;
  if (productFields.inventory_quantity !== undefined) payload.inventory_quantity = productFields.inventory_quantity;
  payload.updated_at = new Date().toISOString();

  const { error } = await supabaseAdmin
    .from('products')
    .update(payload)
    .eq('id', current.id);

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  // 3. Replace images if new ones provided
  if (images && Array.isArray(images)) {
    // Delete existing images
    await supabaseAdmin.from('product_images').delete().eq('product_id', current.id);

    // Insert new images
    if (images.length > 0) {
      const imageRows = images.map((img, i) => ({
  product_id: current.id,

  url: typeof img === "string" ? img : img.url,

  is_primary:
    typeof img === "string"
      ? i === 0
      : (img.is_primary ?? i === 0),

  sort_order:
    typeof img === "string"
      ? i
      : (img.sort_order ?? i),

  alt_text:
    typeof img === "string"
      ? (payload.name || "")
      : (img.alt_text || payload.name || ""),
}));

      const { error: imgError } = await supabaseAdmin.from('product_images').insert(imageRows);
      if (imgError) console.error('Failed to insert images:', imgError.message);
    }
  }

  // 4. Return updated product
  const finalSlug = payload.slug || current.slug;
  return getProductBySlug(finalSlug);
}

async function deleteProduct(slug) {
  const { data, error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('slug', slug)
    .select('id')
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!data) throw new AppError('Product not found', 404, 'NOT_FOUND');

  return { deleted: true, id: data.id };
}

// ============================================
// HELPER: Normalize product response
// ============================================

function normalizeProduct(p) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    base_price: p.base_price,
    compare_price: p.compare_price,
    category_id: p.category_id,
    category_name: p.categories?.name || null,
    category_slug: p.categories?.slug || null,
    sku: p.sku,
    is_featured: p.is_featured,
    is_active: p.is_active,
    created_at: p.created_at,
    images: (p.product_images || []).map(img => ({
      id: img.id,
      url: img.url,
      is_primary: img.is_primary,
      sort_order: img.sort_order,
      alt_text: img.alt_text,
    })),
    variants: (p.product_variants || []).map(v => ({
      id: v.id, sku: v.sku, size: v.size, color: v.color,
      color_hex: v.color_hex, stock_quantity: v.stock_quantity,
      price_adjustment: v.price_adjustment, image_url: v.image_url,
    })),
  };
}

module.exports = {
  // Existing (storefront)
  getProducts,
  getProductBySlug,
  searchProducts,
  // New (admin)
  createProduct,
  updateProduct,
  deleteProduct,
};

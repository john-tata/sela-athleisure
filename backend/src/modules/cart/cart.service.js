const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

const FREE_SHIPPING_THRESHOLD = 30000;
const SHIPPING_COST = 3500;

function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => {
    const price = (item.product?.base_price || 0) + (item.variant?.price_adjustment || 0);
    return sum + price * item.quantity;
  }, 0);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { subtotal, shipping, total: subtotal + shipping, itemCount };
}

function applyOwnerFilter(query, { userId, guestToken }) {
  if (userId) return query.eq('user_id', userId);
  if (guestToken) return query.eq('guest_token', guestToken);
  return query;
}

function applyItemFilter(query, { userId, guestToken, productId, variantId }) {
  query = applyOwnerFilter(query, { userId, guestToken }).eq('product_id', productId);

  if (variantId) return query.eq('variant_id', variantId);
  return query.is('variant_id', null);
}

async function getCart({ userId, guestToken }) {
  let query = supabaseAdmin
    .from('cart_items')
    .select(`
      id, quantity,
      product:product_id(id, name, slug, base_price),
      variant:variant_id(id, sku, size, color, color_hex, stock_quantity, price_adjustment),
      product_image:product_id(product_images(url, is_primary))
    `);

  query = applyOwnerFilter(query, { userId, guestToken });

  if (!userId && !guestToken) {
    return { items: [], subtotal: 0, shipping: 0, total: 0, itemCount: 0 };
  }

  const { data, error } = await query;
  if (error) throw new AppError(error.message, 500);

  const items = (data || []).map((item) => ({
    ...item,
    image: item.product_image?.find?.((img) => img.is_primary) || item.product_image?.[0] || null,
  }));

  return { items, ...calculateTotals(items) };
}

async function addItem({ userId, guestToken, productId, variantId, quantity }) {
  if (!userId && !guestToken) throw new AppError('Cart context required', 400);

  let resolvedProductId = productId || null;
  let stockQuantity = null;

  if (variantId) {
    const { data: variant, error } = await supabaseAdmin
      .from('product_variants')
      .select('id, product_id, stock_quantity')
      .eq('id', variantId)
      .single();

    if (error || !variant) throw new AppError('Variant not found', 404, 'NOT_FOUND');

    resolvedProductId = resolvedProductId || variant.product_id;
    stockQuantity = variant.stock_quantity;

    if (productId && productId !== variant.product_id) {
      throw new AppError('Variant does not belong to this product', 400, 'INVALID_VARIANT');
    }
  } else {
    if (!productId) throw new AppError('productId is required when variantId is not provided', 400);

    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('id, inventory_quantity')
      .eq('id', productId)
      .single();

    if (error || !product) throw new AppError('Product not found', 404, 'NOT_FOUND');

    resolvedProductId = product.id;
    stockQuantity = product.inventory_quantity;
  }

  if (stockQuantity !== null && stockQuantity < quantity) {
    throw new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK');
  }

  const existingQuery = applyItemFilter(
    supabaseAdmin.from('cart_items').select('id, quantity'),
    { userId, guestToken, productId: resolvedProductId, variantId }
  );

  const { data: existing, error: existingError } = await existingQuery.maybeSingle();
  if (existingError) throw new AppError(existingError.message, 500);

  if (existing) {
    const newQty = Math.min(existing.quantity + quantity, 10);
    if (stockQuantity !== null && newQty > stockQuantity) {
      throw new AppError('Insufficient stock', 400, 'INSUFFICIENT_STOCK');
    }

    const { error: updateError } = await supabaseAdmin
      .from('cart_items')
      .update({ quantity: newQty })
      .eq('id', existing.id);

    if (updateError) throw new AppError(updateError.message, 500);
  } else {
    const payload = {
      product_id: resolvedProductId,
      variant_id: variantId || null,
      quantity,
      ...(userId ? { user_id: userId } : { guest_token: guestToken }),
    };

    const { error: insertError } = await supabaseAdmin
      .from('cart_items')
      .insert(payload);

    if (insertError) throw new AppError(insertError.message, 500);
  }
}

async function updateItem({ userId, guestToken, itemId, quantity }) {
  const query = supabaseAdmin
    .from('cart_items')
    .update({ quantity })
    .eq('id', itemId);

  if (userId) {
    query.eq('user_id', userId);
  } else {
    query.eq('guest_token', guestToken);
  }

  const { error } = await query;

  if (error) {
    throw new AppError(error.message, 500);
  }
}

async function removeItem({ userId, guestToken, itemId }) {
  const query = supabaseAdmin
    .from('cart_items')
    .delete()
    .eq('id', itemId);

  if (userId) {
    query.eq('user_id', userId);
  } else {
    query.eq('guest_token', guestToken);
  }

  const { error } = await query;

  if (error) {
    throw new AppError(error.message, 500);
  }
}

async function mergeCart(userId, guestToken) {
  const { data: guestItems } = await supabaseAdmin
    .from('cart_items')
    .select('*')
    .eq('guest_token', guestToken);

  for (const item of guestItems || []) {
    const existingQuery = applyItemFilter(
      supabaseAdmin.from('cart_items').select('id, quantity'),
      { userId, guestToken: null, productId: item.product_id, variantId: item.variant_id }
    );

    const { data: existing } = await existingQuery.maybeSingle();

    if (existing) {
      const newQty = Math.min(existing.quantity + item.quantity, 10);
      await supabaseAdmin.from('cart_items').update({ quantity: newQty }).eq('id', existing.id);
    } else {
      await supabaseAdmin.from('cart_items').insert({
        user_id: userId,
        product_id: item.product_id,
        variant_id: item.variant_id,
        quantity: item.quantity,
      });
    }
  }

  await supabaseAdmin.from('cart_items').delete().eq('guest_token', guestToken);
}

module.exports = { getCart, addItem, updateItem, removeItem, mergeCart };
const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');
const shippingService = require('../shipping/shipping.service');
// ============================================
// EXISTING: Storefront queries (PRESERVED)
// ============================================

async function createOrder({
  userId,
  guestEmail,
  items,
  shippingAddress,
  billingAddress,
}) {
  const orderNumber = `SEL${Date.now()}`;
  
  let subtotal = 0;
  const orderItems = [];
  
  for (const item of items) {
  const { data: product } = await supabaseAdmin
    .from('products')
    .select('name, base_price, compare_price')
    .eq('id', item.productId)
    .single();

  if (!product) {
    throw new AppError(`Product ${item.productId} not found`, 400, 'INVALID_PRODUCT');
  }

  let variant = null;

  if (item.variantId) {
    const { data: variantData } = await supabaseAdmin
      .from('product_variants')
      .select('id, product_id, size, color, price_adjustment, stock_quantity, is_active')
      .eq('id', item.variantId)
      .single();

    variant = variantData;

    if (!variant) {
      throw new AppError('Invalid product variant', 400, 'INVALID_VARIANT');
    }

    if (variant.is_active === false || variant.product_id !== item.productId) {
      throw new AppError('Invalid product variant', 400, 'INVALID_VARIANT');
    }

    if (variant.stock_quantity < item.quantity) {
      throw new AppError(
        'Not enough stock',
        400,
        'OUT_OF_STOCK'
      );
    }
  }

  let price = Number(product.base_price);

  if (variant?.price_adjustment) {
  price += Number(variant.price_adjustment);
}

  subtotal += price * item.quantity;

  orderItems.push({
    product_id: item.productId,
    variant_id: variant?.id || null,
    product_name: product.name,
    variant_name: variant
  ? `${variant.color ? variant.color + " / " : ""}${variant.size}`
  : "Default",
    quantity: item.quantity,
    unit_price: price,
  });
}

    // Calculate shipping dynamically based on
  // the customer's state and current subtotal.
  const shippingResult = await shippingService.calculateShipping({
    zoneId: shippingAddress?.shipping_zone_id,
    state: shippingAddress?.state,
    subtotal,
  });

  const shipping = shippingResult.shipping;
  const total = shippingResult.total;

  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .insert({
      order_number: orderNumber,
      user_id: userId,
      guest_email: guestEmail,
      subtotal,
      shipping,
      total,
      shipping_address: shippingAddress,
      billing_address: billingAddress,
    })
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  const itemsWithOrderId = orderItems.map(item => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabaseAdmin
    .from('order_items')
    .insert(itemsWithOrderId);

  if (itemsError) throw new AppError(itemsError.message, 500, 'DATABASE_ERROR');

  return { ...order, items: orderItems };
}

async function getOrderById(orderId) {
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (error || !order) throw new AppError('Order not found', 404, 'NOT_FOUND');

  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select('*')
    .eq('order_id', orderId);

  return { ...order, items: items || [] };
}

async function getUserOrders(userId) {
  const { data, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  return data || [];
}

async function updatePaymentStatus(orderId, { status, reference }) {
  const { error } = await supabaseAdmin
    .from('orders')
    .update({
      payment_status: status,
      paystack_reference: reference,
      status: status === 'paid' ? 'confirmed' : undefined,
    })
    .eq('id', orderId);

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  return { updated: true };
}

// ============================================
// NEW: Admin order management
// ============================================

async function getAllOrders({ status, limit = 50, offset = 0 } = {}) {
  let query = supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);

  const { data, error } = await query.range(offset, offset + limit - 1);

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');

  // Normalize response for admin
  return (data || []).map(order => ({
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    payment_status: order.payment_status,
    total_amount: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    customer_name: order.shipping_address?.full_name || order.guest_email || 'Guest',
    customer_email: order.guest_email || order.shipping_address?.email || '',
    customer_phone: order.shipping_address?.phone || '',
    shipping_address: formatAddress(order.shipping_address),
    billing_address: formatAddress(order.billing_address),
    paystack_reference: order.paystack_reference,
    notes: order.notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: (order.order_items || []).map(item => ({
      id: item.id,
      product_name: item.product_name,
      variant_label: item.variant_name || 'Default',
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    })),
  }));
}

async function getOrderDetail(orderId) {
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .eq('id', orderId)
    .single();

  if (error || !order) throw new AppError('Order not found', 404, 'NOT_FOUND');

  return {
    id: order.id,
    order_number: order.order_number,
    status: order.status,
    payment_status: order.payment_status,
    total_amount: order.total,
    subtotal: order.subtotal,
    shipping: order.shipping,
    customer_name: order.shipping_address?.full_name || order.guest_email || 'Guest',
    customer_email: order.guest_email || order.shipping_address?.email || '',
    customer_phone: order.shipping_address?.phone || '',
    shipping_address: formatAddress(order.shipping_address),
    billing_address: formatAddress(order.billing_address),
    paystack_reference: order.paystack_reference,
    notes: order.notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
    items: (order.order_items || []).map(item => ({
      id: item.id,
      product_name: item.product_name,
      variant_label: item.variant_name || 'Default',
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    })),
  };
}

async function updateOrderStatus(orderId, newStatus) {
  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  if (!validStatuses.includes(newStatus)) {
    throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400, 'INVALID_STATUS');
  }

  const { data, error } = await supabaseAdmin
    .from('orders')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', orderId)
    .select()
    .single();

  if (error) throw new AppError(error.message, 500, 'DATABASE_ERROR');
  if (!data) throw new AppError('Order not found', 404, 'NOT_FOUND');

  return {
    id: data.id,
    order_number: data.order_number,
    status: data.status,
    payment_status: data.payment_status,
    updated_at: data.updated_at,
  };
}

// ============================================
// HELPERS
// ============================================

function formatAddress(addr) {
  if (!addr || typeof addr !== 'object') return '';
  const parts = [
    addr.full_name,
    addr.address_line1,
    addr.address_line2,
    addr.city,
    addr.state,
    addr.country,
    addr.postal_code,
  ].filter(Boolean);
  return parts.join(', ');
}

async function reduceInventory(orderId) {
  const { data: items, error } = await supabaseAdmin
    .from('order_items')
    .select('product_id, variant_id, quantity')
    .eq('order_id', orderId);

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  for (const item of items) {
    // Variant stock
    if (item.variant_id) {
      const { data: variant } = await supabaseAdmin
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', item.variant_id)
        .single();

      if (variant) {
        await supabaseAdmin
          .from('product_variants')
          .update({
            stock_quantity: Math.max(
              0,
              variant.stock_quantity - item.quantity
            ),
          })
          .eq('id', item.variant_id);
      }
    }

    // Product stock
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('inventory_quantity')
      .eq('id', item.product_id)
      .single();

    if (product) {
      await supabaseAdmin
        .from('products')
        .update({
          inventory_quantity: Math.max(
            0,
            product.inventory_quantity - item.quantity
          ),
        })
        .eq('id', item.product_id);
    }
  }
}

module.exports = {
  // Existing (storefront)
  createOrder,
  getOrderById,
  getUserOrders,
  updatePaymentStatus,
  // New (admin)
  getAllOrders,
  getOrderDetail,
  updateOrderStatus,
  reduceInventory,
};

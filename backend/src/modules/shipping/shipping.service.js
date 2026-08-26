const { supabaseAdmin } = require('../../config/supabase');
const AppError = require('../../utils/AppError');

async function getAllZones() {
  const { data, error } = await supabaseAdmin
    .from('shipping_zones')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  return data || [];
}

async function getZoneById(id) {
  const { data, error } = await supabaseAdmin
    .from('shipping_zones')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    throw new AppError('Shipping zone not found', 404, 'NOT_FOUND');
  }

  return data;
}

async function getAvailableZones() {
  const { data, error } = await supabaseAdmin
    .from('shipping_zones')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  return data || [];
}

async function createZone(data) {
  const {
    name,
    state,
    description,
    shipping_fee,
    free_shipping_threshold,
    is_active,
  } = data;

  const { data: zone, error } = await supabaseAdmin
    .from('shipping_zones')
    .insert({
      name,
      state: state || null,
      description: description || null,
      shipping_fee: Number(shipping_fee),
      free_shipping_threshold:
        free_shipping_threshold === null ||
        free_shipping_threshold === undefined ||
        free_shipping_threshold === ''
          ? null
          : Number(free_shipping_threshold),
      is_active: is_active !== false,
    })
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  return zone;
}

async function updateZone(id, data) {
  const updates = {};

  if (data.name !== undefined) updates.name = data.name;
  if (data.state !== undefined) updates.state = data.state || null;
  if (data.description !== undefined) updates.description = data.description || null;
  if (data.shipping_fee !== undefined) {
    updates.shipping_fee = Number(data.shipping_fee);
  }

  if (data.free_shipping_threshold !== undefined) {
    updates.free_shipping_threshold =
      data.free_shipping_threshold === null ||
      data.free_shipping_threshold === ''
        ? null
        : Number(data.free_shipping_threshold);
  }

  if (data.is_active !== undefined) {
    updates.is_active = Boolean(data.is_active);
  }

  updates.updated_at = new Date().toISOString();

  const { data: zone, error } = await supabaseAdmin
    .from('shipping_zones')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  if (!zone) {
    throw new AppError('Shipping zone not found', 404, 'NOT_FOUND');
  }

  return zone;
}

async function deleteZone(id) {
  const { error } = await supabaseAdmin
    .from('shipping_zones')
    .delete()
    .eq('id', id);

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  return { deleted: true };
}

async function calculateShipping({ zoneId, state, subtotal }) {
  const normalizedState = String(state || '').trim().toLowerCase();
  const amount = Number(subtotal);

  if (!Number.isFinite(amount) || amount < 0) {
    throw new AppError(
      'Invalid subtotal',
      400,
      'VALIDATION_ERROR'
    );
  }

  const { data: zones, error } = await supabaseAdmin
    .from('shipping_zones')
    .select('*')
    .eq('is_active', true);

  if (error) {
    throw new AppError(error.message, 500, 'DATABASE_ERROR');
  }

  if (!zones?.length) {
    throw new AppError(
      'No shipping zones configured',
      500,
      'SHIPPING_NOT_CONFIGURED'
    );
  }

  let zone = null;

  if (zoneId) {
    zone = zones.find((item) => item.id === zoneId);
  }

  // First try an exact state match for older checkout clients.
  if (!zone) {
    zone = zones.find(
      (item) =>
        item.state &&
        item.state.trim().toLowerCase() === normalizedState
    );
  }

  // Otherwise use the fallback zone where state is NULL.
  if (!zone) {
    zone = zones.find((item) => !item.state);
  }

  if (!zone) {
    throw new AppError(
      'Shipping is not available for this location',
      400,
      'SHIPPING_UNAVAILABLE'
    );
  }

  const freeShipping =
    zone.free_shipping_threshold !== null &&
    amount >= Number(zone.free_shipping_threshold);

  const shipping = freeShipping
    ? 0
    : Number(zone.shipping_fee);

  return {
    zone: {
      id: zone.id,
      name: zone.name,
      state: zone.state,
      description: zone.description,
    },
    subtotal: amount,
    shipping,
    freeShipping,
    freeShippingThreshold: zone.free_shipping_threshold,
    total: amount + shipping,
  };
}

module.exports = {
  getAllZones,
  getZoneById,
  getAvailableZones,
  createZone,
  updateZone,
  deleteZone,
  calculateShipping,
};

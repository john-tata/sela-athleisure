const { supabaseAdmin } = require('../../config/supabase');

async function getDashboardStats() {
  const [
    { data: orders },
    { data: products },
    { data: recentOrders }
  ] = await Promise.all([
    supabaseAdmin.from('orders').select('*'),
    supabaseAdmin.from('products').select('*'),
    supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const revenue = (orders || [])
    .filter(o => o.payment_status === 'paid')
    .reduce((sum, o) => sum + Number(o.total || 0), 0);

  const customers = new Set(
    (orders || [])
      .map(o => o.guest_email || o.user_id)
      .filter(Boolean)
  ).size;

  const lowStock = (products || [])
    .filter(p => Number(p.inventory_quantity) <= 5)
    .sort((a, b) => a.inventory_quantity - b.inventory_quantity)
    .slice(0, 5);

  return {
    revenue,
    orders: orders?.length || 0,
    products: products?.length || 0,
    customers,
    recentOrders,
    lowStock,
  };
}

module.exports = {
  getDashboardStats,
};
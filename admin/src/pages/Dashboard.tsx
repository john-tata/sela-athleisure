import { useEffect, useState } from 'react';
import { Package, ShoppingCart, TrendingUp, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';



export default function Dashboard() {
  const [stats, setStats] = useState({
  products: 0,
  orders: 0,
  revenue: 0,
  customers: 0,
});

const [recentOrders, setRecentOrders] = useState<any[]>([]);
const [chartData, setChartData] = useState<any[]>([]);
const [lowStock, setLowStock] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  Promise.all([
    api.get("/products"),
    api.get("/orders"),
  ])
    .then(([prodRes, orderRes]) => {

      const products = prodRes.data?.products || [];
      const orders = orderRes.data?.orders || [];
console.log("ORDERS", orders);
console.log("FIRST ORDER", orders[0]);
      const revenue = orders.reduce(
        (sum: number, order: any) =>
          order.payment_status === "paid"
            ? sum + Number(order.total_amount || 0)
            : sum,
        0
      );

      setStats({
        products: products.length,
        orders: orders.length,
        revenue,
        customers: new Set(
          orders.map((o: any) => o.customer_email || o.guest_email)
        ).size,
      });

      setRecentOrders(orders.slice(0, 5));

      // Monthly revenue chart
      const monthly: Record<string, number> = {};

      orders.forEach((order: any) => {
        if (order.payment_status !== "paid") return;

        const month = new Date(order.created_at).toLocaleString("default", {
          month: "short",
        });

        monthly[month] =
          (monthly[month] || 0) +
          Number(order.total_amount || 0);
      });

      setChartData(
        Object.entries(monthly).map(([month, revenue]) => ({
          month,
          revenue,
        }))
      );

      // Low stock
      setLowStock(
        products
          .filter((p: any) => p.inventory_quantity <= 5)
          .sort(
            (a: any, b: any) =>
              a.inventory_quantity - b.inventory_quantity
          )
          .slice(0, 5)
      );
    })
    .catch(console.error)
    .finally(() => setLoading(false));
}, []);

  const cards = [
    { label: 'Total Products', value: stats.products, icon: Package, color: 'text-[#C89A5A]' },
    { label: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Revenue', value: `N${(stats.revenue / 1000000).toFixed(1)}M`, icon: TrendingUp, color: 'text-emerald-600' },
    { label: 'Customers', value: stats.customers, icon: Users, color: 'text-purple-600' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-blue-100 text-blue-700',
    paid: 'bg-emerald-100 text-emerald-700',
    delivered: 'bg-emerald-100 text-emerald-700',
    shipped: 'bg-indigo-100 text-indigo-700',
  };

  return (
    <div className="space-y-8">
      {loading ? (
        <p className="text-gray-400">Loading dashboard...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.label} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">{c.label}</p>
                      <p className="text-2xl font-semibold text-[#111111] mt-1">{c.value}</p>
                    </div>
                    <Icon size={24} className={c.color} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chart + Recent Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-semibold text-[#111111] mb-6">Monthly Revenue</h2>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `N${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => `N${v.toLocaleString()}`} />
                  <Bar dataKey="revenue" fill="#C89A5A" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-[#111111]">Recent Orders</h2>
              </div>
              <div className="divide-y divide-gray-50">
                {recentOrders.length === 0 ? (
                  <p className="px-6 py-8 text-gray-400 text-center">No orders yet</p>
                ) : (
                  recentOrders.map((o: any) => (
                    <div key={o.id} className="px-6 py-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm text-[#111111]">{o.order_number}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{o.guest_email || 'Guest'}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[o.status] || 'bg-gray-100 text-gray-600'}`}>
                          {o.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-2">N{o.total?.toLocaleString()}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

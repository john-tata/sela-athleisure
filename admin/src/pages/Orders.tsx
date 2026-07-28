import { useState, useEffect } from 'react';
import { Eye, ChevronLeft, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { orderApi } from '../lib/api';
import Modal from '../components/Modal';

interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total_amount: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  created_at: string;
  items?: OrderItem[];
}

interface OrderItem {
  id: string;
  product_name: string;
  variant_label: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'Pending', color: 'bg-amber-50 text-amber-700', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-700', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-purple-50 text-purple-700', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-50 text-green-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-50 text-red-700', icon: XCircle },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.list();
      setOrders(res.orders || res.data || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const openStatus = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setError('');
    setIsStatusOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;
    setSaving(true);
    setError('');
    try {
      await orderApi.updateStatus(selectedOrder.id, newStatus);
      setIsStatusOpen(false);
      fetchOrders();
      // Also refresh detail if open
      if (isDetailOpen) {
        const updated = orders.find(o => o.id === selectedOrder.id);
        if (updated) setSelectedOrder({ ...updated, status: newStatus });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter);

  const StatusBadge = ({ status }: { status: string }) => {
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <config.icon size={12} />
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === s
                ? 'bg-[#111111] text-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Order</th>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Customer</th>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Amount</th>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Payment</th>
              <th className="text-right px-6 py-3.5 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No orders found</td></tr>
            ) : filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-[#111111]">#{order.order_number}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-[#111111]">{order.customer_name || 'Guest'}</p>
                  <p className="text-xs text-gray-400">{order.customer_email || '-'}</p>
                </td>
                <td className="px-6 py-4 font-medium">
                  N{Number(order.total_amount).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium capitalize ${
                    order.payment_status === 'paid'
                      ? 'bg-green-50 text-green-700'
                      : order.payment_status === 'failed'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {order.payment_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openDetail(order)}
                      className="p-2 text-gray-400 hover:text-[#C89A5A] hover:bg-[#C89A5A]/10 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => openStatus(order)}
                      className="px-3 py-1.5 text-xs font-medium text-[#111111] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      Update
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ORDER DETAIL MODAL */}
      <Modal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} title={`Order #${selectedOrder?.order_number}`} size="lg">
        {selectedOrder && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <StatusBadge status={selectedOrder.status} />
              <p className="text-xs text-gray-400">
                {new Date(selectedOrder.created_at).toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                <p className="text-sm font-medium">{selectedOrder.customer_name || 'Guest'}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customer_email || '-'}</p>
                <p className="text-sm text-gray-500">{selectedOrder.customer_phone || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Shipping</p>
                <p className="text-sm text-gray-600 whitespace-pre-line">{selectedOrder.shipping_address || 'No address provided'}</p>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Order Items</p>
              {(selectedOrder.items && selectedOrder.items.length > 0) ? (
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                          <Package size={14} className="text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.product_name}</p>
                          {item.variant_label && <p className="text-xs text-gray-400">{item.variant_label}</p>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">x{item.quantity}</p>
                        <p className="text-sm font-medium">N{Number(item.total_price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No items</p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">Payment: <span className="capitalize font-medium">{selectedOrder.payment_status}</span></p>
              <p className="text-lg font-semibold">Total: N{Number(selectedOrder.total_amount).toLocaleString()}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => { setIsDetailOpen(false); openStatus(selectedOrder); }}
                className="px-5 py-2.5 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-[#333]"
              >
                Update Status
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* STATUS UPDATE MODAL */}
      <Modal isOpen={isStatusOpen} onClose={() => setIsStatusOpen(false)} title="Update Order Status" size="sm">
        <div className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <p className="text-sm text-gray-600">Order <strong>#{selectedOrder?.order_number}</strong></p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(statusConfig).map(([value, config]) => (
                <button
                  key={value}
                  onClick={() => setNewStatus(value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium border transition-all ${
                    newStatus === value
                      ? 'border-[#C89A5A] bg-[#C89A5A]/10 text-[#111111]'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <config.icon size={14} />
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setIsStatusOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button
              onClick={handleStatusUpdate}
              disabled={saving || newStatus === selectedOrder?.status}
              className="px-5 py-2 bg-[#111111] text-white text-sm rounded-lg hover:bg-[#333] disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

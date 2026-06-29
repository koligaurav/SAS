import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { formatPrice } from '../../utils/format';

const STATUSES = ['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-olive/15 text-olive',
  cancelled: 'bg-red-100 text-red-600',
};

const NEXT_STATUS = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'delivered',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  function fetchOrders(status) {
    setLoading(true);
    const q = status && status !== 'all' ? `?status=${status}` : '';
    api.get(`/admin/orders${q}`)
      .then(d => setOrders(d.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => { fetchOrders(filter); }, [filter]);

  async function updateStatus(orderId, status) {
    setUpdating(orderId);
    try {
      const d = await api.put(`/admin/orders/${orderId}/status`, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? d.order : o));
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-coffee">Orders</h1>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
              filter === s ? 'bg-coffee text-cream' : 'bg-white text-muted hover:bg-cream'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white shadow-card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-cream">
                <tr className="text-left text-xs font-medium uppercase tracking-wide text-muted">
                  {['Order', 'Customer', 'Items', 'Total', 'Status', 'Action'].map(h => (
                    <th key={h} className="px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {orders.map(o => (
                  <tr key={o._id} className="hover:bg-cream/40">
                    <td className="px-4 py-3 font-medium text-text whitespace-nowrap">{o.orderId}</td>
                    <td className="px-4 py-3 text-muted">
                      <div>{o.user?.name || o.guestInfo?.name || 'Guest'}</div>
                      <div className="text-xs">{o.user?.email || o.guestInfo?.email || ''}</div>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {o.items.map(i => `${i.quantity}× ${i.name}`).join(', ').slice(0, 40)}
                      {o.items.map(i => i.name).join('').length > 35 ? '…' : ''}
                    </td>
                    <td className="px-4 py-3 font-medium text-coffee whitespace-nowrap">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLOR[o.status] || ''}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {NEXT_STATUS[o.status] ? (
                        <button
                          onClick={() => updateStatus(o._id, NEXT_STATUS[o.status])}
                          disabled={updating === o._id}
                          className="rounded-lg bg-coffee px-3 py-1.5 text-xs font-medium text-cream transition hover:bg-brown disabled:opacity-50 capitalize"
                        >
                          {updating === o._id ? '…' : `→ ${NEXT_STATUS[o.status]}`}
                        </button>
                      ) : o.status !== 'cancelled' ? (
                        <button
                          onClick={() => updateStatus(o._id, 'cancelled')}
                          disabled={updating === o._id}
                          className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      ) : <span className="text-xs text-muted">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

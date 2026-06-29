import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { formatPrice } from '../../utils/format';

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-olive/15 text-olive',
  cancelled: 'bg-red-100 text-red-600',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/analytics/overview').then(d => setStats(d)).catch(console.error);
    api.get('/admin/orders?limit=5').then(d => setOrders(d.orders)).catch(console.error);
  }, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-coffee">Dashboard</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total Orders" value={stats?.totalOrders ?? '—'} color="bg-blue-50 text-blue-700" />
        <KpiCard label="Revenue" value={stats ? formatPrice(stats.totalRevenue) : '—'} color="bg-olive/10 text-olive" />
        <KpiCard label="Customers" value={stats?.totalUsers ?? '—'} color="bg-amber-50 text-amber-700" />
        <KpiCard label="Pending" value={stats?.pendingOrders ?? '—'} color="bg-orange-50 text-orange-700" />
      </div>

      {/* Recent orders */}
      <div className="mt-8 rounded-2xl bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-text">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-olive hover:underline">
            View all →
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream text-left text-xs font-medium uppercase tracking-wide text-muted">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {orders.map(o => (
                  <tr key={o._id}>
                    <td className="py-3 font-medium text-text">{o.orderId}</td>
                    <td className="py-3 text-muted">{o.user?.name || o.guestInfo?.name || 'Guest'}</td>
                    <td className="py-3 font-medium text-coffee">{formatPrice(o.total)}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLOR[o.status] || 'bg-cream text-muted'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 text-muted">
                      {new Date(o.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
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

function KpiCard({ label, value, color }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-card">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 font-display text-2xl font-semibold ${color}`}>{value}</p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { formatPrice } from '../utils/format';
import PageTransition from '../components/PageTransition';
import Navbar from '../components/Navbar';

const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-orange-100 text-orange-700',
  ready: 'bg-green-100 text-green-700',
  delivered: 'bg-olive/15 text-olive',
  cancelled: 'bg-red-100 text-red-600',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then(d => setOrders(d.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageTransition>
      <Navbar onMenuClick={() => {}} />
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-coffee">My Orders</h1>
          <Link to="/" className="text-sm font-medium text-olive hover:underline">← Menu</Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-white shadow-card" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl bg-white py-16 text-center shadow-card">
            <p className="font-display text-lg font-semibold text-coffee">No orders yet</p>
            <p className="mt-1 text-sm text-muted">Your order history will appear here.</p>
            <Link
              to="/"
              className="mt-4 inline-block rounded-xl bg-coffee px-5 py-2.5 text-sm font-medium text-cream hover:bg-brown"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map(order => (
              <li key={order._id} className="rounded-2xl bg-white p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-semibold text-text">{order.orderId}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                    <ul className="mt-2 space-y-0.5">
                      {order.items.map((i, idx) => (
                        <li key={idx} className="text-sm text-muted">
                          {i.quantity}× {i.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display text-base font-semibold text-coffee">
                      {formatPrice(order.total)}
                    </p>
                    <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_COLOR[order.status] || 'bg-cream text-muted'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageTransition>
  );
}

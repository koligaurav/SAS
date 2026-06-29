import { useLocation, Navigate, Link } from 'react-router-dom';
import { formatPrice } from '../utils/format';
import PageTransition from '../components/PageTransition';

export default function OrderSuccess() {
  const { state } = useLocation();

  if (!state) {
    // Guard against landing here directly without an order.
    return <Navigate to="/" replace />;
  }

  const { orderId, prepMinutes, total, name } = state;

  return (
    <PageTransition>
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
        <div className="animate-pop flex h-20 w-20 items-center justify-center rounded-full bg-olive/15 text-olive">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-2xl font-semibold text-coffee">
          Order Placed Successfully
        </h1>
        <p className="mt-1 text-sm text-muted">
          Thanks{name ? `, ${name}` : ''} — we've started preparing your order.
        </p>

        <div className="mt-6 w-full rounded-2xl bg-white p-5 text-left shadow-card">
          <Row label="Order ID" value={orderId} />
          <Row label="Estimated preparation time" value={`${prepMinutes} minutes`} />
          <Row label="Total Paid" value={formatPrice(total)} />
        </div>

        <Link
          to="/"
          className="mt-7 rounded-xl bg-coffee px-6 py-3 text-sm font-medium text-cream transition hover:bg-brown active:scale-95"
        >
          Back to Menu
        </Link>
      </div>
    </PageTransition>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-cream py-2.5 last:border-0">
      <span className="text-sm text-muted">{label}</span>
      <span className="font-display text-sm font-semibold text-text">{value}</span>
    </div>
  );
}

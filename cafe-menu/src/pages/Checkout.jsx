import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { formatPrice } from '../utils/format';
import PageTransition from '../components/PageTransition';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    table: '',
    notes: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');

  if (cartItems.length === 0) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <p className="font-display text-xl font-semibold text-coffee">Nothing to check out yet</p>
          <Link to="/" className="mt-4 inline-block text-sm font-medium text-olive hover:underline">
            ← Back to Menu
          </Link>
        </div>
      </PageTransition>
    );
  }

  const discount = coupon?.discount || 0;
  const grandTotal = totalPrice - discount;

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    setApplyingCoupon(true);
    setCouponError('');
    setCoupon(null);
    try {
      const data = await api.get(
        `/coupons/validate?code=${couponCode.trim()}&orderTotal=${totalPrice}`
      );
      setCoupon(data);
    } catch (err) {
      setCouponError(err.message);
    } finally {
      setApplyingCoupon(false);
    }
  }

  async function handlePay() {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Name and phone are required.');
      return;
    }
    setError('');
    setPaying(true);

    try {
      const items = cartItems.map(({ item, quantity }) => ({
        menuItemId: item.id,
        quantity,
      }));

      const orderData = await api.post('/orders/create', {
        items,
        couponCode: coupon ? couponCode.trim() : '',
        notes: `Table: ${form.table}. ${form.notes}`.trim(),
        guestInfo: !user ? { name: form.name, email: form.email, phone: form.phone } : undefined,
      });

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: 'Brew & Bite',
        description: 'Food Order',
        prefill: {
          name: form.name,
          email: form.email || user?.email || '',
          contact: form.phone,
        },
        theme: { color: '#3c2a21' },
        handler: async (response) => {
          try {
            await api.post('/orders/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.order._id,
            });
            clearCart();
            navigate('/order-success', {
              state: {
                orderId: orderData.order.orderId,
                prepMinutes: 15 + Math.floor(Math.random() * 11),
                total: grandTotal,
                name: form.name,
              },
            });
          } catch {
            setError('Payment verification failed. Contact support.');
            setPaying(false);
          }
        },
        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-0">
        <h1 className="mb-6 font-display text-3xl font-semibold text-coffee">Checkout</h1>

        {/* Order summary */}
        <div className="rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold text-text">Order Summary</h2>
          <ul className="space-y-2">
            {cartItems.map(({ item, quantity }) => (
              <li key={item.id} className="flex justify-between text-sm text-muted">
                <span>{quantity}× {item.name}</span>
                <span className="font-medium text-text">{formatPrice(item.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-cream pt-3 space-y-1">
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-olive">
                <span>Discount ({coupon.coupon.code})</span>
                <span>− {formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold text-coffee pt-1">
              <span>Grand Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div className="mt-5 rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold text-text">Coupon Code</h2>
          <div className="flex gap-2">
            <input
              value={couponCode}
              onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCoupon(null); setCouponError(''); }}
              placeholder="Enter code (e.g. WELCOME20)"
              className="flex-1 rounded-xl border border-brown-light/30 bg-cream px-3.5 py-2.5 text-sm outline-none transition focus:border-olive focus:bg-white"
            />
            <button
              onClick={handleApplyCoupon}
              disabled={applyingCoupon || !couponCode.trim()}
              className="rounded-xl bg-coffee px-4 py-2.5 text-sm font-medium text-cream transition hover:bg-brown disabled:opacity-50"
            >
              {applyingCoupon ? '…' : 'Apply'}
            </button>
          </div>
          {couponError && <p className="mt-2 text-sm text-[#a8412f]">{couponError}</p>}
          {coupon && (
            <p className="mt-2 text-sm text-olive font-medium">
              ✓ {coupon.coupon.discountPercent}% off applied — you save {formatPrice(discount)}
            </p>
          )}
        </div>

        {/* Customer details */}
        <div className="mt-5 rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold text-text">Your Details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name" value={form.name} onChange={handleChange('name')} placeholder="Jordan Lee" />
            <Field label="Phone" value={form.phone} onChange={handleChange('phone')} placeholder="98765 43210" type="tel" />
            {!user && (
              <Field label="Email" value={form.email} onChange={handleChange('email')} placeholder="you@email.com" type="email" />
            )}
            <Field label="Table Number" value={form.table} onChange={handleChange('table')} placeholder="12" />
            <Field label="Special Instructions" value={form.notes} onChange={handleChange('notes')} placeholder="No onions, extra sauce…" />
          </div>
          {error && <p className="mt-3 text-sm font-medium text-[#a8412f]">{error}</p>}
        </div>

        {/* Payment */}
        <div className="mt-5 rounded-2xl bg-white p-5 shadow-card">
          <h2 className="mb-3 font-display text-lg font-semibold text-text">Payment</h2>
          <button
            onClick={handlePay}
            disabled={paying}
            className="flex w-full items-center justify-between rounded-xl border border-olive/40 bg-cream px-4 py-4 transition hover:bg-olive/10 disabled:opacity-70"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-olive text-white text-lg">₹</span>
              <span className="font-display text-base font-semibold text-text">
                {paying ? 'Opening payment…' : 'Pay with Razorpay'}
              </span>
            </span>
            {paying ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-olive border-t-transparent" />
            ) : (
              <span className="font-display text-base font-semibold text-coffee">{formatPrice(grandTotal)}</span>
            )}
          </button>
          <p className="mt-3 text-center text-xs text-muted">
            Supports UPI, cards, net banking via Razorpay.
          </p>
        </div>
      </div>
    </PageTransition>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-text">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-brown-light/30 bg-cream px-3.5 py-2.5 text-sm outline-none transition focus:border-olive focus:bg-white"
      />
    </label>
  );
}

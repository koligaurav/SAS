import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import PageTransition from '../components/PageTransition';

export default function Cart() {
  const { cartItems, totalPrice, incrementItem, decrementItem, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-0">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold text-coffee">Your Cart</h1>
          <Link to="/" className="text-sm font-medium text-olive hover:underline">
            ← Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 text-center shadow-card">
            <span className="mb-3 text-4xl">🛒</span>
            <p className="font-display text-xl font-semibold text-coffee">Your cart is empty</p>
            <p className="mt-1 text-sm text-muted">Add something delicious from the menu.</p>
            <Link
              to="/"
              className="mt-5 rounded-xl bg-coffee px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-brown"
            >
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="space-y-3">
              {cartItems.map(({ item, quantity }) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl bg-white p-3 shadow-card sm:p-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl bg-cream object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-display text-base font-semibold text-text">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted">{formatPrice(item.price)} each</p>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-xl bg-cream px-1.5 py-1">
                        <button
                          onClick={() => decrementItem(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-coffee shadow-sm active:scale-90"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-5 text-center text-sm font-semibold text-coffee">
                          {quantity}
                        </span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-coffee shadow-sm active:scale-90"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-display text-base font-semibold text-coffee">
                        {formatPrice(item.price * quantity)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start flex h-10 w-10 items-center justify-center rounded-lg text-muted transition hover:bg-cream hover:text-[#a8412f]"
                    aria-label={`Remove ${item.name}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 7h12M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-2xl bg-white p-5 shadow-card">
              <div className="flex items-center justify-between text-base font-semibold text-coffee">
                <span>Grand Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={clearCart}
                  className="flex-1 rounded-xl border border-brown-light/40 py-2.5 text-sm font-medium text-muted transition hover:bg-cream"
                >
                  Empty Cart
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="flex-1 rounded-xl bg-coffee py-2.5 text-sm font-medium text-cream transition hover:bg-brown active:scale-95"
                >
                  Place Order
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}

import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function MiniCart() {
  const { cartItems, totalItems, totalPrice, justAddedId } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <>
      {/* Desktop floating panel */}
      <div className="hidden lg:fixed lg:bottom-6 lg:right-6 lg:z-40 lg:block lg:w-72">
        <div className="rounded-2xl bg-white p-4 shadow-featured">
          <div className="flex items-center justify-between border-b border-cream pb-3">
            <span className="flex items-center gap-2 font-display text-sm font-semibold text-coffee">
              <CartIcon className={justAddedId ? 'animate-pop' : ''} />
              Your Order
            </span>
            <span className="rounded-full bg-olive px-2 py-0.5 text-xs font-semibold text-white">
              {totalItems} item{totalItems > 1 ? 's' : ''}
            </span>
          </div>

          <ul className="max-h-40 space-y-2 overflow-y-auto py-3">
            {cartItems.map(({ item, quantity }) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span className="truncate pr-2 text-text">
                  {quantity}× {item.name}
                </span>
                <span className="shrink-0 font-medium text-muted">
                  {formatPrice(item.price * quantity)}
                </span>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between border-t border-cream pt-3 text-sm font-semibold text-coffee">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="mt-3 w-full rounded-xl bg-coffee py-2.5 text-sm font-medium text-cream transition hover:bg-brown active:scale-95"
          >
            Checkout
          </button>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <button
        onClick={() => navigate('/cart')}
        className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between rounded-2xl bg-coffee px-4 py-3.5 text-cream shadow-featured lg:hidden"
      >
        <span className="flex items-center gap-2 text-sm font-medium">
          <CartIcon className={justAddedId ? 'animate-pop' : ''} />
          {totalItems} item{totalItems > 1 ? 's' : ''}
        </span>
        <span className="font-display text-base font-semibold">{formatPrice(totalPrice)}</span>
      </button>
    </>
  );
}

function CartIcon({ className = '' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="20" r="1.4" fill="currentColor" />
      <circle cx="17" cy="20" r="1.4" fill="currentColor" />
    </svg>
  );
}

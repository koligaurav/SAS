import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { categories } from '../data/menuData';
import VegBadge from './VegBadge';
import RatingStars from './RatingStars';

export default function QuickViewModal({ item, onClose }) {
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();

  // Allow closing with Escape, and lock page scroll while open.
  useEffect(() => {
    if (!item) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [item, onClose]);

  if (!item) return null;

  const quantity = getQuantity(item.id);
  const categoryLabel = categories.find((c) => c.key === item.category)?.label ?? item.category;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-coffee/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="animate-fade-in relative w-full max-w-md overflow-hidden rounded-t-3xl bg-white shadow-featured sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-label={item.name}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-coffee shadow-card"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative aspect-square w-full bg-cream">
          <img src={item.image} alt={item.name} className="h-full w-full object-contain p-4" />
          <span className="absolute left-4 top-4">
            <VegBadge veg={item.veg} />
          </span>
        </div>

        <div className="max-h-[45vh] overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="mb-1 inline-block rounded-full bg-cream px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-muted">
                {categoryLabel}
              </span>
              <h2 className="font-display text-xl font-semibold text-text">{item.name}</h2>
            </div>
            <RatingStars rating={item.rating} />
          </div>

          <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>

          <div className="mt-5 flex items-center justify-between">
            <span className="font-display text-2xl font-semibold text-coffee">
              {formatPrice(item.price)}
            </span>

            {quantity === 0 ? (
              <button
                onClick={() => addItem(item)}
                className="rounded-xl bg-coffee px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-brown active:scale-95"
              >
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-xl bg-cream px-2 py-1.5">
                <button
                  onClick={() => decrementItem(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-coffee shadow-sm active:scale-90"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-semibold text-coffee">{quantity}</span>
                <button
                  onClick={() => incrementItem(item.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-coffee shadow-sm active:scale-90"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

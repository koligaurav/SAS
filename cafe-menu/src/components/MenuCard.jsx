import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import RatingStars from './RatingStars';
import VegBadge from './VegBadge';

export default function MenuCard({ item, onQuickView }) {
  const { addItem, incrementItem, decrementItem, getQuantity } = useCart();
  const quantity = getQuantity(item.id);

  return (
    <div
      className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-card
        transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
    >
      <button
        onClick={() => onQuickView(item)}
        className="relative aspect-square w-full overflow-hidden bg-cream"
        aria-label={`View ${item.name}`}
      >
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3">
          <VegBadge veg={item.veg} />
        </span>
      </button>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold leading-snug text-text">
            {item.name}
          </h3>
          <RatingStars rating={item.rating} />
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-muted">{item.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-semibold text-coffee">
            {formatPrice(item.price)}
          </span>

          {quantity === 0 ? (
            <button
              onClick={() => addItem(item)}
              className="rounded-xl bg-coffee px-4 py-2 text-sm font-medium text-cream
                transition-transform duration-150 hover:bg-brown active:scale-95"
            >
              Add to Cart
            </button>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-cream px-1.5 py-1">
              <button
                onClick={() => decrementItem(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-coffee shadow-sm transition active:scale-90"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-5 text-center text-sm font-semibold text-coffee">{quantity}</span>
              <button
                onClick={() => incrementItem(item.id)}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-coffee shadow-sm transition active:scale-90"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

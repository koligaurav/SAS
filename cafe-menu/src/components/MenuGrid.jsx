import MenuCard from './MenuCard';

export default function MenuGrid({ items, onQuickView }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-white/60 py-20 text-center">
        <span className="mb-2 text-3xl">🔍</span>
        <p className="font-display text-lg font-semibold text-coffee">No dishes found</p>
        <p className="mt-1 text-sm text-muted">Try a different search term or category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} onQuickView={onQuickView} />
      ))}
    </div>
  );
}

import { categories } from '../data/menuData';

export default function Sidebar({ activeCategory, onSelect, isOpen, onClose }) {
  const handleSelect = (key) => {
    onSelect(key);
    onClose?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-coffee/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 shrink-0 overflow-y-auto
          border-r border-brown-light/20 bg-white px-4 pt-24 pb-8
          transition-transform duration-300 ease-out
          lg:sticky lg:top-20 lg:z-0 lg:h-[calc(100vh-5rem)] lg:translate-x-0 lg:pt-6
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="mb-4 flex items-center justify-between px-2">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-muted">
            Categories
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-coffee hover:bg-cream lg:hidden"
            aria-label="Close categories"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav className="flex flex-col gap-1">
          {categories.map((cat) => {
            const isActive = cat.key === activeCategory;
            return (
              <button
                key={cat.key}
                onClick={() => handleSelect(cat.key)}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? 'bg-coffee text-cream shadow-card'
                      : 'text-text hover:bg-cream'
                  }
                `}
              >
                <span className="text-lg leading-none">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

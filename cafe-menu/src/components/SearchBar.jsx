export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search for pizza, coffee, dessert…"
        className="w-full rounded-2xl border border-brown-light/30 bg-white py-3.5 pl-12 pr-4 text-sm
          text-text shadow-card outline-none transition focus:border-olive"
      />
    </div>
  );
}

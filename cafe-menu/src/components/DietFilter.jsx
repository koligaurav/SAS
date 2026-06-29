const OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'veg', label: 'Veg' },
  { key: 'non-veg', label: 'Non-Veg' },
];

export default function DietFilter({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((opt) => {
        const isActive = opt.key === value;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200
              ${isActive ? 'bg-coffee text-cream shadow-card' : 'bg-white text-text hover:bg-cream'}
            `}
          >
            {opt.key !== 'all' && (
              <span
                className={`inline-flex h-3.5 w-3.5 items-center justify-center rounded-[3px] border-[1.5px] ${
                  opt.key === 'veg'
                    ? isActive ? 'border-cream' : 'border-olive'
                    : isActive ? 'border-cream' : 'border-[#a8412f]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    opt.key === 'veg'
                      ? isActive ? 'bg-cream' : 'bg-olive'
                      : isActive ? 'bg-cream' : 'bg-[#a8412f]'
                  }`}
                />
              </span>
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function VegBadge({ veg }) {
  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] ${
        veg ? 'border-olive' : 'border-[#a8412f]'
      }`}
      aria-label={veg ? 'Vegetarian' : 'Non-vegetarian'}
      title={veg ? 'Vegetarian' : 'Non-vegetarian'}
    >
      <span className={`h-2 w-2 rounded-full ${veg ? 'bg-olive' : 'bg-[#a8412f]'}`} />
    </span>
  );
}

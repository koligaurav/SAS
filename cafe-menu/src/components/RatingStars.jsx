export default function RatingStars({ rating }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-coffee">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#c89f7d">
        <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 6.9L12 17.1 5.7 20.8l1.7-6.9L2 9.2l7.1-.6L12 2z" />
      </svg>
      {rating.toFixed(1)}
    </span>
  );
}

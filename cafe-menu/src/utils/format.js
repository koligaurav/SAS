export function formatPrice(value) {
  return `₹${value.toFixed(0)}`;
}

export function generateOrderId() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  return `BB-${stamp}`;
}

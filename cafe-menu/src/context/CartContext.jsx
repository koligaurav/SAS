import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  // cart: { [itemId]: { item, quantity } }
  const [cart, setCart] = useState({});
  const [justAddedId, setJustAddedId] = useState(null);

  const addItem = useCallback((item) => {
    setCart((prev) => {
      const existing = prev[item.id];
      return {
        ...prev,
        [item.id]: {
          item,
          quantity: existing ? existing.quantity + 1 : 1,
        },
      };
    });
    setJustAddedId(item.id);
    window.clearTimeout(window.__cartPopTimeout);
    window.__cartPopTimeout = window.setTimeout(() => setJustAddedId(null), 400);
  }, []);

  const removeItem = useCallback((itemId) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }, []);

  const setQuantity = useCallback((itemId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      if (!prev[itemId]) return prev;
      return { ...prev, [itemId]: { ...prev[itemId], quantity } };
    });
  }, []);

  const incrementItem = useCallback((itemId) => {
    setCart((prev) => {
      if (!prev[itemId]) return prev;
      return { ...prev, [itemId]: { ...prev[itemId], quantity: prev[itemId].quantity + 1 } };
    });
  }, []);

  const decrementItem = useCallback((itemId) => {
    setCart((prev) => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: { ...existing, quantity: existing.quantity - 1 } };
    });
  }, []);

  const clearCart = useCallback(() => setCart({}), []);

  const cartItems = useMemo(() => Object.values(cart), [cart]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.quantity, 0),
    [cartItems]
  );

  const totalPrice = useMemo(
    () => cartItems.reduce((sum, entry) => sum + entry.quantity * entry.item.price, 0),
    [cartItems]
  );

  const getQuantity = useCallback((itemId) => cart[itemId]?.quantity ?? 0, [cart]);

  const value = {
    cartItems,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    setQuantity,
    incrementItem,
    decrementItem,
    clearCart,
    getQuantity,
    justAddedId,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

# Brew & Bite — Café Ordering Frontend

A demo restaurant-ordering frontend built with React (Vite), Tailwind CSS v4, and React Router.

## Run it

```
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## What's inside

- **Menu** (`/`) — sidebar category filters, search, a featured-dish banner that updates when you click any item, and a responsive card grid.
- **Cart** (`/cart`) — quantity controls, remove item, empty cart, totals.
- **Checkout** (`/checkout`) — customer details form + simulated UPI payment.
- **Order Success** (`/order-success`) — confirmation with a generated order ID and estimated prep time.

All menu data lives in `src/data/menuData.js` and images in `src/assets/food/` — both are demo content using local JSON-style data, no backend required.

## Structure

```
src/
  assets/food/    food images
  components/      reusable UI (Navbar, Sidebar, MenuCard, MiniCart, etc.)
  context/         CartContext (cart state + actions)
  data/            menuData.js (categories + 16 menu items)
  pages/           Home, Cart, Checkout, OrderSuccess
  utils/           formatPrice, generateOrderId
```

## Extending for production

- Swap `menuData.js` for an API/CMS fetch.
- Cart state currently resets on refresh — add persistence (e.g. an API-backed cart) if needed.
- The UPI "payment" is a 1.4s simulated delay; wire it to a real payment gateway when ready.

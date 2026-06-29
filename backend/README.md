# Brew & Bite — Backend API

Express + MongoDB REST API powering the Brew & Bite cafe ordering system.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js ≥ 18 |
| Framework | Express 4 |
| Database | MongoDB (Mongoose 8) |
| Auth | JWT + bcryptjs |
| Payments | Razorpay |
| Module system | ES Modules (`"type": "module"`) |

---

## Project Structure

```
backend/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── auth.controller.js     # Register, login, profile
│   ├── menu.controller.js     # Menu CRUD
│   ├── cart.controller.js     # Per-user server cart
│   ├── order.controller.js    # Create + verify Razorpay orders
│   ├── admin.controller.js    # Order mgmt, users, broadcast
│   ├── coupon.controller.js   # Coupon CRUD + validation
│   ├── analytics.controller.js# Revenue, popular items, KPIs
│   └── notification.controller.js
├── middlewares/
│   └── auth.js                # protect() + adminOnly()
├── models/
│   ├── User.js
│   ├── MenuItem.js
│   ├── Order.js
│   ├── Cart.js
│   ├── Coupon.js
│   └── Notification.js
├── routes/
│   ├── auth.routes.js
│   ├── menu.routes.js
│   ├── cart.routes.js
│   ├── order.routes.js
│   ├── admin.routes.js
│   ├── coupon.routes.js
│   ├── analytics.routes.js
│   └── notification.routes.js
├── seed/
│   ├── seedMenu.js            # Seeds 16 menu items
│   └── createAdmin.js         # Creates admin user
├── .env.example
├── index.js                   # Entry point
└── package.json
```

---

## Step 1 — What to Change

### 1.1 Create your `.env` file

```bash
cp .env.example .env
```

Then open `.env` and fill in every value:

```env
PORT=5000
MONGODB_URI=mongodb+srv://koligauravkoli10_db_user:XV9FUlV1pGbP38se@cluster0.9uchrtw.mongodb.net/?appName=Cluster0
JWT_SECRET=33dd3bec31fe9279790688d6ae1d77cd2984b53ed3188acaab0b6c59ed846fb32ecd9778aa6ffaec620df2989a740535f0ea4c6403a28012ce14554c26c67369
JWT_EXPIRES_IN=7d

RAZORPAY_KEY_ID=rzp_test_T6wd3XJj5TCOcv
RAZORPAY_KEY_SECRET=711bS4CrHY2rCMbuhEQpQ9Sp
CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=koligauravkoli10@gmail.com
ADMIN_PASSWORD=Gaurav@10
```

| Variable | Where to get it |
|---|---|
| `MONGODB_URI` | Local: keep as-is. Cloud: get from MongoDB Atlas (see Step 3) |
| `JWT_SECRET` | Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Same page as above |
| `CLIENT_URL` | Local: `http://localhost:5173`. Production: your deployed frontend URL |
| `ADMIN_EMAIL` | Your choice — used to log in to the admin panel |
| `ADMIN_PASSWORD` | Your choice — change this before deploying |

### 1.2 Razorpay Setup

1. Sign up at [razorpay.com](https://razorpay.com)
2. Go to **Settings → API Keys → Generate Key**
3. Copy `Key ID` and `Key Secret` into your `.env`
4. For testing, use Razorpay test mode keys (start with `rzp_test_`)
5. Test card: `4111 1111 1111 1111`, any future date, any CVV

---

## Step 2 — Run Locally

### Prerequisites

- Node.js v18 or higher
- MongoDB running locally **or** a MongoDB Atlas URI

### Install & seed

```bash
# Install dependencies
npm install

# Seed the menu (16 items from the original menuData.js)
npm run seed:menu

# Create the admin user (uses ADMIN_EMAIL + ADMIN_PASSWORD from .env)
npm run seed:admin
```

### Start the server

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`

Verify it's running:
```bash
curl http://localhost:5000/api/health
# → {"status":"ok","timestamp":"..."}
```

---

## Step 3 — Deploy to Production

### Option A: Render (Recommended — free tier available)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo, select the `backend/` folder as root
4. Set:
   - **Build command**: `npm install`
   - **Start command**: `npm start`
   - **Node version**: 18
5. Add all environment variables from your `.env` in the **Environment** tab
6. For `MONGODB_URI`, use MongoDB Atlas (see below)
7. Deploy — Render gives you a URL like `https://brew-bite-api.onrender.com`

### Option B: Railway

1. Go to [railway.app](https://railway.app) → **New Project → Deploy from GitHub**
2. Select your repo, set root to `backend/`
3. Add environment variables in the **Variables** tab
4. Railway auto-detects Node and deploys

### Option C: VPS (DigitalOcean / AWS EC2)

```bash
# On your server
git clone <your-repo>
cd backend
npm install
cp .env.example .env
# fill in .env values

# Run with PM2 (keeps it alive)
npm install -g pm2
pm2 start index.js --name brew-bite-api
pm2 save
pm2 startup
```

### MongoDB Atlas (Cloud Database)

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. **Database Access** → Add user with password
3. **Network Access** → Add IP `0.0.0.0/0` (allow all) or your server IP
4. **Connect → Compass/Drivers** → Copy the URI:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/brew-and-bite
   ```
5. Paste it as `MONGODB_URI` in your `.env`

After deploying, run the seed scripts once:
```bash
npm run seed:menu
npm run seed:admin
```

---

## Step 4 — Connect the Frontend

### 4.1 Create an API base URL config in the frontend

Create `cafe-menu/src/lib/api.js`:

```js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};
```

### 4.2 Add environment variable to the frontend

Create `cafe-menu/.env.local`:
```env
# Local development
VITE_API_URL=http://localhost:5000/api
```

For production, create `cafe-menu/.env.production`:
```env
VITE_API_URL=https://your-deployed-backend.onrender.com/api
```

### 4.3 Replace static menuData.js with API call

In `cafe-menu/src/pages/Home.jsx`, replace the static import with:

```js
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

// Inside the component:
const [menuItems, setMenuItems] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  api.get('/menu')
    .then(data => setMenuItems(data.items))
    .finally(() => setLoading(false));
}, []);
```

### 4.4 Razorpay checkout integration

Install the Razorpay script in `cafe-menu/index.html`:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

In your `Checkout.jsx`, replace the simulated payment with:

```js
async function handlePay() {
  // 1. Create order on backend
  const { razorpayOrderId, amount, currency, key, order } = await api.post('/orders/create', {
    items: cartItems.map(i => ({ menuItemId: i.id, quantity: i.quantity })),
    couponCode,
    deliveryAddress,
  });

  // 2. Open Razorpay modal
  const rzp = new window.Razorpay({
    key,
    amount,
    currency,
    order_id: razorpayOrderId,
    name: 'Brew & Bite',
    description: 'Food Order',
    handler: async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
      // 3. Verify on backend
      await api.post('/orders/verify', {
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        orderId: order._id,
      });
      clearCart();
      navigate('/order-success', { state: { order } });
    },
    prefill: { name: customerName, email: customerEmail },
    theme: { color: '#3c2a21' },
  });
  rzp.open();
}
```

---

## API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register customer |
| POST | `/api/auth/login` | — | Customer login |
| POST | `/api/auth/admin/login` | — | Admin login |
| GET | `/api/auth/me` | ✅ | Get current user |
| PUT | `/api/auth/me` | ✅ | Update profile |

### Menu
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/menu` | — | List items (supports `?category=Pizza&veg=true&search=burger`) |
| GET | `/api/menu/categories` | — | All category names |
| GET | `/api/menu/:id` | — | Single item |
| POST | `/api/menu` | Admin | Create item |
| PUT | `/api/menu/:id` | Admin | Update item |
| DELETE | `/api/menu/:id` | Admin | Delete item |

### Cart
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cart` | ✅ | Get cart |
| POST | `/api/cart/add` | ✅ | Add item `{ menuItemId, quantity }` |
| PUT | `/api/cart/update` | ✅ | Update qty `{ menuItemId, quantity }` (0 removes) |
| DELETE | `/api/cart/clear` | ✅ | Clear cart |

### Orders
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders/create` | Optional | Create Razorpay order |
| POST | `/api/orders/verify` | Optional | Verify payment signature |
| GET | `/api/orders` | ✅ | User's order history |
| GET | `/api/orders/:id` | ✅ | Single order |

### Coupons
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/coupons/validate?code=X&orderTotal=500` | — | Validate coupon |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/orders` | All orders (paginated, filterable by status) |
| PUT | `/api/admin/orders/:id/status` | Update order status |
| GET | `/api/admin/users` | All customers |
| GET | `/api/admin/menu` | Menu list |
| POST | `/api/admin/menu` | Add menu item |
| PUT | `/api/admin/menu/:id` | Edit menu item |
| DELETE | `/api/admin/menu/:id` | Delete menu item |
| GET | `/api/admin/coupons` | All coupons |
| POST | `/api/admin/coupons` | Create coupon |
| PUT | `/api/admin/coupons/:id` | Edit coupon |
| DELETE | `/api/admin/coupons/:id` | Delete coupon |
| POST | `/api/admin/notifications/broadcast` | Send promo to all users |

### Analytics (Admin)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/overview` | Total orders, revenue, users, pending |
| GET | `/api/analytics/revenue?days=7` | Daily revenue chart data |
| GET | `/api/analytics/popular-items` | Top 10 ordered items |
| GET | `/api/analytics/orders-by-status` | Order count per status |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notifications` | User's notifications + unread count |
| PUT | `/api/notifications/read` | Mark all as read |
| PUT | `/api/notifications/:id/read` | Mark one as read |

---

## Order Status Flow

```
pending → confirmed → preparing → ready → delivered
                                        ↘ cancelled
```

Each status change via `/api/admin/orders/:id/status` automatically creates a notification for the customer.

---

## Coupon Format (POST /api/admin/coupons)

```json
{
  "code": "WELCOME20",
  "discountPercent": 20,
  "maxDiscount": 100,
  "minOrder": 299,
  "maxUses": 500,
  "expiresAt": "2025-12-31T23:59:59.000Z"
}
```

---

## Scripts

```bash
npm run dev          # Start with nodemon (development)
npm start            # Start without nodemon (production)
npm run seed:menu    # Seed 16 menu items into MongoDB
npm run seed:admin   # Create admin user from .env values
```

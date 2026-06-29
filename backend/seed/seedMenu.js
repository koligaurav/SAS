import 'dotenv/config';
import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js';

// Names and categories MUST match the frontend's menuData.js exactly
// so the imageMap lookup works correctly.
const menuItems = [
  {
    name: 'Classic Margherita Pizza',
    category: 'pizza',
    price: 299, rating: 4.6, veg: true,
    description: 'Hand-stretched dough, San Marzano tomato sauce, fresh mozzarella, and basil.',
    featured: true,
  },
  {
    name: 'Farmhouse Veg Pizza',
    category: 'pizza',
    price: 349, rating: 4.5, veg: true,
    description: 'Loaded with bell peppers, onions, mushroom, corn, and olives.',
  },
  {
    name: 'Grilled Chicken Burger',
    category: 'burger',
    price: 259, rating: 4.7, veg: false,
    description: 'Char-grilled chicken patty, lettuce, smoked mayo, toasted brioche bun.',
    featured: true,
  },
  {
    name: 'Crispy Veg Burger',
    category: 'burger',
    price: 199, rating: 4.4, veg: true,
    description: 'Crunchy potato-veg patty, fresh lettuce, tangy sauce, sesame bun.',
  },
  {
    name: 'Loaded Peri-Peri Fries',
    category: 'snacks',
    price: 179, rating: 4.5, veg: true,
    description: 'Golden fries tossed in peri-peri seasoning, topped with cheese sauce.',
    featured: true,
  },
  {
    name: 'White Sauce Penne Pasta',
    category: 'pasta',
    price: 269, rating: 4.5, veg: true,
    description: 'Penne in a creamy white sauce with herbs, garlic, and parmesan.',
  },
  {
    name: 'Paneer Tikka Wrap',
    category: 'wrap',
    price: 219, rating: 4.6, veg: true,
    description: 'Smoky tandoori paneer, mint chutney, and crunchy onions in a soft roll.',
    featured: true,
  },
  {
    name: 'Veg Club Sandwich',
    category: 'sandwich',
    price: 189, rating: 4.3, veg: true,
    description: 'Triple-decker with fresh veggies, cheese, and herbed mayo.',
  },
  {
    name: 'Chicken Cheese Sandwich',
    category: 'sandwich',
    price: 229, rating: 4.6, veg: false,
    description: 'Shredded chicken, melted cheese, and a smoky chipotle spread.',
  },
  {
    name: 'Hot & Crispy Chicken Wings',
    category: 'appetizer',
    price: 299, rating: 4.8, veg: false,
    description: 'Double-fried wings glazed in a fiery hot sauce, served with dip.',
    featured: true,
  },
  {
    name: 'Chocolate Brownie with Ice Cream',
    category: 'dessert',
    price: 249, rating: 4.7, veg: true,
    description: 'Warm fudge brownie, vanilla ice cream, and dark chocolate drizzle.',
  },
  {
    name: 'Classic New York Cheesecake',
    category: 'dessert',
    price: 279, rating: 4.6, veg: true,
    description: 'Rich, creamy cheesecake on a buttery biscuit base.',
  },
  {
    name: 'Chocolate Thick Shake',
    category: 'beverage',
    price: 169, rating: 4.5, veg: true,
    description: 'Velvety chocolate milkshake topped with whipped cream.',
  },
  {
    name: 'Cold Coffee with Ice Cream',
    category: 'beverage',
    price: 179, rating: 4.6, veg: true,
    description: 'Chilled coffee blended with vanilla ice cream and a dusting of cocoa.',
  },
  {
    name: 'Mango Smoothie',
    category: 'beverage',
    price: 159, rating: 4.4, veg: true,
    description: 'Fresh mango blended with yogurt and a hint of honey.',
  },
  {
    name: 'Cappuccino',
    category: 'coffee',
    price: 139, rating: 4.5, veg: true,
    description: 'Espresso topped with steamed milk and a thick layer of foam.',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await MenuItem.deleteMany({});
  const inserted = await MenuItem.insertMany(menuItems);
  console.log(`Seeded ${inserted.length} menu items`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });

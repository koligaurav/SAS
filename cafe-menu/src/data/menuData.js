// Demo menu data for the café ordering app.
// Each item maps to a real image shipped in src/assets/food.

import margheritaPizza from '../assets/food/margherita-pizza.jpg';
import farmhousePizza from '../assets/food/farmhouse-pizza.jpg';
import grilledChickenBurger from '../assets/food/grilled-chicken-burger.jpg';
import vegBurger from '../assets/food/veg-burger.jpg';
import periPeriFries from '../assets/food/peri-peri-fries.jpg';
import whiteSaucePasta from '../assets/food/white-sauce-pasta.jpg';
import paneerTikkaWrap from '../assets/food/paneer-tikka-wrap.jpg';
import vegClubSandwich from '../assets/food/veg-club-sandwich.jpg';
import chickenCheeseSandwich from '../assets/food/chicken-cheese-sandwich.jpg';
import chickenWings from '../assets/food/chicken-wings.jpg';
import chocolateBrownie from '../assets/food/chocolate-brownie.webp';
import cheesecake from '../assets/food/cheesecake.webp';
import chocolateShake from '../assets/food/chocolate-shake.jpg';
import coldCoffee from '../assets/food/cold-coffee.webp';
import mangoSmoothie from '../assets/food/mango-smoothie.jpg';
import cappuccino from '../assets/food/cappuccino.webp';

// Lookup table so API items (which have no bundled image) can resolve local assets by name.
export const imageMap = {
  'Classic Margherita Pizza': margheritaPizza,
  'Farmhouse Veg Pizza': farmhousePizza,
  'Grilled Chicken Burger': grilledChickenBurger,
  'Crispy Veg Burger': vegBurger,
  'Loaded Peri-Peri Fries': periPeriFries,
  'White Sauce Penne Pasta': whiteSaucePasta,
  'Paneer Tikka Wrap': paneerTikkaWrap,
  'Veg Club Sandwich': vegClubSandwich,
  'Chicken Cheese Sandwich': chickenCheeseSandwich,
  'Hot & Crispy Chicken Wings': chickenWings,
  'Chocolate Brownie with Ice Cream': chocolateBrownie,
  'Classic New York Cheesecake': cheesecake,
  'Chocolate Thick Shake': chocolateShake,
  'Cold Coffee with Ice Cream': coldCoffee,
  'Mango Smoothie': mangoSmoothie,
  'Cappuccino': cappuccino,
};

// Categories shown in the left sidebar. `key` is used for filtering,
// `icon` is a single emoji glyph (kept dependency-free for the demo).
export const categories = [
  { key: 'all', label: 'All', icon: '🍽️' },
  { key: 'pizza', label: 'Pizza', icon: '🍕' },
  { key: 'burger', label: 'Burger', icon: '🍔' },
  { key: 'sandwich', label: 'Sandwich', icon: '🥪' },
  { key: 'pasta', label: 'Pasta', icon: '🍝' },
  { key: 'wrap', label: 'Wrap', icon: '🌯' },
  { key: 'snacks', label: 'Snacks', icon: '🍟' },
  { key: 'appetizer', label: 'Appetizer', icon: '🍗' },
  { key: 'dessert', label: 'Dessert', icon: '🍰' },
  { key: 'beverage', label: 'Beverage', icon: '🥤' },
  { key: 'coffee', label: 'Coffee', icon: '☕' },
];

export const menuItems = [
  {
    id: 'margherita-pizza',
    name: 'Classic Margherita Pizza',
    category: 'pizza',
    price: 450,
    rating: 4.6,
    veg: true,
    description: 'Hand-stretched dough, San Marzano tomato sauce, fresh mozzarella, and basil.',
    image: margheritaPizza,
  },
  {
    id: 'farmhouse-pizza',
    name: 'Farmhouse Veg Pizza',
    category: 'pizza',
    price: 349,
    rating: 4.5,
    veg: true,
    description: 'Loaded with bell peppers, onions, mushroom, corn, and olives.',
    image: farmhousePizza,
  },
  {
    id: 'grilled-chicken-burger',
    name: 'Grilled Chicken Burger',
    category: 'burger',
    price: 259,
    rating: 4.7,
    veg: false,
    description: 'Char-grilled chicken patty, lettuce, smoked mayo, toasted brioche bun.',
    image: grilledChickenBurger,
  },
  {
    id: 'veg-burger',
    name: 'Crispy Veg Burger',
    category: 'burger',
    price: 199,
    rating: 4.4,
    veg: true,
    description: 'Crunchy potato-veg patty, fresh lettuce, tangy sauce, sesame bun.',
    image: vegBurger,
  },
  {
    id: 'peri-peri-fries',
    name: 'Loaded Peri-Peri Fries',
    category: 'snacks',
    price: 179,
    rating: 4.5,
    veg: true,
    description: 'Golden fries tossed in peri-peri seasoning, topped with cheese sauce.',
    image: periPeriFries,
  },
  {
    id: 'white-sauce-pasta',
    name: 'White Sauce Penne Pasta',
    category: 'pasta',
    price: 269,
    rating: 4.5,
    veg: true,
    description: 'Penne in a creamy white sauce with herbs, garlic, and parmesan.',
    image: whiteSaucePasta,
  },
  {
    id: 'paneer-tikka-wrap',
    name: 'Paneer Tikka Wrap',
    category: 'wrap',
    price: 219,
    rating: 4.6,
    veg: true,
    description: 'Smoky tandoori paneer, mint chutney, and crunchy onions in a soft roll.',
    image: paneerTikkaWrap,
  },
  {
    id: 'veg-club-sandwich',
    name: 'Veg Club Sandwich',
    category: 'sandwich',
    price: 189,
    rating: 4.3,
    veg: true,
    description: 'Triple-decker with fresh veggies, cheese, and herbed mayo.',
    image: vegClubSandwich,
  },
  {
    id: 'chicken-cheese-sandwich',
    name: 'Chicken Cheese Sandwich',
    category: 'sandwich',
    price: 229,
    rating: 4.6,
    veg: false,
    description: 'Shredded chicken, melted cheese, and a smoky chipotle spread.',
    image: chickenCheeseSandwich,
  },
  {
    id: 'chicken-wings',
    name: 'Hot & Crispy Chicken Wings',
    category: 'appetizer',
    price: 299,
    rating: 4.8,
    veg: false,
    description: 'Double-fried wings glazed in a fiery hot sauce, served with dip.',
    image: chickenWings,
  },
  {
    id: 'chocolate-brownie',
    name: 'Chocolate Brownie with Ice Cream',
    category: 'dessert',
    price: 249,
    rating: 4.7,
    veg: true,
    description: 'Warm fudge brownie, vanilla ice cream, and dark chocolate drizzle.',
    image: chocolateBrownie,
  },
  {
    id: 'cheesecake',
    name: 'Classic New York Cheesecake',
    category: 'dessert',
    price: 279,
    rating: 4.6,
    veg: true,
    description: 'Rich, creamy cheesecake on a buttery biscuit base.',
    image: cheesecake,
  },
  {
    id: 'chocolate-shake',
    name: 'Chocolate Thick Shake',
    category: 'beverage',
    price: 169,
    rating: 4.5,
    veg: true,
    description: 'Velvety chocolate milkshake topped with whipped cream.',
    image: chocolateShake,
  },
  {
    id: 'cold-coffee',
    name: 'Cold Coffee with Ice Cream',
    category: 'beverage',
    price: 179,
    rating: 4.6,
    veg: true,
    description: 'Chilled coffee blended with vanilla ice cream and a dusting of cocoa.',
    image: coldCoffee,
  },
  {
    id: 'mango-smoothie',
    name: 'Mango Smoothie',
    category: 'beverage',
    price: 159,
    rating: 4.4,
    veg: true,
    description: 'Fresh mango blended with yogurt and a hint of honey.',
    image: mangoSmoothie,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'coffee',
    price: 139,
    rating: 4.5,
    veg: true,
    description: 'Espresso topped with steamed milk and a thick layer of foam.',
    image: cappuccino,
  },
];

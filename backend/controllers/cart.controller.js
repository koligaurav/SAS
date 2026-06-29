import Cart from '../models/Cart.js';
import MenuItem from '../models/MenuItem.js';

export async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.menuItem');
    res.json({ cart: cart || { items: [] } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function addToCart(req, res) {
  try {
    const { menuItemId, quantity = 1 } = req.body;
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem || !menuItem.available)
      return res.status(404).json({ message: 'Item not available' });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const idx = cart.items.findIndex(i => i.menuItem.toString() === menuItemId);
    if (idx > -1) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ menuItem: menuItemId, quantity });
    }
    await cart.save();
    await cart.populate('items.menuItem');
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateCartItem(req, res) {
  try {
    const { menuItemId, quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.menuItem.toString() !== menuItemId);
    } else {
      const idx = cart.items.findIndex(i => i.menuItem.toString() === menuItemId);
      if (idx > -1) cart.items[idx].quantity = quantity;
    }
    await cart.save();
    await cart.populate('items.menuItem');
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function clearCart(req, res) {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

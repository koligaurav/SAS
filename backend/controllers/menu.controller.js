import MenuItem from '../models/MenuItem.js';

export async function getMenu(req, res) {
  try {
    const { category, veg, search, featured, all } = req.query;
    // admin passes ?all=true to bypass the available filter
    const filter = all === 'true' ? {} : { available: true };
    if (category && category !== 'All') filter.category = category;
    if (veg === 'true') filter.veg = true;
    if (veg === 'false') filter.veg = false;
    if (featured === 'true') filter.featured = true;
    if (search) filter.name = { $regex: search, $options: 'i' };
    const items = await MenuItem.find(filter).sort({ featured: -1, rating: -1 });
    res.json({ items });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getMenuItem(req, res) {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await MenuItem.distinct('category', { available: true });
    res.json({ categories: ['All', ...categories] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createMenuItem(req, res) {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ item });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function updateMenuItem(req, res) {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ item });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteMenuItem(req, res) {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

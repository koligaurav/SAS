import Order from '../models/Order.js';
import User from '../models/User.js';
import MenuItem from '../models/MenuItem.js';

export async function getOverview(req, res) {
  try {
    const [totalOrders, totalUsers, totalMenuItems, revenueAgg, pendingOrders] = await Promise.all([
      Order.countDocuments({ paymentStatus: 'paid' }),
      User.countDocuments({ role: 'customer' }),
      MenuItem.countDocuments({ available: true }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Order.countDocuments({ status: { $in: ['pending', 'confirmed', 'preparing'] } }),
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalMenuItems,
      totalRevenue: revenueAgg[0]?.total || 0,
      pendingOrders,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getRevenueChart(req, res) {
  try {
    const { days = 7 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    const data = await Order.aggregate([
      { $match: { paymentStatus: 'paid', createdAt: { $gte: since } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getPopularItems(req, res) {
  try {
    const data = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.menuItem',
          name: { $first: '$items.name' },
          totalOrdered: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: 10 },
    ]);

    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getOrdersByStatus(req, res) {
  try {
    const data = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

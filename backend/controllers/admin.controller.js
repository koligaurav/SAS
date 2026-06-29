import Order from '../models/Order.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

const STATUS_MESSAGES = {
  confirmed: 'Your order has been confirmed!',
  preparing: 'We are preparing your order.',
  ready: 'Your order is ready!',
  delivered: 'Your order has been delivered. Enjoy!',
  cancelled: 'Your order has been cancelled.',
};

export async function getAllOrders(req, res) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('user', 'name email'),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.user && STATUS_MESSAGES[status]) {
      await Notification.create({
        user: order.user,
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Order ${order.orderId}: ${STATUS_MESSAGES[status]}`,
        type: 'order',
      });
    }

    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getUsers(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find({ role: 'customer' }).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments({ role: 'customer' }),
    ]);
    res.json({ users, total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function broadcastNotification(req, res) {
  try {
    const { title, message, type = 'promo' } = req.body;
    if (!title || !message) return res.status(400).json({ message: 'Title and message are required' });
    const users = await User.find({ role: 'customer' }).select('_id');
    await Notification.insertMany(users.map(u => ({ user: u._id, title, message, type })));
    res.json({ message: `Notification sent to ${users.length} users` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

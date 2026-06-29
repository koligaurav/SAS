import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import MenuItem from '../models/MenuItem.js';
import Notification from '../models/Notification.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function applyCoupon(code, subtotal) {
  if (!code) return 0;
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });
  if (!coupon) return 0;
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return 0;
  if (coupon.maxUses && coupon.uses >= coupon.maxUses) return 0;
  if (subtotal < coupon.minOrder) return 0;
  let discount = Math.round((subtotal * coupon.discountPercent) / 100);
  if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  return discount;
}

export async function createOrder(req, res) {
  try {
    const { items, couponCode, deliveryAddress, notes, guestInfo } = req.body;
    if (!items?.length) return res.status(400).json({ message: 'No items in order' });

    const resolvedItems = [];
    let subtotal = 0;

    for (const { menuItemId, quantity } of items) {
      const menuItem = await MenuItem.findById(menuItemId);
      if (!menuItem || !menuItem.available)
        return res.status(400).json({ message: `${menuItem?.name ?? menuItemId} is not available` });
      resolvedItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        veg: menuItem.veg,
      });
      subtotal += menuItem.price * quantity;
    }

    const discount = await applyCoupon(couponCode, subtotal);
    const total = subtotal - discount;

    const rzpOrder = await razorpay.orders.create({
      amount: total * 100,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    const order = await Order.create({
      user: req.user?._id,
      guestInfo: req.user ? undefined : guestInfo,
      items: resolvedItems,
      subtotal,
      discount,
      couponCode: couponCode?.toUpperCase() || '',
      total,
      razorpayOrderId: rzpOrder.id,
      deliveryAddress,
      notes,
    });

    res.status(201).json({
      order,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function verifyPayment(req, res) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expected !== razorpaySignature) {
      await Order.findByIdAndUpdate(orderId, { paymentStatus: 'failed' });
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus: 'paid', status: 'confirmed', razorpayPaymentId, razorpaySignature },
      { new: true }
    );

    if (order.couponCode) {
      await Coupon.findOneAndUpdate({ code: order.couponCode }, { $inc: { uses: 1 } });
    }

    if (req.user) {
      await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
      await Notification.create({
        user: req.user._id,
        title: 'Order Confirmed',
        message: `Your order ${order.orderId} has been placed successfully!`,
        type: 'order',
      });
    }

    res.json({ message: 'Payment verified', order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function getOrder(req, res) {
  try {
    const filter = { _id: req.params.id };
    if (req.user?.role !== 'admin') filter.user = req.user?._id;
    const order = await Order.findOne(filter).populate('items.menuItem', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

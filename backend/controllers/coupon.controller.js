import Coupon from '../models/Coupon.js';

export async function validateCoupon(req, res) {
  try {
    const { code, orderTotal } = req.query;
    const coupon = await Coupon.findOne({ code: code?.toUpperCase(), active: true });
    if (!coupon) return res.status(404).json({ message: 'Invalid coupon code' });
    if (coupon.expiresAt && coupon.expiresAt < new Date())
      return res.status(400).json({ message: 'Coupon has expired' });
    if (coupon.maxUses && coupon.uses >= coupon.maxUses)
      return res.status(400).json({ message: 'Coupon usage limit reached' });

    const total = Number(orderTotal) || 0;
    if (total && total < coupon.minOrder)
      return res.status(400).json({ message: `Minimum order amount is ₹${coupon.minOrder}` });

    let discount = 0;
    if (total) {
      discount = Math.round((total * coupon.discountPercent) / 100);
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    }

    res.json({
      coupon: {
        code: coupon.code,
        discountPercent: coupon.discountPercent,
        maxDiscount: coupon.maxDiscount,
        minOrder: coupon.minOrder,
      },
      discount,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function createCoupon(req, res) {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ coupon });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function getCoupons(req, res) {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

export async function updateCoupon(req, res) {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    res.json({ coupon });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

export async function deleteCoupon(req, res) {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = process.env.ADMIN_EMAIL || 'admin@brewandbite.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  const existing = await User.findOne({ email });

  if (existing) {
    // Always force role=admin and reset password so re-running the seed is always safe.
    existing.role = 'admin';
    existing.password = password; // pre-save hook hashes it
    await existing.save();
    console.log(`Admin set: ${email} (role enforced, password updated)`);
  } else {
    await User.create({ name: 'Admin', email, password, role: 'admin' });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
}

createAdmin().catch(err => { console.error(err); process.exit(1); });

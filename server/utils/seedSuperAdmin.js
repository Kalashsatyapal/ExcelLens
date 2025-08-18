const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedSuperAdmin = async () => {
  try {
    const { SUPERADMIN_EMAIL, SUPERADMIN_USERNAME, SUPERADMIN_PASSWORD } = process.env;

    if (!SUPERADMIN_EMAIL || !SUPERADMIN_USERNAME || !SUPERADMIN_PASSWORD) {
      console.warn('⚠️ Super Admin env variables missing. Skipping seeding.');
      return;
    }

    const existingAdmin = await User.findOne({ email: SUPERADMIN_EMAIL });
    if (existingAdmin) {
      console.log('👤 Super Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD, 10);
    const superAdmin = new User({
      username: SUPERADMIN_USERNAME,
      email: SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isSuperAdmin: true
    });

    await superAdmin.save();
    console.log('✅ Super Admin seeded successfully');
  } catch (err) {
    console.error('❌ Error seeding Super Admin:', err.message);
  }
};

module.exports = seedSuperAdmin;

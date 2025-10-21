const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedSuperAdmin = async () => {
  try {
    const {
      SUPERADMIN_EMAIL,
      SUPERADMIN_USERNAME,
      SUPERADMIN_PASSWORD,
    } = process.env;

    if (!SUPERADMIN_EMAIL || !SUPERADMIN_USERNAME || !SUPERADMIN_PASSWORD) {
      console.warn("⚠️ Missing Super Admin env variables. Skipping seeding.");
      return;
    }

    // Always lowercase email for consistency
    const email = SUPERADMIN_EMAIL.trim().toLowerCase();

    // Check if superadmin already exists (case-insensitive)
    const existingAdmin = await User.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });

    if (existingAdmin) {
      console.log("👤 Super Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(SUPERADMIN_PASSWORD.trim(), 10);

    const superAdmin = new User({
      username: SUPERADMIN_USERNAME.trim(),
      email,
      password: hashedPassword,
      role: "superadmin",
    });

    await superAdmin.save();
    console.log("✅ Super Admin seeded successfully");
  } catch (err) {
    console.error("❌ Error seeding Super Admin:", err.message);
  }
};

module.exports = seedSuperAdmin;

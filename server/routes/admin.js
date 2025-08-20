const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const Upload= require('../models/Upload')
const ChartAnalysis = require('../models/ChartAnalysis');
// Get all users
router.get('/users', authMiddleware('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change user role (Admin only)
router.put('/users/:id/role', authMiddleware('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isSuperAdmin) return res.status(403).json({ message: 'Cannot modify Super Admin' });

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Upload History Route (accessible to admin/superadmin)
router.get("/uploads", async (req, res) => {
  try {
    const uploads = await Upload.find({ user: { $exists: true } })
      .populate("user", "username email");
    res.json(uploads);
  } catch (err) {
    console.error("Upload fetch error:", err);
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});
// ✅ GET all analyses
router.get("/analyses", async (req, res) => {
  try {
    const analyses = await ChartAnalysis.find().sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chart analyses" });
  }
});
module.exports = router;

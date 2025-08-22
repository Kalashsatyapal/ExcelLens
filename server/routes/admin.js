const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Upload = require('../models/Upload');
const ChartAnalysis = require('../models/ChartAnalysis');
const authMiddleware = require('../middleware/authMiddleware');

// 🔐 Get all users (admin or superadmin only)
router.get('/users', authMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 🔧 Change user role (admin or superadmin only)
router.put('/users/:id/role', authMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent modifying superadmin accounts unless caller is also superadmin
    if (user.role === 'superadmin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ message: 'Only Super Admins can modify Super Admin accounts' });
    }

    user.role = role;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📁 Upload History (admin or superadmin only)
router.get('/uploads', authMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const uploads = await Upload.find({ user: { $exists: true } })
      .populate('user', 'username email');
    res.json(uploads);
  } catch (err) {
    console.error('Upload fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch uploads' });
  }
});

// 📊 Chart Analyses (admin or superadmin only)
router.get('/analyses', authMiddleware(['admin', 'superadmin']), async (req, res) => {
  try {
    const analyses = await ChartAnalysis.find().sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chart analyses' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const AdminRequest = require('../models/AdminRequest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const { JWT_SECRET, ADMIN_PASSKEY } = process.env;

// Register route (only for regular users)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin registration requires approval' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin registration request
router.post('/admin-requests', async (req, res) => {
  try {
    const { username, email, password, adminPassKey } = req.body;

    if (!username || !email || !password || !adminPassKey) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    if (adminPassKey !== ADMIN_PASSKEY) {
      return res.status(403).json({ message: 'Invalid Admin PassKey' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    const existingRequest = await AdminRequest.findOne({ email });

    if (existingUser || existingRequest) {
      return res.status(400).json({ message: 'Email or Username already exists or is pending approval' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const request = new AdminRequest({
      username,
      email,
      password: hashedPassword,
    });

    await request.save();
    console.log(`✅ Admin request saved for ${email}`);
    res.status(201).json({ message: 'Admin registration request submitted. Await superadmin approval.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { username: user.username, email: user.email, role: user.role } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

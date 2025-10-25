const express = require("express");
const router = express.Router();
const User = require("../models/User");
const AdminRequest = require("../models/AdminRequest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const { JWT_SECRET } = process.env;

// Register route (only for regular users)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (role === "admin") {
      return res
        .status(403)
        .json({ message: "Admin registration requires approval" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin registration request (no passkey, no email notification)
router.post("/admin-requests", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    const existingRequest = await AdminRequest.findOne({ email });

    if (existingUser || existingRequest) {
      return res.status(400).json({
        message: "Email or Username already exists or is pending approval",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const request = new AdminRequest({
      username,
      email,
      password: hashedPassword,
    });

    await request.save();

    res.status(201).json({
      message:
        "Admin registration request submitted. Await superadmin approval.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({
      email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.blocked) {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      token,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.put("/update-name", authMiddleware(), async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Name required" });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { username: name },
    { new: true }
  );
  res.json({ username: user.username });
});

router.put("/update-password", authMiddleware(), async (req, res) => {
  const { password } = req.body;
  if (!password) return res.status(400).json({ message: "Password required" });
  const hashed = await bcrypt.hash(password, 10);
  await User.findByIdAndUpdate(req.user._id, { password: hashed });
  res.json({ message: "Password updated" });
});

router.post(
  "/update-profile-image",
  authMiddleware(),
  upload.single("profileImage"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No image uploaded" });
      const base64Image = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage: base64Image },
        { new: true }
      );
      res.json({ profileImage: user.profileImage });
    } catch (err) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  }
);
module.exports = router;

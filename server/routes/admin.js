const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Upload = require("../models/Upload");
const ChartAnalysis = require("../models/ChartAnalysis");
const authMiddleware = require("../middleware/authMiddleware");
const AdminRequest = require("../models/AdminRequest");
// sendMail removed per requirement (no email notifications)

// 🔐 Get all users (admin or superadmin only)
router.get(
  "/users",
  authMiddleware(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// 🔧 Change user role (admin or superadmin only)
router.put(
  "/users/:id/role",
  authMiddleware(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const { role } = req.body;
      const targetUser = await User.findById(req.params.id);
      const requester = req.user;

      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // 🛡️ Superadmin protection
      if (targetUser.role === "superadmin" && requester.role !== "superadmin") {
        return res.status(403).json({
          message: "Only Super Admins can modify Super Admin accounts",
        });
      }

      // 🛡️ Admins can only modify 'user' accounts
      if (requester.role === "admin" && targetUser.role !== "user") {
        return res.status(403).json({
          message: "Admins can only modify roles of regular users",
        });
      }

      // ✅ Proceed with role update
      targetUser.role = role;
      await targetUser.save();

      return res.status(200).json({ message: "Role updated successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// 📁 Upload History (admin or superadmin only)
router.get(
  "/uploads",
  authMiddleware(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const uploads = await Upload.find({ user: { $exists: true } }).populate(
        "user",
        "username email"
      );
      res.json(uploads);
    } catch (err) {
      console.error("Upload fetch error:", err);
      res.status(500).json({ message: "Failed to fetch uploads" });
    }
  }
);

// 📊 Chart Analyses (admin or superadmin only)
router.get(
  "/analyses",
  authMiddleware(["admin", "superadmin"]),
  async (req, res) => {
    try {
      const analyses = await ChartAnalysis.find().sort({ createdAt: -1 });
      res.json(analyses);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch chart analyses" });
    }
  }
);

// Get all pending admin requests (superadmin only)
router.get(
  "/admin-requests",
  authMiddleware(["superadmin"]),
  async (req, res) => {
    try {
      const { status = "pending" } = req.query;
      const requests = await AdminRequest.find({ status }).sort({
        createdAt: -1,
      });
      res.json(requests);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Approve admin request (superadmin only)
router.post(
  "/admin-requests/:id/approve",
  authMiddleware(["superadmin"]),
  async (req, res) => {
    try {
      const request = await AdminRequest.findById(req.params.id);
      if (!request)
        return res.status(404).json({ message: "Request not found" });

      const existingUser = await User.findOne({ email: request.email });
      if (existingUser)
        return res.status(400).json({ message: "User already exists" });

      const newAdmin = new User({
        username: request.username,
        email: request.email,
        password: request.password, // already hashed
        role: "admin",
      });

      await newAdmin.save();
      await AdminRequest.findByIdAndUpdate(req.params.id, {
        status: "approved",
      });

      // No email notification per requirement — just log
      console.log(`✅ Admin approved: ${request.email}`);
      res.status(201).json({ message: "Admin approved and created" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Reject admin request (superadmin only)
router.post(
  "/admin-requests/:id/reject",
  authMiddleware(["superadmin"]),
  async (req, res) => {
    try {
      const { reason } = req.body;
      const request = await AdminRequest.findById(req.params.id);
      if (!request)
        return res.status(404).json({ message: "Request not found" });

      console.log(
        `❌ Admin request rejected: ${request.email} | Reason: ${
          reason || "No reason provided"
        }`
      );
      await AdminRequest.findByIdAndUpdate(req.params.id, {
        status: "rejected",
        rejectionReason: reason || "",
      });

      // No email notification per requirement
      res.json({ message: "Request rejected" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Block/Unblock user (superadmin only)
router.put(
  "/users/:id/block",
  authMiddleware(["superadmin"]),
  async (req, res) => {
    try {
      const { blocked } = req.body;
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      if (user.role === "superadmin")
        return res.status(403).json({ message: "Cannot block superadmin" });

      user.blocked = !!blocked;
      await user.save();
      res.json({
        message: `User ${blocked ? "blocked" : "unblocked"} successfully`,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;

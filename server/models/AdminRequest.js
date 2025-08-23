// models/AdminRequest.js
const mongoose = require('mongoose');
const AdminRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model('AdminRequest', AdminRequestSchema);

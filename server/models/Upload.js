const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  data: { type: Array, required: true }, // Parsed structured data stored as array of JSON objects
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Upload', uploadSchema);

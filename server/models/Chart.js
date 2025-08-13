const mongoose = require('mongoose');

const chartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upload: { type: mongoose.Schema.Types.ObjectId, ref: 'Upload', required: true },
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
  options: { type: Object, default: {} }, // room for future chart options
  mimeType: { type: String, enum: ['image/png', 'application/pdf'], required: true },
  fileName: { type: String, required: true },
  bytes: { type: Buffer, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Chart', chartSchema);

const mongoose = require("mongoose");
const ChartAnalysisSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  uploadId: { type: String, required: true },
  chartType: { type: String, required: true },
  xAxis: { type: String, required: true },
  yAxis: { type: String, required: true },
  chartImageBase64: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("ChartAnalysis", ChartAnalysisSchema);

const express = require("express");
const router = express.Router();
const ChartAnalysis = require("../models/ChartAnalysis");
// auto-save route
router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      uploadId,
      chartType,
      xAxis,
      yAxis,
      summary,
      chartImageBase64,
    } = req.body;
    const newAnalysis = new ChartAnalysis({
      userEmail,
      uploadId,
      chartType,
      xAxis,
      yAxis,
      summary,
      chartImageBase64,
    });
    await newAnalysis.save();
    res.status(201).json({ message: "Chart analysis saved successfully" });
  } catch (err) {
    console.error("Error saving chart analysis:", err);
    res.status(500).json({ error: "Failed to save chart analysis" });
  }
});
//Get User Specific analysis
router.get("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const analyses = await ChartAnalysis.find({ userEmail: email }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    console.error("Error fetching user analyses:", err);
    res.status(500).json({ error: "Failed to fetch analysis history" });
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
// ✅ DELETE analysis by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await ChartAnalysis.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Analysis not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete analysis" });
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const ChartAnalysis = require("../models/ChartAnalysis");

router.post("/", async (req, res) => {
  try {
    const { uploadId, chartType, xAxis, yAxis, summary, chartImageBase64 } = req.body;

    const newAnalysis = new ChartAnalysis({
      uploadId,
      chartType,
      xAxis,
      yAxis,
      summary,
      chartImageBase64,
      createdAt: new Date()
    });

    await newAnalysis.save();
    res.status(201).json({ message: "Chart analysis saved successfully" });
  } catch (err) {
    console.error("Error saving chart analysis:", err);
    res.status(500).json({ error: "Failed to save chart analysis" });
  }
});

module.exports = router;

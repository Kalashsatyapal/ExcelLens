const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const Chart = require('../models/Chart');
const Upload = require('../models/Upload');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * POST /api/charts
 * Multipart fields:
 *  - file (PNG or PDF)
 *  - uploadId, chartType, xAxis, yAxis, options (JSON string)
 */
router.post('/', authMiddleware(), upload.single('file'), async (req, res) => {
  try {
    const { uploadId, chartType, xAxis, yAxis, options } = req.body;

    if (!req.file) return res.status(400).json({ message: 'No chart file provided' });
    if (!uploadId || !chartType || !xAxis || !yAxis) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const owned = await Upload.findOne({ _id: uploadId, user: req.user.userId });
    if (!owned) return res.status(403).json({ message: 'Upload does not belong to you' });

    const newChart = new Chart({
      user: req.user.userId,
      upload: uploadId,
      chartType,
      xAxis,
      yAxis,
      options: options ? JSON.parse(options) : {},
      mimeType: req.file.mimetype,
      fileName: req.file.originalname || `chart_${Date.now()}.${req.file.mimetype === 'application/pdf' ? 'pdf' : 'png'}`,
      bytes: req.file.buffer,
    });

    await newChart.save();
    res.status(201).json({ message: 'Chart saved', chartId: newChart._id });
  } catch (err) {
    console.error('Save chart error:', err);
    res.status(500).json({ message: 'Failed to save chart' });
  }
});

/** GET /api/charts - list current user charts (meta only) */
router.get('/', authMiddleware(), async (req, res) => {
  try {
    const charts = await Chart.find({ user: req.user.userId })
      .select('_id upload chartType xAxis yAxis mimeType fileName createdAt')
      .sort({ createdAt: -1 });
    res.json(charts);
  } catch (err) {
    console.error('List charts error:', err);
    res.status(500).json({ message: 'Failed to fetch charts' });
  }
});

/** GET /api/charts/:id/file - stream the binary file */
router.get('/:id/file', authMiddleware(), async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.id);
    if (!chart) return res.status(404).json({ message: 'Not found' });
    if (chart.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.setHeader('Content-Type', chart.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${chart.fileName}"`);
    return res.send(chart.bytes);
  } catch (err) {
    console.error('Stream chart error:', err);
    res.status(500).json({ message: 'Failed to stream chart' });
  }
});

/** DELETE /api/charts/:id */
router.delete('/:id', authMiddleware(), async (req, res) => {
  try {
    const chart = await Chart.findById(req.params.id);
    if (!chart) return res.status(404).json({ message: 'Not found' });
    if (chart.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await chart.deleteOne();
    res.json({ message: 'Chart deleted' });
  } catch (err) {
    console.error('Delete chart error:', err);
    res.status(500).json({ message: 'Failed to delete chart' });
  }
});

module.exports = router;

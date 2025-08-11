const express = require('express');
const router = express.Router();
const multer = require('multer');
const ExcelJS = require('exceljs');
const Upload = require('../models/Upload');
const authMiddleware = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() }); // store file in memory buffer

// Upload and parse Excel file
router.post('/', authMiddleware(), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Parse Excel buffer using exceljs
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(req.file.buffer);

    const worksheet = workbook.worksheets[0]; // get first sheet, can extend to support others

    // Convert rows to JSON objects assuming first row = headers
    const rows = [];
    const headers = [];

    worksheet.getRow(1).eachCell((cell, colNumber) => {
      headers.push(cell.text.trim());
    });

    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header row
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        rowData[headers[colNumber - 1]] = cell.text;
      });
      rows.push(rowData);
    });

    // Save parsed data to MongoDB
    const newUpload = new Upload({
      user: req.user.userId,
      filename: req.file.originalname,
      data: rows,
    });

    await newUpload.save();

    res.status(201).json({ message: 'File uploaded and parsed successfully', uploadId: newUpload._id });
  } catch (error) {
    console.error('Excel parse/upload error:', error);
    res.status(500).json({ message: 'Failed to upload and parse file' });
  }
});

// Get upload history for current user
router.get('/', authMiddleware(), async (req, res) => {
  try {
    const uploads = await Upload.find({ user: req.user.userId }).sort({ uploadedAt: -1 });
    res.json(uploads);
  } catch (error) {
    console.error('Fetch upload history error:', error);
    res.status(500).json({ message: 'Failed to fetch upload history' });
  }
});

// Delete an upload by ID (only if belongs to user)
router.delete('/:id', authMiddleware(), async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: 'Upload not found' });

    if (upload.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this upload' });
    }

    await upload.deleteOne();
    res.json({ message: 'Upload deleted successfully' });
  } catch (error) {
    console.error('Delete upload error:', error);
    res.status(500).json({ message: 'Failed to delete upload' });
  }
});

module.exports = router;

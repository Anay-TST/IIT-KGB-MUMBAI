const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Document = require('../models/Document');

// 🌟 THE FIX: Using an absolute path guarantees the file goes to the exact folder server.js is serving
const uploadDir = path.join(__dirname, '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Now points to the absolute path
  },
  filename: (req, file, cb) => {
    // Strip spaces to prevent URL encoding issues in browsers
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + safeName);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// --- ROUTES ---

/**
 * @route   GET /api/documents
 * @desc    Get all documents for the public page
 */
router.get('/', async (req, res) => {
  try {
    const docs = await Document.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents", error: err.message });
  }
});

/**
 * @route   POST /api/documents
 * @desc    Upload a new document (Admin only)
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newDoc = new Document({
      title: req.body.title,
      // The leading slash is important so the frontend requests from the root URL
      fileUrl: `/uploads/documents/${req.file.filename}` 
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    console.error("Document Upload Error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
});

/**
 * @route   DELETE /api/documents/:id
 * @desc    Remove a document (Admin only)
 */
router.delete('/:id', async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Document not found" });

    // Automatically delete the actual PDF file from the server hard drive
    const filePath = path.join(__dirname, '..', doc.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;
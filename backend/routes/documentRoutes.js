const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Document = require('../models/Document');

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/documents/');
  },
  filename: (req, file, cb) => {
    // Saves file as: 17123456789-filename.pdf
    cb(null, Date.now() + '-' + file.originalname);
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
      fileUrl: `/uploads/documents/${req.file.filename}`
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
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

    // Optional: Add logic here to delete the actual file from disk using fs.unlink
    
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;
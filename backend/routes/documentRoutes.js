const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/Document');

// ✅ FIXED: Vercel does not allow writing to disk
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

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
      // Since disk storage isn't available, we use a placeholder URL for now.
      fileUrl: `https://placehold.co/100?text=PDF+Storage+Requires+Cloudinary` 
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

    // ✅ FIXED: Removed the fs.unlinkSync because it crashes on Vercel's read-only system
    
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;

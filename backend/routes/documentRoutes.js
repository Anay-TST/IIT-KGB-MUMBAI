const express = require('express');
const router = express.Router();
const multer = require('multer');
const Document = require('../models/Document');

// ✅ FIXED: Vercel does not allow writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/', async (req, res) => {
  const docs = await Document.find().sort({ createdAt: -1 });
  res.json(docs);
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const newDoc = new Document({
      title: req.body.title,
      fileUrl: `https://placehold.co/100?text=PDF+Storage+Requires+Cloudinary`
    });

    const savedDoc = await newDoc.save();
    res.status(201).json(savedDoc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  await Document.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;

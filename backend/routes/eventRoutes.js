const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const Event = require('../models/Event');

// ✅ FIXED: Switch to memoryStorage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET ALL EVENTS
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE NEW EVENT
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.json(newEvent);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPLOAD MEDIA TO PAST EVENT
router.post('/:id/media', upload.array('files'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    for (const file of req.files) {
      if (file.mimetype.startsWith('image/')) {
        const filename = `proc-${Date.now()}.webp`;
        await sharp(file.buffer)
          .resize(1200, null, { withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer(); 
          
        event.images.push(`https://placehold.co/600x400?text=Image+Upload+Requires+S3`);
      }
    }

    await event.save();
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

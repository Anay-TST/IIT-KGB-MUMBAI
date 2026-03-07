const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const Event = require('../models/Event');

// Multer storage (Temporary storage before processing)
const storage = multer.diskStorage({
  destination: './uploads/temp/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Ensure folders exist
const dirs = ['./uploads/events', './uploads/temp'];
dirs.forEach(d => !fs.existsSync(d) && fs.mkdirSync(d, { recursive: true }));

// GET ALL EVENTS
router.get('/', async (req, res) => {
  const events = await Event.find().sort({ date: -1 });
  res.json(events);
});

// CREATE NEW EVENT
router.post('/', async (req, res) => {
  const newEvent = new Event(req.body);
  await newEvent.save();
  res.json(newEvent);
});

// UPLOAD MEDIA TO PAST EVENT (With Image Compression)
router.post('/:id/media', upload.array('files'), async (req, res) => {
  const event = await Event.findById(req.params.id);
  const processedFiles = [];

  for (const file of req.files) {
    const filename = `proc-${Date.now()}-${file.originalname.split('.')[0]}.webp`;
    const outputPath = path.join('./uploads/events', filename);

    if (file.mimetype.startsWith('image/')) {
      // SHARP IMAGE COMPRESSION
      await sharp(file.path)
        .resize(1200, null, { withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);
      
      event.images.push(`/uploads/events/${filename}`);
      fs.unlinkSync(file.path); // Delete temp file
    } else {
      // For videos, we just move them (Real video compression requires FFmpeg, which is heavy)
      const videoName = `vid-${Date.now()}-${file.originalname}`;
      const videoPath = `./uploads/events/${videoName}`;
      fs.renameSync(file.path, videoPath);
      event.videos.push(`/uploads/events/${videoName}`);
    }
  }

  await event.save();
  res.json(event);
});

router.delete('/:id', async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

module.exports = router;
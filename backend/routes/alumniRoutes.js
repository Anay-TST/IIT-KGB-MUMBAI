const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if missing
if (!fs.existsSync('./uploads/')) {
  fs.mkdirSync('./uploads/');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST: Register with Profile Pic
router.post('/', upload.single('profilePic'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.profilePic = `/uploads/${req.file.filename}`;
    const member = new Member(data);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: Approved List (for Directory)
router.get('/', async (req, res) => {
  const members = await Member.find({ isApproved: true }).sort({ yearOfGraduation: -1 });
  res.json(members);
});

// GET: All Members (for Admin)
router.get('/all', async (req, res) => {
  const members = await Member.find().sort({ createdAt: -1 });
  res.json(members);
});

// PUT: Full Edit (Including Profile Pic)
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If a new file was uploaded, update the path
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updated = await Member.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Status Toggle
router.patch('/status/:id', async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (req.query.action === 'approve') member.isApproved = true;
  if (req.query.action === 'toggleLife') member.isLifeMember = !member.isLifeMember;
  await member.save();
  res.json(member);
});

// DELETE
router.delete('/:id', async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;
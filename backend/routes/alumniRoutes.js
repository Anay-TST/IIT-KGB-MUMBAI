const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads folder if missing
// Using a relative path that stays consistent with the server root
const uploadDir = './uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename to prevent overwriting
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

// POST: Register with Profile Pic
router.post('/', upload.single('profilePic'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      // Save the path with a leading slash for the frontend
      data.profilePic = `/uploads/${req.file.filename}`;
    }
    const member = new Member(data);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET: Approved List (for Directory)
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({ isApproved: true }).sort({ yearOfGraduation: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: All Members (for Admin)
router.get('/all', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Full Edit (Warning fix + Path fix)
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // If a new file was uploaded, update the path
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    // FIXED: Swapped 'new: true' for 'returnDocument: 'after''
    const updated = await Member.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { 
        returnDocument: 'after', 
        runValidators: true 
      }
    );

    if (!updated) return res.status(404).json({ message: "Member not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Status Toggle
router.patch('/status/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (req.query.action === 'approve') member.isApproved = true;
    if (req.query.action === 'toggleLife') member.isLifeMember = !member.isLifeMember;
    
    await member.save();
    res.json(member);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const fs = require('fs');

// Create uploads folder if missing
const uploadDir = './uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// POST: Register
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.profilePic = `/uploads/${req.file.filename}`;
    }
    const member = new Member(data);
    await member.save();
    res.status(201).json(member);
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
  }
});

// POST: Bulk Import from Excel
router.post('/bulk', async (req, res) => {
  try {
    const { members } = req.body;
    
    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ message: "Invalid data format. Expected an array." });
    }

    // Use insertMany with ordered:false so one bad row doesn't stop the whole file
    const inserted = await Member.insertMany(members, { ordered: false });
    
    res.status(201).json({ message: `Successfully imported ${inserted.length} members!` });
  } catch (err) {
    // If some succeeded and some failed (like duplicate keys or missing required strings)
    if (err.name === 'BulkWriteError') {
      res.status(201).json({ 
        message: `Import finished! Inserted ${err.insertedDocs.length} members. Skipped some rows due to duplicates or missing required fields.` 
      });
    } else {
      console.error("Bulk Import Error:", err.message);
      res.status(500).json({ message: "Failed to import members: " + err.message });
    }
  }
});

// GET: Approved List (UPDATED TO INCLUDE LIFE MEMBERS)
router.get('/', async (req, res) => {
  try {
    // This now fetches members who are marked 'isApproved: true' OR have a Life Member/General status
    const members = await Member.find({ 
      $or: [
        { isApproved: true },
        { status: { $in: ['Life Member', 'General', 'Approved'] } }
      ]
    }).sort({ yearOfGraduation: -1 });
    
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

// PUT: Full Edit
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updated = await Member.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Member not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Status Toggle (Approve / Revoke / Life)
router.patch('/status/:id', async (req, res) => {
  try {
    const { action } = req.query;
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (action === 'approve') member.isApproved = true;
    else if (action === 'revoke') member.isApproved = false;
    else if (action === 'toggleLife') member.isLifeMember = !member.isLifeMember;

    await member.save(); // timestamps: true will update the 'updatedAt' field here
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
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// 🚨 THE FIX: Explicitly lock the upload folder to backend/uploads
// __dirname is the 'routes' folder. '../uploads' points exactly to 'backend/uploads'
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Replaces spaces in filenames to prevent URL breaking
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + safeName);
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

    const inserted = await Member.insertMany(members, { ordered: false });
    res.status(201).json({ message: `Successfully imported ${inserted.length} members!` });
  } catch (err) {
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

// GET: Approved List
router.get('/', async (req, res) => {
  try {
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

// PUT: Full Edit (WITH DEBUGGING TRACKERS JUST IN CASE)
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Safety Net: Remove empty strings from FormData
    for (let key in updateData) {
      if (updateData[key] === '' || updateData[key] === 'null') {
        delete updateData[key];
      }
    }

    // Attach new picture if uploaded
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
      console.log("SUCCESS: Backend caught the new picture:", updateData.profilePic);
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
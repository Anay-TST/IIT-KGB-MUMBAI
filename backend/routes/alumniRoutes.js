const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const fs = require('fs');

const uploadDir = './uploads/';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// POST: Register
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.profilePic = `/uploads/${req.file.filename}`;
    const member = new Member(data);
    await member.save();
    res.status(201).json(member);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// GET: All Members
router.get('/all', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) { res.status(500).json({ message: err.message }); }
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
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT: Full Edit
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.profilePic = `/uploads/${req.file.filename}`;
    const updated = await Member.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
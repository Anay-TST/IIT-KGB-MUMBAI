const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// PUBLIC: Register a new member
router.post('/', async (req, res) => {
  try {
    const member = new Member(req.body);
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Email already exists." });
    }
    res.status(400).json({ message: err.message });
  }
});

// ADMIN: Get ALL members (for admin panel)
router.get('/all', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Approve member
router.patch('/approve/:id', async (req, res) => {
  try {
    const updated = await Member.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUBLIC: Get only approved members
router.get('/', async (req, res) => {
  try {
    const approvedMembers = await Member.find({ isApproved: true });
    res.json(approvedMembers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// PUBLIC: Get only approved members for the public directory
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({ isApproved: true });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Get ALL members (for the admin panel)
router.get('/all', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN: Approve a member
router.patch('/approve/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id, 
      { isApproved: true }, 
      { new: true }
    );
    res.json(updatedMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUBLIC: Register a new member (Sets isApproved to false by default)
router.post('/', async (req, res) => {
  const member = new Member(req.body);
  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
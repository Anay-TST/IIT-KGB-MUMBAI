const express = require('express');
const router = express.Router();
const Member = require('../models/Member');

// GET: Fetch all alumni members
router.get('/', async (req, res) => {
  try {
    const members = await Member.find().sort({ batch: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a new alumni (Admin will use this)
router.post('/', async (req, res) => {
  const member = new Member({
    name: req.body.name,
    batch: req.body.batch,
    department: req.body.department,
    isLifeMember: req.body.isLifeMember
  });

  try {
    const newMember = await member.save();
    res.status(201).json(newMember);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const CommitteeMember = require('../models/CommitteeMember');

// GET: All committee members (with full member details)
router.get('/', async (req, res) => {
  try {
    const committee = await CommitteeMember.find()
      .populate('member')
      .sort('order');
    res.json(committee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST: Add a member to committee
router.post('/', async (req, res) => {
  const comm = new CommitteeMember({
    member: req.body.memberId,
    title: req.body.title,
    order: req.body.order || 0
  });
  try {
    const newComm = await comm.save();
    res.status(201).json(newComm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE: Remove from committee
router.delete('/:id', async (req, res) => {
  await CommitteeMember.findByIdAndDelete(req.params.id);
  res.json({ message: "Removed from Committee" });
});

module.exports = router;
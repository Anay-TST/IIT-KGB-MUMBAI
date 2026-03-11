const express = require('express');
const router = express.Router();
const CommitteeMember = require('../models/CommitteeMember');

// GET: All committee members (with full member details)
router.get('/', async (req, res) => {
  try {
    const committee = await CommitteeMember.find()
      .populate('member')
      .sort('order'); // Sorts by the order number automatically
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

// PATCH: Bulk reorder committee members
router.patch('/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // Expects an array like [{ id: '...', order: 0 }, { id: '...', order: 1 }]
    
    if (!orders || !Array.isArray(orders)) {
      return res.status(400).json({ message: "Invalid data format for reordering." });
    }

    // Prepare bulk operations for MongoDB to update all orders efficiently
    const bulkOps = orders.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { order: item.order }
      }
    }));

    // Execute all updates at once
    await CommitteeMember.bulkWrite(bulkOps);

    res.json({ message: "Committee order updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE: Remove from committee
router.delete('/:id', async (req, res) => {
  try {
    await CommitteeMember.findByIdAndDelete(req.params.id);
    res.json({ message: "Removed from Committee" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
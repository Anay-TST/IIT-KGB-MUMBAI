const mongoose = require('mongoose');

const committeeSchema = new mongoose.Schema({
  member: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Member', 
    required: true 
  },
  title: { type: String, required: true }, // e.g., President, Secretary
  order: { type: Number, default: 0 }      // To sort them manually
});

module.exports = mongoose.model('CommitteeMember', committeeSchema);
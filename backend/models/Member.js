const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  batch: { type: Number, required: true }, // e.g., 2018
  department: { type: String, required: true },
  isLifeMember: { type: Boolean, default: false },
  linkedinUrl: { type: String },
  bio: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
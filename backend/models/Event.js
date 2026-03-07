const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  location: String,
  images: [String], // Array of paths
  videos: [String], // Array of paths
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
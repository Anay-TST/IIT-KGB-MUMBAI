const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  degrees: { type: [String], default: [] },
  departments: { type: [String], default: [] },
  halls: { type: [String], default: [] },
  maritalStatuses: { type: [String], default: ["Single", "Married", "Divorced", "Separated", "Widowed"] },
  sexOptions: { type: [String], default: ["Male", "Female", "Other"] }
});

module.exports = mongoose.model('Config', configSchema);
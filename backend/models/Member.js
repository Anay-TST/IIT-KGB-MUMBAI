const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  // Section 1: Personal Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  birthdate: { type: Date },
  sex: { type: String },
  maritalStatus: { type: String, default: 'Single' },
  profilePic: { type: String },

  // Section 2: Academic Details
  yearOfGraduation: { type: Number, required: true },
  degree: { type: String },
  department: { type: String },
  hall: { type: String },

  // Section 3: Professional & Location
  currentOccupation: { type: String },
  residenceAddress: { type: String },
  officeAddress: { type: String },

  // Section 4: Spouse & Family
  spouseFirstName: { type: String },
  spouseLastName: { type: String },
  anniversaryDate: { type: Date },
  numberOfChildren: { type: Number, default: 0 },

  // Admin & System Statuses
  isApproved: { type: Boolean, default: false },
  isLifeMember: { type: Boolean, default: false },
  membershipNumber: { type: String } // <--- NEW FIELD ADDED HERE
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
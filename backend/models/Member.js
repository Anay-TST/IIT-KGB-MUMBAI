const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  // Section 1: Personal Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  countryCode: { type: String, default: '+91' },
  mobile: { 
    type: String, required: true,
    validate: {
      validator: function(v) { return /^\d{10}$/.test(v); },
      message: 'Mobile number must be exactly 10 digits'
    }
  },
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
  spouseBirthdate: { type: Date }, // <-- NEW: Added missing field here!
  anniversaryDate: { type: Date },
  numberOfChildren: { type: Number, default: 0 },
  
  // Additional Info
  referredBy: { type: String },

  // Admin & System Statuses
  isApproved: { type: Boolean, default: false },
  isLifeMember: { type: Boolean, default: false },
  lifeMemberNumber: { type: String },
  membershipNumber: { type: String },

  // --- NEW: AUTHENTICATION FIELDS ---
  password: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }

}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
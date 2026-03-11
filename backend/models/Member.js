const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  // Section 1: Personal Details
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
<<<<<<< HEAD
  email: { type: String, required: true, unique: true },
  countryCode: { type: String, default: '+91' },
  mobile: { 
    type: String, required: true,
    validate: {
      validator: function(v) { return /^\d{10}$/.test(v); },
      message: 'Mobile number must be exactly 10 digits'
    }
  },
  birthdate: { type: Date, required: true },
  sex: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  yearOfGraduation: { type: Number, required: true },
  department: { type: String, required: true },
  degree: { type: String, required: true },
  hall: { type: String, required: true },
  lifeMemberNumber: { type: String },
  currentOccupation: { type: String },
  residenceAddress: { type: String, required: true },
  officeAddress: { type: String },
  profilePic: { type: String }, 
=======
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
>>>>>>> 809ddae1f6aa3b19eb091e7e87a9b10aaf995b93
  spouseFirstName: { type: String },
  spouseLastName: { type: String },
  anniversaryDate: { type: Date },
  numberOfChildren: { type: Number, default: 0 },
<<<<<<< HEAD
  referredBy: { type: String },
  isApproved: { type: Boolean, default: false }, 
  isLifeMember: { type: Boolean, default: false }
}, { timestamps: true }); // This line enables createdAt and updatedAt automatically
=======

  // Admin & System Statuses
  isApproved: { type: Boolean, default: false },
  isLifeMember: { type: Boolean, default: false },
  membershipNumber: { type: String } // <--- NEW FIELD ADDED HERE
}, { timestamps: true });
>>>>>>> 809ddae1f6aa3b19eb091e7e87a9b10aaf995b93

module.exports = mongoose.model('Member', memberSchema);
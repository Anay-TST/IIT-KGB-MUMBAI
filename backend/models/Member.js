const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  countryCode: { type: String, default: '+91' },
  mobile: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) { return /^\d{10}$/.test(v); },
      message: 'Mobile number must be exactly 10 digits'
    }
  },
  birthdate: { type: Date, required: true },
  sex: { type: String, required: true },
  maritalStatus: { 
    type: String, 
    enum: ['Single', 'Married', 'Divorced', 'Separated', 'Widowed'], 
    required: true 
  },
  yearOfGraduation: { type: Number, required: true },
  department: { type: String, required: true },
  degree: { type: String, required: true },
  hall: { type: String, required: true },
  lifeMemberNumber: { type: String },
  currentOccupation: { type: String },
  residenceAddress: { type: String, required: true },
  officeAddress: { type: String },
  spouseName: { type: String },
  anniversaryDate: { type: Date },
  spouseBirthdate: { type: Date },
  numberOfChildren: { type: Number, default: 0 },
  
  // STATUS FIELDS
  isApproved: { type: Boolean, default: false }, 
  isLifeMember: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Member', memberSchema);
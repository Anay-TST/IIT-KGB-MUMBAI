const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  degrees: { 
    type: [String], 
    default: ['B.Tech', 'M.Tech', 'PhD', 'Dual Degree', 'MSc', 'BArch'] 
  },
  departments: { 
    type: [String], 
    default: ['Aerospace Engineering', 'Agricultural and Food Engineering', 'Architecture and Regional Planning', 'Biotechnology', 'Chemical Engineering', 'Chemistry', 'Civil Engineering', 'Computer Science and Engineering', 'Electrical Engineering', 'Electronics and Electrical Communication Engineering', 'Geology and Geophysics', 'Humanities and Social Sciences', 'Industrial and Systems Engineering', 'Mathematics', 'Mechanical Engineering', 'Metallurgical and Materials Engineering', 'Mining Engineering', 'Ocean Engineering and Naval Architecture', 'Physics'] 
  },
  halls: { 
    type: [String], 
    default: ['Ashutosh Mukherjee', 'Azad', 'B.C. Roy', 'B.R. Ambedkar', 'Gokhale', 'Homi Bhabha', 'J.C. Bose', 'Lala Lajpat Rai', 'Lal Bahadur Shastri', 'Madan Mohan Malviya', 'Megnad Saha', 'Mother Teresa', 'Nehru', 'Patel', 'Radha Krishnan', 'Rajendra Prasad', 'Rani Laxmibai', 'S.N. / I.G.', 'Sarojini Naidu', 'Savarkar', 'Vidyasagar', 'Zakir Hussain'] 
  },
  maritalStatuses: { 
    type: [String], 
    default: ['Single', 'Married', 'Divorced', 'Widowed'] 
  },
  genders: { 
    type: [String], 
    default: ['Male', 'Female', 'Other', 'Prefer not to say'] 
  }
});

module.exports = mongoose.model('Config', configSchema);
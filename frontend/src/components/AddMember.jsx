import React, { useState } from 'react';
import api from '../api'; // Use our configured api instance

// --- CONFIGURATION ARRAYS ---
const DEGREES = [
  "B.Tech", "B.Arch", "Dual Degree", "M.Tech", "M.Sc", "MBA", 
  "Ph.D", "MS", "MCP", "MMST", "LLB", "LLM", "Other"
];

const DEPARTMENTS = [
  "Aerospace Engineering",
  "Advanced Technology Centre",
  "Agricultural & Food Engineering",
  "Architecture & Regional Planning",
  "Biotechnology",
  "Centre for Theoretical Studies",
  "Chemical Engineering",
  "Chemistry",
  "Civil Engineering",
  "Computer Science & Engineering",
  "Cyrogenic Engineering",
  "Center for Educational Technology",
  "Energy Science and Engineering",
  "Energy Engineering",
  "Electrical Engineering",
  "Electronics & Electrical Communications Engineering",
  "Exploration Geophysics",
  "GS Sanyal School of Telecommunications (GS)",
  "GS Sanyal School of Telecommunications (TE)",
  "Geology & Geophysics",
  "Humanities & Social Sciences",
  "Industrial Engineering & Management",
  "Instrumentation Engineering",
  "School of Information Technology",
  "Material Science",
  "Mathematics",
  "Manufacturing Engineering",
  "Mechanical Engineering",
  "Medical Science & Technology",
  "Metallurgical Engineering",
  "Mining Engineering",
  "Ocean Engineering & Naval Architecture",
  "Ocean, Rivers, Atmosphere & Land Sciences",
  "Physics & Meteorology",
  "Quality Engineering Design and Manufacturing",
  "Rajendra Mishra School of Engineering Entrepreneurship",
  "Rajeev Gandhi School of Intellectual Property Law",
  "Ranbir and Chitra Gupta School of Infrastructure Design and Management",
  "Reliability Engineering",
  "Rubber Technology Center",
  "Rural Development Centre",
  "School of Water Resources",
  "Steel Technology Centre",
  "Statistics and Informatics",
  "Vinod Gupta School of Management",
  "Other"
];

const HALLS = [
  "Ashutosh Mukherjee",
  "Azad",
  "Bhidan Chandra Roy",
  "Campus",
  "Dr. B R Ambedkar",
  "Gokhale",
  "Homi J Bhabha",
  "Jagadish Chandra Bose",
  "Lala Lajpat Rai",
  "Lalbahadur Sastry",
  "Madan Mohan Malaviya",
  "Meghnad Saha",
  "Mother Teresa",
  "Nehru",
  "Patel",
  "Radhakrishnan",
  "Rajendra Prasad",
  "Rani Laxmi Bai",
  "Sarojini Naidu / Indira Gandhi",
  "Vidyasagar",
  "Zakir Hussain",
  "Vikram Sarabhai Residential Complex",
  "Institute Quarter",
  "Bachelors Flat",
  "Rader Flats",
  "Other"
];
// ----------------------------

const AddMember = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', mobile: '', birthdate: '', sex: '', 
    maritalStatus: 'Single', yearOfGraduation: '', department: '', degree: '', 
    hall: '', currentOccupation: '', residenceAddress: '', officeAddress: '', 
    spouseFirstName: '', spouseLastName: '', anniversaryDate: '', numberOfChildren: 0
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Append all form fields to FormData
    Object.keys(formData).forEach(k => {
      // Don't send empty strings for dates to avoid backend validation errors
      if ((k === 'birthdate' || k === 'anniversaryDate') && !formData[k]) return;
      data.append(k, formData[k]);
    });

    if (file) data.append('profilePic', file);

    try {
      // Use api.post instead of axios.post
      await api.post('/api/alumni', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      alert('Registration Submitted Successfully!');
      
      // Call the success callback to refresh the page
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) { 
      console.error(err);
      alert('Error: ' + (err.response?.data?.message || 'Submission failed')); 
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.mainTitle}>IIT KGP Alumni Registration</h2>
      <form onSubmit={handleSubmit}>
        
        {/* --- SECTION 1: PERSONAL DETAILS --- */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Personal Details</h4>
          <div style={styles.row}>
            <div style={styles.flex1}>
              <label style={styles.label}>Profile Picture</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} style={styles.fileInput} />
            </div>
          </div>
          <div style={styles.grid2}>
            <div><label style={styles.label}>First Name *</label><input name="firstName" onChange={handleChange} required style={styles.input} /></div>
            <div><label style={styles.label}>Last Name *</label><input name="lastName" onChange={handleChange} required style={styles.input} /></div>
            <div><label style={styles.label}>Email Address *</label><input name="email" type="email" onChange={handleChange} required style={styles.input} /></div>
            <div><label style={styles.label}>Mobile Number *</label><input name="mobile" onChange={handleChange} required style={styles.input} /></div>
            <div><label style={styles.label}>Date of Birth *</label><input name="birthdate" type="date" onChange={handleChange} required style={styles.input} /></div>
            <div>
              <label style={styles.label}>Sex *</label>
              <select name="sex" value={formData.sex} onChange={handleChange} required style={styles.input}>
                <option value="" disabled>Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label style={styles.label}>Marital Status *</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required style={styles.input}>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: ACADEMIC DETAILS --- */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>IIT KGP Academic Details</h4>
          <div style={styles.grid2}>
            <div><label style={styles.label}>Batch Year *</label><input name="yearOfGraduation" type="number" onChange={handleChange} required style={styles.input} /></div>
            
            {/* Degree Dropdown */}
            <div>
              <label style={styles.label}>Degree *</label>
              <select name="degree" value={formData.degree} onChange={handleChange} required style={styles.input}>
                <option value="" disabled>Select Degree</option>
                {DEGREES.map(deg => <option key={deg} value={deg}>{deg}</option>)}
              </select>
            </div>

            {/* Department Dropdown */}
            <div>
              <label style={styles.label}>Department *</label>
              <select name="department" value={formData.department} onChange={handleChange} required style={styles.input}>
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>

            {/* Hall Dropdown */}
            <div>
              <label style={styles.label}>Hall of Residence *</label>
              <select name="hall" value={formData.hall} onChange={handleChange} required style={styles.input}>
                <option value="" disabled>Select Hall</option>
                {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            
          </div>
        </div>

        {/* --- SECTION 3: PROFESSIONAL & ADDRESS --- */}
        <div style={styles.section}>
          <h4 style={styles.sectionTitle}>Professional & Location</h4>
          <div style={styles.flex1}>
            <label style={styles.label}>Current Occupation / Designation</label>
            <input name="currentOccupation" onChange={handleChange} style={styles.input} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label style={styles.label}>Residence Address *</label>
            <textarea name="residenceAddress" onChange={handleChange} required style={{ ...styles.input, height: '60px' }} />
          </div>
          <div style={{ marginTop: '10px' }}>
            <label style={styles.label}>Office Address</label>
            <textarea name="officeAddress" onChange={handleChange} style={{ ...styles.input, height: '60px' }} />
          </div>
        </div>

        {/* --- SECTION 4: FAMILY DETAILS (Conditional) --- */}
        {formData.maritalStatus === 'Married' && (
          <div style={{ ...styles.section, backgroundColor: '#f4f7f9' }}>
            <h4 style={styles.sectionTitle}>Spouse & Family Details</h4>
            <div style={styles.grid2}>
              <div><label style={styles.label}>Spouse First Name</label><input name="spouseFirstName" onChange={handleChange} style={styles.input} /></div>
              <div><label style={styles.label}>Spouse Last Name</label><input name="spouseLastName" onChange={handleChange} style={styles.input} /></div>
              <div><label style={styles.label}>Anniversary Date</label><input name="anniversaryDate" type="date" onChange={handleChange} style={styles.input} /></div>
              <div><label style={styles.label}>Number of Children</label><input name="numberOfChildren" type="number" min="0" onChange={handleChange} style={styles.input} /></div>
            </div>
          </div>
        )}

        <button type="submit" style={styles.submitBtn}>Submit Registration</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '850px', margin: '10px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'sans-serif' },
  mainTitle: { color: '#003366', textAlign: 'center', marginBottom: '30px', fontSize: '24px', fontWeight: 'bold' },
  section: { marginBottom: '25px', padding: '20px', border: '1px solid #edf2f7', borderRadius: '8px' },
  sectionTitle: { marginTop: '0', marginBottom: '15px', color: '#003366', borderBottom: '2px solid #ffcc00', display: 'inline-block', paddingBottom: '3px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  row: { display: 'flex', gap: '15px', marginBottom: '10px' },
  flex1: { flex: 1 },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#4a5568', marginBottom: '5px' },
  input: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #cbd5e0', fontSize: '14px', boxSizing: 'border-box' },
  fileInput: { fontSize: '13px', marginTop: '5px' },
  submitBtn: { width: '100%', padding: '15px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', transition: '0.3s' }
};

export default AddMember;

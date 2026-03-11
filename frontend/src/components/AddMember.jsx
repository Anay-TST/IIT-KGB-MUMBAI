import React, { useState } from 'react';
import api from '../api';

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
    firstName: '', 
    lastName: '', 
    email: '', 
    countryCode: '+91',
    mobile: '',
    birthdate: '',
    sex: '',
    maritalStatus: 'Single',
    lifeMemberNumber: '', // Moved here
    yearOfGraduation: '', 
    department: '',
    degree: '', 
    hall: '', 
    currentOccupation: '',
    residenceAddress: '',
    officeAddress: '',
    spouseFirstName: '',
    spouseLastName: '',
    anniversaryDate: '',
    spouseBirthdate: '',
    numberOfChildren: 0,
    referredBy: ''
  });
  
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });
    
    if (profilePic) data.append('profilePic', profilePic);

    try {
      await api.post('/api/alumni/register', data);
      setLoading(false);
      onSuccess(); 
    } catch (err) {
      console.error(err);
      alert("Registration failed. Please check your details and try again.");
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleSubmit} style={styles.form}>
      {/* SECTION 1: PERSONAL IDENTITY */}
      <h3 style={styles.sectionTitle}>1. Personal Identity</h3>
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>First Name *</label>
          <input name="firstName" required onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Last Name *</label>
          <input name="lastName" required onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email Address *</label>
          <input name="email" type="email" required onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Mobile (10 Digits) *</label>
          <div style={{ display: 'flex', gap: '5px' }}>
            <input name="countryCode" value={formData.countryCode} onChange={handleChange} style={{ ...styles.input, width: '60px' }} />
            <input name="mobile" required onChange={handleChange} style={{ ...styles.input, flex: 1 }} placeholder="9876543210" />
          </div>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Birthdate *</label>
          <input name="birthdate" type="date" required onChange={handleChange} style={styles.input} />
=======
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
>>>>>>> 809ddae1f6aa3b19eb091e7e87a9b10aaf995b93
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Sex *</label>
          <select name="sex" required onChange={handleChange} style={styles.input}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Marital Status *</label>
          <select name="maritalStatus" required onChange={handleChange} style={styles.input}>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Separated">Separated</option>
            <option value="Widowed">Widowed</option>
          </select>
        </div>
        {/* LIFE MEMBER NUMBER MOVED HERE */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>Life Member Number (If any)</label>
          <input name="lifeMemberNumber" onChange={handleChange} style={styles.input} placeholder="LM-XXXX" />
        </div>
      </div>

      {/* SECTION 2: ACADEMIC DETAILS */}
      <h3 style={styles.sectionTitle}>2. Academic Details</h3>
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Batch (Year of Graduation) *</label>
          <input name="yearOfGraduation" type="number" required onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Hall of Residence *</label>
          <input name="hall" required onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Degree *</label>
          <input name="degree" required onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Department *</label>
          <input name="department" required onChange={handleChange} style={styles.input} />
        </div>
      </div>

      {/* SECTION 3: PROFESSIONAL & ADDRESS */}
      <h3 style={styles.sectionTitle}>3. Professional & Address</h3>
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Current Occupation</label>
          <input name="currentOccupation" onChange={handleChange} style={styles.input} />
        </div>
      </div>
      <div style={{ ...styles.inputGroup, marginTop: '15px' }}>
        <label style={styles.label}>Residence Address *</label>
        <textarea name="residenceAddress" required onChange={handleChange} style={{ ...styles.input, height: '60px' }} />
      </div>
      <div style={{ ...styles.inputGroup, marginTop: '15px' }}>
        <label style={styles.label}>Office Address</label>
        <textarea name="officeAddress" onChange={handleChange} style={{ ...styles.input, height: '60px' }} />
      </div>

      {/* SECTION 4: FAMILY DETAILS */}
      <h3 style={styles.sectionTitle}>4. Family Details</h3>
      <div style={styles.grid}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Spouse First Name</label>
          <input name="spouseFirstName" onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Spouse Last Name</label>
          <input name="spouseLastName" onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Spouse Birthdate</label>
          <input name="spouseBirthdate" type="date" onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Anniversary Date</label>
          <input name="anniversaryDate" type="date" onChange={handleChange} style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Number of Children</label>
          <input name="numberOfChildren" type="number" onChange={handleChange} style={styles.input} />
        </div>
      </div>

      {/* MEDIA & REFERENCE */}
      <h3 style={styles.sectionTitle}>5. Finalize Profile</h3>
      <div style={styles.inputGroup}>
        <label style={styles.label}>Profile Picture</label>
        <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} style={styles.fileInput} />
      </div>

      <div style={styles.refBox}>
        <label style={{ ...styles.label, color: '#856404' }}>Referred By (Reference Name)</label>
        <input 
          name="referredBy" 
          onChange={handleChange} 
          style={{ ...styles.input, borderColor: '#ffeeba' }} 
          placeholder="Name of an existing senior/member" 
        />
      </div>

      <button type="submit" disabled={loading} style={styles.submitBtn}>
        {loading ? 'Processing Registration...' : 'Complete Registration'}
      </button>
    </form>
  );
};

const styles = {
  form: { padding: '10px' },
  sectionTitle: { fontSize: '1.1rem', color: '#001f3f', borderBottom: '2px solid #fbbf24', paddingBottom: '5px', marginTop: '30px', marginBottom: '15px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', marginBottom: '10px' },
  label: { fontSize: '0.8rem', fontWeight: 'bold', color: '#475569', marginBottom: '5px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.9rem', outline: 'none' },
  fileInput: { fontSize: '0.85rem', color: '#64748b', marginTop: '5px' },
  refBox: { marginTop: '20px', backgroundColor: '#fff9e6', padding: '15px', borderRadius: '12px', border: '1px solid #ffeeba' },
  submitBtn: { marginTop: '30px', width: '100%', padding: '15px', backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }
};

export default AddMember;

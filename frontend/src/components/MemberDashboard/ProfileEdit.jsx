import React, { useState } from 'react';
import api, { BACKEND_URL } from '../../api';

const DEGREES = ["B.Tech", "B.Arch", "Dual Degree", "M.Tech", "M.Sc", "MBA", "Ph.D", "MS", "MCP", "MMST", "LLB", "LLM", "Other"];
const DEPARTMENTS = ["Aerospace Engineering", "Agricultural & Food Engineering", "Architecture & Regional Planning", "Biotechnology", "Chemical Engineering", "Chemistry", "Civil Engineering", "Computer Science & Engineering", "Electrical Engineering", "Electronics & Electrical Communications Engineering", "Geology & Geophysics", "Humanities & Social Sciences", "Industrial Engineering & Management", "Mathematics", "Mechanical Engineering", "Metallurgical Engineering", "Mining Engineering", "Ocean Engineering & Naval Architecture", "Physics & Meteorology", "Vinod Gupta School of Management", "Other"];
const HALLS = ["Ashutosh Mukherjee", "Azad", "Bhidan Chandra Roy", "Campus", "Dr. B R Ambedkar", "Gokhale", "Homi J Bhabha", "Jagadish Chandra Bose", "Lala Lajpat Rai", "Lalbahadur Sastry", "Madan Mohan Malaviya", "Meghnad Saha", "Mother Teresa", "Nehru", "Patel", "Radhakrishnan", "Rajendra Prasad", "Rani Laxmi Bai", "Sarojini Naidu / Indira Gandhi", "Vidyasagar", "Zakir Hussain", "Other"];

const ProfileEdit = ({ userData, refreshData }) => {
  const [formData, setFormData] = useState({ ...userData });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Security: Strip out Admin-controlled fields before sending to the database
      const { lifeMemberNumber, isLifeMember, isApproved, _id, __v, createdAt, updatedAt, ...allowedData } = formData;

      if (newProfilePic) {
        const data = new FormData();
        Object.keys(allowedData).forEach(key => {
          if (allowedData[key] !== null && allowedData[key] !== undefined && allowedData[key] !== '') {
            data.append(key, String(allowedData[key])); 
          }
        });
        data.append('profilePic', newProfilePic);
        
        await fetch(`${BACKEND_URL}/api/alumni/${userData._id}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem('memberToken')}` },
          body: data,
        });
      } else {
        await api.put(`/api/alumni/${userData._id}`, allowedData);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      refreshData(); 
      window.scrollTo(0, 0);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>👤 Edit My Profile</h3>
      <p style={styles.subtitle}>Keep your contact, academic, and professional details up to date.</p>

      {message.text && (
        <div style={{ ...styles.alert, backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce3', color: message.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={styles.photoSection}>
          <img 
            src={formData.profilePic ? `${BACKEND_URL}${formData.profilePic}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
            style={styles.avatar} alt="Profile" 
          />
          <div>
            <label style={styles.label}>Profile Picture</label>
            <input type="file" accept="image/*" onChange={e => setNewProfilePic(e.target.files[0])} style={styles.fileInput} />
          </div>
        </div>

        <h4 style={styles.sectionTitle}>1. Personal Identity</h4>
        <div style={styles.grid}>
          <div style={styles.field}><label style={styles.label}>First Name</label><input name="firstName" required value={formData.firstName || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}><label style={styles.label}>Last Name</label><input name="lastName" required value={formData.lastName || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}><label style={styles.label}>Email Address</label><input name="email" required type="email" value={formData.email || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={{display: 'flex', gap: '10px'}}>
            <div style={{...styles.field, width: '70px'}}><label style={styles.label}>Code</label><input name="countryCode" value={formData.countryCode || ''} onChange={handleChange} style={styles.input} /></div>
            <div style={{...styles.field, flex: 1}}><label style={styles.label}>Mobile</label><input name="mobile" required value={formData.mobile || ''} onChange={handleChange} style={styles.input} /></div>
          </div>
          <div style={styles.field}><label style={styles.label}>Birthdate</label><input name="birthdate" type="date" value={formData.birthdate ? formData.birthdate.split('T')[0] : ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}>
            <label style={styles.label}>Sex</label>
            <select name="sex" value={formData.sex || ''} onChange={handleChange} style={styles.input}>
              <option value="">Select...</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} style={styles.input}>
              <option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        <h4 style={styles.sectionTitle}>2. Academic Details</h4>
        <div style={styles.grid}>
          <div style={styles.field}><label style={styles.label}>Batch (Year)</label><input name="yearOfGraduation" type="number" value={formData.yearOfGraduation || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}>
            <label style={styles.label}>Hall of Residence</label>
            <select name="hall" value={formData.hall || ''} onChange={handleChange} style={styles.input}>
              <option value="">Select Hall...</option>
              {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Degree</label>
            <select name="degree" value={formData.degree || ''} onChange={handleChange} style={styles.input}>
              <option value="">Select Degree...</option>
              {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Department</label>
            <select name="department" value={formData.department || ''} onChange={handleChange} style={styles.input}>
              <option value="">Select Department...</option>
              {DEPARTMENTS.map(dept => <option key={dept} value={dept}>{dept}</option>)}
            </select>
          </div>
        </div>

        <h4 style={styles.sectionTitle}>3. Professional & Address</h4>
        <div style={styles.grid}>
          <div style={styles.field}><label style={styles.label}>Current Occupation</label><input name="currentOccupation" value={formData.currentOccupation || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}><label style={styles.label}>Referred By</label><input name="referredBy" placeholder="If applicable" value={formData.referredBy || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={{...styles.field, gridColumn: 'span 2'}}><label style={styles.label}>Residence Address</label><textarea name="residenceAddress" rows="2" value={formData.residenceAddress || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={{...styles.field, gridColumn: 'span 2'}}><label style={styles.label}>Office Address</label><textarea name="officeAddress" rows="2" value={formData.officeAddress || ''} onChange={handleChange} style={styles.input} /></div>
        </div>

        <h4 style={styles.sectionTitle}>4. Family Details</h4>
        <div style={styles.grid}>
          <div style={styles.field}><label style={styles.label}>Spouse First Name</label><input name="spouseFirstName" value={formData.spouseFirstName || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}><label style={styles.label}>Spouse Last Name</label><input name="spouseLastName" value={formData.spouseLastName || ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}><label style={styles.label}>Spouse Birthdate</label><input name="spouseBirthdate" type="date" value={formData.spouseBirthdate ? formData.spouseBirthdate.split('T')[0] : ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}><label style={styles.label}>Anniversary Date</label><input name="anniversaryDate" type="date" value={formData.anniversaryDate ? formData.anniversaryDate.split('T')[0] : ''} onChange={handleChange} style={styles.input} /></div>
          <div style={styles.field}><label style={styles.label}>Number of Children</label><input name="numberOfChildren" type="number" value={formData.numberOfChildren || 0} onChange={handleChange} style={styles.input} /></div>
        </div>

        {/* --- NEW: READ ONLY MEMBERSHIP FIELDS --- */}
        <h4 style={styles.sectionTitle}>5. Membership Status</h4>
        <div style={styles.grid}>
          <div style={styles.field}>
            <label style={styles.label}>Membership Type</label>
            <input 
              disabled 
              value={formData.isLifeMember ? 'Life Member ⭐' : 'General Member'} 
              style={{...styles.input, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed'}} 
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Life Member Number</label>
            <input 
              disabled 
              value={formData.lifeMemberNumber || 'N/A'} 
              style={{...styles.input, backgroundColor: '#f1f5f9', color: '#64748b', cursor: 'not-allowed'}} 
            />
          </div>
        </div>

        <div style={styles.footer}>
          <button type="submit" disabled={loading} style={styles.btnSave}>
            {loading ? 'Processing...' : 'Save Profile Updates'}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  title: { margin: '0 0 5px 0', color: '#001f3f' },
  subtitle: { margin: '0 0 25px 0', color: '#64748b', fontSize: '0.85rem' },
  sectionTitle: { margin: '30px 0 15px 0', paddingBottom: '5px', borderBottom: '2px solid #fbbf24', color: '#001f3f', fontWeight: 'bold', fontSize: '1rem' },
  alert: { padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem', fontWeight: 'bold' },
  photoSection: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', paddingBottom: '15px', borderBottom: '1px solid #f1f5f9' },
  avatar: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #f8fafc' },
  fileInput: { display: 'block', marginTop: '8px', fontSize: '0.8rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '0.75rem', fontWeight: '800', color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' },
  footer: { marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' },
  btnSave: { padding: '12px 30px', backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' }
};

export default ProfileEdit;
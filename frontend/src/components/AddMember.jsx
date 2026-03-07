import React, { useState } from 'react';
import axios from 'axios';

const AddMember = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', countryCode: '+91', mobile: '', 
    birthdate: '', sex: '', maritalStatus: 'Single', yearOfGraduation: '', 
    department: '', degree: '', hall: '', lifeMemberNumber: '',
    currentOccupation: '', residenceAddress: '', officeAddress: '', 
    spouseName: '', anniversaryDate: '', spouseBirthdate: '', numberOfChildren: 0
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(formData.mobile)) {
      alert("Error: Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      await axios.post('/api/alumni', formData);
      alert('Registration submitted! An admin will approve your profile shortly.');
    } catch (err) {
      const serverMsg = err.response?.data?.message || 'Check all fields and try again.';
      alert('Registration Failed: ' + serverMsg);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '15px', backgroundColor: '#fff' }}>
      <h2 style={{ color: '#003366', textAlign: 'center' }}>Member Registration</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        
        <div style={rowStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>First Name</label>
            <input name="firstName" style={inputStyle} onChange={handleChange} required />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Last Name</label>
            <input name="lastName" style={inputStyle} onChange={handleChange} required />
          </div>
        </div>
        
        <div style={inputGroup}>
          <label style={labelStyle}>Email Address</label>
          <input name="email" type="email" style={inputStyle} onChange={handleChange} required />
        </div>

        <div style={rowStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Country Code</label>
            <select name="countryCode" style={inputStyle} onChange={handleChange}>
              <option value="+91">+91 (India)</option>
              <option value="+1">+1 (USA)</option>
              <option value="+44">+44 (UK)</option>
            </select>
          </div>
          <div style={{ ...inputGroup, flex: 2 }}>
            <label style={labelStyle}>Mobile Number (10 digits)</label>
            <input name="mobile" placeholder="e.g. 9876543210" style={inputStyle} onChange={handleChange} required />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={inputGroup}>
            <label style={labelStyle}>Birthdate</label>
            <input name="birthdate" type="date" style={inputStyle} onChange={handleChange} required />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Sex</label>
            <select name="sex" style={inputStyle} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>Marital Status</label>
            <select name="maritalStatus" style={inputStyle} onChange={handleChange} required>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        <fieldset style={fieldsetStyle}>
          <legend style={legendStyle}>IIT KGP Academic Details</legend>
          <div style={rowStyle}>
            <div style={inputGroup}><label style={labelStyle}>Graduation Year</label><input name="yearOfGraduation" type="number" style={inputStyle} onChange={handleChange} required /></div>
            <div style={inputGroup}><label style={labelStyle}>Degree</label><input name="degree" placeholder="B.Tech / M.Tech" style={inputStyle} onChange={handleChange} required /></div>
          </div>
          <div style={{...rowStyle, marginTop:'10px'}}>
            <div style={inputGroup}><label style={labelStyle}>Department</label><input name="department" style={inputStyle} onChange={handleChange} required /></div>
            <div style={inputGroup}><label style={labelStyle}>Hall</label><input name="hall" style={inputStyle} onChange={handleChange} required /></div>
          </div>
          <div style={{marginTop:'10px'}}><label style={labelStyle}>Life Member Number</label><input name="lifeMemberNumber" style={inputStyle} onChange={handleChange} /></div>
        </fieldset>

        <div style={inputGroup}><label style={labelStyle}>Current Occupation</label><input name="currentOccupation" style={inputStyle} onChange={handleChange} /></div>
        <div style={inputGroup}><label style={labelStyle}>Residence Address</label><textarea name="residenceAddress" style={{...inputStyle, height:'60px'}} onChange={handleChange} required /></div>
        <div style={inputGroup}><label style={labelStyle}>Office Address</label><textarea name="officeAddress" style={{...inputStyle, height:'60px'}} onChange={handleChange} /></div>

        {formData.maritalStatus === 'Married' && (
          <fieldset style={{ ...fieldsetStyle, backgroundColor: '#f9f9f9' }}>
            <legend style={legendStyle}>Spouse & Family</legend>
            <div style={inputGroup}><label style={labelStyle}>Spouse Name</label><input name="spouseName" style={inputStyle} onChange={handleChange} /></div>
            <div style={{...rowStyle, marginTop:'10px'}}>
              <div style={inputGroup}><label style={labelStyle}>Anniversary</label><input name="anniversaryDate" type="date" style={inputStyle} onChange={handleChange} /></div>
              <div style={inputGroup}><label style={labelStyle}>Spouse DOB</label><input name="spouseBirthdate" type="date" style={inputStyle} onChange={handleChange} /></div>
            </div>
          </fieldset>
        )}

        <div style={inputGroup}><label style={labelStyle}>Number of Children</label><input name="numberOfChildren" type="number" style={{...inputStyle, width:'100px'}} onChange={handleChange} /></div>

        <button type="submit" style={buttonStyle}>Submit Registration</button>
      </form>
    </div>
  );
};

const rowStyle = { display: 'flex', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', flex: 1 };
const labelStyle = { fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px', color: '#555' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px' };
const fieldsetStyle = { border: '1px solid #ddd', borderRadius: '8px', padding: '15px' };
const legendStyle = { fontWeight: 'bold', color: '#003366', padding: '0 10px' };
const buttonStyle = { padding: '15px', backgroundColor: '#003366', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default AddMember;
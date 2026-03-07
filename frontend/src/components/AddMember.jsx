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
      alert('Success! Registration submitted for admin approval.');
    } catch (err) {
      alert('Failed: ' + (err.response?.data?.message || 'Check connection'));
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '12px' }}>
      <h2 style={{ textAlign: 'center', color: '#003366' }}>Member Registration</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label>First Name</label>
            <input name="firstName" style={inputStyle} onChange={handleChange} required />
          </div>
          <div style={{ flex: 1 }}>
            <label>Last Name</label>
            <input name="lastName" style={inputStyle} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <label>Email Address</label>
          <input name="email" type="email" style={inputStyle} onChange={handleChange} required />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div>
            <label>Code</label>
            <select name="countryCode" style={inputStyle} onChange={handleChange}>
              <option value="+91">+91 (IN)</option>
              <option value="+1">+1 (US)</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>10-Digit Mobile Number</label>
            <input name="mobile" placeholder="9876543210" style={inputStyle} onChange={handleChange} required />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div>
            <label>Birthdate</label>
            <input name="birthdate" type="date" style={inputStyle} onChange={handleChange} required />
          </div>
          <div>
            <label>Sex</label>
            <select name="sex" style={inputStyle} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label>Marital Status</label>
            <select name="maritalStatus" style={inputStyle} onChange={handleChange} required>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        <fieldset style={{ padding: '15px', borderRadius: '8px', border: '1px solid #ccc' }}>
          <legend style={{ fontWeight: 'bold' }}>IIT KGP Details</legend>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div><label>Graduation Year</label><input name="yearOfGraduation" type="number" style={inputStyle} onChange={handleChange} required /></div>
            <div><label>Degree</label><input name="degree" placeholder="B.Tech" style={inputStyle} onChange={handleChange} required /></div>
            <div><label>Department</label><input name="department" style={inputStyle} onChange={handleChange} required /></div>
            <div><label>Hall of Residence</label><input name="hall" style={inputStyle} onChange={handleChange} required /></div>
          </div>
          <div style={{ marginTop: '10px' }}>
            <label>Life Member Number</label>
            <input name="lifeMemberNumber" style={inputStyle} onChange={handleChange} />
          </div>
        </fieldset>

        <div>
          <label>Residence Address</label>
          <textarea name="residenceAddress" style={inputStyle} onChange={handleChange} required />
        </div>

        <button type="submit" style={{ padding: '15px', background: '#003366', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Register Now
        </button>
      </form>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' };

export default AddMember;
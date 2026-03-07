import React, { useState } from 'react';
import axios from 'axios';

const AddMember = () => {
  const [formData, setFormData] = useState({
    name: '',
    batch: '',
    department: '',
    isLifeMember: false
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the data to your Node.js backend
    await axios.post('/api/alumni', formData);
      setMessage('KGPian added successfully! Refresh the page to see them.');
      // Clear the form
      setFormData({ name: '', batch: '', department: '', isLifeMember: false });
    } catch (error) {
      console.error('Error adding member:', error);
      setMessage('Failed to add member. Is the server running?');
    }
  };

  return (
    <div className="admin-form" style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #000', borderRadius: '8px' }}>
      <h3>Admin: Add New Alumni</h3>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" name="name" placeholder="Full Name (e.g., Sundar Pichai)" 
          value={formData.name} onChange={handleChange} required 
        />
        <input 
          type="number" name="batch" placeholder="Graduation Year (e.g., 1989)" 
          value={formData.batch} onChange={handleChange} required 
        />
        <input 
          type="text" name="department" placeholder="Department (e.g., Meta)" 
          value={formData.department} onChange={handleChange} required 
        />
        <label>
          <input 
            type="checkbox" name="isLifeMember" 
            checked={formData.isLifeMember} onChange={handleChange} 
          />
          {" "} Life Member?
        </label>
        
        <button type="submit" style={{ padding: '10px', backgroundColor: '#0056b3', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Member
        </button>
      </form>
    </div>
  );
};

export default AddMember;
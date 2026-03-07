import React, { useState } from 'react';
import axios from 'axios';

const AddEvent = () => {
  const [formData, setFormData] = useState({ title: '', date: '', location: '', description: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/events', formData);
      alert('Event added!');
      setFormData({ title: '', date: '', location: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f4f4f4', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Add New Event</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input type="text" placeholder="Event Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
        <input type="text" placeholder="Date (e.g. April 15, 2026)" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
        <input type="text" placeholder="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
        <button type="submit">Add Event</button>
      </form>
    </div>
  );
};

export default AddEvent;
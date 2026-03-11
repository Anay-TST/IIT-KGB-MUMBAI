import React, { useState } from 'react';
import api from '../api'; 
import styles from './AdminStyles';

const AdminEvents = ({ events, fetchAll }) => {
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });

  const createEvent = async (e) => {
    e.preventDefault(); 
    if (!newEvent.title || !newEvent.date) return alert("Please provide at least a title and a date.");
    await api.post('/api/events', newEvent);
    setNewEvent({ title: '', date: '', location: '', description: '' }); 
    fetchAll();
  };

  const uploadEventMedia = async (eventId, files) => {
    if (!files || files.length === 0) return;
    const fd = new FormData(); 
    Array.from(files).forEach(f => fd.append('files', f));
    await api.post(`/api/events/${eventId}/media`, fd); 
    fetchAll();
  };

  return (
    <>
      <h1>Events</h1>
      <form onSubmit={createEvent} style={styles.formCard}>
        <input placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={styles.inputS} />
        <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={styles.inputS} />
        <input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} style={styles.inputS} />
        <button type="submit" style={styles.btnBlue}>Create</button>
      </form>
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Event</th><th style={styles.th}>Date</th><th style={styles.th}>Upload Media</th><th style={styles.th}>Action</th></tr></thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id}>
                <td style={styles.td}>{e.title}</td>
                <td style={styles.td}>{new Date(e.date).toLocaleDateString()}</td>
                <td style={styles.td}><input type="file" multiple onChange={(el) => uploadEventMedia(e._id, el.target.files)} /></td>
                <td style={styles.td}><button onClick={() => api.delete(`/api/events/${e._id}`).then(fetchAll)} style={styles.btnDelete}>Del</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminEvents;
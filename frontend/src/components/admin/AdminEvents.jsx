import React, { useState } from 'react';
import api from '../../api';

const AdminEvents = ({ events, fetchAll }) => {
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });

  const createEvent = async (e) => {
    e.preventDefault();
    await api.post('/api/events', newEvent);
    setNewEvent({ title: '', date: '', location: '', description: '' });
    fetchAll();
    alert("Event Created!");
  };

  const uploadEventMedia = async (eventId, files) => {
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    await api.post(`/api/events/${eventId}/media`, fd);
    fetchAll();
    alert("Media added!");
  };

  return (
    <>
      <h1>Event Management</h1>
      <form onSubmit={createEvent} style={styles.formCard}>
        <input placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={styles.inputS} required/>
        <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={styles.inputS} required/>
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
                <td style={styles.td}>
                  <input type="file" multiple onChange={(el) => uploadEventMedia(e._id, el.target.files)} />
                </td>
                <td style={styles.td}><button onClick={() => api.delete(`/api/events/${e._id}`).then(fetchAll)} style={styles.btnDelete}>Del</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const styles = {
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #eee' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' },
  td: { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  inputS: { padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px', width: '100%', boxSizing: 'border-box', fontSize: '14px' }
};

export default AdminEvents;
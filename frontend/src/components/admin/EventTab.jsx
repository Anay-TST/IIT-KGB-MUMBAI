import React, { useState } from 'react';
import api from '../../api';

const EventTab = ({ events, refresh }) => {
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });
  const [editEvent, setEditEvent] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/api/events', newEvent);
    setNewEvent({ title: '', date: '', location: '', description: '' });
    refresh();
  };

  const uploadMedia = async (id, files) => {
    const fd = new FormData();
    Array.from(files).forEach(f => fd.append('files', f));
    await api.post(`/api/events/${id}/media`, fd);
    refresh();
    alert("Media added to gallery!");
  };

  const saveEdit = async () => {
    await api.put(`/api/events/${editEvent._id}`, editEvent);
    setEditEvent(null);
    refresh();
  };

  return (
    <div>
      <h1>Events & Gallery</h1>
      <div style={styles.formCard}>
        <h3>Quick Create Event</h3>
        <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
          <input placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={styles.input} />
          <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={styles.input} />
          <button onClick={handleCreate} style={styles.btnBlue}>Create</button>
        </div>
      </div>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr><th style={styles.th}>Event Title</th><th style={styles.th}>Gallery Items</th><th style={styles.th}>Actions</th></tr>
          </thead>
          <tbody>
            {events.map(e => (
              <tr key={e._id}>
                <td style={styles.td}><strong>{e.title}</strong><br/><small>{new Date(e.date).toLocaleDateString()}</small></td>
                <td style={styles.td}>
                  <label style={styles.uploadBtn}>
                    📁 Add Media
                    <input type="file" multiple hidden onChange={(el) => uploadMedia(e._id, el.target.files)} />
                  </label>
                  <span style={{marginLeft:'10px', fontSize:'0.8rem'}}>{e.images?.length || 0} images</span>
                </td>
                <td style={styles.td}>
                  <button onClick={() => setEditEvent(e)} style={styles.btnEdit}>Edit Details</button>
                  <button onClick={() => api.delete(`/api/events/${e._id}`).then(refresh)} style={styles.btnDelete}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editEvent && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Edit Event</h3>
            <input value={editEvent.title} onChange={e => setEditEvent({...editEvent, title: e.target.value})} style={styles.modalInput} />
            <input type="date" value={editEvent.date?.split('T')[0]} onChange={e => setEditEvent({...editEvent, date: e.target.value})} style={styles.modalInput} />
            <textarea value={editEvent.description} onChange={e => setEditEvent({...editEvent, description: e.target.value})} style={{...styles.modalInput, height:'80px'}} />
            <button onClick={saveEdit} style={styles.btnBlueFull}>Save Changes</button>
            <button onClick={() => setEditEvent(null)} style={{marginTop:'10px', width:'100%', background:'none', border:'none', cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '30px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 },
  btnBlue: { backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  tableCard: { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', fontSize: '0.8rem' },
  td: { padding: '15px', borderBottom: '1px solid #f1f5f9' },
  btnEdit: { backgroundColor: '#f1f5f9', color: '#475569', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', marginRight: '5px' },
  btnDelete: { backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' },
  uploadBtn: { backgroundColor: '#fbbf24', color: '#001f3f', padding: '5px 12px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { backgroundColor: 'white', padding: '30px', borderRadius: '25px', width: '400px' },
  modalInput: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', marginBottom: '10px', boxSizing:'border-box' },
  btnBlueFull: { backgroundColor: '#001f3f', color: '#fbbf24', padding: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer', width: '100%', fontWeight: 'bold' }
};

export default EventTab;
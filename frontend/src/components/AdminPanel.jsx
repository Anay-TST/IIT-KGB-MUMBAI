import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';

const AdminPanel = () => {
  // --- STATE ---
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState('members'); 
  
  // Data Lists
  const [members, setMembers] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [docs, setDocs] = useState([]);
  const [events, setEvents] = useState([]);

  // Form & UI States
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [newPic, setNewPic] = useState(null);
  
  // Committee Form
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [committeeTitle, setCommitteeTitle] = useState('');

  // Document Form
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState(null);

  // Event Form
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });

  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const fetchAll = async () => {
    try {
      const [memRes, commRes, docRes, eventRes] = await Promise.all([
        api.get('/api/alumni/all'),
        api.get('/api/committee'),
        api.get('/api/documents'),
        api.get('/api/events')
      ]);
      setMembers(memRes.data);
      setCommittee(commRes.data.sort((a, b) => (a.order || 0) - (b.order || 0)));
      setDocs(docRes.data);
      setEvents(eventRes.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const login = (e) => { 
    e.preventDefault(); 
    if(pass === 'Loki12345') { setAuth(true); fetchAll(); } 
    else alert('Wrong Password'); 
  };

  // --- MEMBER ACTIONS ---
  const memberAction = (id, act) => api.patch(`/api/alumni/status/${id}?action=${act}`).then(fetchAll);
  const deleteMember = (id) => window.confirm("Delete member?") && api.delete(`/api/alumni/${id}`).then(fetchAll);
  
  const saveMemberEdit = async () => {
    try {
      const formData = new FormData();
      if (editData.profilePic === "") formData.append('removePhoto', 'true');
      Object.keys(editData).forEach(key => {
        if (['profilePic', '_id', '__v', 'createdAt', 'isApproved', 'isLifeMember'].includes(key)) return;
        let value = editData[key];
        if (['birthdate', 'anniversaryDate'].includes(key) && (!value || value === "")) return;
        if (key === 'numberOfChildren' || key === 'yearOfGraduation') value = value === "" ? 0 : Number(value);
        if (value !== null && value !== undefined) formData.append(key, value);
      });
      if (newPic) formData.append('profilePic', newPic);
      await api.put(`/api/alumni/${editData._id}`, formData);
      setEditData(null); setNewPic(null); fetchAll();
      alert("Updated!");
    } catch (err) { alert("Update failed"); }
  };

  // --- COMMITTEE ACTIONS ---
  const addToCommittee = async (e) => {
    e.preventDefault();
    await api.post('/api/committee', { memberId: selectedMemberId, title: committeeTitle, order: committee.length });
    setCommitteeTitle(''); setSelectedMemberId(''); fetchAll();
  };

  const moveComm = async (index, dir) => {
    const newItems = [...committee];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setCommittee(newItems);
    await api.patch('/api/committee/reorder', { orders: newItems.map((item, idx) => ({ id: item._id, order: idx })) });
  };

  // --- DOC ACTIONS ---
  const uploadDoc = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', docTitle);
    fd.append('file', docFile);
    await api.post('/api/documents', fd);
    setDocTitle(''); setDocFile(null); fetchAll();
  };

  // --- EVENT ACTIONS ---
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
    alert("Media added and compressed!");
  };

  if (!auth) return (
    <div style={styles.loginCenter}>
      <form onSubmit={login} style={styles.loginBox}>
        <h2 style={{color: '#003366'}}>IIT KGP Admin</h2>
        <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} style={styles.inputS} />
        <button type="submit" style={styles.btnBlue}>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3 style={{borderBottom: '1px solid #003366', paddingBottom: '10px'}}>Dashboard</h3>
        <div style={activeTab === 'members' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('members')}>👥 Members</div>
        <div style={activeTab === 'committee' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('committee')}>🏛️ Committee</div>
        <div style={activeTab === 'docs' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('docs')}>📄 Documents</div>
        <div style={activeTab === 'events' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('events')}>📅 Events</div>
        <div onClick={() => setAuth(false)} style={styles.logoutBtn}>🚪 Logout</div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '30px', marginLeft: '220px' }}>
        
        {activeTab === 'members' && (
          <>
            <h1>Member Management</h1>
            <input placeholder="Search names..." onChange={(e) => setSearch(e.target.value)} style={styles.searchBar} />
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr></thead>
                <tbody>
                  {members.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())).map(m => (
                    <tr key={m._id}>
                      <td style={styles.td}>{m.firstName} {m.lastName}</td>
                      <td style={styles.td}>{m.isApproved ? '✅' : '⏳'} {m.isLifeMember ? '⭐' : ''}</td>
                      <td style={styles.td}>
                        <button onClick={() => setEditData(m)} style={styles.btnAction}>Edit</button>
                        <button onClick={() => memberAction(m._id, m.isApproved ? 'revoke' : 'approve')} style={{...styles.btnAction, backgroundColor: m.isApproved ? '#6c757d' : '#28a745'}}>{m.isApproved ? 'Revoke' : 'Approve'}</button>
                        <button onClick={() => deleteMember(m._id)} style={styles.btnDelete}>Del</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'committee' && (
          <>
            <h1>Committee Management</h1>
            <form onSubmit={addToCommittee} style={styles.formCard}>
              <select style={{...styles.inputS, flex: 2}} value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}>
                <option value="">Select Member...</option>
                {members.filter(m => m.isApproved).map(m => (<option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>))}
              </select>
              <input placeholder="Position" value={committeeTitle} onChange={e => setCommitteeTitle(e.target.value)} style={{...styles.inputS, flex: 1}} />
              <button type="submit" style={styles.btnBlue}>Add</button>
            </form>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <tbody>
                  {committee.map((c, idx) => (
                    <tr key={c._id}>
                      <td style={styles.td}>
                        <button onClick={() => moveComm(idx, 'up')} disabled={idx === 0}>▲</button>
                        <button onClick={() => moveComm(idx, 'down')} disabled={idx === committee.length - 1}>▼</button>
                      </td>
                      <td style={styles.td}>{c.member?.firstName} {c.member?.lastName}</td>
                      <td style={styles.td}><strong>{c.title}</strong></td>
                      <td style={styles.td}><button onClick={() => api.delete(`/api/committee/${c._id}`).then(fetchAll)} style={styles.btnDelete}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'docs' && (
          <>
            <h1>Documents</h1>
            <form onSubmit={uploadDoc} style={styles.formCard}>
              <input placeholder="Doc Title" value={docTitle} onChange={e => setDocTitle(e.target.value)} style={styles.inputS} />
              <input type="file" onChange={e => setDocFile(e.target.files[0])} />
              <button type="submit" style={styles.btnBlue}>Upload</button>
            </form>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <tbody>
                  {docs.map(d => (
                    <tr key={d._id}>
                      <td style={styles.td}>{new Date(d.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>{d.title}</td>
                      <td style={styles.td}><button onClick={() => api.delete(`/api/documents/${d._id}`).then(fetchAll)} style={styles.btnDelete}>Del</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {activeTab === 'events' && (
          <>
            <h1>Event Management</h1>
            <form onSubmit={createEvent} style={styles.formCard}>
              <input placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={styles.inputS} />
              <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={styles.inputS} />
              <input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} style={styles.inputS} />
              <button type="submit" style={styles.btnBlue}>Create</button>
            </form>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead><tr><th>Event</th><th>Date</th><th>Upload Media (Photos/Videos)</th><th>Action</th></tr></thead>
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
        )}
      </div>

      {/* MEMBER EDIT MODAL */}
      {editData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>Edit {editData.firstName}</h2>
            <div style={styles.modalScroll}>
               <input value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} style={styles.inputS} placeholder="First Name"/>
               <input value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} style={styles.inputS} placeholder="Last Name"/>
               <input value={editData.yearOfGraduation} onChange={e => setEditData({...editData, yearOfGraduation: e.target.value})} style={styles.inputS} placeholder="Batch"/>
               <input value={editData.hall} onChange={e => setEditData({...editData, hall: e.target.value})} style={styles.inputS} placeholder="Hall"/>
               <input value={editData.degree} onChange={e => setEditData({...editData, degree: e.target.value})} style={styles.inputS} placeholder="Degree"/>
               <input value={editData.department} onChange={e => setEditData({...editData, department: e.target.value})} style={styles.inputS} placeholder="Dept"/>
            </div>
            <div style={{marginTop:'20px'}}>
              <button onClick={saveMemberEdit} style={styles.btnBlue}>Save</button>
              <button onClick={() => setEditData(null)} style={{marginLeft:'10px'}}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  sidebar: { width: '220px', backgroundColor: '#001f3f', color: 'white', padding: '20px', position: 'fixed', height: '100vh' },
  sidebarItem: { padding: '12px', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px' },
  sidebarActive: { padding: '12px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#003366', fontWeight: 'bold', marginBottom: '5px' },
  logoutBtn: { marginTop: '40px', color: '#ff4d4d', cursor: 'pointer', padding: '12px' },
  searchBar: { padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '20px' },
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #eee' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#f8f9fa' },
  td: { padding: '15px', borderBottom: '1px solid #eee' },
  btnAction: { backgroundColor:'#17a2b8', color:'white', border:'none', padding: '6px 10px', borderRadius:'4px', cursor: 'pointer', marginRight: '5px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  inputS: { padding: '8px', border: '1px solid #ddd', borderRadius: '5px', width: '100%', marginBottom: '10px' },
  loginCenter: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f3f' },
  loginBox: { backgroundColor: 'white', padding: '50px', borderRadius: '15px', textAlign: 'center' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '500px' },
  modalScroll: { maxHeight: '60vh', overflowY: 'auto' }
};

export default AdminPanel;
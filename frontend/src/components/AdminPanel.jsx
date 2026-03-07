import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';

const AdminPanel = () => {
  // --- AUTH & TAB STATE ---
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState('members'); 

  // --- DATA STATE ---
  const [members, setMembers] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [search, setSearch] = useState('');
  
  // --- EDIT MODAL STATE ---
  const [editData, setEditData] = useState(null);
  const [newPic, setNewPic] = useState(null);

  // --- COMMITTEE FORM STATE ---
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [committeeTitle, setCommitteeTitle] = useState('');

  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  // --- DATA FETCHING ---
  const fetchAll = async () => {
    try {
      // Using 'api' instance automatically prepends the Codespace/Localhost URL
      const [memRes, commRes] = await Promise.all([
        api.get('/api/alumni/all'),
        api.get('/api/committee')
      ]);
      setMembers(memRes.data);
      setCommittee(commRes.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const login = (e) => { 
    e.preventDefault(); 
    if(pass === 'Loki12345') { setAuth(true); fetchAll(); } 
    else alert('Wrong Password'); 
  };

  // --- MEMBER ACTIONS ---
  const action = (id, act) => api.patch(`/api/alumni/status/${id}?action=${act}`).then(fetchAll);
  
  const del = (id) => window.confirm("Delete permanently?") && api.delete(`/api/alumni/${id}`).then(fetchAll);
  
  const saveFullEdit = async () => {
    try {
      const formData = new FormData();
      Object.keys(editData).forEach(key => {
        if (key === 'profilePic' || key === '_id' || key === '__v' || key === 'createdAt') return;
        let value = editData[key];

        const dateFields = ['birthdate', 'anniversaryDate', 'spouseBirthdate'];
        if (dateFields.includes(key) && (!value || value === "")) return;

        if (key === 'numberOfChildren' || key === 'yearOfGraduation') {
          value = value === "" ? 0 : Number(value);
        }

        if (value === null || value === undefined) return;
        formData.append(key, value);
      });

      if (newPic) formData.append('profilePic', newPic);

      await api.put(`/api/alumni/${editData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setEditData(null);
      setNewPic(null);
      fetchAll();
      alert("Details Updated Successfully!");
    } catch (err) { 
      console.error("Update Error:", err.response?.data);
      alert("Update failed: " + (err.response?.data?.message || "Check fields")); 
    }
  };

  // --- COMMITTEE ACTIONS ---
  const addToCommittee = async (e) => {
    e.preventDefault();
    if(!selectedMemberId || !committeeTitle) return alert("Select member and provide title");
    try {
      await api.post('/api/committee', { 
        memberId: selectedMemberId, 
        title: committeeTitle 
      });
      setCommitteeTitle('');
      setSelectedMemberId('');
      fetchAll();
      alert("Added to Committee");
    } catch (err) {
      alert("Error adding to committee");
    }
  };

  const removeFromCommittee = async (id) => {
    if(window.confirm("Remove from committee?")) {
      await api.delete(`/api/committee/${id}`);
      fetchAll();
    }
  };

  const filteredMembers = members.filter(m => 
    `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (!auth) return (
    <div style={styles.loginCenter}>
      <form onSubmit={login} style={styles.loginBox}>
        <h2 style={{color: '#003366'}}>IIT KGP Admin Login</h2>
        <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} style={styles.inputS} />
        <button type="submit" style={styles.btnBlue}>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      
      <div style={styles.sidebar}>
        <h3 style={{borderBottom: '1px solid #003366', paddingBottom: '10px'}}>Admin Dashboard</h3>
        <div 
          style={activeTab === 'members' ? styles.sidebarActive : styles.sidebarItem} 
          onClick={() => setActiveTab('members')}
        >
          👥 Members List
        </div>
        <div 
          style={activeTab === 'committee' ? styles.sidebarActive : styles.sidebarItem} 
          onClick={() => setActiveTab('committee')}
        >
          🏛️ Committee
        </div>
        <div onClick={() => setAuth(false)} style={styles.logoutBtn}>🚪 Logout</div>
      </div>

      <div style={{ flex: 1, padding: '30px', marginLeft: '220px' }}>
        
        {activeTab === 'members' && (
          <>
            <div style={styles.headerRow}>
              <h1>Member Management</h1>
              <input placeholder="Search members..." onChange={(e) => setSearch(e.target.value)} style={styles.searchBar} />
            </div>

            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr><th style={styles.th}>Member</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr>
                </thead>
                <tbody>
                  {filteredMembers.map(m => (
                    <tr key={m._id} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <img 
                            src={m.profilePic ? `${BACKEND_URL}${m.profilePic}` : defaultAvatar} 
                            alt="avatar" 
                            style={{width:'35px', height:'35px', borderRadius:'50%', objectFit: 'cover'}} 
                            onError={(e) => e.target.src = defaultAvatar}
                          />
                          <div><strong>{m.firstName} {m.lastName}</strong><br/><small>{m.email}</small></div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {m.isApproved ? '✅ Approved' : '⏳ Pending'}<br/>
                        {m.isLifeMember ? '⭐ Life Member' : 'Regular'}
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => {setEditData(m); setNewPic(null);}} style={styles.btnAction}>Edit</button>
                        {!m.isApproved && <button onClick={() => action(m._id, 'approve')} style={styles.btnApprove}>Approve</button>}
                        <button onClick={() => action(m._id, 'toggleLife')} style={styles.btnLife}>{m.isLifeMember ? 'Untag Life' : 'Tag Life'}</button>
                        <button onClick={() => del(m._id)} style={styles.btnDelete}>Del</button>
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
            <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
              <h3>Add Committee Member</h3>
              <form onSubmit={addToCommittee} style={{display: 'flex', gap: '15px'}}>
                <select 
                  style={{...styles.inputS, flex: 2}} 
                  value={selectedMemberId} 
                  onChange={e => setSelectedMemberId(e.target.value)}
                >
                  <option value="">Select an Approved Member...</option>
                  {members.filter(m => m.isApproved).map(m => (
                    <option key={m._id} value={m._id}>{m.firstName} {m.lastName} ({m.yearOfGraduation})</option>
                  ))}
                </select>
                <input 
                  placeholder="Title (e.g. President)" 
                  value={committeeTitle} 
                  onChange={e => setCommitteeTitle(e.target.value)} 
                  style={{...styles.inputS, flex: 1}}
                />
                <button type="submit" style={styles.btnBlue}>Add to Team</button>
              </form>
            </div>

            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr><th style={styles.th}>Name</th><th style={styles.th}>Title</th><th style={styles.th}>Actions</th></tr>
                </thead>
                <tbody>
                  {committee.map(c => (
                    <tr key={c._id} style={styles.tr}>
                      <td style={styles.td}>{c.member?.firstName} {c.member?.lastName}</td>
                      <td style={styles.td}><span style={{fontWeight: 'bold', color: '#003366'}}>{c.title}</span></td>
                      <td style={styles.td}>
                        <button onClick={() => removeFromCommittee(c._id)} style={styles.btnDelete}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {editData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{margin:0}}>Edit Profile</h2>
              <button onClick={() => setEditData(null)} style={{cursor:'pointer', border:'none', background:'none', fontSize:'24px'}}>✕</button>
            </div>

            <div style={styles.modalScroll}>
              <h4 style={styles.secTitle}>Profile Picture</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <img 
                    src={newPic ? URL.createObjectURL(newPic) : (editData.profilePic ? `${BACKEND_URL}${editData.profilePic}` : defaultAvatar)} 
                    alt="Profile" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #003366' }}
                    onError={(e) => e.target.src = defaultAvatar}
                />
                <input type="file" onChange={(e) => setNewPic(e.target.files[0])} />
              </div>

              <h4 style={styles.secTitle}>Personal Details</h4>
              <div style={styles.grid2}>
                <div><label style={styles.label}>First Name</label><input value={editData.firstName || ''} onChange={e => setEditData({...editData, firstName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Last Name</label><input value={editData.lastName || ''} onChange={e => setEditData({...editData, lastName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Email</label><input value={editData.email || ''} onChange={e => setEditData({...editData, email: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Mobile</label><input value={editData.mobile || ''} onChange={e => setEditData({...editData, mobile: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Birthdate</label><input type="date" value={editData.birthdate?.split('T')[0] || ''} onChange={e => setEditData({...editData, birthdate: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Sex</label><select value={editData.sex || ''} onChange={e => setEditData({...editData, sex: e.target.value})} style={styles.inputS}><option value="Male">Male</option><option value="Female">Female</option></select></div>
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button onClick={() => setEditData(null)} style={styles.btnCancel}>Cancel</button>
              <button onClick={saveFullEdit} style={styles.btnSave}>Save All Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  sidebar: { width: '220px', backgroundColor: '#001f3f', color: 'white', padding: '20px', position: 'fixed', height: '100vh', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' },
  sidebarItem: { padding: '12px', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px', transition: '0.2s' },
  sidebarActive: { padding: '12px', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px', backgroundColor: '#003366', fontWeight: 'bold' },
  logoutBtn: { marginTop: '40px', color: '#ff4d4d', cursor: 'pointer', padding: '12px', borderTop: '1px solid #333' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  searchBar: { padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ddd' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa', textAlign: 'left', borderBottom: '2px solid #eee' },
  th: { padding: '15px', color: '#003366' },
  td: { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px' },
  btnAction: { backgroundColor:'#17a2b8', color:'white', border:'none', padding: '6px 12px', marginRight: '5px', borderRadius:'4px', cursor: 'pointer' },
  btnApprove: { backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  btnLife: { backgroundColor: '#ffcc00', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', width: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  modalScroll: { overflowY: 'auto', paddingRight: '10px' },
  secTitle: { borderBottom: '2px solid #f0f4f8', paddingBottom: '5px', marginTop: '25px', color: '#003366', fontWeight: 'bold' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' },
  label: { fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px', color: '#666' },
  inputS: { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '5px' },
  modalFooter: { marginTop: '20px', textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '15px' },
  btnSave: { backgroundColor: '#003366', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancel: { padding: '12px 25px', marginRight: '10px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '5px' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  loginCenter: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f3f' },
  loginBox: { backgroundColor: 'white', padding: '50px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }
};

export default AdminPanel;
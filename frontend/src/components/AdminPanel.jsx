import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';

const AdminPanel = () => {
  // --- STATE ---
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState('members'); 
  const [members, setMembers] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [newPic, setNewPic] = useState(null);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [committeeTitle, setCommitteeTitle] = useState('');

  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const fetchAll = async () => {
    try {
      const [memRes, commRes] = await Promise.all([
        api.get('/api/alumni/all'),
        api.get('/api/committee')
      ]);
      setMembers(memRes.data);
      const sortedComm = commRes.data.sort((a, b) => (a.order || 0) - (b.order || 0));
      setCommittee(sortedComm);
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
      if (editData.profilePic === "") formData.append('removePhoto', 'true');
      
      Object.keys(editData).forEach(key => {
        if (['profilePic', '_id', '__v', 'createdAt', 'isApproved', 'isLifeMember'].includes(key)) return;
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

      await api.put(`/api/alumni/${editData._id}`, formData);
      setEditData(null); setNewPic(null); fetchAll();
      alert("Profile Updated Successfully!");
    } catch (err) { 
        console.error(err);
        alert("Update failed. Please check all required fields."); 
    }
  };

  // --- COMMITTEE ACTIONS ---
  const addToCommittee = async (e) => {
    e.preventDefault();
    if(!selectedMemberId || !committeeTitle) return alert("Select member and provide title");
    try {
      await api.post('/api/committee', { 
        memberId: selectedMemberId, 
        title: committeeTitle,
        order: committee.length 
      });
      setCommitteeTitle(''); setSelectedMemberId(''); fetchAll();
    } catch (err) { alert("Error adding to committee"); }
  };

  const removeFromCommittee = async (id) => {
    if(window.confirm("Remove from committee?")) {
      await api.delete(`/api/committee/${id}`); fetchAll();
    }
  };

  const moveItem = async (index, direction) => {
    const newItems = [...committee];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;
    [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
    setCommittee(newItems);
    try {
        const orderData = newItems.map((item, idx) => ({ id: item._id, order: idx }));
        await api.patch('/api/committee/reorder', { orders: orderData });
    } catch (err) { console.error("Failed to save new order"); }
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
        <div style={activeTab === 'members' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('members')}>👥 Members List</div>
        <div style={activeTab === 'committee' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('committee')}>🏛️ Committee</div>
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
                    <tr key={m._id}>
                      <td style={styles.td}>
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <img src={m.profilePic ? `${BACKEND_URL}${m.profilePic}` : defaultAvatar} style={{width:'35px', height:'35px', borderRadius:'50%', objectFit: 'cover'}} onError={(e) => e.target.src = defaultAvatar} />
                          <div><strong>{m.firstName} {m.lastName}</strong><br/><small>{m.email}</small></div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        {m.isApproved ? '✅ Approved' : '⏳ Pending'}
                        {m.isLifeMember ? ' ⭐' : ''}
                      </td>
                      <td style={styles.td}>
                        <button onClick={() => {setEditData(m); setNewPic(null);}} style={styles.btnAction}>Edit</button>
                        {m.isApproved ? (
                          <button onClick={() => action(m._id, 'revoke')} style={{...styles.btnAction, backgroundColor: '#6c757d'}}>Revoke</button>
                        ) : (
                          <button onClick={() => action(m._id, 'approve')} style={{...styles.btnAction, backgroundColor: '#28a745'}}>Approve</button>
                        )}
                        <button onClick={() => action(m._id, 'toggleLife')} style={styles.btnLife}>Life</button>
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
            <div style={{backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #eee'}}>
              <h3>Add New Committee Member</h3>
              <form onSubmit={addToCommittee} style={{display: 'flex', gap: '15px'}}>
                <select style={{...styles.inputS, flex: 2}} value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}>
                  <option value="">Select an Approved Member...</option>
                  {members.filter(m => m.isApproved).map(m => (
                    <option key={m._id} value={m._id}>{m.firstName} {m.lastName} ({m.yearOfGraduation})</option>
                  ))}
                </select>
                <input placeholder="Position" value={committeeTitle} onChange={e => setCommitteeTitle(e.target.value)} style={{...styles.inputS, flex: 1}} />
                <button type="submit" style={styles.btnBlue}>Add to Team</button>
              </form>
            </div>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr><th style={styles.th}>Order</th><th style={styles.th}>Name</th><th style={styles.th}>Position</th><th style={styles.th}>Actions</th></tr>
                </thead>
                <tbody>
                  {committee.map((c, index) => (
                    <tr key={c._id}>
                      <td style={styles.td}>
                        <button onClick={() => moveItem(index, 'up')} disabled={index === 0} style={styles.btnOrder}>▲</button>
                        <button onClick={() => moveItem(index, 'down')} disabled={index === committee.length - 1} style={styles.btnOrder}>▼</button>
                      </td>
                      <td style={styles.td}>{c.member?.firstName} {c.member?.lastName}</td>
                      <td style={styles.td}><strong>{c.title}</strong></td>
                      <td style={styles.td}><button onClick={() => removeFromCommittee(c._id)} style={styles.btnDelete}>Remove</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* --- EXPANDED EDIT MODAL --- */}
      {editData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 style={{margin: 0}}>Edit Profile: {editData.firstName} {editData.lastName}</h2>
              <button onClick={() => setEditData(null)} style={{cursor:'pointer', border:'none', background:'none', fontSize:'24px'}}>✕</button>
            </div>
            
            <div style={styles.modalScroll}>
              
              {/* PHOTO SECTION */}
              <h4 style={styles.secTitle}>Profile Picture</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <img src={newPic ? URL.createObjectURL(newPic) : (editData.profilePic ? `${BACKEND_URL}${editData.profilePic}` : defaultAvatar)} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #003366' }} onError={(e) => e.target.src = defaultAvatar}/>
                <div>
                  <input type="file" onChange={(e) => setNewPic(e.target.files[0])} style={{display:'block', marginBottom:'5px'}} />
                  <button onClick={() => {setEditData({...editData, profilePic: ""}); setNewPic(null);}} style={{fontSize:'11px', color:'red', cursor:'pointer', border:'none', background:'none', padding:0}}>Remove Photo</button>
                </div>
              </div>

              {/* PERSONAL DETAILS */}
              <h4 style={styles.secTitle}>Personal Details</h4>
              <div style={styles.grid2}>
                <div><label style={styles.label}>First Name</label><input value={editData.firstName || ''} onChange={e => setEditData({...editData, firstName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Last Name</label><input value={editData.lastName || ''} onChange={e => setEditData({...editData, lastName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Email</label><input type="email" value={editData.email || ''} onChange={e => setEditData({...editData, email: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Mobile</label><input value={editData.mobile || ''} onChange={e => setEditData({...editData, mobile: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Date of Birth</label><input type="date" value={editData.birthdate?.split('T')[0] || ''} onChange={e => setEditData({...editData, birthdate: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Sex</label>
                    <select value={editData.sex || ''} onChange={e => setEditData({...editData, sex: e.target.value})} style={styles.inputS}>
                        <option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                </div>
                <div><label style={styles.label}>Marital Status</label>
                  <select value={editData.maritalStatus || ''} onChange={e => setEditData({...editData, maritalStatus: e.target.value})} style={styles.inputS}>
                    <option value="Single">Single</option><option value="Married">Married</option><option value="Divorced">Divorced</option><option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              {/* ACADEMIC DETAILS */}
              <h4 style={styles.secTitle}>IIT KGP Academic Details</h4>
              <div style={styles.grid2}>
                <div><label style={styles.label}>Batch Year</label><input type="number" value={editData.yearOfGraduation || ''} onChange={e => setEditData({...editData, yearOfGraduation: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Degree</label><input value={editData.degree || ''} onChange={e => setEditData({...editData, degree: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Department</label><input value={editData.department || ''} onChange={e => setEditData({...editData, department: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Hall</label><input value={editData.hall || ''} onChange={e => setEditData({...editData, hall: e.target.value})} style={styles.inputS}/></div>
              </div>

              {/* PROFESSIONAL & ADDRESS */}
              <h4 style={styles.secTitle}>Professional & Location</h4>
              <div style={styles.grid2}>
                <div style={{gridColumn: 'span 2'}}><label style={styles.label}>Current Occupation / Designation</label><input value={editData.currentOccupation || ''} onChange={e => setEditData({...editData, currentOccupation: e.target.value})} style={styles.inputS}/></div>
                <div style={{gridColumn: 'span 2'}}><label style={styles.label}>Residence Address</label><textarea value={editData.residenceAddress || ''} onChange={e => setEditData({...editData, residenceAddress: e.target.value})} style={{...styles.inputS, height: '60px'}}/></div>
                <div style={{gridColumn: 'span 2'}}><label style={styles.label}>Office Address</label><textarea value={editData.officeAddress || ''} onChange={e => setEditData({...editData, officeAddress: e.target.value})} style={{...styles.inputS, height: '60px'}}/></div>
              </div>

              {/* FAMILY DETAILS */}
              <h4 style={styles.secTitle}>Family Details</h4>
              <div style={styles.grid2}>
                <div><label style={styles.label}>Spouse First Name</label><input value={editData.spouseFirstName || ''} onChange={e => setEditData({...editData, spouseFirstName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Spouse Last Name</label><input value={editData.spouseLastName || ''} onChange={e => setEditData({...editData, spouseLastName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Anniversary Date</label><input type="date" value={editData.anniversaryDate?.split('T')[0] || ''} onChange={e => setEditData({...editData, anniversaryDate: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>No. of Children</label><input type="number" value={editData.numberOfChildren || 0} onChange={e => setEditData({...editData, numberOfChildren: e.target.value})} style={styles.inputS}/></div>
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
  sidebar: { width: '220px', backgroundColor: '#001f3f', color: 'white', padding: '20px', position: 'fixed', height: '100vh' },
  sidebarItem: { padding: '12px', cursor: 'pointer', borderRadius: '5px' },
  sidebarActive: { padding: '12px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#003366', fontWeight: 'bold' },
  logoutBtn: { marginTop: '40px', color: '#ff4d4d', cursor: 'pointer', padding: '12px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  searchBar: { padding: '10px', width: '250px', borderRadius: '5px', border: '1px solid #ddd' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8f9fa' },
  th: { padding: '15px', textAlign: 'left' },
  td: { padding: '15px', borderBottom: '1px solid #eee' },
  btnAction: { backgroundColor:'#17a2b8', color:'white', border:'none', padding: '6px 10px', borderRadius:'4px', cursor: 'pointer', marginRight: '5px' },
  btnLife: { backgroundColor: '#ffcc00', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', marginRight: '5px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer' },
  btnOrder: { cursor: 'pointer', background: '#eee', border: '1px solid #ccc', marginRight: '4px', borderRadius: '3px', padding: '2px 6px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', width: '850px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  modalScroll: { overflowY: 'auto', paddingRight: '15px' },
  secTitle: { borderBottom: '1px solid #eee', color: '#003366', fontWeight: 'bold', marginTop: '20px', paddingBottom: '5px' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '10px' },
  label: { fontSize: '11px', fontWeight: 'bold', color: '#666', marginBottom: '5px', display: 'block' },
  inputS: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px', boxSizing: 'border-box' },
  modalFooter: { marginTop: '20px', textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '15px' },
  btnSave: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  btnCancel: { padding: '10px 20px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '5px', marginRight: '10px' },
  loginCenter: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f3f' },
  loginBox: { backgroundColor: 'white', padding: '50px', borderRadius: '15px', textAlign: 'center' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default AdminPanel;
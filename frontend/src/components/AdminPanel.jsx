import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [newPic, setNewPic] = useState(null); // State for new profile pic file

  const fetchAll = () => axios.get('/api/alumni/all').then(res => setMembers(res.data));

  const login = (e) => { 
    e.preventDefault(); 
    if(pass === 'Loki12345') { setAuth(true); fetchAll(); } 
    else alert('Wrong Password'); 
  };

  const action = (id, act) => axios.patch(`/api/alumni/status/${id}?action=${act}`).then(fetchAll);
  
  const del = (id) => window.confirm("Delete permanently?") && axios.delete(`/api/alumni/${id}`).then(fetchAll);
  
  const saveFullEdit = async () => {
    try {
      const formData = new FormData();
      
      // Append all text fields from editData to FormData
      Object.keys(editData).forEach(key => {
        // Don't append the old profilePic string if we have a new file
        if (key !== 'profilePic') {
            formData.append(key, editData[key]);
        }
      });

      // Append new picture if selected
      if (newPic) {
        formData.append('profilePic', newPic);
      }

      await axios.put(`/api/alumni/${editData._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setEditData(null);
      setNewPic(null);
      fetchAll();
      alert("Details Updated Successfully!");
    } catch (err) { 
      console.error(err);
      alert("Update failed"); 
    }
  };

  const filtered = members.filter(m => `${m.firstName} ${m.lastName} ${m.email}`.toLowerCase().includes(search.toLowerCase()));

  if (!auth) return (
    <div style={styles.loginCenter}>
      <form onSubmit={login} style={styles.loginBox}>
        <h2>Admin Dashboard</h2>
        <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} style={styles.inputS} />
        <button type="submit" style={styles.btnBlue}>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h3>IIT KGP Admin</h3>
        <p style={styles.sidebarActive}>👥 Members List</p>
        <p onClick={() => setAuth(false)} style={styles.logoutBtn}>Logout</p>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: '30px', marginLeft: '220px' }}>
        <div style={styles.headerRow}>
          <h1>Member Management</h1>
          <input placeholder="Search members..." onChange={(e) => setSearch(e.target.value)} style={styles.searchBar} />
        </div>

        <div style={styles.tableCard}>
          <table style={styles.table}>
            <thead style={styles.thead}>
              <tr><th style={styles.th}>Name</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m._id} style={styles.tr}>
                  <td style={styles.td}><strong>{m.firstName} {m.lastName}</strong><br/><small>{m.email}</small></td>
                  <td style={styles.td}>
                    {m.isApproved ? '✅ Approved' : '⏳ Pending'}<br/>
                    {m.isLifeMember ? '⭐ Life Member' : 'Regular'}
                  </td>
                  <td style={styles.td}>
                    <button onClick={() => {setEditData(m); setNewPic(null);}} style={styles.btnAction}>Edit All</button>
                    {!m.isApproved && <button onClick={() => action(m._id, 'approve')} style={styles.btnApprove}>Approve</button>}
                    <button onClick={() => action(m._id, 'toggleLife')} style={styles.btnLife}>{m.isLifeMember ? 'Untag' : 'Tag Life'}</button>
                    <button onClick={() => del(m._id)} style={styles.btnDelete}>Del</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- COMPREHENSIVE EDIT MODAL --- */}
      {editData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{margin:0}}>Edit Full Profile</h2>
              <button onClick={() => setEditData(null)} style={{cursor:'pointer', border:'none', background:'none', fontSize:'20px'}}>✕</button>
            </div>

            <div style={styles.modalScroll}>
              {/* Profile Picture Section */}
              <h4 style={styles.secTitle}>Profile Picture</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <img 
                    src={newPic ? URL.createObjectURL(newPic) : `http://localhost:5000${editData.profilePic}`} 
                    alt="Profile" 
                    style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #003366' }}
                />
                <div>
                    <label style={styles.label}>Change Photo</label>
                    <input type="file" accept="image/*" onChange={(e) => setNewPic(e.target.files[0])} />
                </div>
              </div>

              {/* Section: Personal */}
              <h4 style={styles.secTitle}>Personal Details</h4>
              <div style={styles.grid2}>
                <div><label style={styles.label}>First Name</label><input value={editData.firstName} onChange={e => setEditData({...editData, firstName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Last Name</label><input value={editData.lastName} onChange={e => setEditData({...editData, lastName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Email</label><input value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Mobile</label><input value={editData.mobile} onChange={e => setEditData({...editData, mobile: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Birthdate</label><input type="date" value={editData.birthdate?.split('T')[0] || ''} onChange={e => setEditData({...editData, birthdate: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Sex</label><select value={editData.sex} onChange={e => setEditData({...editData, sex: e.target.value})} style={styles.inputS}><option value="Male">Male</option><option value="Female">Female</option></select></div>
              </div>

              {/* Section: Academic */}
              <h4 style={styles.secTitle}>Academic Details (IIT KGP)</h4>
              <div style={styles.grid2}>
                <div><label style={styles.label}>Batch (Year)</label><input value={editData.yearOfGraduation} onChange={e => setEditData({...editData, yearOfGraduation: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Degree</label><input value={editData.degree} onChange={e => setEditData({...editData, degree: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Department</label><input value={editData.department} onChange={e => setEditData({...editData, department: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Hall</label><input value={editData.hall} onChange={e => setEditData({...editData, hall: e.target.value})} style={styles.inputS}/></div>
              </div>

              {/* Section: Professional */}
              <h4 style={styles.secTitle}>Professional & Address</h4>
              <div><label style={styles.label}>Current Occupation</label><input value={editData.currentOccupation} onChange={e => setEditData({...editData, currentOccupation: e.target.value})} style={styles.inputS}/></div>
              <div><label style={styles.label}>Residence Address</label><textarea value={editData.residenceAddress} onChange={e => setEditData({...editData, residenceAddress: e.target.value})} style={{...styles.inputS, height:'50px'}}/></div>
              <div><label style={styles.label}>Office Address</label><textarea value={editData.officeAddress} onChange={e => setEditData({...editData, officeAddress: e.target.value})} style={{...styles.inputS, height:'50px'}}/></div>

              {/* Section: Family */}
              <h4 style={styles.secTitle}>Family & Kids</h4>
              <div style={styles.grid2}>
                <div><label style={styles.label}>Spouse First Name</label><input value={editData.spouseFirstName || ''} onChange={e => setEditData({...editData, spouseFirstName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Spouse Last Name</label><input value={editData.spouseLastName || ''} onChange={e => setEditData({...editData, spouseLastName: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Anniversary</label><input type="date" value={editData.anniversaryDate?.split('T')[0] || ''} onChange={e => setEditData({...editData, anniversaryDate: e.target.value})} style={styles.inputS}/></div>
                <div><label style={styles.label}>Number of Kids</label><input type="number" value={editData.numberOfChildren || 0} onChange={e => setEditData({...editData, numberOfChildren: e.target.value})} style={styles.inputS}/></div>
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
  sidebarActive: { backgroundColor: '#003366', padding: '12px', borderRadius: '5px', cursor: 'pointer' },
  logoutBtn: { marginTop: '40px', color: '#ff4d4d', cursor: 'pointer', padding: '12px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  searchBar: { padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ddd' },
  tableCard: { backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#eee', textAlign: 'left' },
  th: { padding: '15px' },
  td: { padding: '15px', borderBottom: '1px solid #eee' },
  btnAction: { padding: '6px 12px', marginRight: '5px', cursor: 'pointer' },
  btnApprove: { backgroundColor: 'green', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  btnLife: { backgroundColor: '#ffcc00', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', margin: '0 5px' },
  btnDelete: { backgroundColor: 'red', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '25px', borderRadius: '12px', width: '800px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' },
  modalScroll: { overflowY: 'auto', paddingRight: '10px' },
  secTitle: { borderBottom: '1px solid #eee', paddingBottom: '5px', marginTop: '20px', color: '#003366' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  label: { fontSize: '11px', fontWeight: 'bold', display: 'block', marginBottom: '3px' },
  inputS: { width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' },
  modalFooter: { marginTop: '20px', textAlign: 'right', borderTop: '1px solid #eee', paddingTop: '15px' },
  btnSave: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  btnCancel: { padding: '10px 20px', marginRight: '10px', cursor: 'pointer', border: '1px solid #ddd', borderRadius: '5px' },
  loginCenter: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f3f' },
  loginBox: { backgroundColor: 'white', padding: '40px', borderRadius: '10px', textAlign: 'center' }
};

export default AdminPanel;
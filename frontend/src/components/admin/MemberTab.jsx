import React, { useState } from 'react';
import api, { BACKEND_URL } from '../../api';

const MemberTab = ({ members, refresh }) => {
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [newProfilePic, setNewProfilePic] = useState(null);
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  const renderDate = (dateStr) => {
    const date = new Date(dateStr);
    if (!dateStr || isNaN(date.getTime())) return null;
    return date.toLocaleDateString();
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  const memberAction = async (id, act) => {
    try {
      await api.patch(`/api/alumni/status/${id}?action=${act}`);
      await refresh(); 
    } catch (err) {
      alert("Action failed");
    }
  };

  const deleteMember = async (id, name) => {
    const isConfirmed = window.confirm(`Are you absolutely sure you want to permanently delete ${name}? This action cannot be undone.`);
    if (isConfirmed) {
      try {
        await api.delete(`/api/alumni/${id}`);
        await refresh();
        alert(`${name} has been deleted.`);
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Failed to delete member. Check console for details.");
      }
    }
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      if (newProfilePic) {
        const formData = new FormData();
        Object.keys(editData).forEach(key => {
          if (!['_id', '__v', 'createdAt', 'updatedAt', 'profilePic'].includes(key) && editData[key] !== null && editData[key] !== undefined) {
            formData.append(key, String(editData[key])); 
          }
        });
        
        formData.append('profilePic', newProfilePic);

        const response = await fetch(`${BACKEND_URL}/api/alumni/${editData._id}`, {
          method: 'PUT',
          body: formData, 
        });

        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(`Server rejected the file: ${errorMessage}`);
        }
        
      } else {
        const payload = { ...editData };
        delete payload._id; delete payload.__v; delete payload.createdAt; delete payload.updatedAt;
        await api.put(`/api/alumni/${editData._id}`, payload);
      }

      closeModal();
      await refresh();
      alert("Member updated successfully");
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Update failed! Right-click > Inspect > click 'Console' to see the exact error.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setEditData(null);
    setNewProfilePic(null);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Member Administration</h2>
        <input 
          placeholder="🔍 Search members..." 
          onChange={e => setSearch(e.target.value)} 
          style={styles.searchBar} 
        />
      </div>
      
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Profile</th>
              <th style={styles.th}>Details</th>
              <th style={styles.th}>Timeline</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members
              .filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase()))
              .map(m => (
                <tr key={m._id}>
                  <td style={styles.td}>
                    <img 
                      src={m.profilePic ? `${BACKEND_URL}${m.profilePic}` : defaultAvatar} 
                      style={styles.tableAvatar} 
                      alt="" 
                    />
                  </td>
                  <td style={styles.td}>
                    <div style={styles.nameText}>{m.firstName} {m.lastName} {m.isLifeMember && '⭐'}</div>
                    <div style={styles.subText}>{m.email} | Batch: {m.yearOfGraduation}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.dateLabel}>Reg: {renderDate(m.createdAt) || 'N/A'}</div>
                    {m.isApproved && (
                        <div style={{...styles.dateLabel, color: '#16a34a', fontWeight: 'bold'}}>
                            App: {renderDate(m.updatedAt) || renderDate(m.createdAt) || 'Approved'}
                        </div>
                    )}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actionGroup}>
                      <button onClick={() => setEditData(m)} style={styles.btnEdit}>Edit</button>
                      
                      <button 
                        onClick={() => memberAction(m._id, m.isApproved ? 'revoke' : 'approve')} 
                        style={{ 
                          ...styles.btnStatus, 
                          backgroundColor: m.isApproved ? '#d97706' : '#16a34a', 
                          color: 'white' 
                        }}
                      >
                        {m.isApproved ? 'Revoke' : 'Approve'}
                      </button>
                      
                      <button 
                        onClick={() => memberAction(m._id, 'toggleLife')} 
                        style={{...styles.btnLife, background: m.isLifeMember ? '#fbbf24' : '#fff'}}
                      >
                        {m.isLifeMember ? 'Life Member' : 'Set Life'}
                      </button>

                      <button 
                        onClick={() => deleteMember(m._id, `${m.firstName} ${m.lastName}`)} 
                        style={styles.btnDelete}
                        title="Delete Member Permanently"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editData && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={{margin:0}}>Full Member Edit</h3>
              <button onClick={closeModal} style={styles.closeX}>&times;</button>
            </div>
            <div style={styles.modalBody}>
              
              <h4 style={styles.sectionTitle}>Profile Picture</h4>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px' }}>
                <img 
                  src={editData.profilePic ? `${BACKEND_URL}${editData.profilePic}` : defaultAvatar} 
                  alt="Current Profile" 
                  style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #eee' }} 
                />
                <div style={styles.field}>
                  <label style={styles.label}>Upload New Picture (Optional)</label>
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={e => setNewProfilePic(e.target.files[0])} 
                    style={{ ...styles.input, padding: '5px' }} 
                  />
                </div>
              </div>

              <h4 style={styles.sectionTitle}>1. Personal Identity</h4>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>First Name</label><input value={editData.firstName || ''} onChange={e => setEditData({...editData, firstName: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Last Name</label><input value={editData.lastName || ''} onChange={e => setEditData({...editData, lastName: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Email</label><input value={editData.email || ''} onChange={e => setEditData({...editData, email: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Mobile</label><input value={editData.mobile || ''} onChange={e => setEditData({...editData, mobile: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>DOB</label><input type="date" value={formatDateForInput(editData.birthdate)} onChange={e => setEditData({...editData, birthdate: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Life Member No.</label><input value={editData.lifeMemberNumber || ''} onChange={e => setEditData({...editData, lifeMemberNumber: e.target.value})} style={styles.input} /></div>
              </div>

              <h4 style={styles.sectionTitle}>2. Academic Details</h4>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>Batch</label><input type="number" value={editData.yearOfGraduation || ''} onChange={e => setEditData({...editData, yearOfGraduation: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Hall</label><input value={editData.hall || ''} onChange={e => setEditData({...editData, hall: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Degree</label><input value={editData.degree || ''} onChange={e => setEditData({...editData, degree: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Dept</label><input value={editData.department || ''} onChange={e => setEditData({...editData, department: e.target.value})} style={styles.input} /></div>
              </div>

              <h4 style={styles.sectionTitle}>3. Professional & Address</h4>
              <div style={styles.field}><label style={styles.label}>Occupation</label><input value={editData.currentOccupation || ''} onChange={e => setEditData({...editData, currentOccupation: e.target.value})} style={styles.input} /></div>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>Residence</label><textarea value={editData.residenceAddress || ''} onChange={e => setEditData({...editData, residenceAddress: e.target.value})} style={{...styles.input, height:'50px'}} /></div>
                <div style={styles.field}><label style={styles.label}>Office</label><textarea value={editData.officeAddress || ''} onChange={e => setEditData({...editData, officeAddress: e.target.value})} style={{...styles.input, height:'50px'}} /></div>
              </div>

              <h4 style={styles.sectionTitle}>4. Family Details</h4>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>Spouse Name</label><input value={editData.spouseFirstName || ''} onChange={e => setEditData({...editData, spouseFirstName: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Anniversary</label><input type="date" value={formatDateForInput(editData.anniversaryDate)} onChange={e => setEditData({...editData, anniversaryDate: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Children</label><input type="number" value={editData.numberOfChildren || 0} onChange={e => setEditData({...editData, numberOfChildren: e.target.value})} style={styles.input} /></div>
              </div>
            </div>
            
            {/* --- NEW: UPDATED MODAL FOOTER WITH CANCEL BUTTON --- */}
            <div style={styles.modalFooter}>
                <button onClick={closeModal} style={styles.btnCancel}>Discard Changes</button>
                <button onClick={saveEdit} disabled={loading} style={styles.btnSave}>
                  {loading ? 'Saving...' : 'Save Member Data'}
                </button>
            </div>
            {/* ---------------------------------------------------- */}

          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { width: '100%', padding: '10px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#001f3f' },
  searchBar: { padding: '10px', borderRadius: '20px', border: '1px solid #ddd', width: '250px' },
  tableCard: { background: '#fff', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px', textAlign: 'left', background: '#f8f9fa', fontSize: '0.75rem', textTransform: 'uppercase' },
  td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '0.85rem', verticalAlign: 'middle' },
  tableAvatar: { width: '45px', height: '45px', borderRadius: '8px', objectFit: 'cover' },
  nameText: { fontWeight: 'bold' },
  subText: { fontSize: '0.75rem', color: '#777' },
  dateLabel: { fontSize: '0.7rem', color: '#999' },
  actionGroup: { display: 'flex', gap: '8px' },
  btnEdit: { padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#f0f0f0', cursor: 'pointer', fontWeight: 'bold' },
  btnStatus: { padding: '6px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', minWidth: '85px', fontWeight: 'bold' },
  btnLife: { padding: '6px 12px', borderRadius: '6px', border: '1px solid #fbbf24', cursor: 'pointer', fontWeight: 'bold' },
  btnDelete: { padding: '6px 12px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold', minWidth: '85px' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modal: { background: '#fff', width: '750px', maxHeight: '95vh', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection:'column' },
  modalHeader: { padding: '15px 25px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' },
  closeX: { border: 'none', background: 'none', fontSize: '1.5rem', cursor: 'pointer' },
  modalBody: { padding: '20px 30px', overflowY: 'auto' },
  sectionTitle: { color: '#001f3f', borderBottom: '2px solid #fbbf24', paddingBottom: '3px', marginBottom: '12px', marginTop: '15px', fontSize: '0.9rem', fontWeight: 'bold' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  label: { fontSize: '0.65rem', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', marginBottom: '4px', display: 'block' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.85rem', boxSizing: 'border-box' },
  field: { display: 'flex', flexDirection: 'column' },
  
  // --- UPDATED STYLES FOR THE FOOTER AND BUTTONS ---
  modalFooter: { padding: '15px 25px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  btnSave: { padding: '10px 20px', background: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  btnCancel: { padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default MemberTab;
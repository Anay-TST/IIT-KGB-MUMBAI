import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../../api';

const MemberTab = ({ members, refresh }) => {
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({ degrees: [], departments: [], halls: [], maritalStatuses: [], genders: [] });
  const [newProfilePic, setNewProfilePic] = useState(null);
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await api.get('/api/config');
        setOptions({
          degrees: data.degrees || [],
          departments: data.departments || [],
          halls: data.halls || [],
          maritalStatuses: data.maritalStatuses || [],
          genders: data.genders || ['Male', 'Female', 'Other']
        });
      } catch (err) { console.error("Config load error", err); }
    };
    fetchConfig();
  }, []);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? '' : date.toISOString().split('T')[0];
  };

  const memberAction = async (id, act) => {
    try {
      await api.patch(`/api/alumni/status/${id}?action=${act}`);
      await refresh(); 
    } catch (err) { alert("Action failed"); }
  };

  const deleteMember = async (id, name) => {
    if (window.confirm(`Permanently delete ${name}? This cannot be undone.`)) {
      try {
        await api.delete(`/api/alumni/${id}`);
        await refresh();
      } catch (err) { alert("Delete failed"); }
    }
  };

  const handleCloseModal = () => {
    setEditData(null);
    setNewProfilePic(null);
  };

  const saveEdit = async () => {
    setLoading(true);
    try {
      const payload = { ...editData };
      delete payload._id; delete payload.__v; delete payload.createdAt; delete payload.updatedAt;

      const formData = new FormData();
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined) formData.append(key, payload[key]);
      });
      if (newProfilePic) formData.append('profilePic', newProfilePic);

      await api.put(`/api/alumni/${editData._id}`, formData);
      handleCloseModal();
      await refresh();
      alert("Updated successfully");
    } catch (err) { alert("Update failed"); }
    finally { setLoading(false); }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Member Administration</h2>
        <input placeholder="🔍 Search names..." onChange={e => setSearch(e.target.value)} style={styles.searchBar} />
      </div>
      
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Profile</th>
              <th style={styles.th}>Name & Email</th>
              <th style={styles.th}>Membership</th>
              <th style={styles.th}>Admin Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())).map(m => (
              <tr key={m._id}>
                <td style={styles.td}><img src={m.profilePic ? `${BACKEND_URL}${m.profilePic}` : defaultAvatar} style={styles.tableAvatar} alt="" /></td>
                <td style={styles.td}>
                  <div style={styles.nameText}>{m.firstName} {m.lastName} {m.isLifeMember && '⭐'}</div>
                  <div style={styles.subText}>{m.email}</div>
                </td>
                <td style={styles.td}>
                   <div style={{fontWeight:'bold', color: m.isApproved ? '#16a34a' : '#dc2626'}}>
                     {m.isApproved ? 'Approved' : 'Pending'}
                   </div>
                   <div style={styles.subText}>{m.isLifeMember ? `LM: ${m.lifeMemberNumber || 'Verified'}` : 'Regular Member'}</div>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button onClick={() => setEditData(m)} style={styles.btnEdit}>Edit</button>
                    <button 
                      onClick={() => memberAction(m._id, m.isApproved ? 'revoke' : 'approve')} 
                      style={{ ...styles.btnStatus, backgroundColor: m.isApproved ? '#d97706' : '#16a34a' }}
                    >
                      {m.isApproved ? 'Revoke' : 'Approve'}
                    </button>
                    <button onClick={() => deleteMember(m._id, m.firstName)} style={styles.btnDelete}>Delete</button>
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
              <h3 style={{margin:0}}>Full Profile Edit: {editData.firstName}</h3>
              <button onClick={handleCloseModal} style={styles.closeX}>&times;</button>
            </div>
            <div style={styles.modalBody}>
              
              <h4 style={styles.sectionTitle}>1. Identity & Contact</h4>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>First Name</label><input value={editData.firstName || ''} onChange={e => setEditData({...editData, firstName: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Last Name</label><input value={editData.lastName || ''} onChange={e => setEditData({...editData, lastName: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Email</label><input value={editData.email || ''} onChange={e => setEditData({...editData, email: e.target.value})} style={styles.input} /></div>
                
                <div style={styles.field}>
                   <label style={styles.label}>Mobile (Code + Number)</label>
                   <div style={{display:'flex', gap:'8px'}}>
                     <input 
                       placeholder="+91" 
                       value={editData.countryCode || ''} 
                       onChange={e => setEditData({...editData, countryCode: e.target.value})} 
                       style={{...styles.input, width:'80px', flex:'none'}} 
                     />
                     <input 
                       placeholder="Mobile Number" 
                       value={editData.mobile || ''} 
                       onChange={e => setEditData({...editData, mobile: e.target.value})} 
                       style={{...styles.input, flex:1}} 
                     />
                   </div>
                </div>

                <div style={styles.field}><label style={styles.label}>Birthdate</label><input type="date" value={formatDateForInput(editData.birthdate)} onChange={e => setEditData({...editData, birthdate: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Sex</label><select value={editData.sex || ''} onChange={e => setEditData({...editData, sex: e.target.value})} style={styles.input}><option value="">Select...</option>{options.genders.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                <div style={styles.field}><label style={styles.label}>Marital Status</label><select value={editData.maritalStatus || ''} onChange={e => setEditData({...editData, maritalStatus: e.target.value})} style={styles.input}><option value="">Select...</option>{options.maritalStatuses.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                <div style={styles.field}><label style={styles.label}>Referred By</label><input value={editData.referredBy || ''} onChange={e => setEditData({...editData, referredBy: e.target.value})} style={styles.input} /></div>
              </div>

              <h4 style={styles.sectionTitle}>2. Academic & Profession</h4>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>Degree</label><select value={editData.degree || ''} onChange={e => setEditData({...editData, degree: e.target.value})} style={styles.input}><option value="">Select...</option>{options.degrees.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                <div style={styles.field}><label style={styles.label}>Department</label><select value={editData.department || ''} onChange={e => setEditData({...editData, department: e.target.value})} style={styles.input}><option value="">Select...</option>{options.departments.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                <div style={styles.field}><label style={styles.label}>Hall</label><select value={editData.hall || ''} onChange={e => setEditData({...editData, hall: e.target.value})} style={styles.input}><option value="">Select...</option>{options.halls.map(o => <option key={o} value={o}>{o}</option>)}</select></div>
                <div style={styles.field}><label style={styles.label}>Batch (Year)</label><input type="number" value={editData.yearOfGraduation || ''} onChange={e => setEditData({...editData, yearOfGraduation: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Current Occupation</label><input value={editData.currentOccupation || ''} onChange={e => setEditData({...editData, currentOccupation: e.target.value})} style={styles.input} /></div>
              </div>

              <h4 style={styles.sectionTitle}>3. Addresses</h4>
              <div style={styles.formGrid}>
                <div style={{...styles.field, gridColumn:'span 2'}}><label style={styles.label}>Residence Address</label><textarea value={editData.residenceAddress || ''} onChange={e => setEditData({...editData, residenceAddress: e.target.value})} style={{...styles.input, height:'45px'}} /></div>
                <div style={{...styles.field, gridColumn:'span 2'}}><label style={styles.label}>Office Address</label><textarea value={editData.officeAddress || ''} onChange={e => setEditData({...editData, officeAddress: e.target.value})} style={{...styles.input, height:'45px'}} /></div>
              </div>

              <h4 style={styles.sectionTitle}>4. Family Details</h4>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>Spouse First Name</label><input value={editData.spouseFirstName || ''} onChange={e => setEditData({...editData, spouseFirstName: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Spouse Last Name</label><input value={editData.spouseLastName || ''} onChange={e => setEditData({...editData, spouseLastName: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Spouse Birthdate</label><input type="date" value={formatDateForInput(editData.spouseBirthdate)} onChange={e => setEditData({...editData, spouseBirthdate: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>Anniversary Date</label><input type="date" value={formatDateForInput(editData.anniversaryDate)} onChange={e => setEditData({...editData, anniversaryDate: e.target.value})} style={styles.input} /></div>
                <div style={styles.field}><label style={styles.label}>No. of Children</label><input type="number" value={editData.numberOfChildren || 0} onChange={e => setEditData({...editData, numberOfChildren: e.target.value})} style={styles.input} /></div>
              </div>

              <h4 style={styles.sectionTitle}>5. Membership & Image</h4>
              <div style={styles.formGrid}>
                <div style={styles.field}><label style={styles.label}>Life Member No.</label><input value={editData.lifeMemberNumber || ''} onChange={e => setEditData({...editData, lifeMemberNumber: e.target.value})} style={styles.input} /></div>
                <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'25px'}}>
                   <input type="checkbox" style={{width:'18px', height:'18px'}} checked={editData.isLifeMember || false} onChange={e => setEditData({...editData, isLifeMember: e.target.checked})} />
                   <label style={{fontWeight:'bold', fontSize:'0.85rem'}}>Life Member</label>
                </div>
                
                {/* UPGRADED IMAGE UPLOAD UI */}
                <div style={{gridColumn:'span 2', background:'#f8fafc', padding:'15px', borderRadius:'12px', border:'1px solid #e2e8f0'}}>
                  <label style={styles.label}>Update Profile Photo</label>
                  <div style={{display:'flex', alignItems:'center', gap:'20px', marginTop:'10px'}}>
                     {newProfilePic ? (
                       <img src={URL.createObjectURL(newProfilePic)} alt="New Selection" style={{width:'60px', height:'60px', borderRadius:'50%', objectFit:'cover', border:'2px solid #cbd5e1'}} />
                     ) : editData.profilePic ? (
                       <img src={`${BACKEND_URL}${editData.profilePic}`} alt="Current" style={{width:'60px', height:'60px', borderRadius:'50%', objectFit:'cover', border:'2px solid #cbd5e1'}} />
                     ) : (
                       <div style={{width:'60px', height:'60px', borderRadius:'50%', backgroundColor:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:'0.7rem', textAlign:'center', border:'2px dashed #cbd5e1'}}>No Photo</div>
                     )}

                     <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
                       <label style={{
                          padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', 
                          borderRadius: '8px', color: '#001f3f', fontWeight: 'bold', fontSize: '0.85rem', 
                          cursor: 'pointer', textAlign: 'center', display: 'inline-block', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'
                       }}>
                          {editData.profilePic || newProfilePic ? 'Choose New File' : 'Select Profile Picture'}
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => setNewProfilePic(e.target.files[0])} 
                            style={{ display: 'none' }}
                          />
                       </label>
                       <span style={{fontSize:'0.75rem', color:'#64748b'}}>
                          {newProfilePic ? newProfilePic.name : (editData.profilePic ? 'Current photo saved' : 'No new file chosen')}
                       </span>
                     </div>
                  </div>
                </div>

              </div>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={handleCloseModal} style={styles.btnCancel}>Discard</button>
              <button onClick={saveEdit} disabled={loading} style={styles.btnSave}>{loading ? 'Saving...' : 'Save All Changes'}</button>
            </div>
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
  th: { padding: '12px', textAlign: 'left', background: '#f8f9fa', fontSize: '0.7rem', textTransform: 'uppercase', color:'#64748b' },
  td: { padding: '12px', borderBottom: '1px solid #eee', fontSize: '0.85rem', verticalAlign: 'middle' },
  tableAvatar: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border:'1px solid #ddd' },
  nameText: { fontWeight: 'bold', color:'#001f3f' },
  subText: { fontSize: '0.75rem', color: '#64748b' },
  actionGroup: { display: 'flex', gap: '6px' },
  btnEdit: { padding: '6px 10px', borderRadius: '6px', border: 'none', background: '#e2e8f0', color: '#001f3f', cursor: 'pointer', fontWeight: 'bold' },
  btnStatus: { padding: '6px 10px', borderRadius: '6px', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold', minWidth:'75px' },
  btnDelete: { padding: '6px 10px', borderRadius: '6px', border: 'none', background: '#fee2e2', color: '#dc2626', cursor: 'pointer', fontWeight: 'bold' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' },
  modal: { background: '#fff', width: '850px', maxHeight: '95vh', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection:'column', boxShadow:'0 20px 25px -5px rgba(0,0,0,0.1)' },
  modalHeader: { padding: '15px 25px', background:'#001f3f', color:'#fff', display: 'flex', justifyContent: 'space-between', alignItems:'center' },
  closeX: { border: 'none', background: 'none', fontSize: '1.8rem', cursor: 'pointer', color:'#fff' },
  modalBody: { padding: '20px 30px', overflowY: 'auto' },
  sectionTitle: { color: '#001f3f', borderBottom: '2px solid #fbbf24', paddingBottom: '4px', marginBottom: '15px', marginTop: '20px', fontSize: '1rem', fontWeight: 'bold' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  label: { fontSize: '0.7rem', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '4px', display: 'block' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', boxSizing: 'border-box', backgroundColor: '#fff' },
  field: { display: 'flex', flexDirection: 'column' },
  modalFooter: { padding: '15px 25px', borderTop: '1px solid #eee', display: 'flex', justifyContent: 'flex-end', gap: '12px', background:'#f8fafc' },
  btnSave: { padding: '12px 25px', background: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  btnCancel: { padding: '12px 25px', background: '#fff', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }
};

export default MemberTab;
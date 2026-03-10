import React, { useState } from 'react';
import api from '../../api';

// --- CONFIGURATION ARRAYS ---
const DEGREES = ["B.Tech", "B.Arch", "Dual Degree", "M.Tech", "M.Sc", "MBA", "Ph.D", "MS", "MCP", "MMST", "LLB", "LLM", "Other"];
const DEPARTMENTS = ["Aerospace Engineering", "Advanced Technology Centre", "Agricultural & Food Engineering", "Architecture & Regional Planning", "Biotechnology", "Centre for Theoretical Studies", "Chemical Engineering", "Chemistry", "Civil Engineering", "Computer Science & Engineering", "Cyrogenic Engineering", "Center for Educational Technology", "Energy Science and Engineering", "Energy Engineering", "Electrical Engineering", "Electronics & Electrical Communications Engineering", "Exploration Geophysics", "GS Sanyal School of Telecommunications (GS)", "GS Sanyal School of Telecommunications (TE)", "Geology & Geophysics", "Humanities & Social Sciences", "Industrial Engineering & Management", "Instrumentation Engineering", "School of Information Technology", "Material Science", "Mathematics", "Manufacturing Engineering", "Mechanical Engineering", "Medical Science & Technology", "Metallurgical Engineering", "Mining Engineering", "Ocean Engineering & Naval Architecture", "Ocean, Rivers, Atmosphere & Land Sciences", "Physics & Meteorology", "Quality Engineering Design and Manufacturing", "Rajendra Mishra School of Engineering Entrepreneurship", "Rajeev Gandhi School of Intellectual Property Law", "Ranbir and Chitra Gupta School of Infrastructure Design and Management", "Reliability Engineering", "Rubber Technology Center", "Rural Development Centre", "School of Water Resources", "Steel Technology Centre", "Statistics and Informatics", "Vinod Gupta School of Management", "Other"];
const HALLS = ["Ashutosh Mukherjee", "Azad", "Bhidan Chandra Roy", "Campus", "Dr. B R Ambedkar", "Gokhale", "Homi J Bhabha", "Jagadish Chandra Bose", "Lala Lajpat Rai", "Lalbahadur Sastry", "Madan Mohan Malaviya", "Meghnad Saha", "Mother Teresa", "Nehru", "Patel", "Radhakrishnan", "Rajendra Prasad", "Rani Laxmi Bai", "Sarojini Naidu / Indira Gandhi", "Vidyasagar", "Zakir Hussain", "Vikram Sarabhai Residential Complex", "Institute Quarter", "Bachelors Flat", "Rader Flats", "Other"];

// Master list of all 18 registration fields
const ALL_FIELDS = [
  'firstName', 'lastName', 'email', 'mobile', 'birthdate', 'sex', 
  'maritalStatus', 'yearOfGraduation', 'department', 'degree', 
  'hall', 'currentOccupation', 'residenceAddress', 'officeAddress', 
  'spouseFirstName', 'spouseLastName', 'anniversaryDate', 'numberOfChildren'
];

const AdminMembers = ({ members, fetchAll }) => {
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [newPic, setNewPic] = useState(null);

  const memberAction = (id, act) => api.patch(`/api/alumni/status/${id}?action=${act}`).then(fetchAll);
  const deleteMember = (id) => window.confirm("Are you sure you want to completely delete this member?") && api.delete(`/api/alumni/${id}`).then(fetchAll);

  const handleEditClick = (m) => {
    // This ensures even if a field is missing from DB, the input box still renders perfectly
    const defaultData = ALL_FIELDS.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {});
    setEditData({ ...defaultData, ...m });
  };

  const saveMemberEdit = async () => {
    try {
      const formData = new FormData();
      
      ALL_FIELDS.forEach(key => {
        let value = editData[key];
        
        if (key === 'birthdate' || key === 'anniversaryDate') {
            if (!value) return; 
            value = value.includes('T') ? value.split('T')[0] : value; 
        }

        if (key === 'numberOfChildren' || key === 'yearOfGraduation') {
            value = value === "" || isNaN(value) ? 0 : Number(value);
        }

        if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
        }
      });

      if (newPic) formData.append('profilePic', newPic);
      
      await api.put(`/api/alumni/${editData._id}`, formData);
      setEditData(null); 
      setNewPic(null); 
      fetchAll();
      alert("Member updated successfully!");
    } catch (err) { 
      console.error(err);
      alert("Update failed. Check your network or console."); 
    }
  };

  return (
    <>
      <h1>Member Management</h1>
      <input placeholder="Search by name, email, or batch..." onChange={(e) => setSearch(e.target.value)} style={styles.searchBar} />
      
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>Batch & Course</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.filter(m => 
              `${m.firstName} ${m.lastName} ${m.email} ${m.yearOfGraduation}`.toLowerCase().includes(search.toLowerCase())
            ).map(m => (
              <tr key={m._id}>
                <td style={styles.td}><strong>{m.firstName} {m.lastName}</strong></td>
                <td style={styles.td}>
                  <div style={{fontSize: '12px', color: '#555'}}>{m.email}</div>
                  <div style={{fontSize: '12px', color: '#555'}}>{m.mobile}</div>
                </td>
                <td style={styles.td}>
                  <div>{m.yearOfGraduation || 'N/A'}</div>
                  <div style={{fontSize: '12px', color: '#777'}}>{m.degree || ''} {m.department ? `(${m.department})` : ''}</div>
                </td>
                <td style={styles.td}>{m.isApproved ? '✅ Approved' : '⏳ Pending'} {m.isLifeMember ? '⭐ Life' : ''}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEditClick(m)} style={styles.btnAction}>Edit All</button>
                  <button onClick={() => memberAction(m._id, m.isApproved ? 'revoke' : 'approve')} style={{...styles.btnAction, backgroundColor: m.isApproved ? '#6c757d' : '#28a745'}}>{m.isApproved ? 'Revoke' : 'Approve'}</button>
                  <button onClick={() => deleteMember(m._id)} style={styles.btnDelete}>Del</button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr><td colSpan="5" style={{...styles.td, textAlign: 'center'}}>No members found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FULL MEMBER EDIT MODAL */}
      {editData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{marginTop: 0, color: '#003366'}}>Editing {editData.firstName} {editData.lastName}</h2>
            
            <div style={styles.modalScroll}>
               <label style={styles.label}>Profile Picture (Upload new to replace)</label>
               <input type="file" onChange={e => setNewPic(e.target.files[0])} style={styles.inputS} />

               <h4 style={styles.sectionHeader}>1. Personal Details</h4>
               <div style={styles.grid}>
                 <div><label style={styles.label}>First Name</label><input value={editData.firstName || ''} onChange={e => setEditData({...editData, firstName: e.target.value})} style={styles.inputS} /></div>
                 <div><label style={styles.label}>Last Name</label><input value={editData.lastName || ''} onChange={e => setEditData({...editData, lastName: e.target.value})} style={styles.inputS} /></div>
                 <div><label style={styles.label}>Email</label><input value={editData.email || ''} onChange={e => setEditData({...editData, email: e.target.value})} style={styles.inputS} /></div>
                 <div><label style={styles.label}>Mobile</label><input value={editData.mobile || ''} onChange={e => setEditData({...editData, mobile: e.target.value})} style={styles.inputS} /></div>
                 <div>
                    <label style={styles.label}>Date of Birth</label>
                    <input type="date" value={editData.birthdate ? editData.birthdate.split('T')[0] : ''} onChange={e => setEditData({...editData, birthdate: e.target.value})} style={styles.inputS} />
                 </div>
                 <div>
                   <label style={styles.label}>Sex</label>
                   <select value={editData.sex || ''} onChange={e => setEditData({...editData, sex: e.target.value})} style={styles.inputS}>
                     <option value="" disabled>Select</option>
                     <option value="Male">Male</option>
                     <option value="Female">Female</option>
                     <option value="Other">Other</option>
                   </select>
                 </div>
                 <div>
                   <label style={styles.label}>Marital Status</label>
                   <select value={editData.maritalStatus || 'Single'} onChange={e => setEditData({...editData, maritalStatus: e.target.value})} style={styles.inputS}>
                     <option value="Single">Single</option>
                     <option value="Married">Married</option>
                     <option value="Divorced">Divorced</option>
                     <option value="Separated">Separated</option>
                     <option value="Widowed">Widowed</option>
                   </select>
                 </div>
               </div>

               <h4 style={styles.sectionHeader}>2. Academic Details</h4>
               <div style={styles.grid}>
                 <div><label style={styles.label}>Batch Year (e.g. 2020)</label><input type="number" value={editData.yearOfGraduation || ''} onChange={e => setEditData({...editData, yearOfGraduation: e.target.value})} style={styles.inputS} /></div>
                 <div>
                   <label style={styles.label}>Degree</label>
                   <select value={editData.degree || ''} onChange={e => setEditData({...editData, degree: e.target.value})} style={styles.inputS}>
                     <option value="" disabled>Select Degree</option>
                     {DEGREES.map(deg => <option key={deg} value={deg}>{deg}</option>)}
                   </select>
                 </div>
                 <div>
                   <label style={styles.label}>Department</label>
                   <select value={editData.department || ''} onChange={e => setEditData({...editData, department: e.target.value})} style={styles.inputS}>
                     <option value="" disabled>Select Department</option>
                     {DEPARTMENTS.map(dep => <option key={dep} value={dep}>{dep}</option>)}
                   </select>
                 </div>
                 <div>
                   <label style={styles.label}>Hall of Residence</label>
                   <select value={editData.hall || ''} onChange={e => setEditData({...editData, hall: e.target.value})} style={styles.inputS}>
                     <option value="" disabled>Select Hall</option>
                     {HALLS.map(h => <option key={h} value={h}>{h}</option>)}
                   </select>
                 </div>
               </div>

               <h4 style={styles.sectionHeader}>3. Professional & Location</h4>
               <div><label style={styles.label}>Current Occupation / Designation</label><input value={editData.currentOccupation || ''} onChange={e => setEditData({...editData, currentOccupation: e.target.value})} style={styles.inputS} /></div>
               <div><label style={styles.label}>Residence Address</label><textarea value={editData.residenceAddress || ''} onChange={e => setEditData({...editData, residenceAddress: e.target.value})} style={{...styles.inputS, height: '60px'}} /></div>
               <div><label style={styles.label}>Office Address</label><textarea value={editData.officeAddress || ''} onChange={e => setEditData({...editData, officeAddress: e.target.value})} style={{...styles.inputS, height: '60px'}} /></div>

               {editData.maritalStatus === 'Married' && (
                 <>
                   <h4 style={styles.sectionHeader}>4. Spouse & Family Details</h4>
                   <div style={styles.grid}>
                     <div><label style={styles.label}>Spouse First Name</label><input value={editData.spouseFirstName || ''} onChange={e => setEditData({...editData, spouseFirstName: e.target.value})} style={styles.inputS} /></div>
                     <div><label style={styles.label}>Spouse Last Name</label><input value={editData.spouseLastName || ''} onChange={e => setEditData({...editData, spouseLastName: e.target.value})} style={styles.inputS} /></div>
                     <div>
                       <label style={styles.label}>Anniversary Date</label>
                       <input type="date" value={editData.anniversaryDate ? editData.anniversaryDate.split('T')[0] : ''} onChange={e => setEditData({...editData, anniversaryDate: e.target.value})} style={styles.inputS} />
                     </div>
                     <div><label style={styles.label}>Number of Children</label><input type="number" min="0" value={editData.numberOfChildren || 0} onChange={e => setEditData({...editData, numberOfChildren: e.target.value})} style={styles.inputS} /></div>
                   </div>
                 </>
               )}

            </div>
            
            {/* Action Buttons */}
            <div style={{marginTop:'20px', display: 'flex', gap: '10px', justifyContent: 'flex-end', borderTop: '1px solid #eee', paddingTop: '15px'}}>
              <button onClick={() => setEditData(null)} style={{padding: '10px 20px', border: '1px solid #ccc', backgroundColor: '#fff', borderRadius: '5px', cursor: 'pointer'}}>Cancel</button>
              <button onClick={saveMemberEdit} style={styles.btnBlue}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// ... Styles remain the same
const styles = {
  searchBar: { padding: '10px', width: '400px', borderRadius: '5px', border: '1px solid #ddd', marginBottom: '20px', fontSize: '14px' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' },
  td: { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px', verticalAlign: 'top' },
  btnAction: { backgroundColor:'#17a2b8', color:'white', border:'none', padding: '6px 12px', borderRadius:'4px', cursor: 'pointer', marginRight: '5px', fontSize: '13px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  inputS: { padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px', width: '100%', marginBottom: '15px', boxSizing: 'border-box', fontSize: '14px' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '650px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 25px rgba(0,0,0,0.2)' },
  modalScroll: { overflowY: 'auto', paddingRight: '15px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 15px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '5px' },
  sectionHeader: { color: '#003366', borderBottom: '2px solid #ffcc00', display: 'inline-block', paddingBottom: '3px', marginBottom: '15px', marginTop: '10px' }
};

export default AdminMembers;
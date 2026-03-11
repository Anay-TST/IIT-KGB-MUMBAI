import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../api'; 
import styles from './AdminStyles';
import { DEGREES, DEPARTMENTS, HALLS, ALL_FIELDS } from './AdminConfig';

const AdminMembers = ({ members, fetchAll }) => {
  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [newPic, setNewPic] = useState(null);

  const memberAction = (id, act) => api.patch(`/api/alumni/status/${id}?action=${act}`).then(fetchAll);
  const deleteMember = (id) => window.confirm("Delete member?") && api.delete(`/api/alumni/${id}`).then(fetchAll);

  const handleEditClick = (m) => {
    const defaultData = ALL_FIELDS.reduce((acc, curr) => ({ ...acc, [curr]: '' }), {});
    if(m.isLifeMember === undefined) m.isLifeMember = false;
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
        if (key === 'isLifeMember') {
            formData.append('isLifeMember', value ? 'true' : 'false');
            return;
        }
        if (value !== null && value !== undefined && value !== '') formData.append(key, value);
      });
      if (newPic) formData.append('profilePic', newPic);
      
      await api.put(`/api/alumni/${editData._id}`, formData);
      setEditData(null); setNewPic(null); fetchAll();
      alert("Updated successfully!");
    } catch (err) { alert("Update failed."); }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([ALL_FIELDS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Alumni_Import_Template.xlsx");
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; 
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });

        if (rawData.length === 0) {
          alert("The Excel file has no data rows! Please add data below the header row.");
          e.target.value = null;
          return;
        }

        const validData = rawData.map((row) => {
          const fName = row.firstName || row['First Name'] || row.firstname || '';
          const lName = row.lastName || row['Last Name'] || row.lastname || '';
          const mail = row.email || row['Email'] || '';

          return {
            firstName: String(fName).trim(),
            lastName: String(lName).trim(),
            email: String(mail).trim(),
            mobile: String(row.mobile || row.Mobile || '').trim(),
            birthdate: row.birthdate || undefined,
            sex: row.sex || undefined,
            maritalStatus: row.maritalStatus || 'Single',
            yearOfGraduation: parseInt(row.yearOfGraduation || row.Batch || row.batch, 10) || null,
            degree: row.degree || undefined,
            department: row.department || undefined,
            hall: row.hall || undefined,
            currentOccupation: row.currentOccupation || undefined,
            residenceAddress: row.residenceAddress || undefined,
            officeAddress: row.officeAddress || undefined,
            spouseFirstName: row.spouseFirstName || undefined,
            spouseLastName: row.spouseLastName || undefined,
            anniversaryDate: row.anniversaryDate || undefined,
            numberOfChildren: parseInt(row.numberOfChildren, 10) || 0,
            isLifeMember: String(row.isLifeMember).toLowerCase() === 'true',
            membershipNumber: row.membershipNumber || undefined,
            isApproved: true 
          };
        }).filter(m => m.firstName && m.lastName && m.email); 

        if (validData.length === 0) {
          alert("Could not find firstName, lastName, and email in any row. Ensure you are using the correct Template.");
          e.target.value = null;
          return;
        }

        alert(`Ready to import ${validData.length} valid members. Click OK to process...`);
        const res = await api.post('/api/alumni/bulk', { members: validData });
        alert(res.data.message);
        fetchAll(); 
      } catch (err) {
        console.error(err);
        const errorMessage = err.response?.data?.message || err.message || "Unknown error";
        alert(`Import failed: ${errorMessage}`);
      }
      e.target.value = null; 
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <h1>Member Management</h1>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
            placeholder="Search names..." 
            onChange={(e) => setSearch(e.target.value)} 
            style={{...styles.searchBar, marginBottom: 0, minWidth: '300px'}} 
        />
        <div style={{display: 'flex', gap: '10px', marginLeft: 'auto'}}>
          <button onClick={downloadTemplate} style={{...styles.btnBlue, backgroundColor: '#17a2b8', border: '1px solid #117a8b'}}>
            📥 Download Template
          </button>
          <label style={{...styles.btnBlue, cursor: 'pointer', backgroundColor: '#28a745', border: '1px solid #218838', margin: 0}}>
              📊 Bulk Import (Excel)
            <input type="file" accept=".xlsx, .xls, .csv" onChange={handleExcelUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>
      
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Contact Info</th><th style={styles.th}>Status</th><th style={styles.th}>Actions</th></tr></thead>
          <tbody>
            {members.filter(m => `${m.firstName} ${m.lastName}`.toLowerCase().includes(search.toLowerCase())).map(m => (
              <tr key={m._id}>
                <td style={styles.td}><strong>{m.firstName} {m.lastName}</strong><br/><span style={{fontSize:'12px', color:'#666'}}>{m.yearOfGraduation}</span></td>
                <td style={styles.td}><span style={{fontSize:'12px'}}>{m.email}<br/>{m.mobile}</span></td>
                <td style={styles.td}>{m.isApproved ? '✅ Apprv' : '⏳ Pend'} {m.isLifeMember ? '⭐ Life' : ''}</td>
                <td style={styles.td}>
                  <button onClick={() => handleEditClick(m)} style={styles.btnAction}>Edit Full</button>
                  <button onClick={() => memberAction(m._id, m.isApproved ? 'revoke' : 'approve')} style={{...styles.btnAction, backgroundColor: m.isApproved ? '#6c757d' : '#28a745'}}>{m.isApproved ? 'Revoke' : 'Approve'}</button>
                  <button onClick={() => deleteMember(m._id)} style={styles.btnDelete}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{marginTop: 0, color: '#003366'}}>Edit {editData.firstName} {editData.lastName}</h2>
            <div style={styles.modalScroll}>
                <label style={styles.label}>Profile Picture</label>
                <input type="file" onChange={e => setNewPic(e.target.files[0])} style={styles.inputS} />

                <div style={{padding: '15px', backgroundColor: '#eef2f5', borderRadius: '8px', marginBottom: '15px', border: '1px solid #cce0ff'}}>
                  <label style={{...styles.label, display: 'inline-flex', alignItems: 'center', cursor: 'pointer', fontSize: '15px', color: '#003366', marginBottom: editData.isLifeMember ? '10px' : '0'}}>
                    <input 
                      type="checkbox" 
                      checked={!!editData.isLifeMember} 
                      onChange={e => setEditData({...editData, isLifeMember: e.target.checked})} 
                      style={{marginRight: '10px', transform: 'scale(1.3)'}}
                    />
                    ⭐ Mark as Life Member
                  </label>
                  {editData.isLifeMember && (
                    <div style={{marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #d1d9e6'}}>
                      <label style={styles.label}>Membership Number</label>
                      <input 
                        value={editData.membershipNumber || ''} 
                        onChange={e => setEditData({...editData, membershipNumber: e.target.value})} 
                        style={{...styles.inputS, marginBottom: '0', backgroundColor: '#fff'}} 
                        placeholder="e.g. LM-2023-001"
                      />
                    </div>
                  )}
                </div>

                <h4 style={styles.sectionHeader}>Personal Details</h4>
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

                <h4 style={styles.sectionHeader}>Academic Details</h4>
                <div style={styles.grid}>
                  <div><label style={styles.label}>Batch Year</label><input type="number" value={editData.yearOfGraduation || ''} onChange={e => setEditData({...editData, yearOfGraduation: e.target.value})} style={styles.inputS} /></div>
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

                <h4 style={styles.sectionHeader}>Professional & Location</h4>
                <div><label style={styles.label}>Current Occupation / Designation</label><input value={editData.currentOccupation || ''} onChange={e => setEditData({...editData, currentOccupation: e.target.value})} style={styles.inputS} /></div>
                <div><label style={styles.label}>Residence Address</label><textarea value={editData.residenceAddress || ''} onChange={e => setEditData({...editData, residenceAddress: e.target.value})} style={{...styles.inputS, height: '60px'}} /></div>
                <div><label style={styles.label}>Office Address</label><textarea value={editData.officeAddress || ''} onChange={e => setEditData({...editData, officeAddress: e.target.value})} style={{...styles.inputS, height: '60px'}} /></div>

                {editData.maritalStatus === 'Married' && (
                  <>
                    <h4 style={styles.sectionHeader}>Spouse & Family</h4>
                    <div style={styles.grid}>
                      <div><label style={styles.label}>Spouse First Name</label><input value={editData.spouseFirstName || ''} onChange={e => setEditData({...editData, spouseFirstName: e.target.value})} style={styles.inputS} /></div>
                      <div><label style={styles.label}>Spouse Last Name</label><input value={editData.spouseLastName || ''} onChange={e => setEditData({...editData, spouseLastName: e.target.value})} style={styles.inputS} /></div>
                      <div><label style={styles.label}>Anniversary</label><input type="date" value={editData.anniversaryDate ? editData.anniversaryDate.split('T')[0] : ''} onChange={e => setEditData({...editData, anniversaryDate: e.target.value})} style={styles.inputS} /></div>
                      <div><label style={styles.label}>Children</label><input type="number" min="0" value={editData.numberOfChildren || 0} onChange={e => setEditData({...editData, numberOfChildren: e.target.value})} style={styles.inputS} /></div>
                    </div>
                  </>
                )}
            </div>
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

export default AdminMembers;
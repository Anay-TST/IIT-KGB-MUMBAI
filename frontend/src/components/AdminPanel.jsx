import React, { useState, useEffect } from 'react';
import api from '../api';
import * as XLSX from 'xlsx';

// --- CONFIGURATION ARRAYS ---
const DEGREES = ["B.Tech", "B.Arch", "Dual Degree", "M.Tech", "M.Sc", "MBA", "Ph.D", "MS", "MCP", "MMST", "LLB", "LLM", "Other"];
const DEPARTMENTS = ["Aerospace Engineering", "Advanced Technology Centre", "Agricultural & Food Engineering", "Architecture & Regional Planning", "Biotechnology", "Centre for Theoretical Studies", "Chemical Engineering", "Chemistry", "Civil Engineering", "Computer Science & Engineering", "Cyrogenic Engineering", "Center for Educational Technology", "Energy Science and Engineering", "Energy Engineering", "Electrical Engineering", "Electronics & Electrical Communications Engineering", "Exploration Geophysics", "GS Sanyal School of Telecommunications (GS)", "GS Sanyal School of Telecommunications (TE)", "Geology & Geophysics", "Humanities & Social Sciences", "Industrial Engineering & Management", "Instrumentation Engineering", "School of Information Technology", "Material Science", "Mathematics", "Manufacturing Engineering", "Mechanical Engineering", "Medical Science & Technology", "Metallurgical Engineering", "Mining Engineering", "Ocean Engineering & Naval Architecture", "Ocean, Rivers, Atmosphere & Land Sciences", "Physics & Meteorology", "Quality Engineering Design and Manufacturing", "Rajendra Mishra School of Engineering Entrepreneurship", "Rajeev Gandhi School of Intellectual Property Law", "Ranbir and Chitra Gupta School of Infrastructure Design and Management", "Reliability Engineering", "Rubber Technology Center", "Rural Development Centre", "School of Water Resources", "Steel Technology Centre", "Statistics and Informatics", "Vinod Gupta School of Management", "Other"];
const HALLS = ["Ashutosh Mukherjee", "Azad", "Bhidan Chandra Roy", "Campus", "Dr. B R Ambedkar", "Gokhale", "Homi J Bhabha", "Jagadish Chandra Bose", "Lala Lajpat Rai", "Lalbahadur Sastry", "Madan Mohan Malaviya", "Meghnad Saha", "Mother Teresa", "Nehru", "Patel", "Radhakrishnan", "Rajendra Prasad", "Rani Laxmi Bai", "Sarojini Naidu / Indira Gandhi", "Vidyasagar", "Zakir Hussain", "Vikram Sarabhai Residential Complex", "Institute Quarter", "Bachelors Flat", "Rader Flats", "Other"];

const ALL_FIELDS = [
  'firstName', 'lastName', 'email', 'mobile', 'birthdate', 'sex', 
  'maritalStatus', 'yearOfGraduation', 'department', 'degree', 
  'hall', 'currentOccupation', 'residenceAddress', 'officeAddress', 
  'spouseFirstName', 'spouseLastName', 'anniversaryDate', 'numberOfChildren',
  'isLifeMember', 'membershipNumber' 
];

const AdminPanel = () => {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState('members'); 
  
  const [members, setMembers] = useState([]);
  const [committee, setCommittee] = useState([]);
  const [docs, setDocs] = useState([]);
  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState('');
  const [editData, setEditData] = useState(null);
  const [newPic, setNewPic] = useState(null);
  
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [committeeTitle, setCommitteeTitle] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });

  const fetchAll = async () => {
    try {
      const [memRes, commRes, docRes, eventRes] = await Promise.all([
        api.get('/api/alumni/all'), api.get('/api/committee'),
        api.get('/api/documents'), api.get('/api/events')
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

  // --- EXCEL TEMPLATE GENERATOR ---
  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([ALL_FIELDS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Alumni_Import_Template.xlsx");
  };

  // --- EXCEL BULK UPLOAD HANDLER ---
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
        
        // raw: false keeps dates as strings so they don't break
        const rawData = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });

        console.log("RAW EXCEL DATA:", rawData); 

        if (rawData.length === 0) {
          alert("The Excel file has no data rows! Please add data below the header row.");
          e.target.value = null;
          return;
        }

        const validData = rawData.map((row, index) => {
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
    
    // Using ArrayBuffer for better modern Excel support
    reader.readAsArrayBuffer(file);
  };

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
  const uploadDoc = async (e) => {
    e.preventDefault();
    const fd = new FormData(); fd.append('title', docTitle); fd.append('file', docFile);
    await api.post('/api/documents', fd); setDocTitle(''); setDocFile(null); fetchAll();
  };
  const createEvent = async (e) => {
    e.preventDefault(); await api.post('/api/events', newEvent);
    setNewEvent({ title: '', date: '', location: '', description: '' }); fetchAll();
  };
  const uploadEventMedia = async (eventId, files) => {
    const fd = new FormData(); Array.from(files).forEach(f => fd.append('files', f));
    await api.post(`/api/events/${eventId}/media`, fd); fetchAll();
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
      <div style={styles.sidebar}>
        <h3 style={{borderBottom: '1px solid #003366', paddingBottom: '10px'}}>Dashboard</h3>
        <div style={activeTab === 'members' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('members')}>👥 Members</div>
        <div style={activeTab === 'committee' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('committee')}>🏛️ Committee</div>
        <div style={activeTab === 'docs' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('docs')}>📄 Documents</div>
        <div style={activeTab === 'events' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('events')}>📅 Events</div>
        <div onClick={() => setAuth(false)} style={styles.logoutBtn}>🚪 Logout</div>
      </div>

      <div style={{ flex: 1, padding: '30px', marginLeft: '220px' }}>
        {activeTab === 'members' && (
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
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={handleExcelUpload} 
                    style={{ display: 'none' }} 
                  />
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
        )}

        {activeTab === 'committee' && (
          <>
            <h1>Committee</h1>
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
                      <td style={styles.td}><button onClick={() => moveComm(idx, 'up')} disabled={idx===0}>▲</button> <button onClick={() => moveComm(idx, 'down')} disabled={idx===committee.length-1}>▼</button></td>
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
            <h1>Events</h1>
            <form onSubmit={createEvent} style={styles.formCard}>
              <input placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} style={styles.inputS} />
              <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={styles.inputS} />
              <input placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} style={styles.inputS} />
              <button type="submit" style={styles.btnBlue}>Create</button>
            </form>
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead><tr><th>Event</th><th>Date</th><th>Upload Media</th><th>Action</th></tr></thead>
                <tbody>
                  {events.map(e => (
                    <tr key={e._id}>
                      <td style={styles.td}>{e.title}</td>
                      <td style={styles.td}>{new Date(e.date).toLocaleDateString()}</td>
                      <td style={styles.td}><input type="file" multiple onChange={(el) => uploadEventMedia(e._id, el.target.files)} /></td>
                      <td style={styles.td}><button onClick={() => api.delete(`/api/events/${e._id}`).then(fetchAll)} style={styles.btnDelete}>Del</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  sidebar: { width: '220px', backgroundColor: '#001f3f', color: 'white', padding: '20px', position: 'fixed', height: '100vh', boxSizing: 'border-box' },
  sidebarItem: { padding: '12px', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px', transition: '0.2s' },
  sidebarActive: { padding: '12px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#003366', fontWeight: 'bold', marginBottom: '5px' },
  logoutBtn: { marginTop: '40px', color: '#ff4d4d', cursor: 'pointer', padding: '12px', fontWeight: 'bold' },
  searchBar: { padding: '10px', width: '100%', borderRadius: '5px', border: '1px solid #ddd', fontSize: '14px' },
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #eee' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#f8f9fa', borderBottom: '2px solid #ddd' },
  td: { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px', verticalAlign: 'top' },
  btnAction: { backgroundColor:'#17a2b8', color:'white', border:'none', padding: '6px 12px', borderRadius:'4px', cursor: 'pointer', marginRight: '5px', fontSize: '13px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  inputS: { padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px', width: '100%', marginBottom: '15px', boxSizing: 'border-box', fontSize: '14px' },
  loginCenter: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f3f' },
  loginBox: { backgroundColor: 'white', padding: '50px', borderRadius: '15px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '650px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 5px 25px rgba(0,0,0,0.2)' },
  modalScroll: { overflowY: 'auto', paddingRight: '15px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 15px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#4a5568', marginBottom: '5px' },
  sectionHeader: { color: '#003366', borderBottom: '2px solid #ffcc00', display: 'inline-block', paddingBottom: '3px', marginBottom: '15px', marginTop: '10px' }
};

export default AdminPanel;
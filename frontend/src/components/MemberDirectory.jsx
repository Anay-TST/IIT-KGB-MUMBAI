import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLife, setFilterLife] = useState(false);

  // Set your backend URL here (Use localhost or your Codespace forwarded URL)
  const BACKEND_URL = 'http://localhost:5000'; 
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => { 
    axios.get(`${BACKEND_URL}/api/alumni`).then(res => setMembers(res.data)); 
  }, []);

  // Filter Logic: Matches search text AND (if filter is on) matches isLifeMember status
  const filtered = members.filter(m => {
    const fullName = `${m.firstName} ${m.lastName}`.toLowerCase();
    const matchesSearch = 
      fullName.includes(search.toLowerCase()) || 
      m.hall.toLowerCase().includes(search.toLowerCase()) || 
      m.yearOfGraduation.toString().includes(search);
    
    const matchesLife = filterLife ? m.isLifeMember === true : true;
    
    return matchesSearch && matchesLife;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #003366', paddingBottom: '20px', marginBottom: '20px' }}>
        <h2 style={{ color: '#003366', margin: 0 }}>Alumni Directory</h2>
        
        <div style={{ display: 'flex', gap: '15px' }}>
          <input 
            placeholder="Search by name, batch, or hall..." 
            onChange={e => setSearch(e.target.value)} 
            style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }} 
          />
          
          {/* THE UPDATED FILTER BUTTON */}
          <button 
            onClick={() => setFilterLife(!filterLife)} 
            style={{ 
              backgroundColor: filterLife ? '#ffcc00' : '#003366', 
              color: filterLife ? '#000' : '#fff',
              border: 'none', 
              borderRadius: '5px', 
              cursor: 'pointer', 
              padding: '10px 20px',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {filterLife ? 'Showing: Life Members' : 'Filter: Life Members Only'}
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <thead style={{ backgroundColor: '#001f3f', color: 'white' }}>
          <tr>
            <th style={thStyle}>Pic</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Batch</th>
            <th style={thStyle}>Degree</th>
            <th style={thStyle}>Dept</th>
            <th style={thStyle}>Hall</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? filtered.map(m => (
            <tr key={m._id} style={{ 
              borderBottom: '1px solid #eee', 
              backgroundColor: m.isLifeMember ? '#fffef0' : '#fff' 
            }}>
              <td style={tdStyle}>
                <img 
                  src={m.profilePic ? `${BACKEND_URL}${m.profilePic}` : defaultAvatar} 
                  alt="Profile" 
                  style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #ddd' }} 
                  onError={(e) => e.target.src = defaultAvatar}
                />
              </td>
              <td style={tdStyle}>
                <span style={{ fontWeight: 'bold', color: '#333' }}>{m.firstName} {m.lastName}</span>
                {m.isLifeMember && <span title="Life Member" style={{ marginLeft: '8px', color: '#ffcc00' }}>★</span>}
              </td>
              <td style={tdStyle}>{m.yearOfGraduation}</td>
              <td style={tdStyle}>{m.degree}</td>
              <td style={tdStyle}>{m.department}</td>
              <td style={tdStyle}>{m.hall}</td>
            </tr>
          )) : (
            <tr>
              <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                No members found matching your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: '15px', textAlign: 'left', fontWeight: '600' };
const tdStyle = { padding: '12px 15px', textAlign: 'left' };

export default MemberDirectory;
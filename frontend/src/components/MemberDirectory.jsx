import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLife, setFilterLife] = useState(false);

  useEffect(() => { 
    axios.get('/api/alumni').then(res => setMembers(res.data)); 
  }, []);

  const filtered = members.filter(m => {
    const matchesSearch = `${m.firstName} ${m.lastName} ${m.hall} ${m.yearOfGraduation}`.toLowerCase().includes(search.toLowerCase());
    const matchesLife = filterLife ? m.isLifeMember : true;
    return matchesSearch && matchesLife;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Alumni Directory</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            placeholder="Search..." 
            onChange={e => setSearch(e.target.value)} 
            style={{ padding: '8px', border: '1px solid #ccc' }} 
          />
          <button onClick={() => setFilterLife(!filterLife)} style={{ backgroundColor: filterLife ? '#ffcc00' : '#eee', border: '1px solid #ccc', cursor: 'pointer', padding: '5px 10px' }}>
            {filterLife ? '★ Life Members' : 'All Members'}
          </button>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#001f3f', color: 'white' }}>
          <tr>
            <th style={thP}>Pic</th>
            <th style={thP}>Name</th>
            <th style={thP}>Batch</th>
            <th style={thP}>Degree</th>
            <th style={thP}>Dept</th>
            <th style={thP}>Hall</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m._id} style={{ borderBottom: '1px solid #eee', backgroundColor: m.isLifeMember ? '#fffef0' : 'white' }}>
              <td style={thP}>
                <img 
                  src={m.profilePic ? `http://localhost:5000${m.profilePic}` : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
                  alt="Profile" 
                  style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
                />
              </td>
              <td style={thP}><strong>{m.firstName} {m.lastName}</strong> {m.isLifeMember && '⭐'}</td>
              <td style={thP}>{m.yearOfGraduation}</td>
              <td style={thP}>{m.degree}</td>
              <td style={thP}>{m.department}</td>
              <td style={thP}>{m.hall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thP = { padding: '12px', textAlign: 'left' };

export default MemberDirectory;
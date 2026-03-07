import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterLife, setFilterLife] = useState(false);

  useEffect(() => { axios.get('/api/alumni').then(res => setMembers(res.data)); }, []);

  const filtered = members.filter(m => {
    const matchesSearch = `${m.firstName} ${m.lastName} ${m.hall} ${m.yearOfGraduation}`.toLowerCase().includes(search.toLowerCase());
    return filterLife ? (matchesSearch && m.isLifeMember) : matchesSearch;
  });

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Alumni Directory</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input placeholder="Search..." onChange={e => setSearch(e.target.value)} style={{ padding: '8px', border: '1px solid #ccc' }} />
          <button onClick={() => setFilterLife(!filterLife)} style={{ backgroundColor: filterLife ? '#ffcc00' : '#eee' }}>
            {filterLife ? '★ Life Members' : 'All Members'}
          </button>
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#001f3f', color: 'white' }}>
          <tr><th>Pic</th><th>Name</th><th>Batch</th><th>Degree</th><th>Dept</th><th>Hall</th></tr>
        </thead>
        <tbody>
          {filtered.map(m => (
            <tr key={m._id} style={{ borderBottom: '1px solid #eee', backgroundColor: m.isLifeMember ? '#fffef0' : 'white' }}>
              <td style={{padding:'10px'}}><img src={m.profilePic ? `http://localhost:5000${m.profilePic}` : ''} style={{ width: '40px', height: '40px', borderRadius: '50%' }} /></td>
              <td style={{padding:'10px'}}><strong>{m.firstName} {m.lastName}</strong> {m.isLifeMember && '⭐'}</td>
              <td style={{padding:'10px'}}>{m.yearOfGraduation}</td>
              <td style={{padding:'10px'}}>{m.degree}</td>
              <td style={{padding:'10px'}}>{m.department}</td>
              <td style={{padding:'10px'}}>{m.hall}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MemberDirectory;
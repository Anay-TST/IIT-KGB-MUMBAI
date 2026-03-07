import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [members, setMembers] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'Loki12345') {
      setIsAuthenticated(true);
      fetchMembers();
    } else {
      alert('Wrong Password');
    }
  };

  const fetchMembers = async () => {
    const res = await axios.get('/api/alumni/all');
    setMembers(res.data);
  };

  const approveMember = async (id) => {
    await axios.patch(`/api/alumni/approve/${id}`);
    fetchMembers();
  };

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Admin Dashboard Login</h2>
        <form onSubmit={handleLogin}>
          <input type="password" placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
          <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1>Member Approvals</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#003366', color: 'white' }}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m._id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={thStyle}>{m.firstName} {m.lastName}</td>
              <td style={thStyle}>{m.email}</td>
              <td style={thStyle}>{m.isApproved ? '✅ Approved' : '⏳ Pending'}</td>
              <td style={thStyle}>
                {!m.isApproved && <button onClick={() => approveMember(m._id)} style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Approve</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: '15px', textAlign: 'left' };
export default AdminPanel;
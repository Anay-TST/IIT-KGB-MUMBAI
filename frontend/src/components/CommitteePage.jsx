import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommitteePage = () => {
  const [committee, setCommittee] = useState([]);
  const BACKEND_URL = 'http://localhost:5000'; 
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/committee`).then(res => setCommittee(res.data));
  }, []);

  return (
    <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ color: '#003366', marginBottom: '10px' }}>Executive Committee</h1>
      <p style={{ color: '#666', marginBottom: '40px' }}>Leading the IIT KGP Mumbai Alumni Chapter</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
        {committee.map(c => (
          <div key={c._id} style={cardStyle}>
            <img 
              src={c.member?.profilePic ? `${BACKEND_URL}${c.member.profilePic}` : defaultAvatar} 
              alt="Committee Member"
              style={imgStyle}
            />
            <h3 style={{ margin: '15px 0 5px 0', color: '#003366' }}>
              {c.member?.firstName} {c.member?.lastName}
            </h3>
            <p style={{ color: '#d4af37', fontWeight: 'bold', margin: '0 0 10px 0', textTransform: 'uppercase', fontSize: '14px' }}>
              {c.title}
            </p>
            <p style={{ color: '#888', fontSize: '13px' }}>
              Batch of {c.member?.yearOfGraduation} | {c.member?.hall}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const cardStyle = {
  backgroundColor: '#fff',
  padding: '30px',
  borderRadius: '15px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  transition: 'transform 0.3s'
};

const imgStyle = {
  width: '120px',
  height: '120px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: '4px solid #f0f4f8'
};

export default CommitteePage;
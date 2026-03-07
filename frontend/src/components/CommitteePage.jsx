import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';

const CommitteePage = () => {
  const [committee, setCommittee] = useState([]);
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => {
    // Fetch committee data from backend
    api.get('/api/committee')
      .then(res => setCommittee(res.data))
      .catch(err => console.error("Error fetching committee:", err));
  }, []);

  return (
    <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#003366', marginBottom: '10px', fontSize: '2.5rem' }}>Executive Committee</h1>
      <p style={{ color: '#666', marginBottom: '50px', fontSize: '1.1rem' }}>The dedicated team leading the IIT KGP Mumbai Alumni Chapter</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
        {committee.map(c => (
          <div key={c._id} style={cardStyle}>
            <div style={imgContainer}>
              <img 
                src={c.member?.profilePic ? `${BACKEND_URL}${c.member.profilePic}` : defaultAvatar} 
                alt="Committee Member"
                style={imgStyle}
                onError={(e) => e.target.src = defaultAvatar}
              />
            </div>
            <h3 style={{ margin: '15px 0 5px 0', color: '#003366', fontSize: '1.4rem' }}>
              {c.member?.firstName} {c.member?.lastName}
            </h3>
            <div style={titleBadge}>{c.title}</div>
            <p style={{ color: '#777', fontSize: '0.9rem', marginTop: '10px' }}>
              Batch of {c.member?.yearOfGraduation} | {c.member?.hall}
            </p>
          </div>
        ))}
      </div>

      {committee.length === 0 && (
        <p style={{ color: '#999', marginTop: '40px' }}>No committee members assigned yet.</p>
      )}
    </div>
  );
};

// --- STYLES ---
const cardStyle = {
  backgroundColor: '#fff',
  padding: '40px 20px',
  borderRadius: '20px',
  boxShadow: '0 15px 35px rgba(0,0,0,0.05)',
  border: '1px solid #f0f0f0',
  transition: 'transform 0.3s ease'
};

const imgContainer = {
  width: '140px',
  height: '140px',
  margin: '0 auto 20px auto',
  borderRadius: '50%',
  padding: '5px',
  border: '2px dashed #d4af37' // Gold border for committee members
};

const imgStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  objectFit: 'cover'
};

const titleBadge = {
  display: 'inline-block',
  backgroundColor: '#fdf6e3',
  color: '#b58900',
  padding: '5px 15px',
  borderRadius: '20px',
  fontSize: '0.85rem',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  letterSpacing: '1px'
};

export default CommitteePage;
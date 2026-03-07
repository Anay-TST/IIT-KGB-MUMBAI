import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Using relative path for the Vite proxy
        const response = await axios.get('/api/alumni');
        setMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alumni data:", error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <p style={{ textAlign: 'center', padding: '20px' }}>Loading KGPians...</p>;

  return (
    <div className="directory-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#003366', borderBottom: '2px solid #ffcc00', paddingBottom: '10px' }}>
        Alumni Directory
      </h2>
      
      <div className="member-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px',
        marginTop: '20px' 
      }}>
        {members.length > 0 ? (
          members.map((member) => (
            <div 
              key={member._id} 
              className="member-card" 
              style={{ 
                border: '1px solid #eee', 
                padding: '20px', 
                borderRadius: '12px', 
                backgroundColor: '#fff',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0', color: '#001f3f' }}>
                {member.name} {member.isLifeMember && <span title="Life Member" style={{ color: '#ffd700' }}>⭐</span>}
              </h3>
              <p style={{ margin: '5px 0' }}><strong>Batch:</strong> {member.batch}</p>
              <p style={{ margin: '5px 0' }}><strong>Department:</strong> {member.department}</p>
            </div>
          ))
        ) : (
          <p>No members found in the directory.</p>
        )}
      </div>
    </div>
  );
};

export default MemberDirectory;

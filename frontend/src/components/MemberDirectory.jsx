import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MemberDirectory = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch data from our Node.js backend
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/alumni');
        setMembers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching alumni data:", error);
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) return <p>Loading KGPians...</p>;

  return (
    <div className="directory-container">
      <h2>Alumni Directory</h2>
      <div className="member-grid">
        {members.map((member) => (
          <div key={member._id} className="member-card" style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', borderRadius: '8px' }}>
            <h3>{member.name} {member.isLifeMember && <span title="Life Member">⭐</span>}</h3>
            <p><strong>Batch:</strong> {member.batch}</p>
            <p><strong>Department:</strong> {member.department}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberDirectory;

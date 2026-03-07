import React, { useState } from 'react';
import MemberDirectory from './MemberDirectory';
import AddMember from './AddMember';

const MembersPage = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: 'calc(100vh - 60px)' }}>
      
      {/* Page Header Area */}
      <div style={{ backgroundColor: '#003366', color: 'white', padding: '40px 20px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>Alumni Network</h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 20px auto', opacity: 0.9 }}>
          Find your batchmates, network with seniors, or register yourself to join the Mumbai chapter directory.
        </p>
        
        <button 
          onClick={() => setShowRegisterForm(!showRegisterForm)}
          style={{ padding: '12px 24px', backgroundColor: showRegisterForm ? '#dc3545' : '#28a745', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem', cursor: 'pointer', fontWeight: 'bold', transition: '0.3s' }}
        >
          {showRegisterForm ? '✖ Cancel Registration' : '➕ Register as New Member'}
        </button>
      </div>

      {showRegisterForm && (
        <div style={{ padding: '20px', backgroundColor: '#e9ecef', borderBottom: '1px solid #ddd' }}>
           <AddMember />
        </div>
      )}

      <MemberDirectory />
      
    </div>
  );
};

export default MembersPage;
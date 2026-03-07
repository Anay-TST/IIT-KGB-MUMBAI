import React from 'react';

const Navbar = () => {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 40px', 
      backgroundColor: '#003366', // KGP Blueish tone
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
        IIT KGP Alumni Mumbai
      </div>
      <ul style={{ 
        display: 'flex', 
        gap: '25px', 
        listStyle: 'none', 
        margin: 0, 
        padding: 0,
        cursor: 'pointer'
      }}>
        <li className="nav-item">Home</li>
        <li className="nav-item">Members</li>
        <li className="nav-item">News</li>
        <li className="nav-item">Events</li>
        <li className="nav-item" style={{ color: '#FFD700' }}>Admin</li>
      </ul>
    </nav>
  );
};

export default Navbar;
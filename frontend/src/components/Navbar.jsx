import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  // Check if the user is currently logged in by looking for their token
  const isLoggedIn = !!localStorage.getItem('memberToken');

  const handleLogout = () => {
    localStorage.removeItem('memberToken');
    localStorage.removeItem('memberData');
    navigate('/login'); // Send them back to the login screen
  };

  return (
    <>
      {/* This spacer prevents the page content from sliding up underneath the fixed navbar */}
      <div style={{ height: '62px' }}></div> 
      
      <nav style={styles.navbar}>
        <div style={styles.brand}>IIT KGP Alumni Mumbai</div>
        
        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/members" style={styles.link}>Members</Link>
          <Link to="/committee" style={styles.link}>Committee</Link>
          <Link to="/events" style={styles.link}>Events</Link>
          <Link to="/documents" style={styles.link}>Documents</Link>
        </div>

        {/* --- NEW: LOGIN / DASHBOARD BUTTONS --- */}
        <div style={styles.authContainer}>
          {isLoggedIn ? (
            <>
              <Link to="/member-dashboard" style={styles.btnDashboard}>My Dashboard</Link>
              <button onClick={handleLogout} style={styles.btnLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={styles.btnLogin}>Member Login</Link>
          )}
        </div>
        
      </nav>
    </>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: '#003366',
    color: 'white',
    // --- The Bulletproof Fixed Positioning ---
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    boxSizing: 'border-box', 
    zIndex: 9999, 
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    // -----------------------------------------
  },
  brand: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  links: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
  authContainer: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  btnLogin: {
    backgroundColor: '#fbbf24',
    color: '#001f3f',
    padding: '8px 18px',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
    transition: '0.2s',
  },
  btnDashboard: {
    backgroundColor: '#16a34a',
    color: 'white',
    padding: '8px 18px',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '15px',
  },
  btnLogout: {
    backgroundColor: 'transparent',
    color: '#f87171',
    border: '1px solid #f87171',
    padding: '7px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '15px',
  }
};

export default Navbar;
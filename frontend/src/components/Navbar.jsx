import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
  },
};

export default Navbar;
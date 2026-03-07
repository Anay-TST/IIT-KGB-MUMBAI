import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>IIT KGP Alumni - Mumbai</Link>
      </div>
      <ul style={styles.navLinks}>
        <li><Link to="/members" style={styles.link}>Members</Link></li>
        <li><Link to="/committee" style={styles.link}>Committee</Link></li>
        <li><Link to="/documents" style={styles.link}>Documents</Link></li>
        <li><Link to="/events" style={styles.link}>Events</Link></li>
        <li><Link to="/admin" style={styles.adminLink}>Admin Panel</Link></li>
      </ul>
    </nav>
  );
};

const styles = {
  nav: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '0 40px', 
    height: '70px', 
    backgroundColor: '#001f3f', 
    color: 'white', 
    position: 'sticky', 
    top: 0, 
    zIndex: 1000,
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
  },
  logoLink: { color: '#ffcc00', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.4rem' },
  navLinks: { display: 'flex', listStyle: 'none', gap: '25px', alignItems: 'center', margin: 0, padding: 0 },
  link: { color: 'white', textDecoration: 'none', fontSize: '1rem' },
  adminLink: { 
    color: '#ffcc00', 
    textDecoration: 'none', 
    border: '1px solid #ffcc00', 
    padding: '6px 18px', 
    borderRadius: '20px', 
    fontSize: '0.9rem',
    fontWeight: 'bold'
  }
};

export default Navbar;
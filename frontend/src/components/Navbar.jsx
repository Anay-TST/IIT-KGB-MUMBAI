import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>IIT KGP Alumni - Mumbai</Link>
      </div>
      <ul style={styles.navLinks}>
        <li>
          <Link to="/" style={styles.link}>Home</Link>
        </li>
        <li>
          <Link to="/members" style={styles.link}>Members</Link>
        </li>
        <li>
          <Link to="/directory" style={styles.link}>Directory</Link>
        </li>
        <li>
          <Link to="/news" style={styles.link}>News</Link>
        </li>
        {/* ADDED COMMITTEE LINK HERE */}
        <li>
          <Link to="/committee" style={styles.link}>Committee</Link>
        </li>
        <li>
          <Link to="/admin" style={styles.adminLink}>Admin</Link>
        </li>
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
    backgroundColor: '#001f3f', // Navy Blue
    color: 'white',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    position: 'sticky', // Keeps it at the top while scrolling
    top: 0,
    zIndex: 1000
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  logoLink: {
    color: '#ffcc00', // Gold color for IIT spirit
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    listStyle: 'none',
    gap: '25px',
    alignItems: 'center',
    margin: 0,
    padding: 0
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s',
  },
  adminLink: {
    color: '#ffcc00',
    textDecoration: 'none',
    border: '1px solid #ffcc00',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.9rem',
  }
};

export default Navbar;
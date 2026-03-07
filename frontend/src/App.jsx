import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MembersPage from './components/MembersPage';
import MemberDirectory from './components/MemberDirectory';
import CommitteePage from './components/CommitteePage';
import DocumentsPage from './components/DocumentsPage';
import EventsPage from './components/EventsPage'; // Integrated actual component

// Admin Components
import AdminPanel from './components/AdminPanel';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Navigation Bar - Global */}
        <Navbar />
        
        {/* Main Content Area */}
        <div style={{ flex: 1 }}>
          <Routes>
            {/* Main Public Pages */}
            <Route path="/" element={<HomePage />} />
            
            {/* Membership & Directory */}
            <Route path="/members" element={<MembersPage />} />
            <Route path="/directory" element={<MemberDirectory />} />
            
            {/* Chapter Organization */}
            <Route path="/committee" element={<CommitteePage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            
            {/* Events - Upcoming & Past Memories */}
            <Route path="/events" element={<EventsPage />} />

            {/* Admin Dashboard */}
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </div>

        {/* Global Footer */}
        <footer style={styles.footer}>
          <div style={styles.footerContent}>
            <h3 style={{ margin: '0 0 10px 0', color: '#ffcc00' }}>IIT Kharagpur Alumni Foundation</h3>
            <p style={{ margin: '5px 0' }}>Mumbai Chapter</p>
            <div style={styles.divider}></div>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>© 2026 | Servicing the KGPian spirit since 1951</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

const styles = {
  footer: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#001f3f', // Navy Blue
    color: 'white',
    marginTop: 'auto' // Pushes footer to bottom if page content is short
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  divider: {
    width: '40px',
    height: '2px',
    backgroundColor: '#ffcc00',
    margin: '15px auto'
  }
};

export default App;
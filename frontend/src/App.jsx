import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MembersPage from './components/MembersPage';
import MemberDirectory from './components/MemberDirectory';

// Admin & Form Components
import AddMember from './components/AddMember'; 
import NewsSection from './components/NewsSection';
import AddEvent from './components/AddEvent';
import AdminPanel from './components/AdminPanel'; // Ensure this component is created

import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ margin: 0, padding: 0 }}>
        {/* Navigation Bar stays at the top of all pages */}
        <Navbar />
        
        <Routes>
          {/* Main Public Pages */}
          <Route path="/" element={<HomePage />} />
          
          {/* Public Register/Add Member Page */}
          <Route path="/members" element={<MembersPage />} />
          
          {/* Public Approved Members Directory */}
          <Route path="/directory" element={<MemberDirectory />} />
          <Route path="/committee" element={<CommitteePage />} />
          
          {/* News Page */}
          <Route path="/news" element={
            <div style={{ padding: '40px 20px' }}>
              <NewsSection />
            </div>
          } />

          {/* Events Page Placeholder */}
          <Route path="/events" element={
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <h1>Upcoming Events</h1>
              <p>Check the Home page for the latest scheduled meets!</p>
            </div>
          } />

          {/* PROTECTED ADMIN DASHBOARD */}
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>

        {/* Simple Footer */}
        <footer style={{ textAlign: 'center', padding: '40px', backgroundColor: '#001f3f', color: 'white', marginTop: '60px' }}>
          <p>© 2026 IIT Kharagpur Alumni Mumbai Chapter</p>
          <small style={{ opacity: 0.6 }}>Servicing the KGPian spirit since 1951</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
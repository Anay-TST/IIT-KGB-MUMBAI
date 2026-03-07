import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import MembersPage from './components/MembersPage';
import MemberDirectory from './components/MemberDirectory'; // Added from remote

// Admin & Form Components
import AddMember from './components/AddMember'; 
import NewsSection from './components/NewsSection';
import AddEvent from './components/AddEvent';

import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ margin: 0, padding: 0 }}>
        <Navbar />
        
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/members" element={<MembersPage />} />
          
          {/* New Route for the Directory if needed */}
          <Route path="/directory" element={<MemberDirectory />} />
          
          <Route path="/news" element={
            <div style={{ padding: '40px 20px' }}>
              <NewsSection />
            </div>
          } />

          <Route path="/events" element={
            <div style={{ textAlign: 'center', padding: '100px 20px' }}>
              <h1>Upcoming Events</h1>
              <p>Check the Home page for the latest scheduled meets!</p>
            </div>
          } />

          <Route path="/admin" element={
            <div style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
              <h1 style={{ textAlign: 'center', color: '#003366', marginBottom: '40px' }}>
                Portal Admin Dashboard
              </h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                <section style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff' }}>
                  <h2 style={{ marginTop: 0 }}>📅 Event Management</h2>
                  <AddEvent />
                </section>

                <section style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff' }}>
                  <h2 style={{ marginTop: 0 }}>📰 News Management</h2>
                  <NewsSection />
                </section>

                <section style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: '#fff' }}>
                  <h2 style={{ marginTop: 0 }}>👥 Member Management</h2>
                  <AddMember />
                </section>
              </div>
            </div>
          } />
        </Routes>

        <footer style={{ textAlign: 'center', padding: '40px', backgroundColor: '#001f3f', color: 'white', marginTop: '60px' }}>
          <p>© 2026 IIT Kharagpur Alumni Mumbai Chapter</p>
          <small style={{ opacity: 0.6 }}>Servicing the KGPian spirit since 1951</small>
        </footer>
      </div>
    </Router>
  );
}

export default App;
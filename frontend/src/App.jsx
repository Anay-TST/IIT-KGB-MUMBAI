import React from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
// We are keeping these imported but hidden for now so the homepage looks clean!
import AddMember from './components/AddMember'; 
import MemberDirectory from './components/MemberDirectory';
import NewsSection from './components/NewsSection';
import './App.css';

function App() {
  return (
    <div className="App" style={{ margin: 0, padding: 0 }}>
      {/* 1. The Top Navigation */}
      <Navbar />
      
      {/* 2. The Main Home Page Content */}
      <HomePage />

      {/* 
        Below is the "Admin/Directory Area". 
        Later, we will use React Router to put these on separate pages (like /members or /admin).
        For now, let's keep them at the very bottom so you can still use them to add data!
      */}
      <div style={{ marginTop: '100px', padding: '40px', backgroundColor: '#222', color: 'white' }}>
        <h2 style={{ textAlign: 'center', color: '#FFD700' }}>--- ADMIN & DATA AREA (Temporary) ---</h2>
        <AddMember />
        <NewsSection />
        <div style={{ backgroundColor: 'white', color: 'black', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
          <MemberDirectory />
        </div>
      </div>
    </div>
  );
}

export default App;
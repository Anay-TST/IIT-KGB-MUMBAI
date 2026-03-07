import React from 'react';
import MemberDirectory from './components/MemberDirectory';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>IIT Kharagpur Alumni Portal</h1>
        <nav>
          <ul style={{ display: 'flex', gap: '20px', listStyle: 'none', justifyContent: 'center' }}>
            <li>Members</li>
            <li>News</li>
            <li>Events</li>
          </ul>
        </nav>
      </header>
      
      <main>
        {/* We are loading the Member Directory component here */}
        <MemberDirectory />
      </main>
    </div>
  );
}

export default App;

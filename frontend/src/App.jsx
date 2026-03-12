import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// --- PUBLIC COMPONENTS ---
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import MembersPage from "./components/MembersPage";
import CommitteePage from "./components/CommitteePage";
import EventsPage from "./components/EventsPage";
import DocumentsPage from "./components/DocumentsPage";

// --- AUTH & MEMBER DASHBOARD COMPONENTS ---
import MemberLogin from './components/MemberLogin';
import ResetPassword from './components/ResetPassword';
import MemberDashboard from './components/MemberDashboard';

// --- ADMIN COMPONENTS ---
import AdminPanel from './components/admin/AdminPanel';

// --- STYLES ---
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* The Navbar is inside the Router but outside the Routes. 
            This keeps it fixed at the top of every page. 
        */}
        <Navbar />
        
        <Routes>
          {/* Main Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />
          
          {/* Member Auth & Dashboard Routes */}
          <Route path="/login" element={<MemberLogin />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/member-dashboard" element={<MemberDashboard />} />

          {/* Admin Route 
              The '/*' allows the AdminPanel to handle its own 
              internal sub-routing (tabs) 
          */}
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
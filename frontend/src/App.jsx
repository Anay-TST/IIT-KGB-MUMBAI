import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Public Components
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import MembersPage from "./components/MembersPage";
import CommitteePage from "./components/CommitteePage";
import EventsPage from "./components/EventsPage";
import DocumentsPage from "./components/DocumentsPage";

// Admin Components
import AdminPanel from './components/admin/AdminPanel';

// Styles
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Your custom Navbar will now appear on every page */}
        <Navbar />
        
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/members" element={<MembersPage />} />
          <Route path="/committee" element={<CommitteePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/documents" element={<DocumentsPage />} />

          {/* Admin Route */}
          <Route path="/admin/*" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
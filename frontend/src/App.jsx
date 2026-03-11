import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Standard Pages
import DocumentsPage from "./components/DocumentsPage";
import EventsPage from "./components/EventsPage";

<<<<<<< HEAD
// Admin Components
import AdminPanel from './components/admin/AdminPanel';
=======
// Admin Panel - Updated path to include the /admin/ subfolder
import AdminPanel from "./components/AdminPanel";
>>>>>>> 809ddae1f6aa3b19eb091e7e87a9b10aaf995b93

// Styles
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation or Header could go here */}
        
        <Routes>
          {/* Main Routes */}
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/events" element={<EventsPage />} />

          {/* Admin Route */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* Default Route */}
          <Route path="/" element={
            <div style={{ padding: "20px", textAlign: "center" }}>
              <h1>Welcome to IIT KGB Mumbai</h1>
              <p>Select a page to get started.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
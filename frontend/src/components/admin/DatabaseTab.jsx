import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../../api';

const DatabaseTab = ({ refresh }) => {
  const [loading, setLoading] = useState(false);

  // --- 1. DOWNLOAD TEMPLATE ---
  const downloadTemplate = () => {
    // These match the exact keys your MongoDB schema expects
    const templateData = [{
      firstName: "John", lastName: "Doe", email: "john@example.com", 
      mobile: "9876543210", yearOfGraduation: 2015, degree: "B.Tech", 
      department: "Computer Science", hall: "Azad Hall", sex: "Male",
      maritalStatus: "Single", birthdate: "1993-05-15"
    }];
    
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "Alumni_Import_Template.xlsx");
  };

  // --- 2. EXPORT (DOWNLOAD) DATABASE ---
  const handleExport = async () => {
    setLoading(true);
    try {
      // Fetch all members from your existing backend route
      const { data } = await api.get('/api/alumni/all');
      
      if (data.length === 0) {
        alert("The database is empty. Nothing to export.");
        return;
      }

      // Clean up the data (remove internal MongoDB fields before exporting)
      const cleanData = data.map(member => {
        const { _id, __v, profilePic, ...rest } = member;
        return rest;
      });

      const ws = XLSX.utils.json_to_sheet(cleanData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Alumni_Database");
      
      // Generate file with today's date
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Alumni_Backup_${date}.xlsx`);
      
    } catch (err) {
      console.error(err);
      alert("Failed to export database.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. IMPORT (UPLOAD) EXCEL FILE ---
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Convert Excel rows to an array of JSON objects
        const rawData = XLSX.utils.sheet_to_json(ws);

        // Send to your existing /bulk backend route
        const response = await api.post('/api/alumni/bulk', { members: rawData });
        
        alert(response.data.message || "Import Successful!");
        if (refresh) refresh(); // Refresh the admin tables

      } catch (err) {
        console.error(err);
        alert("Import failed. Make sure your Excel columns exactly match the template.");
      } finally {
        setLoading(false);
        e.target.value = null; // Reset the file input
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- 4. CLEAR DATABASE ---
  const handleClearDatabase = async () => {
    // Double confirmation for extreme safety
    const firstWarning = window.confirm("⚠️ WARNING: You are about to DELETE ALL MEMBERS in the database. Are you sure?");
    if (!firstWarning) return;

    const secondWarning = window.confirm("🚨 FINAL WARNING: This action CANNOT be undone. Do you wish to proceed and wipe the database?");
    if (!secondWarning) return;

    setLoading(true);
    try {
      await api.delete('/api/alumni/clear-all');
      alert("Database has been completely cleared.");
      if (refresh) refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to clear database.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Database Management</h2>
        <p style={styles.subtitle}>Import, Backup, and Reset system data.</p>
      </div>

      <div style={styles.grid}>
        
        {/* IMPORT SECTION */}
        <div style={styles.card}>
          <div style={styles.iconBox}>📤</div>
          <h3 style={styles.cardTitle}>Import Data</h3>
          <p style={styles.cardDesc}>Upload an Excel file to bulk add members. Ensure columns match the database schema.</p>
          
          <button onClick={downloadTemplate} style={styles.btnOutline}>
            📄 Download Template
          </button>
          
          <div style={styles.uploadWrapper}>
            <label style={styles.btnUpload}>
              {loading ? 'Processing...' : 'Upload Excel File'}
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                onChange={handleImport} 
                style={{ display: 'none' }} 
                disabled={loading}
              />
            </label>
          </div>
        </div>

        {/* EXPORT SECTION */}
        <div style={styles.card}>
          <div style={styles.iconBox}>📥</div>
          <h3 style={styles.cardTitle}>Export Backup</h3>
          <p style={styles.cardDesc}>Download the entire member database as an Excel file for local backup or reporting.</p>
          
          <button onClick={handleExport} disabled={loading} style={styles.btnPrimary}>
            {loading ? 'Processing...' : '💾 Download Database Backup'}
          </button>
        </div>

        {/* DANGER ZONE */}
        <div style={{...styles.card, border: '1px solid #fecaca', backgroundColor: '#fff5f5' }}>
          <div style={{...styles.iconBox, backgroundColor: '#fee2e2'}}>⚠️</div>
          <h3 style={{...styles.cardTitle, color: '#dc2626'}}>Danger Zone</h3>
          <p style={styles.cardDesc}>Permanently delete all member records from the database. This cannot be undone.</p>
          
          <button onClick={handleClearDatabase} disabled={loading} style={styles.btnDanger}>
            {loading ? 'Processing...' : '🗑️ Wipe Database'}
          </button>
        </div>

      </div>
    </div>
  );
};

// --- STYLES ---
const styles = {
  container: { width: '100%', padding: '10px' },
  header: { marginBottom: '30px' },
  title: { margin: 0, color: '#001f3f', fontSize: '1.8rem' },
  subtitle: { margin: '5px 0 0 0', color: '#64748b' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', border: '1px solid #f1f5f9' },
  
  iconBox: { width: '50px', height: '50px', borderRadius: '12px', backgroundColor: '#f0f9ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginBottom: '15px' },
  cardTitle: { margin: '0 0 10px 0', color: '#0f172a', fontSize: '1.2rem' },
  cardDesc: { margin: '0 0 25px 0', color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5', flex: 1 },
  
  btnPrimary: { width: '100%', padding: '12px', backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s', fontSize: '0.95rem' },
  btnOutline: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#001f3f', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', fontSize: '0.95rem' },
  
  uploadWrapper: { width: '100%' },
  btnUpload: { display: 'block', width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', fontSize: '0.95rem', boxSizing: 'border-box' },
  
  btnDanger: { width: '100%', padding: '12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' },
};

export default DatabaseTab;
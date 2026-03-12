import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import api from '../../api';

// --- THE STRICT MASTER LIST ---
// I added "countryCode" right next to "mobile".
const EXCEL_COLUMNS = [
  "firstName", "lastName", "email", "countryCode", "mobile", "birthdate", "sex", "maritalStatus",
  "yearOfGraduation", "degree", "department", "hall", 
  "currentOccupation", "residenceAddress", "officeAddress", 
  "spouseFirstName", "spouseLastName", "anniversaryDate", "numberOfChildren", 
  "lifeMemberNumber", "isLifeMember", "isApproved", "status", "referredBy"
];

const DatabaseTab = ({ refresh }) => {
  const [loading, setLoading] = useState(false);

  // --- 1. DOWNLOAD FULL TEMPLATE ---
  const downloadTemplate = () => {
    const dummyRow = {};
    EXCEL_COLUMNS.forEach(col => {
      dummyRow[col] = ""; 
    });
    
    const ws = XLSX.utils.json_to_sheet([dummyRow], { header: EXCEL_COLUMNS });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Member_Template");
    XLSX.writeFile(wb, "Full_Alumni_Template.xlsx");
  };

  // --- 2. EXPORT DATABASE (WITH STRICT FILTERING) ---
  const handleExport = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/alumni/all');
      
      if (data.length === 0) {
        alert("The database is empty.");
        return;
      }

      // THE FIX: Strict Mapping
      // Instead of just taking what MongoDB gives us, we build a brand new object
      // for every member using ONLY the columns defined in our Master List.
      // This automatically strips out ghosts like "membershipNumber".
      const cleanData = data.map(member => {
        const strictMember = {};
        EXCEL_COLUMNS.forEach(col => {
          // If the field exists, copy it. If it doesn't, put an empty string.
          strictMember[col] = member[col] !== undefined && member[col] !== null ? member[col] : "";
        });
        return strictMember;
      });

      const ws = XLSX.utils.json_to_sheet(cleanData, { header: EXCEL_COLUMNS });
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Database_Backup");
      
      const date = new Date().toISOString().split('T')[0];
      XLSX.writeFile(wb, `Alumni_Data_Backup_${date}.xlsx`);
      
    } catch (err) {
      alert("Export failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. IMPORT EXCEL FILE ---
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const reader = new FileReader();

    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(ws);

        if(rawData.length === 0) {
            alert("The uploaded file appears to be empty.");
            return;
        }

        const response = await api.post('/api/alumni/bulk', { members: rawData });
        alert(response.data.message);
        if (refresh) refresh();

      } catch (err) {
        console.error(err);
        alert("Import failed. Check your data format.");
      } finally {
        setLoading(false);
        e.target.value = null; 
      }
    };
    reader.readAsBinaryString(file);
  };

  // --- 4. CLEAR DATABASE ---
  const handleClearDatabase = async () => {
    const firstWarning = window.confirm("⚠️ DELETE ALL MEMBERS? (Cannot be undone)");
    if (!firstWarning) return;

    const secondWarning = window.confirm("🚨 FINAL CONFIRMATION: Wipe everything?");
    if (!secondWarning) return;

    setLoading(true);
    try {
      await api.delete('/api/alumni/clear-all');
      alert("Database cleared.");
      if (refresh) refresh();
    } catch (err) {
      alert("Failed to clear.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Database Management</h2>
        <p style={styles.subtitle}>Import/Export your full alumni registry.</p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.iconBox}>📤</div>
          <h3 style={styles.cardTitle}>Import Records</h3>
          <p style={styles.cardDesc}>Add multiple members at once using a spreadsheet.</p>
          <button onClick={downloadTemplate} style={styles.btnOutline}>📄 Download Full Template</button>
          <div style={styles.uploadWrapper}>
            <label style={styles.btnUpload}>
              {loading ? 'Processing...' : 'Upload Excel File'}
              <input type="file" accept=".xlsx, .xls" onChange={handleImport} style={{ display: 'none' }} disabled={loading} />
            </label>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.iconBox}>📥</div>
          <h3 style={styles.cardTitle}>Backup Registry</h3>
          <p style={styles.cardDesc}>Download all member data. (Note: Photos are stored on the server, not in the Excel file).</p>
          <button onClick={handleExport} disabled={loading} style={styles.btnPrimary}>💾 Save .xlsx Backup</button>
        </div>

        <div style={{...styles.card, border: '1px solid #fecaca', backgroundColor: '#fff5f5' }}>
          <div style={{...styles.iconBox, backgroundColor: '#fee2e2'}}>⚠️</div>
          <h3 style={{...styles.cardTitle, color: '#dc2626'}}>Factory Reset</h3>
          <p style={styles.cardDesc}>Wipe the entire member list. Use this to clear test data before launch.</p>
          <button onClick={handleClearDatabase} disabled={loading} style={styles.btnDanger}>🗑️ Wipe Database</button>
        </div>
      </div>
    </div>
  );
};

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
    btnPrimary: { width: '100%', padding: '12px', backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' },
    btnOutline: { width: '100%', padding: '12px', backgroundColor: 'transparent', color: '#001f3f', border: '2px solid #e2e8f0', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', fontSize: '0.95rem' },
    uploadWrapper: { width: '100%' },
    btnUpload: { display: 'block', width: '100%', padding: '12px', backgroundColor: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', fontSize: '0.95rem' },
    btnDanger: { width: '100%', padding: '12px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' },
};

export default DatabaseTab;
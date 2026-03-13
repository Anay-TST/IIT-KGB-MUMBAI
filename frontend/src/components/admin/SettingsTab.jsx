import React, { useState, useEffect } from 'react';
import api from '../../api';

const SettingsTab = () => {
  const [lists, setLists] = useState({
    degrees: [],
    departments: [],
    halls: [],
    maritalStatuses: [],
    sexOptions: []
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch the current lists from the database when the tab loads
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/api/config');
      setLists({
        degrees: data.degrees || [],
        departments: data.departments || [],
        halls: data.halls || [],
        maritalStatuses: data.maritalStatuses || [],
        sexOptions: data.sexOptions || []
      });
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

  // Convert the array to a string (one item per line) for the textarea
  const arrayToString = (arr) => arr.join('\n');

  // Convert the textarea string back to an array (ignoring empty lines)
  const stringToArray = (str) => str.split('\n').map(s => s.trim()).filter(s => s !== '');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLists({ ...lists, [name]: stringToArray(value) });
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      await api.put('/api/config', lists);
      setMessage('✅ Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      // THIS WILL PRINT THE EXACT REASON TO YOUR SCREEN AND CONSOLE
      const errorMessage = err.response?.data?.message || err.message || "Unknown Error";
      console.error("FULL ERROR DETAILS:", err.response || err);
      setMessage(`❌ Failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>System Settings & Dropdowns</h2>
        <p style={styles.subtitle}>Update the options available in the registration and profile forms. Enter one item per line.</p>
        <button onClick={handleSave} disabled={loading} style={styles.btnSave}>
          {loading ? 'Saving...' : '💾 Save All Changes'}
        </button>
        {message && <span style={styles.message}>{message}</span>}
      </div>

      <div style={styles.grid}>
        {/* DEGREES */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🎓 Degrees</h3>
          <textarea 
            name="degrees" 
            value={arrayToString(lists.degrees)} 
            onChange={handleChange} 
            style={styles.textarea} 
            placeholder="B.Tech&#10;M.Tech&#10;Ph.D"
          />
        </div>

        {/* DEPARTMENTS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📚 Departments</h3>
          <textarea 
            name="departments" 
            value={arrayToString(lists.departments)} 
            onChange={handleChange} 
            style={styles.textarea} 
          />
        </div>

        {/* HALLS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>🏢 Halls of Residence</h3>
          <textarea 
            name="halls" 
            value={arrayToString(lists.halls)} 
            onChange={handleChange} 
            style={styles.textarea} 
          />
        </div>

        {/* OTHER SETTINGS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>💍 Marital Statuses</h3>
          <textarea 
            name="maritalStatuses" 
            value={arrayToString(lists.maritalStatuses)} 
            onChange={handleChange} 
            style={{...styles.textarea, height: '100px'}} 
          />
          <h3 style={{...styles.cardTitle, marginTop: '15px'}}>⚧ Sex Options</h3>
          <textarea 
            name="sexOptions" 
            value={arrayToString(lists.sexOptions)} 
            onChange={handleChange} 
            style={{...styles.textarea, height: '80px'}} 
          />
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { width: '100%', padding: '10px' },
  header: { marginBottom: '20px' },
  title: { margin: 0, color: '#001f3f', fontSize: '1.8rem' },
  subtitle: { margin: '5px 0 15px 0', color: '#64748b' },
  btnSave: { padding: '12px 25px', backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' },
  message: { marginLeft: '15px', fontWeight: 'bold', color: '#dc2626' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
  cardTitle: { margin: '0 0 10px 0', fontSize: '1.1rem', color: '#0f172a' },
  textarea: { width: '100%', height: '250px', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', lineHeight: '1.5', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'monospace' }
};

export default SettingsTab;
import React, { useState, useEffect } from 'react';
import api from '../../api';

const SettingsTab = () => {
  const [config, setConfig] = useState({
    degrees: [], departments: [], halls: [], maritalStatuses: [], genders: []
  });
  
  const [newItems, setNewItems] = useState({
    degrees: '', departments: '', halls: '', maritalStatuses: '', genders: ''
  });

  const [editingItem, setEditingItem] = useState({ category: null, oldItem: null, newValue: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🌟 THE FIX: Helper function to guarantee alphabetical sorting
  const sortAlphabetically = (arr) => [...arr].sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const { data } = await api.get('/api/config');
      // Sort immediately upon loading just in case the database is out of order
      setConfig({
        degrees: sortAlphabetically(data.degrees || []),
        departments: sortAlphabetically(data.departments || []),
        halls: sortAlphabetically(data.halls || []),
        maritalStatuses: sortAlphabetically(data.maritalStatuses || []),
        genders: sortAlphabetically(data.genders || [])
      });
      setLoading(false);
    } catch (err) {
      console.error("Failed to load config", err);
      setLoading(false);
    }
  };

  // --- ADD ---
  const handleAdd = (category) => {
    const itemToAdd = newItems[category].trim();
    if (!itemToAdd) return;
    if (config[category].includes(itemToAdd)) return alert("This item already exists.");

    setConfig(prev => ({ 
      ...prev, 
      // 🌟 Sort the array immediately after adding the new item
      [category]: sortAlphabetically([...prev[category], itemToAdd]) 
    }));
    setNewItems(prev => ({ ...prev, [category]: '' }));
  };

  // --- REMOVE (DELETE) ---
  const handleRemove = (category, itemToRemove) => {
    if(!window.confirm(`Are you sure you want to delete "${itemToRemove}"?`)) return;
    setConfig(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item !== itemToRemove)
    }));
  };

  // --- MODIFY (EDIT) ---
  const startEdit = (category, item) => {
    setEditingItem({ category, oldItem: item, newValue: item });
  };

  const saveEdit = () => {
    const { category, oldItem, newValue } = editingItem;
    const trimmedValue = newValue.trim();

    if (!trimmedValue || trimmedValue === oldItem) {
      setEditingItem({ category: null, oldItem: null, newValue: '' });
      return;
    }
    if (config[category].includes(trimmedValue)) {
      alert("An item with this name already exists.");
      return;
    }

    setConfig(prev => {
      const updatedArray = prev[category].map(item => item === oldItem ? trimmedValue : item);
      return {
        ...prev,
        // 🌟 Sort the array immediately after editing an item
        [category]: sortAlphabetically(updatedArray)
      };
    });
    
    setEditingItem({ category: null, oldItem: null, newValue: '' });
  };

  // --- SAVE TO DATABASE ---
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/api/config', config);
      alert("System settings updated successfully!");
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading system settings...</div>;

  const renderCategory = (title, categoryKey, placeholder) => (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{title}</h3>
      
      {/* ADD INPUT */}
      <div style={styles.inputGroup}>
        <input 
          value={newItems[categoryKey]}
          onChange={e => setNewItems({ ...newItems, [categoryKey]: e.target.value })}
          onKeyPress={e => e.key === 'Enter' && handleAdd(categoryKey)}
          placeholder={placeholder}
          style={styles.input}
        />
        <button onClick={() => handleAdd(categoryKey)} style={styles.btnAdd}>Add</button>
      </div>

      {/* LIST OF ITEMS */}
      <div style={styles.tagContainer}>
        {config[categoryKey].length === 0 ? (
          <span style={styles.emptyText}>No items added yet.</span>
        ) : (
          config[categoryKey].map((item, idx) => {
            const isEditing = editingItem.category === categoryKey && editingItem.oldItem === item;
            
            return isEditing ? (
              <div key={idx} style={{...styles.tag, backgroundColor: '#fff', padding: '2px 4px'}}>
                <input 
                  autoFocus
                  value={editingItem.newValue} 
                  onChange={e => setEditingItem({...editingItem, newValue: e.target.value})}
                  onKeyPress={e => e.key === 'Enter' && saveEdit()}
                  style={{...styles.input, padding: '4px 8px', width: '120px'}}
                />
                <button onClick={saveEdit} style={styles.btnAction}>💾</button>
                <button onClick={() => setEditingItem({ category: null, oldItem: null, newValue: '' })} style={styles.btnAction}>✕</button>
              </div>
            ) : (
              <div key={idx} style={styles.tag}>
                {item}
                <div style={{ marginLeft: '10px', display: 'flex', gap: '5px' }}>
                  <button onClick={() => startEdit(categoryKey, item)} title="Modify" style={styles.btnAction}>✎</button>
                  <button onClick={() => handleRemove(categoryKey, item)} title="Delete" style={{...styles.btnAction, color: '#ef4444'}}>✕</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>System Settings</h1>
          <p style={styles.subtitle}>Manage dropdown options for alumni registration and profiles.</p>
        </div>
        <button onClick={handleSave} disabled={saving} style={styles.btnSave}>
          {saving ? 'Saving...' : '💾 Save All Changes'}
        </button>
      </div>

      <div style={styles.grid}>
        {renderCategory("Degrees", "degrees", "e.g., BSc, MArch")}
        {renderCategory("Departments", "departments", "e.g., Aerospace Engineering")}
        {renderCategory("Halls of Residence", "halls", "e.g., RK Hall")}
        {renderCategory("Marital Statuses", "maritalStatuses", "e.g., Unmarried")}
        {renderCategory("Genders", "genders", "e.g., Prefer not to say")}
      </div>
      
    </div>
  );
};

const styles = {
  container: { fontFamily: '"Inter", sans-serif', paddingBottom: '40px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
  pageTitle: { margin: 0, color: '#001f3f', fontSize: '1.8rem', fontWeight: '800' },
  subtitle: { margin: '5px 0 0 0', color: '#64748b' },
  
  btnSave: { backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', padding: '12px 25px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' },
  card: { backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', border: '1px solid #e2e8f0' },
  cardTitle: { margin: '0 0 15px 0', color: '#001f3f', fontSize: '1.1rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' },
  
  inputGroup: { display: 'flex', gap: '10px', marginBottom: '15px' },
  input: { flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' },
  btnAdd: { backgroundColor: '#f8fafc', color: '#001f3f', border: '1px solid #cbd5e1', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  
  tagContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '40px' },
  tag: { display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', color: '#334155', padding: '6px 12px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid #e2e8f0' },
  btnAction: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', padding: '0 2px' },
  emptyText: { color: '#94a3b8', fontSize: '0.85rem', fontStyle: 'italic', padding: '10px 0' }
};

export default SettingsTab;
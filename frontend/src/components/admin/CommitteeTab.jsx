import React, { useState } from 'react';
import api from '../../api';

const CommitteeTab = ({ committee, members, refresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [title, setTitle] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    
    // Find the actual member ID based on the exact name/batch they clicked
    const selectedMember = members.find(
      m => `${m.firstName} ${m.lastName} - Batch of ${m.yearOfGraduation}` === searchTerm
    );

    if (!selectedMember || !title) {
      return alert("Please select a valid member from the dropdown suggestions and enter a role.");
    }

    // Send the correct _id to your backend
    await api.post('/api/committee', { memberId: selectedMember._id, title, order: committee.length });
    
    // Clear the form
    setTitle(''); 
    setSearchTerm(''); 
    refresh();
  };

  const move = async (index, dir) => {
    const newItems = [...committee];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    await api.patch('/api/committee/reorder', { orders: newItems.map((item, idx) => ({ id: item._id, order: idx })) });
    refresh();
  };

  return (
    <div>
      <h1 style={{ color: '#003366', marginBottom: '20px' }}>Committee Management</h1>
      
      <form onSubmit={handleAdd} style={styles.formCard}>
        
        {/* --- THE NATIVE SEARCHABLE INPUT --- */}
        <div style={{ flex: 1 }}>
          <input 
            list="approved-members-list" 
            placeholder="Search Life Members (type 3-4 letters)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ ...styles.input, width: '100%', boxSizing: 'border-box' }}
          />
          
          {/* THE FIX: Added && m.isLifeMember to the filter below! */}
          <datalist id="approved-members-list">
            {members.filter(m => m.isApproved && m.isLifeMember).map(m => (
              <option 
                key={m._id} 
                value={`${m.firstName} ${m.lastName} - Batch of ${m.yearOfGraduation}`} 
              />
            ))}
          </datalist>
        </div>
        {/* ---------------------------------- */}

        <input 
          placeholder="Role (e.g. President)" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          style={styles.input} 
        />
        <button type="submit" style={styles.btnBlue}>Add to Team</button>
      </form>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order</th>
              <th style={styles.th}>Member</th>
              <th style={styles.th}>Position</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {committee.map((c, idx) => (
              <tr key={c._id} style={styles.tr}>
                <td style={styles.td}>
                  <button onClick={() => move(idx, 'up')} disabled={idx === 0} style={{ cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '4px 8px', marginRight: '5px' }}>▲</button>
                  <button onClick={() => move(idx, 'down')} disabled={idx === committee.length - 1} style={{ cursor: idx === committee.length - 1 ? 'not-allowed' : 'pointer', padding: '4px 8px' }}>▼</button>
                </td>
                <td style={styles.td}>{c.member?.firstName} {c.member?.lastName}</td>
                <td style={styles.td}><strong>{c.title}</strong></td>
                <td style={styles.td}>
                  <button onClick={() => api.delete(`/api/committee/${c._id}`).then(refresh)} style={styles.btnDelete}>Remove</button>
                </td>
              </tr>
            ))}
            {committee.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                  No committee members added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '30px', display: 'flex', gap: '15px', alignItems: 'flex-start' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', flex: 1, fontSize: '1rem' },
  btnBlue: { backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', height: '100%', fontSize: '1rem' },
  tableCard: { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', borderBottom: '2px solid #e2e8f0' },
  td: { padding: '15px', borderBottom: '1px solid #f1f5f9', verticalAlign: 'middle' },
  btnDelete: { backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }
};

export default CommitteeTab;
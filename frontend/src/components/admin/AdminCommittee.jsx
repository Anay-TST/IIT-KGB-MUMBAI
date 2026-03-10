import React, { useState } from 'react';
import api from '../../api';

const AdminCommittee = ({ committee, members, fetchAll }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [committeeTitle, setCommitteeTitle] = useState('');

  const addToCommittee = async (e) => {
    e.preventDefault();
    await api.post('/api/committee', { memberId: selectedMemberId, title: committeeTitle, order: committee.length });
    setCommitteeTitle(''); 
    setSelectedMemberId(''); 
    fetchAll();
  };

  const moveComm = async (index, dir) => {
    const newItems = [...committee];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    
    // We update local state immediately so UI feels snappy, then hit API
    await api.patch('/api/committee/reorder', { orders: newItems.map((item, idx) => ({ id: item._id, order: idx })) });
    fetchAll(); // Refresh from DB
  };

  return (
    <>
      <h1>Committee Management</h1>
      <form onSubmit={addToCommittee} style={styles.formCard}>
        <select style={{...styles.inputS, flex: 2}} value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}>
          <option value="">Select Member...</option>
          {members.filter(m => m.isApproved).map(m => (<option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>))}
        </select>
        <input placeholder="Position" value={committeeTitle} onChange={e => setCommitteeTitle(e.target.value)} style={{...styles.inputS, flex: 1}} />
        <button type="submit" style={styles.btnBlue}>Add</button>
      </form>
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <tbody>
            {committee.map((c, idx) => (
              <tr key={c._id}>
                <td style={styles.td}>
                  <button onClick={() => moveComm(idx, 'up')} disabled={idx === 0}>▲</button>
                  <button onClick={() => moveComm(idx, 'down')} disabled={idx === committee.length - 1}>▼</button>
                </td>
                <td style={styles.td}>{c.member?.firstName} {c.member?.lastName}</td>
                <td style={styles.td}><strong>{c.title}</strong></td>
                <td style={styles.td}><button onClick={() => api.delete(`/api/committee/${c._id}`).then(fetchAll)} style={styles.btnDelete}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const styles = {
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #eee' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  td: { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  inputS: { padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px', width: '100%', boxSizing: 'border-box', fontSize: '14px' }
};

export default AdminCommittee;
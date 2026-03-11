import React, { useState } from 'react';
import api from '../../api';

const CommitteeTab = ({ committee, members, refresh }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [title, setTitle] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !title) return alert("Fill all fields");
    await api.post('/api/committee', { memberId: selectedMemberId, title, order: committee.length });
    setTitle(''); setSelectedMemberId(''); refresh();
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
      <h1>Committee Management</h1>
      <form onSubmit={handleAdd} style={styles.formCard}>
        <select value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)} style={styles.input}>
          <option value="">Choose Approved Member...</option>
          {members.filter(m => m.isApproved).map(m => (
            <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
          ))}
        </select>
        <input placeholder="Role (e.g. President)" value={title} onChange={e => setTitle(e.target.value)} style={styles.input} />
        <button type="submit" style={styles.btnBlue}>Add to Team</button>
      </form>

      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr><th style={styles.th}>Order</th><th style={styles.th}>Member</th><th style={styles.th}>Position</th><th style={styles.th}>Action</th></tr>
          </thead>
          <tbody>
            {committee.map((c, idx) => (
              <tr key={c._id} style={styles.tr}>
                <td style={styles.td}>
                  <button onClick={() => move(idx, 'up')} disabled={idx === 0}>▲</button>
                  <button onClick={() => move(idx, 'down')} disabled={idx === committee.length - 1}>▼</button>
                </td>
                <td style={styles.td}>{c.member?.firstName} {c.member?.lastName}</td>
                <td style={styles.td}><strong>{c.title}</strong></td>
                <td style={styles.td}>
                  <button onClick={() => api.delete(`/api/committee/${c._id}`).then(refresh)} style={styles.btnDelete}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '15px', marginBottom: '30px', display: 'flex', gap: '10px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', flex: 1 },
  btnBlue: { backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' },
  tableCard: { backgroundColor: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '15px', textAlign: 'left', backgroundColor: '#f8fafc', fontSize: '0.8rem' },
  td: { padding: '15px', borderBottom: '1px solid #f1f5f9' },
  btnDelete: { backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }
};

export default CommitteeTab;
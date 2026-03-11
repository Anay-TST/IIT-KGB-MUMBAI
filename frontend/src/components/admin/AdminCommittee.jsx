import React, { useState } from 'react';
import api from '../api'; 
import styles from './AdminStyles';

const AdminCommittee = ({ members, committee, setCommittee, fetchAll }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [committeeTitle, setCommitteeTitle] = useState('');

  const addToCommittee = async (e) => {
    e.preventDefault();
    if (!selectedMemberId || !committeeTitle) return alert("Please select a member and enter a position.");
    await api.post('/api/committee', { memberId: selectedMemberId, title: committeeTitle, order: committee.length });
    setCommitteeTitle(''); setSelectedMemberId(''); fetchAll();
  };

  const moveComm = async (index, dir) => {
    const newItems = [...committee];
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setCommittee(newItems);
    await api.patch('/api/committee/reorder', { orders: newItems.map((item, idx) => ({ id: item._id, order: idx })) });
  };

  return (
    <>
      <h1>Committee</h1>
      <form onSubmit={addToCommittee} style={styles.formCard}>
        <select style={{...styles.inputS, flex: 2}} value={selectedMemberId} onChange={e => setSelectedMemberId(e.target.value)}>
          <option value="">Select Member...</option>
          {members
            // FIX: This now properly includes both standard approved members AND Life Members
            .filter(m => m.isApproved || m.status === 'Life Member' || m.status === 'General' || m.status === 'Active')
            .map(m => (
              <option key={m._id} value={m._id}>
                {m.firstName} {m.lastName} {m.isLifeMember ? '(Life Member)' : ''}
              </option>
            ))}
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
                  <button onClick={() => moveComm(idx, 'up')} disabled={idx===0} style={{marginRight: '5px'}}>▲</button> 
                  <button onClick={() => moveComm(idx, 'down')} disabled={idx===committee.length-1}>▼</button>
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

export default AdminCommittee;
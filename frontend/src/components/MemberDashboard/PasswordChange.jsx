import React, { useState } from 'react';
import api from '../../api';

const PasswordChange = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return setMessage({ type: 'error', text: 'New passwords do not match.' });
    }
    if (newPassword.length < 6) {
      return setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.put('/api/auth/change-password', {
        oldPassword,
        newPassword
      });
      setMessage({ type: 'success', text: data.message });
      setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>🔒 Security Settings</h3>
      <p style={styles.subtitle}>Update your password to keep your account secure.</p>

      {message.text && (
        <div style={{ ...styles.alert, backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce3', color: message.type === 'error' ? '#dc2626' : '#16a34a' }}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Current Password</label>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required style={styles.input} />
        </div>
        <button type="submit" disabled={loading} style={styles.btnSave}>
          {loading ? 'Updating...' : 'Change Password'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', maxWidth: '500px' },
  title: { margin: '0 0 5px 0', color: '#001f3f' },
  subtitle: { margin: '0 0 20px 0', color: '#64748b', fontSize: '0.9rem' },
  alert: { padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.85rem', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.8rem', fontWeight: 'bold', color: '#475569' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' },
  btnSave: { padding: '12px', backgroundColor: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }
};

export default PasswordChange;
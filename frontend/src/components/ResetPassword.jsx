import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

const ResetPassword = () => {
  // Grab the secret token directly from the URL
  const { token } = useParams(); 
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match!' });
    }
    if (password.length < 6) {
      return setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Send the new password to the backend using the token from the URL
      const { data } = await api.put(`/api/auth/reset-password/${token}`, { password });
      
      setMessage({ type: 'success', text: data.message });
      setIsSuccess(true);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Invalid or expired reset token.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Secure Your Account</h2>
        <p style={styles.subtitle}>Please enter your new password below.</p>

        {message.text && (
          <div style={{ ...styles.alert, backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce3', color: message.type === 'error' ? '#dc2626' : '#16a34a' }}>
            {message.text}
          </div>
        )}

        {/* Hide the form if they successfully reset the password */}
        {!isSuccess ? (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>New Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={styles.input} 
                placeholder="••••••••"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input 
                type="password" 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                style={styles.input} 
                placeholder="••••••••"
              />
            </div>

            <button type="submit" disabled={loading} style={styles.btnMain}>
              {loading ? 'Updating...' : 'Set New Password'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Link to="/login" style={styles.btnLoginLink}>
              Click here to Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f6', padding: '20px' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' },
  title: { color: '#001f3f', margin: '0 0 10px 0', fontSize: '1.8rem', textAlign: 'center' },
  subtitle: { color: '#64748b', margin: '0 0 25px 0', fontSize: '0.9rem', textAlign: 'center', lineHeight: '1.5' },
  alert: { padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' },
  btnMain: { backgroundColor: '#fbbf24', color: '#001f3f', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px' },
  btnLoginLink: { display: 'inline-block', backgroundColor: '#001f3f', color: '#fbbf24', padding: '12px 24px', textDecoration: 'none', borderRadius: '8px', fontWeight: 'bold' }
};

export default ResetPassword;
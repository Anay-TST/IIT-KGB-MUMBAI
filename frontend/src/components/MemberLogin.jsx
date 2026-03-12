import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MemberLogin = () => {
  const navigate = useNavigate();
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      
      // Save the Digital ID Card to the browser
      localStorage.setItem('memberToken', data.token);
      localStorage.setItem('memberData', JSON.stringify(data));
      
      // Force a full page reload so the Navbar updates to show the Dashboard button
      window.location.href = '/member-dashboard'; 
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Login failed. Check credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      return setMessage({ type: 'error', text: 'Please enter your email address first.' });
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      setMessage({ type: 'success', text: data.message });
      setEmail(''); // Clear the input
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send reset email.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isForgotMode ? 'Reset Password' : 'Alumni Portal'}</h2>
        <p style={styles.subtitle}>
          {isForgotMode 
            ? 'Enter your registered email and we will send you a reset link.' 
            : 'Welcome back! Log in to access the community.'}
        </p>

        {message.text && (
          <div style={{ ...styles.alert, backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce3', color: message.type === 'error' ? '#dc2626' : '#16a34a' }}>
            {message.text}
          </div>
        )}

        <form onSubmit={isForgotMode ? handleForgotPassword : handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              style={styles.input} 
              placeholder="you@example.com"
            />
          </div>

          {!isForgotMode && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                style={styles.input} 
                placeholder="••••••••"
              />
            </div>
          )}

          <button type="submit" disabled={loading} style={styles.btnMain}>
            {loading ? 'Processing...' : (isForgotMode ? 'Send Reset Link' : 'Log In')}
          </button>
        </form>

        <div style={styles.footer}>
          <button 
            type="button" 
            onClick={() => { setIsForgotMode(!isForgotMode); setMessage({ type: '', text: '' }); }} 
            style={styles.toggleBtn}
          >
            {isForgotMode ? 'Back to Login' : 'Forgot your password?'}
          </button>
        </div>
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
  footer: { marginTop: '20px', textAlign: 'center' },
  toggleBtn: { background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }
};

export default MemberLogin;
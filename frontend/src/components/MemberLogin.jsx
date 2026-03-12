import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const MemberLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // NEW: State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('memberToken', res.data.token);
      navigate('/member-dashboard');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Login failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data } = await api.post('/api/auth/forgot-password', { email: resetEmail });
      setMessage({ type: 'success', text: data.message });
      setResetEmail(''); 
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send reset email.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>{isForgotPassword ? 'Reset Password' : 'Member Login'}</h2>
        
        {message.text && (
          <div style={{ ...styles.alert, backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce3', color: message.type === 'error' ? '#dc2626' : '#16a34a' }}>
            {message.text}
          </div>
        )}

        {!isForgotPassword ? (
          // --- STANDARD LOGIN FORM ---
          <form onSubmit={handleLogin} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  style={styles.input} 
                />
                {/* THE TOGGLE BUTTON */}
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={styles.eyeButton} title="Toggle Password Visibility">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={styles.btnMain}>
              {loading ? 'Authenticating...' : 'Secure Login'}
            </button>

            <button type="button" onClick={() => { setIsForgotPassword(true); setMessage({type:'', text:''}); }} style={styles.btnLink}>
              Forgot your password?
            </button>
          </form>
        ) : (
          // --- FORGOT PASSWORD FORM ---
          <form onSubmit={handleForgotPassword} style={styles.form}>
            <p style={styles.subtitle}>Enter your registered email address and we will send you a secure link to reset your password.</p>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} style={styles.input} />
            </div>
            
            <button type="submit" disabled={loading} style={styles.btnMain}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <button type="button" onClick={() => { setIsForgotPassword(false); setMessage({type:'', text:''}); }} style={styles.btnLink}>
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f7f6', padding: '20px' },
  card: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' },
  title: { color: '#001f3f', margin: '0 0 20px 0', fontSize: '1.8rem', textAlign: 'center' },
  subtitle: { color: '#64748b', fontSize: '0.9rem', marginBottom: '20px', lineHeight: '1.5', textAlign: 'center' },
  alert: { padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem', textAlign: 'center', fontWeight: 'bold' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase' },
  passwordWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  input: { width: '100%', padding: '12px', paddingRight: '45px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' },
  eyeButton: { position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  btnMain: { backgroundColor: '#fbbf24', color: '#001f3f', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px', transition: 'background-color 0.2s' },
  btnLink: { background: 'none', border: 'none', color: '#001f3f', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.85rem', marginTop: '5px' }
};

export default MemberLogin;
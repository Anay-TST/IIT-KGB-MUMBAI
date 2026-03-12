import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import ProfileEdit from './ProfileEdit';
import PasswordChange from './PasswordChange';

const MemberDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const fetchUserData = async () => {
    try {
      // The interceptor automatically attaches the token!
      const { data } = await api.get('/api/auth/me');
      setUserData(data);
    } catch (err) {
      console.error("Auth failed:", err);
      localStorage.removeItem('memberToken');
      navigate('/login'); // Kick them out if token is invalid
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('memberToken');
    if (!token) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [navigate]);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading your dashboard...</div>;
  if (!userData) return null;

  return (
    <div style={styles.container}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.greeting}>Hi, {userData.firstName}!</h2>
        <p style={styles.status}>Status: {userData.isApproved ? 'Approved Member' : 'Pending'}</p>
        
        <div style={styles.nav}>
          <button 
            onClick={() => setActiveTab('profile')} 
            style={activeTab === 'profile' ? styles.activeBtn : styles.navBtn}
          >
            👤 Edit Profile
          </button>
          <button 
            onClick={() => setActiveTab('security')} 
            style={activeTab === 'security' ? styles.activeBtn : styles.navBtn}
          >
            🔒 Security
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={styles.mainContent}>
        {activeTab === 'profile' && <ProfileEdit userData={userData} refreshData={fetchUserData} />}
        {activeTab === 'security' && <PasswordChange />}
      </main>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '80vh', maxWidth: '1200px', margin: '40px auto', gap: '30px', padding: '0 20px' },
  sidebar: { width: '250px', backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', height: 'fit-content' },
  greeting: { margin: '0 0 5px 0', color: '#001f3f', fontSize: '1.5rem' },
  status: { margin: '0 0 25px 0', color: '#16a34a', fontSize: '0.85rem', fontWeight: 'bold' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px' },
  navBtn: { padding: '12px 15px', textAlign: 'left', background: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', color: '#475569', fontWeight: 'bold', transition: '0.2s' },
  activeBtn: { padding: '12px 15px', textAlign: 'left', background: '#f0f9ff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', color: '#001f3f', fontWeight: 'bold' },
  mainContent: { flex: 1 }
};

export default MemberDashboard;
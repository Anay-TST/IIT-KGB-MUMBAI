import React, { useState, useEffect } from 'react';
import api from '../../api';
import { isAdminAuthenticated, setAdminSession, logoutAdmin } from '../../utils/auth';
import MemberTab from './MemberTab';
import CommitteeTab from './CommitteeTab';
import EventTab from './EventTab';
import DocumentTab from './DocumentTab';
import DatabaseTab from './DatabaseTab';
import SettingsTab from './SettingsTab'; // 🌟 NEW IMPORT

const AdminPanel = () => {
  const [auth, setAuth] = useState(isAdminAuthenticated());
  const [pass, setPass] = useState('');
  const [activeTab, setActiveTab] = useState('members');
  const [data, setData] = useState({ members: [], committee: [], docs: [], events: [] });

  const fetchAll = async () => {
    try {
      // SAFETY FIX: Added .catch() to each request. 
      // If a backend route is temporarily disabled, it just returns an empty array instead of crashing the page.
      const [memRes, commRes, docRes, eventRes] = await Promise.all([
        api.get('/api/alumni/all').catch(() => ({ data: [] })),
        api.get('/api/committee').catch(() => ({ data: [] })),
        api.get('/api/documents').catch(() => ({ data: [] })),
        api.get('/api/events').catch(() => ({ data: [] }))
      ]);
      
      setData({
        members: memRes.data || [],
        committee: (commRes.data || []).sort((a, b) => (a.order || 0) - (b.order || 0)),
        docs: docRes.data || [],
        events: eventRes.data || []
      });
    } catch (err) { 
      console.error("Fetch Error:", err); 
    }
  };

  useEffect(() => {
    if (auth) fetchAll();
  }, [auth]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === 'Loki12345') {
      setAdminSession(); 
      setAuth(true);
    } else {
      alert('Wrong Password');
    }
  };

  const handleLogout = () => {
    logoutAdmin(); 
    setAuth(false);
    window.location.reload(); 
  };

  if (!auth) return (
    <div style={styles.loginCenter}>
      <form onSubmit={handleLogin} style={styles.loginBox}>
        <h2 style={{color: '#001f3f'}}>Admin Secure Access</h2>
        <input type="password" placeholder="Password" onChange={e => setPass(e.target.value)} style={styles.inputS} />
        <button type="submit" style={styles.btnBlueFull}>Login</button>
      </form>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6' }}>
      <aside style={styles.sidebar}>
        <h3 style={{color: '#fbbf24', marginBottom: '30px'}}>KGP Admin</h3>
        
        <div style={activeTab === 'members' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('members')}>👥 Members</div>
        <div style={activeTab === 'committee' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('committee')}>🏛️ Committee</div>
        <div style={activeTab === 'events' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('events')}>📅 Events</div>
        <div style={activeTab === 'docs' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('docs')}>📄 Documents</div>
        <div style={activeTab === 'database' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('database')}>💾 Database</div>
        
        {/* 🌟 NEW: Settings Sidebar Item */}
        <div style={activeTab === 'settings' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('settings')}>⚙️ Settings</div>

        <div onClick={handleLogout} style={styles.logoutBtn}>Sign Out</div>
      </aside>

      <main style={{ flex: 1, padding: '40px', marginLeft: '240px' }}>
        {activeTab === 'members' && <MemberTab members={data.members} refresh={fetchAll} />}
        {activeTab === 'committee' && <CommitteeTab committee={data.committee} members={data.members} refresh={fetchAll} />}
        {activeTab === 'events' && <EventTab events={data.events} refresh={fetchAll} />}
        {activeTab === 'docs' && <DocumentTab docs={data.docs} refresh={fetchAll} />}
        {activeTab === 'database' && <DatabaseTab refresh={fetchAll} />}
        
        {/* 🌟 NEW: Render Settings Tab */}
        {activeTab === 'settings' && <SettingsTab />}
      </main>
    </div>
  );
};

const styles = {
  sidebar: { width: '240px', backgroundColor: '#001f3f', color: 'white', padding: '30px 20px', position: 'fixed', height: '100vh' },
  sidebarItem: { padding: '15px', cursor: 'pointer', borderRadius: '10px', marginBottom: '5px', transition: '0.3s' },
  sidebarActive: { padding: '15px', cursor: 'pointer', borderRadius: '10px', backgroundColor: '#fbbf24', color: '#001f3f', fontWeight: 'bold' },
  logoutBtn: { marginTop: '40px', color: '#f87171', cursor: 'pointer', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' },
  inputS: { padding: '12px', border: '1px solid #e2e8f0', borderRadius: '10px', width: '100%', marginBottom: '15px', boxSizing: 'border-box' },
  btnBlueFull: { backgroundColor: '#001f3f', color: '#fbbf24', padding: '15px', border: 'none', borderRadius: '12px', cursor: 'pointer', width: '100%', fontWeight: 'bold' },
  loginCenter: { height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#001f3f' },
  loginBox: { backgroundColor: 'white', padding: '50px', borderRadius: '30px', textAlign: 'center', width: '350px' }
};

export default AdminPanel;
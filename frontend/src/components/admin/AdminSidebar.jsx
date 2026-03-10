import React from 'react';

const AdminSidebar = ({ activeTab, setActiveTab, setAuth }) => {
  return (
    <div style={styles.sidebar}>
      <h3 style={{borderBottom: '1px solid #003366', paddingBottom: '10px'}}>Dashboard</h3>
      <div style={activeTab === 'members' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('members')}>👥 Members</div>
      <div style={activeTab === 'committee' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('committee')}>🏛️ Committee</div>
      <div style={activeTab === 'docs' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('docs')}>📄 Documents</div>
      <div style={activeTab === 'events' ? styles.sidebarActive : styles.sidebarItem} onClick={() => setActiveTab('events')}>📅 Events</div>
      <div onClick={() => setAuth(false)} style={styles.logoutBtn}>🚪 Logout</div>
    </div>
  );
};

const styles = {
  sidebar: { width: '220px', backgroundColor: '#001f3f', color: 'white', padding: '20px', position: 'fixed', height: '100vh', boxSizing: 'border-box' },
  sidebarItem: { padding: '12px', cursor: 'pointer', borderRadius: '5px', marginBottom: '5px', transition: '0.2s' },
  sidebarActive: { padding: '12px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#003366', fontWeight: 'bold', marginBottom: '5px' },
  logoutBtn: { marginTop: '40px', color: '#ff4d4d', cursor: 'pointer', padding: '12px', fontWeight: 'bold' },
};

export default AdminSidebar;
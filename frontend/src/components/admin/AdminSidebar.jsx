import React from 'react';
import styles from './AdminStyles';

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

export default AdminSidebar;
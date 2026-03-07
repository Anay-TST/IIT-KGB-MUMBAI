import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';
import Gallery from './Gallery';

const HomePage = () => {
  const [events, setEvents] = useState([]);
  const [latestMembers, setLatestMembers] = useState([]);
  const [recentDocs, setRecentDocs] = useState([]);
  const [stats, setStats] = useState({ members: 0, events: 0 });
  
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [eventRes, memberRes, docRes] = await Promise.all([
          api.get('/api/events'),
          api.get('/api/alumni/all'),
          api.get('/api/documents')
        ]);
        
        const approvedMembers = memberRes.data.filter(m => m.isApproved);
        setEvents(eventRes.data);
        setLatestMembers(approvedMembers.reverse().slice(0, 5));
        setRecentDocs(docRes.data.reverse().slice(0, 4));
        setStats({
            members: approvedMembers.length,
            events: eventRes.data.length
        });
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchHomeData();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.filter(e => new Date(e.date) >= today).slice(0, 2);
  const past = events.filter(e => new Date(e.date) < today).slice(0, 2);

  return (
    <div style={styles.page}>
      
      {/* 1. COMPACT HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>IIT KHARAGPUR</span>
          <h1 style={styles.heroTitle}>Mumbai Alumni Chapter</h1>
          <p style={styles.heroSubtitle}>Connecting excellence across generations.</p>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section style={styles.statsBar}>
        <div style={styles.statItem}><strong style={styles.statNum}>{stats.members}+</strong> <span style={styles.statLabel}>Alumni</span></div>
        <div style={styles.statDivider}></div>
        <div style={styles.statItem}><strong style={styles.statNum}>{stats.events}</strong> <span style={styles.statLabel}>Events</span></div>
        <div style={styles.statDivider}></div>
        <div style={styles.statItem}><strong style={styles.statNum}>1951</strong> <span style={styles.statLabel}>Founded</span></div>
      </section>

      <div style={styles.layoutGrid}>
        
        {/* 3. MAIN CONTENT */}
        <main style={styles.mainContent}>
          <div style={styles.sectionHeading}>
            <h2 style={styles.sectionTitle}>Upcoming Events</h2>
          </div>
          
          <div style={styles.eventStack}>
            {upcoming.length > 0 ? upcoming.map(e => (
              <EventCard key={e._id} event={e} isPast={false} />
            )) : <div style={styles.emptyBox}>No events scheduled right now. Check back soon!</div>}
          </div>

          <div style={{ ...styles.sectionHeading, marginTop: '50px' }}>
            <h2 style={styles.sectionTitle}>Past Memories</h2>
          </div>
          
          <div style={styles.eventStack}>
            {past.map(e => <EventCard key={e._id} event={e} isPast={true} />)}
          </div>
        </main>

        {/* 4. SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={styles.glassCard}>
            <h3 style={styles.sidebarHeader}>New Arrivals</h3>
            <div style={styles.memberList}>
              {latestMembers.map(m => (
                <div key={m._id} style={styles.memberRow}>
                  <img src={m.profilePic ? `${BACKEND_URL}${m.profilePic}` : defaultAvatar} style={styles.avatar} alt="" />
                  <div style={styles.memberInfo}>
                    <div style={styles.mName}>{m.firstName} {m.lastName}</div>
                    <div style={styles.mBatch}>' {m.yearOfGraduation.toString().slice(-2)} • {m.hall}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...styles.glassCard, marginTop: '25px' }}>
            <h3 style={styles.sidebarHeader}>Latest Documents</h3>
            <div style={styles.docList}>
              {recentDocs.map(d => (
                <a key={d._id} href={`${BACKEND_URL}${d.filePath}`} target="_blank" rel="noreferrer" style={styles.docLink}>
                  <div style={styles.docIcon}>PDF</div>
                  <div style={styles.docText}>{d.title}</div>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

const EventCard = ({ event, isPast }) => {
  const d = new Date(event.date);
  return (
    <div style={styles.modernCard}>
      <div style={styles.cardMain}>
        <div style={styles.dateSide}>
          <span style={styles.dateD}>{d.getDate()}</span>
          <span style={styles.dateM}>{d.toLocaleString('default', { month: 'short' })}</span>
        </div>
        <div style={styles.infoSide}>
          <h4 style={styles.cardTitle}>{event.title}</h4>
          <p style={styles.cardLoc}>📍 {event.location}</p>
          <p style={styles.cardDesc}>{event.description}</p>
        </div>
      </div>
      {isPast && <Gallery images={event.images} videos={event.videos} />}
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  
  hero: { 
    position: 'relative', 
    height: '35vh', // Compact height
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundImage: 'url("https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80")',
    backgroundSize: 'cover', 
    backgroundPosition: 'center', 
    color: 'white', 
    textAlign: 'center'
  },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, rgba(0,20,40,0.85), rgba(0,20,40,0.6))' },
  heroContent: { position: 'relative', zIndex: 2, padding: '0 20px' },
  heroBadge: { backgroundColor: '#fbbf24', color: '#001f3f', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' },
  heroTitle: { fontSize: '2.5rem', margin: '10px 0 5px 0', fontWeight: '800' },
  heroSubtitle: { fontSize: '1rem', opacity: 0.8, fontWeight: '300' },

  statsBar: { maxWidth: '900px', margin: '-40px auto 0', position: 'relative', zIndex: 5, backgroundColor: 'white', borderRadius: '12px', display: 'flex', padding: '20px', boxShadow: '0 15px 30px rgba(0,0,0,0.08)', justifyContent: 'space-around', textAlign: 'center', border: '1px solid #eee' },
  statItem: { flex: 1 },
  statNum: { display: 'block', fontSize: '1.4rem', color: '#001f3f' },
  statLabel: { fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statDivider: { width: '1px', backgroundColor: '#f0f0f0' },

  layoutGrid: { maxWidth: '1100px', margin: '50px auto', padding: '0 20px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '40px' },
  
  sectionHeading: { marginBottom: '25px', borderLeft: '4px solid #fbbf24', paddingLeft: '15px' },
  sectionTitle: { fontSize: '1.5rem', color: '#001f3f', margin: 0, fontWeight: '700' },
  eventStack: { display: 'flex', flexDirection: 'column', gap: '20px' },
  modernCard: { backgroundColor: '#fff', borderRadius: '16px', padding: '25px', boxShadow: '0 2px 15px rgba(0,0,0,0.02)', border: '1px solid #f0f0f0' },
  cardMain: { display: 'flex', gap: '20px' },
  dateSide: { textAlign: 'center', minWidth: '50px' },
  dateD: { display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: '#001f3f' },
  dateM: { color: '#fbbf24', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.8rem' },
  infoSide: { flex: 1 },
  cardTitle: { margin: 0, fontSize: '1.2rem', color: '#001f3f', fontWeight: '700' },
  cardLoc: { color: '#888', fontSize: '0.85rem', margin: '4px 0' },
  cardDesc: { color: '#555', lineHeight: '1.5', fontSize: '0.9rem' },

  glassCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '16px', border: '1px solid #f0f0f0', boxShadow: '0 5px 20px rgba(0,0,0,0.01)' },
  sidebarHeader: { fontSize: '1rem', color: '#001f3f', borderBottom: '1px solid #f5f5f5', paddingBottom: '12px', marginBottom: '15px', fontWeight: '700' },
  memberList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  memberRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '40px', height: '40px', borderRadius: '10px', objectFit: 'cover' },
  mName: { fontWeight: 'bold', fontSize: '0.85rem', color: '#333' },
  mBatch: { fontSize: '0.7rem', color: '#999' },

  docList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  docLink: { display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '8px', padding: '8px', borderRadius: '8px', backgroundColor: '#f9fafb' },
  docIcon: { fontSize: '0.55rem', fontWeight: 'bold', color: '#fff', backgroundColor: '#dc3545', padding: '3px 5px', borderRadius: '3px' },
  docText: { fontSize: '0.8rem', color: '#001f3f', fontWeight: '500' },
  emptyBox: { padding: '30px', textAlign: 'center', color: '#bbb', fontSize: '0.9rem', backgroundColor: '#f9f9f9', borderRadius: '16px', border: '1px dashed #eee' }
};

export default HomePage;
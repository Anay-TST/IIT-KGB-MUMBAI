import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';

const CommitteePage = () => {
  const [committee, setCommittee] = useState([]);
  const defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => {
    api.get('/api/committee')
      .then(res => setCommittee(res.data))
      .catch(err => console.error("Error fetching committee:", err));
  }, []);

  return (
    <div style={styles.pageWrapper}>
      
      {/* 1. COMPACT HERO HEADER */}
      <header style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>LEADERSHIP</span>
          <h1 style={styles.heroTitle}>Executive Committee</h1>
          <p style={styles.heroSubtitle}>The dedicated team driving the IIT KGP Mumbai Alumni Chapter.</p>
        </div>
      </header>

      {/* 2. COMMITTEE GRID */}
      <div style={styles.container}>
        <div style={styles.gridContainer}>
          {committee.map(c => (
            <div key={c._id} style={styles.cardStyle} className="committee-card">
              <div style={styles.imgContainer}>
                <img 
                  src={c.member?.profilePic ? `${BACKEND_URL}${c.member.profilePic}` : defaultAvatar} 
                  alt="Committee Member"
                  style={styles.imgStyle}
                  onError={(e) => e.target.src = defaultAvatar}
                />
              </div>
              
              <h3 style={styles.memberName}>
                {c.member?.firstName} {c.member?.lastName}
              </h3>
              
              <div style={styles.titleBadge}>{c.title}</div>

              {/* INFO SECTION: 2 BALANCED ROWS */}
              <div style={styles.detailsContainer}>
                <div style={styles.infoRow}>
                  <span style={styles.labelText}>Batch of {c.member?.yearOfGraduation}</span>
                  <span style={styles.separator}>•</span>
                  <span style={styles.valueText}>{c.member?.hall}</span>
                </div>

                <div style={styles.infoRow}>
                  <span style={styles.labelText}>{c.member?.degree}</span>
                  <span style={styles.separator}>•</span>
                  <span style={styles.valueText}>{c.member?.department}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {committee.length === 0 && (
          <div style={styles.emptyState}>
            <p>Our leadership team is currently being updated. Check back soon!</p>
          </div>
        )}
      </div>

      {/* Adding a small CSS-in-JS hover effect hack */}
      <style>{`
        .committee-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .committee-card:hover { transform: translateY(-10px); box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important; }
      `}</style>
    </div>
  );
};

// --- MODERN PREMIUM STYLES ---

const styles = {
  pageWrapper: { backgroundColor: '#fcfcfc', minHeight: '100vh', fontFamily: '"Inter", sans-serif' },
  
  // Header Style (Consistent with Members/Home)
  hero: { 
    position: 'relative', 
    height: '25vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(rgba(0, 31, 63, 0.9), rgba(0, 31, 63, 0.8)), url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white', 
    textAlign: 'center'
  },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 20, 40, 0.4)' },
  heroContent: { position: 'relative', zIndex: 2, padding: '0 20px' },
  heroBadge: { backgroundColor: '#fbbf24', color: '#001f3f', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' },
  heroTitle: { fontSize: '2.5rem', margin: '10px 0 5px 0', fontWeight: '800' },
  heroSubtitle: { fontSize: '1rem', opacity: 0.8, fontWeight: '300' },

  container: { maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' },
  
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
    gap: '40px',
    justifyContent: 'center'
  },

  cardStyle: {
    backgroundColor: '#fff',
    padding: '40px 30px',
    borderRadius: '24px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    border: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: '400px',
    justifySelf: 'center',
    width: '100%'
  },

  imgContainer: {
    width: '150px',
    height: '150px',
    borderRadius: '24px', // Squircle Look
    padding: '5px',
    border: '3px solid #fbbf24', // Modern Gold
    overflow: 'hidden',
    marginBottom: '20px',
    backgroundColor: '#fff',
    boxShadow: '0 8px 15px rgba(0,0,0,0.05)'
  },

  imgStyle: { width: '100%', height: '100%', borderRadius: '20px', objectFit: 'cover' },

  memberName: { margin: '0 0 8px 0', color: '#001f3f', fontSize: '1.4rem', fontWeight: '700' },

  titleBadge: {
    backgroundColor: '#001f3f',
    color: '#fbbf24',
    padding: '6px 20px',
    borderRadius: '30px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '25px'
  },

  detailsContainer: {
    width: '100%',
    borderTop: '1px solid #f5f5f5',
    paddingTop: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  infoRow: { display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.95rem' },
  labelText: { fontWeight: '700', color: '#334155' },
  valueText: { fontWeight: '500', color: '#64748b' },
  separator: { margin: '0 8px', color: '#fbbf24', fontWeight: 'bold' },

  emptyState: { textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '20px', color: '#999', border: '1px dashed #ddd' }
};

export default CommitteePage;
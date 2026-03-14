import React, { useState } from 'react';
import MemberDirectory from './MemberDirectory';
import AddMember from './AddMember';

const MembersPage = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleRegistrationSuccess = () => {
    // We'll keep the reload for data consistency as requested, 
    // but add a small alert for feedback.
    alert("Registration Successful! Your profile is pending approval.");
    window.location.reload(); 
  };

  return (
    <div style={styles.pageWrapper}>
      
      {/* 1. COMPACT HERO HEADER */}
      <header style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <div style={styles.heroContent}>
          <span style={styles.heroBadge}>DIRECTORY</span>
          <h1 style={styles.heroTitle}>Alumni Network</h1>
          <p style={styles.heroSubtitle}>
            Connect with batchmates and seniors across the Mumbai Chapter.
          </p>
        </div>
      </header>

      {/* 2. REGISTRATION CALL-TO-ACTION */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaCard}>
          <div style={styles.ctaTextSide}>
            <h3 style={styles.ctaHeading}>
              {showRegisterForm ? "Complete your profile" : "Not in the directory yet?"}
            </h3>
            <p style={styles.ctaSub}>
              {showRegisterForm 
                ? "Please fill in your details accurately for the foundation records." 
                : "Join 500+ KGPians in Mumbai. Register to access the full network."}
            </p>
          </div>
          <button 
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            style={showRegisterForm ? styles.btnCancel : styles.btnRegister}
          >
            {showRegisterForm ? '✕ Close Form' : '➕ Register Now'}
          </button>
        </div>
      </section>

      {/* 3. CONDITIONAL FORM VIEW */}
      {showRegisterForm && (
        <div style={styles.formContainer}>
           <div style={styles.formCard}>
              {/* 🌟 FIXED: Mapped to the exact props AddMember is looking for */}
              <AddMember 
                refresh={handleRegistrationSuccess} 
                onClose={() => setShowRegisterForm(false)} 
              />
           </div>
        </div>
      )}

      {/* 4. THE DIRECTORY LIST */}
      <section style={styles.directorySection}>
        {/* The Member Directory heading was removed from here */}
        <MemberDirectory />
      </section>
      
    </div>
  );
};

// --- MODERN STYLES ---

const styles = {
  pageWrapper: { 
    backgroundColor: '#fcfcfc', 
    minHeight: '100vh', 
    fontFamily: '"Inter", sans-serif' 
  },
  
  // Header Style (Matching Home Page)
  hero: { 
    position: 'relative', 
    height: '25vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    background: 'linear-gradient(rgba(0, 31, 63, 0.9), rgba(0, 31, 63, 0.8)), url("https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white', 
    textAlign: 'center'
  },
  heroContent: { position: 'relative', zIndex: 2, padding: '0 20px' },
  heroBadge: { backgroundColor: '#fbbf24', color: '#001f3f', padding: '4px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' },
  heroTitle: { fontSize: '2.5rem', margin: '10px 0 5px 0', fontWeight: '800' },
  heroSubtitle: { fontSize: '1rem', opacity: 0.8, fontWeight: '300' },

  // Registration CTA Card
  ctaSection: { 
    maxWidth: '1000px', 
    margin: '-40px auto 40px', 
    padding: '0 20px', 
    position: 'relative', 
    zIndex: 5 
  },
  ctaCard: { 
    backgroundColor: '#fff', 
    borderRadius: '16px', 
    padding: '25px 40px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    boxShadow: '0 15px 35px rgba(0,0,0,0.07)', 
    border: '1px solid #f0f0f0',
    flexWrap: 'wrap',
    gap: '20px'
  },
  ctaHeading: { margin: 0, color: '#001f3f', fontSize: '1.25rem', fontWeight: '700' },
  ctaSub: { margin: '5px 0 0 0', color: '#666', fontSize: '0.9rem' },
  
  btnRegister: { 
    backgroundColor: '#001f3f', 
    color: '#fbbf24', 
    border: 'none', 
    padding: '12px 25px', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    fontSize: '0.95rem',
    transition: '0.3s'
  },
  btnCancel: { 
    backgroundColor: '#fee2e2', 
    color: '#dc2626', 
    border: 'none', 
    padding: '12px 25px', 
    borderRadius: '12px', 
    fontWeight: 'bold', 
    cursor: 'pointer', 
    fontSize: '0.95rem'
  },

  // Form Container
  formContainer: { maxWidth: '1000px', margin: '0 auto 40px', padding: '0 20px' },
  formCard: { 
    backgroundColor: '#fff', 
    borderRadius: '20px', 
    padding: '40px', 
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #eee'
  },

  // Directory Section
  directorySection: { 
    maxWidth: '1200px', 
    margin: '0 auto', 
    padding: '20px' 
  }
};

export default MembersPage;
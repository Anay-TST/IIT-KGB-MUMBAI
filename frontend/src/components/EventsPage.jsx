import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';
import Gallery from './Gallery'; // <--- NEW IMPORT

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/api/events');
      setEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoading(false);
    }
  };

  // Logic to split events
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  const upcomingEvents = events.filter(e => new Date(e.date) >= today);
  const pastEvents = events.filter(e => new Date(e.date) < today);

  if (loading) return <div style={styles.loading}>Loading Events...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>Chapter Events</h1>
        <p style={styles.subTitle}>Stay connected through our upcoming gatherings and shared memories.</p>
      </header>

      {/* --- SECTION 1: UPCOMING --- */}
      <section style={styles.section}>
        <div style={styles.sectionHeadingWrapper}>
           <h2 style={styles.sectionHeader}>Upcoming Events</h2>
           <div style={styles.accentLine}></div>
        </div>
        <div style={styles.grid}>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => <EventCard key={event._id} event={event} isPast={false} />)
          ) : (
            <div style={styles.emptyCard}>
               <p style={styles.emptyText}>No upcoming events scheduled. Stay tuned!</p>
            </div>
          )}
        </div>
      </section>

      {/* --- SECTION 2: PAST --- */}
      <section style={{ ...styles.section, marginTop: '80px' }}>
        <div style={styles.sectionHeadingWrapper}>
           <h2 style={styles.sectionHeader}>Past Events & Memories</h2>
           <div style={styles.accentLine}></div>
        </div>
        <div style={styles.grid}>
          {pastEvents.length > 0 ? (
            pastEvents.map(event => <EventCard key={event._id} event={event} isPast={true} />)
          ) : (
            <div style={styles.emptyCard}>
               <p style={styles.emptyText}>No past memories recorded yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Internal Component for Event Tiles
const EventCard = ({ event, isPast }) => {
  const d = new Date(event.date);
  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={styles.dateBadge}>
          <span style={styles.day}>{d.getDate()}</span>
          <span style={styles.month}>{d.toLocaleString('default', { month: 'short' })}</span>
        </div>
        <div style={styles.titleInfo}>
          <h3 style={styles.eventTitle}>{event.title}</h3>
          <p style={styles.location}>📍 {event.location}</p>
        </div>
      </div>

      <p style={styles.description}>{event.description}</p>

      {/* 
          MODERN GALLERY COMPONENT 
          This replaces the old manual .map() logic
      */}
      {isPast && (event.images?.length > 0 || event.videos?.length > 0) && (
        <Gallery images={event.images} videos={event.videos} />
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', fontFamily: 'sans-serif' },
  header: { textAlign: 'center', marginBottom: '60px' },
  mainTitle: { color: '#003366', fontSize: '2.8rem', fontWeight: '800', marginBottom: '10px' },
  subTitle: { color: '#666', fontSize: '1.1rem' },
  section: { width: '100%' },
  sectionHeadingWrapper: { marginBottom: '30px' },
  sectionHeader: { color: '#003366', fontSize: '1.8rem', margin: 0, fontWeight: '700' },
  accentLine: { width: '50px', height: '4px', backgroundColor: '#ffcc00', marginTop: '8px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '30px' },
  emptyCard: { padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '15px', border: '1px dashed #ddd', textAlign: 'center' },
  emptyText: { color: '#999', fontStyle: 'italic', margin: 0 },
  loading: { textAlign: 'center', padding: '100px', fontSize: '1.2rem', color: '#666' },
  
  card: { backgroundColor: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', height: '100%' },
  cardTop: { display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '15px' },
  dateBadge: { backgroundColor: '#001f3f', color: '#fff', padding: '12px', borderRadius: '14px', textAlign: 'center', minWidth: '65px' },
  day: { display: 'block', fontSize: '1.6rem', fontWeight: 'bold' },
  month: { display: 'block', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 'bold', letterSpacing: '1px' },
  titleInfo: { flex: 1 },
  eventTitle: { margin: 0, color: '#003366', fontSize: '1.5rem', fontWeight: '700' },
  location: { margin: '5px 0 0 0', color: '#b58900', fontWeight: '600', fontSize: '0.9rem' },
  description: { color: '#555', fontSize: '1rem', lineHeight: '1.6', margin: '15px 0' }
};

export default EventsPage;
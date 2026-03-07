import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [latestNews, setLatestNews] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch News and Events in parallel
        const [newsRes, eventsRes] = await Promise.all([
          axios.get('/api/articles'),
          axios.get('/api/events')
        ]);
        
        setLatestNews(newsRes.data.slice(0, 3)); 
        setUpcomingEvents(eventsRes.data.slice(0, 3)); // Show top 3 events
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', width: '100%' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        position: 'relative', width: '100%', minHeight: '35vh', 
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover', backgroundPosition: 'center', color: 'white', textAlign: 'center', padding: '0 20px'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 15, 40, 0.75)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', padding: '20px 0' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase' }}>IIT Kharagpur Alumni</h1>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: '300', margin: '0 0 15px 0', color: '#FFD700' }}>Mumbai Chapter</h2>
        </div>
      </section>

      {/* 2. NEWS & EVENTS SECTION */}
      <section style={{ backgroundColor: '#f0f4f8', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          
          {/* DYNAMIC NEWS COLUMN */}
          <div style={{ flex: '2 1 450px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#003366', borderBottom: '2px solid #FFD700', paddingBottom: '8px', marginBottom: '20px' }}>📰 Latest Updates</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {latestNews.length === 0 ? <p>No news yet.</p> : latestNews.map((article) => (
                <div key={article._id} style={{ display: 'flex', gap: '15px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  <div style={{ flex: '0 0 100px', minHeight: '100px', backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80")', backgroundSize: 'cover' }}></div>
                  <div style={{ padding: '15px' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#003366', fontSize: '1.1rem' }}>{article.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>{new Date(article.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DYNAMIC EVENTS COLUMN */}
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#003366', borderBottom: '2px solid #FFD700', paddingBottom: '8px', marginBottom: '20px' }}>🗓️ Upcoming Events</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingEvents.length === 0 ? <p>No upcoming events.</p> : upcomingEvents.map((event) => (
                <div key={event._id} style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #003366' }}>
                  <div style={{ color: '#003366', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>{event.title}</div>
                  <div style={{ color: '#e63946', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '5px' }}>{event.date}</div>
                  <div style={{ color: '#555', fontSize: '0.9rem' }}>📍 {event.location}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. HISTORY SECTION */}
      <section style={{ padding: '40px 20px', backgroundColor: '#ffffff', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#003366' }}>Our Historic Legacy</h2>
          <p>Established in 1951, IIT Kharagpur is the first of the IITs...</p>
      </section>
      
    </div>
  );
};

export default HomePage;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomePage = () => {
  const [latestNews, setLatestNews] = useState([]);

  useEffect(() => {
    // Fetch only the latest 3 news articles for the homepage
    const fetchLatestNews = async () => {
      try {
        const response = await axios.get('/api/articles');
        setLatestNews(response.data.slice(0, 3)); 
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchLatestNews();
  }, []);

  return (
    <div style={{ fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', width: '100%' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        position: 'relative',
        width: '100%',
        minHeight: '35vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '0 20px'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 15, 40, 0.75)', zIndex: 1 }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '900px', padding: '20px 0' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 'bold', margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
            IIT Kharagpur Alumni
          </h1>
          <h2 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: '300', margin: '0 0 15px 0', color: '#FFD700' }}>
            Mumbai Chapter
          </h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.4', opacity: 0.9, maxWidth: '700px', margin: '0 auto' }}>
            Connecting generations of KGPians across the Mumbai metropolitan region. Network, mentor, share memories, and stay updated.
          </p>
        </div>
      </section>

      {/* 2. NEWS & EVENTS SECTION (Moved up!) */}
      <section style={{ backgroundColor: '#f0f4f8', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          
          {/* LATEST NEWS COLUMN */}
          <div style={{ flex: '2 1 450px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#003366', borderBottom: '2px solid #FFD700', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📰 Latest Updates
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {latestNews.length === 0 ? <p style={{ color: '#666', fontSize: '0.9rem' }}>Loading latest updates...</p> : latestNews.map((article) => (
                <div key={article._id} style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                  {/* Thumbnail Image */}
                  <div style={{ flex: '0 0 100px', minHeight: '100px', backgroundImage: 'url("https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                  
                  <div style={{ padding: '15px', flex: '1 1 250px' }}>
                    <h3 style={{ margin: '0 0 5px 0', color: '#003366', fontSize: '1.1rem' }}>{article.title}</h3>
                    <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px', fontWeight: '500' }}>
                      By {article.author} | {new Date(article.date).toLocaleDateString()}
                    </p>
                    <p style={{ margin: 0, color: '#444', fontSize: '0.9rem', lineHeight: '1.4' }}>
                      {article.content.length > 100 ? `${article.content.substring(0, 100)}...` : article.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EVENTS COLUMN */}
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ fontSize: '1.5rem', color: '#003366', borderBottom: '2px solid #FFD700', paddingBottom: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🗓️ Upcoming Events
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #003366' }}>
                <div style={{ color: '#003366', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>Mumbai Chapter Annual Meetup</div>
                <div style={{ color: '#e63946', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>April 15, 2026</div>
                <div style={{ color: '#555', fontSize: '0.9rem' }}>📍 BKC, Mumbai</div>
              </div>

              <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '15px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', borderLeft: '4px solid #003366' }}>
                <div style={{ color: '#003366', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '5px' }}>Tech Startup Mixer</div>
                <div style={{ color: '#e63946', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem' }}>May 2, 2026</div>
                <div style={{ color: '#555', fontSize: '0.9rem' }}>📍 Powai, Mumbai</div>
              </div>

            </div>
            
            <button style={{ width: '100%', marginTop: '15px', padding: '10px', backgroundColor: '#003366', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#002244'} onMouseOut={(e) => e.target.style.backgroundColor = '#003366'}>
              View All Events
            </button>
          </div>

        </div>
      </section>

      {/* 3. ABOUT IIT KGP SECTION (Moved down!) */}
      <section style={{ padding: '40px 20px', backgroundColor: '#ffffff', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.8rem', color: '#003366', margin: '0 0 10px 0' }}>Our Historic Legacy</h2>
          <p style={{ color: '#555', maxWidth: '800px', margin: '0 auto 25px auto', fontSize: '1rem', lineHeight: '1.5' }}>
            Born in 1951 in the historic Hijli Detention Camp, IIT Kharagpur is the first of the IITs. Today, it stands as a global leader in engineering and research.
          </p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'center' }}>
            {/* Fact Cards */}
            <div style={{ flex: '1 1 250px', padding: '20px 15px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🏛️</div>
              <h3 style={{ fontSize: '1.1rem', color: '#003366', marginBottom: '5px' }}>The First IIT</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>Established in 1951, paving the way for technical education in independent India.</p>
            </div>
            <div style={{ flex: '1 1 250px', padding: '20px 15px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🌳</div>
              <h3 style={{ fontSize: '1.1rem', color: '#003366', marginBottom: '5px' }}>2,100 Acre Campus</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>A lush, self-contained township and the largest campus among all IITs in the country.</p>
            </div>
            <div style={{ flex: '1 1 250px', padding: '20px 15px', backgroundColor: '#f8f9fa', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🧘</div>
              <h3 style={{ fontSize: '1.1rem', color: '#003366', marginBottom: '5px' }}>Yogaḥ Karmasu Kauśalam</h3>
              <p style={{ color: '#666', margin: 0, fontSize: '0.9rem', lineHeight: '1.4' }}>"Excellence in action is Yoga." Our motto inspiring global greatness.</p>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
};

export default HomePage;
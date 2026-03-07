import React, { useState, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '../api';

const Gallery = ({ images = [], videos = [] }) => {
  // Combine both into one list for easy navigation
  const allMedia = [
    ...images.map(url => ({ url: `${BACKEND_URL}${url}`, type: 'image' })),
    ...videos.map(url => ({ url: `${BACKEND_URL}${url}`, type: 'video' }))
  ];

  const [currentIndex, setCurrentIndex] = useState(null);

  const openLightbox = (index) => setCurrentIndex(index);
  const closeLightbox = () => setCurrentIndex(null);

  const showNext = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  }, [allMedia.length]);

  const showPrev = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  }, [allMedia.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (currentIndex === null) return;
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, showNext, showPrev]);

  if (allMedia.length === 0) return null;

  return (
    <div style={styles.galleryWrapper}>
      <div style={styles.grid}>
        {allMedia.map((item, i) => (
          <div key={i} style={styles.mediaContainer} onClick={() => openLightbox(i)}>
            {item.type === 'image' ? (
              <img src={item.url} alt="Event" style={styles.thumb} />
            ) : (
              <video src={item.url} style={styles.thumb} />
            )}
            <div style={styles.overlay}>{item.type === 'video' ? '▶' : '🔍'}</div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {currentIndex !== null && (
        <div style={styles.lightbox} onClick={closeLightbox}>
          {/* Navigation Buttons */}
          <button style={styles.navBtnLeft} onClick={showPrev}>&#10094;</button>
          <button style={styles.navBtnRight} onClick={showNext}>&#10095;</button>
          
          <button style={styles.closeBtn} onClick={closeLightbox}>&times;</button>
          
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {allMedia[currentIndex].type === 'video' ? (
              <video src={allMedia[currentIndex].url} controls autoPlay style={styles.fullMedia} />
            ) : (
              <img src={allMedia[currentIndex].url} alt="Full size" style={styles.fullMedia} />
            )}
            
            {/* Counter */}
            <div style={styles.counter}>
              {currentIndex + 1} / {allMedia.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  galleryWrapper: { marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' },
  grid: { display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' },
  mediaContainer: { 
    position: 'relative', 
    minWidth: '140px', 
    height: '90px', 
    borderRadius: '10px', 
    overflow: 'hidden', 
    cursor: 'pointer',
    backgroundColor: '#000',
    border: '1px solid #ddd'
  },
  thumb: { width: '100%', height: '100%', objectFit: 'cover' },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', fontSize: '1.2rem' },
  
  // Lightbox
  lightbox: { position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContent: { position: 'relative', maxWidth: '85%', maxHeight: '85%', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fullMedia: { maxWidth: '100%', maxHeight: '80vh', borderRadius: '5px', boxShadow: '0 0 40px rgba(0,0,0,0.5)' },
  
  closeBtn: { position: 'absolute', top: '20px', right: '30px', background: 'none', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', zIndex: 3001 },
  
  navBtnLeft: { position: 'absolute', left: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '3rem', padding: '20px', cursor: 'pointer', borderRadius: '50%', transition: '0.3s' },
  navBtnRight: { position: 'absolute', right: '30px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontSize: '3rem', padding: '20px', cursor: 'pointer', borderRadius: '50%', transition: '0.3s' },
  
  counter: { color: 'white', marginTop: '15px', fontSize: '0.9rem', opacity: 0.7, backgroundColor: 'rgba(0,0,0,0.5)', padding: '5px 15px', borderRadius: '20px' }
};

export default Gallery;
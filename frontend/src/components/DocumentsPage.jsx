import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../api';

const DocumentsPage = () => {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching documents from:", BACKEND_URL + '/api/documents');
    
    api.get('/api/documents')
      .then(res => {
        console.log("Documents received:", res.data);
        setDocs(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching documents:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading Documents...</div>;

  return (
    <div style={{ padding: '50px 20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#003366', borderBottom: '3px solid #ffcc00', paddingBottom: '10px' }}>Documents & Resources</h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>Download official chapter documents, minutes, and circulars.</p>
      
      <div style={{ display: 'grid', gap: '15px' }}>
        {docs.length > 0 ? docs.map(doc => (
          <div key={doc._id} style={styles.docCard}>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#003366' }}>{doc.title}</div>
              <div style={{ fontSize: '0.85rem', color: '#888', marginTop: '4px' }}>
                Published on: {new Date(doc.createdAt).toLocaleDateString()}
              </div>
            </div>
            <a 
              href={`${BACKEND_URL}${doc.fileUrl}`} 
              target="_blank" 
              rel="noreferrer" 
              style={styles.btnDownload}
              download
            >
              View Document
            </a>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '10px' }}>
            <p style={{ color: '#999' }}>No documents have been uploaded to the directory yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  docCard: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '20px', 
    backgroundColor: '#fff', 
    borderRadius: '10px', 
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)', 
    border: '1px solid #eee' 
  },
  btnDownload: { 
    backgroundColor: '#003366', 
    color: 'white', 
    textDecoration: 'none', 
    padding: '10px 20px', 
    borderRadius: '5px', 
    fontWeight: 'bold', 
    fontSize: '0.9rem' 
  }
};

export default DocumentsPage;
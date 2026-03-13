import React, { useState } from 'react';
import api, { BACKEND_URL } from '../../api';

const DocumentTab = ({ docs, refresh }) => {
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!docTitle || !docFile) return alert("Please provide both a title and a file.");

    setUploading(true);
    const fd = new FormData();
    fd.append('title', docTitle);
    fd.append('file', docFile);

    try {
      await api.post('/api/documents', fd);
      setDocTitle('');
      setDocFile(null);
      // Reset the file input field manually
      document.getElementById('docFileInput').value = '';
      refresh();
      alert("Document uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/api/documents/${id}`);
      refresh();
    } catch (err) {
      alert("Error deleting document.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Document Repository</h1>
        <p style={styles.subtitle}>Upload and manage newsletters, minutes, and chapter records.</p>
      </div>

      {/* UPLOAD FORM */}
      <div style={styles.formCard}>
        <h3 style={styles.cardHeading}>Upload New Document</h3>
        <form onSubmit={handleUpload} style={styles.form}>
          <div style={{ flex: 2 }}>
            <label style={styles.label}>Document Title</label>
            <input 
              placeholder="e.g. Minutes of Meeting - March 2026" 
              value={docTitle} 
              onChange={e => setDocTitle(e.target.value)} 
              style={styles.input} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={styles.label}>Select File (PDF preferred)</label>
            <input 
              id="docFileInput"
              type="file" 
              accept=".pdf,.doc,.docx" 
              onChange={e => setDocFile(e.target.files[0])} 
              style={styles.fileInput}
            />
          </div>
          <button type="submit" disabled={uploading} style={styles.btnBlue}>
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
        </form>
      </div>

      {/* DOCUMENT LIST */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date Uploaded</th>
              <th style={styles.th}>Title</th>
              <th style={{ ...styles.th, textAlign: 'right', paddingRight: '20px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.length > 0 ? docs.map(d => (
              <tr key={d._id} style={styles.tr}>
                <td style={styles.td}>{new Date(d.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td style={styles.td}>
                  <strong>{d.title}</strong>
                </td>
                
                <td style={{ ...styles.td, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  
                  {/* 🌟 FIXED: Added the 'download' attribute back and changed text */}
                  <a 
                    href={`${BACKEND_URL}${d.fileUrl}`} 
                    download
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={styles.btnDownload}
                  >
                    Download
                  </a>

                  <button 
                    onClick={() => handleDelete(d._id)} 
                    style={styles.btnDelete}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            )) : (
              <tr>
                <td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                  No documents found in the repository.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: '"Inter", sans-serif' },
  header: { marginBottom: '30px' },
  title: { margin: 0, color: '#001f3f', fontSize: '1.8rem', fontWeight: '800' },
  subtitle: { margin: '5px 0 0 0', color: '#64748b' },
  
  formCard: { 
    backgroundColor: '#fff', 
    padding: '25px', 
    borderRadius: '16px', 
    marginBottom: '30px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
    border: '1px solid #f1f5f9'
  },
  cardHeading: { margin: '0 0 15px 0', fontSize: '1.1rem', color: '#001f3f' },
  form: { display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' },
  label: { display: 'block', fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' },
  input: { 
    width: '100%', 
    padding: '12px 15px', 
    borderRadius: '10px', 
    border: '1px solid #e2e8f0', 
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box'
  },
  fileInput: { fontSize: '0.85rem', color: '#64748b' },
  btnBlue: { 
    backgroundColor: '#001f3f', 
    color: '#fbbf24', 
    padding: '12px 25px', 
    border: 'none', 
    borderRadius: '10px', 
    fontWeight: 'bold', 
    cursor: 'pointer',
    height: '46px'
  },

  tableCard: { backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '18px', textAlign: 'left', backgroundColor: '#f8fafc', color: '#475569', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' },
  td: { padding: '18px', borderBottom: '1px solid #f1f5f9', color: '#1e293b', fontSize: '0.95rem' },
  tr: { transition: '0.2s' },
  
  /* 🌟 RENAMED to btnDownload */
  btnDownload: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem',
    textDecoration: 'none', 
    display: 'inline-block'
  },

  btnDelete: { 
    backgroundColor: '#fee2e2', 
    color: '#b91c1c', 
    border: 'none', 
    padding: '8px 16px', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontWeight: 'bold',
    fontSize: '0.85rem'
  }
};

export default DocumentTab;
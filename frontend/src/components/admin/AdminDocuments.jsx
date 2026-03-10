import React, { useState } from 'react';
import api from '../../api';

const AdminDocuments = ({ docs, fetchAll }) => {
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState(null);

  const uploadDoc = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', docTitle);
    fd.append('file', docFile);
    await api.post('/api/documents', fd);
    setDocTitle(''); 
    setDocFile(null); 
    fetchAll();
  };

  return (
    <>
      <h1>Documents</h1>
      <form onSubmit={uploadDoc} style={styles.formCard}>
        <input placeholder="Doc Title" value={docTitle} onChange={e => setDocTitle(e.target.value)} style={styles.inputS} required/>
        <input type="file" onChange={e => setDocFile(e.target.files[0])} required/>
        <button type="submit" style={styles.btnBlue}>Upload</button>
      </form>
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <tbody>
            {docs.map(d => (
              <tr key={d._id}>
                <td style={styles.td}>{new Date(d.createdAt).toLocaleDateString()}</td>
                <td style={styles.td}>{d.title}</td>
                <td style={styles.td}><button onClick={() => api.delete(`/api/documents/${d._id}`).then(fetchAll)} style={styles.btnDelete}>Del</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const styles = {
  formCard: { backgroundColor: '#fff', padding: '20px', borderRadius: '10px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', border: '1px solid #eee' },
  tableCard: { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  td: { padding: '15px', borderBottom: '1px solid #eee', fontSize: '14px' },
  btnDelete: { backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' },
  btnBlue: { backgroundColor: '#003366', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  inputS: { padding: '10px', border: '1px solid #cbd5e0', borderRadius: '5px', width: '100%', boxSizing: 'border-box', fontSize: '14px' }
};

export default AdminDocuments;
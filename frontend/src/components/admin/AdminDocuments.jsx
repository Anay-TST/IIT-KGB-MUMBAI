import React, { useState } from 'react';
import api from '../api'; 
import styles from './AdminStyles';

const AdminDocuments = ({ docs, fetchAll }) => {
  const [docTitle, setDocTitle] = useState('');
  const [docFile, setDocFile] = useState(null);

  const uploadDoc = async (e) => {
    e.preventDefault();
    if (!docTitle || !docFile) return alert("Please provide a title and a file.");
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
        <input placeholder="Doc Title" value={docTitle} onChange={e => setDocTitle(e.target.value)} style={styles.inputS} />
        <input type="file" onChange={e => setDocFile(e.target.files[0])} />
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

export default AdminDocuments;
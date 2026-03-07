import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewsSection = () => {
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', author: '' });

  // Fetch articles on load
  const fetchArticles = async () => {
    try {
      const response = await axios.get('/api/articles');
      setArticles(response.data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/articles', formData);
      setFormData({ title: '', content: '', author: '' }); // Clear form
      fetchArticles(); // Refresh the feed instantly!
    } catch (error) {
      console.error('Error posting article:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2>Campus News & Updates</h2>

      {/* Admin Post Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px', padding: '15px', background: '#f4f4f4', borderRadius: '8px' }}>
        <h4>Post an Update</h4>
        <input 
          type="text" placeholder="Headline" required
          value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} 
        />
        <input 
          type="text" placeholder="Author (e.g., KGP Admin)" required
          value={formData.author} onChange={(e) => setFormData({...formData, author: e.target.value})} 
        />
        <textarea 
          placeholder="Write the news content here..." rows="3" required
          value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} 
        ></textarea>
        <button type="submit" style={{ padding: '8px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>Publish News</button>
      </form>

      {/* The News Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {articles.length === 0 ? <p>No news yet.</p> : articles.map((article) => (
          <div key={article._id} style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 5px 0', color: '#0056b3' }}>{article.title}</h3>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.9em', color: '#666' }}>
              By {article.author} • {new Date(article.date).toLocaleDateString()}
            </p>
            <p style={{ margin: '0' }}>{article.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
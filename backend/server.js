const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// 🚨 FIX: Explicitly tell dotenv to look in the backend folder for the .env file
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// --- MIDDLEWARE ---
// ⚠️ INCREASED PAYLOAD LIMITS TO 50MB FOR EXCEL UPLOADS ⚠️
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Enable CORS for frontend communication
app.use(cors());

// Serve static files (like profile pictures and documents) from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// --- ROUTES ---
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes'));
app.use('/api/articles', require('./routes/articleRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));


// --- DATABASE CONNECTION ---
// Make sure you have MONGO_URI defined in your backend/.env file
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni_db';

mongoose.connect(DB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err.message);
  });


// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
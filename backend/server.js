const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Tell dotenv exactly where to find your .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// --- MIDDLEWARE ---
app.use(cors());

// 🌟 THE FIX: Increased payload limit to 50mb for large Excel imports
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Make the 'uploads' folder publicly accessible so Profile Pictures and Documents load correctly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/alumni_directory';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MONGODB CONNECTION FATAL ERROR:');
    console.error(err.message);
  });

// --- API ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/config', require('./routes/config'));

// ✅ ACTIVATED: Document repository routes
app.use('/api/documents', require('./routes/documentRoutes'));

// ⚠️ TEMPORARILY DISABLED: We will uncomment these as we build each feature!
// app.use('/api/committee', require('./routes/committeeRoutes'));
// app.use('/api/events', require('./routes/eventRoutes'));

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('Alumni Portal Backend API is up and running! 🚀');
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
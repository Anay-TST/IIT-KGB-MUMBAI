const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// 🌟 THE FIX: Tell dotenv exactly where to find your .env file!
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Allows us to read JSON data from the frontend

// Make the 'uploads' folder publicly accessible so Profile Pictures load correctly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DATABASE CONNECTION ---
// If dotenv loads correctly, this will grab your Atlas link!
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

// 🌟 NEW: The dynamic settings/dropdown configuration route
app.use('/api/config', require('./routes/config'));

// ⚠️ TEMPORARILY DISABLED: We will uncomment these as we build each feature!
// app.use('/api/committee', require('./routes/committee'));
// app.use('/api/events', require('./routes/events'));
// app.use('/api/documents', require('./routes/documents'));

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('Alumni Portal Backend API is up and running! 🚀');
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
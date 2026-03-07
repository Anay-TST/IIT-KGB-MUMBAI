require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// --- MIDDLEWARE ---
app.use(cors()); // Allows frontend to communicate with backend
app.use(express.json()); // Allows backend to read JSON data

// --- SERVE STATIC FILES ---
// This ensures that http://localhost:5000/uploads/... images are visible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- IMPORT ROUTES ---
const alumniRoutes = require('./routes/alumniRoutes');
const articleRoutes = require('./routes/articleRoutes');
const eventRoutes = require('./routes/eventRoutes');
const committeeRoutes = require('./routes/committeeRoutes');

// --- USE ROUTES ---
app.use('/api/alumni', alumniRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/committee', committeeRoutes);

// --- BASE ROUTE (Health Check) ---
app.get('/', (req, res) => {
  res.send('IIT KGP Alumni Backend is Running!');
});

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to KGP Alumni Database'))
  .catch((err) => console.log('Database connection error:', err));

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
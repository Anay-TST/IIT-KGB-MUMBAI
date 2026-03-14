const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Initialize dotenv
require('dotenv').config();

const app = express();

// --- MIDDLEWARE ---
// Updated CORS to allow your live frontend domain
app.use(cors({
  origin: ["https://iitkgpmumbai.in", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// INCREASED LIMITS
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Make the 'uploads' folder publicly accessible
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI;

// Vercel specific: Using a variable to prevent multiple connections in serverless functions
let cachedDb = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  return mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => {
      console.error('❌ MONGODB CONNECTION FATAL ERROR:', err.message);
    });
};

// Connect to DB
connectDB();

// --- API ROUTES ---
// We use path.join to ensure routes are found correctly in the Vercel environment
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/config', require('./routes/config'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes')); 
app.use('/api/events', require('./routes/eventRoutes')); 

// --- HEALTH CHECK ---
app.get('/', (req, res) => {
  res.send('Alumni Portal Backend API is up and running! 🚀');
});

// --- START SERVER (Local only) ---
// Vercel handles the listening; we only call app.listen if running locally
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Local Server is running on port ${PORT}`);
  });
}

// --- VERCEL EXPORT ---
// This is the most important part for Vercel deployment
module.exports = app;

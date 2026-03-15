const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// --- CORS CONFIGURATION ---
// This ensures your frontend can talk to the backend securely
app.use(cors({
  origin: [
    "https://iitkgpmumbai.in", 
    "https://www.iitkgpmumbai.in", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serving Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO_URI = process.env.MONGO_URI;

// Optimized MongoDB Connection for Serverless
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (err) {
    console.error('❌ MONGODB ERROR:', err.message);
  }
};

// Middleware to ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/config', require('./routes/config'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes')); 
app.use('/api/events', require('./routes/eventRoutes')); 

// Backend Status Check
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Alumni Portal Backend API is up and running! 🚀',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Local Development Port Logic
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local Server on http://localhost:${PORT}`));
}

// Export for Vercel Serverless Function
module.exports = app;

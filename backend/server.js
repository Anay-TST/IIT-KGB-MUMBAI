const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

// --- UPDATED CORS BLOCK ---
app.use(cors({
  origin: [
    "https://iitkgpmumbai.in", 
    "https://www.iitkgpmumbai.in", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added OPTIONS
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"] // Added explicit headers
}));

app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  return mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MONGODB ERROR:', err.message));
};
connectDB();

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/alumni', require('./routes/alumniRoutes'));
app.use('/api/config', require('./routes/config'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes')); 
app.use('/api/events', require('./routes/eventRoutes')); 

app.get('/', (req, res) => {
  res.send('Alumni Portal Backend API is up and running! 🚀');
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Local Server on ${PORT}`));
}

module.exports = app;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// --- DIRECTORY SHIELD ---
// Automatically create upload folders if they don't exist
const uploadDirs = ['./uploads', './uploads/documents'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
});

// --- MIDDLEWARE ---
app.use(cors()); 
app.use(express.json()); 

// --- SERVE STATIC FILES ---
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- IMPORT ROUTES ---
const alumniRoutes = require('./routes/alumniRoutes');
const articleRoutes = require('./routes/articleRoutes');
const eventRoutes = require('./routes/eventRoutes');
const committeeRoutes = require('./routes/committeeRoutes');
const documentRoutes = require('./routes/documentRoutes'); // <--- IMPORTANT

// --- USE ROUTES ---
app.use('/api/alumni', alumniRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/committee', committeeRoutes);
app.use('/api/documents', documentRoutes); // <--- THIS FIXES THE 404

// --- BASE ROUTE ---
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
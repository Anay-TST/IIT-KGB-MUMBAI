require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const alumniRoutes = require('./routes/alumniRoutes');
const articleRoutes = require('./routes/articleRoutes');
const eventRoutes = require('./routes/eventRoutes');

// Use Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes);

// SERVE STATIC FILES
// This maps the physical 'uploads' folder to the URL path '/uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/committee', require('./routes/committeeRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to KGP Alumni Database'))
  .catch((err) => console.log('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
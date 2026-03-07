require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Import Routes
const alumniRoutes = require('./routes/alumniRoutes');
const articleRoutes = require('./routes/articleRoutes');
const eventRoutes = require('./routes/eventRoutes'); // Add this

// Use Routes
app.use('/api/alumni', alumniRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/events', eventRoutes); // Add this

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to KGP Alumni Database'))
  .catch((err) => console.log('Database connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
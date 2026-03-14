const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// --- GET: Fetch the configuration ---
// If the database is empty, it automatically creates a document using the defaults from Config.js
router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config(); 
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Error fetching config", error: err.message });
  }
});

// --- PUT: Update the configuration ---
// Overwrites the arrays with the new lists sent from the SettingsTab
router.put('/', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = new Config();
    }
    
    // Update the arrays safely
    config.degrees = req.body.degrees || [];
    config.departments = req.body.departments || [];
    config.halls = req.body.halls || [];
    config.maritalStatuses = req.body.maritalStatuses || [];
    config.genders = req.body.genders || [];

    await config.save();
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: "Error saving config", error: err.message });
  }
});

module.exports = router;
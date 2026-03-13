const express = require('express');
const router = express.Router();
const Config = require('../models/Config');

// GET current configuration
router.get('/', async (req, res) => {
  try {
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({}); 
    }
    res.json(config);
  } catch (err) {
    console.error("❌ GET /api/config ERROR:", err);
    res.status(500).json({ message: "Database read error: " + err.message });
  }
});

// PUT to update configuration
router.put('/', async (req, res) => {
  try {
    // 1. Log the incoming data so we can see it in the terminal!
    console.log("📥 Incoming config save request...");

    // 2. Bulletproof Save: Find the first config doc and update it. If none exists, create it (upsert: true).
    const updatedConfig = await Config.findOneAndUpdate(
      {}, // Empty filter means "grab the first document you find"
      {
        degrees: req.body.degrees || [],
        departments: req.body.departments || [],
        halls: req.body.halls || [],
        maritalStatuses: req.body.maritalStatuses || [],
        sexOptions: req.body.sexOptions || []
      },
      { new: true, upsert: true } // Return the new doc, and create if missing
    );

    console.log("✅ Config successfully saved to MongoDB!");
    res.json({ message: "Settings saved successfully!", config: updatedConfig });

  } catch (err) {
    // 3. Print the EXACT error to the terminal
    console.error("❌ PUT /api/config ERROR:", err);
    res.status(500).json({ message: err.message || "Database save error" });
  }
});

module.exports = router;
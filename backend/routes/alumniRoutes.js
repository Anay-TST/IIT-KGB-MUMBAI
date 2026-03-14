const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/authMiddleware');

// --- EMAIL TRANSPORTER SETUP ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ FIXED: Use memoryStorage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST: Register
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      // Vercel fallback: generates an avatar based on their name
      data.profilePic = `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}`;
    }
    const member = new Member(data);
    await member.save();
    res.status(201).json(member);
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
  }
});

// POST: Bulk Import from Excel
router.post('/bulk', async (req, res) => {
  try {
    const { members } = req.body;
    if (!members || !Array.isArray(members)) {
      return res.status(400).json({ message: "Invalid data format. Expected an array." });
    }
    const inserted = await Member.insertMany(members, { ordered: false });
    res.status(201).json({ message: `Successfully imported ${inserted.length} members!` });
  } catch (err) {
    if (err.name === 'BulkWriteError') {
      res.status(201).json({ 
        message: `Import finished! Inserted ${err.insertedDocs.length} members. Skipped some rows due to duplicates or missing required fields.` 
      });
    } else {
      console.error("Bulk Import Error:", err.message);
      res.status(500).json({ message: "Failed to import members: " + err.message });
    }
  }
});

// GET: Approved List
router.get('/', async (req, res) => {
  try {
    const members = await Member.find({ 
      $or: [
        { isApproved: true },
        { status: { $in: ['Life Member', 'General', 'Approved'] } }
      ]
    }).sort({ yearOfGraduation: -1 });
    
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET: All Members (for Admin)
router.get('/all', async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// GET: Fetch the logged-in user's own profile
router.get('/profile', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.user.id);
    if (!member) return res.status(404).json({ message: "Profile not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT: Update the logged-in user's own profile
router.put('/profile', protect, upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Clean up empty strings
    for (let key in updateData) {
      if (updateData[key] === '' || updateData[key] === 'null') {
        delete updateData[key];
      }
    }

    if (req.file) {
      updateData.profilePic = `https://ui-avatars.com/api/?name=${updateData.firstName || 'User'}+${updateData.lastName || ''}`;
    }

    const updated = await Member.findByIdAndUpdate(
      req.user.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Profile not found" });
    res.json(updated);
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// PUT: Full Edit (Admin editing any member by ID)
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    for (let key in updateData) {
      if (updateData[key] === '' || updateData[key] === 'null') {
        delete updateData[key];
      }
    }
    if (req.file) {
      updateData.profilePic = `https://ui-avatars.com/api/?name=${updateData.firstName || 'User'}+${updateData.lastName || ''}`;
    }

    const updated = await Member.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: "Member not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(400).json({ message: err.message });
  }
});

// PATCH: Status Toggle & EMAIL AUTOMATION
router.patch('/status/:id', async (req, res) => {
  console.log(`\n--- 🚦 INCOMING REQUEST: Toggle Status ---`);
  
  try {
    const { action } = req.query;
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (action === 'approve') {
      if (!member.isApproved) {
        member.isApproved = true;

        const tempPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        member.password = await bcrypt.hash(tempPassword, salt);

        const mailOptions = {
          from: `"IIT KGP Mumbai Alumni" <${process.env.EMAIL_USER}>`,
          to: member.email,
          subject: 'Welcome to IIT KGP Mumbai Alumni Association!',
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #003366; margin-top: 0;">Welcome, ${member.firstName}!</h2>
              
              <p>Your membership to the <strong>IIT KGP Mumbai Alumni Association</strong> has been officially approved.</p>
              <p>You can now log in to the portal to update your profile, connect with the community, and stay updated on events.</p>
              
              <div style="background-color: #f4f7f6; padding: 20px; border-left: 4px solid #fbbf24; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0 0 15px 0; font-size: 1.1em;"><strong>Your Login Credentials:</strong></p>
                
                <p style="margin: 0 0 8px 0;">Email: <strong>${member.email}</strong></p>
                <p style="margin: 0 0 15px 0;">Temporary Password: <strong>${tempPassword}</strong></p>
                
                <p style="margin: 0;">
                  Login link: <br/>
                  <a href="${process.env.FRONTEND_URL}/login" style="color: #003366; font-weight: bold; word-break: break-all;">
                    ${process.env.FRONTEND_URL}/login
                  </a>
                </p>
              </div>
              
              <p><em>For security reasons, please log in and change this temporary password immediately.</em></p>
              
              <br/>
              <p style="margin: 0;">Best Regards,</p>
              <p style="margin: 5px 0 0 0; font-weight: bold; color: #003366;">IIT KGP Mumbai Alumni Association</p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) console.error("❌ CRITICAL EMAIL ERROR:", error);
        });
      }
    } 
    else if (action === 'revoke') {
      member.isApproved = false;
    } 
    else if (action === 'toggleLife') {
      member.isLifeMember = !member.isLifeMember;
    }

    await member.save();
    res.json(member);

  } catch (err) { 
    console.error("💥 CATASTROPHIC ROUTE ERROR:", err);
    res.status(400).json({ message: err.message }); 
  }
});

// DELETE: Clear Entire Database
router.delete('/clear-all', async (req, res) => {
  try {
    await Member.deleteMany({});
    res.json({ message: "Database completely cleared." });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

module.exports = router;

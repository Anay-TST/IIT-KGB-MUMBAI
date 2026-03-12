const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// --- EMAIL TRANSPORTER SETUP ---
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Create uploads folder if missing (Locked to backend/uploads)
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, '-');
    cb(null, Date.now() + '-' + safeName);
  }
});
const upload = multer({ storage: storage });

// POST: Register
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.profilePic = `/uploads/${req.file.filename}`;
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

// PUT: Full Edit
router.put('/:id', upload.single('profilePic'), async (req, res) => {
  try {
    const updateData = { ...req.body };
    for (let key in updateData) {
      if (updateData[key] === '' || updateData[key] === 'null') {
        delete updateData[key];
      }
    }
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
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

// PATCH: Status Toggle & EMAIL AUTOMATION (WITH AGGRESSIVE LOGGING)
router.patch('/status/:id', async (req, res) => {
  console.log(`\n--- 🚦 INCOMING REQUEST: Toggle Status ---`);
  console.log(`Action requested: ${req.query.action} for member ID: ${req.params.id}`);

  try {
    const { action } = req.query;
    const member = await Member.findById(req.params.id);
    if (!member) {
      console.log("❌ Member not found in database.");
      return res.status(404).json({ message: "Member not found" });
    }

    console.log(`Current member approval status before click: ${member.isApproved}`);

    if (action === 'approve') {
      if (!member.isApproved) {
        console.log("✅ Member is pending. Starting approval process...");
        member.isApproved = true;

        // 1. Password
        const tempPassword = Math.random().toString(36).slice(-8);
        console.log("✅ Generated temporary password.");
        
        // 2. Hash
        const salt = await bcrypt.genSalt(10);
        member.password = await bcrypt.hash(tempPassword, salt);
        console.log("✅ Password hashed successfully.");

        // 3. Email Prep
        const mailOptions = {
          from: `"IIT KGB Mumbai Alumni" <${process.env.EMAIL_USER}>`,
          to: member.email,
          subject: 'Welcome! Your Alumni Account is Approved',
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
              <h2 style="color: #001f3f;">Welcome, ${member.firstName}!</h2>
              <p>Your membership to the IIT KGB Mumbai Alumni Network has been officially approved.</p>
              <p>You can now log in to the portal to update your profile, connect with the community, and stay updated on events.</p>
              
              <div style="background-color: #f4f7f6; padding: 20px; border-left: 4px solid #fbbf24; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0 0 10px 0;"><strong>Your Login Credentials:</strong></p>
                <p style="margin: 0 0 5px 0;">Email: <strong>${member.email}</strong></p>
                <p style="margin: 0;">Temporary Password: <strong>${tempPassword}</strong></p>
              </div>
              
              <p><em>For security reasons, please log in and change this temporary password immediately.</em></p>
              <p>Best Regards,<br/><strong>IIT KGB Mumbai Alumni Association</strong></p>
            </div>
          `
        };

        // 4. Send Email
        console.log("⏳ Attempting to send email to:", member.email);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("❌ CRITICAL EMAIL ERROR:", error);
          } else {
            console.log("✅ Approval email sent successfully!");
          }
        });
      } else {
        console.log("⚠️ Member is already approved. Skipping email block.");
      }
    } 
    else if (action === 'revoke') {
      member.isApproved = false;
      console.log("🔴 Member revoked.");
    } 
    else if (action === 'toggleLife') {
      member.isLifeMember = !member.isLifeMember;
      console.log("⭐ Life member toggled.");
    }

    await member.save();
    console.log("💾 Member saved to database successfully.");
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
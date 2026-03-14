const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { protect } = require('../middleware/authMiddleware');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// ✅ FIXED: Use memoryStorage for Vercel
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST: Register
router.post('/register', upload.single('profilePic'), async (req, res) => {
  try {
    const data = req.body;
    // Note: Since we can't save to disk, we set a default or use a placeholder
    if (req.file) {
      data.profilePic = `https://ui-avatars.com/api/?name=${data.firstName}+${data.lastName}`;
    }
    const member = new Member(data);
    await member.save();
    res.status(201).json(member);
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
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

router.get('/profile', protect, async (req, res) => {
  const member = await Member.findById(req.user.id);
  res.json(member);
});

// PATCH: Status Toggle & Email
router.patch('/status/:id', async (req, res) => {
  try {
    const { action } = req.query;
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: "Member not found" });

    if (action === 'approve' && !member.isApproved) {
      member.isApproved = true;
      const tempPassword = Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(tempPassword, salt);

      const mailOptions = {
        from: `"IIT KGP Mumbai Alumni" <${process.env.EMAIL_USER}>`,
        to: member.email,
        subject: 'Membership Approved',
        html: `<p>Welcome! Your temp password is: <b>${tempPassword}</b></p>`
      };
      transporter.sendMail(mailOptions);
    } 
    else if (action === 'revoke') member.isApproved = false;

    await member.save();
    res.json(member);
  } catch (err) { 
    res.status(400).json({ message: err.message }); 
  }
});

router.delete('/:id', async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;

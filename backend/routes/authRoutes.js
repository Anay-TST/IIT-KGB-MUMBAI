const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Member = require('../models/Member');
const { protect } = require('../middleware/authMiddleware');

// Setup Email Transporter (Reusing your existing setup)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});

// Generate JWT Token Function
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. POST: Member Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if they are actually approved by admin
    if (!member.isApproved) {
      return res.status(401).json({ message: 'Your account is pending admin approval.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      profilePic: member.profilePic,
      token: generateToken(member._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. GET: Current Logged In Member Data (Protected)
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

// 3. POST: Forgot Password (Generates email link)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const member = await Member.findOne({ email });

    if (!member) return res.status(404).json({ message: 'No account with that email found' });

    // Generate random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hash token and save to database with 1-hour expiration
    member.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    member.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await member.save();

    // Create reset URL targeting your Vite frontend
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: `"IIT KGB Mumbai Alumni" <${process.env.EMAIL_USER}>`,
      to: member.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>You requested a password reset. Please click the link below to set a new password:</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #001f3f; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email. The link will expire in 1 hour.</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        member.resetPasswordToken = undefined;
        member.resetPasswordExpires = undefined;
        member.save();
        return res.status(500).json({ message: 'Email could not be sent' });
      }
      res.json({ message: 'Password reset link sent to your email.' });
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. PUT: Reset Password (Using the link from the email)
router.put('/reset-password/:token', async (req, res) => {
  try {
    // Get hashed token to compare with database
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const member = await Member.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() } // Ensure it hasn't expired
    });

    if (!member) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    member.password = await bcrypt.hash(req.body.password, salt);

    // Clear reset token fields
    member.resetPasswordToken = undefined;
    member.resetPasswordExpires = undefined;
    await member.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. PUT: Change Password (While logged into dashboard)
router.put('/change-password', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.user._id);
    
    // Check old password
    const isMatch = await bcrypt.compare(req.body.oldPassword, member.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    member.password = await bcrypt.hash(req.body.newPassword, salt);
    await member.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
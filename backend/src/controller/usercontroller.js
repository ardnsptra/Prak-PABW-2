require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_APP_PASSWORD
  },
  secure: false,
  tls : { 
    rejectUnauthorized : false
  }
});

const sendVerificationEmail = async (user, token) => {
  const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Email Verification',
    html: `<p>Please click the link below to verify your email:</p><a href="${verificationUrl}">${verificationUrl}</a>`
  });
};

const sendResetPasswordEmail = async (user, token) => {
  const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: user.email,
    subject: 'Reset Password',
    html: `<p>Please click the link below to reset your password:</p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a>`
  });
};


exports.register = async (req, res) => {
  try {
    const { username, email, password, fullName, dateOfBirth } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImagePath = req.file ? req.file.path : null;

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      dateOfBirth,
      profileImage: profileImagePath,
      isVerified: false
    });

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    await sendVerificationEmail(user, token);

    res.status(201).json({ message: "User registered successfully, please verify your email", userId: user.id, profileImage: profileImagePath });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: "Validation error", message: "Username or email already exists" });
    }
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      return res.status(400).json({ error: "Validation error", messages });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: "Email not verified" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId, {
            attributes: ['username', 'email', 'fullName', 'dateOfBirth', 'profileImage']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    await sendResetPasswordEmail(user, token);

    res.json({ message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findByPk(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
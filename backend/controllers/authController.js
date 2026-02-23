const jwt    = require('jsonwebtoken');
const Farmer = require('../models/Farmer');

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// @desc  Register
// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    const exists = await Farmer.findOne({ $or: [{ phone }, { email }] });
    if (exists)
      return res.status(400).json({ success: false, message: 'User already registered with this phone or email' });

    const farmer = await Farmer.create({ name, phone, email, password, role });
    const token  = signToken(farmer._id, farmer.role);

    res.status(201).json({ success: true, token, data: farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Login
// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password)
      return res.status(400).json({ success: false, message: 'Phone and password are required' });

    const farmer = await Farmer.findOne({ phone }).select('+password');
    if (!farmer || !(await farmer.matchPassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = signToken(farmer._id, farmer.role);
    res.json({ success: true, token, data: farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get current user
// @route GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user.id);
    res.json({ success: true, data: farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Change password
// @route PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const farmer = await Farmer.findById(req.user.id).select('+password');

    if (!(await farmer.matchPassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password incorrect' });

    farmer.password = newPassword;
    await farmer.save();
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
  name:       { type: String, required: true, trim: true },
  phone:      { type: String, required: true, unique: true },
  email:      { type: String, unique: true, sparse: true, lowercase: true },
  password:   { type: String, required: true, select: false },
  role:       { type: String, enum: ['farmer', 'buyer', 'admin'], default: 'farmer' },
  aadhaar:    { type: String, unique: true, sparse: true },
  location: {
    state:    { type: String },
    district: { type: String },
    village:  { type: String },
    pincode:  { type: String },
  },
  landSize:    { type: Number },
  waterSource: { type: String },
  primaryCrop: { type: String },
  bankDetails: {
    accountNo: String,
    ifsc:      String,
    bankName:  String,
  },
  kccLimit:   { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
  rating:     { type: Number, default: 0, min: 0, max: 5 },
  profilePic: { type: String },
}, { timestamps: true });

// Hash password before save
farmerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
farmerSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('Farmer', farmerSchema);

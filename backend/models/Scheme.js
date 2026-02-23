const mongoose = require('mongoose');

// ── Scheme ────────────────────────────────────────────────
const schemeSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: String,
  amount:      String,
  deadline:    Date,
  eligibility: {
    maxLandAcres: Number,
    maxIncome:    Number,
    categories:   [String],
    states:       [String],
  },
  isActive:    { type: Boolean, default: true },
  applications:[{
    farmerId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer' },
    status:    { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    appliedAt: Date,
    remarks:   String,
  }],
}, { timestamps: true });

// ── Alert ─────────────────────────────────────────────────
const alertSchema = new mongoose.Schema({
  type:     { type: String, enum: ['weather', 'pest', 'market', 'system'], required: true },
  severity: { type: String, enum: ['info', 'warning', 'danger', 'success'] },
  title:    String,
  message:  String,
  region:   String,
  cropType: String,
  expiresAt:Date,
}, { timestamps: true });

module.exports = {
  Scheme: mongoose.model('Scheme', schemeSchema),
  Alert:  mongoose.model('Alert', alertSchema),
};

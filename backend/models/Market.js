const mongoose = require('mongoose');

// ── Listing (Marketplace) ─────────────────────────────────
const listingSchema = new mongoose.Schema({
  farmerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropType:     { type: String, required: true },
  quantity:     { type: Number, required: true },
  pricePerQtl:  { type: Number, required: true },
  grade:        { type: String, enum: ['A', 'B', 'C'], default: 'A' },
  description:  String,
  availableFrom:{ type: Date },
  isActive:     { type: Boolean, default: true },
  views:        { type: Number, default: 0 },
}, { timestamps: true });

// ── Order ─────────────────────────────────────────────────
const orderSchema = new mongoose.Schema({
  listingId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  buyerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  farmerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  cropType:    String,
  quantity:    Number,
  totalAmount: Number,
  status:      {
    type: String,
    enum: ['Pending', 'Confirmed', 'In Transit', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  payment: {
    method:  String,
    status:  { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
    paidAt:  Date,
  },
  delivery: {
    address:    String,
    eta:        Date,
    trackingId: String,
  },
}, { timestamps: true });

// ── MarketPrice ───────────────────────────────────────────
const priceSchema = new mongoose.Schema({
  cropType:   { type: String, required: true },
  market:     String,
  state:      String,
  minPrice:   Number,
  maxPrice:   Number,
  modalPrice: Number,
  date:       { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = {
  Listing:     mongoose.model('Listing', listingSchema),
  Order:       mongoose.model('Order', orderSchema),
  MarketPrice: mongoose.model('MarketPrice', priceSchema),
};

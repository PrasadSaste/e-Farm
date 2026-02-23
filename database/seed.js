// database/seed.js — Run: node database/seed.js
require('dotenv').config({ path: '../backend/.env' });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// Load models
const Farmer      = require('../backend/models/Farmer');
const Crop        = require('../backend/models/Crop');
const { Listing, Order, MarketPrice } = require('../backend/models/Market');
const { Scheme, Alert }               = require('../backend/models/Scheme');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // Clear existing data
  await Promise.all([
    Farmer.deleteMany(), Crop.deleteMany(),
    Listing.deleteMany(), Order.deleteMany(),
    MarketPrice.deleteMany(), Scheme.deleteMany(), Alert.deleteMany(),
  ]);
  console.log('🗑  Cleared existing data');

  // ── Farmers ──────────────────────────────────────────────
  const password = await bcrypt.hash('password123', 12);

  const farmers = await Farmer.insertMany([
    {
      name: 'Rajesh Patel', phone: '9876543210', email: 'rajesh@efarm.com',
      password, role: 'farmer', isVerified: true,
      location: { state: 'Maharashtra', district: 'Pune', village: 'Khed', pincode: '410501' },
      landSize: 20, waterSource: 'Drip + Borewell', primaryCrop: 'Wheat',
      bankDetails: { accountNo: '12345678901', ifsc: 'SBIN0001234', bankName: 'SBI' },
      kccLimit: 300000, rating: 4.8,
    },
    {
      name: 'Sukhdev Singh', phone: '9876543211', email: 'sukhdev@efarm.com',
      password, role: 'farmer', isVerified: true,
      location: { state: 'Punjab', district: 'Amritsar', village: 'Tarn Taran', pincode: '143401' },
      landSize: 35, waterSource: 'Canal irrigation', primaryCrop: 'Rice',
      kccLimit: 500000, rating: 4.6,
    },
    {
      name: 'Anita Sharma', phone: '9876543212', email: 'anita@efarm.com',
      password, role: 'farmer', isVerified: true,
      location: { state: 'Maharashtra', district: 'Nashik', village: 'Sinnar', pincode: '422103' },
      landSize: 8, waterSource: 'Drip irrigation', primaryCrop: 'Tomato',
      rating: 4.5,
    },
    {
      name: 'Priya Desai', phone: '9876543213', email: 'priya@efarm.com',
      password, role: 'farmer', isVerified: false,
      location: { state: 'Gujarat', district: 'Surat', village: 'Bardoli', pincode: '394601' },
      landSize: 12, primaryCrop: 'Soybean', rating: 4.2,
    },
    {
      name: 'Admin User', phone: '9000000000', email: 'admin@efarm.com',
      password, role: 'admin', isVerified: true,
      location: { state: 'Maharashtra', district: 'Pune' },
    },
    {
      name: 'Buyer Corp Ltd', phone: '9111111111', email: 'buyer@efarm.com',
      password, role: 'buyer', isVerified: true,
      location: { state: 'Maharashtra', district: 'Mumbai' },
    },
  ]);
  console.log(`✅ Seeded ${farmers.length} farmers`);

  const [rajesh, sukhdev, anita, priya] = farmers;

  // ── Crops ─────────────────────────────────────────────────
  const crops = await Crop.insertMany([
    {
      farmerId: rajesh._id, cropType: 'Wheat', area: 12, stage: 'Growing', progress: 68,
      sowDate: new Date('2025-01-15'), harvestDate: new Date('2025-04-20'),
      yieldEstimate: 48,
      fertilizerSchedule: [
        { name: 'Urea', qty: '50 kg/acre', date: new Date('2025-02-28'), applied: false },
        { name: 'DAP',  qty: '40 kg/acre', date: new Date('2025-01-20'), applied: true  },
      ],
    },
    {
      farmerId: rajesh._id, cropType: 'Sugarcane', area: 8, stage: 'Growing', progress: 35,
      sowDate: new Date('2024-12-10'), harvestDate: new Date('2025-11-30'),
      yieldEstimate: 320,
    },
    {
      farmerId: anita._id, cropType: 'Tomato', area: 3, stage: 'Sowing', progress: 12,
      sowDate: new Date('2025-02-01'), harvestDate: new Date('2025-05-05'),
      yieldEstimate: 90,
    },
    {
      farmerId: sukhdev._id, cropType: 'Rice', area: 15, stage: 'Planning', progress: 0,
    },
    {
      farmerId: rajesh._id, cropType: 'Cotton', area: 6, stage: 'Harvest', progress: 95,
      sowDate: new Date('2024-03-05'), harvestDate: new Date('2025-09-15'),
      actualYield: 30,
    },
    {
      farmerId: priya._id, cropType: 'Soybean', area: 10, stage: 'Growing', progress: 55,
      sowDate: new Date('2025-01-20'), harvestDate: new Date('2025-05-30'),
      yieldEstimate: 80,
    },
  ]);
  console.log(`✅ Seeded ${crops.length} crops`);

  // ── Market Listings ───────────────────────────────────────
  const listings = await Listing.insertMany([
    { farmerId: rajesh._id,  cropType: 'Wheat',          quantity: 200, pricePerQtl: 2100, grade: 'A', isActive: true },
    { farmerId: anita._id,   cropType: 'Tomato',         quantity: 50,  pricePerQtl: 1800, grade: 'A', isActive: true },
    { farmerId: sukhdev._id, cropType: 'Rice (Basmati)', quantity: 150, pricePerQtl: 4500, grade: 'A', isActive: true },
    { farmerId: priya._id,   cropType: 'Soybean',        quantity: 80,  pricePerQtl: 3800, grade: 'B', isActive: true },
    { farmerId: rajesh._id,  cropType: 'Cotton',         quantity: 30,  pricePerQtl: 6500, grade: 'A', isActive: true },
  ]);
  console.log(`✅ Seeded ${listings.length} listings`);

  // ── Market Prices ─────────────────────────────────────────
  const cropPrices = [
    { cropType: 'Wheat',   modalPrice: 2100, minPrice: 1950, maxPrice: 2250, market: 'Pune Mandi',   state: 'Maharashtra' },
    { cropType: 'Rice',    modalPrice: 4500, minPrice: 4200, maxPrice: 4800, market: 'Amritsar Mandi',state: 'Punjab' },
    { cropType: 'Tomato',  modalPrice: 1800, minPrice: 1500, maxPrice: 2200, market: 'Nashik Mandi', state: 'Maharashtra' },
    { cropType: 'Soybean', modalPrice: 3800, minPrice: 3500, maxPrice: 4100, market: 'Indore Mandi', state: 'MP' },
    { cropType: 'Cotton',  modalPrice: 6500, minPrice: 6200, maxPrice: 6800, market: 'Surat Mandi',  state: 'Gujarat' },
    { cropType: 'Maize',   modalPrice: 1650, minPrice: 1500, maxPrice: 1800, market: 'Pune Mandi',   state: 'Maharashtra' },
  ];
  await MarketPrice.insertMany(cropPrices);
  console.log(`✅ Seeded ${cropPrices.length} market prices`);

  // ── Schemes ───────────────────────────────────────────────
  await Scheme.insertMany([
    {
      name: 'PM-KISAN Samman Nidhi', amount: '₹6,000/year',
      description: 'Income support of ₹6,000 per year for small & marginal farmers.',
      deadline: new Date('2025-03-31'),
      eligibility: { maxLandAcres: 12, maxIncome: 200000, categories: ['General', 'OBC', 'SC/ST'] },
    },
    {
      name: 'PM Krishi Sinchai Yojana', amount: 'Up to 90% subsidy',
      description: 'Drip & sprinkler irrigation subsidy to improve water use efficiency.',
      deadline: new Date('2025-04-15'),
      eligibility: { maxLandAcres: 50, categories: ['General', 'OBC', 'SC/ST'] },
    },
    {
      name: 'Soil Health Card Scheme', amount: 'Free service',
      description: 'Free soil testing and nutrient management recommendations.',
      eligibility: { categories: ['General', 'OBC', 'SC/ST'] },
    },
    {
      name: 'Kisan Credit Card (KCC)', amount: 'Up to ₹3 lakh',
      description: 'Low-interest short-term credit for crop production needs.',
      deadline: new Date('2025-05-01'),
      eligibility: { maxLandAcres: 50, categories: ['General', 'OBC', 'SC/ST'] },
    },
    {
      name: 'Pradhan Mantri Fasal Bima Yojana', amount: 'Crop loss insurance',
      description: 'Crop insurance scheme to protect farmers against natural calamities.',
      eligibility: { categories: ['General', 'OBC', 'SC/ST'] },
    },
  ]);
  console.log('✅ Seeded 5 schemes');

  // ── Alerts ────────────────────────────────────────────────
  await Alert.insertMany([
    { type: 'weather', severity: 'warning', title: 'Heavy Rainfall Expected', message: 'Heavy rain forecast for Feb 26–27. Cover stored harvests and delay fertilizer application.', region: 'Maharashtra' },
    { type: 'pest',    severity: 'danger',  title: 'Aphid Alert — Wheat Fields', message: 'High aphid infestation risk in wheat fields this week. Apply Imidacloprid as preventive.', cropType: 'Wheat', region: 'Punjab' },
    { type: 'market',  severity: 'info',    title: 'Tomato Price Rise', message: 'Tomato prices have risen 12% in Nashik mandi due to supply shortage.', cropType: 'Tomato' },
    { type: 'system',  severity: 'success', title: 'New Scheme Available', message: 'PM-KISAN 16th installment released. Check your bank account.' },
  ]);
  console.log('✅ Seeded 4 alerts');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\nTest Credentials:');
  console.log('  Farmer: phone=9876543210 password=password123');
  console.log('  Admin:  phone=9000000000 password=password123');
  console.log('  Buyer:  phone=9111111111 password=password123');

  mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });

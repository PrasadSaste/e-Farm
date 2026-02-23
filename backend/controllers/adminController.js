const { Scheme, Alert } = require('../models/Scheme');
const Farmer            = require('../models/Farmer');
const Crop              = require('../models/Crop');
const { Order, Listing, MarketPrice } = require('../models/Market');

// ═══════════════════════════════════════════════════════════
//  SCHEME CONTROLLER
// ═══════════════════════════════════════════════════════════

// @route GET /api/schemes
exports.getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find({ isActive: true });
    res.json({ success: true, data: schemes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/schemes/:id/check
exports.checkEligibility = async (req, res) => {
  try {
    const { landSize, income, category } = req.body;
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });

    const el = scheme.eligibility;
    const eligible =
      (!el.maxLandAcres || landSize <= el.maxLandAcres) &&
      (!el.maxIncome    || income  <= el.maxIncome) &&
      (!el.categories?.length || el.categories.includes(category));

    res.json({ success: true, eligible, message: eligible ? '✅ You are eligible!' : '❌ Not eligible for this scheme' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/schemes/:id/apply
exports.applyScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ success: false, message: 'Scheme not found' });

    const already = scheme.applications.some(a => a.farmerId.toString() === req.user.id.toString());
    if (already) return res.status(400).json({ success: false, message: 'Already applied for this scheme' });

    scheme.applications.push({ farmerId: req.user.id, appliedAt: new Date() });
    await scheme.save();
    res.json({ success: true, message: 'Application submitted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/schemes/my-applications
exports.myApplications = async (req, res) => {
  try {
    const schemes = await Scheme.find({ 'applications.farmerId': req.user.id }, 'name amount applications');
    const result = schemes.map(s => {
      const app = s.applications.find(a => a.farmerId.toString() === req.user.id.toString());
      return { schemeName: s.name, amount: s.amount, ...app?.toObject() };
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ═══════════════════════════════════════════════════════════
//  ADMIN CONTROLLER
// ═══════════════════════════════════════════════════════════

// @route GET /api/admin/dashboard
exports.dashboard = async (req, res) => {
  try {
    const [totalFarmers, totalBuyers, totalOrders, activeListings, revenueAgg] = await Promise.all([
      Farmer.countDocuments({ role: 'farmer' }),
      Farmer.countDocuments({ role: 'buyer' }),
      Order.countDocuments(),
      Listing.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { 'payment.status': 'Paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);
    res.json({
      success: true,
      data: { totalFarmers, totalBuyers, totalOrders, activeListings, revenue: revenueAgg[0]?.total || 0 },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/admin/reports/sales
exports.salesReport = async (req, res) => {
  try {
    const report = await Order.aggregate([
      { $match: { 'payment.status': 'Paid' } },
      { $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        total: { $sum: '$totalAmount' },
        count: { $sum: 1 },
      }},
      { $sort: { _id: 1 } },
    ]);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/admin/reports/crops
exports.cropReport = async (req, res) => {
  try {
    const report = await Crop.aggregate([
      { $group: { _id: '$cropType', count: { $sum: 1 }, totalArea: { $sum: '$area' } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data: report });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/farmers/:id/verify
exports.verifyFarmer = async (req, res) => {
  try {
    await Farmer.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.json({ success: true, message: 'Farmer verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/admin/alerts
exports.createAlert = async (req, res) => {
  try {
    const alert = await Alert.create(req.body);
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/admin/schemes
exports.createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ success: true, data: scheme });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/schemes/:id/applications/:appId
exports.updateApplication = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    const app = scheme.applications.id(req.params.appId);
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    app.status  = req.body.status;
    app.remarks = req.body.remarks;
    await scheme.save();
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const Farmer = require('../models/Farmer');

// @desc  Get all farmers
// @route GET /api/farmers
exports.getAll = async (req, res) => {
  try {
    const { state, district, role, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (state)    filter['location.state']    = state;
    if (district) filter['location.district'] = district;
    if (role)     filter.role = role;

    const farmers = await Farmer.find(filter)
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort('-createdAt');
    const total = await Farmer.countDocuments(filter);

    res.json({ success: true, total, page: +page, data: farmers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get one farmer
// @route GET /api/farmers/:id
exports.getOne = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update farmer profile
// @route PUT /api/farmers/:id
exports.update = async (req, res) => {
  try {
    // prevent password/role update through this route
    delete req.body.password;
    delete req.body.role;

    const farmer = await Farmer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, data: farmer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete farmer (admin)
// @route DELETE /api/farmers/:id
exports.remove = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!farmer) return res.status(404).json({ success: false, message: 'Farmer not found' });
    res.json({ success: true, message: 'Farmer deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Verify farmer (admin)
// @route PUT /api/farmers/:id/verify
exports.verify = async (req, res) => {
  try {
    await Farmer.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.json({ success: true, message: 'Farmer verified' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

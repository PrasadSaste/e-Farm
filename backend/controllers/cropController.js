const Crop = require('../models/Crop');

const ADVISORIES = {
  Wheat:     { disease: 'Aphid Infestation', risk: 'High',   advice: 'Apply Imidacloprid 17.8% SL at 0.3ml/L water' },
  Rice:      { disease: 'Blast Disease',     risk: 'Medium', advice: 'Apply Tricyclazole 75% WP 0.6g/L water' },
  Tomato:    { disease: 'Early Blight',      risk: 'Medium', advice: 'Spray Mancozeb 75% WP 2g/L as preventive' },
  Sugarcane: { disease: 'Red Rot',           risk: 'Low',    advice: 'No action needed. Monitor weekly.' },
  Cotton:    { disease: 'Bollworm',          risk: 'High',   advice: 'Spray Spinosad 45 SC at 0.3ml/L' },
  Soybean:   { disease: 'Yellow Mosaic',     risk: 'Medium', advice: 'Remove infected plants, control whitefly vectors' },
  Maize:     { disease: 'Fall Armyworm',     risk: 'High',   advice: 'Apply Spinetoram 11.7% SC 0.5ml/L' },
};

// @desc  Get all crops for logged-in farmer
// @route GET /api/crops
exports.getAll = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.user.id }).sort('-createdAt');
    res.json({ success: true, data: crops });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Add new crop
// @route POST /api/crops
exports.create = async (req, res) => {
  try {
    const crop = await Crop.create({ ...req.body, farmerId: req.user.id });
    res.status(201).json({ success: true, data: crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Get single crop
// @route GET /api/crops/:id
exports.getOne = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, data: crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Update crop (stage, progress, schedule)
// @route PUT /api/crops/:id
exports.update = async (req, res) => {
  try {
    const crop = await Crop.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    res.json({ success: true, data: crop });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Delete crop
// @route DELETE /api/crops/:id
exports.remove = async (req, res) => {
  try {
    await Crop.findOneAndDelete({ _id: req.params.id, farmerId: req.user.id });
    res.json({ success: true, message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  AI disease advisory
// @route GET /api/crops/:id/advisory
exports.getAdvisory = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
    const advisory = ADVISORIES[crop.cropType] || { disease: 'None', risk: 'Low', advice: 'Field looks healthy.' };
    res.json({ success: true, data: advisory });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const { Listing, Order, MarketPrice } = require('../models/Market');

// ── LISTINGS ──────────────────────────────────────────────

// @route GET /api/market/listings
exports.getListings = async (req, res) => {
  try {
    const { cropType, minPrice, maxPrice, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (cropType) filter.cropType = new RegExp(cropType, 'i');
    if (minPrice || maxPrice) {
      filter.pricePerQtl = {};
      if (minPrice) filter.pricePerQtl.$gte = +minPrice;
      if (maxPrice) filter.pricePerQtl.$lte = +maxPrice;
    }
    const listings = await Listing.find(filter)
      .populate('farmerId', 'name location rating phone')
      .skip((page - 1) * limit)
      .limit(+limit)
      .sort('-createdAt');
    const total = await Listing.countDocuments(filter);
    res.json({ success: true, total, data: listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/market/listings
exports.createListing = async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, farmerId: req.user.id });
    res.status(201).json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/market/listings/:id
exports.updateListing = async (req, res) => {
  try {
    const listing = await Listing.findOneAndUpdate(
      { _id: req.params.id, farmerId: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/market/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    await Listing.findOneAndDelete({ _id: req.params.id, farmerId: req.user.id });
    res.json({ success: true, message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── ORDERS ────────────────────────────────────────────────

// @route POST /api/market/orders
exports.createOrder = async (req, res) => {
  try {
    const { listingId, quantity, deliveryAddress } = req.body;
    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive)
      return res.status(404).json({ success: false, message: 'Listing not found or inactive' });
    if (quantity > listing.quantity)
      return res.status(400).json({ success: false, message: 'Requested quantity exceeds available stock' });
    if (listing.farmerId.toString() === req.user.id.toString())
      return res.status(400).json({ success: false, message: 'Cannot buy your own listing' });

    const totalAmount = quantity * listing.pricePerQtl;
    const order = await Order.create({
      listingId,
      buyerId:  req.user.id,
      farmerId: listing.farmerId,
      cropType: listing.cropType,
      quantity,
      totalAmount,
      delivery: { address: deliveryAddress },
    });

    listing.quantity -= quantity;
    if (listing.quantity === 0) listing.isActive = false;
    await listing.save();

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/market/orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyerId: req.user.id }, { farmerId: req.user.id }]
    })
      .populate('buyerId',  'name phone')
      .populate('farmerId', 'name phone')
      .sort('-createdAt');
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/market/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/market/prices
exports.getPrices = async (req, res) => {
  try {
    // Return latest price per crop type
    const prices = await MarketPrice.aggregate([
      { $sort: { date: -1 } },
      { $group: { _id: '$cropType', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } },
    ]);
    res.json({ success: true, data: prices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

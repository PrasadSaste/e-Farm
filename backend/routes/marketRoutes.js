const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getListings, createListing, updateListing, deleteListing,
  createOrder, getOrders, updateOrderStatus, getPrices,
} = require('../controllers/marketController');

router.get('/listings',              protect, getListings);
router.post('/listings',             protect, createListing);
router.put('/listings/:id',          protect, updateListing);
router.delete('/listings/:id',       protect, deleteListing);
router.post('/orders',               protect, createOrder);
router.get('/orders',                protect, getOrders);
router.put('/orders/:id/status',     protect, updateOrderStatus);
router.get('/prices',                protect, getPrices);

module.exports = router;

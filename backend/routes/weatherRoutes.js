// routes/weatherRoutes.js
const express = require('express');
const router  = express.Router();
const { protect }                          = require('../middleware/auth');
const { getForecast, getAlerts }           = require('../controllers/weatherController');

router.get('/',        protect, getForecast);
router.get('/alerts',  protect, getAlerts);

module.exports = router;
